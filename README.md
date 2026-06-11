<div align="center">
  <img src="web/public/truthlayer.png" alt="TruthLayer Logo" width="120" height="120" />
  <h1>TruthLayer</h1>
  <p><strong>Setiap website ingin sesuatu dari kamu. Sekarang kamu tahu apa itu.</strong></p>

  <p>
    <a href="https://truthlayer.io"><img src="https://img.shields.io/badge/version-1.0.0-7C3AED.svg?style=flat-square" alt="Version" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED.svg?style=flat-square" alt="License" /></a>
  </p>
</div>

<br />

TruthLayer adalah Chrome Extension yang menganalisis setiap website yang kamu kunjungi dan menampilkan niat tersembunyi, trust score (0–100), dark pattern, data tracking, kadar konten AI, dan taktik manipulasi — semuanya dalam satu klik.

**Tagline:** *"Setiap website ingin sesuatu dari kamu. Sekarang kamu tahu apa itu."*

---

## 📸 Antarmuka & Demonstrasi

TruthLayer dirancang agar mudah dibaca dalam sekejap tanpa mengganggu pengalaman browsing Anda. Berikut adalah tangkapan layar dari ekstensi saat digunakan:

### 1. Ekstensi Aktif di Lingkungan Publik
<div align="center">
  <img src="web/public/testinpublicurl.png" alt="TruthLayer Extension Public URL Test" width="720" />
  <p><em>Ekstensi TruthLayer aktif di toolbar Chrome, menganalisis website publik secara langsung dengan memberikan informasi trust score dan dark patterns.</em></p>
</div>

### 2. Pengujian di Lingkungan Lokal (Development)
<div align="center">
  <img src="web/public/testinlocalurl.png" alt="TruthLayer Extension Local URL Test" width="720" />
  <p><em>TruthLayer juga secara seamless mendukung pengujian di lingkungan localhost, memudahkan developer untuk mengevaluasi situs dan ekstensi secara lokal.</em></p>
</div>

### 3. Laporan Lengkap (Full Report)
<div align="center">
  <img src="web/public/full-report.png" alt="TruthLayer Full Report Page" width="720" />
  <p><em>Halaman Full Report komprehensif yang bisa dibagikan dan diakses publik untuk setiap domain — menyajikan detail mendalam mengenai trust score, niat tersembunyi, taktik manipulasi, dan analisis konten.</em></p>
</div>

---

## ✨ Fitur Utama

- **Trust Score (0–100)** — Skor kepercayaan website berdasarkan dark pattern, tracking, dan transparansi
- **Hidden Intent Analysis** — Niat tersembunyi website (primary, secondary, tertiary intent)
- **Dark Pattern Detection** — Deteksi 10+ pola manipulasi (fake urgency, confirmshaming, roach motel, disguised ads, dll)
- **Data Collection Audit** — Lacak pelacak dan data yang dikumpulkan
- **AI Content Estimator** — Estimasi persentase konten buatan AI
- **Manipulation Level** — Level manipulasi: low / medium / high / extreme
- **Viral Public Report** — Bagikan hasil analisis via `truthlayer.io/report/domain.com`

---

## 🚀 Quick Start

### 1. Backend API

```bash
cd backend
cp .env.example .env
npm install
npm start       # http://localhost:3001
```

### 2. Web Dashboard

```bash
cd web
npm install
npm run dev     # http://localhost:3000
```

### 3. Chrome Extension

1. Buka `chrome://extensions`
2. Aktifkan **Developer mode**
3. Klik **Load unpacked** → pilih folder `extension/`
4. Klik icon TruthLayer di toolbar untuk menganalisis website

### 4. Docker (Production)

```bash
docker-compose up
```

> **Windows:** `next build` mungkin error EISDIR di Node.js 22+. Gunakan `npm run dev` untuk development, atau Docker untuk production.

---

## 🏗 Arsitektur

```text
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Chrome Extension│────▶│  Backend API  │────▶│  Claude AI      │
│  (Manifest V3)  │     │  (Express.js) │     │  (Anthropic)    │
└─────────────────┘     └──────┬───────┘     └─────────────────┘
                               │
                        ┌──────▼───────┐
                        │  Redis Cache  │
                        └──────────────┘

┌─────────────────┐     ┌──────────────┐
│  Next.js Web    │◀────│  REST API    │
│  (Dashboard)    │     └──────────────┘
└─────────────────┘
```

---

## 📂 Struktur

```text
truthlayer/
├── extension/       # Chrome Extension (Manifest V3)
│   ├── popup/       # UI popup (HTML/CSS/JS)
│   ├── background/  # Service worker
│   └── content/     # Content script
├── backend/         # Node.js/Express API
│   ├── src/         # Routes, Services, Middleware
│   └── tests/       # Jest (13 tests)
├── web/             # Next.js 15 (Landing + Report + Dashboard)
│   ├── app/         # Pages & Components
│   └── components/  # TrustScore, IntentList, DarkPatternBadge
├── shared/          # TypeScript types & constants
└── docs/            # Screenshots & docs
```

---

## 🔒 Privasi

- `activeTab` — analisis hanya saat icon diklik
- `storage` — cache lokal 24 jam
- Tidak ada data pribadi yang dikirim ke server

---

## 📄 Lisensi

MIT
