async function loadBadgeGeoJson() {
  const response = await fetch(`json/${badgeFolder}/data.geojson`, { cache: "no-store" });

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
  badgePointRows = [];

  data.features.forEach(feature => {
    const latlng = getFeatureLatLng(feature);
    if (!latlng) return;

    const props = feature.properties || {};
    const name = getFeatureName(props);
    const isMain = normalizeBadgeName(name) === `#${badge}`;
    const descriptionHtml = normalizeDescriptionHtml(getFeatureDescription(props));
    const details = extractPointDetailsFromDescription(descriptionHtml);
	
	console.log("details.place =", details.place);
	console.log("description contains אתר =", descriptionHtml.includes("אתר"));
	console.log(descriptionHtml);

    const marker = L.marker(latlng, {
      icon: createMarkerIcon(name, isMain)
    });

    const shortDate = formatPopupDate(details.date);

    const popupHtml = `
      <div dir="rtl" style="font-family:Arial; line-height:1.5;">

        <div>
          <b>${escapeHtml(name)} - ${escapeHtml(details.name || "")}</b>
        </div>

        <div>
          ${escapeHtml(details.place || "")}
          ${details.place && shortDate ? ", " : ""}
          ${escapeHtml(shortDate)}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">

          <div>
            ${
              details.fbUrl
                ? `<a href="${escapeHtml(details.fbUrl)}" target="_blank" rel="noopener noreferrer">פוסט</a>`
                : ""
            }
          </div>

          <div>
            ${
              details.id
                ? `ID: ${escapeHtml(details.id)}`
                : ""
            }
          </div>

        </div>

        <br/>

        ${extractImageHtml(descriptionHtml)}

      </div>
    `;

    marker.bindPopup(popupHtml, {
      maxWidth: 340,
      minWidth: 220
    });

    badgePointRows.push({
      date: details.date,
      badgeNo: name,
      name: details.name,
      site: details.place,
      fbUrl: details.fbUrl,
      latlng: latlng,
      marker: marker
    });

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

  renderPlacesTable();
  fitIsraelView();
}