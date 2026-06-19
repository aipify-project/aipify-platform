import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ agreementId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { agreementId } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organization_service_network_detail", {
      p_entity_type: "rental",
      p_record_key: agreementId,
    });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load rental agreement detail" }, { status: 500 });
  }
}
