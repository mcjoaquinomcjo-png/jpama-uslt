"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Bell } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    tag: "BSMA ADVISORY",
    text: "Welcome BS Management Accounting scholars to A.Y. 2026–2027.",
    link: "/about",
  },
  {
    tag: "MEMBERSHIP",
    text: "BSMA Student Directory verification & online registration now open.",
    link: "/membership",
  },
  {
    tag: "UPCOMING ASSEMBLY",
    text: "Sihaya: The 2026 Grand Induction & Pinning Gala — Bulwagang San Jacinto.",
    link: "/events",
  },
];

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
      setIsAnimating(false);
    }, 300);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#0A2540] text-white text-xs py-2 px-4 border-b border-[#0E355C] transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Label badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#C5A059]">
            DISPATCH
          </span>
        </div>

        {/* Smooth Transition Text */}
        <div className="flex-1 overflow-hidden">
          <div
            className={`flex items-center gap-2.5 transition-all duration-300 ease-out transform ${
              isAnimating
                ? "opacity-0 -translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            <span className="text-[10px] font-semibold tracking-wide bg-[#14487A] text-white px-2 py-0.5 rounded flex-shrink-0">
              {current.tag}
            </span>
            <span className="text-slate-200 truncate text-xs">
              {current.text}
            </span>
          </div>
        </div>

        {/* Controls & Link */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-0.5 text-slate-400">
            <button
              onClick={handlePrev}
              className="p-1 hover:text-white rounded hover:bg-[#14487A]/50 transition-colors"
              title="Previous Announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {currentIndex + 1}/{ANNOUNCEMENTS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:text-white rounded hover:bg-[#14487A]/50 transition-colors"
              title="Next Announcement"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            href={current.link}
            className="flex items-center gap-1 text-[#E8D8BA] hover:text-white transition-colors text-xs font-semibold group"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
