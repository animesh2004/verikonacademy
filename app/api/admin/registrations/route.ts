import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getLocalRegistrations } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const localList = getLocalRegistrations();
  const supabase = getServiceClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      source: "local",
      registrations: localList,
    });
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[admin/registrations] Supabase query error, returning local:", error.message);
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
