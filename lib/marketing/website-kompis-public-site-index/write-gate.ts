export type PublicSiteIndexEnv = Record<string, string | undefined>;

/**
 * Server-side persist gate for public site index writes.
 * Default OFF. Confirmation alone must never enable Production writes.
 * Owner must set AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true in a separately
 * approved release — this task never enables that switch.
 */
export function isPublicSiteIndexPersistEnabled(
  env: PublicSiteIndexEnv = process.env,
): boolean {
  return env.AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED === "true";
}

/**
 * Auto-refresh / scheduler registration gate. Default OFF.
 * Must stay false until a separate owner approval enables a cron/worker.
 */
export function isPublicSiteIndexAutoRefreshEnabled(
  env: PublicSiteIndexEnv = process.env,
): boolean {
  return (
    env.AIPIFY_PUBLIC_SITE_INDEX_AUTO_REFRESH_ENABLED === "true" &&
    isPublicSiteIndexPersistEnabled(env)
  );
}

export type PersistGateDecision =
  | { allowPersist: true }
  | {
      allowPersist: false;
      reason:
        | "dry_run"
        | "confirmation_required"
        | "writes_disabled"
        | "auto_refresh_disabled";
    };

/** Resolve whether this invocation may call service-role index write RPCs. */
export function resolvePublicSiteIndexPersistGate(input: {
  dryRun: boolean;
  confirmation: boolean;
  env?: PublicSiteIndexEnv;
}): PersistGateDecision {
  if (input.dryRun) {
    return { allowPersist: false, reason: "dry_run" };
  }
  if (!input.confirmation) {
    return { allowPersist: false, reason: "confirmation_required" };
  }
  if (!isPublicSiteIndexPersistEnabled(input.env)) {
    return { allowPersist: false, reason: "writes_disabled" };
  }
  return { allowPersist: true };
}
