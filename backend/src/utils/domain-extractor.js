function extractDomain(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function extractTLD(domain) {
  if (!domain) return null;
  const parts = domain.split('.');
  if (parts.length < 2) return domain;
  return parts.slice(-2).join('.');
}

function isKnownDomain(domain) {
  if (!domain) return false;
  const known = [
    'google.com', 'facebook.com', 'amazon.com', 'apple.com',
    'microsoft.com', 'wikipedia.org', 'youtube.com', 'twitter.com',
    'instagram.com', 'linkedin.com', 'reddit.com', 'github.com',
    'stackoverflow.com', 'medium.com', 'nytimes.com', 'bbc.com'
  ];
  return known.includes(domain);
}

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    u.hash = '';
    u.search = '';
    return u.href.replace(/\/$/, '');
  } catch {
    return url;
  }
}

module.exports = { extractDomain, extractTLD, isKnownDomain, normalizeUrl };
