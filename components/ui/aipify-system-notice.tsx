"use client";

import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { SYSTEM_NOTICE_PRESETS } from "@/lib/system-notice/presets";
import type { SystemNoticeLabels, SystemNoticeStatus } from "@/lib/system-notice/types";
import { useSystemNoticeLabels } from "@/components/providers/SystemNoticeProvider";

export type AipifySystemNoticeProps = {
  status: SystemNoticeStatus;
  title?: string;
  message?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  icon?: string;
  labels?: SystemNoticeLabels;
  tertiaryLabel?: string;
  tertiaryHref?: string;
  fullPage?: boolean;
  /** Override ghost dashboard link (defaults to preset layout dashboardHref or /app). */
  dashboardHref?: string;
  dashboardLabel?: string;
};

export function AipifySystemNotice({
  status,
  title,
  message,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  icon,
  labels: labelsProp,
  tertiaryLabel,
  tertiaryHref,
  fullPage = true,
  dashboardHref,
  dashboardLabel,
}: AipifySystemNoticeProps) {
  const contextLabels = useSystemNoticeLabels();
  const labels = labelsProp ?? contextLabels;
  const preset = SYSTEM_NOTICE_PRESETS[status];
  const copy = labels.presets[status];
  const layout = preset.layout;

  const resolvedTitle = title ?? copy.title;
  const resolvedMessage = message ?? copy.message;
  const resolvedPrimaryLabel = primaryLabel ?? copy.primaryLabel;
  const resolvedPrimaryHref = primaryHref ?? preset.primaryHref;
  const resolvedSecondaryLabel = secondaryLabel ?? copy.secondaryLabel;
  const resolvedSecondaryHref = secondaryHref ?? preset.secondaryHref;
  const resolvedIcon = icon ?? preset.icon;
  const resolvedDashboardHref = dashboardHref ?? layout?.dashboardHref ?? "/app";
  const resolvedDashboardLabel = dashboardLabel ?? labels.returnToDashboard;
  const showSecondary = !layout?.hideSecondary && Boolean(resolvedSecondaryLabel);
  const showGhostDashboard = layout?.ghostDashboard === true || Boolean(tertiaryLabel && tertiaryHref);

  const shell = fullPage
    ? "flex min-h-screen items-center justify-center bg-aipify-canvas px-4 py-12"
    : "flex w-full justify-center px-4 py-8";

  return (
    <div className={shell}>
      <div className={`w-full max-w-lg ${AipifyShellClasses.surfaceCard} p-8 text-center shadow-sm`}>
        <div className="mx-auto mb-4 flex justify-center text-aipify-companion">
          <AipifyPulse size={48} variant="gradient" title="Aipify" aria-label="Aipify" />
        </div>
        <div className="mb-4 text-3xl" aria-hidden="true">
          {resolvedIcon}
        </div>
        <h1 className="text-xl font-semibold text-aipify-text">{resolvedTitle}</h1>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-aipify-text-secondary">
          {resolvedMessage}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={resolvedPrimaryHref}
            className={`${AipifyShellClasses.primaryButton} inline-flex justify-center`}
          >
            {resolvedPrimaryLabel}
          </Link>
          {showSecondary ? (
            <Link
              href={resolvedSecondaryHref}
              className={`${AipifyShellClasses.secondaryButton} inline-flex justify-center`}
            >
              {resolvedSecondaryLabel}
            </Link>
          ) : null}
        </div>
        {showGhostDashboard ? (
          <Link
            href={tertiaryHref ?? resolvedDashboardHref}
            className={`mt-4 inline-flex justify-center ${AipifyShellClasses.ghostButton}`}
          >
            {tertiaryLabel ?? resolvedDashboardLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
