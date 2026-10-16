"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events & Calendar", href: "/events" },
    { label: "Membership", href: "/membership" },
    { label: "Academic Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 font-sans shadow-sm transition-all">
      {/* 1. Top Collegiate Institutional Utility Bar (University of San Diego style) */}
      <div className="bg-[#0A2540] text-slate-200 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#0E355C]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 truncate">
            <span className="font-semibold text-white tracking-wide uppercase">
              University of Saint Louis Tuguegarao
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              School of Accountancy, Business, & Hospitality
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-[#C5A059] font-medium">
              BS Management Accounting (BSMA)
            </span>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0 text-[11px]">
            <Link
              href="/membership#lookup"
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden xs:inline">Student Verification</span>
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-white transition-colors hidden sm:inline"
            >
              Campus Desk
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-[#0A2540] text-[#C5A059] flex items-center justify-center font-serif font-black text-xl shadow-sm border border-[#C5A059]/40 group-hover:scale-[1.02] transition-transform">
              JP
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#0A2540] leading-tight">
                JPAMA USLT
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Junior Philippine Association of Management Accountants
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors duration-150 relative ${
                    active
                      ? "text-[#0A2540] after:content-[''] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-[#C5A059]"
                      : "text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 rounded-md"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/membership#lookup"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A2540]" />
              <span>Verify Status</span>
            </Link>

            <Link
              href="/membership"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0A2540] hover:bg-[#14487A] rounded-md shadow-sm transition-all"
            >
              Apply / Register
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/membership"
              className="px-3 py-1.5 text-xs font-bold uppercase text-white bg-[#0A2540] rounded-md"
            >
              Apply
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0A2540] hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#0A2540]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg">
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

          <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/membership#lookup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md"
            >
              Verify Membership Status
            </Link>
            <Link
              href="/membership"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0A2540] rounded-md"
            >
              Apply / Register (BSMA)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
