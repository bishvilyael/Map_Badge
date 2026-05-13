const params = new URLSearchParams(window.location.search);

const mapKey = params.get("key") || "";

let badgeFolder = "";
let badge = "";
let map = null;

let mapTitle = "מפת יעל";
let currentTotalCount = null;
let badgePointRows = [];

const accessDeniedMessage = "אינך מורשה/מורשית לפתוח אתר זה !!";

if (mapKey) {
  map = L.map("map", {
    preferCanvas: true,
    maxZoom: 22
  }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    maxNativeZoom: 19
  }).addTo(map);
}