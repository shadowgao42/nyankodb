(() => {
  'use strict';
  window.NyankoUnitGuide = {
    DEFAULT_ORDER: 'encyclopedia',
    PAGE_SIZE: 24,
    units(catalog) {
      const values = new Map();
      for (const entry of catalog.entries) if (!values.has(entry.id) || entry.form < values.get(entry.id).form) values.set(entry.id, entry);
      return [...values.values()];
    },
    summonedIds(catalog) {
      return new Set((catalog?.entries || []).filter(entry => entry.name === '정령').map(entry => entry.id));
    },
    pages(matches, rarities, encyclopedia, order = 'encyclopedia') {
      const pages = [], listed = entry => Object.hasOwn(encyclopedia, String(entry.id));
      const groups = [...rarities, ...new Set(matches.map(entry => entry.rarity).filter(rarity => !rarities.includes(rarity)))];
      for (const rarity of groups) {
        const entries = matches.filter(entry => entry.rarity === rarity), registered = entries.filter(listed), unregistered = entries.filter(entry => !listed(entry));
        if (order === 'encyclopedia') registered.sort((a, b) => encyclopedia[a.id] - encyclopedia[b.id] || a.id - b.id);
        for (const section of [registered, unregistered]) for (let start = 0; start < section.length; start += 24) pages.push({rarity, entries: section.slice(start, start + 24)});
      }
      return pages;
    },
  };
})();
