/* Shared GNB markup. Load immediately after the data-nyanko-gnb placeholder. */
(() => {
  "use strict";
  const root = new URL("./", document.currentScript.src);
  for (const header of document.querySelectorAll("[data-nyanko-gnb]:not([data-gnb-mounted])")) {
    const prefix = header.dataset.searchPrefix || "unitSearch";
    header.className = "db-toolbar nyanko-gnb";
    header.dataset.gnbSettling = "true";
    header.setAttribute("aria-label", "냥코DB 상단 메뉴");
    header.innerHTML = `
      <div class="gnb-leading">
      <a class="db-brand gnb-brand" id="homeLink" aria-label="냥코DB 홈">냥코<span>DB</span></a>
      <nav class="gnb-menu" aria-label="도감 메뉴">
        <a class="gnb-menu-link" data-section="unit"><img alt="" width="30" height="30"><span>유닛</span></a>
        <a class="gnb-menu-link" data-section="enemy"><img alt="" width="30" height="30"><span>적</span></a>
        <span class="gnb-menu-indicator" aria-hidden="true"></span>
      </nav>
      </div>
      <form class="unit-search gnb-search" role="search">
        <label>검색</label>
        <div class="unit-search-field gnb-search-field">
          <input type="search" autocomplete="off" spellcheck="false" placeholder="이름 입력"
            aria-label="검색할 유닛 이름" aria-autocomplete="list" aria-expanded="false">
          <div class="unit-search-results gnb-search-results" role="listbox" aria-label="유닛 이름 검색 결과" hidden></div>
        </div>
        <button type="submit" class="gnb-submit">검색</button>
      </form>`;
    header.querySelector(".gnb-brand").href = new URL("index.html", root).href;
    for (const link of header.querySelectorAll(".gnb-menu-link")) {
      const section = link.dataset.section;
      link.href = new URL(`${section}/index.html`, root).href;
      link.querySelector("img").src = new URL(`img/ui/gnb/${section}.png`, root).href;
      if (location.pathname.startsWith(new URL(`${section}/`, root).pathname)) {
        link.setAttribute("aria-current", "location");
      }
    }
    const form = header.querySelector("form");
    const input = header.querySelector("input");
    const results = header.querySelector('[role="listbox"]');
    form.id = `${prefix}Form`;
    input.id = `${prefix}Input`;
    input.placeholder = header.dataset.searchPlaceholder ?? "이름 입력";
    results.id = `${prefix}Results`;
    header.querySelector("label").htmlFor = input.id;
    input.setAttribute("aria-controls", results.id);
    const menu = header.querySelector(".gnb-menu");
    const links = [...menu.querySelectorAll("a")];
    const indicator = menu.querySelector(".gnb-menu-indicator");
    const current = links.find(link => link.hasAttribute("aria-current"));
    let selected = current;
    let navigationPending = false;
    function emphasize(link) {
      selected = link;
      for (const item of links) item.classList.toggle("is-emphasized", item === link);
      indicator.style.opacity = link ? "1" : "0";
      if (link) {
        indicator.style.width = `${link.offsetWidth}px`;
        indicator.style.transform = `translateX(${link.offsetLeft}px)`;
      }
    }
    function settleOn(link) {
      header.dataset.gnbSettling = "true";
      emphasize(link);
      // Commit the current-section position before transitions are enabled.
      void indicator.offsetWidth;
      requestAnimationFrame(() => { delete header.dataset.gnbSettling; });
    }
    for (const link of links) {
      link.addEventListener("pointerenter", () => { if (!navigationPending) emphasize(link); });
      link.addEventListener("focus", () => { if (!navigationPending) emphasize(link); });
      link.addEventListener("click", event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        event.preventDefault();
        if (navigationPending) return;
        navigationPending = true;
        emphasize(link);
        // Let the selection feedback finish before normal document navigation.
        window.setTimeout(() => location.assign(link.href), 180);
      });
    }
    const restore = () => {
      if (!navigationPending) emphasize(links.find(link => link === document.activeElement) || current);
    };
    menu.addEventListener("pointerleave", restore);
    menu.addEventListener("focusout", () => queueMicrotask(restore));
    new ResizeObserver(() => emphasize(selected)).observe(menu);
    window.addEventListener("pageshow", () => { navigationPending = false; settleOn(current); });
    settleOn(current);
    header.dataset.gnbMounted = "true";
  }
})();
