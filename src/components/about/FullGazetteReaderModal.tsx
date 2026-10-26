"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  Search,
  BookOpen,
  ShieldCheck,
  Bookmark,
  Share2,
  Check,
  FileText,
} from "lucide-react";
import { ByLawArticle } from "@/config/jpamaSettings";

/** Converts any Google Drive share URL to a /preview embed URL (blocks Drive UI access) */
function toDrivePreviewUrl(url: string): string {
  if (!url) return "";
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

interface FullGazetteReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: ByLawArticle[];
  initialArticleId?: string;
  use_pdf?: boolean;
  pdf_url?: string;
}

export default function FullGazetteReaderModal({
  isOpen,
  onClose,
  articles,
  initialArticleId,
  use_pdf = false,
  pdf_url = "",
}: FullGazetteReaderModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string>(initialArticleId || "all");
  const [copied, setCopied] = useState(false);
  const embedUrl = use_pdf && pdf_url ? toDrivePreviewUrl(pdf_url) : "";

  React.useEffect(() => {
    if (initialArticleId) {
      setSelectedArticleId(initialArticleId);
    }
  }, [initialArticleId]);

  const filteredArticles = useMemo(() => {
    let list = articles;
    if (selectedArticleId !== "all") {
      list = list.filter((a) => a.id === selectedArticleId);
    }
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter((a) => {
      const inTitle = a.title.toLowerCase().includes(query) || a.articleNumber.toLowerCase().includes(query);
      const inSummary = a.summary.toLowerCase().includes(query);
      const inSections = a.sections.some(
        (s) =>
          s.content.toLowerCase().includes(query) ||
          (s.title && s.title.toLowerCase().includes(query)) ||
          (s.subpoints && s.subpoints.some((sub) => sub.toLowerCase().includes(query)))
      );
      return inTitle || inSummary || inSections;
    });
  }, [articles, selectedArticleId, searchQuery]);

  if (!isOpen) return null;

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
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#FAF9F5] text-slate-800 rounded-2xl shadow-2xl border border-amber-300/40 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
        >
          {/* Top Control Bar (Hidden on print) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-[#0A2540] text-white border-b border-[#14487A] flex-shrink-0 print:hidden">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span className="font-serif font-bold text-sm tracking-wide text-white">
                CONSTITUTION & BY-LAWS GAZETTE EDITION
              </span>
              <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-[#E8C97A] border border-amber-500/30">
                {use_pdf && pdf_url ? "PDF Edition" : "11 Articles Promulgated"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Print or Save PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Print Gazette</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
                aria-label="Close gazette"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Mode */}
          {use_pdf && embedUrl ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                This document is displayed in read-only mode. Access to the source file is restricted.
              </div>
              <iframe
                src={embedUrl}
                className="flex-1 w-full"
                style={{ minHeight: "70vh", border: "none" }}
                title="JPAMA Constitution & By-Laws Gazette Edition"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          ) : (
          <>
          {/* Subheader: Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3 bg-white border-b border-slate-200 text-xs flex-shrink-0 print:hidden">
            {/* Table of contents dropdown */}
            <div className="flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <label htmlFor="article-select" className="font-semibold text-slate-700 whitespace-nowrap">
                Jump to Article:
              </label>
              <select
                id="article-select"
                value={selectedArticleId}
                onChange={(e) => setSelectedArticleId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
              >
                <option value="all">Entire Constitution (All 11 Articles)</option>
                {articles.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.articleNumber}: {art.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clauses or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Main Reading Canvas */}
          <div className="overflow-y-auto p-6 sm:p-10 lg:p-14 space-y-10 font-serif leading-relaxed flex-1">
            {/* Formal Gazette Masthead */}
            <div className="text-center pb-8 border-b-2 border-double border-amber-900/30 space-y-3">
              <div className="flex items-center justify-center gap-4">
                <img
                  src="/jpama-logo.jpg"
                  alt="Official Seal"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-amber-300 shadow-sm"
                />
                <div className="text-left font-sans">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-[#9E7D38]">
                    School of Accountancy, Business, and Hospitality
                  </p>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0A2540]">
                    JUNIOR PHILIPPINE ASSOCIATION OF MANAGEMENT ACCOUNTANTS
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    University of Saint Louis Tuguegarao • Mabini Campus
                  </p>
                </div>
              </div>

              <div className="pt-3 max-w-xl mx-auto border-t border-slate-200/80">
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#C5A059] uppercase">
                  CONSTITUTION AND BY-LAWS
                </h2>
                <p className="font-sans text-[11px] text-slate-500 italic mt-0.5">
                  Promulgated by the General Assembly • Chartered under the SABH Collegiate Faculty
                </p>
              </div>
            </div>

            {/* Articles List */}
            {filteredArticles.length === 0 ? (
              <div className="py-12 text-center font-sans space-y-2 text-slate-500">
                <p className="text-sm">No articles or clauses matched "{searchQuery}".</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedArticleId("all");
                  }}
                  className="text-xs text-[#0A2540] font-semibold underline"
                >
                  Reset filters and show full text
                </button>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <article
                  key={article.id}
                  id={article.id}
                  className="space-y-6 pb-8 border-b border-slate-200 last:border-b-0"
                >
                  {/* Article Title Banner */}
                  <div className="text-center space-y-1">
                    <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#C5A059] bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                      {article.articleNumber}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0A2540] tracking-wide mt-2">
                      {article.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 italic max-w-xl mx-auto">
                      {article.summary}
                    </p>
                  </div>

                  {/* Sections */}
                  <div className="space-y-5 max-w-3xl mx-auto">
                    {article.sections.map((section, sIdx) => (
                      <div
                        key={section.sectionNumber || sIdx}
                        className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2.5 text-justify"
                      >
                        <div className="flex items-baseline gap-2 font-sans font-bold text-sm text-[#0A2540]">
                          <span className="text-[#9E7D38]">{section.sectionNumber}.</span>
                          {section.title && <span className="font-serif">{section.title}</span>}
                        </div>

                        <p className="text-slate-800 text-[15px] sm:text-[15.5px] leading-relaxed">
                          {section.content}
                        </p>

                        {section.subpoints && section.subpoints.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-[#C5A059] space-y-1.5 font-sans text-xs text-slate-600">
                            {section.subpoints.map((sub, subIdx) => (
                              <p key={subIdx} className="leading-normal">
                                • {sub}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              ))
            )}

            {/* Gazette Official Seal & Promulgation Sign-off */}
            <div className="pt-8 border-t-2 border-double border-amber-900/30 text-center font-sans space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Certified Official Record of the JPAMA USLT Chapter</span>
              </div>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Promulgated to govern the Bachelor of Science in Management Accounting assembly in fidelity to university standards and collegiate honor.
              </p>
            </div>
          </div>
          </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
