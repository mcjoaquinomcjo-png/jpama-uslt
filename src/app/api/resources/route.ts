import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { recordDbLog } from "@/lib/dbLogger";

export async function GET() {
  try {
    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from("resources")
        .select("*")
        .not("category", "like", "__SYS_%")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const resources = dataStore.getResources();
    return NextResponse.json({ success: true, data: resources });
  } catch (error: any) {
    const fallback = dataStore.getResources();
    return NextResponse.json({ success: true, data: fallback });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      subject,
      category = "Academic Reviewer",
      year_level = "All Years",
      format = "PDF",
      description,
      download_url = "https://drive.google.com",
    } = body;

    if (!title || !subject) {
      return NextResponse.json({ success: false, error: "Title and Subject are required." }, { status: 400 });
    }

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from("resources")
        .insert([
          {
            title: title.trim(),
            subject: subject.trim(),
            category,
            year_level,
            format,
            size: "2.4 MB",
            download_url: download_url ? download_url.trim() : "https://drive.google.com",
            downloads_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      recordDbLog({
        action: "ADD_RESOURCE",
        target: title.trim(),
        storage: "Supabase",
        status: "SUCCESS",
      });

      return NextResponse.json({ success: true, data });
    }

    const newRes = dataStore.addResource({
      title: title.trim(),
      subject: subject.trim(),
      category,
      year_level,
      format,
      size: "2.4 MB",
      author: "Academic Committee",
      download_url: download_url ? download_url.trim() : "https://drive.google.com",
      description: description || "Departmental reviewer for BS Management Accounting.",
    });

    recordDbLog({
      action: "ADD_RESOURCE",
      target: title.trim(),
      storage: "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: newRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Resource ID is required." }, { status: 400 });
    }

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from("resources")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;

      recordDbLog({
        action: "UPDATE_RESOURCE",
        target: `Resource ID: ${id}`,
        storage: "Supabase",
        status: "SUCCESS",
      });

      try {
        dataStore.updateResource(id, updates);
      } catch (e) {}

      return NextResponse.json({ success: true, data: data && data[0] ? data[0] : updates });
    }

    const updated = dataStore.updateResource(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Resource ID is required." }, { status: 400 });
    }

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { error } = await client.from("resources").delete().eq("id", id);
      if (error) throw error;

      recordDbLog({
        action: "DELETE_RESOURCE",
        target: `Resource ID: ${id}`,
        storage: "Supabase",
        status: "SUCCESS",
      });

      dataStore.deleteResource(id);
      return NextResponse.json({ success: true, message: "Resource deleted successfully." });
    }

    dataStore.deleteResource(id);
    return NextResponse.json({ success: true, message: "Resource deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
