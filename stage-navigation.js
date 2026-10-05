/* Shared stage bootstrap: location images and previous/next links. */
(() => {
  // Older detail pages render multiplier labels as plain text. Normalize each
  // render so changing crowns or treasure settings retains the shared colors.
  const rows = document.getElementById("enemyRows");
  if (!rows) return;
  const formatLabels = () => {
    for (const element of rows.querySelectorAll(".enemy-magnification")) {
      if (element.firstElementChild || !element.textContent.startsWith("체력 ")) continue;
      const parts = element.textContent.split(/(체력|공격력| · )/);
      element.replaceChildren(...parts.filter(Boolean).map((part) => {
        if (!["체력", "공격력", " · "].includes(part)) return document.createTextNode(part);
        const label = document.createElement("span");
        label.className = "enemy-magnification-label";
        label.textContent = part;
        return label;
      }));
    }
  };
  formatLabels();
  new MutationObserver(formatLabels).observe(rows, { childList: true, subtree: true });
})();

(() => {
  // Existing pages already include this bootstrap. Load the common image
  // resolver independently of navigation, including locations with no siblings.
  if (typeof DATA === "undefined" || !DATA.location) return;
  const script = document.createElement("script");
  script.src = new URL("stage-location-background.js", document.currentScript.src).href;
  document.head.append(script);
})();

(() => {
  "use strict";
  const root = new URL("./", document.currentScript.src);
  const entries = window.NYANKODB_STAGE_NAVIGATION?.entries
    || window.NYANKODB_SEARCH_CATALOG?.entries;
  const hero = document.querySelector(".hero");
  if (!Array.isArray(entries) || !hero) return;

  const page = location.pathname;
  const current = entries.find((entry) => entry.kind === "stage"
    && entry.href && new URL(entry.href, root).pathname === page);
  if (!current) return;

  const parts = current.href.split("/");
  const locationId = current.locationId || parts[1];
  const isLocation = parts[2] === "index.html";
  const locationFamily = (id) => {
    const zombie = /^Z(\d{3})$/i.exec(String(id));
    if (zombie) {
      const group = Number(zombie[1]);
      return group <= 2 ? "zombie-eoc" : group <= 6 ? "zombie-itf" : "zombie-cotc";
    }
    return String(id).match(/^([a-z]+)\d+$/i)?.[1]?.toLowerCase() || String(id).toLowerCase();
  };
  let siblings;
  if (isLocation) {
    const family = locationFamily(current.id);
    siblings = entries.filter((entry) => entry.kind === "stage"
      && entry.href === `stage/${entry.id}/index.html`
      && locationFamily(entry.id) === family);
    siblings.sort((a, b) => Number(String(a.id).match(/\d+$/)?.[0])
      - Number(String(b.id).match(/\d+$/)?.[0]));
  } else {
    siblings = entries.filter((entry) => entry.kind === "stage"
      && (entry.locationId || String(entry.href || "").split("/")[1]) === locationId
      && String(entry.href).endsWith(".html")
      && !String(entry.href).endsWith("/index.html"));
  }

  const position = siblings.findIndex((entry) => entry.href === current.href);
  if (position < 0 || siblings.length < 2) return;
  const nav = document.createElement("nav");
  nav.className = "stage-neighbor-nav";
  nav.setAttribute("aria-label", isLocation ? "이전·이후 위치" : "이전·이후 스테이지");
  for (const [direction, neighbor] of [
    ["previous", siblings[position - 1]],
    ["next", siblings[position + 1]],
  ]) {
    if (!neighbor) continue;
    const link = document.createElement("a");
    link.className = `stage-neighbor-link stage-neighbor-link--${direction}`;
    link.href = new URL(neighbor.href, root).href;
    const label = document.createElement("span");
    label.className = "stage-neighbor-direction";
    label.textContent = direction === "previous" ? "‹ 이전" : "이후 ›";
    const name = document.createElement("strong");
    name.className = "stage-neighbor-name";
    name.textContent = isLocation ? neighbor.name
      : String(neighbor.name).replace(/\s+\([^()]*\)\s*$/, "");
    link.append(label, name);
    nav.append(link);
  }
  if (!nav.childElementCount) return;
  hero.insertAdjacentElement("afterend", nav);

  const floating = nav.cloneNode(true);
  floating.classList.add("stage-neighbor-nav--floating");
  floating.setAttribute("aria-label", `${nav.getAttribute("aria-label")} 빠른 이동`);
  const handle = document.createElement("div");
  handle.className = "stage-neighbor-drag-handle";
  handle.textContent = "스테이지 이동";
  floating.prepend(handle);
  floating.hidden = true;
  document.body.append(floating);
  let drag = null;
  let offsetX = 0;
  let offsetY = 0;
  const clamp = (value, maximum) => Math.max(0, Math.min(value, Math.max(0, maximum)));
  const keepInViewport = () => {
    if (floating.hidden) return;
    const rect = floating.getBoundingClientRect();
    const scaleX = rect.width / floating.offsetWidth || 1;
    const scaleY = rect.height / floating.offsetHeight || 1;
    offsetX += (clamp(rect.left, window.innerWidth - rect.width) - rect.left) / scaleX;
    offsetY += (clamp(rect.top, window.innerHeight - rect.height) - rect.top) / scaleY;
    floating.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  };
  handle.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = floating.getBoundingClientRect();
    drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY,
      left: rect.left, top: rect.top, width: rect.width, height: rect.height,
      scaleX: rect.width / floating.offsetWidth || 1,
      scaleY: rect.height / floating.offsetHeight || 1,
      offsetX, offsetY };
    handle.setPointerCapture(event.pointerId);
    floating.classList.add("is-dragging");
    event.preventDefault();
  });
  handle.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    offsetX = drag.offsetX + (clamp(drag.left + dx, window.innerWidth - drag.width) - drag.left) / drag.scaleX;
    offsetY = drag.offsetY + (clamp(drag.top + dy, window.innerHeight - drag.height) - drag.top) / drag.scaleY;
    floating.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    event.preventDefault();
  });
  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    floating.classList.remove("is-dragging");
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    drag = null;
  };
  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);
  const updateFloating = () => {
    floating.hidden = nav.getBoundingClientRect().bottom >= 0;
  };
  window.addEventListener("scroll", updateFloating, { passive: true });
  window.addEventListener("resize", () => { updateFloating(); keepInViewport(); });
  updateFloating();
})();
