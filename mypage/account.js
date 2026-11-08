(() => {
  'use strict';
  const $ = id => document.getElementById(id), view = document.body.dataset.view;
  let metadata, medalCatalog, account, savedAccount, revision, editing=false, saving=false, linking=false, activeStory=0;
  const clone = value => structuredClone(value);
  function finishLoading(){const loader=$('accountLoading');if(loader)loader.hidden=true;}
  function status(id,text,error=false){const n=$(id);n.textContent=text;n.dataset.error=String(error);}
  function csrf(){return document.cookie.split('; ').find(x=>x.startsWith('nyanko_csrf='))?.split('=')[1]||'';}
  async function api(path,body){
    let serialized=body?JSON.stringify(body):undefined,pending;
    try{pending=fetch(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json','X-CSRF-Token':csrf()}:{},body:serialized});}
    finally{serialized=null;if(path==='/api/account/link'&&body){body.code='';body.pin='';delete body.code;delete body.pin;}}
    const r=await pending,data=await r.json();
    if(!r.ok){const e=new Error(data.error||'요청을 처리하지 못했습니다.');e.status=r.status;throw e;}return data;
  }
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function image(src,w,h){const n=el('img');n.src=src;n.alt='';n.width=w;n.height=h;n.loading='lazy';return n;}
  const catalog=window.NYANKODB_UNIT_CATALOG;
  const medalGuide=$('ownedMedals')?window.NyankoMedalGuide.create({root:$('ownedMedals'),idPrefix:'owned-medal',tooltipId:'accountMedalTooltip'}):null;
  const ownedMedalIds=value=>Array.isArray(value?.medals)?new Set(value.medals.filter(id=>Number.isSafeInteger(id)&&id>=0)):null;
  const summonedUnitIds=new Set((catalog?.entries||[]).filter(entry=>entry.name==='정령').map(entry=>entry.id));
  const encyclopedia=window.NYANKODB_UNIT_ENCYCLOPEDIA?.entries||{};
  let unitOrder='encyclopedia';
  function unitUnlockedForm(unit,entries=catalog.entries.filter(entry=>entry.id===unit.id).sort((a,b)=>a.form-b.form)){return entries.filter(entry=>entry.form<=(unit.unlockedForm??unit.highestForm??1)).at(-1)?.form||entries[0]?.form||1;}
  function unitForm(unit,entries=catalog.entries.filter(entry=>entry.id===unit.id).sort((a,b)=>a.form-b.form)){const unlocked=unitUnlockedForm(unit,entries);return entries.find(entry=>entry.form===unit.displayForm&&entry.form<=unlocked)?.form||unlocked;}
  function raritySection(rarity,content){const group=el('section','required-unit-rarity-group'),title=el('h3','required-unit-rarity-title'),definition=metadata.rarities.find(entry=>entry.label===rarity);if(definition){const icon=image(definition.icon,90,28);icon.alt=rarity;title.append(icon);}else title.textContent=rarity;group.append(title,content);return group;}
  function highestForm(u){const r=u.raw||{};return Math.max(1,(r.currentForm||0)+1,u.level+u.plus>=10?2:1,r.unlockedForms===3?3:1,r.fourthForm===2?4:1);}
  function numberInput(id,label,value,min,max,onInput){
    const input=el('input');input.id=id;input.type='number';input.inputMode='numeric';input.min=min;input.max=max;input.step=1;input.required=true;input.value=value;input.setAttribute('aria-label',label);
    input.addEventListener('input',()=>{if(input.value!==''&&input.validity.valid)onInput(Number(input.value));});return input;
  }
  const MAX_AMOUNT=2147483647,stageRules=new Map();
  let editorApply=null,editorFocus='#editAccount',editorSequence=0,editorController=null;
  const stageIdentity=row=>JSON.stringify([row.href,row.chapter??null,row.crown]);
  function editableLink(link,callback){
    link.setAttribute('role','button');link.addEventListener('click',event=>{event.preventDefault();callback();});
    link.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();link.click();}});
  }
  function showEditor(title,build,apply,focus){
    editorController?.abort();editorController=new AbortController();
    editorSequence++;editorApply=apply;editorFocus=focus||'#editAccount';
    $('editorUnitSort').hidden=true;$('editorUnitSort').replaceChildren();$('editorTitle').textContent=title;$('editorContent').replaceChildren();status('editorStatus','');$('editorApply').disabled=!apply;
    build($('editorContent'));$('editorContent').scrollTop=0;
    $('profileEditor').append($('accountTooltip'));
    if(!$('profileEditor').open)$('profileEditor').showModal();
    requestAnimationFrame(()=>($('editorContent').querySelector('input,select')||$('editorContent').querySelector('button,a[href]'))?.focus());
  }
  function editorNumber(root,id,label,value,min,max){
    const row=el('div','owned-level-row'),caption=el('label','',label);caption.htmlFor=id;
    const input=numberInput(id,label,value,min,max,()=>{});row.append(caption,input);root.append(row);return input;
  }
  function unitOptions(){
    return window.NyankoUnitGuide.units(catalog);
  }
  function unitEditor(unit,adding=false){
    const definition=unitOptions().find(entry=>entry.id===unit.id),original=savedAccount.units.find(entry=>entry.id===unit.id),limits=metadata.unitLimits[String(unit.id)];
    let base,plus,form=unitForm(unit),unlocked=unitUnlockedForm(unit);
    showEditor(definition.name,root=>{
      const head=el('div','editor-unit-heading'),preview=el('div','editor-unit-preview'),forms=catalog.entries.filter(entry=>entry.id===unit.id).sort((a,b)=>a.form-b.form),selected=forms.find(entry=>entry.form===form)||definition,icon=image('../'+selected.icon.replace(/^\.\.\//,''),104,79),settings=el('div','editor-unit-form-settings');
      function formRow(label,id){const row=el('div','editor-unit-form-row'),caption=el('span','editor-unit-form-label',label),buttons=el('div','tabs editor-unit-forms');buttons.id=id;buttons.setAttribute('role','group');buttons.setAttribute('aria-label',label);row.append(caption,buttons);settings.append(row);return buttons;}
      const unlockButtons=formRow('해금','editorUnitUnlock'),applyButtons=formRow('적용 형태','editorUnitAppliedForm');
      function refreshForms(){for(let i=0;i<forms.length;i++){unlockButtons.children[i].setAttribute('aria-pressed',String(forms[i].form<=unlocked));applyButtons.children[i].disabled=forms[i].form>unlocked;applyButtons.children[i].setAttribute('aria-pressed',String(forms[i].form===form));}icon.src='../'+forms.find(entry=>entry.form===form).icon.replace(/^\.\.\//,'');}
      for(const entry of forms){const unlockButton=el('button','',`${entry.form}단`),applyButton=el('button','',`${entry.form}단`);unlockButton.type=applyButton.type='button';unlockButton.addEventListener('click',()=>{unlocked=entry.form;if(form>unlocked)form=unlocked;refreshForms();});applyButton.addEventListener('click',()=>{form=entry.form;refreshForms();});unlockButtons.append(unlockButton);applyButtons.append(applyButton);}
      refreshForms();preview.append(icon,settings);head.append(preview);root.append(head);
      if(!adding){
        const remove=el('button','action');remove.id='editorRemoveUnit';remove.type='button';remove.setAttribute('aria-label','캐릭터 제거');remove.dataset.tooltip='캐릭터 제거';
        const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('width','20');icon.setAttribute('height','20');icon.setAttribute('aria-hidden','true');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','2');icon.setAttribute('stroke-linecap','round');icon.setAttribute('stroke-linejoin','round');
        const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7');icon.append(path);remove.append(icon);head.append(remove);
        remove.addEventListener('click',()=>{account.units=account.units.filter(value=>value.id!==unit.id);renderUnits();editorFocus=$('showUnownedUnits').checked?`.owned-entry[data-unit-id="${unit.id}"] .nyancombo-member`:'#addOwnedUnit';$('profileEditor').close();});
      }
      const controls=el('div','owned-level-controls');root.append(controls);
      base=editorNumber(controls,'editorUnitLevel','기본 레벨',unit.level,1,Math.max(limits.maxBase,original?.level||1));
      plus=editorNumber(controls,'editorUnitPlus','+ 레벨',unit.plus,0,Math.max(limits.maxPlus,original?.plus||0));
      if(adding){const back=el('button','action','다른 캐릭터');back.type='button';back.addEventListener('click',addUnitEditor);root.append(back);}
    },()=>{
      if(adding&&account.units.some(value=>value.id===unit.id))throw new Error('이미 보유한 캐릭터입니다.');
      unit.level=Number(base.value);unit.plus=Number(plus.value);unit.unlockedForm=unlocked;unit.highestForm=unlocked;unit.displayForm=form;
      if(adding)account.units.push(unit);renderUnits();editorFocus=`.owned-entry[data-unit-id="${unit.id}"] .nyancombo-member`;
    },adding&&!$('showUnownedUnits').checked?'#addOwnedUnit':`.owned-entry[data-unit-id="${unit.id}"] .nyancombo-member`);
  }
  function addUnitEditor(){
    showEditor('캐릭터 추가',root=>{
      const search=el('input');search.type='search';search.setAttribute('aria-label','추가할 캐릭터 검색');search.placeholder='캐릭터 이름 또는 ID';
      const filters=el('div'),list=el('div','required-unit-groups editor-unit-list');root.append(search,filters,list);
      const owned=new Set(account.units.map(u=>u.id)),available=unitOptions().filter(entry=>!summonedUnitIds.has(entry.id)&&metadata.unitLimits[String(entry.id)]);
      let matches=[],page=0,pageGroups=[];const sort=$('editorUnitSort');sort.hidden=false;for(const [value,label] of [['encyclopedia','도감순'],['release','출시순']]){const button=el('button','',label);button.type='button';button.dataset.order=value;button.setAttribute('aria-pressed',String(unitOrder===value));button.addEventListener('click',()=>{unitOrder=value;for(const choice of sort.children)choice.setAttribute('aria-pressed',String(choice===button));rebuildPages(false);});sort.append(button);}
      const navigation=el('div','editor-unit-pagination'),previous=el('button','action'),counter=el('span','owned-count'),next=el('button','action');previous.append(el('span','editor-pagination-arrow','‹'));next.append(el('span','editor-pagination-arrow','›'));
      previous.id='editorUnitsPrevious';next.id='editorUnitsNext';previous.type=next.type='button';previous.setAttribute('aria-label','이전 페이지');next.setAttribute('aria-label','다음 페이지');counter.id='editorUnitsPage';counter.setAttribute('role','status');counter.setAttribute('aria-live','polite');navigation.append(previous,counter,next);root.insertBefore(navigation,list);
      function renderPage(){
        list.replaceChildren();const pages=pageGroups.length;page=Math.min(page,Math.max(0,pages-1));
        previous.disabled=page===0;next.disabled=page+1>=pages;counter.textContent=`${matches.length.toLocaleString('ko-KR')}종 · ${matches.length?page+1:0} / ${pages}`;counter.setAttribute('aria-label',`캐릭터 ${matches.length}종, ${matches.length?page+1:0} / ${pages}페이지`);
        const current=pageGroups[page],grid=el('div','nyancombo-members');if(current)list.append(raritySection(current.rarity,grid));
        for(const entry of current?.entries||[]){
          const isOwned=owned.has(entry.id),box=el('div','owned-entry'),button=el('button','nyancombo-member'),frame=el('span','nyancombo-member-image');button.type='button';button.disabled=isOwned;button.setAttribute('aria-label',`${entry.name} ${isOwned?'보유':'추가'}`);button.dataset.tooltip=entry.name;frame.append(image('../'+entry.icon.replace(/^\.\.\//,''),104,79));button.append(frame);button.dataset.unitId=entry.id;if(isOwned)button.append(el('span','picker-owned-label','보유'));
          if(!isOwned)button.addEventListener('click',()=>unitEditor(clone(savedAccount.units.find(unit=>unit.id===entry.id)||{id:entry.id,level:1,plus:0,highestForm:1,raw:{currentForm:0,unlockedForms:0,fourthForm:0},talents:[]}),true));
          box.append(button);grid.append(box);
        }
        if(!matches.length)list.append(el('p','empty','추가할 캐릭터가 없습니다.'));
      }
      previous.addEventListener('click',()=>{if(page>0){page--;renderPage();}});next.addEventListener('click',()=>{if(page+1<pageGroups.length){page++;renderPage();}});
      function rebuildPages(resetPage=true){
        pageGroups=window.NyankoUnitGuide.pages(matches,catalog.rarities,encyclopedia,unitOrder);
        if(resetPage)page=0;renderPage();
      }
      window.NyankoUnitPickerFilters.mount(filters,search,filtered=>{const hits=new Set(filtered.map(entry=>Number(entry.id)));matches=available.filter(entry=>hits.has(entry.id));rebuildPages();});
    },null,$('showUnownedUnits').checked?'#showUnownedUnits':'#addOwnedUnit');
  }
  function inventoryEditor(item){
    let input;const amount=account.inventory?.[String(item.id)];
    showEditor(item.name,root=>{const controls=el('div','owned-level-controls');root.append(controls);input=editorNumber(controls,'editorItemAmount','수량',Number.isInteger(amount)?amount:'',0,MAX_AMOUNT);},()=>{
      account.inventory||={};account.inventory[String(item.id)]=Number(input.value);renderInventory();
    },`#inventoryContent [data-item-id="${item.id}"]`);
  }
  async function stageEditor(stage,adding=false){
    showEditor(stage.name,root=>root.append(el('p','empty','로딩중...')),null,adding?'#addClearedStage':`#clearedStagesList a[href="../${stage.href}"]`);
    const sequence=editorSequence;
    try{
      let rule=stageRules.get(stage.href);if(!rule){rule=await api('/api/account/stage-rules?href='+encodeURIComponent(stage.href));stageRules.set(stage.href,rule);}
      if(sequence!==editorSequence||!$('profileEditor').open)return;
      let select,input,complete;
      const variants=rule.chapters.length?rule.chapters.map(ch=>({chapter:ch.value,crown:1,label:ch.label})):rule.crowns.map(crown=>({crown,label:rule.boolean?'클리어 여부':`${crown}성`}));
      const original=(account.clearedStages||[]).find(row=>row.href===stage.href),initial=variants.findIndex(v=>v.crown===original?.crown&&(v.chapter??null)===(original?.chapter??null));
      showEditor(stage.name,root=>{
        const controls=el('div','owned-level-controls');select=el('select');select.id='editorStageVariant';select.setAttribute('aria-label',rule.chapters.length?'장':'성급');
        for(const[index,v]of variants.entries()){const option=el('option','',v.label);option.value=index;select.append(option);}select.value=String(Math.max(0,initial));
        if(variants.length>1){const row=el('div','owned-level-row'),label=el('label','',rule.chapters.length?'장':'성급');label.htmlFor=select.id;row.append(label,select);controls.append(row);}
        root.append(controls);
        if(rule.boolean){const label=el('label','editor-check'),checkbox=el('input');checkbox.type='checkbox';checkbox.id='editorStageComplete';complete=checkbox;label.append(checkbox,document.createTextNode('클리어'));controls.append(label);}
        else input=editorNumber(controls,'editorStageCount','클리어 횟수',1,0,MAX_AMOUNT);
        function update(){const v=variants[Number(select.value)],row=(account.clearedStages||[]).find(row=>stageIdentity(row)===stageIdentity({href:stage.href,...v}));if(complete)complete.checked=row?.cleared===true;else input.value=row?.count??(adding?1:0);}
        select.addEventListener('change',update);update();
        if(adding){const back=el('button','action','다른 스테이지');back.type='button';back.addEventListener('click',addStageEditor);root.append(back);}
      },()=>{
        const {label,...variant}=variants[Number(select.value)],row={href:stage.href,count:rule.boolean?null:Number(input.value),...variant,...(rule.boolean?{cleared:complete.checked}:{})};
        account.clearedStages||=[];const index=account.clearedStages.findIndex(old=>stageIdentity(old)===stageIdentity(row));
        if(index<0)account.clearedStages.push(row);else account.clearedStages[index]={...account.clearedStages[index],...row};
        renderClearedStages(true);editorFocus=adding?'#addClearedStage':`#clearedStagesList a[href="../${stage.href}"]`;
      },adding?'#addClearedStage':`#clearedStagesList a[href="../${stage.href}"]`);
    }catch(error){if(sequence===editorSequence&&$('profileEditor').open)status('editorStatus',error.message,true);}
  }
  function addStageEditor(){
    showEditor('클리어 스테이지 추가',root=>{
      const input=el('input');input.type='search';input.setAttribute('aria-label','추가할 스테이지 검색');input.placeholder='스테이지 이름 또는 ID';
      const filterHost=el('div','stage-picker-filters');filterHost.innerHTML="<section class=\"filter-panel is-collapsed\" aria-labelledby=\"editorStageFilterTitle\">\n      <div class=\"section-heading\">\n        <h2 id=\"editorStageFilterTitle\">검색 필터</h2>\n        <div class=\"filter-actions\">\n          <div class=\"filter-actions-buttons\">\n            <button class=\"reset-button\" id=\"editorStageResetFilters\" type=\"button\" disabled>초기화</button>\n            <button class=\"filter-collapse\" id=\"editorStageFilterCollapse\" type=\"button\" aria-expanded=\"false\" aria-controls=\"editorStageFilterBody\">\n              <span id=\"editorStageFilterCollapseText\">펼치기</span><span class=\"filter-collapse-arrow\" aria-hidden=\"true\">▾</span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <div class=\"filter-body\" id=\"editorStageFilterBody\" hidden>\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\" id=\"stageDifficultyLabel\">난이도</h3>\n          <div class=\"stage-difficulty-filters\" id=\"stageDifficultyFilters\" role=\"group\" aria-labelledby=\"stageDifficultyLabel\"></div>\n        </div>\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\" id=\"stageEnemyLabel\">출현 적</h3>\n          <div class=\"stage-filter-picker\">\n            <div class=\"stage-filter-field\">\n              <input class=\"search-input\" id=\"stageEnemySearch\" type=\"search\" role=\"combobox\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"적 이름 또는 ID 입력\" aria-labelledby=\"stageEnemyLabel\" aria-autocomplete=\"list\" aria-expanded=\"false\" aria-controls=\"stageEnemyOptions\">\n              <div class=\"unit-search-results\" id=\"stageEnemyOptions\" role=\"listbox\" aria-label=\"추가할 적\" hidden></div>\n            </div>\n            <div class=\"filter-chip-list stage-selected-list\" id=\"stageEnemySelected\" aria-live=\"polite\"></div>\n          </div>\n        </div>\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\" id=\"stageRewardLabel\">보상</h3>\n          <div class=\"stage-filter-picker\">\n            <div class=\"stage-filter-field\">\n              <input class=\"search-input\" id=\"stageRewardSearch\" type=\"search\" role=\"combobox\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"보상 이름 또는 ID 입력\" aria-labelledby=\"stageRewardLabel\" aria-autocomplete=\"list\" aria-expanded=\"false\" aria-controls=\"stageRewardOptions\">\n              <div class=\"unit-search-results\" id=\"stageRewardOptions\" role=\"listbox\" aria-label=\"추가할 보상\" hidden></div>\n            </div>\n            <div class=\"filter-chip-list stage-selected-list\" id=\"stageRewardSelected\" aria-live=\"polite\"></div>\n          </div>\n        </div>\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\" id=\"stageCategoryLabel\">스테이지 분류</h3>\n          <div class=\"filter-chip-list\" id=\"stageCategoryFilters\" role=\"group\" aria-labelledby=\"stageCategoryLabel\"></div>\n        </div>\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\" id=\"stageSpecialCategoryLabel\">스페셜 스테이지 분류</h3>\n          <div>\n            <div class=\"filter-chip-list\" id=\"stageSpecialCategoryFilters\" role=\"group\" aria-labelledby=\"stageSpecialCategoryLabel\">\n              <button class=\"filter-chip text-chip\" type=\"button\" data-special-category=\"monthly\">월간 스테이지</button>\n              <button class=\"filter-chip text-chip\" type=\"button\" data-special-category=\"cyclone\">사이클론</button>\n              <button class=\"filter-chip text-chip\" type=\"button\" data-special-category=\"advent\">강림</button>\n              <button class=\"filter-chip text-chip\" type=\"button\" data-special-category=\"crazed\">광란</button>\n              <button class=\"filter-chip text-chip\" type=\"button\" data-special-category=\"awakening\">각성</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>";
      const count=el('p','owned-count'),results=el('div','stage-list editor-stage-list');results.id='editorStageList';root.append(input,filterHost,count,results);
      const body=filterHost.querySelector('#editorStageFilterBody'),collapse=filterHost.querySelector('#editorStageFilterCollapse'),label=filterHost.querySelector('#editorStageFilterCollapseText');
      collapse.addEventListener('click',()=>{const collapsed=filterHost.querySelector('.filter-panel').classList.toggle('is-collapsed');body.hidden=collapsed;collapse.setAttribute('aria-expanded',String(!collapsed));label.textContent=collapsed?'펼치기':'접기';});
      const filters=window.NyankoStageFilters.mount({root:body,catalog:window.NYANKODB_SEARCH_CATALOG,data:window.NYANKODB_STAGE_FILTER_DATA,reset:filterHost.querySelector('#editorStageResetFilters'),nameInput:input,signal:editorController.signal});
      const list=window.NyankoStageList.mount({catalog:window.NYANKODB_SEARCH_CATALOG,input,results,status:count,idPrefix:'editorStage',selectionOnly:true,locationLinks:false,getFilter:filters.getFilter,decorateStageLink:(link,stage)=>editableLink(link,()=>stageEditor(stage,true))});
      body.addEventListener('stagefilterschange',list.refresh);
    },null,'#addClearedStage');
  }
  function profileIconEditor(){
    let choice=Object.hasOwn(account,'profileIcon')?clone(account.profileIcon):undefined;
    showEditor('프로필 아이콘',root=>{
      const head=el('div','editor-unit-heading'),defaultBox=el('div','owned-entry'),defaultButton=el('button','nyancombo-member profile-icon-option'),defaultFrame=el('span','nyancombo-member-image');
      defaultButton.id='profileIconDefault';defaultButton.type='button';defaultButton.setAttribute('aria-label','기본 프로필 아이콘');defaultFrame.append(image('../img/icon/uni_nyankoClub_0.png',104,79));defaultButton.append(defaultFrame);defaultBox.append(defaultButton,el('p','owned-level','기본'));
      const preview=el('div','editor-unit-preview'),previewIcon=image('../img/icon/uni_nyankoClub_0.png',104,79),settings=el('div','editor-unit-form-settings'),row=el('div','editor-unit-form-row'),caption=el('span','editor-unit-form-label','적용 형태'),forms=el('div','tabs editor-unit-forms');
      forms.id='profileIconForms';forms.setAttribute('role','group');forms.setAttribute('aria-label','프로필 아이콘 형태');row.append(caption,forms);settings.append(row);preview.append(previewIcon,settings);head.append(defaultBox,preview);
      const search=el('input');search.type='search';search.setAttribute('aria-label','프로필 캐릭터 검색');search.placeholder='캐릭터 이름 또는 ID';
      const filters=el('div'),list=el('div','required-unit-groups editor-unit-list');root.append(head,search,filters,list);
      const owned=new Map(account.units.map(unit=>[unit.id,unit])),available=unitOptions().filter(entry=>owned.has(entry.id)&&!summonedUnitIds.has(entry.id));
      let matches=[],page=0,pageGroups=[];const sort=$('editorUnitSort');sort.hidden=false;
      for(const[value,label]of[['encyclopedia','도감순'],['release','출시순']]){const button=el('button','',label);button.type='button';button.dataset.order=value;button.setAttribute('aria-pressed',String(unitOrder===value));button.addEventListener('click',()=>{unitOrder=value;for(const item of sort.children)item.setAttribute('aria-pressed',String(item===button));rebuildPages(false);});sort.append(button);}
      const navigation=el('div','editor-unit-pagination'),previous=el('button','action'),counter=el('span','owned-count'),next=el('button','action');previous.append(el('span','editor-pagination-arrow','‹'));next.append(el('span','editor-pagination-arrow','›'));previous.type=next.type='button';previous.setAttribute('aria-label','이전 페이지');next.setAttribute('aria-label','다음 페이지');counter.setAttribute('role','status');counter.setAttribute('aria-live','polite');navigation.append(previous,counter,next);root.insertBefore(navigation,list);
      const resolved=()=>choice===undefined?account.clubProfile:choice;
      function refreshSelection(){
        const selected=resolved(),unit=owned.get(selected?.unitId),entry=catalog.entries.find(item=>item.id===selected?.unitId&&item.form===selected.formIndex+1);
        defaultButton.setAttribute('aria-pressed',String(!entry));forms.replaceChildren();preview.hidden=!entry;
        if(entry){previewIcon.src='../'+entry.icon.replace(/^\.\.\//,'');previewIcon.alt=entry.name;
          for(const item of catalog.entries.filter(item=>item.id===entry.id).sort((a,b)=>a.form-b.form)){const button=el('button','',`${item.form}단`);button.type='button';button.disabled=!unit||item.form>unitUnlockedForm(unit);button.setAttribute('aria-pressed',String(item.form===entry.form));button.addEventListener('click',()=>{choice={unitId:item.id,formIndex:item.form-1};refreshSelection();});forms.append(button);}
        }
        for(const button of list.querySelectorAll('[data-unit-id]'))button.setAttribute('aria-pressed',String(Number(button.dataset.unitId)===selected?.unitId));
      }
      function renderPage(){
        list.replaceChildren();const pages=pageGroups.length;page=Math.min(page,Math.max(0,pages-1));previous.disabled=page===0;next.disabled=page+1>=pages;counter.textContent=`${matches.length.toLocaleString('ko-KR')}종 · ${matches.length?page+1:0} / ${pages}`;
        const current=pageGroups[page],grid=el('div','nyancombo-members');if(current)list.append(raritySection(current.rarity,grid));
        for(const entry of current?.entries||[]){const unit=owned.get(entry.id),selected=catalog.entries.find(item=>item.id===entry.id&&item.form===unitForm(unit))||entry,box=el('div','owned-entry'),button=el('button','nyancombo-member profile-icon-option'),frame=el('span','nyancombo-member-image');button.type='button';button.dataset.unitId=entry.id;button.dataset.tooltip=selected.name;button.setAttribute('aria-label',selected.name);frame.append(image('../'+selected.icon.replace(/^\.\.\//,''),104,79));button.append(frame);button.addEventListener('click',()=>{choice={unitId:entry.id,formIndex:unitForm(unit)-1};refreshSelection();});box.append(button);grid.append(box);}
        if(!matches.length)list.append(el('p','empty','보유 캐릭터가 없습니다.'));refreshSelection();
      }
      function rebuildPages(resetPage=true){pageGroups=window.NyankoUnitGuide.pages(matches,catalog.rarities,encyclopedia,unitOrder);if(resetPage)page=0;renderPage();}
      defaultButton.addEventListener('click',()=>{choice=null;refreshSelection();});previous.addEventListener('click',()=>{if(page>0){page--;renderPage();}});next.addEventListener('click',()=>{if(page+1<pageGroups.length){page++;renderPage();}});
      window.NyankoUnitPickerFilters.mount(filters,search,filtered=>{const hits=new Set(filtered.map(entry=>Number(entry.id)));matches=available.filter(entry=>hits.has(entry.id));rebuildPages();});refreshSelection();
    },()=>{if(choice===undefined)delete account.profileIcon;else account.profileIcon=clone(choice);renderProfile(account);},'#profileAvatar');
  }
  function editPatches(){
    const inventoryEdits={};for(const[key,value]of Object.entries(account.inventory||{}))if(value!==(savedAccount.inventory||{})[key])inventoryEdits[key]=value;
    const pick=row=>({href:row.href,count:row.count,crown:row.crown,...(row.chapter===undefined?{}:{chapter:row.chapter}),...(row.cleared===undefined?{}:{cleared:row.cleared})});
    const originals=new Map((savedAccount.clearedStages||[]).map(row=>[stageIdentity(row),JSON.stringify(pick(row))]));
    const stageEdits=(account.clearedStages||[]).filter(row=>JSON.stringify(pick(row))!==originals.get(stageIdentity(row))).map(pick);
    return {inventoryEdits,stageEdits,removedUnitIds:savedAccount.units.filter(unit=>!account.units.some(current=>current.id===unit.id)).map(unit=>unit.id),...(JSON.stringify(account.profileIcon)!==JSON.stringify(savedAccount.profileIcon)?{profileIcon:account.profileIcon??null}:{})};
  }
  function initEditor(){
    const dialog=$('profileEditor');$('editorCancel').addEventListener('click',()=>dialog.close());
    $('editorForm').addEventListener('submit',event=>{event.preventDefault();if(!editorApply||!editing||saving)return;if(!$('editorForm').reportValidity())return;try{editorApply();dialog.close();}catch(error){status('editorStatus',error.message,true);}});
    dialog.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();if(event.target.closest('[role=combobox][aria-expanded=true]'))return;event.stopPropagation();dialog.close();return;}
      if(event.key!=='Tab')return;
      const controls=[...dialog.querySelectorAll('input,button,select,textarea,a[href],[tabindex]')].filter(n=>!n.disabled&&n.tabIndex>=0&&n.getClientRects().length),first=controls[0],last=controls.at(-1);
      if(!first){event.preventDefault();dialog.focus();}else if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){event.preventDefault();first.focus();}
    },true);
    dialog.addEventListener('close',()=>{editorController?.abort();editorController=null;$('accountTooltip').hidden=true;document.body.append($('accountTooltip'));editorSequence++;editorApply=null;$('editorContent').replaceChildren();(document.querySelector(editorFocus)||$('editAccount')).focus({preventScroll:true});});
  }

  function renderUnits(){
    const root=$('ownedUnits');root.replaceChildren();const lookup=new Map(),groups=new Map();
    for(const entry of catalog.entries){if(!lookup.has(entry.id))lookup.set(entry.id,[]);lookup.get(entry.id).push(entry);}
    const owned=new Map(account.units.map(unit=>[unit.id,unit]));let displayed=account.units.map(unit=>({unit,missing:false}));
    if($('showUnownedUnits').checked){
      const all=unitOptions().filter(definition=>!summonedUnitIds.has(definition.id));
      displayed=window.NyankoUnitGuide.pages(all,catalog.rarities,encyclopedia,'encyclopedia').flatMap(page=>page.entries.map(definition=>({unit:owned.get(definition.id)||{id:definition.id},missing:!owned.has(definition.id)})));
    }
    for(const {unit,missing} of displayed){
      if(summonedUnitIds.has(unit.id))continue;
      const all=(lookup.get(unit.id)||[]).sort((a,b)=>a.form-b.form);if(!all.length)continue;
      const selected=missing?all[0]:all.find(entry=>entry.form===unitForm(unit,all)),rarity=all[0].rarity;
      if(!groups.has(rarity))groups.set(rarity,el('div','nyancombo-members'));
      const entry=el('div','owned-entry'),link=el(editing?'button':'a','nyancombo-member'),frame=el(editing?'span':'div','nyancombo-member-image');entry.dataset.unitId=unit.id;entry.dataset.owned=String(!missing);entry.dataset.form=selected.form;
      frame.append(image('../'+selected.icon.replace(/^\.\.\//,''),104,79));link.append(frame);if(!editing)link.href=`../unit/unit${String(unit.id).padStart(3,'0')}.html?form=${selected.form}`+(missing?'':`&level=${unit.level}&plus=${unit.plus}`);link.dataset.tooltip=selected.name;link.setAttribute('aria-label',`${selected.name} · ${selected.form}단${missing?' · 미보유':''}`);
      entry.append(link,el('p','owned-level',missing?'미보유':`Lv.${unit.level}${unit.plus?'+'+unit.plus:''}`));if(editing){link.type='button';link.addEventListener('click',()=>missing?unitEditor(clone(savedAccount.units.find(value=>value.id===unit.id)||{id:unit.id,level:1,plus:0,highestForm:1,raw:{currentForm:0,unlockedForms:0,fourthForm:0},talents:[]}),true):unitEditor(unit));}groups.get(rarity).append(entry);
    }
    root.classList.add('required-unit-groups');
    for(const rarity of [...groups.keys()].sort((a,b)=>catalog.rarities.indexOf(a)-catalog.rarities.indexOf(b)))root.append(raritySection(rarity,groups.get(rarity)));
    if(editing&&!$('showUnownedUnits').checked){const row=el('div','nyancombo-members'),entry=el('div','owned-entry'),button=el('button','nyancombo-member'),frame=el('span','nyancombo-member-image');button.id='addOwnedUnit';button.type='button';button.setAttribute('aria-label','캐릭터 추가');frame.append(el('span','unit-add-plus','+'));button.append(frame);button.addEventListener('click',addUnitEditor);entry.append(button);row.append(entry);root.append(row);}
    if(!groups.size&&!editing)root.append(el('p','empty','보유 캐릭터가 없습니다.'));$('ownedCount').textContent=`${account.units.filter(unit=>!summonedUnitIds.has(unit.id)).length}종`;
  }
  function renderMedals(){
    const root=$('ownedMedals'),ids=ownedMedalIds(account);medalGuide.render([]);
    $('ownedMedalCount').textContent=ids===null?'—':`${ids.size}개`;
    $('showUnownedMedals').disabled=ids===null||!medalCatalog;
    if(ids===null){root.append(el('p','empty','메달 정보를 불러오려면 계정을 다시 연동해 주세요.'));return;}
    if(!medalCatalog){root.append(el('p','empty','메달 목록을 불러오지 못했습니다.'));return;}
    const entries=medalCatalog.entries.filter(entry=>ids.has(entry.id)||$('showUnownedMedals').checked);
    medalGuide.render(entries,{ownedIds:ids});
    if(!entries.length)root.append(el('p','empty',ids.size?'메달 목록을 불러오지 못했습니다.':'보유 메달이 없습니다.'));
  }
  // The current unit calculator's collection percentage and formatting.
  function chapterTreasurePercent(slots){if(!slots.length||slots.some(quality=>quality===0))return 0;return Math.floor(slots.reduce((sum,quality)=>sum+Number(quality),0)*100/(slots.length*3));}
  function formatTreasurePercent(value){const rounded=Math.round(value*10)/10;return `${Number.isInteger(rounded)?rounded.toFixed(0):rounded.toFixed(1)}%`;}
  function forEachTreasureSlot(callback){
    for(const family of metadata.stories)for(const [ch,chapter]of family.saveIndices.entries())for(const item of family.items)for(const slot of item.chapters[ch])callback(account.treasures[chapter],slot.resourceIndex);
  }
  function syncAllGoldButton(){
    let maximum=!!account;if(account)forEachTreasureSlot((values,index)=>{if(values[index]!==3)maximum=false;});
    $('allGoldTreasures').hidden=!editing;$('allGoldTreasures').disabled=!account||!editing||saving||linking||maximum;
  }
  function renderTreasures(index=activeStory){
    activeStory=index;const family=metadata.stories[index],root=$('treasureContent'),names=['없음','조잡한','평범한','최고급'];root.replaceChildren();
    const cards=el('div','treasure-cards');root.append(cards);
    for(const item of family.items){
      const card=el('article','treasure-card'),head=el('div','treasure-card-header'),title=el('div','treasure-card-title'),chapters=el('div','treasure-chapters');
      const percents=item.chapters.map((slots,ch)=>{const values=account.treasures[family.saveIndices[ch]]||[],qualities=slots.map(s=>values[s.resourceIndex]);return qualities.every(q=>Number.isInteger(q)&&q>=0&&q<=3)?chapterTreasurePercent(qualities):null;});
      const totalPercent=percents.every(p=>p!==null)?percents.reduce((sum,p)=>sum+p,0):null;
      title.append(el('h3','',item.label),el('p','',item.description));head.append(image(item.icon,148,58),title,el('span','treasure-total',totalPercent===null?'미확인':formatTreasurePercent(totalPercent)));head.firstChild.className='treasure-effect-image';head.firstChild.alt=item.label;head.firstChild.dataset.tooltip=item.label;card.append(head);
      for(const[ch,slots]of item.chapters.entries()){
        const values=account.treasures[family.saveIndices[ch]]||[],chapter=el('section','treasure-chapter'),h=el('div','treasure-chapter-heading'),grid=el('div','treasure-slots');
        h.append(el('span','',`${ch+1}장`),el('span','treasure-chapter-percent',percents[ch]===null?'미확인':formatTreasurePercent(percents[ch])));
        for(const s of slots){
          const raw=values[s.resourceIndex],grade=Number.isInteger(raw)&&raw>=0&&raw<=3?raw:null,n=el('button','treasure-slot');n.type='button';n.dataset.quality=grade;n.dataset.chapter=ch;n.dataset.resourceIndex=s.resourceIndex;if(!editing)n.setAttribute('aria-disabled','true');if(grade===null)n.disabled=true;
          const displayed=grade===null?'미확인':grade===0?'미획득':names[grade],lines=[`${displayed} ${s.name}`];if(s.location)lines.push(`${s.location}에서 획득!`);n.dataset.tooltip=lines.join('\n');n.setAttribute('aria-label',n.dataset.tooltip.replace('\n',', '));
          if(grade>0){const icon=image(`../img/treasure/t${grade}.png`,30,30);icon.alt=names[grade];n.append(icon);}else n.append(el('span','treasure-empty',grade===0?'—':'?'));
          n.addEventListener('click',()=>{if(!editing||saving||grade===null)return;values[s.resourceIndex]=(grade+1)%4;renderTreasures(index);root.querySelector(`[data-chapter="${ch}"][data-resource-index="${s.resourceIndex}"]`)?.focus({preventScroll:true});});grid.append(n);
        }chapter.append(h,grid);chapters.append(chapter);
      }card.append(chapters);cards.append(card);
    }
    for(const b of $('treasureTabs').children)b.setAttribute('aria-pressed',String(Number(b.dataset.index)===index));syncAllGoldButton();
  }
  function syncPassiveMaxButton(){
    const maximum=!!account&&metadata.passives.every(definition=>{const p=account.passives?.find(value=>value.id===definition.id);return p&&p.level===definition.maxBase&&p.plus===definition.maxPlus;});
    $('allMaxPassives').hidden=!editing;$('allMaxPassives').disabled=!account||!editing||saving||linking||maximum;
  }
  function renderPassives(){
    const root=$('passiveContent');root.replaceChildren();
    if(account.passives?.length!==10){root.append(el('p','empty','패시브를 불러오려면 계정을 다시 연동해 주세요.'));return;}
    const cards=el('div','passive-cards');root.append(cards);
    for(const definition of metadata.passives){
      const p=account.passives.find(value=>value.id===definition.id);if(!p)continue;
      const card=el('article','passive-card'),banner=image('',512,128),head=el('div','passive-card-header'),current=el('span','passive-current-level');card.dataset.passiveId=p.id;banner.className='passive-banner';banner.alt=definition.name;
      const update=()=>{banner.src=p.level+p.plus>=10?definition.imageGold:definition.image;current.textContent=`Lv.${p.level}${p.plus?'+'+p.plus:''}`;syncPassiveMaxButton();};update();head.append(banner,el('h3','',definition.name),current);card.append(head,el('p','passive-effect',definition.description));
      if(editing){const controls=el('div','passive-level-controls');
        for(const[field,label,min,max]of[['level','기본 레벨',1,definition.maxBase],['plus','+ 레벨',0,definition.maxPlus]]){
          const row=el('div','passive-level-row'),caption=el('label','',label),id=`passive-${p.id}-${field}`,range=el('input');caption.htmlFor=id;
          const numeric=numberInput(id,`${definition.name} ${label}`,p[field],min,max,value=>{p[field]=value;range.value=value;update();});
          range.type='range';range.min=min;range.max=max;range.step=1;range.value=p[field];range.setAttribute('aria-label',`${definition.name} ${label} 조정`);range.addEventListener('input',()=>{p[field]=Number(range.value);numeric.value=range.value;update();});
          if(max===0){range.disabled=true;numeric.disabled=true;}row.append(caption,range,numeric);controls.append(row);
        }card.append(controls);
      }cards.append(card);
    }
  }
  function renderInventory(){
    const root=$('inventoryContent');root.replaceChildren();
    if(!account.inventory&&!editing){root.append(el('p','empty','아이템 정보를 불러오려면 계정을 다시 연동해 주세요.'));return;}
    for(const group of metadata.inventoryGroups){
      const section=el('section','item-section'),heading=el('div','item-section-heading'),grid=el('div','item-grid');section.setAttribute('aria-label',group.label);heading.append(el('h3','',group.label));
      for(const item of group.items){
        const amount=account.inventory?.[String(item.id)],quantity=Number.isInteger(amount)&&amount>=0?`${amount.toLocaleString('ko-KR')}개`:'미확인';
        const card=el('a','item-card'),copy=el('span','item-copy');card.href='../'+item.href;card.setAttribute('aria-label',`${item.name}, ${quantity}`);card.dataset.itemId=item.id;
        const icon=image('../'+item.icon,78,60);copy.append(el('span','item-name',item.name),el('span','item-identity',quantity));card.append(icon,copy);if(editing)editableLink(card,()=>inventoryEditor(item));grid.append(card);
      }section.append(heading,grid);root.append(section);
    }
  }
  function renderClearedStages(preserve=false){
    const controls=preserve?[...$('clearedStagesList').querySelectorAll('button[aria-expanded=true]')].map(b=>b.getAttribute('aria-controls')):[];
    $('addClearedStage').hidden=!editing;
    const root=$('clearedStagesList'),count=$('clearedStagesCount');root.replaceChildren();count.textContent='';
    if(!Array.isArray(account.clearedStages)){root.append(el('p','empty-results','스테이지 정보를 불러오려면 계정을 다시 연동해 주세요.'));return;}
    const records=new Map();
    for(const row of account.clearedStages){
      if(!editing&&!(Number.isSafeInteger(row.count)&&row.count>0)&&row.cleared!==true)continue;
      if(!records.has(row.href))records.set(row.href,[]);records.get(row.href).push(row);
    }
    window.NyankoStageList.mount({catalog:window.NYANKODB_SEARCH_CATALOG,results:root,status:count,idPrefix:'accountCleared',locationLinks:false,getFilter:()=>({key:'account-clears',showAllMatches:true,expandMatches:false,accepts:stage=>records.has(stage.href)}),decorateStageLink:(link,stage)=>{
      const rows=records.get(stage.href),identity=link.querySelector('.stage-detail-id');
      for(const row of rows){
        // Keep chapters/crowns separate; boolean completion does not imply one clear.
        const chapter=Number.isInteger(row.chapter)?`${row.chapter<3?row.chapter+1:row.chapter<7?row.chapter-3:row.chapter-6}장 · `:'';
        const crown=!chapter&&(rows.length>1||row.crown>1)?`${row.crown}성 · `:'';
        const amount=row.cleared===false?'미클리어':Number.isSafeInteger(row.count)&&row.count>=0?`클리어 ${row.count.toLocaleString('ko-KR')}회`:'클리어 (횟수 미확인)';
        identity.append(el('span','account-stage-clear',chapter+crown+amount));
      }
      if(editing)editableLink(link,()=>stageEditor(stage));
    }});
    for(const id of controls){const button=[...root.querySelectorAll('button[aria-controls]')].find(b=>b.getAttribute('aria-controls')===id);if(button?.getAttribute('aria-expanded')==='false')button.click();}
  }
  function renderProfile(value){
    const rank=value?.calculatedUserRank;
    $('userRank').textContent=Number.isSafeInteger(rank)&&rank>=0?rank.toLocaleString('ko-KR'):'—';
    const medals=ownedMedalIds(value);$('profileMedalCount').textContent=medals===null?'—':`${medals.size}개`;
    const club=Object.hasOwn(value||{},'profileIcon')?value.profileIcon:value?.clubProfile;
    const selected=Number.isInteger(club?.unitId)&&club.unitId>=0&&Number.isInteger(club.formIndex)
      ?catalog.entries.find(entry=>entry.id===club.unitId&&entry.form===club.formIndex+1):null;
    const icon=$('clubProfileIcon'),fallback='../img/icon/uni_nyankoClub_0.png';
    icon.onerror=()=>{icon.onerror=null;icon.src=fallback;icon.alt='프로필 이미지';};
    icon.src=selected?'../'+selected.icon.replace(/^\.\.\//,''):fallback;
    icon.alt=selected?.name||'프로필 이미지';
  }
  function renderAccount(value,newRevision=revision){
    account=value;revision=newRevision;renderProfile(value);if(!value)return;renderUnits();renderPassives();renderInventory();renderMedals();renderClearedStages();const tabs=$('treasureTabs');tabs.hidden=false;tabs.replaceChildren();
    for(const[i,f]of metadata.stories.entries()){const b=el('button','treasure-category-tab',`${f.label} 보물`);b.type='button';b.dataset.index=i;b.addEventListener('click',()=>renderTreasures(i));tabs.append(b);}renderTreasures();
  }
  function tooltips(){const tip=$('accountTooltip');if(!tip)return;let tooltipScrollFrame=0;
    function show(target){const n=target.closest('[data-tooltip]');if(!n||n.classList.contains('treasure-slot'))return;tip.classList.toggle('filter-chip-tooltip',n.classList.contains('icon-chip'));tip.textContent=n.dataset.tooltip;tip.hidden=false;const r=n.getBoundingClientRect(),z=Number(getComputedStyle(document.body).zoom)||1;tip.style.left=`${Math.max(8,Math.min(r.left,innerWidth-tip.getBoundingClientRect().width-12))/z}px`;tip.style.top=`${Math.max(8,r.top-tip.getBoundingClientRect().height-8)/z}px`;}
    document.addEventListener('pointerover',e=>show(e.target));document.addEventListener('focusin',e=>show(e.target));document.addEventListener('pointerout',()=>tip.hidden=true);document.addEventListener('focusout',()=>tip.hidden=true);addEventListener('scroll',()=>{
        tip.hidden=true;if(!$('profileEditor')?.open)return;
        cancelAnimationFrame(tooltipScrollFrame);tooltipScrollFrame=requestAnimationFrame(()=>{
          const dialog=$('profileEditor');if(!dialog.open)return;
          const hovered=[...dialog.querySelectorAll('[data-tooltip]:hover')].at(-1),focused=document.activeElement?.closest('[data-tooltip]'),anchor=hovered||focused;
          if(!anchor||!dialog.contains(anchor))return;
          const r=anchor.getBoundingClientRect(),content=$('editorContent').getBoundingClientRect();
          if(r.bottom>content.top&&r.top<content.bottom&&r.right>content.left&&r.left<content.right)show(anchor);
        });
      },true);document.addEventListener('keydown',e=>{if(e.key==='Escape')tip.hidden=true;});
  }
  function initPanels(){
    for(const [id,render] of [['showUnownedUnits',renderUnits],['showUnownedMedals',renderMedals]]){
      const input=$(id),label=input.closest('label');label.addEventListener('click',event=>event.stopPropagation());label.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter')event.stopPropagation();});input.addEventListener('change',()=>{if(account)render();});
    }
    const key='nyanko-db:mypage-panels:v1';let states={};try{states=JSON.parse(sessionStorage.getItem(key))||{};}catch(_){}
    for(const details of document.querySelectorAll('.account-details')){
      if(typeof states[details.id]==='boolean')details.open=states[details.id];
      const update=()=>{details.querySelector('.treasure-toggle-label').textContent=details.open?'접기':'펼치기';};update();
      details.addEventListener('toggle',()=>{update();states[details.id]=details.open;try{sessionStorage.setItem(key,JSON.stringify(states));}catch(_){}});
    }
  }
  function updateActions(){
    const linked=window.NyankoAccountDefaults.active();$('syncAccount').textContent=linked?'DB 연동 해제':'DB 연동';$('syncAccount').setAttribute('aria-pressed',String(linked));
    $('syncAccount').disabled=!account||editing||saving||linking;
    $('profileAvatar').disabled=!account||!editing||saving||linking;
    $('showUnownedUnits').disabled=!account;
    $('showUnownedMedals').disabled=ownedMedalIds(account)===null||!medalCatalog;
    document.body.dataset.editing=String(editing);$('editAccount').textContent=editing?'취소':'수정';$('editAccount').disabled=!account||saving||linking;$('saveAccount').disabled=!editing||saving;
    for(const input of $('linkForm').elements)input.disabled=editing||saving||linking;
    $('saveYes').disabled=$('saveNo').disabled=saving;syncAllGoldButton();syncPassiveMaxButton();
  }
  function beginEditing(){
    if(!editing&&account.passives?.length!==10){status('editStatus','패시브를 불러오려면 계정을 다시 연동해 주세요.',true);return;}
    editing=!editing;account=clone(savedAccount);renderAccount(account);status('editStatus','');updateActions();
    if(editing)for(const details of document.querySelectorAll('#ownedPanel,#passivePanel,#treasurePanel,#inventoryPanel,#medalsPanel,#clearedStagesPanel'))details.open=true;
  }
  function initEditing(){
    $('profileAvatar').addEventListener('click',()=>{if(account&&editing&&!saving&&!linking)profileIconEditor();});
    $('allMaxPassives').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();if(!editing||saving||linking||!account)return;for(const definition of metadata.passives){const p=account.passives.find(value=>value.id===definition.id);if(p){p.level=definition.maxBase;p.plus=definition.maxPlus;}}renderPassives();});
    $('allGoldTreasures').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();if(!editing||saving||linking||!account)return;forEachTreasureSlot((values,index)=>{values[index]=3;});renderTreasures();});
    $('syncAccount').addEventListener('click',()=>{
      if(!savedAccount||editing||saving||linking)return;
      try{const linked=window.NyankoAccountDefaults.active();if(linked)window.NyankoAccountDefaults.unlink();else window.NyankoAccountDefaults.apply(savedAccount,metadata);status('editStatus',linked?'연동을 해제하고 DB 기본값을 적용했습니다.':'계정 설정을 적용했습니다.');updateActions();}
      catch(_){status('editStatus','브라우저에 연동 설정을 저장하지 못했습니다.',true);}
    });
    addEventListener('nyanko-account-defaults-changed',updateActions);
    const dialog=$('saveConfirmation');$('profileForm').addEventListener('submit',e=>e.preventDefault());
    $('editAccount').addEventListener('click',beginEditing);
    $('saveAccount').addEventListener('click',()=>{if(!editing||saving)return;const invalid=[...$('profileForm').querySelectorAll('input')].find(input=>!input.checkValidity());if(invalid){invalid.closest('details').open=true;invalid.reportValidity();return;}status('saveError','');dialog.showModal();$('saveNo').focus();});
    $('saveNo').addEventListener('click',()=>{if(!saving)dialog.close();});dialog.addEventListener('cancel',e=>{if(saving)e.preventDefault();});
    dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const buttons=[...dialog.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(!first){e.preventDefault();dialog.focus();}else if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){e.preventDefault();first.focus();}});
    dialog.addEventListener('close',()=>{($('saveAccount').disabled?$('editAccount'):$('saveAccount')).focus();});
    $('saveYes').addEventListener('click',async()=>{
      if(saving)return;saving=true;updateActions();dialog.focus();status('saveError','');
      try{const result=await api('/api/account/save',{revision,units:account.units.map(unit=>({id:unit.id,level:unit.level,plus:unit.plus,form:unitForm(unit),unlockedForm:unitUnlockedForm(unit)})),treasures:account.treasures,passives:account.passives.map(({id,level,plus})=>({id,level,plus})),...editPatches()});savedAccount=clone(result.account);editing=false;renderAccount(clone(savedAccount),result.revision);dialog.close();status('editStatus','저장했습니다.');}
      catch(error){status('saveError',error.message,true);if(error.status===401)location.assign('login.html');}
      finally{saving=false;updateActions();}
    });
  }

  async function start(){
    if(view==='account'&&await window.NyankoAuthReady===false){finishLoading();location.replace('login.html');return;}
    const boot=await api('/api/bootstrap');
    if(view!=='account'){$('googleLogin').disabled=!boot.googleEnabled;$('googleNote').hidden=boot.googleEnabled;$('googleLogin').addEventListener('click',()=>location.assign('/api/auth/google'));
      let pending=false,authBusy=false;
      if(view==='signup'&&!boot.emailCodeEnabled){$('sendCode').disabled=true;status('status','이메일 인증 준비 중입니다.');}
      if(view==='signup')$('sendCode').addEventListener('click',async()=>{
        if(authBusy)return;
        const form=$('authForm'),b=$('sendCode');
        if(!pending){if(!form.reportValidity())return;if($('password').value!==$('confirmPassword').value){status('status','비밀번호가 일치하지 않습니다.',true);return;}}
        authBusy=true;b.disabled=true;$('signupSubmit').disabled=true;status('status','인증코드를 발송하고 있습니다.');
        try{await api(pending?'/api/auth/resend-email':'/api/auth/signup',pending?{}:Object.fromEntries(new FormData(form)));
          pending=true;$('codeField').hidden=false;$('emailCode').required=true;
          for(const id of ['email','nickname'])$(id).readOnly=true;
          for(const id of ['password','confirmPassword']){$(id).value='';$(id).disabled=true;}
          b.textContent='재발송';status('status','이메일로 받은 인증코드를 입력해 주세요.');$('emailCode').focus();
        }catch(err){status('status',err.message,true);}finally{authBusy=false;b.disabled=false;$('signupSubmit').disabled=!pending;}
      });
      $('authForm').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,b=form.querySelector('button[type=submit]');
        if(authBusy)return;
        if(view==='signup'&&!pending){status('status','이메일 인증코드를 먼저 발송해 주세요.',true);return;}
        authBusy=true;b.disabled=true;if(view==='signup')$('sendCode').disabled=true;status('status',view==='signup'?'회원가입 중입니다.':'로그인 중입니다.');
        try{await api(view==='signup'?'/api/auth/verify-email':'/api/auth/login',view==='signup'?{username:$('username').value,code:$('emailCode').value}:Object.fromEntries(new FormData(form)));$('password').value='';location.assign('/mypage/');}
        catch(err){status('status',err.message,true);}finally{authBusy=false;b.disabled=false;if(view==='signup')$('sendCode').disabled=false;}});return;}
    initPanels();initEditing();initEditor();$('addClearedStage').addEventListener('click',addStageEditor);tooltips();[metadata,medalCatalog]=await Promise.all([fetch('account-metadata.json',{cache:'no-cache'}).then(r=>r.json()),fetch('../medal/catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(value=>{if(!Array.isArray(value.entries))throw new Error();return value;}).catch(()=>null)]);let data;
    try{data=await api('/api/account');}catch(e){finishLoading();if(e.status===401){location.replace('login.html');return;}throw e;}
    finishLoading();$('accountView').hidden=false;status('status','');$('userName').textContent=`안녕하세요, ${data.user.username||data.user.nickname||'사용자'} 님.`;
    savedAccount=clone(data.account);renderAccount(clone(data.account),data.revision);updateActions();
    const form=$('linkForm'),clearTransfer=()=>form.reset();addEventListener('pagehide',clearTransfer);clearTransfer();
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(linking||editing||saving)return;
      let payload={code:$('transferCode').value,pin:$('transferPin').value};clearTransfer();linking=true;updateActions();status('linkStatus','게임 계정 데이터를 불러오고 있습니다.');
      try{const result=await api('/api/account/link',payload);savedAccount=clone(result.account);renderAccount(clone(result.account),result.revision);status('linkStatus','계정 연동을 완료했습니다.');status('editStatus','');}
      catch(error){status('linkStatus',error.message,true);if(error.status===401)location.assign('login.html');}
      finally{if(payload){payload.code='';payload.pin='';}payload=null;clearTransfer();linking=false;updateActions();}
    });
  }
  start().catch(e=>{finishLoading();status('status',e.message||'서버에 연결하지 못했습니다.',true);});
})();
