"use client";

import React, { useState, useEffect } from "react";
import { X, Save, GraduationCap, Check } from "lucide-react";
import { AboutContent } from "@/lib/siteContent";

interface FacultyAdvisersModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: AboutContent["faculty"];
  onSave: (updated: AboutContent["faculty"]) => void;
}

export default function FacultyAdvisersModal({
  isOpen,
  onClose,
  faculty,
  onSave,
}: FacultyAdvisersModalProps) {
  const [formData, setFormData] = useState<AboutContent["faculty"]>(faculty);

  useEffect(() => {
    setFormData(faculty);
  }, [faculty]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AboutContent["faculty"], value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0A2540] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#0A2540]">
                Edit Faculty Advisers Leadership
              </h3>
              <p className="text-xs text-slate-500">
                Update names, academic designations, and photos for the 3 faculty posts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* 1. Chapter Adviser */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0A2540]">
                1. Chapter Adviser
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Name & Credentials
                </label>
                <input
                  type="text"
                  required
                  value={formData.adviser_name}
                  onChange={(e) => handleChange("adviser_name", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Academic Designation / Role
                </label>
                <input
                  type="text"
                  required
                  value={formData.adviser_title}
                  onChange={(e) => handleChange("adviser_title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Photo URL (optional)
              </label>
              <input
                type="text"
                placeholder="https://... or leave empty to show initials"
                value={formData.adviser_avatar || ""}
                onChange={(e) => handleChange("adviser_avatar", e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>

          {/* 2. SABH Dean */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14487A]" />
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0A2540]">
                2. SABH Dean
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Dean Name & Credentials
                </label>
                <input
                  type="text"
                  required
                  value={formData.dean_name}
                  onChange={(e) => handleChange("dean_name", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  School Designation
                </label>
                <input
                  type="text"
                  required
                  value={formData.dean_title}
                  onChange={(e) => handleChange("dean_title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Photo URL (optional)
              </label>
              <input
                type="text"
                placeholder="https://... or leave empty to show initials"
                value={formData.dean_avatar || ""}
                onChange={(e) => handleChange("dean_avatar", e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>

          {/* 3. Department Head */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B3A5C]" />
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0A2540]">
                3. Department Head
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Head Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.head_name}
                  onChange={(e) => handleChange("head_name", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department Designation
                </label>
                <input
                  type="text"
                  required
                  value={formData.head_title}
                  onChange={(e) => handleChange("head_title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Photo URL (optional)
              </label>
              <input
                type="text"
                placeholder="https://... or leave empty to show initials"
                value={formData.head_avatar || ""}
                onChange={(e) => handleChange("head_avatar", e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Faculty Advisers</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
