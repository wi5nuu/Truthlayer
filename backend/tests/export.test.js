const request = require('supertest');
const app = require('../src/app');

test('GET /api/v1/export/:domain/json returns 404 for unknown domain', async () => {
  const res = await request(app).get('/api/v1/export/unknown.example/json').expect(404);
  expect(res.body.success).toBe(false);
});

test('GET /api/v1/export/:domain/csv returns 404 for unknown domain', async () => {
  const res = await request(app).get('/api/v1/export/unknown.example/csv').expect(404);
  expect(res.body.success).toBe(false);
});

test('GET /api/v1/export/:domain/json sets correct headers', async () => {
  const pageData = {
    url: 'https://export-test.com', domain: 'export-test.com', title: 'Test',
    metaDescription: '', headings: ['Hello'], bodyTextSample: 'test',
    externalLinks: [], formCount: 0, formFields: [], hasNewsletterForm: false,
    hasCookieBanner: false, cookieBannerText: '', hasPaywall: false,
    popupCount: 0, countdownTimers: 0, adElements: 0, socialProofElements: 0,
    scripts: [], trackers: [], pageLoadTime: 100, hasAMP: false, language: 'en', publishDate: ''
  };
  await request(app).post('/api/v1/analyze').send({ pageData });

  const res = await request(app).get('/api/v1/export/export-test.com/json');
  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toContain('application/json');
  expect(res.headers['content-disposition']).toContain('truthlayer-export-test.com.json');
});

test('GET /api/v1/report/:domain/history returns paginated results', async () => {
  const pageData = {
    url: 'https://paginated.com', domain: 'paginated.com', title: 'Test',
    metaDescription: '', headings: ['Hello'], bodyTextSample: 'test',
    externalLinks: [], formCount: 0, formFields: [], hasNewsletterForm: false,
    hasCookieBanner: false, cookieBannerText: '', hasPaywall: false,
    popupCount: 0, countdownTimers: 0, adElements: 0, socialProofElements: 0,
    scripts: [], trackers: [], pageLoadTime: 100, hasAMP: false, language: 'en', publishDate: ''
  };
  await request(app).post('/api/v1/analyze').send({ pageData });

  const res = await request(app).get('/api/v1/report/paginated.com/history?page=1&limit=5');
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(typeof res.body.page).toBe('number');
  expect(typeof res.body.totalPages).toBe('number');
});
