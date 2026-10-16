"use client";

import React from "react";

interface JpamaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "crest" | "badge" | "full";
  className?: string;
  withGlow?: boolean;
}

export default function JpamaLogo({
  size = "md",
  variant = "badge",
  className = "",
  withGlow = false,
}: JpamaLogoProps) {
  const sizeMap = {
    sm:  { w: 38,  h: 38,  badgeW: 84,  badgeH: 34 },
    md:  { w: 52,  h: 52,  badgeW: 108, badgeH: 42 },
    lg:  { w: 72,  h: 72,  badgeW: 140, badgeH: 54 },
    xl:  { w: 92,  h: 92,  badgeW: 172, badgeH: 66 },
  };

  const dim = sizeMap[size];

  // Unique gradient IDs per instance to prevent SVG defs conflicts
  const uid = React.useId().replace(/:/g, "");

  // ─── 1. CREST ───────────────────────────────────────────────────────────────
  if (variant === "crest") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
        style={{ width: dim.w, height: dim.h }}
      >
        {withGlow && (
          <div className="absolute inset-0 rounded-xl bg-[#C5A059]/30 blur-lg -z-10 animate-pulse pointer-events-none" />
        )}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`navy-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#071A2E" />
              <stop offset="50%"  stopColor="#0A2540" />
              <stop offset="100%" stopColor="#143A60" />
            </linearGradient>
            <linearGradient id={`gold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#FFF8DC" />
              <stop offset="30%"  stopColor="#E8C97A" />
              <stop offset="55%"  stopColor="#C5A059" />
              <stop offset="80%"  stopColor="#E8C97A" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>
            <linearGradient id={`shine-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#FFFBE0" />
              <stop offset="25%"  stopColor="#F5D978" />
              <stop offset="50%"  stopColor="#C5A059" />
              <stop offset="75%"  stopColor="#E8C97A" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>
            <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background shield */}
          <rect x="4" y="4" width="92" height="92" rx="20"
            fill={`url(#navy-${uid})`} stroke={`url(#gold-${uid})`} strokeWidth="2.5" />

          {/* Inner gold inset ring */}
          <rect x="9" y="9" width="82" height="82" rx="15"
            fill="none" stroke={`url(#gold-${uid})`} strokeWidth="0.8" strokeOpacity="0.45"
            strokeDasharray="3 2" />

          {/* Top ornament – small diamond */}
          <polygon points="50,16 53,19 50,22 47,19" fill={`url(#shine-${uid})`} filter={`url(#glow-${uid})`} />
          {/* Flanking lines */}
          <line x1="15" y1="19" x2="44" y2="19" stroke={`url(#gold-${uid})`} strokeWidth="0.7" strokeOpacity="0.5" />
          <line x1="56" y1="19" x2="85" y2="19" stroke={`url(#gold-${uid})`} strokeWidth="0.7" strokeOpacity="0.5" />

          {/* JPAMA main text */}
          <text
            x="50" y="58"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={`url(#shine-${uid})`}
            filter={`url(#glow-${uid})`}
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="bold"
            fontSize="20"
            letterSpacing="3"
          >
            JPAMA
          </text>

          {/* Bottom ornament lines */}
          <line x1="18" y1="77" x2="82" y2="77" stroke={`url(#gold-${uid})`} strokeWidth="0.8" strokeOpacity="0.4" />
          <polygon points="50,74 53,77 50,80 47,77" fill={`url(#shine-${uid})`} />
        </svg>
      </div>
    );
  }

  // ─── 2. BADGE (Navbar pill) ──────────────────────────────────────────────────
  if (variant === "badge") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
        style={{ width: dim.badgeW, height: dim.badgeH }}
      >
        <svg
          viewBox="0 0 180 60"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`bNavy-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#071A2E" />
              <stop offset="50%"  stopColor="#0A2540" />
              <stop offset="100%" stopColor="#143A60" />
            </linearGradient>
            {/* Shimmer sweep gradient */}
            <linearGradient id={`bShimmer-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#9E7D38" />
              <stop offset="20%"  stopColor="#E8C97A" />
              <stop offset="38%"  stopColor="#FFFBE0" />
              <stop offset="50%"  stopColor="#F5D978" />
              <stop offset="65%"  stopColor="#E8C97A" />
              <stop offset="82%"  stopColor="#C5A059" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>
            <linearGradient id={`bBorder-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#E8C97A" />
              <stop offset="50%"  stopColor="#C5A059" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>
            <filter id={`bGlow-${uid}`} x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background rounded pill */}
          <rect x="2" y="2" width="176" height="56" rx="14"
            fill={`url(#bNavy-${uid})`}
            stroke={`url(#bBorder-${uid})`}
            strokeWidth="1.8" />

          {/* Inner subtle inset */}
          <rect x="5.5" y="5.5" width="169" height="49" rx="11"
            fill="none"
            stroke={`url(#bBorder-${uid})`}
            strokeWidth="0.6"
            strokeOpacity="0.35"
            strokeDasharray="2.5 2" />

          {/* Flanking ornamental lines */}
          <line x1="14" y1="30" x2="38" y2="30" stroke={`url(#bBorder-${uid})`} strokeWidth="0.7" strokeOpacity="0.55" />
          <line x1="142" y1="30" x2="166" y2="30" stroke={`url(#bBorder-${uid})`} strokeWidth="0.7" strokeOpacity="0.55" />
          {/* Small diamond ornaments */}
          <polygon points="42,28 45,30 42,32 39,30" fill={`url(#bShimmer-${uid})`} opacity="0.7" />
          <polygon points="138,28 141,30 138,32 135,30" fill={`url(#bShimmer-${uid})`} opacity="0.7" />

          {/* Main JPAMA text with shimmer */}
          <text
            x="90" y="32"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={`url(#bShimmer-${uid})`}
            filter={`url(#bGlow-${uid})`}
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="bold"
            fontSize="26"
            letterSpacing="6"
          >
            JPAMA
          </text>
        </svg>
      </div>
    );
  }

  // ─── 3. FULL (Crest + text) ──────────────────────────────────────────────────
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <JpamaLogo size={size} variant="crest" />
      <div className="flex flex-col">
        <span className="font-serif font-bold text-[#0A2540] tracking-tight leading-tight whitespace-nowrap">
          Junior Philippine Association of Management Accountants
        </span>
        <span className="text-[10px] text-slate-500 font-medium tracking-wide">
          University of Saint Louis Tuguegarao
        </span>
      </div>
    </div>
  );
}
