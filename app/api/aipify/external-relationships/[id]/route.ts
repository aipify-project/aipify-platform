import { NextResponse } from "next/server";
import { parseExternalRelationshipDetail, parseExternalRelationshipItem } from "@/lib/app-portal/external-relationships";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_external_relationship", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExternalRelationshipDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load relationship" }, { status: 500 });
  }
}

type UpdateBody = {
  organization_name?: string;
  relationship_type?: string;
  primary_contact?: string;
  secondary_contact?: string;
  email?: string;
  phone?: string;
  country?: string;
  status?: string;
  owner_id?: string | null;
  criticality_level?: string;
  service_description?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  renewal_reminder_date?: string;
  notes?: string;
  renewal_note?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_external_relationship", {
      p_id: id,
      p_organization_name: body.organization_name ?? null,
      p_relationship_type: body.relationship_type ?? null,
      p_primary_contact: body.primary_contact ?? null,
      p_secondary_contact: body.secondary_contact ?? null,
      p_email: body.email ?? null,
      p_phone: body.phone ?? null,
      p_country: body.country ?? null,
      p_status: body.status ?? null,
      p_owner_id: body.owner_id === null ? null : body.owner_id ?? null,
      p_criticality_level: body.criticality_level ?? null,
      p_service_description: body.service_description ?? null,
      p_contract_start_date: body.contract_start_date ?? null,
      p_contract_end_date: body.contract_end_date ?? null,
      p_renewal_reminder_date: body.renewal_reminder_date ?? null,
      p_notes: body.notes ?? null,
      p_renewal_note: body.renewal_note ?? null,
      p_clear_owner: body.owner_id === null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseExternalRelationshipItem(data);
    return NextResponse.json({ updated: true, relationship: item });
  } catch {
    return NextResponse.json({ error: "Failed to update relationship" }, { status: 500 });
  }
}
