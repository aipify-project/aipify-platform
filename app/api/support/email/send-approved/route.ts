import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { draft_id?: string; approve_first?: boolean };

    if (!body.draft_id) {
      return NextResponse.json({ error: "draft_id required" }, { status: 400 });
    }

    if (body.approve_first) {
      const { error: approveError } = await supabase.rpc("approve_support_email_draft", {
        p_draft_id: body.draft_id,
      });
      if (approveError) return NextResponse.json({ error: approveError.message }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("send_approved_support_email", {
      p_draft_id: body.draft_id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Send approved email failed" }, { status: 500 });
  }
}
