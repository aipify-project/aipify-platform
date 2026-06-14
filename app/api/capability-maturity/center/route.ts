import { NextResponse } from "next/server";
import { parseCapabilityMaturityCenter } from "@/lib/capability-maturity-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_capability_maturity_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCapabilityMaturityCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Capability Maturity Center" }, { status: 500 });
  }
}
