/* Item requirement views. Detailed cards remain the source of each link. */
(async () => {
  "use strict";
  const panel = document.getElementById("requiredUnitsPanel");
  const members = document.getElementById("requiredUnitsMembers");
  const compact = document.getElementById("requiredUnitsCompact");
  const detailed = document.getElementById("requiredUnitsDetailed");
  if (!panel || !members || !compact || !detailed) return;
  const source = document.currentScript.src;
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("item-required-units.css", source).href;
  document.head.append(stylesheet);

  const views = [];
  let activeView = "compact";
  const controls = compact.closest(".enemy-heading-controls");
  const filters = new Map();
  for (const form of [3, 4]) {
    const label = document.createElement("label");
    label.className = "talent-toggle";
    const text = document.createElement("span");
    text.textContent = `${form}진`;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `requiredUnitsForm${form}`;
    input.checked = true;
    input.setAttribute("aria-label", `${form}진 표시`);
    input.setAttribute("aria-controls", "requiredUnitsMembers");
    const check = document.createElement("span");
    check.className = "talent-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";
    label.append(text, input, check);
    controls.insertBefore(label, compact.closest(".time-toggle"));
    filters.set(form, input);
    input.addEventListener("change", applyFilters);
  }

  function applyFilters() {
    for (const { group, entries } of views) {
      let visible = false;
      for (const entry of entries) {
        const shown = !filters.has(entry.form) || filters.get(entry.form).checked;
        entry.card.hidden = !shown;
        entry.compact.hidden = !shown;
        visible ||= shown;
      }
      group.hidden = !visible;
    }
  }
  function load(sourcePath, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(sourcePath, source).href;
      script.addEventListener("load", resolve, {once: true});
      script.addEventListener("error", reject, {once: true});
      document.head.append(script);
    });
  }
  // The existing page generator already loads this shared view script.
  // Keep the encyclopedia and its sorting helper shared, without regenerating pages.
  try {
    await Promise.all([
      load("../unit-guide.js", () => Boolean(window.NyankoUnitGuide)),
      load("../unit/unit-encyclopedia.js", () => Boolean(window.NYANKODB_UNIT_ENCYCLOPEDIA)),
    ]);
  } catch (_) { /* Retain the original requirement order if shared data is unavailable. */ }
  const guide = window.NyankoUnitGuide;
  const encyclopedia = window.NYANKODB_UNIT_ENCYCLOPEDIA?.entries || {};
  for (const group of members.querySelectorAll(".required-unit-rarity-group")) {
    const cards = group.querySelector(".mother-members");
    if (!cards) continue;
    const icons = document.createElement("div");
    icons.className = "nyancombo-members";
    const rarity = group.querySelector(".required-unit-rarity-title img")?.alt
      || group.querySelector(".required-unit-rarity-title")?.textContent || "";
    icons.setAttribute("aria-label", `${rarity} 요구 캐릭터`);
    const entries = [...cards.querySelectorAll(".mother-member")].map(card => {
      const url = new URL(card.getAttribute("href"), document.baseURI);
      return {card, rarity, id: Number(/unit(\d+)\.html$/.exec(url.pathname)?.[1]),
        form: Number(url.searchParams.get("form"))};
    });
    // Flatten the shared guide's pages into the same grid: no gap before unlisted units.
    const ordered = guide
      ? guide.pages(entries, [rarity], encyclopedia, "encyclopedia").flatMap(page => page.entries)
      : entries;
    for (const entry of ordered) {
      const {card} = entry;
      cards.append(card);
      const name = card.querySelector(".mother-member-name")?.textContent || "";
      const link = document.createElement("a");
      link.className = "nyancombo-member";
      link.setAttribute("href", card.getAttribute("href"));
      link.dataset.tooltip = name;
      link.setAttribute("aria-label", card.getAttribute("aria-label"));
      const imageBox = document.createElement("div");
      imageBox.className = "nyancombo-member-image";
      const image = document.createElement("img");
      image.src = card.querySelector(".mother-member-image img").getAttribute("src");
      image.alt = ""; image.width = 104; image.height = 79;
      imageBox.append(image); link.append(imageBox);
      const compactEntry = document.createElement("div");
      compactEntry.className = "required-unit-compact-entry";
      compactEntry.append(link);
      const originalQuantity = card.querySelector(".required-material-quantity");
      if (originalQuantity) {
        compactEntry.append(originalQuantity.cloneNode(true));
      }
      icons.append(compactEntry);
      entry.compact = compactEntry;
    }
    group.append(icons);
    views.push({ group, cards, icons, entries: ordered });
  }
  function setView(view) {
    activeView = view;
    members.dataset.view = view;
    compact.setAttribute("aria-pressed", String(view === "compact"));
    detailed.setAttribute("aria-pressed", String(view === "detail"));
    for (const { cards, icons } of views) {
      cards.hidden = view === "compact";
      icons.hidden = view !== "compact";
    }
  }
  compact.addEventListener("click", () => setView("compact"));
  detailed.addEventListener("click", () => setView("detail"));
  applyFilters();
  setView(activeView);
})();
