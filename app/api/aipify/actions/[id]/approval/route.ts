import { NextResponse } from "next/server";
import {
  enrichApprovalDetail,
  parseApprovalDetail,
  parseApprovalDelegationCenter,
} from "@/lib/action-center-approval";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [{ data: detailData, error: detailError }, { data: centerData }] = await Promise.all([
      supabase.rpc("get_action_center_approval_detail", { p_action_id: id }),
      supabase.rpc("get_action_center_approval_delegation_center"),
    ]);

    if (detailError) return NextResponse.json({ error: detailError.message }, { status: 400 });

    const center = parseApprovalDelegationCenter(centerData);
    const parsed = enrichApprovalDetail(parseApprovalDetail(detailData), center.permissions);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load approval detail" }, { status: 500 });
  }
}
