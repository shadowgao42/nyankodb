/* Only the host boundary changes; the original page owns all schedule state. */
(() => {
  'use strict';
  if (window.parent === window) return;
  const inlineView = location.href === 'about:srcdoc' && window.frameElement?.classList.contains('event-view-frame');
  if (!inlineView && new URLSearchParams(location.search).get('embedded') !== '1') return;
  const hostOrigin = new URL(document.baseURI).origin;
  document.documentElement.classList.add('event-embedded');
  const base = document.createElement('base');
  base.target = '_top';
  document.head.append(base);
  function reportUpdated() {
    const time = document.getElementById('eventUpdatedAt');
    window.parent.postMessage({type: 'nyanko-event-updated',
      dateTime: time && !time.hidden ? time.dateTime : '',
      text: time && !time.hidden ? time.textContent : ''}, hostOrigin);
  }
  let lastHeight = 0;
  let queued = false;
  function reportHeight() {
    queued = false;
    const page = document.querySelector('main.page');
    if (!page) return;
    const height = Math.ceil(page.getBoundingClientRect().height);
    if (height > 0 && height !== lastHeight) {
      lastHeight = height;
      window.parent.postMessage({type: 'nyanko-event-height', height}, hostOrigin);
    }
  }
  function scheduleHeight() {
    if (!queued) { queued = true; requestAnimationFrame(reportHeight); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    new ResizeObserver(scheduleHeight).observe(document.querySelector('main.page'));
    scheduleHeight();
    const time = document.getElementById('eventUpdatedAt');
    if (time) new MutationObserver(reportUpdated).observe(time, {attributes:true, childList:true, subtree:true});
    reportUpdated();
  });
  window.addEventListener('resize', scheduleHeight);
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.origin !== hostOrigin) return;
    if (event.data?.type === 'nyanko-event-visible') { scheduleHeight(); reportUpdated(); }
    if (event.data?.type === 'nyanko-event-scroll') window.dispatchEvent(new Event('scroll'));
  });
})();
