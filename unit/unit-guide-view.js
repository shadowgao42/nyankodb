(() => {
  'use strict';
  const guide=window.NyankoUnitGuide,catalog=window.NYANKODB_UNIT_CATALOG;
  if(!guide||!catalog)return;
  const $=id=>document.getElementById(id),el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const modes=[...document.querySelectorAll('[data-display-mode]')],group=$('groupUnits').closest('label'),status=$('resultStatus'),scroll=$('resultsScroll');
  const toggle=el('button','display-button','도감');toggle.type='button';toggle.dataset.displayMode='guide';toggle.setAttribute('aria-pressed','false');modes[0].parentElement.append(toggle);
  const root=el('div','unit-guide');root.id='guideResults';root.hidden=true;scroll.append(root);
  const controls=el('div','guide-controls'),nav=el('div','editor-unit-pagination'),previous=el('button','action'),counter=el('span','owned-count'),next=el('button','action'),list=el('div');
  previous.type=next.type='button';previous.id='guidePrevious';next.id='guideNext';counter.id='guidePage';counter.setAttribute('role','status');counter.setAttribute('aria-live','polite');previous.setAttribute('aria-label','이전 페이지');next.setAttribute('aria-label','다음 페이지');previous.append(el('span','editor-pagination-arrow','‹'));next.append(el('span','editor-pagination-arrow','›'));nav.append(previous,counter,next);controls.append(nav);root.append(controls,list);
  const summoned=guide.summonedIds(catalog),available=guide.units(catalog).filter(entry=>!summoned.has(entry.id)),encyclopedia=window.NYANKODB_UNIT_ENCYCLOPEDIA?.entries||{};
  const rarityIcons=new Map(['기본','EX','레어','슈퍼 레어','울트라 슈퍼 레어','레전드 레어'].map((rarity,i)=>[rarity,153+i]));
  let active=false,page=0,pages=[],filtered=window.NyankoUnitIndexFiltered||catalog.entries,baseMode='two',baseStatus=status.textContent,count=0;
  const tip=el('div','unit-guide-tooltip');tip.hidden=true;tip.setAttribute('role','tooltip');document.body.append(tip);
  function hideTip(){tip.hidden=true;}
  function showTip(link){tip.textContent=link.dataset.tooltip;tip.hidden=false;const r=link.getBoundingClientRect(),zoom=Number(getComputedStyle(document.body).zoom)||1;tip.style.left=`${Math.max(8,Math.min(r.left,innerWidth-tip.getBoundingClientRect().width-12))/zoom}px`;tip.style.top=`${Math.max(8,r.top-tip.getBoundingClientRect().height-8)/zoom}px`;}
  function sync(){root.hidden=!active;$('unitResults').hidden=active||baseMode==='range';$('rangeResults').hidden=active||baseMode!=='range';group.hidden=active||baseMode==='range';toggle.setAttribute('aria-pressed',String(active));for(const button of modes)button.setAttribute('aria-pressed',String(!active&&button.dataset.displayMode===baseMode));status.textContent=active?`${count.toLocaleString('ko-KR')}종`:baseStatus;}
  function render(){
    hideTip();page=Math.min(page,Math.max(0,pages.length-1));previous.disabled=page===0;next.disabled=page+1>=pages.length;counter.textContent=`${count.toLocaleString('ko-KR')}종 · ${count?page+1:0} / ${pages.length}`;list.replaceChildren();
    const current=pages[page];if(!current){list.append(el('p','empty-results','조건에 맞는 유닛이 없습니다.'));sync();return;}
    const section=el('section','required-unit-rarity-group'),heading=el('h3','required-unit-rarity-title'),grid=el('div','nyancombo-members'),iconId=rarityIcons.get(current.rarity);
    if(iconId!==undefined){const icon=el('img');icon.src=`../img/i/${iconId}.png`;icon.alt=current.rarity;icon.width=90;icon.height=28;heading.append(icon);}else heading.textContent=current.rarity;
    for(const entry of current.entries){const box=el('div','owned-entry'),link=el('a','nyancombo-member'),frame=el('span','nyancombo-member-image'),image=el('img');link.href=`unit${String(entry.id).padStart(3,'0')}.html?form=${entry.form}`;link.dataset.unitId=entry.id;link.dataset.tooltip=entry.name;link.setAttribute('aria-label',entry.name);image.src='../'+entry.icon.replace(/^\.\.\//,'');image.alt='';image.width=104;image.height=79;image.loading='lazy';frame.append(image);link.append(frame);box.append(link);grid.append(box);link.addEventListener('pointerenter',()=>showTip(link));link.addEventListener('pointerleave',hideTip);link.addEventListener('focus',()=>showTip(link));link.addEventListener('blur',hideTip);}
    section.append(heading,grid);list.append(section);sync();
  }
  function rebuild(reset=false){const hits=new Set(filtered.map(entry=>Number(entry.id))),matches=available.filter(entry=>hits.has(entry.id));count=matches.length;pages=guide.pages(matches,catalog.rarities,encyclopedia,'encyclopedia');if(reset)page=0;render();}
  previous.addEventListener('click',()=>{if(page){page--;render();scroll.scrollTop=0;}});next.addEventListener('click',()=>{if(page+1<pages.length){page++;render();scroll.scrollTop=0;}});
  toggle.addEventListener('click',()=>{active=true;rebuild();});
  for(const button of modes)button.addEventListener('click',()=>{active=false;sync();hideTip();});
  addEventListener('nyanko-unit-index-filtered',event=>{filtered=event.detail.filtered;baseMode=event.detail.displayMode;baseStatus=status.textContent;if(active)rebuild(event.detail.resetScroll);});
  scroll.addEventListener('scroll',hideTip);addEventListener('resize',hideTip);document.addEventListener('keydown',event=>{if(event.key==='Escape')hideTip();});
})();
