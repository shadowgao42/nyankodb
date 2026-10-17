/* Acquisition-stage prototype. Probabilities come from generated stage pages. */
(() => {
  "use strict";
  const sourceScript = document.currentScript;
  function initialize() {
    const panel = document.getElementById("itemStagesPanel");
    const source = document.getElementById("itemStageSourcesData");
    if (!panel || !source) return;
    const initialData = JSON.parse(source.textContent);
    const conversions = document.getElementById("itemStagesConversions");
    let activeOnly = document.getElementById("itemStagesActiveOnly");
    if (!activeOnly && conversions) {
      const label = document.createElement("label"); label.className = "talent-toggle";
      const text = document.createElement("span"); text.textContent = "현재 개최 중";
      activeOnly = document.createElement("input"); activeOnly.id = "itemStagesActiveOnly"; activeOnly.type = "checkbox";
      const check = document.createElement("span"); check.className = "talent-check";
      check.setAttribute("aria-hidden", "true"); check.textContent = "✓";
      label.append(text, activeOnly, check);
      conversions.parentElement.after(label);
    }
    const rowKey = entry => entry.routeId || entry.id;
    const isIndirect = entry => Boolean(entry.conversion);
    const collator = new Intl.Collator("en", { numeric: true });
    const search = window.NyankoSearch;
    const alwaysAvailable = new Set([
      "세계편", "미래편", "우주편", "세계편 좀비습격", "미래편 좀비습격", "우주편 좀비습격",
      "마계편", "레전드 스토리", "신 레전드 스토리", "레전드 스토리 0", "발굴 스테이지",
    ]);
    let activeLocations = new Set();
    let calendarApi, calendarScript, calendarLoading;
    let calendars = new Map();
    let refreshing = false, watching = false;
    function defaultCompare(left, right) {
      const category = entry => search.stageCategoryOrder.indexOf(search.stageCategoryForLocation(entry.locationId));
      return category(left) - category(right)
        || collator.compare(left.locationId, right.locationId)
        || left.stageOrder - right.stageOrder
        || collator.compare(left.href, right.href)
        || Number(isIndirect(left)) - Number(isIndirect(right))
        || collator.compare(rowKey(left), rowKey(right));
    }
    let directOrdered = [], combinedOrdered = [], defaultRank = new Map();
    const claimed = new Map();
    const rows = new Map();
    let sorting = "efficiency";
    let includeConversions = Boolean(conversions?.checked);
    let showAll = false;
    const initialLimit = 100;
    const format = value => new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 8 }).format(value);
    const formatAmount = value => new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }).format(value);
    const claimIds = entry => entry.rewardComponents
      ? entry.rewardComponents.filter(part => part.expectedUnclaimed !== part.expectedClaimed).map(part => part.id)
      : entry.hasClaimState ? [entry.id] : [];
    const entryClaimed = entry => claimIds(entry).every(id => claimed.get(id));
    const expected = entry => entry.rewardComponents
      ? entry.rewardComponents.reduce((sum, part) => sum + (claimed.get(part.id) ? part.expectedClaimed : part.expectedUnclaimed), 0)
      : claimed.get(entry.id) ? entry.expectedClaimed : entry.expectedUnclaimed;
    const efficiency = entry => {
      if (entry.itemCost) return null;
      const amount = expected(entry);
      return entry.energy === 0 ? (amount === 0 ? 0 : Infinity) : amount * 1000 / entry.energy;
    };
    const visibleEntries = () => {
      const entries = includeConversions ? combinedOrdered : directOrdered;
      return activeOnly?.checked ? entries.filter(entry =>
        alwaysAvailable.has(search.stageCategoryForLocation(entry.locationId)) || activeLocations.has(entry.locationId)
      ) : entries;
    };
    const visibleClaimStages = () => new Set(visibleEntries().flatMap(claimIds));
    function sortedEnergy(entries) {
      return entries.filter(entry => !entry.itemCost).sort((left, right) => {
        if (sorting === "efficiency") {
          const a = efficiency(left), b = efficiency(right);
          const same = a === b || (Number.isFinite(a) && Number.isFinite(b)
            && Math.abs(a - b) <= 8 * Number.EPSILON * Math.max(Math.abs(a), Math.abs(b), 1e-12));
          if (!same) return a > b ? -1 : 1;
        }
        return defaultRank.get(left) - defaultRank.get(right);
      });
    }
    function sortedItems(entries) {
      return entries.filter(entry => entry.itemCost).sort((left, right) => {
        if (sorting === "efficiency") {
          const itemOrder = left.itemCost.itemId - right.itemCost.itemId;
          if (itemOrder) return itemOrder;
          const a = expected(left) / left.itemCost.amount;
          const b = expected(right) / right.itemCost.amount;
          const same = a === b || (Number.isFinite(a) && Number.isFinite(b)
            && Math.abs(a - b) <= 8 * Number.EPSILON * Math.max(Math.abs(a), Math.abs(b), 1e-12));
          if (!same) return a > b ? -1 : 1;
        }
        return defaultRank.get(left) - defaultRank.get(right);
      });
    }
    function conversionDescription(entry) {
      if (entry.conversionSources) return entry.conversionSources.map(conversionDescription).join("; ");
      const conversion = entry.conversion;
      if (!conversion) return "";
      const steps = conversion.steps?.length ? conversion.steps : [{
        kind: conversion.kind, sourceItemId: entry.sourceItemId, sourceItemName: entry.sourceItemName,
        sourceQuantity: conversion.sourceQuantity, targetItemId: conversion.targetItemId,
        targetName: conversion.targetName, resultQuantity: conversion.resultQuantity,
      }];
      let recipe = "";
      let previous;
      for (const step of steps) {
        if (!previous || previous.targetItemId !== step.sourceItemId || previous.resultQuantity !== step.sourceQuantity) {
          recipe += `${previous ? "; " : ""}${step.sourceItemName} ×${format(step.sourceQuantity)}`;
        }
        const chance = Number.isFinite(step.probability) && step.probability !== 1
          ? `, 확률 ${format(step.probability * 100)}%` : "";
        recipe += ` → ${step.targetName} ×${format(step.resultQuantity)} (${step.kind === "synthesis" ? "합성" : "교환"}${chance})`;
        previous = step;
      }
      return `${conversion.targetName || steps.at(-1).targetName} 환산 · 경유: ${recipe}`;
    }
    function metric(label, className = "") {
      const box = document.createElement("div");
      box.className = `item-source-metric ${className}`.trim();
      const name = document.createElement("span"); name.textContent = label;
      const value = document.createElement("strong");
      box.append(name, value);
      return { box, value };
    }
    function createRow(entry) {
      const row = document.createElement("article");
      row.className = "item-source-row"; row.dataset.stageId = entry.id;
      row.dataset.routeId = rowKey(entry);
      row.setAttribute("role", "listitem");
      const background = document.createElement("span");
      background.className = "item-source-background"; background.setAttribute("aria-hidden", "true");
      row.append(background);
      if (entry.background) {
        row.style.setProperty("--stage-background", `url("../${entry.background}")`);
        row.style.setProperty("--stage-background-height", `${entry.backgroundHeightPercent}%`);
      }
      const link = document.createElement("a");
      link.className = "item-source-link"; link.href = `../${entry.href}`;
      const routeDescription = conversionDescription(entry);
      const crownLabel = entry.abyss ? " 👑어비스" : entry.crown ? ` 👑${entry.crown}` : "";
      link.setAttribute("aria-label", `${entry.name}${crownLabel}, STAGE ${entry.id}${routeDescription ? `, ${routeDescription}` : ""}`);
      if (entry.abyss || entry.crown) link.addEventListener("click", () => {
        try { localStorage.setItem(`nyanko-db:stage-location:${entry.locationId}:level:v1`, entry.abyss ? "abyss" : String(entry.crown)); } catch (_) {}
      });
      const copy = document.createElement("span"); copy.className = "mother-member-copy";
      const name = document.createElement("span"); name.className = "mother-member-name"; name.textContent = entry.name;
      const identity = document.createElement("span"); identity.className = "stage-ex-id"; identity.textContent = `STAGE ${entry.id}`;
      const map = document.createElement("small"); map.className = "item-source-map"; map.textContent = entry.mapName;
      if (entry.abyss || entry.crown) {
        const crown = document.createElement("span"); crown.className = "item-source-crown";
        crown.textContent = crownLabel.trim(); name.append(crown);
      }
      name.append(identity); copy.append(name, map); link.append(copy);
      const values = document.createElement("div"); values.className = "item-source-metrics";
      const cost = metric(entry.itemCost ? (entry.abyss ? "총 소모 아이템" : "소모 아이템") : entry.abyss ? "총 통솔력" : "통솔력");
      if (entry.itemCost) {
        cost.value.className = "item-source-cost";
        if (entry.itemCost.icon) {
          const icon = document.createElement("img"); icon.src = `../${entry.itemCost.icon}`; icon.alt = entry.itemCost.name;
          cost.value.append(icon);
        }
        cost.value.append(`${entry.itemCost.name} ×${format(entry.itemCost.amount)}`);
      } else cost.value.textContent = format(entry.energy);
      const payout = metric(entry.abyss ? "누적 획득량" : "획득 기댓값", "item-source-payout");
      values.append(cost.box, payout.box);
      let ratio;
      if (!entry.itemCost) {
        ratio = metric("1,000 통솔력당", "item-source-efficiency");
        values.append(ratio.box);
      }
      row.append(link, values);
      let select;
      if (entry.hasClaimState) {
        row.className += " item-source-has-claim";
        const label = document.createElement("label"); label.className = "story-reward-acquired";
        label.append("1회 한정 보상 ");
        select = document.createElement("select");
        select.setAttribute("aria-label", `${entry.id}${crownLabel}${routeDescription ? ` ${routeDescription}` : ""} 1회 한정 보상`);
        for (const [value, text] of [["0", "미획득"], ["1", "획득 완료"]]) {
          const option = document.createElement("option"); option.value = value; option.textContent = text; select.append(option);
        }
        select.addEventListener("change", () => {
          claimIds(entry).forEach(id => claimed.set(id, select.value === "1"));
          render();
          select.focus({ preventScroll: true });
        });
        label.append(select); row.append(label);
      }
      rows.set(entry, { row, payout: payout.value, ratio: ratio?.value, select });
      return row;
    }
    function render() {
      const visible = visibleEntries();
      const energy = sortedEnergy(visible);
      const items = sortedItems(visible);
      const shownEnergy = showAll ? energy : energy.slice(0, initialLimit);
      const shownItems = showAll ? items : items.slice(0, Math.max(0, initialLimit - shownEnergy.length));
      for (const entry of [...shownEnergy, ...shownItems]) {
        if (!rows.has(entry)) createRow(entry);
        const refs = rows.get(entry);
        refs.payout.textContent = `${formatAmount(expected(entry))}개`;
        if (refs.ratio) refs.ratio.textContent = efficiency(entry) === Infinity ? "∞" : formatAmount(efficiency(entry));
        if (refs.select) refs.select.value = entryClaimed(entry) ? "1" : "0";
      }
      const energyRoot = document.getElementById("itemEnergyStages");
      const itemRoot = document.getElementById("itemCostStages");
      energyRoot.replaceChildren(...shownEnergy.map(entry => rows.get(entry).row));
      itemRoot.replaceChildren(...shownItems.map(entry => rows.get(entry).row));
      document.getElementById("itemEnergyGroup").hidden = !shownEnergy.length;
      document.getElementById("itemCostGroup").hidden = !shownItems.length;
      document.getElementById("itemEnergyCount").textContent = `${energy.length}개`;
      document.getElementById("itemCostCount").textContent = `${items.length}개`;
      document.getElementById("itemStagesDefault").setAttribute("aria-pressed", String(sorting === "default"));
      document.getElementById("itemStagesEfficiency").setAttribute("aria-pressed", String(sorting === "efficiency"));
      const empty = document.getElementById("itemStagesEmpty");
      if (empty) empty.hidden = Boolean(visible.length);
      const more = document.getElementById("itemStagesMore");
      const moreContainer = document.getElementById("itemStagesMoreContainer");
      if (moreContainer) moreContainer.hidden = showAll || visible.length <= initialLimit;
      if (more) more.setAttribute("aria-expanded", String(showAll));
      const claimable = [...visibleClaimStages()];
      document.getElementById("itemStagesUnclaimed").disabled = !claimable.some(id => claimed.get(id));
      document.getElementById("itemStagesClaimed").disabled = !claimable.length || claimable.every(id => claimed.get(id));
    }
    document.getElementById("itemStagesDefault").addEventListener("click", () => { sorting = "default"; render(); });
    document.getElementById("itemStagesEfficiency").addEventListener("click", () => { sorting = "efficiency"; render(); });
    document.getElementById("itemStagesMore")?.addEventListener("click", () => { showAll = true; render(); });
    function syncActiveLocations() {
      const now = Date.now();
      const next = new Set([...calendars].filter(([, calendar]) => calendarApi.stateAt(calendar, now).state === "active").map(([code]) => code));
      const changed = next.size !== activeLocations.size || [...next].some(code => !activeLocations.has(code));
      activeLocations = next;
      if (changed && activeOnly?.checked) render();
    }
    function loadCalendarApi() {
      if (calendarLoading) return calendarLoading;
      calendarScript = document.createElement("script");
      calendarScript.src = new URL("../stage-schedule.js", sourceScript.src).href;
      calendarScript.dataset.scheduleFeed = "https://raw.githubusercontent.com/shadowgao42/nyankodb/event-schedule-data/stage-schedule-kr.json";
      if (window.NyankoStageSchedule) return Promise.resolve(window.NyankoStageSchedule);
      calendarLoading = new Promise((resolve, reject) => {
        calendarScript.onload = () => resolve(window.NyankoStageSchedule);
        calendarScript.onerror = () => { calendarScript.remove(); calendarLoading = null; reject(new Error("Calendar unavailable")); };
        document.head.append(calendarScript);
      });
      return calendarLoading;
    }
    async function refreshCalendar() {
      if (!activeOnly?.checked || document.hidden || refreshing) return;
      refreshing = true;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        calendarApi = await loadCalendarApi();
        const feed = await calendarApi.fetchFeed(calendarScript, controller.signal);
        // Validate even an empty map list with the same official-feed checks.
        calendarApi.parseFeed(feed, "S000");
        const next = new Map(Object.keys(feed.maps).map(code => [code, calendarApi.parseFeed(feed, code)]));
        calendars = next;
      } catch (_) {
        // Only still-valid official intervals can survive a failed refresh.
      } finally {
        window.clearTimeout(timeout);
        refreshing = false;
        syncActiveLocations();
      }
    }
    function syncActiveFilter() {
      syncActiveLocations();
      render();
      if (!activeOnly?.checked) return;
      if (!watching) {
        watching = true;
        window.setInterval(() => { if (activeOnly.checked && !document.hidden) syncActiveLocations(); }, 1000);
        window.setInterval(refreshCalendar, 60000);
      }
      void refreshCalendar();
    }
    activeOnly?.addEventListener("change", syncActiveFilter);
    window.addEventListener("pageshow", syncActiveFilter);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && activeOnly?.checked) syncActiveFilter(); });
    if (conversions) {
      const syncConversions = () => { includeConversions = conversions.checked; render(); };
      conversions.addEventListener("change", syncConversions);
      window.addEventListener("pageshow", syncConversions);
    }
    for (const [buttonId, value] of [["itemStagesUnclaimed", false], ["itemStagesClaimed", true]]) {
      document.getElementById(buttonId).addEventListener("click", () => {
        visibleClaimStages().forEach(id => claimed.set(id, value));
        render();
      });
    }
    function replaceData(data) {
      directOrdered = [...data.stages].sort(defaultCompare);
      combinedOrdered = [...(data.combinedStages || data.stages)].sort(defaultCompare);
      defaultRank = new Map([...directOrdered, ...combinedOrdered].map((entry, index) => [entry, index]));
      rows.clear();
      render();
    }
    // Orb settings change the target item without loading another page. Keep
    // physical-stage claims, the selected sort, checkbox and expansion state.
    panel.addEventListener("item-sources-change", event => replaceData(event.detail));
    replaceData(initialData);
    if (activeOnly?.checked) syncActiveFilter();
  }
  if (document.readyState !== "complete") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
