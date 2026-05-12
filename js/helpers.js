function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function getPropCaseInsensitive(props, candidates) {
  if (!props) return "";

  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(props, key) && props[key] != null) {
      return props[key];
    }
  }

  const lowerMap = {};
  Object.keys(props).forEach(k => {
    lowerMap[k.toLowerCase()] = k;
  });

  for (const key of candidates) {
    const actual = lowerMap[String(key).toLowerCase()];
    if (actual && props[actual] != null) return props[actual];
  }

  return "";
}

function getFeatureName(props) {
  return String(
    getPropCaseInsensitive(props, ["name", "Name", "NAME", "title", "Title"]) || "ללא שם"
  ).trim();
}

function getFeatureDescription(props) {
  return String(
    getPropCaseInsensitive(props, ["description", "Description", "DESCRIPTION", "desc", "Desc"]) || ""
  );
}

function normalizeBadgeName(name) {
  return String(name || "").replace(/\s+/g, "");
}

function extractDriveFileId(url) {
  if (!url) return null;

  let m = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i);
  if (m) return m[1];

  m = url.match(/drive\.google\.com\/uc\?[^"' ]*id=([A-Za-z0-9_-]+)/i);
  if (m) return m[1];

  m = url.match(/drive\.google\.com\/thumbnail\?[^"' ]*id=([A-Za-z0-9_-]+)/i);
  if (m) return m[1];

  m = url.match(/lh3\.googleusercontent\.com\/d\/([A-Za-z0-9_-]+)/i);
  if (m) return m[1];

  return null;
}

function convertDriveUrl(url) {
  const fileId = extractDriveFileId(url);
  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000` : url;
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

function getFeatureLatLng(feature) {
  const g = feature && feature.geometry;

  if (!g || g.type !== "Point" || !Array.isArray(g.coordinates) || g.coordinates.length < 2) {
    return null;
  }

  const lon = parseFloat(g.coordinates[0]);
  const lat = parseFloat(g.coordinates[1]);

  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

  return L.latLng(lat, lon);
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
    iconAnchor: [70, 21],
    popupAnchor: [0, -21]
  });
}
