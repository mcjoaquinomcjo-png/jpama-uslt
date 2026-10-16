import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const members = dataStore.getMembers();
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_number, full_name, email, year_level, program = "BSMA", payment_ref, status = "Pending" } = body;

    if (!student_number || !full_name || !email || !year_level) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("members")
        .insert([
          {
            student_number: student_number.trim(),
            full_name: full_name.trim(),
            email: email.trim(),
            year_level,
            program: "BSMA",
            status,
            payment_ref: payment_ref ? payment_ref.trim() : null,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json(
            { success: false, error: "A registration with this student number or email already exists." },
            { status: 400 }
          );
        }
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: "Member saved successfully.",
        data,
      });
    }

    const newMember = dataStore.addMember({
      student_number: student_number.trim(),
      full_name: full_name.trim(),
      email: email.trim(),
      year_level,
      program: "BSMA",
      payment_ref: payment_ref ? payment_ref.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Member saved successfully.",
      data: newMember,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register member." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID is required." }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const updated = dataStore.updateMember(id, updates);
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
      return NextResponse.json({ success: false, error: "Member ID is required." }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Member record deleted successfully." });
    }

    dataStore.deleteMember(id);
    return NextResponse.json({ success: true, message: "Member record deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
