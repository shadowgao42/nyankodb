/* Shared GNB markup. Load immediately after the data-nyanko-gnb placeholder. */
(() => {
  "use strict";
  const root = new URL("./", document.currentScript.src);
  function loadAnalytics() {
    const host = location.hostname;
    if (!["nyanko.wiki", "www.nyanko.wiki", "nyankodb.vercel.app"].includes(host) &&
        !host.endsWith("-project-team22.vercel.app")) return;
    const src = new URL("analytics-bundle.js", root).href;
    if ([...document.scripts].some(script => script.src === src)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAnalytics, { once: true });
  } else {
    loadAnalytics();
  }
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
        <a class="gnb-menu-link" data-section="item"><img alt="" width="30" height="30"><span>아이템</span></a>
        <a class="gnb-menu-link" data-section="stage"><img alt="" width="30" height="30"><span>스테이지</span></a>
        <a class="gnb-menu-link" data-section="event"><img alt="" width="30" height="30"><span>일정</span></a>
        <span class="gnb-menu-indicator" aria-hidden="true"></span>
      </nav>
      </div>
      <div class="gnb-actions">
      <form class="unit-search gnb-search" role="search">
        <label>검색</label>
        <div class="unit-search-field gnb-search-field">
          <svg class="gnb-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path></svg>
          <input type="search" autocomplete="off" spellcheck="false"
            aria-label="검색할 유닛 이름" aria-autocomplete="list" aria-expanded="false">
          <div class="unit-search-results gnb-search-results" role="listbox" aria-label="유닛 이름 검색 결과" hidden></div>
        </div>
      </form>
      <button type="button" class="gnb-auth" data-auth-pending="true" aria-hidden="true" disabled></button>
      </div>`;
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
    input.placeholder = "";
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
  // Server-verified state only. No tokens or user data are stored in the GNB.
  let stateRequest;
  async function refreshAuth() {
    if (stateRequest) return stateRequest;
    stateRequest = (async () => {
      let authenticated = false;
      try {
        if (/^https?:$/.test(root.protocol)) {
          const response = await fetch(new URL('api/auth/session', root), {
            credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(10000),
          });
          if (response.ok) {
            authenticated = (await response.json()).authenticated === true;
            
          }
        }
      } catch (_) { /* Static hosts have no account backend. */ }
      for (const button of document.querySelectorAll('.gnb-auth')) {
        button.dataset.authenticated = String(authenticated);
        button.textContent = authenticated ? '로그아웃' : '로그인';
        button.disabled = false;
        delete button.dataset.authPending;
        button.removeAttribute('aria-hidden');
      }
      return authenticated;
    })();
    try { return await stateRequest; } finally { stateRequest = null; }
  }
  for (const button of document.querySelectorAll('.gnb-auth')) {
    button.addEventListener('click', async () => {
      if (button.dataset.authenticated !== 'true') {
        location.assign(new URL('mypage/login.html', root));
        return;
      }
      button.disabled = true;
      try {
        const boot = await fetch(new URL('api/bootstrap', root), { credentials: 'same-origin', cache: 'no-store' });
        if (!boot.ok) throw new Error('Session unavailable');
        const csrf = document.cookie.split('; ').find(item => item.startsWith('nyanko_csrf='))?.split('=')[1] || '';
        const response = await fetch(new URL('api/auth/logout', root), {
          method: 'POST', credentials: 'same-origin', cache: 'no-store',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: '{}',
        });
        if (!response.ok) throw new Error('Logout failed');
        
        if (location.pathname.startsWith(new URL('mypage/', root).pathname)) {
          location.replace(new URL('mypage/login.html', root));
        } else await refreshAuth();
      } catch (_) {
        // Keep the verified label; do not claim that a failed logout succeeded.
        button.disabled = false;
      }
    });
  }
  window.NyankoAuthReady = refreshAuth();
  window.addEventListener('pageshow', event => { if (event.persisted) refreshAuth(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshAuth(); });
  window.addEventListener('nyanko-auth-changed', refreshAuth);



  // Keep one viewport-sized mobile bar across pages with different CSS zoom.
  function mountBottomNavigation() {
    if (document.getElementById("nyankoBottomNavigation")) return;
    const navigation = document.createElement("nav");
    navigation.id = "nyankoBottomNavigation";
    navigation.className = "nyanko-bottom-navigation";
    navigation.setAttribute("aria-label", "냥코DB 하단 메뉴");
    const relativePath = location.pathname.slice(root.pathname.length);
    const current = !relativePath || relativePath === "index.html" ? "home"
      : /^mypage(?:\/|$)/.test(relativePath) ? "mypage" : "explore";
    const items = [
      { key: "home", label: "홈", path: "index.html" },
      { key: "explore", label: "탐색", path: "unit/index.html" },
      { key: "mypage", label: "마이페이지", path: "mypage/login.html" },
    ];
    for (const item of items) {
      const link = document.createElement("a");
      link.className = "nyanko-bottom-navigation-link";
      link.href = new URL(item.path, root).href;
      if (item.key === current) link.setAttribute("aria-current", "location");
      const icon = document.createElement("span");
      icon.className = "nyanko-bottom-navigation-icon";
      icon.setAttribute("aria-hidden", "true");
      const iconUrl = new URL(`img/ui/navigation/${item.key}.svg`, root).href;
      icon.style.setProperty("--nyanko-navigation-icon", `url("${iconUrl}")`);
      const label = document.createElement("span");
      label.textContent = item.label;
      link.append(icon, label);
      navigation.append(link);
    }
    document.body.append(navigation);
    function updateNavigationScale() {
      document.body.classList.remove("has-nyanko-bottom-navigation");
      const originalPadding = getComputedStyle(document.body).paddingBottom;
      let pageZoom = 1;
      for (let element = document.body; element; element = element.parentElement) {
        const zoom = getComputedStyle(element).zoom;
        pageZoom *= (Number.parseFloat(zoom) || 1) / (zoom.endsWith("%") ? 100 : 1);
      }
      document.body.style.setProperty("--nyanko-bottom-base-padding", originalPadding);
      document.body.style.setProperty("--nyanko-bottom-inverse-zoom", String(1 / pageZoom));
      navigation.style.zoom = String(1 / pageZoom);
      document.body.classList.add("has-nyanko-bottom-navigation");
    }
    updateNavigationScale();
    window.addEventListener("resize", updateNavigationScale);
    window.addEventListener("pageshow", updateNavigationScale);
  }
  if (document.body) {
    mountBottomNavigation();
    if (document.readyState === "loading") {
      // Paint early, then retain the original final keyboard navigation order.
      document.addEventListener("DOMContentLoaded", () => {
        const navigation = document.getElementById("nyankoBottomNavigation");
        if (!navigation || document.body.lastElementChild === navigation) return;
        const focused = navigation.contains(document.activeElement) ? document.activeElement : null;
        document.body.append(navigation);
        if (focused) focused.focus({ preventScroll: true });
      }, { once: true });
    }
  } else {
    document.addEventListener("DOMContentLoaded", mountBottomNavigation, { once: true });
  }
})();
