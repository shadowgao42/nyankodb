/* Standalone rare capsule calendar with local banners and shared encyclopedia icons. */
(() => {
  'use strict';
  const list = document.getElementById('gachaEvents');
  const status = document.getElementById('gachaStatus');
  const calendarDays = document.getElementById('calendarDays');
  const regionSelect = document.getElementById('eventRegion');
  const rarityNames = {2: '레어', 3: '슈퍼 레어', 4: '울트라 슈퍼 레어', 5: '레전드 레어'};
  const formatter = new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'});
  const number = new Intl.NumberFormat('ko-KR', {maximumFractionDigits:4});
  const guide = window.NyankoUnitGuide;
  const unitCatalog = window.NYANKODB_UNIT_CATALOG;
  const guideEntries = guide.units(unitCatalog);
  const encyclopedia = window.NYANKODB_UNIT_ENCYCLOPEDIA?.entries || {};
  let data = null;
  let assets = null;
  let failed = false;
  const selectedBadges = new Set();
  const selectedTypes = new Set(['rare', 'normal', 'event']);
  let excludeSpecial = true;
  const DAY = 86400000;
  const KST = 9 * 3600000;
  const SETTINGS_KEY = 'nyanko-db:gacha-test-settings:v1';
  const dateFormat = new Intl.DateTimeFormat('ko-KR', {timeZone:'UTC', year:'numeric', month:'long', day:'numeric', weekday:'long'});
  const civilDate = (year, month, day) => new Date(Date.UTC(year, month, day));
  const dateKey = date => date.toISOString().slice(0, 10);
  const today = () => { const now = new Date(Date.now() + KST); return civilDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()); };
  let selectedDate = today();
  let displayedMonth = civilDate(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1);
  function restoreSettings() {
    selectedBadges.clear();
    selectedTypes.clear();
    for (const type of ['rare', 'normal', 'event']) selectedTypes.add(type);
    excludeSpecial = true;
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      regionSelect.value = saved?.region === 'jp' ? 'jp' : 'kr';
      excludeSpecial = typeof saved?.excludeSpecial === 'boolean' ? saved.excludeSpecial : true;
      if (Array.isArray(saved?.types)) {
        selectedTypes.clear();
        for (const type of saved.types) if (['rare', 'normal', 'event'].includes(type)) selectedTypes.add(type);
      }
      if (Array.isArray(saved?.badges)) for (const code of saved.badges) {
        if (['확', '5', '그', '럭', '캠', '지', '플', '스'].includes(code)) selectedBadges.add(code);
      }
    } catch (_) { regionSelect.value = 'kr'; }
  }
  restoreSettings();

  let tooltipOwner = null;
  const badgeUnits = {캠: [129, 200, 131, 144, 237, 238, 239], 지: [443, 444, 445, 446, 447]};
  const tooltip = document.createElement('div');
  tooltip.id = 'gachaTooltip';
  tooltip.className = 'gacha-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function hideTooltip() {
    tooltip.hidden = true;
    tooltipOwner?.removeAttribute('aria-describedby');
    tooltipOwner = null;
  }
  function showTooltip(button) {
    hideTooltip();
    tooltipOwner = button;
    const isUnit = button.classList.contains('nyancombo-member');
    tooltip.className = isUnit ? 'unit-guide-tooltip' : 'gacha-tooltip';
    tooltip.textContent = button.dataset.tooltip;
    const unitIds = badgeUnits[button.dataset.badgeCode];
    if (unitIds) {
      tooltip.classList.add('gacha-roster-tooltip');
      const icons = element('div', 'gacha-tooltip-units');
      for (const id of unitIds) {
        const entry = guideEntries.find(unit => unit.id === id);
        if (!entry) continue;
        const image = element('img');
        image.src = '../' + entry.icon.replace(/^\.\.\//, '');
        image.alt = entry.name; image.width = 104; image.height = 79;
        icons.append(image);
      }
      tooltip.replaceChildren(icons, element('p', '', '위 유닛 출현'));
    }
    button.setAttribute('aria-describedby', tooltip.id);
    const zoom = parseFloat(getComputedStyle(document.body).zoom) || 1;
    const availableWidth = (innerWidth - 24) / zoom;
    tooltip.style.maxWidth = `${isUnit ? Math.min(300, availableWidth) : availableWidth}px`;
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.hidden = false;
    const box = button.getBoundingClientRect();
    const tip = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(12, Math.min(box.left, innerWidth - tip.width - 12)) / zoom}px`;
    const above = box.top - tip.height - 8;
    tooltip.style.top = `${(above >= 8 ? above : Math.min(box.bottom + 8, innerHeight - tip.height - 8)) / zoom}px`;
  }
  function badge(code, label, guaranteedIcon = false) {
    const button = element('button', 'calendar-filter-toggle gacha-badge', code);
    if (guaranteedIcon && code === '확') {
      button.classList.add('gacha-guaranteed-badge');
      button.textContent = '';
      const icon = element('img');
      icon.src = '../img/icon/guaranteed.png';
      icon.alt = '울트라 슈퍼 레어 확정'; icon.width = 242; icon.height = 62;
      button.append(icon);
    }
    button.type = 'button';
    button.dataset.tooltip = label;
    button.dataset.badgeCode = code;
    button.setAttribute('aria-label', `${code}: ${label}`);
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showTooltip(button); });
    button.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch' && document.activeElement !== button) hideTooltip(); });
    button.addEventListener('focus', () => showTooltip(button));
    button.addEventListener('blur', hideTooltip);
    button.addEventListener('click', () => showTooltip(button));
    return button;
  }
  function period(event) { return `${formatter.format(new Date(event.start))} ~ ${formatter.format(new Date(event.end))}`; }

  function unitIcon(entry, percent) {
    const box = element('div', 'owned-entry');
    const link = element('a', 'nyancombo-member');
    const frame = element('span', 'nyancombo-member-image');
    const image = element('img');
    link.href = `../unit/unit${String(entry.id).padStart(3, '0')}.html?form=${entry.form}`;
    link.dataset.unitId = String(entry.id);
    link.dataset.tooltip = entry.name;
    link.setAttribute('aria-label', entry.name);
    image.src = '../' + entry.icon.replace(/^\.\.\//, '');
    image.alt = ''; image.width = 104; image.height = 79; image.loading = 'lazy';
    frame.append(image); link.append(frame); box.append(link);
    if (percent !== undefined) box.append(element('span', 'gacha-unit-rate', `${number.format(percent)}%`));
    link.addEventListener('pointerenter', () => showTooltip(link));
    link.addEventListener('pointerleave', hideTooltip);
    link.addEventListener('focus', () => showTooltip(link));
    link.addEventListener('blur', hideTooltip);
    return box;
  }
  function foldControl(details, summary) {
    const toggle = element('span', 'gacha-fold-toggle');
    const label = element('span', 'gacha-fold-label', '펼치기');
    const arrow = element('span', 'gacha-fold-arrow', '▾');
    arrow.setAttribute('aria-hidden', 'true');
    toggle.append(label, arrow); summary.append(toggle);
    details.addEventListener('toggle', () => {
      label.textContent = details.open ? '접기' : '펼치기';
      hideTooltip();
    });
  }
  function unitGuide(event) {
    const odds = new Map(event.characters.filter(character => character.percent > 0).map(character => [character.id, character]));
    const matches = guideEntries.filter(entry => odds.has(entry.id));
    const ordered = guide.pages(matches, unitCatalog.rarities, encyclopedia, 'encyclopedia').flatMap(page => page.entries);
    const root = element('details', 'unit-guide gacha-guide gacha-characters');
    const summary = element('summary', 'gacha-characters-heading');
    const probabilities = element('span', 'gacha-probabilities');
    const groups = element('div', 'gacha-rarity-groups');
    let guaranteed = false;
    const rarityRates = [], unitRates = [], guaranteeButtons = [];
    const uberTotal = event.characters.filter(character => character.rarity === 4)
      .reduce((total, character) => total + character.percent, 0);
    function updateProbabilities() {
      for (const {node, rarity} of rarityRates) {
        const percent = guaranteed ? (rarity === 4 ? 100 : 0) : event.weights[rarity - 1] / 100;
        node.textContent = `${number.format(percent)}%`;
      }
      for (const {node, character} of unitRates) {
        const percent = guaranteed ? (character.rarity === 4 ? character.percent / uberTotal * 100 : 0) : character.percent;
        node.textContent = `${number.format(percent)}%`;
      }
      for (const button of guaranteeButtons) button.setAttribute('aria-pressed', String(guaranteed));
    }
    function rarityRate(rarity) {
      const node = element('span', 'gacha-rarity-chance');
      rarityRates.push({node, rarity});
      return node;
    }
    function guaranteeButton() {
      const button = element('button', 'calendar-filter-toggle gacha-guarantee-toggle');
      button.type = 'button';
      button.setAttribute('aria-pressed', 'false');
      const check = element('span', 'calendar-filter-check', '✓');
      check.setAttribute('aria-hidden', 'true');
      button.append(element('span', '', '확정 뽑기'), check);
      button.addEventListener('click', click => {
        click.preventDefault();
        click.stopPropagation();
        guaranteed = !guaranteed;
        updateProbabilities();
      });
      guaranteeButtons.push(button);
      return button;
    }
    for (const rarity of [4, 3, 2, 5]) {
      const entries = ordered.filter(entry => entry.rarity === rarityNames[rarity]);
      if (!entries.length || !event.weights[rarity - 1]) continue;
      const section = element('section', 'required-unit-rarity-group gacha-rarity-group');
      section.dataset.rarity = String(rarity);
      const chance = element('span', 'required-unit-rarity-title gacha-rarity-heading');
      const rarityIcon = element('img');
      rarityIcon.src = `../img/i/${153 + unitCatalog.rarities.indexOf(rarityNames[rarity])}.png`;
      rarityIcon.alt = rarityNames[rarity]; rarityIcon.width = 90; rarityIcon.height = 28;
      chance.append(rarityIcon, rarityRate(rarity));
      if (rarity === 4 && event.guarantees[3] === 1 && uberTotal > 0) chance.append(guaranteeButton());
      probabilities.append(chance);
      const heading = element('h4', 'required-unit-rarity-title gacha-rarity-heading');
      heading.append(rarityIcon.cloneNode(), rarityRate(rarity));
      if (rarity === 4 && event.guarantees[3] === 1 && uberTotal > 0) heading.append(guaranteeButton());
      const grid = element('div', 'nyancombo-members');
      for (const entry of entries) {
        const character = odds.get(entry.id);
        const icon = unitIcon(entry, character.percent);
        unitRates.push({node: icon.querySelector('.gacha-unit-rate'), character});
        grid.append(icon);
      }
      section.append(heading, grid); groups.append(section);
    }
    summary.append(probabilities);
    foldControl(root, summary);
    root.append(summary, groups);
    updateProbabilities();
    return root;
  }
  function rewardIcon(reward) {
    if (reward.kind === 'unit') {
      const entry = guideEntries.find(unit => unit.id === reward.id);
      return entry ? unitIcon(entry, reward.percent) : null;
    }
    const box = element('div', 'owned-entry');
    box.dataset.rewardId = String(reward.id);
    const link = element('a', 'nyancombo-member');
    link.href = reward.href;
    link.dataset.tooltip = reward.name;
    link.setAttribute('aria-label', reward.name);
    const frame = element('span', 'nyancombo-member-image gacha-item-image');
    const image = element('img');
    image.src = reward.icon; image.alt = ''; image.width = 128; image.height = 128; image.loading = 'lazy';
    frame.append(image); link.append(frame); box.append(link);
    const quantity = reward.isExperience && !reward.special ? 1 : reward.quantity;
    if (reward.special || quantity !== 1) box.append(element('span', 'gacha-reward-quantity', `×${number.format(quantity)}`));
    if (reward.percent !== undefined) box.append(element('span', 'gacha-unit-rate', `${number.format(reward.percent)}%`));
    link.addEventListener('pointerenter', () => showTooltip(link));
    link.addEventListener('pointerleave', hideTooltip);
    link.addEventListener('focus', () => showTooltip(link));
    link.addEventListener('blur', hideTooltip);
    return box;
  }
  function flatGuide(event) {
    const root = element('details', 'unit-guide gacha-guide gacha-characters gacha-flat-guide');
    const summary = element('summary', 'gacha-characters-heading');
    foldControl(root, summary);
    const grid = element('div', 'nyancombo-members');
    for (const reward of event.rewards) {
      const icon = rewardIcon(reward);
      if (icon) grid.append(icon);
    }
    root.append(summary, grid);
    if (event.specialRewards.length) {
      const special = element('div', 'gacha-special-rewards');
      const specialGrid = element('div', 'nyancombo-members');
      special.append(element('p', 'gacha-special-title', '특별 아이템'));
      for (const reward of event.specialRewards) {
        const icon = rewardIcon(reward);
        if (icon) specialGrid.append(icon);
      }
      special.append(specialGrid);
      const count = event.specialSource?.minCount;
      if (Number.isInteger(count) && count > 0) {
        special.append(element('p', 'calendar-event-periods gacha-special-note', `${count}번 돌릴 때마다 특별 아이템 반드시 출현`));
      }
      root.append(special);
    }
    return root;
  }
  // Only the requested capsule families; match existing banner variants by image ID.
  const bannerThemes = Object.fromEntries([
    ["legend", [954, 966, 971, 984, 996, 1009]],
    ["platinum", [953, 965, 970, 983, 995, 1008]],
    ["uber-popular", [975, 1026, 1052]],
    ["epic-popular", [990, 1027, 1053]],
    ["download", [967, 1011, 1049, 1077]],
    ["red-busters", [696]],
    ["air-busters", [452]],
    ["metal-busters", [915]],
    ["wave-busters", [523]],
    ["colossus-busters", [772]],
    ["busters-fest", [856, 939]],
    ["kingfest", [955, 973, 1012]],
    ["queenfest", [861]],
    ["uberfest", [952, 963, 981, 993, 1006, 1033]],
    ["epicfest", [931, 964, 969, 982, 994, 1007, 1056]],
    ["superfest", [956, 972, 1040, 1051]],
    ["dynamites", [942, 1068]],
    ["basaras", [943, 1044]],
    ["galaxy-gals", [944, 1022]],
    ["dragon-emperors", [945, 1060]],
    ["ultra-souls", [946, 1084]],
    ["dark-heroes", [947]],
    ["almighties", [948, 991, 992]],
    ["iron-legion", [949, 979, 980]],
    ["pixies", [951, 1004, 1005]],
    ["girls-monsters", [950, 1016]],
    ["nekolugas", [941, 962, 986]],
    ["valentine", [795]],
    ["white-day", [968]],
    ["easter", [880]],
    ["june-bride", [887, 1065]],
    ["summer-sunshine", [903, 1001, 1075]],
    ["summer-blue-ocean", [904, 1014, 1076]],
    ["halloween", [926]],
    ["christmas", [940]],
    ["ultra-selection", [936, 1028]],
    ["miracle-selection", [937, 1029, 1054]],
    ["excellent-selection", [938, 1030]],
    ["new-year", [959]],
    ["outlet", [974, 1055]],
    ["collab", [49, 482, 485, 486, 511, 537, 546, 570, 584, 757, 777, 778, 805, 820, 821, 848, 874, 879, 905, 924, 925, 927, 960, 978, 1002, 1003, 1019, 1020, 1031, 1032, 1050, 1079, 1080, 1081]],
  ].flatMap(([theme, ids]) => ids.map(id => [id, theme])));
  function eventTheme(event) {
    if (event.type && event.type !== 'rare') return '';
    const region = regionSelect.value === 'jp' ? 'jp' : 'kr';
    const imageId = assets?.regions[region]?.banners[event.id]?.imageId;
    return bannerThemes[imageId] || '';
  }
  function eventName(event) {
    if (event.type && event.type !== 'rare') return event.name;
    const region = regionSelect.value === 'jp' ? 'jp' : 'kr';
    return assets?.regions[region]?.displayNames?.[event.id] || event.name;
  }
  function renderEvent(event, labels, metadata) {
    const row = element('article', 'calendar-event-detail gacha-event');
    row.dataset.gachaId = String(event.id);
    row.dataset.sourceRow = String(event.sourceRow);
    row.dataset.eventKey = event.key;
    row.dataset.gachaType = event.type || 'rare';
    const header = element('div', 'gacha-event-heading');
    const info = element('div', 'gacha-event-info');
    const banner = event.banner || metadata.banners[event.id];
    if (banner) {
      const image = element('img', 'gacha-banner');
      image.src = banner.src; image.alt = eventName(event); image.width = banner.width; image.height = banner.height;
      if (banner.src.includes('gatya_n_btn')) image.classList.add('gacha-normal-banner');
      image.loading = 'lazy'; image.decoding = 'async'; header.append(image);
    }
    const top = element('div', 'gacha-event-top');
    top.append(element('span', 'calendar-stage-name', eventName(event)));
    const tags = element('div', 'gacha-tags');
    for (const code of event.badges) tags.append(badge(code, labels.get(code), true));
    top.append(tags);
    info.append(top, element('p', 'calendar-event-periods', period(event)));
    header.append(info); row.append(header);
    if (event.bonus) {
      const entry = guideEntries.find(unit => unit.id === event.bonus.id);
      if (entry) {
        const bonus = element('div', 'unit-guide gacha-guide gacha-bonus-guide');
        const grid = element('div', 'nyancombo-members');
        bonus.append(element('p', 'gacha-bonus', '10+1 추가 획득'));
        grid.append(unitIcon(entry)); bonus.append(grid); row.append(bonus);
      }
    }
    const characters = event.type && event.type !== 'rare' ? flatGuide(event) : unitGuide(event);
    characters.id = `gacha-characters-${event.key}`;
    header.tabIndex = 0;
    header.setAttribute('role', 'button');
    header.setAttribute('aria-label', `${eventName(event)} 캐릭터 목록`);
    header.setAttribute('aria-controls', characters.id);
    const syncExpanded = () => header.setAttribute('aria-expanded', String(characters.open));
    const toggleCharacters = () => {
      characters.open = !characters.open;
      syncExpanded();
      hideTooltip();
    };
    row.addEventListener('click', event => {
      if (!event.target.closest('button, a, summary')) toggleCharacters();
    });
    header.addEventListener('keydown', event => {
      if (event.target === header && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        toggleCharacters();
      }
    });
    characters.addEventListener('toggle', syncExpanded);
    syncExpanded();
    row.append(characters);
    return row;
  }

  function selectDate(date, focus = false) {
    selectedDate = date;
    displayedMonth = civilDate(date.getUTCFullYear(), date.getUTCMonth(), 1);
    render();
    if (focus) calendarDays.querySelector('.calendar-day[aria-pressed="true"]')?.focus({preventScroll:true});
  }
  function changeMonth(offset) {
    const month = civilDate(displayedMonth.getUTCFullYear(), displayedMonth.getUTCMonth() + offset, 1);
    const last = civilDate(month.getUTCFullYear(), month.getUTCMonth() + 1, 0).getUTCDate();
    selectDate(civilDate(month.getUTCFullYear(), month.getUTCMonth(), Math.min(last, selectedDate.getUTCDate())));
  }
  const dayNumber = instant => Math.floor((Date.parse(instant) + KST) / DAY);
  function resolveEvents(events) {
    const groups = new Map();
    events.forEach((event, index) => {
      const groupName = `${event.type || 'rare'}:${event.name}`;
      if (!groups.has(groupName)) groups.set(groupName, []);
      groups.get(groupName).push({event, index, start:Date.parse(event.start), end:Date.parse(event.end)});
    });
    const result = [];
    for (const group of groups.values()) {
      const boundaries = [...new Set(group.flatMap(item => [item.start, item.end]))].sort((a,b) => a-b);
      const segments = [];
      for (let i = 0; i < boundaries.length - 1; i++) {
        const start = boundaries[i], end = boundaries[i+1];
        const active = group.filter(item => item.start <= start && item.end >= end)
          .sort((a,b) => b.start-a.start || b.event.sourceRow-a.event.sourceRow || b.index-a.index);
        if (!active.length) continue;
        const winner = active[0];
        const previous = segments[segments.length-1];
        if (previous?.sourceKey === winner.event.key && Date.parse(previous.end) === start) {
          previous.end = new Date(end).toISOString();
        } else {
          segments.push({...winner.event, sourceKey:winner.event.key,
            sourceStart:winner.event.start, sourceEnd:winner.event.end,
            isLong:winner.end-winner.start >= 365*DAY,
            start:new Date(start).toISOString(), end:new Date(end).toISOString()});
        }
      }
      for (const segment of segments) {
        segment.key = `${segment.sourceKey}@${Date.parse(segment.start)}:${Date.parse(segment.end)}`;
        result.push(segment);
      }
    }
    return result;
  }
  function calendarLanes(events) {
    const lanes = new Map();
    let laneEnds = [], laneOffset = 0, previousType;
    // Preserve limited-campaign priority using the original, uncut duration.
    const ordered = [...events].sort((a,b) => typePriority(a)-typePriority(b) || Number(a.isLong)-Number(b.isLong)
      || dayNumber(a.start)-dayNumber(b.start) || Date.parse(b.end)-Date.parse(a.end)
      || a.slot-b.slot || a.sourceRow-b.sourceRow || a.key.localeCompare(b.key));
    for (const event of ordered) {
      const currentType = event.type || 'rare';
      if (currentType !== previousType) {
        laneOffset += laneEnds.length;
        laneEnds = [];
        previousType = currentType;
      }
      const start = Date.parse(event.start);
      let lane = laneEnds.findIndex(end => end <= start);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = Date.parse(event.end);
      lanes.set(event, laneOffset + lane);
    }
    return lanes;
  }
  function renderCalendar(events) {
    const year = displayedMonth.getUTCFullYear(), month = displayedMonth.getUTCMonth();
    document.getElementById('calendarMonth').textContent = `${year}년 ${month + 1}월`;
    const first = civilDate(year, month, 1);
    const gridStart = first.getTime() / DAY - first.getUTCDay();
    const visible = events.filter(e => dayNumber(e.start) < gridStart + 42 && dayNumber(new Date(Date.parse(e.end) - 1).toISOString()) >= gridStart);
    // Assign lanes from every effective interval, independently of the displayed month.
    const lanes = calendarLanes(events);
    const fragment = document.createDocumentFragment();
    for (let w = 0; w < 6; w++) {
      const weekStart = gridStart + w * 7;
      const week = element('div', 'calendar-week');
      const dates = element('div', 'calendar-week-dates');
      const bars = element('div', 'calendar-week-events');
      const hidden = Array(7).fill(0);
      let rows = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date((weekStart + d) * DAY), key = dateKey(date);
        const button = element('button', 'calendar-day');
        button.type = 'button'; button.dataset.date = key;
        button.classList.toggle('is-outside', date.getUTCMonth() !== month);
        button.classList.toggle('is-sunday', d === 0); button.classList.toggle('is-saturday', d === 6);
        button.setAttribute('aria-label', dateFormat.format(date));
        button.setAttribute('aria-pressed', String(key === dateKey(selectedDate)));
        if (key === dateKey(today())) button.setAttribute('aria-current', 'date');
        button.tabIndex = key === dateKey(selectedDate) ? 0 : -1;
        button.append(element('span', 'calendar-day-number', String(date.getUTCDate())));
        button.addEventListener('click', () => selectDate(date, true));
        button.addEventListener('keydown', event => {
          const offsets = {ArrowLeft:-1, ArrowRight:1, ArrowUp:-7, ArrowDown:7, Home:-d, End:6-d};
          if (Object.hasOwn(offsets,event.key)) { event.preventDefault(); selectDate(new Date(date.getTime() + offsets[event.key] * DAY), true); }
          else if (event.key === 'PageUp' || event.key === 'PageDown') { event.preventDefault(); changeMonth(event.key === 'PageUp' ? -1 : 1); calendarDays.querySelector('[aria-pressed="true"]').focus({preventScroll:true}); }
        });
        dates.append(button);
      }
      for (const event of visible) {
        const start = dayNumber(event.start), end = dayNumber(new Date(Date.parse(event.end) - 1).toISOString());
        const firstDay = Math.max(0, start - weekStart), lastDay = Math.min(6, end - weekStart);
        if (firstDay > lastDay) continue;
        const lane = lanes.get(event);
        if (lane >= 5) { for (let d = firstDay; d <= lastDay; d++) hidden[d]++; continue; }
        rows = Math.max(rows, lane + 1);
        const bar = element('button', 'calendar-event-bar', `${eventName(event)}${event.badges.length ? ' [' + event.badges.join('·') + ']' : ''}`);
        bar.type = 'button'; bar.dataset.gachaId = String(event.id); bar.dataset.key = event.key;
        bar.dataset.gachaType = event.type || 'rare';
        const theme = eventTheme(event);
        if (theme) bar.dataset.gachaTheme = theme;
        bar.style.gridColumn = `${firstDay + 1} / ${lastDay + 2}`; bar.style.gridRow = String(lane + 1);
        const span = lastDay - firstDay + 1;
        const startEdge = (weekStart + firstDay) * DAY - KST;
        const endEdge = (weekStart + lastDay + 1) * DAY - KST;
        const segmentStart = Math.max(Date.parse(event.start), startEdge);
        const segmentEnd = Math.min(Date.parse(event.end), endEdge);
        bar.style.marginInlineStart = `${100 * (segmentStart - startEdge) / (span * DAY)}%`;
        bar.style.marginInlineEnd = `${100 * (endEdge - segmentEnd) / (span * DAY)}%`;
        bar.classList.toggle('continues-before', start < weekStart); bar.classList.toggle('continues-after', end > weekStart + 6);
        bar.setAttribute('aria-label', `${eventName(event)} · ${event.badges.join(' ')} · ${period(event)}`);
        bar.addEventListener('click', () => {
          const chosen = Math.min(weekStart + lastDay, Math.max(weekStart + firstDay, selectedDate.getTime() / DAY));
          selectDate(new Date(chosen * DAY));
          const row = [...list.children].find(n => n.dataset.eventKey === event.key);
          row?.scrollIntoView({block:'nearest'}); row?.querySelector('summary')?.focus({preventScroll:true});
        });
        bars.append(bar);
      }
      week.style.setProperty('--week-rows', String(rows)); week.classList.toggle('has-more', hidden.some(Boolean));
      const more = element('div', 'calendar-week-more');
      hidden.forEach((count,d) => {
        if (!count) return;
        const button = element('button', 'calendar-more', `+${count}개`); button.type = 'button';
        button.style.gridColumn = String(d + 1); const date = new Date((weekStart + d) * DAY);
        button.setAttribute('aria-label', `${dateFormat.format(date)} 뽑기 일정 ${count}개 더 보기`);
        button.addEventListener('click', () => { selectDate(date); list.scrollIntoView({block:'start'}); list.querySelector('summary')?.focus({preventScroll:true}); });
        more.append(button);
      });
      week.append(dates, bars, more); fragment.append(week);
    }
    calendarDays.replaceChildren(fragment);
  }
  function render() {
    const region = regionSelect.value === 'jp' ? 'jp' : 'kr';
    hideTooltip();
    document.getElementById('gachaSelectedDate').textContent = dateFormat.format(selectedDate);
    document.getElementById('eventSettingsReset').disabled = region === 'kr' && selectedBadges.size === 0 && selectedTypes.size === 3 && excludeSpecial;
    document.getElementById('gachaExcludeSpecial').checked = excludeSpecial;
    for (const input of document.querySelectorAll('input[data-gacha-type]')) input.checked = selectedTypes.has(input.dataset.gachaType);
    for (const button of document.querySelectorAll('#gachaLegend .gacha-badge')) {
      button.setAttribute('aria-pressed', String(selectedBadges.has(button.dataset.code)));
    }
    const all = resolveEvents(data?.regions[region].events || []).filter(matchesEventFilters);
    renderCalendar(all);
    list.replaceChildren();
    const calendarStatus = document.getElementById('calendarStatus');
    calendarStatus.hidden = Boolean(data);
    if (!data) {
      status.hidden = false;
      status.textContent = failed ? '뽑기 일정을 불러오지 못했습니다. 페이지를 새로고침해 주세요.' : '뽑기 일정을 불러오는 중입니다.';
      calendarStatus.textContent = status.textContent;
      calendarStatus.dataset.state = failed ? 'error' : 'loading';
      document.getElementById('gachaCount').textContent = '';
      return;
    }
    const start = selectedDate.getTime() - KST, end = start + DAY;
    const events = all.filter(e => Date.parse(e.start) < end && Date.parse(e.end) > start)
      .sort((a,b) => typePriority(a)-typePriority(b) || a.slot - b.slot || Date.parse(b.start) - Date.parse(a.start) || a.id - b.id);
    const labels = new Map(data.badges.map(b => [b.code,b.label]));
    status.hidden = events.length > 0;
    status.textContent = events.length ? '' : '선택한 날짜에 표시할 뽑기 일정이 없습니다.';
    document.getElementById('gachaCount').textContent = `${events.length}개 일정`;
    for (const event of events) list.append(renderEvent(event,labels,assets.regions[region]));
  }
  function matchesBadgeFilter(event) { return selectedBadges.size === 0 || event.badges.some(code => selectedBadges.has(code)); }
  function typePriority(event) { return ({rare:0, normal:1, event:2})[event.type || 'rare']; }
  function matchesEventFilters(event) {
    return !(event.type === 'normal' && [0, 62, 63, 64].includes(event.id))
      && selectedTypes.has(event.type || 'rare') && matchesBadgeFilter(event)
      && !(excludeSpecial && ['platinum', 'legend'].includes(eventTheme(event)));
  }
  function saveRegion() { try { localStorage.setItem(SETTINGS_KEY,JSON.stringify({region:regionSelect.value, badges:[...selectedBadges], types:[...selectedTypes], excludeSpecial})); } catch (_) {} render(); }
  document.getElementById('gachaExcludeSpecial').addEventListener('change', event => { excludeSpecial = event.target.checked; saveRegion(); });
  for (const input of document.querySelectorAll('input[data-gacha-type]')) input.addEventListener('change', () => {
    if (input.checked) selectedTypes.add(input.dataset.gachaType);
    else selectedTypes.delete(input.dataset.gachaType);
    saveRegion();
  });
  regionSelect.addEventListener('change', saveRegion);
  document.getElementById('previousMonth').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
  document.getElementById('calendarToday').addEventListener('click', () => selectDate(today()));
  const settings = document.getElementById('eventSettings');
  settings.addEventListener('toggle', () => { document.getElementById('eventSettingsToggleLabel').textContent = settings.open ? '접기' : '펼치기'; });
  document.getElementById('eventSettingsReset').addEventListener('click', event => {
    event.preventDefault(); event.stopPropagation(); regionSelect.value = 'kr'; selectedBadges.clear();
    selectedTypes.clear(); for (const type of ['rare', 'normal', 'event']) selectedTypes.add(type);
    excludeSpecial = true; saveRegion();
  });
  window.addEventListener('storage', event => { if (event.key === SETTINGS_KEY || event.key === null) { restoreSettings(); render(); } });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hideTooltip(); });
  document.addEventListener('pointerdown', event => { if (!event.target.closest('.gacha-badge, .nyancombo-member')) hideTooltip(); });
  window.addEventListener('resize', hideTooltip);
  window.addEventListener('scroll', hideTooltip, true);
  async function load() {
    try {
      const responses = await Promise.all(['stage-test-data.json', 'stage-test-assets.json', 'gacha-extra-data.json'].map(path => fetch(path, {cache:'no-store'})));
      if (responses.some(response => !response.ok)) throw new Error('Unavailable gacha export');
      const [next, nextAssets, extra] = await Promise.all(responses.map(response => response.json()));
      if (next.schemaVersion !== 1 || !next.regions.kr || !next.regions.jp || next.badges.length !== 8
        || nextAssets.schemaVersion !== 1 || !nextAssets.regions.kr || !nextAssets.regions.jp
        || extra.schemaVersion !== 1 || !extra.regions.kr || !extra.regions.jp) throw new Error('Invalid gacha export');
      for (const region of ['kr', 'jp']) next.regions[region].events.push(...extra.regions[region].events);
      data = next; assets = nextAssets;
      const legend = document.getElementById('gachaLegend');
      for (const item of data.badges) {
        const button = badge(item.code, item.label);
        button.dataset.code = item.code;
        button.setAttribute('aria-pressed', String(selectedBadges.has(item.code)));
        button.addEventListener('click', () => {
          if (selectedBadges.has(item.code)) selectedBadges.delete(item.code);
          else selectedBadges.add(item.code);
          saveRegion();
        });
        legend.append(button);
      }
    } catch (_) { failed = true; }
    render();
  }
  render();
  void load();
})();
