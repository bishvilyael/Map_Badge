const map = L.map('map', { preferCanvas: true }).setView([31.5, 34.8], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const overlays = {}, layerRegistry = {}, allBounds = [], searchableItems = [];
let totalMarkers = 0, loadedLayers = 0;
