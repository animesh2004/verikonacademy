import { NextResponse } from "next/server";
import { workshop } from "@/lib/workshop";
import { getServiceClient } from "@/lib/supabase";
import { site } from "@/lib/site";

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

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const courseSlug = clean(body.courseSlug, 100);

  if (!name) {
    return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
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

  const record = {
    // Tags this row as a course lead so it can be told apart from the agency's
    // service enquiries in the all_leads view. See supabase/schema.sql.
    enquiry_type: "course",
    name,
    email,
    phone: clean(body.phone, 40),
    organisation: clean(body.organisation, 160),
    course_slug: workshop.slug,
    course_title: workshop.title,
    batch_starts_on: validBatch,
    attending_as: clean(body.attendingAs, 60),
    branch: clean(body.branch, 40),
    experience: clean(body.experience, 60),
    goal: clean(body.goal, 2000),
    source: clean(request.headers.get("referer"), 300),
    user_agent: clean(request.headers.get("user-agent"), 400),
  };

  const supabase = getServiceClient();

  if (!supabase) {
    // Supabase not wired up yet. Never pretend a real registration was stored.
    console.warn("[register] Supabase is not configured — registration not stored:", record);

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          ok: false,
          error: `Our registration system is not reachable right now. Please email ${site.email} and we will hold your seat.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Logged to the server console. Supabase is not configured in this environment, so nothing was saved.",
    });
  }

  const { error } = await supabase.from("registrations").insert(record);

  if (error) {
    // 23505 = unique violation, i.e. this email already registered for this workshop.
    if (error.code === "23505") {
      return NextResponse.json({
        ok: true,
        message: "You are already on the list. We will be in touch shortly.",
      });
    }

    console.error("[register] insert failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: `We could not save your registration. Please email ${site.email} and we will sort it out.`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
