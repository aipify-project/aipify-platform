import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: center, error } = await supabase.rpc("get_customer_business_pulse_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const history = (center as { history?: unknown })?.history ?? [];
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: "History request failed" }, { status: 500 });
  }
}
