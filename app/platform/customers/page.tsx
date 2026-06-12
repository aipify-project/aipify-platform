import CustomersTable from "@/components/platform/CustomersTable";
import {
  customerStatusLabels,
  customerTypeLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <CustomersTable
      locale={locale}
      labels={{
        title: t("platform.customers.title"),
        subtitle: t("platform.customers.subtitle"),
        loading: t("platform.customers.loading"),
        empty: t("platform.customers.empty"),
        search: t("platform.customers.search"),
        filterStatus: t("platform.customers.filterStatus"),
        filterType: t("platform.customers.filterType"),
        filterAll: t("platform.customers.filterAll"),
        filterWorkspaceType: t("platform.customers.filterWorkspaceType"),
        filterVerification: t("platform.customers.filterVerification"),
        filterEnterprise: t("platform.customers.filterEnterprise"),
        customerNumber: t("platform.customers.customerNumber"),
        name: t("platform.customers.name"),
        owner: t("platform.customers.owner"),
        type: t("platform.customers.type"),
        plan: t("platform.customers.plan"),
        status: t("platform.customers.status"),
        health: t("platform.customers.health"),
        healthLabels: {
          healthy: t("platform.customers.healthLabels.healthy"),
          attention: t("platform.customers.healthLabels.attention"),
          atRisk: t("platform.customers.healthLabels.atRisk"),
        },
        trialRemaining: t("platform.customers.trialRemaining"),
        installations: t("platform.customers.installations"),
        users: t("platform.customers.users"),
        country: t("platform.customers.country"),
        phone: t("platform.customers.phone"),
        organizationNumber: t("platform.customers.organizationNumber"),
        industry: t("platform.customers.industry"),
        workspaceType: t("platform.customers.workspaceType"),
        verification: t("platform.customers.verification"),
        twoFactor: t("platform.customers.twoFactor"),
        growthPartner: t("platform.customers.growthPartner"),
        employeeSize: t("platform.customers.employeeSize"),
        website: t("platform.customers.website"),
        enterprise: t("platform.customers.enterprise"),
        created: t("platform.customers.created"),
        actions: t("platform.customers.actions"),
        view: t("platform.customers.view"),
        contact: t("platform.customers.contact"),
        quickActive: t("platform.customers.quickActive"),
        quickPaused: t("platform.customers.quickPaused"),
        quickCancelled: t("platform.customers.quickCancelled"),
        days: t("platform.customers.days"),
        statusLabels: customerStatusLabels(t),
        typeLabels: customerTypeLabels(t),
        workspaceTypeLabels: {
          company: t("platform.customers.workspaceTypeLabels.company"),
          growth_partner: t("platform.customers.workspaceTypeLabels.growth_partner"),
          consultant: t("platform.customers.workspaceTypeLabels.consultant"),
          freelancer: t("platform.customers.workspaceTypeLabels.freelancer"),
          internal_team_pilot: t("platform.customers.workspaceTypeLabels.internal_team_pilot"),
        },
        verificationLabels: {
          pending: t("platform.customers.verificationLabels.pending"),
          verified: t("platform.customers.verificationLabels.verified"),
          rejected: t("platform.customers.verificationLabels.rejected"),
        },
        twoFactorLabels: {
          enabled: t("platform.customers.twoFactorLabels.enabled"),
          skipped: t("platform.customers.twoFactorLabels.skipped"),
          not_enabled: t("platform.customers.twoFactorLabels.not_enabled"),
        },
        growthPartnerLabels: {
          eligible: t("platform.customers.growthPartnerLabels.eligible"),
          standard: t("platform.customers.growthPartnerLabels.standard"),
        },
        enterpriseLabels: {
          yes: t("platform.customers.enterpriseLabels.yes"),
          no: t("platform.customers.enterpriseLabels.no"),
        },
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
