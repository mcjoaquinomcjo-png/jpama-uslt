import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, student_number, notes } = body;

    if (!event_id || !student_number) {
      return NextResponse.json(
        { success: false, error: "Event ID and Student Number are required." },
        { status: 400 }
      );
    }

    const rsvp = dataStore.addRSVP(event_id, student_number.trim(), notes);

    return NextResponse.json({
      success: true,
      message: `RSVP Confirmed for ${rsvp.full_name}! An admission confirmation code has been generated.`,
      data: rsvp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Could not complete RSVP." },
      { status: 400 }
    );
  }
}
