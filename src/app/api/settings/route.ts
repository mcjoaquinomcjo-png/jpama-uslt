import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { recordDbLog } from "@/lib/dbLogger";

export async function GET() {
  try {
    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client.from("settings").select("*").limit(1).single();
      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }
  } catch (err) {
    console.warn("Supabase settings fetch error, using local fallback:", err);
  }

  const settings = dataStore.getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = getSupabaseServer();

    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from("settings")
        .upsert({ id: "global-settings", ...body })
        .select()
        .single();
      if (!error && data) {
        recordDbLog({
          action: "UPDATE_SETTINGS",
          target: "Portal Configuration",
          storage: "Supabase",
          status: "SUCCESS",
        });
        return NextResponse.json({ success: true, data });
      }
    }

    const updated = dataStore.updateSettings(body);
    recordDbLog({
      action: "UPDATE_SETTINGS",
      target: "Portal Configuration",
      storage: "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
