/* Shared native-order medal icons and click tooltip; no account mutations. */
(() => {
  'use strict';
  const sectionStarts=[201,350,401,600,901];
  const sectionOf=entry=>sectionStarts.filter(start=>entry.native.line>=start).length;
  function create({root, idPrefix='medal', tooltipId='medalTooltip'}){
    const results=root;
  const tooltip=document.createElement('div');
  tooltip.id=tooltipId;tooltip.className='medal-tooltip';tooltip.setAttribute('popover','manual');tooltip.setAttribute('role','tooltip');document.body.append(tooltip);
  let owner=null;
  function hideTooltip(){
    if(tooltip.matches(':popover-open'))tooltip.hidePopover();
    owner?.removeAttribute('aria-describedby');owner?.setAttribute('aria-expanded','false');owner=null;
  }
  function toggleTooltip(button,entry){
    if(owner===button){hideTooltip();return;}
    hideTooltip();owner=button;button.setAttribute('aria-describedby',tooltip.id);button.setAttribute('aria-expanded','true');
    const name=document.createElement('p');name.className='medal-tooltip-name';name.textContent=entry.name;
    const description=document.createElement('p');description.className='medal-tooltip-description';description.textContent=entry.description;
    tooltip.replaceChildren(name,description);tooltip.style.left='0px';tooltip.style.top='0px';tooltip.showPopover();
    const box=button.getBoundingClientRect(),tip=tooltip.getBoundingClientRect(),scale=tip.width/tooltip.offsetWidth||1;
    const left=Math.max(8,Math.min(window.innerWidth-tip.width-8,box.left+(box.width-tip.width)/2));
    const top=box.top-tip.height-8>=8?box.top-tip.height-8:Math.min(window.innerHeight-tip.height-8,box.bottom+8);
    tooltip.style.left=`${left/scale}px`;tooltip.style.top=`${top/scale}px`;
  }
  document.addEventListener('click',event=>{if(owner&&!owner.contains(event.target)&&!tooltip.contains(event.target))hideTooltip();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hideTooltip();});
  document.addEventListener('scroll',hideTooltip,true);window.addEventListener('resize',hideTooltip);

    function render(entries,{ownedIds=null}={}){
      hideTooltip();results.replaceChildren();
      let previousSection=null;
      for(const entry of entries){
        const section=sectionOf(entry);
        if(previousSection!==null&&previousSection!==section){const separator=document.createElement('hr');separator.className='medal-separator';results.append(separator);}
        previousSection=section;
        const button=document.createElement('button');button.type='button';button.className='medal-card';button.dataset.medalId=entry.id;button.id=`${idPrefix}-${entry.id}`;if(ownedIds)button.dataset.owned=String(ownedIds.has(entry.id));button.setAttribute('aria-label',`${entry.name}${ownedIds&&!ownedIds.has(entry.id)?' · 미보유':''}`);button.setAttribute('aria-expanded','false');
        const icon=document.createElement('img');icon.src=entry.icon;icon.width=icon.height=112;icon.alt='';icon.loading='lazy';button.append(icon);
        button.addEventListener('click',()=>toggleTooltip(button,entry));results.append(button);
      }
    }
    return Object.freeze({render,hide:hideTooltip});
  }
  window.NyankoMedalGuide=Object.freeze({create});
})();
