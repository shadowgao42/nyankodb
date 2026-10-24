/* Stage-index selectors; matching and ranking come from the ordinary search. */
(() => {
  "use strict";
  function mount({ root, catalog, data, reset = null, nameInput = null }) {
    const search = window.NyankoSearch;
    const categories = new Set(), enemies = new Map(), rewards = new Map();
    const categoryOrder = search.stageCategoryOrder;
    const groups = [
      ["main", "메인 챕터", "세계편", "마계편"],
      ["event", "이벤트 스테이지", "레전드 스토리", "EX 스테이지"],
      ["labyrinth", "지하 미궁", "지하 미궁", "지하 미궁"],
      ["dojo", "냥코 도장", "냥코도장 스테이지", "랭킹 스테이지"],
    ].map(([key, label, start, end]) => ({ key, label,
      members: categoryOrder.slice(categoryOrder.indexOf(start), categoryOrder.indexOf(end) + 1) }));
    const rewardIndex = new Map(data.rewards.map((entry, index) => [entry.key, index]));
    const rows = new Map(Object.entries(data.stages).map(([href, [enemyIds, rewardIds]]) => [href,
      { enemies: new Set(enemyIds), rewards: new Set(rewardIds) }]));
    const pickers = [];
    function syncReset() {
      if (reset) reset.disabled = !categories.size && !enemies.size && !rewards.size
        && !nameInput?.value.trim() && ![...root.querySelectorAll('input')].some(input => input.value.trim());
    }
    function changed() { syncReset(); root.dispatchEvent(new Event("stagefilterschange")); }
    const categoryButtons = root.querySelector("#stageCategoryFilters");
    for (const group of groups) {
      const button = document.createElement("button"); button.type = "button";
      button.className = "filter-chip text-chip"; button.textContent = group.label;
      button.dataset.category = group.key; button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (categories.has(group.key)) categories.delete(group.key); else categories.add(group.key);
        button.setAttribute("aria-pressed", String(categories.has(group.key))); changed();
      });
      categoryButtons.append(button);
    }
    function createPicker(prefix, entries, selected) {
      const input = root.querySelector(`#${prefix}Search`), list = root.querySelector(`#${prefix}Options`);
      const chips = root.querySelector(`#${prefix}Selected`), field = input.parentElement;
      const index = search.createIndex(entries);
      let visible = [], active = -1, pending = 0;
      function close() {
        if (pending) cancelAnimationFrame(pending); pending = 0;
        list.hidden = true; active = -1; input.setAttribute("aria-expanded", "false");
        input.removeAttribute("aria-activedescendant");
      }
      function choose(entry) {
        selected.set(entry.key, entry); input.value = ""; close(); renderChips(); changed(); input.focus({ preventScroll: true });
      }
      function renderChips() {
        chips.replaceChildren();
        for (const entry of selected.values()) {
          const button = document.createElement("button"); button.type = "button";
          button.className = "filter-chip stage-selected-chip";
          button.setAttribute("aria-label", `${entry.name} 제거`); button.dataset.key = entry.key;
          const name = document.createElement("span"); name.textContent = entry.name;
          const remove = document.createElement("span"); remove.textContent = "×"; remove.setAttribute("aria-hidden", "true");
          button.append(name, remove);
          button.addEventListener("click", () => {
            selected.delete(entry.key); renderChips(); changed(); input.focus({ preventScroll: true });
          });
          chips.append(button);
        }
      }
      function render() {
        if (pending) cancelAnimationFrame(pending); pending = 0;
        visible = index.searchResults(input.value, { all: true }).matches.filter(entry => !selected.has(entry.key)).slice(0, 200);
        list.replaceChildren(); close();
        if (!input.value.replace(/[\s\p{P}\p{S}_]/gu, "")) return;
        if (!visible.length) {
          const empty = document.createElement("div"); empty.className = "unit-search-empty";
          empty.textContent = "검색 결과가 없습니다."; list.append(empty);
        }
        for (const [position, entry] of visible.entries()) {
          const button = document.createElement("button"); button.type = "button"; button.tabIndex = -1;
          button.className = "unit-search-result"; button.id = `${prefix}Option${position}`;
          button.dataset.key = entry.key;
          button.setAttribute("role", "option"); button.setAttribute("aria-selected", "false");
          const iconBox = document.createElement("span"); iconBox.className = "stage-filter-icon";
          if (entry.icon) {
            const icon = document.createElement("img"); icon.src = `../${entry.icon}`; icon.alt = ""; icon.loading = "lazy"; iconBox.append(icon);
            if (entry.overlay) {
              const overlay = document.createElement("img"); overlay.src = `../${entry.overlay}`; overlay.alt = "";
              overlay.className = "stage-filter-overlay"; iconBox.append(overlay);
            }
          } else iconBox.classList.add("unit-search-result-icon-empty");
          const copy = document.createElement("span"); copy.className = "unit-search-result-copy";
          const name = document.createElement("span"); name.className = "unit-search-result-name"; name.textContent = entry.name;
          const identity = document.createElement("span"); identity.className = "unit-search-result-identity";
          identity.textContent = entry.identity || search.identity(entry); copy.append(name, identity); button.append(iconBox, copy);
          let start = null, suppress = false;
          button.addEventListener("pointerdown", event => {
            suppress = false; start = event.pointerType === "mouse" ? null : { id: event.pointerId, x: event.clientX, y: event.clientY };
          });
          button.addEventListener("pointermove", event => {
            if (start && event.pointerId === start.id && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) suppress = true;
          });
          button.addEventListener("pointercancel", () => { start = null; suppress = true; });
          button.addEventListener("mousedown", event => event.preventDefault());
          button.addEventListener("click", () => {
            if (!suppress) choose(entry); start = null; suppress = false;
          });
          list.append(button);
        }
        list.hidden = false; input.setAttribute("aria-expanded", "true");
      }
      function schedule() { if (pending) cancelAnimationFrame(pending); pending = requestAnimationFrame(render); }
      input.addEventListener("input", schedule); input.addEventListener("input", syncReset); input.addEventListener("compositionend", schedule);
      input.addEventListener("focus", () => { if (input.value) schedule(); });
      input.addEventListener("keydown", event => {
        if (event.isComposing || event.keyCode === 229) return;
        if (event.key === "Escape") { if (pending) cancelAnimationFrame(pending); pending = 0; close(); return; }
        if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
        if (pending) render();
        if (event.key === "Enter") {
          if (!list.hidden && visible.length) { event.preventDefault(); choose(visible[active < 0 ? 0 : active]); } return;
        }
        if (!visible.length) return;
        event.preventDefault(); list.hidden = false; input.setAttribute("aria-expanded", "true");
        active = active < 0 ? (event.key === "ArrowDown" ? 0 : visible.length - 1)
          : (active + (event.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length;
        [...list.querySelectorAll('[role="option"]')].forEach((option, position) => {
          option.setAttribute("aria-selected", String(position === active));
          if (position === active) { input.setAttribute("aria-activedescendant", option.id); option.scrollIntoView({ block: "nearest" }); }
        });
      });
      field.addEventListener("focusout", event => { if (!field.contains(event.relatedTarget)) close(); });
      document.addEventListener("pointerdown", event => { if (!field.contains(event.target)) close(); });
      pickers.push(() => { input.value = ""; close(); visible = []; list.replaceChildren(); renderChips(); });
    }
    createPicker("stageEnemy", catalog.entries.filter(entry => entry.kind === "enemy").map(entry => ({ ...entry, key: String(entry.id) })), enemies);
    createPicker("stageReward", data.rewards, rewards);
    nameInput?.addEventListener("input", syncReset);
    nameInput?.addEventListener("keydown", event => {
      if (event.key === "Escape" && !event.isComposing && event.keyCode !== 229) requestAnimationFrame(syncReset);
    });
    reset?.addEventListener("click", () => {
      categories.clear(); enemies.clear(); rewards.clear();
      if (nameInput) nameInput.value = "";
      categoryButtons.querySelectorAll('button').forEach(button => button.setAttribute("aria-pressed", "false"));
      pickers.forEach(clear => clear()); changed();
    });
    syncReset();
    function getFilter() {
      if (!categories.size && !enemies.size && !rewards.size) return null;
      const allowedCategories = new Set(groups.filter(group => categories.has(group.key)).flatMap(group => group.members));
      const enemyIds = [...enemies.values()].map(entry => Number(entry.id));
      const rewardIds = [...rewards.keys()].map(key => rewardIndex.get(key));
      return { key: JSON.stringify([[...categories].sort(), [...enemies.keys()].sort(), [...rewards.keys()].sort()]),
        expandMatches: Boolean(enemies.size || rewards.size),
        expansionKey: JSON.stringify([[...enemies.keys()].sort(), [...rewards.keys()].sort()]),
        accepts(entry) {
          const locationId = String(entry.locationHref || entry.href).split("/")[1];
          if (categories.size && !allowedCategories.has(search.stageCategoryForLocation(locationId))) return false;
          const row = rows.get(entry.href);
          return Boolean(row && enemyIds.every(id => row.enemies.has(id)) && rewardIds.every(id => row.rewards.has(id)));
        } };
    }
    return { getFilter };
  }
  window.NyankoStageFilters = Object.freeze({ mount });
})();
