"use client";

import Link from "next/link";
import SinceLastLoginSummaryPanel, {
  type SinceLastLoginSummaryLabels,
} from "@/components/shared/since-last-login/SinceLastLoginSummaryPanel";

type AipifyBriefingCardProps = {
  labels: Record<string, string>;
  sinceLastLoginLabels: SinceLastLoginSummaryLabels;
};

export function AipifyBriefingCard({ labels, sinceLastLoginLabels }: AipifyBriefingCardProps) {
  return (
    <div className="space-y-3">
      <SinceLastLoginSummaryPanel
        scope="customer"
        labels={sinceLastLoginLabels}
        variant="compact"
        touchLogin
      />
      <div className="flex flex-wrap gap-2 px-1">
        <Link
          href="/app/briefing/since-last-login"
          className="text-sm font-medium text-indigo-700 hover:underline"
        >
          {labels.viewFull}
        </Link>
        <Link
          href="/app/approvals"
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
        >
          {labels.openApprovals}
        </Link>
      </div>
    </div>
  );
}
