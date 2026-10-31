import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_JPAMA_CONFIG, JpamaSectionConfig } from "@/config/jpamaSettings";
import { recordDbLog } from "@/lib/dbLogger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), "src", "data");
const ABOUT_CONFIG_FILE = path.join(DATA_DIR, "about_config.json");

function readConfig(): JpamaSectionConfig {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(ABOUT_CONFIG_FILE)) {
      const raw = fs.readFileSync(ABOUT_CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as JpamaSectionConfig;
      }
    }

    // Default configuration if file does not exist yet
    fs.writeFileSync(ABOUT_CONFIG_FILE, JSON.stringify(DEFAULT_JPAMA_CONFIG, null, 2), "utf-8");
    return DEFAULT_JPAMA_CONFIG;
  } catch (err) {
    console.error("Error reading about_config.json:", err);
    return DEFAULT_JPAMA_CONFIG;
  }
}

function writeConfig(config: JpamaSectionConfig): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ABOUT_CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing about_config.json:", err);
    return false;
  }
}

import { getSupabaseConfig, saveSupabaseConfig } from "@/lib/supabaseStorage";

export async function GET() {
  // 1. Try Supabase real-time storage first
  const supabaseConfig = await getSupabaseConfig<JpamaSectionConfig>("SYS_ABOUT_CONFIG");
  if (supabaseConfig && typeof supabaseConfig === "object" && supabaseConfig.chapterOverview) {
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
  const config = readConfig();
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
      return NextResponse.json({ success: false, error: "Invalid configuration payload" }, { status: 400 });
    }

    // 1. Persist to Supabase
    const supabaseSaved = await saveSupabaseConfig("SYS_ABOUT_CONFIG", body);

    // 2. Also write to local file for dev backup
    writeConfig(body);

    recordDbLog({
      action: "UPDATE_ABOUT_CONFIG",
      target: "JPAMA About & Bylaws CMS Config",
      storage: supabaseSaved ? "Supabase" : "LocalStore",
      status: "SUCCESS",
      details: "Configuration successfully updated across all roles and sessions via Supabase.",
    });

    return NextResponse.json({ success: true, data: body, syncedToSupabase: supabaseSaved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
