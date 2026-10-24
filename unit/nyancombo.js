/* Native combo arithmetic and first-row lineup rules. No page side effects. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Nyancombo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function normalize(roster) {
    const seen = new Set();
    return Array.from({length: 5}, (_, i) => {
      const member = roster?.[i];
      if (!member || !Number.isInteger(member.unitId) || member.unitId < 0
          || !Number.isInteger(member.form) || member.form < 1 || member.form > 4
          || seen.has(member.unitId)) return null;
      seen.add(member.unitId);
      return {...member};
    });
  }
  function active(roster, catalog) {
    return catalog.filter(combo => combo.members.every(required =>
      roster.some(member => member && member.unitId === required.unitId && member.form >= required.form)));
  }
  function merge(roster, combo) {
    const result = normalize(roster);
    for (const required of combo.members) {
      const i = result.findIndex(member => member?.unitId === required.unitId);
      if (i >= 0) {
        if (result[i].form < required.form) result[i] = {...required};
      } else {
        const empty = result.indexOf(null);
        if (empty < 0) return null;
        result[empty] = {...required};
      }
    }
    return result;
  }
  function effects(roster, catalog, unitId = null) {
    const result = {};
    for (const combo of active(roster, catalog)) {
      if (unitId !== null && combo.eligibleUnitIds && !combo.eligibleUnitIds.includes(unitId)) continue;
      result[combo.effectId] = (result[combo.effectId] || 0) + combo.value;
    }
    return result;
  }
  function cycleForm(roster, slotIndex, unitForms) {
    const result = normalize(roster);
    const member = result[slotIndex];
    const forms = member && unitForms[String(member.unitId)];
    if (!forms?.length) return result;
    const next = (forms.findIndex(form => form.form === member.form) + 1) % forms.length;
    result[slotIndex] = {...forms[next]};
    return result;
  }
  const stat = (value, percent) => Math.trunc(value * (100 + percent) / 100);
  const speed = (value, percent) => Math.trunc(value * 2 * (100 + percent) / 100) / 2;
  const research = (base, reduction, percent) => Math.max(60,
    base - reduction - Math.trunc(reduction * percent / 100));
  const duration = (base, fruit, percent) => stat(Math.trunc(base * (1500 + fruit) / 1500), percent);
  return {normalize, active, merge, effects, cycleForm, stat, speed, research, duration};
});
