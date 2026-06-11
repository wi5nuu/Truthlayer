const http = require('http');

const BASE = 'http://localhost:3001';
const TESTS = [
  { name: 'GET /health', method: 'GET', path: '/health', expect: (res, body) => body.status === 'ok' },
  {
    name: 'POST /api/v1/analyze valid',
    method: 'POST',
    path: '/api/v1/analyze',
    body: {
      pageData: {
        url: 'https://test.com', domain: 'test.com', title: 'Test',
        bodyTextSample: 'Hello world', headings: ['Welcome'], externalLinks: [],
        formCount: 0, formFields: [], hasNewsletterForm: false, hasCookieBanner: false,
        cookieBannerText: '', hasPaywall: false, popupCount: 0, countdownTimers: 0,
        adElements: 0, socialProofElements: 0, scripts: [], trackers: [],
        pageLoadTime: 100, hasAMP: false, language: 'en', publishDate: '', metaDescription: ''
      },
      tier: 'free'
    },
    expect: (res, body) => body.success === true && typeof body.trustScore === 'number'
  },
  {
    name: 'POST /api/v1/analyze empty data → 400',
    method: 'POST',
    path: '/api/v1/analyze',
    body: { pageData: {} },
    expect: (res) => res.statusCode === 400
  },
  {
    name: 'GET /api/v1/report/unknown → 404',
    method: 'GET',
    path: '/api/v1/report/unknown-test-123.com',
    expect: (res) => res.statusCode === 404
  },
  {
    name: 'GET /api/v1/export/unknown/json → 404',
    method: 'GET',
    path: '/api/v1/export/unknown-test-123.com/json',
    expect: (res) => res.statusCode === 404
  },
];

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 3001, path, method, timeout: 10000 };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve({ statusCode: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ statusCode: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (body) {
      req.setHeader('Content-Type', 'application/json');
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

(async () => {
  let passed = 0;
  for (const t of TESTS) {
    try {
      const res = await request(t.method, t.path, t.body);
      const ok = t.expect(res, res.body);
      console.log(`${ok ? 'PASS' : 'FAIL'} ${t.name}`);
      if (ok) passed++; else console.log(`  Expected ${t.expect.toString().slice(0, 60)}... got ${res.statusCode}`);
    } catch (err) {
      console.log(`FAIL ${t.name} — ${err.message}`);
    }
  }
  console.log(`\n${passed}/${TESTS.length} passed`);
  process.exit(passed === TESTS.length ? 0 : 1);
})();
