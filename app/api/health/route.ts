import { NextResponse } from "next/server";
import { isSupabaseConfigured, pingSupabase } from "@/lib/supabase";
import { getLocalRegistrations } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  const supabasePing = await pingSupabase();
  const localRegistrations = getLocalRegistrations();

  const isHealthy = supabaseConfigured ? supabasePing.connected : true;

  return NextResponse.json(
    {
      ok: isHealthy,
      service: "Verikon Academy Backend",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      storage: {
        supabase: {
          configured: supabaseConfigured,
          connected: supabasePing.connected,
          latencyMs: supabasePing.latencyMs,
          error: supabasePing.error ?? null,
        },
        localFallback: {
          active: true,
          recordsCount: localRegistrations.length,
        },
      },
    },
    {
      status: isHealthy ? 200 : 503,
      headers: corsHeaders,
    }
  );
}
