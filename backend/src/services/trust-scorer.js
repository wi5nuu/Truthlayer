function calculateTrustScore(aiAnalysis, darkPatterns, pageData) {
  let score = 100;
  const breakdown = [];
  let deductions = 0;

  const darkPatternCount = darkPatterns ? darkPatterns.length : 0;
  for (const dp of (darkPatterns || [])) {
    const deduction = dp.severity === 'high' ? 13 : dp.severity === 'medium' ? 6 : 3;
    score -= deduction;
    deductions += deduction;
    breakdown.push({
      type: 'dark_pattern',
      detail: dp.description,
      deduction: -deduction
    });
  }

  const dataCollectionLevel = aiAnalysis?.dataCollection?.percentage ||
    (pageData?.trackers ? estimateDataCollectionLevel(pageData) : 0);
  if (dataCollectionLevel > 80) {
    const deduction = 15;
    score -= deduction;
    deductions += deduction;
    breakdown.push({ type: 'excessive_tracking', detail: `Data collection level: ${dataCollectionLevel}%`, deduction: -deduction });
  } else if (dataCollectionLevel > 50) {
    const deduction = 8;
    score -= deduction;
    deductions += deduction;
    breakdown.push({ type: 'high_tracking', detail: `Data collection level: ${dataCollectionLevel}%`, deduction: -deduction });
  } else if (dataCollectionLevel > 20) {
    const deduction = 3;
    score -= deduction;
    deductions += deduction;
    breakdown.push({ type: 'moderate_tracking', detail: `Data collection level: ${dataCollectionLevel}%`, deduction: -deduction });
  }

  if (pageData) {
    if (pageData.adElements > 20) {
      const deduction = 8;
      score -= deduction;
      deductions += deduction;
      breakdown.push({ type: 'high_ad_density', detail: `${pageData.adElements} ad elements found`, deduction: -deduction });
    } else if (pageData.adElements > 10) {
      const deduction = 4;
      score -= deduction;
      deductions += deduction;
      breakdown.push({ type: 'moderate_ad_density', detail: `${pageData.adElements} ad elements found`, deduction: -deduction });
    }
    if (pageData.popupCount > 5) {
      const deduction = 5;
      score -= deduction;
      deductions += deduction;
      breakdown.push({ type: 'excessive_popups', detail: `${pageData.popupCount} popups detected`, deduction: -deduction });
    }
  }

  const aiContentPct = aiAnalysis?.aiContent?.percentage || 0;
  if (aiContentPct > 80) {
    const deduction = 10;
    score -= deduction;
    deductions += deduction;
    breakdown.push({ type: 'high_ai_content', detail: `AI-generated content: ${aiContentPct}%`, deduction: -deduction });
  } else if (aiContentPct > 60) {
    const deduction = 5;
    score -= deduction;
    deductions += deduction;
    breakdown.push({ type: 'moderate_ai_content', detail: `AI-generated content: ${aiContentPct}%`, deduction: -deduction });
  }

  let bonuses = 0;
  const isHttps = pageData?.url?.startsWith('https');
  if (isHttps) {
    bonuses += 3;
    breakdown.push({ type: 'bonus_https', detail: 'Uses HTTPS', bonus: 3 });
  }

  const domainAgeBonus = estimateDomainAge(pageData?.domain);
  if (domainAgeBonus > 0) {
    bonuses += domainAgeBonus;
    breakdown.push({ type: 'bonus_domain_age', detail: 'Established domain', bonus: domainAgeBonus });
  }

  score = Math.max(0, Math.min(100, score + bonuses));

  const label = getTrustLabel(score);

  return { score, breakdown, label, deductions, bonuses };
}

function estimateDataCollectionLevel(pageData) {
  let level = 0;
  if (pageData.trackers?.length > 0) {
    level += Math.min(pageData.trackers.length * 8, 40);
  }
  if (pageData.scripts?.length > 30) level += 15;
  else if (pageData.scripts?.length > 15) level += 8;
  if (pageData.formFields?.length > 5) level += 10;
  if (pageData.hasNewsletterForm) level += 10;
  if (pageData.externalLinks?.length > 20) level += 5;
  return Math.min(level, 100);
}

function estimateDomainAge(domain) {
  if (!domain) return 0;
  const knownOld = [
    'google.com', 'facebook.com', 'amazon.com', 'apple.com',
    'microsoft.com', 'wikipedia.org', 'youtube.com', 'twitter.com',
    'linkedin.com', 'reddit.com', 'yahoo.com', 'ebay.com',
    'netflix.com', 'instagram.com', 'whatsapp.com', 'github.com'
  ];
  if (knownOld.includes(domain)) return 5;
  return 0;
}

function getTrustLabel(score) {
  if (score >= 80) return 'Highly Trustworthy';
  if (score >= 60) return 'Generally Trustworthy';
  if (score >= 40) return 'Use With Caution';
  if (score >= 20) return 'Potentially Manipulative';
  return 'High Risk';
}

module.exports = { calculateTrustScore, getTrustLabel };
