const PAGE_KEY = 'index_period_geojson';
const DEFAULT_MAP_TITLE = 'מפת יעלים תקופתית - GeoJSON';
const DEFAULT_ZOOM_ON_SEARCH = 15;
const MAX_SEARCH_RESULTS = 50;
const MARKER_ICON_URL = 'icons/marker.png';
const GEOJSON_FILES = [
  { label: 'רשימת יעלים ממויינת', file: 'json/period.geojson', visible: true }
];

const PREDEFINED_AREA_BOUNDS = {
  'אסיה': [[-10, 25], [82, 180]],
  'asia': [[-10, 25], [82, 180]],
  'אירופה': [[34, -25], [72, 45]],
  'europe': [[34, -25], [72, 45]],
  'אפריקה': [[-35, -20], [38, 55]],
  'africa': [[-35, -20], [38, 55]],
  'צפון אמריקה': [[5, -170], [84, -50]],
  'north america': [[5, -170], [84, -50]],
  'דרום אמריקה': [[-57, -82], [13, -34]],
  'south america': [[-57, -82], [13, -34]],
  'אמריקה': [[-57, -170], [84, -34]],
  'america': [[-57, -170], [84, -34]],
  'אוקיאניה': [[-50, 110], [10, 180]],
  'oceania': [[-50, 110], [10, 180]],
  'ישראל': [[29.3, 34.2], [33.5, 35.95]],
  'israel': [[29.3, 34.2], [33.5, 35.95]]
};
