(() => {
  "use strict";

  const PREFIX = "nyanko-imgcut:img015:";
  const configuredRoot = document.currentScript?.dataset.imgRoot || "../img";
  const imageRoot = configuredRoot.replace(/\/$/, "");
  const SPRITE_URL = `${imageRoot}/ImageLocal/img015.png`;
  const CUT_URL = `${imageRoot}/ImageDataLocal/img015.imgcut`;
  const renderedReferences = new Map();
  let sourcePromise = null;

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image), { once: true });
      image.addEventListener("error", reject, { once: true });
      image.src = url;
    });
  }

  function parseCuts(text) {
    return text.split(/\r?\n/).slice(4).flatMap((line) => {
      const parts = line.split(",", 5);
      if (parts.length < 5) return [];
      const [x, y, width, height] = parts.slice(0, 4).map(Number);
      if (![x, y, width, height].every(Number.isFinite)) return [];
      return [{ x, y, width, height }];
    });
  }

  function loadSource() {
    if (!sourcePromise) {
      sourcePromise = Promise.all([
        loadImage(SPRITE_URL),
        fetch(CUT_URL).then((response) => {
          if (!response.ok) throw new Error(`imgcut ${response.status}`);
          return response.text();
        }),
      ]).then(([sprite, cutText]) => ({
        sprite,
        cuts: parseCuts(cutText),
      }));
    }
    return sourcePromise;
  }

  function parseReference(reference) {
    const values = reference
      .slice(PREFIX.length)
      .split(":")
      .map(Number);
    if (values.length !== 3 || values.some((value) => !Number.isFinite(value))) {
      throw new Error(`Invalid imgcut reference: ${reference}`);
    }
    const [cutIndex, outputWidth, outputHeight] = values;
    if (outputWidth <= 0 || outputHeight <= 0) {
      throw new Error(`Invalid imgcut output size: ${reference}`);
    }
    return { cutIndex, outputWidth, outputHeight };
  }

  async function renderReference(reference) {
    if (renderedReferences.has(reference)) {
      return renderedReferences.get(reference);
    }

    const promise = (async () => {
      const { cutIndex, outputWidth, outputHeight } = parseReference(reference);
      const { sprite, cuts } = await loadSource();
      const cut = cuts[cutIndex];
      if (!cut || cut.width <= 1 || cut.height <= 1) {
        throw new Error(`Unknown imgcut index: ${cutIndex}`);
      }

      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 2D context is unavailable");
      context.imageSmoothingEnabled = false;
      context.drawImage(
        sprite,
        cut.x,
        cut.y,
        cut.width,
        cut.height,
        0,
        0,
        outputWidth,
        outputHeight,
      );
      return canvas.toDataURL("image/png");
    })();

    renderedReferences.set(reference, promise);
    return promise;
  }

  function hydrateImage(image) {
    const reference = image.getAttribute("src");
    if (!reference || !reference.startsWith(PREFIX)) return;
    if (image.dataset.imgcutRef === reference && image.dataset.imgcutLoading === "true") {
      return;
    }

    image.dataset.imgcutRef = reference;
    image.dataset.imgcutLoading = "true";
    image.removeAttribute("src");
    renderReference(reference)
      .then((url) => {
        if (image.dataset.imgcutRef !== reference) return;
        image.dataset.imgcutLoading = "false";
        image.src = url;
      })
      .catch((error) => {
        if (image.dataset.imgcutRef !== reference) return;
        image.dataset.imgcutLoading = "false";
        image.classList.add("imgcut-load-error");
        console.error(error);
      });
  }

  function hydrateTree(root) {
    if (!(root instanceof Element)) return;
    if (root.matches("img")) hydrateImage(root);
    root.querySelectorAll("img").forEach(hydrateImage);
  }

  document.querySelectorAll("img").forEach(hydrateImage);
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "attributes") {
        hydrateImage(record.target);
        return;
      }
      record.addedNodes.forEach((node) => hydrateTree(node));
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });
})();
