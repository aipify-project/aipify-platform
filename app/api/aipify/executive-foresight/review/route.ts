import { NextResponse } from "next/server";
import { parseExecutiveForesightActionResult } from "@/lib/app-portal/executive-foresight";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      observation_id?: string;
      review_notes?: string;
      note_text?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_executive_foresight", {
      p_observation_id: body.observation_id ?? null,
      p_action: body.action ?? null,
      p_review_notes: body.review_notes ?? null,
      p_note_text: body.note_text ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutiveForesightActionResult(data));
  } catch {
    return NextResponse.json({ error: "Executive foresight review failed" }, { status: 500 });
  }
}
