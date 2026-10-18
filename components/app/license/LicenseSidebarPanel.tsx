"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnalyticsConsent } from "@/components/analytics/AnalyticsConsentProvider";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { AipifySidebarTypography } from "@/lib/design";
import { AipifyPulse } from "@/components/branding";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
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
    /** Same copy as analyticsConsent.privacySettings.open — footer owns APP placement. */
    privacySettingsOpen: string;
  };
};

type LicenseCache = {
  phase: SidebarOrganizationDisplayPhase;
  context: AppOrganizationContext | null;
};

const LICENSE_CACHE_KEY = LICENSE_SIDEBAR_CACHE_KEY;

export default function LicenseSidebarPanel({ labels }: LicenseSidebarPanelProps) {
  const profileContext = useOptionalDashboardProfile();
  const { openPrivacySettings, consent } = useAnalyticsConsent();
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
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const contextRef = useRef(context);
  contextRef.current = context;

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
      const hasStableDisplay =
        phaseRef.current === "ready" &&
        (contextRef.current !== null || profileFallbackRef.current !== null);
      if (!hasStableDisplay) {
        setPhase("loading");
      }

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

  const showPrivacyControl = consent !== "unknown";

  return (
    <div className="mx-3 mb-3 shrink-0 space-y-2">
      <Link
        href={licenseHref}
        className="relative block rounded-xl border border-[var(--app-border,var(--aipify-border))] bg-[var(--app-soft-surface,var(--aipify-surface-muted))] px-3.5 py-3 transition hover:border-[var(--app-border-accent)] hover:bg-[var(--app-primary-soft)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2"
        aria-label={labels.poweredBy}
        aria-busy={display.phase === "loading"}
      >
        <div className="flex items-start gap-3">
          <AipifyPulse
            size={sidebarMark.pulseSize}
            variant="mono"
            opacity={sidebarMark.pulseOpacity}
            title={labels.pulseLabel}
            aria-label={labels.pulseLabel}
            className="mt-0.5 shrink-0 text-aipify-companion"
          />
          <div className={`min-w-0 flex-1 space-y-2 ${AipifySidebarTypography.workspaceSummary}`}>
            <div className={AipifySidebarTypography.workspaceSummaryRow} title={`${labels.workspace} ${display.workspaceName}`}>
              <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.workspace}</span>
              <span
                className={`${AipifySidebarTypography.workspaceSummaryValue} line-clamp-2`}
                title={display.workspaceName}
              >
                {display.workspaceName}
              </span>
            </div>
            {display.licensedTo.trim().toLowerCase() !== display.workspaceName.trim().toLowerCase() ? (
              <div className={AipifySidebarTypography.workspaceSummaryRow} title={`${labels.licensedTo} ${display.licensedTo}`}>
                <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.licensedTo}</span>
                <span className={`${AipifySidebarTypography.workspaceSummaryValue} line-clamp-2`}>
                  {display.licensedTo}
                </span>
              </div>
            ) : null}
            <div className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.plan} ${display.planName}`}>
              <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.plan}</span>
              <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>{display.planName}</span>
            </div>
            <div className={AipifySidebarTypography.workspaceSummaryRowTight} title={`${labels.status} ${display.statusLabel}`}>
              <span className={AipifySidebarTypography.workspaceSummaryLabel}>{labels.status}</span>
              <span className={`${AipifySidebarTypography.workspaceSummaryValue} min-w-0 truncate`}>{display.statusLabel}</span>
            </div>
            <div className="space-y-0.5 border-t border-[var(--app-border)] pt-2">
              <p className={AipifySidebarTypography.workspaceSummaryFooter}>
                {labels.poweredBy} Aipify™
              </p>
              <p className={AipifySidebarTypography.workspaceSummaryCopyright}>{labels.copyright}</p>
            </div>
          </div>
        </div>
      </Link>

      {showPrivacyControl ? (
        <button
          type="button"
          onClick={openPrivacySettings}
          aria-haspopup="dialog"
          className="aipify-sidebar-privacy-trigger flex w-full items-center justify-center rounded-xl border border-[var(--app-border,var(--aipify-border))] bg-[var(--app-card,#fff)] px-3 py-2 text-xs font-medium text-[var(--app-text-muted,var(--aipify-text-secondary))] shadow-sm transition hover:border-[var(--app-border-accent)] hover:bg-[var(--app-soft-surface)] hover:text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2"
        >
          {labels.privacySettingsOpen}
        </button>
      ) : null}
    </div>
  );
}
