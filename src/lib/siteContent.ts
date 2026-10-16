// Shared content models and defaults for Overview and About pages

export interface OverviewContent {
  hero: {
    badge: string;
    title_start: string;
    title_highlight: string;
    description: string;
    tagline_dept: string;
    tagline_loc: string;
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
  };
  resources: {
    badge: string;
    title: string;
    description: string;
    tags: string[];
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
      "Access verified handouts, practice assessments, and mock board reviewers for Strategic Cost Management, MAS, Taxation, and Auditing. Exclusively curated for Louisian scholars.",
    tags: ["Strategic Cost Mgt", "Mgt Advisory Services", "Business Law & Tax"],
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
};

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
  faculty: {
    adviser_name: string;
    adviser_role: string;
    adviser_title: string;
    adviser_avatar?: string;
    dean_name: string;
    dean_role: string;
    dean_title: string;
    dean_avatar?: string;
    head_name: string;
    head_role: string;
    head_title: string;
    head_avatar?: string;
  };
  constitution_articles: Array<{
    article: string;
    title: string;
    content: string;
  }>;
}

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
  faculty: {
    adviser_name: "Prof. Marites G. Cardenas, CPA, MBA, CMA",
    adviser_role: "Chapter Adviser",
    adviser_title: "Faculty Adviser, JPAMA USLT Chapter",
    adviser_avatar: "",
    dean_name: "Dr. Ronald M. Villa, CPA, PhD",
    dean_role: "SABH Dean",
    dean_title: "Dean, School of Accountancy, Business, and Hospitality (SABH)",
    dean_avatar: "",
    head_name: "Prof. Maria Clara Fontanilla, CPA, CMA",
    head_role: "Department Head",
    head_title: "Head, Department of Accountancy",
    head_avatar: "",
  },
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
    super_passcode: "super2026",
    officer_passcode: "sihaya2026",
  },
  officerPermissions: {
    members: { view: true, add: true, edit: true, delete: false },
    events: { view: true, add: true, edit: true, delete: false },
    resources: { view: true, add: true, edit: true, delete: false },
    leadership: { view: true, edit: false },
  },
  features: {
    publicLookup: true,
    registrationOpen: true,
    resourceDownloads: true,
    alumniVisible: true,
    maintenanceNotice: "",
  },
};
