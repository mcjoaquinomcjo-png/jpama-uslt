"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  Calendar,
  User,
  Tag,
  BookOpen,
  Share2,
  Check,
  Building,
  Quote,
} from "lucide-react";
import { PublicationContent } from "@/config/jpamaSettings";

interface PublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PublicationContent | null;
  publicationType?: "Gazette Article" | "Constitution Clause" | "Executive Dispatch";
}

export default function PublicationModal({
  isOpen,
  onClose,
  data,
  publicationType = "Gazette Article",
}: PublicationModalProps) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-[#FCFBF8] text-[#1A202C] rounded-2xl shadow-2xl border border-amber-200/60 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
        >
          {/* Header Action Bar (Hidden on print) */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-[#0A2540] text-white border-b border-[#14487A] flex-shrink-0 print:hidden">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#E8C97A]">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>{publicationType}</span>
              {data.issueNumber && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80 font-normal">{data.issueNumber}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Share link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
                aria-label="Close publication modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Publication Body */}
          <div ref={printRef} className="overflow-y-auto p-6 sm:p-10 lg:p-12 space-y-8 font-serif leading-relaxed">
            {/* Masthead Banner */}
            <div className="text-center pb-6 border-b-2 border-double border-amber-900/30 space-y-3">
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/jpama-logo.jpg"
                  alt="JPAMA Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full border border-amber-300 shadow-sm"
                />
                <div className="text-left font-sans">
                  <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#9E7D38]">
                    Official Publication & Dispatch
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#0A2540]">
                    THE SIHAYA GAZETTE
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Junior Philippine Association of Management Accountants • SABH USLT
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] font-sans text-slate-500 pt-2 border-t border-slate-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#9E7D38]" /> {data.datePublished}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#9E7D38]" /> {data.author}
                </span>
                {data.issueNumber && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{data.issueNumber}</span>
                  </>
                )}
              </div>
            </div>

            {/* Article Headline */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2540] tracking-tight leading-snug">
                {data.headline}
              </h1>

              {data.tags && data.tags.length > 0 && (
                <div className="flex items-center justify-center gap-2 flex-wrap font-sans text-xs pt-1">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-amber-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pull Quote Callout (if available) */}
            {data.pullQuote && (
              <div className="my-6 p-5 sm:p-6 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border-l-4 border-[#C5A059] rounded-r-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <Quote className="w-8 h-8 text-[#C5A059]/40 flex-shrink-0 -mt-1" />
                  <p className="font-serif italic text-base sm:text-lg text-[#0A2540] font-medium leading-relaxed">
                    "{data.pullQuote}"
                  </p>
                </div>
              </div>
            )}

            {/* Full Story Content with Editorial Typography */}
            <div
              className="prose prose-slate max-w-none text-[#2D3748] text-[15px] sm:text-[16px] leading-relaxed space-y-4 text-justify font-serif
                [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-[#C5A059] [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:leading-none"
              dangerouslySetInnerHTML={{ __html: data.fullArticleHtml }}
            />

            {/* Sign-off Seal & Footer */}
            <div className="pt-8 mt-10 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#9E7D38]" />
                <span>School of Accountancy, Business, and Hospitality • University of Saint Louis Tuguegarao</span>
              </div>
              <div className="text-[11px] font-semibold text-[#0A2540]">
                JPAMA Sihaya Executive Archives
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
