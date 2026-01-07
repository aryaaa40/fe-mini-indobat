# Mini Indobat Dashboard (Frontend)

Aplikasi Single Page Application (SPA) untuk manajemen stok obat dan pemesanan secara real-time. Dibangun menggunakan Next.js, TypeScript, dan Tailwind CSS.

## Fitur Utama

### Dashboard Real-time
Menampilkan daftar obat, harga, dan sisa stok yang diambil langsung dari API.

### Formulir Pemesanan
- Dropdown pilihan obat yang dinamis
- Perhitungan estimasi harga otomatis (Subtotal - Diskon)
- Validasi input (hanya angka dan batas maksimal diskon 100%)

### State Management & UX
- **Loading State**: Tombol dinonaktifkan saat proses transaksi untuk mencegah klik ganda
- **Feedback Notifikasi**: Menggunakan react-hot-toast untuk informasi sukses dan pesan error dari server (seperti stok habis)
- **Reset Form**: Formulir otomatis bersih setelah pesanan berhasil dibuat

## Teknologi yang Digunakan

- **Framework**: Next.js 14+ (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Cara Menjalankan di Localhost

### 1. Prasyarat

Pastikan Anda sudah menginstal:
- Node.js versi 18 atau terbaru
- Backend API yang sudah berjalan di port 8080

### 2. Instalasi

Install dependensi:
```bash
npm install
```

### 3. Menjalankan Aplikasi
```bash
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

## Struktur Folder
```
frontend/
├── src/
│   ├── app/              # Halaman utama dan layout aplikasi
│   ├── components/       # Komponen UI (Dashboard & OrderForm)
│   ├── services/         # Logika integrasi API menggunakan Axios
│   └── types/            # Definisi interface TypeScript untuk data Product & Order
├── public/               # Asset statis
└── package.json          # Dependencies
```

## Penanganan Race Condition

Aplikasi ini menangani potensi race condition dengan:

1. **Loading State Protection**: Menampilkan status loading pada tombol submit untuk mencegah pengiriman data berulang (double submit)
2. **Error Handling**: Menampilkan pesan error spesifik jika stok tiba-tiba tidak mencukupi saat proses transaksi diproses oleh Backend
3. **Optimistic UI Updates**: Merefresh data produk setelah transaksi berhasil untuk memastikan informasi stok selalu terkini

## Screenshots

### Dashboard Produk
<img width="1914" height="969" alt="Screenshot 2026-01-07 141246" src="https://github.com/user-attachments/assets/e707830a-622f-4523-bbc3-b393d91d64e0" />

### Form Pemesanan
<img width="1911" height="969" alt="Screenshot 2026-01-07 142037" src="https://github.com/user-attachments/assets/03b3b71c-ce9f-4e21-a6c8-eb234b7bc6fa" />

### Error Handling
<img width="1917" height="972" alt="Screenshot 2026-01-07 142103" src="https://github.com/user-attachments/assets/9b2f3b66-ca56-497b-ad30-b30d5ea0c7b0" />

