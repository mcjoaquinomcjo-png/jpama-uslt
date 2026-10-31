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
  ExternalLink,
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
  };
}

export default function CustomSectionSlideshow({ sectionId, data }: CustomSectionProps) {
  const images = (data.images || []).filter((img) => img && typeof img === "string" && img.trim().length > 0);
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

  return (
    <section key={sectionId} className="py-16 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.label || "Chapter Spotlight"}</span>
            </div>

            {data.title && (
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A2540] tracking-tight">
                {data.title}
              </h2>
            )}

            {data.body && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {data.body}
              </p>
            )}
          </div>

          {/* Mode Switcher & Controls */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("slideshow")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "slideshow"
                    ? "bg-white text-[#0A2540] shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View as interactive slideshow"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Slideshow</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#0A2540] shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View all images in a grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid ({images.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* SLIDESHOW VIEW MODE */}
        {images.length > 0 && viewMode === "slideshow" && (
          <div className="space-y-4">
            {/* Main Stage */}
            <div className="relative group bg-[#0A2540] rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/10] sm:aspect-[16/9] max-h-[640px] flex items-center justify-center">
              {/* Background blurred glow of current image */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110 pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${getImageSrc(images[currentIndex], currentIndex)})` }}
              />

              {/* Main Image */}
              <img
                key={currentIndex}
                src={getImageSrc(images[currentIndex], currentIndex)}
                alt={`${data.title || data.label} - Image ${currentIndex + 1}`}
                onError={() => handleImageError(currentIndex)}
                className="relative z-10 max-h-full max-w-full object-contain cursor-zoom-in transition-opacity duration-300"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Prev / Next Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Top Controls Overlay: Counter & Zoom */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/50 text-white text-xs font-mono backdrop-blur-sm">
                  {currentIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                  title="Zoom Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Play/Pause Overlay */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs backdrop-blur-sm flex items-center gap-1.5 transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Autoplay</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
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
                      className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        isActive
                          ? "border-[#C5A059] ring-2 ring-[#C5A059]/40 scale-105 shadow-md"
                          : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageSrc(img, idx)}
                        alt={`Thumbnail ${idx + 1}`}
                        onError={() => handleImageError(idx)}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GRID VIEW MODE */}
        {images.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Image {idx + 1}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {lightboxOpen && images[currentIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Modal Header */}
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
              title="Close Fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Main Image */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={getImageSrc(images[currentIndex], currentIndex)}
              alt="Fullscreen Zoom"
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

          {/* Modal Bottom Thumbnail Strip */}
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
