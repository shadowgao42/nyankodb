/* Shared fixed-side navigation. External totals are never inferred. */
window.NyankoSearchPages = Object.freeze({
  render(container, { page, lastPage, hasNext, href, showNumbers = true, showDirections = true, directionStyle = "buttons" }) {
    container.replaceChildren();
    const link = (label, target, className) => {
      const a = document.createElement("a");
      a.className = className === "page-number" || className.includes("page-direction") ? className : `search-action ${className}`;
      a.textContent = label;
      a.href = href(target);
      return a;
    };
    const direction = (previous) => {
      const a = link(directionStyle === "chevrons" ? (previous ? "<" : ">") : (previous ? "← 이전" : "다음 →"),
        previous ? Math.min(page - 1, lastPage ?? page - 1) : page + 1,
        `${previous ? "page-previous" : "page-next"}${directionStyle === "chevrons" ? " page-direction" : ""}`);
      a.setAttribute("aria-label", previous ? "이전 페이지" : "다음 페이지");
      return a;
    };
    if (showDirections && page > 1) container.append(direction(true));
    const numbers = document.createElement("div");
    numbers.className = "page-numbers";
    const end = Math.min(lastPage ?? page + (hasNext ? 1 : 0), Math.max(10, page + 4));
    const start = Math.max(1, end - 9);
    for (let number = start; number <= end; number++) {
      const a = link(String(number), number, "page-number");
      a.setAttribute("aria-label", `${number}페이지`);
      if (number === page) a.setAttribute("aria-current", "page");
      numbers.append(a);
    }
    if (showNumbers) container.append(numbers);
    if (showDirections && hasNext) container.append(direction(false));
    container.hidden = false;
  }
});
