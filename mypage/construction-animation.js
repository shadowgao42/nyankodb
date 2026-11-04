/* My Page decoration: unit 443, third form, original attack clip at 30 fps. */
(() => {
  'use strict';
  const canvas = document.getElementById('constructionAnimation');
  if (!canvas) return;
  const core = window.NyankoAnimationCore;
  let playing = false, elapsed = 0, started = 0, request = 0, lastFrame = -1;
  let bundle, clip, sprite, bounds;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  function render(now) {
    const frame = Math.floor((elapsed + (playing ? Math.max(0, now - started) : 0)) * 30 / 1000) % (clip.lastFrame + 1);
    const rect = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    const resized = canvas.width !== width || canvas.height !== height;
    if (resized) { canvas.width = width; canvas.height = height; }
    if (frame !== lastFrame || resized) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width / (bounds.maxX - bounds.minX + 32), height / (bounds.maxY - bounds.minY + 32));
      core.draw(ctx, bundle, sprite, clip, frame, { scale,
        originX: width / 2 - (bounds.minX + bounds.maxX) / 2 * scale,
        originY: height / 2 - (bounds.minY + bounds.maxY) / 2 * scale });
      canvas.dataset.frame = String(frame);
      lastFrame = frame;
    }
    if (playing) request = requestAnimationFrame(render);
  }
  function setPlaying(next) {
    if (!bounds) return;
    const now = performance.now();
    if (playing) elapsed += now - started;
    cancelAnimationFrame(request);
    playing = next; started = now;
    canvas.dataset.animationState = playing ? 'playing' : 'paused';
    render(now);
  }
  motion.addEventListener('change', () => { if (motion.matches) setPlaying(false); });
  new ResizeObserver(() => {
    if (!bounds) return;
    lastFrame = -1;
    if (!playing) render(performance.now());
  }).observe(canvas);
  async function load() {
    const response = await fetch('../img/u/443/a');
    if (!response.ok) throw new Error('Construction animation data: ' + response.status);
    const packed = await response.json();
    bundle = core.parseBundle(packed[2]);
    clip = bundle.animations[2];
    sprite = new Image(); sprite.src = '../img/u/443/c2.png'; await sprite.decode();
    bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (let frame = 0; frame <= clip.lastFrame; frame++) {
      const current = core.bounds(core.evaluate(bundle, clip, frame), bundle.cuts);
      bounds.minX = Math.min(bounds.minX, current.minX); bounds.minY = Math.min(bounds.minY, current.minY);
      bounds.maxX = Math.max(bounds.maxX, current.maxX); bounds.maxY = Math.max(bounds.maxY, current.maxY);
    }
    setPlaying(!motion.matches);
  }
  load().catch(error => { canvas.dataset.animationState = 'error'; canvas.hidden = true; console.error(error); });
})();
