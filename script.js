// Inisialisasi map (awal zoom bebas saja, nanti akan diset otomatis)
var map = L.map('map').setView([-7.4, 110], 8);

// Tambah basemap OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tambah layer radar dari RainViewer (real-time)
var radarLayer = L.tileLayer(
  'https://tilecache.rainviewer.com/v2/radar/256/{z}/{x}/{y}/2/1_1.png',
  { attribution: 'Radar data © RainViewer.com' }
).addTo(map);

// Load batas wilayah dari GeoJSON
fetch('batas_wilayah.geojson')
  .then(response => response.json())
  .then(data => {
    var batas = L.geoJSON(data, {
      style: { color: "red", weight: 2, fillOpacity: 0 }
    }).addTo(map);

    // ⬇️ Zoom otomatis sesuai batas wilayah
    map.fitBounds(batas.getBounds());
  });



