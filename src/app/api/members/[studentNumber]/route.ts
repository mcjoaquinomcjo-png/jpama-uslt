import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { studentNumber: string } }
) {
  try {
    const studentNumber = decodeURIComponent(params.studentNumber).trim();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .or(`student_number.eq.${studentNumber},email.eq.${studentNumber}`)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return NextResponse.json(
          {
            success: false,
            error: `No registration record found for: "${studentNumber}". Please verify your student number or apply online.`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    const member = dataStore.findMemberByStudentNumber(studentNumber);

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: `No registration record found for: "${studentNumber}". Please verify your student number or apply online.`,
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
