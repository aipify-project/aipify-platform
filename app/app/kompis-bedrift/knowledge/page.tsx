import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { AppIconActionCard } from "@/components/app/design";
import { HubFeatureIcon } from "@/components/app/hubs/HubFeatureIcon";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildEmployeeKnowledgeLabels } from "@/lib/employee-knowledge-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Internal Bedrift knowledge hub.
 * Distinct from Website Kompis public FAQ — deep-links to employee knowledge admin.
 */
export default async function KompisBedriftKnowledgePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "core",
  ]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const eke = buildEmployeeKnowledgeLabels(t);
  const workspaceHref = "/app/settings/employee-knowledge";

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
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
      status={{
        label: hubT(t, "bedrift.knowledgeBoundaryStatus"),
        tone: "slate",
      }}
      primaryAction={{
        label: hubT(t, "bedrift.openInternalKnowledge"),
        href: workspaceHref,
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AppIconActionCard
          href={workspaceHref}
          title={eke.workspace.createFaq}
          description={hubT(t, "bedrift.knowledgeWorkspaceHint")}
          tone="purple"
          icon={<HubFeatureIcon kind="faq" />}
        />
        <AppIconActionCard
          href={workspaceHref}
          title={eke.workspace.articles}
          description={eke.workspace.emptyArticlesBody}
          tone="blue"
          icon={<HubFeatureIcon kind="document" />}
        />
        <AppIconActionCard
          href={workspaceHref}
          title={eke.workspace.pendingReview}
          description={eke.youControl}
          tone="amber"
          icon={<HubFeatureIcon kind="qa" />}
        />
        <AppIconActionCard
          href={workspaceHref}
          title={eke.workspace.gaps}
          description={eke.sections.gaps}
          tone="slate"
          icon={<HubFeatureIcon kind="messages" />}
        />
      </div>
      <p className="text-sm text-aipify-text-secondary">{hubT(t, "bedrift.knowledgePublicSeparation")}</p>
      <p className="rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4 text-sm text-[var(--app-text,#202336)]">
        <span className="font-semibold">{eke.workspace.multilingualGapTitle}. </span>
        {eke.workspace.multilingualGapBody}
      </p>
    </AppHubShell>
  );
}
