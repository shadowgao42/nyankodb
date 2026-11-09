(function (root) {
  'use strict';
  // Talent73 unlock declarations are separate from a player's raw save data.
  const comboUnlockStorageKey = 'nyanko-db:combo-unlocks:v1';
  let comboUnlocks = {};
  let comboUnlockCatalog = null;
  let comboUnlockResults = [];
  const comboUnlockCache = new WeakMap();
  let comboUnlockRevision = 0;
  let comboUnlockOwnerIds = new Set();
  let comboSlotMembers = new Map();
  function comboUnlockContext(unitId) {
    if (!comboUnlockOwnerIds.has(unitId)) return '';
    const current = currentComboUnit();
    const requirement = comboUnlockCatalog.combos.find(combo => combo.requiredTalent?.unitId === unitId)?.requiredTalent;
    const input = requirement && root.document.querySelector(`.talent-level-range[data-talent-group="${requirement.group}"]`);
    return `${current.unitId}:${current.form}:${current.level}:${input?.value || 0}`;
  }
  let comboUnlockObserver = null;
  let comboUnlockRefreshing = false;
  function currentComboUnit() {
    const identity = root.document.getElementById('formIdentity')?.textContent || '';
    const match = identity.match(/UNIT\s+(\d+)-(\d+)/);
    return {unitId:Number(match?.[1]), form:Number(match?.[2]),
      level:Number(root.document.getElementById('baseLevelNumber')?.value)};
  }
  function readComboUnlocks() {
    try { return JSON.parse(root.localStorage.getItem(comboUnlockStorageKey) || '{}') || {}; }
    catch (_) { return {}; }
  }
  comboUnlocks = readComboUnlocks();
  function comboIsUnlocked(combo) {
    if (!combo.requiredTalent) return true;
    if (comboUnlocks[String(combo.id)] !== true) return false;
    // Lineup acquisition is independent of the calculator's viewed form/level.
    // Talent controls still update the same explicit unlock declaration.
    return true;
  }
  function unlockedComboCatalog(catalog) { return catalog.filter(comboIsUnlocked); }
  function recalculateComboStatsWithoutSaving() {
    const input = root.document.getElementById('baseLevelNumber');
    if (!input) return;
    // The existing number handler also persists shared settings.  A passive
    // refresh must never save another tab's stale treasure/level snapshot.
    const prototype = root.Storage?.prototype;
    const descriptors = prototype ? ['setItem', 'removeItem'].map(key => [key, Object.getOwnPropertyDescriptor(prototype, key)]) : [];
    try {
      for (const [key, descriptor] of descriptors) {
        if (descriptor) Object.defineProperty(prototype, key, {...descriptor, value() {}});
      }
      input.dispatchEvent(new Event('input', {bubbles:true}));
    } finally {
      for (const [key, descriptor] of descriptors) {
        if (descriptor) Object.defineProperty(prototype, key, descriptor);
      }
    }
  }
  function refreshComboUnlocks() {
    if (comboUnlockRefreshing) return;
    comboUnlockRefreshing = true;
    try {
    comboUnlockRevision++;
    const api = root.Nyancombo;
    for (const entry of comboUnlockResults) {
      for (const key of Object.keys(entry.result)) delete entry.result[key];
      Object.assign(entry.result, api.__beforeComboUnlockEffects(entry.roster, unlockedComboCatalog(entry.catalog), entry.unitId));
      entry.revision = comboUnlockRevision;
      entry.signature = entry.roster.map(member => member ? `${member.unitId}:${member.form}` : '').join('|');
    }
    const latest = comboUnlockResults[comboUnlockResults.length - 1];
    const effects = root.document.getElementById('comboEffects');
    if (effects && latest) {
      const active = api.active(latest.roster, comboUnlockCatalog.combos);
      effects.replaceChildren();
      if (!active.length) effects.textContent = '적용된 냥콤보 없음';
      else {
        const list = root.document.createElement('ul');
        for (const combo of active) {
          const item = root.document.createElement('li'); item.className = 'combo-effect-line';
          const name = root.document.createElement('span'); name.textContent = combo.name;
          const effect = root.document.createElement('strong');
          effect.textContent = combo.effect + (combo.restriction ? ` (${combo.restriction})` : '');
          item.append(name, effect); list.append(item);
        }
        effects.append(list);
      }
    }
    // Existing inline calculators retain their own update function.  Their
    // documented number-input handler recalculates without changing its value.
    recalculateComboStatsWithoutSaving();
    decorateComboSettings();
    } finally { comboUnlockRefreshing = false; }
  }
  function setComboUnlock(combo, enabled, synchronizeTalent) {
    const key = String(combo.id);
    if (comboUnlocks[key] === enabled) return;
    comboUnlocks[key] = enabled;
    try { root.localStorage.setItem(comboUnlockStorageKey, JSON.stringify(comboUnlocks)); } catch (_) {}
    if (synchronizeTalent) {
      const identity = root.document.getElementById('formIdentity')?.textContent || '';
      if (Number(identity.match(/UNIT\s+(\d+)/)?.[1]) === combo.requiredTalent.unitId) {
        const input = root.document.querySelector(`.talent-level-range[data-talent-group="${combo.requiredTalent.group}"]`);
        if (input) { input.value = enabled ? '1' : '0'; input.dispatchEvent(new Event('input', {bubbles:true})); }
      }
    }
    refreshComboUnlocks();
  }
  function talentKind(requirement) {
    return requirement.kind || (requirement.group >= 5 ? 'ultra' : 'normal');
  }
  function decorateTalentMember(member, requirement, selected = false) {
    const portrait = member.querySelector('.nyancombo-member-image');
    if (!portrait) return;
    let badge = member.querySelector('.combo-talent-badge');
    if (!requirement) {
      badge?.remove();
      if (member.dataset.comboTalentLabel) {
        member.dataset.tooltip = member.dataset.comboTalentTooltip;
        member.setAttribute('aria-label', member.dataset.comboTalentLabel);
        delete member.dataset.comboTalentLabel;
        delete member.dataset.comboTalentTooltip;
      }
      return;
    }
    const kind = talentKind(requirement);
    if (!badge) {
      badge = root.document.createElement('img');
      badge.className = 'combo-talent-badge';
      badge.src = '../img/icon/pcoin.png';
      badge.alt = ''; badge.width = 23; badge.height = 24;
      portrait.append(badge);
    }
    badge.dataset.provenance = kind;
    if (!member.dataset.comboTalentLabel) {
      member.dataset.comboTalentLabel = member.getAttribute('aria-label') || member.dataset.tooltip || '';
      member.dataset.comboTalentTooltip = member.dataset.tooltip || '';
    }
    const label = `${kind === 'ultra' ? '초본능' : '본능'} ${selected ? '적용' : '해방'}`;
    member.dataset.tooltip = `${member.dataset.comboTalentTooltip} · ${label}`;
    member.setAttribute('aria-label', `${member.dataset.comboTalentLabel} · ${label}`);
  }
  function decorateComboCards(container, catalog) {
    for (const card of container.querySelectorAll('.nyancombo-card[data-combo-id]')) {
      const combo = catalog.combos.find(combo => String(combo.id) === card.dataset.comboId);
      for (const note of card.querySelectorAll('.combo-talent-note')) note.remove();
      for (const input of card.querySelectorAll('[data-combo-unlock]')) input.closest('label')?.remove();
      if (!combo?.requiredTalent) continue;
      for (const member of card.querySelectorAll('.nyancombo-member')) {
        const id = Number(member.getAttribute('href')?.match(/unit(\d+)\.html/)?.[1]);
        if (id === combo.requiredTalent.unitId) decorateTalentMember(member, combo.requiredTalent);
      }
    }
  }
  function decorateComboSettings() {
    if (!comboUnlockCatalog) return;
    decorateComboCards(root.document, comboUnlockCatalog);
    // Read the rendered slot's catalog portrait, not a temporary combat roster.
    const slots = root.document.querySelectorAll('#comboSlots .combo-slot');
    slots.forEach(slot => {
      const source = slot.querySelector('.nyancombo-member-image > img')?.getAttribute('src');
      const member = comboSlotMembers.get(source);
      const combo = comboUnlockCatalog.combos.find(combo => member?.form >= 3
        && combo.requiredTalent?.unitId === member.unitId && comboUnlocks[String(combo.id)] === true);
      decorateTalentMember(slot, combo?.requiredTalent, true);
    });
  }
  function ensureComboUnlockSupport(catalog) {
    comboUnlockCatalog = catalog;
    comboSlotMembers = new Map(Object.values(catalog.unitForms).flat().map(member => [member.icon, member]));
    comboUnlockOwnerIds = new Set(catalog.combos.filter(combo => combo.requiredTalent).map(combo => combo.requiredTalent.unitId));
    const api = root.Nyancombo;
    if (!api || api.__beforeComboUnlockEffects) return;
    const active = api.active, effects = api.effects, cycleForm = api.cycleForm;
    api.cycleForm = (roster, index, unitForms) => {
      const member = roster[index];
      const combos = catalog.combos.filter(combo => combo.requiredTalent?.unitId === member?.unitId);
      if (!combos.length) return cycleForm(roster, index, unitForms);
      // The extra state is still the native third form. The existing unlock
      // declarations persist it independently of raw forms and save data.
      const selected = combos.some(combo => comboUnlocks[String(combo.id)] === true);
      if (member.form === 3 && !selected) {
        for (const combo of combos) setComboUnlock(combo, true, true);
        return api.normalize(roster);
      }
      for (const combo of combos) setComboUnlock(combo, false, true);
      return cycleForm(roster, index, unitForms);
    };
    api.__beforeComboUnlockEffects = effects;
    api.active = (roster, combos) => active(roster, unlockedComboCatalog(combos));
    api.effects = (roster, combos, unitId = null) => {
      let units = comboUnlockCache.get(roster);
      if (!units) { units = new Map(); comboUnlockCache.set(roster, units); }
      let entry = units.get(unitId);
      const signature = roster.map(member => member ? `${member.unitId}:${member.form}` : '').join('|');
      const context = comboUnlockContext(unitId);
      if (!entry) {
        entry = {result:{}, roster, catalog:combos, unitId, revision:-1, signature:null};
        units.set(unitId, entry);
        comboUnlockResults.push(entry);
        if (comboUnlockResults.length > 32) comboUnlockResults.shift();
      }
      if (entry.revision !== comboUnlockRevision || entry.signature !== signature || entry.catalog !== combos || entry.context !== context) {
        for (const key of Object.keys(entry.result)) delete entry.result[key];
        Object.assign(entry.result, effects(roster, unlockedComboCatalog(combos), unitId));
        entry.revision = comboUnlockRevision; entry.signature = signature; entry.catalog = combos; entry.context = context;
      }
      return entry.result;
    };
    comboUnlockObserver = new MutationObserver(decorateComboSettings);
    comboUnlockObserver.observe(root.document.documentElement, {childList:true, subtree:true});
    root.document.addEventListener('input', event => {
      const input = event.target;
      if (comboUnlockRefreshing) return;
      if (input.id === 'baseLevelNumber' || input.id === 'baseLevelRange') {
        refreshComboUnlocks(); return;
      }
      if (!input.matches?.('.talent-level-range,.talent-level-number') || input.value === '') return;
      const identity = root.document.getElementById('formIdentity')?.textContent || '';
      const unitId = Number(identity.match(/UNIT\s+(\d+)/)?.[1]);
      const combo = catalog.combos.find(combo => combo.requiredTalent?.unitId === unitId
        && combo.requiredTalent.group === Number(input.dataset.talentGroup));
      if (combo) setComboUnlock(combo, Number(input.value) > 0, false);
    });
    root.document.addEventListener('click', event => {
      const apply = event.target.closest?.('.combo-result .treasure-action-button');
      if (!apply || apply.disabled) return;
      const id = apply.closest('[data-combo-id]')?.dataset.comboId;
      const combo = catalog.combos.find(combo => String(combo.id) === id);
      if (combo?.requiredTalent) setComboUnlock(combo, true, true);
    }, true);
    root.document.addEventListener('click', event => {
      if (event.target.closest?.('[data-form][role="tab"]')) refreshComboUnlocks();
    });
    root.document.addEventListener('DOMContentLoaded', refreshComboUnlocks, {once:true});
    root.addEventListener('storage', event => {
      if (event.key !== comboUnlockStorageKey) return;
      comboUnlocks = readComboUnlocks(); refreshComboUnlocks();
    });
  }

  function renderNativeCombos(unitId, catalog) {
    ensureComboUnlockSupport(catalog);
    const panel = root.document.getElementById('nyancomboPanel');
    if (!panel) return;
    if (!root.document.getElementById('comboTalentNotesStyle')) {
      const style = root.document.createElement('link');
      style.id = 'comboTalentNotesStyle'; style.rel = 'stylesheet';
      style.href = '../combo/talent-notes.css'; root.document.head.append(style);
    }
    const list = panel.querySelector('.nyancombo-list');
    const combos = catalog.combos.filter(combo =>
      combo.members.some(member => member.unitId === unitId)).sort((a, b) => a.id - b.id);
    panel.querySelector('.nyancombo-count').textContent = `${combos.length}개`;
    const fragment = root.document.createDocumentFragment();
    for (const combo of combos) {
      const card = root.document.createElement('article');
      card.className = 'nyancombo-card';
      card.dataset.comboId = String(combo.id);
      const heading = root.document.createElement('header');
      heading.className = 'nyancombo-card-heading';
      const name = root.document.createElement('h3');
      name.textContent = combo.name;
      const effect = root.document.createElement('p');
      effect.textContent = combo.effect.trim().replace(/\s+/g, ' ');
      heading.append(name, effect);
      const members = root.document.createElement('div');
      members.className = 'nyancombo-members';
      members.setAttribute('aria-label', `${combo.name} 구성 유닛`);
      for (const member of combo.members) {
        const link = root.document.createElement('a');
        link.className = 'nyancombo-member';
        link.href = `unit${String(member.unitId).padStart(3, '0')}.html?form=${member.form}`;
        link.dataset.tooltip = member.name;
        link.setAttribute('aria-label', `${member.name} 유닛 계산기로 이동`);
        const portrait = root.document.createElement('div');
        portrait.className = 'nyancombo-member-image';
        const image = root.document.createElement('img');
        const source = catalog.nativePortraits?.[`${member.unitId}:${member.form}`] || member.icon;
        // Keep native thumbnails separate from larger uses of the same bitmap.
        image.src = source.startsWith('data:') ? source
          : `${source}${source.includes('?') ? '&' : '?'}nyancombo-portrait=1`;
        image.alt = '';
        image.width = 104;
        image.height = 79;
        portrait.append(image);
        link.append(portrait);
        members.append(link);
      }
      card.append(heading, members);
      fragment.append(card);
    }
    if (!combos.length) {
      const empty = root.document.createElement('p');
      empty.className = 'nyancombo-empty';
      empty.textContent = '이 유닛이 포함된 냥콤보가 없습니다.';
      fragment.append(empty);
    }
    list.replaceChildren(fragment);
    decorateComboCards(panel, catalog);
  }
  root.NyankoComboCatalog = { renderNativeCombos, decorateComboCards };
})(window);
