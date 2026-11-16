/* Official image metadata comes from the local fixed-source adapter. */
(() => {
  "use strict";
  const official = "https://nyanko-announcement.ponosgames.com/v1/notices?platform=google&clientVersion=100300&countryCode=ko&clearedStageJapan=100&clearedStageFuture=100&clearedUniverse=100&timeDifference=700";
  const frame = document.getElementById("notice-frame"), fallback = document.getElementById("notice-fallback");
  const carousel = document.getElementById("notice-carousel"), stage = document.getElementById("notice-stage");
  const caption = document.getElementById("notice-caption"), count = document.getElementById("notice-count");
  const previous = document.getElementById("notice-prev"), next = document.getElementById("notice-next");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  document.getElementById("notice-official-link").href = official;
  frame.hidden = true;
  let rows = [], current = 0, expiresAt = 0, loading = false, moving = false;
  let timer, visible = false, focused = false, suspended = false;
  let gesture = null, suppressClickUntil = 0;
  const slides = Array.from({ length: 5 }, (_, index) => {
    const link = document.createElement("a"), image = document.createElement("img");
    link.className = "notice-slide"; link.target = "_blank"; link.rel = "noopener noreferrer";
    image.referrerPolicy = "no-referrer"; image.draggable = false;
    link.append(image); link.dataset.offset = String(index - 2); stage.append(link);
    image.addEventListener("error", () => { if (link.dataset.offset === "0" && !loading) showFallback(); });
    link.addEventListener("click", event => {
      const offset = Number(link.dataset.offset);
      if (moving || performance.now() < suppressClickUntil) event.preventDefault();
      else if (offset) { event.preventDefault(); move(Math.sign(offset)); }
    });
    return link;
  });
  function safe(value, isImage) {
    try {
      const url = new URL(value);
      const host = isImage ? "nyanko-webview.ponosgames.com" : "nyanko-announcement.ponosgames.com";
      const path = isImage ? "/information/img/battlecats/slider/large/kr/" : "/v1/notices/";
      return url.protocol === "https:" && url.hostname === host && !url.username && !url.password
        && !url.port && url.pathname.startsWith(path) ? url.href : null;
    } catch (_) { return null; }
  }
  function schedule() {
    clearTimeout(timer);
    if (!motion.matches && !focused && !document.hidden && !suspended && visible
        && !carousel.hidden && !loading && !moving && rows.length > 1) timer = setTimeout(() => move(1), 5000);
  }
  function showFallback() {
    clearTimeout(timer); carousel.hidden = true; fallback.hidden = false;
    frame.src = official; frame.hidden = false;
  }
  function position(link, offset) {
    link.style.left = `${50 + offset * 43}%`;
    link.style.transform = `translate(-50%, -50%) scale(${offset === 0 ? 1 : .25})`;
    link.style.opacity = Math.abs(offset) > 1 ? "0" : offset === 0 ? "1" : ".65";
    link.style.pointerEvents = Math.abs(offset) > 1 ? "none" : "auto";
    link.style.zIndex = offset === 0 ? "2" : "1";
  }
  function bind(link, offset) {
    const row = rows[(current + offset + rows.length * 2) % rows.length], image = link.firstElementChild;
    link.dataset.offset = String(offset); link.href = row.url;
    link.removeAttribute("id"); image.removeAttribute("id");
    image.src = row.image; image.alt = offset === 0 ? row.title : "";
    link.tabIndex = offset === 0 ? 0 : -1;
    link.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    if (!offset) { link.id = "notice-slide"; image.id = "notice-image"; }
    link.hidden = rows.length < 2 && offset !== 0;
    position(link, offset);
  }
  function render() {
    stage.classList.remove("is-moving");
    for (const link of slides) bind(link, Number(link.dataset.offset));
    caption.textContent = rows[current].title; count.textContent = `${current + 1} / ${rows.length}`;
    previous.disabled = next.disabled = rows.length < 2;
  }
  async function move(delta) {
    clearTimeout(timer);
    if (loading || moving || rows.length < 2) return;
    if (Date.now() / 1000 + 5 >= expiresAt) {
      await load();
      if (carousel.hidden || rows.length < 2) return;
    }
    moving = true;
    const focusedSlide = document.activeElement === stage.querySelector('[data-offset="0"]');
    stage.getBoundingClientRect(); stage.classList.add("is-moving");
    for (const link of slides) position(link, Number(link.dataset.offset) - delta);
    if (!motion.matches) await new Promise(resolve => setTimeout(resolve, 380));
    current = (current + delta + rows.length) % rows.length;
    for (const link of slides) {
      let offset = Number(link.dataset.offset) - delta;
      if (offset < -2) offset += 5;
      if (offset > 2) offset -= 5;
      link.dataset.offset = String(offset);
    }
    render(); moving = false;
    if (focusedSlide) stage.querySelector('[data-offset="0"]').focus({ preventScroll: true });
    schedule();
  }
  previous.addEventListener("click", () => move(-1)); next.addEventListener("click", () => move(1));
  stage.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" || moving || loading) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
  });
  stage.addEventListener("pointermove", event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      gesture.horizontal = true; stage.setPointerCapture(event.pointerId); event.preventDefault();
    }
  });
  stage.addEventListener("pointerup", event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const active = gesture; gesture = null;
    const dx = event.clientX - active.x, dy = event.clientY - active.y;
    if (active.horizontal) suppressClickUntil = performance.now() + 500;
    if (active.horizontal && Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      move(dx < 0 ? 1 : -1);
    }
  });
  stage.addEventListener("pointercancel", () => { gesture = null; });
  stage.addEventListener("click", event => { if (performance.now() < suppressClickUntil) event.preventDefault(); }, true);
  function syncKeyboardFocus() {
    focused = carousel.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
    schedule();
  }
  carousel.addEventListener("focusin", syncKeyboardFocus);
  carousel.addEventListener("focusout", () => queueMicrotask(syncKeyboardFocus));
  carousel.addEventListener("keydown", () => queueMicrotask(syncKeyboardFocus));
  carousel.addEventListener("pointerdown", () => {
    focused = false;
    schedule();
  });
  document.addEventListener("visibilitychange", schedule); motion.addEventListener("change", schedule);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: .15 }).observe(carousel);
  window.addEventListener("pagehide", () => { suspended = true; clearTimeout(timer); });
  window.addEventListener("pageshow", () => { suspended = false; schedule(); });
  async function load() {
    loading = true;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch("api/notices/official", { signal: controller.signal, credentials: "omit" });
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json();
      if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error("unavailable");
      rows = data.items.filter(row => row && typeof row.title === "string" && row.title.trim() && safe(row.image, true) && safe(row.url, false));
      if (!rows.length) throw new Error("unavailable");
      expiresAt = Number(data.expiresAt) || 0; current = Math.min(current, rows.length - 1);
      render(); carousel.hidden = false; fallback.hidden = true; frame.hidden = true;
    } catch (_) { showFallback(); }
    finally { clearTimeout(timeout); loading = false; schedule(); }
  }
  load();
})();
