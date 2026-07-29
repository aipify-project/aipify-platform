import { PlatformPortalCustomerDetailPanel } from "@/components/platform/platform-portal/PlatformPortalCustomerDetailPanel";
import {
  buildPlatformPortalCommercialPlanLabels,
  buildPlatformPortalCustomerDetailLabels,
  buildPlatformPortalLicenseProvisioningLabels,
} from "@/lib/platform-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlatformCustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalCustomerDetailLabels(t);
  const commercialPlanLabels = buildPlatformPortalCommercialPlanLabels(t);
  const licenseProvisioningLabels = buildPlatformPortalLicenseProvisioningLabels(t);

  return (
    <PlatformPortalCustomerDetailPanel
      customerId={id}
      labels={labels}
      commercialPlanLabels={commercialPlanLabels}
      licenseProvisioningLabels={licenseProvisioningLabels}
      locale={locale}
    />
  );
}
