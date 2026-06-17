import { NextResponse } from "next/server";
import { parsePackValueDetail } from "@/lib/app-portal/business-pack-value";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_business_pack_value_detail", {
      p_pack_key: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackValueDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load value detail" }, { status: 500 });
  }
}
