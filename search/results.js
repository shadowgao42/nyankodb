/* Portal results use the same ranking, destinations and display-form state as shared search. */
(() => {
  "use strict";
  const view = window.NyankoSearchView;
  const { query } = view;
  const pageSize = 10;
  const root = new URL("../", document.currentScript.src);
  const input = document.getElementById("portalSearchInput");
  const results = document.getElementById("portalResults");
  const count = document.getElementById("resultCount");
  input.value = query;
  document.title = query ? `${query} - 검색 · 냥코DB` : "검색 · 냥코DB";

  function node(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  document.getElementById("portalSearchForm").addEventListener("submit", event => {
    if (!input.value.trim()) { event.preventDefault(); input.focus(); }
  });

  if (!["all", "db"].includes(view.type)) return;

  if (!query) {
    results.append(node("p", "empty-results", "이름 또는 ID를 입력해 검색하세요."));
    return;
  }

  const search = window.NyankoSearch;
  if (!search || !window.NYANKODB_SEARCH_CATALOG) {
    results.append(node("p", "empty-results", "검색 목록을 불러오지 못했습니다. 새로고침해 주세요."));
    return;
  }
  const initial = search.searchResults(query);
  const pageCount = Math.max(1, Math.ceil(initial.total / pageSize));
  const pager = document.getElementById("internalPages");
  let page = Math.min(view.internalPage, pageCount);
  function cardFor(entry) {
    const link = node("a", "item-card");
    link.href = search.destination(entry);
    const source = entry.icon || entry.image;
    if (source) {
      const icon = node("img", "");
      icon.src = new URL(source, source.startsWith("../") ? location.href : root).href;
      icon.alt = "";
      icon.loading = "lazy";
      if (/\/stage_(?:N|NA|ND|B|M|H|T|R|C|S)\.png$/.test(new URL(icon.src).pathname)) {
        icon.classList.add("stage-search-icon");
        icon.style.objectFit = "none";
        icon.style.objectPosition = "center";
      }
      search.applyStageIconSize(icon);
      link.append(icon);
    } else {
      link.append(node("span", "item-image-empty"));
    }
    const copy = node("span", "item-copy");
    copy.append(node("span", "item-name", entry.name || entry.label),
      node("span", "item-identity", search.identity(entry)));
    link.append(copy);
    link.addEventListener("click", () => search.rememberForm(entry));
    return link;
  }
  function renderPage(number) {
    page = Math.max(1, Math.min(pageCount, number));
    const offset = (page - 1) * pageSize;
    const found = offset ? search.searchResults(query, { offset }) : initial;
    const matches = found.matches.slice(0, pageSize);
    const fragment = document.createDocumentFragment();
    for (const entry of matches) fragment.append(cardFor(entry));
    if (!matches.length) fragment.append(node("p", "empty-results", "일치하거나 유사한 항목이 없습니다."));
    results.replaceChildren(fragment);
    count.textContent = found.total ? `${found.total.toLocaleString("ko-KR")}개 · ${page} / ${pageCount}` : "0개";
    pager.replaceChildren(); pager.hidden = true;
    if (pageCount > 1) window.NyankoSearchPages.render(pager, {
      page, lastPage: pageCount, hasNext: page < pageCount, showNumbers: false,
      href: number => view.href(view.type, view.page, number)
    });
    view.setInternalPage(page);
  }
  function changePage(number) {
    const next = Math.max(1, Math.min(pageCount, number));
    if (next === page) return;
    const focused = pager.contains(document.activeElement) ? document.activeElement.classList.contains("page-next") ? ".page-next" : ".page-previous" : null;
    const url = new URL(location.href);
    if (next > 1) url.searchParams.set("dbpage", String(next)); else url.searchParams.delete("dbpage");
    history.pushState(history.state, "", url);
    renderPage(next);
    if (focused) (pager.querySelector(focused) || pager.querySelector("a"))?.focus({ preventScroll: true });
  }
  pager.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || !pager.contains(link) || event.defaultPrevented || event.button !== 0
        || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href);
    const number = Number(url.searchParams.get("dbpage") || 1);
    if (!Number.isSafeInteger(number) || number < 1) return;
    event.preventDefault(); changePage(number);
  });
  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(location.search);
    const requestedMode = params.get("type");
    const mode = requestedMode === "ai" ? "db"
      : ["db", "images", "videos", "web"].includes(requestedMode) ? requestedMode : "all";
    const requestedPage = Number(params.get("page"));
    const externalPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(100, requestedPage) : 1;
    if ((params.get("q") || "").trim() !== query || mode !== view.type || externalPage !== view.page) return;
    const number = Number(params.get("dbpage") || 1);
    renderPage(Number.isSafeInteger(number) && number > 0 ? number : 1);
  });
  let gesture = null, suppressClickUntil = 0;
  results.style.touchAction = "pan-y";
  results.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" || event.isPrimary === false) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
  });
  results.addEventListener("pointermove", event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      gesture.horizontal = true; suppressClickUntil = performance.now() + 500;
      results.setPointerCapture(event.pointerId); event.preventDefault();
    }
  });
  results.addEventListener("pointerup", event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const active = gesture; gesture = null;
    const dx = event.clientX - active.x, dy = event.clientY - active.y;
    if (active.horizontal) suppressClickUntil = performance.now() + 500;
    if (active.horizontal && Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) changePage(page + (dx < 0 ? 1 : -1));
  });
  results.addEventListener("pointercancel", () => { gesture = null; });
  results.addEventListener("click", event => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  renderPage(page);
})();
