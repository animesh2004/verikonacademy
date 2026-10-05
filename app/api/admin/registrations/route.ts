import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import {
  getLocalRegistrations,
  deleteLocalRegistration,
  updateLocalRegistrationStatus,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_SECRET = process.env.ADMIN_KEY ?? "verikon2026";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  return token === ADMIN_SECRET;
}

export async function GET(request: Request) {
  // 1. Security check: Verify admin secret key
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized access. Invalid admin key." },
      { status: 401, headers: corsHeaders }
    );
  }

  const localList = getLocalRegistrations();
  const supabase = getServiceClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        source: "local_fallback",
        registrations: localList,
      },
      { headers: corsHeaders }
    );
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[admin/registrations] Supabase query notice:", error.message);
      return NextResponse.json(
        {
          ok: true,
          source: "local_fallback",
          supabaseError: error.message,
          registrations: localList,
        },
        { headers: corsHeaders }
      );
    }

    // Deduplicate merged records: avoid duplicating records that exist in both
    const supabaseIds = new Set((data || []).map((r) => r.id));
    const supabaseEmails = new Set((data || []).map((r) => r.email?.toLowerCase()));

    const uniqueLocal = localList.filter(
      (r) =>
        !supabaseIds.has(r.id as string) &&
        !supabaseEmails.has((r.email as string)?.toLowerCase())
    );

    const all = [
      ...(data || []).map((r) => ({ ...r, stored_in: "supabase" })),
      ...uniqueLocal,
    ];

    return NextResponse.json(
      {
        ok: true,
        source: "supabase",
        registrations: all,
      },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("[admin/registrations] Fetch error:", err);
    return NextResponse.json(
      {
        ok: true,
        source: "local_fallback",
        registrations: localList,
      },
      { headers: corsHeaders }
    );
  }
}

export async function PATCH(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized access. Invalid admin key." },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body = (await request.json()) as { id?: string; status?: string };
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: id and status." },
        { status: 400, headers: corsHeaders }
      );
    }

    const validStatuses = ["new", "contacted", "confirmed", "enrolled", "declined"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { ok: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getServiceClient();
    if (supabase) {
      const { error } = await supabase
        .from("registrations")
        .update({ status })
        .eq("id", id);

      if (!error) {
        return NextResponse.json({ ok: true, source: "supabase" }, { headers: corsHeaders });
      }
    }

    const localUpdated = updateLocalRegistrationStatus(id, status);
    if (localUpdated) {
      return NextResponse.json({ ok: true, source: "local_fallback" }, { headers: corsHeaders });
    }

    return NextResponse.json(
      { ok: false, error: "Registration record not found or could not be updated." },
      { status: 404, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Malformed payload or internal error." },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized access. Invalid admin key." },
      { status: 401, headers: corsHeaders }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing 'id' query parameter." },
      { status: 400, headers: corsHeaders }
    );
  }

  let deleted = false;
  const supabase = getServiceClient();

  if (supabase) {
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (!error) deleted = true;
  }

  const localDeleted = deleteLocalRegistration(id);
  if (localDeleted) deleted = true;

  if (deleted) {
    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  }

  return NextResponse.json(
    { ok: false, error: "Record not found or failed to delete." },
    { status: 404, headers: corsHeaders }
  );
}
