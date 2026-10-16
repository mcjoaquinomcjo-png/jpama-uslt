"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  Award,
  Trophy,
  Building2,
} from "lucide-react";
import { AlumniMember } from "@/lib/types";

const SEED_ALUMNI: AlumniMember[] = [
  {
    id: "alum-01",
    full_name: "Maria Kristina R. Dela Peña",
    year_graduated: "2024",
    batch_label: "Batch 2024 – Sihaya",
    current_company: "SGV & Co. (EY Philippines)",
    current_role: "Junior Associate – Assurance",
    work_description: "Engaged in external audit and financial statement review for top-tier corporate clients across manufacturing and financial services sectors.",
    leadership_experiences: "JPAMA President A.Y. 2023–2024 | Best Chapter President – Region 2 JPAMA Convention",
    badges: ["CMA Passer", "Dean's Lister"],
    photo_url: "",
    linkedin_url: "",
  },
  {
    id: "alum-02",
    full_name: "Jose Mari T. Fontanilla",
    year_graduated: "2024",
    batch_label: "Batch 2024 – Sihaya",
    current_company: "BDO Unibank",
    current_role: "Management Trainee – Finance Group",
    work_description: "Rotational management trainee program covering controllership, treasury, and internal audit functions.",
    leadership_experiences: "JPAMA VP for Finance A.Y. 2023–2024 | USLT SABH Best Student Leader 2024",
    badges: ["Dean's Lister"],
    photo_url: "",
    linkedin_url: "",
  },
  {
    id: "alum-03",
    full_name: "Andrea Nicole V. Paguirigan",
    year_graduated: "2023",
    batch_label: "Batch 2023 – Lumina",
    current_company: "KPMG R.G. Manabat & Co.",
    current_role: "Tax Associate",
    work_description: "Provides tax compliance and advisory services, specializing in corporate income tax and transfer pricing engagements.",
    leadership_experiences: "JPAMA Academic Committee Chair A.Y. 2022–2023 | Region 2 Quiz Bee Champion",
    badges: ["CMA Scholar", "Champion"],
    photo_url: "",
    linkedin_url: "",
  },
  {
    id: "alum-04",
    full_name: "Patrick Leon G. Battad",
    year_graduated: "2023",
    batch_label: "Batch 2023 – Lumina",
    current_company: "CPA Board Exam Preparation",
    current_role: "CPA Reviewee",
    work_description: "Currently preparing for the CPA Licensure Examination.",
    leadership_experiences: "JPAMA Secretary A.Y. 2022–2023",
    badges: ["Dean's Lister", "Board Passer"],
    photo_url: "",
    linkedin_url: "",
  },
  {
    id: "alum-05",
    full_name: "Clarisse Mae O. Baloran",
    year_graduated: "2022",
    batch_label: "Batch 2022 – Aurora",
    current_company: "Philippine Navy Finance Service",
    current_role: "Financial Management Specialist",
    work_description: "Government service officer handling military budget allocation, procurement compliance, and financial reporting under COA standards.",
    leadership_experiences: "JPAMA External Relations Officer A.Y. 2021–2022",
    badges: ["Award / Recognition"],
    photo_url: "",
    linkedin_url: "",
  },
];

// All badges use the same discreet neutral style — no color discrimination
const BADGE_STYLE = "bg-slate-100 text-slate-600 border-slate-200";

export default function AlumniPage() {
  const [alumni] = useState<AlumniMember[]>(SEED_ALUMNI);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedBadge, setSelectedBadge] = useState("All");

  const years = [
    "All",
    ...Array.from(new Set(alumni.map((a) => a.year_graduated))).sort(
      (a, b) => Number(b) - Number(a)
    ),
  ];
  const badgeFilters = [
    "All",
    "CMA Passer",
    "CMA Scholar",
    "Dean's Lister",
    "Award / Recognition",
    "Champion",
    "Board Passer",
  ];

  const filtered = alumni.filter((a) => {
    const matchYear = selectedYear === "All" || a.year_graduated === selectedYear;
    const matchBadge =
      selectedBadge === "All" || (a.badges || []).includes(selectedBadge);
    return matchYear && matchBadge;
  });

  const grouped: Record<string, AlumniMember[]> = {};
  filtered.forEach((a) => {
    if (!grouped[a.year_graduated]) grouped[a.year_graduated] = [];
    grouped[a.year_graduated].push(a);
  });
  const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter((w) => w.length > 1)
      .slice(0, 2)
      .map((w) => w[0])
      .join("");

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>JPAMA USLT Alumni Directory</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            Our <span className="text-[#C5A059]">Alumni</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Proud Louisian Management Accountants carrying the JPAMA spirit into
            their careers, graduate studies, and public service.
          </p>

          {/* Stats Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-8">
            {(() => {
              const cmaCount = alumni.filter((a) => (a.badges || []).includes("CMA Passer")).length;
              const batchCount = Array.from(new Set(alumni.map((a) => a.year_graduated))).length;
              const stats = [
                { icon: Users, value: `${alumni.length}+`, label: "Alumni Recorded" },
                { icon: Trophy, value: `${batchCount}`, label: "Batch Years" },
                ...(cmaCount > 0
                  ? [{ icon: Award, value: `${cmaCount}`, label: "CMA Passers" }]
                  : []),
              ];
              return stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#EAF2FA] flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="text-left">
                    <p className="font-serif font-bold text-xl text-[#0A2540] leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-5 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">
              Batch Year:
            </span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedYear === y
                    ? "bg-[#0A2540] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">
              Achievement:
            </span>
            {badgeFilters.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBadge(b)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors border ${
                  selectedBadge === b
                    ? "bg-[#0A2540] text-white border-[#0A2540]"
                    : "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni by Year Groups */}
      <section className="pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {sortedYears.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-2">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              No alumni match the selected filters.
            </p>
          </div>
        ) : (
          sortedYears.map((year) => (
            <div key={year} className="space-y-4">
              {/* Year Banner */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0A2540] rounded-full">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-xs font-bold text-white tracking-wider">
                    {grouped[year][0]?.batch_label || `Batch ${year}`}
                  </span>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Alumni Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[year].map((alum) => {
                  const isExpanded = expandedId === alum.id;
                  const initials = getInitials(alum.full_name);

                  return (
                    <div
                      key={alum.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-[#C5A059] transition-all shadow-sm overflow-hidden"
                    >
                      {/* Card Header — clickable to expand */}
                      <div
                        className="p-4 flex items-start gap-4 cursor-pointer select-none"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : alum.id)
                        }
                      >
                        {/* 2×2 Passport Photo */}
                        <div className="w-14 h-18 rounded-lg bg-[#0A2540] flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm" style={{ height: "4.5rem" }}>
                          {alum.photo_url ? (
                            <img
                              src={alum.photo_url}
                              alt={alum.full_name}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <span className="font-serif font-bold text-lg text-[#C5A059]">
                              {initials}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif font-bold text-sm text-[#0A2540] leading-snug">
                              {alum.full_name}
                            </h3>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            )}
                          </div>

                          {alum.current_role && alum.current_company && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="font-medium">
                                {alum.current_role}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500 truncate">
                                {alum.current_company}
                              </span>
                            </div>
                          )}

                          {/* Badges */}
                          {(alum.badges || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {(alum.badges || []).map((badge) => (
                                <span
                                  key={badge}
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${BADGE_STYLE}`}
                                >
                                  · {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Detail Panel */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3 bg-slate-50">
                          {alum.work_description && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#C5A059] tracking-wider">
                                <Briefcase className="w-3 h-3" /> Work &amp;
                                Career
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {alum.work_description}
                              </p>
                            </div>
                          )}

                          {alum.leadership_experiences && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#C5A059] tracking-wider">
                                <Star className="w-3 h-3" /> Leadership &amp;
                                Achievements
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {alum.leadership_experiences}
                              </p>
                            </div>
                          )}

                          {alum.linkedin_url && (
                            <a
                              href={alum.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A2540] hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" /> LinkedIn
                              Profile
                            </a>
                          )}

                          <p className="text-[10px] text-slate-400 italic">
                            To update your profile, contact the JPAMA USLT
                            secretariat or use the{" "}
                            <Link
                              href="/admin"
                              className="text-[#0A2540] font-semibold hover:underline"
                            >
                              Admin Portal
                            </Link>
                            .
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Footer Notice */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-500">
          <GraduationCap className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
          <p>
            Alumni profiles are managed by the secretariat via the{" "}
            <Link
              href="/admin"
              className="text-[#0A2540] font-semibold hover:underline"
            >
              Admin Portal
            </Link>
            . Graduates may submit information to be featured in this directory.
          </p>
        </div>
      </section>
    </div>
  );
}
