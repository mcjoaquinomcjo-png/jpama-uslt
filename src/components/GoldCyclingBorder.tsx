"use client";

import React from "react";

interface GoldCyclingBorderProps {
  borderRadius?: number; // corner radius in px, default 16
  duration?: number; // seconds for full perimeter cycle, default 5.5s
  strokeWidth?: number; // hairline luxury border thickness, default 1.2
  glow?: boolean; // include subtle fine bloom
  showGlints?: boolean; // delicate royal diamond glints on corners
  className?: string;
  intensity?: "subtle" | "vivid" | "high";
}

/**
 * Royal & Classy Jewel Diamond Glint
 * Delicate, organic 4-point concave star flare (astroid) with warm champagne aura
 */
function RoyalJewelGlint() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3.5 h-3.5 overflow-visible drop-shadow-[0_0_6px_rgba(255,235,130,0.85)]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="royalAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#E5C158" stopOpacity="0.6" />
          <stop offset="85%" stopColor="#AA7C11" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft warm champagne glow aura */}
      <circle cx="8" cy="8" r="7" fill="url(#royalAura)" />
      {/* Delicate 4-point curved diamond flare */}
      <path
        d="M8,1.5 Q8,8 14.5,8 Q8,8 8,14.5 Q8,8 1.5,8 Q8,8 8,1.5 Z"
        fill="#FFFEF7"
      />
      {/* Diagonal micro-twinkle rays */}
      <path
        d="M8,4.5 Q8,8 11.5,8 Q8,8 8,11.5 Q8,8 4.5,8 Q8,8 8,4.5 Z"
        fill="#F9E79F"
        opacity="0.85"
      />
      {/* Pinpoint diamond white center */}
      <circle cx="8" cy="8" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

export default function GoldCyclingBorder({
  borderRadius = 16,
  duration = 5.5,
  strokeWidth = 1.2,
  glow = true,
  showGlints = false,
  className = "",
  intensity = "vivid",
}: GoldCyclingBorderProps) {
  const idSuffix = React.useId().replace(/:/g, "");
  const baseGradId = `baseRoyalGold_${idSuffix}`;
  const beamGradId = `beamRoyalGold_${idSuffix}`;
  const filterId = `microGlowFilter_${idSuffix}`;

  const baseOpacity = intensity === "subtle" ? "0.25" : intensity === "high" ? "0.55" : "0.4";

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-visible rounded-[inherit] z-20 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full overflow-visible absolute inset-0"
        style={{ display: "block" }}
      >
        <defs>
          {/* Fine solid metallic gold base track */}
          <linearGradient id={baseGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity={baseOpacity} />
            <stop offset="30%" stopColor="#FFF1B8" stopOpacity={Number(baseOpacity) + 0.15} />
            <stop offset="60%" stopColor="#AA7C11" stopOpacity={baseOpacity} />
            <stop offset="85%" stopColor="#FFE082" stopOpacity={Number(baseOpacity) + 0.1} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity={baseOpacity} />
          </linearGradient>

          {/* Fine classy royal beam: smooth, solid, liquid-gold fraction */}
          <linearGradient id={beamGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AA7C11" stopOpacity="0" />
            <stop offset="25%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#F9E79F" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="55%" stopColor="#F9E79F" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#AA7C11" stopOpacity="0" />
          </linearGradient>

          {/* Micro-bloom filter: delicate luxury gleam without thick hazy blur */}
          {glow && (
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* 1. Fine Solid Metallic Base Frame (Sharp 1px - 1.2px) */}
        <rect
          rx={borderRadius}
          fill="none"
          stroke={`url(#${baseGradId})`}
          strokeWidth={strokeWidth}
          style={{
            x: `${strokeWidth / 2}px`,
            y: `${strokeWidth / 2}px`,
            width: `calc(100% - ${strokeWidth}px)`,
            height: `calc(100% - ${strokeWidth}px)`,
          }}
        />

        {/* 2. Fine Traveling Gold Beam: Elegant 360° Perimeter Orbit */}
        <rect
          className="gold-beam-cycling"
          pathLength="1000"
          rx={borderRadius}
          fill="none"
          stroke={`url(#${beamGradId})`}
          strokeWidth={strokeWidth + 0.4}
          strokeDasharray="140 860"
          filter={glow ? `url(#${filterId})` : undefined}
          style={{
            x: `${strokeWidth / 2}px`,
            y: `${strokeWidth / 2}px`,
            width: `calc(100% - ${strokeWidth}px)`,
            height: `calc(100% - ${strokeWidth}px)`,
            animation: `goldBeamCycle ${duration}s linear infinite`,
          }}
        />

        {/* 3. Hairline White-Gold Pinpoint Highlight Core */}
        <rect
          className="gold-beam-cycling"
          pathLength="1000"
          rx={borderRadius}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          strokeDasharray="35 965"
          opacity="0.9"
          style={{
            x: `${strokeWidth / 2}px`,
            y: `${strokeWidth / 2}px`,
            width: `calc(100% - ${strokeWidth}px)`,
            height: `calc(100% - ${strokeWidth}px)`,
            animation: `goldBeamCycle ${duration}s linear infinite`,
          }}
        />
      </svg>

      {/* Discrete, Royal Diamond Facet Glints on Corners */}
      {showGlints && (
        <>
          <div className="absolute -top-1.5 -left-1.5 pointer-events-none animate-glint-pulse">
            <RoyalJewelGlint />
          </div>
          <div
            className="absolute -top-1.5 -right-1.5 pointer-events-none animate-glint-pulse"
            style={{ animationDelay: "1.6s" }}
          >
            <RoyalJewelGlint />
          </div>
          <div
            className="absolute -bottom-1.5 -right-1.5 pointer-events-none animate-glint-pulse"
            style={{ animationDelay: "0.8s" }}
          >
            <RoyalJewelGlint />
          </div>
          <div
            className="absolute -bottom-1.5 -left-1.5 pointer-events-none animate-glint-pulse"
            style={{ animationDelay: "2.4s" }}
          >
            <RoyalJewelGlint />
          </div>
        </>
      )}
    </div>
  );
}
