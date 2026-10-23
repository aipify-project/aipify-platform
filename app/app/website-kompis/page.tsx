import {
  Archive,
  BookOpen,
  CircleAlert,
  FileText,
  Globe,
  Link2,
  MessagesSquare,
  Package,
  Palette,
  Plus,
  Puzzle,
  Server,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { WebsiteKompisDashboardPremium } from "@/components/app/website-kompis/WebsiteKompisDashboardPremium";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import { buildWebsiteKompisKnowledgeLabels } from "@/lib/website-kompis-knowledge/labels";
import { loadWebsiteKompisKnowledgeSummary } from "@/lib/website-kompis-knowledge/load-summary";
import { buildWebsiteKompisConnectionLabels } from "@/lib/website-kompis-connection/labels";
import { loadWebsiteKompisConnectionSummary } from "@/lib/website-kompis-connection/load-summary";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

/** Kompis Web product hub. Feature owner: CUSTOMER APP. */
export default async function WebsiteKompisHubPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const feedbackLabels = buildWebsiteKompisFeedbackLabels(t);
  const knowledgeLabels = buildWebsiteKompisKnowledgeLabels(t);
  const connectionLabels = buildWebsiteKompisConnectionLabels(t);

  const supabase = await createClient();
  const [overview, knowledge, connection] = await Promise.all([
    getWebsiteKompisAnswerFeedbackOverview(supabase, { limit: 1 }),
    loadWebsiteKompisKnowledgeSummary(supabase),
    loadWebsiteKompisConnectionSummary(supabase),
  ]);

  const aggregate = connection.summary.aggregate;
  const statusTone =
    aggregate === "active"
      ? "emerald"
      : aggregate === "error" || aggregate === "suspended"
        ? "purple"
        : aggregate === "pending" || aggregate === "action_required"
          ? "amber"
          : "slate";
  const contextParts = [ctx.organizationName, ctx.planLabel].filter((part): part is string => Boolean(part?.trim()));
  const reviewCount = overview.totals.needsReview ?? overview.totals.notHelpful;
  const reviewHintKey =
    typeof overview.totals.needsReview === "number"
      ? "customerApp.portalStructure.webHub.hintReview"
      : "customerApp.portalStructure.webHub.hintReviewUnseparated";
  const checkpointSignals = (
    [
      { id: "domain" as const, icon: Globe },
      { id: "installation" as const, icon: Server },
      { id: "product" as const, icon: Package },
    ] as const
  ).flatMap(({ id, icon }) => {
    const checkpoint = connection.summary.checkpoints.find((item) => item.id === id);
    if (!checkpoint) return [];
    return [
      {
        label: connectionLabels.checkpoints[id],
        value: (connectionLabels.checkpointState as Record<string, string>)[checkpoint.state] ?? checkpoint.state,
        icon,
      },
    ];
  });

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.navGroups.kompisWeb") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebDashboard")}
      description={t("customerApp.portalStructure.webHub.description")}
      contextLabel={contextParts.length > 0 ? contextParts.join(" · ") : formatHubContextLine(common, ctx)}
      status={{ label: connectionLabels.aggregate[aggregate], tone: statusTone }}
      note={
        aggregate === "active"
          ? t("customerApp.portalStructure.webHub.presenceReady")
          : connectionLabels.aggregateExplain[aggregate]
      }
      primaryAction={{
        label: connectionLabels.openConnection,
        href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      }}
    >
      <WebsiteKompisDashboardPremium
        knowledgeTitle={knowledgeLabels.dashboardTitle}
        knowledgeDescription={knowledgeLabels.dashboardDescription}
        knowledgeMetrics={
          knowledge.faqLoadOk
            ? [
                { label: knowledgeLabels.counts.published, hint: t("customerApp.portalStructure.webHub.hintPublished"), value: knowledge.faq.published, icon: BookOpen, chip: "bg-[#E9F8F0] text-[#146C43]", wash: "bg-gradient-to-br from-white to-[#F3FBF7]" },
                { label: knowledgeLabels.counts.draft, hint: t("customerApp.portalStructure.webHub.hintDraft"), value: knowledge.faq.draft, icon: FileText, chip: "bg-[#F3EDFF] text-[#7055EE]", wash: "bg-gradient-to-br from-white to-[#F7F4FF]" },
                { label: knowledgeLabels.counts.archived, hint: t("customerApp.portalStructure.webHub.hintArchived"), value: knowledge.faq.archived, icon: Archive, chip: "bg-[#F4F6FB] text-[#5F6788]", wash: "bg-gradient-to-br from-white to-[#F7F8FC]" },
              ]
            : null
        }
        knowledgeNote={
          knowledge.faqLoadOk
            ? knowledge.faqWindow.totalState === "exact_tenant"
              ? knowledgeLabels.counts.windowExact.replace("{total}", String(knowledge.faqWindow.tenantTotal ?? 0))
              : t("customerApp.portalStructure.webHub.knowledgeWindowNote").replace("{minimum}", String(knowledge.faqWindow.tenantMinimum))
            : null
        }
        qualityTitle={feedbackLabels.dashboard.title}
        qualityDescription={feedbackLabels.dashboard.description}
        qualityMetrics={
          overview.persistenceReady
            ? [
                { label: feedbackLabels.totals.answers, hint: t("customerApp.portalStructure.webHub.hintAnswers"), value: overview.totals.answers, icon: MessagesSquare, chip: "bg-[#F3EDFF] text-[#7055EE]", wash: "bg-gradient-to-br from-white to-[#F7F4FF]" },
                { label: feedbackLabels.totals.helpful, hint: t("customerApp.portalStructure.webHub.hintHelpful"), value: overview.totals.helpful, icon: ThumbsUp, chip: "bg-[#E9F8F0] text-[#146C43]", wash: "bg-gradient-to-br from-white to-[#F3FBF7]" },
                { label: feedbackLabels.totals.notHelpful, hint: t("customerApp.portalStructure.webHub.hintNotHelpful"), value: overview.totals.notHelpful, icon: ThumbsDown, chip: "bg-[#FDE9EC] text-[#A52D3E]", wash: "bg-gradient-to-br from-white to-[#FFF6F7]" },
                { label: feedbackLabels.totals.needsReview, hint: t(reviewHintKey), value: reviewCount, icon: CircleAlert, chip: "bg-[#FFF4E5] text-[#945A15]", wash: "bg-gradient-to-br from-white to-[#FFF8EE]" },
              ]
            : null
        }
        connectionTitle={connectionLabels.dashboardTitle}
        connectionSignals={[
          { label: connectionLabels.title, value: connectionLabels.aggregate[aggregate], icon: ShieldCheck },
          {
            label: connectionLabels.domainsTitle,
            value: t("customerApp.portalStructure.webHub.domainCount").replace("{count}", String(connection.summary.domains.length)),
            icon: Globe,
          },
          ...checkpointSignals,
        ]}
        manageConnectionLabel={connectionLabels.openConnection}
        manageConnectionHref={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
        primaryActions={[
          {
            href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
            title: t("customerApp.portalStructure.nav.kompisWebQa"),
            description: t("customerApp.portalStructure.webHub.qaDescription"),
            icon: MessagesSquare,
            emphasis: true,
          },
          {
            href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
            title: t("customerApp.portalStructure.nav.kompisWebFaq"),
            description: t("customerApp.portalStructure.webHub.faqDescription"),
            icon: BookOpen,
          },
          {
            href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
            title: t("customerApp.portalStructure.nav.kompisWebConnection"),
            description: t("customerApp.portalStructure.webHub.connectionDescription"),
            icon: Link2,
          },
        ]}
        secondaryActions={[
          {
            href: `${FOUNDATION_NAV_BINDINGS.kompisWebFaq}?create=1`,
            title: knowledgeLabels.createFaq,
            description: t("customerApp.portalStructure.webHub.shortcutCreate"),
            icon: Plus,
          },
          {
            href: `${FOUNDATION_NAV_BINDINGS.kompisWebFaq}?section=pages`,
            title: knowledgeLabels.sections.pages,
            description: knowledgeLabels.sectionHints.pages,
            icon: Globe,
          },
          {
            href: `${FOUNDATION_NAV_BINDINGS.kompisWebConnection}?section=domains`,
            title: connectionLabels.domainsTitle,
            description: t("customerApp.portalStructure.webHub.connectionDescription"),
            icon: Link2,
          },
          {
            href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
            title: t("customerApp.portalStructure.nav.kompisWebAppearance"),
            description: t("customerApp.portalStructure.webHub.appearanceDescription"),
            icon: Palette,
          },
          {
            href: FOUNDATION_NAV_BINDINGS.kompisWebModules,
            title: t("customerApp.portalStructure.nav.kompisWebModules"),
            description: hubT(t, "web.modulesCard"),
            icon: Puzzle,
          },
        ]}
        operatorHref={FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved}
        operatorLabel={t("customerApp.portalStructure.webHub.operatorLink")}
      />
    </AppHubShell>
  );
}
