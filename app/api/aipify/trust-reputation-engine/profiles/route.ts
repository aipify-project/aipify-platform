import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      profile_id?: string;
      level?: string;
      rationale?: string;
      reason?: string;
      approved?: boolean;
      payload?: Record<string, unknown>;
    };

    if (body.action === "update_level") {
      if (!body.profile_id || !body.level) {
        return NextResponse.json({ error: "profile_id and level required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_trust_level", {
        p_profile_id: body.profile_id,
        p_level: body.level,
        p_rationale: body.rationale ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "revoke") {
      if (!body.profile_id) {
        return NextResponse.json({ error: "profile_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("revoke_organization_trust", {
        p_profile_id: body.profile_id,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "review_expansion") {
      if (!body.profile_id || body.approved === undefined) {
        return NextResponse.json({ error: "profile_id and approved required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("review_trust_expansion", {
        p_profile_id: body.profile_id,
        p_approved: body.approved,
        p_rationale: body.rationale ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("upsert_organization_trust_profile", {
      p_payload: body.payload ?? body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process profile action" }, { status: 500 });
  }
}
