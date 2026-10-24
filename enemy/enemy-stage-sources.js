/* The appearance list is the stage index restricted to its verified stage URLs. */
(() => {
  "use strict";
  function initialize() {
    if (!document.getElementById("enemyStagesPanel")) return;
    const data = JSON.parse(document.getElementById("enemyStageSourcesData").textContent);
    window.NyankoStageList.mount({
      catalog: window.NYANKODB_SEARCH_CATALOG,
      results: document.getElementById("enemyStagesList"),
      status: document.getElementById("enemyStagesCount"),
      scroll: document.getElementById("enemyStagesScroll"),
      allowedStageHrefs: data.stages.map(stage => stage.href),
      idPrefix: "enemyAppearance",
    });
  }
  if (document.readyState !== "complete") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
