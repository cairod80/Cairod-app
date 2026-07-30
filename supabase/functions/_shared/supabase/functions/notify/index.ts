// supabase/functions/notify/index.ts
// Deploy: supabase functions deploy notify
// Called server-side whenever a notification needs to be sent to a user

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateOrigin, safeParseBody, strictPick, badRequestResponse, originResponse, successResponse, unprocessableResponse } from "../_shared/security.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role only — never expose this to frontend
);

interface NotifyPayload {
  user_id: string;
  icon?: string;
  bg_color?: string;
  message: string;
  message_ar?: string;
  detail?: string;
  detail_ar?: string;
  link_type?: string;
  link_id?: string;
}

Deno.serve(async (req: Request) => {
  // 1. Origin check
  if (!validateOrigin(req)) return originResponse();

  // 2. Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // 3. Parse body safely
  const body = await safeParseBody(req);
  if (!body) return badRequestResponse("Invalid JSON body");

  // 4. Strict field allowlist — reject unknown fields
  const cleaned = strictPick(body, [
    "user_id","icon","bg_color","message","message_ar",
    "detail","detail_ar","link_type","link_id"
  ]);
  if (!cleaned) return badRequestResponse("Unexpected fields in request");

  // 5. Validate required fields
  if (!cleaned.user_id || typeof cleaned.user_id !== "string") {
    return unprocessableResponse("user_id is required");
  }
  if (!cleaned.message || typeof cleaned.message !== "string" || (cleaned.message as string).length < 3) {
    return unprocessableResponse("message is required and must be at least 3 characters");
  }
  if ((cleaned.message as string).length > 300) {
    return unprocessableResponse("message must be under 300 characters");
  }

  // 6. Insert notification
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id:     cleaned.user_id,
      icon:        cleaned.icon || "🔔",
      bg_color:    cleaned.bg_color || "rgba(10,107,62,0.15)",
      message:     (cleaned.message as string).trim(),
      message_ar:  cleaned.message_ar || null,
      detail:      cleaned.detail || null,
      detail_ar:   cleaned.detail_ar || null,
      link_type:   cleaned.link_type || null,
      link_id:     cleaned.link_id || null,
      is_read:     false,
    })
    .select()
    .single();

  if (error) {
    console.error("[notify] DB error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  return successResponse({ notification: data });
});
