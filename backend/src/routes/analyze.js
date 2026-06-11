const express = require('express');
const router = express.Router();
const { analyzePage } = require('../services/ai-analyzer');
const { detectDarkPatterns } = require('../services/dark-pattern-detector');
const { calculateTrustScore } = require('../services/trust-scorer');
const cacheService = require('../services/cache-service');
const { rateLimiter } = require('../middleware/rate-limiter');

router.post('/', rateLimiter, async (req, res, next) => {
  try {
    const { pageData, tier = 'free' } = req.body;

    if (!pageData || !pageData.domain || !pageData.url) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: pageData with domain and url is required'
      });
    }

    const domain = pageData.domain;

    const cached = await cacheService.getCachedAnalysis(domain);
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
        cacheExpiry: cached.cacheExpiry || new Date(Date.now() + 86400000).toISOString()
      });
    }

    const darkPatterns = detectDarkPatterns(pageData);

    let aiAnalysis;
    try {
      aiAnalysis = await analyzePage(pageData);
    } catch (aiErr) {
      aiAnalysis = generateFallbackAnalysis(pageData);
    }

    const trustResult = calculateTrustScore(aiAnalysis, darkPatterns, pageData);

    const result = {
      success: true,
      domain,
      analyzedAt: new Date().toISOString(),
      trustScore: trustResult.score,
      trustLabel: trustResult.label,
      primaryIntent: aiAnalysis.intents?.[0]?.intent || 'Unknown',
      intents: aiAnalysis.intents || [],
      darkPatterns: {
        count: darkPatterns.length + (aiAnalysis.darkPatterns?.count || 0),
        detected: [
          ...darkPatterns,
          ...(aiAnalysis.darkPatterns?.detected || [])
        ]
      },
      dataCollection: aiAnalysis.dataCollection || {
        percentage: estimateDataCollection(pageData),
        trackers: pageData.trackers || [],
        dataTypes: []
      },
      aiContent: aiAnalysis.aiContent || { percentage: 0, confidence: 0 },
      manipulationLevel: determineManipulationLevel(trustResult.score, darkPatterns.length),
      summary: aiAnalysis.summary || generateSummary(domain, trustResult.score),
      cached: false,
      cacheExpiry: new Date(Date.now() + 86400000).toISOString()
    };

    await cacheService.setCachedAnalysis(domain, result);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

function estimateDataCollection(pageData) {
  let score = 0;
  if (pageData.trackers?.length > 0) {
    score += Math.min(pageData.trackers.length * 10, 50);
  }
  if (pageData.formFields?.length > 3) score += 10;
  if (pageData.hasNewsletterForm) score += 10;
  if (pageData.hasCookieBanner) score += 5;
  if (pageData.scripts?.length > 20) score += 10;
  if (pageData.externalLinks?.length > 15) score += 5;
  return Math.min(score, 100);
}

function determineManipulationLevel(score, darkPatternCount) {
  if (score < 30 && darkPatternCount > 8) return 'extreme';
  if (score < 50 && darkPatternCount > 4) return 'high';
  if (score < 70 && darkPatternCount > 2) return 'medium';
  return 'low';
}

function generateSummary(domain, score) {
  if (score >= 80) return `${domain} appears to be highly transparent and trustworthy.`;
  if (score >= 60) return `${domain} is generally reliable but employs some persuasive techniques.`;
  if (score >= 40) return `${domain} uses noticeable manipulative tactics. Exercise caution.`;
  return `${domain} shows significant manipulative behavior and dark patterns. High risk.`;
}

function generateFallbackAnalysis(pageData) {
  return {
    intents: [{
      rank: 1,
      intent: 'Unknown',
      confidence: 0.5,
      evidence: ['Analysis unavailable']
    }],
    darkPatterns: { count: 0, detected: [] },
    dataCollection: {
      percentage: estimateDataCollection(pageData),
      trackers: pageData.trackers || [],
      dataTypes: []
    },
    aiContent: { percentage: 0, confidence: 0 },
    summary: `Analysis of ${pageData.domain} completed with limited data.`
  };
}

module.exports = router;
