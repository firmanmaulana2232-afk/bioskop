# 🎬 Proyek Tugas Bioskop & Kasir Stand Terhubung

Aplikasi kasir stand makanan dan sistem tiket bioskop yang menghubungkan **Penjaga Stand di Lapangan** dan **Penjaga Bioskop di Kelas** secara *real-time* via **Google Spreadsheet**.

---

## 📂 Struktur Folder Proyek yang Sudah Dirapikan

```text
D:\Tugas-Bioskop\
├── 1-Persiapan/                 # Dokumen persiapan acara
│   ├── aturan-bonus-tiket.txt   # Ketentuan minimal belanja untuk bonus tiket
│   ├── daftar-menu-harga.txt    # Daftar menu makanan & harga jual
│   └── jadwal-jaga.txt          # Jadwal giliran jaga stand dan bioskop
│
├── 2-Aplikasi/                  # Aplikasi Web & Panduan
│   ├── Buka-Bioskop.bat         # Shortcut praktis untuk membuka aplikasi
│   ├── bioskop.html             # Pintasan web bioskop
│   ├── link-kasir-bioskop.txt   # Panduan link & hosting online
│   ├── panduan-penggunaan.txt   # SOP untuk penjaga stand & penjaga pintu
│   ├── PANDUAN_SETUP_SPREADSHEET.md # Panduan lengkap integrasi Google Sheets
│   └── kode-web/                # Sumber kode web
│       ├── bioskop.html         # File utama aplikasi web
│       ├── index.html           # Salinan kompatibilitas hosting
│       ├── google-apps-script.js# Script backend untuk Google Sheets
│       ├── BACA-DULU.txt        # Catatan kode web
│       └── assets/              # Gambar web (splash, lobi, makanan .webp)
│
├── 3-Data/                      # Data Transaksi & Rekapitulasi
│   └── rekap-bioskop.xlsx       # Template & rekaman rekapitulasi data
│
├── 4-Dokumentasi/               # Arsip Foto & Aset Desain
│   ├── foto-pintu-bioskop/      # Foto dokumentasi pintu masuk bioskop (kelas)
│   ├── foto-stand-penjual/      # Foto dokumentasi kegiatan stand (lapangan)
│   └── aset-gambar-desain/      # Arsip aset gambar mentah (.jpg & .svg)
│
├── 5-Laporan/                   # Laporan akhir tugas
│
├── Buka-Bioskop.bat             # Cukup klik 2x ini untuk menjalankan aplikasi!
└── PANDUAN_SETUP_SPREADSHEET.md # Panduan cepat Google Spreadsheet
```

---

## ⚡ Cara Cepat Menggunakan Aplikasi

1. **Jalankan Aplikasi:**
   - Cukup klik dua kali file **`Buka-Bioskop.bat`** di folder ini.
   - Atau buka file **`bioskop.html`**.
2. **Koneksikan ke Google Sheets:**
   - Ikuti panduan di [`PANDUAN_SETUP_SPREADSHEET.md`](file:///D:/Tugas-Bioskop/PANDUAN_SETUP_SPREADSHEET.md).
   - Masukkan URL Google Apps Script ke menu **⚙️ (Pengaturan)** di web.
3. **Mulai Transaksi:**
   - **Stand Lapangan:** Input pesanan & nama pembeli -> buat tiket.
   - **Pintu Bioskop (Kelas):** Masukkan kode 6 karakter -> validasi -> konfirmasi masuk.
