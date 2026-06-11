import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UNONIGHT_PILOT_SLUG } from "@/lib/aipify/integrations/unonight";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: statusData, error: statusError } = await supabase.rpc("get_pilot_install_status", {
      p_slug: UNONIGHT_PILOT_SLUG,
    });
    if (statusError) return NextResponse.json({ error: statusError.message }, { status: 400 });

    const tenantId = (statusData as { profile?: { tenant_id?: string } })?.profile?.tenant_id;
    if (!tenantId) {
      return NextResponse.json({ error: "Unonight tenant not provisioned yet" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("enable_pilot_safe_modules", {
      p_tenant_id: tenantId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to enable safe modules" }, { status: 500 });
  }
}
