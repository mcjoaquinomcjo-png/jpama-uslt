import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { recordDbLog } from "@/lib/dbLogger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// No mock inquiries: only real submitted messages from students
const INITIAL_INQUIRIES: ContactInquiry[] = [];

function readData(): { inquiries: ContactInquiry[]; deletedIds: string[] } {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let deletedIds: string[] = ["inq-01", "inq-02"];
    if (fs.existsSync(DELETED_FILE)) {
      try {
        const rawDel = fs.readFileSync(DELETED_FILE, "utf-8");
        const parsed = JSON.parse(rawDel);
        if (Array.isArray(parsed)) {
          deletedIds = Array.from(new Set([...deletedIds, ...parsed]));
        }
      } catch (e) {
        // ignore
      }
    }

    let inquiries: ContactInquiry[] = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      try {
        const rawInq = fs.readFileSync(INQUIRIES_FILE, "utf-8");
        const parsed = JSON.parse(rawInq);
        if (Array.isArray(parsed)) {
          inquiries = parsed;
        }
      } catch (e) {
        inquiries = [];
      }
    } else {
      inquiries = [];
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
    }

    // Filter out permanently deleted inquiries
    const filtered = inquiries.filter((inq) => !deletedIds.includes(inq.id));
    return { inquiries: filtered, deletedIds };
  } catch (err) {
    console.error("Error reading inquiry data:", err);
    return { inquiries: [], deletedIds: ["inq-01", "inq-02"] };
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
  return NextResponse.json(
    { success: true, data: inquiries },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All contact fields are required." },
        { status: 400 }
      );
    }

    const { inquiries, deletedIds } = readData();

    const newInquiry: ContactInquiry = {
      id: "inq-" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: "Unread",
      created_at: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    writeData(inquiries, deletedIds);

    recordDbLog({
      action: "NEW_CONTACT_INQUIRY",
      target: `Inquiry from ${newInquiry.name}`,
      storage: "LocalStore",
      status: "SUCCESS",
    });

    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
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

    if (id === "all") {
      const allIds = inquiries.map((i) => i.id);
      const updatedDeleted = Array.from(new Set([...deletedIds, ...allIds, "inq-01", "inq-02"]));
      writeData([], updatedDeleted);

      recordDbLog({
        action: "DELETE_ALL_INQUIRIES",
        target: "All inquiries inbox",
        storage: "LocalStore",
        status: "SUCCESS",
        details: "Cleared all received inquiries.",
      });

      return NextResponse.json({ success: true, message: "All inquiries cleared" });
    }

    // Single item delete
    const index = inquiries.findIndex((i) => i.id === id);

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
