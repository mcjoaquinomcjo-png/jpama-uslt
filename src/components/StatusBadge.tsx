import React from "react";
import { MemberStatus } from "@/lib/types";
import { Check, Clock, Award } from "lucide-react";

interface StatusBadgeProps {
  status: MemberStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
  let badgeStyles = "";
  let icon = null;

  if (status === "Active") {
    badgeStyles = "bg-emerald-50 text-emerald-800 border border-emerald-200";
    icon = <Check className={size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3"} />;
  } else if (status === "Pending") {
    badgeStyles = "bg-amber-50 text-amber-800 border border-amber-200";
    icon = <Clock className={size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3"} />;
  } else {
    badgeStyles = "bg-slate-100 text-slate-700 border border-slate-300";
    icon = <Award className={size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3"} />;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-[11px]",
    lg: "px-3 py-1 text-xs",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${badgeStyles} ${sizeClasses} ${className}`}
    >
      {icon}
      <span>{status}</span>
    </span>
  );
}
