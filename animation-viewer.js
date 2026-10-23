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

  const DEFAULT_ZOOM = .5;

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

  function groundReferenceFor(bundle, evaluate) {
    // Use only an explicitly named ground shadow; never fit body/effect bounds.
    const candidates = (bundle.partNames || []).flatMap((name, index) =>
      /^(?:\d+)?(?:影|shadow)(?:\.png)?(?:<[^>]*>)*$/i.test(name.trim()) ? [index] : []);
    const fallback = { x: 0, y: 0, partIndex: -1 };
    if (candidates.length !== 1) return fallback;
    const partIndex = candidates[0];
    const drawable = evaluate(bundle, { tracks: [] }, 0).find(part => part.partIndex === partIndex);
    if (!drawable) return fallback;
    const [a, b, c, d, e, f] = drawable.transform;
    const x = bundle.cuts[drawable.cut][2] / 2;
    const y = bundle.parts[partIndex][7];
    return { x: a * x + c * y + e, y: b * x + d * y + f, partIndex };
  }

  function cameraFor(width, height, zoom = 1, displayScale = 1, reference = { x: 0, y: 0 }) {
    const scale = zoom / displayScale;
    return {
      scale,
      originX: width / 2 - reference.x * scale,
      originY: height * .75 - reference.y * scale,
    };
  }

  function fullscreenLayoutFor(inlineWidth, inlineHeight, width, height) {
    return {
      scale: Math.min(width / Math.max(1, inlineWidth), height / Math.max(1, inlineHeight)),
      controls: Math.min(1.75, Math.max(1, Math.min(width, height) / 480)),
    };
  }

  function mount(panel) {
    if (panel.dataset.mounted) return;
    panel.dataset.mounted = 'true';
    const core = globalThis.NyankoAnimationCore;
    const canvas = panel.querySelector('canvas');
    const context = canvas.getContext('2d');
    const select = panel.querySelector('[data-animation-mode]');
    const fullscreenSelect = panel.querySelector('[data-animation-fullscreen-mode]');
    const stage = panel.querySelector('[data-animation-stage]');
    const overlay = panel.querySelector('[data-animation-overlay]');
    const toggle = panel.querySelector('[data-animation-toggle]');
    const stepBack = panel.querySelector('[data-animation-step-back]');
    const stepForward = panel.querySelector('[data-animation-step-forward]');
    const seek = panel.querySelector('[data-animation-seek]');
    const time = panel.querySelector('[data-animation-time]');
    const zoomLabel = panel.querySelector('[data-animation-zoom-label]');
    const fullscreen = panel.querySelector('[data-animation-fullscreen]');
    const saves = panel.querySelectorAll('[data-animation-save]');
    const resetCamera = panel.querySelector('[data-animation-reset-camera]');
    const fullscreenControls = panel.querySelector('.animation-viewer-fullscreen-mode');
    const status = panel.querySelector('[data-animation-status]');
    const cache = new Map();
    let bundle = null;
    let sprite = null;
    let clock = null;
    let clip = 1;
    let frameRequest = 0;
    let revision = 0;
    let lastFrame = -1;
    let lastForm = -1;
    let visible = true;
    let zoom = DEFAULT_ZOOM;
    let fallbackFullscreen = false;
    let fullscreenReference = null;
    let presentationScale = 1;
    let presentationDisplayScale = 1;
    let controlScale = 1;
    let panX = 0;
    let panY = 0;
    let groundReference = { x: 0, y: 0, partIndex: -1 };
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
      fullscreen.disabled = !clock;
      saves.forEach(save => { save.disabled = !clock; });
      overlay.hidden = !clock;
      overlay.dataset.visible = String(controlsVisible && Boolean(clock));
      overlay.inert = !controlsVisible || !clock;
      panel.dataset.playing = String(playing);
      panel.dataset.controlsVisible = String(controlsVisible && Boolean(clock));
      zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
      const displaced = Boolean(clock) && Math.hypot(panX, panY) * displayScale() > .5;
      resetCamera.dataset.visible = String(displaced);
      resetCamera.disabled = !displaced;
      resetCamera.inert = !displaced;
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
    function displayScale() {
      return canvas.getBoundingClientRect().width / canvas.clientWidth || 1;
    }
    function baseCamera(atZoom = zoom) {
      return cameraFor(canvas.clientWidth, canvas.clientHeight, atZoom * presentationScale, displayScale(), groundReference);
    }
    function currentCamera(atZoom = zoom) {
      const camera = baseCamera(atZoom);
      camera.originX += panX;
      camera.originY += panY;
      return camera;
    }
    function draw(now, force = false) {
      if (!clock || !bundle || !sprite) return;
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
      panel.dataset.zoom = String(zoom * presentationScale);
      panel.dataset.baseZoom = String(zoom);
      panel.dataset.presentationScale = String(presentationScale);
      panel.dataset.controlScale = String(controlScale);
      panel.dataset.panX = String(panX);
      panel.dataset.panY = String(panY);
      panel.dataset.groundX = String(groundReference.x);
      panel.dataset.groundY = String(groundReference.y);
      panel.dataset.groundPart = String(groundReference.partIndex);
      context.save();
      core.draw(context, bundle, sprite, bundle.animations[clip], frame, camera);
      context.restore();
    }
    function tick(now) {
      frameRequest = 0;
      draw(now);
      schedule();
    }
    function schedule() {
      if (!frameRequest && clock?.playing && (visible || nativeFullscreen() || fallbackFullscreen) && !document.hidden) frameRequest = requestAnimationFrame(tick);
    }
    function choose(index) {
      clip = index;
      select.value = String(clip);
      fullscreenSelect.value = String(clip);
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
      fullscreenSelect.disabled = true;
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
        groundReference = groundReferenceFor(bundle, core.evaluate);
        sprite = loaded.image;
        const modes = availableModes(bundle.animations.length);
        select.replaceChildren(...modes.map(mode => {
          const option = document.createElement('option');
          option.value = String(mode.index);
          option.textContent = mode.label;
          return option;
        }));
        fullscreenSelect.replaceChildren(...[...select.options].map(option => option.cloneNode(true)));
        clip = modes.some(mode => mode.index === 1) ? 1 : 0;
        select.value = String(clip);
        select.disabled = false;
        fullscreenSelect.disabled = false;
        clock = new PlaybackClock(bundle.animations[clip]);
        if (playingIntent && !document.hidden) clock.play(performance.now());
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
    fullscreenSelect.addEventListener('change', () => choose(Number(fullscreenSelect.value)));
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
      if (event.target.closest('.animation-viewer-center-controls, .animation-viewer-timeline, .animation-viewer-fullscreen-mode, [data-animation-reset-camera]')) return;
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

    function savePng() {
      if (!clock) return;
      draw(performance.now(), true);
      const identity = panel.dataset.animationSource.split('/').at(-2);
      const mode = ['move', 'idle', 'attack', 'knockback'][clip] || `mode-${clip}`;
      const filename = `${panel.dataset.kind}-${identity}-form-${lastForm}-${mode}-${panel.dataset.frame}f.png`;
      try {
        canvas.toBlob(blob => {
          if (!blob) { setStatus('PNG를 저장하지 못했습니다.'); return; }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          setStatus('');
        }, 'image/png');
      } catch (error) {
        setStatus('PNG를 저장하지 못했습니다.');
        console.error('NyankoDB animation PNG', error);
      }
    }
    saves.forEach(save => save.addEventListener('click', savePng));
    function restoreCamera() {
      if (!clock) return;
      const keyboardFocus = resetCamera.matches(':focus-visible');
      panX = panY = 0;
      draw(performance.now(), true);
      syncControls();
      if (keyboardFocus) stage.focus({ preventScroll: true });
    }
    let resetTouch = null;
    let ignoreResetClickUntil = 0;
    resetCamera.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch') return;
      event.stopPropagation();
      if (!event.isPrimary) {
        if (resetTouch) resetTouch.moved = true;
        return;
      }
      resetTouch = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
      resetCamera.setPointerCapture(event.pointerId);
    });
    resetCamera.addEventListener('pointermove', event => {
      if (resetTouch?.id !== event.pointerId) return;
      if (Math.hypot(event.clientX - resetTouch.x, event.clientY - resetTouch.y) > 6) resetTouch.moved = true;
    });
    resetCamera.addEventListener('pointerup', event => {
      if (resetTouch?.id !== event.pointerId) return;
      const activate = !resetTouch.moved;
      resetTouch = null;
      event.stopPropagation();
      // Touch may omit its compatibility click after a canvas gesture.
      ignoreResetClickUntil = suppressClickUntil = performance.now() + 400;
      if (activate) restoreCamera();
    });
    const cancelResetTouch = event => { if (resetTouch?.id === event.pointerId) resetTouch = null; };
    resetCamera.addEventListener('pointercancel', cancelResetTouch);
    resetCamera.addEventListener('lostpointercapture', cancelResetTouch);
    resetCamera.addEventListener('click', event => {
      event.stopPropagation();
      if (event.detail !== 0 && performance.now() < ignoreResetClickUntil) return;
      restoreCamera();
    });

    function placeCameraReset() {
      if (stage.dataset.fullscreen !== 'true') {
        resetCamera.style.removeProperty('--animation-reset-top');
        return;
      }
      const row = fullscreenControls.getBoundingClientRect();
      const surface = stage.getBoundingClientRect();
      resetCamera.style.setProperty('--animation-reset-top', `${(row.bottom - surface.top + 8 * controlScale) / displayScale()}px`);
    }

    function nativeFullscreen() {
      return (document.fullscreenElement || document.webkitFullscreenElement) === stage;
    }
    function updatePresentation(scale, displayedScale) {
      const ratio = scale / presentationScale * presentationDisplayScale / displayedScale;
      panX *= ratio;
      panY *= ratio;
      presentationScale = scale;
      presentationDisplayScale = displayedScale;
    }
    function fitFullscreen() {
      if (!nativeFullscreen() && !fallbackFullscreen) return;
      stage.style.setProperty('--animation-fullscreen-zoom', '1');
      const width = stage.getBoundingClientRect().width;
      if (width > 0) stage.style.setProperty('--animation-fullscreen-zoom', String(window.innerWidth / width));
      const rect = canvas.getBoundingClientRect();
      if (fullscreenReference) {
        const layout = fullscreenLayoutFor(fullscreenReference.width, fullscreenReference.height, rect.width, rect.height);
        controlScale = layout.controls;
        stage.style.setProperty('--animation-control-scale', String(controlScale / displayScale()));
        updatePresentation(layout.scale, displayScale());
      }
      draw(performance.now(), true);
      placeCameraReset();
      syncControls();
      schedule();
    }
    function syncFullscreen() {
      const active = nativeFullscreen() || fallbackFullscreen;
      panel.dataset.fullscreen = String(active);
      stage.dataset.fullscreen = String(active);
      fullscreen.setAttribute('aria-label', active ? '전체화면 종료' : '전체화면');
      fullscreen.setAttribute('aria-pressed', String(active));
      document.documentElement.classList.toggle('animation-viewer-fullscreen-active', fallbackFullscreen);
      if (active) requestAnimationFrame(fitFullscreen);
      else {
        stage.style.removeProperty('--animation-fullscreen-zoom');
        stage.style.removeProperty('--animation-control-scale');
        controlScale = 1;
        updatePresentation(1, displayScale());
        fullscreenReference = null;
      }
      showControls(true);
      placeCameraReset();
      draw(performance.now(), true);
      schedule();
    }
    fullscreen.addEventListener('click', async event => {
      event.stopPropagation();
      if (nativeFullscreen()) {
        try { await (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
        catch (_) { /* The active control remains available for another exit gesture. */ }
      } else if (fallbackFullscreen) {
        fallbackFullscreen = false;
        syncFullscreen();
      } else {
        const rect = canvas.getBoundingClientRect();
        fullscreenReference = { width: rect.width, height: rect.height };
        presentationDisplayScale = displayScale();
        const request = stage.requestFullscreen || stage.webkitRequestFullscreen;
        try {
          if (!request) throw new Error('Fullscreen unavailable');
          await request.call(stage);
        } catch (_) {
          fallbackFullscreen = true;
        }
        syncFullscreen();
      }
    });
    document.addEventListener('fullscreenchange', syncFullscreen);
    document.addEventListener('webkitfullscreenchange', syncFullscreen);
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !fallbackFullscreen) return;
      fallbackFullscreen = false;
      syncFullscreen();
    });
    window.addEventListener('resize', fitFullscreen);
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
      if (!clock || (event.pointerType === 'mouse' && event.button !== 0) || event.target.closest('.animation-viewer-center-controls, .animation-viewer-timeline, .animation-viewer-fullscreen-mode, [data-animation-reset-camera]')) return;
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
        const base = baseCamera();
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
      const base = baseCamera();
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
    new ResizeObserver(() => { draw(performance.now(), true); placeCameraReset(); syncControls(); }).observe(canvas);
    new ResizeObserver(placeCameraReset).observe(fullscreenControls);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
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
  return { PlaybackClock, availableModes, groundReferenceFor, cameraFor, fullscreenLayoutFor, DEFAULT_ZOOM, surfaceTap, mount };
});
