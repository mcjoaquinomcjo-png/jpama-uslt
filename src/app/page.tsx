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
import GoldCyclingBorder from "@/components/GoldCyclingBorder";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<Member | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Always start with server-safe defaults to avoid hydration mismatch
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(
    ["hero", "pillars", "events", "resources", "contact"]
  );

  const [content, setContent] = useState<OverviewContent>(DEFAULT_OVERVIEW_CONTENT);

  useEffect(() => {
    // Mark as mounted — prevents hydration mismatch from localStorage reads
    setMounted(true);

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

  // Guarantee that populated custom sections (slideshows with photos) are showcased
  const renderedSections = React.useMemo(() => {
    const list = [...sectionsOrder];
    if (content.custom_sections) {
      Object.entries(content.custom_sections).forEach(([customId, sec]) => {
        const hasContent = (sec.images && sec.images.length > 0) || (sec.title && sec.title.trim().length > 0);
        if (!hasContent) return;

        if (list.includes(customId)) return;

        const placeholderIdx = list.findIndex(
          (id) => id.startsWith("custom_") && !(content.custom_sections?.[id]?.images?.length)
        );
        if (placeholderIdx !== -1) {
          list[placeholderIdx] = customId;
        } else {
          const contactIdx = list.indexOf("contact");
          if (contactIdx !== -1) {
            list.splice(contactIdx, 0, customId);
          } else {
            list.push(customId);
          }
        }
      });
    }
    return list;
  }, [sectionsOrder, content.custom_sections]);

  return (
    <div suppressHydrationWarning className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {renderedSections.map((sectionId) => {
        // 1. HERO SECTION — Rich navy/blue gradient with floating royal emblem
        if (sectionId === "hero") {
          return (
            <section key="hero" className="relative overflow-hidden bg-[#071324] py-2 sm:py-4 px-2 sm:px-4 lg:px-6 w-full">
              {/* Decorative radial glows */}
              <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-[#18538C] opacity-35 blur-[130px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#C5A059] opacity-15 blur-[100px] pointer-events-none" />

              {/* Main Luxury Framed Showcase Container with Fine Royal Cycling Gold Border Beam */}
              <div className="w-full max-w-[1560px] mx-auto relative rounded-3xl bg-gradient-to-b from-[#091D33] via-[#0A2540] to-[#071629] p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#D4AF37]/35 overflow-visible">
                {/* 360-Degree Continuous Fine Classy Royal Shimmer Lining (Zero artificial stars) */}
                <GoldCyclingBorder borderRadius={24} duration={7} strokeWidth={1.2} intensity="high" showGlints={false} />

                {/* Subtle Luxury Golden Light Ribbons / Curves in Background */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-25 rounded-3xl overflow-hidden"
                  preserveAspectRatio="none"
                  viewBox="0 0 1200 600"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="heroGoldRibbon1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C5A059" stopOpacity="0" />
                      <stop offset="40%" stopColor="#F5D583" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#C5A059" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0A2540" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="heroGoldRibbon2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0A2540" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FFE599" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M-50,480 C250,420 380,180 720,220 C1040,260 1120,-20 1250,60" fill="none" stroke="url(#heroGoldRibbon1)" strokeWidth="2.5" />
                  <path d="M-20,530 C280,480 440,240 780,280 C1100,320 1140,40 1280,120" fill="none" stroke="url(#heroGoldRibbon2)" strokeWidth="1.5" strokeDasharray="6 6" />
                </svg>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                  {/* Left Column: Headline & Action Buttons */}
                  <div className={`${content.hero.emblem_visible !== false ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl mx-auto text-center"} space-y-6`}>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 text-[#C5A059] text-xs font-semibold border border-[#C5A059]/40 shadow-sm backdrop-blur-sm">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>{content.hero.badge}</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                      {content.hero.title_start} <span className="text-[#C5A059]">{content.hero.title_highlight}</span>
                    </h1>

                    <p className={`text-blue-100 text-base sm:text-lg leading-relaxed ${content.hero.emblem_visible !== false ? "max-w-2xl" : "max-w-3xl mx-auto"}`}>
                      {content.hero.description}
                    </p>

                    {Boolean(content.hero.btn_primary_text?.trim() || content.hero.btn_secondary_text?.trim()) && (
                      <div className={`pt-2 flex flex-wrap items-center gap-3 ${content.hero.emblem_visible === false ? "justify-center" : ""}`}>
                        {content.hero.btn_primary_text?.trim() && (
                          <Link
                            href={content.hero.btn_primary_link || "/membership"}
                            className="px-6 py-3 rounded-lg bg-[#C5A059] hover:bg-[#E8C97A] text-[#0A2540] font-bold text-sm shadow-md transition-all flex items-center gap-2"
                          >
                            <span>{content.hero.btn_primary_text}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          href="/events"
                          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm transition-all"
                        >
                          Events Calendar
                        </Link>

                        {content.hero.btn_secondary_text?.trim() && (
                          <Link
                            href={content.hero.btn_secondary_link || "/resources"}
                            className="px-6 py-3 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 border border-blue-400/30 font-semibold text-sm transition-all flex items-center gap-2"
                          >
                            <BookOpen className="w-4 h-4 text-[#C5A059]" />
                            <span>{content.hero.btn_secondary_text}</span>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Metric Counters — With Fine Royal Cycling Gold Borders */}
                    {(() => {
                      const rawStats = [
                        content.hero.stat_scholars,
                        content.hero.stat_convocations,
                        content.hero.stat_passers,
                        content.hero.stat_partners,
                      ];
                      const validStats = rawStats
                        .map((s) => (typeof s === "string" ? s.trim() : ""))
                        .filter((s) => s.length > 0);

                      if (validStats.length === 0) return null;

                      const gridColsClass =
                        validStats.length === 1
                          ? "grid-cols-1 max-w-xs"
                          : validStats.length === 2
                          ? "grid-cols-2 max-w-md"
                          : validStats.length === 3
                          ? "grid-cols-1 sm:grid-cols-3"
                          : "grid-cols-2 sm:grid-cols-4";

                      return (
                        <div className={`pt-3 grid ${gridColsClass} gap-2.5 ${content.hero.emblem_visible === false ? "mx-auto max-w-3xl" : ""}`}>
                          {validStats.map((stat, sIdx) => {
                            const parts = stat.split(/\s+/);
                            const numberPart = parts[0] || stat;
                            const labelPart = parts.slice(1).join(" ");
                            return (
                              <div
                                key={sIdx}
                                className="relative bg-[#07192C]/85 backdrop-blur-sm p-3 rounded-xl border border-[#D4AF37]/30 overflow-visible group hover:border-[#D4AF37]/75 transition-all shadow-md"
                              >
                                <GoldCyclingBorder
                                  borderRadius={12}
                                  duration={4 + sIdx * 0.4}
                                  strokeWidth={1}
                                  showGlints={false}
                                  glow={true}
                                  intensity="subtle"
                                />
                                <span className="block font-bold text-base sm:text-lg text-[#F5D583] relative z-10 tracking-tight">
                                  {numberPart}
                                </span>
                                {labelPart && (
                                  <span className="text-[10.5px] text-blue-200 block leading-tight font-medium relative z-10">
                                    {labelPart}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Institutional Tagline — Hides If Both Blank */}
                    {Boolean(content.hero.tagline_dept?.trim() || content.hero.tagline_loc?.trim()) && (
                      <div className={`pt-3 flex items-center gap-4 text-xs text-blue-300 border-t border-white/10 ${content.hero.emblem_visible === false ? "justify-center" : ""}`}>
                        {content.hero.tagline_dept?.trim() && <span>{content.hero.tagline_dept}</span>}
                        {Boolean(content.hero.tagline_dept?.trim() && content.hero.tagline_loc?.trim()) && (
                          <span>•</span>
                        )}
                        {content.hero.tagline_loc?.trim() && <span>{content.hero.tagline_loc}</span>}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Royal JPAMA Emblem (Editable, Solid Stable Glow, No Wobbling) */}
                  {content.hero.emblem_visible !== false && (
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4 lg:py-6">
                      {/* Ambient Golden Radial Backlight */}
                      <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#F5D583]/15 to-transparent blur-3xl pointer-events-none" />

                      {/* Emblem Container: Motion controlled by admin settings (default: steady rock-solid royal glow) */}
                      <div
                        className={`relative group flex flex-col items-center justify-center ${
                          content.hero.emblem_motion === "floating"
                            ? "animate-float"
                            : ""
                        }`}
                      >
                        {/* Deep multi-layered ambient floor shadow */}
                        <div className="absolute -bottom-8 w-60 sm:w-72 h-10 bg-black/75 blur-2xl rounded-full transform scale-90 pointer-events-none" />
                        <div className="absolute -bottom-4 w-44 sm:w-56 h-6 bg-[#D4AF37]/20 blur-xl rounded-full pointer-events-none" />

                        {/* Main Emblem Badge Container */}
                        <div className="relative rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-white/10 via-[#0A2540]/70 to-[#07172B]/95 backdrop-blur-xl border border-[#D4AF37]/45 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-[1.02]">
                          {/* Fine Royal Cycling Gold Border around Emblem */}
                          <GoldCyclingBorder borderRadius={24} duration={6} strokeWidth={1.2} intensity="vivid" showGlints={false} />

                          {/* Large High-Res JPAMA BSMA Seal */}
                          <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden flex items-center justify-center p-2.5 bg-gradient-to-b from-[#081F38]/60 to-[#061528]/80 shadow-inner">
                            <img
                              src={content.hero.emblem_image || "/jpama-hero-emblem.jpg"}
                              alt={content.hero.emblem_title || "Junior Philippine Association of Management Accountants Emblem"}
                              className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] transition-all duration-500 group-hover:drop-shadow-[0_16px_32px_rgba(212,175,55,0.4)]"
                            />
                          </div>

                          {/* Chapter Seal Caption — SABH removed per user request */}
                          {Boolean(content.hero.emblem_title?.trim() || content.hero.emblem_subtitle?.trim()) && (
                            <div className="pt-3 text-center border-t border-[#D4AF37]/25 space-y-0.5">
                              {content.hero.emblem_title?.trim() && (
                                <span className="font-serif text-xs sm:text-sm font-bold text-[#F5D583] tracking-widest uppercase block">
                                  {content.hero.emblem_title}
                                </span>
                              )}
                              {content.hero.emblem_subtitle?.trim() && (
                                <span className="text-[10.5px] text-blue-200/80 font-sans tracking-wide block">
                                  {content.hero.emblem_subtitle}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Directory Lookup Pill below emblem */}
                        <Link
                          href="/membership#lookup"
                          className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A2540]/80 hover:bg-[#14487A] text-blue-100 hover:text-white border border-[#D4AF37]/30 text-xs font-medium transition-all shadow-md group/lookup"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] group-hover/lookup:scale-110 transition-transform" />
                          <span>Verify Student Membership Standing</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // 2. BSMA COURSE FOCUS PILLARS — Hides If Empty
        if (sectionId === "pillars") {
          const validPillars = (content.pillars.items || []).filter(
            (p) => (p.title && p.title.trim().length > 0) || (p.desc && p.desc.trim().length > 0)
          );
          if (validPillars.length === 0 && !content.pillars.section_title?.trim()) {
            return null;
          }

          return (
            <section key="pillars" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {(content.pillars.section_eyebrow?.trim() || content.pillars.section_title?.trim() || content.pillars.section_desc?.trim()) && (
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                  {content.pillars.section_eyebrow?.trim() && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                      {content.pillars.section_eyebrow}
                    </span>
                  )}
                  {content.pillars.section_title?.trim() && (
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {content.pillars.section_title}
                    </h2>
                  )}
                  {content.pillars.section_desc?.trim() && (
                    <p className="text-slate-600 text-sm">
                      {content.pillars.section_desc}
                    </p>
                  )}
                </div>
              )}

              <div className={`grid grid-cols-1 md:grid-cols-${Math.min(Math.max(validPillars.length, 1), 3)} gap-6`}>
                {validPillars.map((pillar, idx) => {
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
                        {pillar.tag?.trim() && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0A2540] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {pillar.tag}
                          </span>
                        )}
                      </div>

                      {pillar.title?.trim() && (
                        <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                          {pillar.title}
                        </h3>
                      )}

                      {pillar.desc?.trim() && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {pillar.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // 3. UPCOMING EVENTS TEASER — Hides If Blank
        if (sectionId === "events") {
          if (!content.events.section_title?.trim() && !content.events.section_eyebrow?.trim()) {
            return null;
          }

          return (
            <section key="events" className="py-16 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    {content.events.section_eyebrow?.trim() && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                        {content.events.section_eyebrow}
                      </span>
                    )}
                    {content.events.section_title?.trim() && (
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                        {content.events.section_title}
                      </h2>
                    )}
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
                      className="group bg-[#F8FAFC] hover:bg-white hover:shadow-lg rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all relative border border-[#D4AF37]/30 overflow-visible"
                    >
                      <GoldCyclingBorder borderRadius={12} duration={5} strokeWidth={1.2} showGlints={false} intensity="subtle" />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#0A2540] border border-slate-200">
                            {event.category}
                          </span>
                          <span className="text-xs text-[#9E7D38] font-medium">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-[#0A2540] group-hover:text-[#14487A] transition-colors leading-snug">
                          {event.title}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                        <span className="truncate max-w-[180px] font-medium">{event.location}</span>
                        <span className="text-[#0A2540] font-semibold flex items-center gap-1 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all">
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

        // 4. ACADEMIC RESOURCES BANNER — Hides If Blank
        if (sectionId === "resources") {
          if (!content.resources.title?.trim() && !content.resources.description?.trim()) {
            return null;
          }

          const validTags = (content.resources.tags || []).filter((t) => t && t.trim().length > 0);

          return (
            <section key="resources" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#0E355A] to-[#14487A] p-8 sm:p-12 text-white relative overflow-visible shadow-xl border border-[#D4AF37]/35">
                <GoldCyclingBorder borderRadius={16} duration={6} strokeWidth={1.4} intensity="high" showGlints={false} />
                {/* Accent glow & pattern */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    {content.resources.badge?.trim() && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] text-xs font-semibold border border-[#C5A059]/30">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{content.resources.badge}</span>
                      </div>
                    )}

                    {content.resources.title?.trim() && (
                      <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                        {content.resources.title}
                      </h2>
                    )}

                    {content.resources.description?.trim() && (
                      <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                        {content.resources.description}
                      </p>
                    )}

                    {validTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {validTags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-md bg-white/10 text-xs font-medium text-blue-200 border border-white/10">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                    {content.resources.btn_text?.trim() && (
                      <Link
                        href="/resources"
                        className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#E8C97A] text-[#0A2540] font-bold text-sm text-center shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <span>{content.resources.btn_text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
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

        // 5. CONTACT & OFFICE INFO — Hides If Blank
        if (sectionId === "contact") {
          const hasOffice = Boolean(content.contact?.office_title?.trim() || content.contact?.office_desc?.trim());
          const hasEmail = Boolean(content.contact?.email_title?.trim() || content.contact?.email_desc?.trim());
          const hasHours = Boolean(content.contact?.hours_title?.trim() || content.contact?.hours_desc?.trim());

          if (!hasOffice && !hasEmail && !hasHours) {
            return null;
          }

          const activeCount = [hasOffice, hasEmail, hasHours].filter(Boolean).length;
          const gridColsClass =
            activeCount === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : activeCount === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 md:grid-cols-3";

          return (
            <section key="contact" className="py-14 bg-[#EAF2FA]/50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid ${gridColsClass} gap-8`}>
                  {/* Location */}
                  {hasOffice && (
                    <div className="flex items-start gap-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[#0A2540]" />
                      </div>
                      <div>
                        {content.contact.office_title?.trim() && (
                          <h4 className="font-serif font-bold text-sm text-[#0A2540]">{content.contact.office_title}</h4>
                        )}
                        {content.contact.office_desc?.trim() && (
                          <p className="text-xs text-slate-600 mt-1">
                            {content.contact.office_desc}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {hasEmail && (
                    <div className="flex items-start gap-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-[#0A2540]" />
                      </div>
                      <div>
                        {content.contact.email_title?.trim() && (
                          <h4 className="font-serif font-bold text-sm text-[#0A2540]">{content.contact.email_title}</h4>
                        )}
                        {content.contact.email_desc?.trim() && (
                          <p className="text-xs text-slate-600 mt-1">
                            {content.contact.email_desc}
                          </p>
                        )}
                        <Link href="/contact" className="text-[11px] font-semibold text-[#0A2540] hover:underline mt-1 inline-block">
                          Send message →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  {hasHours && (
                    <div className="flex items-start gap-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#0A2540]" />
                      </div>
                      <div>
                        {content.contact.hours_title?.trim() && (
                          <h4 className="font-serif font-bold text-sm text-[#0A2540]">{content.contact.hours_title}</h4>
                        )}
                        {content.contact.hours_desc?.trim() && (
                          <p className="text-xs text-slate-600 mt-1">
                            {content.contact.hours_desc}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // 6. LEADERSHIP COUNCIL SPOTLIGHT — Hides If Blank
        if (sectionId === "leadership") {
          const leadership = content.leadership;
          const hasTitle = Boolean(leadership?.section_title?.trim());
          const hasDesc = Boolean(leadership?.section_desc?.trim());
          if (!hasTitle && !hasDesc) {
            return null;
          }

          return (
            <section key="leadership" className="py-16 bg-[#F8FAFC] border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div className="space-y-2 max-w-2xl">
                    {leadership?.section_eyebrow?.trim() && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                        {leadership.section_eyebrow}
                      </span>
                    )}
                    {hasTitle && (
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                        {leadership?.section_title}
                      </h2>
                    )}
                    {hasDesc && (
                      <p className="text-slate-600 text-sm">
                        {leadership?.section_desc}
                      </p>
                    )}
                  </div>
                  {leadership?.btn_text?.trim() && (
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
                    >
                      <span>{leadership.btn_text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // 7. CUSTOM DYNAMIC SECTIONS — Hides If Blank (No Images, Title, or Body)
        const customSec =
          content.custom_sections?.[sectionId] ||
          (sectionId.startsWith("custom_")
            ? Object.values(content.custom_sections || {}).find(
                (s) => s.images && s.images.length > 0
              )
            : undefined);

        if (customSec) {
          const hasImages = (customSec.images || []).some((img) => img && typeof img === "string" && img.trim().length > 0);
          const hasTitle = Boolean(customSec.title && customSec.title.trim().length > 0);
          const hasBody = Boolean(customSec.body && customSec.body.trim().length > 0);

          if (!hasImages && !hasTitle && !hasBody) {
            return null; // Blank: hide section
          }

          return (
            <CustomSectionSlideshow
              key={sectionId}
              sectionId={sectionId}
              data={customSec}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
