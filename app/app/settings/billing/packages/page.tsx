import { PackageAccessCenterPanel } from "@/components/app/settings/billing";
import { buildEnterpriseInvoicingLabels } from "@/lib/enterprise-invoicing";
import { buildPaymentProviderLabels } from "@/lib/payment-providers";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PackageAccessSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const ns = "customerApp.packageAccess";
  const providerLabels = buildPaymentProviderLabels(t, "customerApp");

  return (
    <PackageAccessCenterPanel
      labels={{
        title: t(`${ns}.title`),
        subtitle: t(`${ns}.subtitle`),
        loading: t(`${ns}.loading`),
        back: t(`${ns}.back`),
        billingLink: t(`${ns}.billingLink`),
        currentPackage: t(`${ns}.currentPackage`),
        subscriptionStatus: t(`${ns}.subscriptionStatus`),
        renewal: t(`${ns}.renewal`),
        seats: t(`${ns}.seats`),
        recommendationTitle: t(`${ns}.recommendationTitle`),
        packagesTitle: t(`${ns}.packagesTitle`),
        lockedTitle: t(`${ns}.lockedTitle`),
        noLocked: t(`${ns}.noLocked`),
        auditTitle: t(`${ns}.auditTitle`),
        noAudit: t(`${ns}.noAudit`),
        upgrade: t(`${ns}.upgrade`),
        upgrading: t(`${ns}.upgrading`),
        upgradeComplete: t(`${ns}.upgradeComplete`),
        goldNugget: t(`${ns}.goldNugget`),
        whoFor: t(`${ns}.whoFor`),
        instantAccess: t(`${ns}.instantAccess`),
        privacyNote: t(`${ns}.privacyNote`),
        tiers: {
          starter: t(`${ns}.tiers.starter`),
          professional: t(`${ns}.tiers.professional`),
          business: t(`${ns}.tiers.business`),
          enterprise: t(`${ns}.tiers.enterprise`),
        },
        upgradeFlow: providerLabels.upgrade,
        providerNames: providerLabels.providers,
        enterpriseUpgradeLabels: buildEnterpriseInvoicingLabels(t, "customerApp"),
      }}
    />
  );
}
