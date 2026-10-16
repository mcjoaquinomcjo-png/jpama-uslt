"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Calendar,
  Plus,
  Check,
  X,
  Search,
  Filter,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Member, EventItem } from "@/lib/types";

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"members" | "events">("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & filter
  const [searchMember, setSearchMember] = useState("");
  const [filterYear, setFilterYear] = useState("All");

  // Add event modal state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<EventItem["category"]>("Academic");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("USLT Bulwagang San Jacinto");
  const [newEventDesc, setNewEventDesc] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default chapter PIN for executive secretariat
    if (passcode.trim() === "sihaya2026" || passcode.trim() === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
      loadAdminData();
    } else {
      setAuthError("Invalid Chapter Passcode. Please check with the Executive Secretariat.");
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Fetch members
      const resMembers = await fetch("/api/members");
      const dataMembers = await resMembers.json();
      if (resMembers.ok && dataMembers.success) {
        setMembers(dataMembers.data);
      }

      // Fetch events
      const resEvents = await fetch("/api/events");
      const dataEvents = await resEvents.json();
      if (resEvents.ok && dataEvents.success) {
        setEvents(dataEvents.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (memberId: string, newStatus: Member["status"]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;

    const newSlug = newEventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const item: EventItem = {
      id: `ev-${Date.now()}`,
      slug: newSlug,
      title: newEventTitle.trim(),
      category: newEventCategory,
      description: newEventDesc.trim() || "Official JPAMA USLT Chapter Assembly.",
      event_date: new Date(newEventDate).toISOString(),
      location: newEventLocation.trim(),
      max_capacity: 200,
      is_published: true,
    };

    setEvents((prev) => [item, ...prev]);
    setShowAddEvent(false);
    setNewEventTitle("");
    setNewEventDesc("");
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.student_number.includes(searchMember) ||
      m.email.toLowerCase().includes(searchMember.toLowerCase());
    const matchesYear = filterYear === "All" || m.year_level === filterYear;
    return matchesSearch && matchesYear;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-sm w-full space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-[#0A2540]" />
          </div>

          <div>
            <h2 className="font-serif font-bold text-xl text-[#0A2540]">
              JPAMA Admin Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              For Executive Council & Secretariat Officers
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Enter Chapter Passcode"
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
              Sign In to Admin
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Passcode: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">sihaya2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Admin Top Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#0A2540] text-[#C5A059] flex items-center justify-center font-serif font-bold text-base">
              JP
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-[#0A2540]">
                JPAMA Officer Command Center
              </h1>
              <p className="text-[11px] text-slate-500">
                BS Management Accounting Directory & Content Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="text-slate-600 hover:text-[#0A2540] font-medium"
            >
              View Public Website →
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Lock Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs & Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "members"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Student Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "events"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Assemblies & Calendar ({events.length})
            </button>
          </div>

          {activeTab === "events" && (
            <button
              onClick={() => setShowAddEvent(true)}
              className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assembly</span>
            </button>
          )}
        </div>

        {/* TAB 1: MEMBERS DIRECTORY */}
        {activeTab === "members" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
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
                        {member.status === "Pending" ? (
                          <button
                            onClick={() => handleUpdateStatus(member.id, "Active")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Approve
                          </button>
                        ) : member.status === "Active" ? (
                          <button
                            onClick={() => handleUpdateStatus(member.id, "Pending")}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] font-medium transition-colors"
                          >
                            Set Pending
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS MANAGEMENT */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#EAF2FA] text-[#0A2540] font-semibold">
                    {ev.category}
                  </span>
                  <span className="font-mono text-slate-400">
                    {new Date(ev.event_date).toLocaleDateString()}
                  </span>
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

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  Create Chapter Assembly
                </h3>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAS Quiz Bowl 2026"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value as any)}
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
                    <label className="block font-semibold text-slate-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief agenda or summary of the event"
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold"
                  >
                    Publish Assembly
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
