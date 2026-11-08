/* Account defaults are a one-way, allowlisted copy. Calculators never update it. */
(() => {
  'use strict';
  const key='nyanko-db:account-defaults:v1',root=new URL('./',document.currentScript.src);
  const unitKey='nyanko-db:shared-settings:v1',enemyKey='nyanko-db:enemy-shared-settings:v1',stageKey='nyanko-db:stage-shared-settings:v1';
  const copy=value=>structuredClone(value),validNumber=(n,min=0)=>Number.isSafeInteger(n)&&n>=min;
  const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch(_){return {};}};
  const relative=()=>location.pathname.startsWith(root.pathname)?location.pathname.slice(root.pathname.length):'';
  const currentUnit=()=>/^unit\/unit(\d+)\.html$/.exec(relative())?.[1];
  function snapshot(){const v=read(key);return v.version===1&&typeof v.generation==='string'&&v.units&&v.treasures&&Array.isArray(v.storyTreasures)?v:null;}
  function write(k,value){const text=typeof value==='string'?value:JSON.stringify(value);if(localStorage.getItem(k)!==text)localStorage.setItem(k,text);}
  function prime(v=snapshot()){
    if(!v)return;
    const flat={};
    for(const[name,chapters]of Object.entries(v.treasures)){
      if(!/^[a-z_]+$/.test(name)||!Array.isArray(chapters))continue;
      chapters.forEach((slots,c)=>Array.isArray(slots)&&slots.forEach((q,s)=>{if(validNumber(q)&&q<=3)flat[`${name}.${c}.${s}`]=q;}));
    }
    const u=read(unitKey),e=read(enemyKey),s=read(stageKey);
    u.treasures={...u.treasures,...copy(v.treasures)};e.treasures={...e.treasures,...flat};s.treasures={...s.treasures,...copy(v.treasures)};
    if(v.passives?.research)u.passives={...u.passives,research:copy(v.passives.research)};
    if(v.passives?.accounting)e.accounting=copy(v.passives.accounting);
    if(v.passives?.study)s.passives={...s.passives,study:copy(v.passives.study)};
    write(unitKey,u);write(enemyKey,e);write(stageKey,s);
    const id=currentUnit(),levels=id&&v.units[String(Number(id))];
    if(levels){const k=`nyanko-db:unit:${Number(id)}:display-state:v1`;write(k,{...read(k),levels:copy(levels)});}
  }
  const notify=k=>window.dispatchEvent(new StorageEvent('storage',{key:k}));
  function input(id,value){const n=document.getElementById(id);if(!n||n.disabled)return;n.value=String(value);n.dispatchEvent(new Event('input',{bubbles:true}));}
  function stageData(){try{return typeof DATA!=='undefined'&&DATA.stage?DATA:null;}catch(_){return null;}}
  const supported=href=>/^stage\/(?:eoc|W0[456]|Space0[789]|(?:N|S|C|NA|ND|V|B|A|CA|Q|H|D|G|DM|EX)\d{3})\/\d+\.html$/.test(href);
  function seedStage(v,data){
    if(!data||data.location)return;
    const href=relative(),id=String(data.stage.id),select=document.getElementById('crownSelect');
    const selection=Number(select?.value)||0,chapter=data.story?.chapters?.[selection]?.chapter??data.story?.chapter;
    const saveChapter=data.story?chapter-1+([0,4,7][data.story.family]??0):null;
    const rows=(v.clearedStages||[]).filter(r=>r.href===href);
    const row=rows.find(r=>saveChapter!==null?r.chapter===saveChapter:r.crown===selection+1);
    // Missing positive records imply zero only in parser-supported numeric families.
    if(v.hasClearedStages&&(supported(href)||validNumber(row?.count))){
      write(`nyanko-db:stage:${id}:previous-clear-count:v1`,String(validNumber(row?.count)?row.count:0));
    }
    if(v.hasClearedStages&&data.zombieSource){
      // This calculator control is a 0/1 completion switch, not a measured count.
      const completed=rows.some(r=>r.cleared===true);
      write(`nyanko-db:stage:${id}:previous-clear-count:v1`,completed?'1':'0');
      const source=data.zombieSource,sourceChapter=source.chapter-1+([0,4,7][source.family]??0);
      const sourceRow=(v.clearedStages||[]).find(r=>r.id===source.id&&r.chapter===sourceChapter);
      write(`nyanko-db:stage:${source.id}:previous-clear-count:v1`,String(validNumber(sourceRow?.count)?sourceRow.count:0));
    }
    if(data.story){
      const k=`nyanko-db:stage:${data.zombieSource?.id||id}:story-rewards:v1`,old=read(k),chapters={...old.chapters};
      for(const ch of data.story.chapters){
        const index=ch.chapter-1+([0,4,7][data.story.family]??0),quality=v.storyTreasures[index]?.[data.story.resourceIndex];
        const zombieHref=`stage/Z${String(index).padStart(3,'0')}/${data.story.fileIndex}.html`;
        if(validNumber(quality)&&quality<=3)chapters[ch.chapter]={...chapters[ch.chapter],quality,...(v.hasClearedStages?{zombieCleared:(v.clearedStages||[]).some(r=>r.href===zombieHref&&r.cleared===true)}:{})};
      }
      write(k,{...old,chapters});
    }
  }
  function refresh(v=snapshot()){
    if(!v)return;
    prime(v);
    if(currentUnit()!==undefined){
      // Use the original calculator restore/render functions and input handlers.
      if(typeof restoreSharedSettings==='function')restoreSharedSettings();
      if(typeof applyFixedPreset==='function')applyFixedPreset();
      if(typeof renderTreasureSettings==='function')renderTreasureSettings();
      const levels=v.units[String(Number(currentUnit()))];
      if(levels&&!(typeof fixedPreset!=='undefined'&&fixedPreset)){input('baseLevelNumber',levels.baseLevel);input('plusLevelNumber',levels.plusLevel);}
      else if(typeof updateStats==='function')updateStats(document.getElementById('baseLevelNumber')?.value,document.getElementById('plusLevelNumber')?.value);
    }else if(stageData()){
      seedStage(v,stageData());notify(stageKey);
    }else if(/^enemy\/enemy\d+\.html$/.test(relative())){
      notify(enemyKey);
      // Accounting is a passive with its own existing render/input path.
      if(v.passives?.accounting&&typeof state!=='undefined'&&!(typeof enemyFixedPreset!=='undefined'&&enemyFixedPreset)){
        state.accounting=copy(v.passives.accounting);
        if(typeof renderTreasure==='function')renderTreasure();
        if(typeof renderStats==='function')renderStats();
      }
    }
  }
  function create(profile,metadata){
    const treasures={},units={},passives={};
    for(const family of metadata.stories)for(const item of family.items){
      if(!item.calculatorKey)continue;
      const chapters=item.chapters.map((slots,c)=>slots.map(slot=>profile.treasures[family.saveIndices[c]]?.[slot.resourceIndex]));
      if(chapters.every(slots=>slots.every(q=>validNumber(q)&&q<=3)))treasures[item.calculatorKey]=chapters;
    }
    for(const u of profile.units)if(validNumber(u.id)&&validNumber(u.level,1)&&validNumber(u.plus))units[String(u.id)]={baseLevel:u.level,plusLevel:u.plus};
    for(const[name,id]of[['research',6],['accounting',7],['study',8]]){
      const p=profile.passives?.find(p=>p.id===id);if(p&&validNumber(p.level,1)&&validNumber(p.plus))passives[name]={baseLevel:p.level,plusLevel:p.plus};
    }
    const ids=new Map((window.NYANKODB_SEARCH_CATALOG?.entries||[]).filter(e=>e.kind==='stage').map(e=>[e.href,e.id]));
    return {version:1,generation:crypto.randomUUID(),units,treasures,passives,storyTreasures:copy(profile.treasures),hasClearedStages:Array.isArray(profile.clearedStages),clearedStages:(profile.clearedStages||[]).map(({href,count,crown,chapter,cleared})=>({href,id:String(ids.get(href)??''),count,crown,...(chapter===undefined?{}:{chapter}),...(cleared===true?{cleared:true}:{})}))};
  }
  function resetStoredSettings(){
    const keys=Object.keys(localStorage),before=new Map();
    function save(k,value){before.set(k,localStorage.getItem(k));if(value===null)localStorage.removeItem(k);else write(k,value);}
    function dropPassive(value,name){if(value.passives&&typeof value.passives==='object')delete value.passives[name];}
    try{
      for(const k of keys){
        const unit=k===unitKey||/^nyanko-db:unit:\d+:display-state:v1$/.test(k);
        const enemy=k===enemyKey||/^nyankodb\.enemy\.\d+$/.test(k);
        if(unit||enemy||k===stageKey){
          const value=read(k);delete value.treasures;
          if(unit){dropPassive(value,'research');if(k!==unitKey)delete value.levels;}
          if(enemy)delete value.accounting;
          if(k===stageKey)dropPassive(value,'study');
          save(k,value);
        }else if(/^nyanko-db:stage:.+:previous-clear-count:v1$/.test(k))save(k,null);
        else if(/^nyanko-db:stage:.+:story-rewards:v1$/.test(k)){
          const value=read(k);
          for(const chapter of Object.values(value.chapters||{}))if(chapter&&typeof chapter==='object'){delete chapter.quality;delete chapter.zombieCleared;}
          save(k,value);
        }
      }
      const marker={version:1,disabled:true,generation:crypto.randomUUID()};save(key,marker);return marker;
    }catch(error){
      for(const[k]of before)try{localStorage.removeItem(k);}catch(_){}
      for(const[k,value]of before)if(value!==null)try{localStorage.setItem(k,value);}catch(_){}
      throw error;
    }
  }
  function resetView(){
    if(currentUnit()!==undefined){
      if(typeof fixedPreset!=='undefined'&&fixedPreset)return;
      document.getElementById('treasureResetButton')?.click();
      if(typeof currentData!=='undefined'){
        const url=new URL(location.href);url.searchParams.delete('level');url.searchParams.delete('plus');
        history.replaceState(history.state,'',url);
        input('baseLevelNumber',currentData.initialBaseLevel);input('plusLevelNumber',currentData.initialPlusLevel);
      }
    }else if(stageData()){
      // Replacing a focused number input can emit change with its old value.
      // Set the visible value before the original renderer replaces that node.
      const count=document.getElementById('previousClearCount');if(count)count.value='0';
      const data=stageData();write(`nyanko-db:stage:${data.stage.id}:previous-clear-count:v1`,'0');
      if(data.zombieSource)write(`nyanko-db:stage:${data.zombieSource.id}:previous-clear-count:v1`,'0');
      notify(stageKey);document.getElementById('treasureResetButton')?.click();
    }else if(/^enemy\/enemy\d+\.html$/.test(relative())){
      if(typeof enemyFixedPreset!=='undefined'&&enemyFixedPreset)return;
      document.getElementById('treasure-reset')?.click();
    }
  }
  let seenGeneration=read(key).generation;
  function changed(){
    const value=read(key);
    if(value.disabled===true&&value.generation!==seenGeneration)resetView();
    else if(snapshot())refresh();
    seenGeneration=value.generation;
    window.dispatchEvent(new Event('nyanko-account-defaults-changed'));
  }

  window.NyankoAccountDefaults={
    apply(profile,metadata){
      const v=create(profile,metadata),keys=[key,unitKey,enemyKey,stageKey];
      const id=currentUnit();if(id!==undefined)keys.push(`nyanko-db:unit:${Number(id)}:display-state:v1`);
      const before=keys.map(k=>[k,localStorage.getItem(k)]);
      try{prime(v);localStorage.setItem(key,JSON.stringify(v));refresh(v);seenGeneration=v.generation;window.dispatchEvent(new Event('nyanko-account-defaults-changed'));}
      catch(error){
        // A failed storage write must not leave a newly enabled snapshot behind.
        for(const[k]of before)try{localStorage.removeItem(k);}catch(_){}
        for(const[k,value]of before)if(value!==null)try{localStorage.setItem(k,value);}catch(_){}
        throw error;
      }
    },
    active:()=>snapshot()!==null,
    unlink(){resetStoredSettings();changed();},
    clear(){try{localStorage.removeItem(key);window.dispatchEvent(new Event('nyanko-account-defaults-changed'));}catch(_){}},
  };
  // Prime synchronous stores before the following inline calculator bootstrap.
  try{if(!relative().startsWith('mypage/'))prime();}catch(_){}
  document.addEventListener('DOMContentLoaded',()=>{
    // URL levels are explicit navigation choices; the original URL parser wins.
    try{
      const v=snapshot();if(!v)return;
      const data=stageData();if(data){seedStage(v,data);notify(stageKey);}
      document.getElementById('crownSelect')?.addEventListener('change',()=>{try{const fresh=snapshot();if(fresh){seedStage(fresh,stageData());notify(stageKey);}}catch(_){}});
    }catch(_){}
  },{once:true});
  window.addEventListener('storage',event=>{if(event.key===key){try{changed();}catch(_){}}});
  window.addEventListener('pageshow',event=>{if(event.persisted){try{changed();}catch(_){}}});
})();

/* Shared GNB markup. Load immediately after the data-nyanko-gnb placeholder. */
(() => {
  "use strict";
  const root = new URL("./", document.currentScript.src);
  function loadAnalytics() {
    const host = location.hostname;
    if (!["nyanko.wiki", "www.nyanko.wiki", "nyankodb.vercel.app"].includes(host) &&
        !host.endsWith("-project-team22.vercel.app")) return;
    const src = new URL("analytics-bundle.js", root).href;
    if ([...document.scripts].some(script => script.src === src)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAnalytics, { once: true });
  } else {
    loadAnalytics();
  }
  for (const header of document.querySelectorAll("[data-nyanko-gnb]:not([data-gnb-mounted])")) {
    const prefix = header.dataset.searchPrefix || "unitSearch";
    header.className = "db-toolbar nyanko-gnb";
    header.dataset.gnbSettling = "true";
    header.setAttribute("aria-label", "냥코DB 메뉴");
    header.innerHTML = `
      <div class="gnb-leading">
      <a class="db-brand gnb-brand" id="homeLink" aria-label="냥코DB 홈">냥코<span>DB</span></a>
      <nav class="gnb-menu" aria-label="냥코DB 메뉴">
        <a class="gnb-menu-link gnb-desktop-link" data-section="home"><span class="nyanko-bottom-navigation-icon" aria-hidden="true"></span><span>홈</span></a>
        <span class="gnb-sidebar-divider" aria-hidden="true"></span>
        <a class="gnb-menu-link" data-section="unit"><img alt="" width="30" height="30"><span>유닛</span></a>
        <a class="gnb-menu-link" data-section="enemy"><img alt="" width="30" height="30"><span>적</span></a>
        <a class="gnb-menu-link" data-section="item"><img alt="" width="30" height="30"><span>아이템</span></a>
        <a class="gnb-menu-link" data-section="stage"><img alt="" width="30" height="30"><span>스테이지</span></a>
        <a class="gnb-menu-link" data-section="event"><img alt="" width="30" height="30"><span>일정</span></a>
        <a class="gnb-menu-link" data-section="combo"><img alt="" width="30" height="30"><span>냥콤보</span></a>
        <a class="gnb-menu-link" data-section="medal"><img alt="" width="30" height="30"><span>메달</span></a>
        <span class="gnb-sidebar-divider" aria-hidden="true"></span>
        <a class="gnb-menu-link gnb-desktop-link" data-section="mypage"><span class="nyanko-bottom-navigation-icon" aria-hidden="true"></span><span>마이페이지</span></a>
        <span class="gnb-menu-indicator" aria-hidden="true"></span>
      </nav>
      </div>
      <div class="gnb-actions">
      <form class="unit-search gnb-search" role="search">
        <label>검색</label>
        <div class="unit-search-field gnb-search-field">
          <svg class="gnb-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path></svg>
          <input type="search" autocomplete="off" spellcheck="false"
            aria-label="검색할 유닛 이름" aria-autocomplete="list" aria-expanded="false">
          <div class="unit-search-results gnb-search-results" role="listbox" aria-label="유닛 이름 검색 결과" hidden></div>
        </div>
      </form>
      <button type="button" class="gnb-auth" data-auth-pending="true" aria-hidden="true" disabled></button>
      </div>`;
    header.querySelector(".gnb-brand").href = new URL("index.html", root).href;
    for (const link of header.querySelectorAll(".gnb-menu-link")) {
      const section = link.dataset.section;
      const path = section === "home" ? "index.html" : section === "mypage" ? "mypage/" : `${section}/index.html`;
      link.href = new URL(path, root).href;
      const image = link.querySelector("img");
      if (image) image.src = new URL(`img/ui/gnb/${section}.png`, root).href;
      else link.querySelector(".nyanko-bottom-navigation-icon").style.setProperty(
        "--nyanko-navigation-icon", `url("${new URL(`img/ui/navigation/${section}.svg`, root).href}")`);
      const isCurrent = section === "home"
        ? location.pathname === root.pathname || location.pathname === new URL("index.html", root).pathname
        : location.pathname.startsWith(new URL(`${section}/`, root).pathname);
      if (isCurrent) {
        link.setAttribute("aria-current", "location");
      }
    }
    const form = header.querySelector("form");
    const input = header.querySelector("input");
    const results = header.querySelector('[role="listbox"]');
    form.id = `${prefix}Form`;
    input.id = `${prefix}Input`;
    input.placeholder = "";
    results.id = `${prefix}Results`;
    header.querySelector("label").htmlFor = input.id;
    input.setAttribute("aria-controls", results.id);
    const menu = header.querySelector(".gnb-menu");
    const links = [...menu.querySelectorAll("a")];
    const indicator = menu.querySelector(".gnb-menu-indicator");
    const current = links.find(link => link.hasAttribute("aria-current"));
    let selected = current;
    let navigationPending = false;
    let settlingFrame = 0;
    function emphasize(link) {
      selected = link;
      for (const item of links) item.classList.toggle("is-emphasized", item === link);
      const visible = link && link.getClientRects().length > 0;
      indicator.style.opacity = visible ? "1" : "0";
      if (visible) {
        const desktop = !matchMedia("(max-width: 820px)").matches;
        indicator.style.width = desktop ? "2px" : `${link.offsetWidth}px`;
        indicator.style.height = desktop ? `${link.offsetHeight}px` : "2px";
        indicator.style.transform = desktop ? `translateY(${link.offsetTop}px)` : `translateX(${link.offsetLeft}px)`;
      }
    }
    function settleOn(link) {
      cancelAnimationFrame(settlingFrame);
      header.dataset.gnbSettling = "true";
      emphasize(link);
      if (link?.getClientRects().length && matchMedia("(max-width: 820px)").matches) {
        if (link.offsetLeft < menu.scrollLeft) menu.scrollLeft = link.offsetLeft;
        else if (link.offsetLeft + link.offsetWidth > menu.scrollLeft + menu.clientWidth)
          menu.scrollLeft = link.offsetLeft + link.offsetWidth - menu.clientWidth;
      }
      // Resolve the final sidebar layout before allowing interaction transitions.
      void indicator.offsetWidth;
      settlingFrame = requestAnimationFrame(() => {
        emphasize(selected);
        void indicator.offsetWidth;
        settlingFrame = requestAnimationFrame(() => {
          delete header.dataset.gnbSettling;
          settlingFrame = 0;
        });
      });
    }
    for (const link of links) {
      link.addEventListener("pointerenter", () => { if (!navigationPending) emphasize(link); });
      link.addEventListener("focus", () => { if (!navigationPending) emphasize(link); });
      link.addEventListener("click", event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        event.preventDefault();
        if (navigationPending) return;
        navigationPending = true;
        emphasize(link);
        // Let the selection feedback finish before normal document navigation.
        window.setTimeout(() => location.assign(link.href), 180);
      });
    }
    const restore = () => {
      if (!navigationPending) emphasize(links.find(link => link === document.activeElement) || current);
    };
    menu.addEventListener("pointerleave", restore);
    menu.addEventListener("focusout", () => queueMicrotask(restore));
    new ResizeObserver(() => settleOn(selected)).observe(menu);
    window.addEventListener("pageshow", () => { navigationPending = false; settleOn(current); });
    settleOn(current);
    header.dataset.gnbMounted = "true";
  }
  // Server-verified state only. No tokens or user data are stored in the GNB.
  let stateRequest;
  async function refreshAuth() {
    if (stateRequest) return stateRequest;
    stateRequest = (async () => {
      let authenticated = false;
      try {
        if (/^https?:$/.test(root.protocol)) {
          const response = await fetch(new URL('api/auth/session', root), {
            credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(10000),
          });
          if (response.ok) {
            authenticated = (await response.json()).authenticated === true;
            if (!authenticated) window.NyankoAccountDefaults.clear();
            
          }
        }
      } catch (_) { /* Static hosts have no account backend. */ }
      for (const button of document.querySelectorAll('.gnb-auth')) {
        button.dataset.authenticated = String(authenticated);
        button.textContent = authenticated ? '로그아웃' : '로그인';
        button.disabled = false;
        delete button.dataset.authPending;
        button.removeAttribute('aria-hidden');
      }
      return authenticated;
    })();
    try { return await stateRequest; } finally { stateRequest = null; }
  }
  for (const button of document.querySelectorAll('.gnb-auth')) {
    button.addEventListener('click', async () => {
      if (button.dataset.authenticated !== 'true') {
        location.assign(new URL('mypage/login.html', root));
        return;
      }
      button.disabled = true;
      try {
        const boot = await fetch(new URL('api/bootstrap', root), { credentials: 'same-origin', cache: 'no-store' });
        if (!boot.ok) throw new Error('Session unavailable');
        const csrf = document.cookie.split('; ').find(item => item.startsWith('nyanko_csrf='))?.split('=')[1] || '';
        const response = await fetch(new URL('api/auth/logout', root), {
          method: 'POST', credentials: 'same-origin', cache: 'no-store',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: '{}',
        });
        if (!response.ok) throw new Error('Logout failed');
        window.NyankoAccountDefaults.clear();
        
        if (location.pathname.startsWith(new URL('mypage/', root).pathname)) {
          location.replace(new URL('mypage/login.html', root));
        } else await refreshAuth();
      } catch (_) {
        // Keep the verified label; do not claim that a failed logout succeeded.
        button.disabled = false;
      }
    });
  }
  window.NyankoAuthReady = refreshAuth();
  window.addEventListener('pageshow', event => { if (event.persisted) refreshAuth(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshAuth(); });
  window.addEventListener('nyanko-auth-changed', refreshAuth);



  // Keep one viewport-sized mobile bar across pages with different CSS zoom.
  function mountBottomNavigation() {
    if (document.getElementById("nyankoBottomNavigation")) return;
    const navigation = document.createElement("nav");
    navigation.id = "nyankoBottomNavigation";
    navigation.className = "nyanko-bottom-navigation";
    navigation.setAttribute("aria-label", "냥코DB 하단 메뉴");
    const relativePath = location.pathname.slice(root.pathname.length);
    const current = !relativePath || relativePath === "index.html" ? "home"
      : /^mypage(?:\/|$)/.test(relativePath) ? "mypage" : "explore";
    const items = [
      { key: "home", label: "홈", path: "index.html" },
      { key: "explore", label: "탐색", path: "unit/index.html" },
      { key: "mypage", label: "마이페이지", path: "mypage/" },
    ];
    for (const item of items) {
      const link = document.createElement("a");
      link.className = "nyanko-bottom-navigation-link";
      link.href = new URL(item.path, root).href;
      if (item.key === current) link.setAttribute("aria-current", "location");
      const icon = document.createElement("span");
      icon.className = "nyanko-bottom-navigation-icon";
      icon.setAttribute("aria-hidden", "true");
      const iconUrl = new URL(`img/ui/navigation/${item.key}.svg`, root).href;
      icon.style.setProperty("--nyanko-navigation-icon", `url("${iconUrl}")`);
      const label = document.createElement("span");
      label.textContent = item.label;
      link.append(icon, label);
      navigation.append(link);
    }
    document.body.append(navigation);
    const sidebarHeader = document.querySelector("header[data-nyanko-gnb][data-gnb-mounted]");
    const sidebarActions = sidebarHeader?.querySelector(".gnb-actions");
    const sidebarForm = sidebarActions?.querySelector(".gnb-search");
    let searchSidebar;
    if (sidebarForm && !document.documentElement.classList.contains("event-embedded")) {
      searchSidebar = document.createElement("aside");
      searchSidebar.className = "db-toolbar nyanko-gnb gnb-search-sidebar";
      searchSidebar.setAttribute("aria-label", "냥코DB 검색");
      sidebarHeader.after(searchSidebar);
    }
    function updateNavigationScale() {
      const focused = sidebarForm?.contains(document.activeElement) ? document.activeElement : null;
      document.body.classList.remove("has-nyanko-bottom-navigation", "has-nyanko-sidebar");
      const originalPadding = getComputedStyle(document.body).paddingBottom;
      const originalLeftPadding = getComputedStyle(document.body).paddingLeft;
      const originalRightPadding = getComputedStyle(document.body).paddingRight;
      let pageZoom = 1;
      for (let element = document.body; element; element = element.parentElement) {
        const zoom = getComputedStyle(element).zoom;
        pageZoom *= (Number.parseFloat(zoom) || 1) / (zoom.endsWith("%") ? 100 : 1);
      }
      document.body.style.setProperty("--nyanko-bottom-base-padding", originalPadding);
      document.body.style.setProperty("--nyanko-bottom-inverse-zoom", String(1 / pageZoom));
      navigation.style.zoom = String(1 / pageZoom);
      document.body.classList.add("has-nyanko-bottom-navigation");
      const header = document.querySelector("header[data-nyanko-gnb][data-gnb-mounted]");
      if (header && !document.documentElement.classList.contains("event-embedded")) {
        document.body.style.setProperty("--nyanko-sidebar-base-padding", originalLeftPadding);
        document.body.style.setProperty("--nyanko-sidebar-base-right-padding", originalRightPadding);
        document.body.style.setProperty("--nyanko-sidebar-inverse-zoom", String(1 / pageZoom));
        if (searchSidebar) {
          const mobile = matchMedia("(max-width: 820px)").matches;
          const destination = mobile ? sidebarActions : searchSidebar;
          if (sidebarForm.parentElement !== destination) {
            if (mobile) destination.prepend(sidebarForm); else destination.append(sidebarForm);
          }
        }
        document.body.classList.add("has-nyanko-sidebar");
      }
      if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
    }
    updateNavigationScale();
    window.addEventListener("resize", updateNavigationScale);
    window.addEventListener("pageshow", updateNavigationScale);
  }
  if (document.body) {
    mountBottomNavigation();
    if (document.readyState === "loading") {
      // Paint early, then retain the original final keyboard navigation order.
      document.addEventListener("DOMContentLoaded", () => {
        const navigation = document.getElementById("nyankoBottomNavigation");
        if (!navigation || document.body.lastElementChild === navigation) return;
        const focused = navigation.contains(document.activeElement) ? document.activeElement : null;
        document.body.append(navigation);
        if (focused) focused.focus({ preventScroll: true });
      }, { once: true });
    }
  } else {
    document.addEventListener("DOMContentLoaded", mountBottomNavigation, { once: true });
  }
})();
