מבנה מעודכן למפת Badge / מפה לפי מספר

קבצים:
- index.html — HTML בלבד + טעינת JS לפי סדר.
- css/app.css — עיצוב בלבד, כולל כלי זום/מדידה.
- js/config.js — קבועים.
- js/state.js — badge מה-URL, יצירת map, TileLayer, maxZoom.
- js/title.js — טעינת כותרת ועדכון כמות יעלים.
- js/helpers.js — פונקציות עזר.
- js/geojson.js — טעינת data.geojson, שכבות אב/נלווים, popup, fitBounds.
- js/map-tools.js — כלי זום, קנה מידה ומדידת מרחק.
- js/main.js — הפעלה.

שינוי חשוב לתיקון בעיית זום:
- ב-CSS הוסרה ההזזה transform מתוך .custom-marker.
- מיקום הסמן נשלט כעת רק דרך iconAnchor ב-createMarkerIcon.
- זה מפחית סיכון לתזוזת סמן ביחס למפה בזמן זום.

שימור מבנה נתונים:
- json/Badge_1497/data.geojson
- json/Badge_1497/map-title.json
- שאר הקבצים שבתיקיית Badge נשארים לפי הצורך שלך, אבל הקוד הזה משתמש ישירות ב-data.geojson וב-map-title.json.
