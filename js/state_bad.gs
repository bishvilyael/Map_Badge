const map = L.map('map', { preferCanvas: true }).setView([31.5, 34.8], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

const overlays = {}, layerRegistry = {}, allBounds = [], searchableItems = [];
let totalMarkers = 0, loadedLayers = 0;
