import { CompanionRealWorldPanel } from "@/components/app/companion-real-world-operations";
import { buildCompanionRealWorldLabels } from "@/lib/customer-companion-real-world-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionBookingsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionRealWorldOperations");
  const labels = buildCompanionRealWorldLabels(createTranslator(dict));
  return (
    <CompanionRealWorldPanel
      backHref="/app/companion/services/actions"
      initialTab="bookings"
      visibleTabs={["bookings", "requests", "approvals", "overview", "executive"]}
      titleOverride={labels.bookingsTitle}
      labels={labels}
    />
  );
}
