import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

export async function GET() {
  try {
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
