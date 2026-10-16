"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  Check,
  BookOpen,
  Award,
  Search,
  Upload,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Member, YearLevel } from "@/lib/types";

export default function MembershipPage() {
  const [studentNumber, setStudentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [yearLevel, setYearLevel] = useState<YearLevel>("1st Year");
  const [birthdate, setBirthdate] = useState("");
  const [residence, setResidence] = useState("");

  const [registering, setRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState<Member | null>(null);
  const [regError, setRegError] = useState("");

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<Member | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegError("");
    setRegSuccess(null);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_number: studentNumber.trim(),
          full_name: fullName.trim(),
          email: email.trim(),
          year_level: yearLevel,
          program: "BSMA",
          birthdate: birthdate.trim() || undefined,
          residence: residence.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegSuccess(data.data);
        setStudentNumber("");
        setFullName("");
        setEmail("");
        setBirthdate("");
        setResidence("");
      } else {
        setRegError(data.error || "Failed to submit membership application.");
      }
    } catch (err) {
      setRegError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
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
        setLookupError(data.error || "Student record not found in the BSMA directory.");
      }
    } catch (err) {
      setLookupError("Failed to query membership records. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>Exclusively for BS Management Accounting (BSMA)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            Membership & <span className="text-[#C5A059]">Registration</span>
          </h1>

          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Register your annual membership or check your standing in the official USLT BSMA Student Directory.
          </p>
        </div>
      </section>

      {/* 2. Compact 2-Column Section */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Compact Registration Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-xl text-[#0A2540]">
                Apply for Chapter Membership
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                For current BS Management Accounting students (A.Y. 2026–2027)
              </p>
            </div>

            {regSuccess ? (
              <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3 animate-fadeIn text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Registration Submitted Successfully!</span>
                </div>
                <p>
                  Welcome to JPAMA USLT, <strong>{regSuccess.full_name}</strong>! Your application status is currently:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <StatusBadge status={regSuccess.status} />
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {regSuccess.student_number}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Our Secretariat will verify your enrolment record. Once verified, your status will update to Active.
                </p>
                <button
                  onClick={() => setRegSuccess(null)}
                  className="px-4 py-2 bg-[#0A2540] text-white rounded text-xs font-semibold"
                >
                  Register Another Student
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2024-00142"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="First Name, M.I., Last Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      USLT Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@uslt.edu.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Year Level *
                    </label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value as YearLevel)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    >
                      <option value="1st Year">1st Year BSMA</option>
                      <option value="2nd Year">2nd Year BSMA</option>
                      <option value="3rd Year">3rd Year BSMA</option>
                      <option value="4th Year">4th Year BSMA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree Program
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Bachelor of Science in Management Accounting (BSMA)"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Place of Birth / City Residence *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tuguegarao City, Cagayan"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {regError && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registering}
                  className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors disabled:opacity-50"
                >
                  {registering ? "Submitting Application..." : "Submit Membership Application"}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Status Lookup & Benefits */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lookup Card */}
            <div id="lookup" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#0A2540]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A2540]">
                    Status Lookup Tool
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Instant directory check by student number
                  </p>
                </div>
              </div>

              <form onSubmit={handleLookup} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Student ID (e.g. 2023-01042)"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                >
                  {isSearching ? "Searching..." : "Check Status"}
                </button>
              </form>

              {lookupResult && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs text-emerald-900 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0A2540]">{lookupResult.full_name}</span>
                    <StatusBadge status={lookupResult.status} size="sm" />
                  </div>
                  <p>Student ID: <span className="font-mono font-semibold">{lookupResult.student_number}</span></p>
                  <p>Year: <span className="font-semibold">{lookupResult.year_level}</span></p>
                  <p>Course: <span className="font-semibold">BS Management Accounting</span></p>
                </div>
              )}

              {lookupError && (
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  {lookupError}
                </div>
              )}
            </div>

            {/* Quick Benefits Compact Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#0A2540] border-b border-slate-100 pb-2">
                Member Privileges
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Access to BSMA Academic Reviewers & Testbanks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>CMA certification track discount and seminars</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Official JPAMA pin donning at Grand Induction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
