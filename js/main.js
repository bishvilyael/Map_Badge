(async function () {
  try {
    await loadBadgeTitle();
    await loadBadgeGeoJson();
  } catch (err) {
    console.error(err);
    document.getElementById("mapTitleText").textContent =
      "שגיאה: " + err.message;
  }
})();
