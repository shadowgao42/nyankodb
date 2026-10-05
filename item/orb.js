(() => {
  "use strict";
  const catalog = window.NYANKODB_ORB_CATALOG;
  const attributeSelect = document.getElementById("orbAttribute");
  const effectSelect = document.getElementById("orbEffect");
  const gradeSelect = document.getElementById("orbGrade");
  const preview = document.getElementById("orbPreview");
  const name = document.getElementById("itemName");
  const identity = document.getElementById("itemIdentity");
  const description = document.getElementById("itemDescription");
  const summary = document.getElementById("orbSummary");
  const notice = document.getElementById("orbSelectionNotice");
  const attributes = new Map(catalog.attributes.map(row => [row.id, row]));
  const effects = new Map(catalog.contents.map(row => [row.id, row]));
  const grades = new Map(catalog.grades.map(row => [row.id, row]));
  const records = new Map(catalog.items.map(row => [row.id + 30000, row]));
  const state = { attribute: "", effect: "", grade: "" };

      function formatOrbNumber(value) {
      return String(Number(Number(value).toFixed(3)));
    }

    function describeOrb(record) {
      const firstValue = Number(record.values[0]) || 0;
      const secondValue = Number(record.values[1]) || 0;
      switch (record.contentId) {
        case 0:
          return `기본 공격력 +${formatOrbNumber(firstValue / 100)}×`;
        case 1:
          return `받는 피해 ${formatOrbNumber(firstValue)}% 경감`;
        case 2:
          return (
            `주는 피해 +${formatOrbNumber(firstValue / 1000)}×`
            + ` · 받는 피해 ${formatOrbNumber(secondValue)}% 추가 경감`
          );
        case 3:
          return `주는 피해 +${formatOrbNumber(firstValue / 300)}×`;
        case 4:
          return `받는 피해 ${formatOrbNumber(firstValue)}% 추가 경감`;
        case 5:
          return (
            "2회마다 사망 시 소열파"
            + ` · 확률 ${formatOrbNumber(firstValue)}%`
            + " · Lv.1 · 생성 200~500 · 주는 피해 20%"
          );
        case 6:
          return `파동 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        case 7:
          return (
            "2회마다 사망 시 "
            + `생산 코스트 ${formatOrbNumber(firstValue)}% 환급`
          );
        case 8:
          return `날려버린다 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 9:
          return (
            "레전드 스토리에서 "
            + `체력 +${formatOrbNumber(firstValue)}%`
            + ` · 공격력 +${formatOrbNumber(secondValue)}%`
          );
        case 10:
          return (
            "2회마다 초생명체에게 "
            + `주는 피해 ${formatOrbNumber(firstValue / 100)}×`
            + ` · 받는 피해 ${formatOrbNumber(secondValue / 100)}×`
          );
        case 11:
          return (
            "2회마다 사망 시 "
            + `냥코 대포 ${formatOrbNumber(firstValue)}% 충전`
          );
        case 12:
          return `독 공격 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        case 13:
          return (
            "2회마다 전 공격 무효 "
            + `(확률 ${formatOrbNumber(firstValue)}% · `
            + `${formatOrbNumber(secondValue / 30)}초)`
          );
        case 14:
          return `느리게 한다 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 15:
          return `고대의 저주 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 16:
          return (
            "신 레전드 스토리에서 "
            + `체력 +${formatOrbNumber(firstValue)}%`
            + ` · 공격력 +${formatOrbNumber(secondValue)}%`
          );
        case 17:
          return (
            "2회마다 1회 열파 카운터"
            + ` · 주는 피해 ${formatOrbNumber(firstValue)}%`
          );
        case 18:
          return (
            "10마리 격파 시 "
            + `공격력 +${formatOrbNumber(firstValue)}%`
          );
        case 19:
          return `2회마다 생산 시간 ${formatOrbNumber(firstValue)}% 단축`;
        case 20:
          return `멈춘다 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 21:
          return `공격력 다운 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 22:
          return `2회마다 생산 코스트 ${formatOrbNumber(firstValue)}% 할인`;
        case 23:
          return `열파 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        case 24:
          return `2회마다 첫 격파 시 머니 +${formatOrbNumber(firstValue)}%`;
        case 25:
          return `폭파 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        default:
          return "";
      }
    }

  function options(select, rows, selected, placeholder, disabled = false) {
    select.replaceChildren();
    select.append(new Option(placeholder, ""));
    rows.forEach(row => select.append(new Option(row.label, String(row.id))));
    select.value = rows.some(row => String(row.id) === selected) ? selected : "";
    select.disabled = disabled;
    return select.value;
  }

  function selectionRecord() {
    if ([state.attribute, state.effect, state.grade].includes("")) return null;
    return catalog.items.find(row =>
      row.attributeId === Number(state.attribute)
      && row.contentId === Number(state.effect)
      && row.gradeId === Number(state.grade)) || null;
  }

  function renderSelection(updateUrl = false) {
    state.attribute = options(attributeSelect, catalog.attributes, state.attribute, "속성 선택");
    const attributeRecords = state.attribute === "" ? []
      : catalog.items.filter(row => row.attributeId === Number(state.attribute));
    const contentOptions = catalog.contents.filter(content =>
      attributeRecords.some(row => row.contentId === content.id));
    state.effect = options(effectSelect, contentOptions, state.effect, "효과/능력 선택", state.attribute === "");
    const gradeRecords = state.effect === "" ? []
      : attributeRecords.filter(row => row.contentId === Number(state.effect));
    const gradeOptions = catalog.grades.filter(grade => gradeRecords.some(row => row.gradeId === grade.id));
    state.grade = options(gradeSelect, gradeOptions, state.grade, "등급 선택", state.effect === "");

    const attribute = attributes.get(Number(state.attribute));
    const effect = effects.get(Number(state.effect));
    const grade = grades.get(Number(state.grade));
    const record = selectionRecord();
    let placeholderIndex = 0;
    const title = record ? effect.nameTemplate.replace(/%@/g,
      () => [grade.label, attribute.shortLabel][placeholderIndex++]) : "본능 구슬";
    name.textContent = title;
    identity.textContent = record ? `ITEM ${record.id + 30000}` : "본능 구슬";
    description.textContent = state.effect === "" ? ""
      : effect.description.replaceAll("%@", attribute.label);
    summary.textContent = record ? describeOrb(record) : "속성, 효과/능력, 등급을 선택하세요.";
    document.title = `${title} · 냥코DB`;
    preview.setAttribute("aria-label", title);
    preview.replaceChildren();
    for (const [value, selected, className] of [
      [attribute, state.attribute, "orb-attribute-layer"],
      [effect, state.effect, "orb-effect-layer"],
      [grade, state.grade, "orb-grade-layer"],
    ]) {
      if (selected === "" || !value?.icon) continue;
      const image = document.createElement("img");
      image.src = value.icon;
      image.alt = "";
      image.className = className;
      preview.append(image);
    }
    if (updateUrl) {
      const url = new URL(location.href);
      for (const key of ["orb", "attribute", "effect", "grade"]) url.searchParams.delete(key);
      if (record) url.searchParams.set("orb", String(record.id + 30000));
      else for (const key of ["attribute", "effect", "grade"])
        if (state[key] !== "") url.searchParams.set(key, state[key]);
      history.replaceState(null, "", url);
    }
  }

  function restoreSelection() {
    const params = new URLSearchParams(location.search);
    state.attribute = state.effect = state.grade = "";
    notice.hidden = true;
    if (params.has("orb")) {
      const raw = params.get("orb");
      const record = /^\d+$/.test(raw) ? records.get(Number(raw)) : null;
      if (record) {
        state.attribute = String(record.attributeId);
        state.effect = String(record.contentId);
        state.grade = String(record.gradeId);
      } else {
        notice.textContent = "존재하지 않는 본능 구슬입니다. 설정을 다시 선택해주세요.";
        notice.hidden = false;
      }
    } else if (["attribute", "effect", "grade"].some(key => params.has(key))) {
      for (const key of ["attribute", "effect", "grade"]) state[key] = params.get(key) || "";
    } else {
      const first = catalog.items[0];
      state.attribute = String(first.attributeId);
      state.effect = String(first.contentId);
      state.grade = String(first.gradeId);
    }
    renderSelection();
  }

  for (const [select, key] of [[attributeSelect, "attribute"], [effectSelect, "effect"], [gradeSelect, "grade"]]) {
    select.addEventListener("change", () => {
      state[key] = select.value;
      notice.hidden = true;
      renderSelection(true);
    });
  }
  window.addEventListener("popstate", restoreSelection);
  restoreSelection();
})();
