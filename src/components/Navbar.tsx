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
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Wordmark: JPAMA badge + clean two-tier university title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* JPAMA Emblem Badge */}
            <div className="h-11 px-2.5 rounded-lg bg-[#0A2540] text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm tracking-widest shadow-sm border border-[#C5A059]/40 group-hover:border-[#C5A059] transition-all flex-shrink-0">
              <span>JPAMA</span>
            </div>

            {/* Custom two-tier hierarchy: Organization name (larger) + University name (smaller) */}
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#0A2540] leading-snug group-hover:text-[#14487A] transition-colors">
                Junior Philippine Association of Management Accountants
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                University of Saint Louis Tuguegarao
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
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

          {/* Action Buttons: Officer Admin + Apply / Register */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/admin"
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5"
              title="Officer Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#0A2540]" />
              <span>Officer Admin</span>
            </Link>

            <Link
              href="/membership"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0A2540] hover:bg-[#14487A] rounded-md shadow-sm transition-all"
            >
              Apply / Register
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
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

          <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/membership"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0A2540] rounded-md shadow-sm"
            >
              Apply / Register (BSMA)
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#0A2540]" />
              <span>Officer Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
