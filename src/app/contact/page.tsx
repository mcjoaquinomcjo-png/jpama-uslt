"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Clock,
  Send,
  Check,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { DEFAULT_CONTACT_CONTENT, ContactContent } from "@/lib/siteContent";

export default function ContactPage() {
  const [content, setContent] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [inquiryType, setInquiryType] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jpama_contact_content");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {}

    fetch(`/api/settings/contact?_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setContent(res.data);
          try {
            localStorage.setItem("jpama_contact_content", JSON.stringify(res.data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSubmitted(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: `[${inquiryType}] ${subject.trim()}`,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg(data.error || "Failed to submit message.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. Page Header */}
      <section className="bg-white border-b border-slate-200 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0A2540] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>Executive Secretariat & Student Desk</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            Contact <span className="text-[#C5A059]">JPAMA USLT</span>
          </h1>

          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Have questions regarding membership, upcoming assemblies, or academic reviewers? Reach out to our Secretariat desk.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#0A2540] border-b border-slate-100 pb-3">
                {content.desk_name}
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">{content.address_heading}</strong>
                    <span className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {content.address_body}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">{content.email_heading}</strong>
                    <a href={`mailto:${content.email_address}`} className="text-[#0A2540] font-medium hover:underline">
                      {content.email_address}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">{content.hours_heading}</strong>
                    <span className="text-slate-600 whitespace-pre-line">
                      {content.hours_body}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Facebook className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">Facebook Page</strong>
                    <a
                      href={content.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A2540] font-medium hover:underline block"
                    >
                      {content.facebook_label}
                    </a>
                  </div>
                </div>

                {content.linkedin_url && (
                  <div className="flex items-start gap-3">
                    <Linkedin className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-800">Professional Network</strong>
                      <a
                        href={content.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A2540] font-medium hover:underline block"
                      >
                        {content.linkedin_label || "JPAMA Official LinkedIn"}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#EAF2FA] rounded-xl border border-blue-200 p-5 text-xs text-[#0A2540] space-y-1">
              <strong className="block font-semibold">{content.inquiry_card_title}</strong>
              <p className="text-slate-600">
                {content.inquiry_card_desc}
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-xl text-[#0A2540]">
                Send a Message to Secretariat
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We typically respond within 24 to 48 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3 animate-fadeIn text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Message Sent Successfully!</span>
                </div>
                <p>
                  Thank you for reaching out. The Executive Secretariat has received your correspondence and will reply via your institutional email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#0A2540] text-white rounded text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-slate-700">
                        Official Email Address *
                      </label>
                      <span className="text-[10px] text-[#9E7D38] font-bold">
                        Required for response
                      </span>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@uslt.edu.ph (or Gmail/Outlook)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                    <span className="block text-[10.5px] text-slate-500 mt-1">
                      Our Secretariat responds directly to this address via Outlook / Gmail.
                    </span>
                  </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Membership & Pinning">Membership & Pinning</option>
                      <option value="Event RSVP & Attendance">Event RSVP & Attendance</option>
                      <option value="Academic Reviewers">Academic Reviewers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Transmitting..." : "Send Message to Secretariat"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
