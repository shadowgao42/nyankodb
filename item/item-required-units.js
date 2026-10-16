/* Item requirement views. Detailed cards remain the source of each link. */
(() => {
  "use strict";
  const panel = document.getElementById("requiredUnitsPanel");
  const members = document.getElementById("requiredUnitsMembers");
  const compact = document.getElementById("requiredUnitsCompact");
  const detailed = document.getElementById("requiredUnitsDetailed");
  if (!panel || !members || !compact || !detailed) return;
  const views = [];
  for (const group of members.querySelectorAll(".required-unit-rarity-group")) {
    const cards = group.querySelector(".mother-members");
    if (!cards) continue;
    const icons = document.createElement("div");
    icons.className = "nyancombo-members";
    const rarity = group.querySelector(".required-unit-rarity-title img")?.alt
      || group.querySelector(".required-unit-rarity-title")?.textContent || "";
    icons.setAttribute("aria-label", `${rarity} 요구 캐릭터`);
    for (const card of cards.querySelectorAll(".mother-member")) {
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
      const entry = document.createElement("div");
      entry.className = "required-unit-compact-entry";
      entry.append(link);
      const originalQuantity = card.querySelector(".required-material-quantity");
      if (originalQuantity) {
        entry.append(originalQuantity.cloneNode(true));
      }
      icons.append(entry);
    }
    group.append(icons);
    views.push({ cards, icons });
  }
  function setView(view) {
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
  setView("compact");
})();
