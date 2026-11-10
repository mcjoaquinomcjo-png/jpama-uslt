"use client";

import React, { useState } from "react";
import {
  Trophy,
  Star,
  BookOpen,
  Calendar,
  Lightbulb,
  ShoppingBag,
  GraduationCap,
  Megaphone,
  Sparkles,
  Heart,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Upload,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { ChapterActivity, OverviewContent } from "@/lib/siteContent";
import { resolveImageUrl, extractGoogleDriveId, bulkExtractDriveUrls } from "@/lib/imageUtils";

interface ActivitiesShowcaseEditorProps {
  content: OverviewContent;
  onChange: (updated: OverviewContent) => void;
  onSave: () => void;
}

const AVAILABLE_ICONS = [
  { id: "trophy", label: "Trophy 🏆" },
  { id: "star", label: "Star ⭐" },
  { id: "book", label: "Book 📖" },
  { id: "calendar", label: "Calendar 📅" },
  { id: "lightbulb", label: "Trivia 💡" },
  { id: "snack", label: "Snack 🧺" },
  { id: "cap", label: "Cap 🎓" },
  { id: "megaphone", label: "Dispatch 📢" },
  { id: "sparkles", label: "Sparkles ✨" },
  { id: "heart", label: "Community 🤎" },
];

export default function ActivitiesShowcaseEditor({
  content,
  onChange,
  onSave,
}: ActivitiesShowcaseEditorProps) {
  const [activeActivityIndex, setActiveActivityIndex] = useState<number>(0);
  const [bulkDriveInput, setBulkDriveInput] = useState<string>("");
  const [bulkDriveLoading, setBulkDriveLoading] = useState<boolean>(false);
  const [bulkDriveStatus, setBulkDriveStatus] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  // Compute activities with fallback to legacy custom_sections
  const activities: ChapterActivity[] = React.useMemo(() => {
    if (content.activities_showcase?.activities && content.activities_showcase.activities.length > 0) {
      return content.activities_showcase.activities;
    }
    const legacy: ChapterActivity[] = [];
    Object.entries(content.custom_sections || {}).forEach(([id, sec]) => {
      legacy.push({
        id,
        tab_label: sec.title?.slice(0, 15) || "FMAA Passers",
        icon: "trophy",
        category_badge: "CHAPTER DISTINCTION",
        title: sec.title || "FMAA PASSER 2026",
        subtitle: "ANOTHER PROOF THAT LOUISIAN MAS ARE MEANT TO SHINE. ✨",
        body: sec.body || "",
        images: sec.images || [],
        layout: (sec.layout as any) || "split_text_left",
        imageSize: sec.imageSize || "2x2",
        edgeStyle: sec.edgeStyle || "fade",
        visible: true,
      });
    });

    if (legacy.length > 0) {
      return legacy.slice(0, 10);
    }

    return [];
  }, [content.activities_showcase, content.custom_sections]);

  const updateActivitiesList = (newActivities: ChapterActivity[]) => {
    const limited = newActivities.slice(0, 10);
    const primary = limited[0];

    onChange({
      ...content,
      activities_showcase: {
        ...(content.activities_showcase || {
          enabled: true,
          mode: "tabs",
          section_eyebrow: "CHAPTER SPOTLIGHT & ACTIVITIES",
          section_title: "Highlights, Passers & Student Dispatches",
        }),
        activities: limited,
      },
      // Keep primary custom_section synced for backwards compatibility
      ...(primary
        ? {
            custom_sections: {
              ...(content.custom_sections || {}),
              custom_1793462341735: {
                type: "custom",
                label: primary.tab_label,
                title: primary.title,
                body: primary.body,
                images: primary.images,
                layout: (primary.layout as any) || "split_text_left",
                imageSize: primary.imageSize || "2x2",
                edgeStyle: primary.edgeStyle || "fade",
              },
            },
          }
        : {}),
    });
  };

  const currentActivity: ChapterActivity = activities[activeActivityIndex] || activities[0] || {
    id: "act_1",
    tab_label: "FMAA Passers",
    icon: "trophy",
    category_badge: "CHAPTER DISTINCTION",
    title: "FMAA PASSER 2026",
    subtitle: "ANOTHER PROOF THAT LOUISIAN MAS ARE MEANT TO SHINE. ✨",
    body: "",
    images: [],
    layout: "split_text_left",
    imageSize: "2x2",
    edgeStyle: "fade",
    visible: true,
  };

  const updateCurrentActivity = (patch: Partial<ChapterActivity>) => {
    const updated = activities.map((act, i) =>
      i === activeActivityIndex ? { ...act, ...patch } : act
    );
    updateActivitiesList(updated);
  };

  const handleAddActivity = () => {
    if (activities.length >= 10) {
      alert("You have reached the maximum limit of 10 chapter activities.");
      return;
    }
    const newIndex = activities.length + 1;
    const newAct: ChapterActivity = {
      id: `act_${Date.now()}`,
      tab_label: `Activity ${newIndex}`,
      icon: "star",
      category_badge: "CHAPTER SPOTLIGHT",
      title: `Chapter Activity ${newIndex}`,
      subtitle: "Celebrating our Louisians' milestones and community life. ✨",
      body: "Details of this chapter initiative, academic achievement, or student activity.\n\n#JPAMAUSLT #ProudLouisians",
      images: [],
      layout: "split_text_left",
      imageSize: "16:9",
      edgeStyle: "none",
      visible: true,
    };
    const updated = [...activities, newAct];
    updateActivitiesList(updated);
    setActiveActivityIndex(updated.length - 1);
  };

  const handleDeleteActivity = (idxToDelete: number) => {
    if (activities.length <= 1) {
      alert("You must keep at least 1 activity in the showcase.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${activities[idxToDelete].tab_label}"?`)) {
      const updated = activities.filter((_, i) => i !== idxToDelete);
      updateActivitiesList(updated);
      setActiveActivityIndex(Math.max(0, idxToDelete - 1));
    }
  };

  const handleMoveActivity = (idx: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activities.length) return;
    const updated = [...activities];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateActivitiesList(updated);
    setActiveActivityIndex(targetIdx);
  };

  const handleBulkDriveExtract = async () => {
    if (!bulkDriveInput.trim()) return;
    setBulkDriveLoading(true);
    setBulkDriveStatus(null);
    try {
      const res = await fetch("/api/drive-folder-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: bulkDriveInput }),
      });
      const json = await res.json();
      let extracted = json.success && Array.isArray(json.urls) ? json.urls : [];
      if (extracted.length === 0) {
        extracted = bulkExtractDriveUrls(bulkDriveInput);
      }

      if (extracted.length > 0) {
        const combined = Array.from(new Set([...(currentActivity.images || []), ...extracted]));
        updateCurrentActivity({ images: combined });
        setBulkDriveStatus(`✅ Successfully extracted & added ${extracted.length} photos! (${combined.length} total in gallery)`);
        setBulkDriveInput("");
        setTimeout(() => setShowBulkModal(false), 2000);
      } else {
        setBulkDriveStatus("⚠️ No valid Google Drive files found. Please paste direct sharing links or check permissions.");
      }
    } catch (err: any) {
      const fallback = bulkExtractDriveUrls(bulkDriveInput);
      if (fallback.length > 0) {
        const combined = Array.from(new Set([...(currentActivity.images || []), ...fallback]));
        updateCurrentActivity({ images: combined });
        setBulkDriveStatus(`✅ Extracted ${fallback.length} photos via client parser!`);
        setBulkDriveInput("");
        setTimeout(() => setShowBulkModal(false), 2000);
      } else {
        setBulkDriveStatus(`❌ Failed to parse: ${err.message || "Error"}`);
      }
    } finally {
      setBulkDriveLoading(false);
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        updateCurrentActivity({
          images: [...(currentActivity.images || []), compressed],
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#14487A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#C5A059]" />
            <h4 className="font-serif font-bold text-sm text-amber-200">
              Chapter Activities & Distinction Showcase (Max 10 Activities)
            </h4>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Configure up to 10 activities displayed as royal pill tabs or a horizontal slide deck. Supports Google Drive bulk photo imports.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddActivity}
          disabled={activities.length >= 10}
          className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#d8b467] text-[#0A2540] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Activity ({activities.length}/10)</span>
        </button>
      </div>

      {/* ── 1. ACTIVITIES PILL TABS SELECTOR ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Select Activity to Edit ({activities.length} of 10)
        </label>
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-200">
          {activities.map((act, idx) => {
            const isActive = idx === activeActivityIndex;
            return (
              <div key={act.id || idx} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveActivityIndex(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    isActive
                      ? "bg-[#0A2540] text-amber-300 ring-2 ring-[#C5A059] scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                  }`}
                >
                  <span>{act.tab_label || `Activity ${idx + 1}`}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
                    {(act.images || []).length}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. CURRENT ACTIVITY CONTROLS & REORDER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0A2540]">
            Editing #{activeActivityIndex + 1}: &ldquo;{currentActivity.tab_label}&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={activeActivityIndex === 0}
            onClick={() => handleMoveActivity(activeActivityIndex, "left")}
            className="p-1.5 text-slate-600 hover:text-[#0A2540] bg-white border border-slate-300 rounded-lg text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move tab left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={activeActivityIndex === activities.length - 1}
            onClick={() => handleMoveActivity(activeActivityIndex, "right")}
            className="p-1.5 text-slate-600 hover:text-[#0A2540] bg-white border border-slate-300 rounded-lg text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move tab right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteActivity(activeActivityIndex)}
            className="px-2.5 py-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* ── 3. ACTIVITY FIELDS: TAB LABEL, ICON, BADGE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tab Pill Label (Max 18 chars)
          </label>
          <input
            type="text"
            maxLength={18}
            value={currentActivity.tab_label || ""}
            onChange={(e) => updateCurrentActivity({ tab_label: e.target.value })}
            placeholder="e.g. FMAA Passers"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tab Icon
          </label>
          <select
            value={currentActivity.icon || "trophy"}
            onChange={(e) => updateCurrentActivity({ icon: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
          >
            {AVAILABLE_ICONS.map((ic) => (
              <option key={ic.id} value={ic.id}>
                {ic.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category Eyebrow Badge
          </label>
          <input
            type="text"
            value={currentActivity.category_badge || ""}
            onChange={(e) => updateCurrentActivity({ category_badge: e.target.value })}
            placeholder="e.g. CHAPTER DISTINCTION"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
          />
        </div>
      </div>

      {/* ── 4. HEADLINE & SUBTITLE ── */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Headline / Title
          </label>
          <input
            type="text"
            value={currentActivity.title || ""}
            onChange={(e) => updateCurrentActivity({ title: e.target.value })}
            placeholder="e.g. FMAA PASSER 2026 or THE WEEKLY LEXICON: CASH FLOW"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-serif font-bold text-sm focus:outline-none focus:border-[#0A2540]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Italic Subtitle / Kicker
          </label>
          <input
            type="text"
            value={currentActivity.subtitle || ""}
            onChange={(e) => updateCurrentActivity({ subtitle: e.target.value })}
            placeholder="e.g. ANOTHER PROOF THAT LOUISIAN MAS ARE MEANT TO SHINE. ✨"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-serif italic text-xs focus:outline-none focus:border-[#0A2540]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Story / Body Text</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Press Enter for paragraphs. Include #hashtags at the end.
            </span>
          </label>
          <textarea
            rows={6}
            value={currentActivity.body || ""}
            onChange={(e) => updateCurrentActivity({ body: e.target.value })}
            placeholder="Full story or announcement text... Hashtags like #JPAMAUSLT #ProudLouisians are automatically formatted as chic pills!"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] font-sans"
          />
        </div>
      </div>

      {/* ── 5. PRESENTATION LAYOUT SELECTOR ── */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Presentation Layout Style</span>
          <span className="text-[11px] text-slate-400 font-normal">
            Choose how text & photos are showcased
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            {
              id: "split_text_left",
              label: "📄 Left | Right 🖼️",
              desc: "Text Left, Photos Right (FMAA style)",
            },
            {
              id: "split_text_right",
              label: "🖼️ Left | Right 📄",
              desc: "Photos Left, Text Right",
            },
            {
              id: "royal_banner",
              label: "👑 Royal Banner",
              desc: "Celebratory dark navy & gold backdrop (Mockup 4)",
            },
            {
              id: "infographic",
              label: "💡 Infographic Focus",
              desc: "Centered clean poster (Weekly Lexicon)",
            },
            {
              id: "mosaic",
              label: "🖼️ Photo Mosaic",
              desc: "Facebook 3-4 collage grid (Champorado)",
            },
            {
              id: "stacked_text_top",
              label: "⬆️ Stacked Top",
              desc: "Text Top, Photos Bottom",
            },
          ].map((lay) => (
            <button
              key={lay.id}
              type="button"
              onClick={() => updateCurrentActivity({ layout: lay.id as any })}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                (currentActivity.layout || "split_text_left") === lay.id
                  ? "border-[#0A2540] bg-[#EAF2FA] text-[#0A2540] font-bold ring-2 ring-[#0A2540]/20 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              }`}
            >
              <span className="block text-xs font-bold">{lay.label}</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">{lay.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 6. IMAGE SIZE & EDGE STYLE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            📐 Photo Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { value: "2x2", label: "2×2 Square" },
              { value: "4:3", label: "4:3 Classic" },
              { value: "16:9", label: "16:9 Wide" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateCurrentActivity({ imageSize: value as any })}
                className={`p-2 rounded-lg border text-center transition-all ${
                  (currentActivity.imageSize || "16:9") === value
                    ? "border-[#C5A059] bg-amber-50 text-[#9E7D38] font-bold ring-1 ring-[#C5A059]"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs"
                }`}
              >
                <span className="block text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            🌅 Edge Vignette Overlay
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { value: "none", label: "None (Clean)" },
              { value: "fade", label: "Fade (Vignette)" },
              { value: "fine", label: "Fine (Shadow)" },
              { value: "lined", label: "Lined (Border)" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateCurrentActivity({ edgeStyle: value as any })}
                className={`p-2 rounded-lg border text-center transition-all ${
                  (currentActivity.edgeStyle || "none") === value
                    ? "border-[#0A2540] bg-[#EAF2FA] text-[#0A2540] font-bold ring-1 ring-[#0A2540]"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs"
                }`}
              >
                <span className="block text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. PHOTOS GALLERY & GOOGLE DRIVE BULK IMPORTER ── */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-[#0A2540] uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#C5A059]" />
              <span>Activity Photos ({(currentActivity.images || []).length})</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supports bulk import of Google Drive folders or multiple image links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Google Drive Bulk Importer Trigger */}
            <button
              type="button"
              onClick={() => setShowBulkModal(!showBulkModal)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>⚡ Bulk Import Drive Photos</span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateCurrentActivity({
                  images: [...(currentActivity.images || []), ""],
                })
              }
              className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add 1 Photo URL</span>
            </button>

            <label
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Upload an image directly from your computer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ── BULK GOOGLE DRIVE IMPORTER PANEL ── */}
        {showBulkModal && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-[#C5A059]/40 shadow-inner space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h5 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                  Google Drive Bulk Auto-Extractor
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              Paste a <strong>Google Drive Folder URL</strong> (e.g. <code>https://drive.google.com/drive/folders/...</code>) or paste <strong>multiple Google Drive links</strong> separated by newlines, commas, or spaces (e.g. 23 images at once). The system will automatically extract all file IDs and link them directly to this activity.
            </p>

            <textarea
              rows={4}
              value={bulkDriveInput}
              onChange={(e) => setBulkDriveInput(e.target.value)}
              placeholder="Paste Google Drive folder URL or paste 23+ Drive image URLs here..."
              className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />

            {bulkDriveStatus && (
              <div className="text-xs font-semibold p-2.5 rounded-lg bg-white border border-amber-200 text-[#0A2540]">
                {bulkDriveStatus}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDriveExtract}
                disabled={bulkDriveLoading || !bulkDriveInput.trim()}
                className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {bulkDriveLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Drive Photos...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>🚀 Extract & Import All Photos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── PHOTO ITEMS LIST ── */}
        <div className="space-y-2 mt-2">
          {(currentActivity.images || []).map((url, imgIdx) => {
            const isDrive = extractGoogleDriveId(url);
            return (
              <div
                key={imgIdx}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200"
              >
                <span className="text-[10px] font-mono font-semibold text-slate-400 w-5 text-right flex-shrink-0">
                  {imgIdx + 1}
                </span>

                {/* Thumbnail Preview */}
                <div className="w-12 h-9 rounded-md bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300 flex items-center justify-center">
                  {url ? (
                    <img
                      src={resolveImageUrl(url)}
                      alt={`Preview ${imgIdx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const imgs = [...(currentActivity.images || [])];
                      imgs[imgIdx] = e.target.value;
                      updateCurrentActivity({ images: imgs });
                    }}
                    placeholder="Paste https://... or Google Drive sharing URL"
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] font-mono"
                  />
                  {isDrive && (
                    <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Google Drive detected (High-Res Proxy Enabled)
                    </span>
                  )}
                  {url.startsWith("data:image/") && (
                    <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      ✓ Direct Device Upload
                    </span>
                  )}
                </div>

                {/* Reordering & Delete Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    disabled={imgIdx === 0}
                    onClick={() => {
                      const imgs = [...(currentActivity.images || [])];
                      const temp = imgs[imgIdx];
                      imgs[imgIdx] = imgs[imgIdx - 1];
                      imgs[imgIdx - 1] = temp;
                      updateCurrentActivity({ images: imgs });
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move photo up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={imgIdx === (currentActivity.images || []).length - 1}
                    onClick={() => {
                      const imgs = [...(currentActivity.images || [])];
                      const temp = imgs[imgIdx];
                      imgs[imgIdx] = imgs[imgIdx + 1];
                      imgs[imgIdx + 1] = temp;
                      updateCurrentActivity({ images: imgs });
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move photo down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const imgs = (currentActivity.images || []).filter(
                        (_, idx) => idx !== imgIdx
                      );
                      updateCurrentActivity({ images: imgs });
                    }}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {(currentActivity.images || []).length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
              <p className="text-xs text-slate-500 font-medium">
                No photos added to &ldquo;{currentActivity.tab_label}&rdquo; yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click &ldquo;⚡ Bulk Import Drive Photos&rdquo; to paste your Google Drive folder or photos list.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inline Save Bar for Activities Showcase */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11.5px] text-slate-500">
          💡 Tip: You can switch between activities using the pills above, and reorder them anytime.
        </span>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all flex-shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Activities Showcase</span>
        </button>
      </div>
    </div>
  );
}
