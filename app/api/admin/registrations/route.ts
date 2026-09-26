import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getLocalRegistrations } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_SECRET = process.env.ADMIN_KEY ?? "verikon2026";

export async function GET(request: Request) {
  // Security check: Verify admin secret key
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (token !== ADMIN_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized access. Invalid admin key." },
      { status: 401 }
    );
  }

  const localList = getLocalRegistrations();
  const supabase = getServiceClient();

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[admin/registrations] Supabase query notice:", error.message);
      return NextResponse.json({
        ok: true,
        source: "local_fallback",
        supabaseError: error.message,
        registrations: localList,
      });
    }

    // Merge Supabase and any local fallback records
    const all = [
      ...(data || []).map((r) => ({ ...r, stored_in: "supabase" })),
      ...localList,
    ];

    return NextResponse.json({
      ok: true,
      source: "supabase",
      registrations: all,
    });
  } catch (err: unknown) {
    console.error("[admin/registrations] Fetch error:", err);
    return NextResponse.json({
      ok: true,
      source: "local_fallback",
      registrations: localList,
    });
  }
}
