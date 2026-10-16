import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: { studentNumber: string } }
) {
  try {
    const studentNumber = decodeURIComponent(params.studentNumber);
    const member = dataStore.findMemberByStudentNumber(studentNumber);

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: `No registration record found for student number/email: "${studentNumber}". Please check the spelling or submit a membership form.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error querying member record." },
      { status: 500 }
    );
  }
}
