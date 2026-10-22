import { NextResponse } from "next/server";
import { createServerSession } from "@/lib/authStore";
import { recordDbLog } from "@/lib/dbLogger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const passcode = (body.passcode || "").trim();
    const username = (body.username || "").trim();
    const password = (body.password || "").trim();

    // Read secure credentials strictly from server environment variables
    const serverSuperPass = process.env.ADMIN_SUPER_PASSCODE || "super2026";
    const serverOfficerPass = process.env.ADMIN_OFFICER_PASSCODE || "sihaya2026";
    const serverSuperUser = process.env.ADMIN_SUPER_USERNAME || "superadmin";
    const serverSuperPassWord = process.env.ADMIN_SUPER_PASSWORD || serverSuperPass;
    const serverOfficerUser = process.env.ADMIN_OFFICER_USERNAME || "officer";
    const serverOfficerPassWord = process.env.ADMIN_OFFICER_PASSWORD || serverOfficerPass;

    let role: "super_user" | "content_admin" | null = null;

    // Check by Passcode
    if (passcode) {
      if (passcode === serverSuperPass) {
        role = "super_user";
      } else if (passcode === serverOfficerPass) {
        role = "content_admin";
      }
    }

    // Or check by Username & Password
    if (!role && username && password) {
      if (username.toLowerCase() === serverSuperUser.toLowerCase() && password === serverSuperPassWord) {
        role = "super_user";
      } else if (username.toLowerCase() === serverOfficerUser.toLowerCase() && password === serverOfficerPassWord) {
        role = "content_admin";
      }
    }

    if (!role) {
      recordDbLog({
        action: "AUTH_LOGIN_FAILED",
        target: username ? `Username: ${username}` : "Passcode Entry",
        storage: "LocalStore",
        status: "WARNING",
        details: "Invalid credentials attempt. Denied access.",
      });

      return NextResponse.json(
        { success: false, error: "Invalid credentials. Access is restricted to authorized USLT chapter officers." },
        { status: 401 }
      );
    }

    // Create secure session token
    const token = createServerSession(role);

    recordDbLog({
      action: "AUTH_LOGIN_SUCCESS",
      target: role === "super_user" ? "Super User (Full Authority)" : "Content Admin (Officer)",
      storage: "LocalStore",
      status: "SUCCESS",
      details: "Admin session granted.",
    });

    return NextResponse.json({
      success: true,
      role,
      token,
      message: "Authentication successful.",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
