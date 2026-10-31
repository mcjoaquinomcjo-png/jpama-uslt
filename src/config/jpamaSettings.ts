export interface ByLawSection {
  sectionNumber: string; // e.g., "Section 1"
  title?: string;
  content: string;
  subpoints?: string[];
}

export interface ByLawArticle {
  id: string;
  articleNumber: string; // e.g., "ARTICLE I"
  title: string; // e.g., "NAME AND LOGO"
  summary: string;
  sections: ByLawSection[];
}

export interface PublicationContent {
  headline: string;
  datePublished: string;
  author: string;
  coverImageUrl?: string;
  issueNumber?: string;
  pullQuote?: string;
  fullArticleHtml: string;
  tags?: string[];
}

export interface HeritageItem {
  id: string;
  year: string;
  title: string;
  summary: string;
  category?: string;
  coverImageUrl?: string;
  publicationContent?: PublicationContent;
}

export interface PurposeItem {
  id: string;
  title: string;
  description: string;
  icon: "Award" | "BookOpen" | "Users" | "ShieldCheck" | "Scale" | "Sparkles" | "Compass" | "GraduationCap";
  articleClause: string;
}

export interface AchievementItem {
  id: string;
  year: string;
  category: string;
  title: string;
  description: string;
  highlightTag?: string;
}

export interface CustomContentBox {
  id: string;
  title: string;
  text: string;
  layout: "card" | "banner" | "newsletter";
  badge?: string;
  linkText?: string;
  linkUrl?: string;
  publicationContent?: PublicationContent;
}

export interface CustomTabConfig {
  id: string;
  title: string;
  enabled: boolean;
  description?: string;
  contentBoxes: CustomContentBox[];
}

export interface JpamaSectionConfig {
  chapterOverview: {
    purposes: PurposeItem[];
    heritage: HeritageItem[];
    achievements: AchievementItem[];
    purposes_enabled?: boolean;
    heritage_enabled?: boolean;
    achievements_enabled?: boolean;
  };
  bylaws: ByLawArticle[];
  bylaws_enabled?: boolean;
  customTabs: CustomTabConfig[];
  // Gazette Edition display mode
  gazette_use_pdf?: boolean;         // true = show PDF viewer, false = show article reader
  gazette_pdf_url?: string;          // Google Drive /preview or direct PDF link
}

export const DEFAULT_JPAMA_CONFIG: JpamaSectionConfig = {
  chapterOverview: {
    purposes: [
      {
        id: "p1",
        title: "Promoting Management Accounting Excellence",
        description:
          "To champion the rigorous study and professional advancement of Management Accounting as a distinguished discipline within the School of Accountancy, Business, and Hospitality.",
        icon: "GraduationCap",
        articleClause: "Article III, Section 1",
      },
      {
        id: "p2",
        title: "Building Multisectoral Harmony & Linkages",
        description:
          "To cultivate robust institutional relationships with professional bodies including PICPA, CMA Philippines, national federation chapters, and corporate finance industries.",
        icon: "Users",
        articleClause: "Article III, Section 2",
      },
      {
        id: "p3",
        title: "Fostering Louisian Camaraderie & Spirit",
        description:
          "To unite BSMA students through collaborative academic summits, leadership immersions, and collegiate development that nurture a culture of solidarity.",
        icon: "Sparkles",
        articleClause: "Article III, Section 3",
      },
      {
        id: "p4",
        title: "Upholding Uncompromising Ethical Standards",
        description:
          "To instill Christian values, professional integrity, accountability, and the Louisian hallmark of Christian excellence in all academic and financial governance.",
        icon: "ShieldCheck",
        articleClause: "Article III, Section 4",
      },
    ],
    heritage: [
      {
        id: "h-2023",
        year: "2023",
        title: "Chartering of the JPAMA Sihaya Chapter",
        summary:
          "Official accreditation and solemn chartering under the USLT School of Accountancy, Business, and Hospitality, inaugurating the 'Sihaya' batch.",
        category: "Institutional Charter",
        coverImageUrl: "/jpama-logo.jpg",
        publicationContent: {
          headline: "The Dawn of Sihaya: Chartering of JPAMA USLT Chapter",
          issueNumber: "Vol. I • Founding Commemorative Edition",
          datePublished: "October 2023",
          author: "Executive Secretariat & Editorial Board",
          pullQuote:
            "From earnest discussions in SABH lecture halls arose a resolute conviction: Louisian Management Accountants must possess a sacred forum of their own.",
          fullArticleHtml: `
            <p>In the academic year 2023, the Bachelor of Science in Management Accounting fraternity witnessed a defining milestone in collegiate leadership. Under the guidance of faculty advisers and with the blessing of the SABH administration, the Junior Philippine Association of Management Accountants (JPAMA) – University of Saint Louis Tuguegarao Chapter was solemnly chartered.</p>
            <p>Christened as <em>Sihaya</em>—a classical vernacular term evoking the first rays of radiant morning dawn—the chapter committed itself to elevating technical mastery in cost management, strategic decision-making, and financial governance.</p>
            <p>During the inaugural convocation held at Bulwagang San Jacinto, founding officers took their solemn oath to defend academic integrity, foster multi-sectoral camaraderie, and champion professional competence across Cagayan Valley.</p>
          `,
          tags: ["Founding", "SABH", "Collegiate History"],
        },
      },
      {
        id: "h-2024",
        year: "2024",
        title: "Inaugural BSMA Academic Summit & CMA Forum",
        summary:
          "Hosted the northern regional assembly on strategic cost management, digital analytics, and CMA certification pathways.",
        category: "Academic Milestones",
        coverImageUrl: "/jpama-logo.jpg",
        publicationContent: {
          headline: "Forging Strategic Visionaries: The 2024 BSMA Summit",
          issueNumber: "Vol. II • Academic Dispatch",
          datePublished: "September 2024",
          author: "Committee on Academic & Professional Development",
          pullQuote:
            "The contemporary management accountant is no longer a mere keeper of ledgers, but the visionary navigator of organizational strategy.",
          fullArticleHtml: `
            <p>Gathering over two hundred aspiring accountants, the 2024 Academic Summit convened industry practitioners and CMA luminaries to deliberate on the transformative shifts across modern corporate finance.</p>
            <p>Keynotes explored algorithmic cost tracking, ethical sustainability reporting, and the rigorous journey toward international certification. The summit catalyzed university-wide enthusiasm, setting a benchmark for future student academic symposia across Saint Louis.</p>
          `,
          tags: ["Summit", "CMA Pathways", "Leadership"],
        },
      },
      {
        id: "h-2025",
        year: "2025",
        title: "Expansion of Digital Resource Vault & Reviewer Repository",
        summary:
          "Launched the central repository providing comprehensive testbanks, reviewer modules, and lecture notes for all 4 BSMA year levels.",
        category: "Innovation & Service",
        coverImageUrl: "/jpama-logo.jpg",
        publicationContent: {
          headline: "Democratizing Academic Excellence: The JPAMA Resource Vault",
          issueNumber: "Vol. III • Digital Frontiers",
          datePublished: "November 2025",
          author: "Directorate of Academic Services",
          pullQuote:
            "Excellence flourishes when knowledge is generously shared among peers united by a common calling.",
          fullArticleHtml: `
            <p>Recognizing the academic demands of qualifying examinations and foundational courses in strategic cost analysis, the JPAMA Executive Board initiated the cloud-integrated Resource Vault.</p>
            <p>Curated by top-performing academic scholars and reviewed by faculty advisers, this portal provides 1st through 4th-year Louisian students with direct access to comprehensive mock board exams and study modules.</p>
          `,
          tags: ["Testbanks", "Academic Resources", "BSMA"],
        },
      },
      {
        id: "h-2026",
        year: "2026",
        title: "Sihaya Modernization & Cloud Integration",
        summary:
          "Unveiling the official web portal, real-time membership verification, live attendance RSVP, and public institutional gazette.",
        category: "Digital Transformation",
        coverImageUrl: "/jpama-logo.jpg",
        publicationContent: {
          headline: "A New Chapter in Governance: The Unified JPAMA Portal",
          issueNumber: "Vol. IV • Official Gazette Special",
          datePublished: "January 2026",
          author: "Information & Technology Secretariat",
          pullQuote:
            "Bridging organizational heritage with cutting-edge technology to serve every Louisian management accountant seamlessly.",
          fullArticleHtml: `
            <p>Marking a new era of transparent digital administration, the JPAMA Portal centralizes member verification, event registration, and dynamic constitution access in a unified, mobile-first ecosystem.</p>
            <p>Every member now possesses verified credentials, real-time tracking of chapter standing, and instant access to official executive records and constitutional articles.</p>
          `,
          tags: ["Portal", "Cloud Tech", "Governance"],
        },
      },
    ],
    achievements: [
      {
        id: "a1",
        year: "2025",
        category: "Academic Competition",
        title: "1st Place – Regional Strategic Case Analysis Championship",
        description:
          "Bestowed by the National Federation of Junior Philippine Institute of Accountants / Management Accountants in the Northern Luzon Collegiate Olympiad.",
        highlightTag: "Regional Champion",
      },
      {
        id: "a2",
        year: "2024",
        category: "Institutional Honor",
        title: "Most Outstanding Academic Student Organization",
        description:
          "Conferred by the USLT Supreme Student Council and Office of Student Affairs for excellence in co-curricular initiatives, governance, and community outreach.",
        highlightTag: "University Citation",
      },
      {
        id: "a3",
        year: "2024",
        category: "Professional Development",
        title: "Exemplary CMA Campus Student Leadership Award",
        description:
          "Recognized for spearheading pioneering CMA awareness campaigns and hosting high-yield mock certifications for BSMA students.",
        highlightTag: "Professional Honor",
      },
      {
        id: "a4",
        year: "2023",
        category: "Community Outreach",
        title: "SABH Civic Leadership & Financial Literacy Citation",
        description:
          "Recognized for community extension projects conducting basic bookkeeping and budgeting seminars for rural micro-entrepreneurs in Tuguegarao City.",
        highlightTag: "Civic Outreach",
      },
    ],
  },
  bylaws: [
    {
      id: "art-1",
      articleNumber: "ARTICLE I",
      title: "NAME AND LOGO",
      summary:
        "Establishes the official name, chapter jurisdiction, and heraldic symbolism of the official organization seal.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Official Designation",
          content:
            "The organization shall be officially designated and known as the JUNIOR PHILIPPINE ASSOCIATION OF MANAGEMENT ACCOUNTANTS – UNIVERSITY OF SAINT LOUIS TUGUEGARAO CHAPTER (JPAMA – USLT), operating under the School of Accountancy, Business, and Hospitality (SABH).",
        },
        {
          sectionNumber: "Section 2",
          title: "Official Seal and Emblem",
          content:
            "The official seal of JPAMA USLT shall feature the collegiate shield flanked by the laurel of academic distinction, the silhouette of visionary management accountants gazing toward national advancement, and the heraldic colors of Royal Navy and Burnished Gold.",
          subpoints: [
            "Navy Blue represents institutional integrity, analytical depth, and professional dignity.",
            "Burnished Gold symbolizes radiant wisdom, excellence, and the dawn of the Sihaya chapter.",
            "The Laurel Wreath signifies continuous scholarly conquest and ethical leadership.",
          ],
        },
      ],
    },
    {
      id: "art-2",
      articleNumber: "ARTICLE II",
      title: "GENERAL PROVISIONS AND DEFINITION OF TERMS",
      summary:
        "Defines governing principles, institutional subordination to USLT policies, and standard definitions of terms.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Institutional Alignment",
          content:
            "JPAMA USLT adheres strictly to the University Code of Saint Louis Tuguegarao, the guidelines of the Office of Student Affairs (OSA), and the supervisory authority of the School of Accountancy, Business, and Hospitality.",
        },
        {
          sectionNumber: "Section 2",
          title: "Definition of Terms",
          content:
            "For the purposes of this Constitution and By-Laws, the terms 'Member in Good Standing', 'Executive Council', 'General Assembly', and 'Academic Term' shall be interpreted in congruence with university regulations.",
        },
      ],
    },
    {
      id: "art-3",
      articleNumber: "ARTICLE III",
      title: "PURPOSES",
      summary:
        "Outlines the foundational mandate, aims, and co-curricular objectives governing all organizational initiatives.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Scholastic Competence",
          content:
            "To promote intellectual advancement and technical competence in the study and professional application of Management Accounting and strategic decision-making.",
        },
        {
          sectionNumber: "Section 2",
          title: "Multisectoral Linkages",
          content:
            "To establish active collaborative linkages with professional accounting bodies, business leaders, industry partners, and allied student councils nationwide.",
        },
        {
          sectionNumber: "Section 3",
          title: "Fraternal Solidarity",
          content:
            "To cultivate harmony, professional brotherhood, and mutual scholastic assistance among all students enrolled in the BSMA curriculum.",
        },
        {
          sectionNumber: "Section 4",
          title: "Ethical Integrity",
          content:
            "To foster uncompromising ethical values, moral responsibility, and Christian Louisian virtues across all co-curricular, financial, and personal endeavors.",
        },
      ],
    },
    {
      id: "art-4",
      articleNumber: "ARTICLE IV",
      title: "MEMBERSHIP",
      summary:
        "Specifies eligibility criteria, membership registration requirements, rights, duties, and privileges.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Eligibility",
          content:
            "All bona fide students officially enrolled in the Bachelor of Science in Management Accounting (BSMA) program of USLT are eligible and entitled to membership.",
        },
        {
          sectionNumber: "Section 2",
          title: "Rights of Members",
          content:
            "Every member in good standing possesses the right to participate in general assemblies, vote in regular elections, run for eligible officer positions, and access chapter resources.",
        },
        {
          sectionNumber: "Section 3",
          title: "Duties and Responsibilities",
          content:
            "Members shall faithfully uphold this Constitution, abide by university statutes, attend prescribed convocations, and pay requisite annual membership fees.",
        },
      ],
    },
    {
      id: "art-5",
      articleNumber: "ARTICLE V",
      title: "PROCEEDINGS, SANCTIONS, AND TERMINATION",
      summary:
        "Details due process, academic standing obligations, disciplinary sanctions, and termination of membership.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Due Process & Code of Conduct",
          content:
            "No member shall be subjected to disciplinary sanction without written notification and an impartial hearing conducted under the jurisdiction of the Executive Council and Faculty Adviser.",
        },
        {
          sectionNumber: "Section 2",
          title: "Grounds for Sanctions",
          content:
            "Acts contrary to university discipline, intentional malversation of chapter funds, gross academic dishonesty, or willful violation of the By-Laws constitute grounds for sanction.",
        },
      ],
    },
    {
      id: "art-6",
      articleNumber: "ARTICLE VI",
      title: "THE ASSEMBLY",
      summary:
        "Defines the composition, frequency, quorum requirements, and powers of the General Assembly.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Supreme Legislative Body",
          content:
            "The General Assembly, comprising all bona fide members in good standing, constitutes the highest policy-confirming body of JPAMA USLT.",
        },
        {
          sectionNumber: "Section 2",
          title: "Regular and Special Convocations",
          content:
            "The General Assembly shall convene at least once per academic semester. Special assemblies may be convoked by the President upon approval of the Faculty Adviser.",
        },
      ],
    },
    {
      id: "art-7",
      articleNumber: "ARTICLE VII",
      title: "LEADERS (EXECUTIVE OFFICERS & DUTIES)",
      summary:
        "Codifies the executive council hierarchy, specialized vice presidencies, and specific governance portfolios.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Composition of the Executive Council",
          content:
            "The executive administration is vested in the President, Executive Vice President, specialized Vice Presidents, Secretary General, and collegiate ambassadors.",
          subpoints: [
            "President: Chief Executive Officer directing general policy and institutional representation.",
            "Executive Vice President: Deputy executive coordinating internal administrative affairs.",
            "VP Academics: Oversees academic testbanks, symposia, and study circles.",
            "VP Non-Academics: Coordinates civic outreach, sports festivals, and cultural events.",
            "VP Finance & VP Audit: Safeguards organizational treasury, budget preparation, and independent audits.",
            "VP Communications, Graphics & Marketing: Directs public notices, branding, and digital platforms.",
            "VP Membership & Logistics: Manages student rosters, logistics, and convocations.",
          ],
        },
        {
          sectionNumber: "Section 2",
          title: "Faculty Advisers",
          content:
            "The organization shall have dedicated Faculty Advisers appointed from the SABH faculty, providing moral, professional, and institutional stewardship.",
        },
      ],
    },
    {
      id: "art-8",
      articleNumber: "ARTICLE VIII",
      title: "VACANCIES AND ELECTION",
      summary:
        "Governs annual elections, qualification benchmarks, Electoral Board proceedings, and succession rules.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Annual Elections",
          content:
            "Executive Council elections shall be held annually in the second semester under the supervision of an independent Commission on Elections (COMELEC).",
        },
        {
          sectionNumber: "Section 2",
          title: "Qualifications",
          content:
            "Candidates must be enrolled BSMA students with good moral character, free from failing grades, and compliant with university leadership guidelines.",
        },
        {
          sectionNumber: "Section 3",
          title: "Order of Succession",
          content:
            "Should a vacancy occur in the Presidency, the Executive Vice President shall automatically ascend to complete the unexpired term.",
        },
      ],
    },
    {
      id: "art-9",
      articleNumber: "ARTICLE IX",
      title: "FINANCES",
      summary:
        "Regulates membership dues, bank deposits, audit reports, and transparent financial stewardship.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Sources of Funds",
          content:
            "Funds shall be derived from official membership dues approved by the SABH administration, authorized fund-raising projects, and voluntary collegiate contributions.",
        },
        {
          sectionNumber: "Section 2",
          title: "Audited Financial Statements",
          content:
            "The VP Audit and VP Finance shall publish an audited statement of financial condition at the conclusion of every academic semester, signed by the Faculty Adviser.",
        },
      ],
    },
    {
      id: "art-10",
      articleNumber: "ARTICLE X",
      title: "AMENDMENTS",
      summary:
        "Specifies the constitutional convention procedures and voting thresholds required to alter these By-Laws.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Proposal of Amendments",
          content:
            "Any amendment or revision may be proposed by a two-thirds (2/3) vote of the Executive Council or upon written petition signed by at least twenty percent (20%) of the members.",
        },
        {
          sectionNumber: "Section 2",
          title: "Ratification",
          content:
            "Proposed amendments shall take effect upon ratification by a majority of votes cast in a plebiscite of the General Assembly and approval by the SABH Dean.",
        },
      ],
    },
    {
      id: "art-11",
      articleNumber: "ARTICLE XI",
      title: "EFFECTIVITY",
      summary:
        "Codifies the date of promulgation, repealing clause, and immediate binding force across the chapter.",
      sections: [
        {
          sectionNumber: "Section 1",
          title: "Date of Effectivity",
          content:
            "This Constitution and By-Laws shall take effect immediately upon official approval by the School of Accountancy, Business, and Hospitality and the Office of Student Affairs.",
        },
        {
          sectionNumber: "Section 2",
          title: "Repealing Clause",
          content:
            "All previous resolutions, constitutions, and bylaws inconsistent with the provisions herein are hereby repealed or modified accordingly.",
        },
      ],
    },
  ],
  customTabs: [
    {
      id: "sihaya-gazette",
      title: "Sihaya Publications",
      enabled: true,
      description: "Official institutional dispatches, annual bulletins, and executive communiques.",
      contentBoxes: [
        {
          id: "cb-1",
          title: "The Sihaya Annual Executive Report",
          text: "A comprehensive retrospective detailing organizational achievements, financial balance sheets, and co-curricular milestones achieved throughout the current academic year.",
          layout: "newsletter",
          badge: "Annual Report",
          linkText: "Read Gazette Edition",
          publicationContent: {
            headline: "Annual State of the Chapter: The Sihaya Journey",
            issueNumber: "2025-2026 Executive Summary",
            datePublished: "Academic Year 2025-2026",
            author: "Office of the President & Secretariat",
            pullQuote:
              "With unwavering fidelity to our BSMA calling, we celebrate scholastic triumphs and institutional breakthroughs that honor Saint Louis.",
            fullArticleHtml: `
              <p>The academic year has exemplified unprecedented vigor across our student community. From regional academic podium finishes to the successful rollout of the digital resource library, JPAMA USLT has continuously redefined collegiate leadership.</p>
              <p>Through the stewardship of our faculty advisers and the tireless commitment of our executive committees, chapter initiatives registered a 96% student engagement rate across all four year levels.</p>
              <p>As we advance into the upcoming semester, our resolve remains steadfast: to cultivate accountants of competence, character, and Christian commitment.</p>
            `,
            tags: ["Executive", "Annual Report", "SABH"],
          },
        },
        {
          id: "cb-2",
          title: "Strategic Management Accounting Roadmap",
          text: "Guidelines and recommended pathway resources for students preparing for CMA (Certified Management Accountant) credentials and international business certifications.",
          layout: "card",
          badge: "Professional Track",
        },
        {
          id: "cb-3",
          title: "Code of Christian Professional Ethics",
          text: "Core principles of confidentiality, intellectual honesty, and public accountability expected of every Louisian Management Accounting student.",
          layout: "banner",
          badge: "Institutional Values",
        },
      ],
    },
  ],
};

// Storage helper functions for CMS configuration
const CONFIG_KEY = "jpama_dynamic_section_config";

export function getStoredJpamaConfig(): JpamaSectionConfig {
  if (typeof window === "undefined") {
    return DEFAULT_JPAMA_CONFIG;
  }
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_JPAMA_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      chapterOverview: {
        purposes: Array.isArray(parsed?.chapterOverview?.purposes)
          ? parsed.chapterOverview.purposes
          : DEFAULT_JPAMA_CONFIG.chapterOverview.purposes,
        heritage: Array.isArray(parsed?.chapterOverview?.heritage)
          ? parsed.chapterOverview.heritage
          : DEFAULT_JPAMA_CONFIG.chapterOverview.heritage,
        achievements: Array.isArray(parsed?.chapterOverview?.achievements)
          ? parsed.chapterOverview.achievements
          : DEFAULT_JPAMA_CONFIG.chapterOverview.achievements,
      },
      bylaws: Array.isArray(parsed?.bylaws) && parsed.bylaws.length > 0
        ? parsed.bylaws
        : DEFAULT_JPAMA_CONFIG.bylaws,
      customTabs: Array.isArray(parsed?.customTabs)
        ? parsed.customTabs
        : DEFAULT_JPAMA_CONFIG.customTabs,
    };
  } catch (e) {
    console.error("Failed to parse JPAMA config from localStorage:", e);
    return DEFAULT_JPAMA_CONFIG;
  }
}

export function saveStoredJpamaConfig(config: JpamaSectionConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save JPAMA config to localStorage:", e);
  }
}

export async function fetchServerJpamaConfig(): Promise<JpamaSectionConfig> {
  try {
    const res = await fetch(`/api/settings/about?_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveStoredJpamaConfig(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch server JPAMA config, using local cache:", err);
  }
  return getStoredJpamaConfig();
}

export async function saveServerJpamaConfig(config: JpamaSectionConfig): Promise<boolean> {
  saveStoredJpamaConfig(config);
  try {
    const res = await fetch("/api/settings/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to save JPAMA config to server:", err);
    return false;
  }
}

