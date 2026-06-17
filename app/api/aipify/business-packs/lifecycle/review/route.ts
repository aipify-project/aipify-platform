import { NextResponse } from "next/server";
import { parsePackLifecycleDetail } from "@/lib/app-portal/business-pack-lifecycle";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      pack_key?: string;
      review_type?: string;
      review_owner?: string;
      answers?: Record<string, unknown>;
      notes?: string;
    };
    if (!body.pack_key) return NextResponse.json({ error: "pack_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("complete_app_portal_business_pack_lifecycle_review", {
      p_pack_key: body.pack_key,
      p_review_type: body.review_type || "on_demand",
      p_review_owner: body.review_owner || null,
      p_answers: body.answers || {},
      p_notes: body.notes || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackLifecycleDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to complete review" }, { status: 500 });
  }
}
