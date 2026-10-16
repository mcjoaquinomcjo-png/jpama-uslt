"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { INITIAL_EVENTS, PAST_EVENTS } from "@/lib/store";

export default function EventsCalendarPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "archives">("upcoming");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Interactive Monthly Calendar State (default: October 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const categories = ["All", "Leadership", "Academic", "Webinar", "Competition"];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper for calendar days
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // Find events matching calendar days
  const getEventsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    return INITIAL_EVENTS.filter((e) => e.event_date.startsWith(dateStr));
  };

  // Filtered upcoming events list
  const filteredUpcoming = INITIAL_EVENTS.filter((ev) => {
    const matchesCategory = selectedCategory === "All" || ev.category === selectedCategory;
    const matchesQuery =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || ev.event_date.startsWith(selectedDate);
    return matchesCategory && matchesQuery && matchesDate;
  });

  return (
    <div className="flex flex-col bg-[#F8FAFC] text-slate-800 font-sans min-h-screen">
      {/* 1. Page Header */}
      <section className="bg-white border-b border-slate-200 py-12 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            BSMA CHAPTER CALENDAR
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
            Events & <span className="text-[#C5A059]">Calendar</span>
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
            Stay updated with upcoming assemblies, academic masterclasses, and convocations at Bulwagang San Jacinto.
          </p>

          {/* Tab Switcher */}
          <div className="pt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => { setActiveTab("upcoming"); setSelectedDate(null); }}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Upcoming Assemblies ({INITIAL_EVENTS.length})
            </button>
            <button
              onClick={() => setActiveTab("archives")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === "archives"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Past Event Archives ({PAST_EVENTS.length})
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CALENDAR & EVENTS CONTAINER */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {activeTab === "upcoming" ? (
          <div className="space-y-8">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search event title or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#0A2540]" /> Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#0A2540] text-white font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Calendar + Scrollable Upcoming Events List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Standard Interactive Monthly Calendar */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#0A2540]" />
                    <h3 className="font-serif font-bold text-base text-[#0A2540]">
                      {monthNames[currentMonth]} {currentYear}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase py-1">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before month start */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 rounded"></div>
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const formattedDay = day < 10 ? `0${day}` : `${day}`;
                    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
                    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

                    const dayEvents = getEventsForDay(day);
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedDate(null);
                          } else {
                            setSelectedDate(dateStr);
                          }
                        }}
                        className={`h-10 rounded-lg flex flex-col items-center justify-center relative transition-all text-xs ${
                          isSelected
                            ? "bg-[#0A2540] text-white font-bold shadow-sm"
                            : hasEvents
                            ? "bg-[#EAF2FA] text-[#0A2540] font-bold hover:bg-[#D5E6F7]"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvents && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] -mt-0.5"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      Filter: <strong className="text-[#0A2540]">{selectedDate}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-xs text-[#0A2540] font-semibold hover:underline"
                    >
                      Clear Date Filter
                    </button>
                  </div>
                )}
                
                <p className="text-[11px] text-slate-400 italic">
                  💡 Click any highlighted date to filter events scheduled on that day.
                </p>
              </div>

              {/* Right Column: Scrollable Upcoming Events List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                    Upcoming Assemblies ({filteredUpcoming.length})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Click any assembly to view agenda & RSVP
                  </span>
                </div>

                {filteredUpcoming.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">No events found</p>
                    <p className="text-xs text-slate-500">
                      Try selecting another date or category from the filter above.
                    </p>
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="text-xs font-semibold text-[#0A2540] underline pt-2"
                      >
                        View all events
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                    {filteredUpcoming.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="block bg-white rounded-xl border border-slate-200 hover:border-[#0A2540] shadow-sm hover:shadow transition-all group overflow-hidden"
                      >
                        {/* Event Cover Image — 16:9 banner, gradient fallback */}
                        <div className="relative w-full h-40 bg-gradient-to-br from-[#0A2540] to-[#14487A] overflow-hidden flex-shrink-0">
                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover object-center opacity-90"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">{event.category}</span>
                              <span className="font-serif font-bold text-white text-sm leading-snug line-clamp-2">{event.title}</span>
                              <span className="text-[10px] text-slate-300 font-mono">
                                {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                          )}
                          {event.badge && (
                            <span className="absolute top-2 right-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400/90 text-amber-900">
                              {event.badge}
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-1.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF2FA] text-[#0A2540]">
                              {event.category}
                            </span>

                            <h4 className="font-serif font-bold text-base text-[#0A2540] group-hover:text-[#14487A] transition-colors">
                              {event.title}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {new Date(event.event_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {event.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                            <span className="text-xs font-semibold text-[#0A2540] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              RSVP Form →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: ARCHIVES */
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                Past Assemblies & Photo Archives
              </h3>
              <p className="text-xs text-slate-500">
                Memories and milestones from past Louisian Management Accounting gatherings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAST_EVENTS.map((archive) => (
                <div
                  key={archive.title}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-3 p-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{archive.date}</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {archive.attendees} Attendees
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#0A2540]">
                    {archive.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {archive.highlight}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    📍 {archive.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
