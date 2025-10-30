import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    const secret = process.env.TURNSTILE_SECRET_KEY

    if (!token || !secret) {
      return NextResponse.json({ ok: false, error: "Missing token or secret" }, { status: 400 })
    }

    const body = new URLSearchParams()
    body.append("secret", secret)
    body.append("response", token)

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    const data = await res.json()
    console.log("Turnstile verification:", data) // 👈 útil para debug

    if (data.success) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, error: data["error-codes"] }, { status: 400 })
  } catch (err) {
    console.error("Verify error:", err)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}

