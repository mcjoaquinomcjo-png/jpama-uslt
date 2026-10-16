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
  Trophy,
} from "lucide-react";
import { AboutContent, FacultyAdviser, DEFAULT_ABOUT_CONTENT } from "@/lib/siteContent";

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
  const [activeTab, setActiveTab] = useState<
    "header" | "mission_vision" | "milestones" | "faculty" | "achievements" | "constitution"
  >("header");

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

  // Faculty Advisers
  const facultyList = content.faculty_advisers || [];
  const updateFacultyAdviser = (idx: number, field: keyof FacultyAdviser, value: string) => {
    const list = [...facultyList];
    list[idx] = { ...list[idx], [field]: value };
    onChange({ ...content, faculty_advisers: list });
  };

  const addFacultyAdviser = () => {
    onChange({
      ...content,
      faculty_advisers: [
        ...facultyList,
        {
          name: "New Faculty Adviser, CPA",
          role: "Academic Adviser",
          title: "Faculty, Department of Accountancy",
          subjects_handled: "Management Accounting",
          avatar: "",
        },
      ],
    });
  };

  const removeFacultyAdviser = (idx: number) => {
    if (facultyList.length <= 1) return;
    onChange({
      ...content,
      faculty_advisers: facultyList.filter((_, i) => i !== idx),
    });
  };

  // Achievements & Honors
  const achievementsList = content.achievements || [];
  const updateAchievement = (idx: number, field: "year" | "title" | "category" | "description", value: string) => {
    const list = [...achievementsList];
    list[idx] = { ...list[idx], [field]: value };
    onChange({ ...content, achievements: list });
  };

  const addAchievement = () => {
    onChange({
      ...content,
      achievements: [
        ...achievementsList,
        {
          year: new Date().getFullYear().toString(),
          title: "New Chapter Honor / Competition Award",
          category: "Academic Competition",
          description: "Details regarding the championship, recognition, or institutional citation.",
        },
      ],
    });
  };

  const removeAchievement = (idx: number) => {
    onChange({
      ...content,
      achievements: achievementsList.filter((_, i) => i !== idx),
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
    { id: "milestones", label: "Heritage Milestones" },
    { id: "faculty", label: "Faculty Advisers" },
    { id: "achievements", label: "Achievements & Honors" },
    { id: "constitution", label: "Constitution Articles" },
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
            Super User Exclusive: Customize all public sections, faculty credentials, achievements, and constitutional articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onSave}
            className="px-4 py-1.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="px-6 border-b border-slate-200 flex flex-wrap gap-2">
        {navTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-[#0A2540] text-[#0A2540]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form sections */}
      <div className="p-6 pt-2 space-y-6 text-xs">
        {/* 1. BANNER HEADER */}
        {activeTab === "header" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Top Eyebrow Badge
              </label>
              <input
                type="text"
                value={content.header.badge}
                onChange={(e) => updateHeader("badge", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Title (Prefix)
                </label>
                <input
                  type="text"
                  value={content.header.title}
                  onChange={(e) => updateHeader("title", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gold Highlight Title
                </label>
                <input
                  type="text"
                  value={content.header.title_highlight}
                  onChange={(e) => updateHeader("title_highlight", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={content.header.description}
                onChange={(e) => updateHeader("description", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>
        )}

        {/* 2. MISSION & VISION */}
        {activeTab === "mission_vision" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                <h4 className="font-serif font-bold text-sm text-[#0A2540]">Chapter Mission</h4>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={content.mission.eyebrow}
                  onChange={(e) => updateMission("eyebrow", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Mission Headline
                </label>
                <input
                  type="text"
                  value={content.mission.title}
                  onChange={(e) => updateMission("title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={content.mission.desc}
                  onChange={(e) => updateMission("desc", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            {/* Vision */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A2540]" />
                <h4 className="font-serif font-bold text-sm text-[#0A2540]">Chapter Vision</h4>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={content.vision.eyebrow}
                  onChange={(e) => updateVision("eyebrow", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Vision Headline
                </label>
                <input
                  type="text"
                  value={content.vision.title}
                  onChange={(e) => updateVision("title", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={content.vision.desc}
                  onChange={(e) => updateVision("desc", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. MILESTONES & HERITAGE */}
        {activeTab === "milestones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Key milestones displayed in the Chapter Heritage timeline on the About page.
              </p>
              <button
                type="button"
                onClick={addMilestone}
                className="px-3 py-1 bg-[#0A2540] text-white rounded text-xs font-semibold flex items-center gap-1 hover:bg-[#14487A]"
              >
                <Plus className="w-3 h-3" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-4">
              {content.milestones.map((ms, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    disabled={content.milestones.length <= 1}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 disabled:opacity-30 p-1"
                    title="Remove Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={ms.year}
                        onChange={(e) => updateMilestone(idx, "year", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-mono font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Manage all presiding faculty advisers, SABH administrators, and department heads.
              </p>
              <button
                type="button"
                onClick={addFacultyAdviser}
                className="px-3 py-1.5 bg-[#0A2540] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#14487A]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Faculty Adviser</span>
              </button>
            </div>

            <div className="space-y-4">
              {facultyList.map((adv, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-bold text-xs text-[#0A2540] uppercase tracking-wider">
                      Adviser Post #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFacultyAdviser(idx)}
                      disabled={facultyList.length <= 1}
                      className="text-slate-400 hover:text-red-500 disabled:opacity-30 p-1"
                      title="Delete Adviser"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name & Titles / Degrees
                      </label>
                      <input
                        type="text"
                        value={adv.name}
                        onChange={(e) => updateFacultyAdviser(idx, "name", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Role Eyebrow (e.g. Chapter Adviser, SABH Dean)
                      </label>
                      <input
                        type="text"
                        value={adv.role}
                        onChange={(e) => updateFacultyAdviser(idx, "role", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Academic Designation / Institutional Office
                      </label>
                      <input
                        type="text"
                        value={adv.title}
                        onChange={(e) => updateFacultyAdviser(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subjects Handled / Specializations
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Strategic Cost Management, MAS"
                        value={adv.subjects_handled || ""}
                        onChange={(e) => updateFacultyAdviser(idx, "subjects_handled", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Adviser Photo URL (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or leave blank for initials"
                      value={adv.avatar || ""}
                      onChange={(e) => updateFacultyAdviser(idx, "avatar", e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ACHIEVEMENTS & HONORS */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Chapter awards, inter-collegiate championships, and institutional citations shown under About.
              </p>
              <button
                type="button"
                onClick={addAchievement}
                className="px-3 py-1.5 bg-[#0A2540] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#14487A]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-4">
              {achievementsList.map((ach, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeAchievement(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1"
                    title="Remove Honor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={ach.year}
                        onChange={(e) => updateAchievement(idx, "year", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-mono font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Award / Distinction Title
                      </label>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Award Category (e.g. Academic Competition, Professional Certification, University Award)
                    </label>
                    <input
                      type="text"
                      value={ach.category}
                      onChange={(e) => updateAchievement(idx, "category", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Citation Description
                    </label>
                    <textarea
                      rows={2}
                      value={ach.description}
                      onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CONSTITUTION ARTICLES */}
        {activeTab === "constitution" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Edit the key articles summarizing the Constitution & By-Laws of JPAMA USLT Chapter.
            </p>

            <div className="space-y-4">
              {content.constitution_articles.map((art, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Article Number
                      </label>
                      <input
                        type="text"
                        value={art.article}
                        onChange={(e) => updateArticle(idx, "article", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-mono font-bold"
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
                      Article Summary / Clause
                    </label>
                    <textarea
                      rows={3}
                      value={art.content}
                      onChange={(e) => updateArticle(idx, "content", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
