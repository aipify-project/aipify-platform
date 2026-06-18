import { NextResponse } from "next/server";
import { parseEnterpriseValueRealizationRoiCenter } from "@/lib/aipify/enterprise-value-realization-roi-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_value_realization_roi_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseValueRealizationRoiCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load value center" }, { status: 500 });
  }
}
