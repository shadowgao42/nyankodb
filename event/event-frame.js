/* Only the host boundary changes; the original page owns all schedule state. */
(() => {
  'use strict';
  if (new URLSearchParams(location.search).get('embedded') !== '1' || window.parent === window) return;
  document.documentElement.classList.add('event-embedded');
  const base = document.createElement('base');
  base.target = '_top';
  document.head.append(base);
  let lastHeight = 0;
  let queued = false;
  function reportHeight() {
    queued = false;
    const page = document.querySelector('main.page');
    if (!page) return;
    const height = Math.ceil(page.getBoundingClientRect().height);
    if (height > 0 && height !== lastHeight) {
      lastHeight = height;
      window.parent.postMessage({type: 'nyanko-event-height', height}, location.origin);
    }
  }
  function scheduleHeight() {
    if (!queued) { queued = true; requestAnimationFrame(reportHeight); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    new ResizeObserver(scheduleHeight).observe(document.querySelector('main.page'));
    scheduleHeight();
  });
  window.addEventListener('resize', scheduleHeight);
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.origin !== location.origin) return;
    if (event.data?.type === 'nyanko-event-visible') scheduleHeight();
    if (event.data?.type === 'nyanko-event-scroll') window.dispatchEvent(new Event('scroll'));
  });
})();
