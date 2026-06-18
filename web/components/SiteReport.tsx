'use client';

import { useCallback, useState } from 'react';
import TrustScore from './TrustScore';
import IntentList from './IntentList';
import DarkPatternBadge from './DarkPatternBadge';

interface ReportData {
  domain: string;
  trustScore: number;
  trustLabel: string;
  primaryIntent: string;
  intents: Array<{
    rank: number;
    intent: string;
    confidence: number;
    evidence?: string[];
  }>;
  darkPatterns: {
    count: number;
    detected: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  };
  dataCollection: {
    percentage: number;
    trackers: string[];
    dataTypes: string[];
    cookies?: {
      total: number;
      firstParty: number;
      thirdParty: number;
    };
    requests?: Array<{
      url: string;
      type: string;
    }>;
  };
  aiContent: {
    percentage: number;
    confidence: number;
    samples?: string[];
  };
  manipulationLevel: string;
  summary: string;
  analyzedAt: string;
  cached: boolean;
  recommendations?: string[];
  security?: {
    https: boolean;
    ssl_valid: boolean;
    headers: Record<string, string>;
  };
}

interface SiteReportProps {
  data: ReportData;
}

function Gauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-dark-400 mb-1">
        <span>{label}</span>
        <span className="font-mono">{value}/{max}</span>
      </div>
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function darkPatternEvidence(dp: { type: string; description: string; severity: string }): string {
  const evidenceMap: Record<string, string> = {
    urgency: `Found on page elements (e.g., "${dp.description.split('"')[1] || 'countdown timers, limited stock claims'}"). These pressure users into quick decisions.`,
    social_proof: `Page includes "${dp.description.split('"')[1] || 'social proof indicators'}". This creates false urgency by simulating demand.`,
    confirmshaming: `Opt-out options use guilt-tripping language to emotionally manipulate users into agreeing. Found in forms or newsletter signups.`,
    privacy_zuckering: `Data collection or cookie practices are obfuscated, making it hard for users to understand what they consent to.`,
    misdirection: `Pop-ups and overlays distract from the primary content, increasing chance of accidental clicks.`,
    hidden_costs: `Costs or fees are only revealed late in the user journey (e.g., at checkout). Found via "${dp.description.split('"')[1] || 'keyword signals'}".`,
    disguised_ads: `Promotional content is styled to look like genuine editorial content, misleading users about its nature.`,
  };
  return evidenceMap[dp.type] || `Pattern detected via page analysis: ${dp.description}`;
}

function SeverityBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; bg: string; border: string }> = {
    low: { color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
    high: { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700/30' },
    extreme: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/30' },
  };
  const c = config[level] || config.low;
  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${c.bg} ${c.border} ${c.color}`}>
      {level}
    </span>
  );
}

function SectionCard({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="bg-dark-800/60 border border-dark-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-dark-700 bg-dark-800/80">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-300">{title}</h3>
        {badge}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-700">
            {headers.map((h, i) => (
              <th key={i} className="text-left text-[10px] font-semibold uppercase tracking-wider text-dark-500 pb-2 pr-4 last:pr-0">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-dark-700/50 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="py-2.5 pr-4 last:pr-0 text-dark-200">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SiteReport({ data }: SiteReportProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'technical'>('overview');

  const shareTwitter = useCallback(() => {
    const text = encodeURIComponent(`Trust Score ${data.domain}: ${data.trustScore}/100 — analyzed by TruthLayer`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [data]);

  const shareWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`TruthLayer Report: ${data.domain} — Trust Score ${data.trustScore}/100\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, [data]);

  const shareCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  const scoreColor = data.trustScore >= 80 ? '#059669' : data.trustScore >= 60 ? '#10B981' : data.trustScore >= 40 ? '#D97706' : data.trustScore >= 20 ? '#F97316' : '#DC2626';
  const trackerCount = data.dataCollection?.trackers?.length || 0;
  const recs = data.recommendations || [];
  const defaultRecs = data.trustScore >= 80
    ? ['Website ini aman untuk digunakan', 'Selalu verifikasi URL sebelum memasukkan data sensitif']
    : data.trustScore >= 60
    ? ['Periksa kebijakan privasi sebelum mendaftar', 'Waspada terhadap pop-up yang mencurigakan']
    : ['Hindari memasukkan data pribadi', 'Gunakan password manager untuk deteksi phishing', 'Aktifkan proteksi tambahan di pengaturan'];
  const allRecs = recs.length > 0 ? recs : defaultRecs;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'data', label: 'Data & Tracking' },
    { id: 'technical', label: 'Technical' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ─────────────── HERO ─────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-800 via-dark-800 to-dark-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Trust Score Ring */}
            <div className="flex-shrink-0 relative">
              <TrustScore score={data.trustScore} size="lg" />
            </div>

            {/* Domain Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-dark-100">{data.domain}</h1>
                  <SeverityBadge level={data.manipulationLevel} />
                </div>
                <p className="text-dark-400 text-sm">
                  Last analyzed{' '}
                  <span className="text-dark-300 font-medium">
                    {new Date(data.analyzedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {data.cached && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-dark-700 rounded-full text-dark-400">cached</span>}
                </p>
              </div>

              <p className="text-dark-300 leading-relaxed text-sm max-w-2xl">
                {data.summary || `This website primarily focuses on ${data.primaryIntent || 'unknown purposes'}. ${data.darkPatterns?.count > 0 ? `We detected ${data.darkPatterns.count} dark pattern${data.darkPatterns.count > 1 ? 's' : ''}.` : ''} ${data.aiContent?.percentage > 0 ? `Approximately ${data.aiContent.percentage}% of content appears AI-generated.` : ''}`}
              </p>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-dark-900/50 rounded-lg px-3 py-2.5 text-center border border-dark-700/50">
                  <p className="text-lg font-bold text-dark-100">{data.darkPatterns?.count || 0}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider">Dark Patterns</p>
                </div>
                <div className="bg-dark-900/50 rounded-lg px-3 py-2.5 text-center border border-dark-700/50">
                  <p className="text-lg font-bold text-dark-100">{trackerCount}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider">Trackers</p>
                </div>
                <div className="bg-dark-900/50 rounded-lg px-3 py-2.5 text-center border border-dark-700/50">
                  <p className="text-lg font-bold text-dark-100">{data.aiContent?.percentage || 0}%</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider">AI Content</p>
                </div>
                <div className="bg-dark-900/50 rounded-lg px-3 py-2.5 text-center border border-dark-700/50">
                  <p className={`text-lg font-bold capitalize ${
                    data.manipulationLevel === 'extreme' ? 'text-red-400' :
                    data.manipulationLevel === 'high' ? 'text-orange-400' :
                    data.manipulationLevel === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {data.manipulationLevel}
                  </p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider">Manipulation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────── TAB NAV ─────────────── */}
      <div className="flex gap-1 bg-dark-800/60 rounded-xl p-1 border border-dark-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════
          TAB 1: OVERVIEW
          ════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Hidden Intents */}
          {data.intents && data.intents.length > 0 && (
            <SectionCard title="Hidden Intent Analysis" badge={<span className="text-[10px] text-dark-400">{data.intents.length} detected</span>}>
              <div className="space-y-4">
                <p className="text-xs text-dark-400 leading-relaxed">
                  TruthLayer analyzed the page content and classified the website's intent into primary, secondary, and tertiary categories.
                  Each intent includes a confidence score and supporting evidence extracted from the page.
                </p>
                <IntentList intents={data.intents} title="" />
                {data.primaryIntent && (
                  <div className="mt-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                    <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1">Primary Intent</p>
                    <p className="text-sm font-medium text-primary-400">{data.primaryIntent}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Trust Score Breakdown */}
          <SectionCard title="Trust Score Breakdown" badge={<span className="text-sm font-bold" style={{ color: scoreColor }}>{data.trustScore}/100</span>}>
            <div className="space-y-5">
              <p className="text-xs text-dark-400 leading-relaxed">
                The trust score is calculated from multiple weighted factors: dark pattern presence, data collection practices,
                intent transparency, and AI-generated content ratio. Lower scores indicate higher risk.
              </p>
              <div className="grid gap-4">
                <Gauge value={data.darkPatterns?.count || 0} max={10} label="Dark Pattern Severity" color="#EF4444" />
                <Gauge value={data.dataCollection?.percentage || 0} max={100} label="Data Collection Exposure" color="#F97316" />
                <Gauge value={100 - (data.aiContent?.percentage || 0)} max={100} label="Human Content Authenticity" color="#10B981" />
                <Gauge value={data.trustScore} max={100} label="Overall Trust Score" color={scoreColor} />
              </div>
            </div>
          </SectionCard>

          {/* Score Interpretation */}
          <SectionCard title="What This Score Means">
            <div className="space-y-4">
              <p className="text-xs text-dark-400 leading-relaxed">
                Trust scores are categorized into five levels. Each level indicates the level of risk and transparency of the website.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { range: '80–100', label: 'Highly Trustworthy', color: '#059669', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', meaning: 'Very low risk. Website is transparent, minimal dark patterns, clear privacy practices. Safe for browsing, shopping, and sharing data.' },
                  { range: '60–79', label: 'Generally Trustworthy', color: '#10B981', bg: 'bg-emerald-900/10', border: 'border-emerald-700/20', meaning: 'Low risk overall. Some minor concerns detected but website is largely safe. Exercise normal caution with sensitive information.' },
                  { range: '40–59', label: 'Use With Caution', color: '#D97706', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30', meaning: 'Moderate risk. Multiple dark patterns or data collection practices detected. Avoid sharing sensitive data. Verify information before trusting.' },
                  { range: '20–39', label: 'Potentially Manipulative', color: '#F97316', bg: 'bg-orange-900/20', border: 'border-orange-700/30', meaning: 'High risk. Strong evidence of manipulation tactics, excessive tracking, or deceptive design. Do not enter personal or financial information.' },
                  { range: '0–19', label: 'High Risk', color: '#DC2626', bg: 'bg-red-900/20', border: 'border-red-700/30', meaning: 'Extreme risk. This website exhibits dangerous patterns. Leave immediately. Do not interact with forms or provide any data.' },
                ].map((level, i) => {
                  const isCurrent = data.trustScore >= (parseInt(level.range) === 80 ? 80 : parseInt(level.range.split('–')[0])) && data.trustScore <= parseInt(level.range.split('–')[1] || level.range.split('–')[0]);
                  return (
                    <div key={i} className={`p-3 rounded-xl border text-sm ${isCurrent ? `${level.bg} ${level.border}` : 'bg-dark-900/30 border-dark-700/30 opacity-40'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: level.color }}></span>
                        <span className="text-xs font-mono text-dark-500">{level.range}</span>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: level.color + '20', color: level.color }}>{level.label}</span>
                        {isCurrent && <span className="text-[9px] px-1.5 py-0.5 bg-primary-600/20 text-primary-400 rounded-full border border-primary-600/30">← Current</span>}
                      </div>
                      <p className="text-xs text-dark-400 mt-1 leading-relaxed">{level.meaning}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {/* Factor Evidence */}
          <SectionCard title="Why This Score?">
            <div className="space-y-4">
              <p className="text-xs text-dark-400 leading-relaxed">
                Each trust score component is calculated based on specific observations. Here is the evidence behind each factor:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border text-sm ${data.darkPatterns?.count > 0 ? 'bg-red-900/10 border-red-700/20' : 'bg-emerald-900/10 border-emerald-700/20'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${data.darkPatterns?.count > 0 ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                      {data.darkPatterns?.count || 0} dark patterns
                    </span>
                    <span className="text-[10px] text-dark-500">{data.darkPatterns?.count > 0 ? 'Penalty applied' : 'No penalty'}</span>
                  </div>
                  <p className="text-xs text-dark-400 leading-relaxed">
                    {data.darkPatterns?.count > 0
                      ? `${data.darkPatterns.detected.map(d => d.type.replace(/_/g, ' ')).join(', ')}. This lowers the trust score significantly.`
                      : 'No dark patterns detected. The interface appears honest and transparent.'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border text-sm ${(data.dataCollection?.percentage || 0) > 20 ? 'bg-orange-900/10 border-orange-700/20' : 'bg-emerald-900/10 border-emerald-700/20'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${(data.dataCollection?.percentage || 0) > 20 ? 'bg-orange-900/30 text-orange-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                      {data.dataCollection?.percentage || 0}% data exposure
                    </span>
                    <span className="text-[10px] text-dark-500">{(data.dataCollection?.cookies?.thirdParty || 0) > 0 ? `${data.dataCollection?.cookies?.thirdParty || 0} third-party cookies` : 'No third-party cookies'}</span>
                  </div>
                  <p className="text-xs text-dark-400 leading-relaxed">
                    {(data.dataCollection?.percentage || 0) > 20
                      ? `Collects ${data.dataCollection?.dataTypes?.join(', ') || 'various data types'}. ${trackerCount > 0 ? trackerCount + ' tracker(s) detected.' : ''}`
                      : 'Minimal data collection. No excessive tracking detected.'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border text-sm ${(data.aiContent?.percentage || 0) > 20 ? 'bg-yellow-900/10 border-yellow-700/20' : 'bg-emerald-900/10 border-emerald-700/20'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${(data.aiContent?.percentage || 0) > 20 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                      {data.aiContent?.percentage || 0}% AI content
                    </span>
                    <span className="text-[10px] text-dark-500">{data.aiContent?.confidence ? `${Math.round(data.aiContent.confidence * 100)}% confidence` : ''}</span>
                  </div>
                  <p className="text-xs text-dark-400 leading-relaxed">
                    {(data.aiContent?.percentage || 0) > 20
                      ? 'Significant AI-generated content detected. Accuracy of claims may be reduced.'
                      : 'Content appears primarily human-written. Factual reliability is higher.'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border text-sm ${data.intents && data.intents.length > 1 && data.intents.filter(i => i.intent !== data.primaryIntent).length > 0 ? 'bg-yellow-900/10 border-yellow-700/20' : 'bg-emerald-900/10 border-emerald-700/20'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${data.intents && data.intents.length > 1 && data.intents.filter(i => i.intent !== data.primaryIntent).length > 0 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                      {data.intents?.length || 0} intent{data.intents?.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[10px] text-dark-500">{data.manipulationLevel} manipulation</span>
                  </div>
                  <p className="text-xs text-dark-400 leading-relaxed">
                    {data.intents && data.intents.length > 0
                      ? `Primary intent: ${data.primaryIntent || data.intents[0].intent}. ${data.intents.length > 1 ? 'Hidden secondary agendas detected.' : 'Intents appear aligned and transparent.'}`
                      : 'No hidden intents detected.'}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Dark Patterns */}
          {data.darkPatterns && data.darkPatterns.count > 0 && (
            <SectionCard title="Dark Pattern Detection" badge={<SeverityBadge level={data.manipulationLevel} />}>
              <div className="space-y-3">
                <p className="text-xs text-dark-400 leading-relaxed">
                  Dark patterns are manipulative design techniques that trick users into actions they didn't intend.
                  We detected {data.darkPatterns.count} pattern{data.darkPatterns.count > 1 ? 's' : ''} on this website.
                </p>
                <Table
                  headers={['#', 'Pattern Type', 'Description', 'Severity', 'Evidence']}
                  rows={data.darkPatterns.detected.map((dp, i) => [
                    <span key={`n-${i}`} className="text-dark-500 font-mono text-[10px]">{(i + 1).toString().padStart(2, '0')}</span>,
                    <span key={`t-${i}`} className="font-medium capitalize">{dp.type.replace(/_/g, ' ')}</span>,
                    <span key={`d-${i}`} className="text-dark-400 text-xs">{dp.description}</span>,
                    <SeverityBadge key={`s-${i}`} level={dp.severity} />,
                    <span key={`e-${i}`} className="text-[10px] text-dark-500 max-w-48 block leading-relaxed">{darkPatternEvidence(dp)}</span>,
                  ])}
                />
                {data.darkPatterns.detected.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {data.darkPatterns.detected.map((dp, i) => (
                      <DarkPatternBadge key={i} pattern={dp} />
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* AI Content Analysis */}
          {data.aiContent && (
            <SectionCard title="AI Content Analysis" badge={<span className="text-sm font-bold text-yellow-400">{data.aiContent.percentage}%</span>}>
              <div className="space-y-4">
                <p className="text-xs text-dark-400 leading-relaxed">
                  We estimate that <strong className="text-dark-200">{data.aiContent.percentage}%</strong> of this page's content was generated by artificial intelligence.
                  {data.aiContent.confidence && ` Confidence level: ${Math.round(data.aiContent.confidence * 100)}%.`}
                </p>
                <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-lg border border-dark-700/50">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-20 h-20">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="10" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#F59E0B" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 - (data.aiContent.percentage / 100) * 2 * Math.PI * 42}`}
                        strokeLinecap="round" transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                        fill="white" fontSize="22" fontWeight="bold">{data.aiContent.percentage}%</text>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-dark-400 mb-2">
                      {data.aiContent.percentage <= 10 ? 'This website appears to use mostly human-written content.' :
                       data.aiContent.percentage <= 30 ? 'Some sections may be AI-generated. Verify critical information.' :
                       data.aiContent.percentage <= 50 ? 'A significant portion of content appears AI-generated. Cross-check facts.' :
                       'Most content appears AI-generated. Exercise caution with factual claims.'}
                    </p>
                    {data.aiContent.confidence && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-dark-500">Confidence:</span>
                        <div className="flex-1 h-1.5 bg-dark-700 rounded-full max-w-32">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.round(data.aiContent.confidence * 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-dark-400 font-mono">{Math.round(data.aiContent.confidence * 100)}%</span>
                      </div>
                    )}
                    {data.aiContent.samples && data.aiContent.samples.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {data.aiContent.samples.map((s, i) => (
                          <p key={i} className="text-[10px] text-dark-500 italic border-l-2 border-yellow-700/50 pl-2">"{s.length > 120 ? s.slice(0, 117) + '...' : s}"</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Recommendations */}
          <SectionCard title="Recommendations & Action Guide">
            <div className="space-y-4">
              <p className="text-xs text-dark-400 leading-relaxed">
                Based on the analysis, here are specific actions you should take:
              </p>

              {/* Score-based actions */}
              <div className="p-3 rounded-xl border text-sm" style={{ borderColor: scoreColor + '30', background: scoreColor + '08' }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: scoreColor }}></span>
                  <span className="text-xs font-bold" style={{ color: scoreColor }}>
                    {data.trustScore >= 80 ? 'Safe to Use' :
                     data.trustScore >= 60 ? 'Proceed with Caution' :
                     data.trustScore >= 40 ? 'Be Careful' :
                     data.trustScore >= 20 ? 'High Risk' : 'Do Not Trust'}
                  </span>
                  <span className="text-[10px] text-dark-500 ml-auto">
                    {data.trustScore >= 80 ? 'Standard precautions apply' :
                     data.trustScore >= 60 ? 'Check privacy policy before engaging' :
                     data.trustScore >= 40 ? 'Avoid sharing personal data' :
                     data.trustScore >= 20 ? 'Do not enter sensitive information' :
                     'Leave this website immediately'}
                  </span>
                </div>
              </div>

              {/* Detailed recommendations */}
              <ul className="space-y-2">
                {allRecs.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                    <span className="text-primary-400 mt-0.5 flex-shrink-0">•</span>
                    {rec}
                  </li>
                ))}
              </ul>

              {/* Contextual tips based on specific issues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.darkPatterns?.count > 0 && (
                  <div className="p-2.5 rounded-lg bg-red-900/10 border border-red-800/20">
                    <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-0.5">Dark Patterns Detected</p>
                    <p className="text-[11px] text-dark-400 leading-relaxed">Read carefully before clicking buttons or accepting offers. Look for pre-checked boxes and hidden fees.</p>
                  </div>
                )}
                {(data.dataCollection?.percentage || 0) > 30 && (
                  <div className="p-2.5 rounded-lg bg-orange-900/10 border border-orange-800/20">
                    <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-0.5">Excessive Tracking</p>
                    <p className="text-[11px] text-dark-400 leading-relaxed">Use a privacy-focused browser or blocker. Consider using disposable email and temporary accounts.</p>
                  </div>
                )}
                {(data.aiContent?.percentage || 0) > 30 && (
                  <div className="p-2.5 rounded-lg bg-yellow-900/10 border border-yellow-800/20">
                    <p className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider mb-0.5">AI-Generated Content</p>
                    <p className="text-[11px] text-dark-400 leading-relaxed">Cross-check important facts with independent sources. Be skeptical of testimonials and statistics.</p>
                  </div>
                )}
                {data.intents && data.intents.length > 1 && (
                  <div className="p-2.5 rounded-lg bg-yellow-900/10 border border-yellow-800/20">
                    <p className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider mb-0.5">Hidden Agendas</p>
                    <p className="text-[11px] text-dark-400 leading-relaxed">The site may be distracting from its real purpose. Verify claims with external sources before acting.</p>
                  </div>
                )}
                {data.trustScore >= 80 && (
                  <div className="p-2.5 rounded-lg bg-emerald-900/10 border border-emerald-800/20">
                    <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">Low Risk Verified</p>
                    <p className="text-[11px] text-dark-400 leading-relaxed">No significant concerns. Standard internet safety practices still recommended.</p>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 2: DATA & TRACKING
          ════════════════════════════════════════ */}
      {activeTab === 'data' && (
        <div className="space-y-6">

          {/* Data Collection Overview */}
          <SectionCard title="Data Collection Overview" badge={<span className={`text-sm font-bold ${data.dataCollection?.percentage > 50 ? 'text-red-400' : data.dataCollection?.percentage > 20 ? 'text-yellow-400' : 'text-emerald-400'}`}>{data.dataCollection?.percentage || 0}%</span>}>
            <div className="space-y-4">
              <p className="text-xs text-dark-400 leading-relaxed">
                This website engages in data collection practices. Below is a breakdown of what data is being collected and how it's being tracked.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 text-center">
                  <p className="text-xl font-bold text-dark-100">{data.dataCollection?.cookies?.total ?? '—'}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider mt-1">Total Cookies</p>
                </div>
                <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 text-center">
                  <p className="text-xl font-bold text-emerald-400">{data.dataCollection?.cookies?.firstParty ?? '—'}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider mt-1">First-Party</p>
                </div>
                <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 text-center">
                  <p className="text-xl font-bold text-orange-400">{data.dataCollection?.cookies?.thirdParty ?? '—'}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider mt-1">Third-Party</p>
                </div>
                <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 text-center">
                  <p className="text-xl font-bold text-dark-100">{trackerCount}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider mt-1">Trackers</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Trackers */}
          {data.dataCollection?.trackers && data.dataCollection.trackers.length > 0 && (
            <SectionCard title="Trackers Detected" badge={<span className="text-[10px] text-dark-400">{trackerCount} found</span>}>
              <div className="flex flex-wrap gap-2">
                {data.dataCollection.trackers.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs bg-dark-900/50 border border-dark-700 rounded-full text-dark-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Data Types */}
          {data.dataCollection?.dataTypes && data.dataCollection.dataTypes.length > 0 && (
            <SectionCard title="Data Types Collected">
              <Table
                headers={['#', 'Data Type', 'Risk Level']}
                rows={data.dataCollection.dataTypes.map((dt, i) => {
                  const risk = dt.toLowerCase().includes('email') || dt.toLowerCase().includes('password') || dt.toLowerCase().includes('credit')
                    ? 'high'
                    : dt.toLowerCase().includes('name') || dt.toLowerCase().includes('phone') || dt.toLowerCase().includes('address')
                    ? 'medium'
                    : 'low';
                  return [
                    <span key={`n-${i}`} className="text-dark-500 font-mono text-[10px]">{(i + 1).toString().padStart(2, '0')}</span>,
                    <span key={`t-${i}`} className="font-medium">{dt}</span>,
                    <SeverityBadge key={`s-${i}`} level={risk} />,
                  ];
                })}
              />
            </SectionCard>
          )}

          {/* Network Requests */}
          {data.dataCollection?.requests && data.dataCollection.requests.length > 0 && (
            <SectionCard title="Network Requests" badge={<span className="text-[10px] text-dark-400">{data.dataCollection.requests.length} requests</span>}>
              <Table
                headers={['#', 'URL', 'Type']}
                rows={data.dataCollection.requests.slice(0, 20).map((req, i) => [
                  <span key={`n-${i}`} className="text-dark-500 font-mono text-[10px]">{(i + 1).toString().padStart(2, '0')}</span>,
                  <span key={`u-${i}`} className="text-xs font-mono text-dark-300 truncate max-w-80 block" title={req.url}>{req.url}</span>,
                  <span key={`t-${i}`} className="text-[10px] px-1.5 py-0.5 bg-dark-700 rounded text-dark-400">{req.type}</span>,
                ])}
              />
              {data.dataCollection.requests.length > 20 && (
                <p className="text-xs text-dark-500 mt-3 text-center">Showing 20 of {data.dataCollection.requests.length} requests</p>
              )}
            </SectionCard>
          )}

        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 3: TECHNICAL
          ════════════════════════════════════════ */}
      {activeTab === 'technical' && (
        <div className="space-y-6">

          {/* Security Info */}
          <SectionCard title="Security & SSL">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${data.security?.https ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                  {data.security?.https ? 'ON' : 'OFF'}
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-200">HTTPS</p>
                  <p className="text-[10px] text-dark-500">{data.security?.https ? 'Secure connection (valid SSL)' : 'Not using HTTPS'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${data.security?.ssl_valid ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                  {data.security?.ssl_valid ? 'OK' : 'NO'}
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-200">SSL Certificate</p>
                  <p className="text-[10px] text-dark-500">{data.security?.ssl_valid ? 'Valid and properly configured' : 'Invalid or missing SSL'}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* HTTP Headers */}
          {data.security?.headers && Object.keys(data.security.headers).length > 0 && (
            <SectionCard title="HTTP Headers">
              <Table
                headers={['Header', 'Value']}
                rows={Object.entries(data.security.headers).map(([key, val], i) => [
                  <span key={`k-${i}`} className="font-mono text-[11px] text-dark-200">{key}</span>,
                  <span key={`v-${i}`} className="font-mono text-[11px] text-dark-400 truncate max-w-md block" title={val}>{val}</span>,
                ])}
              />
            </SectionCard>
          )}

          {/* Domain Info */}
          <SectionCard title="Domain Information">
            <Table
              headers={['Property', 'Value']}
              rows={[
                ['Domain', <span key="d" className="font-mono text-primary-400">{data.domain}</span>],
                ['Trust Score', <span key="ts" className="font-bold" style={{ color: scoreColor }}>{data.trustScore}/100</span>],
                ['Manipulation Level', <SeverityBadge key="ml" level={data.manipulationLevel} />],
                ['Last Analyzed', new Date(data.analyzedAt).toLocaleString('en-US')],
                ['Cached Result', data.cached ? 'Yes (24h TTL)' : 'No'],
                ['Data Sources', 'Chrome Extension + Claude AI'],
              ]}
            />
          </SectionCard>

          {/* Raw Analysis Metadata */}
          {data.intents && data.intents.length > 0 && (
            <SectionCard title="Analysis Methodology">
              <div className="text-xs text-dark-400 leading-relaxed space-y-2">
                <p>TruthLayer uses a multi-layered analysis pipeline:</p>
                <ol className="list-decimal list-inside space-y-1 text-dark-400">
                  <li><strong className="text-dark-300">Content Extraction</strong> — HTML metadata, meta tags, Open Graph, JSON-LD, and page structure</li>
                  <li><strong className="text-dark-300">Rule-based Detection</strong> — Pattern matching for dark patterns, tracker identification, cookie analysis</li>
                  <li><strong className="text-dark-300">AI Classification</strong> — Claude AI analyzes page content for hidden intent and AI-generated content</li>
                  <li><strong className="text-dark-300">Score Calculation</strong> — Weighted algorithm combining all factors into a final trust score (0–100)</li>
                </ol>
              </div>
            </SectionCard>
          )}

        </div>
      )}

      {/* ─────────────── SHARE & CTA ─────────────── */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-900 border border-dark-700 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-dark-500 mr-1">Share this report:</span>
            <button onClick={shareTwitter} className="px-3 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 transition-colors border border-dark-600 hover:border-dark-500">
              Twitter
            </button>
            <button onClick={shareWhatsApp} className="px-3 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 transition-colors border border-dark-600 hover:border-dark-500">
              WhatsApp
            </button>
            <button onClick={shareCopy} className="px-3 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 transition-colors border border-dark-600 hover:border-dark-500">
              Copy Link
            </button>
          </div>
          <a href="/download"
            className="px-5 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30">
            Get the Extension
          </a>
        </div>
      </div>

    </div>
  );
}
