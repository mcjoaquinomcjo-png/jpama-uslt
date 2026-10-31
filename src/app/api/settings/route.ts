import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { recordDbLog } from "@/lib/dbLogger";
import { getSupabaseConfig, saveSupabaseConfig } from "@/lib/supabaseStorage";
import { PortalSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supaSettings = await getSupabaseConfig<PortalSettings>("SYS_PORTAL_SETTINGS");
    if (supaSettings) {
      return NextResponse.json(
        { success: true, data: supaSettings },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }
  } catch (err) {
    console.warn("Supabase settings fetch fallback:", err);
  }

  const settings = dataStore.getSettings();
  return NextResponse.json(
    { success: true, data: settings },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const ok = await saveSupabaseConfig("SYS_PORTAL_SETTINGS", body);
    dataStore.updateSettings(body);

    recordDbLog({
      action: "UPDATE_SETTINGS",
      target: "Portal Configuration",
      storage: ok ? "Supabase" : "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
