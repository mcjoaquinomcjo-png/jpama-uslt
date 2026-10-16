import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

export async function GET() {
  try {
    const members = dataStore.getMembers();
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_number, full_name, email, year_level, program, payment_ref } = body;

    if (!student_number || !full_name || !email || !year_level || !program) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const newMember = dataStore.addMember({
      student_number: student_number.trim(),
      full_name: full_name.trim(),
      email: email.trim(),
      year_level,
      program,
      payment_ref: payment_ref ? payment_ref.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully! Your status is currently Pending verification.",
      data: newMember,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register member." },
      { status: 400 }
    );
  }
}
