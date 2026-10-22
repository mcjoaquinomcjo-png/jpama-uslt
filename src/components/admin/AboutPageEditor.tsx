"use client";

import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  Check,
  Award,
  BookOpen,
  FileText,
  Building,
  GraduationCap,
  Plus,
  Trash2,
  Trophy,
  Scale,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Newspaper,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  JpamaSectionConfig,
  ByLawArticle,
  HeritageItem,
  PurposeItem,
  AchievementItem,
  CustomTabConfig,
  DEFAULT_JPAMA_CONFIG,
  saveStoredJpamaConfig,
  getStoredJpamaConfig,
} from "@/config/jpamaSettings";

interface AboutPageEditorProps {
  onSavedNotify?: () => void;
}

export default function AboutPageEditor({ onSavedNotify }: AboutPageEditorProps) {
  const [config, setConfig] = useState<JpamaSectionConfig>(() => getStoredJpamaConfig());
  const [activeSubTab, setActiveSubTab] = useState<
    "bylaws" | "purposes" | "heritage" | "achievements" | "customTabs"
  >("bylaws");
  const [isSaved, setIsSaved] = useState(false);

  // Selected article for editing in By-Laws
  const [selectedArticleIdx, setSelectedArticleIdx] = useState(0);

  // Selected heritage milestone for newsletter editing
  const [selectedHeritageIdx, setSelectedHeritageIdx] = useState(0);

  // Selected custom tab
  const [selectedCustomTabIdx, setSelectedCustomTabIdx] = useState(0);

  const handleSave = () => {
    saveStoredJpamaConfig(config);
    setIsSaved(true);
    if (onSavedNotify) onSavedNotify();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all About Page, By-Laws, and Heritage content to official default configuration?")) {
      setConfig(DEFAULT_JPAMA_CONFIG);
      saveStoredJpamaConfig(DEFAULT_JPAMA_CONFIG);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // ─── 1. BY-LAWS HANDLERS ───────────────────────────────────────────
  const currentArticle = config.bylaws[selectedArticleIdx] || config.bylaws[0];

  const updateArticle = (field: keyof ByLawArticle, value: any) => {
    const list = [...config.bylaws];
    list[selectedArticleIdx] = { ...list[selectedArticleIdx], [field]: value };
    setConfig({ ...config, bylaws: list });
  };

  const updateSection = (sIdx: number, field: string, value: any) => {
    const list = [...config.bylaws];
    const sections = [...list[selectedArticleIdx].sections];
    sections[sIdx] = { ...sections[sIdx], [field]: value };
    list[selectedArticleIdx] = { ...list[selectedArticleIdx], sections };
    setConfig({ ...config, bylaws: list });
  };

  const addSection = () => {
    const list = [...config.bylaws];
    const sections = [...list[selectedArticleIdx].sections];
    sections.push({
      sectionNumber: `Section ${sections.length + 1}`,
      title: "New Clause Title",
      content: "Verbatim provision or clause text.",
    });
    list[selectedArticleIdx] = { ...list[selectedArticleIdx], sections };
    setConfig({ ...config, bylaws: list });
  };

  const removeSection = (sIdx: number) => {
    if (currentArticle.sections.length <= 1) {
      alert("An article must contain at least one section.");
      return;
    }
    const list = [...config.bylaws];
    const sections = list[selectedArticleIdx].sections.filter((_, i) => i !== sIdx);
    list[selectedArticleIdx] = { ...list[selectedArticleIdx], sections };
    setConfig({ ...config, bylaws: list });
  };

  // ─── 2. PURPOSES HANDLERS (Article III) ────────────────────────────
  const updatePurpose = (idx: number, field: keyof PurposeItem, value: any) => {
    const list = [...config.chapterOverview.purposes];
    list[idx] = { ...list[idx], [field]: value };
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, purposes: list },
    });
  };

  const addPurpose = () => {
    const list = [...config.chapterOverview.purposes];
    list.push({
      id: `p-${Date.now()}`,
      title: "New Core Purpose",
      description: "Purpose description guiding academic or professional development.",
      icon: "Sparkles",
      articleClause: `Article III, Section ${list.length + 1}`,
    });
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, purposes: list },
    });
  };

  const removePurpose = (idx: number) => {
    if (config.chapterOverview.purposes.length <= 1) return;
    const list = config.chapterOverview.purposes.filter((_, i) => i !== idx);
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, purposes: list },
    });
  };

  // ─── 3. HERITAGE & NEWSLETTER HANDLERS ────────────────────────────
  const currentHeritage = config.chapterOverview.heritage[selectedHeritageIdx] || config.chapterOverview.heritage[0];

  const updateHeritage = (field: keyof HeritageItem, value: any) => {
    const list = [...config.chapterOverview.heritage];
    list[selectedHeritageIdx] = { ...list[selectedHeritageIdx], [field]: value };
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, heritage: list },
    });
  };

  const updateHeritagePub = (field: string, value: any) => {
    const list = [...config.chapterOverview.heritage];
    const pub = list[selectedHeritageIdx].publicationContent || {
      headline: list[selectedHeritageIdx].title,
      datePublished: list[selectedHeritageIdx].year,
      author: "Secretariat",
      fullArticleHtml: `<p>${list[selectedHeritageIdx].summary}</p>`,
    };
    list[selectedHeritageIdx] = {
      ...list[selectedHeritageIdx],
      publicationContent: { ...pub, [field]: value },
    };
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, heritage: list },
    });
  };

  const addHeritage = () => {
    const list = [...config.chapterOverview.heritage];
    const newYear = (parseInt(list[list.length - 1]?.year || "2026") + 1).toString();
    list.push({
      id: `h-${Date.now()}`,
      year: newYear,
      title: "New Chapter Milestone",
      summary: "Description of milestone in chapter history.",
      category: "Collegiate Advancement",
      publicationContent: {
        headline: `Commemorating ${newYear}: New Era of Sihaya`,
        issueNumber: `Vol. ${list.length + 1} • Special Bulletin`,
        datePublished: newYear,
        author: "Executive Secretariat",
        pullQuote: "Continuing our commitment to scholastic distinction and ethical governance.",
        fullArticleHtml: "<p>Detail the comprehensive story, historical context, and impact here.</p>",
        tags: ["Milestone", "BSMA"],
      },
    });
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, heritage: list },
    });
    setSelectedHeritageIdx(list.length - 1);
  };

  const removeHeritage = (idx: number) => {
    if (config.chapterOverview.heritage.length <= 1) return;
    const list = config.chapterOverview.heritage.filter((_, i) => i !== idx);
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, heritage: list },
    });
    setSelectedHeritageIdx(Math.max(0, idx - 1));
  };

  // ─── 4. ACHIEVEMENTS HANDLERS ─────────────────────────────────────
  const updateAchievement = (idx: number, field: keyof AchievementItem, value: any) => {
    const list = [...config.chapterOverview.achievements];
    list[idx] = { ...list[idx], [field]: value };
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, achievements: list },
    });
  };

  const addAchievement = () => {
    const list = [...config.chapterOverview.achievements];
    list.push({
      id: `a-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      category: "Academic Competition",
      title: "New Honor or Distinction",
      description: "Description of the award, conferring body, and collegiate significance.",
      highlightTag: "Chapter Citation",
    });
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, achievements: list },
    });
  };

  const removeAchievement = (idx: number) => {
    if (config.chapterOverview.achievements.length <= 1) return;
    const list = config.chapterOverview.achievements.filter((_, i) => i !== idx);
    setConfig({
      ...config,
      chapterOverview: { ...config.chapterOverview, achievements: list },
    });
  };

  // ─── 5. CUSTOM TABS HANDLERS ──────────────────────────────────────
  const currentCustomTab = config.customTabs[selectedCustomTabIdx];

  const updateCustomTab = (field: keyof CustomTabConfig, value: any) => {
    const list = [...config.customTabs];
    list[selectedCustomTabIdx] = { ...list[selectedCustomTabIdx], [field]: value };
    setConfig({ ...config, customTabs: list });
  };

  const addCustomTab = () => {
    const list = [...(config.customTabs || [])];
    list.push({
      id: `tab-${Date.now()}`,
      title: "New Custom Section",
      enabled: true,
      description: "Custom section configured via the CMS portal.",
      contentBoxes: [
        {
          id: `box-1`,
          title: "Sample Information Card",
          text: "Content text detailing directives, resources, or special chapter projects.",
          layout: "card",
          badge: "Special Feature",
        },
      ],
    });
    setConfig({ ...config, customTabs: list });
    setSelectedCustomTabIdx(list.length - 1);
  };

  const removeCustomTab = (idx: number) => {
    const list = config.customTabs.filter((_, i) => i !== idx);
    setConfig({ ...config, customTabs: list });
    setSelectedCustomTabIdx(Math.max(0, idx - 1));
  };

  const addContentBox = () => {
    if (!currentCustomTab) return;
    const list = [...config.customTabs];
    const boxes = [...currentCustomTab.contentBoxes];
    boxes.push({
      id: `box-${Date.now()}`,
      title: "New Content Box",
      text: "Content description.",
      layout: "card",
      badge: "Update",
    });
    list[selectedCustomTabIdx] = { ...currentCustomTab, contentBoxes: boxes };
    setConfig({ ...config, customTabs: list });
  };

  const updateContentBox = (bIdx: number, field: string, value: any) => {
    if (!currentCustomTab) return;
    const list = [...config.customTabs];
    const boxes = [...currentCustomTab.contentBoxes];
    boxes[bIdx] = { ...boxes[bIdx], [field]: value };
    list[selectedCustomTabIdx] = { ...currentCustomTab, contentBoxes: boxes };
    setConfig({ ...config, customTabs: list });
  };

  const removeContentBox = (bIdx: number) => {
    if (!currentCustomTab || currentCustomTab.contentBoxes.length <= 1) return;
    const list = [...config.customTabs];
    const boxes = currentCustomTab.contentBoxes.filter((_, i) => i !== bIdx);
    list[selectedCustomTabIdx] = { ...currentCustomTab, contentBoxes: boxes };
    setConfig({ ...config, customTabs: list });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Dynamic CMS Configuration</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#0A2540]">
            About JPAMA & Constitution CMS Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure the 11 Constitution Articles, Chapter Heritage Milestones with Newsletter Spreads, Article III Mandates, and Custom Tabs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to default constitution and data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#14487A] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? "Saved Successfully!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Main CMS Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("bylaws")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === "bylaws"
              ? "bg-[#0A2540] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Constitution & 11 Articles ({config.bylaws.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("purposes")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === "purposes"
              ? "bg-[#0A2540] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Article III Mandates ({config.chapterOverview.purposes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("heritage")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === "heritage"
              ? "bg-[#0A2540] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Heritage & Newsletters ({config.chapterOverview.heritage.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("achievements")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === "achievements"
              ? "bg-[#0A2540] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Distinctions & Honors ({config.chapterOverview.achievements.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("customTabs")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === "customTabs"
              ? "bg-[#0A2540] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Dynamic Custom Tabs ({config.customTabs?.length || 0})</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SUBTAB 1: CONSTITUTION & BY-LAWS (11 Articles Editor)
         ══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "bylaws" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article Selector List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 max-h-[750px] overflow-y-auto">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Select Article to Edit
            </div>
            {config.bylaws.map((art, idx) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticleIdx(idx)}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                  selectedArticleIdx === idx
                    ? "bg-[#0A2540] text-white shadow-sm font-bold"
                    : "hover:bg-slate-50 text-slate-700 border border-transparent"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className={`text-[10px] font-bold block ${selectedArticleIdx === idx ? "text-[#C5A059]" : "text-[#9E7D38]"}`}>
                    {art.articleNumber}
                  </span>
                  <span className="truncate block font-serif">{art.title}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                  selectedArticleIdx === idx ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {art.sections.length} sec
                </span>
              </button>
            ))}
          </div>

          {/* Article Editor Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  Editing {currentArticle.articleNumber}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  {currentArticle.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={currentArticle.title}
                  onChange={(e) => updateArticle("title", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Executive Summary / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={currentArticle.summary}
                  onChange={(e) => updateArticle("summary", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              {/* Sections List */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#0A2540]">
                    Article Sections & Verbatim Clauses ({currentArticle.sections.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addSection}
                    className="px-3 py-1 bg-[#0A2540] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentArticle.sections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={sec.sectionNumber}
                            onChange={(e) => updateSection(sIdx, "sectionNumber", e.target.value)}
                            className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-[#0A2540]"
                          />
                          <input
                            type="text"
                            placeholder="Section Title (e.g. Scope, Rights, etc.)"
                            value={sec.title || ""}
                            onChange={(e) => updateSection(sIdx, "title", e.target.value)}
                            className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-[#0A2540]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSection(sIdx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Remove section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Verbatim Clause Content
                        </label>
                        <textarea
                          rows={3}
                          value={sec.content}
                          onChange={(e) => updateSection(sIdx, "content", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-[#0A2540]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUBTAB 2: ARTICLE III CORE PURPOSES
         ══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "purposes" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                Article III Core Purposes & Mandate Cards
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rendered as the prominent 2-column core mandate block in the Chapter Overview tab.
              </p>
            </div>
            <button
              type="button"
              onClick={addPurpose}
              className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Add Purpose Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {config.chapterOverview.purposes.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0A2540] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={p.articleClause}
                      onChange={(e) => updatePurpose(idx, "articleClause", e.target.value)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-xs font-bold text-[#9E7D38]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePurpose(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove purpose"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Purpose Title
                  </label>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => updatePurpose(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Description & Mandate
                  </label>
                  <textarea
                    rows={3}
                    value={p.description}
                    onChange={(e) => updatePurpose(idx, "description", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUBTAB 3: HERITAGE & NEWSLETTERS
         ══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "heritage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Milestones Timeline
              </span>
              <button
                type="button"
                onClick={addHeritage}
                className="px-2.5 py-1 bg-[#0A2540] text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-[#C5A059]" />
                <span>Add Year</span>
              </button>
            </div>

            <div className="space-y-2">
              {config.chapterOverview.heritage.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedHeritageIdx(idx)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                    selectedHeritageIdx === idx
                      ? "bg-[#0A2540] text-white shadow-sm font-bold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div>
                    <span className={`font-serif text-base font-extrabold ${
                      selectedHeritageIdx === idx ? "text-[#C5A059]" : "text-[#0A2540]"
                    }`}>
                      {item.year}
                    </span>
                    <span className="block truncate text-[11px] font-medium">{item.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Milestone Details & Newsletter Spread Editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  Timeline Milestone & Gazette Spread
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  {currentHeritage.year}: {currentHeritage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => removeHeritage(selectedHeritageIdx)}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Milestone</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={currentHeritage.year}
                    onChange={(e) => updateHeritage("year", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={currentHeritage.category || ""}
                    onChange={(e) => updateHeritage("category", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Milestone Title</label>
                  <input
                    type="text"
                    value={currentHeritage.title}
                    onChange={(e) => updateHeritage("title", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#0A2540]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Card Summary (Shown on Overview Grid)
                </label>
                <textarea
                  rows={2}
                  value={currentHeritage.summary}
                  onChange={(e) => updateHeritage("summary", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Newsletter / Publication Spread Details */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-[#9E7D38]" />
                  <h4 className="font-bold text-sm text-[#0A2540]">
                    Gazette / Newsletter Spread Layout (Triggered on Click)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Publication Headline
                    </label>
                    <input
                      type="text"
                      value={currentHeritage.publicationContent?.headline || ""}
                      onChange={(e) => updateHeritagePub("headline", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-serif font-bold text-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Author / Editorial Credit
                    </label>
                    <input
                      type="text"
                      value={currentHeritage.publicationContent?.author || ""}
                      onChange={(e) => updateHeritagePub("author", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Editorial Pull Quote
                  </label>
                  <input
                    type="text"
                    value={currentHeritage.publicationContent?.pullQuote || ""}
                    onChange={(e) => updateHeritagePub("pullQuote", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg italic"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Article HTML (Supports drop-caps & multiple paragraphs)
                  </label>
                  <textarea
                    rows={6}
                    value={currentHeritage.publicationContent?.fullArticleHtml || ""}
                    onChange={(e) => updateHeritagePub("fullArticleHtml", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUBTAB 4: DISTINCTIONS & HONORS
         ══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "achievements" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                Institutional Distinctions & Honors
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Awards, regional championships, and collegiate citations displayed on the About page.
              </p>
            </div>
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Add Honor Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {config.chapterOverview.achievements.map((ach, idx) => (
              <div
                key={ach.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ach.year}
                      onChange={(e) => updateAchievement(idx, "year", e.target.value)}
                      className="w-16 px-2 py-0.5 rounded bg-white border border-slate-200 text-xs font-bold text-[#C5A059]"
                    />
                    <input
                      type="text"
                      placeholder="Highlight Tag"
                      value={ach.highlightTag || ""}
                      onChange={(e) => updateAchievement(idx, "highlightTag", e.target.value)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAchievement(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
                  <input
                    type="text"
                    value={ach.category}
                    onChange={(e) => updateAchievement(idx, "category", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={ach.description}
                    onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUBTAB 5: DYNAMIC CUSTOM TABS
         ══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "customTabs" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                Dynamic Custom Tabs Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add extra tabs to the About page (e.g. Special Directives, Chapter Research, Bulletins).
              </p>
            </div>
            <button
              type="button"
              onClick={addCustomTab}
              className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Add Custom Tab</span>
            </button>
          </div>

          {config.customTabs && config.customTabs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tab list */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                  Configured Custom Tabs
                </span>
                {config.customTabs.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedCustomTabIdx(idx)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                      selectedCustomTabIdx === idx
                        ? "bg-[#0A2540] text-white font-bold shadow-sm"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="truncate">{t.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                      {t.enabled ? "Active" : "Disabled"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Custom Tab Editor */}
              {currentCustomTab && (
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-serif font-bold text-lg text-[#0A2540]">
                      Editing: {currentCustomTab.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeCustomTab(selectedCustomTabIdx)}
                      className="px-3 py-1 rounded text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      Remove Tab
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Tab Title</label>
                        <input
                          type="text"
                          value={currentCustomTab.title}
                          onChange={(e) => updateCustomTab("title", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <label className="font-semibold text-slate-700">Display on Public Page:</label>
                        <input
                          type="checkbox"
                          checked={currentCustomTab.enabled}
                          onChange={(e) => updateCustomTab("enabled", e.target.checked)}
                          className="w-4 h-4 accent-[#0A2540]"
                        />
                      </div>
                    </div>

                    {/* Content Boxes */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 text-xs">
                          Content Cards / Boxes ({currentCustomTab.contentBoxes.length})
                        </span>
                        <button
                          type="button"
                          onClick={addContentBox}
                          className="px-3 py-1 bg-[#0A2540] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Add Box</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {currentCustomTab.contentBoxes.map((box, bIdx) => (
                          <div
                            key={box.id}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <input
                                type="text"
                                placeholder="Box Title"
                                value={box.title}
                                onChange={(e) => updateContentBox(bIdx, "title", e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0A2540]"
                              />
                              <select
                                value={box.layout}
                                onChange={(e) => updateContentBox(bIdx, "layout", e.target.value)}
                                className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                              >
                                <option value="card">Standard Card</option>
                                <option value="banner">Wide Banner</option>
                                <option value="newsletter">Newsletter Spread</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => removeContentBox(bIdx)}
                                className="text-slate-400 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <textarea
                              rows={2}
                              placeholder="Text content..."
                              value={box.text}
                              onChange={(e) => updateContentBox(bIdx, "text", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No custom tabs created yet. Click "Add Custom Tab" above to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
