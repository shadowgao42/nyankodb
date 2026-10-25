/* Stage-index selectors; matching and ranking come from the ordinary search. */
(() => {
  "use strict";
  function mount({ root, catalog, data, reset = null, nameInput = null }) {
    const search = window.NyankoSearch;
    const categories = new Set(), difficulties = new Set(), enemies = new Map(), rewards = new Map();
    const selectedSpecials = new Set();
    // Only the Special Stage locations explicitly listed by the user.
    const specialLocations = {
  "monthly": [
    "S011",
    "S012",
    "S013",
    "S026",
    "S029",
    "S030",
    "S031",
    "S032",
    "S036",
    "S038",
    "S009",
    "S010",
    "S184",
    "S186",
    "S192",
    "S194",
    "S197",
    "S165",
    "S166",
    "S167",
    "S168",
    "S170",
    "S171",
    "S175",
    "S234",
    "S235",
    "S236",
    "S237"
  ],
  "cyclone": [
    "S014",
    "S096",
    "S122",
    "S015",
    "S066",
    "S016",
    "S259",
    "S039",
    "S043",
    "S157",
    "S189",
    "S169",
    "S195",
    "S198",
    "S172",
    "S193",
    "S176",
    "S185",
    "S342",
    "S187",
    "S203",
    "S247",
    "S111",
    "S112",
    "S114"
  ],
  "advent": [
    "S119",
    "S128",
    "S158",
    "S095",
    "S177",
    "S117",
    "S201",
    "S205",
    "S207",
    "S196",
    "S214",
    "S199",
    "S215",
    "S217",
    "S219",
    "S220",
    "S226",
    "S229",
    "S231",
    "S232",
    "S246",
    "S272",
    "S273",
    "S243",
    "S296",
    "S338",
    "S375",
    "S381",
    "S383",
    "S393",
    "S404",
    "S433",
    "S340",
    "S348",
    "S391",
    "S406",
    "S421",
    "S251",
    "S253",
    "S307",
    "S252",
    "S305",
    "S306",
    "S377",
    "S378",
    "S379"
  ],
  "crazed": [
    "S017",
    "S018",
    "S019",
    "S020",
    "S021",
    "S022",
    "S023",
    "S024",
    "S025",
    "S161",
    "S102",
    "S103",
    "S104",
    "S105",
    "S106",
    "S107",
    "S108",
    "S109",
    "S110",
    "S208"
  ],
  "awakening": [
    "S045",
    "S055",
    "S053",
    "S057",
    "S050",
    "S046",
    "S047",
    "S048",
    "S049",
    "S051",
    "S052",
    "S054",
    "S056",
    "S058",
    "S083",
    "S084",
    "S085",
    "S086",
    "S087",
    "S088",
    "S089",
    "S090",
    "S091",
    "S092",
    "S093",
    "S094",
    "S148",
    "S144",
    "S143",
    "S384",
    "S130",
    "S131",
    "S132",
    "S133",
    "S134",
    "S135",
    "S136",
    "S137",
    "S138",
    "S339",
    "S394",
    "S395",
    "S350",
    "S351",
    "S352",
    "S353",
    "S354",
    "S355",
    "S356",
    "S357",
    "S358",
    "S376"
  ]
};
    const specialStageHrefs = new Map(Object.entries(specialLocations).map(([key, ids]) => {
      const locations = new Set(ids);
      return [key, new Set(catalog.entries.filter(entry => entry.kind === "stage"
        && /^stage\/S\d{3}\/(?!index\.html$)[^/]+\.html$/.test(entry.href || "")
        && locations.has(String(entry.href).split("/")[1])).map(entry => entry.href))];
    }));
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
      { enemies: new Set(enemyIds), rewards: new Set(rewardIds), difficulties: new Set(data.difficulties?.[href] || []) }]));
    const pickers = [];
    function syncReset() {
      if (reset) reset.disabled = !categories.size && !difficulties.size && !enemies.size && !rewards.size && !selectedSpecials.size
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
    const specialButtons = new Map(Object.keys(specialLocations).map(key =>
      [key, root.querySelector(`[data-special-category="${key}"]`)]));
    for (const [key, button] of specialButtons) {
      button?.setAttribute("aria-pressed", "false");
      button?.addEventListener("click", () => {
        if (selectedSpecials.has(key)) selectedSpecials.delete(key); else selectedSpecials.add(key);
        button.setAttribute("aria-pressed", String(selectedSpecials.has(key))); changed();
      });
    }
    const difficultyRows = [];
    const difficultyValues = [...new Set(Object.values(data.difficulties || {}).flat())].sort((a, b) => Number(a) - Number(b));
    function syncDifficultyButtons() {
      for (const { whole, all, buttons, values } of difficultyRows) {
        const selected = values.filter(value => difficulties.has(value)).length;
        all.setAttribute("aria-pressed", selected === values.length ? "true" : selected ? "mixed" : "false");
        all.setAttribute("aria-label", `별 ${whole} 전체 ${selected === values.length ? "해제" : "선택"}`);
        for (const [value, button] of buttons) button.setAttribute("aria-pressed", String(difficulties.has(value)));
      }
    }
    for (let whole = 1; whole <= 12; whole++) {
      const values = difficultyValues.filter(value => Math.floor(Number(value)) === whole);
      if (!values.length) continue;
      const row = document.createElement("div"); row.className = "filter-chip-list stage-difficulty-row";
      row.dataset.difficultyGroup = String(whole); row.setAttribute("role", "group"); row.setAttribute("aria-label", `별 ${whole} 난이도`);
      const all = document.createElement("button"); all.type = "button"; all.className = "filter-chip text-chip stage-difficulty-all";
      all.textContent = `⭐${whole}`; all.setAttribute("aria-pressed", "false");
      all.addEventListener("click", () => {
        const selected = values.every(value => difficulties.has(value));
        for (const value of values) { if (selected) difficulties.delete(value); else difficulties.add(value); }
        syncDifficultyButtons(); changed();
      });
      row.append(all); const buttons = new Map();
      for (const value of values) {
        const button = document.createElement("button"); button.type = "button"; button.className = "filter-chip text-chip";
        button.textContent = value.includes(".") ? value.slice(value.indexOf(".")) : ".0";
        button.setAttribute("aria-label", `별 ${value}`); button.dataset.difficulty = value; button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          if (difficulties.has(value)) difficulties.delete(value); else difficulties.add(value);
          syncDifficultyButtons(); changed();
        }); row.append(button); buttons.set(value, button);
      }
      difficultyRows.push({ whole, row, all, buttons, values }); root.querySelector("#stageDifficultyFilters").append(row);
    }
    syncDifficultyButtons();
    function createPicker(prefix, entries, selected, orderMatches = matches => matches) {
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
        visible = orderMatches(index.searchResults(input.value, { all: true }).matches.filter(entry => !selected.has(entry.key))).slice(0, 200);
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
    function orderTreasureMatches(matches) {
      const grades = new Map([["조잡한", 0], ["평범한", 1], ["최고급", 2]]);
      const grade = entry => entry.key.startsWith("treasure:") ? grades.get(entry.name.split(" ", 1)[0]) : undefined;
      const treasures = matches.filter(entry => grade(entry) !== undefined).sort((a, b) => grade(a) - grade(b));
      let position = 0;
      return matches.map(entry => grade(entry) === undefined ? entry : treasures[position++]);
    }
    createPicker("stageReward", data.rewards, rewards, orderTreasureMatches);
    nameInput?.addEventListener("input", syncReset);
    nameInput?.addEventListener("keydown", event => {
      if (event.key === "Escape" && !event.isComposing && event.keyCode !== 229) requestAnimationFrame(syncReset);
    });
    reset?.addEventListener("click", () => {
      categories.clear(); difficulties.clear(); enemies.clear(); rewards.clear();
      selectedSpecials.clear();
      for (const button of specialButtons.values()) button?.setAttribute("aria-pressed", "false");
      if (nameInput) nameInput.value = "";
      categoryButtons.querySelectorAll('button').forEach(button => button.setAttribute("aria-pressed", "false"));
      syncDifficultyButtons();
      pickers.forEach(clear => clear()); changed();
    });
    syncReset();
    function getFilter() {
      if (!categories.size && !difficulties.size && !enemies.size && !rewards.size && !selectedSpecials.size) return null;
      const allowedCategories = new Set(groups.filter(group => categories.has(group.key)).flatMap(group => group.members));
      const enemyIds = [...enemies.values()].map(entry => Number(entry.id));
      const rewardIds = [...rewards.keys()].map(key => rewardIndex.get(key));
      const selectedDifficulties = [...difficulties];
      const specialKeys = [...selectedSpecials].sort();
      return { key: JSON.stringify([[...categories].sort(), [...difficulties].sort(), [...enemies.keys()].sort(), [...rewards.keys()].sort(), specialKeys]),
        expandMatches: Boolean(enemies.size || rewards.size || specialKeys.length),
        showAllMatches: Boolean(specialKeys.length),
        expansionKey: JSON.stringify([[...enemies.keys()].sort(), [...rewards.keys()].sort(), specialKeys]),
        accepts(entry) {
          if (specialKeys.length && !specialKeys.some(key => specialStageHrefs.get(key).has(entry.href))) return false;
          const locationId = String(entry.locationHref || entry.href).split("/")[1];
          if (categories.size && !allowedCategories.has(search.stageCategoryForLocation(locationId))) return false;
          const row = rows.get(entry.href);
          return Boolean(row && (!difficulties.size || selectedDifficulties.some(value => row.difficulties.has(value)))
            && enemyIds.every(id => row.enemies.has(id)) && rewardIds.every(id => row.rewards.has(id)));
        } };
    }
    return { getFilter };
  }
  window.NyankoStageFilters = Object.freeze({ mount });
})();
