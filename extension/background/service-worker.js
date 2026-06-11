const MSG_TYPE = {
  REQUEST_ANALYSIS: 'REQUEST_ANALYSIS',
  ANALYSIS_COMPLETE: 'ANALYSIS_COMPLETE',
  CACHE_GET: 'CACHE_GET',
  CACHE_SET: 'CACHE_SET',
  PAGE_DATA_EXTRACTED: 'PAGE_DATA_EXTRACTED',
  REQUEST_PAGE_DATA: 'REQUEST_PAGE_DATA'
};

const API_BASE_URL = 'http://localhost:3001';
const CACHE_TTL = 24 * 60 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 60 * 1000;

let rateLimitCounter = 0;
let rateLimitResetTime = Date.now() + RATE_LIMIT_WINDOW;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      analysisCount: 0,
      installDate: new Date().toISOString(),
      settings: {
        autoAnalyze: true,
        showBadge: true,
        tier: 'free'
      }
    });
    chrome.tabs.create({ url: chrome.runtime.getURL('welcome/welcome.html') });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    resetBadge(tabId);
  }
});

function resetBadge(tabId) {
  chrome.action.setBadgeText({ text: '...', tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#6B7280', tabId });
  chrome.action.setBadgeTextColor({ color: '#FFFFFF', tabId });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MSG_TYPE.REQUEST_ANALYSIS:
      handleRequestAnalysis(message.data, sender.tab?.id)
        .then(sendResponse)
        .catch(() => sendResponse({ error: 'Analysis failed' }));
      return true;

    case MSG_TYPE.CACHE_GET:
      getFromCache(message.key).then(sendResponse);
      return true;

    case MSG_TYPE.CACHE_SET:
      setToCache(message.key, message.value).then(sendResponse);
      return true;

    case MSG_TYPE.PAGE_DATA_EXTRACTED:
      handlePageDataExtracted(message.data, sender.tab?.id);
      break;
  }
});

async function handleRequestAnalysis(pageData, tabId) {
  if (!checkRateLimit()) {
    return { error: 'Rate limit exceeded. Try again later.', retryAfter: 60 };
  }

  const domain = pageData.domain;
  const cached = await getFromCache(domain);
  if (cached) {
    updateBadge(tabId, cached.trustScore);
    return { ...cached, cached: true };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageData,
        tier: 'free'
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      await setToCache(domain, result);
      updateBadge(tabId, result.trustScore);
      incrementAnalysisCount();
      return result;
    }
    throw new Error('API returned unsuccessful response');
  } catch (err) {
    const cachedResult = await getFromCache(domain);
    if (cachedResult) {
      updateBadge(tabId, cachedResult.trustScore);
      return { ...cachedResult, cached: true };
    }
    throw err;
  }
}

async function handlePageDataExtracted(pageData, tabId) {
  if (!pageData || !tabId) return;
  chrome.storage.local.get('settings', async ({ settings }) => {
    if (settings?.autoAnalyze !== false) {
      try {
        const result = await handleRequestAnalysis(pageData, tabId);
        chrome.tabs.sendMessage(tabId, { type: MSG_TYPE.ANALYSIS_COMPLETE, data: result }).catch(() => {});
      } catch (err) {
        console.error('[TruthLayer] Auto-analyze failed:', err);
      }
    }
  });
}

function updateBadge(tabId, score) {
  chrome.action.setBadgeText({ text: String(score), tabId });
  let color;
  if (score >= 70) color = '#059669';
  else if (score >= 40) color = '#D97706';
  else color = '#DC2626';
  chrome.action.setBadgeBackgroundColor({ color, tabId });
  chrome.action.setBadgeTextColor({ color: '#FFFFFF', tabId });
}

function checkRateLimit() {
  const now = Date.now();
  if (now > rateLimitResetTime) {
    rateLimitCounter = 0;
    rateLimitResetTime = now + RATE_LIMIT_WINDOW;
  }
  rateLimitCounter++;
  return rateLimitCounter <= RATE_LIMIT_MAX;
}

async function getFromCache(key) {
  try {
    const result = await chrome.storage.local.get(key);
    const entry = result[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      await chrome.storage.local.remove(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

async function setToCache(key, data) {
  try {
    await chrome.storage.local.set({
      [key]: {
        data,
        timestamp: Date.now(),
        ttl: CACHE_TTL
      }
    });
  } catch (err) {
    console.error('[TruthLayer] Cache set failed:', err);
  }
}

async function incrementAnalysisCount() {
  try {
    const { analysisCount = 0 } = await chrome.storage.local.get('analysisCount');
    await chrome.storage.local.set({ analysisCount: analysisCount + 1 });
  } catch {}
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-analysis') {
    const { settings } = await chrome.storage.local.get('settings');
    const updated = { ...(settings || {}), autoAnalyze: !(settings?.autoAnalyze ?? true) };
    await chrome.storage.local.set({ settings: updated });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.action.setBadgeText({ text: updated.autoAnalyze ? 'ON' : 'OFF', tabId: tab.id });
      setTimeout(() => resetBadge(tab.id), 2000);
    }
  }
});
