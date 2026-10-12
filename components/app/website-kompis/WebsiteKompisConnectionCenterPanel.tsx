"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { WebsiteKompisConnectionLabels } from "@/lib/website-kompis-connection/labels";
import type { ConnectionStatusSummary } from "@/lib/website-kompis-connection/status-model";
import type { ConnectionAggregateStatus } from "@/lib/website-kompis-connection/source-inventory";

export type ConnectionCenterSection =
  | "overview"
  | "domains"
  | "install"
  | "visibility"
  | "license"
  | "help";

type WebsiteKompisConnectionCenterPanelProps = {
  labels: WebsiteKompisConnectionLabels;
  summary: ConnectionStatusSummary;
  domainPanel: ReactNode;
};

function aggregateTone(status: ConnectionAggregateStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-300 bg-emerald-50 text-emerald-900";
    case "pending":
    case "action_required":
      return "border-amber-300 bg-amber-50 text-amber-950";
    case "error":
    case "suspended":
      return "border-rose-300 bg-rose-50 text-rose-950";
    default:
      return "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)]";
  }
}

function checkpointTone(state: string): string {
  if (state === "ok") return "text-emerald-700";
  if (state === "pending" || state === "action_required") return "text-amber-700";
  if (state === "error" || state === "suspended") return "text-rose-700";
  return "text-[var(--app-text-muted)]";
}

function SectionButton({
  active,
  onClick,
  title,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] ${
        active
          ? "border-[var(--app-border-accent)] bg-[var(--app-primary-soft)]"
          : "border-[var(--app-border)] bg-[var(--app-card)] hover:border-[var(--app-border-accent)]"
      }`}
      aria-current={active ? "true" : undefined}
    >
      {title}
    </button>
  );
}

export function WebsiteKompisConnectionCenterPanel({
  labels,
  summary,
  domainPanel,
}: WebsiteKompisConnectionCenterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("section");
  const section: ConnectionCenterSection =
    raw === "domains" ||
    raw === "install" ||
    raw === "visibility" ||
    raw === "license" ||
    raw === "help" ||
    raw === "overview"
      ? raw
      : "overview";

  function setSection(next: ConnectionCenterSection) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "overview") params.delete("section");
    else params.set("section", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const aggregateLabel = labels.aggregate[summary.aggregate];
  const aggregateExplain = labels.aggregateExplain[summary.aggregate];
  const diagnosisText = labels.diagnosis[summary.diagnosis];
  const diagnosisAction = labels.diagnosisActions[summary.diagnosis];

  return (
    <div className="space-y-6">
      <section
        className={`rounded-2xl border px-5 py-4 shadow-[var(--app-shadow-card)] ${aggregateTone(summary.aggregate)}`}
        aria-labelledby="wk-conn-aggregate"
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          {labels.title}
        </p>
        <h2 id="wk-conn-aggregate" className="mt-1 text-2xl font-semibold">
          {aggregateLabel}
        </h2>
        <p className="mt-2 text-sm leading-relaxed opacity-90">{aggregateExplain}</p>
        <p className="mt-3 text-sm opacity-90">
          {labels.subscriptionNote}{" "}
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="font-medium underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {labels.openSubscription}
          </Link>
        </p>
      </section>

      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <SectionButton
          active={section === "overview"}
          onClick={() => setSection("overview")}
          title={labels.checkpointsTitle}
        />
        <SectionButton
          active={section === "domains"}
          onClick={() => setSection("domains")}
          title={labels.domainsTitle}
        />
        <SectionButton
          active={section === "install"}
          onClick={() => setSection("install")}
          title={labels.installTitle}
        />
        <SectionButton
          active={section === "visibility"}
          onClick={() => setSection("visibility")}
          title={labels.pageVisibilityTitle}
        />
        <SectionButton
          active={section === "license"}
          onClick={() => setSection("license")}
          title={labels.licenseTitle}
        />
        <SectionButton
          active={section === "help"}
          onClick={() => setSection("help")}
          title={labels.diagnosisTitle}
        />
      </div>

      {section === "overview" || section === "help" ? (
        <section className="space-y-3" aria-labelledby="wk-conn-checks">
          <h3 id="wk-conn-checks" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.checkpointsTitle}
          </h3>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {summary.checkpoints.map((checkpoint) => (
              <li key={checkpoint.id} className={AppVisualClasses.card}>
                <p className="text-sm font-medium text-[var(--app-text)]">
                  {labels.checkpoints[checkpoint.id]}
                </p>
                <p className={`mt-2 text-sm font-semibold ${checkpointTone(checkpoint.state)}`}>
                  {labels.checkpointState[checkpoint.state]}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {section === "overview" || section === "help" ? (
        <section className={`${AppVisualClasses.card} space-y-2`} aria-labelledby="wk-conn-diag">
          <h3 id="wk-conn-diag" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.diagnosisTitle}
          </h3>
          <p className="text-sm text-[var(--app-text)]">
            <span className="font-medium">{labels.diagnosisWhat}</span> {diagnosisText}
          </p>
          <p className="text-sm text-[var(--app-text-muted)]">
            <span className="font-medium text-[var(--app-text)]">{labels.diagnosisCustomer}</span>{" "}
            {diagnosisAction}
          </p>
          <p className="text-sm text-[var(--app-text-muted)]">
            <span className="font-medium text-[var(--app-text)]">{labels.diagnosisAipify}</span>{" "}
            {summary.diagnosis === "unknown_conflict" || summary.diagnosis === "product_not_enabled"
              ? diagnosisAction
              : labels.runtimeUnavailable}
          </p>
          <p className="text-xs text-[var(--app-text-muted)]">
            {labels.supportReference}: {summary.supportReference}
          </p>
        </section>
      ) : null}

      {section === "overview" || section === "domains" ? (
        <section className="space-y-3" aria-labelledby="wk-conn-domains">
          <div>
            <h3 id="wk-conn-domains" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.domainsTitle}
            </h3>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.domainsHint}</p>
          </div>
          {summary.domains.length === 0 ? (
            <div className={AppVisualClasses.card}>
              <p className="font-medium text-[var(--app-text)]">{labels.noDomainsTitle}</p>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.noDomainsBody}</p>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {summary.domains.map((domain) => (
                <li key={domain.domainId} className={AppVisualClasses.card}>
                  <p className="font-semibold text-[var(--app-text)]">{domain.domain}</p>
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                    {domain.bindingVerified ? labels.domainVerified : labels.domainPending}
                    {" · "}
                    {domain.hasInstallId
                      ? labels.domainInstallDetected
                      : labels.domainInstallMissing}
                  </p>
                  {domain.installIdMasked ? (
                    <p className="mt-2 text-xs text-[var(--app-text-muted)]">
                      {domain.installIdMasked}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {section === "domains" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--app-text)]">{labels.manageDomains}</p>
              {domainPanel}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSection("domains")}
              className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {labels.manageDomains}
            </button>
          )}
        </section>
      ) : null}

      {section === "install" ? (
        <section className={`${AppVisualClasses.card} space-y-3`} aria-labelledby="wk-conn-install">
          <h3 id="wk-conn-install" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.installTitle}
          </h3>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.installBody}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.installSnippetHint}</p>
          <p className="text-sm text-[var(--app-text)]">{labels.installNeverSecrets}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.runtimeUnavailable}</p>
          <button
            type="button"
            onClick={() => setSection("domains")}
            className="inline-flex rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-3 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {labels.manageDomains}
          </button>
        </section>
      ) : null}

      {section === "visibility" ? (
        <section className={`${AppVisualClasses.card} space-y-3`} aria-labelledby="wk-conn-vis">
          <h3 id="wk-conn-vis" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.pageVisibilityTitle}
          </h3>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.pageVisibilityBody}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.pageVisibilityProtected}</p>
          <p className="text-sm text-[var(--app-text)]">{labels.pageVisibilityNoRules}</p>
        </section>
      ) : null}

      {section === "license" ? (
        <section className={`${AppVisualClasses.card} space-y-3`} aria-labelledby="wk-conn-lic">
          <h3 id="wk-conn-lic" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.licenseTitle}
          </h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                {labels.licenseProduct}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[var(--app-text)]">
                {summary.productEnabled === true
                  ? labels.licenseProductOn
                  : summary.productEnabled === false
                    ? labels.licenseProductOff
                    : labels.licenseProductUnknown}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                {labels.licensePlan}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[var(--app-text)]">
                {summary.planName ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                {labels.licenseStatus}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[var(--app-text)]">
                {summary.licenseStatus ?? "—"}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.designStudioHidden}</p>
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="inline-flex text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
          >
            {labels.openSubscription}
          </Link>
        </section>
      ) : null}

      <details className={`${AppVisualClasses.card} text-sm text-[var(--app-text-muted)]`}>
        <summary className="cursor-pointer font-medium text-[var(--app-text)]">
          {labels.technicalDetails}
        </summary>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            {labels.checkpoints.product}:{" "}
            {summary.productEnabled === null ? "unknown" : String(summary.productEnabled)}
          </li>
          <li>
            {labels.domainsTitle}: {summary.activeDomainCount} / {labels.domainPending}:{" "}
            {summary.pendingDomainCount}
          </li>
          <li>
            {labels.domainInstallDetected}: {summary.installDetectedCount}
          </li>
          <li>
            {labels.supportReference}: {summary.supportReference}
          </li>
        </ul>
      </details>
    </div>
  );
}
