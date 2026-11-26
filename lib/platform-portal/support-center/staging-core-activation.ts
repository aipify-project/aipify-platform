/**
 * Support Center Staging-only Core binding.
 *
 * Live read/write gates open only when the app's Supabase URL is the approved
 * Staging Core project. Production Core stays closed even if Preview deploy
 * shares the same Vercel project.
 *
 * Email send remains a separate owner gate (always off here).
 */

export const AIPIFY_CORE_STAGING_PROJECT_REF = "auedugihkduoaikfusqe" as const;
export const AIPIFY_CORE_PRODUCTION_PROJECT_REF = "qbcqoixhrvhnuwphefvw" as const;

export function resolveConfiguredSupabaseProjectRef(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): string | null {
  const raw = typeof url === "string" ? url.trim() : "";
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.toLowerCase();
    const match = host.match(/^([a-z0-9-]+)\.supabase\.co$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

/** True only when this runtime is bound to auedugihkduoaikfusqe. */
export function isSupportCenterStagingCoreBound(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return resolveConfiguredSupabaseProjectRef(url) === AIPIFY_CORE_STAGING_PROJECT_REF;
}

/**
 * Staging Core has Support Center read + platform write RPCs applied.
 * Intake write RPCs were not included in the Staging batch — stay closed.
 * Email send stays closed until a separate owner YES.
 */
export function resolveSupportCenterStagingLiveGates(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
) {
  const stagingBound = isSupportCenterStagingCoreBound(url);
  return {
    stagingBound,
    projectRef: resolveConfiguredSupabaseProjectRef(url),
    readRpcConnected: stagingBound,
    readFeatureGate: stagingBound,
    writeRpcConnected: stagingBound,
    writeFeatureGate: stagingBound,
    /** Staging batch did not ship intake create RPCs. */
    intakeRpcConnected: false,
    intakeFeatureGate: false,
    emailSendConfigured: false,
    signaturePersistConfigured: false,
    templatePersistConfigured: false,
  };
}
