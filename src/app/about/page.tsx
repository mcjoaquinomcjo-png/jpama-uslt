"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  BookOpen,
  FileText,
  Download,
  ShieldCheck,
  Building,
  GraduationCap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { EXECUTIVE_BOARD } from "@/lib/store";
import { OfficerItem } from "@/lib/types";
import { DEFAULT_ABOUT_CONTENT, AboutContent } from "@/lib/siteContent";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"history" | "officers" | "constitution">("history");
  const [selectedCommittee, setSelectedCommittee] = useState<string>("All");
  const [showConstitutionModal, setShowConstitutionModal] = useState<boolean>(false);
  const [officersList, setOfficersList] = useState<any[]>(EXECUTIVE_BOARD);
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);

  useEffect(() => {
    // Load leadership officers
    fetch("/api/leadership")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setOfficersList(data.data);
        }
      })
      .catch((err) => console.error("Error loading leadership:", err));

    // Load dynamic about content from super user configuration
    try {
      const savedAbout = localStorage.getItem("jpama_about_content");
      if (savedAbout) {
        const parsed = JSON.parse(savedAbout);
        if (parsed && typeof parsed === "object") {
          setAboutContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const committees = ["All", "Executive Council", "Academic Wing", "Finance & Audit", "Secretariat", "Internal Affairs", "External Relations", "Public Relations"];

  const filteredBoard = selectedCommittee === "All"
    ? officersList.filter((o) => o.category !== "Faculty Adviser")
    : officersList.filter((m) => m.committee === selectedCommittee || (m.category !== "Faculty Adviser" && selectedCommittee === "All"));

  // Helper for initials
  const getInitials = (name: string) => {
    if (!name) return "JP";
    return name
      .replace(/Dr\.|Prof\.|Atty\.|CPA|MBA|PhD|CMA|,/gi, "")
      .trim()
      .split(" ")
      .filter((w) => w.length > 0)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>{aboutContent.header.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            {aboutContent.header.title} <span className="text-[#C5A059]">{aboutContent.header.title_highlight}</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {aboutContent.header.description}
          </p>

          {/* Compact Tab Switcher */}
          <div className="pt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Chapter Overview & History
            </button>
            <button
              onClick={() => setActiveTab("officers")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "officers"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Executive Council & Faculty
            </button>
            <button
              onClick={() => setActiveTab("constitution")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "constitution"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Constitution & By-Laws
            </button>
          </div>
        </div>
      </section>

      {/* 2. TAB CONTENT */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* TAB 1: HISTORY & MISSION */}
        {activeTab === "history" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Mission & Vision Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  {aboutContent.mission.eyebrow}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  {aboutContent.mission.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {aboutContent.mission.desc}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  {aboutContent.vision.eyebrow}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  {aboutContent.vision.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {aboutContent.vision.desc}
                </p>
              </div>
            </div>

            {/* Compact History Milestones */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  Chapter Heritage
                </h3>
                <p className="text-xs text-slate-500">
                  Key milestones of the BS Management Accounting association at USLT
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aboutContent.milestones.map((ms, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xl font-bold font-serif text-[#0A2540]">{ms.year}</div>
                    <h4 className="font-semibold text-sm text-slate-800">{ms.title}</h4>
                    <p className="text-xs text-slate-600">
                      {ms.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICERS & FACULTY */}
        {activeTab === "officers" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Faculty Advisers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Faculty Advisers
                </h3>
                <p className="text-xs text-slate-500">
                  Guiding our BSMA cohorts with academic and ethical leadership
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Chapter Adviser */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 hover:border-[#C5A059] transition-colors">
                  <div className="w-20 h-20 rounded-full bg-[#0A2540] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md overflow-hidden flex-shrink-0">
                    {aboutContent.faculty.adviser_avatar ? (
                      <img
                        src={aboutContent.faculty.adviser_avatar}
                        alt={aboutContent.faculty.adviser_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(aboutContent.faculty.adviser_name)}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                      {aboutContent.faculty.adviser_role}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#0A2540] leading-snug">
                      {aboutContent.faculty.adviser_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {aboutContent.faculty.adviser_title}
                    </p>
                  </div>
                </div>

                {/* SABH Dean */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 hover:border-[#C5A059] transition-colors">
                  <div className="w-20 h-20 rounded-full bg-[#14487A] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md overflow-hidden flex-shrink-0">
                    {aboutContent.faculty.dean_avatar ? (
                      <img
                        src={aboutContent.faculty.dean_avatar}
                        alt={aboutContent.faculty.dean_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(aboutContent.faculty.dean_name)}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                      {aboutContent.faculty.dean_role}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#0A2540] leading-snug">
                      {aboutContent.faculty.dean_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {aboutContent.faculty.dean_title}
                    </p>
                  </div>
                </div>

                {/* Department Head */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 hover:border-[#C5A059] transition-colors">
                  <div className="w-20 h-20 rounded-full bg-[#1B3A5C] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md overflow-hidden flex-shrink-0">
                    {aboutContent.faculty.head_avatar ? (
                      <img
                        src={aboutContent.faculty.head_avatar}
                        alt={aboutContent.faculty.head_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(aboutContent.faculty.head_name)}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                      {aboutContent.faculty.head_role}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#0A2540] leading-snug">
                      {aboutContent.faculty.head_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {aboutContent.faculty.head_title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Council */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                    Executive Council
                  </h3>
                  <p className="text-xs text-slate-500">
                    Student leaders serving the BS Management Accounting body
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {committees.map((com) => (
                    <button
                      key={com}
                      onClick={() => setSelectedCommittee(com)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        selectedCommittee === com
                          ? "bg-[#0A2540] text-white font-semibold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {com}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBoard.map((officer) => {
                  const initials = getInitials(officer.name);
                  return (
                    <div
                      key={officer.id || officer.name}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#C5A059] transition-colors space-y-3"
                    >
                      {/* Photo / Initials Avatar */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#0A2540] flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm overflow-hidden flex-shrink-0">
                          {officer.avatar ? (
                            <img src={officer.avatar} alt={officer.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-semibold text-[#0A2540] bg-[#EAF2FA] px-2 py-0.5 rounded w-fit">
                            {officer.committee || "Executive"}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">BSMA</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#0A2540]">
                          {officer.name}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium">{officer.role}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{officer.yearProgram || officer.term}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONSTITUTION & BY-LAWS */}
        {activeTab === "constitution" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  GOVERNING DOCUMENT
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  Constitution & By-Laws of JPAMA USLT
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Approved by the General Assembly and SABH Student Affairs
                </p>
              </div>

              <button
                onClick={() => setShowConstitutionModal(true)}
                className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Read Full Text</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
              {aboutContent.constitution_articles.map((art, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="font-semibold text-slate-800 text-sm">{art.article}: {art.title}</h4>
                  <p>
                    {art.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MODAL: FULL CONSTITUTION */}
      {showConstitutionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">Official Charter</span>
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">Constitution & By-Laws of JPAMA USLT</h3>
              </div>
              <button
                onClick={() => setShowConstitutionModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-800">
                Preamble: We, the students of the Bachelor of Science in Management Accounting of the University of Saint Louis Tuguegarao, imploring the aid of Divine Providence, do hereby ordain and promulgate this Constitution and By-Laws to foster academic excellence, promote moral leadership, and advance the welfare of the student body.
              </p>

              {aboutContent.constitution_articles.map((art, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-bold text-sm text-[#0A2540]">{art.article}: {art.title}</h4>
                  <p className="text-slate-600">{art.content}</p>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Ratified: Academic Year 2026–2027</span>
                <span>USLT Student Affairs</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowConstitutionModal(false)}
                className="px-5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-semibold rounded-lg"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
