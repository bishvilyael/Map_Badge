async function loadBadgeGeoJson() {
  const response = await fetch(`json/Badge_${badge}/data.geojson`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("data.geojson לא נטען");
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.features)) {
    throw new Error("data.geojson לא תקין");
  }

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

  const mainCount = mainLayer.getLayers().length;
  const otherCount = otherLayer.getLayers().length;
  const totalCount = mainCount + otherCount;

  currentTotalCount = totalCount;
  updateHeaderTitle();

  mainLayer.addTo(map);

  if (otherCount > 0) {
    otherLayer.addTo(map);

    L.control.layers(null, {
      [`יעל #${badge} (${mainCount})`]: mainLayer,
      [`נלווים (${otherCount})`]: otherLayer
    }, { collapsed: false }).addTo(map);
  }

  if (allBounds.length > 0) {
    map.fitBounds(allBounds, {
      padding: [20, 20],
      maxZoom: DEFAULT_BADGE_MAX_FIT_ZOOM
    });
  }
}
fitIsraelView();
