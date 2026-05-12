function updateHeaderTitle() {
  const titleEl = document.getElementById("mapTitleText");
  if (!titleEl) return;

  if (currentTotalCount === null) {
    titleEl.textContent = mapTitle;
  } else {
    titleEl.innerHTML =
      `${escapeHtml(mapTitle)}<br><span class="title-count">${currentTotalCount} יעלים</span>`;
  }
}

async function loadBadgeTitle() {
  try {
    const response = await fetch(`json/Badge_${badge}/map-title.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    mapTitle = data.title || `מפה אישית עבור יעל # ${badge}`;
  } catch (err) {
    mapTitle = `מפה אישית עבור יעל # ${badge}`;
    console.warn("Failed to load map-title.json", err);
  }

  updateHeaderTitle();
}
