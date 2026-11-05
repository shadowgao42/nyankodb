/* Tab navigation leaves each existing renderer and its settings untouched. */
(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-event-view]')];
  const frames = [...document.querySelectorAll('.event-view-frame')];
  function selectView(view) {
    for (const tab of tabs) {
      const selected = tab.dataset.eventView === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    }
    frames.find(frame => frame.dataset.view === view)?.contentWindow?.postMessage({type:'nyanko-event-visible'}, location.origin);
  }
  function viewFromHash() { return location.hash === '#gacha' ? 'gacha' : 'stage'; }
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
    if (event.origin !== location.origin || event.data?.type !== 'nyanko-event-height') return;
    const frame = frames.find(item => item.contentWindow === event.source);
    const height = event.data.height;
    if (frame && Number.isFinite(height) && height > 0) frame.style.height = `${Math.ceil(height)}px`;
  });
  window.addEventListener('scroll', () => {
    for (const frame of frames) frame.contentWindow?.postMessage({type:'nyanko-event-scroll'}, location.origin);
  }, {passive:true});
  selectView(viewFromHash());
})();
