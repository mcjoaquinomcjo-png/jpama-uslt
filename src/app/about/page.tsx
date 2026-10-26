"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  FileText,
  ShieldCheck,
  Building,
  ChevronRight,
  ExternalLink,
  Trophy,
  Scale,
  Sparkles,
  Compass,
  Search,
  Newspaper,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  Bookmark,
  CheckCircle2,
  X,
} from "lucide-react";
import { EXECUTIVE_BOARD, FACULTY_LEADERSHIP } from "@/lib/store";
import {
  DEFAULT_JPAMA_CONFIG,
  getStoredJpamaConfig,
  fetchServerJpamaConfig,
  JpamaSectionConfig,
  HeritageItem,
  ByLawArticle,
  PurposeItem,
  PublicationContent,
} from "@/config/jpamaSettings";
import PublicationModal from "@/components/about/PublicationModal";
import ArticleDetailModal from "@/components/about/ArticleDetailModal";
import FullGazetteReaderModal from "@/components/about/FullGazetteReaderModal";

// Icon mapping helper for Article III Purpose Cards
const ICON_MAP = {
  GraduationCap,

  Users,
  ShieldCheck,
  Sparkles,
  Award,
  BookOpen,
  Scale,
  Compass,
};

export default function AboutPage() {
  const [config, setConfig] = useState<JpamaSectionConfig>(DEFAULT_JPAMA_CONFIG);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedCommittee, setSelectedCommittee] = useState<string>("All");
  const [officersList, setOfficersList] = useState<any[]>(EXECUTIVE_BOARD);
  const [bylawSearch, setBylawSearch] = useState<string>("");

  // Modals state
  const [selectedPublication, setSelectedPublication] = useState<PublicationContent | null>(null);
  const [publicationType, setPublicationType] = useState<"Gazette Article" | "Constitution Clause" | "Executive Dispatch">("Gazette Article");
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<ByLawArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const [isFullGazetteOpen, setIsFullGazetteOpen] = useState(false);
  const [gazetteFocusArticleId, setGazetteFocusArticleId] = useState<string>("all");

  // Mini Pop-Up modal state for faculty & officers
  const [selectedLeaderModal, setSelectedLeaderModal] = useState<{
    name: string;
    role: string;
    badge: string;
    avatar: string;
    affiliation?: string;
    bioOrQuote: string;
    isFaculty?: boolean;
  } | null>(null);

  // Pop-up modal state for Article III Core Purposes (One-Liner Drill-down)
  const [selectedPurposeModal, setSelectedPurposeModal] = useState<PurposeItem | null>(null);

  // Faculty Stewardship roster
  const facultyMembers = useMemo(
    () => [
      {
        id: "dean",
        name: FACULTY_LEADERSHIP.dean,
        role: FACULTY_LEADERSHIP.dean_title,
        badge: "SABH Collegiate Dean",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Supervising executive compliance, collegiate curriculum integrity, and academic excellence under the School of Accountancy, Business, and Hospitality.",
        affiliation: "School of Accountancy, Business, and Hospitality • University of Saint Louis Tuguegarao",
      },
      {
        id: "dept-head",
        name: FACULTY_LEADERSHIP.department_head,
        role: FACULTY_LEADERSHIP.department_head_title,
        badge: "Department Head",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        bio: "Directing BSMA curriculum alignment, academic reviewer programs, and professional CMA accreditation pathways.",
        affiliation: "Department of Accountancy, SABH • University of Saint Louis Tuguegarao",
      },
      {
        id: "adviser",
        name: FACULTY_LEADERSHIP.adviser,
        role: FACULTY_LEADERSHIP.adviser_title,
        badge: "Chapter Faculty Adviser",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        bio: FACULTY_LEADERSHIP.adviser_bio,
        affiliation: "School of Accountancy, Business, and Hospitality • University of Saint Louis Tuguegarao",
      },
    ],
    []
  );

  // Load dynamic configuration & officers
  useEffect(() => {
    // 1. Initial cached config
    const stored = getStoredJpamaConfig();
    setConfig(stored);

    // 2. Fetch server-persisted config across all sessions and roles
    fetchServerJpamaConfig()
      .then((serverCfg) => {
        if (serverCfg) setConfig(serverCfg);
      })
      .catch((err) => console.error("Error syncing server config:", err));

    // 3. Load latest officers from API
    fetch("/api/leadership")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setOfficersList(data.data);
        }
      })
      .catch((err) => console.error("Error loading leadership:", err));
  }, []);


  // Filtered By-Laws search
  const filteredBylaws = useMemo(() => {
    if (!bylawSearch.trim()) return config.bylaws;
    const q = bylawSearch.toLowerCase();
    return config.bylaws.filter((a) => {
      return (
        a.title.toLowerCase().includes(q) ||
        a.articleNumber.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.sections.some((s) => s.content.toLowerCase().includes(q) || (s.title && s.title.toLowerCase().includes(q)))
      );
    });
  }, [config.bylaws, bylawSearch]);

  // Executive Committee filters
  const committees = [
    "All",
    "Executive Council",
    "Academic Wing",
    "Finance & Audit",
    "Secretariat",
    "Internal Affairs",
    "External Relations",
    "Public Relations",
  ];

  const filteredOfficers = useMemo(() => {
    if (selectedCommittee === "All") {
      return officersList.filter((o) => o.category !== "Faculty Adviser");
    }
    return officersList.filter(
      (m) => m.committee === selectedCommittee || (m.category !== "Faculty Adviser" && selectedCommittee === "All")
    );
  }, [officersList, selectedCommittee]);

  // Open publication modal for Heritage item
  const handleOpenHeritagePublication = (item: HeritageItem) => {
    if (item.publicationContent) {
      setSelectedPublication(item.publicationContent);
      setPublicationType("Gazette Article");
      setIsPublicationModalOpen(true);
    } else {
      setSelectedPublication({
        headline: `${item.year}: ${item.title}`,
        datePublished: item.year,
        author: "JPAMA Historical Archives",
        issueNumber: `Historical Archive #${item.year}`,
        pullQuote: item.summary,
        fullArticleHtml: `<p>${item.summary}</p>`,
      });
      setPublicationType("Gazette Article");
      setIsPublicationModalOpen(true);
    }
  };

  // Open quick article modal
  const handleOpenArticleDetail = (article: ByLawArticle) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  // Switch from article modal to full gazette reader
  const handleSwitchToGazette = (article: ByLawArticle) => {
    setIsArticleModalOpen(false);
    setGazetteFocusArticleId(article.id);
    setIsFullGazetteOpen(true);
  };

  // Dynamic Navigation Tabs array
  const dynamicTabs = useMemo(() => {
    const base = [
      { id: "overview", label: "Chapter Overview & History", icon: Building },
      { id: "leadership", label: "Executive Council & Faculty", icon: Users },
      { id: "constitution", label: "Constitution & By-Laws", icon: Scale, badge: "11 Articles" },
    ];

    if (config.customTabs && Array.isArray(config.customTabs)) {
      config.customTabs
        .filter((t) => t.enabled)
        .forEach((t) => {
          base.push({
            id: t.id,
            label: t.title,
            icon: Layers,
            badge: `${t.contentBoxes?.length || 0} items`,
          });
        });
    }

    return base;
  }, [config.customTabs]);

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* ─── SECTION A: Header & Tab Navigation Controller ─── */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-6 sm:pt-16 sm:pb-8 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold border border-blue-100">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>School of Accountancy, Business, and Hospitality • USLT</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight">
            About <span className="text-[#C5A059]">JPAMA</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Junior Philippine Association of Management Accountants • University of Saint Louis Tuguegarao Chapter. Upholding Christian excellence, scholastic distinction, and ethical governance under SABH.
          </p>

          {/* Dynamic Tab Switcher */}
          <div className="pt-6 flex items-center justify-center flex-wrap gap-2">
            {dynamicTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#0A2540] text-white shadow-md shadow-[#0A2540]/15"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A059]" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#C5A059] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full flex-1">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: CHAPTER OVERVIEW & HISTORY
             ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12 sm:space-y-16"
            >
              {/* Contextual Banner: The Sihaya Chapter Era for A.Y. 2026–2027 */}
              <section className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#10345b] to-[#14487A] text-white shadow-md border border-[#0A2540] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-[#E8C97A] text-xs font-semibold border border-amber-300/30">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Academic Year 2026–2027 Administration</span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                      The "Sihaya" Chapter Era (A.Y. 2026–2027)
                    </h2>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                      <strong>Sihaya</strong> (translating to dawn, light, and revival) is the official chapter governance name designated specifically for the <strong>2026–2027 Executive Term</strong>. While JPAMA represents the overarching student organization of the BS Management Accounting program, each academic term carries a unique governance identity.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("leadership")}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d4b06a] text-[#0A2540] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm flex-shrink-0 self-start md:self-center"
                  >
                    <span>View Sihaya Leadership</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* 1. Dynamic Mission & Core Purposes Block (Article III Mandate - Clean Compact One-Liners) */}
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9E7D38] tracking-wider uppercase">
                      <Scale className="w-3.5 h-3.5" />
                      <span>Article III Constitutional Mandate</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                      JPAMA Core Purposes & Mandate
                    </h2>
                  </div>
                </div>

                {/* Compact One-Liner Interactive Rows */}
                <div className="space-y-3">
                  {config.chapterOverview.purposes.map((purpose) => {
                    const IconComponent = ICON_MAP[purpose.icon as keyof typeof ICON_MAP] || Sparkles;
                    return (
                      <div
                        key={purpose.id}
                        onClick={() => setSelectedPurposeModal(purpose)}
                        className="group cursor-pointer bg-white px-5 py-4 rounded-xl border border-slate-200/90 hover:border-[#C5A059] hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#EAF2FA] group-hover:bg-[#0A2540] flex items-center justify-center flex-shrink-0 transition-colors">
                            <IconComponent className="w-4 h-4 text-[#0A2540] group-hover:text-[#C5A059] transition-colors" />
                          </div>
                          <div className="flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap">
                            <span className="text-[10px] font-bold text-[#9E7D38] tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 flex-shrink-0">
                              {purpose.articleClause}
                            </span>
                            <h3 className="font-serif text-sm sm:text-base font-bold text-[#0A2540] group-hover:text-[#14487A] transition-colors truncate">
                              {purpose.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A2540] group-hover:text-[#C5A059] transition-colors flex-shrink-0">
                          <span className="hidden sm:inline text-[11px]">View Clause</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>


              {/* 2. Chapter Heritage (Dynamic Timeline & Publication Reader) */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9E7D38] tracking-wider uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Chapter Milestones & Gazette Dispatches</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                      Chapter Heritage & Historical Timeline
                    </h2>
                  </div>
                </div>

                {/* Dynamic Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {config.chapterOverview.heritage.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenHeritagePublication(item)}
                      className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C5A059] tracking-tight">
                            {item.year}
                          </span>
                          {item.category && (
                            <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                              {item.category}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-bold text-[#0A2540] group-hover:text-[#14487A] transition-colors leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-slate-600 text-sm leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#0A2540] font-semibold group-hover:text-[#C5A059] transition-colors">
                        <span className="flex items-center gap-1.5">
                          <Newspaper className="w-3.5 h-3.5" />
                          <span>Read Full Gazette Spread</span>
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Distinctions & Honors (Achievements 3-Column Grid) */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9E7D38] tracking-wider uppercase">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Distinctions & Honors</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                      Institutional Awards & Honors
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Scholastic victories and civic leadership citations garnered by our chapter.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {config.chapterOverview.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#C5A059] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {ach.year}
                          </span>
                          {ach.highlightTag && (
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              {ach.highlightTag}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#0A2540] leading-snug">
                          {ach.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {ach.description}
                        </p>
                      </div>

                      <div className="text-[11px] font-semibold text-[#9E7D38] pt-2 border-t border-slate-100 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{ach.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: EXECUTIVE COUNCIL & FACULTY
             ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "leadership" && (
            <motion.div
              key="tab-leadership"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-14"
            >
              {/* Faculty Leadership Section */}
              <section className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#9E7D38] tracking-wider uppercase">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Collegiate Stewardship</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                    SABH Faculty Leadership & Advisers
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {facultyMembers.map((fac) => (
                    <div
                      key={fac.id}
                      onClick={() =>
                        setSelectedLeaderModal({
                          name: fac.name,
                          role: fac.role,
                          badge: fac.badge,
                          avatar: fac.avatar,
                          affiliation: fac.affiliation,
                          bioOrQuote: fac.bio,
                          isFaculty: true,
                        })
                      }
                      className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 hover:border-[#C5A059] hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="space-y-3 text-center">
                        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-[#C5A059] transition-colors shadow-sm">
                          <img
                            src={fac.avatar}
                            alt={fac.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#0A2540] leading-snug group-hover:text-[#14487A] transition-colors">
                            {fac.name}
                          </h4>
                          <p className="text-xs font-bold text-[#9E7D38] mt-0.5">
                            {fac.role}
                          </p>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-medium">
                            {fac.badge}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 italic px-2 line-clamp-3">
                          "{fac.bio}"
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-[#0A2540] font-semibold text-center flex items-center justify-center gap-1 group-hover:text-[#C5A059] transition-colors">
                        <span>View Stewardship Profile</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Executive Council Filter & Grid */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9E7D38] tracking-wider uppercase">
                      <Users className="w-3.5 h-3.5" />
                      <span>Article VII Executive Administration</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                      Elected Executive Council
                    </h2>
                  </div>

                  {/* Filter Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {committees.map((comm) => (
                      <button
                        key={comm}
                        onClick={() => setSelectedCommittee(comm)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedCommittee === comm
                            ? "bg-[#0A2540] text-white shadow-xs font-semibold"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {comm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Officers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredOfficers.map((officer, idx) => (
                    <div
                      key={officer.name || idx}
                      onClick={() =>
                        setSelectedLeaderModal({
                          name: officer.name,
                          role: officer.role,
                          badge: officer.committee || "Executive Council",
                          avatar:
                            officer.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                          affiliation: `${officer.term || "A.Y. 2026–2027"} • ${officer.yearProgram || "BSMA"}`,
                          bioOrQuote: officer.quote || "Dedicated to elevating the JPAMA student body.",
                          isFaculty: false,
                        })
                      }
                      className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-[#C5A059] hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="space-y-3 text-center">
                        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-[#C5A059] transition-colors shadow-sm">
                          <img
                            src={
                              officer.avatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                            }
                            alt={officer.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#0A2540] leading-snug group-hover:text-[#14487A] transition-colors">
                            {officer.name}
                          </h4>
                          <p className="text-xs font-bold text-[#9E7D38] mt-0.5">
                            {officer.role}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-medium">
                            {officer.committee || "Executive Council"}
                          </span>
                        </div>

                        {officer.quote && (
                          <p className="text-xs text-slate-500 italic px-2 line-clamp-3">
                            "{officer.quote}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
                        {officer.term || "A.Y. 2026–2027"} • {officer.yearProgram || "BSMA"}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: CONSTITUTION & BY-LAWS (The 11 Articles Interactive Viewer)
             ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "constitution" && (
            <motion.div
              key="tab-constitution"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Header with Search and Full Gazette Button */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Promulgated Chapter Constitution</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      The 11 Articles of the JPAMA By-Laws
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Explore the foundational governance articles, or launch the formal <strong className="text-[#0A2540]">Gazette Edition</strong> with table of contents and print capabilities.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setGazetteFocusArticleId("all");
                      setIsFullGazetteOpen(true);
                    }}
                    className="px-5 py-3 rounded-xl bg-[#0A2540] hover:bg-[#14487A] text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all flex-shrink-0"
                  >
                    <Newspaper className="w-4 h-4 text-[#C5A059]" />
                    <span>Open Full Gazette Edition</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xl">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search any article title, clause, or governance term..."
                    value={bylawSearch}
                    onChange={(e) => setBylawSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-colors"
                  />
                  {bylawSearch && (
                    <button
                      onClick={() => setBylawSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 11 Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBylaws.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => handleOpenArticleDetail(article)}
                    className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-[#C5A059] px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60">
                          {article.articleNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {article.sections.length} Section{article.sections.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#0A2540] group-hover:text-[#14487A] transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0A2540] group-hover:text-[#C5A059] transition-colors">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Verbatim Clauses</span>
                      </span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              DYNAMIC CUSTOM TABS (Configured in Settings / CMS)
             ══════════════════════════════════════════════════════════════════ */}
          {config.customTabs &&
            config.customTabs.map((customTab) => {
              if (activeTab !== customTab.id || !customTab.enabled) return null;
              return (
                <motion.div
                  key={customTab.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9E7D38] tracking-wider uppercase">
                      <Layers className="w-3.5 h-3.5" />
                      <span>CMS Configured Section</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                      {customTab.title}
                    </h2>
                    {customTab.description && (
                      <p className="text-sm text-slate-600 mt-1">{customTab.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customTab.contentBoxes.map((box) => (
                      <div
                        key={box.id}
                        className={`bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all ${
                          box.layout === "banner" ? "md:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50/50 via-white to-amber-50/40" : ""
                        }`}
                      >
                        <div className="space-y-2.5">
                          {box.badge && (
                            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 border border-amber-200 inline-block">
                              {box.badge}
                            </span>
                          )}
                          <h3 className="font-serif text-lg font-bold text-[#0A2540]">
                            {box.title}
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {box.text}
                          </p>
                        </div>

                        {box.publicationContent && (
                          <button
                            onClick={() => {
                              setSelectedPublication(box.publicationContent!);
                              setPublicationType("Executive Dispatch");
                              setIsPublicationModalOpen(true);
                            }}
                            className="text-xs font-semibold text-[#0A2540] hover:text-[#C5A059] flex items-center gap-1.5 transition-colors pt-2 border-t border-slate-100"
                          >
                            <Newspaper className="w-3.5 h-3.5" />
                            <span>{box.linkText || "Read Publication Spread"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </main>

      {/* ─── MODALS ─── */}

      {/* 1. Newsletter / Publication Spread Modal */}
      <PublicationModal
        isOpen={isPublicationModalOpen}
        onClose={() => setIsPublicationModalOpen(false)}
        data={selectedPublication}
        publicationType={publicationType}
      />

      {/* 2. Quick Article Verbatim Clauses Modal */}
      <ArticleDetailModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
        onSwitchToGazetteView={handleSwitchToGazette}
      />

      {/* 3. Full 11 Articles Formal Gazette Reader */}
      <FullGazetteReaderModal
        isOpen={isFullGazetteOpen}
        onClose={() => setIsFullGazetteOpen(false)}
        articles={config.bylaws}
        initialArticleId={gazetteFocusArticleId}
      />

      {/* 4. Mini Pop-Up Profile Modal for Faculty & Council Leadership */}
      <AnimatePresence>
        {selectedLeaderModal && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedLeaderModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            >
              {/* Top Banner */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#0A2540] text-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  {selectedLeaderModal.isFaculty ? (
                    <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                  ) : (
                    <Users className="w-4 h-4 text-[#C5A059]" />
                  )}
                  <span className="text-xs font-bold tracking-wider uppercase text-[#E8C97A]">
                    {selectedLeaderModal.isFaculty ? "Collegiate Stewardship Profile" : "Council Officer Profile"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLeaderModal(null)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Details */}
              <div className="p-6 sm:p-7 space-y-4 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#C5A059] shadow-md">
                  <img
                    src={selectedLeaderModal.avatar}
                    alt={selectedLeaderModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 mb-1.5 uppercase tracking-wide">
                    {selectedLeaderModal.badge}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A2540]">
                    {selectedLeaderModal.name}
                  </h3>
                  <p className="text-xs font-bold text-[#9E7D38] mt-0.5">
                    {selectedLeaderModal.role}
                  </p>
                  {selectedLeaderModal.affiliation && (
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {selectedLeaderModal.affiliation}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {selectedLeaderModal.isFaculty ? "Stewardship & Guidance Note" : "Executive Quote"}
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                    "{selectedLeaderModal.bioOrQuote}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLeaderModal(null)}
                  className="w-full py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 5. Pop-Up Modal for Article III Core Purposes (One-Liner Drill-down) */}
        {selectedPurposeModal && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPurposeModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#0A2540] text-white flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#E8C97A] block">
                      Constitutional Mandate
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {selectedPurposeModal.articleClause}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPurposeModal(null)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 mb-2 uppercase tracking-wide">
                    {selectedPurposeModal.articleClause}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A2540] leading-snug">
                    {selectedPurposeModal.title}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border-l-4 border-[#C5A059] border-y border-r border-slate-200/80 space-y-2">
                  <span className="text-[10.5px] font-bold text-[#9E7D38] uppercase tracking-wider block">
                    Verbatim Clause Provision
                  </span>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-serif">
                    "{selectedPurposeModal.description}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-[#0A2540] flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Formally promulgated in Article III (Declaration of Principles, Purposes, and Mandate) of the Official JPAMA Constitution & By-Laws. Governed by the School of Accountancy, Business, and Hospitality (SABH), University of Saint Louis Tuguegarao.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPurposeModal(null)}
                    className="w-full sm:w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Close Provision
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPurposeModal(null);
                      setActiveTab("constitution");
                    }}
                    className="w-full sm:w-1/2 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>View All 11 By-Law Articles</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

