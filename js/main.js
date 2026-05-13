(async function () {
  try {
    if (!mapKey) {
      throw new Error(accessDeniedMessage);
    }

    await loadMapKey();

    await loadBadgeTitle();
    await loadBadgeGeoJson();
  } catch (err) {
    console.error(err);

    document.title = "אין הרשאה";

    document.body.innerHTML = `
      <div style="
        direction: rtl;
        font-family: Arial, sans-serif;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-top: 120px;
        color: #900;
      ">
        ${err.message}
      </div>
    `;
  }
})();