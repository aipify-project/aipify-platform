import { NextResponse } from "next/server";
import { parseEnterpriseTransformationChangeCenter } from "@/lib/enterprise-transformation-change";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_enterprise_transformation_change_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseTransformationChangeCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load transformation center" }, { status: 500 });
  }
}
