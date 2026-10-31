"use client";

import React, { useState, useEffect } from "react";
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
  FileText,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  Download,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { INITIAL_EVENTS } from "@/lib/store";
import { Member } from "@/lib/types";
import { DEFAULT_OVERVIEW_CONTENT, OverviewContent } from "@/lib/siteContent";
import CustomSectionSlideshow from "@/components/CustomSectionSlideshow";

export default function HomePage() {
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<Member | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Dynamic section order and content loaded from Super User Admin settings
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSections = localStorage.getItem("jpama_overview_sections");
        if (savedSections) {
          const parsed = JSON.parse(savedSections);
          if (Array.isArray(parsed)) {
            return parsed.filter((s: any) => s.visible !== false).map((s: any) => s.id);
          }
        }
      } catch (e) {}
    }
    return ["hero", "pillars", "events", "resources", "contact"];
  });

  const [content, setContent] = useState<OverviewContent>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedContent = localStorage.getItem("jpama_overview_content");
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          if (parsed && typeof parsed === "object") {
            return { ...DEFAULT_OVERVIEW_CONTENT, ...parsed };
          }
        }
      } catch (e) {}
    }
    return DEFAULT_OVERVIEW_CONTENT;
  });

  useEffect(() => {
    const applySections = (sections: Array<{ id: string; visible?: boolean }>) => {
      if (Array.isArray(sections)) {
        const visibleIds = sections.filter((s) => s.visible !== false).map((s) => s.id);
        setSectionsOrder(visibleIds);
      }
    };

    // 1. Initial cached local storage (fast first paint)
    try {
      const savedSections = localStorage.getItem("jpama_overview_sections");
      if (savedSections) {
        const parsed = JSON.parse(savedSections);
        applySections(parsed);
      }
      const savedContent = localStorage.getItem("jpama_overview_content");
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        if (parsed && typeof parsed === "object") {
          setContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {}

    // 2. Fetch authoritative live overview configuration from Supabase server
    const fetchLiveConfig = () => {
      fetch(`/api/settings/overview?_t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            if (Array.isArray(json.data.sections)) {
              applySections(json.data.sections);
            }
            if (json.data.content) {
              setContent((prev) => ({ ...prev, ...json.data.content }));
            }
          }
        })
        .catch(() => {});
    };

    fetchLiveConfig();

    // 3. Listen for live updates from admin portal (cross-tab or same-session)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jpama_overview_sections" && e.newValue) {
        try {
          applySections(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === "jpama_overview_content" && e.newValue) {
        try {
          setContent((prev) => ({ ...prev, ...JSON.parse(e.newValue!) }));
        } catch (err) {}
      }
    };

    const handleCustomUpdate = () => {
      fetchLiveConfig();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("jpama_overview_updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("jpama_overview_updated", handleCustomUpdate);
    };
  }, []);

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

  const pillarIcons = [Compass, Award, Users];

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {sectionsOrder.map((sectionId) => {
        // 1. HERO SECTION — Rich navy/blue gradient with student verification card
        if (sectionId === "hero") {
          return (
            <section key="hero" className="relative overflow-hidden bg-gradient-to-b from-[#071A2E] via-[#0A2540] to-[#0E355A]">
              {/* Decorative radial glows */}
              <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-[#18538C] opacity-35 blur-[130px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#C5A059] opacity-15 blur-[100px] pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 40px)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C5A059] via-[#E8C97A] to-[#C5A059]" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Column: Headline & Action Buttons */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 text-[#C5A059] text-xs font-semibold border border-[#C5A059]/40 shadow-sm backdrop-blur-sm">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>{content.hero.badge}</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                      {content.hero.title_start} <span className="text-[#C5A059]">{content.hero.title_highlight}</span>
                    </h1>

                    <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                      {content.hero.description}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href={content.hero.btn_primary_link || "/membership"}
                        className="px-6 py-3 rounded-lg bg-[#C5A059] hover:bg-[#E8C97A] text-[#0A2540] font-bold text-sm shadow-md transition-all flex items-center gap-2"
                      >
                        <span>{content.hero.btn_primary_text || "Join Membership"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href="/events"
                        className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm transition-all"
                      >
                        Events Calendar
                      </Link>

                      <Link
                        href={content.hero.btn_secondary_link || "/resources"}
                        className="px-6 py-3 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 border border-blue-400/30 font-semibold text-sm transition-all flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-[#C5A059]" />
                        <span>{content.hero.btn_secondary_text || "Academic Resources"}</span>
                      </Link>
                    </div>

                    {/* Metric Counters */}
                    {(content.hero.stat_scholars || content.hero.stat_convocations || content.hero.stat_passers || content.hero.stat_partners) && (
                      <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {content.hero.stat_scholars && (
                          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                            <span className="block font-bold text-base text-[#C5A059]">{content.hero.stat_scholars.split(" ")[0]}</span>
                            <span className="text-[10px] text-blue-200">{content.hero.stat_scholars.split(" ").slice(1).join(" ")}</span>
                          </div>
                        )}
                        {content.hero.stat_convocations && (
                          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                            <span className="block font-bold text-base text-[#C5A059]">{content.hero.stat_convocations.split(" ")[0]}</span>
                            <span className="text-[10px] text-blue-200">{content.hero.stat_convocations.split(" ").slice(1).join(" ")}</span>
                          </div>
                        )}
                        {content.hero.stat_passers && (
                          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                            <span className="block font-bold text-base text-[#C5A059]">{content.hero.stat_passers.split(" ")[0]}</span>
                            <span className="text-[10px] text-blue-200">{content.hero.stat_passers.split(" ").slice(1).join(" ")}</span>
                          </div>
                        )}
                        {content.hero.stat_partners && (
                          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                            <span className="block font-bold text-base text-[#C5A059]">{content.hero.stat_partners.split(" ")[0]}</span>
                            <span className="text-[10px] text-blue-200">{content.hero.stat_partners.split(" ").slice(1).join(" ")}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Institutional Tagline */}
                    <div className="pt-3 flex items-center gap-4 text-xs text-blue-300 border-t border-white/10">
                      <span>{content.hero.tagline_dept}</span>
                      <span>•</span>
                      <span>{content.hero.tagline_loc}</span>
                    </div>
                  </div>

                  {/* Right Column: Quick Student Directory Verification Card */}
                  <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl border border-white/20 shadow-2xl p-6 relative ring-1 ring-[#C5A059]/30">
                      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-lg bg-[#EAF2FA] flex items-center justify-center text-[#0A2540]">
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
                        <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 animate-fadeIn">
                          <div className="flex items-start gap-4">
                            {/* 2x2 Photo */}
                            <div className="flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 border-emerald-300 bg-[#0A2540] flex items-center justify-center shadow-sm">
                              {lookupResult.avatar_url ? (
                                <img
                                  src={lookupResult.avatar_url}
                                  alt={lookupResult.full_name}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <svg viewBox="0 0 64 80" className="w-10 h-10 text-slate-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="32" cy="24" r="14" fill="#C5A059" fillOpacity="0.5" />
                                  <path d="M4 72c0-15.464 12.536-28 28-28s28 12.536 28 28" fill="#C5A059" fillOpacity="0.3" />
                                </svg>
                              )}
                            </div>

                            {/* Student Info */}
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-bold text-emerald-900 leading-snug">
                                  {lookupResult.full_name}
                                </span>
                                <StatusBadge status={lookupResult.status} size="sm" />
                              </div>
                              <div className="text-[11px] text-emerald-800 space-y-0.5">
                                <p>Student ID: <span className="font-mono font-semibold">{lookupResult.student_number}</span></p>
                                <p>Year Level: <span className="font-semibold">{lookupResult.year_level}</span></p>
                                <p>Program: <span className="font-semibold">{lookupResult.program} – Management Accounting</span></p>
                                {lookupResult.email && (
                                  <p>Email: <span className="font-semibold">{lookupResult.email}</span></p>
                                )}
                              </div>
                            </div>
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
          );
        }

        // 2. BSMA COURSE FOCUS PILLARS
        if (sectionId === "pillars") {
          return (
            <section key="pillars" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  {content.pillars.section_eyebrow}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                  {content.pillars.section_title}
                </h2>
                <p className="text-slate-600 text-sm">
                  {content.pillars.section_desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.pillars.items.map((pillar, idx) => {
                  const Icon = pillarIcons[idx % pillarIcons.length];
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-[#14487A]/30 transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-[#C5A059] transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0A2540] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
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
          );
        }

        // 3. UPCOMING EVENTS TEASER
        if (sectionId === "events") {
          return (
            <section key="events" className="py-16 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                      {content.events.section_eyebrow}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {content.events.section_title}
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
                      className="group bg-[#F8FAFC] border border-slate-200 hover:border-[#0A2540] rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:bg-white shadow-sm"
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
          );
        }

        // 4. ACADEMIC RESOURCES BANNER
        if (sectionId === "resources") {
          return (
            <section key="resources" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#0E355A] to-[#14487A] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-white/10">
                {/* Accent glow & pattern */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] text-xs font-semibold border border-[#C5A059]/30">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{content.resources.badge}</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                      {content.resources.title}
                    </h2>

                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                      {content.resources.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {content.resources.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-md bg-white/10 text-xs font-medium text-blue-200 border border-white/10">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                    <Link
                      href="/resources"
                      className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#E8C97A] text-[#0A2540] font-bold text-sm text-center shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>{content.resources.btn_text}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/membership"
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm text-center transition-all"
                    >
                      Verify Membership Access
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 5. CONTACT & OFFICE INFO
        if (sectionId === "contact") {
          return (
            <section key="contact" className="py-14 bg-[#EAF2FA]/50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Location */}
                  <div className="flex items-start gap-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#0A2540]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0A2540]">{content.contact.office_title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {content.contact.office_desc}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#0A2540]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0A2540]">{content.contact.email_title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {content.contact.email_desc}
                      </p>
                      <Link href="/contact" className="text-[11px] font-semibold text-[#0A2540] hover:underline mt-1 inline-block">
                        Send message →
                      </Link>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#0A2540]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0A2540]">{content.contact.hours_title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {content.contact.hours_desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 6. LEADERSHIP COUNCIL SPOTLIGHT
        if (sectionId === "leadership") {
          return (
            <section key="leadership" className="py-16 bg-[#F8FAFC] border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div className="space-y-2 max-w-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                      {content.leadership?.section_eyebrow || "EXECUTIVE STEWARDSHIP"}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {content.leadership?.section_title || "Council Leadership & Chapter Stewardship"}
                    </h2>
                    <p className="text-slate-600 text-sm">
                      {content.leadership?.section_desc || "Guiding the JPAMA USLT Chapter with servant leadership and professional dedication."}
                    </p>
                  </div>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
                  >
                    <span>{content.leadership?.btn_text || "Meet All Officers & Advisers"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          );
        }

        // 7. CUSTOM DYNAMIC SECTIONS (Slideshows, Passers, Galleries, Announcements)
        const customSec = content.custom_sections?.[sectionId];
        if (customSec || sectionId.startsWith("custom_")) {
          const fallbackData = customSec || {
            type: "slideshow",
            label: sectionId,
            images: [],
          };
          return (
            <CustomSectionSlideshow
              key={sectionId}
              sectionId={sectionId}
              data={fallbackData}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
