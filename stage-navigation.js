/* Previous/next links shared by stage details and location pages. */
(() => {
  "use strict";
  const root = new URL("./", document.currentScript.src);
  const entries = window.NYANKODB_SEARCH_CATALOG?.entries;
  const hero = document.querySelector(".hero");
  if (!Array.isArray(entries) || !hero) return;

  const page = location.pathname;
  const current = entries.find((entry) => entry.kind === "stage"
    && entry.href && new URL(entry.href, root).pathname === page);
  if (!current) return;

  const parts = current.href.split("/");
  const locationId = parts[1];
  const isLocation = parts[2] === "index.html";
  let siblings;
  if (isLocation) {
    const family = String(current.id).match(/^([a-z]+)\d+$/i)?.[1];
    if (!family) return;
    siblings = entries.filter((entry) => entry.kind === "stage"
      && entry.href === `stage/${entry.id}/index.html`
      && String(entry.id).match(/^([a-z]+)\d+$/i)?.[1]?.toLowerCase() === family.toLowerCase());
    siblings.sort((a, b) => Number(String(a.id).match(/\d+$/)?.[0])
      - Number(String(b.id).match(/\d+$/)?.[0]));
  } else {
    siblings = entries.filter((entry) => entry.kind === "stage"
      && String(entry.href || "").startsWith(`stage/${locationId}/`)
      && /^\d+\.html$/i.test(String(entry.href).split("/").at(-1)));
    siblings.sort((a, b) => Number(a.href.split("/").at(-1).replace(/\.html$/i, ""))
      - Number(b.href.split("/").at(-1).replace(/\.html$/i, "")));
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
  if (nav.childElementCount) hero.insertAdjacentElement("afterend", nav);
})();
