import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_OVERVIEW_CONTENT, OverviewContent } from "@/lib/siteContent";
import { recordDbLog } from "@/lib/dbLogger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), "src", "data");
const OVERVIEW_CONFIG_FILE = path.join(DATA_DIR, "overview_config.json");

export interface OverviewSavedPayload {
  sections: Array<{ id: string; label: string; visible: boolean }>;
  content: OverviewContent;
}

const DEFAULT_SECTIONS = [
  { id: "hero", label: "Hero Banner & Lookup", visible: true },
  { id: "pillars", label: "BSMA Academic Pillars", visible: true },
  { id: "events", label: "Upcoming Convocations", visible: true },
  { id: "resources", label: "Academic Resources Library", visible: true },
  { id: "leadership", label: "Council & Faculty Stewardship", visible: true },
  { id: "contact", label: "Office & Contact Desk", visible: true },
];

function readOverviewConfig(): OverviewSavedPayload {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(OVERVIEW_CONFIG_FILE)) {
      const raw = fs.readFileSync(OVERVIEW_CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          sections: Array.isArray(parsed.sections) ? parsed.sections : DEFAULT_SECTIONS,
          content: parsed.content ? { ...DEFAULT_OVERVIEW_CONTENT, ...parsed.content } : DEFAULT_OVERVIEW_CONTENT,
        };
      }
    }
    const initial: OverviewSavedPayload = {
      sections: DEFAULT_SECTIONS,
      content: DEFAULT_OVERVIEW_CONTENT,
    };
    fs.writeFileSync(OVERVIEW_CONFIG_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch (err) {
    console.error("Error reading overview_config.json:", err);
    return {
      sections: DEFAULT_SECTIONS,
      content: DEFAULT_OVERVIEW_CONTENT,
    };
  }
}

function writeOverviewConfig(data: OverviewSavedPayload): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(OVERVIEW_CONFIG_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing overview_config.json:", err);
    return false;
  }
}

import { getSupabaseConfig, saveSupabaseConfig } from "@/lib/supabaseStorage";

export async function GET() {
  // 1. Try Supabase real-time storage first
  const supabaseConfig = await getSupabaseConfig<OverviewSavedPayload>("SYS_OVERVIEW_CONFIG");
  if (supabaseConfig && Array.isArray(supabaseConfig.sections)) {
    return NextResponse.json(
      { success: true, data: supabaseConfig, source: "supabase" },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }

  // 2. Fall back to local file storage
  const config = readOverviewConfig();
  return NextResponse.json(
    { success: true, data: config, source: "local" },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const currentSupabase = await getSupabaseConfig<OverviewSavedPayload>("SYS_OVERVIEW_CONFIG");
    const current = currentSupabase || readOverviewConfig();

    const updated: OverviewSavedPayload = {
      sections: Array.isArray(body.sections) ? body.sections : current.sections,
      content: body.content ? { ...current.content, ...body.content } : current.content,
    };

    // 1. Persist to Supabase universal storage
    const supabaseSaved = await saveSupabaseConfig("SYS_OVERVIEW_CONFIG", updated);

    // 2. Also write to local file for dev backup
    writeOverviewConfig(updated);

    recordDbLog({
      action: "UPDATE_OVERVIEW_CONFIG",
      target: "Homepage Sections & Content",
      storage: supabaseSaved ? "Supabase" : "LocalStore",
      status: "SUCCESS",
      details: "Homepage section order, visibility, and copy updated live across all devices.",
    });

    return NextResponse.json({ success: true, data: updated, syncedToSupabase: supabaseSaved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
