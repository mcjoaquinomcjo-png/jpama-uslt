import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { recordDbLog } from "@/lib/dbLogger";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Resolved";
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const DELETED_FILE = path.join(DATA_DIR, "deleted_inquiries.json");

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: "inq-01",
    name: "Christian Emmanuel Paguirigan",
    email: "c.paguirigan@uslt.edu.ph",
    subject: "Membership & Pinning Ceremony Schedule",
    message: "Good day, Secretariat. May I ask when the scheduled donning of pins will be for 4th year graduating students? Thank you.",
    status: "Unread",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "inq-02",
    name: "Sophia Reign Agcaoili",
    email: "sophia.agcaoili@uslt.edu.ph",
    subject: "Academic Testbank Download Access",
    message: "Hello po, I submitted my membership registration this morning. Can I already download the MAS midterm reviewers once approved?",
    status: "Read",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

function readData(): { inquiries: ContactInquiry[]; deletedIds: string[] } {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let deletedIds: string[] = [];
    if (fs.existsSync(DELETED_FILE)) {
      try {
        const rawDel = fs.readFileSync(DELETED_FILE, "utf-8");
        deletedIds = JSON.parse(rawDel);
      } catch (e) {
        deletedIds = [];
      }
    }

    let inquiries: ContactInquiry[] = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      try {
        const rawInq = fs.readFileSync(INQUIRIES_FILE, "utf-8");
        inquiries = JSON.parse(rawInq);
      } catch (e) {
        inquiries = [...INITIAL_INQUIRIES];
      }
    } else {
      inquiries = [...INITIAL_INQUIRIES];
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
    }

    // Filter out any inquiries that have been permanently deleted
    const filtered = inquiries.filter((inq) => !deletedIds.includes(inq.id));
    return { inquiries: filtered, deletedIds };
  } catch (err) {
    console.error("Error reading inquiry data:", err);
    return { inquiries: [...INITIAL_INQUIRIES], deletedIds: [] };
  }
}

function writeData(inquiries: ContactInquiry[], deletedIds: string[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
    fs.writeFileSync(DELETED_FILE, JSON.stringify(deletedIds, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing inquiry data:", err);
  }
}

export async function GET() {
  const { inquiries } = readData();
  return NextResponse.json({ success: true, data: inquiries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const { inquiries, deletedIds } = readData();

    const newInquiry: ContactInquiry = {
      id: "inq-" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      status: "Unread",
      created_at: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    writeData(inquiries, deletedIds);

    recordDbLog({
      action: "NEW_CONTACT_INQUIRY",
      target: `${name.trim()} (${email.trim()})`,
      storage: "LocalStore",
      status: "SUCCESS",
      details: `Subject: ${subject || "General Inquiry"}`,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been routed to the JPAMA Executive Secretariat. We will get back to you shortly.",
      data: newInquiry,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    const { inquiries, deletedIds } = readData();

    const item = inquiries.find((i) => i.id === id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }
    if (status) item.status = status;

    writeData(inquiries, deletedIds);

    recordDbLog({
      action: "UPDATE_INQUIRY_STATUS",
      target: `Inquiry ${id}`,
      storage: "LocalStore",
      status: "SUCCESS",
      details: `Status set to ${status}`,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing inquiry ID" }, { status: 400 });
    }

    const { inquiries, deletedIds } = readData();
    const index = inquiries.findIndex((i) => i.id === id);

    // Track as permanently deleted
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
    }

    if (index !== -1) {
      inquiries.splice(index, 1);
    }

    writeData(inquiries, deletedIds);

    recordDbLog({
      action: "DELETE_INQUIRY",
      target: `Inquiry ${id}`,
      storage: "LocalStore",
      status: "SUCCESS",
      details: "Inquiry permanently deleted.",
    });

    return NextResponse.json({ success: true, message: "Inquiry permanently deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
