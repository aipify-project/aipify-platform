import { NextResponse } from "next/server";
import { parseOrganizationalAssetDetail, parseOrganizationalAssetItem } from "@/lib/app-portal/organizational-assets";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_organizational_asset", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOrganizationalAssetDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load asset" }, { status: 500 });
  }
}

type UpdateBody = {
  asset_name?: string;
  asset_type?: string;
  description?: string;
  status?: string;
  vendor?: string;
  purchase_date?: string;
  renewal_date?: string;
  renewal_reminder_date?: string;
  criticality_level?: string;
  internal_notes?: string;
  renewal_note?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_organizational_asset", {
      p_id: id,
      p_asset_name: body.asset_name ?? null,
      p_asset_type: body.asset_type ?? null,
      p_description: body.description ?? null,
      p_status: body.status ?? null,
      p_vendor: body.vendor ?? null,
      p_purchase_date: body.purchase_date ?? null,
      p_renewal_date: body.renewal_date ?? null,
      p_renewal_reminder_date: body.renewal_reminder_date ?? null,
      p_criticality_level: body.criticality_level ?? null,
      p_internal_notes: body.internal_notes ?? null,
      p_renewal_note: body.renewal_note ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseOrganizationalAssetItem(data);
    return NextResponse.json({ updated: true, asset: item });
  } catch {
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}
