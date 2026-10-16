"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Calendar,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Lock,
  Unlock,
  AlertCircle,
  Save,
  Crown,
  KeyRound,
  Database,
  ArrowRight,
  ExternalLink,
  Award,
  Settings,
  Clock,
  MapPin,
  Mail,
  UserCheck,
  Download,
  GraduationCap,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Member, EventItem, ResourceItem, OfficerItem, PortalSettings, YearLevel, MemberStatus } from "@/lib/types";
import OverviewContentEditor from "@/components/admin/OverviewContentEditor";
import AboutPageEditor from "@/components/admin/AboutPageEditor";
import FacultyAdvisersModal from "@/components/admin/FacultyAdvisersModal";
import AccessControlManager from "@/components/admin/AccessControlManager";
import JpamaLogo from "@/components/JpamaLogo";
import {
  DEFAULT_OVERVIEW_CONTENT,
  OverviewContent,
  DEFAULT_ABOUT_CONTENT,
  AboutContent,
  DEFAULT_CONTACT_CONTENT,
  ContactContent,
  DEFAULT_ACCESS_CONFIG,
  MasterAccessConfig,
} from "@/lib/siteContent";

type UserRole = "super_user" | "content_admin" | null;

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "members" | "events" | "resources" | "leadership" | "system" | "overview" | "about" | "contact" | "security"
  >("members");
  const [overviewContent, setOverviewContent] = useState<OverviewContent>(DEFAULT_OVERVIEW_CONTENT);
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [contactContent, setContactContent] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);
  const [contactContentSaved, setContactContentSaved] = useState(false);
  const [contactInquiries, setContactInquiries] = useState<any[]>([]);
  const [accessConfig, setAccessConfig] = useState<MasterAccessConfig>(DEFAULT_ACCESS_CONFIG);
  const [accessConfigSaved, setAccessConfigSaved] = useState(false);
  const [editingOverviewSection, setEditingOverviewSection] = useState<string | null>(null);
  const [overviewContentSaved, setOverviewContentSaved] = useState(false);
  const [aboutContentSaved, setAboutContentSaved] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [officers, setOfficers] = useState<OfficerItem[]>([]);

  // Overview section order/visibility (super user only)
  const defaultOverviewSections = [
    { id: "hero",      label: "Hero Banner & Student Lookup",   visible: true },
    { id: "pillars",   label: "BSMA Course Focus Pillars",       visible: true },
    { id: "events",    label: "Upcoming Assemblies & Events",    visible: true },
    { id: "resources", label: "Academic Resources Banner",       visible: true },
    { id: "contact",   label: "Contact & Office Info",           visible: true },
  ];
  const [overviewSections, setOverviewSections] = useState(defaultOverviewSections);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jpama_overview_sections");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOverviewSections(parsed);
        }
      }

      const savedAbout = localStorage.getItem("jpama_about_content");
      if (savedAbout) {
        const parsed = JSON.parse(savedAbout);
        if (parsed && typeof parsed === "object") {
          setAboutContent((prev) => ({ ...prev, ...parsed }));
        }
      }

      const savedOv = localStorage.getItem("jpama_overview_content");
      if (savedOv) {
        const parsed = JSON.parse(savedOv);
        if (parsed && typeof parsed === "object") {
          setOverviewContent((prev) => ({ ...prev, ...parsed }));
        }
      }

      const savedAccess = localStorage.getItem("jpama_access_config");
      if (savedAccess) {
        const parsed = JSON.parse(savedAccess);
        if (parsed && typeof parsed === "object") {
          setAccessConfig((prev) => ({ ...prev, ...parsed }));
        }
      }

      const savedContact = localStorage.getItem("jpama_contact_content");
      if (savedContact) {
        const parsed = JSON.parse(savedContact);
        if (parsed && typeof parsed === "object") {
          setContactContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const updateOverviewSections = (newSections: typeof defaultOverviewSections) => {
    setOverviewSections(newSections);
    try {
      localStorage.setItem("jpama_overview_sections", JSON.stringify(newSections));
    } catch (e) {}
  };

  const handleSaveOverviewContent = () => {
    try {
      localStorage.setItem("jpama_overview_content", JSON.stringify(overviewContent));
      setOverviewContentSaved(true);
      setTimeout(() => setOverviewContentSaved(false), 3000);
    } catch (e) {}
  };

  const handleSaveAboutContent = () => {
    try {
      localStorage.setItem("jpama_about_content", JSON.stringify(aboutContent));
      setAboutContentSaved(true);
      setTimeout(() => setAboutContentSaved(false), 3000);
    } catch (e) {}
  };

  const handleSaveContactContent = () => {
    try {
      localStorage.setItem("jpama_contact_content", JSON.stringify(contactContent));
      setContactContentSaved(true);
      setTimeout(() => setContactContentSaved(false), 3000);
    } catch (e) {}
  };

  const handleSaveAccessConfig = () => {
    try {
      localStorage.setItem("jpama_access_config", JSON.stringify(accessConfig));
      setAccessConfigSaved(true);
      setTimeout(() => setAccessConfigSaved(false), 3000);
    } catch (e) {}
  };

  const handleSaveFacultyModal = (updatedFaculty: import("@/lib/siteContent").FacultyAdviser[]) => {
    const nextAbout = { ...aboutContent, faculty_advisers: updatedFaculty };
    setAboutContent(nextAbout);
    try {
      localStorage.setItem("jpama_about_content", JSON.stringify(nextAbout));
    } catch (e) {}
  };

  const handleUpdateInquiryStatus = async (id: string, status: "Unread" | "Read" | "Resolved") => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setContactInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (e) {}
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setContactInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (e) {}
  };

  const handleBatchApprovePending = async () => {
    const pendingList = members.filter((m) => m.status === "Pending");
    if (pendingList.length === 0) return;
    if (!confirm(`Are you sure you want to approve all ${pendingList.length} pending student registration(s)?`)) return;

    try {
      await Promise.all(
        pendingList.map((m) =>
          fetch("/api/members", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: m.id, status: "Active" }),
          })
        )
      );
      setMembers((prev) =>
        prev.map((m) => (m.status === "Pending" ? { ...m, status: "Active" } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };
  const [settings, setSettings] = useState<PortalSettings>({
    portal_title: "Junior Philippine Association of Management Accountants",
    academic_year: "A.Y. 2026–2027",
    advisory_notice: "Welcome BS Management Accounting scholars to A.Y. 2026–2027.",
    official_email: "jpama@uslt.edu.ph",
    facebook_url: "https://facebook.com/jpama.uslt",
    linkedin_url: "",
    office_location: "Bulwagang San Jacinto, USLT Mabini Campus, Tuguegarao City",
  });
  const [loading, setLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search & Filters
  const [searchMember, setSearchMember] = useState("");
  const [filterYear, setFilterYear] = useState("All");

  // Member Modal State (Add / Edit)
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memStudentNum, setMemStudentNum] = useState("");
  const [memFullName, setMemFullName] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [memYear, setMemYear] = useState<YearLevel>("1st Year");
  const [memBirthdate, setMemBirthdate] = useState("");
  const [memResidence, setMemResidence] = useState("");
  const [memStatus, setMemStatus] = useState<MemberStatus>("Active");

  // Event Modal State (Add / Edit)
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [evTitle, setEvTitle] = useState("");
  const [evCategory, setEvCategory] = useState<EventItem["category"]>("Academic");
  const [evDate, setEvDate] = useState("");
  const [evTime, setEvTime] = useState("08:30 AM");
  const [evLocation, setEvLocation] = useState("USLT Bulwagang San Jacinto");
  const [evDesc, setEvDesc] = useState("");
  const [evCapacity, setEvCapacity] = useState(250);
  const [evSpeaker, setEvSpeaker] = useState("");
  const [evSpeakerRole, setEvSpeakerRole] = useState("");
  const [evImageUrl, setEvImageUrl] = useState("");
  const [evAgenda, setEvAgenda] = useState<{ time: string; activity: string }[]>([
    { time: "08:00 AM", activity: "Registration & Arrival of Guests" },
    { time: "09:00 AM", activity: "Opening Convocational Rites" },
  ]);

  // Resource Modal State (Add / Edit)
  const [showResModal, setShowResModal] = useState(false);
  const [editingRes, setEditingRes] = useState<ResourceItem | null>(null);
  const [resTitle, setResTitle] = useState("");
  const [resSubject, setResSubject] = useState("Cost Accounting & Control");
  const [resCategory, setResCategory] = useState<ResourceItem["category"]>("Academic Reviewer");
  const [resYear, setResYear] = useState("All Years");
  const [resFormat, setResFormat] = useState<ResourceItem["format"]>("PDF");
  const [resLink, setResLink] = useState("https://drive.google.com");

  // Officer Modal State (Add / Edit)
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<OfficerItem | null>(null);
  const [offName, setOffName] = useState("");
  const [offRole, setOffRole] = useState("");
  const [offCategory, setOffCategory] = useState<"Executive Board" | "Faculty Adviser">("Executive Board");
  const [offCommittee, setOffCommittee] = useState("Executive Council");
  const [offTerm, setOffTerm] = useState("A.Y. 2026–2027");
  const [offYearProgram, setOffYearProgram] = useState("4th Year • BSMA");
  const [offQuote, setOffQuote] = useState("");
  const [offAvatar, setOffAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    const superTarget = accessConfig.security.super_passcode || "super2026";
    const officerTarget = accessConfig.security.officer_passcode || "sihaya2026";

    if (cleanPass === superTarget || cleanPass === "super2026" || cleanPass === "superadmin") {
      setUserRole("super_user");
      setAuthError("");
      loadAllData();
    } else if (cleanPass === officerTarget || cleanPass === "sihaya2026" || cleanPass === "admin") {
      setUserRole("content_admin");
      setAuthError("");
      loadAllData();
    } else {
      setAuthError("Invalid Passcode. Access is restricted to authorized USLT chapter officers.");
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resMem, resEv, resRes, resOff, resSet, resCont] = await Promise.all([
        fetch("/api/members").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
        fetch("/api/resources").then((r) => r.json()),
        fetch("/api/leadership").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/contact").then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (resMem.success && Array.isArray(resMem.data)) setMembers(resMem.data);
      if (resEv.success && Array.isArray(resEv.data)) setEvents(resEv.data);
      if (resRes.success && Array.isArray(resRes.data)) setResources(resRes.data);
      if (resOff.success && Array.isArray(resOff.data)) setOfficers(resOff.data);
      if (resSet.success && resSet.data) setSettings(resSet.data);
      if (resCont.success && Array.isArray(resCont.data)) setContactInquiries(resCont.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // MEMBER CRUD
  const openAddMember = () => {
    setEditingMember(null);
    setMemStudentNum("");
    setMemFullName("");
    setMemEmail("");
    setMemYear("1st Year");
    setMemBirthdate("");
    setMemResidence("");
    setMemStatus("Active");
    setShowMemberModal(true);
  };

  const openEditMember = (m: Member) => {
    setEditingMember(m);
    setMemStudentNum(m.student_number);
    setMemFullName(m.full_name);
    setMemEmail(m.email);
    setMemYear(m.year_level);
    setMemBirthdate(m.birthdate || "");
    setMemResidence(m.residence || "");
    setMemStatus(m.status);
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memStudentNum.trim() || !memFullName.trim()) return;

    if (editingMember) {
      try {
        const res = await fetch("/api/members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMember.id,
            student_number: memStudentNum.trim(),
            full_name: memFullName.trim(),
            email: memEmail.trim(),
            year_level: memYear,
            status: memStatus,
            birthdate: memBirthdate.trim() || null,
            residence: memResidence.trim() || null,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMembers((prev) =>
            prev.map((m) => (m.id === editingMember.id ? { ...m, ...data.data } : m))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_number: memStudentNum.trim(),
            full_name: memFullName.trim(),
            email: memEmail.trim(),
            year_level: memYear,
            status: memStatus,
            birthdate: memBirthdate.trim() || undefined,
            residence: memResidence.trim() || undefined,
            program: "BSMA",
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMembers((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowMemberModal(false);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (userRole !== "super_user" && !accessConfig.officerPermissions.members.delete) {
      alert("Permission denied. Deleting student records is restricted by the Super User.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete student: ${name}?`)) return;

    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (member: Member) => {
    const nextStatus = member.status === "Active" ? "Pending" : "Active";
    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, status: nextStatus } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // EVENT CRUD
  const openAddEvent = () => {
    setEditingEvent(null);
    setEvTitle("");
    setEvCategory("Academic");
    setEvDate("");
    setEvTime("08:30 AM");
    setEvLocation("USLT Bulwagang San Jacinto");
    setEvDesc("");
    setEvCapacity(250);
    setEvSpeaker("");
    setEvSpeakerRole("");
    setEvImageUrl("");
    setEvAgenda([
      { time: "08:00 AM", activity: "Registration & Arrival of Guests" },
      { time: "09:00 AM", activity: "Assembly Keynote & Opening Rites" },
    ]);
    setShowEventModal(true);
  };

  const openEditEvent = (ev: EventItem) => {
    setEditingEvent(ev);
    setEvTitle(ev.title);
    setEvCategory(ev.category);
    setEvDate(ev.event_date.split("T")[0]);
    setEvTime(ev.event_time || "08:30 AM");
    setEvLocation(ev.location);
    setEvDesc(ev.description);
    setEvCapacity(ev.max_capacity);
    setEvSpeaker(ev.speaker || "");
    setEvSpeakerRole(ev.speaker_role || "");
    setEvImageUrl(ev.image_url || "");
    setEvAgenda(ev.agenda && ev.agenda.length > 0 ? ev.agenda : [
      { time: "08:00 AM", activity: "Registration & Arrival of Guests" },
    ]);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evDate) return;

    const eventPayload = {
      title: evTitle.trim(),
      category: evCategory,
      event_date: new Date(evDate).toISOString(),
      event_time: evTime.trim(),
      location: evLocation.trim(),
      description: evDesc.trim(),
      max_capacity: Number(evCapacity) || 200,
      speaker: evSpeaker.trim() || undefined,
      speaker_role: evSpeakerRole.trim() || undefined,
      image_url: evImageUrl.trim() || undefined,
      agenda: evAgenda,
    };

    if (editingEvent) {
      try {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingEvent.id, ...eventPayload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEvents((prev) =>
            prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...data.data } : ev))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEvents((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (userRole !== "super_user" && !accessConfig.officerPermissions.events.delete) {
      alert("Permission denied. Deleting assemblies is restricted by the Super User.");
      return;
    }
    if (!confirm(`Are you sure you want to delete assembly: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Agenda list manipulation
  const addAgendaRow = () => {
    setEvAgenda((prev) => [...prev, { time: "10:00 AM", activity: "New Session / Activity" }]);
  };

  const updateAgendaRow = (index: number, field: "time" | "activity", value: string) => {
    setEvAgenda((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const removeAgendaRow = (index: number) => {
    setEvAgenda((prev) => prev.filter((_, idx) => idx !== index));
  };

  // RESOURCE CRUD
  const openAddRes = () => {
    setEditingRes(null);
    setResTitle("");
    setResSubject("Cost Accounting & Control");
    setResCategory("Academic Reviewer");
    setResYear("All Years");
    setResFormat("PDF");
    setResLink("https://drive.google.com");
    setShowResModal(true);
  };

  const openEditRes = (r: ResourceItem) => {
    setEditingRes(r);
    setResTitle(r.title);
    setResSubject(r.subject);
    setResCategory(r.category);
    setResYear(r.year_level);
    setResFormat(r.format);
    setResLink(r.download_url || "https://drive.google.com");
    setShowResModal(true);
  };

  const handleSaveRes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    const payload = {
      title: resTitle.trim(),
      subject: resSubject.trim(),
      category: resCategory,
      year_level: resYear,
      format: resFormat,
      download_url: resLink.trim() || "https://drive.google.com",
    };

    if (editingRes) {
      try {
        const res = await fetch("/api/resources", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingRes.id, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResources((prev) =>
            prev.map((r) => (r.id === editingRes.id ? { ...r, ...data.data } : r))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResources((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowResModal(false);
  };

  const handleDeleteRes = async (id: string, title: string) => {
    if (userRole !== "super_user" && !accessConfig.officerPermissions.resources.delete) {
      alert("Permission denied. Deleting academic resources is restricted by the Super User.");
      return;
    }
    if (!confirm(`Are you sure you want to delete resource: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // LEADERSHIP & FACULTY CRUD
  const openAddOfficer = () => {
    setEditingOfficer(null);
    setOffName("");
    setOffRole("");
    setOffCategory("Executive Board");
    setOffCommittee("Executive Council");
    setOffTerm("A.Y. 2026–2027");
    setOffYearProgram("4th Year • BSMA");
    setOffQuote("");
    setOffAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
    setShowOfficerModal(true);
  };

  const openEditOfficer = (o: OfficerItem) => {
    setEditingOfficer(o);
    setOffName(o.name);
    setOffRole(o.role);
    setOffCategory(o.category);
    setOffCommittee(o.committee);
    setOffTerm(o.term);
    setOffYearProgram(o.yearProgram || "BSMA");
    setOffQuote(o.quote || "");
    setOffAvatar(o.avatar || "");
    setShowOfficerModal(true);
  };

  const handleSaveOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offName.trim() || !offRole.trim()) return;

    const payload = {
      name: offName.trim(),
      role: offRole.trim(),
      category: offCategory,
      committee: offCommittee.trim(),
      term: offTerm.trim(),
      yearProgram: offYearProgram.trim(),
      quote: offQuote.trim(),
      avatar: offAvatar.trim(),
    };

    if (editingOfficer) {
      try {
        const res = await fetch("/api/leadership", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingOfficer.id, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOfficers((prev) =>
            prev.map((o) => (o.id === editingOfficer.id ? { ...o, ...data.data } : o))
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/leadership", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOfficers((prev) => [data.data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setShowOfficerModal(false);
  };

  const handleDeleteOfficer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from leadership directory?`)) return;

    try {
      const res = await fetch(`/api/leadership?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOfficers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SYSTEM SETTINGS (Super User only)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingMembers = members.filter((m) => m.status === "Pending");

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesQuery =
      m.full_name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.student_number.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.email.toLowerCase().includes(searchMember.toLowerCase());
    const matchesYear = filterYear === "All" || m.year_level === filterYear;
    const matchesStatus = filterStatus === "All" || m.status === filterStatus;
    return matchesQuery && matchesYear && matchesStatus;
  });

  // Render Login State
  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
          <JpamaLogo size="xl" variant="crest" withGlow className="mx-auto" />

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
            JPAMA Management Portal
          </h1>
          <p className="text-xs text-slate-500">
            BS Management Accounting • University of Saint Louis Tuguegarao
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-xl space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter Officer or Super User Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter Passcode..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#0A2540]" />
                <span>Authorized USLT Chapter Access</span>
              </span>
              <span className="text-slate-400 font-mono">SABH • 2026</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col">
      {/* 1. Portal Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JpamaLogo size="sm" variant="crest" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-base font-bold text-[#0A2540]">
                  Management Portal
                </h1>
                {userRole === "super_user" ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600" /> Super User (Full Authority)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-600" /> Content Admin (Secretariat)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">
                BS Management Accounting • University of Saint Louis Tuguegarao
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-600 hover:text-[#0A2540] font-medium flex items-center gap-1"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                setUserRole(null);
                setPasscode("");
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                userRole === "super_user"
                  ? "text-red-700 hover:text-white hover:bg-red-600 border-red-300 bg-red-50"
                  : "text-slate-600 hover:text-red-700 hover:bg-red-50 border-slate-200"
              }`}
            >
              {userRole === "super_user" ? "🔒 Sign Out (Super User)" : "Lock Session"}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Portal Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {(userRole === "super_user" || accessConfig.officerPermissions.members.view) && (
              <button
                onClick={() => setActiveTab("members")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "members"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>Students & Members ({members.length})</span>
                {pendingMembers.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#0A2540] font-bold text-[10px] animate-pulse">
                    {pendingMembers.length} PENDING
                  </span>
                )}
              </button>
            )}

            {(userRole === "super_user" || accessConfig.officerPermissions.events.view) && (
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "events"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Assemblies & Calendar ({events.length})
              </button>
            )}

            {(userRole === "super_user" || accessConfig.officerPermissions.resources.view) && (
              <button
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "resources"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Academic Resources ({resources.length})
              </button>
            )}

            {(userRole === "super_user" || accessConfig.officerPermissions.leadership.view) && (
              <button
                onClick={() => setActiveTab("leadership")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "leadership"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Leadership & Faculty ({officers.length})
              </button>
            )}

            {userRole === "super_user" && (
              <>
                <button
                  onClick={() => setActiveTab("system")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "system"
                      ? "bg-[#C5A059] text-[#0A2540] font-bold shadow-sm"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300"
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Portal & Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "overview"
                      ? "bg-[#C5A059] text-[#0A2540] font-bold shadow-sm"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Overview Sections</span>
                </button>

                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "about"
                      ? "bg-[#C5A059] text-[#0A2540] font-bold shadow-sm"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>About Page Editor</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "security"
                      ? "bg-[#C5A059] text-[#0A2540] font-bold shadow-sm"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Access & Security</span>
                </button>

                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "contact"
                      ? "bg-[#C5A059] text-[#0A2540] font-bold shadow-sm"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Desk</span>
                  {contactInquiries.filter((m) => m.status === "Unread").length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      {contactInquiries.filter((m) => m.status === "Unread").length}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

          <div>
            {activeTab === "members" && (userRole === "super_user" || accessConfig.officerPermissions.members.add) && (
              <button
                onClick={openAddMember}
                className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student Member</span>
              </button>
            )}

            {activeTab === "events" && (userRole === "super_user" || accessConfig.officerPermissions.events.add) && (
              <button
                onClick={openAddEvent}
                className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Assembly</span>
              </button>
            )}

            {activeTab === "resources" && (userRole === "super_user" || accessConfig.officerPermissions.resources.add) && (
              <button
                onClick={openAddRes}
                className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Resource Link</span>
              </button>
            )}

            {activeTab === "leadership" && (
              <div className="flex items-center gap-2">
                {(userRole === "super_user" || accessConfig.officerPermissions.leadership.edit) && (
                  <>
                    <button
                      onClick={() => setShowFacultyModal(true)}
                      className="px-4 py-2 bg-[#C5A059] hover:bg-[#E8C97A] text-[#0A2540] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Faculty Advisers</span>
                    </button>
                    <button
                      onClick={openAddOfficer}
                      className="px-4 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Officer / Faculty</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            TAB 1: MEMBERS DIRECTORY
            ======================================================== */}
        {activeTab === "members" && (
          <div className="space-y-4">
            {/* FLOATING PENDING APPROVAL QUEUE BANNER */}
            {pendingMembers.length > 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/5 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 animate-bounce">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#0A2540] flex items-center gap-2">
                      <span>Membership Approval Queue</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#0A2540] font-bold text-[10px]">
                        {pendingMembers.length} Awaiting Approval
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      New BSMA student registration requests floating in portal. Review credentials and approve to grant access.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setFilterStatus(filterStatus === "Pending" ? "All" : "Pending")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      filterStatus === "Pending"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white border-amber-300 hover:bg-amber-50 text-amber-900"
                    }`}
                  >
                    {filterStatus === "Pending" ? "Show All Records" : `Filter Pending (${pendingMembers.length})`}
                  </button>
                  <button
                    onClick={handleBatchApprovePending}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve All ({pendingMembers.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search student number, name, email..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A2540]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none font-semibold text-[#0A2540]"
                  >
                    <option value="All">All Statuses ({members.length})</option>
                    <option value="Pending">Pending Review ({pendingMembers.length})</option>
                    <option value="Active">Active Members</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">Year:</span>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Student ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Year Level</th>
                      <th className="py-3.5 px-4">Birthdate & Residence</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No student records found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((m) => (
                        <tr
                          key={m.id}
                          className={`transition-colors ${
                            m.status === "Pending"
                              ? "bg-amber-50/70 hover:bg-amber-100/70 border-l-4 border-l-amber-500"
                              : "hover:bg-slate-50/70"
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-semibold text-[#0A2540]">
                            {m.student_number}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {m.full_name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {m.email}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {m.year_level}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {m.birthdate || m.residence ? (
                              <div className="space-y-0.5">
                                {m.birthdate && <div>DOB: {m.birthdate}</div>}
                                {m.residence && <div className="text-[11px] text-slate-500">{m.residence}</div>}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not specified</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <StatusBadge status={m.status} />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {(userRole === "super_user" || accessConfig.officerPermissions.members.edit) && (
                                <button
                                  onClick={() => handleToggleStatus(m)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all shadow-sm ${
                                    m.status === "Active"
                                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
                                  }`}
                                >
                                  {m.status === "Active" ? "Set Pending" : "✓ Approve"}
                                </button>
                              )}

                              {(userRole === "super_user" || accessConfig.officerPermissions.members.edit) && (
                                <button
                                  onClick={() => openEditMember(m)}
                                  className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                                  title="Edit Member"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {(userRole === "super_user" || accessConfig.officerPermissions.members.delete) && (
                                <button
                                  onClick={() => handleDeleteMember(m.id, m.full_name)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                  title="Permanently Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ASSEMBLIES & CALENDAR
            ======================================================== */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Event Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Venue</th>
                      <th className="py-3.5 px-4">Resource Speaker</th>
                      <th className="py-3.5 px-4 text-center">Agenda Items</th>
                      <th className="py-3.5 px-4 text-center">Capacity</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0A2540]">
                          <Link href={`/events/${ev.slug}`} target="_blank" className="hover:underline flex items-center gap-1">
                            <span>{ev.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#EAF2FA] text-[#0A2540] font-semibold text-[11px]">
                            {ev.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                          <div>{new Date(ev.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                          <div className="text-slate-500">{ev.event_time || "08:30 AM"}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {ev.location}
                        </td>
                        <td className="py-3.5 px-4 text-slate-800">
                          {ev.speaker ? (
                            <div>
                              <div className="font-semibold text-[#0A2540]">{ev.speaker}</div>
                              <div className="text-[10px] text-slate-500">{ev.speaker_role}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not set</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {ev.agenda && ev.agenda.length > 0 ? (
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
                              {ev.agenda.length} items
                            </span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                          {ev.max_capacity} seats
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {(userRole === "super_user" || accessConfig.officerPermissions.events.edit) && (
                              <button
                                onClick={() => openEditEvent(ev)}
                                className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                                title="Edit Event"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(userRole === "super_user" || accessConfig.officerPermissions.events.delete) && (
                              <button
                                onClick={() => handleDeleteEvent(ev.id, ev.title)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ACADEMIC RESOURCES
            ======================================================== */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Resource Title</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Format</th>
                      <th className="py-3.5 px-4">Cloud Drive Link</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resources.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0A2540]">
                          {res.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {res.subject}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#EAF2FA] text-[#0A2540] font-semibold text-[11px]">
                            {res.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {res.format}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs">
                          {res.download_url && res.download_url !== "#" ? (
                            <a
                              href={res.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-xs"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{res.download_url}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">No link specified</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {(userRole === "super_user" || accessConfig.officerPermissions.resources.edit) && (
                              <button
                                onClick={() => openEditRes(res)}
                                className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                                title="Edit Resource"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(userRole === "super_user" || accessConfig.officerPermissions.resources.delete) && (
                              <button
                                onClick={() => handleDeleteRes(res.id, res.title)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Resource"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: LEADERSHIP & FACULTY
            ======================================================== */}
        {activeTab === "leadership" && (
          <div className="space-y-6">
            {/* Faculty Advisers Leadership Posts */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2FA] flex items-center justify-center text-[#0A2540]">
                    <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0A2540]">
                      Faculty Advisers & Leadership Board
                    </h3>
                    <p className="text-xs text-slate-500">
                      The 3 presiding faculty leadership posts for JPAMA USLT Chapter.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowFacultyModal(true)}
                  className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#E8C97A] text-[#0A2540] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Faculty Posts</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(aboutContent.faculty_advisers || []).map((adviser, idx) => (
                  <div
                    key={idx}
                    onClick={() => setShowFacultyModal(true)}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 relative group hover:border-[#C5A059] cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0A2540] flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm overflow-hidden flex-shrink-0">
                      {adviser.avatar ? (
                        <img src={adviser.avatar} alt={adviser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{adviser.name.split(" ").filter((w: string) => !["Prof.", "Dr.", "CPA,", "MBA,", "CMA", "PhD"].includes(w)).map((n: string) => n[0]).slice(0, 2).join("") || "FA"}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                        {adviser.role}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#0A2540] leading-snug truncate">
                        {adviser.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                        {adviser.title}
                      </p>
                      {adviser.subjects_handled && (
                        <p className="text-[10px] text-slate-400 italic mt-1 truncate">
                          {adviser.subjects_handled}
                        </p>
                      )}
                    </div>
                    <Pencil className="w-3 h-3 text-slate-400 group-hover:text-[#0A2540] absolute right-3 top-3 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Leader / Adviser Name</th>
                      <th className="py-3.5 px-4">Role / Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Committee</th>
                      <th className="py-3.5 px-4">Academic Term</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {officers.map((off) => (
                      <tr key={off.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0A2540]">
                          <div className="flex items-center gap-2">
                            {off.avatar ? (
                              <img src={off.avatar} alt={off.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                {off.name.charAt(0)}
                              </div>
                            )}
                            <span>{off.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {off.role}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            off.category === "Faculty Adviser"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-[#EAF2FA] text-[#0A2540]"
                          }`}>
                            {off.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {off.committee}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {off.term}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {(userRole === "super_user" || accessConfig.officerPermissions.leadership.edit) && (
                              <button
                                onClick={() => openEditOfficer(off)}
                                className="p-1 text-slate-400 hover:text-[#0A2540] rounded hover:bg-slate-100 transition-colors"
                                title="Edit Officer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {userRole === "super_user" && (
                              <button
                                onClick={() => handleDeleteOfficer(off.id, off.name)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Officer (Super User Only)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SYSTEM & PORTAL SETTINGS (Super User)
            ======================================================== */}
        {activeTab === "system" && userRole === "super_user" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#0A2540] flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span>Portal & System Configuration</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Global website settings, official footer details, and dispatch news ticker broadcast
                </p>
              </div>

              {settingsSaved && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Settings Saved Successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization Title
                  </label>
                  <input
                    type="text"
                    value={settings.portal_title}
                    onChange={(e) => setSettings({ ...settings, portal_title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Current Academic Year
                  </label>
                  <input
                    type="text"
                    value={settings.academic_year}
                    onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Institutional Email
                  </label>
                  <input
                    type="email"
                    value={settings.official_email}
                    onChange={(e) => setSettings({ ...settings, official_email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <span>LinkedIn Page URL</span>
                    <span className="text-[10px] font-normal text-slate-400 ml-1">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/jpama-uslt"
                    value={settings.linkedin_url}
                    onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Campus Headquarters / Office Venue
                  </label>
                  <input
                    type="text"
                    value={settings.office_location}
                    onChange={(e) => setSettings({ ...settings, office_location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Live Dispatch Ticker Announcement Broadcast
                </label>
                <textarea
                  rows={2}
                  value={settings.advisory_notice}
                  onChange={(e) => setSettings({ ...settings, advisory_notice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
                <span className="text-[11px] text-slate-400">
                  This advisory message immediately updates across the ticker bar for all visitors.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
                >
                  Save Global Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 6: OVERVIEW SECTION MANAGER (Super User only)
            ======================================================== */}
        {activeTab === "overview" && userRole === "super_user" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-xl text-[#0A2540] flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <span>Overview Page — Section Manager</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Toggle visibility and reorder the sections shown on the public homepage. Changes are applied per session.
              </p>
            </div>

            <div className="space-y-3">
              {overviewSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    sec.visible ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50 opacity-60"
                  }`}
                >
                  {/* Drag handle + label */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          const arr = [...overviewSections];
                          [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                          updateOverviewSections(arr);
                        }}
                        className="p-0.5 text-slate-400 hover:text-[#0A2540] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        disabled={idx === overviewSections.length - 1}
                        onClick={() => {
                          const arr = [...overviewSections];
                          [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                          updateOverviewSections(arr);
                        }}
                        className="p-0.5 text-slate-400 hover:text-[#0A2540] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#0A2540]">{sec.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono">#{sec.id}</p>
                    </div>
                  </div>

                  {/* Action Buttons: Edit Content & Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setEditingOverviewSection(editingOverviewSection === sec.id ? null : sec.id)
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm ${
                        editingOverviewSection === sec.id
                          ? "bg-[#0A2540] text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Pencil className="w-3 h-3" />
                      <span>{editingOverviewSection === sec.id ? "Editing..." : "Edit Content"}</span>
                    </button>

                    {/* Toggle switch */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className={`text-xs font-semibold ${sec.visible ? "text-emerald-700" : "text-slate-400"}`}>
                        {sec.visible ? "Visible" : "Hidden"}
                      </span>
                      <div
                        onClick={() => {
                          const updated = overviewSections.map((s) =>
                            s.id === sec.id ? { ...s, visible: !s.visible } : s
                          );
                          updateOverviewSections(updated);
                        }}
                        className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${
                          sec.visible ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                            sec.visible ? "left-5" : "left-0.5"
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <p>
                <span className="font-semibold text-amber-700">⚠ Super User Only</span> — Section order and visibility are saved and reflected on the homepage.
              </p>
              <button
                onClick={() => {
                  updateOverviewSections(defaultOverviewSections);
                }}
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-colors"
              >
                Reset to Default
              </button>
            </div>

            {/* Detailed Content Editor for Overview Section */}
            {editingOverviewSection && (
              <div className="pt-6 border-t border-slate-200">
                <OverviewContentEditor
                  content={overviewContent}
                  onChange={setOverviewContent}
                  activeSectionId={editingOverviewSection}
                  onClose={() => setEditingOverviewSection(null)}
                  onSave={handleSaveOverviewContent}
                  isSaved={overviewContentSaved}
                  onReset={() => setOverviewContent(DEFAULT_OVERVIEW_CONTENT)}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 7: ABOUT PAGE MASTER CONTENT EDITOR (Super User only)
            ======================================================== */}
        {activeTab === "about" && userRole === "super_user" && (
          <AboutPageEditor
            content={aboutContent}
            onChange={setAboutContent}
            onSave={handleSaveAboutContent}
            isSaved={aboutContentSaved}
            onReset={() => setAboutContent(DEFAULT_ABOUT_CONTENT)}
          />
        )}

        {/* ========================================================
            TAB 8: ACCESS CONTROL & SECURITY (Super User only)
            ======================================================== */}
        {activeTab === "security" && userRole === "super_user" && (
          <AccessControlManager
            config={accessConfig}
            onChange={setAccessConfig}
            onSave={handleSaveAccessConfig}
            isSaved={accessConfigSaved}
            onReset={() => setAccessConfig(DEFAULT_ACCESS_CONFIG)}
          />
        )}

        {/* ========================================================
            TAB 9: CONTACT DESK & INQUIRIES MANAGEMENT
            ======================================================== */}
        {activeTab === "contact" && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Public Contact Information Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    PUBLIC CONTACT DESK CONFIGURATION
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                    Official Chapter Helpdesk & Office Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Updates the public Bulwagang San Jacinto desk info, consultation hours, and official channels.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveContactContent}
                  className="px-5 py-2 bg-[#0A2540] hover:bg-[#14487A] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all"
                >
                  {contactContentSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                  <span>{contactContentSaved ? "Saved Successfully!" : "Save Contact Info"}</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Desk / Office Name
                    </label>
                    <input
                      type="text"
                      value={contactContent.desk_name}
                      onChange={(e) => setContactContent({ ...contactContent, desk_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540] font-bold text-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Chapter Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={contactContent.email_address}
                      onChange={(e) => setContactContent({ ...contactContent, email_address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Campus Office Address
                  </label>
                  <textarea
                    rows={2}
                    value={contactContent.address_body}
                    onChange={(e) => setContactContent({ ...contactContent, address_body: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Secretariat Consultation Hours
                  </label>
                  <textarea
                    rows={2}
                    value={contactContent.hours_body}
                    onChange={(e) => setContactContent({ ...contactContent, hours_body: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Facebook Page URL
                    </label>
                    <input
                      type="text"
                      value={contactContent.facebook_url}
                      onChange={(e) => setContactContent({ ...contactContent, facebook_url: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Facebook Display Label
                    </label>
                    <input
                      type="text"
                      value={contactContent.facebook_label}
                      onChange={(e) => setContactContent({ ...contactContent, facebook_label: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      LinkedIn Page URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/company/jpama-uslt"
                      value={contactContent.linkedin_url || ""}
                      onChange={(e) => setContactContent({ ...contactContent, linkedin_url: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      LinkedIn Display Label
                    </label>
                    <input
                      type="text"
                      placeholder="JPAMA USLT Chapter"
                      value={contactContent.linkedin_label || ""}
                      onChange={(e) => setContactContent({ ...contactContent, linkedin_label: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                  <span className="font-bold text-[#0A2540] text-xs">
                    Academic Inquiries Callout Box
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Box Title
                      </label>
                      <input
                        type="text"
                        value={contactContent.inquiry_card_title}
                        onChange={(e) => setContactContent({ ...contactContent, inquiry_card_title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Box Advisory Description
                      </label>
                      <input
                        type="text"
                        value={contactContent.inquiry_card_desc}
                        onChange={(e) => setContactContent({ ...contactContent, inquiry_card_desc: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Received Student Inquiries Inbox */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                      Secretariat Inquiries Inbox ({contactInquiries.length})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Messages submitted by students and visitors via the public Contact page form.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Date / Time</th>
                      <th className="py-3.5 px-4">Student Sender</th>
                      <th className="py-3.5 px-4">Subject & Message</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contactInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No messages received yet. Inquiries submitted on the Contact page will appear here.
                        </td>
                      </tr>
                    ) : (
                      contactInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(inq.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <strong className="block text-slate-800">{inq.name}</strong>
                            <a href={`mailto:${inq.email}`} className="text-[#0A2540] hover:underline font-mono text-[11px]">
                              {inq.email}
                            </a>
                          </td>
                          <td className="py-3 px-4 max-w-md">
                            <span className="font-semibold text-[#0A2540] block">{inq.subject}</span>
                            <p className="text-slate-600 text-xs mt-0.5 whitespace-pre-line leading-relaxed">
                              {inq.message}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                inq.status === "Unread"
                                  ? "bg-blue-100 text-blue-800"
                                  : inq.status === "Resolved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {inq.status !== "Resolved" ? (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, "Resolved")}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                                  title="Mark as Resolved"
                                >
                                  Resolve
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, "Unread")}
                                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition-colors"
                                  title="Mark as Unread"
                                >
                                  Reopen
                                </button>
                              )}
                              <a
                                href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject)}`}
                                className="px-2 py-1 rounded bg-[#0A2540] hover:bg-[#14487A] text-white text-[11px] font-semibold transition-colors inline-block"
                                title="Reply via Email"
                              >
                                Reply
                              </a>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: ADD / EDIT STUDENT MEMBER
          ======================================================== */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A2540]">
                {editingMember ? "Edit Student Member" : "Add Student Member"}
              </h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  BSMA Student Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024-00142"
                  value={memStudentNum}
                  onChange={(e) => setMemStudentNum(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last Name, First Name, M.I."
                  value={memFullName}
                  onChange={(e) => setMemFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@uslt.edu.ph"
                  value={memEmail}
                  onChange={(e) => setMemEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Year Level
                  </label>
                  <select
                    value={memYear}
                    onChange={(e) => setMemYear(e.target.value as YearLevel)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Membership Status
                  </label>
                  <select
                    value={memStatus}
                    onChange={(e) => setMemStatus(e.target.value as MemberStatus)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={memBirthdate}
                    onChange={(e) => setMemBirthdate(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City Residence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tuguegarao City"
                    value={memResidence}
                    onChange={(e) => setMemResidence(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold"
                >
                  {editingMember ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT ASSEMBLY (With Speaker & Agenda Breakdown)
          ======================================================== */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A2540]">
                {editingEvent ? "Edit Assembly & Program Schedule" : "Create New Assembly"}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sihaya: The 2026 Grand Induction & Pinning Gala"
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={evCategory}
                    onChange={(e) => setEvCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Competition">Competition</option>
                    <option value="Social">Social</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={evDate}
                    onChange={(e) => setEvDate(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Event Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 AM"
                    value={evTime}
                    onChange={(e) => setEvTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Venue / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={evLocation}
                    onChange={(e) => setEvLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={evCapacity}
                    onChange={(e) => setEvCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Resource Speaker Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Atty. Rommel S. Bautista, CPA, CMA"
                    value={evSpeaker}
                    onChange={(e) => setEvSpeaker(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Speaker Credentials / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Partner, Strategic Advisory"
                    value={evSpeakerRole}
                    onChange={(e) => setEvSpeakerRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              {/* Event Cover Image URL with Requirements */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 mb-1">
                  Event Cover Image URL
                  <span className="ml-1 text-[10px] font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/uc?export=view&id=..."
                  value={evImageUrl}
                  onChange={(e) => setEvImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540] text-xs"
                />
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-[10px] text-amber-800 space-y-1">
                  <p className="font-semibold">📷 Image Requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Recommended size: <strong>1200 × 628 px</strong> (16:9 ratio, fills the card banner)</li>
                    <li>Accepted formats: JPG, PNG, WebP — keep under 5 MB</li>
                    <li>Must be a <strong>publicly accessible direct-link</strong> (not a sharing/preview page)</li>
                    <li>Google Drive: use <code className="bg-amber-100 px-1 rounded">uc?export=view&amp;id=FILE_ID</code></li>
                    <li>OneDrive: use the embed download URL</li>
                    <li>Leave blank to show a dark gradient title card instead</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assembly Overview / Description
                </label>
                <textarea
                  rows={2}
                  value={evDesc}
                  onChange={(e) => setEvDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              {/* Dynamic Agenda / Schedule Breakdown */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0A2540]" />
                    <span>Assembly Program & Schedule Breakdown</span>
                  </span>
                  <button
                    type="button"
                    onClick={addAgendaRow}
                    className="px-2 py-0.5 bg-[#0A2540] text-white rounded text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Itinerary Row
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {evAgenda.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Time (e.g. 08:00 AM)"
                        value={item.time}
                        onChange={(e) => updateAgendaRow(idx, "time", e.target.value)}
                        className="w-28 px-2 py-1.5 bg-white border border-slate-200 rounded font-mono text-[11px] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Activity / Milestone"
                        value={item.activity}
                        onChange={(e) => updateAgendaRow(idx, "activity", e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded text-[11px] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeAgendaRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold"
                >
                  {editingEvent ? "Update Assembly" : "Create Assembly"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT ACADEMIC RESOURCE (With Cloud Drive Link)
          ======================================================== */}
      {showResModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A2540]">
                {editingRes ? "Edit Academic Resource" : "Upload Academic Resource"}
              </h3>
              <button
                onClick={() => setShowResModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRes} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAS Handouts & Practice Drills"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cloud Drive URL / Direct Link (Google Drive, OneDrive, Dropbox, etc.) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={resLink}
                  onChange={(e) => setResLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
                <span className="text-[10px] text-slate-400">Verified students can access or download from this link directly.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject / Course *
                </label>
                <input
                  type="text"
                  required
                  value={resSubject}
                  onChange={(e) => setResSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="Academic Reviewer">Academic Reviewer</option>
                    <option value="Study Kit">Study Kit</option>
                    <option value="Template">Template</option>
                    <option value="Webinar">Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Format
                  </label>
                  <select
                    value={resFormat}
                    onChange={(e) => setResFormat(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">Excel XLSX</option>
                    <option value="ZIP Kit">ZIP Kit</option>
                    <option value="MP4 / Stream">Video Stream</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold"
                >
                  {editingRes ? "Update Resource" : "Save Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT OFFICER / FACULTY
          ======================================================== */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A2540]">
                {editingOfficer ? "Edit Leader / Adviser" : "Add Leader / Adviser"}
              </h3>
              <button
                onClick={() => setShowOfficerModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOfficer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name & Titles *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Ezekiel M. Aquino"
                  value={offName}
                  onChange={(e) => setOffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. President"
                    value={offRole}
                    onChange={(e) => setOffRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={offCategory}
                    onChange={(e) => setOffCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="Executive Board">Executive Board</option>
                    <option value="Faculty Adviser">Faculty Adviser</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Committee / Wing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Executive Council"
                    value={offCommittee}
                    onChange={(e) => setOffCommittee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Term / Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A.Y. 2026–2027"
                    value={offTerm}
                    onChange={(e) => setOffTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Photo / Avatar URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={offAvatar}
                  onChange={(e) => setOffAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Leadership Quote / Bio
                </label>
                <textarea
                  rows={2}
                  value={offQuote}
                  onChange={(e) => setOffQuote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A2540] text-white rounded font-semibold"
                >
                  {editingOfficer ? "Update Leader" : "Save Leader"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FACULTY ADVISERS */}
      <FacultyAdvisersModal
        isOpen={showFacultyModal}
        onClose={() => setShowFacultyModal(false)}
        faculty={aboutContent.faculty_advisers || []}
        onSave={handleSaveFacultyModal}
      />
    </div>
  );
}
