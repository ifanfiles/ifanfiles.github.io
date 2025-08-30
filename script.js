// Inisialisasi peta
var map = L.map('map').setView([-7.7, 110.3], 9);

// Tambah basemap OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Daftar kode adm2 BMKG untuk kabupaten yang dipilih
let kodeKabupaten = {
  "Gunungkidul": "3471",
  "Kota Yogyakarta": "3472",
  "Bantul": "3473",
  "Sleman": "3474",
  "Kulon Progo": "3475",
  "Purworejo": "3306",
  "Cilacap": "3301",
  "Banyumas": "3302",
  "Purbalingga": "3303",
  "Banjarnegara": "3304",
  "Wonosobo": "3305",
  "Temanggung": "3307",
  "Magelang": "3308",
  "Kota Magelang": "3371"
};

// Fungsi ambil prakiraan cuaca BMKG
async function getCuacaKabupaten(namaKab, kode) {
  try {
    let url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm2=${kode}`;
    let res = await fetch(url);
    let data = await res.json();

    if (data && data.data && data.data[0] && data.data[0].cuaca) {
      let cuaca = data.data[0].cuaca[0]; // ambil data prakiraan pertama
      return `
        <b>${namaKab}</b><br>
        Waktu: ${cuaca.local_datetime}<br>
        Cuaca: ${cuaca.weather_desc}<br>
        Suhu: ${cuaca.t} °C<br>
        Kelembaban: ${cuaca.hu} %
      `;
    } else {
      return `<b>${namaKab}</b><br>Data tidak tersedia`;
    }
  } catch (e) {
    return `<b>${namaKab}</b><br>Gagal ambil data`;
  }
}

// Load batas wilayah dari GeoJSON (pastikan file sesuai)
fetch('batas_kabupaten.geojson')
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
