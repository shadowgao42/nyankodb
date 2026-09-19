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

  function nameRank(name, query) {
    if (name === query) return 0;
    if (name.includes(query)) return 1;
    let cursor = 0;
    for (const letter of name) if (letter === query[cursor]) cursor++;
    if (cursor === query.length) return 2;
    const remaining = [...name];
    for (const letter of query) {
      const index = remaining.indexOf(letter);
      if (index < 0) return 99;
      remaining.splice(index, 1);
    }
    return 3;
  }

  function search(value) {
    const query = compact(value);
    if (!query) return [];
    const numeric = /^\d+$/.test(query) ? Number(query) : null;
    return entries().map(entry => ({
      entry,
      rank: compact(entry.id) === query || (numeric !== null && Number(entry.id) === numeric)
        ? 0 : nameRank(compact(entry.name || entry.label), query),
    })).filter(result => result.rank < 99).sort((a, b) =>
      a.rank - b.rank || Number(a.entry.id) - Number(b.entry.id)
      || String(a.entry.kind).localeCompare(String(b.entry.kind))
      || Number(a.entry.form || 1) - Number(b.entry.form || 1)
    ).map(result => result.entry);
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
      visible = search(input.value);
      results.replaceChildren();
      close();
      if (!compact(input.value)) {
        if (status) status.textContent = entries().length
          ? "유닛, 적, 아이템 또는 스테이지 이름/ID를 입력해 검색하세요."
          : "검색 목록을 불러오지 못했습니다.";
        return;
      }
      if (status) status.textContent = visible.length ? `${visible.length}개의 결과` : "일치하는 결과가 없습니다.";
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
          }
          if (entry.iconOverlay) {
            const frame = document.createElement("span");
            frame.style.cssText = "position:relative;display:block;width:100%;";
            // 15.6 ARM64 0x4fa948..0x4fa998: cut 33 at
            // (button.right - 173 * scale, button.top + 4 * scale), 164x72.
            // Match the base image's contain fit, including letterboxing, at any size.
            const svgNS = "http://www.w3.org/2000/svg";
            const badge = document.createElementNS(svgNS, "svg");
            badge.setAttribute("viewBox", "0 0 328 263");
            badge.setAttribute("preserveAspectRatio", "xMidYMid meet");
            badge.setAttribute("role", "img");
            badge.setAttribute("aria-label", "좀비습격");
            badge.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
            const overlay = document.createElementNS(svgNS, "image");
            overlay.setAttribute("href", new URL(entry.iconOverlay, siteRoot).href);
            overlay.setAttribute("x", "155");
            overlay.setAttribute("y", "4");
            overlay.setAttribute("width", "164");
            overlay.setAttribute("height", "72");
            badge.append(overlay);
            frame.append(icon, badge);
            node.append(frame);
          } else node.append(icon);
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
