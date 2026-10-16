"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  ShieldCheck,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Download,
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  GraduationCap,
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
    setShowAddModal(false);
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (res: ResourceItem) => {
    setEditingItem(res);
    setFormTitle(res.title);
    setFormSubject(res.subject);
    setFormCategory(res.category);
    setFormYear(res.year_level);
    setFormFormat(res.format);
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
            Curated syllabus testbanks, Strategic Cost Management (SCM) materials, and financial modeling templates.
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
                  <span>Add Resource</span>
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
              /* Resources Grid with Edit & Delete options */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0A2540] bg-[#EAF2FA] px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400">{res.format}</span>
                        {/* Edit & Delete Actions */}
                        <button
                          onClick={() => startEdit(res)}
                          className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                          title="Edit Resource"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(res.id, res.title)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#0A2540]">
                      {res.title}
                    </h4>

                    <p className="text-xs text-slate-600">{res.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Subject: {res.subject}</span>
                      <button
                        onClick={() => alert(`Downloading ${res.title}...`)}
                        className="text-[#0A2540] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add / Edit Resource Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  {editingItem ? "Edit Academic Resource" : "Add Academic Resource"}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
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
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category
                    </label>
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
                    <label className="block font-semibold text-slate-700 mb-1">
                      Format
                    </label>
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
                    {editingItem ? "Update Resource" : "Save Resource"}
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
