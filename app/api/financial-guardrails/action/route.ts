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
      spending_category?: string;
      limit_type?: string;
      approval_threshold?: string;
      limits?: Record<string, unknown>;
      event_type?: string;
      recommendation_key?: string;
      decision?: "accept" | "dismiss" | "suspend" | "delete" | "add_exception" | "revoke_permission";
      expenditure_key?: string;
      amount?: number;
      category?: string;
    };

    if (body.action === "create") {
      const { data, error } = await supabase.rpc("create_financial_guardrail_profile", {
        p_payload: {
          profile_name: body.profile_name,
          spending_category: body.spending_category,
          limit_type: body.limit_type,
          approval_threshold: body.approval_threshold,
          limits: body.limits,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update") {
      const { data, error } = await supabase.rpc("update_financial_guardrail_profile", {
        p_payload: {
          profile_key: body.profile_key,
          profile_name: body.profile_name,
          approval_threshold: body.approval_threshold,
          limits: body.limits,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_financial_guardrail_event", {
      p_payload: {
        action: body.event_type ?? body.decision,
        profile_key: body.profile_key,
        recommendation_key: body.recommendation_key,
        expenditure_key: body.expenditure_key,
        amount: body.amount,
        category: body.category,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process financial guardrail event" }, { status: 500 });
  }
}
