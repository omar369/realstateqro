import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // segunda capa anti-bot
    if (data.empresa && data.empresa.trim() !== "") {
      console.warn("🛑 Honeypot activado desde route.ts");
      return NextResponse.json({ success: false, message: "Bot detectado" }, { status: 400 });
    }

    await sendEmail(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}

