/* Filter DOM, predicates and controls copied from unit/index.html (2026-11-04).
 * Scoped to the MyPage picker; all forms are filtered before ID deduplication. */
(() => {
  'use strict';
  window.NyankoUnitPickerFilters={mount(root,nameSearch,onChange){
    root.classList.add('unit-picker-filters');
    root.innerHTML="<section class=\"filter-panel is-collapsed\" aria-labelledby=\"pickerfilterTitle\">\n      <div class=\"section-heading\">\n        <h2 id=\"pickerfilterTitle\">검색 필터</h2>\n        <div class=\"filter-actions\">\n          <div class=\"filter-logic\" role=\"group\" aria-label=\"필터 조건 결합\">\n            <span>조건</span>\n            <button class=\"logic-button\" type=\"button\" data-filter-logic=\"or\" aria-pressed=\"true\">OR</button>\n            <button class=\"logic-button\" type=\"button\" data-filter-logic=\"and\" aria-pressed=\"false\">AND</button>\n          </div>\n          <label class=\"talent-toggle\">\n            <span>본능/초본능 포함</span>\n            <input id=\"pickerincludeTalents\" type=\"checkbox\">\n            <span class=\"talent-check\" aria-hidden=\"true\">✓</span>\n          </label>\n          <button class=\"reset-button\" id=\"pickerresetFilters\" type=\"button\" disabled>초기화</button>\n          <button class=\"filter-collapse\" id=\"pickerfilterCollapse\" type=\"button\" aria-expanded=\"false\" aria-controls=\"pickerfilterBody\">\n            <span id=\"pickerfilterCollapseText\">펼치기</span><span class=\"filter-collapse-arrow\" aria-hidden=\"true\">▾</span>\n          </button>\n        </div>\n      </div>\n      <div class=\"filter-body\" id=\"pickerfilterBody\">\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\">레어도</h3>\n          <div class=\"filter-chip-list\" id=\"pickerrarityFilters\"></div>\n        </div>\n        <div class=\"filter-group\">\n          <h3 class=\"filter-label\">타겟</h3>\n          <div class=\"filter-chip-list\" id=\"pickertraitFilters\"></div>\n        </div>\n        <div class=\"filter-group ability-filter-group\">\n          <h3 class=\"filter-label\">효과/능력</h3>\n          <div class=\"ability-filter-sections\">\n            <section class=\"ability-filter-section\">\n              <h4 class=\"ability-filter-title\">효과</h4>\n              <div class=\"filter-chip-list\" id=\"pickereffectFilters\"></div>\n            </section>\n            <section class=\"ability-filter-section\">\n              <h4 class=\"ability-filter-title\">능력</h4>\n              <div class=\"filter-chip-list\" id=\"pickerabilityFilters\"></div>\n            </section>\n            <section class=\"ability-filter-section\">\n              <h4 class=\"ability-filter-title\">무효</h4>\n              <div class=\"filter-chip-list\" id=\"pickerimmunityFilters\"></div>\n            </section>\n            <section class=\"ability-filter-section\">\n              <h4 class=\"ability-filter-title\">내성</h4>\n              <div class=\"filter-chip-list\" id=\"pickerresistanceFilters\"></div>\n            </section>\n            <section class=\"ability-filter-section\">\n              <h4 class=\"ability-filter-title\">공격 타입</h4>\n              <div class=\"filter-chip-list\" id=\"pickerattackFilters\"></div>\n            </section>\n          </div>\n        </div>\n      </div>\n    </section>";
    const catalog=window.NYANKODB_UNIT_CATALOG;
    const $=id=>root.querySelector('#picker'+id);
    const elements={nameSearch,reset:$('resetFilters'),includeTalents:$('includeTalents'),logicButtons:[...root.querySelectorAll('[data-filter-logic]')],filterPanel:root.querySelector('.filter-panel'),filterBody:$('filterBody'),filterCollapse:$('filterCollapse'),filterCollapseText:$('filterCollapseText')};
    const groupTargets=Object.fromEntries(['rarity','trait','effect','ability','immunity','resistance','attack'].map(group=>[group,$(group+'Filters')]));
    const selected=Object.fromEntries(Object.keys(groupTargets).map(group=>[group,new Set()]));
    let filterLogic='or';
    const abilityIconOverrides={drain_immune:'../img/i/391.png'};
      function asList(value) {
        if (Array.isArray(value)) return value;
        if (value && typeof value === "object") return Object.values(value);
        return [];
      }

      function normalizeMetaItem(item, fallbackKey = "") {
        if (typeof item === "string" || typeof item === "number") {
          const text = String(item);
          return { key: text, label: text, icon: "" };
        }
        const value = item && typeof item === "object" ? item : {};
        const key = String(
          value.key ?? value.id ?? value.value ?? value.label_ko ?? value.label ?? fallbackKey,
        );
        return {
          ...value,
          key,
          label: String(value.label_ko ?? value.label ?? value.name ?? key),
          icon: abilityIconOverrides[key] ?? (typeof value.icon === "string" ? value.icon : ""),
        };
      }

      function normalizeMetaCollection(value) {
        if (Array.isArray(value)) {
          return value.map((item, index) => normalizeMetaItem(item, String(index)));
        }
        if (value && typeof value === "object") {
          return Object.entries(value).map(([key, item]) => {
            if (typeof item === "string" || typeof item === "number") {
              return { key: String(key), label: String(item), icon: "" };
            }
            return normalizeMetaItem(item, key);
          });
        }
        return [];
      }

      function abilitySections(meta) {
        const result = {
          effect: [],
          ability: [],
          immunity: [],
          resistance: [],
          attack: [],
        };
        const effectKeys = new Set([
          "weaken", "freeze", "slow", "attack_only", "strong", "resistant",
          "insanely_tough", "massive_damage", "insane_damage", "knockback",
          "warp", "curse", "dodge",
        ]);
        const excludedKeys = new Set(["villain_slayer"]);
        const source = meta?.abilities;
        if (Array.isArray(source)) {
          source.forEach((item, index) => {
            const normalized = normalizeMetaItem(item, String(index));
            if (excludedKeys.has(normalized.key)) return;
            const declaredSection = String(item?.section || "ability");
            const section = declaredSection === "ability" && effectKeys.has(normalized.key)
              ? "effect"
              : declaredSection;
            (result[section] || result.ability).push(normalized);
          });
          return result;
        }
        Object.keys(result).forEach((section) => {
          result[section] = normalizeMetaCollection(source?.[section]);
        });
        result.effect = result.ability.filter((item) => effectKeys.has(item.key));
        result.ability = result.ability.filter((item) => !effectKeys.has(item.key));
        result.ability = result.ability.filter((item) => !excludedKeys.has(item.key));
        return result;
      }

      function resolveAssetPath(path) {
        if (!path || typeof path !== "string") return "";
        if (/^(?:data:|https?:|blob:)/i.test(path)) {
          return path;
        }
        const normalized = path.replace(/^\/+/, "");
        if (normalized.startsWith("img/")) {
          return new URL(`../${normalized}`, window.location.href).href;
        }
        return new URL(path, window.location.href).href;
      }

      function entryKeys(value) {
        return new Set(asList(value).map((item) => String(
          typeof item === "object" && item !== null ? item.key ?? item.id ?? "" : item,
        )).filter(Boolean));
      }

      function compactSearchText(value) {
        return String(value || "")
          .toLocaleLowerCase("ko-KR")
          .replace(/[\s\p{P}\p{S}_]/gu, "");
      }

      function orderedSubsequenceMatch(name, query) {
        let cursor = 0;
        for (const character of query) {
          const position = name.indexOf(character, cursor);
          if (position < 0) return false;
          cursor = position + character.length;
        }
        return true;
      }

      function containsAllLetters(name, query) {
        const counts = new Map();
        for (const character of name) {
          counts.set(character, (counts.get(character) || 0) + 1);
        }
        for (const character of query) {
          const count = counts.get(character) || 0;
          if (count < 1) return false;
          counts.set(character, count - 1);
        }
        return true;
      }

      function searchRank(name, query, id) {
        if (!query) return 0;
        const idText = String(id);
        const paddedId = idText.padStart(3, "0");
        if (query === idText || query === paddedId) return 0;
        if (name === query) return 0;
        if (/^\d+$/.test(query) && (idText.startsWith(query) || paddedId.startsWith(query))) return 1;
        if (name.includes(query)) return 1;
        if (orderedSubsequenceMatch(name, query)) return 2;
        if (containsAllLetters(name, query)) return 3;
        return null;
      }

      function createFilterChip(item, group, iconMode) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `filter-chip ${iconMode ? "icon-chip" : "text-chip"}`;
        button.dataset.filterGroup = group;
        button.dataset.filterKey = item.key;
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", item.label);
        if (iconMode) {
          button.dataset.tooltip = item.label;
          if (item.icon) {
            const image = document.createElement("img");
            image.src = resolveAssetPath(item.icon);
            image.alt = "";
            image.width = 46;
            image.height = 46;
            button.append(image);
          } else {
            const fallback = document.createElement("span");
            fallback.className = "icon-fallback";
            const fixedFallbacks = {
              multi_hit: "연",
              limited_attacks: "1회",
              timed_life: "시",
              boss_wave_immune: "보",
              explosion_resist: "폭",
            };
            fallback.textContent = fixedFallbacks[item.key]
              || (item.label.length > 5 ? item.label.slice(0, 4) : item.label);
            button.append(fallback);
          }
        } else {
          button.textContent = item.label;
        }
        return button;
      }

      function renderFilterGroup(items, group, iconMode = true) {
        const target = groupTargets[group];
        const fragment = document.createDocumentFragment();
        const renderedItems = group === "rarity"
          ? items.map((item, index) => ({ ...item, icon: `img/i/${153 + index}.png` }))
          : items;
        renderedItems.forEach((item) => fragment.append(createFilterChip(item, group, iconMode)));
        target.replaceChildren(fragment);
      }

      function rarityKey(entry, rarities) {
        const raw = String(entry.rarity ?? "");
        const match = rarities.find((item) => (
          item.key === raw || item.label === raw || String(item.id ?? "") === raw
        ));
        return match?.key || raw;
      }

      function categoryMatches(entryKeysSet, selectedKeys, logic = filterLogic) {
        if (!selectedKeys.size) return true;
        const matches = [...selectedKeys].map((key) => entryKeysSet.has(key));
        return logic === "and" ? matches.every(Boolean) : matches.some(Boolean);
      }

      function hasActiveFilters() {
        return elements.nameSearch.value.trim() !== ""
          || elements.includeTalents.checked
          || Object.values(selected).some((values) => values.size > 0);
      }

      function syncResetButton() {
        elements.reset.disabled = !hasActiveFilters();
      }

      function syncFilterLogic() {
        elements.logicButtons.forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.filterLogic === filterLogic));
        });
      }

      function syncFilterCollapse() {
        const collapsed = elements.filterPanel.classList.contains("is-collapsed");
        elements.filterBody.hidden = collapsed;
        elements.filterCollapse.setAttribute("aria-expanded", String(!collapsed));
        elements.filterCollapseText.textContent = collapsed ? "펼치기" : "접기";
      }

      function filterEntries(entries, rarities) {
        const query = compactSearchText(elements.nameSearch.value);
        const includeTalents = elements.includeTalents.checked;

        return entries
          .map((entry) => {
            const rank = searchRank(compactSearchText(entry.name), query, entry.id);
            if (rank === null) return null;

            const traits = entryKeys(entry.traits);
            const abilities = entryKeys(entry.abilities);
            if (includeTalents) {
              entryKeys(entry.maxTraits).forEach((key) => traits.add(key));
              entryKeys(entry.maxAbilities).forEach((key) => abilities.add(key));
            }

            const effectAbilitySelections = new Set([
              ...selected.effect,
              ...selected.ability,
              ...selected.immunity,
              ...selected.resistance,
              ...selected.attack,
            ]);
            const conditions = [
              {
                active: selected.rarity.size > 0,
                matches: categoryMatches(
                  new Set([rarityKey(entry, rarities)]), selected.rarity, "or",
                ),
              },
              { active: selected.trait.size > 0, matches: categoryMatches(traits, selected.trait) },
              { active: effectAbilitySelections.size > 0, matches: categoryMatches(abilities, effectAbilitySelections) },
            ].filter((condition) => condition.active);
            if (conditions.length && !conditions.every((condition) => condition.matches)) return null;
            const displayEntry = entry;
            return { entry: displayEntry, rank };
          })
          .filter(Boolean)
          .sort((left, right) => (
            left.rank - right.rank
            || Number(left.entry.id) - Number(right.entry.id)
            || Number(left.entry.form) - Number(right.entry.form)
          ))
          .map(({ entry }) => entry);
      }
      const meta = catalog.meta || catalog;
      const rarities = normalizeMetaCollection(meta.rarities);
      const traits = normalizeMetaCollection(meta.traits);
      const sections = abilitySections(meta);
      const entries = catalog.entries.map((entry) => ({
        ...entry,
        id: Number(entry.id),
        form: Number(entry.form) || 1,
        name: String(entry.name || `Unit ${entry.id}-${entry.form}`),
      }));

      renderFilterGroup(rarities, "rarity");
      renderFilterGroup(traits.filter((trait) => !["witch", "eva"].includes(trait.key)), "trait");
      renderFilterGroup(sections.effect, "effect");
      renderFilterGroup(sections.ability, "ability");
      renderFilterGroup(sections.immunity, "immunity");
      renderFilterGroup(sections.resistance, "resistance");
      renderFilterGroup(sections.attack
        .filter((item) => item.key !== "timed_life")
        .map((item) => (item.key === "limited_attacks" ? { ...item, label: "1회 공격" } : item)), "attack");


    function updateResults(){syncResetButton();onChange(filterEntries(entries,rarities));}
      root.querySelector(".filter-body").addEventListener("click", (event) => {
        const button = event.target.closest(".filter-chip");
        if (!button) return;
        const group = button.dataset.filterGroup;
        const key = button.dataset.filterKey;
        if (!selected[group] || !key) return;
        if (selected[group].has(key)) selected[group].delete(key);
        else selected[group].add(key);
        button.setAttribute("aria-pressed", String(selected[group].has(key)));
        updateResults({ resetScroll: true });
      });

      elements.logicButtons.forEach((button) => {
        button.addEventListener("click", () => {
          filterLogic = button.dataset.filterLogic === "or" ? "or" : "and";
          syncFilterLogic();
          updateResults({ resetScroll: true });
        });
      });


      elements.filterCollapse.addEventListener("click", () => {
        elements.filterPanel.classList.toggle("is-collapsed");
        syncFilterCollapse();
      });

      elements.nameSearch.addEventListener("input", () => {
        updateResults({ resetScroll: true });
      });
      elements.nameSearch.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !elements.nameSearch.value) return;
        elements.nameSearch.value = "";
        updateResults({ resetScroll: true });
      });
      elements.includeTalents.addEventListener("change", () => {
        updateResults({ resetScroll: true });
      });

      elements.reset.addEventListener("click", () => {
        elements.nameSearch.value = "";
        elements.includeTalents.checked = false;
        filterLogic = "or";
        syncFilterLogic();
        Object.values(selected).forEach((values) => values.clear());
        root.querySelectorAll(".filter-chip[aria-pressed=\"true\"]")
          .forEach((button) => button.setAttribute("aria-pressed", "false"));
        updateResults({ resetScroll: true });
      });


    syncFilterLogic();syncFilterCollapse();updateResults();
  }};
})();
