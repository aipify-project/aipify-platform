import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { plan_key?: string; billing_cycle?: string };
    const { data, error } = await supabase.rpc("create_organization_subscription", {
      p_plan_key: body.plan_key ?? "starter",
      p_billing_cycle: body.billing_cycle ?? "monthly",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
