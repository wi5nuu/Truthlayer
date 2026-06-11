export default function PrivacyPage() {
  return (
    <main className="min-h-screen gradient-bg">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">TL</div>
          <span className="font-semibold">truthlayer.io</span>
        </a>
        <a href="/" className="text-sm text-dark-300 hover:text-dark-100 transition-colors">Home</a>
      </nav>
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
        <div className="text-dark-400 space-y-4 leading-relaxed">
          <p><strong className="text-dark-200">Data Collection.</strong> TruthLayer only collects publicly available webpage metadata (title, headings, script sources, form structure). We never collect passwords, personal messages, credit card numbers, or any sensitive information.</p>
          <p><strong className="text-dark-200">Data Storage.</strong> Analysis results are cached locally in your browser for 24 hours. Server-side storage is limited to anonymized analysis results.</p>
          <p><strong className="text-dark-200">Third Parties.</strong> We use Anthropic (Claude) API for AI analysis. No raw page content is stored by third parties.</p>
          <p><strong className="text-dark-200">Your Control.</strong> You can clear all cached data at any time via Chrome extension settings. No account is required to use the extension.</p>
          <p><strong className="text-dark-200">Contact.</strong> For privacy inquiries, contact privacy@truthlayer.io</p>
          <p className="text-sm text-dark-500 mt-8">Last updated: June 2026</p>
        </div>
      </section>
    </main>
  );
}
