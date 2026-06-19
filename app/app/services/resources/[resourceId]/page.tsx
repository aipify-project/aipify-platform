import { ServiceNetworkDetailPanel } from "@/components/app/service-network";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ resourceId: string }> };

export default async function ServiceNetworkResourceDetailPage({ params }: PageProps) {
  const { resourceId } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceNetwork");
  const t = createTranslator(dict);
  const labels = buildServiceNetworkLabels(t);

  return <ServiceNetworkDetailPanel labels={labels} entityType="resource" recordId={resourceId} />;
}
