"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Lock,
  ChevronRight,
} from "lucide-react";
import JpamaLogo from "@/components/JpamaLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events & Calendar", href: "/events" },
    { label: "Membership", href: "/membership" },
    { label: "Alumni", href: "/alumni" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 font-sans shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center h-[72px] gap-4">

          {/* ── LOGO ── fixed-width, never shrinks */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <JpamaLogo size="md" variant="badge" className="group-hover:scale-[1.02] transition-transform" />

            {/* Full Title — never truncated */}
            <div className="hidden md:flex flex-col flex-shrink-0">
              <span className="font-serif text-[11px] lg:text-[12px] xl:text-[13px] font-bold tracking-tight text-[#0A2540] leading-tight group-hover:text-[#14487A] transition-colors whitespace-nowrap">
                Junior Philippine Association of Management Accountants
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                University of Saint Louis Tuguegarao
              </span>
            </div>
          </Link>

          {/* ── NAV LINKS (center, shrink-able) ── */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-2 text-[12.5px] font-semibold transition-colors whitespace-nowrap relative ${
                    active
                      ? "text-[#0A2540] after:content-[''] after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-[#C5A059]"
                      : "text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 rounded-md"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── ADMIN BUTTON — always visible on ≥sm, pushed to right ── */}
          <div className="ml-auto flex-shrink-0 hidden sm:flex items-center">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white bg-[#0A2540] hover:bg-[#14487A] rounded-lg shadow-sm transition-all"
              title="Officer Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* ── HAMBURGER (mobile only) ── */}
          <div className="flex xl:hidden items-center ml-auto sm:ml-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0A2540] hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#0A2540]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-semibold ${
                  active
                    ? "bg-[#EAF2FA] text-[#0A2540] border-l-4 border-[#0A2540]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-100">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0A2540] rounded-md shadow-sm flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
