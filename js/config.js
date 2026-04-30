const PAGE_KEY = 'index_badge_geojson';
const DEFAULT_ZOOM_ON_SEARCH = 15;
const MAX_SEARCH_RESULTS = 50;
const MARKER_ICON_URL = 'icons/marker.png';

const urlParams = new URLSearchParams(window.location.search);
const BADGE_NO = (urlParams.get('badge') || '').trim();
const MAIN_BADGE_NAME = BADGE_NO ? `#${BADGE_NO}` : '';
const DEFAULT_MAP_TITLE = BADGE_NO ? `מפה אישית עבור יעל # ${BADGE_NO}` : 'מפה אישית עבור יעל';

if (!BADGE_NO) {
  console.error('Missing badge parameter. Example: ?badge=1497');
}

document.body.classList.add('badge-map');

const GEOJSON_FILES = BADGE_NO ? [
  { label: `יעל #${BADGE_NO}`, file: `json/Badge_${BADGE_NO}/data.geojson`, visible: true, badgeMode: 'main' },
  { label: 'נלווים', file: `json/Badge_${BADGE_NO}/data.geojson`, visible: true, badgeMode: 'others' }
] : [];

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
