async function loadMapTitle() {
  try {
    const titlePath = BADGE_NO ? `json/Badge_${BADGE_NO}/map-title.json` : 'map-title.json';
    const response = await fetch(titlePath, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    document.getElementById('mapTitleText').textContent = data.title || DEFAULT_MAP_TITLE;
  } catch (err) {
    document.getElementById('mapTitleText').textContent = DEFAULT_MAP_TITLE;
    console.warn('Failed to load map-title.json', err);
  }
}
