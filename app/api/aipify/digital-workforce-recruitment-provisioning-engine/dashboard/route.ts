import { NextResponse } from "next/server";
import { parseDigitalWorkforceRecruitmentProvisioningCenter } from "@/lib/aipify/digital-workforce-recruitment-provisioning-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_digital_workforce_recruitment_provisioning_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDigitalWorkforceRecruitmentProvisioningCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load digital workforce recruitment center" }, { status: 500 });
  }
}
