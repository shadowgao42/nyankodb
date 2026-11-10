(() => {
  'use strict';
  const D=window.ROGUELIKE_DATA,M=window.RogueGuide,$=id=>document.getElementById(id);
  const key='nyankodb:roguelike-guide:v1',uiKey='nyankodb:roguelike-guide-ui:v1';
  const rarities=['기본','EX','레어','슈퍼 레어','울트라 슈퍼 레어','레전드 레어'];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=n=>Number(n).toLocaleString('ko-KR');
  let state=M.fresh(D),quick=false,mapView='initial',activePanel='rules',inspectedSlot=null,referenceOpener=null;
  try {
    const saved=JSON.parse(localStorage.getItem(key)||'null'),s=saved?.state;
    if(s?.schema===1&&D.maps.some(m=>m.id===s.mapId)&&s.stage>=0&&s.stage<M.mapFor(D,s).stages.length&&Array.isArray(s.team)&&s.team.length<=10&&s.team.every(c=>D.units[c.id])&&['map','clear','characters','replace','buffs','defeat','finished'].includes(s.view)&&s.points>=0&&D.caps.includes(s.cap)&&Object.keys({...s.buffs,...s.permanent}).every(id=>D.buffs[id])) {state=s;quick=!!saved.quick;}
  } catch (_) {}
  state.ownedUnits=M.ownership(D,state);delete state.owned;
  function save(){try{localStorage.setItem(key,JSON.stringify({state,quick}));}catch(_) {}}
  function announce(message){$('practiceStatus').textContent=message;}
  function unitName(id){const u=D.units[id];return u.forms[2]?.name||u.forms[1].name;}
  function unitLink(id,form=2,base=20,plus=0){return `../unit/unit${String(id).padStart(3,'0')}.html?form=${form}&level=${base}&plus=${plus}&ft=333333333&research=20.10&event=rougelike`;}
  function rarityIcon(rarity){return `<img class="rarity-icon" src="../img/i/${153+Number(rarity)}.png" alt="${esc(rarities[rarity])}" width="90" height="28">`;}
  function target(buff){return buff.TargetCharaID!==undefined?unitName(buff.TargetCharaID):buff.TargetRarity>=0?rarities[buff.TargetRarity]:'전체';}
  function buffValue(id,level=1){
    const b=D.buffs[id],skill=D.skills[b.BuffSkillID];
    if(b.BuffType===0)return `레벨 +${b.LevelUp*level}`;
    if(!skill)return b.label;
    const p=skill.Parameters||[],value=p.length?Math.trunc(p[0]+(p[1]-p[0])*(Math.min(level,skill.MaxLevel)-1)/Math.max(1,skill.MaxLevel-1)):null;
    if([31,32].includes(skill.AbilityID))return `+${value}%`;
    if(skill.AbilityID===27)return '이동 속도 상승';
    if([61,1000,1012,1013].includes(skill.AbilityID))return `${[61,1000,1012].includes(skill.AbilityID)?'−':'+'}${value}%`;
    if(skill.AbilityID===1009)return `추가 ${value}체`;
    if(['200','201','202','203','204','205','300','600'].includes(b.nameKey))return '해방';
    if(['400','500'].includes(b.nameKey))return `+${value}%`;
    return value===null?'해방':`발동 확률 ${value}%`;
  }
  const attributeIcons={'200':219,'201':220,'202':221,'203':223,'204':224,'205':225};
  function buffIcon(b){const id=attributeIcons[b.nameKey];return id?`../img/i/${id}.png`:b.icon;}
  function abilityImage(src){return src?`<span class="ability-icon"><img src="${esc(src)}" alt="" loading="lazy"></span>`:'';}
  function listedBuffImage(b,kind='ability-icon'){
    const icon=buffIcon(b),unit=b.TargetCharaID===undefined?null:D.units[b.TargetCharaID];
    if(!unit)return icon?`<span class="${kind}"><img src="${esc(icon)}" alt="" loading="lazy"></span>`:'';
    const form=unit.forms[2]||unit.forms[1];
    return `<span class="${kind}"><span class="rogue-powerup-composite"><img class="rogue-powerup-unit" src="${esc(form.icon)}" alt="${esc(form.name)}" loading="lazy">${icon?`<img class="rogue-powerup-badge" src="${esc(icon)}" alt="" loading="lazy">`:''}</span></span>`;
  }
  function saveUI(){try{localStorage.setItem(uiKey,JSON.stringify({schema:1,panel:activePanel,mapView,referenceMap:$('mapReferenceSelect').value,buffMap:$('buffMap').value,query:$('buffSearch').value,rewardRange:$('rewardRange').value}));}catch(_) {}}
  function applyUI(){
    let ui={};try{const saved=JSON.parse(localStorage.getItem(uiKey)||'null');if(saved?.schema===1)ui=saved;}catch(_) {}
    activePanel=['rules','practice','maps','powerups','rewards'].includes(ui.panel)?ui.panel:'rules';mapView=['initial','candidates','stages'].includes(ui.mapView)?ui.mapView:'initial';
    for(const [id,value] of [['mapReferenceSelect',ui.referenceMap],['buffMap',ui.buffMap],['rewardRange',ui.rewardRange]])if([...$(id).options].some(option=>option.value===String(value)))$(id).value=String(value);
    if(typeof ui.query==='string')$('buffSearch').value=ui.query;
    choosePanel(activePanel,false);renderMapReference();renderBuffs();renderRewards();
  }
  function choosePanel(id,persist=true){
    activePanel=id;
    hideUnitTooltip();$('practiceSettings').hidden=id!=='practice';
    document.querySelectorAll('.manual-panel').forEach(panel=>{panel.hidden=panel.id!==id;});
  document.querySelectorAll('[data-panel]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.panel===id)));if(persist)saveUI();
  }
  function syncSummary(details){
    const label=details.querySelector('.settings-toggle-label');
    if(label)label.textContent=details.open?'접기':'펼치기';
  }
  document.querySelectorAll('.settings-box').forEach(details=>{
    const summary=details.querySelector('summary'),label=summary.textContent;
    summary.innerHTML=`<span>${esc(label)}</span><span class="settings-toggle-control"><span class="settings-toggle-label">펼치기</span><span class="settings-toggle-arrow" aria-hidden="true">▾</span></span>`;
    details.addEventListener('toggle',()=>syncSummary(details));
  });
  function profile(member){
    return `<div class="member-profile"><img class="unit-portrait" src="${esc(member.icon)}" alt=""><div><h3>${esc(member.name)}</h3>${rarityIcon(member.rarity)}<p>${member.form}단 형태 · Lv.${member.base}${member.plus?'+'+member.plus:''}</p><a class="db-button" href="${unitLink(member.id,member.form,member.base,member.plus)}">캐릭터 정보</a></div></div>`;
  }
  function revealInspector(element){element.focus({preventScroll:true});element.scrollIntoView?.({block:'nearest'});}
  function inspectMember(index,reveal=false){
    const member=state.team[index];if(!member)return;
    inspectedSlot=index;$('memberDetail').innerHTML=profile(M.memberInfo(D,state,member));$('memberInspector').hidden=false;if(reveal)revealInspector($('memberInspector'));
  }
  function bonusList(values){
    const entries=Object.entries(values).filter(([,count])=>count>0);
    if(!entries.length)return '<p class="muted-note">없음</p>';
    return `<ul class="bonus-list">${entries.map(([id,count])=>{const b=D.buffs[id];return `<li>${listedBuffImage(b,'bonus-icon')}<span><b>${esc(b.label)}</b><small>${esc(target(b))} · ${esc(buffValue(id,count))} · 획득 ${count}회</small></span></li>`;}).join('')}</ul>`;
  }
  function renderBonus(){
    const upcoming=M.earned(D,state.points,M.mapFor(D,state));
    $('bonusReference').innerHTML=`<section class="bonus-group"><h3>이번 도전의 파워 업</h3>${bonusList(state.buffs)}</section><section class="bonus-group"><h3>이번 도전에 적용된 지속 보너스</h3>${bonusList(state.permanent)}</section>${JSON.stringify(upcoming)!==JSON.stringify(state.permanent)?`<section class="bonus-group"><h3>다음 도전에 적용될 지속 보너스</h3>${bonusList(upcoming)}</section>`:''}`;
  }
  function openDialog(title,body,actions){
    $('dialogTitle').textContent=title;$('dialogBody').innerHTML=body;$('dialogActions').replaceChildren();
    for(const action of actions){
      const button=document.createElement('button');button.type='button';button.className='db-button';button.textContent=action.text;
      button.addEventListener('click',()=>{$('guideDialog').close();if(action.run){action.run();$('gameMain').focus({preventScroll:true});}});
      $('dialogActions').append(button);
    }
    $('guideDialog').showModal();
  }
  function confirm(title,body,run){if(quick){run();return;}openDialog(title,body,[{text:'취소'},{text:'확인',run}]);}
  const lessons=[
    ['이벤트 전용 편성','캐릭터를 눌러 레벨과 형태를 확인해 보세요. 준비되면 「클리어 화면 보기」를 누르세요.'],
    ['클리어 결과','승리한 스테이지의 이벤트Pt가 누적됩니다. 「캐릭터 선택」으로 넘어가세요.'],
    ['세 후보에서 하나 선택','캐릭터를 눌러 선택한 뒤 「획득」을 누르세요. 보유하지 않은 캐릭터도 후보로 나옵니다.'],
    ['편성 교체','10자리가 모두 차 있습니다. 편성에서 내보낼 캐릭터를 하나 고르세요. 이번 도전에서는 다시 편성할 수 없습니다.'],
    ['파워 업 선택','이번에는 파워 업을 고릅니다. 「레벨 업」은 전체 캐릭터의 레벨을 5 올립니다. 획득한 효과는 이번 도전에서 유지됩니다.'],
    ['적용된 보너스 확인','「보너스 확인」을 열어 방금 획득한 효과를 확인하세요. 누적Pt 보상의 지속 보너스는 다음 도전부터 적용됩니다.'],
    ['자유롭게 체험하기','다음 스테이지를 클리어하거나, 다른 맵·패배·새 도전을 체험해 보세요.']
  ];
  function renderLesson(){
    $('lesson').hidden=!state.tutorial;$('freeOptions').hidden=state.tutorial;
    const index=Math.min(state.lesson,6);$('lessonStep').textContent=`${index+1} / 7`;$('lessonTitle').textContent=lessons[index][0];$('lessonText').textContent=lessons[index][1];$('finishTutorial').hidden=index<6;
  }
  function choiceCard(id,characters){
    if(characters){
      const raw=D.chars[id],c=M.memberInfo(D,state,{id:raw.CharaID,level:raw.Level,form:1});
      return `<button type="button" class="ability-card choice-card" data-tooltip="${esc(c.name)}" data-choice="${id}" aria-pressed="${state.selected===id}" aria-label="${esc(c.name)} 선택"><span class="choice-unit">${abilityImage(c.icon)}<small>Lv.${c.base}${c.plus?'+'+c.plus:''}</small></span><span>${rarityIcon(c.rarity)}</span></button>`;
    }
    const b=D.buffs[id],before=M.buffLevel(state,id);
    return `<button type="button" class="ability-card choice-card${buffIcon(b)||b.TargetCharaID!==undefined?'':' no-icon'}" data-choice="${id}" aria-pressed="${state.selected===id}" aria-label="${esc(b.label)} 선택">${listedBuffImage(b)}<span><strong class="ability-title">${esc(b.label)}</strong><span class="ability-summary">${esc(buffValue(id,before+1))}</span><span class="ability-note">${esc(target(b))} · ${before?`Lv.${before} → ${before+1}`:'해방'}</span></span></button>`;
  }
  function renderFormation(){
    hideUnitTooltip();
    $('teamNote').textContent=state.view==='replace'?'교체할 캐릭터 선택':`${state.team.length} / 10`;
    $('teamSlots').classList.toggle('is-replacing',state.view==='replace');
    $('teamSlots').innerHTML=Array.from({length:10},(_,index)=>{
      const member=state.team[index];
      if(!member)return '<button type="button" class="fixed-formation-slot" disabled aria-label="빈 편성 자리"><span class="nyancombo-member"><img src="../img/icon/empty_slot.png" alt=""></span></button>';
      const c=M.memberInfo(D,state,member);
      return `<button type="button" class="fixed-formation-slot" data-slot="${index}" data-tooltip="${esc(c.name)}" aria-label="${esc(c.name)} ${state.view==='replace'?'교체':'정보'}"><span class="nyancombo-member"><img src="${esc(c.icon)}" alt=""></span><small>Lv.${c.base}${c.plus?'+'+c.plus:''}</small></button>`;
    }).join('');
    if(inspectedSlot!==null&&state.team[inspectedSlot])inspectMember(inspectedSlot);else $('memberInspector').hidden=true;
  }
  function ownershipCandidates(){return [...new Set(D.maps.flatMap(map=>[...map.initial.map(c=>c.id),...map.chars.map(id=>D.chars[id].CharaID)]))];}
  function renderOwnership(){
    const ids=ownershipCandidates();
    $('ownedUnits').innerHTML=`<div class="required-unit-groups candidate-groups">${rarities.map((rarity,index)=>{
      const members=ids.filter(id=>D.units[id].rarity===index);
      return members.length?`<section class="required-unit-rarity-group"><h3 class="required-unit-rarity-title">${rarityIcon(index)}</h3><div class="nyancombo-members">${members.map(id=>{const u=D.units[id],f=u.forms[2]||u.forms[1];return `<div class="required-unit-compact-entry"><button type="button" class="nyancombo-member owned-unit" data-owned-unit="${id}" data-tooltip="${esc(f.name)}" aria-label="${esc(f.name)} 보유" aria-pressed="${M.owns(D,state,id)}"><span class="nyancombo-member-image"><img src="${esc(f.icon)}" alt="" width="104" height="79"></span>${M.owns(D,state,id)?'<span class="picker-owned-label">보유</span>':''}</button></div>`;}).join('')}</div></section>`:'';
    }).join('')}</div>`;
  }
  function render(focus){
    const oldFocus=$('gameMain').contains(document.activeElement)||$('teamSlots').contains(document.activeElement);
    const map=M.mapFor(D,state),stage=map.stages[state.stage];
    $('gameMap').textContent=map.name;$('stagePosition').textContent=`${state.stage+1} / ${map.stages.length}`;$('totalPoints').textContent=`${fmt(state.points)} Pt`;
    $('mapSelect').value=state.mapId;$('mapSelect').disabled=state.tutorial;$('pointCap').value=state.cap;$('quickConfirm').checked=quick;
    for(const option of $('pointCap').options)option.disabled=Number(option.value)<state.points;
    renderOwnership();renderFormation();renderBonus();
    if(state.view==='map'){
      $('gameMain').innerHTML=`<h3 class="step-heading">${esc(stage.name)}</h3><p class="step-description">기본 보상 ${fmt(stage.points)}Pt · 편성 보너스 +${M.pointRate(D,state)-100}%</p><button type="button" class="db-button" data-action="win">클리어 화면 보기</button>`;
    }else if(state.view==='clear'){
      $('gameMain').innerHTML=`<div class="run-result"><h3>스테이지 클리어!</h3><strong class="result-value">+${fmt(state.lastPoints)} Pt</strong><p>기본 ${fmt(state.lastBase)}Pt · 편성 보너스 +${(state.lastRate??M.pointRate(D,state))-100}%</p><p>${state.points>=state.cap?'현재 이벤트Pt 상한에 도달했습니다.':'캐릭터와 파워 업을 선택합니다.'}</p></div><div class="button-row scene-buttons"><button type="button" class="db-button" data-action="next">${state.stage===map.stages.length-1?'도전 결과 보기':'캐릭터 선택'}</button></div>`;
    }else if(['characters','buffs'].includes(state.view)){
      const characters=state.view==='characters';
      $('gameMain').innerHTML=`<h3 class="step-heading">${characters?'캐릭터 선택':'파워 업 선택'}</h3><div class="choices">${state.offers.map(id=>choiceCard(id,characters)).join('')}</div>${state.offers.length?'':'<p class="empty-state">획득할 수 있는 후보가 없습니다.</p>'}<div class="button-row scene-buttons"><button type="button" class="db-button" data-action="acquire" ${state.selected===null?'disabled':''}>획득</button><button type="button" class="db-button" data-action="skip">건너뛰기</button></div>`;
    }else if(state.view==='replace'){
      const c=D.chars[state.pending];
      $('gameMain').innerHTML=`<h3 class="step-heading">편성 교체</h3><div class="run-result"><h3>${esc(unitName(c.CharaID))} 영입</h3><p>편성에서 내보낼 캐릭터를 누르세요.</p><p>내보낸 캐릭터는 이번 도전에서 다시 편성할 수 없습니다.</p></div><div class="button-row scene-buttons"><button type="button" class="db-button" data-action="cancelReplace">후보로 돌아가기</button></div>`;
    }else{
      $('gameMain').innerHTML=`<div class="run-result"><h3>${state.view==='finished'?'완전 승리!':'도전 종료'}</h3><p>이번 도전의 캐릭터와 파워 업이 초기화되었습니다.</p><p>누적 ${fmt(state.points)}Pt와 획득한 지속 보너스는 유지됩니다.</p></div><div class="button-row scene-buttons"><button type="button" class="db-button" data-action="restart">다시 도전</button></div>`;
    }
    renderLesson();save();
    if(focus)document.querySelector(focus)?.focus({preventScroll:true});else if(oldFocus)$('gameMain').focus({preventScroll:true});
  }
  function restart(mapId=state.mapId){inspectedSlot=null;state=M.fresh(D,{mapId,points:state.points,ownedUnits:M.ownership(D,state),tutorial:false,cap:state.cap});render();announce('새 도전의 편성과 지속 보너스를 적용했습니다.');}
  function acquire(){
    const id=state.selected;if(id===null)return;
    if(state.view==='characters')confirm('캐릭터 획득',`<p>${esc(unitName(D.chars[id].CharaID))}을(를) 영입할까요?</p>`,()=>{inspectedSlot=null;M.chooseCharacter(D,state,id);render();announce(state.view==='replace'?'교체할 캐릭터를 선택하세요.':'캐릭터를 영입했습니다.');});
    else if(state.view==='buffs')confirm('파워 업 획득',`<p>${esc(D.buffs[id].label)} · ${esc(target(D.buffs[id]))}<br>${esc(buffValue(id,M.buffLevel(state,id)+1))}</p>`,()=>{M.chooseBuff(D,state,id);render();announce('파워 업이 적용되었습니다.');});
  }
  function stageEnemyIcons(enemies){
    const number=value=>Number(value).toLocaleString('ko-KR',{maximumFractionDigits:5});
    const range=(values,bosses=[])=>{const highlight=(text,boss)=>boss?`<span class="location-boss-magnification">${text}</span>`:text,isBoss=value=>bosses.some(b=>Math.abs(b-value)<1e-9);return values[0]===values[1]?highlight(`${number(values[0])}%`,isBoss(values[0])):highlight(number(values[0]),isBoss(values[0]))+highlight('~',bosses.some(b=>b>values[0]&&b<values[1]))+highlight(`${number(values[1])}%`,isBoss(values[1]));};
    return enemies.map(enemy=>{const level=enemy.levels[0],health=range(level.health,level.bossHealth),attack=range(level.attack,level.bossAttack),same=level.health.every((v,i)=>Math.abs(v-level.attack[i])<1e-9)&&health===attack;
      const params=new URLSearchParams({health:level.health[0],attack:level.attack[0]});return `<div class="location-enemy" data-enemy-id="${enemy.enemyId}" data-boss="${Boolean(enemy.bossFlag)}"><a href="../enemy/enemy${String(enemy.enemyId).padStart(3,'0')}.html?${params}" data-tooltip="${esc(enemy.name)}" aria-label="${esc(enemy.name)}"><img src="../${esc(enemy.icon)}" alt="${esc(enemy.name)}" loading="lazy"></a><span class="location-magnification">${same?health:`<span class="location-magnification-line">체력 ${health}</span><span class="location-magnification-line">공격력 ${attack}</span>`}</span></div>`;}).join('');
  }
  function renderMapReference(){
    hideUnitTooltip();
    const map=D.maps.find(m=>m.id===Number($('mapReferenceSelect').value));
    const unlock=map.unlock?`${D.maps.find(m=>m.id===map.unlock.map).name}의 첫 스테이지 클리어`:'처음부터 도전 가능';
    let body='';
    if(mapView==='stages')body=`<div class="location-stages">${window.ROGUELIKE_STAGES[map.code].stages.map((entry,index)=>`<article class="location-stage" data-stage-id="${esc(entry.id)}"><div class="location-stage-heading"><a class="location-stage-name" href="../${esc(entry.href)}">${esc(entry.name)}</a><span class="location-stage-energy">통솔력 <strong>${fmt(entry.energy)}</strong></span><span class="location-stage-energy">기본Pt <strong>${fmt(map.stages[index].points)}</strong></span></div><div class="location-enemies">${stageEnemyIcons(entry.enemies)}</div></article>`).join('')}</div>`;
    else if(mapView==='initial'){
      body=`<div class="fixed-formation-grid map-initial-formation">${map.initial.map(c=>{const u=D.units[c.id],f=u.forms[c.form]||u.forms[1];return `<button type="button" class="fixed-formation-slot" data-reference-unit="${c.id}" data-form="${c.form}" data-level="${c.level}" data-tooltip="${esc(f.name)}" aria-label="${esc(f.name)} Lv.${c.level}"><span class="nyancombo-member"><span class="nyancombo-member-image"><img src="${esc(f.icon)}" alt="" width="104" height="79"></span></span><small>Lv.${c.level}</small></button>`;}).join('')}</div>`;
    }else{
      body=`<div class="required-unit-groups candidate-groups">${rarities.map((rarity,index)=>{
        const members=map.chars.map(id=>D.chars[id]).filter(c=>D.units[c.CharaID].rarity===index);
        if(!members.length)return '';
        return `<section class="required-unit-rarity-group"><h3 class="required-unit-rarity-title">${rarityIcon(index)}</h3><div class="nyancombo-members" aria-label="${esc(rarity)} 캐릭터 후보">${members.map(c=>{const u=D.units[c.CharaID],f=u.forms[2]||u.forms[1];return `<div class="required-unit-compact-entry"><a class="nyancombo-member" data-candidate-unit="${c.CharaID}" href="${unitLink(c.CharaID,2,c.Level,0)}" data-tooltip="${esc(f.name)}" aria-label="${esc(f.name)} Lv.${c.Level}"><div class="nyancombo-member-image"><img src="${esc(f.icon)}" alt="" width="104" height="79"></div></a><small>Lv.${c.Level}</small></div>`;}).join('')}</div></section>`;
      }).join('')}</div>`;
    }
    $('mapReference').innerHTML=`<div class="reference-summary"><strong>${esc(map.name)}</strong><span>${map.stages.length}스테이지 · 캐릭터 ${map.chars.length}종 · 파워 업 ${map.buffs.length}종</span><a class="db-button" href="../stage/${map.code}/index.html">스테이지 정보</a></div><p class="muted-note">해방 조건: ${esc(unlock)}</p>${body}`;
    $('referenceInspector').hidden=true;referenceOpener=null;
    document.querySelectorAll('[data-map-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mapView===mapView)));
  }
  function renderBuffs(){
    const map=D.maps.find(m=>m.id===Number($('buffMap').value)),query=$('buffSearch').value.normalize('NFKC').toLowerCase();
    const rows=map.buffs.filter(id=>{const b=D.buffs[id];return `${b.label} ${target(b)}`.normalize('NFKC').toLowerCase().includes(query);});
    $('buffCount').textContent=`${rows.length}종 / 전체 ${map.buffs.length}종`;
    $('buffRows').innerHTML=rows.length?rows.map(id=>{const b=D.buffs[id];return `<article class="ability-card${buffIcon(b)||b.TargetCharaID!==undefined?'':' no-icon'}" data-buff="${id}">${listedBuffImage(b)}<div><h3>${esc(b.label)}</h3><p class="ability-summary">${esc(buffValue(id))}</p><p class="ability-note">${esc(target(b))}</p><div class="ability-meta"><span>최대 ${b.Limit}회</span><span>가중치 ${D.weights[b.Rarity]}</span></div></div></article>`;}).join(''):'<p class="empty-state">검색 결과가 없습니다.</p>';
  }
  function renderRewards(){
    const ranges=[[0,150000],[150000,350000],[350000,600000],[600000,Infinity]],filter=$('rewardRange').value;
    const rows=D.rewards.filter(r=>filter==='all'||r.Point>ranges[Number(filter)][0]&&r.Point<=ranges[Number(filter)][1]);
    $('rewardCount').textContent=`${rows.length}개 / 전체 ${D.rewards.length}개`;
    $('rewardReference').innerHTML=rows.map(r=>{
      const b=r.Type===2?D.buffs[r.ID]:null,scope=b?D.maps.filter(m=>m.permanent.includes(r.ID)).map(m=>m.name).join(' · '):'';
      const content=b?`${listedBuffImage(b,'stage-reward-item')}<span class="stage-reward-copy"><strong>${esc(b.label)}</strong><em>${esc(buffValue(r.ID))}</em><small>${esc(target(b))} · 지속 보너스<br>${esc(scope)}</small></span>`:`<span class="stage-reward-item"><img src="${esc(D.itemIcons[r.ID])}" alt="" loading="lazy"></span><span class="stage-reward-copy"><strong>${esc(D.items[r.ID])}</strong><em>×${fmt(r.Quantity)}</em></span>`;
      return `<article class="reward-entry" data-reward-point="${r.Point}"><span class="reward-point">${fmt(r.Point)} Pt</span>${b?`<div class="stage-reward-entry">${content}</div>`:`<a class="stage-reward-entry" href="../item/item${String(r.ID).padStart(3,'0')}.html">${content}</a>`}</article>`;
    }).join('');
  }
  let unitTooltipTarget=null;
  const unitTooltip=document.createElement('div');
  unitTooltip.id='rogueUnitTooltip';unitTooltip.className='item-icon-tooltip';unitTooltip.setAttribute('role','tooltip');unitTooltip.hidden=true;document.body.append(unitTooltip);
  function hideUnitTooltip(){
    if(unitTooltipTarget){const ids=(unitTooltipTarget.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==unitTooltip.id);if(ids.length)unitTooltipTarget.setAttribute('aria-describedby',ids.join(' '));else unitTooltipTarget.removeAttribute('aria-describedby');}
    unitTooltipTarget=null;unitTooltip.dataset.open='false';unitTooltip.hidden=true;
  }
  function placeUnitTooltip(){
    if(!unitTooltipTarget?.isConnected){hideUnitTooltip();return;}
    if(unitTooltip.hidden)return;
    const zoom=Number.parseFloat(getComputedStyle(document.body).zoom)||1;
    const anchor=unitTooltipTarget.querySelector('.nyancombo-member')||unitTooltipTarget;
    const rect=anchor.getBoundingClientRect(),box=unitTooltip.getBoundingClientRect();
    const left=Math.max(12,Math.min(rect.left,window.innerWidth-box.width-12));
    let top=rect.top-box.height-8*zoom;if(top<12)top=rect.bottom+8*zoom;
    top=Math.max(12,Math.min(top,window.innerHeight-box.height-12));
    unitTooltip.style.left=`${left/zoom}px`;unitTooltip.style.top=`${top/zoom}px`;
  }
  function showUnitTooltip(target){
    if(!target?.dataset.tooltip)return;
    hideUnitTooltip();unitTooltipTarget=target;unitTooltip.textContent=target.dataset.tooltip;unitTooltip.hidden=false;placeUnitTooltip();unitTooltip.dataset.open='true';
    const ids=(target.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);ids.push(unitTooltip.id);target.setAttribute('aria-describedby',ids.join(' '));
  }
  const tooltipTarget=target=>target.closest?.('#mapReference [data-tooltip], #teamSlots [data-tooltip], #gameMain [data-tooltip], #ownedUnits [data-tooltip]');
  document.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const target=tooltipTarget(event.target);if(target&&target!==unitTooltipTarget)showUnitTooltip(target);});
  document.addEventListener('pointerout',event=>{if(unitTooltipTarget&&unitTooltipTarget.contains(event.target)&&!unitTooltipTarget.contains(event.relatedTarget))hideUnitTooltip();});
  document.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){const target=tooltipTarget(event.target);if(target)showUnitTooltip(target);else hideUnitTooltip();}});
  document.addEventListener('focusin',event=>{const target=tooltipTarget(event.target);if(target)showUnitTooltip(target);else hideUnitTooltip();});
  document.addEventListener('focusout',event=>{if(event.target===unitTooltipTarget)hideUnitTooltip();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hideUnitTooltip();});
  window.addEventListener('resize',placeUnitTooltip);window.addEventListener('scroll',placeUnitTooltip,true);window.addEventListener('pagehide',hideUnitTooltip);
  document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>choosePanel(button.dataset.panel)));
  document.querySelectorAll('[data-open-practice]').forEach(button=>button.addEventListener('click',()=>{choosePanel('practice');$('gameMain').focus({preventScroll:true});}));
  document.querySelectorAll('[data-map-view]').forEach(button=>button.addEventListener('click',()=>{mapView=button.dataset.mapView;renderMapReference();saveUI();}));
  $('gameMain').addEventListener('click',event=>{
    const choice=event.target.closest('[data-choice]');if(choice){state.selected=Number(choice.dataset.choice);render(`[data-choice="${state.selected}"]`);return;}
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(action==='win'){const before=M.earned(D,state.points,M.mapFor(D,state));M.win(D,state);const after=M.earned(D,state.points,M.mapFor(D,state));render();announce(JSON.stringify(before)!==JSON.stringify(after)?'지속 보너스를 받았습니다. 다음 도전부터 적용됩니다.':'스테이지를 클리어했습니다.');}
    if(action==='next'){M.next(D,state);render();}
    if(action==='acquire')acquire();
    if(action==='skip')openDialog('선택 건너뛰기',`<p>${state.view==='characters'?'캐릭터':'파워 업'}를 획득하지 않고 넘어갈까요?</p>`,[{text:'취소'},{text:'건너뛰기',run:()=>{M.next(D,state);render();announce('선택을 건너뛰었습니다.');}}]);
    if(action==='restart'){inspectedSlot=null;state=M.restart(D,state);render();announce('누적Pt의 지속 보너스를 새 도전에 적용했습니다.');}
    if(action==='cancelReplace'){state.view='characters';state.pending=null;state.selected=null;render();}
  });
  $('teamSlots').addEventListener('click',event=>{
    const button=event.target.closest('[data-slot]');if(!button)return;
    const index=Number(button.dataset.slot),member=state.team[index];
    if(state.view==='replace')confirm('캐릭터 교체',`<p>${esc(M.memberInfo(D,state,member).name)}을(를) 내보내고 ${esc(unitName(D.chars[state.pending].CharaID))}을(를) 영입할까요?</p><p>내보낸 캐릭터는 이번 도전에서 다시 편성할 수 없습니다.</p>`,()=>{inspectedSlot=null;M.replace(D,state,index);render();announce('캐릭터를 교체했습니다. 이제 파워 업을 고르세요.');});
    else inspectMember(index,true);
  });
  $('mapReference').addEventListener('click',event=>{
    const button=event.target.closest('[data-reference-unit]');if(!button)return;
    const id=Number(button.dataset.referenceUnit),form=Number(button.dataset.form),unit=D.units[id],f=unit.forms[form]||unit.forms[1];
    referenceOpener=button;$('referenceDetail').innerHTML=profile({id,form,name:f.name,icon:f.icon,rarity:unit.rarity,base:Number(button.dataset.level),plus:0});$('referenceInspector').hidden=false;revealInspector($('referenceInspector'));
  });
  $('closeMember').addEventListener('click',()=>{$('memberInspector').hidden=true;document.querySelector(`[data-slot="${inspectedSlot}"]`)?.focus();inspectedSlot=null;});
  $('closeReference').addEventListener('click',()=>{$('referenceInspector').hidden=true;if(referenceOpener?.isConnected)referenceOpener.focus();referenceOpener=null;});
  $('showBonus').addEventListener('click',event=>{event.preventDefault();const details=$('bonusDetails');details.open=!details.open;syncSummary(details);if(details.open&&state.tutorial&&state.lesson>=5){state.lesson=6;renderLesson();save();}});
  $('closeDialog').addEventListener('click',()=>$('guideDialog').close());
  $('newRun').addEventListener('click',()=>restart());
  $('mapSelect').addEventListener('change',()=>restart(Number($('mapSelect').value)));
  $('allOwned').addEventListener('click',()=>{
    if(state.view==='clear'&&!Number.isFinite(state.lastRate))state.lastRate=M.pointRate(D,state);
    state.ownedUnits=[...new Set([...M.ownership(D,state),...ownershipCandidates()])];render('#allOwned');
  });
  $('ownedUnits').addEventListener('click',event=>{
    const button=event.target.closest('button[data-owned-unit]');if(!button)return;
    const id=Number(button.dataset.ownedUnit);if(!D.units[id])return;
    if(state.view==='clear'&&!Number.isFinite(state.lastRate))state.lastRate=M.pointRate(D,state);
    const ids=new Set(M.ownership(D,state));if(ids.has(id))ids.delete(id);else ids.add(id);
    state.ownedUnits=[...ids];render(`[data-owned-unit="${id}"]`);
  });
  $('tutorialReset').addEventListener('click',()=>{inspectedSlot=null;state=M.fresh(D,{ownedUnits:M.ownership(D,state)});render();announce('처음부터 안내합니다.');});
  $('tryDefeat').addEventListener('click',()=>{inspectedSlot=null;M.defeat(D,state);state.tutorial=false;render();announce('이번 도전의 편성과 파워 업이 초기화되었습니다.');});
  $('practiceReset').addEventListener('click',()=>{inspectedSlot=null;state=M.fresh(D,{tutorial:false});quick=false;render();announce('체험 기록을 초기화했습니다.');});
  $('finishTutorial').addEventListener('click',()=>{state.tutorial=false;render('#gameMain');announce('이제 자유롭게 체험할 수 있습니다.');});
  $('quickConfirm').addEventListener('change',()=>{quick=$('quickConfirm').checked;save();});
  $('pointCap').addEventListener('change',()=>{state.cap=Number($('pointCap').value);save();});
  $('mapReferenceSelect').addEventListener('change',()=>{renderMapReference();saveUI();});
  $('buffMap').addEventListener('change',()=>{renderBuffs();saveUI();});$('buffSearch').addEventListener('input',()=>{renderBuffs();saveUI();});
  $('rewardRange').addEventListener('change',()=>{renderRewards();saveUI();});
  for(const id of ['mapSelect','mapReferenceSelect','buffMap'])$(id).innerHTML=D.maps.map(map=>`<option value="${map.id}">${esc(map.name)}</option>`).join('');
  $('pointCap').innerHTML=D.caps.map(value=>`<option value="${value}">${fmt(value)}Pt</option>`).join('');
  window.addEventListener('pageshow',event=>{if(event.persisted)applyUI();});
  render();applyUI();
})();
