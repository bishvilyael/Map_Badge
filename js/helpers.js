function normalizeBadgeName(name) {
  return String(name || "").replace(/\s+/g, "");
}

function normalizeDescriptionHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html || "";

  temp.querySelectorAll("img").forEach(img => {
    img.setAttribute("src", convertDriveUrl(img.getAttribute("src") || ""));
    img.removeAttribute("loading");
    img.removeAttribute("width");
    img.removeAttribute("height");

    img.onerror = function () {
      const err = document.createElement("div");
      err.className = "popup-image-error";
      err.textContent = "התמונה לא נטענה";
      this.insertAdjacentElement("afterend", err);
      this.style.display = "none";
    };
  });

  temp.querySelectorAll("a").forEach(a => {
    const href = a.getAttribute("href") || "";
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");

    if (/facebook\.com/i.test(href)) {
      a.textContent = "פייסבוק";
    }
  });

  temp.querySelectorAll("*").forEach(el => {
    const text = (el.textContent || "").trim();
    if (/^FB\s*:?\s*$/i.test(text) && el.children.length === 0) {
      el.remove();
    }
  });

  return temp.innerHTML;
}

function createMarkerIcon(labelText, isMain) {
  return L.divIcon({
    className: "badge-marker-icon",
    html: `
      <div class="custom-marker ${isMain ? "main" : "other"}">
        <img src="${MARKER_ICON_URL}" alt="">
        <div class="custom-marker-label ${isMain ? "" : "other"}">${escapeHtml(labelText || "")}</div>
      </div>
    `,
    iconSize: [70, 21],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
}