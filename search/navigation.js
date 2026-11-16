/* Local DB navigation is independent of the external result pages. */
(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const query = (params.get("q") || "").trim();
  const type = params.get("type") === "ai" ? "db"
    : ["db", "images", "videos", "web"].includes(params.get("type")) ? params.get("type") : "all";
  if (params.get("type") === "ai") {
    const url = new URL(location.href); url.searchParams.set("type", "db"); url.searchParams.delete("page");
    history.replaceState(null, "", url);
  }
  const requested = Number(params.get("page"));
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(100, requested) : 1;
  const requestedDB = Number(params.get("dbpage"));
  let internalPage = Number.isSafeInteger(requestedDB) && requestedDB > 0 ? requestedDB : 1;
  const root = new URL("../", document.currentScript.src);
  const totals = new Map();
  function href(mode = type, number = 1, dbNumber = 1) {
    const url = new URL("search/", root);
    url.searchParams.set("q", query);
    if (mode !== "all") url.searchParams.set("type", mode);
    if (mode !== "db" && number > 1) url.searchParams.set("page", String(number));
    if (["all", "db"].includes(mode) && dbNumber > 1) url.searchParams.set("dbpage", String(dbNumber));
    return url.href;
  }
  function updatePages(kind, lastPage, hasNext = false) {
    totals.set(kind, Number.isSafeInteger(lastPage) && lastPage >= 0 ? Math.min(100, lastPage) : 0);
    const kinds = type === "all" ? ["images", "videos"] : [type];
    const end = Math.max(0, ...kinds.map(kind => totals.get(kind) || 0));
    const container = document.getElementById("resultPages");
    if (!query || type === "db" || !end) { container.replaceChildren(); container.hidden = true; return; }
    window.NyankoSearchPages.render(container, {
      page, lastPage: end, hasNext: page < end, directionStyle: "chevrons",
      href: number => href(type, number, internalPage)
    });
  }
  function setInternalPage(number) {
    if (!Number.isSafeInteger(number) || number < 1) return;
    internalPage = number;
    // Existing external results stay in place; only their page destinations change.
    if (["all", "db"].includes(type)) for (const link of document.querySelectorAll("#resultPages a[href]")) {
      const url = new URL(link.href);
      if (number > 1) url.searchParams.set("dbpage", String(number));
      else url.searchParams.delete("dbpage");
      link.href = url.href;
    }
  }
  window.NyankoSearchView = Object.freeze({ query, type, page, get internalPage() { return internalPage; }, href, updatePages, setInternalPage });
  for (const link of document.querySelectorAll("#searchTabs a")) {
    const mode = link.dataset.searchType;
    link.href = href(mode);
    if (mode === type) link.setAttribute("aria-current", "page");
  }
  const form = document.getElementById("portalSearchForm");
  if (type !== "all") {
    const field = document.createElement("input");
    field.type = "hidden"; field.name = "type"; field.value = type; form.append(field);
  }
  document.getElementById("internalResults").hidden = !["all", "db"].includes(type);
  // Show only page numbers supported by the selected providers' actual totals.
  updatePages("initial", 0);
})();
