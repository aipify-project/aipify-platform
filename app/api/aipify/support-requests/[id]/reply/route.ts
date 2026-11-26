import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type Body = {
  body?: string;
  idempotency_key?: string;
};

/**
 * Customer portal reply on an APP support request.
 * Requires Core RPC `reply_app_portal_support_request` (SQL candidate — not applied yet).
 * Email stays OFF; internal notes are never returned.
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = (await request.json()) as Body;
    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    if (body.length < 1 || body.length > 5000) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("reply_app_portal_support_request", {
      p_id: id,
      p_body: body,
      p_idempotency_key: payload.idempotency_key ?? null,
    });

    if (error) {
      const message = error.message ?? "";
      if (/function .* does not exist|could not find/i.test(message)) {
        return NextResponse.json(
          {
            error: "portal_reply_rpc_not_applied",
            message:
              "Customer portal reply requires approved SQL candidate customer_self_service_support_profile_portal_reply_v1.sql",
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, result: data });
  } catch {
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
