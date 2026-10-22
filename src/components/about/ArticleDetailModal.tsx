"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building,
  Newspaper,
  CheckCircle2,
} from "lucide-react";
import { ByLawArticle } from "@/config/jpamaSettings";

interface ArticleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ByLawArticle | null;
  onSwitchToGazetteView: (article: ByLawArticle) => void;
}

export default function ArticleDetailModal({
  isOpen,
  onClose,
  article,
  onSwitchToGazetteView,
}: ArticleDetailModalProps) {
  if (!isOpen || !article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-3xl bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#0A2540] text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059] text-[#0A2540] font-bold text-xs uppercase tracking-wider">
                {article.articleNumber}
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-md">
                {article.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSwitchToGazetteView(article)}
                className="px-3 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#d6b26b] text-[#0A2540] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                title="Switch to Gazette / Newsletter View"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gazette Edition</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader summary */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#9E7D38] flex-shrink-0" />
            <p className="italic">{article.summary}</p>
          </div>

          {/* Verbatim Sections */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
            {article.sections.map((section, idx) => (
              <div
                key={section.sectionNumber || idx}
                className="p-5 rounded-xl border border-slate-200/90 bg-[#FAFBFD] hover:border-amber-300/80 transition-colors space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[#0A2540] font-bold text-xs">
                    {section.sectionNumber}
                  </span>
                  {section.title && (
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#0A2540]">
                      {section.title}
                    </h3>
                  )}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed text-justify">
                  {section.content}
                </p>

                {section.subpoints && section.subpoints.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-[#C5A059]/50 text-xs text-slate-600">
                    {section.subpoints.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7D38] flex-shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>JPAMA USLT Constitution & By-Laws</span>
            </div>

            <button
              onClick={() => onSwitchToGazetteView(article)}
              className="text-[#0A2540] hover:text-[#C5A059] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View formatted institutional gazette</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
