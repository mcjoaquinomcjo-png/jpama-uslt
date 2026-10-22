import crypto from "crypto";

export interface SessionInfo {
  token: string;
  role: "super_user" | "content_admin";
  created_at: number;
  expires_at: number;
}

const globalForAuth = global as unknown as { __jpama_auth_sessions?: Map<string, SessionInfo> };
if (!globalForAuth.__jpama_auth_sessions) {
  globalForAuth.__jpama_auth_sessions = new Map();
}

const sessions = globalForAuth.__jpama_auth_sessions;

// Session lasts 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function createServerSession(role: "super_user" | "content_admin"): string {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  sessions.set(token, {
    token,
    role,
    created_at: now,
    expires_at: now + SESSION_TTL_MS,
  });
  return token;
}

export function verifyServerSession(token: string): { valid: boolean; role?: "super_user" | "content_admin" } {
  if (!token) return { valid: false };
  const session = sessions.get(token);
  if (!session) return { valid: false };

  if (Date.now() > session.expires_at) {
    sessions.delete(token);
    return { valid: false };
  }

  return { valid: true, role: session.role };
}

export function destroyServerSession(token: string): void {
  if (token) {
    sessions.delete(token);
  }
}
