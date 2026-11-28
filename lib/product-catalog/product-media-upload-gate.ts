/**
 * Fail-closed Product Center media upload activation.
 * Production upload stays closed until a separate exact owner YES sets the gate.
 */

export type ProductMediaUploadGate = {
  uploadEnabled: boolean;
  reason:
    | "enabled_staging"
    | "production_closed"
    | "activation_required"
    | "explicitly_disabled";
  environment: string;
};

function readEnv(name: string): string {
  return (process.env[name] ?? "").trim().toLowerCase();
}

/**
 * Upload is enabled only when ALL hold:
 * - PRODUCT_MEDIA_UPLOAD_ACTIVATION=staging
 * - VERCEL_ENV is not "production"
 * - AIPIFY_CORE_ENV is not "production" (when set)
 */
export function resolveProductMediaUploadGate(
  env: Record<string, string | undefined> = process.env,
): ProductMediaUploadGate {
  const activation = (env.PRODUCT_MEDIA_UPLOAD_ACTIVATION ?? "").trim().toLowerCase();
  const vercelEnv = (env.VERCEL_ENV ?? env.NODE_ENV ?? "development").trim().toLowerCase();
  const coreEnv = (env.AIPIFY_CORE_ENV ?? "").trim().toLowerCase();
  const environment = coreEnv || vercelEnv;

  if (vercelEnv === "production" || coreEnv === "production") {
    return {
      uploadEnabled: false,
      reason: "production_closed",
      environment,
    };
  }
  if (activation === "disabled" || activation === "false" || activation === "0") {
    return {
      uploadEnabled: false,
      reason: "explicitly_disabled",
      environment,
    };
  }
  if (activation === "staging") {
    return {
      uploadEnabled: true,
      reason: "enabled_staging",
      environment,
    };
  }
  return {
    uploadEnabled: false,
    reason: "activation_required",
    environment,
  };
}

export function isProductMediaUploadEnabled(): boolean {
  return resolveProductMediaUploadGate().uploadEnabled;
}

/** Production activation plan — not executable from this module. */
export const PRODUCT_MEDIA_PRODUCTION_UPLOAD_ACTIVATION_PLAN = {
  requiresExactOwnerYes: true,
  prerequisite: "Staging synthetic upload/commit verified with authorized session",
  envFlag: "PRODUCT_MEDIA_UPLOAD_ACTIVATION=production — forbidden until separate YES; prefer staging-only flag + Production YES doc",
  failClosedDefault: true,
  registersVia: "csp_set_product_media_paths",
  noServiceRoleClientUpload: true,
  noAutoDelete: true,
} as const;

export function readProductMediaUploadEnvHint(): string {
  return readEnv("PRODUCT_MEDIA_UPLOAD_ACTIVATION") || "(unset)";
}
