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
  variant = "crest",
  className = "",
  withGlow = false,
}: JpamaLogoProps) {
  // Proportional executive plaque dimensions (approx 1.8 : 1 ratio)
  const sizeMap = {
    sm: { w: 62,  h: 36,  badgeW: 84,  badgeH: 36 },
    md: { w: 92,  h: 52,  badgeW: 116, badgeH: 46 },
    lg: { w: 126, h: 70,  badgeW: 148, badgeH: 56 },
    xl: { w: 164, h: 90,  badgeW: 184, badgeH: 68 },
  };

  const dim = sizeMap[size];

  // Unique ID to avoid gradient & filter ID collisions across instances
  const uid = React.useId().replace(/:/g, "");

  // ─── 1. CREST / EXECUTIVE PLAQUE (Admin Login & Emblem Box) ──────────────────
  if (variant === "crest") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none group ${className}`}
        style={{ width: dim.w, height: dim.h }}
      >
        {/* Illuminating ambient golden aura */}
        {withGlow ? (
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#C5A059]/25 via-[#E8C97A]/35 to-[#C5A059]/25 blur-xl -z-10 animate-pulse pointer-events-none" />
        ) : (
          <div className="absolute -inset-1 rounded-xl bg-[#C5A059]/10 blur-md -z-10 pointer-events-none" />
        )}

        <svg
          viewBox="0 0 160 88"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep Royal Midnight Blue Enamel */}
            <radialGradient id={`bgEnamel-${uid}`} cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#103052" />
              <stop offset="50%" stopColor="#081E35" />
              <stop offset="100%" stopColor="#040D18" />
            </radialGradient>

            {/* Beveled 24K Polished Gold Frame */}
            <linearGradient id={`goldBezel-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF6CC" />
              <stop offset="25%" stopColor="#E5C158" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="80%" stopColor="#9E7D38" />
              <stop offset="100%" stopColor="#6E5018" />
            </linearGradient>

            {/* Inner Gold Hairline Inset */}
            <linearGradient id={`goldHairline-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9E7D38" />
              <stop offset="20%" stopColor="#E5C158" />
              <stop offset="50%" stopColor="#FFF6CC" />
              <stop offset="80%" stopColor="#E5C158" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>

            {/* CONTINUOUS ILLUMINATING LIQUID GOLD SHIMMER FOR JPAMA */}
            <linearGradient id={`shimmerBeam-${uid}`} x1="-100%" y1="0%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#B38E3E" />
              <stop offset="18%" stopColor="#DFB95C" />
              <stop offset="35%" stopColor="#F9E292" />
              <stop offset="47%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFFEE8" />
              <stop offset="53%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F9E292" />
              <stop offset="82%" stopColor="#DFB95C" />
              <stop offset="100%" stopColor="#B38E3E" />
              <animate
                attributeName="x1"
                from="-120%"
                to="140%"
                dur="3.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                from="30%"
                to="290%"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* Traveling Surface Glint Across the Lacquer Plaque */}
            <linearGradient id={`surfaceSheen-${uid}`} x1="-150%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              <animate
                attributeName="x1"
                from="-150%"
                to="150%"
                dur="4.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                from="50%"
                to="350%"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* Specular Text Bloom & Glow */}
            <filter id={`illuminatingGlow-${uid}`} x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Main Outer Plaque (Clean, Executive 1.8:1 Proportions) */}
          <rect
            x="2.5"
            y="2.5"
            width="155"
            height="83"
            rx="12"
            fill={`url(#bgEnamel-${uid})`}
            stroke={`url(#goldBezel-${uid})`}
            strokeWidth="2.4"
          />

          {/* 2. Traveling Surface Sheen Sweep */}
          <rect
            x="3.5"
            y="3.5"
            width="153"
            height="81"
            rx="11"
            fill={`url(#surfaceSheen-${uid})`}
          />

          {/* 3. Solid Gold Hairline Inset (Pristine Jewellery Line - NO Dashes) */}
          <rect
            x="7"
            y="7"
            width="146"
            height="74"
            rx="8.5"
            fill="none"
            stroke={`url(#goldHairline-${uid})`}
            strokeWidth="0.85"
            strokeOpacity="0.6"
          />

          {/* 4. Four Precision Corner Micro-Diamonds */}
          <polygon points="12.5,10.5 14.5,12.5 12.5,14.5 10.5,12.5" fill={`url(#goldBezel-${uid})`} opacity="0.85" />
          <polygon points="147.5,10.5 149.5,12.5 147.5,14.5 145.5,12.5" fill={`url(#goldBezel-${uid})`} opacity="0.85" />
          <polygon points="12.5,73.5 14.5,75.5 12.5,77.5 10.5,75.5" fill={`url(#goldBezel-${uid})`} opacity="0.85" />
          <polygon points="147.5,73.5 149.5,75.5 147.5,77.5 145.5,75.5" fill={`url(#goldBezel-${uid})`} opacity="0.85" />

          {/* 5. Top Balance Rule with Radiant Center Star */}
          <line
            x1="34"
            y1="23"
            x2="126"
            y2="23"
            stroke={`url(#goldHairline-${uid})`}
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />
          <polygon
            points="80,18.5 82.5,23 80,27.5 77.5,23"
            fill={`url(#shimmerBeam-${uid})`}
            filter={`url(#illuminatingGlow-${uid})`}
          />
          <circle cx="80" cy="23" r="0.75" fill="#FFFFFF" />

          {/* 6. STATIC JPAMA WORDMARK WITH ILLUMINATING CONTINUOUS SHIMMER */}
          <text
            x="80"
            y="47"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={`url(#shimmerBeam-${uid})`}
            filter={`url(#illuminatingGlow-${uid})`}
            fontFamily="'Cinzel', 'Playfair Display', 'Bodoni MT', 'Times New Roman', Georgia, serif"
            fontWeight="bold"
            fontSize="25"
            letterSpacing="6.5"
          >
            JPAMA
          </text>

          {/* 7. Bottom Balance Rule with Radiant Center Star */}
          <line
            x1="34"
            y1="65"
            x2="126"
            y2="65"
            stroke={`url(#goldHairline-${uid})`}
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />
          <polygon
            points="80,60.5 82.5,65 80,69.5 77.5,65"
            fill={`url(#shimmerBeam-${uid})`}
            filter={`url(#illuminatingGlow-${uid})`}
          />
          <circle cx="80" cy="65" r="0.75" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // ─── 2. BADGE (Navbar Pill with Matching Illuminating Shimmer) ───────────────
  if (variant === "badge") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
        style={{ width: dim.badgeW, height: dim.badgeH }}
      >
        <svg
          viewBox="0 0 176 60"
          className="w-full h-full drop-shadow-sm overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`bNavy-${uid}`} cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#103052" />
              <stop offset="60%" stopColor="#081E35" />
              <stop offset="100%" stopColor="#040D18" />
            </radialGradient>

            <linearGradient id={`bBorder-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF6CC" />
              <stop offset="30%" stopColor="#E5C158" />
              <stop offset="70%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8A6726" />
            </linearGradient>

            <linearGradient id={`bShimmerBeam-${uid}`} x1="-100%" y1="0%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#B38E3E" />
              <stop offset="20%" stopColor="#DFB95C" />
              <stop offset="38%" stopColor="#F9E292" />
              <stop offset="47%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFFEE8" />
              <stop offset="53%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F9E292" />
              <stop offset="82%" stopColor="#DFB95C" />
              <stop offset="100%" stopColor="#B38E3E" />
              <animate
                attributeName="x1"
                from="-120%"
                to="140%"
                dur="3.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                from="30%"
                to="290%"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </linearGradient>

            <filter id={`bGlow-${uid}`} x="-15%" y="-30%" width="130%" height="160%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pill Container */}
          <rect
            x="2"
            y="2"
            width="172"
            height="56"
            rx="13"
            fill={`url(#bNavy-${uid})`}
            stroke={`url(#bBorder-${uid})`}
            strokeWidth="1.8"
          />

          {/* Inner Solid Inset */}
          <rect
            x="5.5"
            y="5.5"
            width="165"
            height="49"
            rx="10"
            fill="none"
            stroke={`url(#bBorder-${uid})`}
            strokeWidth="0.65"
            strokeOpacity="0.4"
          />

          {/* Flanking Ornaments */}
          <line x1="15" y1="30" x2="36" y2="30" stroke={`url(#bBorder-${uid})`} strokeWidth="0.75" strokeOpacity="0.5" />
          <polygon points="40,28 42.5,30 40,32 37.5,30" fill={`url(#bShimmerBeam-${uid})`} opacity="0.75" />

          <line x1="140" y1="30" x2="161" y2="30" stroke={`url(#bBorder-${uid})`} strokeWidth="0.75" strokeOpacity="0.5" />
          <polygon points="136,28 138.5,30 136,32 133.5,30" fill={`url(#bShimmerBeam-${uid})`} opacity="0.75" />

          {/* Wordmark with Illuminating Shimmer */}
          <text
            x="88"
            y="31"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={`url(#bShimmerBeam-${uid})`}
            filter={`url(#bGlow-${uid})`}
            fontFamily="'Cinzel', 'Playfair Display', 'Bodoni MT', Georgia, serif"
            fontWeight="bold"
            fontSize="24"
            letterSpacing="5.5"
          >
            JPAMA
          </text>
        </svg>
      </div>
    );
  }

  // ─── 3. FULL (Crest Plaque + Title text) ──────────────────────────────────────
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
