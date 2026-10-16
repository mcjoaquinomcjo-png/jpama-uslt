import React from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import JpamaLogo from "@/components/JpamaLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0A2540] text-slate-300 font-sans border-t border-[#0E355C]">
      {/* 1. Main Collegiate Header strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization & Affiliation */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <JpamaLogo size="sm" variant="crest" />
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  JPAMA USLT
                </h3>
                <p className="text-xs text-[#C5A059] font-medium">
                  Junior Philippine Association of Management Accountants
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Official recognized student organization for the <strong>Bachelor of Science in Management Accounting (BSMA)</strong> program under the School of Accountancy, Business, and Hospitality (SABH) at the University of Saint Louis Tuguegarao.
            </p>

            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
              <span>Bulwagang San Jacinto, USLT Mabini Campus, Tuguegarao City</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-[#14487A] pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the Chapter
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Calendar
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-white transition-colors">
                  Membership & Registration
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Academic Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Access & Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-[#14487A] pb-2">
              BSMA Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/membership#lookup" className="flex items-center gap-1.5 text-slate-300 hover:text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Verify Membership</span>
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-white transition-colors">
                  Apply for Membership
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#E8D8BA] text-slate-400 transition-colors flex items-center gap-1">
                  <span>🔒 Officer Admin Dashboard</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  <span>Official Facebook Page</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:jpama@uslt.edu.ph"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>jpama@uslt.edu.ph</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[#0E355C] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Junior Philippine Association of Management Accountants. All Rights Reserved.</p>
          <p className="text-slate-400">Bachelor of Science in Management Accounting (BSMA)</p>
        </div>
      </div>
    </footer>
  );
}
