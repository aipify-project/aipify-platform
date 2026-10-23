import Link from "next/link";
import {
  AppContentWidth,
  AppEmptyState,
  AppIconActionCard,
  AppIconStatusCard,
  AppWorkspaceHero,
} from "@/components/app/design";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { bedriftHomeCardState } from "@/lib/app/foundation-product-card";
import { AppVisualClasses } from "@/lib/design/app-visual-system";

export type AppFoundationDashboardLabels = {
  eyebrow: string;
  title: string;
  description: string;
  welcomeNamed: string;
  welcomeGeneric: string;
  orgFallback: string;
  productsTitle: string;
  productsDescription: string;
  webTitle: string;
  webDescription: string;
  webUnavailable: string;
  bedriftUnavailable: string;
  bedriftTitle: string;
  bedriftDescription: string;
  setupTitle: string;
  setupDescription: string;
  connectionTitle: string;
  connectionDescription: string;
  integrationsTitle: string;
  integrationsDescription: string;
  accountTitle: string;
  accountDescription: string;
  subscriptionTitle: string;
  subscriptionDescription: string;
  attentionTitle: string;
  attentionDescription: string;
  attentionEmpty: string;
  openWeb: string;
  openBedrift: string;
  openBilling: string;
  openNotifications: string;
  statusAvailable: string;
  statusUnavailable: string;
  statusReady: string;
};

export type AppFoundationDashboardProps = {
  labels: AppFoundationDashboardLabels;
  organizationName: string | null;
  websiteKompisAvailable: boolean | null;
  kompisBedriftAvailable: boolean | null;
  planLabel: string | null;
  licenseStatusLabel: string | null;
};

function DashboardIcon({ path }: { path: string }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export function AppFoundationDashboard({
  labels,
  organizationName,
  websiteKompisAvailable,
  kompisBedriftAvailable,
  planLabel,
  licenseStatusLabel,
}: AppFoundationDashboardProps) {
  const welcome =
    organizationName && organizationName.trim()
      ? labels.welcomeNamed.replace("{organization}", organizationName.trim())
      : labels.welcomeGeneric;

  const webStatus =
    websiteKompisAvailable === false
      ? { label: labels.statusUnavailable, tone: "amber" as const }
      : { label: labels.statusAvailable, tone: "emerald" as const };

  return (
    <AppContentWidth className="relative">
      <div className="relative z-[1] space-y-8">
      <AppWorkspaceHero
        eyebrow={labels.eyebrow}
        title={labels.title}
        description={welcome}
        contextLabel={[organizationName?.trim() || labels.orgFallback, planLabel].filter(Boolean).join(" · ")}
        status={
          licenseStatusLabel
            ? { label: licenseStatusLabel, tone: "slate" }
            : { label: labels.statusReady, tone: "emerald" }
        }
      />

      <section className="space-y-3" aria-labelledby="foundation-products-heading">
        <div>
          <h2 id="foundation-products-heading" className="text-lg font-semibold text-aipify-text">
            {labels.productsTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">
            {labels.productsDescription}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {websiteKompisAvailable === false ? (
            <AppIconStatusCard
              title={labels.webTitle}
              description={labels.webUnavailable}
              tone="slate"
              statusLabel={labels.statusUnavailable}
              statusTone="slate"
              icon={
                <DashboardIcon path="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              }
            />
          ) : (
            <AppIconActionCard
              href={FOUNDATION_NAV_BINDINGS.kompisWebDashboard}
              title={labels.webTitle}
              description={labels.webDescription}
              tone="purple"
              statusLabel={webStatus.label}
              statusTone={webStatus.tone}
              icon={
                <DashboardIcon path="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              }
            />
          )}
          {bedriftHomeCardState(kompisBedriftAvailable) === "open" ? (
            <AppIconActionCard
              href={FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard}
              title={labels.bedriftTitle}
              description={labels.bedriftDescription}
              tone="blue"
              statusLabel={labels.statusAvailable}
              statusTone="emerald"
              icon={
                <DashboardIcon path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              }
            />
          ) : (
            <AppIconStatusCard
              title={labels.bedriftTitle}
              description={labels.bedriftUnavailable}
              tone="slate"
              statusLabel={labels.statusUnavailable}
              statusTone="slate"
              icon={
                <DashboardIcon path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              }
            />
          )}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="foundation-setup-heading">
        <div>
          <h2 id="foundation-setup-heading" className="text-lg font-semibold text-aipify-text">
            {labels.setupTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">
            {labels.setupDescription}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {websiteKompisAvailable === false ? (
            <AppIconStatusCard
              title={labels.connectionTitle}
              description={labels.webUnavailable}
              tone="slate"
              statusLabel={labels.statusUnavailable}
              statusTone="slate"
              icon={
                <DashboardIcon path="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              }
            />
          ) : (
            <AppIconActionCard
              href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
              title={labels.connectionTitle}
              description={labels.connectionDescription}
              tone="lavender"
              icon={
                <DashboardIcon path="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              }
            />
          )}
          <AppIconActionCard
            href={FOUNDATION_NAV_BINDINGS.accountIntegrations}
            title={labels.integrationsTitle}
            description={labels.integrationsDescription}
            tone="blue"
            icon={
              <DashboardIcon path="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3 4.126 4.126 0 00-3.208 1.326A48.39 48.39 0 003 9.75c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3" />
            }
          />
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="foundation-account-heading">
        <div>
          <h2 id="foundation-account-heading" className="text-lg font-semibold text-aipify-text">
            {labels.accountTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">
            {labels.accountDescription}
          </p>
        </div>
        <div className={`${AppVisualClasses.card} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="min-w-0 space-y-1">
            <h3 className="text-base font-semibold text-[var(--app-text)]">{labels.subscriptionTitle}</h3>
            <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">
              {labels.subscriptionDescription}
            </p>
            <p className="text-sm text-[var(--app-text)]">
              {[planLabel, licenseStatusLabel].filter(Boolean).join(" · ") || labels.statusReady}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={FOUNDATION_NAV_BINDINGS.accountHome}
              className="inline-flex rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {labels.openBilling}
            </Link>
            <Link
              href={FOUNDATION_NAV_BINDINGS.accountNotifications}
              className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:bg-[var(--app-soft-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {labels.openNotifications}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="foundation-attention-heading">
        <div>
          <h2 id="foundation-attention-heading" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.attentionTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
            {labels.attentionDescription}
          </p>
        </div>
        <AppEmptyState title={labels.attentionEmpty} description={labels.attentionDescription} />
      </section>
      </div>
    </AppContentWidth>
  );
}
