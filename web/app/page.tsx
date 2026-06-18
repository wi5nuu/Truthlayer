'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/* ══════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════ */

const demoSites = [
  { domain: 'amazon.com',    score: 62, label: 'Cukup Terpercaya',      color: '#FBBF24' },
  { domain: 'wikipedia.org', score: 94, label: 'Sangat Terpercaya',     color: '#26D9A8' },
  { domain: 'tiktok.com',    score: 38, label: 'Potensial Manipulatif', color: '#F97316' },
  { domain: 'nytimes.com',   score: 71, label: 'Cukup Terpercaya',      color: '#1DB88F' },
];

const stats = [
  { value: '10,000+', label: 'Pengguna Aktif' },
  { value: '500,000+', label: 'Website Dianalisis' },
  { value: '98%', label: 'Akurasi Deteksi' },
];

const testimonials = [
  { name: 'Ahmad S.', role: 'Software Engineer', text: 'Sekarang saya bisa lihat website mana yang benar-benar trustworthy sebelum memberikan data pribadi saya.' },
  { name: 'Dewi P.', role: 'Content Creator', text: 'Mind-blowing! Ternyata website favorit saya penuh dark patterns selama ini. TruthLayer wajib dimiliki!' },
];

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Trust Score Analysis',
    desc: 'Setiap website mendapat skor kepercayaan 0–100 berdasarkan 40+ sinyal yang dianalisis secara real-time menggunakan AI. Skor mencerminkan transparansi, keamanan, dan niat website.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: 'Hidden Intent Detection',
    desc: 'TruthLayer mengidentifikasi agenda tersembunyi website — apakah mereka benar-benar melayani pengguna, atau diam-diam mengumpulkan data, mendorong pembelian impulsif, atau memanipulasi opini.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Dark Pattern Recognition',
    desc: 'Deteksi otomatis 20+ jenis dark pattern: fake urgency, hidden subscriptions, confirm-shaming, misdirection, roach motel, dan banyak lagi — langsung disorot di halaman.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: 'Data Collection Tracker',
    desc: 'Lihat berapa banyak data yang dikumpulkan, jenis data apa yang dikumpulkan, dan ke pihak mana data dikirimkan. Visibilitas penuh atas jejak data Anda di setiap website.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Content Detection',
    desc: 'Identifikasi persentase konten yang dibuat oleh AI vs manusia, termasuk deteksi deepfake, artikel yang digenerate otomatis, dan review palsu yang menyesatkan.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Manipulation Level Meter',
    desc: 'Pengukur tingkat manipulasi dalam 4 level: Rendah, Sedang, Tinggi, dan Ekstrim. Didasarkan pada analisis psikologi desain dan pola UX yang eksploitatif.',
  },
];

const permissions = [
  {
    name: 'activeTab',
    reason: 'Membaca konten halaman aktif untuk analisis trust score. Hanya aktif saat Anda mengklik ikon ekstensi — tidak berjalan di latar belakang.',
    risk: 'low',
  },
  {
    name: 'storage',
    reason: 'Menyimpan hasil analisis secara lokal di perangkat Anda (cache 24 jam) untuk mempercepat analisis website yang sama. Tidak ada data yang dikirim ke server kami tanpa izin.',
    risk: 'low',
  },
  {
    name: 'tabs',
    reason: 'Mendeteksi URL halaman yang sedang Anda kunjungi agar dapat menjalankan analisis yang tepat. Tidak mengakses riwayat tab.',
    risk: 'low',
  },
  {
    name: 'scripting',
    reason: 'Menyuntikkan script ringan ke halaman untuk mengekstrak metadata publik (judul, meta tag, struktur DOM) sebagai bahan analisis.',
    risk: 'low',
  },
];

const privacyPoints = [
  { title: 'Tidak Ada Akun Wajib', desc: 'TruthLayer bekerja penuh tanpa registrasi. Tidak ada email, tidak ada password, tidak ada profil.' },
  { title: 'Data Lokal First', desc: 'Semua cache hasil analisis disimpan di storage browser lokal Anda. Kami tidak memiliki database pengguna.' },
  { title: 'Konten Halaman Tidak Disimpan', desc: 'Konten mentah halaman web yang Anda kunjungi tidak pernah disimpan atau dikirim ke server kami. Hanya metadata terstruktur yang dikirim untuk analisis.' },
  { title: 'Open Source Ready', desc: 'Kode sumber ekstensi dapat diaudit. Kami percaya transparansi adalah fondasi kepercayaan.' },
];

const faqs = [
  {
    q: 'Apakah TruthLayer membaca semua halaman yang saya buka secara otomatis?',
    a: 'Tidak. TruthLayer hanya aktif ketika Anda secara eksplisit mengklik ikon ekstensi di browser. Tidak ada analisis yang berjalan di latar belakang tanpa sepengetahuan Anda.',
  },
  {
    q: 'Bagaimana cara kerja trust score dihitung?',
    a: 'Trust score dihitung oleh AI engine kami berdasarkan 40+ sinyal: struktur halaman, pola bahasa, kode tracking yang terdeteksi, riwayat domain, metadata teknis, dan pola UX. Skor diperbarui setiap 24 jam.',
  },
  {
    q: 'Apakah data saya dijual ke pihak ketiga?',
    a: 'Tidak pernah. TruthLayer tidak memonetisasi data pengguna dalam bentuk apapun. Model bisnis kami berbasis langganan, bukan iklan atau penjualan data.',
  },
  {
    q: 'Apakah ekstensi ini memperlambat browser saya?',
    a: 'Tidak secara signifikan. TruthLayer hanya aktif on-demand (saat diklik) dan menggunakan caching agresif. Rata-rata penggunaan memori di bawah 5MB.',
  },
  {
    q: 'Browser apa saja yang didukung?',
    a: 'TruthLayer mendukung semua browser berbasis Chromium: Google Chrome (88+), Microsoft Edge (88+), Brave (1.0+), Opera (74+), dan Vivaldi (3.0+). Cukup ikuti petunjuk instalasi di halaman Download. Dukungan untuk Firefox dan Safari sedang dalam pengembangan.',
  },
  {
    q: 'Seberapa akurat deteksi dark pattern-nya?',
    a: 'Berdasarkan pengujian internal terhadap 10.000+ website, akurasi deteksi dark pattern mencapai 94% dengan false positive rate di bawah 3%. Model terus diperbarui.',
  },
];

const changelog = [
  {
    version: 'v2.0.0',
    date: 'Juni 2026',
    type: 'major',
    changes: [
      'Redesign UI total dengan tema teal profesional',
      'Tambah AI Content Detection engine',
      'Sistem caching yang lebih cerdas (24 jam TTL)',
      'Refactor arsitektur backend ke microservice',
      'Peningkatan akurasi trust score +15%',
    ],
  },
  {
    version: 'v1.5.0',
    date: 'April 2026',
    type: 'minor',
    changes: [
      'Tambah deteksi 8 jenis dark pattern baru',
      'Realtime clock di popup',
      'Perbaikan false positive pada e-commerce',
      'Optimasi performa analisis 2x lebih cepat',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Januari 2026',
    type: 'major',
    changes: [
      'Peluncuran perdana TruthLayer',
      'Trust score 0–100 berbasis AI',
      'Hidden intent detection dasar',
      'Deteksi 12 dark pattern',
      'Integrasi Chrome Web Store',
    ],
  },
];

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Browsers', href: '#browsers' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'FAQ', href: '#faq' },
];

/* ══════════════════════════════════════════════
   HOOKS
   ══════════════════════════════════════════════ */

function useCountUp(target: number, duration = 1200, start = false) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCurrent(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return current;
}

function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ══════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════ */

function ScoreCard({ site, delay }: { site: typeof demoSites[0]; delay: number }) {
  const { ref, inView } = useInView<HTMLAnchorElement>();
  const count = useCountUp(site.score, 1000, inView);
  return (
    <a ref={ref} href={`/report/${site.domain}`}
      className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col gap-3 group cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`} alt=""
          className="w-5 h-5 object-contain rounded"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <span className="text-sm font-semibold text-dark-100 group-hover:text-primary-400 transition-colors truncate">
          {site.domain}
        </span>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-4xl font-black leading-none" style={{ color: site.color }}>
          {inView ? count : 0}
        </span>
        <span className="text-dark-500 text-xs mb-1">/100</span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: inView ? `${site.score}%` : '0%', backgroundColor: site.color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: site.color }}>{site.label}</span>
    </a>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-primary-600/5 transition-colors"
      >
        <span className="font-semibold text-dark-100 text-sm leading-snug">{q}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`flex-shrink-0 text-primary-400 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-dark-400 leading-relaxed border-t border-dark-700/50">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════ */

export default function LandingPage() {
  const [domain, setDomain] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) window.location.href = `/report/${encodeURIComponent(domain.trim())}`;
  };

  return (
    <main className="min-h-screen gradient-bg overflow-x-hidden">

      {/* ══════ NAV ══════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-blur' : ''}`}>
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-[60px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden glow-teal-sm">
              <Image src="/truthlayer.png" alt="TruthLayer" fill className="object-contain" />
            </div>
            <span className="font-bold text-sm tracking-tight text-dark-50">truthlayer.io</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href}
                className="text-xs font-semibold text-dark-400 hover:text-primary-400 transition-colors tracking-wide">
                {l.label}
              </a>
            ))}
            <a href="/download"
              className="btn-primary text-xs px-4 py-2 rounded-xl font-bold text-white ml-2">
              Get Extension
            </a>
          </div>

          {/* Hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-dark-200 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-dark-200 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-dark-200 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-dark-200 font-medium text-base py-1">{l.label}</a>
          ))}
          <a href="/download" onClick={() => setMenuOpen(false)}
            className="btn-primary text-center py-3 rounded-xl font-bold text-white mt-2">
            Get Extension — Free
          </a>
        </div>
      </header>

      {/* ══════ HERO ══════ */}
      <section className="pt-32 pb-20 px-5 md:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/70 border border-primary-600/30 text-xs text-primary-400 font-semibold mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-blink" />
          Realtime Trust Analysis Engine · v2.0
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6 animate-fade-up">
          Every website wants<br />
          <span className="gradient-text-hero">something from you</span>
        </h1>

        <p className="text-base sm:text-lg text-dark-400 max-w-2xl mx-auto mb-10 animate-fade-up delay-200 leading-relaxed">
          Now you know what it is. TruthLayer reveals the hidden intentions,
          trust scores, and dark patterns of every website you visit.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 animate-fade-up delay-300">
          <a href="/download" className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white glow-teal">
            Add to Chrome — Free
          </a>
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
            <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)}
              placeholder="Check any website..."
              className="input-teal flex-1 sm:w-56 px-4 py-3.5 bg-dark-800/80 border border-dark-600 rounded-xl text-dark-100 placeholder-dark-500 text-sm transition-all" />
            <button type="submit"
              className="px-5 py-3.5 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl text-sm font-semibold text-dark-100 transition-all hover:border-primary-600/40">
              Analyze
            </button>
          </form>
        </div>

        <div className="inline-flex flex-wrap justify-center items-center gap-x-5 gap-y-2 px-6 py-3 bg-dark-800/40 border border-dark-700/50 rounded-2xl text-sm text-dark-400 animate-fade-up delay-400">
          <span>🔒 Private by design</span>
          <span className="hidden sm:block w-px h-4 bg-dark-700" />
          <span>⚡ Real-time analysis</span>
          <span className="hidden sm:block w-px h-4 bg-dark-700" />
          <span>🎯 98% accuracy</span>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ FEATURES ══════ */}
      <section id="features" className="py-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Semua yang Anda butuhkan</h2>
            <p className="text-dark-400 max-w-xl mx-auto text-sm leading-relaxed">
              TruthLayer dilengkapi dengan mesin analisis berlapis yang bekerja secara sinergi untuk memberi Anda gambaran lengkap tentang setiap website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-600/15 border border-primary-600/20 flex items-center justify-center text-primary-400 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-dark-50 mb-2">{f.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ HOW IT WORKS ══════ */}
      <section id="how-it-works" className="py-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Cara Kerja TruthLayer</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />
            {[
              { step: '1', title: 'Install Extension', desc: 'Tambahkan TruthLayer ke Chrome dalam satu klik. Tidak perlu mendaftar atau membuat akun. Ekstensi siap digunakan langsung setelah instalasi.', icon: '⬇️' },
              { step: '2', title: 'Browse Normally', desc: 'Lanjutkan berinternet seperti biasa. TruthLayer berjalan secara pasif — tidak ada analisis otomatis, tidak ada pelambatan browser, tidak ada gangguan.' },
              { step: '3', title: 'See the Truth', desc: 'Klik ikon TruthLayer di toolbar untuk melihat trust score, niat tersembunyi, dan dark pattern dari website yang sedang Anda kunjungi.' },
            ].map((item, i) => (
              <div key={i} className="text-center flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center text-3xl animate-float glow-teal-sm"
                    style={{ animationDelay: `${i * 0.6}s` }}>
                    {item.icon || ['⬇️', '🌐', '🔍'][i]}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 border-2 border-dark-900 flex items-center justify-center text-xs font-black text-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-base font-bold text-dark-50">{item.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Screenshot */}
          <div className="mt-12 glass-card rounded-2xl p-4 sm:p-6 border border-primary-600/15">
            <p className="text-xs text-dark-500 text-center mb-4">Preview — Extension icon in Chrome toolbar</p>
            <div className="relative rounded-xl overflow-hidden border border-dark-600 shadow-2xl">
              <img
                src="/extentionchrome.png"
                alt="TruthLayer extension icon in Chrome toolbar"
                className="w-full h-auto"
                style={{ maxHeight: '360px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ LIVE DEMO ══════ */}
      <section id="demo" className="py-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Live Demo</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Lihat Sendiri</h2>
            <p className="text-dark-400 text-sm">Klik kartu untuk melihat laporan lengkap website populer</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoSites.map((site, i) => (
              <ScoreCard key={site.domain} site={site} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ PERMISSIONS ══════ */}
      <section id="permissions" className="py-24 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Transparency</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Izin yang Digunakan</h2>
            <p className="text-dark-400 max-w-xl mx-auto text-sm leading-relaxed">
              Kami percaya transparansi penuh. Berikut adalah semua izin browser yang diminta TruthLayer — beserta alasan yang jelas mengapa setiap izin diperlukan.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {permissions.map((p, i) => (
              <div key={i} className="glass-card rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0 mt-0.5" />
                  <code className="text-primary-300 font-mono text-sm font-bold bg-primary-600/10 px-3 py-1 rounded-lg border border-primary-600/20">
                    {p.name}
                  </code>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">
                    Low Risk
                  </span>
                </div>
                <p className="text-dark-400 text-sm leading-relaxed flex-1">{p.reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 glass-card rounded-2xl p-6 border border-primary-600/20">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary-400 flex-shrink-0 mt-0.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <div className="font-bold text-dark-100 text-sm mb-1">Tidak ada izin berbahaya</div>
                <p className="text-dark-400 text-sm leading-relaxed">
                  TruthLayer tidak meminta izin <code className="text-primary-300 bg-primary-600/10 px-1 rounded text-xs">history</code>, <code className="text-primary-300 bg-primary-600/10 px-1 rounded text-xs">bookmarks</code>, <code className="text-primary-300 bg-primary-600/10 px-1 rounded text-xs">&lt;all_urls&gt;</code>, atau izin sistem lainnya yang bersifat invasif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ BROWSER SUPPORT ══════ */}
      <section id="browsers" className="py-24 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Compatibility</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tersedia untuk Semua Browser Utama</h2>
            <p className="text-dark-400 max-w-xl mx-auto text-sm leading-relaxed">
              TruthLayer bekerja di semua browser berbasis Chromium. Instalasi cukup sekali, dan ekstensi siap digunakan di browser pilihan Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: 'Google Chrome', icon: 'chrome', color: 'from-blue-500/20 to-blue-600/10', supported: true },
              { name: 'Microsoft Edge', icon: 'edge', color: 'from-teal-500/20 to-teal-600/10', supported: true },
              { name: 'Brave', icon: 'brave', color: 'from-orange-500/20 to-orange-600/10', supported: true },
              { name: 'Opera', icon: 'opera', color: 'from-red-500/20 to-red-600/10', supported: true },
              { name: 'Firefox', icon: 'firefox', color: 'from-orange-500/10 to-orange-600/5', supported: false },
            ].map((b) => (
              <div key={b.name} className={`glass-card rounded-2xl p-5 text-center ${b.supported ? 'glass-card-hover' : 'opacity-50'}`}>
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${b.color} border border-dark-600 flex items-center justify-center`}>
                  <span className="text-xl">{b.icon === 'chrome' ? '🔵' : b.icon === 'edge' ? '🔷' : b.icon === 'brave' ? '🦁' : b.icon === 'opera' ? '🔴' : '🦊'}</span>
                </div>
                <p className="text-sm font-semibold text-dark-100 mb-1">{b.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  b.supported
                    ? 'bg-green-900/30 text-green-400 border border-green-700/30'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
                }`}>
                  {b.supported ? '✓ Supported' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 glass-card rounded-2xl p-6 border border-primary-600/20">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary-400 flex-shrink-0 mt-0.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <div className="font-bold text-dark-100 text-sm mb-1">Semua Browser Chromium Didukung Penuh</div>
                <p className="text-dark-400 text-sm leading-relaxed">
                  Chrome, Edge, Brave, Opera, dan Vivaldi — semuanya didukung dengan fitur yang identik.
                  Instalasi cukup dilakukan sekali. Firefox dan Safari sedang dalam pengembangan dan akan tersedia di rilis mendatang.
                  Lihat panduan instalasi lengkap di <a href="/download" className="text-primary-400 hover:text-primary-300 underline">halaman Download</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ PRIVACY ══════ */}
      <section id="privacy" className="py-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Privacy Policy</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Privasi Anda, Prioritas Kami</h2>
            <p className="text-dark-400 max-w-xl mx-auto text-sm leading-relaxed">
              TruthLayer dibangun dengan prinsip privacy-by-design dari hari pertama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {privacyPoints.map((p, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600/15 border border-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-dark-100 text-sm mb-1.5">{p.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data flow diagram */}
          <div className="glass-card rounded-2xl p-6 border border-primary-600/15">
            <h3 className="font-bold text-dark-100 mb-5 text-sm">Alur Data yang Terjadi</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
              {[
                { label: 'Browser Anda', sub: 'Membuka website', icon: '🖥️' },
                { label: 'TruthLayer', sub: 'Ekstrak metadata publik', icon: '🔍' },
                { label: 'Server Analisis', sub: 'Proses & hitung skor', icon: '⚡' },
                { label: 'Kembali ke Anda', sub: 'Hasil tersimpan lokal', icon: '✅' },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-3 flex-1 justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{step.icon}</div>
                    <div className="text-xs font-bold text-dark-100">{step.label}</div>
                    <div className="text-xs text-dark-500 mt-0.5">{step.sub}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-600/50 hidden sm:block flex-shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-dark-500 mt-5 text-center">
              ⚠️ Konten mentah halaman web (teks artikel, gambar, password) tidak pernah meninggalkan browser Anda.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ SOCIAL PROOF ══════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Community</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Dipercaya Ribuan Pengguna</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-black stat-number mb-2">{s.value}</div>
                <div className="text-dark-400 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#26D9A8" className="flex-shrink-0">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-dark-300 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-primary-600/20 border border-primary-600/30 flex items-center justify-center text-xs font-bold text-primary-400">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-dark-100">{t.name}</div>
                    <div className="text-xs text-dark-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ FAQ ══════ */}
      <section id="faq" className="py-24 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Documentation</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pertanyaan Umum</h2>
            <p className="text-dark-400 text-sm">Jawaban lengkap untuk pertanyaan yang paling sering ditanyakan.</p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ CHANGELOG ══════ */}
      <section id="changelog" className="py-24 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs font-bold tracking-widest uppercase mb-3">Release Notes</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Changelog</h2>
            <p className="text-dark-400 text-sm">Riwayat lengkap pembaruan dan perbaikan TruthLayer.</p>
          </div>

          <div className="flex flex-col gap-6">
            {changelog.map((release, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-dark-700/50">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    release.type === 'major'
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                      : 'bg-dark-700 text-dark-400 border border-dark-600'
                  }`}>
                    {release.version}
                  </span>
                  {release.type === 'major' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-600 text-white font-semibold">
                      Major Release
                    </span>
                  )}
                  <span className="text-xs text-dark-500 ml-auto">{release.date}</span>
                </div>
                {/* Changes */}
                <ul className="px-6 py-4 flex flex-col gap-2.5">
                  {release.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-dark-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        className="text-primary-500 flex-shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-8" />

      {/* ══════ CTA BOTTOM ══════ */}
      <section className="py-24 px-5 md:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="relative w-16 h-16 mx-auto mb-6 glow-teal animate-float rounded-2xl overflow-hidden">
            <Image src="/truthlayer.png" alt="TruthLayer" fill className="object-contain" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">See the Truth</h2>
          <p className="text-dark-400 mb-10 leading-relaxed">
            Mulai menggunakan TruthLayer sekarang — gratis, tanpa akun, tanpa iklan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/download" className="btn-primary px-10 py-4 rounded-xl font-bold text-white text-sm glow-teal">
              Add to Chrome — Free
            </a>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g. amazon.com)"
                className="input-teal flex-1 sm:w-64 px-5 py-4 bg-dark-800/80 border border-dark-600 rounded-xl text-dark-100 placeholder-dark-500 text-sm transition-all" />
              <button type="submit"
                className="px-6 py-4 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl text-sm font-semibold text-dark-100 transition-all">
                Analyze
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-dark-700/40 py-10 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src="/truthlayer.png" alt="TruthLayer" fill className="object-contain" />
              </div>
              <span className="text-sm text-dark-400">TruthLayer &copy; {new Date().getFullYear()}</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className="text-xs text-dark-500 hover:text-primary-400 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {[
                { label: 'About', href: '/about' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'GitHub', href: 'https://github.com/truthlayer' },
              ].map((link) => (
                <a key={link.label} href={link.href}
                  className="text-xs text-dark-500 hover:text-primary-400 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="section-divider mb-6" />

          <p className="text-center text-xs text-dark-600">
            TruthLayer adalah ekstensi open-source yang dibuat untuk internet yang lebih transparan.
            Tidak ada iklan. Tidak ada penjualan data.
          </p>
        </div>
      </footer>

    </main>
  );
}
