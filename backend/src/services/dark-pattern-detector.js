const PATTERNS = {
  COUNTDOWN_TIMER: {
    signals: ['data-countdown', 'timer-', 'countdown', 'expires in', 'ends in'],
    htmlPatterns: [/<div[^>]*countdown/i, /setInterval.*\d{2}:\d{2}/],
    severity: 'high'
  },
  FAKE_URGENCY: {
    signals: ['only x left', 'selling fast', 'almost gone', 'limited time', 'limited stock', 'offer ends', 'hurry', 'don\'t miss out'],
    severity: 'high'
  },
  SOCIAL_PROOF_MANIPULATION: {
    signals: ['people viewing', 'people watching', 'people bought', 'people are looking', 'x bought today', 'x people are', 'booked today', 'recently purchased'],
    severity: 'medium'
  },
  NEWSLETTER_TRAP: {
    signals: ['no thanks, i don\'t want', 'no thanks, i hate', 'i prefer to remain', 'no, i don\'t want to save', 'no, i don\'t want'],
    severity: 'medium'
  },
  STICKY_HEADER_CTA: {
    htmlPatterns: [/position:\s*sticky.*button/i, /position:\s*fixed.*cta/i, /position:\s*fixed.*button/i, /position:\s*sticky.*cta/i],
    severity: 'low'
  },
  AUTOPLAYING_VIDEO: {
    htmlPatterns: [/<video[^>]*autoplay/i],
    severity: 'low'
  },
  HIDDEN_COSTS: {
    signals: ['shipping calculated at checkout', 'fees apply', 'terms apply', 'conditions apply', 'additional charges'],
    severity: 'high'
  },
  CONFIRMSHAMING: {
    signals: ['no thanks, i don\'t like saving', 'no thanks, i\'m not smart', 'no thanks, i don\'t care', 'no thanks, i hate', 'i prefer to pay more'],
    severity: 'medium'
  },
  DISGUISED_ADS: {
    signals: ['sponsored', 'promoted', 'advertisement', 'ad -', 'brought to you by'],
    severity: 'medium'
  },
  ROACH_MOTEL: {
    signals: ['cancel anytime', 'easy cancellation', 'no commitment', 'cancel subscription'],
    severity: 'high'
  }
};

function detectDarkPatterns(pageData) {
  const detected = [];
  if (!pageData) return detected;

  const bodyText = (pageData.bodyTextSample || '').toLowerCase();
  const fullText = [bodyText, (pageData.title || '').toLowerCase(), (pageData.metaDescription || '').toLowerCase(), (pageData.cookieBannerText || '').toLowerCase()].join(' ');

  const hasContentScript = typeof document !== 'undefined';

  if (pageData.countdownTimers > 0) {
    detected.push({
      type: 'urgency',
      description: `Found ${pageData.countdownTimers} countdown timer(s) creating artificial urgency`,
      severity: 'high'
    });
  }

  if (pageData.socialProofElements > 0) {
    detected.push({
      type: 'social_proof',
      description: `Detected ${pageData.socialProofElements} social proof element(s)`,
      severity: 'medium'
    });
  }

  if (pageData.hasNewsletterForm) {
    const hasNegativeOptOut = PATTERNS.NEWSLETTER_TRAP.signals.some(s => fullText.includes(s));
    if (hasNegativeOptOut) {
      detected.push({
        type: 'confirmshaming',
        description: 'Newsletter opt-out uses guilt-tripping language',
        severity: 'medium'
      });
    }
  }

  if (pageData.hasCookieBanner) {
    const bannerText = (pageData.cookieBannerText || '').toLowerCase();
    const hasTrackingSignals = /targeted|personalized|share.*data|third.?party/i.test(bannerText);
    if (hasTrackingSignals) {
      detected.push({
        type: 'privacy_zuckering',
        description: 'Cookie consent banner may obscure data sharing practices',
        severity: 'medium'
      });
    }
  }

  if (pageData.popupCount > 2) {
    detected.push({
      type: 'misdirection',
      description: `${pageData.popupCount} popups/overlays detected, potentially distracting from content`,
      severity: 'low'
    });
  }

  if (pageData.adElements > 10) {
    detected.push({
      type: 'disguised_ads',
      description: `High ad density (${pageData.adElements} elements)`,
      severity: 'medium'
    });
  }

  const urgencySignals = PATTERNS.FAKE_URGENCY.signals.filter(s => fullText.includes(s));
  if (urgencySignals.length > 0) {
    detected.push({
      type: 'urgency',
      description: `Fake urgency language detected: "${urgencySignals.slice(0, 3).join(', ')}"`,
      severity: 'high'
    });
  }

  const socialProofSignals = PATTERNS.SOCIAL_PROOF_MANIPULATION.signals.filter(s => fullText.includes(s));
  if (socialProofSignals.length > 0) {
    detected.push({
      type: 'social_proof',
      description: `Social proof manipulation: "${socialProofSignals.slice(0, 2).join(', ')}"`,
      severity: 'medium'
    });
  }

  const hiddenCostSignals = PATTERNS.HIDDEN_COSTS.signals.filter(s => fullText.includes(s));
  if (hiddenCostSignals.length > 0) {
    detected.push({
      type: 'hidden_costs',
      description: `Hidden cost indicators found: "${hiddenCostSignals.slice(0, 2).join(', ')}"`,
      severity: 'high'
    });
  }

  if (pageData.formCount > 3 && !pageData.hasNewsletterForm) {
    detected.push({
      type: 'privacy_zuckering',
      description: `${pageData.formCount} forms on page suggesting extensive data collection`,
      severity: 'medium'
    });
  }

  const uniqueTypes = new Set();
  const deduped = detected.filter(d => {
    if (uniqueTypes.has(d.type + d.severity)) return false;
    uniqueTypes.add(d.type + d.severity);
    return true;
  });

  return deduped.slice(0, 15);
}

module.exports = { detectDarkPatterns, PATTERNS };
