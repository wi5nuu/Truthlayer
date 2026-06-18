'use client';

import { useState } from 'react';

const docs = [
  {
    id: 'download',
    title: 'Cara Download',
    icon: '⬇️',
    content: (
      <div className="space-y-4">
        <p className="text-dark-300 leading-relaxed">
          TruthLayer tersedia sebagai Chrome Extension. Anda bisa mendapatkannya langsung dari GitHub.
        </p>
        <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 space-y-3">
          <p className="text-sm font-semibold text-dark-100">Opsi 1: Download ZIP</p>
          <a href="https://github.com/wi5nuu/Truthlayer/archive/refs/heads/main.zip"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-semibold text-white transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download ZIP
          </a>
          <p className="text-xs text-dark-500">Atau clone via Git: <code className="text-primary-400 bg-dark-800 px-1 rounded">git clone https://github.com/wi5nuu/Truthlayer.git</code></p>
        </div>
      </div>
    ),
  },
  {
    id: 'install',
    title: 'Cara Install',
    icon: '🔧',
    content: (
      <div className="space-y-4">
        <p className="text-dark-300 leading-relaxed">Ikuti 6 langkah berikut untuk memasang TruthLayer di browser Anda:</p>
        <ol className="space-y-3">
          {[
            { n: 1, t: 'Buka halaman extensions', d: 'Ketik <code class="text-primary-400 bg-dark-800 px-1 rounded">chrome://extensions</code> di address bar. Untuk Edge: <code class="text-primary-400 bg-dark-800 px-1 rounded">edge://extensions</code>' },
            { n: 2, t: 'Aktifkan Developer Mode', d: 'Toggle switch "Developer mode" di pojok kanan atas' },
            { n: 3, t: 'Klik Load Unpacked', d: 'Pilih folder <code class="text-primary-400 bg-dark-800 px-1 rounded">extension/</code> dari project TruthLayer' },
            { n: 4, t: 'Pin Extension', d: 'Klik icon puzzle di toolbar, cari TruthLayer, lalu pin' },
            { n: 5, t: 'Jalankan Backend', d: 'Buka terminal: <code class="text-primary-400 bg-dark-800 px-1 rounded">cd backend && npm start</code>' },
            { n: 6, t: 'Mulai Analisis', d: 'Kunjungi website mana pun, klik icon TruthLayer untuk melihat hasil analisis' },
          ].map(s => (
            <li key={s.n} className="flex gap-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700">
              <span className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{s.n}</span>
              <div><p className="text-sm font-semibold text-dark-100">{s.t}</p><p className="text-xs text-dark-400 mt-0.5" dangerouslySetInnerHTML={{ __html: s.d }} /></div>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    id: 'browsers',
    title: 'Browser Support',
    icon: '🌐',
    content: (
      <div className="space-y-4">
        <p className="text-dark-300 leading-relaxed">TruthLayer mendukung semua browser berbasis Chromium:</p>
        {[
          { b: 'Google Chrome', s: '✅ Supported', v: 'Chrome 88+', n: 'Fitur penuh — Manifest V3' },
          { b: 'Microsoft Edge', s: '✅ Supported', v: 'Edge 88+', n: 'Fitur penuh — Chromium' },
          { b: 'Brave', s: '✅ Supported', v: 'Brave 1.0+', n: 'Fitur penuh — Chromium' },
          { b: 'Opera', s: '✅ Supported', v: 'Opera 74+', n: 'Via Load Unpacked' },
          { b: 'Vivaldi', s: '✅ Supported', v: 'Vivaldi 3.0+', n: 'Fitur penuh — Chromium' },
          { b: 'Firefox', s: '🔄 Coming Soon', v: '—', n: 'Dalam pengembangan' },
          { b: 'Safari', s: '🔄 Planned', v: '—', n: 'On roadmap' },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-dark-700 text-sm">
            <span className="font-semibold text-dark-100">{row.b}</span>
            <span className="text-xs text-dark-400">{row.s}</span>
          </div>
        ))}
        <p className="text-xs text-dark-500">Semua browser Chromium didukung penuh dengan fitur identik.</p>
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Fitur Lengkap',
    icon: '⭐',
    content: (
      <div className="space-y-4">
        <p className="text-dark-300 leading-relaxed">TruthLayer dilengkapi dengan fitur analisis website terlengkap:</p>
        {[
          { t: 'Trust Score 0–100', d: 'Skor kepercayaan website berdasarkan AI dan rule-based detection' },
          { t: 'Hidden Intent Analysis', d: 'Deteksi niat utama, sekunder, dan tersier website terhadap pengunjung' },
          { t: 'Dark Pattern Detection', d: '20+ pola manipulasi: fake urgency, confirmshaming, roach motel, disguised ads, dll' },
          { t: 'Data Collection Audit', d: 'Lacak semua tracker, cookie (first/third-party), dan data yang dikumpulkan' },
          { t: 'AI Content Estimation', d: 'Estimasi persentase konten buatan AI beserta confidence level' },
          { t: 'Manipulation Level', d: 'Tingkat manipulasi: Rendah / Sedang / Tinggi / Ekstrim' },
          { t: 'Public Report', d: 'Bagikan hasil analisis via tautan publik truthlayer.io/report/domain.com' },
          { t: 'Local Cache 24 Jam', d: 'Hasil analisis disimpan lokal, tidak perlu analisis ulang untuk domain sama' },
        ].map((f, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
            <div><p className="text-sm font-semibold text-dark-100">{f.t}</p><p className="text-xs text-dark-400 mt-0.5">{f.d}</p></div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'faq',
    title: 'Pertanyaan Umum',
    icon: '❓',
    content: (
      <div className="space-y-4">
        {[
          { q: 'Apakah TruthLayer mengumpulkan data pribadi?', a: 'Tidak. TruthLayer hanya mengirim metadata publik (judul, heading, tracker domain) ke server. Konten mentah halaman tidak pernah dikirim atau disimpan.' },
          { q: 'Apakah extension memperlambat browser?', a: 'Tidak. Extension hanya aktif saat icon diklik. Tidak ada proses background yang berjalan terus-menerus.' },
          { q: 'Apakah perlu akun untuk menggunakan?', a: 'Tidak perlu. TruthLayer bekerja penuh tanpa registrasi atau login.' },
          { q: 'Kenapa hasil analisis saya berbeda dengan orang lain?', a: 'Trust score bisa berbeda karena caching 24 jam. Setiap analisis baru akan memperbarui skor.' },
          { q: 'Bagaimana cara reset cache?', a: 'Buka chrome://extensions → klik Details pada TruthLayer → Extension options → Clear cache.' },
          { q: 'Apakah backend harus selalu jalan?', a: 'Ya. Extension membutuhkan backend server berjalan di localhost:3001. Versi cloud sedang dikembangkan.' },
        ].map((item, i) => (
          <details key={i} className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
            <summary className="text-sm font-semibold text-dark-100 cursor-pointer">{item.q}</summary>
            <p className="text-xs text-dark-400 mt-2 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    ),
  },
  {
    id: 'troubleshoot',
    title: 'Troubleshooting',
    icon: '🔍',
    content: (
      <div className="space-y-4">
        <p className="text-dark-300 leading-relaxed">Solusi untuk masalah umum:</p>
        {[
          { p: 'Analisis gagal', s: 'Pastikan backend berjalan (cd backend && npm start). Periksa juga koneksi internet.' },
          { p: 'Content script not responding', s: 'Refresh halaman yang sedang dibuka, lalu klik icon TruthLayer lagi.' },
          { p: 'Server not connected', s: 'Jalankan backend server di terminal terpisah: cd backend && npm start' },
          { p: 'Trust score tidak berubah', s: 'Cache 24 jam. Tunggu hingga TTL habis atau clear cache di Options page.' },
          { p: 'Extension tidak muncul', s: 'Buka chrome://extensions, pastikan Developer mode aktif dan TruthLayer terload.' },
          { p: 'Build gagal di Netlify', s: 'Pastikan Base directory = web, Build command = npm run build, Publish = .next' },
        ].map((item, i) => (
          <div key={i} className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
            <p className="text-sm font-semibold text-dark-100">⚠️ {item.p}</p>
            <p className="text-xs text-dark-400 mt-1">✅ {item.s}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: '📡',
    content: (
      <div className="space-y-4">
        <p className="text-dark-300 leading-relaxed">Backend API endpoints:</p>
        <div className="space-y-2">
          {[
            { m: 'GET', p: '/health', d: 'Health check server' },
            { m: 'POST', p: '/api/v1/analyze', d: 'Analisis website (body: pageData, tier)' },
            { m: 'GET', p: '/api/v1/report/:domain', d: 'Ambil hasil analisis domain' },
            { m: 'GET', p: '/api/v1/report/:domain/history', d: 'Riwayat analisis (paginated)' },
            { m: 'GET', p: '/api/v1/export/:domain/json', d: 'Export JSON' },
            { m: 'GET', p: '/api/v1/export/:domain/csv', d: 'Export CSV' },
          ].map((ep, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-dark-900/50 rounded-lg border border-dark-700 text-xs font-mono">
              <span className={`px-1.5 py-0.5 rounded font-bold ${
                ep.m === 'GET' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
              }`}>{ep.m}</span>
              <span className="text-primary-400 flex-1">{ep.p}</span>
              <span className="text-dark-500">{ep.d}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState(docs[0].id);
  const [menuOpen, setMenuOpen] = useState(false);

  const active = docs.find(d => d.id === activeDoc) || docs[0];

  return (
    <main className="min-h-screen gradient-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-dark-700/40">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/truthlayer.png" alt="TruthLayer" className="w-8 h-8 object-contain" />
          <span className="font-bold text-sm">truthlayer.io</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-dark-400 hover:text-primary-400 transition-colors">Home</a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-dark-400 text-xs">Menu</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT SPACER (can be used for report later) */}

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 order-2 md:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{active.icon}</span>
              <h1 className="text-2xl font-bold text-dark-100">{active.title}</h1>
            </div>
            <div className="bg-dark-800/40 border border-dark-700 rounded-2xl p-6">
              {active.content}
            </div>
          </div>

          {/* RIGHT SIDEBAR — Documentation navigation */}
          <aside className="w-full md:w-64 flex-shrink-0 order-1 md:order-2">
            <div className="md:sticky md:top-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-500 mb-4">Documentation</h3>
              <nav className="flex flex-col gap-1">
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => { setActiveDoc(doc.id); setMenuOpen(false); }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                      activeDoc === doc.id
                        ? 'bg-primary-600/15 border border-primary-600/30 text-primary-400 font-semibold'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/60 border border-transparent'
                    }`}
                  >
                    <span className="text-sm">{doc.icon}</span>
                    <span>{doc.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 p-4 bg-dark-800/60 rounded-xl border border-dark-700">
                <p className="text-xs text-dark-500 mb-2">Butuh bantuan langsung?</p>
                <a href="https://github.com/wi5nuu/Truthlayer/issues"
                  className="text-xs text-primary-400 hover:text-primary-300 underline">
                  Laporkan Issue di GitHub →
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-700/40 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">TruthLayer &copy; {new Date().getFullYear()} — Documentation</p>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">Home</a>
            <a href="/download" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">Download</a>
            <a href="/about" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">About</a>
            <a href="/privacy" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
