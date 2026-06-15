import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      subscription_id?: string;
      customer_id?: string;
      action?: string;
      new_plan?: string;
      days?: number;
      reason?: string;
      revenue_impact?: number;
    };

    if (!body.action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("record_subscription_operations_action", {
      p_payload: {
        action: body.action,
        subscription_id: body.subscription_id,
        customer_id: body.customer_id,
        new_plan: body.new_plan,
        days: body.days,
        reason: body.reason,
        revenue_impact: body.revenue_impact,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ subscription: data });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
