import { NextResponse } from "next/server";
import { getSupabaseServer, isSupabaseConfigured, hasServiceRoleKey } from "@/lib/supabase";
import { getDbLogs, recordDbLog } from "@/lib/dbLogger";

export async function GET() {
  const client = getSupabaseServer();
  const tablesStatus: Record<string, { status: string; count?: number; error?: string }> = {};

  let supabaseReachable = false;

  if (isSupabaseConfigured && client) {
    const tablesToCheck = ["members", "events", "resources", "officers", "settings"];

    await Promise.all(
      tablesToCheck.map(async (table) => {
        try {
          const { count, error } = await client
            .from(table)
            .select("*", { count: "exact", head: true });

          if (error) {
            tablesStatus[table] = { status: "error", error: error.message };
          } else {
            supabaseReachable = true;
            tablesStatus[table] = { status: "active", count: count ?? 0 };
          }
        } catch (e: any) {
          tablesStatus[table] = { status: "error", error: e.message };
        }
      })
    );
  }

  const logs = getDbLogs();

  return NextResponse.json({
    success: true,
    supabase: {
      configured: isSupabaseConfigured,
      reachable: supabaseReachable,
      hasServiceRoleKey,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      tables: tablesStatus,
    },
    logs,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === "log_test") {
      recordDbLog({
        action: "PING_TEST",
        target: "Database Connection",
        storage: isSupabaseConfigured ? "Supabase" : "LocalStore",
        status: "SUCCESS",
        details: "Manual diagnostic ping executed by administrator.",
      });
      return NextResponse.json({ success: true, message: "Ping logged successfully." });
    }
    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
