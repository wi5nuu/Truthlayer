'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SiteReport from '@/components/SiteReport';

export default function ReportPage() {
  const params = useParams();
  const domain = params?.domain as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchDomain, setSearchDomain] = useState('');

  useEffect(() => {
    if (domain) {
      fetchReport(domain);
    }
  }, [domain]);

  async function fetchReport(d: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/report/${encodeURIComponent(d)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 404) {
          setError(`No analysis found for ${d}. Try searching a website below.`);
        } else {
          setError(body.error || 'Failed to load report');
        }
        return;
      }
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError('Unable to load report. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDomain.trim()) {
      window.location.href = `/report/${encodeURIComponent(searchDomain.trim())}`;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Analyzing {domain}...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen gradient-bg">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-400 font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-dark-400 mb-8">{error}</p>
          <form onSubmit={handleSearch} className="flex gap-2 justify-center">
            <input
              type="text"
              value={searchDomain}
              onChange={(e) => setSearchDomain(e.target.value)}
              placeholder="Enter domain..."
              className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 w-64"
            />
            <button type="submit" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors">
              Check
            </button>
          </form>
          <div className="mt-8">
            <a href="/" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Back to Home</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center text-xs font-bold">TL</div>
          <span className="text-sm font-semibold">truthlayer.io</span>
        </a>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex gap-2">
            <input
              type="text"
              value={searchDomain}
              onChange={(e) => setSearchDomain(e.target.value)}
              placeholder="Check another website..."
              className="px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 w-48"
            />
            <button type="submit" className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm transition-colors">
              Go
            </button>
          </form>
          <a href="/download" className="text-sm px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors">
            Get Extension
          </a>
        </div>
      </nav>
      {data && <SiteReport data={data} />}
      <footer className="px-6 py-8 text-center text-sm text-dark-500 border-t border-dark-800 mt-12">
        TruthLayer &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
