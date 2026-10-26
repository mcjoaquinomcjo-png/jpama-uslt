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

export async function GET() {
  const config = readOverviewConfig();
  return NextResponse.json(
    { success: true, data: config },
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

    const current = readOverviewConfig();
    const updated: OverviewSavedPayload = {
      sections: Array.isArray(body.sections) ? body.sections : current.sections,
      content: body.content ? { ...current.content, ...body.content } : current.content,
    };

    const saved = writeOverviewConfig(updated);
    if (!saved) {
      return NextResponse.json({ success: false, error: "Failed to persist overview config" }, { status: 500 });
    }

    recordDbLog({
      action: "UPDATE_OVERVIEW_CONFIG",
      target: "Homepage Sections & Content",
      storage: "LocalStore",
      status: "SUCCESS",
      details: "Homepage section order, visibility, and copy updated live.",
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
