(function () {
  'use strict';

  const SENSITIVE_SELECTORS = [
    'input[type="password"]',
    'input[type="email"]',
    'input[name*="password"]',
    'input[name*="credit"]',
    'input[name*="card"]',
    'input[name*="ssn"]',
    'input[name*="social"]',
    'input[autocomplete="cc-number"]',
    'input[autocomplete="cc-exp"]',
    'input[autocomplete="cc-csc"]'
  ];

  function extractPageData() {
    try {
      const sanitizedUrl = window.location.href.split('#')[0];
      const domain = window.location.hostname;
      const title = document.title || '';
      const metaDescription = getMetaDescription();
      const headings = extractHeadings();
      const bodyTextSample = extractBodyTextSample();
      const externalLinks = extractExternalLinks();
      const formCount = document.forms ? document.forms.length : 0;
      const formFields = extractFormFields();
      const hasNewsletterForm = detectNewsletterForm();
      const cookieBannerInfo = detectCookieBanner();
      const hasPaywall = detectPaywall();
      const popupCount = detectPopups();
      const countdownTimers = detectCountdownTimers();
      const adElements = estimateAdElements();
      const socialProofElements = detectSocialProof();
      const scripts = extractScriptDomains();
      const trackers = detectKnownTrackers(scripts);
      const pageLoadTime = performance.now ? Math.round(performance.now()) : 0;
      const hasAMP = document.querySelector('html[amp], html[⚡], link[rel="amphtml"]') !== null;
      const language = document.documentElement.lang || navigator.language || 'en';
      const publishDate = extractPublishDate();

      return {
        url: sanitizedUrl,
        domain,
        title,
        metaDescription,
        headings,
        bodyTextSample,
        externalLinks,
        formCount,
        formFields,
        hasNewsletterForm,
        hasCookieBanner: cookieBannerInfo.hasBanner,
        cookieBannerText: cookieBannerInfo.text,
        hasPaywall,
        popupCount,
        countdownTimers,
        adElements,
        socialProofElements,
        scripts,
        trackers,
        pageLoadTime,
        hasAMP,
        language,
        publishDate
      };
    } catch (err) {
      console.error('[TruthLayer] Error extracting page data:', err);
      return null;
    }
  }

  function getMetaDescription() {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? (meta.getAttribute('content') || '') : '';
  }

  function extractHeadings() {
    const headings = [];
    const selectors = ['h1', 'h2', 'h3'];
    for (const sel of selectors) {
      const elements = document.querySelectorAll(sel);
      for (let i = 0; i < elements.length && headings.length < 20; i++) {
        const text = (elements[i].textContent || '').trim();
        if (text) headings.push(text);
      }
      if (headings.length >= 20) break;
    }
    return headings.slice(0, 20);
  }

  function extractBodyTextSample() {
    const body = document.body;
    if (!body) return '';
    const text = (body.textContent || '').trim();
    return text.substring(0, 2000);
  }

  function extractExternalLinks() {
    const links = new Set();
    const currentDomain = window.location.hostname;
    const anchors = document.querySelectorAll('a[href]');
    for (const a of anchors) {
      try {
        const href = a.href;
        if (href) {
          const url = new URL(href);
          if (url.hostname !== currentDomain && !url.hostname.includes(currentDomain)) {
            links.add(url.hostname);
          }
        }
      } catch (_) {}
    }
    return Array.from(links).slice(0, 30);
  }

  function extractFormFields() {
    const fields = [];
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="password"]), select, textarea');
    for (const input of inputs) {
      const name = input.getAttribute('name') || input.getAttribute('id') || '';
      const type = input.getAttribute('type') || 'text';
      if (name) fields.push(`${name}:${type}`);
    }
    return fields.slice(0, 30);
  }

  function detectNewsletterForm() {
    const keywords = ['newsletter', 'subscribe', 'signup', 'sign-up', 'get updates', 'stay in touch'];
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      const text = (form.textContent || '').toLowerCase();
      for (const kw of keywords) {
        if (text.includes(kw)) return true;
      }
    }
    return false;
  }

  function detectCookieBanner() {
    const keywords = ['cookie', 'cookies', 'gdpr', 'privacy', 'consent', 'this site uses'];
    const banners = [];
    const allElements = document.querySelectorAll('div, section, aside, footer');
    for (const el of allElements) {
      const text = (el.textContent || '').toLowerCase();
      for (const kw of keywords) {
        if (text.includes(kw)) {
          banners.push(el);
          break;
        }
      }
      if (banners.length >= 3) break;
    }
    if (banners.length > 0) {
      const bannerText = banners.map(b => (b.textContent || '').trim()).filter(Boolean).join(' | ').substring(0, 500);
      return { hasBanner: true, text: bannerText };
    }
    return { hasBanner: false, text: '' };
  }

  function detectPaywall() {
    const keywords = ['subscribe to continue', 'subscribe to read', 'premium article', 'premium content', 'paid content', 'this is a paywall', 'subscribe now to access'];
    const text = (document.body.textContent || '').toLowerCase();
    for (const kw of keywords) {
      if (text.includes(kw)) return true;
    }
    return false;
  }

  function detectPopups() {
    const popupKeywords = ['modal', 'overlay', 'popup', 'lightbox', 'dialog', 'drawer'];
    let count = 0;
    for (const kw of popupKeywords) {
      const els = document.querySelectorAll(`[class*="${kw}"], [id*="${kw}"]`);
      count += els.length;
    }
    return Math.min(count, 20);
  }

  function detectCountdownTimers() {
    const patterns = ['data-countdown', 'timer-', 'countdown', 'expires in', 'ends in', 'limited time', 'offer ends'];
    let count = 0;
    for (const p of patterns) {
      const els = document.querySelectorAll(`[class*="${p}"], [id*="${p}"]`);
      count += els.length;
    }
    const text = (document.body.textContent || '').toLowerCase();
    const textPatterns = [/only \d+ left/, /selling fast/, /almost gone/, /\d+ people are viewing/];
    for (const regex of textPatterns) {
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
    return count;
  }

  function estimateAdElements() {
    const adKeywords = ['advert', 'advertisement', 'ad-', 'adsbygoogle', 'sponsored', 'promoted', 'ad-container', 'ad-wrapper'];
    let count = 0;
    for (const kw of adKeywords) {
      const els = document.querySelectorAll(`[class*="${kw}"], [id*="${kw}"], [data-${kw}]`);
      count += els.length;
    }
    return Math.min(count, 50);
  }

  function detectSocialProof() {
    const patterns = ['people are viewing', 'people bought', 'people watching', 'people are looking', 'people joined', 'sold out', 'limited stock', 'only a few left', 'recently purchased', 'booked today'];
    let count = 0;
    const text = (document.body.textContent || '').toLowerCase();
    for (const p of patterns) {
      const regex = new RegExp(`\\d+\\s*${p}`, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
    return count;
  }

  function extractScriptDomains() {
    const domains = new Set();
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      try {
        const url = new URL(s.src);
        domains.add(url.hostname);
      } catch (_) {}
    }
    return Array.from(domains);
  }

  function detectKnownTrackers(scriptDomains) {
    const known = [
      'google-analytics.com', 'googletagmanager.com', 'doubleclick.net',
      'facebook.net', 'hotjar.com', 'mixpanel.com', 'segment.io',
      'amplitude.com', 'hubspot.com', 'fullstory.com', 'mouseflow.com',
      'crazyegg.com', 'optimizely.com', 'vwo.com', 'newrelic.com',
      'datadoghq.com', 'sentry.io', 'logrocket.com', 'heap.io',
      'posthog.com', 'matomo.org', 'intercom.io', 'drift.com',
      'olark.com', 'tidio.com', 'adzerk.net', 'criteo.com',
      'taboola.com', 'outbrain.com', 'casalemedia.com', 'adnxs.com',
      'adsrvr.org', 'amazon-adsystem.com'
    ];
    const found = [];
    for (const sd of scriptDomains) {
      for (const k of known) {
        if (sd.includes(k)) {
          found.push(k);
          break;
        }
      }
    }
    return found;
  }

  function extractPublishDate() {
    const selectors = [
      'meta[property="article:published_time"]',
      'meta[name="date"]',
      'meta[name="pubdate"]',
      'meta[itemprop="datePublished"]',
      'time[datetime]',
      '[datetime]',
      '.date', '.published', '.post-date', '.article-date'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const val = el.getAttribute('content') || el.getAttribute('datetime') || el.textContent;
        if (val) return val.trim();
      }
    }
    return '';
  }

  const pageData = extractPageData();
  if (pageData) {
    chrome.runtime.sendMessage({
      type: 'PAGE_DATA_EXTRACTED',
      data: pageData
    }).catch(() => {});
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'REQUEST_PAGE_DATA') {
      const data = extractPageData();
      sendResponse({ data });
    }
    return true;
  });
})();
