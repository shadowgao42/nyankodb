/* Numeric port of battle_simulator_v2/src/Sprites.cs ModelRenderer.
 * The existing a records remain the source: imgcut, mamodel, then maanim strings.
 * Canvas raster sampling can differ from the simulator's GDI+/OpenGL backends.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.NyankoAnimationCore = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const f32 = Math.fround;
  const i32 = value => value | 0;
  const trunc = value => Math.trunc(value) || 0;
  const div32 = (value, divisor) => i32(trunc(value / divisor));
  const add = (a, b) => f32(f32(a) + f32(b));
  const mul = (a, b) => f32(f32(a) * f32(b));
  const long = value => BigInt.asIntN(64, value);
  const toInt = value => Number(BigInt.asIntN(32, value));

  function lines(raw, expected) {
    if (typeof raw !== 'string') throw new TypeError('Animation record must contain strings.');
    const rows = raw.replace(/^\uFEFF/, '').split(/\r?\n/);
    if (!expected.includes(rows[0].trim())) throw new Error('Invalid animation record header.');
    return rows;
  }
  function numberRow(raw, count) {
    if (typeof raw !== 'string') throw new Error('Truncated animation record.');
    const cells = raw.split(',');
    const values = cells.slice(0, count).map(value => {
      if (!/^[+-]?\d+$/.test(value.trim())) throw new Error('Invalid animation integer.');
      const numeric = Number(value.trim());
      if (!Number.isSafeInteger(numeric) || numeric < -2147483648 || numeric > 2147483647) {
        throw new Error('Animation integer is outside signed 32-bit range.');
      }
      return numeric;
    });
    if (values.length !== count) throw new Error('Truncated animation number row.');
    return values;
  }
  function countRow(raw) {
    const count = numberRow(raw, 1)[0];
    if (count < 0) throw new Error('Negative animation record count.');
    return count;
  }

  function parseAnimation(raw) {
    const rows = lines(raw, ['[modelanim:animation]', '[modelanim:animation2]']);
    const version = numberRow(rows[1], 1)[0];
    const count = countRow(rows[2]);
    let cursor = 3;
    let lastFrame = 0;
    let infinite = false;
    const tracks = [];
    for (let index = 0; index < count; index++) {
      const [part, property, repeat] = numberRow(rows[cursor++], 3);
      const keyCount = countRow(rows[cursor++]);
      const keys = [];
      for (let key = 0; key < keyCount; key++) {
        const values = numberRow(rows[cursor++], version >= 1 ? 4 : 3);
        if (values.length === 3) values.push(0);
        keys.push(values);
      }
      // Source order is significant; never sort or deduplicate tracks or keys.
      if (keys.length) lastFrame = Math.max(lastFrame, keys[keys.length - 1][0]);
      if (repeat === -1) infinite = true;
      tracks.push({ part, property, repeat, keys });
    }
    return { tracks, lastFrame, infinite };
  }

  function parseBundle(record) {
    if (!Array.isArray(record) || record.length < 3 || !record.every(value => typeof value === 'string')) {
      throw new TypeError('Animation bundle must be an array of source record strings.');
    }
    const cutRows = lines(record[0], ['[imgcut]']);
    const cutCount = countRow(cutRows[3]);
    const cuts = [];
    for (let index = 0; index < cutCount; index++) cuts.push(numberRow(cutRows[index + 4], 4));
    const modelRows = lines(record[1], ['[modelanim:model]', '[modelanim:model2]']);
    const version = numberRow(modelRows[1], 1)[0];
    const partCount = countRow(modelRows[2]);
    let cursor = 3;
    const parts = [];
    const partNames = [];
    for (let index = 0; index < partCount; index++) {
      partNames.push(modelRows[cursor].split(',').slice(version >= 2 ? 13 : 12).join(','));
      const row = numberRow(modelRows[cursor++], version >= 2 ? 13 : 12);
      if (row.length === 12) row.push(0);
      parts.push(row);
    }
    const [scale, angle, opacity] = version >= 1 ? numberRow(modelRows[cursor++], 3) : [1000, 3600, 1000];
    if (scale <= 0 || angle <= 0 || opacity <= 0) throw new Error('Invalid model scalar.');
    const extraRecords = [];
    if (version >= 3) {
      const extraCount = countRow(modelRows[cursor++]);
      for (let index = 0; index < extraCount; index++) extraRecords.push(numberRow(modelRows[cursor++], 6));
    }
    return { parts, partNames, cuts, scale, angle, opacity, anchor: extraRecords[0] || [], extraRecords,
      animations: record.slice(2).map(parseAnimation) };
  }

  function trackValue(track, sourceFrame) {
    const keys = track.keys;
    if (!keys.length || sourceFrame < keys[0][0]) return null;
    const first = keys[0][0];
    const last = keys[keys.length - 1][0];
    if (first === last) return keys[0][1];
    let frame = sourceFrame;
    if (frame >= last) {
      const elapsed = i32(frame - first);
      const span = i32(last - first);
      frame = track.repeat === -1 || (track.repeat >= 1 && div32(elapsed, span) < track.repeat)
        ? i32(first + elapsed % span) : last;
    }
    if (frame >= last) return keys[keys.length - 1][1];
    for (let key = 0; key < keys.length - 1; key++) {
      const left = keys[key];
      const right = keys[key + 1];
      if (frame < left[0] || frame >= right[0]) continue;
      const delta = i32(right[1] - left[1]);
      const elapsed = i32(frame - left[0]);
      const span = i32(right[0] - left[0]);
      if (left[2] === 1) return left[1];
      if (left[2] === 0) return i32(left[1] + div32(Math.imul(delta, elapsed), span));
      if (left[2] === 2) {
        const u = elapsed / span;
        const power = left[3];
        const factor = power >= 0
          ? 1 - Math.sqrt(1 - Math.pow(u, power))
          : Math.sqrt(1 - Math.pow(1 - u, -power));
        return i32(trunc(left[1] + delta * factor));
      }
      if (left[2] === 3) {
        let start = key;
        let end = key + 1;
        while (start > 0 && keys[start - 1][2] === 3) start--;
        while (end < keys.length - 1 && keys[end][2] === 3) end++;
        let total = 0n;
        for (let i = start; i <= end; i++) {
          let term = long(BigInt(keys[i][1]) << 12n);
          for (let j = start; j <= end; j++) {
            if (j === i) continue;
            const numerator = long(term * (BigInt(frame) - BigInt(keys[j][0])));
            const denominator = BigInt(keys[i][0]) - BigInt(keys[j][0]);
            term = denominator === 0n ? 0n : long(numerator / denominator);
          }
          total = long(total + term);
        }
        return toInt(total / 4096n);
      }
      return 0;
    }
    return 0;
  }

  function inheritedProduct(base, delta, inherited, divisor) {
    return toInt(long(BigInt(base) * BigInt(delta) * BigInt(inherited)) / BigInt(divisor) / BigInt(divisor));
  }
  function point(pose, x, y) {
    return [trunc(add(add(mul(pose.a, x), mul(pose.c, y)), pose.tx)),
      trunc(add(add(mul(pose.b, x), mul(pose.d, y)), pose.ty))];
  }

  function evaluate(bundle, animation, frame, options) {
    if (!Number.isInteger(frame) || frame < -2147483648 || frame > 2147483647) {
      throw new TypeError('Animation frame must be a signed 32-bit integer.');
    }
    const clip = typeof animation === 'number' ? bundle.animations[animation] : animation;
    if (!clip || !Array.isArray(clip.tracks)) throw new Error('Missing animation.');
    const mirror = Boolean(options && options.mirror);
    const rootScale = options && options.rootScale > 0 ? i32(options.rootScale) : 0;
    const count = bundle.parts.length;
    const deltas = Array.from({ length: count }, () => {
      const row = Array(15).fill(0);
      row[8] = row[9] = row[10] = bundle.scale;
      row[12] = bundle.opacity;
      return row;
    });
    for (const track of clip.tracks) {
      if (track.part < 0 || track.part >= count || track.property < 0 || track.property > 14) continue;
      const value = trackValue(track, frame);
      if (value === null) continue;
      if (track.property < 4) deltas[track.part][track.property] = i32(value - bundle.parts[track.part][track.property]);
      else if (track.property === 8) deltas[track.part][9] = deltas[track.part][10] = value;
      else deltas[track.part][track.property] = value;
    }
    const poses = bundle.parts.map((row, index) => {
      const delta = deltas[index];
      return { parent: i32(row[0] + delta[0]), image: i32(row[1] + delta[1]), cut: i32(row[2] + delta[2]),
        z: i32(row[3] + delta[3]), x: i32(row[4] + delta[4]), y: i32(row[5] + delta[5]),
        pivotX: i32(row[6] + delta[6]), pivotY: i32(row[7] + delta[7]), rotation: i32(row[10] + delta[11]),
        blend: row[12], flipX: delta[13] !== 0, flipY: delta[14] !== 0,
        a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0, done: 0 };
    });
    function transform(index) {
      const pose = poses[index];
      if (pose.done === 2) return;
      if (pose.done === 1) throw new Error('Cyclic model hierarchy.');
      pose.done = 1;
      const row = bundle.parts[index];
      const delta = deltas[index];
      let baseSX = row[8];
      let baseSY = row[9];
      if (pose.parent === -1 && rootScale > 0) baseSX = baseSY = rootScale;
      if (pose.parent === -1) {
        pose.sx = div32(Math.imul(baseSX, delta[9]), bundle.scale);
        pose.sy = div32(Math.imul(baseSY, delta[10]), bundle.scale);
        if (mirror) pose.sx = i32(-pose.sx);
        pose.alpha = div32(Math.imul(row[11], delta[12]), bundle.opacity);
        // As in the simulator, root base X/Y are not the translation origin.
        pose.tx = f32(delta[4]);
        pose.ty = f32(delta[5]);
        pose.cumFlipX = pose.flipX;
        pose.cumFlipY = pose.flipY;
      } else {
        if (pose.parent < 0 || pose.parent >= count) throw new Error('Invalid model parent.');
        transform(pose.parent);
        const parent = poses[pose.parent];
        pose.sx = inheritedProduct(baseSX, delta[9], parent.sx, bundle.scale);
        pose.sy = inheritedProduct(baseSY, delta[10], parent.sy, bundle.scale);
        pose.alpha = inheritedProduct(row[11], delta[12], parent.alpha, bundle.opacity);
        pose.a = parent.a; pose.b = parent.b; pose.c = parent.c; pose.d = parent.d;
        const tx = div32(Math.imul(parent.sx, pose.x), bundle.scale);
        const ty = div32(Math.imul(parent.sy, pose.y), bundle.scale);
        pose.tx = add(add(parent.tx, mul(parent.a, tx)), mul(parent.c, ty));
        pose.ty = add(add(parent.ty, mul(parent.b, tx)), mul(parent.d, ty));
        pose.cumFlipX = pose.flipX !== parent.cumFlipX;
        pose.cumFlipY = pose.flipY !== parent.cumFlipY;
      }
      if (pose.flipX) pose.sx = i32(-pose.sx);
      if (pose.flipY) pose.sy = i32(-pose.sy);
      let degrees = f32(mul(pose.rotation, 360) / f32(bundle.angle));
      if (mirror) degrees = f32(-degrees);
      if (pose.cumFlipX !== pose.cumFlipY) degrees = f32(-degrees);
      const cosine = f32(Math.cos(degrees * Math.PI / 180));
      const sine = f32(Math.sin(degrees * Math.PI / 180));
      const a = add(mul(pose.a, cosine), mul(pose.c, sine));
      const b = add(mul(pose.b, cosine), mul(pose.d, sine));
      const c = f32(mul(pose.c, cosine) - mul(pose.a, sine));
      const d = f32(mul(pose.d, cosine) - mul(pose.b, sine));
      pose.a = a; pose.b = b; pose.c = c; pose.d = d;
      pose.done = 2;
    }
    for (let index = 0; index < count; index++) transform(index);
    let anchorX = 0;
    let anchorY = 0;
    if (bundle.anchor.length >= 4) {
      const anchor = poses[bundle.anchor[0]];
      if (!anchor) throw new Error('Invalid model anchor.');
      [anchorX, anchorY] = point(anchor,
        div32(Math.imul(i32(bundle.anchor[2] - anchor.pivotX), anchor.sx), bundle.scale),
        div32(Math.imul(i32(bundle.anchor[3] - anchor.pivotY), anchor.sy), bundle.scale));
    }
    const drawables = [];
    poses.forEach((pose, partIndex) => {
      if (pose.image < 0 || pose.cut < 0 || pose.cut >= bundle.cuts.length) return;
      const cut = bundle.cuts[pose.cut];
      if (cut[2] <= 0 || cut[3] <= 0) return;
      const alpha = Math.max(0, Math.min(255, div32(Math.imul(255, pose.alpha), bundle.opacity)));
      if (alpha === 0) return;
      const x0 = div32(Math.imul(-pose.sx, pose.pivotX), bundle.scale);
      const y0 = div32(Math.imul(-pose.sy, pose.pivotY), bundle.scale);
      const x1 = i32(x0 + div32(Math.imul(pose.sx, cut[2]), bundle.scale));
      const y1 = i32(y0 + div32(Math.imul(pose.sy, cut[3]), bundle.scale));
      const a = point(pose, x0, y0);
      const b = point(pose, x1, y0);
      const c = point(pose, x0, y1);
      if ((a[0] === b[0] && a[1] === b[1]) || (a[0] === c[0] && a[1] === c[1])) return;
      drawables.push({ partIndex, cut: pose.cut, z: pose.z,
        transform: [(b[0] - a[0]) / cut[2], (b[1] - a[1]) / cut[2],
          (c[0] - a[0]) / cut[3], (c[1] - a[1]) / cut[3], a[0] - anchorX, a[1] - anchorY],
        alpha: alpha / 255, blend: pose.blend });
    });
    drawables.sort((a, b) => a.z - b.z || a.partIndex - b.partIndex);
    return drawables;
  }

  function bounds(drawables, cuts) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const drawable of drawables) {
      const cut = cuts[drawable.cut];
      if (!cut) continue;
      const [a, b, c, d, e, f] = drawable.transform;
      for (const [x, y] of [[0, 0], [cut[2], 0], [0, cut[3]], [cut[2], cut[3]]]) {
        const px = a * x + c * y + e;
        const py = b * x + d * y + f;
        minX = Math.min(minX, px); minY = Math.min(minY, py);
        maxX = Math.max(maxX, px); maxY = Math.max(maxY, py);
      }
    }
    if (!Number.isFinite(minX)) minX = minY = maxX = maxY = 0;
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  const transparentGlowImages = new WeakMap();
  function transparentGlowImage(image, ctx) {
    let result = transparentGlowImages.get(image);
    if (result) return result;
    result = ctx.canvas.ownerDocument.createElement('canvas');
    result.width = image.naturalWidth || image.width;
    result.height = image.naturalHeight || image.height;
    const scratch = result.getContext('2d');
    scratch.drawImage(image, 0, 0);
    const pixels = scratch.getImageData(0, 0, result.width, result.height);
    const data = pixels.data;
    // PNG cannot encode additive blending. Preserve premultiplied glow RGB
    // with the minimum alpha that can represent it; black emits no light.
    for (let i = 0; i < data.length; i += 4) {
      const peak = Math.max(data[i], data[i + 1], data[i + 2]);
      data[i + 3] = Math.round(data[i + 3] * peak / 255);
      if (peak) for (let channel = 0; channel < 3; channel++) {
        data[i + channel] = Math.round(data[i + channel] * 255 / peak);
      }
    }
    scratch.putImageData(pixels, 0, 0);
    transparentGlowImages.set(image, result);
    return result;
  }

  function draw(ctx, bundle, image, animation, frame, options) {
    const settings = options || {};
    const scale = settings.scale === undefined ? 1 : settings.scale;
    const originX = settings.originX === undefined ? 0 : settings.originX;
    const originY = settings.originY === undefined ? 0 : settings.originY;
    const drawables = evaluate(bundle, animation, frame, settings);
    ctx.save();
    try {
      ctx.translate(originX, originY);
      ctx.scale(scale, scale);
      for (const drawable of drawables) {
        const cut = bundle.cuts[drawable.cut];
        ctx.save();
        try {
          ctx.transform(...drawable.transform);
          ctx.globalAlpha = drawable.alpha;
          ctx.globalCompositeOperation = drawable.blend === 1 ? 'lighter' : 'source-over';
          const texture = drawable.blend === 1 && settings.transparentExport
            ? transparentGlowImage(image, ctx) : image;
          ctx.drawImage(texture, cut[0], cut[1], cut[2], cut[3], 0, 0, cut[2], cut[3]);
        } finally { ctx.restore(); }
      }
    } finally { ctx.restore(); }
    return drawables;
  }

  return { parseBundle, parseAnimation, evaluate, bounds, draw };
});
