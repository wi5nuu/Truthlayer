const { calculateTrustScore, getTrustLabel } = require('../src/services/trust-scorer');

function createEmptyPageData() {
  return {
    url: 'https://example.com',
    domain: 'example.com',
    title: 'Test',
    bodyTextSample: 'Welcome to example.com',
    trackers: [],
    adElements: 0,
    popupCount: 0,
    formCount: 0,
    scripts: [],
    externalLinks: [],
    formFields: [],
    hasCookieBanner: false,
    hasNewsletterForm: false,
    countdownTimers: 0,
    socialProofElements: 0
  };
}

test('score 90+ for website with 0 dark patterns', () => {
  const { score } = calculateTrustScore(
    { intents: [], dataCollection: { percentage: 5 }, aiContent: { percentage: 0 } },
    [],
    { ...createEmptyPageData(), url: 'https://example.com' }
  );
  expect(score).toBeGreaterThanOrEqual(90);
});

test('score < 40 for website with 5+ high severity dark patterns', () => {
  const darkPatterns = [
    { type: 'urgency', description: 'Fake countdown', severity: 'high' },
    { type: 'urgency', description: 'Limited stock', severity: 'high' },
    { type: 'hidden_costs', description: 'Hidden fees', severity: 'high' },
    { type: 'social_proof', description: 'Fake reviews', severity: 'high' },
    { type: 'privacy_zuckering', description: 'Data trickery', severity: 'high' }
  ];
  const { score } = calculateTrustScore(
    { intents: [], dataCollection: { percentage: 10 }, aiContent: { percentage: 0 } },
    darkPatterns,
    createEmptyPageData()
  );
  expect(score).toBeLessThan(40);
});

test('score deduction proportional to severity', () => {
  const highPattern = [{ type: 'urgency', description: 'Test', severity: 'high' }];
  const mediumPattern = [{ type: 'social_proof', description: 'Test', severity: 'medium' }];
  const lowPattern = [{ type: 'misdirection', description: 'Test', severity: 'low' }];

  const base = createEmptyPageData();
  const baseResult = calculateTrustScore({ intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } }, [], { ...base, url: 'https://example.com' });

  const highResult = calculateTrustScore({ intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } }, highPattern, { ...base, url: 'https://example.com' });
  const mediumResult = calculateTrustScore({ intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } }, mediumPattern, { ...base, url: 'https://example.com' });
  const lowResult = calculateTrustScore({ intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } }, lowPattern, { ...base, url: 'https://example.com' });

  expect(baseResult.score - highResult.score).toBeGreaterThanOrEqual(6);
  expect(mediumResult.score - highResult.score).toBeGreaterThanOrEqual(1);
  expect(lowResult.score - mediumResult.score).toBeGreaterThanOrEqual(1);
});

test('score never below 0', () => {
  const manyPatterns = Array.from({ length: 20 }, (_, i) => ({
    type: 'urgency',
    description: `Pattern ${i}`,
    severity: 'high'
  }));
  const { score } = calculateTrustScore(
    { intents: [], dataCollection: { percentage: 100 }, aiContent: { percentage: 100 } },
    manyPatterns,
    { ...createEmptyPageData(), adElements: 50, popupCount: 20, trackers: Array(100).fill('tracker.com') }
  );
  expect(score).toBeGreaterThanOrEqual(0);
});

test('score never above 100', () => {
  const { score } = calculateTrustScore(
    { intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } },
    [],
    { ...createEmptyPageData(), url: 'https://example.com' }
  );
  expect(score).toBeLessThanOrEqual(100);
});

test('HTTPS adds bonus', () => {
  const data = createEmptyPageData();
  const deductPattern = [{ type: 'test', description: 'Small deduction', severity: 'low' }];
  const httpResult = calculateTrustScore({ intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } }, deductPattern, { ...data, url: 'http://example.com' });
  const httpsResult = calculateTrustScore({ intents: [], dataCollection: { percentage: 0 }, aiContent: { percentage: 0 } }, deductPattern, { ...data, url: 'https://example.com' });
  expect(httpsResult.score).toBeGreaterThan(httpResult.score);
});

test('label assignment correct for score ranges', () => {
  expect(getTrustLabel(85)).toBe('Highly Trustworthy');
  expect(getTrustLabel(70)).toBe('Generally Trustworthy');
  expect(getTrustLabel(50)).toBe('Use With Caution');
  expect(getTrustLabel(30)).toBe('Potentially Manipulative');
  expect(getTrustLabel(10)).toBe('High Risk');
});
