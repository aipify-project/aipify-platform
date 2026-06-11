import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      integration_id?: string;
      event_type?: string;
      payload?: Record<string, unknown>;
      signature?: string;
    };
    if (!body.integration_id || !body.event_type) {
      return NextResponse.json({ error: "integration_id and event_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("validate_integration_webhook", {
      p_integration_id: body.integration_id,
      p_event_type: body.event_type,
      p_payload: body.payload ?? {},
      p_signature: body.signature ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to validate webhook" }, { status: 500 });
  }
}
