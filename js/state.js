const params = new URLSearchParams(window.location.search);

const mapKey = params.get("key") || "";

if (!mapKey) {
  document.body.innerHTML = `
    <div style="
      direction: rtl;
      font-family: Arial, sans-serif;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-top: 120px;
      color: #900;
    ">
      אינך מורשה/מורשית לפתוח אתר זה !!
    </div>
  `;
  throw new Error("Missing key");
}

let badgeFolder = "";
let badge = "";

const map = L.map("map", {
  preferCanvas: true,
  maxZoom: 22
}).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
  maxNativeZoom: 19
}).addTo(map);

let mapTitle = `מפה אישית עבור יעל # ${badge}`;
let currentTotalCount = null;
