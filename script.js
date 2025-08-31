// Inisialisasi peta
var map = L.map('map').setView([-7.7, 110.3], 9);

// Tambah basemap OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);



// Contoh inisialisasi peta Windy setelah libBoot.js dimuat
    const options = {
      key: 'LXN1gdZeVuvvqnZ1cpnalWapvZgdkZrM', // ganti dengan API key Windy Anda
      lat: -7.685,
      lon: 109.903,
      zoom: 10,
    };

    // tunggu sampai windyBoot siap
    windyInit(options, function(windyAPI) {
      console.log("Windy siap!", windyAPI);
    });

// Load batas wilayah dari GeoJSON (pastikan file sesuai)
fetch('batas_wilayah.geojson')
  .then(response => response.json())
  .then(data => {
    var batas = L.geoJSON(data, {
      style: { color: "blue", weight: 2, fillOpacity: 0.1 },
      onEachFeature: function (feature, layer) {
        let namaKab = feature.properties.FIRST_KA_1; // ganti sesuai field nama di GeoJSON

        if (kodeKabupaten[namaKab]) {
          layer.on('click', async function () {
            let popupContent = await getCuacaKabupaten(namaKab, kodeKabupaten[namaKab]);
            layer.bindPopup(popupContent).openPopup();
          });
        } else {
          layer.bindPopup(`<b>${namaKab}</b><br>Kode BMKG tidak tersedia`);
        }
      }
    }).addTo(map);

    // Auto zoom ke semua kabupaten
    map.fitBounds(batas.getBounds());
  });


