"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Check,
  AlertCircle,
  ShieldCheck,
  Ticket,
  Download,
} from "lucide-react";
import { INITIAL_EVENTS } from "@/lib/store";
import { EventItem, RSVP } from "@/lib/types";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [studentNumber, setStudentNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState<RSVP | null>(null);
  const [rsvpError, setRsvpError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setEvent(data.data);
          setRsvpCount(data.data.rsvp_count || 0);
        } else {
          const fallback = INITIAL_EVENTS.find((e) => e.slug === slug);
          if (fallback) setEvent(fallback);
        }
      } catch (e) {
        const fallback = INITIAL_EVENTS.find((e) => e.slug === slug);
        if (fallback) setEvent(fallback);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber.trim() || !event) return;

    setRsvpSubmitting(true);
    setRsvpError("");
    setRsvpSuccess(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: event.id,
          student_number: studentNumber.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRsvpSuccess(data.data);
        setRsvpCount((prev) => prev + 1);
      } else {
        setRsvpError(data.error || "RSVP failed. Please verify your student number.");
      }
    } catch (err: any) {
      setRsvpError("Network error. Please try again.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <span className="text-[#0A2540] font-serif text-sm">Loading assembly details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#0A2540]">Event Not Found</h2>
        <Link
          href="/events"
          className="px-4 py-2 bg-[#0A2540] text-white font-semibold text-xs uppercase tracking-wider rounded-md"
        >
          Return to Calendar
        </Link>
      </div>
    );
  }

  const seatsLeft = Math.max(0, event.max_capacity - rsvpCount);

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A2540] hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chapter Calendar</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF2FA] text-[#0A2540]">
              {event.category}
            </span>
            <div className="flex items-center gap-2">
              {event.badge && (
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  {event.badge}
                </span>
              )}
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0A2540] border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors no-print"
                title="Download or Print Event Program (PDF)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Program Primer (PDF)</span>
              </button>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A2540] leading-tight">
            {event.title}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">DATE & TIME</span>
              <span className="text-slate-800 font-medium">
                {new Date(event.event_date).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">VENUE</span>
              <span className="text-slate-800 font-medium">{event.location}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">CAPACITY</span>
              <span className="text-slate-800 font-medium">
                {seatsLeft} of {event.max_capacity} seats available
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details & RSVP Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Agenda & Speakers */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0A2540] border-b border-slate-100 pb-2">
                Assembly Agenda
              </h3>

              {event.agenda && event.agenda.length > 0 ? (
                <div className="space-y-3">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <span className="font-mono font-semibold text-[#0A2540] bg-[#EAF2FA] px-2 py-1 rounded flex-shrink-0">
                        {item.time}
                      </span>
                      <span className="text-slate-700 pt-0.5">{item.activity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Detailed itinerary will be distributed upon entry.
                </p>
              )}
            </div>

            {event.speaker && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  RESOURCE SPEAKER
                </span>
                <h4 className="font-serif font-bold text-base text-[#0A2540]">
                  {event.speaker}
                </h4>
                <p className="text-xs text-slate-600">{event.speaker_role}</p>
              </div>
            )}
          </div>

          {/* Right: RSVP Card */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-28">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Ticket className="w-5 h-5 text-[#0A2540]" />
                <h3 className="font-serif font-bold text-base text-[#0A2540]">
                  Reserve Your Seat
                </h3>
              </div>

              {rsvpSuccess ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>RSVP Confirmed!</span>
                  </div>
                  <p>
                    Your seat has been reserved. Please bring your Louisian Student ID on the event day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRSVPSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      BSMA Student ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2023-01042"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dietary / Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Any specific note for Secretariat"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                    />
                  </div>

                  {rsvpError && (
                    <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700">
                      {rsvpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={rsvpSubmitting || seatsLeft <= 0}
                    className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors disabled:opacity-50"
                  >
                    {rsvpSubmitting ? "Submitting..." : seatsLeft <= 0 ? "Event Full" : "Confirm RSVP"}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Exclusive to registered BSMA students of USLT.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
