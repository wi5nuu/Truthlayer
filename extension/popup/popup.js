const API_BASE_URL = 'http://localhost:3001';
const API_TIMEOUT  = 10000;
const CACHE_TTL    = 24 * 60 * 60 * 1000;
const RETRY_DELAY  = 2000;

function friendlyError(cause) {
  if (!navigator.onLine) return 'Tidak ada koneksi internet. Periksa jaringan Anda.';
  if (cause?.message?.includes('Failed to fetch') || cause?.message?.includes('NetworkError') || cause?.name === 'TypeError') {
    return 'Server backend tidak terhubung. Pastikan server sudah dijalankan (cd backend && npm start).';
  }
  if (cause?.message?.includes('aborted')) return 'Analisis timeout. Server terlalu lambat.';
  if (cause?.status === 400) return 'Data halaman tidak valid. Coba refresh halaman.';
  if (cause?.status === 401) return 'Autentikasi gagal. Periksa token API.';
  if (cause?.status === 429) return 'Terlalu banyak permintaan. Tunggu beberapa saat.';
  if (cause?.status >= 500) return 'Server error. Coba lagi nanti.';
  return 'Analisis gagal. Coba lagi nanti.';
}

/* ================================
   INIT
   ================================ */
document.addEventListener('DOMContentLoaded', async () => {
  renderLoading('Memuat data halaman...');

  try {
    const tab = await getCurrentTab();
    if (!tab) { renderError('Tidak ada tab aktif'); return; }

    const domain = extractDomain(tab.url);
    if (!domain) { renderError('Tidak dapat menganalisis halaman ini'); return; }

    setDomainUI(domain, tab.favIconUrl || '');

    // Animate loading steps
    setTimeout(() => setLoadingStep('Menghubungi server analisis...'), 800);
    setTimeout(() => setLoadingStep('Memproses sinyal kepercayaan...'), 1800);

    const result = await loadAnalysis(domain);
    if (result) {
      renderResults(result);
    } else {
      setLoadingStep('Mencoba lagi...');
      setTimeout(async () => {
        const retryResult = await loadAnalysis(domain);
        if (retryResult) renderResults(retryResult);
        else renderError(friendlyError({ message: 'Retry failed' }));
      }, RETRY_DELAY);
    }
  } catch (err) {
    renderError(friendlyError(err));
  }

  // Button listeners
  document.getElementById('retryBtn').addEventListener('click', () => {
    renderLoading('Memuat ulang...');
    setTimeout(() => location.reload(), 300);
  });

  document.getElementById('viewReportBtn').addEventListener('click', () => {
    const domain = document.getElementById('siteDomain').textContent;
    if (domain && domain !== 'example.com') {
      chrome.tabs.create({ url: `http://localhost:3000/report/${domain}` });
    }
  });

  document.getElementById('settingsBtn').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
    else renderError(friendlyError({ message: 'Halaman pengaturan tidak tersedia' }));
  });

});

/* ================================
   TAB / DOMAIN HELPERS
   ================================ */
async function getCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

function extractDomain(url) {
  try { return new URL(url).hostname; } catch { return null; }
}

function setDomainUI(domain, favIconUrl) {
  const domainEl  = document.getElementById('siteDomain');
  const faviconEl = document.getElementById('siteFavicon');
  if (domainEl) domainEl.textContent = domain;
  if (faviconEl && favIconUrl) {
    faviconEl.src = favIconUrl;
    faviconEl.style.display = '';
  }
}

/* ================================
   ANALYSIS LOADING
   ================================ */
async function requestPageData(tabId) {
  try {
    const resp = await chrome.tabs.sendMessage(tabId, { type: 'REQUEST_PAGE_DATA' });
    return resp?.data || null;
  } catch { return null; }
}

async function loadAnalysis(domain) {
  const cached = await getCachedResult(domain);
  if (cached) return cached;

  const tab = await getCurrentTab();
  if (!tab) throw { message: 'No active tab' };
  const pageData = await requestPageData(tab.id);
  if (!pageData) throw { message: 'Content script not responding. Refresh the page and try again.' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageData, tier: 'free' }),
    signal: controller.signal
  });
  clearTimeout(timeout);

  if (!response.ok) throw { status: response.status, message: `HTTP ${response.status}` };
  const result = await response.json();
  if (!result.success) throw { message: 'API returned error' };

  await cacheResult(domain, result);
  return result;
}

/* ================================
   RENDER STATES
   ================================ */
function showOnly(id) {
  ['loadingState', 'errorState', 'resultsState'].forEach(s => {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
}

function renderLoading(step = 'Menganalisis website...') {
  showOnly('loadingState');
  setLoadingStep(step);
}

function setLoadingStep(text) {
  const el = document.getElementById('loadingStep');
  if (el) el.textContent = text;
}

function renderError(message) {
  showOnly('errorState');
  const el = document.querySelector('.error-text');
  if (el) el.textContent = message || 'Gagal menganalisis halaman ini';
}

function renderResults(data) {
  showOnly('resultsState');

  const score = data.trustScore ?? 0;
  const { color, label, desc } = formatTrustScore(score);

  // Trust ring & numbers
  animateTrustScore(score, color);

  // Labels
  setEl('trustScoreLabel', label);
  setEl('scoreDesc', desc);
  setStyle('trustScoreLabel', 'color', color);
  setStyle('scoreLabelDot', 'background', color);
  setStyle('scoreLabelDot', 'boxShadow', `0 0 8px ${color}`);

  // Domain & favicon
  if (data.domain) setDomainUI(data.domain, '');
  if (data.category) setEl('siteCategory', data.category);

  // Metrics
  const dp = data.darkPatterns?.count ?? 0;
  const ai = data.aiContent?.percentage ?? 0;
  const dc = data.dataCollection?.percentage ?? 0;
  const ml = data.manipulationLevel || 'low';

  setEl('darkPatternsCount',  dp);
  setEl('aiContentValue',     `${ai}%`);
  setEl('dataCollectedValue', `${dc}%`);
  setEl('manipulationValue',  formatManipulation(ml));

  // Mini bars
  setTimeout(() => {
    setWidth('darkPatternsBar',  Math.min(dp * 10, 100));
    setWidth('aiContentBar',     ai);
    setWidth('dataCollectedBar', dc);
    setWidth('manipulationBar',  manipulationToPercent(ml));
  }, 400);

  // Intents
  const intents = data.intents || [];
  setEl('intentCount', intents.length);
  renderIntents(intents);

  // Last updated
  const now = new Date();
  setEl('lastUpdated', `Diperbarui: ${now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}`);

  // Start realtime clock
  startRealtimeClock();

  // Pulse dots based on score
  updatePulseDots(score, data);
}

/* ================================
   TRUST SCORE ANIMATION
   ================================ */
function animateTrustScore(score, color) {
  // Pill
  const pillVal = document.getElementById('trustScoreValue');
  if (pillVal) { pillVal.textContent = score; pillVal.style.color = color; }

  // Big number — count up
  const numEl = document.getElementById('trustScoreNumber');
  if (numEl) {
    numEl.style.color = color;
    let current = 0;
    const step = Math.ceil(score / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, score);
      numEl.textContent = current;
      if (current >= score) clearInterval(timer);
    }, 30);
  }

  // Ring
  const ring = document.getElementById('scoreRing');
  const glow = document.getElementById('scoreRingGlow');
  const circumference = 427.26;
  const offset = circumference - (score / 100) * circumference;

  if (ring) {
    ring.style.stroke = color;
    ring.style.strokeDashoffset = offset;
  }
  if (glow) {
    glow.style.stroke = color;
    glow.style.strokeDashoffset = offset;
  }

  // Score pill border
  const pill = document.getElementById('scorePill');
  if (pill) pill.style.borderColor = `${color}50`;
}

/* ================================
   INTENTS
   ================================ */
function renderIntents(intents) {
  const container = document.getElementById('intentsList');
  if (!container) return;
  container.innerHTML = '';

  if (!intents.length) {
    container.innerHTML = `
      <div class="intent-item">
        <div class="intent-content">
          <div class="intent-title" style="color:var(--text-muted)">Tidak ada niat tersembunyi terdeteksi ✓</div>
        </div>
      </div>`;
    return;
  }

  intents.forEach((intent, i) => {
    const item = document.createElement('div');
    item.className = 'intent-item';
    item.style.animationDelay = `${i * 80}ms`;
    const confidence = Math.round((intent.confidence || 0.5) * 100);
    item.innerHTML = `
      <div class="intent-rank">${i + 1}</div>
      <div class="intent-content">
        <div class="intent-title">${formatIntent(intent.intent)}</div>
        ${intent.evidence?.length
          ? `<div class="intent-evidence">${intent.evidence.slice(0,2).join(' · ')}</div>`
          : ''}
        <div class="intent-bar-wrap">
          <div class="intent-bar" style="width:${confidence}%"></div>
        </div>
      </div>`;
    container.appendChild(item);
  });
}

/* ================================
   REALTIME CLOCK
   ================================ */
let realtimeInterval = null;
function startRealtimeClock() {
  if (realtimeInterval) clearInterval(realtimeInterval);
  realtimeInterval = setInterval(() => {
    const now = new Date();
    setEl('lastUpdated', `Diperbarui: ${now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}`);
  }, 1000);
}

/* ================================
   PULSE DOTS
   ================================ */
function updatePulseDots(score, data) {
  // Safety pulse = green if score high, else red
  const safeEl = document.getElementById('pulseSafety');
  if (safeEl) safeEl.style.background = score >= 60 ? 'var(--green)' : 'var(--red)';

  // Privacy pulse
  const privEl = document.getElementById('pulsePrivacy');
  if (privEl) {
    const dc = data.dataCollection?.percentage ?? 0;
    privEl.style.background = dc < 20 ? 'var(--blue)' : dc < 50 ? 'var(--yellow)' : 'var(--red)';
  }

  // Transparency pulse
  const transEl = document.getElementById('pulseTrans');
  if (transEl) {
    const ml = data.manipulationLevel || 'low';
    transEl.style.background = ml === 'low' ? 'var(--green)' : ml === 'medium' ? 'var(--yellow)' : 'var(--red)';
  }
}

/* ================================
   CACHE
   ================================ */
async function cacheResult(domain, data) {
  try {
    await chrome.storage.local.set({
      [domain]: { data, timestamp: Date.now(), ttl: CACHE_TTL }
    });
  } catch {}
}

async function getCachedResult(domain) {
  try {
    const result = await chrome.storage.local.get(domain);
    const entry = result[domain];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      await chrome.storage.local.remove(domain);
      return null;
    }
    return entry.data;
  } catch { return null; }
}

/* ================================
   FORMATTERS
   ================================ */
function formatTrustScore(score) {
  if (score >= 80) return { color: '#1DB88F', label: 'Sangat Terpercaya',       desc: 'Website ini memiliki rekam jejak kepercayaan yang sangat baik.' };
  if (score >= 60) return { color: '#26D9A8', label: 'Cukup Terpercaya',        desc: 'Website ini cukup aman dengan beberapa catatan minor.' };
  if (score >= 40) return { color: '#FBBF24', label: 'Gunakan Hati-hati',       desc: 'Ditemukan beberapa pola mencurigakan. Waspada.' };
  if (score >= 20) return { color: '#F97316', label: 'Potensial Manipulatif',   desc: 'Banyak sinyal manipulasi terdeteksi. Hati-hati.' };
  return               { color: '#EF4444', label: 'Berisiko Tinggi',           desc: 'Website ini menunjukkan pola yang sangat berbahaya.' };
}

function formatIntent(text) {
  if (!text) return '';
  return text.length > 64 ? text.substring(0, 61) + '…' : text;
}

function formatManipulation(level) {
  return { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', extreme: 'Ekstrim' }[level] || level;
}

function manipulationToPercent(level) {
  return { low: 15, medium: 50, high: 80, extreme: 100 }[level] || 0;
}

/* ================================
   DOM HELPERS
   ================================ */
function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setStyle(id, prop, value) {
  const el = document.getElementById(id);
  if (el) el.style[prop] = value;
}

function setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${pct}%`;
}
