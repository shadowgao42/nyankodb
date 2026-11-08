/* Official treasure-festival intervals, sharing stage calendar parsing and timers. */
(() => {
  "use strict";
  const source = document.currentScript, base = new URL(".", source.src);
  const definitions = Object.freeze({
    eoc: { eventMapId: 100, name: "세계편", href: "stage/eoc/index.html" },
    itf: { eventMapId: 101, name: "미래편", href: "stage/W04/index.html" },
    cotc: { eventMapId: 104, name: "우주편", href: "stage/Space07/index.html" },
  });
  const settingsKey = "nyanko-db:event-settings:v2";
  let api, calendars = {}, region, inFlight = false;
  const listeners = new Set();
  function selectedRegion() {
    try { return JSON.parse(localStorage.getItem(settingsKey))?.region === "jp" ? "jp" : "kr"; }
    catch (_) { return "kr"; }
  }
  function state(family, now = Date.now()) {
    return region === selectedRegion() && calendars[family] ? api.stateAt(calendars[family], now) : {state:"none"};
  }
  function notify() { for (const listener of listeners) listener(); }
  function subscribe(listener) { listeners.add(listener); listener(); return () => listeners.delete(listener); }
  async function refresh() {
    if (inFlight || document.hidden) return;
    const requestedRegion = selectedRegion();
    if (requestedRegion !== region) { region = requestedRegion; calendars = {}; notify(); }
    inFlight = true;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const feed = await api.fetchFeed(source, controller.signal, requestedRegion);
      const next = Object.fromEntries(Object.keys(definitions).map(family => [family, api.parseFestivalFeed(feed, family, requestedRegion)]));
      if (requestedRegion === selectedRegion()) calendars = next;
    } catch (_) { /* Previously verified intervals retain the shared explicit freshness limit. */ }
    finally { clearTimeout(timeout); inFlight = false; notify(); }
  }
  function decorateList(root = document) {
    for (const heading of root.querySelectorAll(".stage-section-heading[data-festival-family]")) {
      let image = heading.querySelector(".stage-festival-guide");
      if (!image) {
        image = document.createElement("img"); image.className = "stage-festival-guide";
        image.src = new URL("img/icon/guide_otfest.png", base).href; image.alt = "트레져 페스티벌";
        image.width = 48; image.height = 37; image.hidden = true;
        heading.querySelector("small").after(image);
      }
      image.hidden = state(heading.dataset.festivalFamily).state !== "active";
    }
  }
  function storyFamily() {
    if (typeof DATA === "undefined" || DATA.zombieSource) return null;
    if (DATA.story) return ["eoc", "itf", "cotc"][DATA.story.family] ?? null;
    if (!DATA.location) return null;
    const code = String(DATA.stage?.locationId || "");
    return code === "eoc" ? "eoc" : /^W0[4-6]$/.test(code) ? "itf" : /^Space0[7-9]$/.test(code) ? "cotc" : null;
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
  function start() {
    region = selectedRegion();
    window.NyankoTreasureFestival = Object.freeze({ definitions, state, subscribe, decorateList, refresh });
    attachNotice(); attachStory(); subscribe(() => decorateList()); void refresh();
    setInterval(() => { if (!document.hidden) notify(); }, 1000);
    setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { notify(); void refresh(); } });
    window.addEventListener("pageshow", () => { notify(); void refresh(); });
    window.addEventListener("storage", event => { if (event.key === settingsKey || event.key === null) void refresh(); });
  }
  source.dataset.scheduleFeed = "https://raw.githubusercontent.com/shadowgao42/nyankodb/event-schedule-data/stage-schedule-kr.json";
  if (window.NyankoStageSchedule) { api = window.NyankoStageSchedule; start(); }
  else {
    const script = document.createElement("script"); script.src = new URL("stage-schedule.js", base).href;
    script.addEventListener("load", () => { api = window.NyankoStageSchedule; start(); }, {once:true});
    document.body.append(script);
  }
})();
