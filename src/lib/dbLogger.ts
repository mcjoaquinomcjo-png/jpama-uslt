// Database interaction logger for JPAMA website
// Records smooth operations, debugging details, and real-time activity for Supabase & local store.

export interface DbActivityLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  storage: "Supabase" | "LocalStore" | "Both";
  status: "SUCCESS" | "WARNING" | "FAILED";
  details?: string;
}

const globalForLogs = global as unknown as { __jpama_db_logs?: DbActivityLog[] };
if (!globalForLogs.__jpama_db_logs) {
  globalForLogs.__jpama_db_logs = [
    {
      id: "log-init",
      timestamp: new Date().toISOString(),
      action: "SYSTEM_STARTUP",
      target: "Database Subsystem",
      storage: "Both",
      status: "SUCCESS",
      details: "Database logging subsystem initialized and ready.",
    },
  ];
}

const logs: DbActivityLog[] = globalForLogs.__jpama_db_logs;

export function recordDbLog(entry: Omit<DbActivityLog, "id" | "timestamp">) {
  const newLog: DbActivityLog = {
    id: "log-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  logs.unshift(newLog);

  // Keep latest 100 entries
  if (logs.length > 100) {
    logs.pop();
  }

  // Also print nicely to console for server terminal monitoring
  const prefix = `[DB ${newLog.status}][${newLog.storage}]`;
  console.log(`${prefix} ${newLog.action} -> ${newLog.target} (${newLog.details || "OK"})`);

  return newLog;
}

export function getDbLogs(): DbActivityLog[] {
  return logs;
}

export function clearDbLogs(): void {
  logs.length = 0;
  recordDbLog({
    action: "LOGS_CLEARED",
    target: "Activity Log",
    storage: "Both",
    status: "SUCCESS",
    details: "Database activity logs reset by administrator.",
  });
}
