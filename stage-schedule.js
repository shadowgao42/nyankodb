(function (root) {
  "use strict";
  const SOURCE = "https://nyanko-events.ponosgames.com/battlecatskr_production/sale.tsv";
  const MAX_AGE = 30 * 60 * 1000;
  const POLL_MS = 60 * 1000;
  const MAP_BASES = { A:24000, B:14000, C:2000, CA:27000, D:16000, DM:30000, EX:4000,
    G:37000, H:25000, L:33000, M:12000, NA:13000, ND:34000, PR:39000, Q:31000,
    R:11000, RE:4000, S:1000, SR:36000, T:6000, V:7000 };
  function eventMapId(code) {
    const match = /^([A-Z]+)(\d{3})$/.exec(code);
    return match && Object.hasOwn(MAP_BASES, match[1]) ? MAP_BASES[match[1]] + Number(match[2]) : null;
  }

  function parseFeed(feed, mapCode) {
    if (feed?.schemaVersion !== 1 || feed.region !== "kr" || feed.timezone !== "Asia/Seoul" || feed.source?.url !== SOURCE) {
      throw new Error("Invalid official calendar export");
    }
    const fetchedAt = Date.parse(feed.fetchedAt);
    const validUntil = Date.parse(feed.validUntil);
    const expectedId = eventMapId(mapCode);
    const map = feed.maps?.[mapCode] ?? { eventMapId:expectedId, windows:[], sourceRows:[] };
    if (!Number.isFinite(fetchedAt) || !Number.isFinite(validUntil) || validUntil <= fetchedAt || validUntil - fetchedAt > MAX_AGE ||
        expectedId === null || !feed.maps || typeof feed.maps !== "object" || Array.isArray(feed.maps) ||
        !Array.isArray(map.windows) || !Array.isArray(map.sourceRows) || map.eventMapId !== expectedId) {
      throw new Error("Invalid stage calendar");
    }
    let previousEnd = -Infinity;
    const windows = map.windows.map((range) => {
      if (!Array.isArray(range) || range.length !== 2) throw new Error("Invalid interval");
      const [start, end] = range.map(Date.parse);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end || start <= previousEnd) throw new Error("Invalid interval order");
      previousEnd = end;
      return { start, end };
    });
    return { fetchedAt, validUntil, windows, hasSchedule: map.sourceRows.length > 0 };
  }

  function stateAt(calendar, now) {
    if (!calendar.hasSchedule) return { state: "none" };
    if (now < calendar.fetchedAt - 5 * 60 * 1000 || now >= calendar.validUntil) return { state: "stale" };
    const interval = calendar.windows.find((window) => window.end > now);
    if (!interval) return { state: "none" };
    return { ...interval, state: interval.start <= now ? "active" : "upcoming" };
  }

  function duration(milliseconds) {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const days = Math.floor(seconds / 86400);
    const hh = Math.floor(seconds / 3600) % 24;
    const mm = Math.floor(seconds / 60) % 60;
    const ss = seconds % 60;
    return (days ? days + "일 " : "") + [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
  }

  function label(status, now) {
    if (status.state === "active") return "개최 중(" + duration(status.end - now) + " 남음)";
    if (status.state === "upcoming") return "개최까지 " + duration(status.start - now);
    if (status.state === "stale") return "일정 갱신 지연";
    return "";
  }

  const periodFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  function formatPeriod(start, end) {
    const parts = (value) => {
      const p = Object.fromEntries(periodFormat.formatToParts(value).map(({type, value}) => [type, value]));
      return { date: `${p.year}.${p.month}.${p.day}`, time: `${p.hour}:${p.minute}:${p.second}` };
    };
    const first = parts(start), last = parts(end);
    return `개최 ${first.date} ${first.time}~${first.date === last.date ? "" : last.date + " "}${last.time}`;
  }

  async function fetchFeed(script, signal) {
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(root.location.hostname);
    const url = local ? new URL("stage-schedule-kr.json", script.src) : new URL(script.dataset.scheduleFeed);
    url.searchParams.set("t", String(Math.floor(Date.now() / POLL_MS)));
    const response = await root.fetch(url, { cache: "no-store", credentials: "omit", signal });
    if (!response.ok) throw new Error("Calendar unavailable");
    return response.json();
  }

  function attach(script, doc = root.document) {
    const code = script.dataset.stageSchedule;
    if (eventMapId(code) === null) return null;
    const controls = doc.querySelector("#crownSelect")?.closest(".hero-controls");
    if (!controls || controls.querySelector(".stage-schedule")) return null;
    const originallyHidden = controls.hidden;
    const indicator = doc.createElement("span");
    indicator.className = "stage-schedule";
    indicator.hidden = true;
    indicator.setAttribute("role", "timer");
    indicator.setAttribute("aria-live", "off");
    indicator.setAttribute("aria-label", "한국 시각 기준 공식 스테이지 일정");
    controls.append(indicator);
    let calendar = null;
    let failed = false;
    let inFlight = false;
    let stopped = false;

    function render() {
      const now = Date.now();
      // A failed poll can keep a previously verified interval until its explicit expiry.
      const status = calendar ? stateAt(calendar, now) : { state: failed ? "error" : "none" };
      indicator.textContent = label(status, now);
      indicator.dataset.state = status.state;
      indicator.hidden = !indicator.textContent;
      controls.hidden = indicator.hidden ? originallyHidden : false;
      controls.classList.toggle("has-stage-schedule", !indicator.hidden);
      if (status.start != null) {
        indicator.dataset.tooltip = formatPeriod(status.start, status.end);
        indicator.setAttribute("aria-description", indicator.dataset.tooltip);
        indicator.tabIndex = 0;
      } else {
        delete indicator.dataset.tooltip;
        indicator.removeAttribute("aria-description");
        indicator.removeAttribute("tabindex");
      }
    }

    async function refresh() {
      if (stopped || inFlight || doc.hidden) return;
      inFlight = true;
      const controller = new AbortController();
      const timeout = root.setTimeout(() => controller.abort(), 15000);
      try {
        const updated = parseFeed(await fetchFeed(script, controller.signal), code);
        if (!stopped) { calendar = updated; failed = false; }
      } catch (_) {
        if (!stopped) failed = true;
      } finally {
        root.clearTimeout(timeout);
        inFlight = false;
        if (!stopped) render();
      }
    }

    function resume() { render(); void refresh(); }
    const tick = root.setInterval(() => { if (!doc.hidden) render(); }, 1000);
    const poll = root.setInterval(refresh, POLL_MS);
    doc.addEventListener("visibilitychange", resume);
    root.addEventListener("pageshow", resume);
    void refresh();
    return { refresh, render, indicator, stop() {
      stopped = true; root.clearInterval(tick); root.clearInterval(poll);
      doc.removeEventListener("visibilitychange", resume); root.removeEventListener("pageshow", resume);
    } };
  }

  const api = { parseFeed, stateAt, duration, label, formatPeriod, eventMapId, fetchFeed, attach };
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.NyankoStageSchedule = api;
    const script = root.document.currentScript;
    if (script) attach(script);
  }
})(typeof window === "undefined" ? globalThis : window);
