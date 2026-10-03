/* Resolve location backgrounds when the page loads, including newly added files. */
(() => {
  "use strict";
  if (typeof DATA === "undefined" || !DATA.location) return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const root = new URL("./", document.currentScript.src);
  const locationId = DATA.stage?.locationId;
  const storyMaps = { eoc: "eoc", W04: "itf", W05: "itf", W06: "itf",
    Space07: "cotc", Space08: "cotc", Space09: "cotc" };
  const map = DATA.location.mapImage
    || window.NYANKODB_STAGE_NAVIGATION?.mapImages?.[locationId]
    || storyMaps[locationId];
  if (typeof map !== "string" || !/^[a-zA-Z0-9_]+$/.test(map)) return;
  const canonical = map.replace(/_00$/, "");
  const candidates = /^map\d+$/.test(canonical) ? [canonical, `${canonical}_00`] : [canonical];
  // Highest imgcut-2 dome: y=80, height=659 in the 10310px scene.
  // Center that part vertically when it fits; otherwise show the scene from
  // its top. Horizontal centering and the ordinary cover scale stay intact.
  const topTowerPart = { centerY: 409.5 / 10310, height: 659 / 10310 };
  const towerParts = { map019: topTowerPart, map032: topTowerPart, map046: topTowerPart };
  let index = 0;
  const image = new Image();
  function alignTowerPart() {
    const part = index === 0 ? towerParts[canonical] : undefined;
    if (part === undefined) return;
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const renderedHeight = image.naturalHeight * scale;
    const offset = height / 2 - part.centerY * renderedHeight;
    const bounded = part.height * renderedHeight > height ? 0
      : Math.max(height - renderedHeight, Math.min(0, offset));
    hero.style.setProperty("--location-background-position", `center ${bounded}px`);
  }
  image.onload = () => {
    // Older HTML also loads an image inline. Use a separate property so a
    // delayed legacy _00 load cannot overwrite the preferred assembled image.
    if (!document.getElementById("location-background-style")) {
      const style = document.createElement("style");
      style.id = "location-background-style";
      style.textContent = ".hero.location-hero::before{background-image:var(--location-background,var(--stage-background,none));background-position:var(--location-background-position,center);}";
      document.head.append(style);
    }
    hero.classList.add("location-hero");
    hero.style.setProperty("--location-background", `url("${image.src}")`);
    alignTowerPart();
    if (index === 0 && towerParts[canonical] !== undefined) {
      new ResizeObserver(alignTowerPart).observe(hero);
    }
  };
  image.onerror = () => {
    if (++index < candidates.length) load();
  };
  function load() {
    image.src = new URL(`img/map/${candidates[index]}.png`, root).href;
  }
  load();
})();
