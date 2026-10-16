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
  // Dimensions mapping
  const sizeMap = {
    sm: { w: 38, h: 38, badgeW: 76, badgeH: 38, text: "text-xs", fullText: "text-xs" },
    md: { w: 52, h: 52, badgeW: 96, badgeH: 48, text: "text-sm", fullText: "text-sm" },
    lg: { w: 72, h: 72, badgeW: 120, badgeH: 56, text: "text-base", fullText: "text-base" },
    xl: { w: 92, h: 92, badgeW: 150, badgeH: 64, text: "text-lg", fullText: "text-lg" },
  };

  const dim = sizeMap[size];

  // 1. CREST EMBLEM (Circular / Shield with Laurel & Monogram)
  if (variant === "crest") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
        style={{ width: dim.w, height: dim.h }}
      >
        {withGlow && (
          <div
            className="absolute inset-0 rounded-2xl bg-[#C5A059]/25 blur-md -z-10 animate-pulse pointer-events-none"
          />
        )}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Rounded Shield / Rounded Hexagon with Navy Gradient */}
          <defs>
            <linearGradient id="crestNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#071A2E" />
              <stop offset="50%" stopColor="#0A2540" />
              <stop offset="100%" stopColor="#143A60" />
            </linearGradient>
            <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C97A" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>
            <linearGradient id="crestGoldShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF2C8" />
              <stop offset="50%" stopColor="#E8C97A" />
              <stop offset="100%" stopColor="#B38E46" />
            </linearGradient>
          </defs>

          {/* Background rounded rectangle */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill="url(#crestNavy)"
            stroke="url(#crestGold)"
            strokeWidth="2.5"
          />

          {/* Inner gold concentric frame */}
          <rect
            x="9"
            y="9"
            width="82"
            height="82"
            rx="18"
            fill="none"
            stroke="url(#crestGold)"
            strokeWidth="1"
            strokeOpacity="0.5"
            strokeDasharray="2 2"
          />

          {/* Top laurel decorative leaves */}
          <path
            d="M30 25 C35 22 45 22 50 25 C55 22 65 22 70 25"
            stroke="url(#crestGold)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="50" cy="20" r="2" fill="url(#crestGoldShine)" />
          <circle cx="44" cy="21" r="1.2" fill="url(#crestGoldShine)" />
          <circle cx="56" cy="21" r="1.2" fill="url(#crestGoldShine)" />

          {/* JPAMA Monogram Text */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#crestGoldShine)"
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="bold"
            fontSize="18"
            letterSpacing="3"
          >
            JPAMA
          </text>

          {/* Divider rule */}
          <line
            x1="28"
            y1="64"
            x2="72"
            y2="64"
            stroke="url(#crestGold)"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <polygon
            points="50,62 52,64 50,66 48,64"
            fill="url(#crestGoldShine)"
          />

          {/* Bottom Subtitle: USLT BSMA */}
          <text
            x="50"
            y="76"
            textAnchor="middle"
            fill="#E8C97A"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            fontSize="8"
            letterSpacing="2"
            fillOpacity="0.9"
          >
            USLT • BSMA
          </text>
        </svg>
      </div>
    );
  }

  // 2. BADGE (Horizontal pill / rounded rectangle with balanced proportions)
  if (variant === "badge") {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
        style={{ width: dim.badgeW, height: dim.badgeH }}
      >
        <svg
          viewBox="0 0 160 80"
          className="w-full h-full drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="badgeNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#071A2E" />
              <stop offset="50%" stopColor="#0A2540" />
              <stop offset="100%" stopColor="#143A60" />
            </linearGradient>
            <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C97A" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#9E7D38" />
            </linearGradient>
            <linearGradient id="badgeGoldShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF6DA" />
              <stop offset="40%" stopColor="#E8C97A" />
              <stop offset="100%" stopColor="#B38E46" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Container */}
          <rect
            x="3"
            y="3"
            width="154"
            height="74"
            rx="16"
            fill="url(#badgeNavy)"
            stroke="url(#badgeGold)"
            strokeWidth="2"
          />

          {/* Inner Accent Inset Line */}
          <rect
            x="7"
            y="7"
            width="146"
            height="66"
            rx="12"
            fill="none"
            stroke="url(#badgeGold)"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Small Top Diamonds */}
          <polygon points="80,12 82,14 80,16 78,14" fill="url(#badgeGold)" opacity="0.8" />
          <line x1="45" y1="14" x2="74" y2="14" stroke="url(#badgeGold)" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="86" y1="14" x2="115" y2="14" stroke="url(#badgeGold)" strokeWidth="0.8" strokeOpacity="0.5" />

          {/* Main Typography */}
          <text
            x="80"
            y="44"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#badgeGoldShine)"
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="bold"
            fontSize="23"
            letterSpacing="5"
          >
            JPAMA
          </text>

          {/* Bottom Academic Subtext */}
          <text
            x="80"
            y="63"
            textAnchor="middle"
            fill="#E8C97A"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            fontSize="8"
            letterSpacing="2.5"
            fillOpacity="0.85"
          >
            USLT CHAPTER
          </text>
        </svg>
      </div>
    );
  }

  // 3. FULL (Crest + Title Side by Side)
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
