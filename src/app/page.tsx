"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  Award,
  ChevronRight,
  Search,
  Check,
  Users,
  Compass,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { INITIAL_EVENTS } from "@/lib/store";
import { Member } from "@/lib/types";

export default function HomePage() {
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<Member | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleQuickLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setIsSearching(true);
    setLookupError("");
    setLookupResult(null);

    try {
      const res = await fetch(`/api/members/${encodeURIComponent(lookupQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLookupResult(data.data);
      } else {
        setLookupError(data.error || "No registration record found for that student number.");
      }
    } catch (err) {
      setLookupError("Failed to connect to the directory. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Student-friendly BSMA Pillars (Concise & editable)
  const bsmaPillars = [
    {
      title: "Strategic Cost & Management",
      desc: "Mastering cost behavior, budgeting, performance evaluation, and decision modeling for modern business controllership.",
      icon: Compass,
      tag: "Core Academic",
    },
    {
      title: "CMA & Professional Pathways",
      desc: "Preparing Louisian scholars for global certifications, corporate accounting, financial planning, and advisory careers.",
      icon: Award,
      tag: "Career Ready",
    },
    {
      title: "Leadership & Chapter Donning",
      desc: "Building ethical leadership, student camaraderie, and executive governance through our annual assembly rites.",
      icon: Users,
      tag: "Student Life",
    },
  ];

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. HERO SECTION (Clean, Minimalist University of San Diego Style) */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-[#EAF2FA] opacity-70 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>Bachelor of Science in Management Accounting (BSMA)</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight leading-tight">
                Empowering Louisian <span className="text-[#C5A059]">Management Accountants</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Welcome to the official web portal of the <strong>Junior Philippine Association of Management Accountants (JPAMA)</strong> – University of Saint Louis Tuguegarao Chapter. Your dedicated hub for chapter events, academic reviewers, and student membership.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/membership"
                  className="px-6 py-3 rounded-md bg-[#0A2540] hover:bg-[#14487A] text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Apply / Register</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/events"
                  className="px-6 py-3 rounded-md bg-white hover:bg-slate-50 text-[#0A2540] border border-slate-300 font-semibold text-sm transition-all"
                >
                  Events Calendar
                </Link>

                <Link
                  href="/about"
                  className="px-5 py-3 rounded-md text-slate-600 hover:text-[#0A2540] font-semibold text-sm transition-all"
                >
                  About the Chapter →
                </Link>
              </div>

              {/* Institutional Tagline */}
              <div className="pt-4 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
                <span>School of Accountancy, Business, and Hospitality</span>
                <span>•</span>
                <span>USLT Tuguegarao City</span>
              </div>
            </div>

            {/* Right Column: Quick Student Directory Verification Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-md bg-[#EAF2FA] flex items-center justify-center text-[#0A2540]">
                    <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0A2540]">
                      BSMA Student Verification
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Check your active membership & registration status
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuickLookup} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 2023-01042"
                        value={lookupQuery}
                        onChange={(e) => setLookupQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors disabled:opacity-50"
                  >
                    {isSearching ? "Checking..." : "Verify Status"}
                  </button>
                </form>

                {/* Lookup Result Box */}
                {lookupResult && (
                  <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">
                        {lookupResult.full_name}
                      </span>
                      <StatusBadge status={lookupResult.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-emerald-800 space-y-0.5">
                      <p>Student ID: <span className="font-mono font-semibold">{lookupResult.student_number}</span></p>
                      <p>Year Level: <span className="font-semibold">{lookupResult.year_level}</span></p>
                      <p>Program: <span className="font-semibold">{lookupResult.program} (Management Accounting)</span></p>
                    </div>
                  </div>
                )}

                {lookupError && (
                  <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    {lookupError}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Not yet registered?</span>
                  <Link href="/membership" className="text-[#0A2540] font-semibold hover:underline">
                    Register Online →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BSMA COURSE FOCUS PILLARS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            ACADEMIC FOCUS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
            The BS Management Accounting Program
          </h2>
          <p className="text-slate-600 text-sm">
            Bridging financial analytics, cost control, and strategic management for USLT scholars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bsmaPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0A2540]" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. UPCOMING EVENTS TEASER (Scrollable / Clickable Cards) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                CALENDAR SPOTLIGHT
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                Upcoming Assemblies & Convocations
              </h2>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A2540] hover:text-[#14487A] transition-colors"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_EVENTS.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group bg-[#F8FAFC] border border-slate-200 hover:border-[#0A2540] rounded-lg p-5 flex flex-col justify-between space-y-4 transition-all hover:bg-white shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#0A2540] border border-slate-200">
                      {event.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#0A2540] group-hover:text-[#14487A] transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[180px]">{event.location}</span>
                  <span className="text-[#0A2540] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SITEMAP OVERVIEW STRIP (Overview to Contact) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="border border-slate-200 rounded-xl bg-white p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center sm:text-left">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] mb-2">
                About
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Chapter history, executive directory & by-laws.
              </p>
              <Link href="/about" className="text-xs font-semibold text-[#0A2540] hover:underline">
                Explore About →
              </Link>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] mb-2">
                Events
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Interactive monthly calendar & past photo archives.
              </p>
              <Link href="/events" className="text-xs font-semibold text-[#0A2540] hover:underline">
                View Calendar →
              </Link>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] mb-2">
                Membership
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Apply for registration & verify active standing.
              </p>
              <Link href="/membership" className="text-xs font-semibold text-[#0A2540] hover:underline">
                Join Portal →
              </Link>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] mb-2">
                Resources
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Access-controlled BSMA reviewer vault.
              </p>
              <Link href="/resources" className="text-xs font-semibold text-[#0A2540] hover:underline">
                Review Vault →
              </Link>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] mb-2">
                Contact
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Bulwagang San Jacinto secretariat office.
              </p>
              <Link href="/contact" className="text-xs font-semibold text-[#0A2540] hover:underline">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
