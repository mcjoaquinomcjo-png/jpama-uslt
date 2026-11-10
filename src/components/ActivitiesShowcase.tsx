"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  LayoutGrid,
  Eye,
  Layers,
  ArrowRight,
} from "lucide-react";
import { resolveImageUrl, getDriveFallbackUrls } from "@/lib/imageUtils";
import GoldCyclingBorder from "@/components/GoldCyclingBorder";
import { ChapterActivity } from "@/lib/siteContent";

// ─── Aspect Ratio & Height Map ─────────────────────────────────────────────
type ImageSize = "2x2" | "4:3" | "16:9" | "small" | "medium" | "large";
type EdgeStyle = "fade" | "fine" | "lined" | "none";

const SIZE_CLASS: Record<ImageSize, string> = {
  "2x2":   "aspect-square  max-h-[440px]",
  "4:3":   "aspect-[4/3]   max-h-[500px]",
  "16:9":  "aspect-[16/9]  max-h-[560px]",
  small:   "aspect-[4/3]   max-h-[280px]",
  medium:  "aspect-[16/10] max-h-[420px]",
  large:   "aspect-[21/9]  max-h-[620px]",
};

// ─── Dynamic Icon Resolver ────────────────────────────────────────────────
function renderActivityIcon(iconName?: string, className: string = "w-4 h-4") {
  switch ((iconName || "").toLowerCase()) {
    case "trophy":
      return <Trophy className={className} />;
    case "star":
      return <Star className={className} />;
    case "book":
    case "books":
      return <BookOpen className={className} />;
    case "calendar":
    case "event":
      return <Calendar className={className} />;
    case "lightbulb":
    case "trivia":
      return <Lightbulb className={className} />;
    case "snack":
    case "basket":
    case "food":
      return <ShoppingBag className={className} />;
    case "cap":
    case "academic":
    case "graduation":
      return <GraduationCap className={className} />;
    case "megaphone":
    case "announcement":
      return <Megaphone className={className} />;
    case "heart":
      return <Heart className={className} />;
    case "sparkles":
    default:
      return <Sparkles className={className} />;
  }
}

// ─── Edge Vignette Overlays ───────────────────────────────────────────────
function EdgeOverlay({ style }: { style?: EdgeStyle }) {
  if (!style || style === "none") return null;

  if (style === "fade") {
    return (
      <>
        <div className="absolute inset-y-0 left-0 w-16 z-20 pointer-events-none bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 z-20 pointer-events-none bg-gradient-to-l from-black/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-10 z-20 pointer-events-none bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 z-20 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />
      </>
    );
  }

  if (style === "fine") {
    return (
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
        style={{ boxShadow: "inset 0 0 60px 20px rgba(0,0,0,0.55)" }}
      />
    );
  }

  if (style === "lined") {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl border-[3px] border-white/20" />
    );
  }

  return null;
}

// ─── Formatted Body Text (Auto Paragraphs & Hashtags) ──────────────────────
function FormattedBodyText({
  body,
  align = "left",
  theme = "light",
}: {
  body: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}) {
  if (!body) return null;
  const hashtagRegex = /#[\w-]+/g;
  const hashtags = body.match(hashtagRegex) || [];
  let cleanBody = body;
  if (hashtags.length > 0) cleanBody = body.replace(/(\s*#[\w-]+)+$/g, "").trim();
  const paragraphs = cleanBody.split(/\n+/).map((p) => p.trim()).filter((p) => p.length > 0);

  const textClass = theme === "dark" ? "text-slate-300 font-normal" : "text-slate-600 font-normal";
  const borderClass = theme === "dark" ? "border-white/10" : "border-slate-100";
  const pillClass =
    theme === "dark"
      ? "bg-white/10 text-amber-200 border-white/15"
      : "bg-blue-50 text-[#0A2540] border-blue-200/60";

  return (
    <div className={`space-y-3.5 font-sans ${align === "center" ? "text-center" : "text-left"}`}>
      {paragraphs.map((p, idx) => (
        <p key={idx} className={`text-sm sm:text-[15px] leading-relaxed ${textClass}`}>
          {p}
        </p>
      ))}
      {hashtags.length > 0 && (
        <div
          className={`flex flex-wrap gap-1.5 pt-3 border-t ${borderClass} ${
            align === "center" ? "justify-center" : "justify-start"
          }`}
        >
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-sans text-[11px] font-semibold ${pillClass}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Single Activity Slideshow / Media Player ──────────────────────────────
function ActivitySlideshow({
  images,
  imageSize = "16:9",
  edgeStyle = "none",
  onOpenLightbox,
}: {
  images: string[];
  imageSize?: ImageSize;
  edgeStyle?: EdgeStyle;
  onOpenLightbox: (idx: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState<"slideshow" | "grid">("slideshow");
  const [imageFailures, setImageFailures] = useState<Record<number, number>>({});

  const sizeClass = SIZE_CLASS[imageSize] || SIZE_CLASS["16:9"];

  const getImageSrc = (rawUrl: string, idx: number) => {
    const failCount = imageFailures[idx] || 0;
    const primary = resolveImageUrl(rawUrl);
    if (failCount === 0) return primary;
    const fallbacks = getDriveFallbackUrls(rawUrl);
    if (failCount <= fallbacks.length) return fallbacks[failCount - 1];
    return primary;
  };

  const handleImageError = (idx: number) => {
    setImageFailures((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
  };

  // Reset index when images list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Auto-play slideshow when not hovered and in slideshow mode
  useEffect(() => {
    if (images.length <= 1 || isHovered || viewMode !== "slideshow") return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length, isHovered, viewMode]);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-center text-slate-400 text-xs font-mono">
        No images configured for this activity
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="relative group rounded-2xl overflow-hidden shadow-2xl bg-black select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <GoldCyclingBorder borderRadius={16} duration={6} strokeWidth={1.2} intensity="subtle" showGlints={false} />

        {viewMode === "grid" ? (
          /* Grid View */
          <div className={`w-full overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-950 ${sizeClass}`}>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setViewMode("slideshow");
                }}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group/thumb ${
                  currentIndex === idx
                    ? "border-[#C5A059] ring-2 ring-[#C5A059]/40 scale-100 shadow-md"
                    : "border-white/10 hover:border-white/40 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={getImageSrc(img, idx)}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                  onError={() => handleImageError(idx)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                <span className="absolute bottom-1 right-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white font-bold">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Single / Slideshow View */
          <div className={`relative w-full overflow-hidden bg-slate-950 flex items-center justify-center ${sizeClass}`}>
            <img
              src={getImageSrc(images[currentIndex], currentIndex)}
              alt={`Activity photo ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out cursor-pointer"
              onClick={() => onOpenLightbox(currentIndex)}
              onError={() => handleImageError(currentIndex)}
            />

            <EdgeOverlay style={edgeStyle} />

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-all backdrop-blur-xs opacity-0 group-hover:opacity-100 shadow-lg border border-white/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % images.length);
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-all backdrop-blur-xs opacity-0 group-hover:opacity-100 shadow-lg border border-white/15"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Lightbox Trigger */}
            <button
              type="button"
              onClick={() => onOpenLightbox(currentIndex)}
              className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-black/60 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 border border-white/15 shadow-md"
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Slide Counter Pill */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-3 z-30 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-amber-200 shadow-md">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control bar: Grid View / Slide View toggle */}
      {images.length > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "grid" ? "slideshow" : "grid")}
            className="flex items-center gap-1.5 text-xs text-[#0A2540] hover:text-[#C5A059] font-medium transition-colors cursor-pointer"
          >
            {viewMode === "grid" ? (
              <>
                <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Single View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Grid View ({images.length} Photos)</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-slate-400">Click photo to expand</span>
        </div>
      )}
    </div>
  );
}

// ─── Mosaic Collage Component (Champorado / Multi-Photo Style) ──────────────
function ActivityMosaic({
  images,
  onOpenLightbox,
}: {
  images: string[];
  onOpenLightbox: (idx: number) => void;
}) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div
        onClick={() => onOpenLightbox(0)}
        className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
      >
        <GoldCyclingBorder borderRadius={16} duration={6} strokeWidth={1.2} intensity="subtle" showGlints={false} />
        <img
          src={resolveImageUrl(images[0])}
          alt="Event photo"
          className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <GoldCyclingBorder borderRadius={16} duration={6} strokeWidth={1.2} intensity="subtle" showGlints={false} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1.5 bg-slate-950">
          {/* Big Featured Image */}
          <div
            onClick={() => onOpenLightbox(0)}
            className="relative aspect-square sm:aspect-auto sm:h-full rounded-xl overflow-hidden cursor-pointer group/mosaic"
          >
            <img
              src={resolveImageUrl(images[0])}
              alt="Featured activity photo"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/mosaic:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover/mosaic:bg-transparent transition-colors" />
            <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-white font-bold">
              1 / {images.length}
            </span>
          </div>

          {/* Stacked Side Images */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
            {images.slice(1, 3).map((img, idx) => {
              const actualIdx = idx + 1;
              const isLastWithMore = idx === 1 && images.length > 3;
              return (
                <div
                  key={actualIdx}
                  onClick={() => onOpenLightbox(actualIdx)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/mosaic"
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`Photo ${actualIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/mosaic:scale-105"
                  />
                  {isLastWithMore ? (
                    <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center text-white font-bold">
                      <span className="text-xl">+{images.length - 3}</span>
                      <span className="text-[11px] font-sans font-medium text-amber-200">More Photos</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/10 group-hover/mosaic:bg-transparent transition-colors" />
                  )}
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white font-bold">
                    {actualIdx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

// ─── Main Component: ActivitiesShowcase ────────────────────────────────────
interface ActivitiesShowcaseProps {
  config?: {
    enabled?: boolean;
    mode?: "tabs" | "slider";
    section_eyebrow?: string;
    section_title?: string;
    activities?: ChapterActivity[];
  };
  // Fallback support if legacy custom_sections exist
  legacyCustomSection?: any;
}

export default function ActivitiesShowcase({ config, legacyCustomSection }: ActivitiesShowcaseProps) {
  // Consolidate activities: start from config.activities, fallback to legacy custom section if empty
  const activities: ChapterActivity[] = React.useMemo(() => {
    if (config?.activities && config.activities.length > 0) {
      return config.activities.filter((a) => a.visible !== false);
    }

    if (legacyCustomSection) {
      return [
        {
          id: "legacy_act_1",
          tab_label: legacyCustomSection.title?.slice(0, 15) || "FMAA Passers",
          icon: "trophy",
          category_badge: "CHAPTER DISTINCTION",
          title: legacyCustomSection.title || "FMAA PASSER 2026",
          subtitle: "ANOTHER PROOF THAT LOUISIAN MAS ARE MEANT TO SHINE. ✨",
          body: legacyCustomSection.body || "",
          images: legacyCustomSection.images || [],
          layout: legacyCustomSection.layout || "split_text_left",
          imageSize: legacyCustomSection.imageSize || "2x2",
          edgeStyle: legacyCustomSection.edgeStyle || "fade",
          visible: true,
        },
      ];
    }

    return [];
  }, [config?.activities, legacyCustomSection]);

  const [activeTabId, setActiveTabId] = useState<string>(activities[0]?.id || "");
  const [viewMode, setViewMode] = useState<"tabs" | "slider">(config?.mode || "tabs");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Tabs scroll container ref
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, activities.length]);

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsContainerRef.current) return;
    const offset = direction === "left" ? -240 : 240;
    tabsContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  // If no active tab set, default to first
  useEffect(() => {
    if ((!activeTabId || !activities.some((a) => a.id === activeTabId)) && activities.length > 0) {
      setActiveTabId(activities[0].id);
    }
  }, [activities, activeTabId]);

  if (activities.length === 0) return null;

  const currentActivityIndex = Math.max(
    0,
    activities.findIndex((a) => a.id === activeTabId)
  );
  const activeActivity = activities[currentActivityIndex] || activities[0];

  const layout = activeActivity.layout || "split_text_left";
  const imageSize = activeActivity.imageSize || "16:9";
  const edgeStyle = activeActivity.edgeStyle || "none";
  const images = (activeActivity.images || []).filter(
    (img) => img && typeof img === "string" && img.trim().length > 0
  );

  return (
    <section className="relative w-full py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/90 border-t border-b border-slate-200/80 overflow-hidden">
      {/* Subtle Royal Background Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 right-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-40 left-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Section Eyebrow & Mode Toggle ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{config?.section_eyebrow || "CHAPTER SPOTLIGHT & ACTIVITIES"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0A2540] tracking-tight mt-1">
              {config?.section_title || "Highlights, Passers & Student Dispatches"}
            </h2>
          </div>

          {/* Presentation Switcher: Royal Tabs vs Swipable Deck */}
          {activities.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("tabs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "tabs"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0A2540]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Royal Tabs</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("slider")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "slider"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0A2540]"
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Slide Deck ({currentActivityIndex + 1}/{activities.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 1. ROYAL PILL TAB BAR (Mockup 4 Style) ── */}
        <div className="relative">
          {/* Scroll arrow left */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 p-2 rounded-full bg-[#0A2540] text-amber-300 shadow-xl border border-[#C5A059]/40 hover:scale-110 transition-all"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Scroll arrow right */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 p-2 rounded-full bg-[#0A2540] text-amber-300 shadow-xl border border-[#C5A059]/40 hover:scale-110 transition-all"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Horizontal scrollable tab pills */}
          <div
            ref={tabsContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none py-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {activities.map((act, idx) => {
              const isActive = act.id === activeTabId;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActiveTabId(act.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 cursor-pointer shadow-md ${
                    isActive
                      ? "bg-gradient-to-r from-[#C5A059] via-[#E8D8BA] to-[#9E7D38] text-[#0A2540] font-black scale-105 shadow-[#C5A059]/30 ring-2 ring-[#C5A059] z-10"
                      : "bg-[#0A2540]/90 text-slate-200 border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#143B60] hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-[#0A2540]" : "text-[#C5A059]"}>
                    {renderActivityIcon(act.icon, "w-4 h-4")}
                  </span>
                  <span>{act.tab_label || `Activity ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. ACTIVITY CONTENT PRESENTATION ── */}
        <div className="relative animate-fadeIn">
          {/* Deck Slider Controls (Only in slider mode) */}
          {viewMode === "slider" && activities.length > 1 && (
            <div className="flex items-center justify-between pb-4">
              <button
                type="button"
                onClick={() => {
                  const prevIdx = (currentActivityIndex - 1 + activities.length) % activities.length;
                  setActiveTabId(activities[prevIdx].id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#0A2540] hover:bg-slate-50 shadow-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Activity</span>
              </button>

              <div className="flex items-center gap-1.5">
                {activities.map((act, i) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActiveTabId(act.id)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentActivityIndex ? "w-8 bg-[#C5A059]" : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextIdx = (currentActivityIndex + 1) % activities.length;
                  setActiveTabId(activities[nextIdx].id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#0A2540] hover:bg-slate-50 shadow-sm transition-colors"
              >
                <span>Next Activity</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              LAYOUT STYLE 1: ROYAL CELEBRATORY BANNER (Mockup 4 Style)
             ───────────────────────────────────────────────────────────── */}
          {layout === "royal_banner" && (
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#061426] via-[#0A2540] to-[#0F355C] border-2 border-[#C5A059]/40 p-6 sm:p-10 lg:p-12 text-white">
              {/* Gold light beams */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A059]/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left/Main Column: Laurels, Badge, Title, Story */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-[#C5A059]/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-sm">
                    <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                    <span>{activeActivity.category_badge || "CHAPTER DISTINCTION"}</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight bg-gradient-to-r from-white via-[#F3E5AB] to-[#C5A059] bg-clip-text text-transparent">
                    {activeActivity.title}
                  </h3>

                  {activeActivity.subtitle && (
                    <p className="text-base sm:text-lg text-amber-200/90 font-serif italic">
                      {activeActivity.subtitle}
                    </p>
                  )}

                  <FormattedBodyText body={activeActivity.body} theme="dark" />
                </div>

                {/* Right Column: Framed Media Player */}
                <div className="lg:col-span-5">
                  <ActivitySlideshow
                    images={images}
                    imageSize={imageSize}
                    edgeStyle={edgeStyle}
                    onOpenLightbox={(idx) => setLightboxIndex(idx)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              LAYOUT STYLE 2: INFOGRAPHIC FOCUS (The Weekly Lexicon / Image 2)
             ───────────────────────────────────────────────────────────── */}
          {layout === "infographic" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{activeActivity.category_badge || "THE WEEKLY LEXICON"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#0A2540] tracking-tight">
                    {activeActivity.title}
                  </h3>

                  {activeActivity.subtitle && (
                    <p className="text-sm sm:text-base font-serif italic text-[#C5A059] font-medium">
                      {activeActivity.subtitle}
                    </p>
                  )}

                  <FormattedBodyText body={activeActivity.body} />
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-md">
                    <ActivitySlideshow
                      images={images}
                      imageSize={imageSize}
                      edgeStyle={edgeStyle}
                      onOpenLightbox={(idx) => setLightboxIndex(idx)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              LAYOUT STYLE 3: MULTI-PHOTO MOSAIC (Sweet Returns / Image 3)
             ───────────────────────────────────────────────────────────── */}
          {layout === "mosaic" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#9E7D38] text-xs font-bold uppercase tracking-wider">
                    <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>{activeActivity.category_badge || "STUDENT INITIATIVES"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#0A2540] tracking-tight">
                    {activeActivity.title}
                  </h3>

                  {activeActivity.subtitle && (
                    <p className="text-sm sm:text-base font-serif italic text-amber-700 font-medium">
                      {activeActivity.subtitle}
                    </p>
                  )}

                  <FormattedBodyText body={activeActivity.body} />
                </div>

                <div className="lg:col-span-7">
                  <ActivityMosaic
                    images={images}
                    onOpenLightbox={(idx) => setLightboxIndex(idx)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              LAYOUT STYLE 4: HORIZONTAL SPLIT (Default FMAA Passers / Image 1)
             ───────────────────────────────────────────────────────────── */}
          {(layout === "split_text_left" || layout === "split_text_right") && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 lg:p-12">
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  layout === "split_text_right" ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text column */}
                <div
                  className={`space-y-4 ${
                    layout === "split_text_right"
                      ? "lg:col-span-6 lg:order-2"
                      : "lg:col-span-6 lg:order-1"
                  }`}
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#9E7D38] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{activeActivity.category_badge || "CHAPTER DISTINCTION"}</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0A2540] tracking-tight">
                    {activeActivity.title}
                  </h3>

                  {activeActivity.subtitle && (
                    <p className="text-sm sm:text-base font-serif italic text-[#C5A059] font-medium tracking-wide">
                      {activeActivity.subtitle}
                    </p>
                  )}

                  <FormattedBodyText body={activeActivity.body} />
                </div>

                {/* Media column */}
                <div
                  className={`w-full ${
                    layout === "split_text_right"
                      ? "lg:col-span-6 lg:order-1"
                      : "lg:col-span-6 lg:order-2"
                  }`}
                >
                  <ActivitySlideshow
                    images={images}
                    imageSize={imageSize}
                    edgeStyle={edgeStyle}
                    onOpenLightbox={(idx) => setLightboxIndex(idx)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              LAYOUT STYLE 5: STACKED (Text Top or Text Bottom)
             ───────────────────────────────────────────────────────────── */}
          {(layout === "stacked_text_top" || layout === "stacked_text_bottom") && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
              {layout === "stacked_text_top" && (
                <div className="max-w-3xl mx-auto text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#9E7D38] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{activeActivity.category_badge || "CHAPTER DISTINCTION"}</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#0A2540]">
                    {activeActivity.title}
                  </h3>
                  {activeActivity.subtitle && (
                    <p className="text-base font-serif italic text-[#C5A059]">
                      {activeActivity.subtitle}
                    </p>
                  )}
                  <FormattedBodyText body={activeActivity.body} align="center" />
                </div>
              )}

              <div className="max-w-4xl mx-auto">
                <ActivitySlideshow
                  images={images}
                  imageSize={imageSize}
                  edgeStyle={edgeStyle}
                  onOpenLightbox={(idx) => setLightboxIndex(idx)}
                />
              </div>

              {layout === "stacked_text_bottom" && (
                <div className="max-w-3xl mx-auto text-center space-y-3 pt-4 border-t border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#9E7D38] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{activeActivity.category_badge || "CHAPTER DISTINCTION"}</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#0A2540]">
                    {activeActivity.title}
                  </h3>
                  {activeActivity.subtitle && (
                    <p className="text-base font-serif italic text-[#C5A059]">
                      {activeActivity.subtitle}
                    </p>
                  )}
                  <FormattedBodyText body={activeActivity.body} align="center" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. FULLSCREEN LIGHTBOX MODAL ── */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Photo Counter */}
          <div className="absolute top-5 left-5 z-50 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 text-xs font-mono font-bold text-amber-200">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev/Next arrows in Lightbox */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/20"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/20"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolveImageUrl(images[lightboxIndex])}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/15"
            />
          </div>
        </div>
      )}
    </section>
  );
}
