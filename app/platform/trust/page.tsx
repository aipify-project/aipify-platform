import { TrustCenterOverview } from "@/components/platform/trust";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import type { TrustDomainId } from "@/lib/platform/trust-center/config";

export default async function PlatformTrustOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  const domainIds: TrustDomainId[] = [
    "identity",
    "decisions",
    "knowledge",
    "goals",
    "life",
    "relationships",
    "actions",
    "commercial",
    "security",
    "privacy",
  ];

  const domains = Object.fromEntries(
    domainIds.map((id) => [
      id,
      {
        title: t(`platform.trustCenter.domains.${id}.title`),
        description: t(`platform.trustCenter.domains.${id}.description`),
        stat: t(`platform.trustCenter.domains.${id}.stat`),
      },
    ])
  ) as Record<
    TrustDomainId,
    { title: string; description: string; stat: string }
  >;

  return (
    <TrustCenterOverview
      labels={{
        title: t("platform.trustCenter.title"),
        subtitle: t("platform.trustCenter.subtitle"),
        responsibility: t("platform.trust.responsibility"),
        domainsTitle: t("platform.trustCenter.domainsTitle"),
        domainsSubtitle: t("platform.trustCenter.domainsSubtitle"),
        loading: t("platform.trustCenter.loading"),
        kpis: {
          trustScore: t("platform.trustCenter.kpis.trustScore"),
          modulesActive: t("platform.trustCenter.kpis.modulesActive"),
          pendingReviews: t("platform.trustCenter.kpis.pendingReviews"),
          securityExceptions: t("platform.trustCenter.kpis.securityExceptions"),
          scoreHint: t("platform.trustCenter.kpis.scoreHint"),
        },
        status: {
          active: t("platform.trustCenter.status.active"),
          attention: t("platform.trustCenter.status.attention"),
        },
        openDomain: t("platform.trustCenter.openDomain"),
        domains,
      }}
    />
  );
}
