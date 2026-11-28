/* Official treasure-festival intervals, sharing stage calendar parsing and timers. */
(() => {
  "use strict";
  const source = document.currentScript, base = new URL(".", source.src);
  const definitions = Object.freeze({
    eoc: { eventMapId: 100, name: "세계편", href: "stage/eoc/index.html" },
    itf: { eventMapId: 101, name: "미래편", href: "stage/W04/index.html" },
    cotc: { eventMapId: 104, name: "우주편", href: "stage/Space07/index.html" },
  });
  const stageIndex = /^\/stage\/(?:index\.html)?$/.test(location.pathname) && document.getElementById("stageResults");
  const locationGuides = [
    {file: "guide_otfest", label: "트레져 페스티벌"},
    {file: "guide_halfenergy", label: "필요 통솔력 절반"},
  ];
  const futureChapters = ["W04", "W05", "W06"];
  const halfEnergyGroups = {
    "세계편": ["EoC1", "EoC2", "EoC3"], "미래편": futureChapters,
    "우주편": ["Space07", "Space08", "Space09"],
    "레전드 스토리": ["legend"], "신 레전드 스토리": ["uncanny"], "레전드 스토리 0": ["legendZero"],
  };
  const categoryByHalfEnergyCode = new Map(Object.entries(halfEnergyGroups)
    .flatMap(([category, codes]) => codes.map(code => [code, category])));
  const outbreakChapters = {Z000:"EoC1", Z001:"EoC2", Z002:"EoC3", Z004:"W04", Z005:"W05", Z006:"W06",
    Z007:"Space07", Z008:"Space08", Z009:"Space09", Space09_Invasion:"Space09"};
  const settingsKey = "nyanko-db:event-settings:v2";
  let api, calendars = {}, halfEnergyCalendars = {}, region, inFlight = false;
  const listeners = new Set();
  function selectedRegion() {
    try { return JSON.parse(localStorage.getItem(settingsKey))?.region === "jp" ? "jp" : "kr"; }
    catch (_) { return "kr"; }
  }
  function calendarState(calendar, now) {
    return region === selectedRegion() && calendar ? api.stateAt(calendar, now) : {state:"none"};
  }
  function state(family, now = Date.now()) {
    return calendarState(calendars[family], now);
  }
  function halfEnergyState(code, now = Date.now()) {
    return calendarState(halfEnergyCalendars[code], now);
  }
  function notify() { for (const listener of listeners) listener(); }
  function subscribe(listener) { listeners.add(listener); listener(); return () => listeners.delete(listener); }
  async function refresh() {
    if (inFlight || document.hidden) return;
    const requestedRegion = selectedRegion();
    if (requestedRegion !== region) { region = requestedRegion; calendars = {}; halfEnergyCalendars = {}; notify(); }
    inFlight = true;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const feed = await api.fetchFeed(source, controller.signal, requestedRegion);
      if (requestedRegion !== selectedRegion()) return;
      const next = Object.fromEntries(Object.keys(definitions).map(family => [family, api.parseFestivalFeed(feed, family, requestedRegion)]));
      calendars = next;
      const codes = Object.keys(feed.halfEnergy?.maps || {});
      if (feed.halfEnergy != null && !codes.length) api.parseHalfEnergyFeed(feed, futureChapters[0], requestedRegion);
      halfEnergyCalendars = Object.fromEntries(codes.map(code => [code, api.parseHalfEnergyFeed(feed, code, requestedRegion)]));
    } catch (_) { /* Previously verified intervals retain the shared explicit freshness limit. */ }
    finally {
      clearTimeout(timeout); inFlight = false; notify();
      if (requestedRegion !== selectedRegion()) void refresh();
    }
  }
  function storyLocationFamily(code) {
    return code === "eoc" ? "eoc" : /^W0[4-6]$/.test(code) ? "itf" : /^Space0[7-9]$/.test(code) ? "cotc" : null;
  }
  function activeDiscount(code, chapter, now) {
    if (/^B\d{3}$/.test(code)) return null;
    const legend = /^N\d{3}$/.test(code) ? "legend" : /^NA\d{3}$/.test(code) ? "uncanny" : /^ND\d{3}$/.test(code) ? "legendZero" : null;
    const targets = code === "eoc" ? (chapter ? [`EoC${chapter}`] : halfEnergyGroups["세계편"]) : [outbreakChapters[code] || code];
    if (legend) targets.push(legend);
    let current = null;
    for (const target of targets) {
      const period = halfEnergyState(target, now);
      if (period.state === "active" && (!current || current.end < period.end)) current = period;
    }
    return current;
  }
  function decorateLocation(card, now = Date.now()) {
    const code = card.dataset.stageLocationCode;
    if (!stageIndex || !code) return;
    const family = storyLocationFamily(code);
    const festival = family && state(family, now).state === "active";
    const discount = activeDiscount(code, null, now);
    let badges = card.querySelector(".stage-location-promotions");
    if (!badges && (festival || discount)) {
      badges = document.createElement("span"); badges.className = "stage-location-promotions";
      for (const {file, label} of locationGuides) {
        const image = document.createElement("img");
        image.src = new URL(`img/icon/${file}.png`, base).href; image.alt = label;
        image.width = 48; image.height = 37; badges.append(image);
      }
      card.append(badges);
    }
    if (!badges) return;
    badges.children[0].hidden = !festival;
    badges.children[1].hidden = !discount;
    badges.hidden = !festival && !discount;
    const description = locationGuides.filter((_, index) => !badges.children[index].hidden).map(({label}) => label).join(", ");
    if (!description) card.removeAttribute("aria-description");
    else if (card.getAttribute("aria-description") !== description) card.setAttribute("aria-description", description);
  }
  function decorateList(root = document) {
    for (const heading of root.querySelectorAll(".stage-section-heading[data-festival-family]")) {
      let image = heading.querySelector(".stage-festival-guide:not(.stage-half-energy-guide)");
      if (!image) {
        image = document.createElement("img"); image.className = "stage-festival-guide";
        image.src = new URL("img/icon/guide_otfest.png", base).href; image.alt = "트레져 페스티벌";
        image.width = 48; image.height = 37; image.hidden = true;
        heading.querySelector("small").after(image);
      }
      image.hidden = state(heading.dataset.festivalFamily).state !== "active";
    }
    if (!stageIndex) return;
    const now = Date.now();
    const activeCategories = new Set();
    for (const code of Object.keys(halfEnergyCalendars)) {
      if (halfEnergyState(code, now).state !== "active") continue;
      activeCategories.add(categoryByHalfEnergyCode.get(code) ?? window.NyankoSearch.stageCategoryForLocation(code));
    }
    for (const [code, chapter] of Object.entries(outbreakChapters)) {
      if (code.startsWith("Z") && halfEnergyState(chapter, now).state === "active") {
        activeCategories.add(window.NyankoSearch.stageCategoryForLocation(code));
      }
    }
    for (const heading of root.querySelectorAll(".stage-section-heading")) {
      const active = activeCategories.has(heading.parentElement.getAttribute("aria-label"));
      let image = heading.querySelector(".stage-half-energy-guide");
      if (!image && !active) continue;
      if (!image) {
        image = document.createElement("img"); image.className = "stage-festival-guide stage-half-energy-guide";
        image.src = new URL("img/icon/guide_halfenergy.png", base).href; image.alt = "필요 통솔력 절반";
        image.width = 48; image.height = 37; image.hidden = true;
        (heading.querySelector(".stage-festival-guide") || heading.querySelector("small")).after(image);
      }
      image.hidden = !active;
    }
    for (const card of root.querySelectorAll(".stage-card[data-stage-location-code]")) decorateLocation(card, now);
  }
  function storyFamily() {
    if (typeof DATA === "undefined" || DATA.zombieSource) return null;
    if (DATA.story) return ["eoc", "itf", "cotc"][DATA.story.family] ?? null;
    if (!DATA.location) return null;
    return storyLocationFamily(String(DATA.stage?.locationId || ""));
  }
  function attachNotice() {
    const family = storyFamily(), continueIcon = document.getElementById("continueIcon");
    const heading = continueIcon?.closest(".stage-heading");
    if (!family || !heading) return;
    const style = document.createElement("style"); style.id = "treasureFestivalNoticeStyles";
    style.textContent = `
      .treasure-festival-notice { width: 200px; height: 200px; pointer-events: none; }
      .stage-heading.has-treasure-festival-notice { padding-right: 216px; min-height: 126px; }
      .stage-heading.has-treasure-festival-and-continue { padding-right: 368px; min-height: 140px; }
      .stage-heading.has-treasure-festival-and-continue .treasure-festival-notice { right: 152px; }
      .treasure-festival-notice > img, .treasure-festival-notice > svg {
        position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
      }
      .treasure-festival-notice text { fill: #fff; font-family: inherit; font-size: 26px; font-weight: 950; font-variant-numeric: tabular-nums; }
      @media (max-width: 760px) {
        .treasure-festival-notice { width: 160px; height: 160px; }
        .stage-heading.has-treasure-festival-notice { padding-right: 170px; min-height: 101px; }
        .stage-heading.has-treasure-festival-and-continue { padding-right: 293px; min-height: 115px; }
        .stage-heading.has-treasure-festival-and-continue .treasure-festival-notice { right: 123px; }
      }
    `;
    document.head.append(style);
    const notice = document.createElement("span"); notice.id = "treasureFestivalNotice";
    notice.className = "continue-icon treasure-festival-notice"; notice.hidden = true;
    notice.setAttribute("role", "timer"); notice.setAttribute("aria-live", "off");
    const image = document.createElement("img"); image.src = new URL("img/icon/otfest_notice.png", base).href; image.alt = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 277 174"); svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet"); svg.setAttribute("focusable", "false");
    const noticeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    for (const [name, value] of Object.entries({x:"138.5", y:"106", "text-anchor":"middle", "dominant-baseline":"middle", textLength:"185", lengthAdjust:"spacingAndGlyphs"})) noticeText.setAttribute(name, value);
    svg.append(noticeText); notice.append(image, svg); heading.append(notice);
    function syncLayout() {
      heading.classList.toggle("has-treasure-festival-notice", !notice.hidden);
      heading.classList.toggle("has-treasure-festival-and-continue", !notice.hidden && !continueIcon.hidden);
    }
    new MutationObserver(syncLayout).observe(continueIcon, {attributes:true, attributeFilter:["hidden"]});
    subscribe(() => {
      const current = state(family);
      notice.hidden = current.state !== "active";
      if (!notice.hidden) {
        noticeText.textContent = "앞으로 " + api.duration(current.end - Date.now());
        notice.setAttribute("aria-label", "트레져 페스티벌 " + noticeText.textContent);
      }
      syncLayout();
    });
  }
  function attachStory() {
    if (typeof DATA === "undefined" || !DATA.story || DATA.zombieSource) return;
    const family = ["eoc", "itf", "cotc"][DATA.story.family], button = document.getElementById("treasureChanceToggle");
    if (!family || !button || typeof window.renderRewards !== "function" || typeof window.treasureDropProbability !== "function") return;
    const originalRender = window.renderRewards, originalProbability = window.treasureDropProbability;
    const originalIcon = document.getElementById("treasureChanceIcon").getAttribute("src");
    const originalLabel = button.getAttribute("aria-label"), originalTooltip = button.dataset.tooltip;
    let active = false, currentWindow = "";
    const choices = new Map();
    const choiceKey = () => `${currentWindow}:${currentStoryChapter()?.chapter}`;
    const isEnabled = () => choices.get(choiceKey()) ?? true;
    function decorate() {
      const current = state(family);
      if (!active) return;
      const label = "트레져 페스티벌(" + api.duration(current.end - Date.now()) + " 남음)";
      button.setAttribute("aria-pressed", String(isEnabled())); button.setAttribute("aria-label", label);
      button.dataset.tooltip = label;
      document.getElementById("treasureChanceIcon").src = new URL("img/icon/otfest.png", base).href;
    }
    window.treasureDropProbability = function(...args) {
      if (!active) return originalProbability.apply(this, args);
      const acquired = currentStoryRewardState(), previous = acquired.treasureChance;
      acquired.treasureChance = isEnabled();
      try { return originalProbability.apply(this, args); }
      finally { acquired.treasureChance = previous; }
    };
    window.renderRewards = function(...args) {
      const result = originalRender.apply(this, args); decorate(); return result;
    };
    button.addEventListener("click", event => {
      if (!active) return;
      event.preventDefault(); event.stopImmediatePropagation(); choices.set(choiceKey(), !isEnabled()); window.renderRewards();
    }, true);
    subscribe(() => {
      const current = state(family), nextActive = current.state === "active";
      const identity = nextActive ? `${region}:${current.start}:${current.end}` : "";
      if (identity !== currentWindow) {
        const wasActive = active; active = nextActive; currentWindow = identity;
        if (wasActive && !active) {
          document.getElementById("treasureChanceIcon").setAttribute("src", originalIcon);
          button.setAttribute("aria-label", originalLabel); button.dataset.tooltip = originalTooltip;
        }
        window.renderRewards();
      } else decorate();
    });
  }
  function attachHalfEnergy() {
    if (typeof DATA === "undefined") return;
    const code = DATA.stage?.locationId;
    if (!code || /^B\d{3}$/.test(code)) return;
    const isChapter = Boolean(DATA.location);
    const target = document.getElementById(isChapter ? "locationStages" : "overview");
    const panel = target?.closest(".content-panel");
    const title = isChapter ? panel?.querySelector(".section-title") : null;
    const renderKey = isChapter ? "renderLocationStages" : "renderOverview";
    const originalRender = window[renderKey];
    if (!target || (isChapter && !title) || typeof originalRender !== "function") return;

    const button = document.createElement("button");
    button.id = "stageHalfEnergyToggle"; button.type = "button";
    button.className = "story-reward-toggle stage-half-energy-toggle";
    button.setAttribute("aria-controls", target.id);
    const image = document.createElement("img"); image.alt = "";
    image.src = new URL("img/icon/halfenergy.png", base).href;
    button.append(image);

    const style = document.createElement("style");
    style.textContent = `
      .content-panel.has-half-energy, .stat-card.has-half-energy { overflow: visible; }
      .stat-card.has-half-energy:focus-within, .stat-card.has-half-energy:hover { z-index: 1; }
      .stage-half-energy-list-heading { display: flex; align-items: center; }
      .stage-half-energy-cost { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 8px; }
      .stage-half-energy-cost > .stat-value { flex: 0 0 auto; }
      .stage-half-energy-cost > button { margin-top: 6px; }
    `;

    const entries = new Map((DATA.location?.stages || []).map(entry => [String(entry.id), entry]));
    const originalCosts = new WeakMap();
    const choices = new Map();
    let cells = [], wrapper = null, identity = "";
    function selectedChapter() {
      if (code !== "eoc") return null;
      if (!isChapter) return currentStoryChapter()?.chapter ?? 1;
      return Math.max(0, document.getElementById("crownSelect")?.selectedIndex ?? 0) + 1;
    }
    function readCosts() {
      const values = isChapter
        ? [...target.querySelectorAll(".location-stage-energy > strong:not(.stage-drink-cost)")]
        : [...target.querySelectorAll(".stat-card > .stat-label")]
          .filter(label => label.textContent.trim() === "통솔력")
          .map(label => label.parentElement.querySelector(".stat-value"));
      cells = values.flatMap(value => {
        if (!value || value.childElementCount) return [];
        const display = value.textContent;
        const prior = originalCosts.get(value);
        const text = prior?.shown === display ? prior.text : display;
        const number = text.trim();
        if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(number)) return [];
        const cost = Number(number.replaceAll(",", ""));
        if (!Number.isSafeInteger(cost) || cost < 1) return [];
        const stageId = value.closest(".location-stage")?.dataset.stageId;
        const chapter = code === "eoc" ? entries.get(stageId)?.fixedChapter || selectedChapter() : null;
        const cell = {value, cost, text, chapter, shown: display};
        originalCosts.set(value, cell);
        return [cell];
      });
    }
    function removeControl() {
      if (!wrapper) return;
      if (wrapper.isConnected) {
        wrapper.closest(".stat-card")?.classList.remove("has-half-energy");
        wrapper.replaceWith(wrapper.firstElementChild);
      }
      wrapper = null;
      panel?.classList.remove("has-half-energy");
    }
    function showControl() {
      const anchor = isChapter ? title : cells[0].value;
      if (wrapper?.contains(anchor)) return;
      removeControl();
      if (!style.isConnected) document.head.append(style);
      wrapper = document.createElement("div");
      wrapper.className = isChapter ? "stage-half-energy-list-heading" : "stage-half-energy-cost";
      anchor.before(wrapper);
      wrapper.append(anchor, button);
      wrapper.closest(".stat-card")?.classList.add("has-half-energy");
      panel?.classList.add("has-half-energy");
    }
    function sync() {
      const now = Date.now(), periods = new Map();
      let current = null;
      for (const {chapter} of cells) {
        if (periods.has(chapter)) continue;
        const active = activeDiscount(code, chapter, now);
        periods.set(chapter, active);
        if (active && (!current || active.end > current.end)) current = active;
      }
      identity = current ? [region, selectedChapter(), current.start, current.end].join(":") : "";
      const enabled = Boolean(current) && (choices.get(identity) ?? true);
      for (const cell of cells) {
        // JP 16.0 APK: divide by two toward zero, with no minimum.
        const text = enabled && periods.get(cell.chapter) ? Math.trunc(cell.cost / 2).toLocaleString("ko-KR") : cell.text;
        if (text !== cell.value.textContent) cell.value.textContent = text;
        cell.shown = text;
      }
      if (!current) {
        removeControl();
        delete button.dataset.tooltipOpen;
        return;
      }
      showControl();
      const label = "필요 통솔력 절반(" + api.duration(current.end - now) + " 남음)";
      button.dataset.tooltip = label;
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(enabled));
    }
    window[renderKey] = function(...args) {
      const hadFocus = document.activeElement === button;
      const result = originalRender.apply(this, args);
      readCosts(); sync();
      if (hadFocus && button.isConnected) button.focus({preventScroll:true});
      return result;
    };
    button.addEventListener("click", () => {
      if (!identity) return;
      choices.set(identity, !(choices.get(identity) ?? true));
      sync();
    });
    readCosts();
    subscribe(sync);
  }
  function start() {
    region = selectedRegion();
    window.NyankoTreasureFestival = Object.freeze({ definitions, state, subscribe, decorateList, decorateLocation, refresh });
    attachNotice(); attachStory();
    attachHalfEnergy();
    subscribe(() => decorateList()); void refresh();
    setInterval(() => { if (!document.hidden) notify(); }, 1000);
    setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { notify(); void refresh(); } });
    window.addEventListener("pageshow", () => { notify(); void refresh(); });
    window.addEventListener("storage", event => { if (event.key === settingsKey || event.key === null) void refresh(); });
  }
  source.dataset.scheduleFeed = "https://raw.githubusercontent.com/shadowgao42/nyankodb/event-schedule-data/stage-schedule-kr.json";
  if (window.NyankoStageSchedule) { api = window.NyankoStageSchedule; start(); }
  else {
    const schedule = document.getElementById("stageScheduleScript");
    const script = schedule ?? document.createElement("script");
    script.addEventListener("load", () => { api = window.NyankoStageSchedule; start(); }, {once:true});
    if (!schedule) { script.src = new URL("stage-schedule.js", base).href; document.body.append(script); }
  }
})();
