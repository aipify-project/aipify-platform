"use client";

import Link from "next/link";
import { usePwaInstall } from "./PwaInstallProvider";
import type { PwaInstallLabels } from "@/lib/pwa/types";

type AipifyWebAppInstallActionProps = {
  labels: PwaInstallLabels;
  variant?: "button" | "link" | "menu" | "compact";
  className?: string;
  showGuideLink?: boolean;
};

export function AipifyWebAppInstallAction({
  labels,
  variant = "button",
  className = "",
  showGuideLink = variant === "button",
}: AipifyWebAppInstallActionProps) {
  const { visibility, requestBrandedInstall } = usePwaInstall();

  if (visibility === "hidden") return null;

  if (visibility === "installed") {
    return (
      <div className={`text-sm text-gray-600 ${className}`} data-testid="pwa-installed-status">
        <p className="font-medium text-emerald-700">{labels.installedTitle}</p>
        {labels.installedHint ? <p className="mt-1 text-xs text-gray-500">{labels.installedHint}</p> : null}
      </div>
    );
  }

  const label =
    variant === "compact" ? labels.installAipify : variant === "menu" ? labels.openAsApp : labels.installWebApp;

  const baseClasses =
    variant === "link" || variant === "compact"
      ? "inline-flex min-h-[44px] items-center text-sm font-medium text-violet-600 hover:text-violet-700"
      : variant === "menu"
        ? "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 min-h-[44px]"
        : "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100";

  return (
    <div className={className} data-testid="pwa-install-action">
      <button type="button" onClick={requestBrandedInstall} className={baseClasses}>
        {label}
      </button>
      {showGuideLink ? (
        <Link
          href="/knowledge/articles/installing-aipify-web-app"
          className="mt-2 block text-xs font-medium text-gray-500 hover:text-violet-600"
        >
          {labels.guideLink}
        </Link>
      ) : null}
    </div>
  );
}
