import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { SUPPORT_CREATE_HREF } from "@/lib/app-portal/support-history/config";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { summarizeAddonModules } from "@/lib/commercial-packages/addon-module-summary";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { loadCustomerModulesCenterSafe } from "@/lib/commercial-packages/load-modules-center";
import { buildModulesAdminPanelLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { Blocks, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

/** Add-on modules for the workspace. Main products and planned prices stay on their own routes. */
export default async function ModulesSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const labels = buildModulesAdminPanelLabels(t);
  const portfolio = buildPortfolioLabels(t);
  const [productReads, modules] = await Promise.all([
    loadSubscriptionProductReads(),
    loadCustomerModulesCenterSafe(),
  ]);
  const summary = summarizeAddonModules(modules.ok ? modules.center.installed_modules : []);

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: labels.title },
      ]}
      eyebrow={labels.title}
      title={labels.title}
      description={labels.subtitle}
    >
      <div className={`${AppLayoutClasses.pageWidth} ${AppLayoutClasses.sectionGap}`}>
        <section className="overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border-accent)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]">
          <div className="flex items-start gap-3 bg-[image:var(--app-primary-soft-fill)] px-5 py-4 sm:px-6">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[var(--app-primary)]" strokeWidth={2} />
            <div>
              <h2 className="text-sm font-medium text-[var(--app-text-muted)]">{portfolio.currentLicense}</h2>
              <p className="mt-1 text-xl font-semibold tracking-tight text-[var(--app-text)]">
                {productReads.license.planName ?? portfolio.detailsUnavailable}
              </p>
            </div>
          </div>
        </section>

        {!modules.ok ? (
          <p className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] px-5 py-4 text-sm text-[var(--app-text)]">
            {labels.loadError}
          </p>
        ) : (
          <section className="space-y-3" aria-labelledby="addon-active-heading">
            <h2 id="addon-active-heading" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.sections.installed}
              {summary.total > 0 ? ` · ${summary.total}` : ""}
            </h2>
            {summary.total === 0 ? (
              <p className="text-sm text-[var(--app-text-muted)]">{labels.emptyAddons}</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {summary.named.map((mod) => (
                  <li
                    key={mod.key}
                    className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]"
                  >
                    <div className="flex items-start gap-3">
                      <Blocks aria-hidden className="mt-0.5 size-5 shrink-0 text-[var(--app-primary)]" strokeWidth={2} />
                      <div>
                        <h3 className="text-base font-semibold text-[var(--app-text)]">{mod.name}</h3>
                        <p className={`mt-1 text-sm ${mod.tone === "active" ? "text-[var(--app-positive)]" : "text-[var(--app-text-muted)]"}`}>
                          {mod.tone === "active"
                            ? labels.statusActive
                            : mod.tone === "trial"
                              ? labels.statusTrial
                              : labels.licensedRecord}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                {summary.unnamedCount > 0 ? (
                  <li className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:col-span-2">
                    <h3 className="text-base font-semibold text-[var(--app-text)]">
                      {labels.activeCount}: {summary.unnamedCount}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.unnamedNote}</p>
                  </li>
                ) : null}
              </ul>
            )}
          </section>
        )}

        <section className="space-y-2 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--app-text)]">{labels.notForPurchase}</h2>
          <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.purchaseGap}</p>
          <Link
            href={SUPPORT_CREATE_HREF}
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {labels.contactSupport}
          </Link>
        </section>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href={FOUNDATION_NAV_BINDINGS.kompisWebModules}
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {portfolio.myProducts}
          </Link>
          <Link
            href="/app/settings/billing/packages"
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {portfolio.packagesTitle}
          </Link>
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {labels.manageSubscription}
          </Link>
        </div>
      </div>
    </AppHubShell>
  );
}
