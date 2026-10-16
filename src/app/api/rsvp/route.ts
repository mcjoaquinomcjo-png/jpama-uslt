import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

    const cleanStudentNumber = student_number.trim();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("rsvps")
        .insert([
          {
            event_id,
            student_number: cleanStudentNumber,
            notes: notes ? notes.trim() : null,
            attendance_status: "Registered",
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json(
            { success: false, error: "You have already reserved a seat for this assembly." },
            { status: 400 }
          );
        }
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: "RSVP Confirmed! Your seat has been reserved.",
        data,
      });
    }

    const rsvp = dataStore.addRSVP(event_id, cleanStudentNumber, notes);

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
