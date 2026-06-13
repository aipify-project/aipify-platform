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
      action?: "create" | "update" | "event";
      profile_key?: string;
      profile_name?: string;
      profile_type?: string;
      approval_mode?: string;
      event_type?: string;
      recommendation_key?: string;
      decision?: "accept" | "dismiss" | "disable" | "delete" | "override" | "complete_review";
    };

    if (body.action === "create") {
      const { data, error } = await supabase.rpc("create_approval_profile", {
        p_payload: {
          profile_name: body.profile_name,
          profile_type: body.profile_type,
          approval_mode: body.approval_mode,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update") {
      const { data, error } = await supabase.rpc("update_approval_profile", {
        p_payload: {
          profile_key: body.profile_key,
          approval_mode: body.approval_mode,
          profile_name: body.profile_name,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_approval_profile_event", {
      p_payload: {
        event_type: body.event_type ?? body.decision,
        profile_key: body.profile_key,
        recommendation_key: body.recommendation_key,
        decision: body.decision,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process approval profile event" }, { status: 500 });
  }
}
