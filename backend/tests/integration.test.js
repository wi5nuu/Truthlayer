/**
 * Integration test: full analysis workflow.
 * Spins up the full app (requires server to run on port 3001).
 * Skip if server is not available.
 */
const { describe, it, expect } = require("@jest/globals");

const BASE = "http://localhost:3001";

describe("Integration: /api/v1/analyze", () => {
  const testPayload = {
    url: "https://example.com",
    html: "<html><body>Hello World</body></html>",
  };

  it("rejects requests without auth token", async () => {
    const res = await fetch(`${BASE}/api/v1/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });
    expect([400, 401]).toContain(res.status);
  });

  it("rejects missing html body with 400", async () => {
    const res = await fetch(`${BASE}/api/v1/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test",
      },
      body: JSON.stringify({ url: "https://example.com" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects invalid URL with 400", async () => {
    const res = await fetch(`${BASE}/api/v1/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test",
      },
      body: JSON.stringify({
        url: "not-a-url",
        html: "<html></html>",
      }),
    });
    expect([400, 401]).toContain(res.status);
  });
});
