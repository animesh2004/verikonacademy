import { NextResponse } from "next/server";
import { workshop } from "@/lib/workshop";
import { getServiceClient } from "@/lib/supabase";
import { saveLocalRegistration, isLocalDuplicate } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  organisation?: string;
  courseSlug?: string;
  batchStartsOn?: string;
  attendingAs?: string;
  branch?: string;
  experience?: string;
  goal?: string;
  role?: string;
  cohortSize?: string;
  format?: string;
  notes?: string;
  hp?: string; // Honeypot field for bot detection
};

// Strict email regex (RFC 5322 compliant subset)
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// In-memory IP rate limiter (10 submissions per 10 minutes per IP in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  // Never rate-limit loopback/localhost in development
  if (
    process.env.NODE_ENV !== "production" &&
    (ip === "127.0.0.1" || ip === "::1" || ip === "localhost")
  ) {
    return false;
  }

  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 10;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Clean and sanitize string inputs, preventing HTML/script injection
const clean = (v: unknown, max = 500) => {
  if (typeof v !== "string") return null;
  const sanitized = v
    .replace(/[<>]/g, "") // Strip HTML tag characters
    .trim()
    .slice(0, max);
  return sanitized.length > 0 ? sanitized : null;
};

export async function POST(request: Request) {
  // 1. Client IP Detection & Rate Limiting
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429, headers: corsHeaders }
    );
  }

  // 2. Parse Body safely
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request payload." },
      { status: 400, headers: corsHeaders }
    );
  }

  // 3. Honeypot check: If bot filled the hidden honeypot field, silently succeed without writing to DB
  if (body.hp && body.hp.trim().length > 0) {
    console.warn(`[register] Bot honeypot triggered from IP: ${ip}`);
    return NextResponse.json({ ok: true, honeypot: true }, { headers: corsHeaders });
  }

  // 4. Sanitize inputs
  const organisation = clean(body.organisation, 200);
  const name = clean(body.name, 120);
  const email = clean(body.email?.toLowerCase(), 200);
  const phone = clean(body.phone, 30);
  const courseSlug = clean(body.courseSlug, 100);
  const role = clean(body.role, 100);
  const cohortSize = clean(body.cohortSize, 100);
  const format = clean(body.format, 100);
  const notes = clean(body.notes ?? body.goal, 2000);

  // 5. Validations
  if (!organisation || organisation.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please enter your institution or college name." },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please provide the contact person's name." },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid official/work email address." },
      { status: 400, headers: corsHeaders }
    );
  }

  const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
  if (!phone || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid phone number (between 7 and 15 digits)." },
      { status: 400, headers: corsHeaders }
    );
  }

  if (courseSlug && courseSlug !== workshop.slug) {
    return NextResponse.json(
      { ok: false, error: "Unknown workshop selected." },
      { status: 400, headers: corsHeaders }
    );
  }

  const batchStartsOn = clean(body.batchStartsOn, 10);
  const validBatch =
    batchStartsOn && workshop.batches.some((b) => b.startsOn === batchStartsOn)
      ? batchStartsOn
      : null;

  const goalSummaryParts = [
    cohortSize ? `Cohort Size: ${cohortSize}` : null,
    role ? `Role: ${role}` : null,
    format ? `Preferred Format: ${format}` : null,
    notes ? `\nNotes & Requirements:\n${notes}` : null,
  ].filter(Boolean);

  const record = {
    enquiry_type: "course",
    organisation,
    name,
    email,
    phone,
    role,
    cohort_size: cohortSize,
    format,
    course_slug: workshop.slug,
    course_title: workshop.title,
    batch_starts_on: validBatch,
    attending_as: role ? `Institution (${role})` : "Institution",
    branch: cohortSize ?? clean(body.branch, 40),
    experience: format ?? clean(body.experience, 60),
    goal: goalSummaryParts.join(" | "),
    notes: `Cohort: ${cohortSize ?? "N/A"} | Role: ${role ?? "N/A"} | Format: ${format ?? "N/A"}`,
    source: clean(request.headers.get("referer"), 300),
    user_agent: clean(request.headers.get("user-agent"), 400),
    status: "new",
  };

  const supabase = getServiceClient();

  // 6. Duplicate check against Supabase if available, otherwise check local fallback
  if (supabase) {
    try {
      const { data: existingRows } = await supabase
        .from("registrations")
        .select("id")
        .eq("email", email)
        .eq("course_slug", workshop.slug)
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        return NextResponse.json(
          {
            ok: true,
            alreadyRegistered: true,
            message: "Your institution is already registered with us. We will be in touch shortly.",
          },
          { status: 200, headers: corsHeaders }
        );
      }
    } catch (checkErr) {
      console.warn("[register] Supabase duplicate check query failed, proceeding:", checkErr);
    }
  } else if (isLocalDuplicate(email, workshop.slug)) {
    return NextResponse.json(
      {
        ok: true,
        alreadyRegistered: true,
        message: "Your institution is already registered with us. We will be in touch shortly.",
      },
      { status: 200, headers: corsHeaders }
    );
  }

  // 7. Database Insertion with Supabase & Fallback
  if (supabase) {
    try {
      const { error } = await supabase.from("registrations").insert(record);

      if (!error) {
        return NextResponse.json({ ok: true, source: "supabase" }, { headers: corsHeaders });
      }

      if (error.code === "23505") {
        return NextResponse.json(
          {
            ok: true,
            alreadyRegistered: true,
            message: "Your institution is already registered with us. We will be in touch shortly.",
          },
          { status: 200, headers: corsHeaders }
        );
      }

      console.error("[register] Supabase insert failed, attempting local fallback:", error.message);
    } catch (err) {
      console.error("[register] Supabase exception, attempting local fallback:", err);
    }
  } else {
    console.warn("[register] Supabase not configured, saving to local fallback storage.");
  }

  // Fallback to local file storage
  const saved = saveLocalRegistration(record);
  if (saved) {
    return NextResponse.json({ ok: true, source: "local_fallback" }, { headers: corsHeaders });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Unable to process registration at this time. Please contact us directly via email.",
    },
    { status: 500, headers: corsHeaders }
  );
}
