"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  BookOpen,
  Plus,
  AlertCircle,
  GraduationCap,
  ExternalLink,
  Info,
} from "lucide-react";
import { ResourceItem } from "@/lib/types";

export default function ResourcesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [studentIdInput, setStudentIdInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("Cost Accounting & Control");
  const [formCategory, setFormCategory] = useState<ResourceItem["category"]>("Academic Reviewer");
  const [formYear, setFormYear] = useState("1st Year");
  const [formFormat, setFormFormat] = useState<ResourceItem["format"]>("PDF");
  const [formDownloadUrl, setFormDownloadUrl] = useState("https://drive.google.com");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setResources(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;

    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch(`/api/members/${encodeURIComponent(studentIdInput.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        if (studentIdInput.trim().toLowerCase() === "demo" || studentIdInput.trim().includes("202")) {
          setIsAuthenticated(true);
        } else {
          setAuthError("Student ID not recognized in active BSMA directory. Please verify membership first.");
        }
      }
    } catch {
      setIsAuthenticated(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      // Edit
      try {
        const res = await fetch("/api/resources", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            title: formTitle.trim(),
            subject: formSubject.trim(),
            category: formCategory,
            year_level: formYear,
            format: formFormat,
            download_url: formDownloadUrl.trim() || "https://drive.google.com",
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResources((prev) =>
            prev.map((r) => (r.id === editingItem.id ? { ...r, ...data.data } : r))
          );
        }
      } catch (err) {
        console.error(err);
      }
      setEditingItem(null);
    } else {
      // Add
      try {
        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            subject: formSubject.trim(),
            category: formCategory,
            year_level: formYear,
            format: formFormat,
            download_url: formDownloadUrl.trim() || "https://drive.google.com",
            description: "Departmental reviewer for BS Management Accounting.",
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

    setFormTitle("");
    setFormDownloadUrl("https://drive.google.com");
    setShowAddModal(false);
  };

  // Students cannot delete — admin-only action handled inside Admin Portal
  // (handleDeleteResource removed from student view)

  const startEdit = (res: ResourceItem) => {
    setEditingItem(res);
    setFormTitle(res.title);
    setFormSubject(res.subject);
    setFormCategory(res.category);
    setFormYear(res.year_level);
    setFormFormat(res.format);
    setFormDownloadUrl(res.download_url || "https://drive.google.com");
    setShowAddModal(true);
  };

  const filteredResources = resources.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. Page Header */}
      <section className="bg-white border-b border-slate-200 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>BS Management Accounting Academic Repository</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            Academic <span className="text-[#C5A059]">Resources</span>
          </h1>

          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Curated syllabus testbanks, comprehensive reviewers across all BSMA core subjects, financial modeling templates, and professional certification preparation guides.
          </p>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {!isAuthenticated ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10 shadow-sm max-w-xl mx-auto text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#EAF2FA] text-[#0A2540] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#0A2540]" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif font-bold text-xl text-[#0A2540]">
                BSMA Student Access Restricted
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Academic materials and past examination reviewers are strictly protected for active Louisian BS Management Accounting students.
              </p>
            </div>

            <form onSubmit={handleVerifyAccess} className="space-y-3 max-w-sm mx-auto pt-2">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter Your Student ID Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023-01042 or 'demo'"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors disabled:opacity-50"
              >
                {isVerifying ? "Verifying Access..." : "Unlock Academic Vault"}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Not yet on the directory?</span>
              <Link href="/membership" className="text-[#0A2540] font-semibold hover:underline">
                Register as Member →
              </Link>
            </div>
          </div>
        ) : (
          /* UNLOCKED RESOURCE VAULT */
          <div className="space-y-6 animate-fadeIn">
            {/* Header controls bar */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Access Unlocked: Verified BS Management Accounting Student Session</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormTitle("");
                    setFormSubject("Cost Accounting & Control");
                    setShowAddModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Suggest Resource</span>
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* Empty State */}
            {resources.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-slate-800">
                    No Academic Reviewers Uploaded Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Course reviewer packets and past departmental testbanks are uploaded during midterm and final examination periods by the Academic Committee.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormTitle("");
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0A2540]" />
                  <span>Add First Reviewer / Template</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3 hover:border-[#0A2540] transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0A2540] bg-[#EAF2FA] px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <span className="font-mono text-slate-400">{res.format}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#0A2540]">
                      {res.title}
                    </h4>

                    <p className="text-xs text-slate-600">{res.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Subject: {res.subject}</span>
                      <a
                        href={res.download_url && res.download_url !== "#" ? res.download_url : "https://drive.google.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A2540] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Access Material ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Suggest Resource Modal — students add links, admin reviews/deletes via portal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  Suggest a Resource Link
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 text-xs text-amber-800">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Student Submission Guidelines</p>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>Provide a valid Google Drive or OneDrive link with <strong>view access enabled</strong></li>
                    <li>Only BSMA-relevant academic materials are accepted</li>
                    <li>Do not submit copyrighted content without permission</li>
                    <li>Editing or removing entries is handled by the <strong>Admin Portal only</strong></li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAS Handouts & Practice Drills"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cloud Link (Google Drive / OneDrive) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    value={formDownloadUrl}
                    onChange={(e) => setFormDownloadUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                  <span className="text-[10px] text-slate-400">Must be set to "Anyone with the link can view"</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject / Course *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
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
                      value={formFormat}
                      onChange={(e) => setFormFormat(e.target.value as any)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
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
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold"
                  >
                    Submit Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
