import { isCoreConnectorPackageType, isCoreCustomImplementationState, isCoreProviderDistributionChannel, isCoreProviderImplementationOwner, isCoreProviderInstallTarget, isCoreProviderOnboardingMode, isCoreProviderReadinessLevel, isCoreProviderSupportLevel } from "./enums";
import { ALLOWLISTED_DOC_HOSTS, ALLOWLISTED_PACKAGE_HOSTS, validateHttpsAllowlistedUrl } from "./url-allowlist";
import type { CoreProviderOnboardingContract, CoreProviderOnboardingParseResult } from "./types";

export const CORE_PROVIDER_ONBOARDING_CONTRACT_VERSION = 1 as const;
const CREDENTIAL_TYPES = new Set(["api_key", "oauth", "bearer", "custom"]);
const SECRET_PATTERN = /(?:password|secret|access[_-]?token|api[_-]?key)\s*(?:=|:)/i;
const DOC_KEYS = ["gettingStarted", "installation", "credentialSetup", "permissions", "testing", "troubleshooting", "upgrade", "uninstall", "security", "privacy", "support"] as const;
const POLICY_KEYS = ["versionPolicy", "compatibilityPolicy", "activationPolicy", "deactivationPolicy", "uninstallPolicy", "failurePolicy", "auditPolicy"] as const;
const BOOL_KEYS = ["requiresExternalLogin", "requiresCustomerInstallation", "requiresCustomerDeveloper", "requiresAipifyApproval", "requiresProviderApproval", "supportsAutomaticProvisioning", "supportsManualProvisioning", "supportsOAuth", "supportsApiKey", "supportsConnectorPackage", "supportsHostedConnector", "supportsCustomImplementation", "supportsHealthCheck", "supportsStatusReadback", "supportsUpgrade", "supportsRollback", "supportsUninstall", "supportsRotation", "supportsRevoke", "supportsOneTimeReveal"] as const;
const ACTORS = new Set(["customer", "aipify", "provider", "partner"]);

const record = (v: unknown): Record<string, unknown> | null => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null;
const string = (v: unknown): string | null => typeof v === "string" && v.trim() ? v.trim() : null;
const strings = (v: unknown): string[] | null => Array.isArray(v) && v.every((x) => string(x)) ? v.map((x) => (x as string).trim()) : null;
const fail = (code: Exclude<CoreProviderOnboardingParseResult, { ok: true }>["code"], detail?: string): CoreProviderOnboardingParseResult => ({ ok: false, code, detail });

function containsSecret(value: unknown): boolean {
  if (typeof value === "string") return SECRET_PATTERN.test(value);
  if (Array.isArray(value)) return value.some(containsSecret);
  const row = record(value);
  return !!row && Object.entries(row).some(([key, child]) =>
    /^(?:password|secret|token|api[_-]?key|access[_-]?token)$/i.test(key) || containsSecret(child)
  );
}
function validUrl(value: unknown, hosts: readonly string[]): string | null {
  const parsed = validateHttpsAllowlistedUrl(value, hosts);
  return parsed.ok ? parsed.url : null;
}
function validPolicyUrl(value: unknown, policy: Record<string, unknown>): boolean {
  const allowedHosts = policy.allowedHosts as string[];
  const parsed = validUrl(value, allowedHosts);
  if (!parsed) return false;
  if (policy.allowSubdomains) return true;
  const host = new URL(parsed).hostname.toLowerCase();
  return allowedHosts.some((allowed) => host === allowed.toLowerCase().replace(/^\*\./, ""));
}
function parseSteps(value: unknown): { key: string; labelKey: string; actor: "customer" | "aipify" | "provider" | "partner" }[] | null {
  if (!Array.isArray(value)) return null;
  const parsed = value.map(record);
  if (parsed.some((row) => !row)) return null;
  const output = parsed.map((row) => ({ key: string(row!.key), labelKey: string(row!.labelKey), actor: row!.actor }));
  return output.every((s) => s.key && s.labelKey && ACTORS.has(s.actor as string))
    ? output as { key: string; labelKey: string; actor: "customer" | "aipify" | "provider" | "partner" }[] : null;
}
function parseResponsibilities(value: unknown): { key: string; labelKey: string }[] | null {
  if (!Array.isArray(value)) return null;
  const out = value.map(record).map((row) => ({ key: string(row?.key), labelKey: string(row?.labelKey) }));
  return out.every((item) => item.key && item.labelKey) ? out as { key: string; labelKey: string }[] : null;
}

/** Strictly parses an externally sourced provider onboarding contract. */
export function parseCoreProviderOnboardingContract(raw: unknown, opts: { expectedProviderKey?: string } = {}): CoreProviderOnboardingParseResult {
  if (raw == null) return fail("missing_contract");
  const row = record(raw);
  if (!row) return fail("malformed_contract");
  if (row.version !== CORE_PROVIDER_ONBOARDING_CONTRACT_VERSION) return fail("unsupported_version");
  const providerKey = string(row.providerKey);
  if (!providerKey) return fail("missing_provider_key");
  if (opts.expectedProviderKey && providerKey !== opts.expectedProviderKey) return fail("provider_mismatch");
  if (containsSecret(row)) return fail("secret_detected");

  if (!isCoreProviderOnboardingMode(row.onboardingMode) || !isCoreProviderImplementationOwner(row.implementationOwner) ||
      !isCoreProviderDistributionChannel(row.distributionChannel) || !isCoreProviderInstallTarget(row.installTarget) ||
      !isCoreProviderSupportLevel(row.supportLevel) || !isCoreProviderReadinessLevel(row.readinessLevel) ||
      !CREDENTIAL_TYPES.has(row.credentialType as string)) return fail("invalid_enum");
  for (const key of BOOL_KEYS) if (typeof row[key] !== "boolean") return fail("invalid_field", key);
  const requiredStringArrays = ["requiredScopes", "optionalScopes", "requiredEnvironmentVariables", "requiredNetworkAccess", "requiredDomains", "requiredWebhookEndpoints", "requiredPermissions"];
  for (const key of requiredStringArrays) if (!strings(row[key])) return fail("invalid_field", key);
  if (!Array.isArray(row.requiredPorts) || !row.requiredPorts.every((port) => Number.isInteger(port) && port > 0 && port <= 65535)) return fail("invalid_field", "requiredPorts");
  if (![row.setupSteps, row.verificationSteps].every(parseSteps) || ![row.customerResponsibilities, row.aipifyResponsibilities, row.providerResponsibilities, row.partnerResponsibilities].every(parseResponsibilities)) return fail("invalid_field", "steps_or_responsibilities");

  const callbackPolicy = record(row.callbackPolicy), redirectPolicy = record(row.redirectPolicy);
  if (![callbackPolicy, redirectPolicy].every((policy) => Array.isArray(policy!.allowedHosts) && policy!.allowedHosts.every((host) => string(host)) && typeof policy!.allowSubdomains === "boolean")) return fail("invalid_field", "url_policy");
  for (const key of POLICY_KEYS) {
    const policy = record(row[key]);
    if (!policy || !string(policy.labelKey) || typeof policy.requiresApproval !== "boolean" || (policy.details !== undefined && !strings(policy.details))) return fail("invalid_field", key);
  }

  const docs = record(row.docs);
  if (!docs) return fail("invalid_field", "docs");
  for (const key of DOC_KEYS) {
    const link = docs[key];
    if (link === null) continue;
    const item = record(link);
    if (!item || !validUrl(item.url, ALLOWLISTED_DOC_HOSTS) || (item.locale !== undefined && !string(item.locale)) || (item.version !== undefined && !string(item.version))) return fail("invalid_url", `docs.${key}`);
  }

  const pkg = row.packageMetadata;
  if (pkg !== null) {
    const p = record(pkg);
    if (!p || !isCoreConnectorPackageType(p.packageType) || !string(p.name) || !string(p.version) || !validUrl(p.downloadUrl, ALLOWLISTED_PACKAGE_HOSTS) ||
      !["sha256", "sha384", "sha512"].includes(p.checksumAlgorithm as string) || !string(p.checksum) ||
      !["pgp", "cosign", "sigstore", "x509"].includes(p.signatureAlgorithm as string) || !string(p.signature) ||
      (p.signatureUrl !== undefined && !validUrl(p.signatureUrl, ALLOWLISTED_PACKAGE_HOSTS)) || !(p.installCommand === null || string(p.installCommand)) || !strings(p.supportedPlatforms)) return fail("invalid_package_metadata");
  }
  for (const [name, metadata, required] of [
    ["oauthMetadata", row.oauthMetadata, row.onboardingMode === "oauth"],
    ["hostedConnectorMetadata", row.hostedConnectorMetadata, row.onboardingMode === "aipify_hosted_connector"],
    ["customImplementationMetadata", row.customImplementationMetadata, row.onboardingMode === "custom_provider_implementation"],
  ] as const) if (required && !record(metadata)) return fail("mode_capability_mismatch", name);
  const oauth = row.oauthMetadata === null ? null : record(row.oauthMetadata);
  if (row.oauthMetadata !== null && !oauth) return fail("invalid_oauth_metadata");
  if (oauth && (
    !validUrl(oauth.authorizationUrl, ALLOWLISTED_DOC_HOSTS) ||
    !validUrl(oauth.tokenUrl, ALLOWLISTED_DOC_HOSTS) ||
    !Array.isArray(oauth.callbackUrls) ||
    !oauth.callbackUrls.every((url) => validPolicyUrl(url, callbackPolicy!)) ||
    typeof oauth.pkceRequired !== "boolean" ||
    typeof oauth.supportsRefreshTokens !== "boolean" ||
    (oauth.clientRegistrationUrl !== undefined && !validUrl(oauth.clientRegistrationUrl, ALLOWLISTED_DOC_HOSTS))
  )) return fail("invalid_oauth_metadata");
  const marketplace = row.marketplaceMetadata === null ? null : record(row.marketplaceMetadata);
  if (row.marketplaceMetadata !== null && !marketplace) return fail("invalid_field", "marketplaceMetadata");
  if (marketplace && (!validUrl(marketplace.listingUrl, ALLOWLISTED_DOC_HOSTS) || !string(marketplace.listingId) || !string(marketplace.publisher) || !string(marketplace.installLabelKey))) return fail("invalid_field", "marketplaceMetadata");
  const hosted = row.hostedConnectorMetadata === null ? null : record(row.hostedConnectorMetadata);
  if (row.hostedConnectorMetadata !== null && !hosted) return fail("invalid_field", "hostedConnectorMetadata");
  if (hosted && (!validUrl(hosted.serviceUrl, ALLOWLISTED_DOC_HOSTS) || !string(hosted.provisioningLabelKey) || typeof hosted.requiresCustomerConfiguration !== "boolean" || (hosted.region !== undefined && !string(hosted.region)))) return fail("invalid_field", "hostedConnectorMetadata");
  const custom = row.customImplementationMetadata === null ? null : record(row.customImplementationMetadata);
  if (row.customImplementationMetadata !== null && !custom) return fail("invalid_field", "customImplementationMetadata");
  if (custom && (!isCoreCustomImplementationState(custom.implementationState) || !validUrl(custom.specificationUrl, ALLOWLISTED_DOC_HOSTS) || !["customer_developer", "partner", "aipify_professional_services"].includes(custom.deliveryModel as string) || !strings(custom.acceptanceCriteria) || !string(custom.estimatedEffortLabelKey))) return fail("invalid_field", "customImplementationMetadata");
  const apiKey = row.apiKeyMetadata === null ? null : record(row.apiKeyMetadata);
  if (row.apiKeyMetadata !== null && !apiKey) return fail("invalid_field", "apiKeyMetadata");
  if (apiKey && (!string(apiKey.labelKey) || typeof apiKey.oneTimeReveal !== "boolean" || (apiKey.formatHint !== undefined && !string(apiKey.formatHint)) || (apiKey.rotationInstructionsUrl !== undefined && !validUrl(apiKey.rotationInstructionsUrl, ALLOWLISTED_DOC_HOSTS)))) return fail("invalid_field", "apiKeyMetadata");

  const requiredCapabilities: Partial<Record<string, boolean>> = {
    oauth: row.supportsOAuth as boolean, api_key_existing_provider: row.supportsApiKey as boolean,
    installable_connector: row.supportsConnectorPackage as boolean, aipify_hosted_connector: row.supportsHostedConnector as boolean,
    custom_provider_implementation: row.supportsCustomImplementation as boolean,
  };
  if (!requiredCapabilities[row.onboardingMode]) return fail("mode_capability_mismatch", row.onboardingMode);
  if (row.onboardingMode === "installable_connector" && pkg === null) return fail("mode_capability_mismatch", "packageMetadata");

  return { ok: true, contract: row as unknown as CoreProviderOnboardingContract };
}
