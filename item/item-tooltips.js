/* Item icons share the stage reward tooltip surface without clipping parents. */
(() => {
  "use strict";
  const portrait = document.getElementById("itemPortrait");
  const currentName = document.getElementById("itemName")?.textContent.trim() || "";
  const iconId = (image) => image?.id === "orbPreview" ? image.dataset.itemId
    : image?.tagName?.toLowerCase() === "img"
      ? image.getAttribute("src")?.match(/(?:^|\/)img\/(?:r|orb)\/(\d+)\.png(?:[?#].*)?$/i)?.[1] : undefined;
  const currentId = iconId(portrait);
  const titles = new WeakMap();
  const rememberTitle = (image) => {
    const title = image.getAttribute("title");
    if (title !== null) {
      if (title.trim()) titles.set(image, title.trim());
      image.removeAttribute("title");
    }
  };
  // Delegation below also handles icons created by compact views or load-more.
  for (const image of document.querySelectorAll("img")) {
    if (iconId(image) !== undefined) rememberTitle(image);
  }
  const nameFor = (image) => {
    const id = iconId(image);
    if (id === undefined) return "";
    if (image.id === "orbPreview") return image.getAttribute("aria-label") || "";
    rememberTitle(image);
    if (currentId !== undefined && Number(id) === Number(currentId) && currentName) return currentName;
    return titles.get(image)
      || image.closest("a.stage-drink-link")?.getAttribute("aria-label")?.trim()
      || image.getAttribute("alt")?.trim() || "";
  };
  const tooltip = document.createElement("div");
  tooltip.id = "itemIconTooltip";
  tooltip.className = "item-icon-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  document.body.append(tooltip);
  let hoverImage = null, focusImage = null, focusTarget = null, activeImage = null, describedTarget = null;
  const clearDescription = () => {
    if (!describedTarget) return;
    const tokens = (describedTarget.getAttribute("aria-describedby") || "").split(/\s+/)
      .filter((token) => token && token !== tooltip.id);
    if (tokens.length) describedTarget.setAttribute("aria-describedby", tokens.join(" "));
    else describedTarget.removeAttribute("aria-describedby");
    describedTarget = null;
  };
  const place = () => {
    if (!activeImage || tooltip.hidden) return;
    // Use the same body zoom and 12px horizontal viewport clamp as stages.
    const zoom = Number.parseFloat(getComputedStyle(document.body).zoom) || 1;
    const rect = activeImage.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - box.width - 12));
    const gap = 8 * zoom;
    let top = rect.top - box.height - gap;
    if (top < 12) top = rect.bottom + gap;
    top = Math.max(12, Math.min(top, window.innerHeight - box.height - 12));
    tooltip.style.left = `${left / zoom}px`;
    tooltip.style.top = `${top / zoom}px`;
  };
  const refresh = () => {
    const image = hoverImage || focusImage;
    const name = nameFor(image);
    clearDescription();
    if (!name || !image.isConnected) {
      activeImage = null;
      tooltip.dataset.open = "false";
      tooltip.hidden = true;
      return;
    }
    activeImage = image;
    tooltip.textContent = name;
    tooltip.hidden = false;
    place();
    tooltip.dataset.open = "true";
    if (image === focusImage && focusTarget) {
      describedTarget = focusTarget;
      const tokens = (focusTarget.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (!tokens.includes(tooltip.id)) tokens.push(tooltip.id);
      focusTarget.setAttribute("aria-describedby", tokens.join(" "));
    }
  };
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch" || iconId(event.target) === undefined) return;
    hoverImage = event.target;
    refresh();
  });
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    let image = iconId(event.target) !== undefined ? event.target : null;
    // Acquisition cards use a whole-card link overlay above their cost image.
    // Hit-test that image without changing the overlay or its click behavior.
    if (!image) {
      const costImage = event.target.closest?.(".item-source-row")?.querySelector(".item-source-cost img");
      if (costImage && iconId(costImage) !== undefined) {
        const rect = costImage.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right
            && event.clientY >= rect.top && event.clientY <= rect.bottom) image = costImage;
      }
    }
    if (image === hoverImage) return;
    hoverImage = image;
    refresh();
  });
  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget && (event.target !== hoverImage || event.relatedTarget === hoverImage)) return;
    hoverImage = null;
    refresh();
  });
  document.addEventListener("focusin", (event) => {
    // Existing item links may expose their icon on focus. Unit links whose
    // first image is a unit portrait retain their original unit tooltip.
    const image = iconId(event.target) !== undefined ? event.target : event.target.querySelector?.("img");
    focusImage = iconId(image) !== undefined ? image : null;
    focusTarget = focusImage ? event.target : null;
    refresh();
  });
  document.addEventListener("focusout", (event) => {
    if (event.target !== focusTarget) return;
    focusImage = null;
    focusTarget = null;
    refresh();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    hoverImage = focusImage = focusTarget = null;
    refresh();
  });
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, true);
  window.addEventListener("pagehide", () => {
    hoverImage = focusImage = focusTarget = null;
    refresh();
  });
})();
