'use client';

import { useState, useEffect, useCallback } from 'react';

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const stored = localStorage.getItem('truthlayer_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  const addToHistory = useCallback((item: any) => {
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, 100);
      localStorage.setItem('truthlayer_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  function handleExport() {
    const csv = [
      ['Domain', 'Trust Score', 'Label', 'Date', 'Dark Patterns', 'Manipulation'].join(','),
      ...history.map((h: any) =>
        [h.domain, h.trustScore, h.trustLabel, h.analyzedAt, h.darkPatterns?.count || 0, h.manipulationLevel].join(',')
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'truthlayer-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum: number, h: any) => sum + h.trustScore, 0) / history.length)
    : 0;

  const totalDarkPatterns = history.reduce((sum: number, h: any) => sum + (h.darkPatterns?.count || 0), 0);
  const totalTrackers = history.reduce((sum: number, h: any) => sum + (h.dataCollection?.trackers?.length || 0), 0);

  const sortedByDanger = [...history]
    .sort((a: any, b: any) => a.trustScore - b.trustScore)
    .slice(0, 5);

  const sortedByDate = [...history]
    .sort((a: any, b: any) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());

  const maxScore = Math.max(...history.map((h: any) => h.trustScore), 100);
  const chartPoints = sortedByDate.slice(0, 10).reverse().map((h: any) => h.trustScore);

  return (
    <main className="min-h-screen gradient-bg">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center text-xs font-bold">TL</div>
          <span className="text-sm font-semibold">truthlayer.io</span>
        </a>
        <div className="flex items-center gap-4">
          <button onClick={handleExport} className="text-sm px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors" disabled={history.length === 0}>
            Export CSV
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {history.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-dark-800 rounded-xl p-4">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Websites Analyzed</p>
                <p className="text-3xl font-bold">{history.length}</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Avg Trust Score</p>
                <p className="text-3xl font-bold text-primary-400">{avgScore}</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Dark Patterns Found</p>
                <p className="text-3xl font-bold text-red-400">{totalDarkPatterns}</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Total Trackers</p>
                <p className="text-3xl font-bold text-yellow-400">{totalTrackers}</p>
              </div>
            </div>

            {chartPoints.length > 1 && (
              <div className="bg-dark-800 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-dark-200 mb-4">Trust Score Trend</h3>
                <div className="flex items-end gap-1 h-32">
                  {chartPoints.map((v: number, i: number) => {
                    const h = Math.max((v / Math.max(maxScore, 1)) * 100, 5);
                    const color = v >= 70 ? '#059669' : v >= 40 ? '#D97706' : '#DC2626';
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-dark-500">{v}</span>
                        <div className="w-full rounded-t" style={{ height: `${h}%`, backgroundColor: color, minHeight: '4px' }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {sortedByDanger.length > 0 && (
              <div className="bg-dark-800 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-dark-200 mb-4">Most Dangerous Sites Visited</h3>
                <div className="space-y-2">
                  {sortedByDanger.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-dark-500 w-5">{i + 1}.</span>
                        <a href={`/report/${item.domain}`} className="text-sm font-medium hover:text-primary-400 transition-colors">
                          {item.domain}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${item.trustScore < 40 ? 'text-red-400' : item.trustScore < 60 ? 'text-orange-400' : 'text-yellow-400'}`}>
                          {item.trustScore}
                        </span>
                        <span className="text-xs text-dark-500">{item.manipulationLevel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 bg-dark-800/30 rounded-xl">
            <p className="text-dark-400 text-lg mb-2">No analysis history yet</p>
            <p className="text-dark-500 text-sm mb-6">Install the extension and analyze your first website</p>
            <a href="/download" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors inline-block">
              Get the Extension
            </a>
          </div>
        ) : (
          <div className="bg-dark-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left p-4 text-dark-400 font-medium">Domain</th>
                  <th className="text-left p-4 text-dark-400 font-medium">Trust Score</th>
                  <th className="text-left p-4 text-dark-400 font-medium">Dark Patterns</th>
                  <th className="text-left p-4 text-dark-400 font-medium">Manipulation</th>
                  <th className="text-left p-4 text-dark-400 font-medium">Date</th>
                  <th className="text-left p-4 text-dark-400 font-medium">Report</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/30">
                    <td className="p-4 font-medium">{item.domain}</td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        item.trustScore >= 70 ? 'text-green-400' :
                        item.trustScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {item.trustScore}
                      </span>
                    </td>
                    <td className="p-4 text-dark-300">{item.darkPatterns?.count || 0}</td>
                    <td className="p-4 capitalize text-dark-300">{item.manipulationLevel}</td>
                    <td className="p-4 text-dark-400 text-xs">
                      {new Date(item.analyzedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <a href={`/report/${item.domain}`} className="text-primary-400 hover:text-primary-300 text-xs">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
