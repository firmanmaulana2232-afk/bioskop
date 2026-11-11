# 🎬 PANDUAN INTEGRASI SISTEM BIOSKOP KE GOOGLE SPREADSHEET

Sistem ini menghubungkan **Stand Makanan di Lapangan** dan **Pintu Bioskop di Kelas** secara *real-time* menggunakan Google Sheets sebagai database pusat.

---

## 📋 Langkah 1: Buat Google Spreadsheet Baru
1. Buka browser dan kunjungi [Google Sheets](https://sheets.google.com).
2. Buat spreadsheet baru (Blank Spreadsheet).
3. Beri nama file, misalnya: **`Database Bioskop Kelas`**.

---

## ⚙️ Langkah 2: Pasang Kode Google Apps Script
1. Di halaman spreadsheet, klik menu **Ekstensi (Extensions)** > **Apps Script**.
2. Hapus semua teks yang ada di jendela editor `Code.gs`.
3. Buka file **`google-apps-script.js`** yang ada di folder:
   `D:\Tugas-Bioskop\2-Aplikasi\kode-web\google-apps-script.js`
4. **Copy seluruh kodenya** dan **Paste** ke editor Apps Script.
5. Klik ikon **Simpan (Save)** atau tekan `Ctrl + S`.

---

## 🚀 Langkah 3: Deploy (Terapkan) Menjadi Web App
1. Di pojok kanan atas Apps Script, klik tombol biru **Terapkan (Deploy)** > **Deployment baru (New deployment)**.
2. Klik ikon gerigi (⚙️) di samping *Pilih jenis*, lalu pilih **Aplikasi Web (Web app)**.
3. Atur konfigurasi berikut (SANGAT PENTING):
   - **Deskripsi:** `API Bioskop`
   - **Jalankan sebagai (Execute as):** `Saya (Me)`
   - **Yang memiliki akses (Who has access):** **`Siapa saja (Anyone)`**  
     *(Wajib pilih "Siapa saja" agar perangkat HP/Laptop stand dan kelas bisa mengirim data tanpa perlu login akun Google).*
4. Klik **Terapkan (Deploy)**.
5. Jika muncul jendela izin keamanan Google ("Authorization Required"):
   - Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) di kiri bawah, lalu klik **Go to API Bioskop (unsafe)**.
   - Klik **Allow** (Izinkan).
6. Salin **URL Aplikasi Web (Web App URL)** yang berakhiran `/exec`.

---

## 🔗 Langkah 4: Hubungkan ke Web Kasir & Bioskop
1. Buka file `index.html` di browser Anda (atau hosting-kan di GitHub Pages / Netlify / Vercel jika ingin diakses online dari HP lapangan & kelas).
2. Di header kanan atas web, klik ikon roda gigi **⚙️ (Pengaturan)** atau klik tombol status koneksi.
3. Tempel (Paste) URL Web App yang tadi Anda salin ke kolom input.
4. Klik tombol **Simpan URL** atau **Tes Koneksi**.
5. Jika berhasil, status di header akan berubah menjadi:
   `🟢 Terhubung Spreadsheet`.

---

## 🎯 Cara Kerja di Lapangan & Kelas

### 1. Di Lapangan (Stand Makanan)
- Petugas stand membuka web dan memilih **🍿 Stand Makanan (Lapangan)**.
- Masukkan Nama Stand dan Nama Pembeli.
- Pilih menu makanan (minimal Rp15.000 untuk dapat 1 tiket bonus nonton).
- Klik **Konfirmasi Pembelian & Buat Tiket**.
- Data otomatis terkirim ke baris baru Google Sheets.
- Berikan **6 Karakter Kode Tiket** (misalnya `1A8KM9`) atau kirim via chat ke pembeli.

### 2. Di Kelas (Penjaga Pintu Bioskop)
- Penjaga pintu bioskop membuka web dan memilih **🎟️ Pintu Bioskop (Kelas)**.
- Saat penonton datang, masukkan 6 digit kode tiketnya dan klik **🔍 Cek Tiket di Database**.
- Sistem akan membaca langsung dari Google Sheets:
  - Nama pembeli
  - Dari stand mana
  - Sisa kuota tiket masuk
- Klik **🎟️ Konfirmasi Masuk**.
- Status tiket di Google Sheets langsung terupdate menjadi `SUDAH HABIS TERPAKAI` dan dicatat jam masuknya.
- Jika tiket yang sama dimasukkan lagi oleh orang lain, sistem akan otomatis **menolak (merah)** untuk mencegah kecurangan.

### 3. Rekapitulasi Riil
- Buka panel **📊 Rekap** untuk melihat:
  - Jumlah Pembeli Riil (Total Transaksi unik)
  - Total Omzet Penjualan (Rp)
  - Tiket Dibagikan vs Tiket Terpakai (Penonton Masuk Riil)
  - Sisa penonton yang belum masuk
- Anda juga bisa mengekspor laporan ke file **CSV** kapan saja dengan tombol unduh.
