"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    tag: "BSMA ADVISORY",
    text: "Welcome BS Management Accounting students to A.Y. 2026–2027.",
    link: "/about",
  },
  {
    tag: "MEMBERSHIP",
    text: "BSMA Student Directory verification and online registration now active.",
    link: "/membership",
  },
  {
    tag: "UPCOMING EVENT",
    text: "Sihaya: The 2026 Grand Induction & Pinning Gala — Bulwagang San Jacinto.",
    link: "/events",
  },
];

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="bg-[#0A2540] text-white text-xs py-2 px-4 border-b border-[#0E355C]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#C5A059]">
            ANNOUNCEMENT
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-[10px] font-medium tracking-wide bg-[#14487A] text-white px-2 py-0.5 rounded">
              {current.tag}
            </span>
            <span className="text-slate-200 truncate text-xs">
              {current.text}
            </span>
          </div>
        </div>

        <Link
          href={current.link}
          className="flex items-center gap-1 text-[#E8D8BA] hover:text-white transition-colors text-xs font-medium flex-shrink-0 group"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
