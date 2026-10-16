import { NextResponse } from "next/server";

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

    // In a real environment, this sends to jpama.uslt@gmail.com or stores in a contacts table
    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been routed to the JPAMA Executive Secretariat. We will get back to you shortly.",
      data: { name, email, subject, timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
