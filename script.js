// Inisialisasi map (awal zoom bebas saja, nanti akan diset otomatis)
var map = L.map('map').setView([-7.4, 110], 8);

// Tambah basemap OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load batas wilayah dari GeoJSON
fetch('batas_wilayah.geojson')
  .then(response => response.json())
  .then(data => {
    var batas = L.geoJSON(data, {
      style: { color: "red", weight: 2, fillOpacity: 0 }
    }).addTo(map);

    // ⬇️ Zoom otomatis sesuai batas wilayah
    map.fitBounds(batas.getBounds());

    // --- Daftar kode adm2 BMKG untuk kabupaten/kota yang kamu pilih ---
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

// --- Fungsi ambil data BMKG berdasarkan kode adm2 ---
async function getCuacaKabupaten(namaKab, kode) {
  try {
    let url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm2=${kode}`;
    let res = await fetch(url);
    let data = await res.json();

    if (data && data.data && data.data[0] && data.data[0].cuaca) {
      let cuaca = data.data[0].cuaca[0]; // ambil data prakiraan pertama
      return {
        kabupaten: namaKab,
        waktu: cuaca.local_datetime,
        kondisi: cuaca.weather_desc,
        suhu: cuaca.t,
        kelembaban: cuaca.hu
      };
    } else {
      return { kabupaten: namaKab, error: "Data tidak tersedia" };
    }
  } catch (e) {
    return { kabupaten: namaKab, error: "Gagal ambil data" };
  }
}

// --- Loop semua kabupaten dan tampilkan di console ---
async function tampilkanSemua() {
  for (let [nama, kode] of Object.entries(kodeKabupaten)) {
    let hasil = await getCuacaKabupaten(nama, kode);
    console.log(hasil);
  }
}

tampilkanSemua();

  });




