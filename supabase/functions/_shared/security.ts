// supabase/functions/_shared/security.ts

const ALLOWED_ORIGINS = ["https://xairod.com", "https://www.xairod.com"];

export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";
  if (!origin && !referer) return true;
  return ALLOWED_ORIGINS.some(a => origin.startsWith(a) || referer.startsWith(a));
}

export async function safeParseBody(req: Request): Promise<Record<string, unknown> | null> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return null;
  try {
    const body = await req.json();
    if (typeof body !== "object" || Array.isArray(body) || body === null) return null;
    return body as Record<string, unknown>;
  } catch { return null; }
}

export function strictPick(body: Record<string, unknown>, allowed: string[]): Record<string, unknown> | null {
  const unknown = Object.keys(body).filter(k => !allowed.includes(k));
  if (unknown.length > 0) return null;
  const clean: Record<string, unknown> = {};
  for (const key of allowed) { if (key in body) clean[key] = body[key]; }
  return clean;
}

const headers = { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY" };
export const badRequestResponse     = (msg = "Bad request")   => new Response(JSON.stringify({ error: msg }), { status: 400, headers });
export const originResponse         = ()                       => new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers });
export const unprocessableResponse  = (msg: string)           => new Response(JSON.stringify({ error: msg }), { status: 422, headers });
export const successResponse        = (data: unknown)         => new Response(JSON.stringify(data), { status: 200, headers });
