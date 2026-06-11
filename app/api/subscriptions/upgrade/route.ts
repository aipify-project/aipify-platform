import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { plan_key?: string };
    if (!body.plan_key) {
      return NextResponse.json({ error: "plan_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("upgrade_organization_subscription", {
      p_plan_key: body.plan_key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to upgrade subscription" }, { status: 500 });
  }
}
