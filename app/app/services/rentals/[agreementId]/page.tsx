import { ServiceNetworkDetailPanel } from "@/components/app/service-network";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ agreementId: string }> };

export default async function ServiceNetworkRentalDetailPage({ params }: PageProps) {
  const { agreementId } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceNetwork");
  const t = createTranslator(dict);
  const labels = buildServiceNetworkLabels(t);

  return <ServiceNetworkDetailPanel labels={labels} entityType="rental" recordId={agreementId} />;
}
