const express = require('express');
const router = express.Router();

const { getCachedAnalysis } = require('../services/cache-service');

router.get('/:domain/json', async (req, res) => {
  try {
    const data = await getCachedAnalysis(req.params.domain);
    if (!data) {
      return res.status(404).json({ success: false, error: 'No analysis found for this domain' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="truthlayer-${req.params.domain}.json"`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});

router.get('/:domain/csv', async (req, res) => {
  try {
    const data = await getCachedAnalysis(req.params.domain);
    if (!data) {
      return res.status(404).json({ success: false, error: 'No analysis found for this domain' });
    }
    const rows = [
      ['field', 'value'],
      ['domain', data.domain || ''],
      ['trustScore', data.trustScore ?? ''],
      ['trustLabel', data.trustLabel || ''],
      ['primaryIntent', data.primaryIntent || ''],
      ['manipulationLevel', data.manipulationLevel || ''],
      ['darkPatternsCount', data.darkPatterns?.count ?? ''],
      ['aiContentPercentage', data.aiContent?.percentage ?? ''],
      ['dataCollectionPercentage', data.dataCollection?.percentage ?? ''],
      ['analyzedAt', data.analyzedAt || '']
    ];
    if (data.intents?.length) {
      data.intents.forEach((intent, i) => {
        rows.push([`intent_${i+1}_rank`, String(intent.rank)]);
        rows.push([`intent_${i+1}_text`, intent.intent]);
        rows.push([`intent_${i+1}_confidence`, String(intent.confidence)]);
      });
    }
    if (data.darkPatterns?.detected?.length) {
      data.darkPatterns.detected.forEach((dp, i) => {
        rows.push([`darkPattern_${i+1}_type`, dp.type]);
        rows.push([`darkPattern_${i+1}_severity`, dp.severity]);
      });
    }
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="truthlayer-${req.params.domain}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});

module.exports = router;
