import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { token } = await req.json()
  const secret = process.env.TURNSTILE_SECRET_KEY!

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  })

  const data = await res.json()
  if (data.success) return NextResponse.json({ ok: true })
  return NextResponse.json({ ok: false }, { status: 400 })
}

