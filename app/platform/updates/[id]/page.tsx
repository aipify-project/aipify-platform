import { PlatformUpdateDetailPanel } from "@/components/platform/update-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PlatformUpdateDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlatformUpdateDetailPage({
  params,
}: PlatformUpdateDetailPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformUpdateDetailPanel
      updateId={id}
      locale={locale}
      labels={{
        back: t("platform.updates.detail.back"),
        loading: t("platform.updates.detail.loading"),
        notFound: t("platform.updates.detail.notFound"),
        summary: t("platform.updates.detail.summary"),
        targets: t("platform.updates.detail.targets"),
        audit: t("platform.updates.detail.audit"),
        rollback: t("platform.updates.detail.rollback"),
        migration: t("platform.updates.detail.migration"),
        notifications: t("platform.updates.detail.notifications"),
        rollout: t("platform.updates.detail.rollout"),
        installation: t("platform.updates.detail.installation"),
        targetStatus: t("platform.updates.detail.targetStatus"),
        noTargets: t("platform.updates.detail.noTargets"),
        noAudit: t("platform.updates.detail.noAudit"),
        rollbackAvailable: t("platform.updates.detail.rollbackAvailable"),
        rollbackUnavailable: t("platform.updates.detail.rollbackUnavailable"),
      }}
    />
  );
}
