// Shared content models and defaults for Overview and About pages

export interface OverviewContent {
  hero: {
    badge: string;
    title_start: string;
    title_highlight: string;
    description: string;
    tagline_dept: string;
    tagline_loc: string;
    btn_primary_text?: string;
    btn_primary_link?: string;
    btn_secondary_text?: string;
    btn_secondary_link?: string;
    stat_scholars?: string;
    stat_convocations?: string;
    stat_passers?: string;
    stat_partners?: string;
    emblem_image?: string;
    emblem_title?: string;
    emblem_subtitle?: string;
    emblem_motion?: "static" | "glow" | "floating";
    emblem_visible?: boolean;
  };
  pillars: {
    section_eyebrow: string;
    section_title: string;
    section_desc: string;
    items: Array<{
      title: string;
      desc: string;
      tag: string;
    }>;
  };
  events: {
    section_eyebrow: string;
    section_title: string;
    section_desc?: string;
    btn_text?: string;
  };
  resources: {
    badge: string;
    title: string;
    description: string;
    tags: string[];
    btn_text: string;
  };
  leadership?: {
    section_eyebrow: string;
    section_title: string;
    section_desc: string;
    btn_text: string;
  };
  contact: {
    office_title: string;
    office_desc: string;
    email_title: string;
    email_desc: string;
    hours_title: string;
    hours_desc: string;
  };
  // Dynamic Chapter Activities Showcase (Max 10 activities with Royal Tabs or Swipable Deck)
  activities_showcase?: {
    enabled?: boolean;
    mode?: "tabs" | "slider";
    section_eyebrow?: string;
    section_title?: string;
    activities: Array<{
      id: string;
      tab_label: string;
      icon?: string;
      category_badge?: string;
      title: string;
      subtitle?: string;
      body: string;
      images: string[];
      layout?: "split_text_left" | "split_text_right" | "stacked_text_top" | "stacked_text_bottom" | "royal_banner" | "infographic" | "mosaic";
      imageSize?: "2x2" | "4:3" | "16:9" | "small" | "medium" | "large";
      edgeStyle?: "fade" | "fine" | "lined" | "none";
      visible?: boolean;
    }>;
  };
  // Dynamically added custom sections (slideshow images, text blocks, etc.)
  custom_sections?: Record<string, {
    type: string;
    label: string;
    title?: string;
    body?: string;
    images?: string[];   // For slideshow: array of image URLs
    layout?: "split_text_left" | "split_text_right" | "stacked_text_top" | "stacked_text_bottom" | "royal_banner" | "infographic" | "mosaic";
    imageSize?: "2x2" | "4:3" | "16:9" | "small" | "medium" | "large";
    edgeStyle?: "fade" | "fine" | "lined" | "none";
  }>;
}

export interface ChapterActivity {
  id: string;
  tab_label: string;
  icon?: string;
  category_badge?: string;
  title: string;
  subtitle?: string;
  body: string;
  images: string[];
  layout?: "split_text_left" | "split_text_right" | "stacked_text_top" | "stacked_text_bottom" | "royal_banner" | "infographic" | "mosaic";
  imageSize?: "2x2" | "4:3" | "16:9" | "small" | "medium" | "large";
  edgeStyle?: "fade" | "fine" | "lined" | "none";
  visible?: boolean;
}

export const DEFAULT_OVERVIEW_CONTENT: OverviewContent = {
  hero: {
    badge: "Bachelor of Science in Management Accounting (BSMA)",
    title_start: "Empowering Louisian",
    title_highlight: "Management Accountants",
    description:
      "Welcome to the official web portal of the Junior Philippine Association of Management Accountants (JPAMA) – University of Saint Louis Tuguegarao Chapter. Your dedicated hub for chapter events, academic reviewers, and student membership.",
    tagline_dept: "School of Accountancy, Business, and Hospitality",
    tagline_loc: "USLT Tuguegarao City",
    btn_primary_text: "Explore Convocations",
    btn_primary_link: "/events",
    btn_secondary_text: "Access Review Vault",
    btn_secondary_link: "/resources",
    stat_scholars: "250+ Active Scholars",
    stat_convocations: "12+ Annual Assemblies",
    stat_passers: "100% CMA Passing Rate",
    stat_partners: "8 Top Accounting Firms",
    emblem_image: "/jpama-hero-emblem.jpg",
    emblem_title: "Official Chapter Seal",
    emblem_subtitle: "",
    emblem_motion: "glow",
    emblem_visible: true,
  },
  pillars: {
    section_eyebrow: "ACADEMIC FOCUS",
    section_title: "The BS Management Accounting Program",
    section_desc: "Bridging financial analytics, cost control, and strategic management for USLT scholars.",
    items: [
      {
        title: "Strategic Cost & Management",
        desc: "Mastering cost behavior, budgeting, performance evaluation, and decision modeling for modern business controllership.",
        tag: "Core Academic",
      },
      {
        title: "CMA & Professional Pathways",
        desc: "Preparing Louisian scholars for global certifications, corporate accounting, financial planning, and advisory careers.",
        tag: "Career Ready",
      },
      {
        title: "Leadership & Chapter Donning",
        desc: "Building ethical leadership, student camaraderie, and executive governance through our annual assembly rites.",
        tag: "Student Life",
      },
    ],
  },
  events: {
    section_eyebrow: "CALENDAR SPOTLIGHT",
    section_title: "Upcoming Assemblies & Convocations",
  },
  resources: {
    badge: "Academic Library & Materials",
    title: "Curated BSMA Reviewers & Course Syllabi",
    description:
      "Access verified handouts, practice assessments, mock board reviewers, financial modeling templates, and testbanks spanning all BSMA core subjects — from Cost Accounting and MAS to Taxation, Auditing, and Business Law. Exclusively curated for Louisian scholars.",
    tags: ["Cost Accounting & MAS", "Taxation & Business Law", "Auditing & Assurance"],
    btn_text: "Explore Resources",
  },
  contact: {
    office_title: "Chapter Office",
    office_desc: "Bulwagang San Jacinto, USLT Mabini Campus, Tuguegarao City, Cagayan",
    email_title: "Official Inquiries",
    email_desc: "jpama@uslt.edu.ph",
    hours_title: "Office Hours",
    hours_desc: "Monday – Friday: 8:00 AM – 5:00 PM (SABH Hallway Desk)",
  },
  activities_showcase: {
    enabled: true,
    mode: "tabs",
    section_eyebrow: "CHAPTER SPOTLIGHT & ACTIVITIES",
    section_title: "Highlights, Passers & Student Dispatches",
    activities: [
      {
        id: "act_fmaa_passers",
        tab_label: "FMAA Passers",
        icon: "trophy",
        category_badge: "CHAPTER DISTINCTION",
        title: "FMAA PASSER 2026",
        subtitle: "ANOTHER PROOF THAT LOUISIAN MAS ARE MEANT TO SHINE. ✨",
        body: "Every achievement is a reminder that with the right guidance, determination, and the courage to keep going, every Louisian has the potential to shine in their own field. And today, JPAMA–USLT celebrates a milestone that makes our whole community proud!\n\nOur warmest congratulations to Angela Grace Udani, John Rolan Alilam, Erod Harell Corpuz, Angel Trisha Mae B. Cabantoc, and all the FMAA passers from the University of Saint Louis–Tuguegarao! 🎉\n\nYour success is not just a personal victory; it is also an inspiration to every Management Accounting student who is still working toward their own goals. You remind us that every small step, every late-night review, and every effort made along the way can lead to something worth celebrating.\n\nAs you continue your journey, may you carry the Louisians' spirit with you and keep proving that every MA has a light of their own, ready to shine in different fields and opportunities. And with the guidance and support of Insights Financial Review Services Inc., may more aspiring professionals find their way toward their dreams.\n\nFrom your JPAMA–USLT family, congratulations! We are truly proud of what you have achieved, and we look forward to seeing you embrace even greater opportunities and shine even brighter in the journey ahead. Here’s to more doors opening and more dreams coming to life!\n\n#JPAMAUSLT #ProudLouisians #FMAAPassers #EveryMACanShine #ManagementAccounting",
        images: [
          "https://drive.google.com/file/d/1ytjYS8XFJgKFtQ83SBlUssfFfaQHCx7r/view?usp=drive_link",
          "https://drive.google.com/file/d/15YAci2rQNdqoSzBNIk6FGGODpGgx3Dzx/view?usp=drive_link",
          "https://drive.google.com/file/d/1Cc89cpl5bLIGaUzDS0nKQR574h2NdO4o/view?usp=drive_link",
          "https://drive.google.com/file/d/1RRkY7-6hzpJjRg7hbZF_YdA6T2oeMkFm/view?usp=drive_link",
          "https://drive.google.com/file/d/1_FXYBwSiKAN3czJOwZLkwbSt9_vA0ozr/view?usp=drive_link",
          "https://drive.google.com/file/d/1eQlxAXN2Qt5MzQPVfGIUEFNOM9-EE7h1/view?usp=drive_link"
        ],
        layout: "split_text_left",
        imageSize: "2x2",
        edgeStyle: "fade",
        visible: true,
      },
      {
        id: "act_cma_passers",
        tab_label: "CMA Passers",
        icon: "star",
        category_badge: "GLOBAL CERTIFICATION",
        title: "CMA PASSERS 2026",
        subtitle: "PROVING GLOBAL EXCELLENCE IN STRATEGIC MANAGEMENT ACCOUNTING. 🌟",
        body: "Celebrating the hard-earned triumph of our Louisian scholars and alumni who successfully passed the prestigious Certified Management Accountant (CMA) examination. Your perseverance and intellectual rigor define the golden standard of the USLT BSMA program.\n\n#CMAPassers #GlobalExcellence #LouisianAccountants #JPAMARiseToShine",
        images: [
          "https://drive.google.com/file/d/1ytjYS8XFJgKFtQ83SBlUssfFfaQHCx7r/view?usp=drive_link"
        ],
        layout: "royal_banner",
        imageSize: "16:9",
        edgeStyle: "lined",
        visible: true,
      },
      {
        id: "act_free_books",
        tab_label: "Free Books",
        icon: "book",
        category_badge: "ACADEMIC SERVICES",
        title: "ACADEMIC REVIEW VAULT & FREE HANDOUTS",
        subtitle: "EMPOWERING SCHOLARS WITH COMPREHENSIVE STUDY HANDOUTS. 📖",
        body: "Access verified handouts, practice assessments, mock board reviewers, financial modeling templates, and testbanks spanning all BSMA core subjects — from Cost Accounting and MAS to Taxation, Auditing, and Business Law. Exclusively curated for Louisian scholars.\n\n#BSMAReviewVault #AcademicExcellence #FreeReviewers",
        images: [
          "https://drive.google.com/file/d/15YAci2rQNdqoSzBNIk6FGGODpGgx3Dzx/view?usp=drive_link"
        ],
        layout: "split_text_left",
        imageSize: "16:9",
        edgeStyle: "lined",
        visible: true,
      },
      {
        id: "act_october_fest",
        tab_label: "October Fest",
        icon: "calendar",
        category_badge: "CAMPUS LIFE & CELEBRATION",
        title: "BSMA OCTOBER FEST & GENERAL ASSEMBLY",
        subtitle: "UNITING FUTURE MANAGEMENT ACCOUNTANTS IN COMMUNITY & PURPOSE. 🍂",
        body: "A grand celebration of talent, camaraderie, and chapter solidarity! The BSMA October Fest brings together all year levels for fellowship, academic quiz showdowns, team-building activities, and recognition of outstanding scholars.\n\n#OctoberFest #JPAMAUnity #LouisianSpirit",
        images: [
          "https://drive.google.com/file/d/1ytjYS8XFJgKFtQ83SBlUssfFfaQHCx7r/view?usp=drive_link"
        ],
        layout: "royal_banner",
        imageSize: "16:9",
        edgeStyle: "fine",
        visible: true,
      },
      {
        id: "act_trivia_week",
        tab_label: "Trivia Week",
        icon: "lightbulb",
        category_badge: "THE WEEKLY LEXICON",
        title: "THE WEEKLY LEXICON: CASH FLOW",
        subtitle: "A NEW TERM, A NEW INSIGHT! ✨",
        body: "Expand your accounting vocabulary, strengthen your understanding, and discover the language behind the world of Management Accountants. 📚💼\n\nLet's learn and grow together, one term at a time.\n\nCash flow (CF) describes the balance of cash that moves into and out of a company during a specified accounting period. Accountants track CF on a dedicated document known as a cash flow statement.\n\n#TheWeeklyLexicon #JPAMARiseToShine #JPAngMAlakasan #MindOlympics",
        images: [
          "https://drive.google.com/file/d/1Cc89cpl5bLIGaUzDS0nKQR574h2NdO4o/view?usp=drive_link"
        ],
        layout: "infographic",
        imageSize: "4:3",
        edgeStyle: "fine",
        visible: true,
      },
      {
        id: "act_exam_snack",
        tab_label: "Exam Snack",
        icon: "snack",
        category_badge: "STUDENT WELFARE",
        title: "JPAMA'S SWEET RETURNS",
        subtitle: "A SWEET COMEBACK, SERVED WITH A WARM BOWL OF CHAMPORADO! 🥣🤎",
        body: "A little sweetness goes a long way! 🤎\n\nOn October 28, JPAMA brought back its sweet treat tradition through JPAMA Sweet Return, serving warm bowls of champorado to our fellow JPAMAns at the BCJ Grounds.\n\nMore than just satisfying cravings, this initiative was a simple way of bringing comfort and a little happiness to students amid their busy academic routines. Because sometimes, a warm bowl of champorado and a thoughtful gesture are enough to make an ordinary school day a little better.\n\nFrom the preparation to the distribution, every bowl served carried the same intention: to share sweetness, spread warmth, and make our JPAMAns feel remembered.\n\nHere's to more little moments, shared smiles, and initiatives that make our JPAMA community a little sweeter! 🥣🤎\n\n#JPAMASweetTreat #JPAMASweetReturn #JPAMA #JPAMAn #ChamporadoDistribution #SweetnessIsServed #JPAMAInitiatives #SweetReturns",
        images: [
          "https://drive.google.com/file/d/1RRkY7-6hzpJjRg7hbZF_YdA6T2oeMkFm/view?usp=drive_link",
          "https://drive.google.com/file/d/1_FXYBwSiKAN3czJOwZLkwbSt9_vA0ozr/view?usp=drive_link",
          "https://drive.google.com/file/d/1eQlxAXN2Qt5MzQPVfGIUEFNOM9-EE7h1/view?usp=drive_link"
        ],
        layout: "mosaic",
        imageSize: "16:9",
        edgeStyle: "fade",
        visible: true,
      }
    ]
  },
};

export interface FacultyAdviser {
  name: string;
  role: string;
  title: string;
  subjects_handled?: string; // e.g. "Cost Accounting, MAS"
  avatar?: string;
}

export interface AboutContent {
  header: {
    badge: string;
    title: string;
    title_highlight: string;
    description: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    desc: string;
  };
  vision: {
    eyebrow: string;
    title: string;
    desc: string;
  };
  milestones: Array<{
    year: string;
    title: string;
    desc: string;
  }>;
  /** Dynamic list of faculty advisers */
  faculty_advisers: FacultyAdviser[];
  /** Chapter achievements and honors merged under About */
  achievements: Array<{
    year: string;
    title: string;
    category: string;
    description: string;
  }>;
  constitution_articles: Array<{
    article: string;
    title: string;
    content: string;
  }>;
}

export interface ContactContent {
  desk_name: string;
  address_heading: string;
  address_body: string;
  email_heading: string;
  email_address: string;
  hours_heading: string;
  hours_body: string;
  facebook_label: string;
  facebook_url: string;
  linkedin_label: string;
  linkedin_url: string;
  inquiry_card_title: string;
  inquiry_card_desc: string;
}

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  desk_name: "Bulwagang San Jacinto Desk",
  address_heading: "Campus Address",
  address_body: "JPAMA Chapter Headquarters, Bulwagang San Jacinto, University of Saint Louis, Mabini St., Tuguegarao City, Cagayan, Philippines 3500",
  email_heading: "Email Address",
  email_address: "jpama@uslt.edu.ph",
  hours_heading: "Secretariat Consultation Hours",
  hours_body: "Monday to Friday: 9:00 AM – 5:00 PM\nSaturday: 9:00 AM – 12:00 PM (By appointment)",
  facebook_label: "JPAMA - University of Saint Louis Tuguegarao",
  facebook_url: "https://facebook.com/jpama.uslt",
  linkedin_label: "JPAMA USLT Chapter",
  linkedin_url: "https://linkedin.com",
  inquiry_card_title: "BSMA Academic Inquiries",
  inquiry_card_desc: "For questions on course syllabi or exam review circles, please coordinate directly with the Academic Wing committee.",
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  header: {
    badge: "USLT School of Accountancy, Business, and Hospitality (SABH)",
    title: "About",
    title_highlight: "JPAMA USLT",
    description:
      "The recognized student organization for the Bachelor of Science in Management Accounting (BSMA) at the University of Saint Louis Tuguegarao. Fostering academic rigor, ethical leadership, and professional excellence.",
  },
  mission: {
    eyebrow: "OUR MISSION",
    title: "Academic Fortitude & Competence",
    desc: "To cultivate competent, values-driven management accountants by providing intensive curricular review circles, CMA certification guidance, and real-world managerial decision workshops.",
  },
  vision: {
    eyebrow: "OUR VISION",
    title: "Exemplary Louisian Leadership",
    desc: "A premier student association producing ethical, globally certified financial leaders committed to Christian presence, professional integrity, and transformative community service.",
  },
  milestones: [
    {
      year: "2014",
      title: "Chapter Foundation",
      desc: "Established under SABH to represent the specialized needs of Louisian Management Accounting scholars.",
    },
    {
      year: "2020",
      title: "CMA Track Integration",
      desc: "Direct academic coordination with Institute of Management Accountants (IMA) review programs and mock assessments.",
    },
    {
      year: "2026",
      title: "Sihaya Era",
      desc: "Inaugurating radiant beginnings through digital student portals, interactive review kits, and expanded student welfare.",
    },
  ],
  faculty_advisers: [
    {
      name: "Prof. Marites G. Cardenas, CPA, MBA, CMA",
      role: "Chapter Adviser",
      title: "Faculty Adviser, JPAMA USLT Chapter",
      subjects_handled: "Management Accounting, Strategic Cost Management",
      avatar: "",
    },
    {
      name: "Dr. Ronald M. Villa, CPA, PhD",
      role: "SABH Dean",
      title: "Dean, School of Accountancy, Business, and Hospitality (SABH)",
      subjects_handled: "Advanced Financial Accounting, Corporate Governance",
      avatar: "",
    },
    {
      name: "Prof. Maria Clara Fontanilla, CPA, CMA",
      role: "Department Head",
      title: "Head, Department of Accountancy",
      subjects_handled: "Cost Accounting & Control, MAS",
      avatar: "",
    },
  ],
  achievements: [
    {
      year: "2025",
      title: "Regional Management Accounting Academic Championship",
      category: "Academic Competition",
      description: "Champion in the Regional Inter-Collegiate Management Accounting Quiz Bee organized by NFJPIA Region 2.",
    },
    {
      year: "2025",
      title: "100% Passing Rate - Certified Management Accountant (CMA) Part 1",
      category: "Professional Certification",
      description: "Louisian BSMA candidate scholars attained a flawless 100% passing mark on the IMA international assessment.",
    },
    {
      year: "2024",
      title: "Most Outstanding Academic Student Organization",
      category: "University Award",
      description: "Conferred by the USLT Supreme Student Council and Office of Student Affairs for excellence in co-curricular initiatives.",
    },
  ],
  constitution_articles: [
    {
      article: "Article I",
      title: "Name & Affiliation",
      content:
        "The organization is officially designated as the Junior Philippine Association of Management Accountants (JPAMA) – USLT Chapter, chartered under SABH.",
    },
    {
      article: "Article II",
      title: "Membership Eligibility",
      content:
        "All bona fide students enrolled in the Bachelor of Science in Management Accounting (BSMA) course at the University of Saint Louis Tuguegarao are entitled to membership.",
    },
    {
      article: "Article III",
      title: "Rights & Privileges",
      content:
        "Members in good standing enjoy access to academic testbanks, voting in executive elections, participation in convocations, and the official donning of chapter pins.",
    },
    {
      article: "Article IV",
      title: "Executive Council",
      content:
        "The executive authority resides in the elected officers, subject to faculty adviser oversight and institutional regulations of USLT.",
    },
  ],
};

export interface RolePermissions {
  members: { view: boolean; add: boolean; edit: boolean; delete: boolean };
  events: { view: boolean; add: boolean; edit: boolean; delete: boolean };
  resources: { view: boolean; add: boolean; edit: boolean; delete: boolean };
  leadership: { view: boolean; edit: boolean };
  alumni: { view: boolean; add: boolean; edit: boolean; delete: boolean };
  overview: { view: boolean; edit: boolean };
  about: { view: boolean; edit: boolean };
}

export interface PortalFeatures {
  publicLookup: boolean;
  registrationOpen: boolean;
  resourceDownloads: boolean;
  alumniVisible: boolean;
  maintenanceNotice: string;
}

export interface SecurityConfig {
  super_passcode: string;
  officer_passcode: string;
}

export interface MasterAccessConfig {
  security: SecurityConfig;
  officerPermissions: RolePermissions;
  features: PortalFeatures;
}

export const DEFAULT_ACCESS_CONFIG: MasterAccessConfig = {
  security: {
    super_passcode: "",
    officer_passcode: "",
  },
  officerPermissions: {
    members: { view: true, add: true, edit: true, delete: false },
    events: { view: true, add: true, edit: true, delete: false },
    resources: { view: true, add: true, edit: true, delete: false },
    leadership: { view: true, edit: false },
    alumni: { view: true, add: true, edit: true, delete: false },
    overview: { view: true, edit: true },
    about: { view: true, edit: true },
  },
  features: {
    publicLookup: true,
    registrationOpen: true,
    resourceDownloads: true,
    alumniVisible: true,
    maintenanceNotice: "",
  },
};
