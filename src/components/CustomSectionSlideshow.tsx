"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  LayoutGrid,
  Film,
  Sparkles,
} from "lucide-react";
import { resolveImageUrl, getDriveFallbackUrls } from "@/lib/imageUtils";

interface CustomSectionProps {
  sectionId: string;
  data: {
    type: string;
    label: string;
    title?: string;
    body?: string;
    images?: string[];
    layout?: "split_text_left" | "split_text_right" | "stacked_text_top" | "stacked_text_bottom";
  };
}

function FormattedBodyText({ body, align = "left" }: { body: string; align?: "left" | "center" }) {
  if (!body) return null;

  // Extract hashtags (e.g., #JPAMAUSLT #ProudLouisians #FMAAPassers)
  const hashtagRegex = /#[\w-]+/g;
  const hashtags = body.match(hashtagRegex) || [];

  // Strip trailing hashtags block from the main prose so they can be rendered as discrete badges
  let cleanBody = body;
  if (hashtags.length > 0) {
    cleanBody = body.replace(/(\s*#[\w-]+)+$/g, "").trim();
  }

  // Split into clean paragraphs
  const paragraphs = cleanBody
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className={`space-y-3.5 text-slate-600 font-sans ${align === "center" ? "text-center" : "text-left"}`}>
      {paragraphs.map((p, idx) => (
        <p key={idx} className="text-sm sm:text-[15px] leading-relaxed text-slate-600">
          {p}
        </p>
      ))}

      {hashtags.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 ${align === "center" ? "justify-center" : "justify-start"}`}>
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200/60 font-mono text-[11px] font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomSectionSlideshow({ sectionId, data }: CustomSectionProps) {
  const images = (data.images || []).filter((img) => img && typeof img === "string" && img.trim().length > 0);
  const layout = data.layout || "split_text_left";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<"slideshow" | "grid">("slideshow");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageFailures, setImageFailures] = useState<Record<number, number>>({});

  // Auto-play slideshow every 4.5 seconds if enabled and in slideshow mode
  useEffect(() => {
    if (!isPlaying || images.length <= 1 || viewMode !== "slideshow") return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, images.length, viewMode]);

  // Keep index within bounds if images change
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const getImageSrc = (rawUrl: string, idx: number) => {
    const failCount = imageFailures[idx] || 0;
    const primary = resolveImageUrl(rawUrl);
    if (failCount === 0) return primary;

    const fallbacks = getDriveFallbackUrls(rawUrl);
    if (failCount <= fallbacks.length) {
      return fallbacks[failCount - 1];
    }
    return primary;
  };

  const handleImageError = (idx: number) => {
    setImageFailures((prev) => ({
      ...prev,
      [idx]: (prev[idx] || 0) + 1,
    }));
  };

  // If no images and no title/body, don't show empty block
  if (images.length === 0 && !data.title && !data.body) {
    return null;
  }

  // Header Title & Badge block
  const renderHeader = (align: "left" | "center" = "left") => (
    <div className={`space-y-2.5 ${align === "center" ? "text-center mx-auto" : "text-left"}`}>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          {data.label && !data.label.startsWith("custom_")
            ? data.label
            : (data.title ? "Chapter Distinction" : "Chapter Spotlight")}
        </span>
      </div>

      {data.title && (
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A2540] tracking-tight leading-tight">
          {data.title}
        </h2>
      )}
    </div>
  );

  // View Mode Switcher
  const renderControls = () => (
    images.length > 1 ? (
      <div className="flex items-center justify-between pb-3">
        <span className="text-xs font-semibold text-slate-500 font-mono">
          Photo {currentIndex + 1} of {images.length}
        </span>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode("slideshow")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "slideshow"
                ? "bg-white text-[#0A2540] shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Interactive Slideshow"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Slideshow</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "grid"
                ? "bg-white text-[#0A2540] shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Gallery Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid ({images.length})</span>
          </button>
        </div>
      </div>
    ) : null
  );

  // Slideshow & Grid Visual Stage
  const renderVisualStage = () => {
    if (images.length === 0) return null;

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fadeIn">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative bg-[#0A2540] rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all aspect-[4/3] cursor-pointer"
            >
              <img
                src={getImageSrc(img, idx)}
                alt={`${data.title || data.label} ${idx + 1}`}
                onError={() => handleImageError(idx)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>Zoom</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* Main Display Window */}
        <div className="relative group bg-[#0A2540] rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] max-h-[580px] flex items-center justify-center">
          {/* Blurred backdrop reflection */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110 pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${getImageSrc(images[currentIndex], currentIndex)})` }}
          />

          {/* Active Image */}
          <img
            key={currentIndex}
            src={getImageSrc(images[currentIndex], currentIndex)}
            alt={`${data.title || data.label} - Image ${currentIndex + 1}`}
            onError={() => handleImageError(currentIndex)}
            className="relative z-10 max-h-full max-w-full object-contain cursor-zoom-in transition-opacity duration-300"
            onClick={() => setLightboxOpen(true)}
          />

          {/* Prev / Next Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Top Overlays: Counter & Zoom */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-mono backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              title="Fullscreen Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Overlay: Play/Pause */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 z-20">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] backdrop-blur-sm flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300">
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    isActive
                      ? "border-[#C5A059] ring-2 ring-[#C5A059]/40 scale-105 shadow-md"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getImageSrc(img, idx)}
                    alt=""
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white bg-black/60 px-1 rounded">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <section key={sectionId} className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* LAYOUT 1: Side-by-Side (Text on Left, Slideshow on Right) */}
        {layout === "split_text_left" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              {renderHeader("left")}
              <FormattedBodyText body={data.body || ""} align="left" />
            </div>
            <div className="lg:col-span-6 space-y-2">
              {renderControls()}
              {renderVisualStage()}
            </div>
          </div>
        )}

        {/* LAYOUT 2: Side-by-Side (Slideshow on Left, Text on Right) */}
        {layout === "split_text_right" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-2">
              {renderControls()}
              {renderVisualStage()}
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              {renderHeader("left")}
              <FormattedBodyText body={data.body || ""} align="left" />
            </div>
          </div>
        )}

        {/* LAYOUT 3: Stacked (Text on Top, Slideshow Below) */}
        {layout === "stacked_text_top" && (
          <div className="space-y-8">
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              {renderHeader("center")}
              <FormattedBodyText body={data.body || ""} align="center" />
            </div>
            <div className="max-w-4xl mx-auto space-y-2">
              {renderControls()}
              {renderVisualStage()}
            </div>
          </div>
        )}

        {/* LAYOUT 4: Stacked (Slideshow on Top, Text Below) */}
        {layout === "stacked_text_bottom" && (
          <div className="space-y-8">
            <div className="max-w-4xl mx-auto space-y-2">
              {renderControls()}
              {renderVisualStage()}
            </div>
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              {renderHeader("center")}
              <FormattedBodyText body={data.body || ""} align="center" />
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && images[currentIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          <div className="flex items-center justify-between text-white z-10">
            <div>
              <h4 className="font-serif font-bold text-base text-[#C5A059]">
                {data.title || data.label}
              </h4>
              <p className="text-xs text-slate-300 font-mono">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={getImageSrc(images[currentIndex], currentIndex)}
              alt="Zoomed"
              onError={() => handleImageError(currentIndex)}
              className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    idx === currentIndex
                      ? "border-[#C5A059] scale-110"
                      : "border-white/30 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getImageSrc(img, idx)}
                    alt=""
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
