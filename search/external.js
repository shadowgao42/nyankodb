/* Independent external sections: a failed provider never blocks the local catalogue. */
(() => {
  "use strict";
  const view = window.NyankoSearchView;
  const { query, page } = view;
  const type = view.type === "all" ? null : view.type;
  if (!query || type === "db") return;
  const root = new URL("../", document.currentScript.src);
  const activeRequests = new Map();
  const loadedKinds = new Set();
  document.getElementById("externalSearch").hidden = false;
  const sections = {};
  for (const kind of ["web", "images", "videos"]) {
    const section = document.getElementById(`${kind}Results`).closest("section");
    sections[kind] = section;
    if (type && type !== kind) section.hidden = true;
    const more = document.getElementById(`${kind}More`);
    if (more && !type) { more.href = view.href(kind); more.hidden = false; }
  }
  // Keep the same reading order regardless of which provider finishes first.
  document.getElementById("externalSearch").append(sections.web, sections.images, sections.videos);
  const restrictedMessage = "이용약관 위반 가능성이 있어 제한된 검색입니다.";
  function showBlocked(kind) {
    const results = document.getElementById(`${kind}Results`);
    results.replaceChildren(); results.setAttribute("aria-busy", "false");
    const status = document.getElementById(`${kind}Status`);
    status.textContent = restrictedMessage; status.hidden = false;
    document.getElementById(`${kind}Provider`).textContent = "";
    const more = document.getElementById(`${kind}More`); if (more) more.hidden = true;
    view.updatePages(kind, 0);
  }
  const normalizedQuery = query.normalize("NFC").replace(/\s/g, "").toLowerCase();
  if (["배열", "핵", "에딧", "에디터", "버그판", "seed", "rolls", "mod"].some(word => normalizedQuery.includes(word))) {
    for (const kind of type ? [type] : Object.keys(sections)) showBlocked(kind);
    return;
  }

  function node(tag, className = "", text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function safeURL(value, image = false) {
    try {
      const url = new URL(String(value));
      if (!(image ? ["https:"] : ["https:", "http:"]).includes(url.protocol) || url.username || url.password) return null;
      if (url.port && !["80", "443"].includes(url.port)) return null;
      const host = url.hostname.toLowerCase().replace(/\.$/, "");
      if (!host.includes(".") || host.startsWith("[") || /^\d+(?:\.\d+){3}$/.test(host)
          || host.endsWith(".localhost") || /^(?:localhost|127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host)
          || /^(?:172\.(?:1[6-9]|2\d|3[01])\.)/.test(host) || host.endsWith(".local") || host.endsWith(".internal")) return null;
      return url;
    } catch (_) { return null; }
  }
  function linkFor(item, className = "item-name external-title") {
    const url = safeURL(item.url);
    if (!url) return null;
    const link = node("a", className, String(item.title || url.hostname));
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }
  function sourceFor(item) {
    const host = safeURL(item.url)?.hostname.replace(/^www\./, "") || "";
    const source = String(item.source || host);
    return source === host ? source : `${source} · ${host}`;
  }
  function mediaFor(item, media) {
    const url = safeURL(item.thumbnail, true);
    const missing = () => {
      media.querySelector("img")?.remove();
      media.append(node("span", "media-failed", "미리보기 이미지 없음"));
    };
    if (!url) { missing(); return; }
    const image = node("img", "external-thumbnail");
    image.src = url.href;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("error", missing, { once: true });
    media.append(image);
  }
  function originalMediaFor(item, media) {
    // Full image is requested only when opened. Try the thumbnail once on failure.
    const candidates = [...new Set([item.original, item.thumbnail]
      .map(value => safeURL(value, true)?.href).filter(Boolean))];
    const image = node("img", "external-thumbnail");
    image.alt = item.title;
    image.loading = "eager";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    const next = () => {
      const url = candidates.shift();
      if (url) image.src = url;
      else {
        image.remove();
        media.append(node("span", "media-failed", "미리보기 이미지 없음"));
      }
    };
    image.addEventListener("error", () => { if (media.isConnected) next(); });
    media.append(image);
    next();
  }
  function renderWeb(item) {
    const link = linkFor(item, "item-card external-web-card");
    if (!link) return null;
    const attribution = node("span", "result-status external-source web-attribution");
    const favicon = node("span", "web-favicon");
    favicon.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("focusable", "false");
    for (const [tag, attrs] of [
      ["circle", { cx: "12", cy: "12", r: "9" }],
      ["ellipse", { cx: "12", cy: "12", rx: "4", ry: "9" }],
      ["path", { d: "M3 12h18M5 6h14M5 18h14" }]
    ]) {
      const shape = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (const [key, value] of Object.entries(attrs)) shape.setAttribute(key, value);
      svg.append(shape);
    }
    const icon = node("img");
    // Request only the validated result hostname, never its path or search parameters.
    icon.src = `https://${safeURL(item.url).hostname}/favicon.ico`;
    icon.alt = ""; icon.loading = "lazy"; icon.decoding = "async"; icon.referrerPolicy = "no-referrer";
    icon.addEventListener("load", () => svg.setAttribute("hidden", ""), { once: true });
    icon.addEventListener("error", () => icon.remove(), { once: true });
    favicon.append(svg, icon);
    attribution.append(favicon, node("span", "web-source-label", sourceFor(item)));
    link.replaceChildren(attribution,
      node("span", "item-name external-title", item.title));
    if (item.description) link.append(node("p", "result-status external-description", item.description));
    return link;
  }
  function renderImage(item) {
    const link = linkFor(item);
    if (!link) return null;
    const card = node("article", "item-card");
    const details = node("details", "external-image");
    const preview = node("summary", "external-media image-preview");
    preview.setAttribute("aria-label", `${item.title} 이미지 미리보기 열기`);
    mediaFor(item, preview);
    preview.append(node("span", "image-close", "미리보기 닫기"));
    details.append(preview);
    details.addEventListener("toggle", () => {
      details.querySelector(".image-viewer")?.remove();
      card.classList.toggle("image-expanded", details.open);
      preview.setAttribute("aria-label", `${item.title} 이미지 미리보기 ${details.open ? "닫기" : "열기"}`);
      if (!details.open) return;
      for (const other of document.querySelectorAll(".external-image[open]")) if (other !== details) other.open = false;
      const viewer = node("div", "image-viewer");
      details.append(viewer);
      originalMediaFor(item, viewer);
    });
    details.addEventListener("keydown", event => {
      if (event.key === "Escape" && details.open) { event.preventDefault(); details.open = false; preview.focus(); }
    });
    const copy = node("span", "external-copy");
    copy.append(link,
      node("span", "result-status external-source", sourceFor(item)));
    card.append(details, copy);
    return card;
  }
  function renderVideo(item) {
    const link = linkFor(item);
    if (!link) return null;
    const card = node("article", "item-card");
    const id = String(item.videoId || "");
    const destination = safeURL(item.url);
    const youtubeHost = /^(?:www\.|m\.)?youtube\.com$/.test(destination.hostname) || destination.hostname === "youtu.be";
    const linkedId = destination.hostname === "youtu.be" ? destination.pathname.slice(1)
      : destination.pathname === "/watch" ? destination.searchParams.get("v")
      : destination.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})\/?$/)?.[1];
    if (/^[\w-]{11}$/.test(id) && youtubeHost && linkedId === id) {
      const details = node("details", "external-video");
      const preview = node("summary", "external-media video-preview");
      preview.setAttribute("aria-label", `${item.title} 동영상 미리보기`);
      mediaFor(item, preview);
      preview.append(node("span", "video-close", "미리보기 닫기"));
      if (item.duration) preview.append(node("span", "video-duration", item.duration));
      details.append(preview);
      details.addEventListener("toggle", () => {
        details.querySelector(".video-player")?.remove();
        card.classList.toggle("video-expanded", details.open);
        preview.setAttribute("aria-label", `${item.title} ${details.open ? "미리보기 닫기" : "동영상 미리보기"}`);
        if (!details.open) return;
        for (const other of document.querySelectorAll(".external-video[open]")) if (other !== details) other.open = false;
        const player = node("div", "video-player");
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&playsinline=1&rel=0`;
        iframe.title = `${item.title} 미리보기`;
        iframe.allow = "encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        player.append(iframe);
        details.append(player);
      });
      card.append(details);
    } else {
      const mediaLink = linkFor(item, "external-media");
      mediaLink.replaceChildren();
      mediaLink.setAttribute("aria-label", `${item.title} 원본 동영상 보기`);
      mediaFor(item, mediaLink);
      card.append(mediaLink);
    }
    const copy = node("div", "external-copy");
    copy.append(link, node("p", "result-status external-source", sourceFor(item)));
    card.append(copy);
    return card;
  }

  const renderers = { web: renderWeb, images: renderImage, videos: renderVideo };
  async function load(kind) {
    if (activeRequests.has(kind)) return;
    const results = document.getElementById(`${kind}Results`);
    const status = document.getElementById(`${kind}Status`);
    if (page > 100) {
      results.setAttribute("aria-busy", "false");
      sections[kind].hidden = true;
      view.updatePages(kind, 0);
      return;
    }
    const controller = new AbortController();
    activeRequests.set(kind, controller);
    results.setAttribute("aria-busy", "true");
    status.textContent = "검색결과를 불러오고 있습니다.";
    status.hidden = false;
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const url = new URL("api/search/external", root);
      url.searchParams.set("q", query);
      url.searchParams.set("kind", kind);
      url.searchParams.set("page", String(page));
      const response = await fetch(url, { signal: controller.signal, credentials: "omit" });
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json();
      if (activeRequests.get(kind) !== controller) return;
      if (data.query !== query || data.kind !== kind || data.page !== page || !Array.isArray(data.items)
          || !["ok", "empty", "blocked"].includes(data.status)) throw new Error("unavailable");
      if (data.status === "blocked") { showBlocked(kind); loadedKinds.add(kind); return; }
      document.getElementById(`${kind}Provider`).textContent = String(data.provider || "");
      const items = data.items.slice(0, kind === "web" ? 20 : 8);
      const fragment = document.createDocumentFragment();
      for (const item of items) {
        if (!item || typeof item.title !== "string" || !item.title.trim()) continue;
        const card = renderers[kind](item);
        if (card) fragment.append(card);
      }
      const renderedCount = fragment.childElementCount;
      results.replaceChildren(fragment);
      view.updatePages(kind, data.pageCount, data.hasNext === true && page < 100);
      loadedKinds.add(kind);
      status.hidden = Boolean(renderedCount);
      // Preserve first-page empty/error/blocked guidance, but remove exhausted later panels.
      sections[kind].hidden = page > 1 && !renderedCount;
      if (!renderedCount) status.textContent = data.status === "empty"
        ? "검색결과가 없습니다." : "표시할 수 있는 검색결과가 없습니다.";
    } catch (_) {
      if (activeRequests.get(kind) !== controller) return;
      view.updatePages(kind, 0);
      status.textContent = "검색결과를 불러오지 못했습니다. 잠시 후 다시 검색해 주세요.";
      status.hidden = false;
    } finally {
      clearTimeout(timeout);
      if (activeRequests.get(kind) === controller) {
        activeRequests.delete(kind);
        results.setAttribute("aria-busy", "false");
      }
    }
  }
  const kinds = type ? [type] : Object.keys(renderers);
  for (const kind of kinds) load(kind);
  window.addEventListener("pagehide", () => {
    for (const controller of activeRequests.values()) controller.abort();
    activeRequests.clear();
    for (const details of document.querySelectorAll(".external-video[open], .external-image[open]")) details.open = false;
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) for (const kind of kinds) if (!loadedKinds.has(kind)) load(kind);
  });
})();
