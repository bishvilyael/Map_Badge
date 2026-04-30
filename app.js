const params = new URLSearchParams(window.location.search);
const badge = params.get("badge");
const MARKER_ICON_URL = "icons/marker.png";

if (!badge) {
  document.getElementById("mapTitleText").textContent = "חסר badge";
  throw new Error("Missing badge");
}

const map = L.map("map", { preferCanvas: true }).setView([31.5, 34.8], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

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
  let m = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i); if (m) return m[1];
  m = url.match(/drive\.google\.com\/uc\?[^"' ]*id=([A-Za-z0-9_-]+)/i); if (m) return m[1];
  m = url.match(/drive\.google\.com\/thumbnail\?[^"' ]*id=([A-Za-z0-9_-]+)/i); if (m) return m[1];
  m = url.match(/lh3\.googleusercontent\.com\/d\/([A-Za-z0-9_-]+)/i); if (m) return m[1];
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

function createMarkerIcon(labelText, isMain) {
  return L.divIcon({
    className: "",
    html: `
      <div class="custom-marker">
        <img src="${MARKER_ICON_URL}" alt="">
        <div class="custom-marker-label ${isMain ? "" : "other"}">${escapeHtml(labelText || "")}</div>
      </div>
    `,
    iconSize: [120, 36],
    iconAnchor: [12, 32],
    popupAnchor: [0, -26]
  });
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

fetch(`json/Badge_${badge}/map-title.json`, { cache: "no-store" })
  .then(r => r.json())
  .then(d => {
    document.getElementById("mapTitleText").textContent =
      d.title || `מפה אישית עבור יעל # ${badge}`;
  })
  .catch(() => {
    document.getElementById("mapTitleText").textContent =
      `מפה אישית עבור יעל # ${badge}`;
  });

fetch(`json/Badge_${badge}/data.geojson`, { cache: "no-store" })
  .then(r => {
    if (!r.ok) throw new Error("data.geojson לא נטען");
    return r.json();
  })
  .then(data => {
    const mainLayer = L.layerGroup();
    const otherLayer = L.layerGroup();
    const allBounds = [];

    data.features.forEach(feature => {
      const latlng = getFeatureLatLng(feature);
      if (!latlng) return;

      const props = feature.properties || {};
      const name = getFeatureName(props);
      const isMain = normalizeBadgeName(name) === `#${badge}`;

      const descriptionHtml = normalizeDescriptionHtml(getFeatureDescription(props));

      const marker = L.marker(latlng, {
        icon: createMarkerIcon(name, isMain)
      });

      marker.bindPopup(
        `<div class="popup-wrap"><div class="popup-title">${escapeHtml(name)}</div><div class="popup-body">${descriptionHtml}</div></div>`,
        { maxWidth: 340, minWidth: 220 }
      );

      if (isMain) {
        marker.addTo(mainLayer);
      } else {
        marker.addTo(otherLayer);
      }

      allBounds.push(latlng);
    });

    mainLayer.addTo(map);

    if (otherLayer.getLayers().length > 0) {
      otherLayer.addTo(map);

      L.control.layers(null, {
        [`יעל #${badge}`]: mainLayer,
        "נלווים": otherLayer
      }, { collapsed: false }).addTo(map);
    }

    if (allBounds.length > 0) {
      map.fitBounds(allBounds, {
        padding: [20, 20],
        maxZoom: 14
      });
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("mapTitleText").textContent =
      "שגיאה: " + err.message;
  });