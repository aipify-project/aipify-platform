import Link from "next/link";
import { AppIconActionCard } from "@/components/app/design";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { HubArrowIcon } from "@/components/app/hubs/HubArrowIcon";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { AppVisualClasses } from "@/lib/design/app-visual-system";

/** Kompis Web product hub — harmonized with Bedrift/Account hub pattern. */
export default async function WebsiteKompisHubPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const feedbackLabels = buildWebsiteKompisFeedbackLabels(t);

  const supabase = await createClient();
  const overview = await getWebsiteKompisAnswerFeedbackOverview(supabase, { limit: 1 });

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
      title: t("customerApp.portalStructure.nav.kompisWebQa"),
      description: t("customerApp.portalStructure.webHub.qaDescription"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
      title: t("customerApp.portalStructure.nav.kompisWebFaq"),
      description: t("customerApp.portalStructure.webHub.faqDescription"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      title: t("customerApp.portalStructure.nav.kompisWebConnection"),
      description: t("customerApp.portalStructure.webHub.connectionDescription"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebModules,
      title: t("customerApp.portalStructure.nav.kompisWebModules"),
      description: hubT(t, "web.modulesCard"),
      tone: "slate" as const,
    },
  ];

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.navGroups.kompisWeb") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebDashboard")}
      description={t("customerApp.portalStructure.webHub.description")}
      contextLabel={formatHubContextLine(common, ctx)}
      status={{ label: common.statusReady, tone: "emerald" }}
      decorativeAccent
      primaryAction={{
        label: t("customerApp.portalStructure.nav.kompisWebQa"),
        href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
      }}
    >
      {overview.persistenceReady ? (
        <section className="space-y-3" aria-labelledby="wk-quality-signals">
          <div>
            <h2 id="wk-quality-signals" className="text-lg font-semibold text-[var(--app-text)]">
              {feedbackLabels.dashboard.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">
              {feedbackLabels.dashboard.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: feedbackLabels.totals.answers, value: overview.totals.answers },
              { label: feedbackLabels.totals.helpful, value: overview.totals.helpful },
              { label: feedbackLabels.totals.notHelpful, value: overview.totals.notHelpful },
              { label: feedbackLabels.totals.needsReview, value: overview.totals.notHelpful },
            ].map((item) => (
              <div key={item.label} className={AppVisualClasses.card}>
                <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-[var(--app-text)]">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${FOUNDATION_NAV_BINDINGS.kompisWebQa}?vote=not_helpful`}
              className="inline-flex rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-3 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {feedbackLabels.actions.reviewNegative}
            </Link>
            <Link
              href={FOUNDATION_NAV_BINDINGS.kompisWebFaq}
              className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {feedbackLabels.actions.openFaq}
            </Link>
            <Link
              href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
              className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {feedbackLabels.actions.checkConnection}
            </Link>
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <AppIconActionCard
            key={card.href}
            href={card.href}
            title={card.title}
            description={card.description}
            tone={card.tone}
            icon={<HubArrowIcon />}
          />
        ))}
      </div>
      <p className="text-sm text-aipify-text-secondary">
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved}
          className="font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus rounded"
        >
          {t("customerApp.portalStructure.webHub.operatorLink")}
        </Link>
      </p>
    </AppHubShell>
  );
}
