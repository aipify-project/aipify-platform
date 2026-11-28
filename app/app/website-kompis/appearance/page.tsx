import Link from "next/link";
import { AppIconActionCard } from "@/components/app/design";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { HubFeatureIcon, type HubFeatureIconKind } from "@/components/app/hubs/HubFeatureIcon";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { readWebsiteKompisAppearanceFailClosed } from "@/lib/website-kompis-appearance";

/**
 * Kompis Web appearance — fail-closed for theme/welcome Core writer (candidate only).
 * Install chrome (icon / tone / welcome variant) is edited on Connection via existing
 * domain settings API — not duplicated here. Public-chain runtime is not mutated.
 */
export default async function WebsiteKompisAppearancePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const appearanceRead = readWebsiteKompisAppearanceFailClosed();
  const writerUnavailable = appearanceRead.kind === "writer_unavailable";

  const cards: Array<{
    href: string;
    title: string;
    description: string;
    tone: "purple" | "lavender" | "blue" | "slate";
    icon: HubFeatureIconKind;
  }> = [
    {
      href: `${FOUNDATION_NAV_BINDINGS.kompisWebConnection}?section=domains`,
      title: t("customerApp.portalStructure.nav.kompisWebConnection"),
      description: hubT(t, "web.appearanceInstallChromeCard"),
      tone: "purple",
      icon: "connection",
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
      title: t("customerApp.portalStructure.nav.kompisWebFaq"),
      description: hubT(t, "web.appearanceFaqCard"),
      tone: "lavender",
      icon: "faq",
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved,
      title: t("customerApp.portalStructure.webHub.operatorLink"),
      description: hubT(t, "web.appearanceOperatorCard"),
      tone: "blue",
      icon: "modules",
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountProfile,
      title: t("customerApp.portalStructure.nav.accountProfile"),
      description: hubT(t, "web.appearanceProfileCard"),
      tone: "slate",
      icon: "users",
    },
    {
      href: FOUNDATION_NAV_BINDINGS.supportTickets,
      title: t("customerApp.portalStructure.nav.supportTickets"),
      description: hubT(t, "web.appearanceSupportCard"),
      tone: "blue",
      icon: "messages",
    },
  ];

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        {
          label: t("customerApp.portalStructure.navGroups.kompisWeb"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
        },
        {
          label: t("customerApp.portalStructure.nav.kompisWebSettings"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebSettings,
        },
        { label: t("customerApp.portalStructure.nav.kompisWebAppearance") },
      ]}
      eyebrow={t("customerApp.portalStructure.nav.kompisWebSettings")}
      title={t("customerApp.portalStructure.nav.kompisWebAppearance")}
      description={t("customerApp.portalStructure.webHub.appearanceDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      status={
        writerUnavailable
          ? { label: hubT(t, "web.appearanceWriterUnavailable"), tone: "amber" }
          : { label: common.statusReady, tone: "emerald" }
      }
    >
      <div className={`${AppLayoutClasses.pageWidth} space-y-6`}>
        {writerUnavailable ? (
          <section
            className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-4 text-sm leading-relaxed text-[var(--app-text)]"
            role="status"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-amber-900/70">
              {hubT(t, "web.appearanceConfigStatusLabel")}
            </p>
            <h2 className="mt-1 text-base font-semibold text-[var(--app-text)]">
              {hubT(t, "web.appearanceWriterUnavailableTitle")}
            </h2>
            <p className="mt-2 text-[var(--app-text-muted)]">
              {hubT(t, "web.appearanceWriterUnavailableBody")}
            </p>
            <p className="mt-2 text-[var(--app-text-muted)]">
              {hubT(t, "web.appearanceWriterBlockedBody")}
            </p>
            <p className="mt-2 text-[var(--app-text-muted)]">
              <span className="font-medium text-[var(--app-text)]">
                {hubT(t, "web.appearanceWriterStatusUnavailable")}
              </span>
              {" — "}
              {hubT(t, "web.appearanceCandidateReadyNote")}
            </p>
          </section>
        ) : null}
        <p
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--app-text-muted)]"
          role="note"
        >
          {hubT(t, "web.appearanceHonestNote")}
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <AppIconActionCard
              key={card.href}
              href={card.href}
              title={card.title}
              description={card.description}
              tone={card.tone}
              icon={<HubFeatureIcon kind={card.icon} />}
            />
          ))}
        </div>
        <p className="text-sm text-[var(--app-text-muted)]">
          <Link
            href={FOUNDATION_NAV_BINDINGS.kompisWebSettings}
            className="rounded font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {t("customerApp.portalStructure.nav.kompisWebSettings")}
          </Link>
        </p>
      </div>
    </AppHubShell>
  );
}
