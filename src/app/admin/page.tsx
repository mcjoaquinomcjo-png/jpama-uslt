"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Calendar,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Lock,
  Unlock,
  AlertCircle,
  Crown,
  KeyRound,
  Database,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Member, EventItem, ResourceItem, YearLevel, MemberStatus } from "@/lib/types";

type UserRole = "super_user" | "content_admin" | null;

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"members" | "events" | "resources" | "system">("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchMember, setSearchMember] = useState("");
  const [filterYear, setFilterYear] = useState("All");

  // Member Modal State (Add / Edit)
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memStudentNum, setMemStudentNum] = useState("");
  const [memFullName, setMemFullName] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [memYear, setMemYear] = useState<YearLevel>("1st Year");
  const [memStatus, setMemStatus] = useState<MemberStatus>("Active");
  const [memPaymentRef, setMemPaymentRef] = useState("");

  // Event Modal State (Add / Edit)
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [evTitle, setEvTitle] = useState("");
  const [evCategory, setEvCategory] = useState<EventItem["category"]>("Academic");
  const [evDate, setEvDate] = useState("");
  const [evLocation, setEvLocation] = useState("USLT Bulwagang San Jacinto");
  const [evDesc, setEvDesc] = useState("");
  const [evCapacity, setEvCapacity] = useState(200);

  // Resource Modal State (Add / Edit)
  const [showResModal, setShowResModal] = useState(false);
  const [editingRes, setEditingRes] = useState<ResourceItem | null>(null);
  const [resTitle, setResTitle] = useState("");
  const [resSubject, setResSubject] = useState("Cost Accounting & Control");
  const [resCategory, setResCategory] = useState<ResourceItem["category"]>("Academic Reviewer");
  const [resYear, setResYear] = useState("All Years");
  const [resFormat, setResFormat] = useState<ResourceItem["format"]>("PDF");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();

    if (cleanPass === "super2026" || cleanPass === "superadmin") {
      setUserRole("super_user");
      setAuthError("");
      loadAllData();
    } else if (cleanPass === "sihaya2026" || cleanPass === "admin") {
      setUserRole("content_admin");
      setAuthError("");
      loadAllData();
    } else {
      setAuthError("Invalid Passcode. Enter 'super2026' for Super User or 'sihaya2026' for Content Admin.");
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resMem, resEv, resRes] = await Promise.all([
        fetch("/api/members").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
        fetch("/api/resources").then((r) => r.json()),
      ]);

      if (resMem.success && Array.isArray(resMem.data)) setMembers(resMem.data);
      if (resEv.success && Array.isArray(resEv.data)) setEvents(resEv.data);
      if (resRes.success && Array.isArray(resRes.data)) setResources(resRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // MEMBER CRUD
  const openAddMember = () => {
    setEditingMember(null);
    setMemStudentNum("");
    setMemFullName("");
    setMemEmail("");
    setMemYear("1st Year");
    setMemStatus("Active");
    setMemPaymentRef("");
    setShowMemberModal(true);
  };

  const openEditMember = (m: Member) => {
    setEditingMember(m);
    setMemStudentNum(m.student_number);
    setMemFullName(m.full_name);
    setMemEmail(m.email);
    setMemYear(m.year_level);
    setMemStatus(m.status);
    setMemPaymentRef(m.payment_ref || "");
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memStudentNum.trim() || !memFullName.trim()) return;

    if (editingMember) {
      // Update
      try {
        const res = await fetch("/api/members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMember.id,
            student_number: memStudentNum.trim(),
            full_name: memFullName.trim(),
            email: memEmail.trim(),
            year_level: memYear,
            status: memStatus,
            payment_ref: memPaymentRef.trim() || null,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMembers((prev) =>
            prev.map((m) => (m.id === editingMember.id ? { ...m, ...data.data } : m))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Add
      try {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_number: memStudentNum.trim(),
            full_name: memFullName.trim(),
            email: memEmail.trim(),
            year_level: memYear,
            status: memStatus,
            payment_ref: memPaymentRef.trim() || undefined,
            program: "BSMA",
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMembers((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowMemberModal(false);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete student: ${name}?`)) return;

    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (member: Member) => {
    const nextStatus = member.status === "Active" ? "Pending" : "Active";
    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, status: nextStatus } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // EVENT CRUD
  const openAddEvent = () => {
    setEditingEvent(null);
    setEvTitle("");
    setEvCategory("Academic");
    setEvDate("");
    setEvLocation("USLT Bulwagang San Jacinto");
    setEvDesc("");
    setEvCapacity(200);
    setShowEventModal(true);
  };

  const openEditEvent = (ev: EventItem) => {
    setEditingEvent(ev);
    setEvTitle(ev.title);
    setEvCategory(ev.category);
    setEvDate(ev.event_date.split("T")[0]);
    setEvLocation(ev.location);
    setEvDesc(ev.description);
    setEvCapacity(ev.max_capacity);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evDate) return;

    if (editingEvent) {
      try {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingEvent.id,
            title: evTitle.trim(),
            category: evCategory,
            event_date: new Date(evDate).toISOString(),
            location: evLocation.trim(),
            description: evDesc.trim(),
            max_capacity: evCapacity,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEvents((prev) =>
            prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...data.data } : ev))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: evTitle.trim(),
            category: evCategory,
            event_date: new Date(evDate).toISOString(),
            location: evLocation.trim(),
            description: evDesc.trim(),
            max_capacity: evCapacity,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEvents((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete assembly: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // RESOURCE CRUD
  const openAddRes = () => {
    setEditingRes(null);
    setResTitle("");
    setResSubject("Cost Accounting & Control");
    setResCategory("Academic Reviewer");
    setResYear("All Years");
    setResFormat("PDF");
    setShowResModal(true);
  };

  const openEditRes = (r: ResourceItem) => {
    setEditingRes(r);
    setResTitle(r.title);
    setResSubject(r.subject);
    setResCategory(r.category);
    setResYear(r.year_level);
    setResFormat(r.format);
    setShowResModal(true);
  };

  const handleSaveRes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    if (editingRes) {
      try {
        const res = await fetch("/api/resources", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingRes.id,
            title: resTitle.trim(),
            subject: resSubject.trim(),
            category: resCategory,
            year_level: resYear,
            format: resFormat,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResources((prev) =>
            prev.map((r) => (r.id === editingRes.id ? { ...r, ...data.data } : r))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: resTitle.trim(),
            subject: resSubject.trim(),
            category: resCategory,
            year_level: resYear,
            format: resFormat,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResources((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowResModal(false);
  };

  const handleDeleteRes = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete resource: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.student_number.includes(searchMember) ||
      m.email.toLowerCase().includes(searchMember.toLowerCase());
    const matchesYear = filterYear === "All" || m.year_level === filterYear;
    return matchesSearch && matchesYear;
  });

  // LOGIN SCREEN
  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-sm w-full space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-[#0A2540]" />
          </div>

          <div>
            <h2 className="font-serif font-bold text-xl text-[#0A2540]">
              JPAMA Management Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select access role or enter passcode
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Enter Access Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 text-center focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
            />

            {authError && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 text-left">
            <p className="font-semibold text-slate-700">Role Credentials:</p>
            <p>👑 <strong>Super User</strong> (You): <code className="bg-slate-100 px-1 py-0.5 rounded text-[#0A2540] font-mono">super2026</code></p>
            <p>🛡️ <strong>Content Admin</strong> (Officers): <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">sihaya2026</code></p>
          </div>
        </div>
      </div>
    );
  }

  const isSuperUser = userRole === "super_user";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      {/* Admin Top Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 px-2.5 rounded bg-[#0A2540] text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm tracking-widest">
              JPAMA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base text-[#0A2540]">
                  Management Portal
                </h1>
                {isSuperUser ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>Super User (Full Control)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Content Admin</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                BS Management Accounting • University of Saint Louis Tuguegarao
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="text-slate-600 hover:text-[#0A2540] font-medium flex items-center gap-1"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setUserRole(null)}
              className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Lock Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "members"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Students & Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "events"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Assemblies & Calendar ({events.length})
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "resources"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Academic Resources ({resources.length})
            </button>
            {isSuperUser && (
              <button
                onClick={() => setActiveTab("system")}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "system"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                ⚙️ System & Roles
              </button>
            )}
          </div>

          {/* Action button corresponding to active tab */}
          <div>
            {activeTab === "members" && isSuperUser && (
              <button
                onClick={openAddMember}
                className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student Member</span>
              </button>
            )}
            {activeTab === "events" && (
              <button
                onClick={openAddEvent}
                className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assembly</span>
              </button>
            )}
            {activeTab === "resources" && (
              <button
                onClick={openAddRes}
                className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Resource</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: MEMBERS MANAGEMENT */}
        {activeTab === "members" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search name, student ID, email..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#0A2540]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                <span className="text-slate-500">Year Level:</span>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                >
                  <option value="All">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Year Level</th>
                    <th className="py-3 px-4">Payment Ref</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-semibold text-[#0A2540]">
                        {member.student_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{member.full_name}</div>
                        <div className="text-[11px] text-slate-400">{member.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {member.year_level}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {member.payment_ref || "None / Unpaid"}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={member.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Toggle Status */}
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                              member.status === "Active"
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            {member.status === "Active" ? "Set Pending" : "Approve"}
                          </button>

                          {/* Super User Edit */}
                          {isSuperUser && (
                            <button
                              onClick={() => openEditMember(member)}
                              className="p-1 text-slate-500 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                              title="Edit Member"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Super User Delete */}
                          {isSuperUser && (
                            <button
                              onClick={() => handleDeleteMember(member.id, member.full_name)}
                              className="p-1 text-slate-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS & CALENDAR MANAGEMENT */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 relative group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#EAF2FA] text-[#0A2540] font-semibold">
                    {ev.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">
                      {new Date(ev.event_date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => openEditEvent(ev)}
                      className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                      title="Edit Assembly"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {isSuperUser && (
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="Delete Assembly"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-[#0A2540]">
                  {ev.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {ev.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>📍 {ev.location}</span>
                  <Link
                    href={`/events/${ev.slug}`}
                    className="text-[#0A2540] font-semibold hover:underline"
                  >
                    View Page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ACADEMIC RESOURCES MANAGEMENT */}
        {activeTab === "resources" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 relative"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#EAF2FA] text-[#0A2540] font-semibold">
                    {res.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{res.format}</span>
                    <button
                      onClick={() => openEditRes(res)}
                      className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                      title="Edit Resource"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRes(res.id, res.title)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-[#0A2540]">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-600">
                  {res.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Subject: {res.subject} ({res.year_level})</span>
                  <span className="text-[#0A2540] font-semibold">Active in Vault</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SUPER USER SYSTEM & ROLES */}
        {activeTab === "system" && isSuperUser && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                Super User Role & Architecture Overview
              </h3>
              <p className="text-xs text-slate-500">
                You have primary administrative governance over the entire JPAMA platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Super User (You)</span>
                </div>
                <p className="text-amber-800">
                  Full CRUD authority across all student memberships, event calendar entries, and academic reviewers. Able to permanently delete items.
                </p>
                <div className="pt-2 border-t border-amber-200 font-mono text-[11px] text-amber-900">
                  Passcode: <code className="bg-white px-1.5 py-0.5 rounded font-bold">super2026</code>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Content Admin (Officers)</span>
                </div>
                <p className="text-blue-800">
                  Secretariat & Committee chairs can add/edit events, publish reviewers, and approve student membership registrations.
                </p>
                <div className="pt-2 border-t border-blue-200 font-mono text-[11px] text-blue-900">
                  Passcode: <code className="bg-white px-1.5 py-0.5 rounded font-bold">sihaya2026</code>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Users (BSMA Students)</span>
                </div>
                <p className="text-emerald-800">
                  Access public overview, verify standing in directory, apply for registration, RSVP to assemblies, and unlock academic reviewers.
                </p>
                <div className="pt-2 border-t border-emerald-200 font-mono text-[11px] text-emerald-900">
                  Auth: Student ID Number
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT MEMBER */}
        {showMemberModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  {editingMember ? "Edit Student Member" : "Add New Student Member"}
                </h3>
                <button onClick={() => setShowMemberModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024-00142"
                    value={memStudentNum}
                    onChange={(e) => setMemStudentNum(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name, M.I., Last Name"
                    value={memFullName}
                    onChange={(e) => setMemFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">USLT Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@uslt.edu.ph"
                    value={memEmail}
                    onChange={(e) => setMemEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year Level</label>
                    <select
                      value={memYear}
                      onChange={(e) => setMemYear(e.target.value as YearLevel)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Membership Status</label>
                    <select
                      value={memStatus}
                      onChange={(e) => setMemStatus(e.target.value as MemberStatus)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. GCASH-12345 or CASHIER-USLT-8910"
                    value={memPaymentRef}
                    onChange={(e) => setMemPaymentRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowMemberModal(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold">
                    {editingMember ? "Save Changes" : "Create Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT EVENT */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  {editingEvent ? "Edit Assembly" : "Create New Assembly"}
                </h3>
                <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAS Quiz Bowl 2026"
                    value={evTitle}
                    onChange={(e) => setEvTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={evCategory}
                      onChange={(e) => setEvCategory(e.target.value as any)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Competition">Competition</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={evDate}
                      onChange={(e) => setEvDate(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    >
                    </input>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={evLocation}
                    onChange={(e) => setEvLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the assembly"
                    value={evDesc}
                    onChange={(e) => setEvDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold">
                    {editingEvent ? "Update Assembly" : "Publish Assembly"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT RESOURCE */}
        {showResModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  {editingRes ? "Edit Resource Item" : "Add Resource Item"}
                </h3>
                <button onClick={() => setShowResModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveRes} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Strategic Cost Management Reviewer"
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={resCategory}
                      onChange={(e) => setResCategory(e.target.value as any)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="Academic Reviewer">Academic Reviewer</option>
                      <option value="Study Kit">Study Kit</option>
                      <option value="Template">Template</option>
                      <option value="Webinar">Webinar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Format</label>
                    <select
                      value={resFormat}
                      onChange={(e) => setResFormat(e.target.value as any)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="PDF">PDF</option>
                      <option value="XLSX">Excel XLSX</option>
                      <option value="ZIP Kit">ZIP Kit</option>
                      <option value="MP4 / Stream">Video Stream</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowResModal(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold">
                    {editingRes ? "Update Resource" : "Save Resource"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
