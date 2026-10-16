"use client";

import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  Check,
  Award,
  Users,
  BookOpen,
  FileText,
  Building,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";
import { AboutContent, DEFAULT_ABOUT_CONTENT } from "@/lib/siteContent";

interface AboutPageEditorProps {
  content: AboutContent;
  onChange: (updated: AboutContent) => void;
  onSave: () => void;
  isSaved: boolean;
  onReset: () => void;
}

export default function AboutPageEditor({
  content,
  onChange,
  onSave,
  isSaved,
  onReset,
}: AboutPageEditorProps) {
  const [activeTab, setActiveTab] = useState<"header" | "mission_vision" | "milestones" | "faculty" | "constitution">("header");

  const updateHeader = (field: keyof AboutContent["header"], value: string) => {
    onChange({
      ...content,
      header: { ...content.header, [field]: value },
    });
  };

  const updateMission = (field: keyof AboutContent["mission"], value: string) => {
    onChange({
      ...content,
      mission: { ...content.mission, [field]: value },
    });
  };

  const updateVision = (field: keyof AboutContent["vision"], value: string) => {
    onChange({
      ...content,
      vision: { ...content.vision, [field]: value },
    });
  };

  const updateMilestone = (idx: number, field: "year" | "title" | "desc", value: string) => {
    const list = [...content.milestones];
    list[idx] = { ...list[idx], [field]: value };
    onChange({ ...content, milestones: list });
  };

  const addMilestone = () => {
    onChange({
      ...content,
      milestones: [
        ...content.milestones,
        { year: "2027", title: "New Milestone", desc: "Description of new milestone or chapter era." },
      ],
    });
  };

  const removeMilestone = (idx: number) => {
    if (content.milestones.length <= 1) return;
    onChange({
      ...content,
      milestones: content.milestones.filter((_, i) => i !== idx),
    });
  };

  const updateFaculty = (field: keyof AboutContent["faculty"], value: string) => {
    onChange({
      ...content,
      faculty: { ...content.faculty, [field]: value },
    });
  };

  const updateArticle = (idx: number, field: "article" | "title" | "content", value: string) => {
    const list = [...content.constitution_articles];
    list[idx] = { ...list[idx], [field]: value };
    onChange({ ...content, constitution_articles: list });
  };

  const navTabs = [
    { id: "header", label: "Banner Header" },
    { id: "mission_vision", label: "Mission & Vision" },
    { id: "milestones", label: "Milestones & Heritage" },
    { id: "faculty", label: "Faculty Advisers" },
    { id: "constitution", label: "Constitution & By-Laws" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="font-serif font-bold text-xl text-[#0A2540]">
              About Page — Master Content Editor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Super User privileged controls: edit all banners, statements, faculty leadership, and constitutional articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Live!</span>
            </span>
          )}
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save About Page</span>
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="px-6 border-b border-slate-200 flex gap-2 overflow-x-auto">
        {navTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === t.id
                ? "border-[#0A2540] text-[#0A2540] bg-white font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content body */}
      <div className="p-6 space-y-6">
        {/* 1. BANNER HEADER */}
        {activeTab === "header" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Eyebrow School / Department Badge
              </label>
              <input
                type="text"
                value={content.header.badge}
                onChange={(e) => updateHeader("badge", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Title Prefix
                </label>
                <input
                  type="text"
                  value={content.header.title}
                  onChange={(e) => updateHeader("title", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-serif font-bold text-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title Highlight (Gold Accent)
                </label>
                <input
                  type="text"
                  value={content.header.title_highlight}
                  onChange={(e) => updateHeader("title_highlight", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-serif font-bold text-amber-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                About Introduction Paragraph
              </label>
              <textarea
                rows={3}
                value={content.header.description}
                onChange={(e) => updateHeader("description", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* 2. MISSION & VISION */}
        {activeTab === "mission_vision" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                Mission Section
              </span>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={content.mission.eyebrow}
                  onChange={(e) => updateMission("eyebrow", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission Headline
                </label>
                <input
                  type="text"
                  value={content.mission.title}
                  onChange={(e) => updateMission("title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-serif font-bold text-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={content.mission.desc}
                  onChange={(e) => updateMission("desc", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] leading-relaxed"
                />
              </div>
            </div>

            {/* Vision Card */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                Vision Section
              </span>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={content.vision.eyebrow}
                  onChange={(e) => updateVision("eyebrow", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vision Headline
                </label>
                <input
                  type="text"
                  value={content.vision.title}
                  onChange={(e) => updateVision("title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-serif font-bold text-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={content.vision.desc}
                  onChange={(e) => updateVision("desc", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. CHAPTER HERITAGE MILESTONES */}
        {activeTab === "milestones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Milestones appear on the Chapter Heritage timeline on the About page.
              </p>
              <button
                onClick={addMilestone}
                className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {content.milestones.map((ms, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A2540]">Milestone #{idx + 1}</span>
                    {content.milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={ms.year}
                        onChange={(e) => updateMilestone(idx, "year", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold font-serif"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-semibold text-[#0A2540]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Milestone Description
                    </label>
                    <textarea
                      rows={2}
                      value={ms.desc}
                      onChange={(e) => updateMilestone(idx, "desc", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FACULTY ADVISERS */}
        {activeTab === "faculty" && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500">
              Configure the 3 key faculty posts presiding over the JPAMA USLT Chapter: Chapter Adviser, SABH Dean, and Department Head.
            </p>

            {/* 1. Chapter Adviser */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                <h4 className="font-serif font-bold text-sm text-[#0A2540]">
                  Post 1: Chapter Adviser
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adviser Full Name & Credentials
                  </label>
                  <input
                    type="text"
                    value={content.faculty.adviser_name}
                    onChange={(e) => updateFaculty("adviser_name", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={content.faculty.adviser_role}
                    onChange={(e) => updateFaculty("adviser_role", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Designation / Title
                  </label>
                  <input
                    type="text"
                    value={content.faculty.adviser_title}
                    onChange={(e) => updateFaculty("adviser_title", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adviser Photo URL (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or leave blank for initials"
                    value={content.faculty.adviser_avatar || ""}
                    onChange={(e) => updateFaculty("adviser_avatar", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>
            </div>

            {/* 2. SABH Dean */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14487A]" />
                <h4 className="font-serif font-bold text-sm text-[#0A2540]">
                  Post 2: SABH Dean
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dean Full Name & Credentials
                  </label>
                  <input
                    type="text"
                    value={content.faculty.dean_name}
                    onChange={(e) => updateFaculty("dean_name", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={content.faculty.dean_role}
                    onChange={(e) => updateFaculty("dean_role", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School / Dean Title
                  </label>
                  <input
                    type="text"
                    value={content.faculty.dean_title}
                    onChange={(e) => updateFaculty("dean_title", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dean Photo URL (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or leave blank for initials"
                    value={content.faculty.dean_avatar || ""}
                    onChange={(e) => updateFaculty("dean_avatar", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Department Head */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B3A5C]" />
                <h4 className="font-serif font-bold text-sm text-[#0A2540]">
                  Post 3: Department Head
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Head Full Name & Credentials
                  </label>
                  <input
                    type="text"
                    value={content.faculty.head_name}
                    onChange={(e) => updateFaculty("head_name", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={content.faculty.head_role}
                    onChange={(e) => updateFaculty("head_role", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Designation
                  </label>
                  <input
                    type="text"
                    value={content.faculty.head_title}
                    onChange={(e) => updateFaculty("head_title", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photo URL (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or leave blank for initials"
                    value={content.faculty.head_avatar || ""}
                    onChange={(e) => updateFaculty("head_avatar", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONSTITUTION ARTICLES */}
        {activeTab === "constitution" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Edit the key articles summarizing the Constitution & By-Laws of JPAMA USLT Chapter.
            </p>

            <div className="space-y-4">
              {content.constitution_articles.map((art, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Article Designator
                      </label>
                      <input
                        type="text"
                        value={art.article}
                        onChange={(e) => updateArticle(idx, "article", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Article Title
                      </label>
                      <input
                        type="text"
                        value={art.title}
                        onChange={(e) => updateArticle(idx, "title", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-semibold text-[#0A2540]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Summary Content
                    </label>
                    <textarea
                      rows={2}
                      value={art.content}
                      onChange={(e) => updateArticle(idx, "content", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save footer */}
        <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm("Reset About page content to defaults?")) {
                onChange(DEFAULT_ABOUT_CONTENT);
                onReset();
              }
            }}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All About Page Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
