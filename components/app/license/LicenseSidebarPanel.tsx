"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifySidebarTypography } from "@/lib/design";
import { AipifyPulse } from "@/components/branding";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import { formatSoftwareVersion } from "@/lib/license";
import { resolveAppHref } from "@/lib/app/route-aliases";
import {
  CACHE_TTL_LICENSE_MS,
  LICENSE_SIDEBAR_CACHE_KEY,
  dedupeFetch,
  getCachedValue,
  invalidateCachedValue,
  setCachedValue,
} from "@/lib/polling";

type LicenseSidebarPanelProps = {
  labels: {
    workspace: string;
    licensedTo: string;
    plan: string;
    status: string;
    version: string;
    poweredBy: string;
    copyright: string;
    statusActive: string;
    statusGrace: string;
    statusPaused: string;
    statusUnknown: string;
    notConfigured: string;
    notAssigned: string;
    organizationMissing: string;
    pulseLabel: string;
  };
};

type LicenseSummary = {
  licensed_to: string | null;
  plan_name: string | null;
  license_status: string | null;
  software_version: string | null;
  software_owner: string | null;
  has_customer: boolean;
};

type OrganizationContextState =
  | "ready"
  | "organization_missing"
  | "membership_missing"
  | "subscription_inactive"
  | "access_denied"
  | "user_not_provisioned";

type LicenseCache = {
  workspaceName: string | null;
  summary: LicenseSummary | null;
  contextState: OrganizationContextState | null;
};

const LICENSE_CACHE_KEY = LICENSE_SIDEBAR_CACHE_KEY;

export default function LicenseSidebarPanel({ labels }: LicenseSidebarPanelProps) {
  const cached = getCachedValue<LicenseCache>(LICENSE_CACHE_KEY);
  const [workspaceName, setWorkspaceName] = useState<string | null>(cached?.workspaceName ?? null);
  const [summary, setSummary] = useState<LicenseSummary | null>(cached?.summary ?? null);
  const [contextState, setContextState] = useState<OrganizationContextState | null>(
    cached?.contextState ?? null
  );
  const licenseHref = resolveAppHref("/app/license");
  const { sidebarMark } = AIPIFY_BRAND;

  const load = useCallback(async () => {
    await dedupeFetch(LICENSE_CACHE_KEY, async () => {
      const contextRes = await fetch("/api/app/organization-context", { cache: "no-store" });
      let nextWorkspace: string | null = null;
      let nextSummary: LicenseSummary | null = null;
      let nextContextState: OrganizationContextState | null = null;

      if (contextRes.ok) {
        const context = (await contextRes.json()) as {
          state?: OrganizationContextState;
          workspace_name?: string | null;
          licensed_to?: string | null;
          plan_name?: string | null;
          license_status?: string | null;
          has_customer?: boolean;
        };
        nextContextState = context.state ?? null;
        nextWorkspace = context.workspace_name?.trim() || null;
        nextSummary = {
          has_customer: context.has_customer === true,
          licensed_to: context.licensed_to?.trim() || null,
          plan_name: context.plan_name?.trim() || null,
          license_status: context.license_status?.trim() || null,
          software_version: "1.0.0",
          software_owner: "Aipify Group AS",
        };

        const cacheable =
          nextContextState === "ready" &&
          Boolean(nextWorkspace) &&
          Boolean(nextSummary?.licensed_to || nextSummary?.has_customer);

        if (cacheable) {
          setCachedValue(
            LICENSE_CACHE_KEY,
            {
              workspaceName: nextWorkspace,
              summary: nextSummary,
              contextState: nextContextState,
            },
            CACHE_TTL_LICENSE_MS
          );
        } else {
          invalidateCachedValue(LICENSE_CACHE_KEY);
        }
      } else {
        invalidateCachedValue(LICENSE_CACHE_KEY);
      }

      setWorkspaceName(nextWorkspace);
      setSummary(nextSummary);
      setContextState(nextContextState);
      return true;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const isOrganizationMissing =
    contextState === "organization_missing" ||
    contextState === "user_not_provisioned" ||
    contextState === "membership_missing";

  const statusLabel = isOrganizationMissing
    ? labels.organizationMissing
    : summary?.license_status === "grace_period"
      ? labels.statusGrace
      : summary?.license_status === "paused"
        ? labels.statusPaused
        : summary?.license_status === "active"
          ? labels.statusActive
          : contextState === "subscription_inactive"
            ? labels.statusPaused
            : summary?.has_customer
              ? labels.statusActive
              : labels.organizationMissing;

  const workspaceDisplay = workspaceName?.trim()
    ? workspaceName
    : isOrganizationMissing
      ? labels.organizationMissing
      : labels.notConfigured;
  const licensedToDisplay = summary?.licensed_to?.trim()
    ? summary.licensed_to
    : isOrganizationMissing
      ? labels.organizationMissing
      : summary?.software_owner?.trim() || labels.notConfigured;
  const planDisplay = isOrganizationMissing
    ? labels.notAssigned
    : summary?.plan_name?.trim() || labels.notAssigned;

  return (
    <Link
      href={licenseHref}
      className="relative mx-3 mb-3 block shrink-0 rounded-xl border border-aipify-border bg-aipify-surface-muted px-3 py-2.5 transition hover:border-aipify-accent-muted hover:bg-aipify-accent-soft/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2"
      aria-label={labels.poweredBy}
    >
      <div className="flex items-start gap-2.5">
        <AipifyPulse
          size={sidebarMark.pulseSize}
          variant="mono"
          opacity={sidebarMark.pulseOpacity}
          title={labels.pulseLabel}
          aria-label={labels.pulseLabel}
          className="mt-px shrink-0 text-aipify-companion"
        />
        <div className={`min-w-0 flex-1 space-y-1 ${AipifySidebarTypography.workspaceSummary}`}>
          <p className={AipifySidebarTypography.workspaceSummaryRow} title={`${labels.workspace} ${workspaceDisplay}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.workspace}</span>
            <span
              className={`${AipifySidebarTypography.workspaceSummaryValue} line-clamp-2`}
              title={workspaceDisplay}
            >
              {workspaceDisplay}
            </span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRow} title={`${labels.licensedTo} ${licensedToDisplay}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.licensedTo}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} line-clamp-2`}>
              {licensedToDisplay}
            </span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.plan} ${planDisplay}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.plan}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>{planDisplay}</span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.status} ${statusLabel}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.status}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>{statusLabel}</span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.version} ${formatSoftwareVersion(summary?.software_version ?? "1.0.0")}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.version}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>
              {formatSoftwareVersion(summary?.software_version ?? "1.0.0")}
            </span>
          </p>
          <p className={`pt-0.5 ${AipifySidebarTypography.workspaceSummaryFooter}`}>
            {labels.poweredBy} Aipify™
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryCopyright}>{labels.copyright}</p>
        </div>
      </div>
    </Link>
  );
}
