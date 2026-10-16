"use client";

import React, { useState, useEffect } from "react";
import { X, Save, GraduationCap, Plus, Trash2 } from "lucide-react";
import { AboutContent, FacultyAdviser } from "@/lib/siteContent";

interface FacultyAdvisersModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyAdviser[];
  onSave: (updated: FacultyAdviser[]) => void;
}

const EMPTY_ADVISER: FacultyAdviser = {
  name: "",
  role: "Faculty Adviser",
  title: "",
  subjects_handled: "",
  avatar: "",
};

export default function FacultyAdvisersModal({
  isOpen,
  onClose,
  faculty,
  onSave,
}: FacultyAdvisersModalProps) {
  const [advisers, setAdvisers] = useState<FacultyAdviser[]>(faculty || []);

  useEffect(() => {
    setAdvisers(faculty || []);
  }, [faculty]);

  if (!isOpen) return null;

  const handleChange = (idx: number, field: keyof FacultyAdviser, value: string) => {
    setAdvisers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };

  const handleAdd = () => {
    setAdvisers((prev) => [...prev, { ...EMPTY_ADVISER }]);
  };

  const handleRemove = (idx: number) => {
    if (advisers.length <= 1) {
      alert("At least one faculty adviser must remain.");
      return;
    }
    if (!confirm(`Remove "${advisers[idx].name || "this adviser"}"?`)) return;
    setAdvisers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(advisers);
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
                Faculty Advisers Editor
              </h3>
              <p className="text-xs text-slate-500">
                Add, edit, or remove any number of faculty advisers. Changes are saved to the About page.
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {advisers.map((adviser, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0A2540]">
                    Adviser #{idx + 1}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                  title="Remove this adviser"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name & Credentials *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Maria C. Fontanilla, CPA, CMA"
                    value={adviser.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Role Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter Adviser / Department Head / Dean"
                    value={adviser.role}
                    onChange={(e) => handleChange(idx, "role", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Academic Designation / Official Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty Adviser, JPAMA USLT Chapter"
                  value={adviser.title}
                  onChange={(e) => handleChange(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Subjects Handled
                    <span className="font-normal text-slate-400 ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cost Accounting, MAS, Strategic Cost Mgt"
                    value={adviser.subjects_handled || ""}
                    onChange={(e) => handleChange(idx, "subjects_handled", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Photo URL
                    <span className="font-normal text-slate-400 ml-1">(optional, shows initials if empty)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or leave blank for initials"
                    value={adviser.avatar || ""}
                    onChange={(e) => handleChange(idx, "avatar", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Adviser */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-[#C5A059] rounded-xl text-xs font-semibold text-slate-500 hover:text-[#C5A059] transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another Faculty Adviser
          </button>

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
              <span>Save Faculty Advisers</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
