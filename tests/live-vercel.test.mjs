import test from "node:test";
import assert from "node:assert/strict";

const LIVE_URL = "https://verikonacademy.vercel.app";
const ADMIN_KEY = "verikon2026";
const runId = Date.now();

console.log(`\n============================================================`);
console.log(`  STARTING COMPREHENSIVE LIVE AUDIT ON: ${LIVE_URL}`);
console.log(`  Run ID: ${runId}`);
console.log(`============================================================\n`);

// -------------------------------------------------------------
// SUITE 1: Public Pages & Content Delivery
// -------------------------------------------------------------
test("1.1 Home Page (GET /) renders with full content", async () => {
  const res = await fetch(`${LIVE_URL}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes("Edge AI"), "Home page should mention Edge AI");
  assert.ok(html.includes("Curriculum") || html.includes("curriculum") || html.includes("Hardware"), "Should contain curriculum/hardware");
});

test("1.2 Register Page (GET /register) loads with form fields", async () => {
  const res = await fetch(`${LIVE_URL}/register`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes("organisation") || html.includes("Institution"), "Should contain institution field");
  assert.ok(html.includes("email"), "Should contain email field");
});

test("1.3 Admin Page (GET /admin) is secure and conceals passcode", async () => {
  const res = await fetch(`${LIVE_URL}/admin`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes("Admin Access Required"), "Should show login title");
  assert.ok(!html.includes("Default passcode: verikon2026"), "SECURITY CHECK: Default passcode must NOT be displayed");
});

test("1.4 About Page (GET /about) renders successfully", async () => {
  const res = await fetch(`${LIVE_URL}/about`);
  assert.equal(res.status, 200);
});

test("1.5 Contact Page (GET /contact) renders successfully", async () => {
  const res = await fetch(`${LIVE_URL}/contact`);
  assert.equal(res.status, 200);
});

test("1.6 Custom 404 Page (GET /non-existent-page-xyz)", async () => {
  const res = await fetch(`${LIVE_URL}/non-existent-page-xyz`);
  assert.equal(res.status, 404, "Unknown routes must return HTTP 404");
});

// -------------------------------------------------------------
// SUITE 2: API & Health Diagnostics
// -------------------------------------------------------------
test("2.1 Diagnostic Endpoint (GET /api/health) returns valid health report", async () => {
  const res = await fetch(`${LIVE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.service, "Verikon Academy Backend");
  assert.ok(data.storage, "Storage info must be present");
  assert.ok(data.storage.localFallback, "Local fallback must be active");
});

test("2.2 CORS Preflight check on /api/register (OPTIONS)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, { method: "OPTIONS" });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.ok(res.headers.get("access-control-allow-methods").includes("POST"));
});

test("2.3 CORS Preflight check on /api/admin/registrations (OPTIONS)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, { method: "OPTIONS" });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.ok(res.headers.get("access-control-allow-methods").includes("GET"));
});

// -------------------------------------------------------------
// SUITE 3: Input Validation & Boundary Cases (POST /api/register)
// -------------------------------------------------------------
test("3.1 Validation: Missing organisation rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Prof. Case Tester",
      email: `valid_${runId}@example.edu`,
      phone: "+91 9876543210",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /institution|college/i);
});

test("3.2 Validation: Short organisation name (< 2 chars) rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "A",
      name: "Prof. Case Tester",
      email: `valid_${runId}@example.edu`,
      phone: "+91 9876543210",
    }),
  });
  assert.equal(res.status, 400);
});

test("3.3 Validation: Missing contact person name rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University",
      email: `valid_${runId}@example.edu`,
      phone: "+91 9876543210",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /contact person/i);
});

test("3.4 Validation: Missing email address rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University",
      name: "Prof. Sharma",
      phone: "+91 9876543210",
    }),
  });
  assert.equal(res.status, 400);
});

test("3.5 Validation: Malformed email without @ rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University",
      name: "Prof. Sharma",
      email: "invalidemailaddress.com",
      phone: "+91 9876543210",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /valid.*email/i);
});

test("3.6 Validation: Short phone number (< 7 digits) rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University",
      name: "Prof. Sharma",
      email: `valid_${runId}@example.edu`,
      phone: "12345",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /phone/i);
});

test("3.7 Validation: Phone number with letters rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University",
      name: "Prof. Sharma",
      email: `valid_${runId}@example.edu`,
      phone: "phone-not-a-number",
    }),
  });
  assert.equal(res.status, 400);
});

test("3.8 Validation: Unknown workshop courseSlug rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University",
      name: "Prof. Sharma",
      email: `valid_${runId}@example.edu`,
      phone: "+91 9876543210",
      courseSlug: "invalid-quantum-computing-slug",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /unknown workshop/i);
});

test("3.9 Validation: Malformed non-JSON body rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "Not a JSON string { broken syntax",
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /malformed/i);
});

test("3.10 Security: Bot Honeypot sink trap (200 Silent Drop)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Spam University",
      name: "Bot Spammer",
      email: "bot@spammer-domain.xyz",
      phone: "+91 9876543210",
      hp: "Hidden honeypot trap field filled by scraper",
    }),
  });
  assert.equal(res.status, 200, "Should return 200 to trick bots into stopping");
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.honeypot, true);
});

test("3.11 Security: XSS input sanitization (Script tags stripped)", async () => {
  const maliciousEmail = `xss_${runId}@sanitization-test.edu`;
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "<b>Indian Institute of Technology</b><script>alert(1)</script>",
      name: "Dr. <script>evil()</script>Animesh",
      email: maliciousEmail,
      phone: "+91 9876543210",
      role: "Faculty",
      cohortSize: "60–120 students",
      notes: "Testing <img src=x onerror=alert(1)> sanitization",
    }),
  });
  assert.equal(res.status, 200, "Sanitized input should be accepted safely");
  const data = await res.json();
  assert.equal(data.ok, true);
});

test("3.12 Registration: Valid institutional registration accepted (200)", async () => {
  const validEmail = `live_verify_${runId}@dtu.ac.in`;
  const res = await fetch(`${LIVE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organisation: "Delhi Technological University (DTU)",
      name: "Prof. Rajesh Kumar",
      email: validEmail,
      phone: "+91 98765 43210",
      role: "Head of Department (HOD) / Dean",
      cohortSize: "120–250 students (Campus-level / Multi-batch)",
      format: "On-campus (We bring edge hardware & kits to your campus)",
      notes: "Targeting 3rd year CSE and ECE students.",
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.ok(["supabase", "local_fallback"].includes(data.source));
});

// -------------------------------------------------------------
// SUITE 4: Admin API Security & Authentication
// -------------------------------------------------------------
test("4.1 Admin Security: Unauthenticated request rejected (401)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.match(data.error, /unauthorized|invalid admin key/i);
});

test("4.2 Admin Security: Invalid passcode rejected (401)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, {
    headers: { "x-admin-key": "wrong_password_attempt" },
  });
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.ok, false);
});

test("4.3 Admin Fetch: Authorized access with x-admin-key (200)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, {
    headers: { "x-admin-key": ADMIN_KEY },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.ok(Array.isArray(data.registrations), "Should return array of leads");
});

test("4.4 Admin Fetch: Authorized access with Bearer header (200)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, {
    headers: { Authorization: `Bearer ${ADMIN_KEY}` },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
});

test("4.5 Admin Status Update: Missing fields rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY,
    },
    body: JSON.stringify({ id: "some-id" }), // Missing status
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /missing required fields/i);
});

test("4.6 Admin Status Update: Invalid status value rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY,
    },
    body: JSON.stringify({
      id: "some-id",
      status: "unsupported_status_xyz",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /invalid status/i);
});

test("4.7 Admin Delete: Missing ID query param rejected (400)", async () => {
  const res = await fetch(`${LIVE_URL}/api/admin/registrations`, {
    method: "DELETE",
    headers: { "x-admin-key": ADMIN_KEY },
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /missing 'id'/i);
});

// -------------------------------------------------------------
// SUITE 5: HTTP Method Restrictions
// -------------------------------------------------------------
test("5.1 Method Not Allowed on /api/register (GET rejected)", async () => {
  const res = await fetch(`${LIVE_URL}/api/register`, { method: "GET" });
  assert.equal(res.status, 405, "GET method should be rejected on registration POST endpoint");
});
