/* Korean stage schedule calendar, using the shared official-feed parser. */
(() => {
  "use strict";
  const days = document.getElementById("calendarDays");
  const monthLabel = document.getElementById("calendarMonth");
  const selectedLabel = document.getElementById("selectedDate");
  const statusLabel = document.getElementById("calendarStatus");
  const detail = document.getElementById("calendarDayEvents");
  const countLabel = document.getElementById("selectedEventCount");
  const updatedLabel = document.getElementById("eventUpdatedAt");
  const dailyActiveOnly = document.getElementById("dailyActiveOnly");
  const calendarIncludeRegular = document.getElementById("calendarIncludeRegular");
  const calendarDurationDays = document.getElementById("calendarDurationDays");
  const calendarDurationComparison = document.getElementById("calendarDurationComparison");
  const api = window.NyankoStageSchedule;
  const source = document.getElementById("eventScheduleSource");
  const siteRoot = new URL("./", source.src);
  const DAY = 86400000;
  const KST = 9 * 3600000;
  const VISIBLE_LANES = 5;
  const DEFAULT_CALENDAR_FAMILIES = ["S", "C", "CA", "Q", "SR", "V", "D", "A", "PR", "L", "R"];
  const SETTINGS_KEY = "nyanko-db:event-settings:v2";
  const LEGACY_SETTINGS_KEY = "nyanko-db:event-settings:v1";
  const stageCategories = window.NyankoSearch.stageCategoryOrder;
  const stageCategoryName = window.NyankoSearch.stageCategoryForLocation;
  const defaultCalendarNames = new Set(DEFAULT_CALENDAR_FAMILIES.map(code => stageCategoryName(`${code}000`)));
  // Text, background and border colors, including previously excluded optional families.
  const FAMILY_COLORS = {
    "S": ["hsl(4 80% 80%)", "hsl(4 45% 26%)", "hsl(4 55% 48%)"],
    "M": ["hsl(28 80% 80%)", "hsl(28 45% 26%)", "hsl(28 55% 48%)"],
    "C": ["hsl(274 80% 80%)", "hsl(274 38% 25%)", "hsl(274 42% 44%)"],
    "CA": ["hsl(274 80% 80%)", "hsl(274 38% 25%)", "hsl(274 42% 44%)"],
    "B": ["hsl(358 80% 84%)", "hsl(358 45% 30%)", "hsl(358 55% 54%)"],
    "Q": ["hsl(230 80% 80%)", "hsl(230 48% 25%)", "hsl(230 50% 48%)"],
    "SR": ["hsl(355 60% 72%)", "hsl(355 48% 18%)", "hsl(355 48% 36%)"],
    "V": ["hsl(265 80% 86%)", "hsl(265 34% 34%)", "hsl(265 46% 60%)"],
    "D": ["hsl(30 55% 80%)", "hsl(30 32% 32%)", "hsl(30 36% 54%)"],
    "A": ["hsl(0 0% 80%)", "hsl(0 0% 25%)", "hsl(0 0% 44%)"],
    "PR": ["hsl(325 80% 80%)", "hsl(325 38% 25%)", "hsl(325 42% 44%)"],
    "EX": ["hsl(48 80% 80%)", "hsl(48 38% 25%)", "hsl(48 42% 44%)"],
    "L": ["hsl(25 50% 72%)", "hsl(25 42% 21%)", "hsl(25 40% 40%)"],
    "T": ["hsl(135 65% 80%)", "hsl(135 38% 25%)", "hsl(135 42% 44%)"],
    "G": ["hsl(135 65% 80%)", "hsl(135 38% 25%)", "hsl(135 42% 44%)"],
    "R": ["hsl(205 80% 85%)", "hsl(205 38% 31%)", "hsl(205 50% 55%)"],
    "DM": ["hsl(174 80% 80%)", "hsl(174 38% 25%)", "hsl(174 42% 44%)"],
    "NA": ["hsl(72 80% 80%)", "hsl(72 38% 25%)", "hsl(72 42% 44%)"],
    "ND": ["hsl(260 80% 80%)", "hsl(260 38% 25%)", "hsl(260 42% 44%)"],
    "H": ["hsl(238 80% 80%)", "hsl(238 38% 25%)", "hsl(238 42% 44%)"]
  };
  function defaultDisplaySettings() {
    return { includeRegular: false, durationDays: null, durationComparison: "lte", ...Object.fromEntries(["calendar", "daily"].map(scope => [scope,
      Object.fromEntries(stageCategories.map(name => [name,
        defaultCalendarNames.has(name)]))])) };
  }
  function readDisplaySettings() {
    const next = defaultDisplaySettings();
    try {
      const current = localStorage.getItem(SETTINGS_KEY);
      const saved = JSON.parse(current ?? localStorage.getItem(LEGACY_SETTINGS_KEY));
      if (typeof saved?.includeRegular === "boolean") next.includeRegular = saved.includeRegular;
      if (typeof saved?.durationDays === "number" && Number.isFinite(saved.durationDays) && saved.durationDays >= 0) next.durationDays = saved.durationDays;
      if (saved?.durationComparison === "gte") next.durationComparison = "gte";
      for (const scope of ["calendar", "daily"]) for (const name of stageCategories) {
        if (typeof saved?.[scope]?.[name] === "boolean") next[scope][name] = saved[scope][name];
      }
      if (current === null && saved) {
        for (const family of ["M", "B", "EX", "T", "G"]) next.calendar[stageCategoryName(`${family}000`)] = false;
      }
    } catch (_) { /* Use defaults when browser storage is unavailable or invalid. */ }
    return next;
  }
  let displaySettings = readDisplaySettings();
  function saveDisplaySettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(displaySettings)); } catch (_) { /* Keep the current page usable. */ }
  }
  function syncDisplayControls() {
    calendarIncludeRegular.checked = displaySettings.includeRegular;
    calendarDurationDays.value = displaySettings.durationDays ?? "";
    calendarDurationComparison.value = displaySettings.durationComparison;
    for (const input of document.querySelectorAll("[data-schedule-scope]")) {
      input.checked = displaySettings[input.dataset.scheduleScope][input.dataset.stageCategory];
    }
    document.getElementById("eventSettingsReset").disabled = JSON.stringify(displaySettings) === JSON.stringify(defaultDisplaySettings());
  }
  function initializeDisplayControls() {
    try {
      if (localStorage.getItem(LEGACY_SETTINGS_KEY) !== null) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(displaySettings));
        localStorage.removeItem(LEGACY_SETTINGS_KEY);
      }
    } catch (_) { /* Apply the normalized choices in memory when storage is unavailable. */ }
    for (const scope of ["calendar", "daily"]) {
      const container = document.getElementById(`${scope}CategoryOptions`);
      for (const name of stageCategories) {
        const label = document.createElement("label");
        label.className = "calendar-filter-toggle";
        const text = document.createElement("span");
        text.textContent = name;
        const input = document.createElement("input");
        input.type = "checkbox";
        input.dataset.scheduleScope = scope;
        input.dataset.stageCategory = name;
        input.setAttribute("aria-controls", scope === "calendar" ? "calendarDays" : "calendarDayEvents");
        const check = document.createElement("span");
        check.className = "calendar-filter-check";
        check.setAttribute("aria-hidden", "true");
        check.textContent = "✓";
        input.addEventListener("change", () => {
          displaySettings[scope][name] = input.checked;
          saveDisplaySettings();
          syncDisplayControls();
          render();
        });
        label.append(text, input, check);
        container.append(label);
      }
    }
    const settings = document.getElementById("eventSettings");
    settings.addEventListener("toggle", () => {
      document.getElementById("eventSettingsToggleLabel").textContent = settings.open ? "접기" : "펼치기";
    });
    document.getElementById("eventSettingsReset").addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      displaySettings = defaultDisplaySettings();
      saveDisplaySettings();
      syncDisplayControls();
      render();
    });
    syncDisplayControls();
  }
  const catalog = new Map((window.NYANKODB_SEARCH_CATALOG?.entries || [])
    .filter(entry => entry.kind === "stage" && /^[A-Z]+\d{3}$/.test(String(entry.id)))
    .map(entry => [entry.id, entry]));
  let events = [], dayEvents = [], recurringEvents = [], calendar = null, loading = true, failed = false, inFlight = false;
  const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "UTC", year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
  const koreaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  });
  const updatedFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul", year: "numeric", month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  function civilDate(year, month, day) {
    const date = new Date(0);
    date.setUTCFullYear(year, month, day);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }
  function today() {
    const parts = Object.fromEntries(koreaDate.formatToParts(new Date()).map(({ type, value }) => [type, value]));
    return civilDate(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
  }
  function key(date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
  }
  let selected = today();
  let displayedMonth = civilDate(selected.getUTCFullYear(), selected.getUTCMonth(), 1);

  function dayNumber(instant) { return Math.floor((instant + KST) / DAY); }
  function categoryFor(code) {
    return /^([A-Z]+)\d{3}$/.exec(code)?.[1] || "";
  }
  function applyCategory(element, code) {
    const category = categoryFor(code);
    element.dataset.category = category;
    const colors = FAMILY_COLORS[category] ?? FAMILY_COLORS.A;
    ["--event-color", "--event-bg", "--event-border"].forEach((property, index) => {
      element.style.setProperty(property, colors[index]);
    });
  }
  function stageLink(event, className, period = api.formatPeriod(event.start, event.end)) {
    const link = document.createElement("a");
    link.href = new URL(event.entry.href, siteRoot).href;
    link.className = className;
    link.dataset.code = event.code;
    link.dataset.start = String(event.start);
    link.dataset.end = String(event.end);
    applyCategory(link, event.code);
    link.textContent = event.entry.name;
    link.setAttribute("aria-label", `${event.entry.name} · ${period}`);
    return link;
  }
  function updateStatus() {
    updatedLabel.hidden = !calendar;
    if (calendar) {
      const parts = Object.fromEntries(updatedFormat.formatToParts(calendar.fetchedAt).map(({ type, value }) => [type, value]));
      updatedLabel.dateTime = new Date(calendar.fetchedAt).toISOString();
      updatedLabel.textContent = `(${parts.year}년 ${parts.month}월 ${parts.day}일 ${parts.hour}:${parts.minute}:${parts.second} 기준)`;
    }
    const stale = calendar && (Date.now() >= calendar.validUntil || Date.now() < calendar.fetchedAt - 300000);
    statusLabel.hidden = Boolean(calendar) && !stale;
    statusLabel.textContent = loading ? "스테이지 일정을 불러오는 중입니다."
      : stale ? "일정 갱신 지연" : failed ? "스테이지 일정을 불러오지 못했습니다." : "";
    statusLabel.dataset.state = stale || failed ? "error" : "loading";
  }
  function dayIntervals(group, dayStart) {
    const intervals = group.map(event => ({
      start: Math.max(dayStart, event.start), end: Math.min(dayStart + DAY, event.end),
    })).filter(interval => interval.start < interval.end).sort((a, b) => a.start - b.start);
    const merged = [];
    for (const interval of intervals) {
      const previous = merged[merged.length - 1];
      if (previous && interval.start <= previous.end) previous.end = Math.max(previous.end, interval.end);
      else merged.push({ ...interval });
    }
    return merged;
  }
  function dayTime(instant, dayStart) {
    if (instant === dayStart + DAY) return "23:59";
    const minutes = Math.floor((instant - dayStart) / 60000);
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  }
  function isAllDay(intervals, dayStart) {
    return intervals.length === 1 && intervals[0].start === dayStart && intervals[0].end === dayStart + DAY;
  }
  function dayPeriod(intervals, dayStart) {
    if (isAllDay(intervals, dayStart)) return "종일 개최";
    return "개최 " + intervals.map(interval => `${dayTime(interval.start, dayStart)}~${dayTime(interval.end, dayStart)}`).join(", ");
  }
  function updateCurrentTime() {
    const start = selected.getTime() - KST;
    const now = Date.now();
    if (dailyActiveOnly.checked) {
      const expected = new Set(selectedDayEvents(start, now).map(event => event.code));
      const currentRows = [...detail.querySelectorAll(".calendar-event-detail")];
      if (currentRows.length !== expected.size || currentRows.some(row => !expected.has(row.dataset.code))) {
        render();
        return;
      }
    }
    const visible = now >= start && now < start + DAY;
    detail.classList.toggle("has-current-time", visible);
    const label = detail.querySelector(".calendar-now-label");
    if (!label) return;
    label.hidden = !visible;
    const limitedCodes = new Set(events.filter(event => event.start <= now && now < event.end).map(event => event.code));
    const recurringCodes = new Set(recurringEvents.filter(event => event.start <= now && now < event.end).map(event => event.code));
    const rows = [...detail.querySelectorAll(".calendar-event-detail")];
    for (const row of rows) {
      const active = visible && [...row.querySelectorAll(".calendar-time-bar")]
        .some(bar => Number(bar.dataset.start) <= now && now < Number(bar.dataset.end));
      row.dataset.active = String(active);
      row.dataset.limited = String(visible && limitedCodes.has(row.dataset.code));
      row.dataset.recurring = String(visible && recurringCodes.has(row.dataset.code));
    }
    const ordered = [...rows].sort((a, b) => Number(b.dataset.active === "true") - Number(a.dataset.active === "true")
      || (a.dataset.active === "true" ? Number(a.dataset.allDay === "true") - Number(b.dataset.allDay === "true") : 0)
      || (a.dataset.active === "true" && a.dataset.allDay === "true"
        ? Number(b.dataset.limited === "true") - Number(a.dataset.limited === "true") : 0)
      || (a.dataset.active === "true" && a.dataset.allDay === "true" && a.dataset.limited !== "true"
        ? Number(b.dataset.recurring === "true") - Number(a.dataset.recurring === "true") : 0)
      || Number(a.dataset.order) - Number(b.dataset.order));
    if (ordered.some((row, index) => row !== rows[index])) {
      const focused = detail.contains(document.activeElement) ? document.activeElement : null;
      let cursor = detail.querySelector(".calendar-time-axis").nextElementSibling;
      for (const row of ordered) {
        if (row !== cursor) detail.insertBefore(row, cursor);
        cursor = row.nextElementSibling;
      }
      if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
    }
    if (!visible) return;
    const fraction = (now - start) / DAY;
    detail.style.setProperty("--calendar-now", `${fraction * 100}%`);
    const seconds = Math.floor((now - start) / 1000);
    const clock = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map(value => String(value).padStart(2, "0")).join(":");
    label.textContent = `현재 ${clock}`;
    label.dataset.position = fraction < .2 ? "start" : fraction > .8 ? "end" : "middle";
  }
  function selectedDayEvents(start, now = Date.now()) {
    const selectedEvents = dayEvents.filter(event => event.start < start + DAY && event.end > start
      && displaySettings.daily[stageCategoryName(event.code)]);
    if (!dailyActiveOnly.checked) return selectedEvents;
    if (!calendar || now < start || now >= start + DAY) return [];
    const activeCodes = new Set(selectedEvents.filter(event => api.stateAt({
      ...calendar, hasSchedule: true, windows: [event],
    }, now).state === "active").map(event => event.code));
    return selectedEvents.filter(event => activeCodes.has(event.code));
  }
  function renderDetails() {
    const start = selected.getTime() - KST;
    const selectedEvents = selectedDayEvents(start);
    const groups = new Map();
    for (const event of selectedEvents) {
      if (!groups.has(event.code)) groups.set(event.code, []);
      groups.get(event.code).push(event);
    }
    countLabel.textContent = calendar ? `${groups.size}개 스테이지` : "";
    const fragment = document.createDocumentFragment();
    if (groups.size) {
      const axis = document.createElement("div");
      axis.className = "calendar-time-axis";
      axis.setAttribute("aria-hidden", "true");
      for (const hour of [0, 6, 12, 18, 24]) {
        const tick = document.createElement("span");
        tick.textContent = `${String(hour).padStart(2, "0")}:00`;
        tick.style.left = `${hour / 24 * 100}%`;
        axis.append(tick);
      }
      const clock = document.createElement("div");
      clock.className = "calendar-now-label";
      clock.hidden = true;
      axis.append(clock);
      fragment.append(axis);
    }
    for (const [order, group] of [...groups.values()].entries()) {
      const row = document.createElement("a");
      row.className = "calendar-event-detail";
      row.dataset.code = group[0].code;
      row.dataset.order = String(order);
      row.dataset.start = String(group[0].start);
      row.dataset.end = String(group[0].end);
      row.href = new URL(group[0].entry.href, siteRoot).href;
      applyCategory(row, group[0].code);
      const intervals = dayIntervals(group, start);
      row.dataset.allDay = String(isAllDay(intervals, start));
      const summary = dayPeriod(intervals, start);
      row.setAttribute("aria-label", `${group[0].entry.name} · ${summary}`);
      const name = document.createElement("span");
      name.className = "calendar-stage-name";
      name.textContent = group[0].entry.name;
      const periods = document.createElement("p");
      periods.className = "calendar-event-periods";
      periods.textContent = summary;
      const timeline = document.createElement("div");
      timeline.className = "calendar-timeline";
      timeline.setAttribute("aria-hidden", "true");
      for (const interval of intervals) {
        const bar = document.createElement("span");
        bar.className = "calendar-time-bar";
        bar.dataset.start = String(interval.start);
        bar.dataset.end = String(interval.end);
        bar.style.left = `${(interval.start - start) / DAY * 100}%`;
        bar.style.width = `${(interval.end - interval.start) / DAY * 100}%`;
        bar.textContent = "";
        timeline.append(bar);
      }
      const marker = document.createElement("span");
      marker.className = "calendar-now-marker";
      timeline.append(marker);
      row.append(name, periods, timeline);
      fragment.append(row);
    }
    if (!groups.size) {
      const empty = document.createElement("p");
      empty.className = "calendar-empty";
      empty.textContent = loading ? "스테이지 일정을 불러오는 중입니다."
        : !calendar ? "스테이지 일정을 불러오지 못했습니다." : "표시할 스테이지 일정이 없습니다.";
      fragment.append(empty);
    }
    detail.replaceChildren(fragment);
    updateCurrentTime();
  }
  function calendarLanes(visibleEvents) {
    const lanes = new Map();
    const laneEnds = [];
    const ordered = [...visibleEvents].sort((a, b) => dayNumber(a.start) - dayNumber(b.start)
      || dayNumber(b.end - 1) - dayNumber(a.end - 1)
      || a.start - b.start || a.code.localeCompare(b.code));
    for (const event of ordered) {
      const first = dayNumber(event.start);
      let lane = laneEnds.findIndex(end => end < first);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = dayNumber(event.end - 1);
      lanes.set(event, lane);
    }
    return lanes;
  }
  function renderWeek(week, weekStart, lanes, visibleEvents) {
    const start = weekStart.getTime() / DAY;
    const segments = visibleEvents.map(event => ({ event,
      first: Math.max(0, dayNumber(event.start) - start),
      last: Math.min(6, dayNumber(event.end - 1) - start),
    })).filter(segment => segment.first <= segment.last)
      .sort((a, b) => a.first - b.first || (b.last - b.first) - (a.last - a.first)
        || a.event.start - b.event.start || a.event.code.localeCompare(b.event.code));
    // Every complete interval keeps its row and overflow status across all weeks.
    let rows = 0;
    const hidden = Array(7).fill(0);
    const bars = document.createElement("div");
    bars.className = "calendar-week-events";
    for (const {event, first, last} of segments) {
      const lane = lanes.get(event);
      if (lane >= VISIBLE_LANES) {
        for (let day = first; day <= last; day++) hidden[day]++;
        continue;
      }
      const bar = stageLink(event, "calendar-event-bar");
      bar.style.gridColumn = `${first + 1} / ${last + 2}`;
      bar.style.gridRow = String(lane + 1);
      bar.dataset.lane = String(lane);
      bar.classList.toggle("continues-before", dayNumber(event.start) < start);
      bar.classList.toggle("continues-after", dayNumber(event.end - 1) > start + 6);
      rows = Math.max(rows, lane + 1);
      bars.append(bar);
    }
    week.style.setProperty("--week-rows", String(rows));
    week.classList.toggle("has-more", hidden.some(Boolean));
    const more = document.createElement("div");
    more.className = "calendar-week-more";
    hidden.forEach((count, day) => {
      if (!count) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-more";
      button.style.gridColumn = String(day + 1);
      const date = civilDate(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate() + day);
      button.dataset.date = key(date);
      button.textContent = `+${count}개`;
      button.setAttribute("aria-label", `${dateFormat.format(date)} 일정 ${count}개 더 보기`);
      button.addEventListener("click", () => {
        selectDate(date);
        detail.scrollIntoView({ block: "nearest", behavior: "auto" });
        detail.querySelector("a")?.focus({ preventScroll: true });
      });
      more.append(button);
    });
    week.append(bars, more);
  }
  function render(focusDate = false) {
    const focused = document.activeElement;
    const focusedWeek = focused.closest?.(".calendar-week");
    const weekIndex = focusedWeek ? [...days.children].indexOf(focusedWeek) : -1;
    const focusRoot = detail.contains(focused) ? detail : weekIndex >= 0 ? days : null;
    const restoreDay = focusDate || (days.contains(focused) && focused.matches(".calendar-day"));
    const year = displayedMonth.getUTCFullYear();
    const month = displayedMonth.getUTCMonth();
    const first = civilDate(year, month, 1);
    const todayKey = key(today());
    const firstDay = civilDate(year, month, 1 - first.getUTCDay()).getTime() / DAY;
    const visibleEvents = (displaySettings.includeRegular ? dayEvents : events)
      .filter(event => displaySettings.calendar[stageCategoryName(event.code)]
        && (displaySettings.durationDays === null || (displaySettings.durationComparison === "gte"
          ? (event.end - event.start) / DAY >= displaySettings.durationDays
          : (event.end - event.start) / DAY <= displaySettings.durationDays)));
    const categories = [...new Set(visibleEvents.filter(event => dayNumber(event.start) < firstDay + 42
      && dayNumber(event.end - 1) >= firstDay).map(event => categoryFor(event.code)))].sort();
    const legend = document.getElementById("calendarLegend");
    legend.replaceChildren(...categories.map(category => {
      const item = document.createElement("span");
      item.className = "calendar-category";
      item.textContent = window.NyankoSearch.stageCategoryForLocation(`${category}000`);
      applyCategory(item, `${category}000`);
      return item;
    }));
    legend.hidden = !categories.length;
    monthLabel.textContent = `${year}년 ${month + 1}월`;
    selectedLabel.textContent = dateFormat.format(selected);
    const fragment = document.createDocumentFragment();
    let week, weekDates;
    const lanes = calendarLanes(visibleEvents);
    for (let index = 0; index < 42; index++) {
      if (index % 7 === 0) {
        week = document.createElement("div");
        week.className = "calendar-week";
        weekDates = document.createElement("div");
        weekDates.className = "calendar-week-dates";
        week.append(weekDates);
        fragment.append(week);
      }
      const date = civilDate(year, month, index - first.getUTCDay() + 1);
      const dateKey = key(date);
      const isSelected = dateKey === key(selected);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.classList.toggle("is-outside", date.getUTCMonth() !== month);
      button.classList.toggle("is-sunday", date.getUTCDay() === 0);
      button.classList.toggle("is-saturday", date.getUTCDay() === 6);
      button.dataset.date = dateKey;
      button.setAttribute("aria-label", dateFormat.format(date));
      button.setAttribute("aria-pressed", String(isSelected));
      if (dateKey === todayKey) button.setAttribute("aria-current", "date");
      button.tabIndex = isSelected ? 0 : -1;
      const number = document.createElement("span");
      number.className = "calendar-day-number";
      number.textContent = String(date.getUTCDate());
      button.append(number);
      button.addEventListener("click", () => selectDate(date, true));
      button.addEventListener("keydown", event => {
        const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
          Home: -date.getUTCDay(), End: 6 - date.getUTCDay() };
        if (Object.hasOwn(offsets, event.key)) {
          event.preventDefault();
          selectDate(civilDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + offsets[event.key]), true);
        } else if (event.key === "PageUp" || event.key === "PageDown") {
          event.preventDefault();
          changeMonth(event.key === "PageUp" ? -1 : 1, true);
        }
      });
      weekDates.append(button);
      if (index % 7 === 6) renderWeek(week, civilDate(year, month, index - first.getUTCDay() - 5), lanes, visibleEvents);
    }
    days.replaceChildren(fragment);
    updateStatus();
    renderDetails();
    if (restoreDay) days.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
    else if (focusRoot) {
      const root = focusRoot === detail ? detail : days.children[weekIndex];
      const candidates = root?.querySelectorAll(focused.matches("a") ? "a" : ".calendar-more") || [];
      [...candidates].find(item => focused.matches("a")
        ? item.className === focused.className && item.dataset.code === focused.dataset.code && item.dataset.start === focused.dataset.start
        : item.dataset.date === focused.dataset.date)?.focus({ preventScroll: true });
    }
  }
  function selectDate(date, focusDate = false) {
    selected = date;
    displayedMonth = civilDate(date.getUTCFullYear(), date.getUTCMonth(), 1);
    render(focusDate);
  }
  function changeMonth(offset, focusDate = false) {
    const target = civilDate(displayedMonth.getUTCFullYear(), displayedMonth.getUTCMonth() + offset, 1);
    const lastDay = civilDate(target.getUTCFullYear(), target.getUTCMonth() + 1, 0).getUTCDate();
    selectDate(civilDate(target.getUTCFullYear(), target.getUTCMonth(), Math.min(selected.getUTCDate(), lastDay)), focusDate);
  }
  document.getElementById("previousMonth").addEventListener("click", () => changeMonth(-1));
  document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));
  document.getElementById("calendarToday").addEventListener("click", () => selectDate(today()));
  dailyActiveOnly.addEventListener("change", renderDetails);
  calendarIncludeRegular.addEventListener("change", () => {
    displaySettings.includeRegular = calendarIncludeRegular.checked;
    saveDisplaySettings();
    syncDisplayControls();
    render();
  });
  function updateDurationFilter() {
    const value = calendarDurationDays.valueAsNumber;
    displaySettings.durationDays = Number.isFinite(value) && value >= 0 ? value : null;
    displaySettings.durationComparison = calendarDurationComparison.value === "gte" ? "gte" : "lte";
    saveDisplaySettings();
    document.getElementById("eventSettingsReset").disabled = JSON.stringify(displaySettings) === JSON.stringify(defaultDisplaySettings());
    render();
  }
  calendarDurationDays.addEventListener("input", updateDurationFilter);
  calendarDurationDays.addEventListener("change", () => {
    updateDurationFilter();
    syncDisplayControls();
  });
  calendarDurationComparison.addEventListener("change", updateDurationFilter);
  function eventFeed(feed) {
    const data = feed?.eventCalendar;
    if (data?.schemaVersion !== 1 || data.regularMinimumDays !== 365
      || !data.maps || typeof data.maps !== "object" || Array.isArray(data.maps)) {
      throw new Error("Event-only calendar export required");
    }
    const recurring = feed.recurringCalendar;
    if (recurring?.schemaVersion !== 1 || !recurring.maps
      || typeof recurring.maps !== "object" || Array.isArray(recurring.maps)) {
      throw new Error("Recurring calendar export required");
    }
    return { ...feed, maps: data.maps, dayMaps: feed.dayCalendar?.maps ?? feed.maps, recurringMaps: recurring.maps };
  }
  async function fetchEventFeed(signal) {
    try {
      return eventFeed(await api.fetchFeed(source, signal));
    } catch (error) {
      // An older public data branch may not have the calendar extensions yet.
      // Use the bundled export, never the unfiltered maps as a fallback.
      if (signal.aborted || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) throw error;
      const response = await fetch(new URL("stage-schedule-kr.json", source.src), {
        cache: "no-store", credentials: "omit", signal,
      });
      if (!response.ok) throw new Error("Event calendar unavailable");
      return eventFeed(await response.json());
    }
  }
  function readEvents(feed) {
    api.parseFeed(feed, "S000");
    const result = [];
    for (const code of Object.keys(feed.maps)) {
      if (api.eventMapId(code) === null) continue;
      const map = api.parseFeed(feed, code);
      const entry = catalog.get(code);
      if (!entry || entry.href !== `stage/${code}/index.html`) continue;
      for (const window of map.windows) result.push({ code, entry, ...window });
    }
    return result.sort((a, b) => a.start - b.start || a.code.localeCompare(b.code));
  }
  async function refresh() {
    if (inFlight || document.hidden) return;
    inFlight = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const feed = await fetchEventFeed(controller.signal);
      const metadata = api.parseFeed(feed, "S000");
      const next = readEvents(feed);
      const nextDay = readEvents({ ...feed, maps: feed.dayMaps });
      const nextRecurring = readEvents({ ...feed, maps: feed.recurringMaps });
      events = next;
      dayEvents = nextDay;
      recurringEvents = nextRecurring;
      calendar = metadata;
      failed = false;
    } catch (_) {
      failed = true;
    } finally {
      window.clearTimeout(timeout);
      inFlight = false;
      loading = false;
      render();
    }
  }
  initializeDisplayControls();
  render();
  void refresh();
  window.setInterval(() => {
    updateStatus();
    if (!document.hidden) void refresh();
  }, 60000);
  window.setInterval(() => { if (!document.hidden) updateCurrentTime(); }, 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void refresh(); });
  function restoreDisplaySettings() {
    displaySettings = readDisplaySettings();
    syncDisplayControls();
    render();
  }
  window.addEventListener("storage", event => { if (event.key === SETTINGS_KEY || event.key === null) restoreDisplaySettings(); });
  window.addEventListener("pageshow", () => { restoreDisplaySettings(); void refresh(); });
})();
