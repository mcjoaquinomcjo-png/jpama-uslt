import { NextResponse } from "next/server";
import { verifyServerSession, destroyServerSession } from "@/lib/authStore";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return NextResponse.json({ success: false, error: "No session token provided" }, { status: 401 });
  }

  const { valid, role } = verifyServerSession(token);
  if (!valid || !role) {
    return NextResponse.json({ success: false, error: "Session expired or invalid" }, { status: 401 });
  }

  return NextResponse.json({ success: true, role });
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (token) {
    destroyServerSession(token);
  }
  return NextResponse.json({ success: true, message: "Logged out." });
}
