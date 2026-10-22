(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.NyankoAnimationViewer = api;
    const start = () => document.querySelectorAll('[data-animation-viewer]').forEach(api.mount);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class PlaybackClock {
    constructor(animation, fps = 30) {
      this.animation = animation;
      this.fps = fps;
      this.playing = false;
      this.elapsed = 0;
      this.started = 0;
    }
    time(now) { return this.elapsed + (this.playing ? Math.max(0, now - this.started) : 0); }
    frame(now) {
      const frame = Math.floor(this.time(now) * this.fps / 1000 + 1e-8);
      return this.animation.infinite ? frame : frame % Math.max(1, this.animation.lastFrame + 1);
    }
    play(now) {
      if (this.playing) return;
      this.started = now;
      this.playing = true;
    }
    pause(now) {
      if (!this.playing) return;
      this.elapsed = this.time(now);
      this.playing = false;
    }
    select(animation, now) {
      this.animation = animation;
      this.elapsed = 0;
      this.started = now;
    }
    seek(frame, now) {
      const position = Math.min(Math.max(0, Math.round(Number(frame) || 0)), Math.max(0, this.animation.lastFrame));
      this.elapsed = position * 1000 / this.fps;
      this.started = now;
    }
    step(delta, now) {
      if (this.playing) return false;
      const frame = this.frame(now) + delta;
      if (this.animation.infinite) {
        this.elapsed = Math.max(0, frame) * 1000 / this.fps;
        this.started = now;
      } else this.seek(frame, now);
      return true;
    }
  }

  function surfaceTap(playing, controlsVisible) {
    return { playing, controlsVisible: !controlsVisible };
  }

  function availableModes(count) {
    const modes = ['이동', '대기', '공격', '넉백'].slice(0, count).map((label, index) => ({ label, index }));
    if (count >= 5) modes.push({ label: '버로우', index: 4 });
    if (count >= 6) modes.push({ label: '버로우 업', index: count >= 7 ? 6 : 5 });
    return modes;
  }

  function cameraFor(bounds, width, height, zoom = 1) {
    const padding = Math.min(32, width * .06);
    const baseScale = Math.min((width - padding * 2) / Math.max(bounds.width, 1), (height - padding * 2) / Math.max(bounds.height, 1), 1.8);
    const scale = baseScale * zoom;
    return {
      scale,
      originX: width / 2 - (bounds.minX + bounds.maxX) * scale / 2,
      originY: height / 2 - (bounds.minY + bounds.maxY) * scale / 2,
    };
  }

  function mount(panel) {
    if (panel.dataset.mounted) return;
    panel.dataset.mounted = 'true';
    const core = globalThis.NyankoAnimationCore;
    const canvas = panel.querySelector('canvas');
    const context = canvas.getContext('2d');
    const select = panel.querySelector('[data-animation-mode]');
    const stage = panel.querySelector('[data-animation-stage]');
    const overlay = panel.querySelector('[data-animation-overlay]');
    const toggle = panel.querySelector('[data-animation-toggle]');
    const stepBack = panel.querySelector('[data-animation-step-back]');
    const stepForward = panel.querySelector('[data-animation-step-forward]');
    const seek = panel.querySelector('[data-animation-seek]');
    const time = panel.querySelector('[data-animation-time]');
    const zoomLabel = panel.querySelector('[data-animation-zoom-label]');
    const status = panel.querySelector('[data-animation-status]');
    const cache = new Map();
    let bundle = null;
    let sprite = null;
    let clock = null;
    let clip = 1;
    let bounds = null;
    let frameRequest = 0;
    let revision = 0;
    let lastFrame = -1;
    let lastForm = -1;
    let visible = true;
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let controlsVisible = false;
    let hideTimer = 0;
    let scrubbing = false;
    let resumeAfterScrub = false;
    let gesture = null;
    let gestureMoved = false;
    let suppressClickUntil = 0;
    const pointers = new Map();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let playingIntent = !reducedMotion;
    controlsVisible = reducedMotion;

    const syncControls = () => {
      const playing = Boolean(clock?.playing);
      toggle.disabled = !clock;
      toggle.setAttribute('aria-label', playing ? '일시정지' : '재생');
      toggle.dataset.playing = String(playing);
      stepBack.hidden = playing || !clock;
      stepForward.hidden = playing || !clock;
      seek.disabled = !clock;
      overlay.hidden = !clock;
      overlay.dataset.visible = String(controlsVisible && Boolean(clock));
      overlay.inert = !controlsVisible || !clock;
      panel.dataset.playing = String(playing);
      panel.dataset.controlsVisible = String(controlsVisible && Boolean(clock));
      zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    };
    const setStatus = (message) => {
      status.textContent = message;
      status.hidden = !message;
    };
    function syncTimeline(now) {
      if (!clock) return;
      const length = Math.max(1, clock.animation.lastFrame + 1);
      const frame = clock.frame(now) % length;
      const frames = document.getElementById(panel.dataset.kind === 'unit' ? 'framesButton' : 'time-f')?.getAttribute('aria-pressed') === 'true';
      const format = value => frames ? `${value}f` : `${(value / clock.fps).toFixed(2)}초`;
      seek.max = String(length - 1);
      seek.value = String(frame);
      seek.style.setProperty('--seek-progress', `${length > 1 ? frame / (length - 1) * 100 : 0}%`);
      time.textContent = `${format(frame)} / ${format(length)}`;
      seek.setAttribute('aria-valuetext', time.textContent);
      stepBack.disabled = clock.frame(now) <= 0;
      stepForward.disabled = !clock.animation.infinite && frame >= length - 1;
    }
    function autoHide() {
      clearTimeout(hideTimer);
      if (!controlsVisible || !clock?.playing || scrubbing || pointers.size) return;
      hideTimer = setTimeout(() => {
        if (overlay.querySelector(':focus-visible')) { autoHide(); return; }
        controlsVisible = false;
        syncControls();
      }, 3000);
    }
    function showControls(show) {
      controlsVisible = show;
      syncControls();
      syncTimeline(performance.now());
      autoHide();
    }
    function currentCamera(atZoom = zoom) {
      const camera = cameraFor(bounds, canvas.clientWidth, canvas.clientHeight, atZoom);
      camera.originX += panX;
      camera.originY += panY;
      return camera;
    }
    function draw(now, force = false) {
      if (!clock || !bundle || !sprite || !bounds) return;
      const frame = clock.frame(now);
      panel.dataset.frame = String(frame);
      syncTimeline(now);
      if (!force && lastFrame === frame) return;
      lastFrame = frame;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = window.devicePixelRatio || 1;
      const pixelWidth = Math.round(width * ratio);
      const pixelHeight = Math.round(height * ratio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const camera = currentCamera();
      panel.dataset.renderScale = String(camera.scale);
      panel.dataset.originX = String(camera.originX);
      panel.dataset.originY = String(camera.originY);
      panel.dataset.zoom = String(zoom);
      panel.dataset.panX = String(panX);
      panel.dataset.panY = String(panY);
      context.save();
      core.draw(context, bundle, sprite, bundle.animations[clip], frame, camera);
      context.restore();
    }
    function tick(now) {
      frameRequest = 0;
      draw(now);
      if (clock?.playing && visible && !document.hidden) frameRequest = requestAnimationFrame(tick);
    }
    function schedule() {
      if (!frameRequest && clock?.playing && visible && !document.hidden) frameRequest = requestAnimationFrame(tick);
    }
    function fitReference() {
      if (bounds) return;
      const animation = bundle.animations[1] || bundle.animations[0];
      let union = null;
      for (let frame = 0; frame <= Math.max(0, animation.lastFrame); frame += 1) {
        const box = core.bounds(core.evaluate(bundle, animation, frame), bundle.cuts);
        if (!box.width && !box.height) continue;
        if (!union) union = { ...box };
        else {
          union.minX = Math.min(union.minX, box.minX);
          union.minY = Math.min(union.minY, box.minY);
          union.maxX = Math.max(union.maxX, box.maxX);
          union.maxY = Math.max(union.maxY, box.maxY);
        }
      }
      bounds = union || { minX: -1, minY: -1, maxX: 1, maxY: 1 };
      bounds.width = bounds.maxX - bounds.minX;
      bounds.height = bounds.maxY - bounds.minY;
    }
    function choose(index) {
      clip = index;
      clock.select(bundle.animations[clip], performance.now());
      lastFrame = -1;
      panel.dataset.mode = String(clip);
      draw(performance.now(), true);
      syncControls();
      autoHide();
      schedule();
    }
    async function load() {
      const active = document.querySelector('.form-tab[aria-selected="true"]');
      const form = panel.dataset.kind === 'unit' ? Math.max(1, Number(active?.dataset.form || 1)) : 1;
      if (lastForm === form) return;
      lastForm = form;
      const token = ++revision;
      clock?.pause(performance.now());
      if (frameRequest) cancelAnimationFrame(frameRequest);
      frameRequest = 0;
      clock = null;
      syncControls();
      select.disabled = true;
      setStatus('애니메이션을 불러오는 중…');
      try {
        if (!core) throw new Error('Animation renderer unavailable');
        if (!cache.has(form)) {
          const pending = (async () => {
            const response = await fetch(panel.dataset.animationSource);
            if (!response.ok) throw new Error(`Animation data ${response.status}`);
            const packed = await response.json();
            const record = panel.dataset.kind === 'unit' ? packed[form - 1] : packed;
            if (!Array.isArray(record)) throw new Error('Animation form missing');
            const parsed = core.parseBundle(record);
            const image = new Image();
            image.src = panel.dataset.spriteSource.replace('{form}', String(form - 1));
            await image.decode();
            return { parsed, image };
          })();
          cache.set(form, pending);
        }
        const loaded = await cache.get(form);
        if (token !== revision) return;
        bundle = loaded.parsed;
        sprite = loaded.image;
        const modes = availableModes(bundle.animations.length);
        select.replaceChildren(...modes.map(mode => {
          const option = document.createElement('option');
          option.value = String(mode.index);
          option.textContent = mode.label;
          return option;
        }));
        clip = modes.some(mode => mode.index === 1) ? 1 : 0;
        select.value = String(clip);
        select.disabled = false;
        clock = new PlaybackClock(bundle.animations[clip]);
        if (playingIntent && !document.hidden) clock.play(performance.now());
        fitReference();
        choose(clip);
        panel.dataset.form = String(form);
        panel.dataset.ready = 'true';
        setStatus('');
        syncControls();
      } catch (error) {
        if (token !== revision) return;
        cache.delete(form);
        lastForm = -1;
        panel.dataset.ready = 'false';
        setStatus('애니메이션을 불러오지 못했습니다.');
        console.error('NyankoDB animation viewer', error);
      }
    }
    select.addEventListener('change', () => choose(Number(select.value)));
    function setPlaying(playing) {
      if (!clock) return;
      playingIntent = playing;
      if (playing && !document.hidden) clock.play(performance.now());
      else clock.pause(performance.now());
      if (!clock.playing && frameRequest) {
        cancelAnimationFrame(frameRequest);
        frameRequest = 0;
      }
      draw(performance.now(), true);
      syncControls();
      autoHide();
      schedule();
    }
    function tapSurface() {
      if (!clock) return;
      const next = surfaceTap(clock.playing, controlsVisible);
      controlsVisible = next.controlsVisible;
      setPlaying(next.playing);
    }
    stage.addEventListener('click', event => {
      if (event.pointerType === 'touch') return;
      if (event.target.closest('.animation-viewer-center-controls, .animation-viewer-timeline')) return;
      if (performance.now() < suppressClickUntil) return;
      tapSurface();
    });
    stage.addEventListener('keydown', event => {
      if (event.target !== stage || ![' ', 'Enter'].includes(event.key)) return;
      event.preventDefault();
      if (!event.repeat) tapSurface();
    });
    stage.addEventListener('focus', () => { if (stage.matches(':focus-visible')) showControls(true); });
    toggle.addEventListener('click', event => {
      event.stopPropagation();
      controlsVisible = true;
      setPlaying(!clock?.playing);
    });
    function stepFrame(delta) {
      if (!clock?.step(delta, performance.now())) return;
      draw(performance.now(), true);
      syncControls();
    }
    stepBack.addEventListener('click', event => { event.stopPropagation(); stepFrame(-1); });
    stepForward.addEventListener('click', event => { event.stopPropagation(); stepFrame(1); });
    function beginScrub() {
      if (!clock || scrubbing) return;
      resumeAfterScrub = clock.playing;
      scrubbing = true;
      clock.pause(performance.now());
      syncControls();
      clearTimeout(hideTimer);
    }
    function endScrub() {
      if (!scrubbing) return;
      scrubbing = false;
      setPlaying(resumeAfterScrub);
    }
    seek.addEventListener('pointerdown', beginScrub);
    seek.addEventListener('keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) beginScrub();
    });
    seek.addEventListener('input', () => {
      clock?.seek(Number(seek.value), performance.now());
      draw(performance.now(), true);
    });
    seek.addEventListener('change', endScrub);
    seek.addEventListener('keyup', endScrub);
    seek.addEventListener('blur', endScrub);
    window.addEventListener('pointerup', endScrub);
    window.addEventListener('pointercancel', endScrub);

    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: (event.clientX - rect.left) * canvas.clientWidth / rect.width, y: (event.clientY - rect.top) * canvas.clientHeight / rect.height };
    }
    function pinchInfo() {
      const [a, b] = [...pointers.values()];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: Math.hypot(a.x - b.x, a.y - b.y) };
    }
    function startGesture() {
      if (pointers.size >= 2) {
        const midpoint = pinchInfo();
        const camera = currentCamera();
        gesture = { type: 'pinch', ...midpoint, zoom, worldX: (midpoint.x - camera.originX) / camera.scale, worldY: (midpoint.y - camera.originY) / camera.scale };
        gestureMoved = true;
      } else {
        gesture = { type: 'pan', ...pointers.values().next().value, panX, panY };
      }
    }
    stage.addEventListener('pointerdown', event => {
      if (!clock || (event.pointerType === 'mouse' && event.button !== 0) || event.target.closest('.animation-viewer-center-controls, .animation-viewer-timeline')) return;
      if (!pointers.size) {
        gestureMoved = false;
        suppressClickUntil = 0;
      }
      pointers.set(event.pointerId, point(event));
      stage.setPointerCapture(event.pointerId);
      startGesture();
      clearTimeout(hideTimer);
    });
    stage.addEventListener('pointermove', event => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      const current = point(event);
      pointers.set(event.pointerId, current);
      if (gesture.type === 'pinch' && pointers.size >= 2) {
        const midpoint = pinchInfo();
        zoom = Math.min(3, Math.max(.25, gesture.zoom * midpoint.distance / Math.max(gesture.distance, 1)));
        const base = cameraFor(bounds, canvas.clientWidth, canvas.clientHeight, zoom);
        panX = midpoint.x - base.originX - gesture.worldX * base.scale;
        panY = midpoint.y - base.originY - gesture.worldY * base.scale;
      } else {
        const dx = current.x - gesture.x;
        const dy = current.y - gesture.y;
        if (!gestureMoved && Math.hypot(dx, dy) < 6) return;
        gestureMoved = true;
        panX = gesture.panX + dx;
        panY = gesture.panY + dy;
      }
      stage.dataset.dragging = 'true';
      draw(performance.now(), true);
      syncControls();
    });
    function endGesture(event) {
      if (!pointers.delete(event.pointerId)) return;
      const touchTap = event.type === 'pointerup' && event.pointerType === 'touch' && !gestureMoved && !pointers.size;
      if (gestureMoved || touchTap) suppressClickUntil = performance.now() + 400;
      if (pointers.size) startGesture();
      else {
        gesture = null;
        delete stage.dataset.dragging;
        autoHide();
      }
      if (touchTap) tapSurface();
    }
    stage.addEventListener('pointerup', endGesture);
    stage.addEventListener('pointercancel', endGesture);
    stage.addEventListener('lostpointercapture', endGesture);
    stage.addEventListener('wheel', event => {
      if (!clock || !event.ctrlKey) return;
      event.preventDefault();
      const anchor = point(event);
      const previous = currentCamera();
      const worldX = (anchor.x - previous.originX) / previous.scale;
      const worldY = (anchor.y - previous.originY) / previous.scale;
      zoom = Math.min(3, Math.max(.25, zoom * Math.exp(-event.deltaY * .005)));
      const base = cameraFor(bounds, canvas.clientWidth, canvas.clientHeight, zoom);
      panX = anchor.x - base.originX - worldX * base.scale;
      panY = anchor.y - base.originY - worldY * base.scale;
      draw(performance.now(), true);
      syncControls();
    }, { passive: false });
    const timeButtons = panel.dataset.kind === 'unit' ? ['secondsButton', 'framesButton'] : ['time-s', 'time-f'];
    const timeObserver = new MutationObserver(() => syncTimeline(performance.now()));
    timeButtons.forEach(id => {
      const button = document.getElementById(id);
      if (button) timeObserver.observe(button, { attributes: true, attributeFilter: ['aria-pressed'] });
    });
    new ResizeObserver(() => draw(performance.now(), true)).observe(canvas);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
    }).observe(panel);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clock?.pause(performance.now());
      } else if (playingIntent) {
        clock?.play(performance.now());
        schedule();
      }
      syncControls();
      autoHide();
    });
    const tabs = document.querySelector('.form-tabs');
    if (tabs) new MutationObserver(load).observe(tabs, { attributes: true, subtree: true, attributeFilter: ['aria-selected'] });
    load();
  }
  return { PlaybackClock, availableModes, cameraFor, surfaceTap, mount };
});
