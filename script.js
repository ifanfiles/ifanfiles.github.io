// Inisialisasi map di lokasi Jawa Tengah
var map = L.map('map').setView([-7.4, 110], 8);

// Basemap OSM (wajib ada agar Windy overlay terlihat)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tambahkan overlay dari Windy (contoh radar)
var radarLayer = L.tileLayer(
  'https://tilecache.rainviewer.com/v2/radar/256/{z}/{x}/{y}/2/1_1.png',
  { attribution: 'Radar data © RainViewer.com' }
).addTo(map);

// Tambahkan batas wilayah dari GeoJSON
fetch('batas_wilayah.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: "red", weight: 2, fillOpacity: 0 }
    }).addTo(map);
  });

