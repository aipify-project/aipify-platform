import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UNONIGHT_PILOT_PRESET } from "@/lib/aipify/integrations/unonight";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("provision_pilot_tenant", {
      p_config: UNONIGHT_PILOT_PRESET,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create pilot tenant" }, { status: 500 });
  }
}
