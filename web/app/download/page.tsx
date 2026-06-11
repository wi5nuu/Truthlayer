'use client';

export default function DownloadPage() {
  const steps = [
    { num: 1, title: 'Open Chrome Extensions', desc: 'Type chrome://extensions in your address bar and press Enter.' },
    { num: 2, title: 'Enable Developer Mode', desc: 'Toggle the Developer mode switch in the top-right corner.' },
    { num: 3, title: 'Load Unpacked', desc: 'Click "Load unpacked" and select the extension/ folder from this project.' },
    { num: 4, title: 'Start Analyzing', desc: 'Click the TruthLayer icon next to your address bar to analyze any website.' }
  ];

  return (
    <main className="min-h-screen gradient-bg">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">TL</div>
          <span className="font-semibold">truthlayer.io</span>
        </a>
        <a href="/" className="text-sm px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">Back</a>
      </nav>

      <section className="px-6 pt-20 pb-16 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Install TruthLayer</h1>
        <p className="text-dark-400 text-lg mb-12">
          TruthLayer is currently in developer preview. Follow these steps to load it in Chrome.
        </p>

        <div className="space-y-6 text-left">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-4 items-start p-6 bg-dark-800/50 rounded-xl border border-dark-700">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-dark-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-dark-800/50 rounded-xl border border-dark-700">
          <p className="text-sm text-dark-400">
            Extension folder path:
          </p>
          <code className="block mt-2 p-3 bg-dark-900 rounded-lg text-sm text-primary-400 select-all">
            G:\extention\truthlayer\extension
          </code>
        </div>
      </section>
    </main>
  );
}
