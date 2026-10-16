import { NextResponse } from "next/server";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Resolved";
  created_at: string;
}

// Global in-memory storage for contact inquiries across API requests
const globalForInquiries = global as unknown as { __jpama_inquiries?: ContactInquiry[] };
if (!globalForInquiries.__jpama_inquiries) {
  globalForInquiries.__jpama_inquiries = [
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
}

const inquiries: ContactInquiry[] = globalForInquiries.__jpama_inquiries;

export async function GET() {
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
    const item = inquiries.find((i) => i.id === id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }
    if (status) item.status = status;
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const index = inquiries.findIndex((i) => i.id === id);
    if (index !== -1) {
      inquiries.splice(index, 1);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
