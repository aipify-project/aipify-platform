import { loadCspPartnerLeads } from "@/lib/certified-sales-partner/partner-scoped-read";
import { handleCspPartnerScopedList } from "@/lib/certified-sales-partner/partner-scoped-route";

/** Partner's own attributed registrations — never another partner's; fail-closed. */
export async function GET() {
  return handleCspPartnerScopedList({
    responseKey: "leads",
    failureCode: "leads_load_failed",
    load: loadCspPartnerLeads,
  });
}
