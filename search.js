/* Shared ordinary search. Catalogue data lives in catalog.js. */
(() => {
  "use strict";
  const script = document.currentScript;
  const siteRoot = new URL("./", script.src);
  const stageSearch = script.hasAttribute("data-stage-search");
  const compact = value => String(value ?? "").toLocaleLowerCase("ko-KR")
    .replace(/[\s\p{P}\p{S}_]/gu, "");

  function entries() {
    const catalog = window.NYANKODB_SEARCH_CATALOG || {};
    return (Array.isArray(catalog) ? catalog : [...(catalog.entries || []), ...(catalog.items || [])])
      .filter(entry => entry && (entry.name || entry.label));
  }

  function startsAtLaterWord(displayName, query) {
    const firstQueryCharacter = [...query][0];
    for (const boundary of String(displayName).matchAll(/[\s\p{Ps}]+/gu)) {
      const suffix = String(displayName).slice(boundary.index + boundary[0].length);
      const firstSuffixCharacter = [...suffix][0] || "";
      if (compact(firstSuffixCharacter) === firstQueryCharacter && compact(suffix).startsWith(query)) {
        return true;
      }
    }
    return false;
  }

  function nameRank(displayName, query) {
    const name = compact(displayName);
    if (name === query) return 0;
    if (name.startsWith(query)) return 1;
    if (startsAtLaterWord(displayName, query)) return 2;
    if (name.includes(query)) return 3;
    let cursor = 0;
    for (const letter of name) if (letter === query[cursor]) cursor++;
    if (cursor === query.length) return 4;
    const remaining = [...name];
    for (const letter of query) {
      const index = remaining.indexOf(letter);
      if (index < 0) return 99;
      remaining.splice(index, 1);
    }
    return 5;
  }

  function stageCategory(entry) {
    const location = entry.locationId || String(entry.href || entry.url || "").match(/^stage\/([^/]+)\//i)?.[1] || "";
    if (/^eoc$/i.test(location)) return "세계편";
    if (/^W\d+$/i.test(location)) return "미래편";
    if (/^Space\d+$/i.test(location)) return "우주편";
    if (/^N\d{3}$/i.test(location)) return "레전드 스토리";
    if (/^NA\d{3}$/i.test(location)) return "신 레전드 스토리";
    if (/^ND\d{3}$/i.test(location)) return "레전드 스토리 0";
    if (/^Z(?:000|001|002)$/i.test(location)) return "세계편 좀비습격";
    if (/^Z(?:004|005|006)$/i.test(location)) return "미래편 좀비습격";
    if (/^Z(?:007|008|009)$/i.test(location)) return "우주편 좀비습격";
    if (/^DM\d{3}$/i.test(location)) return "마계편";
    if (/^V\d{3}$/i.test(location)) return "냥코탑";
    return "";
  }

  function entryRank(entry, query) {
    if (compact(entry.id) === query || (/^\d+$/.test(query) && Number(entry.id) === Number(query))) {
      return 0;
    }
    if (entry.kind === "stage" && compact(entry.id).startsWith(query)) return 1;
    const displayName = String(entry.name || entry.label || "");
    if (entry.kind === "stage") {
      const bareName = displayName.replace(/\s+\([^()]*\)\s*$/, "");
      if (compact(bareName) === query) return 0;
      const category = stageCategory(entry);
      if (category) return Math.min(
        nameRank(displayName, query),
        nameRank(`${bareName} (${category})`, query),
        nameRank(`${displayName} (${category})`, query),
      );
    }
    return nameRank(displayName, query);
  }

  const kindOrder = Object.freeze({ unit: 0, enemy: 1, item: 2, stage: 3 });
  const ticketOrder = new Map([20, 21, 157, 29, 145, 212].map((id, index) => [id, index]));
  const evolutionOrder = new Map([
    30, 31, 32, 33, 34, 43, 160, 41, 164, 35, 36, 37, 38, 39, 40,
    161, 42, 44, 167, 168, 169, 170, 171, 184, 179, 180, 181, 182, 183,
  ].map((id, index) => [id, index]));
  const catseyeIds = new Set([50, 51, 52, 53, 54, 58]);
  const castleIds = new Set([85, 86, 87, 88, 89, 90, 91, 140, 187, 188, 189, 190, 191, 192, 193, 194]);

  function compareText(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
  }

  function stageSortKey(entry) {
    const path = String(entry.href || entry.url || "")
      .split(/[?#]/, 1)[0]
      .replace(/\\/g, "/");
    const segments = path.split("/").filter(Boolean);
    const stageIndex = segments.findIndex(segment => segment.toLocaleLowerCase("en-US") === "stage");
    let location = entry.locationId || (stageIndex >= 0 ? segments[stageIndex + 1] || "" : "");
    let page = stageIndex >= 0 ? segments[stageIndex + 2] || "" : "";

    // The catalogue normally supplies a stage URL. Keep ID parsing as a
    // deterministic fallback for any future entry that omits it.
    if (!location) {
      const id = String(entry.id ?? "");
      if (/^eoc$/i.test(id) || /^\d+$/.test(id)) {
        location = "eoc";
        page = /^\d+$/.test(id) ? `${id}.html` : "index.html";
      } else {
        const match = id.match(/^([a-z]+\d+)(?:-(.+))?$/i);
        location = match?.[1] || id;
        page = match?.[2] === undefined ? "index.html" : `${match[2]}.html`;
      }
    }

    const eoc = /^eoc$/i.test(location);
    const locationMatch = location.match(/^([a-z]+)(\d+)$/i);
    const prefix = eoc ? "" : (locationMatch?.[1] || location).toLocaleUpperCase("en-US");
    const locationNumber = eoc ? 0 : (locationMatch ? Number(locationMatch[2]) : Number.MAX_SAFE_INTEGER);
    const pageName = page.replace(/\.html$/i, "");
    const locationPage = !pageName || /^index$/i.test(pageName);
    const stageNumber = Number.isInteger(entry.stageOrder) ? entry.stageOrder
      : /^\d+$/.test(pageName) ? Number(pageName) : Number.MAX_SAFE_INTEGER;
    const familyOrder = eoc ? 0
      : prefix === "W" ? 1
      : prefix === "SPACE" ? 2
      : prefix === "Z" && locationNumber <= 2 ? 3
      : prefix === "Z" && locationNumber <= 6 ? 4
      : prefix === "Z" && locationNumber <= 9 ? 5
      : prefix === "DM" ? 6
      : prefix === "N" ? 7
      : prefix === "NA" ? 8
      : prefix === "ND" ? 9
      : prefix === "V" ? 10
      : 11;
    return { familyOrder, prefix, locationNumber, locationPage, stageNumber, pageName, id: String(entry.id ?? "") };
  }

  function compareStageEntries(left, right) {
    const a = stageSortKey(left);
    const b = stageSortKey(right);
    return a.familyOrder - b.familyOrder
      || compareText(a.prefix, b.prefix)
      || a.locationNumber - b.locationNumber
      || Number(b.locationPage) - Number(a.locationPage)
      || a.stageNumber - b.stageNumber
      || compareText(a.pageName, b.pageName)
      || compareText(a.id, b.id);
  }

  function itemSortKey(entry) {
    const id = Number(entry.id);
    if (id >= 0 && id <= 5) return { category: 0, position: id };
    if (ticketOrder.has(id)) return { category: 1, position: ticketOrder.get(id) };
    if (evolutionOrder.has(id)) return { category: 2, position: evolutionOrder.get(id) };
    if (catseyeIds.has(id)) return { category: 3, position: id };
    if (castleIds.has(id)) return { category: 4, position: id };
    return { category: 5, position: id };
  }

  function compareResults(left, right) {
    const rankDifference = left.rank - right.rank;
    if (rankDifference) return rankDifference;
    const leftKind = kindOrder[left.entry.kind] ?? Number.MAX_SAFE_INTEGER;
    const rightKind = kindOrder[right.entry.kind] ?? Number.MAX_SAFE_INTEGER;
    if (leftKind !== rightKind) return leftKind - rightKind;
    if (left.entry.kind === "stage" && right.entry.kind === "stage") {
      const categoryDifference = stageSortKey(left.entry).familyOrder - stageSortKey(right.entry).familyOrder;
      return categoryDifference || compareStageEntries(left.entry, right.entry);
    }
    if (left.entry.kind === "item" && right.entry.kind === "item") {
      const a = itemSortKey(left.entry);
      const b = itemSortKey(right.entry);
      return a.category - b.category || a.position - b.position;
    }
    const idDifference = Number(left.entry.id) - Number(right.entry.id);
    if (Number.isFinite(idDifference) && idDifference) return idDifference;
    const formDifference = Number(left.entry.form || 1) - Number(right.entry.form || 1);
    if (formDifference) return formDifference;
    return compareText(String(left.entry.id ?? ""), String(right.entry.id ?? ""));
  }

  const resultLimit = 200;

  function searchResults(value) {
    const query = compact(value);
    if (!query) return { matches: [], total: 0 };
    const ranked = entries().map(entry => ({
      entry,
      rank: entryRank(entry, query),
    })).filter(result => result.rank < 99)
      .sort(compareResults);
    return {
      matches: ranked.slice(0, resultLimit).map(result => result.entry),
      total: ranked.length,
    };
  }

  function search(value) {
    return searchResults(value).matches;
  }

  function identity(entry) {
    if (entry.kind === "stage") return entry.identity || `STAGE ${entry.id}`;
    const id = String(entry.id).padStart(3, "0");
    if (entry.kind === "enemy") return `ENEMY ${id}`;
    if (entry.kind === "item") return `ITEM ${id}`;
    return `UNIT ${id}-${entry.form || 1}`;
  }

  function destination(entry) {
    const id = String(entry.id).padStart(3, "0");
    let path = entry.href || entry.url;
    if (entry.kind === "enemy") path = `enemy/enemy${id}.html${stageSearch ? "?health=100&attack=100" : ""}`;
    else if (!path) path = entry.kind === "item" ? `item/item${id}.html` : `unit/unit${id}.html?form=${entry.form || 1}`;
    return new URL(path, siteRoot).href;
  }

  function rememberForm(entry) {
    if (entry.kind !== "unit") return;
    try {
      const key = `nyanko-db:unit:${entry.id}:display-state:v1`;
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      saved.form = Number(entry.form || 1);
      localStorage.setItem(key, JSON.stringify(saved));
    } catch (_) { /* Navigation also works without browser storage. */ }
  }

  function stageFallback(value) {
    if (!stageSearch) return "";
    if (/^\d{1,2}$/.test(value)) {
      const id = Number(value);
      return id < 48 || id === 49 || id === 50 ? `stage/eoc/${id}.html` : "";
    }
    const match = value.match(/^([a-z]+)(\d{1,3})-(\d+)$/i);
    if (!match) return "";
    const prefix = match[1].toUpperCase();
    const width = prefix === "W" || prefix === "SPACE" ? 2 : 3;
    const group = (prefix === "SPACE" ? "Space" : prefix) + match[2].padStart(width, "0");
    return `stage/${group}/${Number(match[3])}.html`;
  }

  function mount() {
    const home = Boolean(document.getElementById("unit-search-input"));
    const item = Boolean(document.getElementById("itemSearchInput"));
    const prefix = item ? "itemSearch" : "unitSearch";
    const input = document.getElementById(home ? "unit-search-input" : `${prefix}Input`);
    const form = document.getElementById(home ? "unit-search-form" : `${prefix}Form`);
    const results = document.getElementById(home ? "search-results" : `${prefix}Results`);
    const status = document.getElementById("search-status");
    if (!input || !form || !results || form.dataset.sharedSearchMounted) return;
    form.dataset.sharedSearchMounted = "true";
    input.setAttribute("aria-controls", results.id);
    input.setAttribute("aria-autocomplete", "list");
    let visible = [], active = -1;

    function close() {
      if (!home) results.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
      results.querySelectorAll('[role="option"]').forEach(node => node.setAttribute("aria-selected", "false"));
    }

    function setActive(index) {
      if (!visible.length) return;
      active = (index + visible.length) % visible.length;
      results.hidden = false;
      input.setAttribute("aria-expanded", "true");
      [...results.querySelectorAll('[role="option"]')].forEach((node, i) => {
        node.setAttribute("aria-selected", String(i === active));
        if (i === active) {
          input.setAttribute("aria-activedescendant", node.id);
          node.scrollIntoView({ block: "nearest" });
        }
      });
    }

    function navigate(entry) {
      rememberForm(entry);
      window.location.href = destination(entry);
    }

    function render() {
      const found = searchResults(input.value);
      visible = found.matches;
      results.replaceChildren();
      close();
      if (!compact(input.value)) {
        if (status) status.textContent = entries().length
          ? "유닛, 적, 아이템 또는 스테이지 이름/ID를 입력해 검색하세요."
          : "검색 목록을 불러오지 못했습니다.";
        return;
      }
      const countText = found.total > resultLimit ? `${resultLimit}+개의 결과` : `${found.total}개의 결과`;
      if (status) status.textContent = visible.length ? countText : "일치하는 결과가 없습니다.";
      if (visible.length && !home) {
        const count = document.createElement("div");
        count.className = "unit-search-empty unit-search-count";
        count.setAttribute("role", "status");
        count.textContent = countText;
        results.append(count);
      }
      if (!visible.length && !home) {
        const empty = document.createElement("div");
        empty.className = "unit-search-empty";
        empty.textContent = "검색 결과가 없습니다.";
        results.append(empty);
      }
      const fragment = document.createDocumentFragment();
      visible.forEach((entry, index) => {
        const node = document.createElement(home ? "a" : "button");
        if (home) node.href = destination(entry);
        else node.type = "button";
        node.className = home ? "search-result" : "unit-search-result";
        node.id = `${results.id}Option${index}`;
        node.setAttribute("role", "option");
        node.setAttribute("aria-selected", "false");
        if (entry.icon || entry.image) {
          const icon = document.createElement("img");
          const source = entry.icon || entry.image;
          icon.src = source.startsWith("../") ? new URL(source, location.href).href : new URL(source, siteRoot).href;
          icon.alt = "";
          icon.loading = "lazy";
          if (/\/stage_(?:N|NA|ND)\.png$/.test(new URL(icon.src).pathname)) {
            icon.className = "stage-search-icon";
            icon.style.objectFit = "none";
            icon.style.objectPosition = "center";
            // Compact results use a 54x40 slot instead of the full 78x60 slot.
            if (!home) icon.style.transform = "scale(0.6666666667)";
          }
          node.append(icon);
        } else {
          const placeholder = document.createElement("span");
          placeholder.className = "unit-search-result-icon-empty";
          node.append(placeholder);
        }
        const copy = document.createElement("span");
        copy.className = home ? "search-result-copy" : "unit-search-result-copy";
        const name = document.createElement("span");
        name.className = home ? "result-name" : "unit-search-result-name";
        name.textContent = entry.name || entry.label;
        const label = document.createElement("span");
        label.className = home ? "result-form" : "unit-search-result-identity";
        label.textContent = identity(entry);
        copy.append(name, label);
        node.append(copy);
        let start = null, suppress = false;
        node.addEventListener("pointerdown", event => {
          suppress = false;
          start = event.pointerType === "mouse" ? null : { id: event.pointerId, x: event.clientX, y: event.clientY };
        });
        node.addEventListener("pointermove", event => {
          if (start && event.pointerId === start.id && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) suppress = true;
        });
        node.addEventListener("pointercancel", () => { start = null; suppress = true; });
        node.addEventListener("click", event => {
          if (suppress) { event.preventDefault(); suppress = false; start = null; return; }
          start = null;
          if (home) rememberForm(entry);
          else navigate(entry);
        });
        node.addEventListener("mousemove", () => setActive(index));
        fragment.append(node);
      });
      results.append(fragment);
      results.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActive(active + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Escape") close();
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      const entry = visible[active >= 0 ? active : 0];
      if (entry) navigate(entry);
      else {
        const path = stageFallback(input.value.trim());
        if (path) window.location.href = new URL(path, siteRoot).href;
      }
    });
    document.addEventListener("pointerdown", event => {
      if (!form.contains(event.target) && !results.contains(event.target)) close();
    });
    window.addEventListener("pageshow", render);
    render();
  }

  window.NyankoSearch = Object.freeze({ search, identity, destination });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
