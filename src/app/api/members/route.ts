import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { getSupabaseServer, isSupabaseConfigured, hasServiceRoleKey } from "@/lib/supabase";
import { recordDbLog } from "@/lib/dbLogger";

export async function GET() {
  try {
    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        recordDbLog({
          action: "FETCH_MEMBERS",
          target: "members table",
          storage: "Supabase",
          status: "WARNING",
          details: `Supabase query error: ${error.message}. Falling back to local store.`,
        });
        throw error;
      }

      recordDbLog({
        action: "FETCH_MEMBERS",
        target: `Loaded ${data.length} student records`,
        storage: "Supabase",
        status: "SUCCESS",
      });

      return NextResponse.json({ success: true, data, source: "supabase" });
    }

    const members = dataStore.getMembers();
    recordDbLog({
      action: "FETCH_MEMBERS",
      target: `Loaded ${members.length} records (local)`,
      storage: "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: members, source: "local" });
  } catch (error: any) {
    const fallback = dataStore.getMembers();
    return NextResponse.json({
      success: true,
      data: fallback,
      source: "fallback",
      warning: error.message,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      student_number,
      full_name,
      email,
      year_level,
      program = "BSMA",
      birthdate,
      residence,
      payment_ref,
      status = "Pending",
    } = body;

    if (!student_number || !full_name || !email || !year_level) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const cleanStudentNumber = student_number.trim();
    const cleanFullName = full_name.trim();
    const cleanEmail = email.trim();

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const payload: Record<string, any> = {
        student_number: cleanStudentNumber,
        full_name: cleanFullName,
        email: cleanEmail,
        year_level,
        program: "BSMA",
        status,
        birthdate: birthdate ? birthdate.trim() : null,
        residence: residence ? residence.trim() : null,
        payment_ref: payment_ref ? payment_ref.trim() : null,
      };

      const { data, error } = await client
        .from("members")
        .insert([payload])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          recordDbLog({
            action: "REGISTER_MEMBER",
            target: `${cleanFullName} (${cleanStudentNumber})`,
            storage: "Supabase",
            status: "WARNING",
            details: "Duplicate student number or email registration rejected.",
          });
          return NextResponse.json(
            { success: false, error: "A registration with this student number or email already exists." },
            { status: 400 }
          );
        }
        recordDbLog({
          action: "REGISTER_MEMBER",
          target: `${cleanFullName} (${cleanStudentNumber})`,
          storage: "Supabase",
          status: "FAILED",
          details: error.message,
        });
        throw error;
      }

      // Also sync to dataStore
      try {
        dataStore.addMember({
          student_number: cleanStudentNumber,
          full_name: cleanFullName,
          email: cleanEmail,
          year_level,
          program: "BSMA",
          birthdate: birthdate ? birthdate.trim() : undefined,
          residence: residence ? residence.trim() : undefined,
          payment_ref: payment_ref ? payment_ref.trim() : undefined,
        });
      } catch (e) {
        // ignore if already in store
      }

      recordDbLog({
        action: "REGISTER_MEMBER",
        target: `${cleanFullName} (${cleanStudentNumber})`,
        storage: "Supabase",
        status: "SUCCESS",
        details: `Saved new ${status} registration in Supabase database.`,
      });

      return NextResponse.json({
        success: true,
        message: "Member saved successfully.",
        data,
      });
    }

    // Local fallback
    const newMember = dataStore.addMember({
      student_number: cleanStudentNumber,
      full_name: cleanFullName,
      email: cleanEmail,
      year_level,
      program: "BSMA",
      birthdate: birthdate ? birthdate.trim() : undefined,
      residence: residence ? residence.trim() : undefined,
      payment_ref: payment_ref ? payment_ref.trim() : undefined,
    });

    recordDbLog({
      action: "REGISTER_MEMBER",
      target: `${cleanFullName} (${cleanStudentNumber})`,
      storage: "LocalStore",
      status: "SUCCESS",
      details: "Registered in local store memory.",
    });

    return NextResponse.json({
      success: true,
      message: "Member saved successfully.",
      data: newMember,
    });
  } catch (error: any) {
    recordDbLog({
      action: "REGISTER_MEMBER",
      target: "New Registration",
      storage: "Both",
      status: "FAILED",
      details: error.message || "Unknown error",
    });

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

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let data: any = null;
      let error: any = null;

      if (isUUID) {
        const res = await client.from("members").update(updates).eq("id", id).select();
        data = res.data;
        error = res.error;
      } else {
        const res = await client.from("members").update(updates).eq("student_number", id).select();
        data = res.data;
        error = res.error;
      }

      if (error) {
        recordDbLog({
          action: "UPDATE_MEMBER",
          target: `Member ID: ${id}`,
          storage: "Supabase",
          status: "FAILED",
          details: error.message,
        });
        throw error;
      }

      // Check if 0 rows were updated (RLS blockage without error)
      if (!data || data.length === 0) {
        recordDbLog({
          action: "UPDATE_MEMBER",
          target: `Member ID: ${id}`,
          storage: "Supabase",
          status: "WARNING",
          details: "Supabase updated 0 rows. Check RLS UPDATE policy or service role key.",
        });
      } else {
        recordDbLog({
          action: "UPDATE_MEMBER",
          target: `${data[0].full_name} (${data[0].student_number})`,
          storage: "Supabase",
          status: "SUCCESS",
          details: `Updated fields: ${Object.keys(updates).join(", ")}`,
        });
      }

      // Sync localStore as well
      try {
        dataStore.updateMember(id, updates);
      } catch (e) {}

      return NextResponse.json({
        success: true,
        data: data && data.length > 0 ? data[0] : { id, ...updates },
        warning: (!data || data.length === 0)
          ? "No rows updated in Supabase. Check RLS update policy."
          : undefined,
      });
    }

    const updated = dataStore.updateMember(id, updates);
    recordDbLog({
      action: "UPDATE_MEMBER",
      target: `Member ID: ${id}`,
      storage: "LocalStore",
      status: "SUCCESS",
      details: `Updated: ${Object.keys(updates).join(", ")}`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    recordDbLog({
      action: "UPDATE_MEMBER",
      target: "Update Request",
      storage: "Both",
      status: "FAILED",
      details: error.message,
    });
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

    const client = getSupabaseServer();
    if (isSupabaseConfigured && client) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let data: any = null;
      let error: any = null;

      if (isUUID) {
        const res = await client.from("members").delete().eq("id", id).select();
        data = res.data;
        error = res.error;
      } else {
        const res = await client.from("members").delete().eq("student_number", id).select();
        data = res.data;
        error = res.error;
      }

      if (error) {
        recordDbLog({
          action: "DELETE_MEMBER",
          target: `Member ID: ${id}`,
          storage: "Supabase",
          status: "FAILED",
          details: error.message,
        });
        throw error;
      }

      const affected = data ? data.length : 0;
      if (affected === 0) {
        recordDbLog({
          action: "DELETE_MEMBER",
          target: `Member ID: ${id}`,
          storage: "Supabase",
          status: "WARNING",
          details: hasServiceRoleKey
            ? `No record found with ID/StudentNumber "${id}".`
            : "Supabase returned 0 rows deleted. Supabase RLS is active and blocking DELETE queries without a DELETE policy or Service Role Key.",
        });
      } else {
        const deletedName = data && data[0] ? `${data[0].full_name} (${data[0].student_number})` : id;
        recordDbLog({
          action: "DELETE_MEMBER",
          target: deletedName,
          storage: "Supabase",
          status: "SUCCESS",
          details: `Permanently removed from Supabase database (${affected} row).`,
        });
      }

      // Always remove from local store too
      dataStore.deleteMember(id);

      return NextResponse.json({
        success: true,
        message: affected > 0 ? "Member record deleted successfully from database." : "Record removed from session.",
        affected,
        warning: affected === 0 && !hasServiceRoleKey
          ? "Supabase RLS prevented row deletion. Please apply the RLS policy update in Supabase SQL editor or provide SUPABASE_SERVICE_ROLE_KEY."
          : undefined,
      });
    }

    const ok = dataStore.deleteMember(id);
    recordDbLog({
      action: "DELETE_MEMBER",
      target: `Member ID: ${id}`,
      storage: "LocalStore",
      status: ok ? "SUCCESS" : "WARNING",
      details: ok ? "Removed from local store." : "Record was not found in local store.",
    });

    return NextResponse.json({ success: true, message: "Member record deleted successfully." });
  } catch (error: any) {
    recordDbLog({
      action: "DELETE_MEMBER",
      target: `ID: ${request.url}`,
      storage: "Both",
      status: "FAILED",
      details: error.message,
    });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
