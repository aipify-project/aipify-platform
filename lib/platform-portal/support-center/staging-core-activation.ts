/**
 * Support Center Core live binding.
 *
 * Read/write gates open when the app's Supabase URL is Production Core
 * (qbcqoixhrvhnuwphefvw) or Staging Core (auedugihkduoaikfusqe) after the
 * Support Center SQL candidates are applied.
 *
 * Intake create RPCs were not shipped in the Support Center batch — stay closed.
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

/** True when bound to Staging Core. */
export function isSupportCenterStagingCoreBound(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return resolveConfiguredSupabaseProjectRef(url) === AIPIFY_CORE_STAGING_PROJECT_REF;
}

/** True when bound to Production Core. */
export function isSupportCenterProductionCoreBound(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return resolveConfiguredSupabaseProjectRef(url) === AIPIFY_CORE_PRODUCTION_PROJECT_REF;
}

/**
 * Live Support Center Core path after owner-approved SQL apply on that Core.
 * Intake and email stay closed until separate approvals + RPCs.
 */
export function isSupportCenterCoreLiveBound(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return (
    isSupportCenterProductionCoreBound(url) || isSupportCenterStagingCoreBound(url)
  );
}

/**
 * @deprecated Prefer resolveSupportCenterLiveGates / isSupportCenterCoreLiveBound.
 * Kept for existing imports; now resolves Production + Staging Core.
 */
export function resolveSupportCenterStagingLiveGates(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
) {
  return resolveSupportCenterLiveGates(url);
}

export function resolveSupportCenterLiveGates(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
) {
  const liveBound = isSupportCenterCoreLiveBound(url);
  const stagingBound = isSupportCenterStagingCoreBound(url);
  const productionBound = isSupportCenterProductionCoreBound(url);
  return {
    stagingBound,
    productionBound,
    liveBound,
    projectRef: resolveConfiguredSupabaseProjectRef(url),
    readRpcConnected: liveBound,
    readFeatureGate: liveBound,
    writeRpcConnected: liveBound,
    writeFeatureGate: liveBound,
    /** Support Center batch did not ship intake create RPCs. */
    intakeRpcConnected: false,
    intakeFeatureGate: false,
    emailSendConfigured: false,
    signaturePersistConfigured: false,
    templatePersistConfigured: false,
  };
}
