import { createHmac, timingSafeEqual } from "node:crypto"

const DEFAULT_SECRET = "dev-secret-change-me"
const COOKIE_NAME = "admin_session"

function getSecret() {
  return process.env.SESSION_SECRET || DEFAULT_SECRET
}

function base64urlEncode(input: string | Buffer) {
  return Buffer.from(input).toString("base64url")
}

function base64urlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8")
}

export function sign(value: string) {
  const h = createHmac("sha256", getSecret())
  h.update(value)
  return h.digest("base64url")
}

export function createSessionValue(username: string) {
  const payload = JSON.stringify({
    u: username,
    t: Date.now(),
  })
  const val = base64urlEncode(payload)
  const sig = sign(val)
  return `${val}.${sig}`
}

export function verifySessionValue(cookieValue?: string | null) {
  if (!cookieValue) return null
  const parts = cookieValue.split(".")
  if (parts.length !== 2) return null
  const [val, sig] = parts
  const expected = sign(val)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  try {
    if (!timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const payload = JSON.parse(base64urlDecode(val)) as { u: string; t: number }
    if (payload?.u !== "admin") return null
    return payload
  } catch {
    return null
  }
}

export function getCookieName() {
  return COOKIE_NAME
}
