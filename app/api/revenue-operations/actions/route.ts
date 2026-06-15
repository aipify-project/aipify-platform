import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: string;
      activation_id?: string;
      customer_id?: string;
      package_key?: string;
      reason?: string;
    };

    if (!body.action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("record_revenue_operations_action", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data ?? { success: true });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
