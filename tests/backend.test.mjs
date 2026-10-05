import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3001";
const ADMIN_KEY = process.env.ADMIN_KEY || "verikon2026";

// Generate unique test email to avoid colliding with real data
const testRunId = Date.now();
const testEmail = `test_${testRunId}@automated-test-suite.edu`;
let createdRegistrationId = null;

test("1. Health Check Endpoint — GET /api/health", async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200, "Health check should return status 200");

  const data = await res.json();
  assert.equal(data.ok, true, "Health response should indicate ok: true");
  assert.equal(typeof data.service, "string", "Service name should be returned");
  assert.ok(data.storage, "Storage diagnostics should be present");
  assert.ok(data.storage.supabase, "Supabase diagnostics should be present");
  assert.equal(data.storage.supabase.connected, true, "Supabase should be connected");
  assert.ok(data.storage.localFallback, "Local fallback status should be present");
});

test("2. CORS Preflight — OPTIONS /api/register & /api/admin/registrations", async () => {
  const res1 = await fetch(`${BASE_URL}/api/register`, { method: "OPTIONS" });
  assert.equal(res1.status, 204, "OPTIONS /api/register should return 204");
  assert.equal(res1.headers.get("access-control-allow-origin"), "*", "CORS allow-origin should be *");

  const res2 = await fetch(`${BASE_URL}/api/admin/registrations`, { method: "OPTIONS" });
  assert.equal(res2.status, 204, "OPTIONS /api/admin/registrations should return 204");
  assert.equal(res2.headers.get("access-control-allow-origin"), "*", "CORS allow-origin should be *");
});

test("3. Validation: Missing organisation name — POST /api/register", async () => {
  const payload = {
    name: "Dr. Test User",
    email: testEmail,
    phone: "+91 9876543210",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 400, "Should return 400 Bad Request");
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /institution|college/i);
});

test("4. Validation: Missing contact person name — POST /api/register", async () => {
  const payload = {
    organisation: "Test Institute of Technology",
    email: testEmail,
    phone: "+91 9876543210",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 400, "Should return 400 Bad Request");
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /name/i);
});

test("5. Validation: Invalid email format — POST /api/register", async () => {
  const payload = {
    organisation: "Test Institute of Technology",
    name: "Dr. Test User",
    email: "not-an-email",
    phone: "+91 9876543210",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 400, "Should return 400 Bad Request");
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /valid.*email/i);
});

test("6. Validation: Invalid phone number — POST /api/register", async () => {
  const payload = {
    organisation: "Test Institute of Technology",
    name: "Dr. Test User",
    email: testEmail,
    phone: "123", // Too short
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 400, "Should return 400 Bad Request");
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /phone/i);
});

test("7. Validation: Unknown course slug — POST /api/register", async () => {
  const payload = {
    organisation: "Test Institute of Technology",
    name: "Dr. Test User",
    email: testEmail,
    phone: "+91 9876543210",
    courseSlug: "non-existent-course",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 400, "Should return 400 Bad Request");
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /unknown workshop/i);
});

test("8. Validation: Malformed JSON body — POST /api/register", async () => {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not-json-at-all{",
  });

  assert.equal(res.status, 400, "Should return 400 Bad Request");
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /malformed/i);
});

test("9. Bot Honeypot Protection — POST /api/register", async () => {
  const payload = {
    organisation: "Bot University",
    name: "Spam Bot",
    email: "bot@spammer.com",
    phone: "+91 9876543210",
    hp: "I am a malicious bot filling hidden fields",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 200, "Should return 200 silently to sink bot traffic");
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.honeypot, true);
});

test("10. Successful Registration Submission — POST /api/register", async () => {
  const payload = {
    organisation: `Automated Test Institute #${testRunId}`,
    name: "Prof. Unit Tester",
    email: testEmail,
    phone: "+91 9876543210",
    role: "Head of Department (HOD) / Dean",
    cohortSize: "60–120 students (Department-wide)",
    format: "On-campus (We bring edge hardware & kits to your campus)",
    notes: "Automated verification test case run.",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 200, "Valid registration should return status 200");
  const data = await res.json();
  assert.equal(data.ok, true, "Response ok should be true");
  assert.ok(["supabase", "local_fallback"].includes(data.source), `Source was: ${data.source}`);
});

test("11. Duplicate Registration Prevention — POST /api/register", async () => {
  const payload = {
    organisation: `Automated Test Institute #${testRunId}`,
    name: "Prof. Unit Tester",
    email: testEmail,
    phone: "+91 9876543210",
    role: "Head of Department (HOD) / Dean",
    cohortSize: "60–120 students (Department-wide)",
  };

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 200, "Duplicate submission should return 200 status");
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.alreadyRegistered, true, "Should flag alreadyRegistered: true");
  assert.match(data.message, /already registered/i);
});

test("12. Admin Security: Unauthorized request — GET /api/admin/registrations", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/registrations`);
  assert.equal(res.status, 401, "Missing key should return 401 Unauthorized");
  const data = await res.json();
  assert.equal(data.ok, false);
});

test("13. Admin Security: Invalid admin key — GET /api/admin/registrations", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/registrations`, {
    headers: { "x-admin-key": "wrong_key_123" },
  });
  assert.equal(res.status, 401, "Invalid key should return 401 Unauthorized");
  const data = await res.json();
  assert.equal(data.ok, false);
});

test("14. Admin Fetch: Authorized access — GET /api/admin/registrations", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/registrations`, {
    headers: { "x-admin-key": ADMIN_KEY },
  });
  assert.equal(res.status, 200, "Valid admin key should return 200");
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.ok(Array.isArray(data.registrations), "Registrations should be an array");

  // Locate the test registration created in test #10
  const found = data.registrations.find((r) => r.email === testEmail);
  assert.ok(found, `Expected test record with email ${testEmail} to be present`);
  assert.equal(found.role, "Head of Department (HOD) / Dean");
  createdRegistrationId = found.id;
});

test("15. Admin Status Update — PATCH /api/admin/registrations", async () => {
  assert.ok(createdRegistrationId, "Registration ID should exist from previous test");

  const res = await fetch(`${BASE_URL}/api/admin/registrations`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY,
    },
    body: JSON.stringify({
      id: createdRegistrationId,
      status: "contacted",
    }),
  });

  assert.equal(res.status, 200, "PATCH should return 200 for valid update");
  const data = await res.json();
  assert.equal(data.ok, true);
});

test("16. Admin Cleanup: Delete test record — DELETE /api/admin/registrations", async () => {
  assert.ok(createdRegistrationId, "Registration ID should exist from previous test");

  const res = await fetch(
    `${BASE_URL}/api/admin/registrations?id=${createdRegistrationId}`,
    {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    }
  );

  assert.equal(res.status, 200, "DELETE should return 200");
  const data = await res.json();
  assert.equal(data.ok, true);

  // Verify it is gone
  const verifyRes = await fetch(`${BASE_URL}/api/admin/registrations`, {
    headers: { "x-admin-key": ADMIN_KEY },
  });
  const verifyData = await verifyRes.json();
  const foundAgain = verifyData.registrations.find((r) => r.id === createdRegistrationId);
  assert.equal(foundAgain, undefined, "Record should no longer exist after deletion");
});
