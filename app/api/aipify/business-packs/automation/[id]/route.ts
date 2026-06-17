import { NextResponse } from "next/server";
import { parseAutomationDetail } from "@/lib/app-portal/business-pack-automation";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_business_pack_automation_detail", {
      p_automation_key: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseAutomationDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load automation detail" }, { status: 500 });
  }
}
