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
  download_url: string;
  downloads_count: number;
  description: string;
  updated_at: string;
}
