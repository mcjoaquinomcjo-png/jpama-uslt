import { NextResponse } from "next/server";
import { DEFAULT_CONTACT_CONTENT, ContactContent } from "@/lib/siteContent";
import { getSupabaseConfig, saveSupabaseConfig } from "@/lib/supabaseStorage";
import { recordDbLog } from "@/lib/dbLogger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supaContact = await getSupabaseConfig<ContactContent>("SYS_CONTACT_CONTENT");
    if (supaContact) {
      return NextResponse.json(
        { success: true, data: { ...DEFAULT_CONTACT_CONTENT, ...supaContact } },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }
  } catch (err) {
    console.warn("Supabase contact content fetch fallback:", err);
  }

  return NextResponse.json(
    { success: true, data: DEFAULT_CONTACT_CONTENT },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const ok = await saveSupabaseConfig("SYS_CONTACT_CONTENT", body);

    recordDbLog({
      action: "UPDATE_CONTACT_CONTENT",
      target: "Contact & Desk Details",
      storage: ok ? "Supabase" : "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
