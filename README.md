# MasjidOS

https://youtu.be/fCgN0jHCpmk

**Mosque Information System** — web app sederhana untuk jadwal shalat, hitung mundur, tampilan media, dan (opsional) livestream, dengan zona waktu default **WIB (Asia/Jakarta)**. **MasjidOS dirancang untuk dijalankan di lingkungan lokal** (PC, mini PC, atau NAS ringan di jaringan masjid): browser TV/tablet cukup membuka alamat server di jaringan yang sama — tanpa ketergantungan pada hosting cloud seperti Vercel.

[English below](#masjidos)

## Ringkasan fitur

- **Jadwal 5 waktu** (Subuh, Dzuhur, Ashar, Maghrib, Isya) dari [API myQuran](https://api.myquran.com/doc) (lihat [API v1 sholat](https://api.myquran.com/)).
- **Hitung mundur** ke waktu berikut, dengan status warna: tenang / normal / peringatan (&lt;5 menit) / kritis (&lt;1 menit) + animasi yang tetap hormat.
- **Mode display / TV** — fokus hitung mundur bila tersisa waktu ≤ batas (default 10 menit), lalu kembali ke **slideshow** (gambar + video) atau **YouTube** livestream; **layar penuh** (kiosk); **marquee** teks berjalan; **grid jadwal** shalat hari ini. *RTSP* dari kamera perlu dikonversi dulu (mis. ke HLS/WebRTC/YouTube) karena browser tidak memutar RTSP mentah.
- **Admin** — menyimpan konfigurasi ke **localStorage**; dapat mengekspor/menempel **JSON**; **unggah gambar** (data URL, batas ±1,5MB) ke playlist.
- **Peringatan &lt;1 menit menuju adzan** — layar penuh (overlay) dengan **progress lingkaran** (60 detik terakhir), ringkasan **sisa detik & persen**, penanda **tiap 15 detik**, hitung mundur digital, dan gaya neobrutal; berlaku di **/** dan **/display**.
- **Suara** — beep ringan tiap **15 detik** saat &lt;1 menit (opsi admin); **beep panjang ~1,6 detik** saat waktu adzan tiba; pada **simulasi**, setelah adzan tampilan **kembali normal** (~2 detik) lalu hitungan diulang.
- **Simulasi (admin & URL)** — di **/admin**: pratinjau kritis dengan pilihan shalat, sisa detik (1–59), iframe dan tautan buka tab. URL: `/display?simulasi=kritis&shalat=maghrib&detik=45&sembunyi_menu=1` — hitungan **turun per detik**, beep mengikuti pengaturan, sama seperti produksi.
- **Stabilitas React** — jam `ClockHms` baru mengisi setelah mount (hindari error hidrasi); Zustand **`skipHydration`** + **rehydrate** di provider agar server dan klien selaras dengan `localStorage`.

Repositori sumber terbuka: [github.com/edo26/MasjidOS](https://github.com/edo26/MasjidOS).
- **Tema terang / gelap** manual atau **otomatis menurut jam (WIB)**; **beep** opsional saat waktu kritis; **polling** jadwal yang dapat disetel (default ±45s). YouTube livestream dapat **autoplay (mute)** agar sesuai kebijakan browser.

## Tech stack

| Area      | Pilihan                          |
| --------- | -------------------------------- |
| Framework | Next.js 15 (App Router)          |
| Bahasa    | TypeScript                        |
| Styling   | Tailwind CSS (gaya *neubrutalism*) |
| Waktu     | dayjs (timezone)                  |
| Animasi   | framer-motion                     |
| State     | Zustand + persist                 |
| Tema      | next-themes                       |
| Data      | API Route `/api/jadwal` (proxy)   |

## Arsitektur folder

```text
app/           Halaman, layout, API routes
components/    UI (neo/, prayer/, media/, layout/, display/, theme/)
config/        seed JSON
hooks/         usePrayerData, fullscreen, dsb
services/      Klien jadwal + fetch server myQuran
store/         Konfigurasi global
types/         Tipe TypeScript
utils/         Logika waktu shalat, beep (ring + adzan), YouTube
```

## Menjalankan web app (tutorial)

### Prasyarat

- **Node.js** versi **18.18** atau lebih baru (disarankan LTS), dan **npm** yang ikut terpasang.
- Koneksi internet pada mesin server saat **pertama kali** mengambil jadwal (proxy `/api/jadwal` memanggil `https://api.myquran.com`). Tanpa internet, halaman tetap bisa dibuka, tetapi pembaruan jadwal dari API tidak akan tersedia sampai koneksi kembali.

### 1. Unduh kode dan pasang dependensi

Di folder proyek MasjidOS:

```bash
npm install
```

### 2. Mode pengembangan (laptop / uji coba)

Cocok untuk menyunting kode atau mencoba cepat di satu komputer:

```bash
npm run dev
```

Buka browser ke [http://localhost:3000](http://localhost:3000).

| Rute        | Fungsi |
| ----------- | ------ |
| `/`         | Beranda |
| `/display`  | Mode TV / kiosk (`?simulasi=kritis` untuk uji tampilan &lt;1 menit) |
| `/admin`    | Konfigurasi (ID kota, playlist, dsb.) |

### 3. Mode produksi di jaringan lokal (disarankan untuk TV / tablet)

Build sekali, lalu jalankan server Next.js yang lebih ringan dan stabil untuk dipakai berjam-jam:

```bash
npm run build
npm start
```

Secara default app mendengarkan di **port 3000**. Dari komputer lain (misalnya TV dengan browser) di **Wi‑Fi/LAN yang sama**, buka:

`http://<IP-mesin-server>:3000/display`

Ganti `<IP-mesin-server>` dengan alamat IPv4 komputer yang menjalankan `npm start` (cek lewat pengaturan jaringan OS). Pastikan firewall mengizinkan koneksi masuk ke port tersebut bila perlu.

**Tips singkat**

- Setelah konfigurasi di **/admin** selesai, bookmark **/display** di perangkat TV agar langsung ke mode layar.
- Untuk kiosk, gunakan layar penuh dari browser atau OS; konfigurasi disimpan di **localStorage** per browser/perangkat.

### Skrip npm

| Perintah        | Keterangan        |
| --------------- | ----------------- |
| `npm run dev`   | Pengembangan      |
| `npm run build` | Build produksi    |
| `npm start`     | Jalankan hasil build |
| `npm run lint`  | Pemeriksaan ESLint |

## Konfigurasi

1. Buka **/admin** — isi **ID kota** (contoh: `1301` untuk [daftar API kota](https://api.myquran.com/v1/sholat/kota/semua)), nama masjid, dan batas **fokus hitung mundur** (detik).
2. **Playlist** — sunting array JSON: `image` / `poster` (gambar + `durationSec`) atau `video` (URL file yang bisa diputar di `<video>`).
3. **Livestream** — aktifkan, lalu set URL youtu.be / watch; embed disesuaikan otomatis.

## Lingkungan & fokus offline / lokal

- **Tidak perlu** variabel lingkungan khusus untuk jadwal: route server memanggil `https://api.myquran.com` saat build atau saat ada request ke `/api/jadwal`.
- Deploy ke **Vercel** atau PaaS lain **bukan jalur utama** untuk MasjidOS; arsitektur ini mengutamakan **satu mesin di masjid** yang menjalankan `npm start`, sehingga data sensitif dan traffic tetap di jaringan Anda.
- Gambar contoh memakai Unsplash; untuk produksi, simpan aset ke hosting/CDN sendiri atau file lokal sesuai kebutuhan.

### Query opsional `/display` (simulasi)

| Parameter         | Contoh | Keterangan |
| ----------------- | ------ | ---------- |
| `simulasi=kritis` | —      | Aktifkan overlay &amp; hitung mundur uji |
| `shalat`          | `maghrib` | Salah satu: `subuh`,`dzuhur`,`ashar`,`maghrib`,`isya` |
| `detik`           | `45`   | Nilai awal 1–59 (turun tiap detik) |
| `sembunyi_menu=1` | —      | Sembunyikan bar header Display |

## Lisensi

MIT — lihat [LICENSE](LICENSE).

## Kontribusi

Issue & PR diterima. Utamakan perubahan kecil, satu topik per PR.

---

# MasjidOS (English)

Open-source **mosque dashboard**: prayer schedule (Indonesia, WIB by default), live countdown, optional slideshow/YouTube, admin JSON, neubrutalism UI. **Intended to run on a local machine** (mini PC, etc.) on the mosque LAN — browsers on TVs/tablets open the server URL; **cloud deploy (e.g. Vercel) is not the primary path.** Prayer data: [myQuran](https://api.myquran.com/doc).

**Newer behavior:** full-screen **critical countdown** (last 60s) with a **circular progress** ring, beeps every 15s under one minute, **long beep (~1.6s)** at adhan time, **simulation mode** via `/admin` or `/display?simulasi=kritis&...` (ticking + audio like production, then returns to normal layout). **Hydration-safe** clock and persisted config.

**Repository:** [github.com/edo26/MasjidOS](https://github.com/edo26/MasjidOS)

**Run locally:** `npm install` → `npm run dev` (dev) or `npm run build` then `npm start` (production). Open `http://localhost:3000`; use `/display` for kiosk, `/admin` for config. On another device on the same network, use `http://<server-ip>:3000/display`.

**Scripts:** `npm run dev` · `npm run build` · `npm start` · `npm run lint`

**Routes:** `/` (home) · `/display` (kiosk) · `/admin` (config) · `GET /api/jadwal?kota={id}`

Pull requests and issues are welcome.
