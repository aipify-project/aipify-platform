/**
 * APP Home attention items — only real, actionable states.
 * Never invent KPIs or empty zero-rows that dominate the screen.
 */

import type { ConnectionAggregateStatus } from "@/lib/website-kompis-connection/source-inventory";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

export type FoundationAttentionItem = {
  id: string;
  titleKey: "connectionNeedsSetup" | "connectionNeedsAction" | "connectionPending";
  href: string;
};

const ACTIONABLE: ReadonlySet<ConnectionAggregateStatus> = new Set([
  "action_required",
  "pending",
  "unconfigured",
  "error",
  "suspended",
]);

export function buildWebsiteKompisConnectionAttention(
  websiteKompisAvailable: boolean | null,
  aggregate: ConnectionAggregateStatus | null
): FoundationAttentionItem[] {
  if (websiteKompisAvailable !== true || !aggregate || !ACTIONABLE.has(aggregate)) {
    return [];
  }

  if (aggregate === "pending") {
    return [
      {
        id: "wk-connection-pending",
        titleKey: "connectionPending",
        href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      },
    ];
  }

  if (aggregate === "unconfigured") {
    return [
      {
        id: "wk-connection-setup",
        titleKey: "connectionNeedsSetup",
        href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      },
    ];
  }

  return [
    {
      id: "wk-connection-action",
      titleKey: "connectionNeedsAction",
      href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
    },
  ];
}

export function resolveWelcomeGreetingHour(hour: number): "morning" | "afternoon" | "evening" {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}
