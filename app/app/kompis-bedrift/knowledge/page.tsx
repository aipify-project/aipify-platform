import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { AppEmptyState, AppIconActionCard } from "@/components/app/design";
import { HubFeatureIcon } from "@/components/app/hubs/HubFeatureIcon";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Internal Bedrift knowledge hub.
 * Distinct from Website Kompis public FAQ — deep-links to employee knowledge admin.
 */
export default async function KompisBedriftKnowledgePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisBedrift"),
          href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisBedriftFaq") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={t("customerApp.portalStructure.nav.kompisBedriftFaq")}
      description={hubT(t, "bedrift.knowledgeDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      primaryAction={{
        label: hubT(t, "bedrift.openInternalKnowledge"),
        href: "/app/settings/employee-knowledge",
      }}
    >
      <AppEmptyState
        title={hubT(t, "bedrift.knowledgeEmptyTitle")}
        description={hubT(t, "bedrift.knowledgeEmptyBody")}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AppIconActionCard
          href="/app/settings/employee-knowledge"
          title={hubT(t, "bedrift.openInternalKnowledge")}
          description={hubT(t, "bedrift.knowledgeWorkspaceHint")}
          tone="purple"
          icon={<HubFeatureIcon kind="faq" />}
        />
      </div>
      <p className="text-sm text-aipify-text-secondary">{hubT(t, "bedrift.knowledgePublicSeparation")}</p>
    </AppHubShell>
  );
}
