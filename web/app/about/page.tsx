'use client';

export default function AboutPage() {
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
        <h1 className="text-4xl font-extrabold mb-6">About TruthLayer</h1>
        <p className="text-dark-400 text-lg leading-relaxed mb-6">
          TruthLayer is a browser extension that reveals the hidden intentions behind every website you visit. 
          We analyze trust scores, detect dark patterns, identify data collection practices, and estimate 
          AI-generated content — giving you back control over your online experience.
        </p>
        <h2 className="text-2xl font-bold mt-10 mb-4">Our Mission</h2>
        <p className="text-dark-400 leading-relaxed">
          Every website wants something from you. Whether it is your attention, your data, or your money — 
          the internet is full of hidden persuasion tactics. TruthLayer makes the invisible visible, 
          so you can browse with clarity and confidence.
        </p>
        <h2 className="text-2xl font-bold mt-10 mb-4">How It Works</h2>
        <p className="text-dark-400 leading-relaxed">
          TruthLayer uses a combination of rule-based detection and AI analysis to evaluate websites. 
          When you visit a page, our extension extracts public metadata and structure, then sends it 
          to our analysis engine. The engine identifies dark patterns, assesses data collection, 
          and calculates a trust score — all within seconds.
        </p>
      </section>
    </main>
  );
}
