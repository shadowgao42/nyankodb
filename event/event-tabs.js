/* Tab navigation leaves each existing renderer and its settings untouched. */
(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-event-view]')];
  const frames = [...document.querySelectorAll('.event-view-frame')];
  const updates = new Map();
  const frameHeights = new Map();
  let viewportRatio = 0;
  let normalizeFrames = false;
  function syncPanelHeight(frame) {
    const panel = frame.parentElement;
    const height = frameHeights.get(frame);
    if (!viewportRatio || !(height > 0)) return;
    frame.style.height = `${height}px`;
    if (normalizeFrames) panel.style.height = panel.hidden ? '0px' : `${height / viewportRatio}px`;
  }
  function layoutFrames() {
    if (!viewportRatio || !normalizeFrames) return;
    const page = document.querySelector('main.page');
    const cssWidth = parseFloat(getComputedStyle(page).width);
    const zoom = page.getBoundingClientRect().width / cssWidth;
    if (!(cssWidth > 0) || !(zoom > 0)) return;
    for (const frame of frames) {
      // Keep CSS viewport units and painted UI identical to the normal stage/sale view.
      // Cancel zoom at the document boundary, then apply it once outside the iframe.
      const styles = {width:`${cssWidth * viewportRatio}px`, zoom:String(1 / zoom),
        transform:`scale(${zoom / viewportRatio})`};
      for (const [name, value] of Object.entries(styles)) {
        if (frame.style[name] !== value) frame.style[name] = value;
      }
      syncPanelHeight(frame);
    }
  }

  function showUpdated(view) {
    const update = updates.get(view);
    const line = document.getElementById('eventUpdatedLine');
    const time = document.getElementById('eventUpdatedAt');
    line.hidden = !update?.dateTime;
    time.dateTime = update?.dateTime || '';
    time.textContent = update?.text || '';
  }
  function selectView(view) {
    for (const tab of tabs) {
      const selected = tab.dataset.eventView === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !selected;
      syncPanelHeight(panel.querySelector('iframe'));
    }
    showUpdated(view);
    frames.find(frame => frame.dataset.view === view)?.contentWindow?.postMessage({type:'nyanko-event-visible'}, location.origin);
  }
  function viewFromHash() { return location.hash === '#stage' ? 'stage' : location.hash === '#sale' ? 'sale' : 'gacha'; }
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      if (location.hash === `#${tab.dataset.eventView}`) selectView(tab.dataset.eventView);
      else location.hash = tab.dataset.eventView;
    });
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = tabs.indexOf(tab);
      const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1)
        : tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.click(); next.focus();
    });
  }
  window.addEventListener('hashchange', () => selectView(viewFromHash()));
  window.addEventListener('message', event => {
    if (event.origin !== location.origin) return;
    const frame = frames.find(item => item.contentWindow === event.source);
    if (!frame) return;
    if (event.data?.type === 'nyanko-event-updated') {
      const valid = typeof event.data.dateTime === 'string' && Number.isFinite(Date.parse(event.data.dateTime));
      updates.set(frame.dataset.view, valid ? {dateTime:event.data.dateTime, text:String(event.data.text || '')} : null);
      if (frame.dataset.view === viewFromHash()) showUpdated(frame.dataset.view);
    }
    const height = event.data?.height;
    if (event.data?.type === 'nyanko-event-height' && Number.isFinite(height) && height > 0 && viewportRatio) {
      frameHeights.set(frame, Math.ceil(height));
      syncPanelHeight(frame);
    }
  });
  window.addEventListener('scroll', () => {
    for (const frame of frames) frame.contentWindow?.postMessage({type:'nyanko-event-scroll'}, location.origin);
  }, {passive:true});
  function initializeViews() {
    document.documentElement.classList.remove('event-views-loading');
    selectView(viewFromHash());
    const page = document.querySelector('main.page');
    const frame = frames.find(item => item.dataset.view === viewFromHash());
    const doc = frame.contentDocument;
    const cssWidth = parseFloat(getComputedStyle(page).width);
    const nativeViewport = parseFloat(frame.contentWindow.getComputedStyle(doc.documentElement).width);
    // Capture before normalization: WebKit and Chromium expose inherited CSS zoom differently.
    viewportRatio = nativeViewport / cssWidth;
    if (!(viewportRatio > 0) || !Number.isFinite(viewportRatio)) return;
    normalizeFrames = Math.abs(nativeViewport - cssWidth) > .5;
    if (!normalizeFrames) viewportRatio = 1;
    document.documentElement.classList.toggle('event-frame-normalized', normalizeFrames);
    for (const item of frames) {
      frameHeights.set(item, parseFloat(getComputedStyle(item).height) * viewportRatio);
    }
    layoutFrames();
    selectView(viewFromHash());
  }
  window.addEventListener('resize', layoutFrames);
  if (document.readyState === 'complete') initializeViews();
  else window.addEventListener('load', initializeViews, {once:true});
  selectView(viewFromHash());
})();
