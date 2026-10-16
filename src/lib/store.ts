import { Member, EventItem, RSVP, ResourceItem, OfficerItem, PortalSettings } from "./types";

// Seed Members (Updated with Birthdate & Residence)
export const INITIAL_MEMBERS: Member[] = [
  {
    id: "m01-9482-aa01",
    student_number: "2023-01042",
    full_name: "Kirsten Joy Dela Cruz",
    email: "kj.delacruz@uslt.edu.ph",
    year_level: "3rd Year",
    program: "BSMA",
    status: "Active",
    created_at: "2024-08-15T09:30:00Z",
    birthdate: "2004-10-14",
    residence: "Tuguegarao City, Cagayan",
  },
  {
    id: "m02-8821-bb02",
    student_number: "2024-00519",
    full_name: "Marc Alistair Valenzuela",
    email: "marc.valenzuela@uslt.edu.ph",
    year_level: "2nd Year",
    program: "BSMA",
    status: "Active",
    created_at: "2024-08-20T14:15:00Z",
    birthdate: "2005-06-22",
    residence: "Solana, Cagayan",
  },
  {
    id: "m03-1294-cc03",
    student_number: "2025-00118",
    full_name: "Sophia Reign Agcaoili",
    email: "sophia.agcaoili@uslt.edu.ph",
    year_level: "1st Year",
    program: "BSMA",
    status: "Pending",
    created_at: "2024-09-02T11:00:00Z",
    birthdate: "2006-01-30",
    residence: "Enrile, Cagayan",
  },
  {
    id: "m04-7741-dd04",
    student_number: "2021-00892",
    full_name: "Christian Emmanuel Paguirigan",
    email: "c.paguirigan@uslt.edu.ph",
    year_level: "4th Year",
    program: "BSMA",
    status: "Graduated",
    created_at: "2021-09-01T08:00:00Z",
    birthdate: "2003-08-12",
    residence: "Tuguegarao City, Cagayan",
  },
  {
    id: "m05-3392-ee05",
    student_number: "2023-02115",
    full_name: "Angelica Bea Tumaliuan",
    email: "bea.tumaliuan@uslt.edu.ph",
    year_level: "3rd Year",
    program: "BSMA",
    status: "Active",
    created_at: "2024-08-18T16:45:00Z",
    birthdate: "2004-12-05",
    residence: "Peñablanca, Cagayan",
  },
];

// Seed Events (Upcoming & Past)
export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "ev-01-sihaya-induction",
    slug: "sihaya-induction-2026",
    title: "Sihaya: The 2026 Grand Induction & Pinning Gala",
    category: "Leadership",
    description: "The official donning of pins and formal induction rites for newly registered JPAMA members and executive officers under the dawn of the Sihaya leadership.",
    full_details: "Join the Junior Philippine Association of Management Accountants (JPAMA) USLT Chapter as we formally inaugurate the Academic Year with 'Sihaya: Radiant Beginnings in Management Accounting'. This ceremonial gala features the keynote address by distinguished CMA practitioners, conferring of executive ranks, oath taking, and fellowship luncheon.",
    event_date: "2026-10-24T08:30:00",
    location: "USLT Bulwagang San Jacinto, University of Saint Louis",
    max_capacity: 250,
    is_published: true,
    speaker: "Atty. Rommel S. Bautista, CPA, CMA",
    speaker_role: "Senior Director for Strategic Finance, ASEAN Accounting Council",
    badge: "Flagship Event",
    agenda: [
      { time: "08:00 AM", activity: "Registration & Arrival of Honored Guests" },
      { time: "09:00 AM", activity: "Eucharistic Celebration & Processional" },
      { time: "10:30 AM", activity: "Keynote Address: Steering Finance with Ethical Precision" },
      { time: "11:30 AM", activity: "Donning of Pins & Oath-Taking of New Members" },
      { time: "01:30 PM", activity: "Induction of Officers & Ceremonial Turnover of Gavel" },
      { time: "03:00 PM", activity: "Fellowship Socials & Photo Gallery" },
    ],
  },
  {
    id: "ev-02-cma-strategic-cost",
    slug: "mastering-strategic-cost-management",
    title: "Mastering Strategic Cost Management & Performance Metrics",
    category: "Academic",
    description: "An intensive masterclass on Activity-Based Costing, Balance Scorecards, and CMA Part 1 foundational competencies.",
    full_details: "Designed specifically for BSMA 2nd to 4th-year students gearing up for midterm departmentals and international certification exams. Explore real-world manufacturing case studies, variance analysis, and multi-tier pricing strategies.",
    event_date: "2026-11-07T13:30:00",
    location: "USLT Bulwagang San Jacinto - Audio Visual Room 2",
    max_capacity: 120,
    is_published: true,
    speaker: "Prof. Maria Clara Fontanilla, CPA, CMA",
    speaker_role: "Chairperson, USLT Department of Accountancy",
    badge: "Certification Track",
    agenda: [
      { time: "01:15 PM", activity: "Check-in & Kit Distribution" },
      { time: "01:30 PM", activity: "Module 1: Modern Cost Drivers & Overhead Allocation" },
      { time: "03:00 PM", activity: "Interactive Case Cracking & Live Financial Modeling" },
      { time: "04:30 PM", activity: "Q&A, CMA Scholarship Briefing & Mock Quizzer" },
    ],
  },
  {
    id: "ev-03-fintech-forensics-webinar",
    slug: "ai-and-fintech-forensics-summit",
    title: "The Digital Ledger: AI, ERPs & Forensic Management Accounting",
    category: "Webinar",
    description: "Virtual summit examining how automated analytics, SAP/Oracle ecosystems, and internal auditing are redefining the CMA profession.",
    full_details: "A comprehensive virtual workshop bringing together USLT alumni working in multinational shared services and Big 4 advisory. Participants receive a verified digital Certificate of Completion with CPD/student training hours.",
    event_date: "2026-11-21T18:00:00",
    location: "Zoom Virtual Hall & JPAMA Member Portal",
    max_capacity: 400,
    is_published: true,
    speaker: "Engr. & CPA Dominic Gabriel Tan",
    speaker_role: "Lead Systems Architect, Global Financial Services",
    badge: "Virtual Summit",
    agenda: [
      { time: "06:00 PM", activity: "Virtual Lobby Open & Audio Check" },
      { time: "06:15 PM", activity: "Session: Machine Learning in Continuous Financial Audits" },
      { time: "07:30 PM", activity: "Panel Discussion: Future-Proofing the Management Accountant" },
      { time: "08:30 PM", activity: "Certificates Issuance & Open Floor" },
    ],
  },
  {
    id: "ev-04-intercollegiate-cup",
    slug: "uslt-management-accounting-cup-2026",
    title: "12th Annual Louisian Management Accounting Quiz Bowl",
    category: "Competition",
    description: "The premier inter-batch academic quiz bowl testing mastery across Financial Accounting, Cost Accounting, Regulatory Frameworks, and Taxation.",
    full_details: "Teams composed of 1st through 4th-year BSMA and BSA contenders battle through Easy, Average, Difficult, and Clincher rounds for championship trophies and review center full scholarships.",
    event_date: "2026-12-05T09:00:00",
    location: "USLT Bulwagang San Jacinto, University of Saint Louis",
    max_capacity: 180,
    is_published: true,
    speaker: "Board of Adjudicators",
    speaker_role: "PICA & PICPA Cagayan Chapter Officers",
    badge: "Annual Championship",
    agenda: [
      { time: "08:30 AM", activity: "Roll Call of Teams & Rules Orientation" },
      { time: "09:15 AM", activity: "Round 1: Individual Theory & Computation" },
      { time: "11:00 AM", activity: "Round 2: Team Speed Problem Solving" },
      { time: "01:30 PM", activity: "Final Showdown: Case Defense Before Board of Judges" },
      { time: "03:30 PM", activity: "Awarding Ceremony & Trophy Presentation" },
    ],
  },
];

// Past Events for Gallery
export const PAST_EVENTS = [
  {
    title: "National Management Accounting Convention 2025",
    date: "November 2025",
    location: "Manila / Virtual",
    attendees: 320,
    highlight: "USLT Delegation won 1st Runner-Up in National Business Case Championship.",
    category: "Competition",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Hiraya: General Assembly & Team Building 2025",
    date: "August 2025",
    location: "USLT Field & Gymnasium",
    attendees: 290,
    highlight: "Over 280 members bonded across academic batches with leadership relays.",
    category: "Social",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "CMA Fast-Track: USLT Mock Qualifying Exams",
    date: "May 2025",
    location: "Bulwagang San Jacinto",
    attendees: 160,
    highlight: "94% pass rate among graduating BSMA seniors in simulated CMA Part 1.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  },
];

// Seed RSVPs
export const INITIAL_RSVPS: RSVP[] = [
  {
    id: "rsvp-01",
    event_id: "ev-01-sihaya-induction",
    member_id: "m01-9482-aa01",
    attendance_status: "Registered",
    registered_at: "2026-09-10T10:14:00Z",
    student_number: "2023-01042",
    full_name: "Kirsten Joy Dela Cruz",
    email: "kj.delacruz@uslt.edu.ph",
  },
  {
    id: "rsvp-02",
    event_id: "ev-01-sihaya-induction",
    member_id: "m02-8821-bb02",
    attendance_status: "Registered",
    registered_at: "2026-09-12T15:20:00Z",
    student_number: "2024-00519",
    full_name: "Marc Alistair Valenzuela",
    email: "marc.valenzuela@uslt.edu.ph",
  },
  {
    id: "rsvp-03",
    event_id: "ev-02-cma-strategic-cost",
    member_id: "m01-9482-aa01",
    attendance_status: "Registered",
    registered_at: "2026-09-14T09:05:00Z",
    student_number: "2023-01042",
    full_name: "Kirsten Joy Dela Cruz",
    email: "kj.delacruz@uslt.edu.ph",
  },
];

// Resources Library
export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-01",
    title: "Comprehensive Strategic Cost Management (SCM) Reviewer 2026",
    category: "Academic Reviewer",
    subject: "Strategic Cost Management",
    year_level: "3rd & 4th Year",
    format: "PDF",
    size: "14.2 MB",
    author: "JPAMA Academic Committee & USLT Faculty",
    download_url: "#download-scm-2026",
    downloads_count: 512,
    description: "Complete formula sheets, activity-based management frameworks, variance drill questions, and past departmental exam solutions.",
    updated_at: "2026-09-20",
  },
  {
    id: "res-02",
    title: "Cost Accounting & Control Study Kit: Job Order vs Process Costing",
    category: "Study Kit",
    subject: "Cost Accounting",
    year_level: "2nd Year",
    format: "PDF",
    size: "8.5 MB",
    author: "Prof. M. Fontanilla, CPA, CMA",
    download_url: "#download-cost-kit",
    downloads_count: 830,
    description: "Step-by-step equivalence units computation, FIFO vs Weighted Average templates, and spoilage accounting problems.",
    updated_at: "2026-09-18",
  },
  {
    id: "res-03",
    title: "Standardized Financial Statement Model & CVP Excel Template",
    category: "Template",
    subject: "Financial Modeling & CVP",
    year_level: "All Year Levels",
    format: "XLSX",
    size: "2.8 MB",
    author: "JPAMA Research & Innovation Wing",
    download_url: "#download-cvp-model",
    downloads_count: 645,
    description: "Dynamic financial statement spreadsheets with automated break-even sensitivity graphs, degree of operating leverage, and margin of safety calculators.",
    updated_at: "2026-08-30",
  },
  {
    id: "res-04",
    title: "CMA Part 1 Webinar Recording: Financial Planning & Performance",
    category: "Webinar",
    subject: "CMA Professional Exam Prep",
    year_level: "3rd & 4th Year",
    format: "MP4 / Stream",
    size: "Stream / HD 1080p",
    author: "Guest Speaker Atty. Rommel Bautista",
    download_url: "#stream-cma-part1",
    downloads_count: 420,
    description: "Full 2.5-hour recorded session dissecting top 20 tricky CMA exam questions on budgeting, capital budgeting, and internal controls.",
    updated_at: "2026-09-05",
  },
  {
    id: "res-05",
    title: "Management Advisory Services (MAS) Quick-Check Pocket Handbook",
    category: "Academic Reviewer",
    subject: "Management Advisory Services",
    year_level: "4th Year",
    format: "PDF",
    size: "6.1 MB",
    author: "USLT Accountancy Honors Circle",
    download_url: "#download-mas-pocket",
    downloads_count: 940,
    description: "Concise summary tables covering financial ratios, working capital management, EOQ models, and quantitative decision methods.",
    updated_at: "2026-09-25",
  },
  {
    id: "res-06",
    title: "USLT JPAMA Official Constitution & By-Laws (2026 Ratified Edition)",
    category: "Academic Reviewer",
    subject: "Organizational Governance",
    year_level: "All Members",
    format: "PDF",
    size: "3.4 MB",
    author: "JPAMA Constitutional Convention",
    download_url: "#download-constitution",
    downloads_count: 1250,
    description: "The governing charter outlining member rights, executive board duties, electoral guidelines, and financial accountability policies.",
    updated_at: "2026-08-10",
  },
];

// Executive Board Directory
export const EXECUTIVE_BOARD = [
  {
    name: "John Ezekiel M. Aquino",
    role: "President",
    term: "A.Y. 2026–2027",
    yearProgram: "4th Year • BSMA",
    quote: "Leading with Sihaya: Radiance in ethics, precision in management accounting.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    committee: "Executive Council",
  },
  {
    name: "Alyssa Marie C. Baloran",
    role: "Executive Vice President",
    term: "A.Y. 2026–2027",
    yearProgram: "4th Year • BSMA",
    quote: "Empowering every Louisian management accountant to achieve global distinction.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    committee: "Executive Council",
  },
  {
    name: "Dominic Kyle T. Guzman",
    role: "VP for Internal Affairs",
    term: "A.Y. 2026–2027",
    yearProgram: "3rd Year • BSMA",
    quote: "Fostering synergy, student welfare, and seamless chapter operations.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    committee: "Internal Affairs",
  },
  {
    name: "Frances Nicole D. Ramos",
    role: "VP for External Affairs",
    term: "A.Y. 2026–2027",
    yearProgram: "3rd Year • BSMA",
    quote: "Bridging USLT with national leagues, industry partners, and CMA bodies.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    committee: "External Relations",
  },
  {
    name: "Gian Carlo S. Manaligod",
    role: "VP for Finance",
    term: "A.Y. 2026–2027",
    yearProgram: "3rd Year • BSMA",
    quote: "Maintaining absolute transparency and stewardship over chapter assets.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    committee: "Finance & Audit",
  },
  {
    name: "Chelsea Grace V. Cauilan",
    role: "VP for Academics & CMA Affairs",
    term: "A.Y. 2026–2027",
    yearProgram: "4th Year • BSMA",
    quote: "Providing top-tier study kits and mentoring for academic excellence.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    committee: "Academic Wing",
  },
  {
    name: "Kenneth Jade B. Soriano",
    role: "VP for Communications & Media",
    term: "A.Y. 2026–2027",
    yearProgram: "2nd Year • BSMA",
    quote: "Illuminating the JPAMA narrative through dynamic digital storytelling.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    committee: "Public Relations",
  },
  {
    name: "Beatriz Andrea P. Mendoza",
    role: "Secretary-General",
    term: "A.Y. 2026–2027",
    yearProgram: "3rd Year • BSMA",
    quote: "Securing organizational memory and pristine documentation records.",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    committee: "Secretariat",
  },
];

// Faculty Adviser & Affiliation
export const FACULTY_LEADERSHIP = {
  adviser: "Prof. Marites G. Cardenas, CPA, MBA, CMA",
  adviser_title: "Faculty Adviser, JPAMA USLT Chapter",
  adviser_bio: "With over 18 years of distinction in corporate controllership and accountancy education, Prof. Cardenas mentors the student council with an unwavering focus on ethical competence and international accreditation.",
  dean: "Dr. Ronald M. Villa, CPA, PhD",
  dean_title: "Dean, School of Accountancy, Business, and Hospitality (SABH)",
  department_head: "Prof. Maria Clara Fontanilla, CPA, CMA",
  department_head_title: "Head, Department of Accountancy",
  institution: "University of Saint Louis Tuguegarao (USLT)",
  accreditation: "PAASCU Level IV Accredited Program • Center of Development in Business Education",
};

// In-Memory Global Storage (survives client-side route transitions and hot-reloads)
class LocalStore {
  private members: Member[] = [...INITIAL_MEMBERS];
  private events: EventItem[] = [...INITIAL_EVENTS];
  private rsvps: RSVP[] = [...INITIAL_RSVPS];
  private resources: ResourceItem[] = [...INITIAL_RESOURCES];

  getMembers(): Member[] {
    return this.members;
  }

  findMemberByStudentNumber(studentNumber: string): Member | undefined {
    const cleanQuery = studentNumber.trim().toLowerCase();
    return this.members.find(
      (m) =>
        m.student_number.toLowerCase() === cleanQuery ||
        m.email.toLowerCase() === cleanQuery
    );
  }

  addMember(memberData: Omit<Member, "id" | "created_at" | "status">): Member {
    const existing = this.findMemberByStudentNumber(memberData.student_number);
    if (existing) {
      throw new Error(`Student number ${memberData.student_number} is already registered.`);
    }

    const newMember: Member = {
      ...memberData,
      id: "mem-" + Math.random().toString(36).substring(2, 9),
      status: "Pending", // Default pending payment verification as per spec
      created_at: new Date().toISOString(),
    };

    this.members.unshift(newMember);
    return newMember;
  }

  getEvents(): EventItem[] {
    return this.events;
  }

  getEventBySlug(slug: string): EventItem | undefined {
    return this.events.find((e) => e.slug === slug);
  }

  getRSVPsForEvent(eventId: string): RSVP[] {
    return this.rsvps.filter((r) => r.event_id === eventId);
  }

  addRSVP(eventId: string, studentNumber: string, notes?: string): RSVP {
    const event = this.events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const member = this.findMemberByStudentNumber(studentNumber);
    if (!member) {
      throw new Error("Student Number not registered in JPAMA membership directory. Please register for membership first.");
    }

    // Check if already RSVPed
    const alreadyRSVPed = this.rsvps.find(
      (r) => r.event_id === eventId && r.member_id === member.id && r.attendance_status !== "Cancelled"
    );
    if (alreadyRSVPed) {
      throw new Error("You have already RSVPed for this event.");
    }

    // Check capacity
    const currentRSVPs = this.getRSVPsForEvent(eventId).length;
    if (currentRSVPs >= event.max_capacity) {
      throw new Error("This event has reached maximum capacity.");
    }

    const newRSVP: RSVP = {
      id: "rsvp-" + Math.random().toString(36).substring(2, 9),
      event_id: eventId,
      member_id: member.id,
      attendance_status: "Registered",
      registered_at: new Date().toISOString(),
      student_number: member.student_number,
      full_name: member.full_name,
      email: member.email,
      notes: notes,
    };

    this.rsvps.push(newRSVP);
    return newRSVP;
  }

  updateMember(id: string, updates: Partial<Member>): Member {
    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Member not found");
    this.members[idx] = { ...this.members[idx], ...updates };
    return this.members[idx];
  }

  deleteMember(id: string): boolean {
    const initialLen = this.members.length;
    this.members = this.members.filter((m) => m.id !== id);
    return this.members.length < initialLen;
  }

  addEvent(eventData: Omit<EventItem, "id">): EventItem {
    const newEvent: EventItem = {
      ...eventData,
      id: "ev-" + Math.random().toString(36).substring(2, 9),
    };
    this.events.unshift(newEvent);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<EventItem>): EventItem {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Event not found");
    this.events[idx] = { ...this.events[idx], ...updates };
    return this.events[idx];
  }

  deleteEvent(id: string): boolean {
    const initialLen = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    return this.events.length < initialLen;
  }

  getResources(): ResourceItem[] {
    return this.resources;
  }

  addResource(resourceData: Omit<ResourceItem, "id" | "downloads_count" | "updated_at">): ResourceItem {
    const newRes: ResourceItem = {
      ...resourceData,
      id: "res-" + Math.random().toString(36).substring(2, 9),
      downloads_count: 0,
      updated_at: new Date().toISOString(),
    };
    this.resources.unshift(newRes);
    return newRes;
  }

  updateResource(id: string, updates: Partial<ResourceItem>): ResourceItem {
    const idx = this.resources.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Resource not found");
    this.resources[idx] = { ...this.resources[idx], ...updates, updated_at: new Date().toISOString() };
    return this.resources[idx];
  }

  deleteResource(id: string): boolean {
    const initialLen = this.resources.length;
    this.resources = this.resources.filter((r) => r.id !== id);
    return this.resources.length < initialLen;
  }

  // Leadership & Faculty Management
  private officers: OfficerItem[] = [
    {
      id: "off-01",
      name: "John Ezekiel M. Aquino",
      role: "President",
      category: "Executive Board",
      committee: "Executive Council",
      term: "A.Y. 2026–2027",
      yearProgram: "4th Year • BSMA",
      quote: "Leading with Sihaya: Radiance in ethics, precision in management accounting.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "off-02",
      name: "Alyssa Marie C. Baloran",
      role: "Executive Vice President",
      category: "Executive Board",
      committee: "Executive Council",
      term: "A.Y. 2026–2027",
      yearProgram: "4th Year • BSMA",
      quote: "Empowering every Louisian management accountant to achieve global distinction.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "off-03",
      name: "Dominic Kyle T. Guzman",
      role: "VP for Internal Affairs",
      category: "Executive Board",
      committee: "Internal Affairs",
      term: "A.Y. 2026–2027",
      yearProgram: "3rd Year • BSMA",
      quote: "Fostering synergy, student welfare, and seamless chapter operations.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "off-04",
      name: "Frances Nicole D. Ramos",
      role: "VP for External Affairs",
      category: "Executive Board",
      committee: "External Relations",
      term: "A.Y. 2026–2027",
      yearProgram: "3rd Year • BSMA",
      quote: "Bridging USLT with national leagues, industry partners, and CMA bodies.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "off-05",
      name: "Gian Carlo S. Manaligod",
      role: "VP for Finance",
      category: "Executive Board",
      committee: "Finance & Audit",
      term: "A.Y. 2026–2027",
      yearProgram: "3rd Year • BSMA",
      quote: "Maintaining absolute transparency and stewardship over chapter assets.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "off-06",
      name: "Chelsea Grace V. Cauilan",
      role: "VP for Academics & CMA Affairs",
      category: "Executive Board",
      committee: "Academic Wing",
      term: "A.Y. 2026–2027",
      yearProgram: "4th Year • BSMA",
      quote: "Providing top-tier study kits and mentoring for academic excellence.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "off-07",
      name: "Prof. Marites G. Cardenas, CPA, MBA, CMA",
      role: "Faculty Adviser",
      category: "Faculty Adviser",
      committee: "Faculty Leadership",
      term: "A.Y. 2026–2027",
      yearProgram: "JPAMA USLT Chapter Adviser",
      quote: "With over 18 years in corporate controllership, guiding students toward ethical competence and international accreditation.",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  getOfficers(): OfficerItem[] {
    return this.officers;
  }

  addOfficer(data: Omit<OfficerItem, "id">): OfficerItem {
    const newOfficer: OfficerItem = {
      ...data,
      id: "off-" + Math.random().toString(36).substring(2, 9),
    };
    this.officers.push(newOfficer);
    return newOfficer;
  }

  updateOfficer(id: string, updates: Partial<OfficerItem>): OfficerItem {
    const idx = this.officers.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Officer not found");
    this.officers[idx] = { ...this.officers[idx], ...updates };
    return this.officers[idx];
  }

  deleteOfficer(id: string): boolean {
    const initialLen = this.officers.length;
    this.officers = this.officers.filter((o) => o.id !== id);
    return this.officers.length < initialLen;
  }

  // Portal Settings (Super User)
  private settings: PortalSettings = {
    portal_title: "Junior Philippine Association of Management Accountants",
    academic_year: "A.Y. 2026–2027",
    advisory_notice: "Welcome BS Management Accounting scholars to A.Y. 2026–2027.",
    official_email: "jpama@uslt.edu.ph",
    facebook_url: "https://facebook.com/jpama.uslt",
    office_location: "Bulwagang San Jacinto, USLT Mabini Campus, Tuguegarao City",
  };

  getSettings(): PortalSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<PortalSettings>): PortalSettings {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }
}

// Global singleton
const globalForStore = global as unknown as { __jpama_store?: LocalStore };
export const dataStore = globalForStore.__jpama_store || new LocalStore();
if (process.env.NODE_ENV !== "production") globalForStore.__jpama_store = dataStore;

