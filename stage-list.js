/* Stage-index UI with ordinary search, an initial 200 hits and one full expansion. */
(() => {
  "use strict";
  function mount({ catalog, input = null, results, status, scroll = null, allowedStageHrefs = null, idPrefix = "stage" }) {
    const search = window.NyankoSearch;
    const filtered = allowedStageHrefs !== null, allowed = filtered ? new Set(allowedStageHrefs) : null;
    const categoryOrder = search.stageCategoryOrder, categoryFor = search.stageCategoryForLocation;
    const formatter = new Intl.NumberFormat("ko-KR"), collator = new Intl.Collator("en", { numeric: true });
    const compact = value => String(value ?? "").toLowerCase().replace(/[\s\p{P}\p{S}_]/gu, "");
    const expandedLocations = new Set(), expandedCategories = new Set();
    const collapsedLocations = new Set(), collapsedCategories = new Set();
    const stagesByLocation = new Map();
    const parentHref = stage => stage.locationHref || String(stage.href).replace(/\/[^/]+$/, "/index.html");
    const catalogEntries = Array.isArray(catalog?.entries) ? catalog.entries : [];
    for (const entry of catalogEntries) {
      if (entry.kind !== "stage" || !/^stage\/[^/]+\/(?!index\.html$)[^/]+\.html$/i.test(entry.href || "") || (allowed && !allowed.has(entry.href))) continue;
      const key = parentHref(entry);
      if (!stagesByLocation.has(key)) stagesByLocation.set(key, []);
      stagesByLocation.get(key).push(entry);
    }
    const order = entry => entry.stageOrder ?? Number(String(entry.href).match(/\/(\d+)\.html$/)?.[1] ?? Number.MAX_SAFE_INTEGER);
    for (const stages of stagesByLocation.values()) stages.sort((a, b) => order(a) - order(b) || collator.compare(a.href, b.href));
    const locations = [...new Map(catalogEntries.filter(e => e.kind === "stage" && /^stage\/[^/]+\/index\.html$/i.test(e.href || ""))
      .map(e => [e.href, { ...e, id: String(e.id), name: String(e.name) }])).values()]
      .filter(e => !allowed || stagesByLocation.has(e.href));
    const byHref = new Map(locations.map(e => [e.href, e]));
    const appearanceStages = filtered ? [...locations].sort((a, b) => categoryOrder.indexOf(categoryFor(a.id)) - categoryOrder.indexOf(categoryFor(b.id)) || collator.compare(a.id, b.id))
      .flatMap(e => stagesByLocation.get(e.href) || []) : [];
    const pageSize = search.searchResults("", { kind: "stage" }).limit;
    let visibleHits = [], allHits = [], total = 0, renderedQuery = null, pendingRender = 0;
    function countSummary(chapters, stages) { return `${formatter.format(chapters)}개 장 · ${formatter.format(stages)}개 스테이지`; }
    function setMember(set, key, active) { if (active) set.add(key); else set.delete(key); }
    function createToggle(className, controls) {
      const button = document.createElement("button"); button.type = "button"; button.className = `filter-collapse ${className}`;
      button.setAttribute("aria-controls", controls); button.setAttribute("aria-expanded", "false");
      const label = document.createElement("span"); label.textContent = "펼치기";
      const arrow = document.createElement("span"); arrow.className = "filter-collapse-arrow"; arrow.setAttribute("aria-hidden", "true"); arrow.textContent = "▾";
      button.append(label, arrow); return { button, label };
    }
    function createCard(entry, stageCount) {
      const link = document.createElement("a"); link.className = "stage-card"; link.href = `../${entry.href}`;
      link.setAttribute("aria-label", `${entry.name}, STAGE ${entry.id}, ${formatter.format(stageCount)}개 스테이지`);
      const copy = document.createElement("span"); copy.className = "stage-copy";
      const name = document.createElement("span"); name.className = "stage-name"; name.textContent = entry.name;
      const identity = document.createElement("span"); identity.className = "stage-identity"; identity.textContent = `STAGE ${entry.id}`;
      const count = document.createElement("span"); count.className = "stage-card-count"; count.textContent = `${formatter.format(stageCount)}개 스테이지`;
      identity.append(count); copy.append(name, identity); link.append(copy); return link;
    }
    function createLocation({ entry, matchingStages }, query) {
      const stages = matchingStages.length ? matchingStages : stagesByLocation.get(entry.href) || [];
      const wrapper = document.createElement("div"); wrapper.className = "stage-location";
      const row = document.createElement("div"); row.className = "stage-location-row"; row.append(createCard(entry, stages.length));
      const list = document.createElement("div"); list.className = "stage-detail-list"; list.id = `${idPrefix}Details-${entry.id}`; list.hidden = true;
      const { button: toggle, label } = createToggle("stage-toggle", list.id);
      function setExpanded(expanded, remember = true) {
        if (expanded && !list.childElementCount) for (const stage of stages) {
          const link = document.createElement("a"); link.className = "stage-detail-link"; link.href = `../${stage.href}`;
          const name = document.createElement("span"); name.className = "stage-detail-name";
          const suffix = ` (${entry.name})`, category = categoryFor(entry.id), categorizedSuffix = ` (${entry.name} · ${category})`;
          name.textContent = stage.name.endsWith(categorizedSuffix) ? `${stage.name.slice(0, -categorizedSuffix.length)} (${category})`
            : stage.name.endsWith(suffix) ? stage.name.slice(0, -suffix.length) : stage.name;
          const id = document.createElement("span"); id.className = "stage-detail-id"; id.textContent = `STAGE ${stage.id}`;
          link.append(name, id); list.append(link);
        }
        list.hidden = !expanded; toggle.setAttribute("aria-expanded", String(expanded));
        wrapper.style.setProperty("--stage-location-height", `${64 + (expanded ? stages.length * 43 + 8 : 0)}px`);
        toggle.setAttribute("aria-label", `${entry.name} 상세 스테이지 ${expanded ? "접기" : "펼치기"}`); label.textContent = expanded ? "접기" : "펼치기";
        if (remember) {
          setMember(expandedLocations, entry.href, expanded);
          if (query || filtered) setMember(collapsedLocations, entry.href, !expanded);
        }
      }
      toggle.setAttribute("aria-label", `${entry.name} 상세 스테이지 펼치기`);
      toggle.addEventListener("click", () => setExpanded(list.hidden)); row.append(toggle); wrapper.append(row, list);
      const automaticallyExpanded = matchingStages.length && !collapsedLocations.has(entry.href);
      if (automaticallyExpanded || (!query && !filtered && expandedLocations.has(entry.href))) setExpanded(true, false);
      return wrapper;
    }
    function matchLocations(query, hits = visibleHits) {
      if (!query && !filtered) return locations.map(entry => ({ entry, matchingStages: [], rank: 0 }));
      const groups = new Map();
      hits.forEach((hit, rank) => {
        const isParent = /\/index\.html$/i.test(hit.href || ""), href = isParent ? hit.href : parentHref(hit);
        const entry = byHref.get(href); if (!entry) return;
        if (!groups.has(href)) groups.set(href, { entry, matchingStages: [], rank });
        if (!isParent) groups.get(href).matchingStages.push(hit);
      });
      return [...groups.values()];
    }
    function render({ more = false } = {}) {
      if (pendingRender) cancelAnimationFrame(pendingRender); pendingRender = 0;
      const query = compact(input?.value || "");
      if (query === renderedQuery && !more) return;
      const previousScroll = scroll?.scrollTop || 0;
      let firstNewHref;
      if (query !== renderedQuery) {
        visibleHits = []; collapsedCategories.clear(); collapsedLocations.clear();
        allHits = filtered ? appearanceStages : query ? search.searchResults(input.value, { kind: "stage", all: true }).matches : [];
      }
      if (query || filtered) {
        firstNewHref = allHits[more ? visibleHits.length : 0]?.href; total = allHits.length;
        visibleHits = more ? allHits : allHits.slice(0, pageSize);
      }
      const matches = matchLocations(query), groups = new Map(categoryOrder.map(c => [c, []]));
      matches.forEach(match => groups.get(categoryFor(match.entry.id))?.push(match));
      const fragment = document.createDocumentFragment();
      for (const [category, entries] of groups) {
        if (!entries.length) continue;
        entries.sort((a, b) => a.rank - b.rank || collator.compare(a.entry.id, b.entry.id));
        const section = document.createElement("section"); section.className = "stage-section"; section.setAttribute("aria-label", category);
        const heading = document.createElement("div"); heading.className = "stage-section-heading";
        if (entries[0].entry.icon) {
          const image = document.createElement("img"); image.src = `../${entries[0].entry.icon}`;
          if (/\/stage_(?:N|NA|ND|B|M|H|T|R|C|S)\.png$/.test(entries[0].entry.icon)) image.className = "stage-search-icon";
          image.alt = ""; image.width = 78; image.height = 60; image.loading = "lazy"; image.decoding = "async"; search.applyStageIconSize(image); heading.append(image);
        }
        const title = document.createElement("h3"); title.textContent = category;
        const count = document.createElement("small");
        count.textContent = countSummary(entries.length, entries.reduce((n, e) => n + (e.matchingStages.length || (stagesByLocation.get(e.entry.href)?.length || 0)), 0));
        heading.append(title, count);
        const grid = document.createElement("div"); grid.className = "stage-grid"; grid.id = `${idPrefix}Category-${categoryOrder.indexOf(category)}`; grid.hidden = true;
        const { button: toggle, label } = createToggle("stage-section-toggle", grid.id); heading.append(toggle);
        function setExpanded(expanded, remember = true) {
          if (expanded && !grid.childElementCount) entries.forEach(entry => grid.append(createLocation(entry, query)));
          grid.hidden = !expanded; toggle.setAttribute("aria-expanded", String(expanded));
          toggle.setAttribute("aria-label", `${category} ${expanded ? "접기" : "펼치기"}`); label.textContent = expanded ? "접기" : "펼치기";
          if (remember) {
            setMember(expandedCategories, category, expanded);
            if (query || filtered) setMember(collapsedCategories, category, !expanded);
          }
        }
        toggle.setAttribute("aria-label", `${category} 펼치기`); toggle.addEventListener("click", () => setExpanded(grid.hidden));
        if (((query || filtered) && !collapsedCategories.has(category)) || (!query && !filtered && expandedCategories.has(category))) setExpanded(true, false);
        section.append(heading, grid); fragment.append(section);
      }
      if (!matches.length) {
        const empty = document.createElement("p"); empty.className = "empty-results"; empty.textContent = "조건에 맞는 장 또는 스테이지가 없습니다."; fragment.append(empty);
      }
      if ((query || filtered) && visibleHits.length < total) {
        const box = document.createElement("div"); box.className = "stage-list-more";
        const button = document.createElement("button"); button.type = "button"; button.className = "filter-collapse"; button.textContent = "더보기"; button.setAttribute("aria-controls", results.id);
        button.addEventListener("click", () => render({ more: true })); box.append(button); fragment.append(box);
      }
      results.replaceChildren(fragment);
      if (filtered) status.textContent = countSummary(locations.length, appearanceStages.length);
      else if (query) {
        const fullMatches = matchLocations(query, allHits);
        status.textContent = countSummary(fullMatches.length, fullMatches.reduce((n, e) => n + (e.matchingStages.length || (stagesByLocation.get(e.entry.href)?.length || 0)), 0));
      }
      else status.textContent = countSummary(locations.length, [...stagesByLocation.values()].reduce((n, stages) => n + stages.length, 0));
      results.dataset.query = query; results.dataset.shown = String(visibleHits.length); results.dataset.total = String(total); renderedQuery = query;
      if (scroll) scroll.scrollTop = more ? previousScroll : 0;
      if (more && firstNewHref) {
        const next = [...results.querySelectorAll("a")].find(a => a.getAttribute("href") === `../${firstNewHref}`);
        const focusTarget = next || results.querySelector(".stage-list-more button") || results.querySelector(".stage-section-toggle") || scroll;
        focusTarget?.focus({ preventScroll: true });
        let attempts = 0;
        function revealFocus() {
          if (!focusTarget?.isConnected || !scroll) return;
          const linkBox = focusTarget.getBoundingClientRect(), viewport = scroll.getBoundingClientRect();
          const scale = viewport.height / scroll.offsetHeight || 1;
          const top = viewport.top + scroll.clientTop * scale + 2, bottom = top + scroll.clientHeight * scale - 4;
          if (linkBox.top < top) scroll.scrollTop -= (top - linkBox.top) / scale;
          else if (linkBox.bottom > bottom) scroll.scrollTop += (linkBox.bottom - bottom) / scale;
          // Offscreen rows acquire measured heights as the viewport moves.
          if (++attempts < 4) requestAnimationFrame(revealFocus);
        }
        revealFocus();
      }
    }
    function scheduleRender() {
      if (pendingRender) cancelAnimationFrame(pendingRender);
      pendingRender = requestAnimationFrame(() => render());
    }
    if (input) {
      input.addEventListener("input", scheduleRender);
      input.addEventListener("compositionend", scheduleRender);
      input.addEventListener("keydown", event => {
        if (event.isComposing || event.keyCode === 229 || event.key !== "Escape" || !input.value) return;
        input.value = ""; scheduleRender();
      });
    }
    render();
    return { refresh: scheduleRender };
  }
  window.NyankoStageList = Object.freeze({ mount });
})();
