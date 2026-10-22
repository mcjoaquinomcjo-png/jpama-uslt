"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Server,
  Layers,
  Terminal,
  Activity,
  ShieldAlert,
  Send,
  Zap,
} from "lucide-react";

interface DbStatusResponse {
  configured: boolean;
  reachable: boolean;
  hasServiceRoleKey: boolean;
  url: string;
  tables: Record<string, { status: string; count?: number; error?: string }>;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  storage: "Supabase" | "LocalStore" | "Both";
  status: "SUCCESS" | "WARNING" | "FAILED";
  details?: string;
}

export default function DatabaseManager() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<DbStatusResponse | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const fetchDbStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      if (data.success) {
        setStatus(data.supabase);
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  const handlePing = async () => {
    try {
      const res = await fetch("/api/db-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "log_test" }),
      });
      if (res.ok) {
        setPingSuccess(true);
        setTimeout(() => setPingSuccess(false), 3000);
        fetchDbStatus();
      }
    } catch (e) {}
  };

  const sqlFixScript = `-- ========================================================
-- JPAMA USLT: Enable Full CRUD & RLS Permissions in Supabase
-- Paste and Run in Supabase Dashboard > SQL Editor
-- ========================================================

-- Option 1: Disable RLS for smooth unrestricted chapter management
ALTER TABLE IF EXISTS public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rsvps DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.officers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_inquiries DISABLE ROW LEVEL SECURITY;

-- Option 2: Or create explicit permissive policies for ALL operations
CREATE POLICY IF NOT EXISTS "Allow all on members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all on events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all on rsvps" ON public.rsvps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all on resources" ON public.resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all on officers" ON public.officers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlFixScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                Database & Supabase Subsystem Diagnostics
              </h2>
              <p className="text-xs text-slate-500">
                Monitor database connectivity, synchronize tables, inspect transaction logs, and configure RLS.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePing}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>{pingSuccess ? "Ping Logged!" : "Ping Database"}</span>
          </button>
          <button
            onClick={fetchDbStatus}
            disabled={loading}
            className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Health</span>
          </button>
        </div>
      </div>

      {/* Connection & Table Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection Status Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Connection Status
            </span>
            {status?.configured ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Standby
              </span>
            )}
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-[#0A2540] truncate" title={status?.url || "Local Store"}>
              {status?.url || "Local Memory Store"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {status?.hasServiceRoleKey
                ? "Service Role Key active (Full RLS bypass on server)"
                : "Publishable/Anon Key active (RLS policies apply)"}
            </p>
          </div>
        </div>

        {/* Members Table Count */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Members Table
            </span>
            <Layers className="w-4 h-4 text-[#0A2540]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-[#0A2540]">
              {status?.tables?.members?.count ?? 0}
            </span>
            <span className="text-xs text-slate-500">records in database</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            Active sync enabled with pending filter queue
          </p>
        </div>

        {/* Assemblies & Events Table */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assemblies & Calendar
            </span>
            <Server className="w-4 h-4 text-[#0A2540]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-[#0A2540]">
              {status?.tables?.events?.count ?? 0}
            </span>
            <span className="text-xs text-slate-500">events registered</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Resources: {status?.tables?.resources?.count ?? 0} items
          </p>
        </div>
      </div>

      {/* Supabase RLS Fix Helper Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#0A2540]">
                Important Supabase Note: Enabling Delete & Update Persistence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                If deleting a student or updating records reverts upon page refresh, Supabase Row Level Security (RLS) is blocking deletions for anon keys. Copy and run this one-time SQL script in your Supabase SQL Editor to grant full CRUD permissions:
              </p>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? "Copied SQL!" : "Copy SQL Fix"}</span>
          </button>
        </div>

        <pre className="p-3 bg-slate-900 text-amber-200 text-[11px] font-mono rounded-lg overflow-x-auto max-h-36">
          {sqlFixScript}
        </pre>
      </div>

      {/* Activity Log Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0A2540]" />
            <h3 className="font-serif font-bold text-sm text-[#0A2540]">
              Real-time Database Transaction & Activity Log
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {logs.length} Recorded
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Live operational auditing</span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target / Entity</th>
                <th className="py-2.5 px-4">Engine</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No database transactions logged yet in this session.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="py-2 px-4 font-bold text-[#0A2540] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2 px-4 text-slate-700 whitespace-nowrap font-sans">
                      {log.target}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {log.storage}
                      </span>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {log.status === "SUCCESS" && (
                        <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          SUCCESS
                        </span>
                      )}
                      {log.status === "WARNING" && (
                        <span className="text-amber-700 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          WARNING
                        </span>
                      )}
                      {log.status === "FAILED" && (
                        <span className="text-red-700 font-bold text-[10px] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-slate-500 font-sans text-[11px] truncate max-w-xs" title={log.details}>
                      {log.details || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
