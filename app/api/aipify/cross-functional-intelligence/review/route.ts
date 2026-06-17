import { NextResponse } from "next/server";
import { parseCFIActionResult } from "@/lib/app-portal/cross-functional-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      entity_id?: string;
      entity_type?: string;
      review_notes?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_cross_functional_intelligence", {
      p_entity_id:   body.entity_id   ?? null,
      p_entity_type: body.entity_type ?? "dependency",
      p_action:      body.action      ?? null,
      p_review_notes:body.review_notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCFIActionResult(data));
  } catch {
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
