import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AlumniMember } from "@/lib/types";
import { recordDbLog } from "@/lib/dbLogger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), "src", "data");
const ALUMNI_FILE = path.join(DATA_DIR, "alumni.json");

function readAlumni(): AlumniMember[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(ALUMNI_FILE)) {
      const raw = fs.readFileSync(ALUMNI_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading alumni.json:", err);
    return [];
  }
}

function writeAlumni(list: AlumniMember[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ALUMNI_FILE, JSON.stringify(list, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing alumni.json:", err);
    return false;
  }
}

import { getSupabaseAlumni, saveSupabaseAlumni } from "@/lib/supabaseStorage";

async function getLiveAlumni(): Promise<AlumniMember[]> {
  // 1. Check Supabase first
  const supabaseList = await getSupabaseAlumni();
  if (supabaseList && Array.isArray(supabaseList)) {
    return supabaseList;
  }

  // 2. Fall back to local file
  const localList = readAlumni();
  // Sync to Supabase so it's initialized
  if (localList.length > 0) {
    saveSupabaseAlumni(localList).catch(() => {});
  }
  return localList;
}

export async function GET() {
  const alumni = await getLiveAlumni();
  return NextResponse.json(
    { success: true, data: alumni },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, year_graduated, batch_label, current_company, current_role, work_description, leadership_experiences, badges, photo_url, linkedin_url } = body;

    if (!full_name || !year_graduated) {
      return NextResponse.json({ success: false, error: "Full Name and Year Graduated are required." }, { status: 400 });
    }

    const alumni = await getLiveAlumni();
    const newMember: AlumniMember = {
      id: "alum-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      full_name: full_name.trim(),
      year_graduated: year_graduated.trim(),
      batch_label: batch_label ? batch_label.trim() : `Batch ${year_graduated.trim()}`,
      current_company: current_company?.trim() || "",
      current_role: current_role?.trim() || "",
      work_description: work_description?.trim() || "",
      leadership_experiences: leadership_experiences?.trim() || "",
      badges: Array.isArray(badges) ? badges : [],
      photo_url: photo_url?.trim() || "",
      linkedin_url: linkedin_url?.trim() || "",
    };

    alumni.unshift(newMember);
    const supabaseSaved = await saveSupabaseAlumni(alumni);
    writeAlumni(alumni);

    recordDbLog({
      action: "ADD_ALUMNI",
      target: newMember.full_name,
      storage: supabaseSaved ? "Supabase" : "LocalStore",
      status: "SUCCESS",
      details: `Added alumni member ${newMember.full_name} (${newMember.year_graduated})`,
    });

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing alumni ID" }, { status: 400 });
    }

    const alumni = await getLiveAlumni();
    const index = alumni.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Alumni record not found" }, { status: 404 });
    }

    alumni[index] = { ...alumni[index], ...updates };
    const supabaseSaved = await saveSupabaseAlumni(alumni);
    writeAlumni(alumni);

    recordDbLog({
      action: "UPDATE_ALUMNI",
      target: alumni[index].full_name,
      storage: supabaseSaved ? "Supabase" : "LocalStore",
      status: "SUCCESS",
      details: `Updated alumni profile ${alumni[index].full_name}`,
    });

    return NextResponse.json({ success: true, data: alumni[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing alumni ID" }, { status: 400 });
    }

    const alumni = await getLiveAlumni();
    const index = alumni.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Alumni not found" }, { status: 404 });
    }

    const deleted = alumni.splice(index, 1)[0];
    const supabaseSaved = await saveSupabaseAlumni(alumni);
    writeAlumni(alumni);

    recordDbLog({
      action: "DELETE_ALUMNI",
      target: deleted.full_name,
      storage: supabaseSaved ? "Supabase" : "LocalStore",
      status: "SUCCESS",
      details: `Permanently deleted alumni record ${deleted.full_name}`,
    });

    return NextResponse.json({ success: true, message: "Alumni member deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
