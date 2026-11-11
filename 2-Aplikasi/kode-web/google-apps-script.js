/**
 * =====================================================================
 * BACKEND GOOGLE APPS SCRIPT - BIOSKOP KELAS & KASIR STAND
 * =====================================================================
 * Petunjuk Pemasangan:
 * 1. Buka Google Sheets baru di https://sheets.google.com
 * 2. Beri nama file Spreadsheet, misalnya: "Database Bioskop Kelas"
 * 3. Klik menu: Ekstensi (Extensions) > Apps Script
 * 4. Hapus semua kode bawaan di editor Apps Script, lalu PASTE SELURUH KODE INI.
 * 5. Klik ikon Simpan (Ctrl+S / Cmd+S).
 * 6. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Deployment baru" (New deployment).
 * 7. Pilih jenis: "Aplikasi Web" (Web app).
 * 8. Konfigurasi:
 *    - Deskripsi: API Bioskop
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> PENTING agar web kasir & pintu bisa akses tanpa login Google!
 * 9. Klik "Terapkan" (Deploy), berikan izin akses (Authorize Access) jika diminta Google.
 * 10. Salin URL Aplikasi Web (Web App URL) yang berakhiran `/exec`, lalu masukkan ke pengaturan Web HTML.
 * =====================================================================
 */

const SHEET_TRANSAKSI = "Transaksi";
const SHEET_REKAP = "Dashboard Rekap";

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Transaksi
  const sheetTx = getOrCreateSheet(ss, SHEET_TRANSAKSI);
  if (sheetTx.getLastRow() === 0) {
    const headers = [
      "Waktu Transaksi",
      "Kode Tiket",
      "Nama Pembeli",
      "Stand / Penjual",
      "Menu Pesanan",
      "Total Belanja (Rp)",
      "Tiket Bonus",
      "Tiket Terpakai",
      "Sisa Tiket",
      "Status Tiket",
      "Waktu Check-in Terakhir"
    ];
    sheetTx.appendRow(headers);
    sheetTx.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#b3261e")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
    sheetTx.setFrozenRows(1);
    sheetTx.autoResizeColumns(1, headers.length);
  }

  // 2. Sheet Dashboard Rekap
  const sheetRekap = getOrCreateSheet(ss, SHEET_REKAP);
  if (sheetRekap.getLastRow() === 0) {
    sheetRekap.getRange("A1:B1").merge().setValue("📊 DASHBOARD STATISTIK BIOSKOP").setFontWeight("bold").setBackground("#2a1612").setFontColor("#f5b942");
    sheetRekap.getRange("A3").setValue("Jumlah Transaksi (Pembeli Riil)");
    sheetRekap.getRange("B3").setFormula(`=COUNTA(${SHEET_TRANSAKSI}!A2:A)`);
    sheetRekap.getRange("A4").setValue("Total Omzet Penjualan (Rp)");
    sheetRekap.getRange("B4").setFormula(`=SUM(${SHEET_TRANSAKSI}!F2:F)`);
    sheetRekap.getRange("A5").setValue("Total Tiket Dibagikan");
    sheetRekap.getRange("B5").setFormula(`=SUM(${SHEET_TRANSAKSI}!G2:G)`);
    sheetRekap.getRange("A6").setValue("Total Penonton Masuk (Riil)");
    sheetRekap.getRange("B6").setFormula(`=SUM(${SHEET_TRANSAKSI}!H2:H)`);
    sheetRekap.getRange("A7").setValue("Tiket Belum Digunakan");
    sheetRekap.getRange("B7").setFormula(`=SUM(${SHEET_TRANSAKSI}!I2:I)`);
    sheetRekap.getRange("A3:A7").setFontWeight("bold");
    sheetRekap.getRange("B3:B7").setHorizontalAlignment("center").setFontWeight("bold");
    sheetRekap.autoResizeColumns(1, 2);
  }
}

// Handler GET: Ambil data / Cek tiket
function doGet(e) {
  try {
    initSheets();
    const action = (e.parameter && e.parameter.action) || "getAll";
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_TRANSAKSI);
    const data = sheet.getDataRange().getValues();

    if (action === "getAll") {
      const sales = {};
      let totalPembeli = 0;
      let totalOmzet = 0;
      let totalTiket = 0;
      let penontonMasuk = 0;

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[1]) continue; // Lewati baris kosong
        const code = String(row[1]).trim().toUpperCase();
        const buyer = String(row[2] || "");
        const seller = String(row[3] || "");
        const items = String(row[4] || "");
        const total = Number(row[5]) || 0;
        const tickets = Number(row[6]) || 0;
        const used = Number(row[7]) || 0;
        const status = String(row[9] || "BELUM DIPAKAI");
        const lastIn = row[10] ? String(row[10]) : "";
        const time = row[0] ? String(row[0]) : "";

        sales[code] = {
          code: code,
          buyer: buyer,
          seller: seller,
          items: items,
          total: total,
          tickets: tickets,
          used: used,
          status: status,
          lastIn: lastIn,
          time: time,
          ts: Date.now()
        };

        totalPembeli++;
        totalOmzet += total;
        totalTiket += tickets;
        penontonMasuk += used;
      }

      return jsonResponse({
        ok: true,
        sales: sales,
        stats: {
          totalPembeli: totalPembeli,
          totalOmzet: totalOmzet,
          totalTiket: totalTiket,
          penontonMasuk: penontonMasuk,
          sisaTiket: Math.max(0, totalTiket - penontonMasuk)
        }
      });
    }

    if (action === "checkTicket") {
      const targetCode = String(e.parameter.code || "").trim().toUpperCase();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]).trim().toUpperCase() === targetCode) {
          const row = data[i];
          return jsonResponse({
            ok: true,
            found: true,
            ticket: {
              code: row[1],
              buyer: row[2],
              seller: row[3],
              items: row[4],
              total: row[5],
              tickets: Number(row[6]) || 0,
              used: Number(row[7]) || 0,
              left: (Number(row[6]) || 0) - (Number(row[7]) || 0),
              status: row[9]
            }
          });
        }
      }
      return jsonResponse({ ok: true, found: false, message: "Kode tiket tidak ditemukan di spreadsheet" });
    }

    return jsonResponse({ ok: false, error: "Action tidak dikenal" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// Handler POST: Buat transaksi baru atau Check-in tiket
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Kunci agar tidak terjadi bentrok saat banyak yang akses
    initSheets();
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_TRANSAKSI);

    // 1. Aksi: Kasir Simpan Pembelian Baru
    if (action === "buy") {
      const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
      const code = String(payload.code).trim().toUpperCase();
      const buyer = String(payload.buyer || "Pembeli Umum").trim();
      const seller = String(payload.seller || "").trim();
      const items = String(payload.items || "");
      const total = Number(payload.total) || 0;
      const tickets = Number(payload.tickets) || 0;
      const used = 0;
      const sisa = tickets;
      const status = "BELUM DIPAKAI";
      const lastIn = "-";

      sheet.appendRow([
        nowStr,
        code,
        buyer,
        seller,
        items,
        total,
        tickets,
        used,
        sisa,
        status,
        lastIn
      ]);

      return jsonResponse({ ok: true, message: "Transaksi berhasil dicatat", code: code });
    }

    // 2. Aksi: Penjaga Bioskop Konfirmasi Tiket Masuk
    if (action === "useTicket") {
      const targetCode = String(payload.code).trim().toUpperCase();
      const countToUse = Number(payload.count) || 1;
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]).trim().toUpperCase() === targetCode) {
          rowIndex = i + 1; // 1-based index
          break;
        }
      }

      if (rowIndex === -1) {
        return jsonResponse({ ok: false, error: "Tiket tidak terdaftar di spreadsheet!" });
      }

      const currentRow = data[rowIndex - 1];
      const tickets = Number(currentRow[6]) || 0;
      const currentUsed = Number(currentRow[7]) || 0;
      const newUsed = Math.min(tickets, currentUsed + countToUse);
      const newSisa = Math.max(0, tickets - newUsed);
      const newStatus = newSisa === 0 ? "SUDAH HABIS TERPAKAI" : `TERPAKAI SEBAGIAN (${newUsed}/${tickets})`;
      const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");

      // Update kolom: H (Tiket Terpakai), I (Sisa), J (Status), K (Waktu Check-in)
      sheet.getRange(rowIndex, 8).setValue(newUsed);
      sheet.getRange(rowIndex, 9).setValue(newSisa);
      sheet.getRange(rowIndex, 10).setValue(newStatus);
      sheet.getRange(rowIndex, 11).setValue(nowStr);

      return jsonResponse({
        ok: true,
        message: "Check-in berhasil!",
        used: newUsed,
        tickets: tickets,
        left: newSisa
      });
    }

    return jsonResponse({ ok: false, error: "Action POST tidak valid" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
