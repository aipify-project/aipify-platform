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
      lifecycle_stage?: string;
      review_owner?: string;
      responsible_department?: string;
      review_frequency?: string;
      lifecycle_notes?: string;
      next_review_at?: string;
    };
    if (!body.pack_key) return NextResponse.json({ error: "pack_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("update_app_portal_business_pack_lifecycle", {
      p_pack_key: body.pack_key,
      p_lifecycle_stage: body.lifecycle_stage || null,
      p_review_owner: body.review_owner || null,
      p_responsible_department: body.responsible_department || null,
      p_review_frequency: body.review_frequency || null,
      p_lifecycle_notes: body.lifecycle_notes || null,
      p_next_review_at: body.next_review_at || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackLifecycleDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to update lifecycle" }, { status: 500 });
  }
}
