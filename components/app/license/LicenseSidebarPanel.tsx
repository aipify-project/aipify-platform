"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { AipifySidebarTypography } from "@/lib/design";
import { AipifyPulse } from "@/components/branding";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import { formatSoftwareVersion } from "@/lib/license";
import { resolveAppHref } from "@/lib/app/route-aliases";
import {
  fetchOrganizationContextWithRetry,
  resolveSidebarOrganizationDisplay,
  resolveSidebarPhaseAfterFetch,
  shouldCacheOrganizationSidebarContext,
  type OrganizationContextSidebarLabels,
  type SidebarOrganizationDisplayPhase,
} from "@/lib/app/organization-context-sidebar";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  CACHE_TTL_LICENSE_MS,
  LICENSE_SIDEBAR_CACHE_KEY,
  dedupeFetch,
  getCachedValue,
  invalidateCachedValue,
  setCachedValue,
} from "@/lib/polling";

type LicenseSidebarPanelProps = {
  labels: OrganizationContextSidebarLabels & {
    workspace: string;
    licensedTo: string;
    plan: string;
    status: string;
    version: string;
    poweredBy: string;
    copyright: string;
    pulseLabel: string;
  };
};

type LicenseCache = {
  phase: SidebarOrganizationDisplayPhase;
  context: AppOrganizationContext | null;
};

const LICENSE_CACHE_KEY = LICENSE_SIDEBAR_CACHE_KEY;

export default function LicenseSidebarPanel({ labels }: LicenseSidebarPanelProps) {
  const profileContext = useOptionalDashboardProfile();
  const cached = getCachedValue<LicenseCache>(LICENSE_CACHE_KEY);
  const [phase, setPhase] = useState<SidebarOrganizationDisplayPhase>(cached?.phase ?? "loading");
  const [context, setContext] = useState<AppOrganizationContext | null>(cached?.context ?? null);
  const licenseHref = resolveAppHref("/app/license");
  const { sidebarMark } = AIPIFY_BRAND;

  const profileFallback = useMemo(() => {
    const company = profileContext?.profile?.company;
    if (!company?.name?.trim()) {
      return null;
    }
    return {
      companyName: company.name,
      isPlatform: company.is_platform === true,
    };
  }, [profileContext?.profile?.company]);
  const profileFallbackRef = useRef(profileFallback);
  profileFallbackRef.current = profileFallback;

  const sidebarLabels = useMemo(
    () => ({
      contextLoading: labels.contextLoading,
      contextUnavailable: labels.contextUnavailable,
      organizationMissing: labels.organizationMissing,
      notAssigned: labels.notAssigned,
      statusActive: labels.statusActive,
      statusGrace: labels.statusGrace,
      statusPaused: labels.statusPaused,
    }),
    [labels],
  );

  const effectivePhase = useMemo((): SidebarOrganizationDisplayPhase => {
    if (profileFallback && (phase === "transient_error" || (phase === "loading" && profileContext?.loading === false))) {
      return "ready";
    }
    return phase;
  }, [phase, profileFallback, profileContext?.loading]);

  const display = useMemo(
    () =>
      resolveSidebarOrganizationDisplay({
        phase: effectivePhase,
        context: effectivePhase === "ready" && phase !== "ready" ? null : context,
        profileFallback,
        labels: sidebarLabels,
      }),
    [effectivePhase, phase, context, profileFallback, sidebarLabels],
  );

  const load = useCallback(async () => {
    await dedupeFetch(LICENSE_CACHE_KEY, async () => {
      setPhase("loading");

      const { fetchResult, context: nextContext } = await fetchOrganizationContextWithRetry();
      const nextPhase = resolveSidebarPhaseAfterFetch({
        fetchResult,
        context: nextContext,
        profileFallback: profileFallbackRef.current,
      });

      if (nextContext && shouldCacheOrganizationSidebarContext(nextContext)) {
        setCachedValue(
          LICENSE_CACHE_KEY,
          { phase: nextPhase, context: nextContext },
          CACHE_TTL_LICENSE_MS,
        );
      } else {
        invalidateCachedValue(LICENSE_CACHE_KEY);
      }

      setContext(nextContext);
      setPhase(nextPhase);
      return true;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Link
      href={licenseHref}
      className="relative mx-3 mb-3 block shrink-0 rounded-xl border border-aipify-border bg-aipify-surface-muted px-3 py-2.5 transition hover:border-aipify-accent-muted hover:bg-aipify-accent-soft/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2"
      aria-label={labels.poweredBy}
      aria-busy={display.phase === "loading"}
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
          <p className={AipifySidebarTypography.workspaceSummaryRow} title={`${labels.workspace} ${display.workspaceName}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.workspace}</span>
            <span
              className={`${AipifySidebarTypography.workspaceSummaryValue} line-clamp-2`}
              title={display.workspaceName}
            >
              {display.workspaceName}
            </span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRow} title={`${labels.licensedTo} ${display.licensedTo}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.licensedTo}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} line-clamp-2`}>
              {display.licensedTo}
            </span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.plan} ${display.planName}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.plan}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>{display.planName}</span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.status} ${display.statusLabel}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.status}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>{display.statusLabel}</span>
          </p>
          <p className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.version} ${formatSoftwareVersion("1.0.0")}`}>
            <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.version}</span>
            <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>
              {formatSoftwareVersion("1.0.0")}
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
