import { PlatformPortalCustomerDetailPanel } from "@/components/platform/platform-portal/PlatformPortalCustomerDetailPanel";
import { isCustomer360Tab } from "@/lib/platform-portal/customer-360-tabs";
import {
  buildPlatformPortalAdminProvisionLabels,
  buildPlatformPortalAppKompisDeliveryLabels,
  buildPlatformPortalCommercialPlanLabels,
  buildPlatformPortalCustomerDetailLabels,
  buildPlatformPortalDomainInstallationLabels,
  buildPlatformPortalKompisBedriftLabels,
  buildPlatformPortalLicenseProvisioningLabels,
  buildPlatformPortalWebsiteKompisLabels,
} from "@/lib/platform-portal";
import { buildPlatformCustomerIdentityLabels } from "@/lib/platform-portal/customer-identity-labels";
import { buildCustomerWebsiteRuntimeLabels } from "@/lib/customer-website-runtime/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlatformCustomerDetailPage({ params, searchParams }: CustomerDetailPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const rawTab = typeof query.tab === "string" ? query.tab : Array.isArray(query.tab) ? query.tab[0] : null;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalCustomerDetailLabels(t);
  const commercialPlanLabels = buildPlatformPortalCommercialPlanLabels(t);
  const licenseProvisioningLabels = buildPlatformPortalLicenseProvisioningLabels(t);
  const domainInstallationLabels = buildPlatformPortalDomainInstallationLabels(t);
  const websiteKompisLabels = buildPlatformPortalWebsiteKompisLabels(t);
  const kompisBedriftLabels = buildPlatformPortalKompisBedriftLabels(t);
  const adminProvisionLabels = buildPlatformPortalAdminProvisionLabels(t);
  const appKompisDeliveryLabels = buildPlatformPortalAppKompisDeliveryLabels(t);
  const websiteRuntimeLabels = buildCustomerWebsiteRuntimeLabels(t);
  const customerIdentityLabels = buildPlatformCustomerIdentityLabels(t);

  return (
    <PlatformPortalCustomerDetailPanel
      customerId={id}
      labels={labels}
      commercialPlanLabels={commercialPlanLabels}
      licenseProvisioningLabels={licenseProvisioningLabels}
      domainInstallationLabels={domainInstallationLabels}
      websiteKompisLabels={websiteKompisLabels}
      kompisBedriftLabels={kompisBedriftLabels}
      adminProvisionLabels={adminProvisionLabels}
      appKompisDeliveryLabels={appKompisDeliveryLabels}
      websiteRuntimeLabels={websiteRuntimeLabels}
      customerIdentityLabels={customerIdentityLabels}
      locale={locale}
      initialTab={isCustomer360Tab(rawTab) ? rawTab : "contact"}
    />
  );
}
