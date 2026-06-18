'use client';

const GITHUB_REPO = 'https://github.com/wi5nuu/Truthlayer';
const GITHUB_RELEASES = 'https://github.com/wi5nuu/Truthlayer/releases';
const GITHUB_ZIP = 'https://github.com/wi5nuu/Truthlayer/archive/refs/heads/main.zip';
const EXTENSION_PATH = 'extension/';

const browsers = [
  {
    name: 'Google Chrome',
    emoji: '🌐',
    color: 'from-blue-500/20 to-blue-600/10',
    supported: true,
    version: 'Chrome 88+',
    note: 'Fully supported — Manifest V3',
  },
  {
    name: 'Microsoft Edge',
    emoji: '🌀',
    color: 'from-teal-500/20 to-teal-600/10',
    supported: true,
    version: 'Edge 88+',
    note: 'Fully supported — Chromium-based',
  },
  {
    name: 'Brave',
    emoji: '🦁',
    color: 'from-orange-500/20 to-orange-600/10',
    supported: true,
    version: 'Brave 1.0+',
    note: 'Fully supported — Chromium-based',
  },
  {
    name: 'Opera',
    emoji: '🔴',
    color: 'from-red-500/20 to-red-600/10',
    supported: true,
    version: 'Opera 74+',
    note: 'Supported via "Load unpacked"',
  },
  {
    name: 'Vivaldi',
    emoji: '🎭',
    color: 'from-red-500/20 to-red-600/10',
    supported: true,
    version: 'Vivaldi 3.0+',
    note: 'Supported — Chromium-based',
  },
  {
    name: 'Firefox',
    emoji: '🦊',
    color: 'from-orange-500/10 to-orange-600/5',
    supported: false,
    version: 'Coming Soon',
    note: 'In development — MV3 migration',
  },
  {
    name: 'Safari',
    emoji: '🧭',
    color: 'from-blue-500/10 to-blue-600/5',
    supported: false,
    version: 'Planned',
    note: 'On roadmap — Safari Web Extensions',
  },
];

const installSteps = [
  {
    num: 1,
    title: 'Download TruthLayer',
    desc: 'Clone from GitHub or download the ZIP file directly.',
    action: (
      <div className="flex flex-wrap gap-3 mt-3">
        <a href={GITHUB_ZIP}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-primary-600/20 inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download ZIP
        </a>
        <a href={GITHUB_REPO}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-sm font-semibold text-dark-100 transition-all inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub
        </a>
      </div>
    ),
  },
  {
    num: 2,
    title: 'Extract the ZIP',
    desc: 'Extract the downloaded ZIP file to a folder on your computer (e.g., Desktop or Documents). Remember this location — you will need it in the next step.',
    action: null,
  },
  {
    num: 3,
    title: 'Open Extensions Page',
    desc: 'Type the following address into your browser and press Enter:',
    action: (
      <div className="mt-3">
        <code className="px-4 py-2.5 bg-dark-900 rounded-lg text-sm text-primary-400 select-all font-mono block border border-dark-600">
          chrome://extensions
        </code>
        <p className="text-xs text-dark-500 mt-2">
          For Edge, use <code className="text-primary-400 bg-dark-900 px-1 rounded">edge://extensions</code> • For Brave, use <code className="text-primary-400 bg-dark-900 px-1 rounded">brave://extensions</code> • For Opera, use <code className="text-primary-400 bg-dark-900 px-1 rounded">opera://extensions</code>
        </p>
      </div>
    ),
  },
  {
    num: 4,
    title: 'Enable Developer Mode',
    desc: 'Toggle the "Developer mode" switch in the top-right corner of the Extensions page. This allows you to install unpacked extensions.',
    action: null,
  },
  {
    num: 5,
    title: 'Load Unpacked Extension',
    desc: 'Click the "Load unpacked" button and select the extension folder you extracted earlier.',
    action: (
      <div className="mt-3">
        <p className="text-xs text-dark-400 mb-2">Select this folder:</p>
        <code className="px-4 py-2.5 bg-dark-900 rounded-lg text-sm text-primary-400 select-all font-mono block border border-dark-600">
          .../Truthlayer/extension/
        </code>
      </div>
    ),
  },
  {
    num: 6,
    title: 'Pin & Analyze',
    desc: 'Click the puzzle icon in your browser toolbar, find TruthLayer, and pin it. Then click the TruthLayer icon on any website to start analyzing.',
    action: null,
  },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen gradient-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <img src="/truthlayer.png" alt="TruthLayer" className="w-8 h-8 object-contain" />
          <span className="font-bold text-sm">truthlayer.io</span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-700">
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/70 border border-primary-600/30 text-xs text-primary-400 font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-blink" />
          Developer Preview · Free
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-4">
          Install{' '}
          <span className="gradient-text-hero">TruthLayer</span>
        </h1>
        <p className="text-dark-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Get started in under 2 minutes. No account, no registration, no hidden costs.
          TruthLayer is open-source and available for all major Chromium browsers.
        </p>
        <a href="#instructions"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-primary-600/30 glow-teal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="7 13 12 18 17 13" /><polyline points="7 6 12 11 17 6" />
          </svg>
          Jump to Instructions
        </a>
      </section>

      {/* Browser Support Matrix */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-8 border border-primary-600/20">
          <h2 className="text-xl font-bold mb-6 text-center">Compatible Browsers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {browsers.map((b) => (
              <div key={b.name} className={`p-4 rounded-xl border text-center ${
                b.supported
                  ? 'bg-dark-800/60 border-dark-600 hover:border-primary-600/40'
                  : 'bg-dark-800/30 border-dark-700/30 opacity-50'
              } transition-all`}>
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${b.color} border border-dark-600 flex items-center justify-center text-lg`}>
                  {b.emoji}
                </div>
                <p className="text-sm font-semibold text-dark-100 mb-1">{b.name}</p>
                <p className={`text-[10px] font-mono ${
                  b.supported ? 'text-primary-400' : 'text-dark-500'
                }`}>
                  {b.version}
                </p>
                <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                  b.supported
                    ? 'bg-green-900/30 text-green-400 border border-green-700/30'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
                }`}>
                  {b.supported ? '✓ Supported' : '○ ' + b.note.split('—')[0].trim()}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-dark-500 text-center mt-6">
            All Chromium-based browsers (Chrome, Edge, Brave, Opera, Vivaldi) are fully supported.
            Firefox and Safari support are on the roadmap.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* Screenshot Preview */}
      <section className="px-6 pb-8 max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-6 sm:p-8 text-center border border-primary-600/20">
          <h2 className="text-xl font-bold mb-3">What It Looks Like</h2>
          <p className="text-dark-400 text-sm mb-6">
            After installation, click the TruthLayer icon in your browser toolbar to analyze any website.
          </p>
          <div className="relative rounded-xl overflow-hidden border border-dark-600 shadow-2xl">
            <img
              src="/extentionchrome.png"
              alt="TruthLayer extension icon in Chrome toolbar"
              className="w-full h-auto"
              style={{ maxHeight: '480px', objectFit: 'contain' }}
            />
          </div>
          <p className="text-xs text-dark-500 mt-4">
            TruthLayer icon pinned in the Chrome toolbar — ready to analyze
          </p>
        </div>
      </section>

      {/* Installation Instructions */}
      <section id="instructions" className="px-6 py-16 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Step-by-Step Instructions</h2>
          <p className="text-dark-400 text-sm">
            Follow these 6 simple steps to start analyzing websites with TruthLayer.
          </p>
        </div>

        <div className="space-y-5">
          {installSteps.map((step) => (
            <div key={step.num} className="flex gap-4 items-start p-5 sm:p-6 bg-dark-800/60 rounded-xl border border-dark-700 hover:border-dark-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-bold text-base flex-shrink-0 shadow-lg shadow-primary-600/20">
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-dark-100 text-base mb-1">{step.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{step.desc}</p>
                {step.action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GitHub Section */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="glass-card rounded-2xl p-8 text-center border border-primary-600/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-4 text-dark-200">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <h2 className="text-xl font-bold mb-2">Open Source</h2>
          <p className="text-dark-400 text-sm mb-6 max-w-md mx-auto">
            TruthLayer is fully open-source. Clone the repository, audit the code, contribute improvements, or report issues on GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={GITHUB_REPO}
              className="px-5 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl text-sm font-semibold text-dark-100 transition-all inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub Repository
            </a>
            <a href={GITHUB_RELEASES}
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-primary-600/20 inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
              </svg>
              Latest Release
            </a>
            <a href={`${GITHUB_REPO}/issues`}
              className="px-5 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl text-sm font-semibold text-dark-100 transition-all inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Report Issue
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Quick Questions</h2>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { q: 'Can I install on multiple browsers?', a: 'Yes. Repeat the installation steps for each Chromium browser (Chrome, Edge, Brave, etc.). Your settings are stored independently per browser.' },
            { q: 'Will updates happen automatically?', a: 'Not yet. Since this is a developer preview loaded via "Load unpacked," you will need to pull the latest code from GitHub and reload the extension at chrome://extensions.' },
            { q: 'Do I need a backend server?', a: 'Yes. TruthLayer requires the backend server to run locally on your machine. After cloning the repo, open a terminal in the backend/ folder, run npm install && npm start, and keep it running while using the extension. The backend handles AI analysis and trust score calculation — it is not hosted remotely. This is a developer preview; a cloud-hosted version is planned for future release.' },
            { q: 'Is my data safe?', a: 'Yes. TruthLayer only sends structured metadata (page title, headings, tracker domains) to the API. Raw page content stays in your browser. No personal data is collected or stored.' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-dark-800/40 rounded-xl border border-dark-700">
              <p className="font-semibold text-dark-100 mb-1">{item.q}</p>
              <p className="text-dark-400 text-xs leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700/40 py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">TruthLayer &copy; {new Date().getFullYear()} — Open Source</p>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">Home</a>
            <a href="/docs" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">Docs</a>
            <a href="/about" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">About</a>
            <a href="/privacy" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">Privacy</a>
            <a href={GITHUB_REPO} className="text-xs text-dark-500 hover:text-primary-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
