const request = require('supertest');
const app = require('../src/app');

function createValidPageData() {
  return {
    url: 'https://example.com',
    domain: 'example.com',
    title: 'Example Domain',
    metaDescription: 'Test description',
    headings: ['Welcome'],
    bodyTextSample: 'This domain is for use in illustrative examples.',
    externalLinks: [],
    formCount: 0,
    formFields: [],
    hasNewsletterForm: false,
    hasCookieBanner: false,
    cookieBannerText: '',
    hasPaywall: false,
    popupCount: 0,
    countdownTimers: 0,
    adElements: 0,
    socialProofElements: 0,
    scripts: [],
    trackers: [],
    pageLoadTime: 100,
    hasAMP: false,
    language: 'en',
    publishDate: ''
  };
}

test('POST /api/v1/analyze with valid pageData returns 200', async () => {
  const res = await request(app)
    .post('/api/v1/analyze')
    .send({ pageData: createValidPageData() })
    .expect(200);
  expect(res.body.success).toBe(true);
  expect(res.body.domain).toBe('example.com');
  expect(typeof res.body.trustScore).toBe('number');
  expect(res.body.intents).toBeInstanceOf(Array);
  expect(res.body.darkPatterns).toBeDefined();
});

test('POST /api/v1/analyze with empty pageData returns 400', async () => {
  const res = await request(app)
    .post('/api/v1/analyze')
    .send({ pageData: {} })
    .expect(400);
  expect(res.body.success).toBe(false);
});

test('POST /api/v1/analyze with missing body returns 400', async () => {
  const res = await request(app)
    .post('/api/v1/analyze')
    .send({})
    .expect(400);
  expect(res.body.success).toBe(false);
});

test('GET /health returns ok', async () => {
  const res = await request(app)
    .get('/health')
    .expect(200);
  expect(res.body.status).toBe('ok');
});

test('POST /api/v1/analyze duplicate request returns cached response', async () => {
  const pageData = { ...createValidPageData(), domain: 'cache-test.example.com', url: 'https://cache-test.example.com' };
  const first = await request(app)
    .post('/api/v1/analyze')
    .send({ pageData })
    .expect(200);
  expect(first.body.cached).toBe(false);

  const second = await request(app)
    .post('/api/v1/analyze')
    .send({ pageData })
    .expect(200);
  expect(second.body.cached).toBe(true);
  expect(second.body.domain).toBe(first.body.domain);
});

test('Rate limit enforcement returns 429 after exceeding limit', async () => {
  const pageData = { ...createValidPageData(), domain: 'rate-limit-test.example.com', url: 'https://rate-limit-test.example.com' };
  let got429 = false;
  for (let i = 0; i < 70; i++) {
    const res = await request(app)
      .post('/api/v1/analyze')
      .send({ pageData });
    if (res.status === 429) {
      got429 = true;
      break;
    }
  }
  expect(got429).toBe(true);
}, 30000);
