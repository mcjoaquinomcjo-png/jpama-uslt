"use client";

import React, { useState } from "react";
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Check,
  Compass,
  Award,
  BookOpen,
  Calendar,
  Mail,
  MapPin,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";
import { OverviewContent, DEFAULT_OVERVIEW_CONTENT } from "@/lib/siteContent";

interface OverviewContentEditorProps {
  content: OverviewContent;
  onChange: (updated: OverviewContent) => void;
  activeSectionId: string | null;
  onClose: () => void;
  onSave: () => void;
  isSaved: boolean;
  onReset: () => void;
}

export default function OverviewContentEditor({
  content,
  onChange,
  activeSectionId,
  onClose,
  onSave,
  isSaved,
  onReset,
}: OverviewContentEditorProps) {
  const [selectedTab, setSelectedTab] = useState<string>(activeSectionId || "hero");

  const updateHero = (field: keyof OverviewContent["hero"], value: string) => {
    onChange({
      ...content,
      hero: {
        ...content.hero,
        [field]: value,
      },
    });
  };

  const updatePillarsMeta = (field: "section_eyebrow" | "section_title" | "section_desc", value: string) => {
    onChange({
      ...content,
      pillars: {
        ...content.pillars,
        [field]: value,
      },
    });
  };

  const updatePillarItem = (index: number, field: "title" | "desc" | "tag", value: string) => {
    const items = [...content.pillars.items];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...content, pillars: { ...content.pillars, items } });
  };

  const addPillarItem = () => {
    const items = [...content.pillars.items, { title: "New Pillar", desc: "Describe this academic focus area.", tag: "Focus Area" }];
    onChange({ ...content, pillars: { ...content.pillars, items } });
  };

  const removePillarItem = (index: number) => {
    if (content.pillars.items.length <= 1) return;
    const items = content.pillars.items.filter((_, i) => i !== index);
    onChange({ ...content, pillars: { ...content.pillars, items } });
  };

  const updateEvents = (field: keyof OverviewContent["events"], value: string) => {
    onChange({
      ...content,
      events: {
        ...content.events,
        [field]: value,
      },
    });
  };

  const updateResources = (field: keyof OverviewContent["resources"], value: any) => {
    onChange({
      ...content,
      resources: {
        ...content.resources,
        [field]: value,
      },
    });
  };

  const updateLeadership = (field: "section_eyebrow" | "section_title" | "section_desc" | "btn_text", value: string) => {
    onChange({
      ...content,
      leadership: {
        section_eyebrow: content.leadership?.section_eyebrow || "EXECUTIVE STEWARDSHIP",
        section_title: content.leadership?.section_title || "Chapter Council & Faculty Advisers",
        section_desc: content.leadership?.section_desc || "Dedicated Louisian leaders driving academic excellence and professional distinction.",
        btn_text: content.leadership?.btn_text || "Meet the Leaders",
        [field]: value,
      },
    });
  };

  const updateContact = (field: keyof OverviewContent["contact"], value: string) => {
    onChange({
      ...content,
      contact: {
        ...content.contact,
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Banner & Stats" },
    { id: "pillars", label: "BSMA Pillars" },
    { id: "events", label: "Events Spotlight" },
    { id: "resources", label: "Resources Banner" },
    { id: "leadership", label: "Leadership Spotlight" },
    { id: "contact", label: "Contact & Office" },
    // Custom sections added from Section Manager
    ...Object.entries(content.custom_sections || {}).map(([id, sec]) => ({
      id,
      label: sec.label || id,
    })),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-serif font-bold text-base text-[#0A2540]">
              Overview Section Content Editor
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize every headline, stat counter, and description rendered on the public homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md flex items-center gap-1 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Live!</span>
            </span>
          )}
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Content</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            title="Close editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-5 pt-3 border-b border-slate-200 flex gap-2 overflow-x-auto bg-slate-50/50 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              selectedTab === tab.id
                ? "border-[#0A2540] text-[#0A2540] bg-white font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor Body */}
      <div className="p-6 space-y-5">
        {/* TAB 1: HERO & STATS */}
        {selectedTab === "hero" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Eyebrow Program Badge
              </label>
              <input
                type="text"
                value={content.hero.badge}
                onChange={(e) => updateHero("badge", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Headline (Prefix)
                </label>
                <input
                  type="text"
                  value={content.hero.title_start}
                  onChange={(e) => updateHero("title_start", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Highlight (Gold Text)
                </label>
                <input
                  type="text"
                  value={content.hero.title_highlight}
                  onChange={(e) => updateHero("title_highlight", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-semibold text-amber-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Welcome & Portal Description
              </label>
              <textarea
                rows={3}
                value={content.hero.description}
                onChange={(e) => updateHero("description", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Tagline
                </label>
                <input
                  type="text"
                  value={content.hero.tagline_dept}
                  onChange={(e) => updateHero("tagline_dept", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Tagline
                </label>
                <input
                  type="text"
                  value={content.hero.tagline_loc}
                  onChange={(e) => updateHero("tagline_loc", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>
            </div>

            {/* Live Counter Stats Configuration */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h4 className="font-semibold text-xs text-[#0A2540] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Homepage Key Metric Counters</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Scholars Metric
                  </label>
                  <input
                    type="text"
                    placeholder="250+ Active Scholars"
                    value={content.hero.stat_scholars || ""}
                    onChange={(e) => updateHero("stat_scholars", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Assemblies Metric
                  </label>
                  <input
                    type="text"
                    placeholder="12+ Annual Assemblies"
                    value={content.hero.stat_convocations || ""}
                    onChange={(e) => updateHero("stat_convocations", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    CMA Passing Metric
                  </label>
                  <input
                    type="text"
                    placeholder="100% CMA Passing Rate"
                    value={content.hero.stat_passers || ""}
                    onChange={(e) => updateHero("stat_passers", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Partner Firms Metric
                  </label>
                  <input
                    type="text"
                    placeholder="8 Top Accounting Firms"
                    value={content.hero.stat_partners || ""}
                    onChange={(e) => updateHero("stat_partners", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h4 className="font-semibold text-xs text-[#0A2540] uppercase tracking-wider">
                Hero Call to Action Buttons
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    placeholder="Explore Convocations"
                    value={content.hero.btn_primary_text || ""}
                    onChange={(e) => updateHero("btn_primary_text", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    placeholder="Access Review Vault"
                    value={content.hero.btn_secondary_text || ""}
                    onChange={(e) => updateHero("btn_secondary_text", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PILLARS */}
        {selectedTab === "pillars" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Eyebrow
                </label>
                <input
                  type="text"
                  value={content.pillars.section_eyebrow}
                  onChange={(e) => updatePillarsMeta("section_eyebrow", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={content.pillars.section_title}
                  onChange={(e) => updatePillarsMeta("section_title", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-serif font-bold text-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={content.pillars.section_desc}
                onChange={(e) => updatePillarsMeta("section_desc", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-[#0A2540] uppercase tracking-wider">
                  Program Pillars ({content.pillars.items.length})
                </h4>
                <button
                  type="button"
                  onClick={addPillarItem}
                  className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  + Add Pillar
                </button>
              </div>

              {content.pillars.items.map((pillar, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A2540]">Pillar #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tag (e.g. Core Academic)"
                        value={pillar.tag}
                        onChange={(e) => updatePillarItem(idx, "tag", e.target.value)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                      />
                      {content.pillars.items.length > 1 && (
                        <button type="button" onClick={() => removePillarItem(idx)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove pillar">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pillar Title</label>
                    <input type="text" value={pillar.title}
                      onChange={(e) => updatePillarItem(idx, "title", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pillar Description</label>
                    <textarea rows={2} value={pillar.desc}
                      onChange={(e) => updatePillarItem(idx, "desc", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVENTS SPOTLIGHT */}
        {selectedTab === "events" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={content.events.section_eyebrow}
                onChange={(e) => updateEvents("section_eyebrow", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Headline
              </label>
              <input
                type="text"
                value={content.events.section_title}
                onChange={(e) => updateEvents("section_title", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-serif font-bold text-[#0A2540]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Description
              </label>
              <input
                type="text"
                placeholder="Stay updated with our official chapter schedule and academic milestones."
                value={content.events.section_desc || ""}
                onChange={(e) => updateEvents("section_desc", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                View Calendar Button Label
              </label>
              <input
                type="text"
                placeholder="View Academic Calendar"
                value={content.events.btn_text || ""}
                onChange={(e) => updateEvents("btn_text", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>
            <p className="text-xs text-slate-500 italic">
              Note: Individual assemblies (dates, speakers, venues, agendas) are managed under the &ldquo;Assemblies &amp; Calendar&rdquo; directory.
            </p>
          </div>
        )}

        {/* TAB 4: RESOURCES BANNER */}
        {selectedTab === "resources" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Badge
              </label>
              <input
                type="text"
                value={content.resources.badge}
                onChange={(e) => updateResources("badge", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Headline
              </label>
              <input
                type="text"
                value={content.resources.title}
                onChange={(e) => updateResources("title", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-serif font-bold text-[#0A2540]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={content.resources.description}
                onChange={(e) => updateResources("description", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={content.resources.tags.join(", ")}
                onChange={(e) =>
                  updateResources(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                  )
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Action Button Text
              </label>
              <input
                type="text"
                value={content.resources.btn_text}
                onChange={(e) => updateResources("btn_text", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* TAB 5: LEADERSHIP SPOTLIGHT */}
        {selectedTab === "leadership" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={content.leadership?.section_eyebrow || "EXECUTIVE STEWARDSHIP"}
                onChange={(e) => updateLeadership("section_eyebrow", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Headline
              </label>
              <input
                type="text"
                value={content.leadership?.section_title || "Chapter Council & Faculty Advisers"}
                onChange={(e) => updateLeadership("section_title", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white font-serif font-bold text-[#0A2540]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Description
              </label>
              <textarea
                rows={2}
                value={content.leadership?.section_desc || "Dedicated Louisian leaders driving academic excellence, chapter governance, and professional distinction."}
                onChange={(e) => updateLeadership("section_desc", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={content.leadership?.btn_text || "Meet the Leaders"}
                onChange={(e) => updateLeadership("btn_text", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
              />
            </div>
            <p className="text-xs text-slate-500 italic">
              Note: Council officers and faculty posts are managed under the &ldquo;Leadership &amp; Faculty&rdquo; directory.
            </p>
          </div>
        )}

        {/* TAB 6: CONTACT & OFFICE */}
        {selectedTab === "contact" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office Title
                </label>
                <input
                  type="text"
                  value={content.contact.office_title}
                  onChange={(e) => updateContact("office_title", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office Location
                </label>
                <input
                  type="text"
                  value={content.contact.office_desc}
                  onChange={(e) => updateContact("office_desc", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Title
                </label>
                <input
                  type="text"
                  value={content.contact.email_title}
                  onChange={(e) => updateContact("email_title", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={content.contact.email_desc}
                  onChange={(e) => updateContact("email_desc", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hours Title
                </label>
                <input
                  type="text"
                  value={content.contact.hours_title}
                  onChange={(e) => updateContact("hours_title", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hours Description
                </label>
                <input
                  type="text"
                  value={content.contact.hours_desc}
                  onChange={(e) => updateContact("hours_desc", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM SECTION EDITOR: Slideshow / Text / Cards */}
        {selectedTab.startsWith("custom_") && (() => {
          const secData = content.custom_sections?.[selectedTab] || { type: "custom", label: selectedTab, images: [], title: "", body: "" };
          const updateCustomSec = (patch: Partial<typeof secData>) => {
            onChange({
              ...content,
              custom_sections: {
                ...(content.custom_sections || {}),
                [selectedTab]: { ...secData, ...patch },
              },
            });
          };
          return (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700">
                <strong>{secData.label}</strong> — Type: <code className="bg-blue-100 px-1 rounded">{secData.type}</code>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Heading (Optional)</label>
                <input type="text" value={secData.title || ""} onChange={(e) => updateCustomSec({ title: e.target.value })}
                  placeholder="e.g. CMA Passers 2025"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Body Text (Optional)</label>
                <textarea rows={2} value={secData.body || ""} onChange={(e) => updateCustomSec({ body: e.target.value })}
                  placeholder="Optional short description shown above the content."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:bg-white" />
              </div>

              {(secData.type === "slideshow" || secData.type === "custom") && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                      Slideshow Images ({(secData.images || []).length})
                    </label>
                    <button type="button"
                      onClick={() => updateCustomSec({ images: [...(secData.images || []), ""] })}
                      className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-[11px] font-bold transition-colors">
                      + Add Image URL
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Paste any public image URL or a Google Drive shareable image link. Drive links: open the image, click &ldquo;Share&rdquo; and set to &ldquo;Anyone with the link&rdquo;, then copy the link.
                  </p>
                  {(secData.images || []).map((url, imgIdx) => (
                    <div key={imgIdx} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 w-5 text-right flex-shrink-0">{imgIdx + 1}</span>
                      <input type="url" value={url}
                        onChange={(e) => {
                          const imgs = [...(secData.images || [])];
                          imgs[imgIdx] = e.target.value;
                          updateCustomSec({ images: imgs });
                        }}
                        placeholder="https://... or Google Drive share URL"
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] font-mono" />
                      <button type="button"
                        onClick={() => {
                          const imgs = (secData.images || []).filter((_, i) => i !== imgIdx);
                          updateCustomSec({ images: imgs });
                        }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        ✕
                      </button>
                    </div>
                  ))}
                  {(secData.images || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
                      No images yet. Click &ldquo;+ Add Image URL&rdquo; to add unlimited images to this slideshow.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Footer controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm("Reset overview content to factory defaults?")) {
                onChange(DEFAULT_OVERVIEW_CONTENT);
                onReset();
              }
            }}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Content Defaults</span>
          </button>

          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Overview Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
