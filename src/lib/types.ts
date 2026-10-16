export type MemberStatus = "Pending" | "Active" | "Graduated";

export type YearLevel = "1st Year" | "2nd Year" | "3rd Year" | "4th Year";

export type DegreeProgram = "BSMA";

export interface Member {
  id: string; // UUID
  student_number: string; // Unique, e.g. "2024-00142"
  full_name: string;
  email: string;
  year_level: YearLevel;
  program: DegreeProgram;
  status: MemberStatus;
  created_at: string;
  birthdate?: string;
  residence?: string;
  payment_ref?: string;
  avatar_url?: string;
}

export interface EventItem {
  id: string; // UUID
  slug: string; // Unique, e.g. "sihaya-induction-2026"
  title: string;
  category: "Academic" | "Leadership" | "Webinar" | "Social" | "Competition";
  description: string;
  full_details?: string;
  event_date: string;
  event_time?: string;
  location: string;
  max_capacity: number;
  is_published: boolean;
  speaker?: string;
  speaker_role?: string;
  badge?: string;
  image_url?: string;
  agenda?: { time: string; activity: string }[];
}

export type AttendanceStatus = "Registered" | "Attended" | "Cancelled";

export interface RSVP {
  id: string; // UUID
  event_id: string;
  member_id: string;
  attendance_status: AttendanceStatus;
  registered_at: string;
  // Denormalized convenience fields for UI
  student_number?: string;
  full_name?: string;
  email?: string;
  notes?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: "Academic Reviewer" | "Webinar" | "Template" | "Study Kit";
  subject: string; // e.g., "Cost Accounting & Control", "Strategic Cost Management"
  year_level: string;
  format: "PDF" | "XLSX" | "MP4 / Stream" | "ZIP Kit";
  size: string;
  author: string;
  download_url: string; // Direct cloud link / Google Drive / OneDrive
  downloads_count: number;
  description: string;
  updated_at: string;
}

export interface OfficerItem {
  id: string;
  name: string;
  role: string;
  category: "Executive Board" | "Faculty Adviser";
  committee: string;
  term: string;
  yearProgram?: string;
  quote?: string;
  avatar: string;
  photo_url?: string; // Optional headshot image URL (admin-uploaded)
}

export interface PortalSettings {
  portal_title: string;
  academic_year: string;
  advisory_notice: string;
  official_email: string;
  facebook_url: string;
  office_location: string;
}

export interface AlumniMember {
  id: string;
  full_name: string;
  year_graduated: string;         // e.g. "2024"
  photo_url?: string;
  current_company?: string;
  current_role?: string;
  work_description?: string;
  leadership_experiences?: string;
  badges?: string[];              // e.g. ["CMA", "Dean's Lister"]
  batch_label?: string;           // e.g. "Batch 2024 – Sihaya"
  linkedin_url?: string;
}

export type AchievementCategory =
  | "CMA Passer"
  | "CMA Scholar"
  | "Dean's Lister"
  | "Award / Recognition"
  | "Champion"
  | "Board Passer";

export interface Achievement {
  id: string;
  full_name: string;
  category: AchievementCategory;
  detail: string;                 // e.g. "IMA CMA Passer – Part 1 & 2, 2025"
  year: string;
  photo_url?: string;
  badge_color?: string;           // tailwind color token e.g. "amber"
}
