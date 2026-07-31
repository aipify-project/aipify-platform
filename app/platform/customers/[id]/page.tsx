import { PlatformPortalCustomerDetailPanel } from "@/components/platform/platform-portal/PlatformPortalCustomerDetailPanel";
import {
  buildPlatformPortalAppKompisDeliveryLabels,
  buildPlatformPortalCommercialPlanLabels,
  buildPlatformPortalCustomerDetailLabels,
  buildPlatformPortalDomainInstallationLabels,
  buildPlatformPortalLicenseProvisioningLabels,
  buildPlatformPortalWebsiteKompisLabels,
} from "@/lib/platform-portal";
import { buildCustomerWebsiteRuntimeLabels } from "@/lib/customer-website-runtime/labels";
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
  const domainInstallationLabels = buildPlatformPortalDomainInstallationLabels(t);
  const websiteKompisLabels = buildPlatformPortalWebsiteKompisLabels(t);
  const appKompisDeliveryLabels = buildPlatformPortalAppKompisDeliveryLabels(t);
  const websiteRuntimeLabels = buildCustomerWebsiteRuntimeLabels(t);

  return (
    <PlatformPortalCustomerDetailPanel
      customerId={id}
      labels={labels}
      commercialPlanLabels={commercialPlanLabels}
      licenseProvisioningLabels={licenseProvisioningLabels}
      domainInstallationLabels={domainInstallationLabels}
      websiteKompisLabels={websiteKompisLabels}
      appKompisDeliveryLabels={appKompisDeliveryLabels}
      websiteRuntimeLabels={websiteRuntimeLabels}
      locale={locale}
    />
  );
}
