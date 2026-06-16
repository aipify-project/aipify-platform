import { NextResponse } from "next/server";
import { parseOrganizationalAssetItem, parseOrganizationalAssetList } from "@/lib/app-portal/organizational-assets";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_organizational_assets", {
      p_asset_type: searchParams.get("asset_type") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_vendor: searchParams.get("vendor") || null,
      p_criticality: searchParams.get("criticality") || null,
      p_renewal_before: searchParams.get("renewal_before") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOrganizationalAssetList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load organizational assets" }, { status: 500 });
  }
}

type CreateBody = {
  asset_name?: string;
  asset_type?: string;
  description?: string;
  vendor?: string;
  purchase_date?: string;
  renewal_date?: string;
  renewal_reminder_date?: string;
  criticality_level?: string;
  internal_notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.asset_name?.trim()) return NextResponse.json({ error: "asset_name required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_organizational_asset", {
      p_asset_name: body.asset_name,
      p_asset_type: body.asset_type ?? "software_license",
      p_description: body.description ?? "",
      p_vendor: body.vendor ?? "",
      p_purchase_date: body.purchase_date ?? null,
      p_renewal_date: body.renewal_date ?? null,
      p_renewal_reminder_date: body.renewal_reminder_date ?? null,
      p_criticality_level: body.criticality_level ?? "moderate",
      p_internal_notes: body.internal_notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseOrganizationalAssetItem(data);
    return NextResponse.json({ created: true, asset: item });
  } catch {
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
