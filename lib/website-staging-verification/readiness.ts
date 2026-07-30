import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  WebsiteReleaseChainReadiness,
  WebsiteReleaseChainReadinessStatus,
} from "./types";

export type { WebsiteReleaseChainReadiness, WebsiteReleaseChainReadinessStatus };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function mapWebsiteReleaseChainReadiness(raw: unknown): WebsiteReleaseChainReadiness {
  const row = asRecord(raw);
  const status = row.status;
  const allowed: WebsiteReleaseChainReadinessStatus[] = [
    "verified",
    "code_ready",
    "running",
    "attention",
    "blocked",
  ];
  return {
    status: allowed.includes(status as WebsiteReleaseChainReadinessStatus)
      ? (status as WebsiteReleaseChainReadinessStatus)
      : "code_ready",
    lastCompletedAt: typeof row.last_completed_at === "string" ? row.last_completed_at : null,
    hasVerificationHistory: row.has_verification_history === true,
  };
}

/** Aggregate readiness only — never exposes staging org/fixture/token details. */
export async function fetchWebsiteReleaseChainReadiness(
  supabase: SupabaseClient,
): Promise<WebsiteReleaseChainReadiness> {
  const { data, error } = await supabase.rpc("get_website_release_chain_readiness");
  if (error) {
    return { status: "code_ready", lastCompletedAt: null, hasVerificationHistory: false };
  }
  return mapWebsiteReleaseChainReadiness(data);
}

export function websiteReleaseChainReadinessTone(
  status: WebsiteReleaseChainReadinessStatus,
): "info" | "warning" | "success" | "danger" | "neutral" {
  switch (status) {
    case "verified":
      return "success";
    case "running":
      return "warning";
    case "attention":
      return "warning";
    case "blocked":
      return "danger";
    default:
      return "info";
  }
}
