const express = require('express');
const router = express.Router();
const cacheService = require('../services/cache-service');

router.get('/:domain', async (req, res, next) => {
  try {
    const { domain } = req.params;
    if (!domain) {
      return res.status(400).json({ success: false, error: 'Domain parameter required' });
    }
    const cached = await cacheService.getCachedAnalysis(domain);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }
    res.status(404).json({
      success: false,
      error: 'No analysis found for this domain',
      domain
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:domain/history', async (req, res, next) => {
  try {
    const { domain } = req.params;
    const cached = await cacheService.getCachedAnalysis(domain);
    res.json({
      success: true,
      domain,
      history: cached ? [{
        trustScore: cached.trustScore,
        analyzedAt: cached.analyzedAt
      }] : []
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
