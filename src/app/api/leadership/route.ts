import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { recordDbLog } from "@/lib/dbLogger";
import { getSupabaseOfficers, saveSupabaseOfficers } from "@/lib/supabaseStorage";
import { OfficerItem } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getLiveOfficers(): Promise<OfficerItem[]> {
  try {
    const supaList = await getSupabaseOfficers();
    if (supaList !== null) {
      return supaList;
    }
  } catch (e) {
    console.warn("Error getting supabase officers:", e);
  }

  // Fallback to initial dataStore and persist into Supabase
  const initial = dataStore.getOfficers();
  await saveSupabaseOfficers(initial);
  return initial;
}

export async function GET() {
  const officers = await getLiveOfficers();
  return NextResponse.json(
    { success: true, data: officers },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, category, committee, term, yearProgram, quote, avatar } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: "Name and role are required." }, { status: 400 });
    }

    const current = await getLiveOfficers();
    const newOfficer: OfficerItem = {
      id: "off-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      role: role.trim(),
      category: category || "Executive Board",
      committee: committee ? committee.trim() : "Executive Council",
      term: term ? term.trim() : "A.Y. 2026–2027",
      yearProgram: yearProgram ? yearProgram.trim() : "4th Year • BSMA",
      quote: quote ? quote.trim() : "",
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };

    const updated = [newOfficer, ...current];
    await saveSupabaseOfficers(updated);

    recordDbLog({
      action: "ADD_OFFICER",
      target: `${name} (${role})`,
      storage: "Supabase",
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

    const current = await getLiveOfficers();
    let updatedItem: OfficerItem | null = null;
    const updated: OfficerItem[] = current.map((off) => {
      if (off.id === id) {
        const item: OfficerItem = { ...off, ...updates };
        updatedItem = item;
        return item;
      }
      return off;
    });

    if (updatedItem) {
      await saveSupabaseOfficers(updated);
      recordDbLog({
        action: "UPDATE_OFFICER",
        target: `Officer ID: ${id}`,
        storage: "Supabase",
        status: "SUCCESS",
      });
      return NextResponse.json({ success: true, data: updatedItem });
    }

    return NextResponse.json({ success: false, error: "Officer not found" }, { status: 404 });
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

    const current = await getLiveOfficers();
    const filtered = current.filter((off) => off.id !== id);

    await saveSupabaseOfficers(filtered);

    recordDbLog({
      action: "DELETE_OFFICER",
      target: `Officer ID: ${id}`,
      storage: "Supabase",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, message: "Officer permanently deleted from Supabase" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
