/* Official embeds remain provider-owned; the shop endpoint returns display fields only. */
(() => {
  "use strict";
  async function shop() {
    const status = document.getElementById("shop-status"), results = document.getElementById("shop-updates");
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 18000);
    const safe = (value, image = false) => {
      try {
        const u = new URL(value);
        return u.protocol === "https:" && u.hostname === "www.nyanko-daishoten.jp" && !u.username && !u.password && !u.port
          && (image ? /^\/Contents\/ProductImages\/[A-Za-z0-9_./-]+\.(jpg|jpeg|png|webp)$/i.test(u.pathname) && !u.search && !u.hash
            : u.pathname === "/Form/Product/ProductDetail.aspx") ? u.href : null;
      } catch (_) { return null; }
    };
    try {
      const response = await fetch("api/social/shop", { signal: controller.signal, credentials: "omit" });
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json();
      if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error("unavailable");
      const fragment = document.createDocumentFragment();
      for (const row of data.items.slice(0, 6)) {
        if (!row || typeof row.title !== "string" || !row.title.trim() || !safe(row.url) || !safe(row.image, true)) continue;
        const a = document.createElement("a"), img = document.createElement("img"), copy = document.createElement("span"), title = document.createElement("span");
        a.className = "item-card"; a.href = safe(row.url); a.target = "_blank"; a.rel = "noopener noreferrer";
        img.src = safe(row.image, true); img.alt = ""; img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
        img.addEventListener("error", () => { const empty = document.createElement("span"); empty.className = "item-image-empty"; img.replaceWith(empty); }, { once: true });
        title.className = "shop-title"; title.textContent = row.title; copy.append(title);
        if (typeof row.price === "string" && row.price.trim()) { const price = document.createElement("span"); price.className = "shop-price"; price.textContent = row.price; copy.append(price); }
        a.append(img, copy); fragment.append(a);
      }
      if (!fragment.childElementCount) throw new Error("unavailable");
      results.replaceChildren(fragment); status.hidden = true;
    } catch (_) { status.textContent = "신상품을 불러오지 못했습니다."; }
    finally { clearTimeout(timeout); }
  }
  function widgetAPI() {
    if (window.twttr?.widgets?.createTweet) return Promise.resolve(window.twttr);
    return new Promise(resolve => {
      const timeout = setTimeout(() => resolve(null), 12000);
      const script = document.createElement("script"); script.src = "https://platform.twitter.com/widgets.js"; script.async = true;
      script.onerror = () => { clearTimeout(timeout); resolve(null); };
      script.onload = () => { clearTimeout(timeout); resolve(window.twttr?.widgets?.createTweet ? window.twttr : null); };
      document.head.append(script);
    });
  }
  async function xPosts() {
    const mount = document.getElementById("x-feed"), status = document.getElementById("x-status");
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 18000);
    const posts = [];
    try {
      const response = await fetch("api/social/x", { signal: controller.signal, credentials: "omit" });
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json();
      if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error("unavailable");
      const fragment = document.createDocumentFragment();
      for (const row of data.items.slice(0, 3)) {
        if (!row || !/^\d{10,25}$/.test(String(row.id)) || typeof row.text !== "string" || !row.text.trim() || typeof row.author !== "string" || typeof row.date !== "string") continue;
        let url;
        try { url = new URL(row.url); } catch (_) { continue; }
        if (url.protocol !== "https:" || !["x.com", "twitter.com"].includes(url.hostname) || url.username || url.password || url.port || url.search || url.hash
            || url.pathname.toLowerCase() !== "/ponos_game/status/" + row.id) continue;
        const article = document.createElement("article"), fallback = document.createElement("div"), author = document.createElement("a"), text = document.createElement("p"), date = document.createElement("a"), widget = document.createElement("div");
        article.className = "x-post";
        author.className = "x-post-author"; author.href = "https://x.com/PONOS_GAME"; author.textContent = row.author;
        text.className = "x-post-text"; text.textContent = row.text;
        date.className = "x-post-date"; date.href = url.href; date.textContent = row.date;
        for (const link of [author, date]) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
        fallback.append(author, text, date); article.append(fallback, widget); fragment.append(article);
        posts.push({ id: row.id, fallback, widget });
      }
      if (!posts.length) throw new Error("unavailable");
      mount.replaceChildren(fragment); status.hidden = true;
    } catch (_) { status.hidden = false; status.textContent = "게시물을 불러오지 못했습니다."; }
    finally { clearTimeout(timeout); }
    if (!posts.length) return;
    const api = await widgetAPI();
    if (!api) return; // Verified official text remains readable when widgets are unavailable.
    await Promise.allSettled(posts.map(async post => {
      let expired = false;
      const timer = setTimeout(() => { expired = true; post.widget.remove(); }, 12000);
      try {
        const iframe = await api.widgets.createTweet(post.id, post.widget, { theme: "dark", dnt: true, lang: "ja" });
        if (!expired && iframe && post.widget.isConnected) post.fallback.hidden = true;
        else post.widget.remove();
      } catch (_) { post.widget.remove(); }
      finally { clearTimeout(timer); }
    }));
  }
  shop();
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); xPosts(); } });
  observer.observe(document.getElementById("x-title").closest("section"));
})();
