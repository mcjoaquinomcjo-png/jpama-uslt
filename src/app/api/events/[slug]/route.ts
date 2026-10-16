import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const event = dataStore.getEventBySlug(slug);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const rsvps = dataStore.getRSVPsForEvent(event.id);

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        rsvp_count: rsvps.length,
        available_slots: Math.max(0, event.max_capacity - rsvps.length),
        attendees: rsvps.map((r) => ({
          id: r.id,
          full_name: r.full_name,
          registered_at: r.registered_at,
          attendance_status: r.attendance_status,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
