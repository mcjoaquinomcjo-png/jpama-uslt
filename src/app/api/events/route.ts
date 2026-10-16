import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const events = dataStore.getEvents();
    const enriched = events.map((ev) => {
      const rsvps = dataStore.getRSVPsForEvent(ev.id);
      return {
        ...ev,
        rsvp_count: rsvps.length,
        available_slots: Math.max(0, ev.max_capacity - rsvps.length),
      };
    });
    return NextResponse.json({ success: true, data: enriched });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category = "Leadership",
      description,
      event_date,
      event_time,
      location,
      max_capacity = 200,
      speaker,
      speaker_role,
      agenda,
    } = body;

    if (!title || !event_date || !location) {
      return NextResponse.json({ success: false, error: "Title, date, and location are required." }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            slug,
            title: title.trim(),
            category,
            description: description ? description.trim() : "JPAMA USLT Chapter Assembly",
            event_date,
            event_time: event_time ? event_time.trim() : null,
            location: location.trim(),
            max_capacity: Number(max_capacity) || 200,
            speaker: speaker ? speaker.trim() : null,
            speaker_role: speaker_role ? speaker_role.trim() : null,
            agenda: agenda || [],
            is_published: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const newEv = dataStore.addEvent({
      slug,
      title: title.trim(),
      category,
      description: description ? description.trim() : "JPAMA USLT Chapter Assembly",
      event_date,
      event_time: event_time ? event_time.trim() : undefined,
      location: location.trim(),
      max_capacity: Number(max_capacity) || 200,
      speaker: speaker ? speaker.trim() : undefined,
      speaker_role: speaker_role ? speaker_role.trim() : undefined,
      agenda: agenda || [],
      is_published: true,
    });

    return NextResponse.json({ success: true, data: newEv });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID is required." }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const updated = dataStore.updateEvent(id, updates);
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
      return NextResponse.json({ success: false, error: "Event ID is required." }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Event deleted successfully." });
    }

    dataStore.deleteEvent(id);
    return NextResponse.json({ success: true, message: "Event deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
