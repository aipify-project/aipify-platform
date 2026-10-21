"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  CircleCheck,
  CreditCard,
  Eye,
  Globe,
  Package,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import {
  connectionShowsActiveLicenseWithoutPublicView,
  websiteKompisLicenseStatusKey,
} from "@/lib/website-kompis-connection/customer-copy";
import type { WebsiteKompisConnectionLabels } from "@/lib/website-kompis-connection/labels";
import {
  connectionDomainsForSelection,
  type ConnectionSiteWorkspace,
} from "@/lib/website-kompis-connection/site-workspace";
import type { ConnectionStatusSummary } from "@/lib/website-kompis-connection/status-model";

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
  workspace: ConnectionSiteWorkspace;
  pageTitle: string;
  contextLabel: string | null;
  statusTone: "emerald" | "amber" | "slate" | "purple";
  domainPanel: ReactNode;
};

const CHECKPOINT_ICONS: Record<string, LucideIcon> = {
  product: Package,
  subscription: CreditCard,
  license: BadgeCheck,
  domain: Globe,
  installation: Plug,
  public_runtime: Eye,
};

function statusBadgeTone(tone: "emerald" | "amber" | "slate" | "purple"): string {
  if (tone === "emerald") return "bg-[#E9F8F0] text-[#146C43] ring-[#B7E4CF]";
  if (tone === "amber") return "bg-[#FFF4E5] text-[#945A15] ring-[#EEC58C]";
  if (tone === "purple") return "bg-[#F3EDFF] text-[#5538D3] ring-[#D3C7FF]";
  return "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]";
}

function checkpointChip(state: string): string {
  if (state === "ok") return "bg-[#E9F8F0] text-[#146C43]";
  if (state === "pending" || state === "action_required") return "bg-[#FFF4E5] text-[#945A15]";
  if (state === "error" || state === "suspended") return "bg-[#F3EDFF] text-[#5538D3]";
  return "bg-[#F4F6FB] text-[#5F6788]";
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
      className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE] ${
        active
          ? "border-[#7055EE] bg-[#7055EE] text-white"
          : "border-[#E3E6F1] bg-white text-[#20243A] hover:border-[#C9C4EE]"
      }`}
      role="tab"
      aria-selected={active}
      aria-current={active ? "true" : undefined}
    >
      {title}
    </button>
  );
}

function snippetBlockMessage(
  workspace: ConnectionSiteWorkspace,
  labels: WebsiteKompisConnectionLabels,
): string | null {
  if (workspace.snippetBlock === "unverified") return labels.snippetUnverified;
  if (workspace.snippetBlock === "duplicate_domain") return labels.snippetDuplicateDomain;
  if (workspace.snippetBlock === "invalid_domain") return labels.snippetInvalidDomain;
  if (workspace.snippetBlock === "choose_site") return labels.snippetChooseSite;
  if (workspace.snippetBlock === "rejected") return labels.siteRejected;
  if (workspace.snippetBlock === "no_sites") return labels.emptySitesBody;
  if (!workspace.snippet) return labels.snippetUnavailable;
  return null;
}

export function WebsiteKompisConnectionCenterPanel({
  labels,
  summary,
  workspace,
  pageTitle,
  contextLabel,
  statusTone,
  domainPanel,
}: WebsiteKompisConnectionCenterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scriptCopied, setScriptCopied] = useState(false);
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

  function replaceQuery(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setSection(next: ConnectionCenterSection) {
    replaceQuery((params) => {
      if (next === "overview") params.delete("section");
      else params.set("section", next);
    });
  }

  function selectSite(installId: string) {
    replaceQuery((params) => {
      params.set("site", installId);
      params.set("section", "install");
    });
  }

  async function copyScript() {
    if (!workspace.snippet) return;
    try {
      await navigator.clipboard.writeText(workspace.snippet);
      setScriptCopied(true);
      window.setTimeout(() => setScriptCopied(false), 2000);
    } catch {
      setScriptCopied(false);
    }
  }

  const visibleDomains = connectionDomainsForSelection(summary.domains, workspace);
  const scriptMessage = snippetBlockMessage(workspace, labels);

  const aggregateLabel = labels.aggregate[summary.aggregate];
  const publicViewUnavailable = connectionShowsActiveLicenseWithoutPublicView(summary);
  const diagnosisText =
    summary.diagnosis === "all_clear" && publicViewUnavailable
      ? labels.activeLicenseRuntimeUnavailable
      : labels.diagnosis[summary.diagnosis];
  const diagnosisAction = labels.diagnosisActions[summary.diagnosis];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E8E4FB] bg-gradient-to-br from-white to-[#F5F1FF] p-6 shadow-[0_12px_32px_rgba(49,38,112,0.055)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-[#20243A] sm:text-4xl">{pageTitle}</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#657089]">{labels.subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {contextLabel ? <p className="text-sm text-[#657089]">{contextLabel}</p> : null}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadgeTone(statusTone)}`}>
                <span className="size-1.5 rounded-full bg-current" aria-hidden />
                {aggregateLabel}
              </span>
            </div>
          </div>
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-[#E3E6F1] bg-white px-4 text-sm font-semibold text-[#20243A] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE]"
          >
            {labels.openSubscription}
          </Link>
        </div>
      </section>

      <section
        className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)] sm:p-6"
        aria-labelledby="wk-conn-aggregate"
      >
        <p className="text-sm font-medium text-[#657089]">{labels.title}</p>
        <h2 id="wk-conn-aggregate" className="mt-1 text-2xl font-semibold text-[#20243A]">
          {aggregateLabel}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#20243A]">
          {labels.aggregateExplain[summary.aggregate]}
        </p>
        {publicViewUnavailable ? (
          <p className="mt-4 rounded-2xl border border-[#EEC58C] bg-[#FFF4E5] px-4 py-3 text-sm leading-relaxed text-[#945A15]">
            {labels.activeLicenseRuntimeUnavailable}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-[#657089]">
          {labels.subscriptionNote}{" "}
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="rounded font-medium text-[#7055EE] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE]"
          >
            {labels.openSubscription}
          </Link>
        </p>
      </section>

      <section
        className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)] sm:p-6"
        aria-labelledby="wk-conn-sites"
      >
        <h2 id="wk-conn-sites" className="text-lg font-semibold text-[#20243A]">
          {labels.sitesTitle}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#657089]">{labels.sitesHint}</p>
        {workspace.state === "no_sites" ? (
          <div className="mt-4 rounded-2xl bg-[#F8F9FD] p-4">
            <p className="font-medium text-[#20243A]">{labels.emptySitesTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#657089]">{labels.emptySitesBody}</p>
            {summary.canManage ? (
              <button
                type="button"
                onClick={() => setSection("domains")}
                className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#7055EE] px-4 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE]"
              >
                {labels.addWebsite}
              </button>
            ) : (
              <p className="mt-3 text-sm text-[#657089]">{labels.managePermissionRequired}</p>
            )}
          </div>
        ) : null}
        {workspace.state === "choose_site" ? (
          <div className="mt-4 rounded-2xl border border-[#EEC58C] bg-[#FFF4E5] p-4">
            <p className="font-medium text-[#945A15]">{labels.chooseSiteTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#945A15]">{labels.chooseSiteBody}</p>
          </div>
        ) : null}
        {workspace.state === "rejected" ? (
          <p className="mt-4 rounded-2xl border border-[#D3C7FF] bg-[#F3EDFF] px-4 py-3 text-sm leading-relaxed text-[#5538D3]" role="alert">
            {labels.siteRejected}
          </p>
        ) : null}
        {workspace.sites.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {workspace.sites.map((site) => {
              const selected = workspace.selected?.installId === site.installId;
              return (
                <button
                  key={site.installId}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectSite(site.installId)}
                  className={`rounded-2xl border p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE] ${
                    selected ? "border-[#7055EE] bg-[#F5F1FF]" : "border-[#E3E6F1] bg-white"
                  }`}
                >
                  <p className="break-all font-semibold text-[#20243A]">{site.domain}</p>
                  <p className="mt-2 text-sm text-[#657089]">
                    {site.verified ? labels.domainVerified : labels.domainPending}
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}
        {workspace.selected ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-[#20243A]">
              {labels.selectedSite}: <span className="break-all">{workspace.selected.domain}</span>
            </p>
            {workspace.selected.verified ? null : (
              <p className="text-sm text-[#657089]">{labels.verificationPendingExplain}</p>
            )}
            <p className="break-all text-xs text-[#657089]">
              {labels.publicInstallId}: {workspace.selected.installId}
            </p>
            {workspace.snippet ? (
              <div className="space-y-2">
                <pre className="max-h-48 overflow-x-auto rounded-2xl bg-[#20243A] p-4 text-xs leading-relaxed text-white">
                  <code>{workspace.snippet}</code>
                </pre>
                <button
                  type="button"
                  onClick={() => void copyScript()}
                  className="inline-flex min-h-11 items-center rounded-full bg-[#7055EE] px-4 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE]"
                >
                  {scriptCopied ? labels.scriptCopied : labels.copyScript}
                </button>
              </div>
            ) : scriptMessage ? (
              <p className="text-sm leading-relaxed text-[#657089]">{scriptMessage}</p>
            ) : null}
          </div>
        ) : scriptMessage && workspace.state !== "no_sites" ? (
          <p className="mt-4 text-sm leading-relaxed text-[#657089]">{scriptMessage}</p>
        ) : null}
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={pageTitle}>
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
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summary.checkpoints.map((checkpoint) => {
              const Icon = CHECKPOINT_ICONS[checkpoint.id] ?? CircleCheck;
              return (
              <li key={checkpoint.id} className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)]">
                <span className={`inline-flex size-11 items-center justify-center rounded-2xl ${checkpointChip(checkpoint.state)}`} aria-hidden>
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <p className="mt-4 text-sm font-medium text-[#20243A]">
                  {labels.checkpoints[checkpoint.id]}
                </p>
                <p className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold ${checkpointChip(checkpoint.state)} rounded-full px-2.5 py-1`}>
                  {checkpoint.state === "ok" ? (
                    <CircleCheck aria-hidden className="size-4 shrink-0" strokeWidth={2} />
                  ) : checkpoint.id === "public_runtime" && checkpoint.state === "unavailable" ? (
                    <AlertCircle aria-hidden className="size-4 shrink-0" strokeWidth={2} />
                  ) : null}
                  {checkpoint.id === "public_runtime" && checkpoint.state === "unavailable"
                    ? labels.runtimeNotObserved
                    : labels.checkpointState[checkpoint.state]}
                </p>
                {checkpoint.id === "public_runtime" && checkpoint.state === "unavailable" ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#657089]">{labels.runtimeUnavailable}</p>
                ) : null}
              </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {section === "overview" || section === "help" ? (
        <section className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)] sm:p-6" aria-labelledby="wk-conn-diag">
          <h3 id="wk-conn-diag" className="text-lg font-semibold text-[#20243A]">
            {labels.diagnosisTitle}
          </h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-[#F8F9FD] p-4">
              <p className="text-sm font-semibold text-[#20243A]">{labels.diagnosisWhat}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#657089]">{diagnosisText}</p>
            </div>
            <div className="rounded-2xl bg-[#F8F9FD] p-4">
              <p className="text-sm font-semibold text-[#20243A]">{labels.diagnosisCustomer}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#657089]">{diagnosisAction}</p>
            </div>
            <div className="rounded-2xl bg-[#F8F9FD] p-4">
              <p className="text-sm font-semibold text-[#20243A]">{labels.diagnosisAipify}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#657089]">
                {summary.diagnosis === "unknown_conflict" || summary.diagnosis === "product_not_enabled"
                  ? diagnosisAction
                  : labels.runtimeUnavailable}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#657089]">
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
          {visibleDomains.length === 0 ? (
            <div className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)]">
              <p className="font-medium text-[var(--app-text)]">{labels.noDomainsTitle}</p>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.noDomainsBody}</p>
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {visibleDomains.map((domain) => (
                <li key={domain.domainId} className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)]">
                  <p className="break-all font-semibold text-[#20243A]">{domain.domain}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`inline-flex min-h-8 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${domain.bindingVerified ? "bg-[#E9F8F0] text-[#146C43] ring-[#B7E4CF]" : "bg-[#FFF4E5] text-[#945A15] ring-[#EEC58C]"}`}>
                      {domain.bindingVerified ? labels.domainVerified : labels.domainPending}
                    </span>
                    <span className={`inline-flex min-h-8 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${domain.hasInstallId ? "bg-[#E9F8F0] text-[#146C43] ring-[#B7E4CF]" : "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]"}`}>
                      {domain.hasInstallId
                        ? labels.domainInstallDetected
                        : labels.domainInstallMissing}
                    </span>
                  </div>
                  {domain.installIdMasked ? (
                    <p className="mt-3 text-xs text-[#657089]">
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
              {summary.canManage ? (
                domainPanel
              ) : (
                <p className="text-sm text-[var(--app-text-muted)]">{labels.managePermissionRequired}</p>
              )}
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
        <section className="space-y-3 rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)] sm:p-6" aria-labelledby="wk-conn-install">
          <h3 id="wk-conn-install" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.installTitle}
          </h3>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.installBody}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.installSnippetHint}</p>
          <p className="text-sm text-[var(--app-text)]">{labels.installNeverSecrets}</p>
          {workspace.snippet ? (
            <p className="text-sm text-[var(--app-text)]">{labels.copyScript}</p>
          ) : null}
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
        <section className="space-y-3 rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)] sm:p-6" aria-labelledby="wk-conn-vis">
          <h3 id="wk-conn-vis" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.pageVisibilityTitle}
          </h3>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.pageVisibilityBody}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.pageVisibilityProtected}</p>
          <p className="text-sm text-[var(--app-text)]">{labels.pageVisibilityNoRules}</p>
        </section>
      ) : null}

      {section === "license" ? (
        <section className="space-y-3 rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)] sm:p-6" aria-labelledby="wk-conn-lic">
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
                {labels.licenseStatusValue[websiteKompisLicenseStatusKey(summary.licenseStatus)]}
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

      <details className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 text-sm text-[#657089] shadow-[0_8px_22px_rgba(38,37,104,0.05)]">
        <summary className="min-h-11 cursor-pointer rounded font-medium text-[#20243A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7055EE]">
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
