import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase.from("settings").select("*").limit(1).single();
      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }
  } catch (err) {
    console.error("Supabase settings fetch error, using local fallback:", err);
  }

  const settings = dataStore.getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (supabase) {
      const { data, error } = await supabase.from("settings").upsert({ id: "global-settings", ...body }).select().single();
      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    const updated = dataStore.updateSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
