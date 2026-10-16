"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { EXECUTIVE_BOARD, FACULTY_LEADERSHIP } from "@/lib/store";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"history" | "officers" | "constitution">("history");
  const [selectedCommittee, setSelectedCommittee] = useState<string>("All");
  const [showConstitutionModal, setShowConstitutionModal] = useState<boolean>(false);

  const committees = ["All", "Executive Council", "Academic Wing", "Finance & Audit", "Secretariat"];

  const filteredBoard = selectedCommittee === "All"
    ? EXECUTIVE_BOARD
    : EXECUTIVE_BOARD.filter((m) => m.committee === selectedCommittee);

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>USLT School of Accountancy, Business, and Hospitality (SABH)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            About <span className="text-[#C5A059]">JPAMA USLT</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            The recognized student organization for the <strong>Bachelor of Science in Management Accounting (BSMA)</strong> at the University of Saint Louis Tuguegarao. Fostering academic rigor, ethical leadership, and professional excellence.
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
                  OUR MISSION
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Academic Fortitude & Competence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To cultivate competent, values-driven management accountants by providing intensive curricular review circles, CMA certification guidance, and real-world managerial decision workshops.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  OUR VISION
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Exemplary Louisian Leadership
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A premier student association producing ethical, globally certified financial leaders committed to Christian presence, professional integrity, and transformative community service.
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
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xl font-bold font-serif text-[#0A2540]">2014</div>
                  <h4 className="font-semibold text-sm text-slate-800">Chapter Foundation</h4>
                  <p className="text-xs text-slate-600">
                    Established under SABH to represent the specialized needs of Louisian Management Accounting scholars.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xl font-bold font-serif text-[#0A2540]">2020</div>
                  <h4 className="font-semibold text-sm text-slate-800">CMA Track Integration</h4>
                  <p className="text-xs text-slate-600">
                    Direct academic coordination with Institute of Management Accountants (IMA) review programs and mock assessments.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xl font-bold font-serif text-[#0A2540]">2026</div>
                  <h4 className="font-semibold text-sm text-slate-800">Sihaya Era</h4>
                  <p className="text-xs text-slate-600">
                    Inaugurating radiant beginnings through digital student portals, interactive review kits, and expanded student welfare.
                  </p>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                    Chapter Adviser
                  </div>
                  <h4 className="font-semibold text-sm text-[#0A2540]">
                    {FACULTY_LEADERSHIP.adviser}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {FACULTY_LEADERSHIP.adviser_title}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                    SABH Dean
                  </div>
                  <h4 className="font-semibold text-sm text-[#0A2540]">
                    {FACULTY_LEADERSHIP.dean}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {FACULTY_LEADERSHIP.dean_title}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                    Department Head
                  </div>
                  <h4 className="font-semibold text-sm text-[#0A2540]">
                    {FACULTY_LEADERSHIP.department_head}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {FACULTY_LEADERSHIP.department_head_title}
                  </p>
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
                {filteredBoard.map((officer) => (
                  <div
                    key={officer.name}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#0A2540] bg-[#EAF2FA] px-2 py-0.5 rounded">
                        {officer.committee}
                      </span>
                      <span className="text-[10px] text-slate-500">BSMA</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#0A2540]">
                      {officer.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {officer.role}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {officer.yearProgram}
                    </p>
                  </div>
                ))}
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
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-800 text-sm">Article I: Name & Affiliation</h4>
                <p>
                  The organization is officially designated as the Junior Philippine Association of Management Accountants (JPAMA) – USLT Chapter, chartered under SABH.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-800 text-sm">Article II: Membership Eligibility</h4>
                <p>
                  All bona fide students enrolled in the Bachelor of Science in Management Accounting (BSMA) course at the University of Saint Louis Tuguegarao are entitled to membership.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-800 text-sm">Article III: Rights & Privileges</h4>
                <p>
                  Members in good standing enjoy access to academic testbanks, voting in executive elections, participation in convocations, and the official donning of chapter pins.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-800 text-sm">Article IV: Executive Council</h4>
                <p>
                  The executive authority resides in the elected officers, subject to faculty adviser oversight and institutional regulations of USLT.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Constitution Modal */}
        {showConstitutionModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Constitution & By-Laws of JPAMA USLT
                </h3>
                <button
                  onClick={() => setShowConstitutionModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 text-xs text-slate-600 flex-1 pr-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Preamble</h4>
                  <p className="mt-1">
                    We, the Management Accounting students of the University of Saint Louis Tuguegarao, with the aid of Divine Providence, in order to cultivate professional competence, foster integrity, and maintain unity, do ordain and promulgate this Constitution and By-Laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Section 1: Course Exclusivity</h4>
                  <p className="mt-1">
                    This organization exclusively serves and represents students registered under the Bachelor of Science in Management Accounting (BSMA) curriculum.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Section 2: Academic Integrity</h4>
                  <p className="mt-1">
                    All members shall adhere to the Louisian Core Values of Christian Presence, Excellence, and Integrity in all academic reviews and professional pursuits.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Document: BYLAWS-BSMA-USLT.pdf</span>
                <button
                  onClick={() => setShowConstitutionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
