import { NextResponse } from "next/server";
import { enrichPlatformCustomerDetailPrimaryContact } from "@/lib/platform-portal/enrich-customer-primary-contact";
import {
  loadCustomer360CompanyAndInvoices,
  unavailableCompanyProfile,
  unavailableInvoiceSummary,
} from "@/lib/platform-portal/load-customer-360-company-invoice";
import { parsePlatformPortalCustomerDetail } from "@/lib/platform-portal/parse";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customerId = (id ?? "").trim();

    if (!UUID_REGEX.test(customerId)) {
      return jsonError("Invalid customer id.", 400);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const profile = await getPlatformProfile(supabase);
    if (!profile) {
      return jsonError("Forbidden", 403);
    }

    const { data, error } = await supabase.rpc("get_platform_portal_customer_detail", {
      p_customer_id: customerId,
    });

    if (error) {
      const message = (error.message ?? "").toLowerCase();
      if (
        message.includes("platform portal access denied") ||
        message.includes("access denied") ||
        message.includes("not authorized") ||
        message.includes("permission") ||
        message.includes("forbidden")
      ) {
        return jsonError("Forbidden", 403);
      }

      return jsonError("Unable to load customer detail.", 500);
    }

    if (data == null) {
      return jsonError("Customer not found.", 404);
    }

    const parsed = parsePlatformPortalCustomerDetail(data);
    if (!parsed) {
      return jsonError("Unable to load customer detail.", 500);
    }

    // RPC already authorized platform access; enrich person contact from existing columns.
    const admin = createServiceRoleClient();
    const enriched = await enrichPlatformCustomerDetailPrimaryContact({
      admin,
      detail: parsed,
    });

    let companyProfile = unavailableCompanyProfile();
    let invoiceSummary = unavailableInvoiceSummary();
    try {
      const loaded = await loadCustomer360CompanyAndInvoices({
        userClient: supabase,
        admin,
        customerId: enriched.customer.id,
      });
      companyProfile = loaded.companyProfile;
      invoiceSummary = loaded.invoiceSummary;
    } catch {
      companyProfile = unavailableCompanyProfile();
      invoiceSummary = unavailableInvoiceSummary();
    }

    return NextResponse.json({ ...enriched, companyProfile, invoiceSummary }, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load customer detail.", 500);
  }
}
