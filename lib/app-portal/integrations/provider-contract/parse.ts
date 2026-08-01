import { validateProviderAdminDestination } from "./destination";
import {
  CORE_APP_INTEGRATION_PROVIDER_CONTRACT_VERSION,
  type CoreAppIntegrationCredentialType,
  type CoreAppIntegrationHelpSection,
  type CoreAppIntegrationProviderCapabilities,
  type CoreAppIntegrationProviderContract,
  type CoreAppIntegrationProviderContractParseResult,
  type CoreAppIntegrationSetupStep,
  type CoreAppIntegrationSetupStepActionType,
  type CoreAppIntegrationStatusPresentation,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((s) => s.trim());
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

const ACTION_TYPES = new Set<CoreAppIntegrationSetupStepActionType>([
  "open_admin",
  "external_login",
  "navigate",
  "create_credential",
  "confirm_scopes",
  "copy_credential",
  "return_to_app",
  "save_credential",
  "test_connection",
  "info",
]);

const CREDENTIAL_TYPES = new Set<CoreAppIntegrationCredentialType>([
  "api_key",
  "oauth",
  "bearer",
  "custom",
]);

function parseCapabilities(raw: unknown): CoreAppIntegrationProviderCapabilities {
  const row = asRecord(raw) ?? {};
  return {
    canIssueCredential: asBool(row.canIssueCredential, true),
    supportsOneTimeReveal: asBool(row.supportsOneTimeReveal, true),
    supportsRotation: asBool(row.supportsRotation, true),
    supportsRevoke: asBool(row.supportsRevoke, true),
    supportsReturnToApp: asBool(row.supportsReturnToApp, true),
    supportsServerExchange: asBool(row.supportsServerExchange, false),
    requiresManualCopyPaste: asBool(row.requiresManualCopyPaste, true),
    supportsConnectionTest: asBool(row.supportsConnectionTest, true),
    requiresScopeReview: asBool(row.requiresScopeReview, true),
    requiresExternalLogin: asBool(row.requiresExternalLogin, false),
    collectsBaseUrl: asBool(row.collectsBaseUrl, false),
    collectsConnectionName: asBool(row.collectsConnectionName, false),
  };
}

function parseSetupSteps(raw: unknown, capabilities: CoreAppIntegrationProviderCapabilities): CoreAppIntegrationSetupStep[] {
  if (!Array.isArray(raw)) return [];
  const steps: CoreAppIntegrationSetupStep[] = [];
  for (const item of raw) {
    const row = asRecord(item);
    if (!row) continue;
    const key = asString(row.key);
    const actionType = asString(row.actionType) as CoreAppIntegrationSetupStepActionType;
    if (!key || !ACTION_TYPES.has(actionType)) continue;

    const requiresExternalLogin =
      typeof row.requiresExternalLogin === "boolean"
        ? row.requiresExternalLogin
        : actionType === "external_login";

    // Skip login steps unless the contract capability requires them.
    if ((actionType === "external_login" || requiresExternalLogin) && !capabilities.requiresExternalLogin) {
      continue;
    }

    steps.push({
      key,
      actionType,
      requiresExternalLogin: Boolean(requiresExternalLogin && capabilities.requiresExternalLogin),
      labelKey: asString(row.labelKey) || undefined,
      labelParams: asRecord(row.labelParams)
        ? Object.fromEntries(
            Object.entries(asRecord(row.labelParams)!).filter(
              (entry): entry is [string, string] => typeof entry[1] === "string"
            )
          )
        : undefined,
    });
  }
  return steps;
}

function parseHelpSections(raw: unknown): CoreAppIntegrationHelpSection[] {
  if (!Array.isArray(raw)) return [];
  const sections: CoreAppIntegrationHelpSection[] = [];
  for (const item of raw) {
    const row = asRecord(item);
    if (!row) continue;
    const key = asString(row.key);
    const body = asString(row.body);
    if (!key || !body) continue;
    const titleKey = asString(row.titleKey);
    sections.push({
      key,
      body,
      ...(titleKey ? { titleKey } : {}),
    });
  }
  return sections;
}

function parseStatusPresentation(raw: unknown): CoreAppIntegrationStatusPresentation {
  const row = asRecord(raw) ?? {};
  return {
    pending: asString(row.pending, "Pending"),
    connected: asString(row.connected, "Connected"),
    failed: asString(row.failed, "Failed"),
    rotationRequired: asString(row.rotationRequired, "Rotation required"),
    active: asString(row.active, "Active"),
    inactive: asString(row.inactive, "Inactive"),
  };
}

function parseStringMap(raw: unknown): Record<string, string> {
  const row = asRecord(raw);
  if (!row) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim();
    }
  }
  return out;
}

/**
 * Parse and validate a Core APP provider presentation contract.
 * Fail-closed on critical fields — never falls back to a hardcoded provider.
 */
export function parseCoreAppIntegrationProviderContract(
  raw: unknown,
  expectedProviderKey?: string
): CoreAppIntegrationProviderContractParseResult {
  if (raw == null) {
    return { ok: false, code: "missing_contract" };
  }

  const row = asRecord(raw);
  if (!row) {
    return { ok: false, code: "malformed_contract" };
  }

  const version = Number(row.version);
  if (version !== CORE_APP_INTEGRATION_PROVIDER_CONTRACT_VERSION) {
    return { ok: false, code: "unsupported_version", detail: String(row.version) };
  }

  const providerKey = asString(row.providerKey ?? row.provider_key);
  if (!providerKey) {
    return { ok: false, code: "missing_provider_key" };
  }
  if (expectedProviderKey && providerKey !== expectedProviderKey) {
    return { ok: false, code: "provider_mismatch", detail: providerKey };
  }

  const displayName = asString(row.displayName ?? row.display_name);
  if (!displayName) {
    return { ok: false, code: "missing_display_name" };
  }

  const credentialType = asString(row.credentialType ?? row.credential_type) as CoreAppIntegrationCredentialType;
  if (!CREDENTIAL_TYPES.has(credentialType)) {
    return { ok: false, code: "missing_credential_type" };
  }

  const requiredScopes = asStringArray(row.requiredScopes ?? row.required_scopes);
  if (requiredScopes.length === 0) {
    return { ok: false, code: "missing_required_scopes" };
  }

  const allowedAdminHosts = asStringArray(row.allowedAdminHosts ?? row.allowed_admin_hosts);
  const destination = validateProviderAdminDestination({
    adminIntegrationUrl: asString(row.adminIntegrationUrl ?? row.admin_integration_url) || null,
    adminBaseUrl: asString(row.adminBaseUrl ?? row.admin_base_url) || null,
    adminIntegrationPath: asString(row.adminIntegrationPath ?? row.admin_integration_path) || null,
    allowedAdminHosts,
  });
  if (!destination.ok) {
    return { ok: false, code: destination.code };
  }

  const capabilities = parseCapabilities(row.capabilities);
  const setupSteps = parseSetupSteps(row.setupSteps ?? row.setup_steps, capabilities);

  const adminDisplayName = asString(row.adminDisplayName ?? row.admin_display_name, `${displayName} Admin`);
  const credentialDisplayName = asString(
    row.credentialDisplayName ?? row.credential_display_name,
    "connection key"
  );

  const scopeLabels = parseStringMap(row.scopeLabels ?? row.scope_labels);
  const scopeDescriptions = parseStringMap(row.scopeDescriptions ?? row.scope_descriptions);

  const returnPolicyRow = asRecord(row.returnPolicy ?? row.return_policy) ?? {};
  const testPolicyRow = asRecord(row.testPolicy ?? row.test_policy) ?? {};
  const activationPolicyRow = asRecord(row.activationPolicy ?? row.activation_policy) ?? {};
  const rotationPolicyRow = asRecord(row.rotationPolicy ?? row.rotation_policy) ?? {};
  const revokePolicyRow = asRecord(row.revokePolicy ?? row.revoke_policy) ?? {};

  const contract: CoreAppIntegrationProviderContract = {
    version: CORE_APP_INTEGRATION_PROVIDER_CONTRACT_VERSION,
    providerKey,
    displayName,
    adminDisplayName,
    credentialDisplayName,
    credentialType,
    adminBaseUrl: asString(row.adminBaseUrl ?? row.admin_base_url) || destination.url,
    adminIntegrationPath: asString(row.adminIntegrationPath ?? row.admin_integration_path) || destination.path,
    adminIntegrationUrl: destination.url,
    allowedAdminHosts,
    connectionTestLabel: asString(row.connectionTestLabel ?? row.connection_test_label, "Test connection"),
    requiredScopes,
    optionalScopes: asStringArray(row.optionalScopes ?? row.optional_scopes),
    scopeLabels,
    scopeDescriptions,
    setupSteps,
    helpSections: parseHelpSections(row.helpSections ?? row.help_sections),
    capabilities,
    returnPolicy: {
      supportsReturnToApp: asBool(returnPolicyRow.supportsReturnToApp, capabilities.supportsReturnToApp),
      allowedReturnHosts: asStringArray(returnPolicyRow.allowedReturnHosts).length
        ? asStringArray(returnPolicyRow.allowedReturnHosts)
        : ["app.aipify.ai"],
    },
    testPolicy: {
      requiredBeforeActivation: asBool(testPolicyRow.requiredBeforeActivation, true),
      supportsConnectionTest: asBool(
        testPolicyRow.supportsConnectionTest,
        capabilities.supportsConnectionTest
      ),
    },
    activationPolicy: {
      requiresVerifiedTest: asBool(activationPolicyRow.requiresVerifiedTest, true),
      requiresScopeApproval: asBool(activationPolicyRow.requiresScopeApproval, true),
    },
    rotationPolicy: {
      supportsRotation: asBool(rotationPolicyRow.supportsRotation, capabilities.supportsRotation),
      requiresNewCredential: asBool(rotationPolicyRow.requiresNewCredential, true),
    },
    revokePolicy: {
      supportsRevoke: asBool(revokePolicyRow.supportsRevoke, capabilities.supportsRevoke),
      revokeInProviderAdmin: asBool(revokePolicyRow.revokeInProviderAdmin, true),
    },
    statusPresentation: parseStatusPresentation(row.statusPresentation ?? row.status_presentation),
    externalLoginInstruction: capabilities.requiresExternalLogin
      ? asString(row.externalLoginInstruction ?? row.external_login_instruction) || null
      : null,
    adminOpenInstruction: asString(row.adminOpenInstruction ?? row.admin_open_instruction) || `Open ${adminDisplayName}`,
    localeFallback: asString(row.localeFallback ?? row.locale_fallback, "en") || "en",
  };

  return { ok: true, contract };
}

/** Resolve steps that should be shown for the current contract capabilities. */
export function resolveVisibleSetupSteps(
  contract: CoreAppIntegrationProviderContract
): CoreAppIntegrationSetupStep[] {
  return contract.setupSteps.filter((step) => {
    if (step.actionType === "external_login" || step.requiresExternalLogin) {
      return contract.capabilities.requiresExternalLogin;
    }
    if (step.actionType === "test_connection") {
      return contract.capabilities.supportsConnectionTest;
    }
    if (step.actionType === "return_to_app") {
      return contract.capabilities.supportsReturnToApp;
    }
    return true;
  });
}
