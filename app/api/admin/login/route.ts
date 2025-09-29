import { NextResponse } from "next/server"
import { createSessionValue, getCookieName } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (username === "admin" && password === "password123") {
      const value = createSessionValue("admin")
      const res = NextResponse.json({ ok: true })
      res.cookies.set({
        name: getCookieName(),
        value,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure recommended; Next.js runs on https in preview; keep true
        secure: true,
        maxAge: 60 * 60 * 8, // 8 hours
      })
      return res
    }
    return NextResponse.json({ ok: false, error: "Username atau password salah." }, { status: 401 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 })
  }
}
