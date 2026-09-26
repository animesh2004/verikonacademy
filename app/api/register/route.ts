import { NextResponse } from "next/server";
import { workshop } from "@/lib/workshop";
import { getServiceClient } from "@/lib/supabase";
import { site } from "@/lib/site";
import { saveLocalRegistration } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) || null : null;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const organisation = clean(body.organisation, 200);
  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const courseSlug = clean(body.courseSlug, 100);
  const role = clean(body.role, 100);
  const cohortSize = clean(body.cohortSize, 100);
  const format = clean(body.format, 100);
  const notes = clean(body.notes ?? body.goal, 2000);

  if (!organisation) {
    return NextResponse.json(
      { ok: false, error: "Please enter your institution or college name." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Please provide the contact person's name." },
      { status: 400 }
    );
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "Please provide a contact phone number." },
      { status: 400 }
    );
  }
  if (courseSlug !== workshop.slug) {
    return NextResponse.json(
      { ok: false, error: "Unknown workshop." },
      { status: 400 }
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
    name,
    email,
    phone,
    organisation,
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
  };

  const supabase = getServiceClient();

  if (!supabase) {
    console.warn("[register] Supabase is not configured — saving locally:", record);
    saveLocalRegistration(record);
    return NextResponse.json({ ok: true });
  }

  try {
    const { error } = await supabase.from("registrations").insert(record);

    if (error) {
      // 23505 = unique violation
      if (error.code === "23505") {
        return NextResponse.json({
          ok: true,
          message: "Your institution is already registered with us. We will be in touch shortly.",
        });
      }

      console.warn("[register] Supabase error (falling back to local storage):", error.message);
      // Fallback to local storage so submission is never lost
      saveLocalRegistration(record);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[register] Supabase call threw error, saving to local fallback:", err);
    saveLocalRegistration(record);
    return NextResponse.json({ ok: true });
  }
}
