"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AppPageHeader } from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { getEcc590ActiveSection } from "@/lib/executive-command-center-engine/config";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { EccTabIcons } from "./ecc-tab-icons";
import { ExecutiveCommandCenterLiveStatus } from "./ExecutiveCommandCenterLiveStatus";
import { useExecutiveCommandCenterRefresh } from "./ExecutiveCommandCenterRefreshContext";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

export function ExecutiveCommandCenterHeader({ labels }: { labels: Labels }) {
  const { refresh, refreshing, silentRefreshing } = useExecutiveCommandCenterRefresh();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = getEcc590ActiveSection(pathname, searchParams.get("tab"));
  const isOverview = activeSection === "overview";
  const brief = labels.commandBriefOverview;
  const isFetching = refreshing || silentRefreshing;

  return (
    <AppPageHeader
      eyebrow={isOverview ? undefined : labels.premium.eyebrow}
      title={isOverview ? brief.title : labels.title}
      description={isOverview ? brief.subtitle : labels.premium.description}
      actions={
        <div className="flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={isFetching}
            aria-busy={isFetching}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted disabled:cursor-not-allowed disabled:opacity-60 ${AppPremiumShell.focusRing}`}
          >
            <span className={isFetching ? "motion-safe:animate-spin" : ""} aria-hidden="true">
              {EccTabIcons.refresh}
            </span>
            {refreshing ? labels.premium.refreshing : labels.refresh}
          </button>
          <ExecutiveCommandCenterLiveStatus labels={labels} />
        </div>
      }
      contextRow={
        <>
          <SemanticBadge type="lifecycle" value="active" label={brief.organizationActive} />
          <SemanticBadge type="access" value="verified" label={brief.accessVerified} />
        </>
      }
    />
  );
}
