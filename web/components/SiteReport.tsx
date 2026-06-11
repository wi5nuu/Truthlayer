'use client';

import { useCallback } from 'react';
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
  };
  aiContent: {
    percentage: number;
    confidence: number;
  };
  manipulationLevel: string;
  summary: string;
  analyzedAt: string;
  cached: boolean;
}

interface SiteReportProps {
  data: ReportData;
}

function PieChart({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1E293B" strokeWidth="12" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize="20" fontWeight="bold">{pct}%</text>
      </svg>
      <span className="text-xs text-dark-400 mt-1">{label}</span>
    </div>
  );
}

export default function SiteReport({ data }: SiteReportProps) {
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">{data.domain}</h1>
        <p className="text-dark-400 text-sm">
          Last analyzed {new Date(data.analyzedAt).toLocaleDateString()}
          {data.cached && ' (cached)'}
        </p>
      </div>

      <div className="flex justify-center">
        <TrustScore score={data.trustScore} size="lg" />
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <p className="text-dark-200 leading-relaxed">{data.summary}</p>
      </div>

      {data.intents && data.intents.length > 0 && (
        <IntentList intents={data.intents} />
      )}

      {data.darkPatterns && data.darkPatterns.count > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400 mb-3">
            Dark Patterns Detected ({data.darkPatterns.count})
          </h3>
          <div className="space-y-2">
            {data.darkPatterns.detected.map((dp, i) => (
              <DarkPatternBadge key={i} pattern={dp} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-xl p-4 text-center">
          <PieChart pct={data.dataCollection?.percentage || 0} label="Data Collection" color="#8B5CF6" />
        </div>
        <div className="bg-dark-800 rounded-xl p-4 text-center">
          <PieChart pct={data.aiContent?.percentage || 0} label="AI Content" color="#F59E0B" />
        </div>
        <div className="bg-dark-800 rounded-xl p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-dark-400 mb-1">Trackers</p>
          <p className="text-3xl font-bold text-primary-400">{data.dataCollection?.trackers?.length || 0}</p>
          <p className="text-xs text-dark-400 mt-1">detected</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-dark-400 mb-1">Manipulation</p>
          <p className={`text-3xl font-bold capitalize ${
            data.manipulationLevel === 'extreme' ? 'text-red-400' :
            data.manipulationLevel === 'high' ? 'text-orange-400' :
            data.manipulationLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {data.manipulationLevel}
          </p>
        </div>
      </div>

      {data.dataCollection?.dataTypes && data.dataCollection.dataTypes.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400 mb-2">Data Types Collected</h3>
          <div className="flex flex-wrap gap-2">
            {data.dataCollection.dataTypes.map((dt, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-dark-700 rounded-full text-dark-200">
                {dt}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 pt-4 border-t border-dark-700">
        <span className="text-xs text-dark-500 mr-2">Share:</span>
        <button onClick={shareTwitter}
          className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 rounded-lg text-dark-300 transition-colors">
          Twitter
        </button>
        <button onClick={shareWhatsApp}
          className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 rounded-lg text-dark-300 transition-colors">
          WhatsApp
        </button>
        <button onClick={shareCopy}
          className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 rounded-lg text-dark-300 transition-colors">
          Copy Link
        </button>
        <a href="/download"
          className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors ml-2">
          Get Extension
        </a>
      </div>
    </div>
  );
}
