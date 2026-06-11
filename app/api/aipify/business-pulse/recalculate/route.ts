import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("recalculate_business_pulse");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ snapshot_id: data });
  } catch {
    return NextResponse.json({ error: "Recalculate failed" }, { status: 500 });
  }
}
