/* Pack, login-stamp and reward calendar; source windows are month-independent. */
(() => {
  'use strict';
  const DAY = 86400000, KST = 9 * 3600000, POLL = 5 * 60 * 1000;
  const SETTINGS = 'nyanko-db:sale-settings:v1';
  const kinds = {pack:'팩', stamp:'로그인 스탬프', reward:'기타 보상'};
  const priority = {pack:0, stamp:1, reward:2};
  const commonRewardPairs = {
    kr:[[2,202],[2382,203],[2383,220],[2502,220]],
    jp:[[5,202],[2433,203],[2434,220],[2479,220]]
  };
  const list = document.getElementById('saleEvents');
  const regionSelect = document.getElementById('eventRegion');
  const days = document.getElementById('calendarDays');
  const status = document.getElementById('saleStatus');
  const settings = document.getElementById('eventSettings');
  const reset = document.getElementById('eventSettingsReset');
  const formatDate = new Intl.DateTimeFormat('ko-KR', {timeZone:'UTC', year:'numeric', month:'long', day:'numeric', weekday:'long'});
  const formatInstant = new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'});
  const koreaDate = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit'});
  const quantity = new Intl.NumberFormat('ko-KR');
  const units = window.NYANKODB_UNIT_CATALOG?.entries || [];
  const stageNames = new Map((window.NYANKODB_SEARCH_CATALOG?.entries || []).filter(e => e.kind === 'stage').map(e => [String(e.id), e.name]));
  let data = null, failed = false, inFlight = false;
  let selectedKinds = new Set(Object.keys(kinds));
  const intervalCache = new WeakMap();
  const tooltip = document.createElement('div');
  tooltip.className = 'unit-guide-tooltip'; tooltip.hidden = true;
  tooltip.id = 'saleRewardTooltip'; tooltip.setAttribute('role', 'tooltip');
  document.body.append(tooltip);

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function civil(year, month, day) { return new Date(Date.UTC(year, month, day)); }
  function today() {
    const p = Object.fromEntries(koreaDate.formatToParts(new Date()).map(({type,value}) => [type,value]));
    return civil(Number(p.year), Number(p.month) - 1, Number(p.day));
  }
  function key(date) { return date.toISOString().slice(0, 10); }
  function dayNumber(value) { return Math.floor((value + KST) / DAY); }
  let selected = today(), month = civil(selected.getUTCFullYear(), selected.getUTCMonth(), 1);

  function restore() {
    try {
      const value = JSON.parse(localStorage.getItem(SETTINGS) || '{}');
      regionSelect.value = value.region === 'jp' ? 'jp' : 'kr';
      selectedKinds = new Set(Array.isArray(value.kinds) ? value.kinds.filter(k => Object.hasOwn(kinds, k)) : Object.keys(kinds));
    } catch (_) { regionSelect.value = 'kr'; selectedKinds = new Set(Object.keys(kinds)); }
  }
  function save() {
    try { localStorage.setItem(SETTINGS, JSON.stringify({region:regionSelect.value, kinds:[...selectedKinds]})); } catch (_) { /* Keep usable without storage. */ }
  }
  function hideTooltip() { tooltip.hidden = true; }
  function showTooltip(node) {
    tooltip.textContent = node.dataset.tooltip;
    const zoom = parseFloat(getComputedStyle(document.body).zoom) || 1;
    tooltip.style.maxWidth = `${Math.min(300,(innerWidth-16)/zoom)}px`;
    tooltip.hidden = false; tooltip.style.left = '0px'; tooltip.style.top = '0px';
    const r = node.getBoundingClientRect(), box = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(8, Math.min(r.left, innerWidth - box.width - 8))/zoom}px`;
    tooltip.style.top = `${(r.top - box.height - 8 >= 8 ? r.top - box.height - 8 : Math.min(r.bottom + 8, innerHeight - box.height - 8))/zoom}px`;
  }
  function intervals(event) {
    if (!intervalCache.has(event)) intervalCache.set(event, event.windows.map(([a,b]) => [Date.parse(a), Date.parse(b)]));
    return intervalCache.get(event);
  }
  function activeOn(event, date) {
    const start = date.getTime() - KST;
    return intervals(event).some(([a,b]) => a < start + DAY && b > start);
  }
  function commonRewardIndex(event) {
    if (event.kind !== 'reward') return -1;
    return commonRewardPairs[regionSelect.value].findIndex(([category,item]) => event.categoryId === category && event.itemId === item);
  }
  function isDailyTicket(event) { return commonRewardIndex(event) === 0; }
  function eventName(event) {
    const common = commonRewardIndex(event);
    if (common >= 0) {
      const [category,item] = commonRewardPairs.kr[common];
      const korean = data?.regions.kr.events.find(e => e.kind === 'reward' && e.categoryId === category && e.itemId === item);
      return korean?.name || event.name;
    }
    if (event.kind === 'reward' && event.href) return stageNames.get(`R${String(event.itemId - 11000).padStart(3, '0')}`) || event.name;
    return event.name;
  }
  function period(event) {
    return `${formatInstant.format(new Date(event.start))} ~ ${formatInstant.format(new Date(event.end))}${event.everyday ? ' · 매일' : ''}`;
  }
  function rewardIcon(reward) {
    const entry = reward.kind === 'unit' ? units.find(u => u.id === reward.id && u.form === (reward.form || 1)) : null;
    const name = entry?.name || reward.name;
    const icon = entry ? '../' + entry.icon.replace(/^\.\.\//, '') : reward.icon;
    const href = entry ? `../unit/unit${String(entry.id).padStart(3,'0')}.html?form=${entry.form}` : reward.href;
    const box = element('div', 'owned-entry'); box.dataset.rewardId = String(reward.id);
    const link = element(href ? 'a' : 'span', 'nyancombo-member');
    if (href) link.href = href; else link.tabIndex = 0;
    link.dataset.tooltip = name;
    link.setAttribute('aria-label', link.dataset.tooltip);
    if (icon) {
      const frame = element('span', `nyancombo-member-image${reward.kind === 'unit' ? '' : ' sale-item-image'}`);
      const image = element('img'); image.src = icon; image.alt = ''; image.loading = 'lazy';
      image.width = reward.kind === 'unit' ? 104 : 128; image.height = reward.kind === 'unit' ? 79 : 128;
      image.addEventListener('error', () => { frame.replaceChildren(element('span', 'sale-text-reward', name)); });
      frame.append(image); link.append(frame);
    } else link.append(element('span', 'sale-text-reward', name));
    box.append(link);
    box.append(element('span', 'sale-quantity', `×${quantity.format(reward.quantity)}`));
    link.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') showTooltip(link); });
    link.addEventListener('pointerleave', hideTooltip); link.addEventListener('focus', () => showTooltip(link));
    link.addEventListener('blur', hideTooltip);
    return box;
  }
  function rewardGrid(rewards) {
    const grid = element('div', 'nyancombo-members sale-rewards');
    for (const reward of rewards) grid.append(rewardIcon(reward));
    return grid;
  }
  function renderEvent(event, wasOpen) {
    const row = element('article', 'calendar-event-detail sale-event');
    row.dataset.eventKey = event.key; row.dataset.saleKind = event.kind;
    const header = element('div', 'sale-event-heading');
    if (event.kind === 'stamp' || (event.kind === 'reward' && event.rewards?.length)) {
      const image = element('img', 'sale-stamp-icon');
      image.src = '../img/icon/stamp.png'; image.alt = ''; image.width = 48; image.height = 48;
      header.append(image);
    }
    if (event.banner) {
      const image = element('img', 'sale-banner'); image.src = event.banner.src; image.alt = eventName(event);
      image.width = event.banner.width; image.height = event.banner.height;
      header.append(image);
    }
    const info = element('div', 'sale-event-info');
    const title = element(event.href ? 'a' : 'span', 'calendar-stage-name', eventName(event));
    if (event.href) title.href = event.href;
    info.append(title, element('p', 'calendar-event-periods', period(event))); header.append(info); row.append(header);
    const hasContents = event.kind === 'pack' || event.kind === 'stamp' || event.rewards?.length || event.description;
    if (!hasContents) return row;
    const details = element('details', 'unit-guide sale-contents'); details.open = wasOpen;
    const summary = element('summary');
    const toggle = element('span', 'event-settings-toggle');
    const label = element('span', '', wasOpen ? '접기' : '펼치기');
    const arrow = element('span', 'event-settings-arrow', '▾'); arrow.setAttribute('aria-hidden', 'true');
    toggle.append(label, arrow); summary.append(toggle); details.append(summary);
    if (event.description) details.append(element('p', 'calendar-event-periods sale-description', event.description));
    if (event.kind === 'pack') for (const variant of event.variants) {
      const section = element('section', 'sale-variant');
      section.append(element('h3', '', variant.name));
      if (variant.rewards.length) section.append(rewardGrid(variant.rewards));
      details.append(section);
    }
    else if (event.kind === 'stamp') {
      const grid = element('div', 'sale-login-days');
      for (const day of event.days) {
        const section = element('section', 'sale-login-day'); section.dataset.day = String(day.day);
        section.append(element('span', 'sale-day-label', `${day.day}일차`));
        if (day.rewards.length) section.append(rewardGrid(day.rewards));
        else section.append(element('span', 'sale-reward-empty', '보상 없음'));
        grid.append(section);
      }
      details.append(grid);
    } else if (event.rewards?.length) details.append(rewardGrid(event.rewards));
    header.tabIndex = 0; header.setAttribute('role', 'button');
    header.setAttribute('aria-label', `${eventName(event)} 보상 목록`);
    const sync = () => { label.textContent = details.open ? '접기' : '펼치기'; header.setAttribute('aria-expanded', String(details.open)); hideTooltip(); };
    details.addEventListener('toggle', sync); sync();
    row.addEventListener('click', e => { if (!e.target.closest('a,button,summary,input,select')) { details.open = !details.open; sync(); } });
    header.addEventListener('keydown', e => { if (e.target === header && ['Enter',' '].includes(e.key)) { e.preventDefault(); details.open = !details.open; sync(); } });
    row.append(details);
    return row;
  }
  function selectDate(date, focus = false) {
    selected = date; month = civil(date.getUTCFullYear(), date.getUTCMonth(), 1); render();
    if (focus) days.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
  }
  function changeMonth(offset) {
    const target = civil(month.getUTCFullYear(), month.getUTCMonth() + offset, 1);
    const last = civil(target.getUTCFullYear(), target.getUTCMonth() + 1, 0).getUTCDate();
    selectDate(civil(target.getUTCFullYear(), target.getUTCMonth(), Math.min(last, selected.getUTCDate())));
  }
  function renderCalendar(events) {
    document.getElementById('calendarMonth').textContent = `${month.getUTCFullYear()}년 ${month.getUTCMonth() + 1}월`;
    const gridStart = month.getTime() / DAY - month.getUTCDay();
    const instances = events.flatMap(event => intervals(event).map(([start,end], index) => ({event,start,end,index})));
    instances.sort((a,b) => Number(isDailyTicket(a.event)) - Number(isDailyTicket(b.event)) || a.start - b.start || b.end - a.end || a.event.sourceRow - b.event.sourceRow || a.index - b.index);
    let ends = [], laneOffset = 0, ticketGroup = false;
    for (const instance of instances) {
      // Keep the daily ticket below every other lane across the complete timeline.
      if (!ticketGroup && isDailyTicket(instance.event)) {
        laneOffset = ends.length; ends = []; ticketGroup = true;
      }
      let lane = ends.findIndex(end => end <= instance.start);
      if (lane < 0) lane = ends.length;
      ends[lane] = instance.end; instance.lane = laneOffset + lane;
    }
    const visible = instances.filter(i => dayNumber(i.start) < gridStart + 42 && dayNumber(i.end - 1) >= gridStart);
    const fragment = document.createDocumentFragment();
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const start = gridStart + weekIndex * 7;
      const week = element('div', 'calendar-week'), dates = element('div', 'calendar-week-dates');
      const bars = element('div', 'calendar-week-events'), more = element('div', 'calendar-week-more');
      const hidden = Array.from({length:7}, () => new Set()), shown = Array.from({length:7}, () => new Set());
      let rows = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date((start + d) * DAY), button = element('button', 'calendar-day');
        button.type = 'button'; button.dataset.date = key(date);
        button.classList.toggle('is-outside', date.getUTCMonth() !== month.getUTCMonth());
        button.classList.toggle('is-sunday', d === 0); button.classList.toggle('is-saturday', d === 6);
        button.setAttribute('aria-label', formatDate.format(date)); button.setAttribute('aria-pressed', String(key(date) === key(selected)));
        if (key(date) === key(today())) button.setAttribute('aria-current', 'date');
        button.tabIndex = key(date) === key(selected) ? 0 : -1;
        button.append(element('span', 'calendar-day-number', String(date.getUTCDate())));
        button.addEventListener('click', () => selectDate(date, true));
        button.addEventListener('keydown', e => {
          const offsets = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-d,End:6-d};
          if (Object.hasOwn(offsets,e.key)) { e.preventDefault(); selectDate(new Date(date.getTime() + offsets[e.key] * DAY), true); }
          else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); changeMonth(e.key === 'PageUp' ? -1 : 1); days.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true}); }
        });
        dates.append(button);
      }
      for (const item of visible) {
        const a = dayNumber(item.start), b = dayNumber(item.end - 1);
        const first = Math.max(0,a-start), last = Math.min(6,b-start);
        if (first > last) continue;
        for (let d = first; d <= last; d++) (item.lane >= 5 ? hidden[d] : shown[d]).add(item.event.key);
        if (item.lane >= 5) continue;
        rows = Math.max(rows,item.lane + 1);
        const bar = element('button', 'calendar-event-bar', eventName(item.event));
        bar.type = 'button'; bar.dataset.saleKind = item.event.kind; bar.dataset.eventKey = item.event.key;
        bar.style.gridColumn = `${first + 1} / ${last + 2}`; bar.style.gridRow = String(item.lane + 1);
        const span = last - first + 1, firstEdge = (start + first) * DAY - KST, lastEdge = (start + last + 1) * DAY - KST;
        bar.style.marginInlineStart = `${100 * (Math.max(item.start,firstEdge)-firstEdge)/(span*DAY)}%`;
        bar.style.marginInlineEnd = `${100 * (lastEdge-Math.min(item.end,lastEdge))/(span*DAY)}%`;
        bar.classList.toggle('continues-before', a < start); bar.classList.toggle('continues-after', b > start + 6);
        bar.setAttribute('aria-label', `${eventName(item.event)} · ${period(item.event)}`);
        bar.addEventListener('click', () => {
          selectDate(new Date(Math.min(start+last,Math.max(start+first,selected.getTime()/DAY))*DAY));
          const row = [...list.children].find(n => n.dataset.eventKey === item.event.key);
          row?.scrollIntoView({block:'nearest'}); row?.querySelector('summary')?.focus({preventScroll:true});
        });
        bars.append(bar);
      }
      hidden.forEach((keys,d) => {
        const count = [...keys].filter(k => !shown[d].has(k)).length;
        if (!count) return;
        const button = element('button', 'calendar-more', `+${count}개`); button.type = 'button';
        button.style.gridColumn = String(d+1); button.dataset.date = key(new Date((start+d)*DAY));
        button.setAttribute('aria-label', `${formatDate.format(new Date((start+d)*DAY))} 세일 일정 ${count}개 더 보기`);
        button.addEventListener('click', () => { selectDate(new Date((start+d)*DAY)); list.scrollIntoView({block:'start'}); });
        more.append(button);
      });
      week.style.setProperty('--week-rows',String(rows)); week.classList.toggle('has-more',Boolean(more.childElementCount));
      week.append(dates,bars,more); fragment.append(week);
    }
    days.replaceChildren(fragment);
  }
  function updateTime() {
    const time = document.getElementById('eventUpdatedAt');
    const value = data?.regions[regionSelect.value]?.fetchedAt;
    time.hidden = !value;
    if (!value) return;
    const parts = Object.fromEntries(new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(value)).map(({type,value}) => [type,value]));
    time.dateTime = new Date(value).toISOString();
    time.textContent = `(${parts.year}년 ${parts.month}월 ${parts.day}일 ${parts.hour}:${parts.minute}:${parts.second} 기준)`;
  }
  function render(preserveOpen = false) {
    hideTooltip(); updateTime();
    const open = new Set(preserveOpen ? [...list.querySelectorAll('.sale-event')].filter(n => n.querySelector('details')?.open).map(n => n.dataset.eventKey) : []);
    reset.disabled = regionSelect.value === 'kr' && selectedKinds.size === 3;
    for (const input of document.querySelectorAll('input[data-sale-kind]')) input.checked = selectedKinds.has(input.dataset.saleKind);
    document.getElementById('saleSelectedDate').textContent = formatDate.format(selected);
    const events = (data?.regions[regionSelect.value]?.events || []).filter(e => selectedKinds.has(e.kind) && (!e.permanent || commonRewardIndex(e) >= 0));
    renderCalendar(events);
    const active = events.filter(e => activeOn(e,selected)).sort((a,b) => Number(isDailyTicket(a)) - Number(isDailyTicket(b)) || priority[a.kind]-priority[b.kind] || Date.parse(a.start)-Date.parse(b.start) || a.sourceRow-b.sourceRow);
    list.replaceChildren(...active.map(e => renderEvent(e,open.has(e.key))));
    document.getElementById('saleCount').textContent = data ? `${active.length}개 일정` : '';
    const loading = document.getElementById('calendarStatus');
    loading.hidden = Boolean(data); loading.textContent = failed ? '세일 일정을 불러오지 못했습니다.' : '세일 일정을 불러오는 중입니다.';
    status.hidden = Boolean(data && active.length);
    status.textContent = !data ? loading.textContent : '선택한 날짜에 표시할 세일 일정이 없습니다.';
    const legend = document.getElementById('calendarLegend');
    legend.hidden = !data;
    if (!legend.childElementCount) for (const [kind,name] of Object.entries(kinds)) {
      const item = element('span','calendar-category',name); item.dataset.saleKind = kind; legend.append(item);
    }
  }
  function valid(root) {
    if (root?.schemaVersion !== 1) return false;
    return ['kr','jp'].every(region => {
      const feed = root.regions?.[region];
      return feed?.schemaVersion === 1 && feed.kind === 'sale' && feed.region === region && Number.isFinite(Date.parse(feed.fetchedAt))
        && Array.isArray(feed.events) && feed.events.every(e => typeof e.key === 'string' && typeof e.name === 'string' && Object.hasOwn(kinds,e.kind)
          && Array.isArray(e.windows) && e.windows.every(w => Array.isArray(w) && w.length === 2 && Number.isFinite(Date.parse(w[0])) && Date.parse(w[1]) > Date.parse(w[0]))
          && (e.kind !== 'pack' || Array.isArray(e.variants)) && (e.kind !== 'stamp' || Array.isArray(e.days)));
    });
  }
  async function refresh() {
    if (inFlight || document.hidden) return;
    inFlight = true;
    const local = ['localhost','127.0.0.1','[::1]'].includes(new URL(document.baseURI).hostname);
    const initial = !data, region = regionSelect.value;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(),15000);
    try {
      const seed = initial || local;
      const url = new URL(seed ? 'sale-data.json' : `https://raw.githubusercontent.com/shadowgao42/nyankodb/refs/heads/event-schedule-data/sale-schedule-${region}.json`,document.baseURI);
      url.searchParams.set('t',String(Math.floor(Date.now()/POLL)));
      const response = await fetch(url,{cache:'no-store',credentials:'omit',signal:controller.signal});
      if (!response.ok) throw new Error('Unavailable sale schedules');
      const payload = await response.json();
      if (!seed && payload.region !== region) throw new Error('Wrong sale region');
      const next = seed ? payload : {...data,regions:{...data.regions,[region]:payload}};
      if (!valid(next)) throw new Error('Invalid sale schedules');
      const changed = !data || ['kr','jp'].some(r => JSON.stringify(data.regions[r].events) !== JSON.stringify(next.regions[r].events));
      data = next; failed = false;
      if (changed) render(true); else updateTime();
    } catch (_) { failed = true; if (!data) render(); }
    finally {
      inFlight = false; clearTimeout(timeout);
      if (data && !local && (initial || region !== regionSelect.value)) void refresh();
    }
  }
  restore();
  regionSelect.addEventListener('change', () => { save(); render(); void refresh(); });
  for (const input of document.querySelectorAll('input[data-sale-kind]')) input.addEventListener('change', () => {
    if (input.checked) selectedKinds.add(input.dataset.saleKind); else selectedKinds.delete(input.dataset.saleKind);
    save(); render();
  });
  settings.addEventListener('toggle', () => { document.getElementById('eventSettingsToggleLabel').textContent = settings.open ? '접기' : '펼치기'; });
  reset.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); regionSelect.value = 'kr'; selectedKinds = new Set(Object.keys(kinds)); save(); render(); });
  document.getElementById('previousMonth').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
  document.getElementById('calendarToday').addEventListener('click', () => selectDate(today()));
  window.addEventListener('storage', e => { if (e.key === SETTINGS || e.key === null) { restore(); render(); } });
  window.addEventListener('pageshow', () => { void refresh(); });
  window.addEventListener('resize', hideTooltip);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTooltip(); });
  window.addEventListener('message', e => {
    if (e.source !== window.parent || e.origin !== new URL(document.baseURI).origin) return;
    if (e.data?.type === 'nyanko-event-scroll') hideTooltip();
    if (e.data?.type === 'nyanko-event-visible') void refresh();
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void refresh(); });
  setInterval(refresh,POLL);
  render(); void refresh();
})();
