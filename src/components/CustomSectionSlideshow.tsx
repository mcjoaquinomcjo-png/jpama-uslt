"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Maximize2, X, Sparkles, LayoutGrid, Eye } from "lucide-react";
import { resolveImageUrl, getDriveFallbackUrls } from "@/lib/imageUtils";
import GoldCyclingBorder from "@/components/GoldCyclingBorder";

// ─── Types ─────────────────────────────────────────────────────────────────
export type ImageSize = "2x2" | "4:3" | "16:9" | "small" | "medium" | "large";
export type EdgeStyle = "fade" | "fine" | "lined" | "none";

interface CustomSectionProps {
  sectionId: string;
  data: {
    type: string;
    label: string;
    title?: string;
    body?: string;
    images?: string[];
    layout?: "split_text_left" | "split_text_right" | "stacked_text_top" | "stacked_text_bottom" | "royal_banner" | "infographic" | "mosaic";
    imageSize?: ImageSize;
    edgeStyle?: EdgeStyle;
  };
}

// ─── Aspect-ratio & height map ───────────────────────────────────────────
const SIZE_CLASS: Record<ImageSize, string> = {
  "2x2":   "aspect-square      max-h-[420px]",
  "4:3":   "aspect-[4/3]       max-h-[480px]",
  "16:9":  "aspect-[16/9]      max-h-[560px]",
  small:   "aspect-[4/3]       max-h-[260px]",
  medium:  "aspect-[16/10]     max-h-[400px]",
  large:   "aspect-[21/9]      max-h-[600px]",
};

// ─── Edge-style overlays ─────────────────────────────────────────────────
function EdgeOverlay({ style }: { style: EdgeStyle }) {
  if (style === "none") return null;

  if (style === "fade")
    return (
      <>
        <div className="absolute inset-y-0 left-0  w-16 z-20 pointer-events-none bg-gradient-to-r  from-black/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 z-20 pointer-events-none bg-gradient-to-l  from-black/60 to-transparent" />
        <div className="absolute inset-x-0 top-0    h-10 z-20 pointer-events-none bg-gradient-to-b  from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 z-20 pointer-events-none bg-gradient-to-t  from-black/50 to-transparent" />
      </>
    );

  if (style === "fine")
    return (
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
        style={{ boxShadow: "inset 0 0 60px 20px rgba(0,0,0,0.55)" }}
      />
    );

  if (style === "lined")
    return (
      <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl border-[3px] border-white/20" />
    );

  return null;
}

// ─── Formatted body text ─────────────────────────────────────────────────
function FormattedBodyText({ body, align = "left" }: { body: string; align?: "left" | "center" }) {
  if (!body) return null;
  const hashtagRegex = /#[\w-]+/g;
  const hashtags = body.match(hashtagRegex) || [];
  let cleanBody = body;
  if (hashtags.length > 0) cleanBody = body.replace(/(\s*#[\w-]+)+$/g, "").trim();
  const paragraphs = cleanBody.split(/\n+/).map((p) => p.trim()).filter((p) => p.length > 0);
  return (
    <div className={`space-y-3.5 text-slate-600 font-sans ${align === "center" ? "text-center" : "text-left"}`}>
      {paragraphs.map((p, idx) => (
        <p key={idx} className="text-sm sm:text-[15px] leading-relaxed text-slate-600 font-normal">{p}</p>
      ))}
      {hashtags.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 ${align === "center" ? "justify-center" : "justify-start"}`}>
          {hashtags.map((tag, i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0A2540] border border-blue-200/60 font-sans text-[11px] font-semibold">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export default function CustomSectionSlideshow({ sectionId, data }: CustomSectionProps) {
  const images = (data.images || []).filter((img) => img && typeof img === "string" && img.trim().length > 0);
  const layout     = data.layout    || "split_text_left";
  const imageSize  = (data.imageSize  as ImageSize)  || "16:9";
  const edgeStyle  = (data.edgeStyle  as EdgeStyle)  || "none";

  // ── Slideshow state ──────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [isHovered,    setIsHovered]      = useState(false);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [imageFailures, setImageFailures] = useState<Record<number, number>>({});

  // ── Cinematic transition state ───────────────────────────────────────
  // Phase: "grid" → show all as chart; "zoom-in" → zooming into focused; "focused" → full view; "zoom-out" → back to grid
  type Phase = "grid" | "zoom-in" | "focused" | "zoom-out";
  const [phase,         setPhase]         = useState<Phase>("focused");
  const [focusedIndex,  setFocusedIndex]  = useState(0);
  const [progress,      setProgress]      = useState(0);

  const SLIDE_DURATION  = 5000; // ms per slide in focused mode
  const GRID_HOLD       = 1800; // ms to show grid before zooming in
  const ZOOM_DURATION   = 700;  // ms for zoom-in / zoom-out animation

  // ── Drag / gesture refs ──────────────────────────────────────────────
  const [isDragging, setIsDragging]       = useState(false);
  const startXRef                         = useRef<number>(0);
  const currentXRef                       = useRef<number>(0);
  const isDragTriggeredRef                = useRef<boolean>(false);

  // ── Image src resolver ───────────────────────────────────────────────
  const getImageSrc = (rawUrl: string, idx: number) => {
    const failCount = imageFailures[idx] || 0;
    const primary   = resolveImageUrl(rawUrl);
    if (failCount === 0) return primary;
    const fallbacks = getDriveFallbackUrls(rawUrl);
    if (failCount <= fallbacks.length) return fallbacks[failCount - 1];
    return primary;
  };

  const handleImageError = (idx: number) =>
    setImageFailures((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));

  // ── Advance to next slide (runs the full sequence: zoom-out → grid → zoom-in → focused) ──
  const advanceToNext = useCallback((nextIdx: number) => {
    setPhase("zoom-out");
    setTimeout(() => {
      setPhase("grid");
      setFocusedIndex(nextIdx);
      setCurrentIndex(nextIdx);
      setTimeout(() => {
        setPhase("zoom-in");
        setTimeout(() => {
          setPhase("focused");
          setProgress(0);
        }, ZOOM_DURATION);
      }, GRID_HOLD);
    }, ZOOM_DURATION);
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % images.length;
    advanceToNext(nextIdx);
  }, [currentIndex, images.length, advanceToNext]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    advanceToNext(prevIdx);
  }, [currentIndex, images.length, advanceToNext]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    advanceToNext(idx);
  };

  // ── Auto-play progress (only during "focused" phase) ────────────────
  useEffect(() => {
    if (images.length <= 1 || isHovered || isDragging || phase !== "focused") return;
    const intervalStep    = 50;
    const stepIncrement   = (intervalStep / SLIDE_DURATION) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { handleNext(); return 0; }
        return prev + stepIncrement;
      });
    }, intervalStep);
    return () => clearInterval(timer);
  }, [images.length, isHovered, isDragging, phase, handleNext]);

  // Keep index in bounds
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0); setProgress(0);
    }
  }, [images.length, currentIndex]);

  // ── Mouse gestures ───────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    startXRef.current   = e.clientX;
    currentXRef.current = e.clientX;
    isDragTriggeredRef.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    currentXRef.current = e.clientX;
    if (Math.abs(currentXRef.current - startXRef.current) > 8)
      isDragTriggeredRef.current = true;
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = currentXRef.current - startXRef.current;
    setIsDragging(false);
    if (Math.abs(diff) > 45) {
      diff < 0 ? handleNext() : handlePrev();
    } else if (!isDragTriggeredRef.current) {
      setLightboxOpen(true);
    }
  };

  // ── Touch gestures ───────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current   = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };
  const handleTouchMove  = (e: React.TouchEvent) => { currentXRef.current = e.touches[0].clientX; };
  const handleTouchEnd   = () => {
    const diff = currentXRef.current - startXRef.current;
    if (Math.abs(diff) > 40) diff < 0 ? handleNext() : handlePrev();
  };

  // ── Render guards ────────────────────────────────────────────────────
  const hasText   = Boolean(data.title?.trim() || data.body?.trim());
  const hasImages = images.length > 0;
  if (!hasText && !hasImages) return null;

  // ── Header ───────────────────────────────────────────────────────────
  const renderHeader = (align: "left" | "center" = "left") => (
    <div className={`space-y-3 ${align === "center" ? "text-center mx-auto" : "text-left"}`}>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#9E7D38] border border-[#C5A059]/40 text-[11px] font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
        <span>
          {data.label && !data.label.startsWith("custom_")
            ? data.label
            : (data.title ? "Chapter Distinction" : "Chapter Spotlight")}
        </span>
      </div>
      {data.title?.trim() && (
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A2540] tracking-tight leading-tight">
          {data.title}
        </h2>
      )}
    </div>
  );

  // ── Cinematic Slideshow Stage ────────────────────────────────────────
  const renderVisualStage = () => {
    if (images.length === 0) return null;

    const sizeClass  = SIZE_CLASS[imageSize] ?? SIZE_CLASS["16:9"];
    // Grid layout: up to 3 columns
    const gridCols   = images.length === 1 ? "grid-cols-1"
                     : images.length === 2 ? "grid-cols-2"
                     : "grid-cols-3";

    const isGrid     = phase === "grid";
    const isZoomIn   = phase === "zoom-in";
    const isZoomOut  = phase === "zoom-out";
    const isFocused  = phase === "focused";

    return (
      <div className="space-y-3 select-none">

        {/* ── Cinematic Stage ─────────────────────────── */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); if (isDragging) setIsDragging(false); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative group bg-[#0A2540] rounded-2xl overflow-hidden shadow-lg w-full ${sizeClass} border border-[#D4AF37]/35 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          title="Swipe or drag to explore • Click to zoom"
        >
          {/* Fine Classy Royal Gold Border Beam */}
          <GoldCyclingBorder borderRadius={16} duration={6} strokeWidth={1.2} intensity="subtle" showGlints={false} />

          {/* ── GRID / CHART VIEW ──────────────────────── */}
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              isGrid ? "opacity-100 scale-100" : isZoomOut ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{ transitionDuration: `${ZOOM_DURATION}ms` }}
          >
            <div className={`grid ${gridCols} gap-1 w-full h-full p-1`}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => { if (isGrid) goToSlide(idx); }}
                  className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
                    idx === focusedIndex
                      ? "ring-2 ring-[#C5A059] ring-offset-1 brightness-110 scale-[1.03]"
                      : "brightness-75 hover:brightness-90"
                  }`}
                >
                  <img
                    src={getImageSrc(img, idx)}
                    alt={`Slide ${idx + 1}`}
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Gold highlight on focused thumbnail */}
                  {idx === focusedIndex && (
                    <div className="absolute inset-0 ring-inset ring-2 ring-[#C5A059]/60 rounded-xl pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
            {/* Chart-view label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
              All Photos — {images.length} slides
            </div>
          </div>

          {/* ── FOCUSED / ZOOM STATE ───────────────────── */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all ease-in-out ${
              isFocused ? "opacity-100 scale-100"
              : isZoomIn ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
            }`}
            style={{ transitionDuration: `${ZOOM_DURATION}ms` }}
          >
            {/* Ambient blur backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-110 pointer-events-none transition-all duration-700"
              style={{ backgroundImage: `url(${getImageSrc(images[currentIndex], currentIndex)})` }}
            />

            {/* Active slide image */}
            <img
              key={currentIndex}
              src={getImageSrc(images[currentIndex], currentIndex)}
              alt={`${data.title || data.label} — Image ${currentIndex + 1}`}
              onError={() => handleImageError(currentIndex)}
              className={`relative z-10 max-h-full max-w-full pointer-events-none transition-all duration-700 ease-out ${
                isZoomIn
                  ? "opacity-100 scale-100"
                  : isZoomOut
                  ? "opacity-0 scale-125"
                  : "opacity-100 scale-100"
              } ${
                imageSize === "2x2"  ? "object-cover w-full h-full"
                : imageSize === "large" ? "object-cover w-full h-full"
                : "object-contain"
              }`}
              draggable={false}
            />

            {/* Edge overlay */}
            <EdgeOverlay style={edgeStyle} />

            {/* Zoom hint */}
            <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 text-white text-[11px] font-medium backdrop-blur-md border border-white/10">
                <Maximize2 className="w-3 h-3 text-[#E8C97A]" />
                <span>Zoom</span>
              </div>
            </div>

            {/* Progress strokes */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 z-30 px-5 flex items-center justify-center pointer-events-auto">
                <div className="flex items-center gap-2 max-w-xs sm:max-w-sm w-full bg-black/35 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-sm">
                  {images.map((_, idx) => {
                    const isActive = idx === currentIndex;
                    const isPast   = idx < currentIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                        className="group/stroke flex-1 py-1 cursor-pointer focus:outline-none"
                        title={`Go to slide ${idx + 1}`}
                      >
                        <div className="h-1 rounded-full bg-white/20 overflow-hidden relative transition-all group-hover/stroke:bg-white/35">
                          <div
                            className="absolute inset-0 bg-[#C5A059] rounded-full transition-all duration-75"
                            style={{ width: isActive ? `${progress}%` : isPast ? "100%" : "0%" }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Count indicator & Grid Overview Toggle */}
        {images.length > 1 && (
          <div className="flex items-center justify-between text-[11.5px] text-slate-500 px-1 font-sans">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhase((prev) => (prev === "grid" ? "focused" : "grid"))}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                title={phase === "grid" ? "Switch to single photo view" : "Switch to grid chart view"}
              >
                {phase === "grid" ? (
                  <>
                    <Eye className="w-3 h-3 text-[#0A2540]" />
                    <span>Single View</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-3 h-3 text-[#0A2540]" />
                    <span>Grid View</span>
                  </>
                )}
              </button>
              <span className="text-slate-400">|</span>
              <span className="text-slate-400">Drag or swipe to browse photos</span>
            </div>
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ── Layout renderer ──────────────────────────────────────────────────
  return (
    <section key={sectionId} className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {hasText && !hasImages && (
          <div className="max-w-3xl mx-auto space-y-5 text-center">
            {renderHeader("center")}
            <FormattedBodyText body={data.body || ""} align="center" />
          </div>
        )}

        {!hasText && hasImages && (
          <div className="max-w-4xl mx-auto space-y-2">{renderVisualStage()}</div>
        )}

        {hasText && hasImages && (
          <>
            {layout === "split_text_left" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 space-y-5">{renderHeader("left")}<FormattedBodyText body={data.body || ""} align="left" /></div>
                <div className="lg:col-span-6 space-y-2">{renderVisualStage()}</div>
              </div>
            )}
            {layout === "split_text_right" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1 space-y-2">{renderVisualStage()}</div>
                <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">{renderHeader("left")}<FormattedBodyText body={data.body || ""} align="left" /></div>
              </div>
            )}
            {layout === "stacked_text_top" && (
              <div className="space-y-8">
                <div className="max-w-3xl mx-auto space-y-4 text-center">{renderHeader("center")}<FormattedBodyText body={data.body || ""} align="center" /></div>
                <div className="max-w-4xl mx-auto space-y-2">{renderVisualStage()}</div>
              </div>
            )}
            {layout === "stacked_text_bottom" && (
              <div className="space-y-8">
                <div className="max-w-4xl mx-auto space-y-2">{renderVisualStage()}</div>
                <div className="max-w-3xl mx-auto space-y-4 text-center">{renderHeader("center")}<FormattedBodyText body={data.body || ""} align="center" /></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && images[currentIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-5xl max-h-[88vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={getImageSrc(images[currentIndex], currentIndex)}
              alt={`${data.title || data.label} — Fullscreen`}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
