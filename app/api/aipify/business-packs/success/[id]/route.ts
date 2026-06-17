import { NextResponse } from "next/server";
import { parseBusinessPackSuccessDetail } from "@/lib/app-portal/business-pack-success";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_business_pack_success_detail", {
      p_pack_key: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseBusinessPackSuccessDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load business pack detail" }, { status: 500 });
  }
}
