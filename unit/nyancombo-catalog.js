(function (root) {
  'use strict';
  function renderNativeCombos(unitId, catalog) {
    const panel = root.document.getElementById('nyancomboPanel');
    if (!panel) return;
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
  }
  root.NyankoComboCatalog = { renderNativeCombos };
})(window);
