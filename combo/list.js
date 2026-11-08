/* Search, categories, tooltips and cards extracted from unit_combo_settings.js. */
(() => {
  'use strict';
  const comboCatalog=window.NYANKODB_COMBO_CATALOG;
  const comboCategoryTabs=document.getElementById('comboCategoryTabs'),comboSubcategoryTabs=document.getElementById('comboSubcategoryTabs'),comboSearchInput=document.getElementById('comboSearchInput'),comboSearchStatus=document.getElementById('comboSearchStatus'),comboSearchResults=document.getElementById('comboSearchResults');
  let comboCategory=0,comboSubcategory=null;
  const comboTooltip=document.createElement('div');comboTooltip.className='combo-member-tooltip';comboTooltip.id='comboMemberTooltip';comboTooltip.setAttribute('popover','manual');comboTooltip.setAttribute('role','tooltip');document.body.append(comboTooltip);
  let comboTooltipOwner=null,comboTooltipDismissed=false;
    function hideComboTooltip() {
      if (comboTooltip.matches(':popover-open')) comboTooltip.hidePopover();
      comboTooltipOwner?.removeAttribute('aria-describedby');
      comboTooltipOwner = null;
    }

    function bindComboTooltip(element) {
      const show = event => {
        if (event.type === 'mouseenter' && comboTooltipDismissed) return;
        if (event.type === 'focus') comboTooltipDismissed = false;
        if (!element.dataset.tooltip) return;
        hideComboTooltip();
        comboTooltipOwner = element;
        element.setAttribute('aria-describedby', comboTooltip.id);
        comboTooltip.textContent = element.dataset.tooltip;
        comboTooltip.style.left = '0px';
        comboTooltip.style.top = '0px';
        comboTooltip.showPopover();
        const box = element.getBoundingClientRect();
        const tip = comboTooltip.getBoundingClientRect();
        const scale = tip.width / comboTooltip.offsetWidth || 1;
        const left = Math.max(8, Math.min(window.innerWidth-tip.width-8, box.left+(box.width-tip.width)/2));
        const top = box.top-tip.height-8 >= 8 ? box.top-tip.height-8 : Math.min(window.innerHeight-tip.height-8,box.bottom+8);
        comboTooltip.style.left = `${left/scale}px`;
        comboTooltip.style.top = `${top/scale}px`;
      };
      element.addEventListener('mouseenter', show);
      element.addEventListener('mouseleave', hideComboTooltip);
      element.addEventListener('focus', show);
      element.addEventListener('blur', hideComboTooltip);
    }

    function comboIcon(member) {
      const img = document.createElement('img');
      img.src = member ? member.icon : '../img/icon/empty_slot.png';
      img.alt = member ? member.name : '빈 슬롯';
      img.width = member ? 104 : 110;
      img.height = member ? 79 : 85;
      img.loading = 'lazy';
      return img;
    }

    function renderComboSubcategories() {
      comboSubcategoryTabs.replaceChildren();
      comboSubcategoryTabs.hidden = comboCatalog.categories[comboCategory].subcategories.length === 0;
      document.getElementById('comboSubcategoryGroup').hidden=comboSubcategoryTabs.hidden;
      if (comboSubcategoryTabs.hidden) return;
      const options = [{label:'전체', effectId:null}, ...comboCatalog.categories[comboCategory].subcategories];
      options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'filter-chip text-chip';
        button.type = 'button';
        button.textContent = option.label;
        button.setAttribute('aria-pressed', String(comboSubcategory === option.effectId));
        button.addEventListener('click', () => {
          comboSubcategory = option.effectId;
          [...comboSubcategoryTabs.children].forEach((tab, index) => {
            tab.setAttribute('aria-pressed', String(options[index].effectId === comboSubcategory));
          });
          renderComboSearch();
        });
        comboSubcategoryTabs.append(button);
      });
    }

    function renderComboSearch() {
      hideComboTooltip();
      const normalize = value => String(value).normalize('NFKC').toLocaleLowerCase().replace(/[\s·「」『』]/g, '');
      const query = normalize(comboSearchInput.value);
      const category = comboCatalog.categories[comboCategory];
      const matches = comboCatalog.combos.filter(combo => category.effects.includes(combo.effectId)
        && (comboSubcategory === null || combo.effectId === comboSubcategory)
        && (!query || normalize([combo.name, comboEffectText(combo), ...combo.members.map(m=>m.name), combo.id].join(' ')).includes(query)));
      document.getElementById('resetFilters').disabled=comboCategory===0&&comboSubcategory===null&&!comboSearchInput.value;
      comboSearchStatus.textContent = `${matches.length}개 냥콤보`;
      comboSearchResults.replaceChildren();
      matches.forEach(combo => {
        const row = document.createElement('article');
        row.className = 'nyancombo-card combo-result';
        row.dataset.comboId = combo.id;
        row.dataset.effectId = combo.effectId;
        const heading = document.createElement('header');
        heading.className = 'nyancombo-card-heading';
        const name = document.createElement('h3');
        name.className = 'combo-result-name';
        name.textContent = combo.name;
        const effect = document.createElement('p');
        effect.className = 'combo-result-effect';
        effect.textContent = comboEffectText(combo);
        const members = document.createElement('div');
        members.className = 'nyancombo-members';
        members.setAttribute('aria-label', `${combo.name} 구성 유닛`);
        combo.members.forEach(member => {
          const icon = document.createElement('a');
          icon.className = 'nyancombo-member';
          icon.href = `../unit/unit${String(member.unitId).padStart(3,'0')}.html?form=${member.form}`;
          icon.dataset.tooltip = member.name;
          icon.setAttribute('aria-label', member.name);
          const image = document.createElement('div');
          image.className = 'nyancombo-member-image';
          image.append(comboIcon(member));
          icon.append(image);
          bindComboTooltip(icon);
          members.append(icon);
        });
        const actions = document.createElement('div');
        actions.className = 'combo-result-actions';
        actions.append(effect);
        heading.append(name, actions);
        row.append(heading, members);
        comboSearchResults.append(row);
      });
      if (!matches.length) comboSearchStatus.textContent = '검색 결과 없음';
    }

    function comboEffectText(combo) {
      return combo.effect + (combo.restriction ? ` (${combo.restriction})` : '');
    }

    function renderComboCategories(){
      comboCategoryTabs.replaceChildren();
      comboCatalog.categories.forEach((category, index) => {
        const tab = document.createElement('button');
        tab.className = 'filter-chip text-chip';
        tab.type = 'button';
        tab.textContent = category.label;
        tab.setAttribute('aria-pressed', String(comboCategory === index));
        tab.addEventListener('click', () => {
          comboCategory = index;
          comboSubcategory = null;
          renderComboCategories();
          comboCategoryTabs.children[index].focus({preventScroll:true});
        });
        comboCategoryTabs.append(tab);
      });
      renderComboSubcategories();
      renderComboSearch();
    }

    const filterPanel=document.querySelector('.filter-panel'),filterBody=document.getElementById('filterBody'),filterCollapse=document.getElementById('filterCollapse'),filterCollapseText=document.getElementById('filterCollapseText');
    function syncFilterCollapse(){
      const collapsed=filterPanel.classList.contains('is-collapsed');
      filterBody.hidden=collapsed;filterCollapse.setAttribute('aria-expanded',String(!collapsed));filterCollapseText.textContent=collapsed?'펼치기':'접기';
    }
    filterCollapse.addEventListener('click',()=>{filterPanel.classList.toggle('is-collapsed');syncFilterCollapse();});
    document.getElementById('resetFilters').addEventListener('click',()=>{comboCategory=0;comboSubcategory=null;comboSearchInput.value='';renderComboCategories();});
    syncFilterCollapse();
    comboSearchInput.addEventListener('input', renderComboSearch);
    document.getElementById('comboSearchForm').addEventListener('submit', event => {
      event.preventDefault();
      renderComboSearch();
      comboSearchResults.querySelector('a.nyancombo-member')?.focus();
    });
    comboSearchInput.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        comboSearchResults.querySelector('a.nyancombo-member')?.focus();
      } else if (event.key === 'Escape') {
        comboSearchInput.value = '';
        renderComboSearch();
      }
    });
    comboSearchResults.addEventListener('keydown', event => {
      if (event.key === 'Escape') { comboSearchInput.focus(); return; }
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      const buttons = [...comboSearchResults.querySelectorAll('a.nyancombo-member')];
      const index = buttons.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      buttons[(index + (event.key === 'ArrowDown' ? 1 : buttons.length-1)) % buttons.length]?.focus();
    });
    window.addEventListener('resize', hideComboTooltip);
    document.addEventListener('scroll', hideComboTooltip, true);
    document.addEventListener('pointermove', () => { comboTooltipDismissed = false; });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        comboTooltipDismissed = true;
        hideComboTooltip();
      }
    }, true);

    renderComboCategories();
})();
