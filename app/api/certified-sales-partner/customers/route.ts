import { loadCspPartnerCustomers } from "@/lib/certified-sales-partner/partner-scoped-read";
import { handleCspPartnerScopedList } from "@/lib/certified-sales-partner/partner-scoped-route";

/** Partner's own qualified sales (Mine kunder) — never another partner's; fail-closed. */
export async function GET() {
  return handleCspPartnerScopedList({
    responseKey: "customers",
    failureCode: "customers_load_failed",
    load: loadCspPartnerCustomers,
  });
}
