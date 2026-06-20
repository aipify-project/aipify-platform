import { NextResponse } from "next/server";
import { parsePolicyItem } from "@/lib/app-portal/compliance";
import { isCompliancePolicyRecordId } from "@/lib/app-portal/compliance/record-id";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    if (!isCompliancePolicyRecordId(id)) {
      return NextResponse.json(
        { error: "invalid_parameter", access_state: "invalid_parameter", parameter: "id" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("acknowledge_app_portal_compliance_policy", { p_policy_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parsePolicyItem(data);
    return NextResponse.json({ acknowledged: true, policy: item });
  } catch {
    return NextResponse.json({ error: "Failed to acknowledge policy" }, { status: 500 });
  }
}
