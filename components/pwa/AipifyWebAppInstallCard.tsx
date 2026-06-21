"use client";

import Link from "next/link";
import { APP_WEB_APP_INSTALL_ARTICLE_PATH } from "@/lib/pwa/constants";
import type { PwaInstallLabels } from "@/lib/pwa/types";
import { usePwaInstall } from "./PwaInstallProvider";

type AipifyWebAppInstallCardProps = {
  labels: PwaInstallLabels;
  className?: string;
};

export function AipifyWebAppInstallCard({ labels, className = "" }: AipifyWebAppInstallCardProps) {
  const { cardState, requestBrandedInstall, resetDismissed } = usePwaInstall();
  const card = labels.card;

  const content = {
    available: {
      title: card.availableTitle,
      hint: card.availableHint,
      action: card.installButton,
      onAction: requestBrandedInstall,
      testId: "pwa-install-card-available",
      tone: "default" as const,
    },
    already_installed: {
      title: card.alreadyInstalledTitle,
      hint: card.alreadyInstalledHint,
      action: null,
      onAction: null,
      testId: "pwa-install-card-installed",
      tone: "success" as const,
    },
    unsupported: {
      title: card.unsupportedTitle,
      hint: card.unsupportedHint,
      action: null,
      onAction: null,
      testId: "pwa-install-card-unsupported",
      tone: "muted" as const,
    },
    dismissed: {
      title: card.dismissedTitle,
      hint: card.dismissedHint,
      action: card.tryAgain,
      onAction: () => {
        resetDismissed();
        requestBrandedInstall();
      },
      testId: "pwa-install-card-dismissed",
      tone: "default" as const,
    },
  }[cardState];

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-gray-50/80 p-4 ${className}`}
      data-testid={content.testId}
      data-state={cardState}
    >
      <p
        className={`text-sm font-semibold ${
          content.tone === "success"
            ? "text-emerald-700"
            : content.tone === "muted"
              ? "text-gray-700"
              : "text-gray-900"
        }`}
      >
        {content.title}
      </p>
      <p className="mt-1 text-sm text-gray-600">{content.hint}</p>
      {content.action && content.onAction ? (
        <button
          type="button"
          onClick={content.onAction}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
        >
          {content.action}
        </button>
      ) : null}
      <Link
        href={APP_WEB_APP_INSTALL_ARTICLE_PATH}
        className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900"
      >
        {card.guideLink}
      </Link>
    </div>
  );
}
