"use client";

import Link from "next/link";
import { AppPageHeader } from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { EccTabIcons } from "./ecc-tab-icons";
import { useExecutiveCommandCenterRefresh } from "./ExecutiveCommandCenterRefreshContext";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

export function ExecutiveCommandCenterHeader({ labels }: { labels: Labels }) {
  const { refresh, refreshing } = useExecutiveCommandCenterRefresh();

  return (
    <AppPageHeader
      eyebrow={labels.premium.eyebrow}
      title={labels.title}
      description={labels.premium.description}
      actions={
        <>
          <Link
            href="/app/command-center/since-last-login"
            className={`hidden min-h-10 items-center rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted sm:inline-flex ${AppPremiumShell.focusRing}`}
          >
            {labels.premium.viewSinceLastLogin}
          </Link>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            aria-busy={refreshing}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white transition hover:bg-aipify-companion-hover disabled:cursor-not-allowed disabled:opacity-60 ${AppPremiumShell.focusRing}`}
          >
            <span className={refreshing ? "motion-safe:animate-spin" : ""} aria-hidden="true">
              {EccTabIcons.refresh}
            </span>
            {refreshing ? labels.premium.refreshing : labels.refresh}
          </button>
        </>
      }
      contextRow={
        <>
          <SemanticBadge type="lifecycle" value="active" label={labels.premium.context.organizationActive} />
          <SemanticBadge type="access" value="verified" label={labels.premium.context.executiveAccessVerified} />
        </>
      }
    />
  );
}
