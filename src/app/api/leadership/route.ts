import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { recordDbLog } from "@/lib/dbLogger";

export async function GET() {
  try {
    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client.from("officers").select("*").order("name");
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    }
  } catch (err) {
    console.warn("Supabase leadership fetch fallback:", err);
  }

  const officers = dataStore.getOfficers();
  return NextResponse.json({ success: true, data: officers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, category, committee, term, yearProgram, quote, avatar } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: "Name and role are required." }, { status: 400 });
    }

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from("officers")
        .insert([{
          name,
          role,
          category: category || "Executive Board",
          committee: committee || "Executive Council",
          term: term || "A.Y. 2026–2027",
          yearProgram,
          quote,
          avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        }])
        .select()
        .single();

      if (!error && data) {
        recordDbLog({
          action: "ADD_OFFICER",
          target: `${name} (${role})`,
          storage: "Supabase",
          status: "SUCCESS",
        });
        return NextResponse.json({ success: true, data }, { status: 201 });
      }
    }

    const newOfficer = dataStore.addOfficer({
      name,
      role,
      category: category || "Executive Board",
      committee: committee || "Executive Council",
      term: term || "A.Y. 2026–2027",
      yearProgram,
      quote,
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    });

    recordDbLog({
      action: "ADD_OFFICER",
      target: `${name} (${role})`,
      storage: "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: newOfficer }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Officer ID is required" }, { status: 400 });
    }

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client.from("officers").update(updates).eq("id", id).select().single();
      if (!error && data) {
        recordDbLog({
          action: "UPDATE_OFFICER",
          target: `Officer ID: ${id}`,
          storage: "Supabase",
          status: "SUCCESS",
        });
        return NextResponse.json({ success: true, data });
      }
    }

    const updated = dataStore.updateOfficer(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Officer ID required" }, { status: 400 });
    }

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { error } = await client.from("officers").delete().eq("id", id);
      if (!error) {
        recordDbLog({
          action: "DELETE_OFFICER",
          target: `Officer ID: ${id}`,
          storage: "Supabase",
          status: "SUCCESS",
        });
        dataStore.deleteOfficer(id);
        return NextResponse.json({ success: true, message: "Officer deleted from database" });
      }
    }

    const ok = dataStore.deleteOfficer(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
