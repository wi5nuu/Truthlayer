const express = require('express');
const router = express.Router();
const cacheService = require('../services/cache-service');

const inMemoryHistory = {};

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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    const domainHistory = inMemoryHistory[domain] || [];
    if (!inMemoryHistory[domain]) {
      const cached = await cacheService.getCachedAnalysis(domain);
      if (cached) {
        domainHistory.push({
          trustScore: cached.trustScore,
          trustLabel: cached.trustLabel,
          analyzedAt: cached.analyzedAt,
          manipulationLevel: cached.manipulationLevel
        });
        inMemoryHistory[domain] = domainHistory;
      }
    }

    const total = domainHistory.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const items = domainHistory.slice(start, start + limit);

    res.json({
      success: true,
      domain,
      page,
      limit,
      total,
      totalPages,
      history: items
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:domain/export', async (req, res, next) => {
  try {
    const { domain } = req.params;
    const cached = await cacheService.getCachedAnalysis(domain);
    if (!cached) {
      return res.status(404).json({ success: false, error: 'No analysis found for this domain' });
    }
    res.json({ success: true, ...cached, exportedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
