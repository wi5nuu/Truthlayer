const Anthropic = require('@anthropic-ai/sdk');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const AI_TIMEOUT = 30000;

const SYSTEM_PROMPT = `
You are TruthLayer's analysis engine. Your job is to analyze websites and reveal their true intentions, dark patterns, and manipulation tactics.

You receive structured data extracted from a webpage and must return a precise JSON analysis.

ANALYSIS FRAMEWORK:

1. PRIMARY INTENT ANALYSIS
   Identify the REAL goal of the website (not what they claim):
   - Sell products/services
   - Collect personal data
   - Generate ad revenue
   - Political/ideological influence
   - Build platform dependency
   - Generate leads
   - Extract attention for monetization
   - Spread information/misinformation

2. DARK PATTERN DETECTION
   Look for evidence of:
   - Urgency manipulation (fake countdowns, "limited stock")
   - Social proof manipulation (vague numbers, fake reviews indicators)
   - Roach motel (easy to get in, hard to get out)
   - Hidden costs or subscriptions
   - Confirmshaming (guilt-trip opt-out language)
   - Misdirection (visual tricks to guide attention)
   - Privacy zuckering (tricking into sharing more data)
   - Disguised ads (ads that look like content)

3. TRUST SCORING (0-100)
   Deduct points for:
   - Misleading content: -5 to -20
   - Each dark pattern: -3 to -8
   - Excessive tracking: -5 to -15
   - Manipulative language: -5 to -10
   - Poor transparency: -5 to -10

4. DATA COLLECTION ASSESSMENT
   Based on detected trackers and form fields

IMPORTANT RULES:
- Be specific and evidence-based. Cite what you found.
- Be fair. Distinguish between standard business practice and manipulation.
- Keep intent descriptions concise (max 10 words).
- Return ONLY valid JSON, no markdown, no explanation outside JSON.
`;

async function analyzePage(pageData) {
  if (!pageData) {
    throw new Error('pageData is required');
  }

  const sanitizedData = sanitizePageData(pageData);
  const compressedData = compressPageData(sanitizedData);

  let aiResponse;
  try {
    aiResponse = await callClaudeAPI(compressedData);
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('timeout')) {
      throw new Error('AI analysis timed out');
    }
    if (err.status === 401) {
      throw new Error('Invalid API key configuration');
    }
    throw new Error(`AI analysis failed: ${err.message}`);
  }

  const parsed = parseAndValidateResponse(aiResponse);

  return applyFallbackScoring(parsed, pageData);
}

function sanitizePageData(data) {
  const sensitivePatterns = [
    'password', 'credit', 'card_number', 'ssn', 'social_security',
    'bank_account', 'routing_number', 'cvv', 'cvc', 'pin'
  ];

  const sanitized = { ...data };

  if (sanitized.formFields) {
    sanitized.formFields = sanitized.formFields.filter(field => {
      const lower = field.toLowerCase();
      return !sensitivePatterns.some(p => lower.includes(p));
    });
  }

  if (sanitized.bodyTextSample) {
    sanitized.bodyTextSample = sanitized.bodyTextSample.substring(0, 1500);
  }

  return sanitized;
}

function compressPageData(data) {
  return {
    url: data.url,
    domain: data.domain,
    title: data.title,
    metaDescription: data.metaDescription,
    headings: (data.headings || []).slice(0, 10),
    bodyTextSample: (data.bodyTextSample || '').substring(0, 1500),
    externalLinks: (data.externalLinks || []).slice(0, 10),
    formCount: data.formCount,
    formFields: (data.formFields || []).slice(0, 15),
    hasNewsletterForm: data.hasNewsletterForm,
    hasCookieBanner: data.hasCookieBanner,
    cookieBannerText: (data.cookieBannerText || '').substring(0, 300),
    hasPaywall: data.hasPaywall,
    popupCount: data.popupCount,
    countdownTimers: data.countdownTimers,
    adElements: data.adElements,
    socialProofElements: data.socialProofElements,
    scripts: (data.scripts || []).slice(0, 15),
    trackers: data.trackers,
    language: data.language,
    hasAMP: data.hasAMP
  };
}

async function callClaudeAPI(pageData) {
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this website data and return a JSON object with trustScore, intents (array with rank, intent, confidence, evidence), darkPatterns (count, detected array), dataCollection (percentage, trackers, dataTypes), aiContent (percentage, confidence), manipulationLevel, and summary. Do not include markdown formatting. Website data:\n\n${JSON.stringify(pageData, null, 2)}`
        }
      ],
      timeout: AI_TIMEOUT
    });
    const text = response.content[0].text;
    return extractJsonFromResponse(text);
  }

  return generateSimulatedAnalysis(pageData);
}

function extractJsonFromResponse(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }
}

function parseAndValidateResponse(parsed) {
  const defaultStructure = {
    trustScore: 50,
    intents: [],
    darkPatterns: { count: 0, detected: [] },
    dataCollection: { percentage: 0, trackers: [], dataTypes: [] },
    aiContent: { percentage: 0, confidence: 0 },
    manipulationLevel: 'medium',
    summary: ''
  };

  return {
    trustScore: typeof parsed.trustScore === 'number' ? parsed.trustScore : defaultStructure.trustScore,
    intents: Array.isArray(parsed.intents) ? parsed.intents.map((intent, i) => ({
      rank: intent.rank || i + 1,
      intent: intent.intent || 'Unknown intent',
      confidence: intent.confidence || 0.5,
      evidence: Array.isArray(intent.evidence) ? intent.evidence : []
    })) : defaultStructure.intents,
    darkPatterns: parsed.darkPatterns ? {
      count: parsed.darkPatterns.count || (Array.isArray(parsed.darkPatterns.detected) ? parsed.darkPatterns.detected.length : 0),
      detected: Array.isArray(parsed.darkPatterns.detected) ? parsed.darkPatterns.detected.map(d => ({
        type: d.type || 'unknown',
        description: d.description || '',
        severity: d.severity || 'medium'
      })) : []
    } : defaultStructure.darkPatterns,
    dataCollection: parsed.dataCollection ? {
      percentage: parsed.dataCollection.percentage || 0,
      trackers: Array.isArray(parsed.dataCollection.trackers) ? parsed.dataCollection.trackers : [],
      dataTypes: Array.isArray(parsed.dataCollection.dataTypes) ? parsed.dataCollection.dataTypes : []
    } : defaultStructure.dataCollection,
    aiContent: parsed.aiContent ? {
      percentage: parsed.aiContent.percentage || 0,
      confidence: parsed.aiContent.confidence || 0
    } : defaultStructure.aiContent,
    manipulationLevel: ['low', 'medium', 'high', 'extreme'].includes(parsed.manipulationLevel) ? parsed.manipulationLevel : defaultStructure.manipulationLevel,
    summary: parsed.summary || defaultStructure.summary
  };
}

function applyFallbackScoring(parsed, pageData) {
  if (!parsed.trustScore || parsed.trustScore < 0 || parsed.trustScore > 100) {
    parsed.trustScore = 50;
  }

  if (!parsed.manipulationLevel || !['low', 'medium', 'high', 'extreme'].includes(parsed.manipulationLevel)) {
    if (parsed.trustScore < 30) parsed.manipulationLevel = 'extreme';
    else if (parsed.trustScore < 50) parsed.manipulationLevel = 'high';
    else if (parsed.trustScore < 70) parsed.manipulationLevel = 'medium';
    else parsed.manipulationLevel = 'low';
  }

  if (parsed.intents.length === 0) {
    parsed.intents = [{
      rank: 1,
      intent: 'General content delivery',
      confidence: 0.5,
      evidence: ['Standard webpage']
    }];
  }

  return parsed;
}

function generateSimulatedAnalysis(pageData) {
  const domain = pageData.domain || 'unknown.com';
  const hasTrackers = (pageData.trackers || []).length > 0;
  const trackerCount = (pageData.trackers || []).length;
  const hasCountdown = pageData.countdownTimers > 0;
  const hasSocialProof = pageData.socialProofElements > 0;
  const adCount = pageData.adElements || 0;
  const hasPopups = (pageData.popupCount || 0) > 0;

  let baseScore = 75;
  const reasons = [];

  if (hasCountdown) { baseScore -= 10; reasons.push('urgency tactics'); }
  if (hasSocialProof) { baseScore -= 5; reasons.push('social proof manipulation'); }
  if (trackerCount > 5) { baseScore -= 10; reasons.push(`extensive tracking (${trackerCount} trackers)`); }
  else if (trackerCount > 2) { baseScore -= 5; reasons.push(`moderate tracking (${trackerCount} trackers)`); }
  if (adCount > 15) { baseScore -= 8; reasons.push('high ad density'); }
  else if (adCount > 8) { baseScore -= 3; reasons.push('moderate ads'); }
  if (hasPopups) { baseScore -= 3; reasons.push('intrusive popups'); }
  if (pageData.hasNewsletterForm) { baseScore -= 3; reasons.push('newsletter pressure'); }
  if (pageData.hasPaywall) { baseScore -= 5; reasons.push('paywall present'); }

  const score = Math.max(0, Math.min(100, baseScore));

  const intents = [
    {
      rank: 1,
      intent: hasCountdown ? 'Drive urgency-based purchases' : 'Deliver content or service',
      confidence: hasCountdown ? 0.88 : 0.65,
      evidence: hasCountdown ? ['countdown timers', 'limited time offers'] : ['standard content delivery']
    }
  ];

  if (trackerCount > 0) {
    intents.push({
      rank: 2,
      intent: 'Collect user behavior data',
      confidence: 0.82,
      evidence: pageData.trackers?.slice(0, 3) || ['tracking scripts']
    });
  }

  if (pageData.hasNewsletterForm || adCount > 5) {
    intents.push({
      rank: 3,
      intent: 'Monetize via email or ads',
      confidence: 0.75,
      evidence: pageData.hasNewsletterForm ? ['newsletter signup'] : ['ad placements']
    });
  }

  return {
    trustScore: score,
    intents,
    darkPatterns: {
      count: (hasCountdown ? 1 : 0) + (hasSocialProof ? 1 : 0) + (trackerCount > 3 ? 1 : 0),
      detected: [
        ...(hasCountdown ? [{ type: 'urgency', description: 'Countdown timers creating artificial urgency', severity: 'high' }] : []),
        ...(hasSocialProof ? [{ type: 'social_proof', description: 'Social proof manipulation elements', severity: 'medium' }] : []),
        ...(trackerCount > 5 ? [{ type: 'privacy_zuckering', description: `Excessive tracking via ${trackerCount} trackers`, severity: 'medium' }] : [])
      ]
    },
    dataCollection: {
      percentage: Math.min(trackerCount * 12 + (pageData.formCount || 0) * 5, 100),
      trackers: pageData.trackers || [],
      dataTypes: trackerCount > 0 ? ['browsing behavior', 'page interactions'] : []
    },
    aiContent: {
      percentage: 15,
      confidence: 0.6
    },
    manipulationLevel: score < 40 ? 'high' : score < 60 ? 'medium' : 'low',
    summary: `${domain} ${reasons.length > 0 ? `shows signs of ${reasons.join(', ')}` : 'appears to be relatively transparent'}. ${hasTrackers ? `It uses ${trackerCount} tracking service(s) for analytics or advertising.` : ''}`
  };
}

module.exports = { analyzePage };
