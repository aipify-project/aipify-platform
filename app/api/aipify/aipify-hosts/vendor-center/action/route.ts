import { NextResponse } from "next/server";
import {
  createAipifyHostsVendor,
  performAipifyHostsVendorAction,
} from "@/lib/core/aipify-hosts-vendor-center";
import { parseAipifyHostsVendorCenterActionResult } from "@/lib/aipify/aipify-hosts-vendor-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      vendor_id?: string;
      company_name?: string;
      service_category?: string;
      contact_person?: string;
      email?: string;
      phone_number?: string;
      coverage_area?: string;
      action_type?: string;
      property_id?: string;
      contract_id?: string;
      notes?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "create_vendor":
        if (!body.company_name?.trim() || !body.service_category) {
          return NextResponse.json({ error: "company_name and service_category required" }, { status: 400 });
        }
        data = await createAipifyHostsVendor(supabase, {
          companyName: body.company_name.trim(),
          serviceCategory: body.service_category,
          contactPerson: body.contact_person,
          email: body.email,
          phoneNumber: body.phone_number,
          coverageArea: body.coverage_area,
        });
        break;
      case "vendor_action":
        if (!body.vendor_id || !body.action_type) {
          return NextResponse.json({ error: "vendor_id and action_type required" }, { status: 400 });
        }
        data = await performAipifyHostsVendorAction(supabase, {
          vendorId: body.vendor_id,
          actionType: body.action_type,
          propertyId: body.property_id,
          contractId: body.contract_id,
          notes: body.notes,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsVendorCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
