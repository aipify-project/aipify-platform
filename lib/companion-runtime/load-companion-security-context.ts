import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listSecurityProviderManifests } from "@/lib/integration-intelligence/security/registry";
import type { SecurityProviderImplementationStatus } from "@/lib/integration-intelligence/security/types";
import { isSecurityBusinessPackActive } from "@/lib/integration-intelligence/security/types";
import {
  buildSecurityCapabilityRuntimeRef,
  createEmptyCompanionSecurityContext,
  type CompanionSecurityContext,
  type SecurityCommandBriefSignal,
  type SecurityProviderRuntimeStatus,
} from "./companion-security-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  if (record.has_organization === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: SecurityProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): SecurityProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    trust_center_verification_enabled: input.engineEnabled,
    identity_access_enabled: input.engineEnabled,
    security_compliance_enabled: input.engineEnabled,
    audit_accountability_enabled: input.engineEnabled,
    governance_management_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    trustCenter: boolean;
    identityAccess: boolean;
    securityCompliance: boolean;
    auditAccountability: boolean;
    governanceManagement: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "trust_center_verification":
      return flags.trustCenter;
    case "identity_access_management":
      return flags.identityAccess;
    case "security_compliance_center":
      return flags.securityCompliance;
    case "audit_accountability":
      return flags.auditAccountability;
    case "governance_management":
      return flags.governanceManagement;
    case "security_pack_adapter":
      return false;
    default:
      return false;
  }
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function extractSecurityOperationalSignals(input: {
  trustCenter: unknown;
  trustAdvisorContext: unknown;
  securityDashboard: unknown;
  complianceDashboard: unknown;
  governanceContext: unknown;
}): {
  pending_verifications_count: number | null;
  access_reviews_required_count: number | null;
  open_incidents_count: number | null;
  open_risks_count: number | null;
  secrets_expiring_count: number | null;
  compliance_attention_count: number | null;
  command_brief_signals: SecurityCommandBriefSignal[];
} {
  const trustCenter =
    input.trustCenter && typeof input.trustCenter === "object"
      ? (input.trustCenter as Record<string, unknown>)
      : {};
  const overview =
    trustCenter.overview && typeof trustCenter.overview === "object"
      ? (trustCenter.overview as Record<string, unknown>)
      : {};
  const trustAdvisor =
    input.trustAdvisorContext && typeof input.trustAdvisorContext === "object"
      ? (input.trustAdvisorContext as Record<string, unknown>)
      : {};
  const security =
    input.securityDashboard && typeof input.securityDashboard === "object"
      ? (input.securityDashboard as Record<string, unknown>)
      : {};
  const compliance =
    input.complianceDashboard && typeof input.complianceDashboard === "object"
      ? (input.complianceDashboard as Record<string, unknown>)
      : {};
  const governance =
    input.governanceContext && typeof input.governanceContext === "object"
      ? (input.governanceContext as Record<string, unknown>)
      : {};

  const pendingVerifications =
    readCount(overview.pending_verifications) ??
    readCount(trustCenter.verification_pending) ??
    readCount(trustAdvisor.trust_status);
  const accessReviewsRequired = readCount(governance.pending_approvals);
  const openIncidents = readCount(security.open_incidents);
  const openRisks = readCount(governance.open_risks);
  const secretsExpiring = readCount(security.secrets_expiring);
  const complianceAttention = readCount(compliance.privacy_pending);

  const twoFactorCenter =
    trustCenter.two_factor_center && typeof trustCenter.two_factor_center === "object"
      ? (trustCenter.two_factor_center as Record<string, unknown>)
      : {};
  const failedLogin2faIssues =
    readCount(twoFactorCenter.failed_challenges) ??
    readCount(twoFactorCenter.adoption_gap_count);

  const signals: SecurityCommandBriefSignal[] = [];
  if (pendingVerifications !== null && pendingVerifications > 0) {
    signals.push({ signal_key: "verification_pending", count: pendingVerifications });
  }
  if (accessReviewsRequired !== null && accessReviewsRequired > 0) {
    signals.push({ signal_key: "access_review_required", count: accessReviewsRequired });
  }
  if (openIncidents !== null && openIncidents > 0) {
    signals.push({ signal_key: "security_incident", count: openIncidents });
  }
  if (failedLogin2faIssues !== null && failedLogin2faIssues > 0) {
    signals.push({ signal_key: "failed_login_2fa_issue", count: failedLogin2faIssues });
  }
  if (secretsExpiring !== null && secretsExpiring > 0) {
    signals.push({ signal_key: "expiring_certificate", count: secretsExpiring });
  }
  if (complianceAttention !== null && complianceAttention > 0) {
    signals.push({ signal_key: "compliance_attention", count: complianceAttention });
  }
  if (openRisks !== null && openRisks > 0) {
    signals.push({ signal_key: "unresolved_risk_signal", count: openRisks });
    signals.push({ signal_key: "permission_anomaly", count: openRisks });
  }

  return {
    pending_verifications_count: pendingVerifications,
    access_reviews_required_count: accessReviewsRequired,
    open_incidents_count: openIncidents,
    open_risks_count: openRisks,
    secrets_expiring_count: secretsExpiring,
    compliance_attention_count: complianceAttention,
    command_brief_signals: signals,
  };
}

export async function loadCompanionSecurityContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionSecurityContext> {
  const businessPackActive = isSecurityBusinessPackActive(input.activeBusinessPacks);

  const [
    trustCenterResult,
    trustAdvisorResult,
    identityPermissionsResult,
    securityDashboardResult,
    complianceDashboardResult,
    auditDashboardResult,
    governanceCenterResult,
    governanceContextResult,
  ] = await Promise.all([
    supabase.rpc("get_organization_trust_center", { p_section: "overview" }),
    supabase.rpc("get_companion_trust_advisor_context", { p_query: null }),
    supabase.rpc("get_identity_permissions_dashboard"),
    supabase.rpc("get_security_dashboard"),
    supabase.rpc("get_compliance_dashboard"),
    supabase.rpc("get_audit_accountability_dashboard"),
    supabase.rpc("get_governance_management_center", { p_section: "overview" }),
    supabase.rpc("get_companion_governance_context"),
  ]);

  const permissionDenied = [trustCenterResult, securityDashboardResult, auditDashboardResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionSecurityContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const trustCenterEnabled = rpcEnabled(trustCenterResult.data);
  const identityAccessEnabled = rpcEnabled(identityPermissionsResult.data);
  const securityComplianceEnabled = rpcEnabled(securityDashboardResult.data);
  const auditAccountabilityEnabled = rpcEnabled(auditDashboardResult.data);
  const governanceManagementEnabled =
    rpcEnabled(governanceCenterResult.data) || rpcEnabled(governanceContextResult.data);

  const operationalSignals = extractSecurityOperationalSignals({
    trustCenter: trustCenterResult.data,
    trustAdvisorContext: trustAdvisorResult.data,
    securityDashboard: securityDashboardResult.data,
    complianceDashboard: complianceDashboardResult.data,
    governanceContext: governanceContextResult.data,
  });

  const engineFlags = {
    trustCenter: trustCenterEnabled,
    identityAccess: identityAccessEnabled,
    securityCompliance: securityComplianceEnabled,
    auditAccountability: auditAccountabilityEnabled,
    governanceManagement: governanceManagementEnabled,
  };

  const anyEngineEnabled = Object.values(engineFlags).some(Boolean);

  const providers: SecurityProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listSecurityProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: businessPackActive || anyEngineEnabled,
    });

    providerStatus.trust_center_verification_enabled =
      engineFlags.trustCenter && manifest.source_engine === "trust_center_verification";
    providerStatus.identity_access_enabled =
      engineFlags.identityAccess && manifest.source_engine === "identity_access";
    providerStatus.security_compliance_enabled =
      engineFlags.securityCompliance && manifest.source_engine === "security_compliance";
    providerStatus.audit_accountability_enabled =
      engineFlags.auditAccountability && manifest.source_engine === "audit_accountability";
    providerStatus.governance_management_enabled =
      engineFlags.governanceManagement && manifest.source_engine === "governance_management";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildSecurityCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  return createEmptyCompanionSecurityContext({
    trust_center_verification_enabled: trustCenterEnabled,
    identity_access_enabled: identityAccessEnabled,
    security_compliance_enabled: securityComplianceEnabled,
    audit_accountability_enabled: auditAccountabilityEnabled,
    governance_management_enabled: governanceManagementEnabled,
    identity_auto_approve_blocked: true,
    permanent_access_revocation_blocked: true,
    audit_log_deletion_blocked: true,
    tfa_disable_blocked: true,
    sensitive_account_change_blocked: true,
    compliance_decision_blocked: true,
    irreversible_security_action_blocked: true,
    role_based_access_active: true,
    sensitive_documents_masked: true,
    secrets_and_auth_data_filtered: true,
    least_privilege_enforced: true,
    pending_verifications_count: operationalSignals.pending_verifications_count,
    access_reviews_required_count: operationalSignals.access_reviews_required_count,
    open_incidents_count: operationalSignals.open_incidents_count,
    open_risks_count: operationalSignals.open_risks_count,
    secrets_expiring_count: operationalSignals.secrets_expiring_count,
    compliance_attention_count: operationalSignals.compliance_attention_count,
    command_brief_signals: operationalSignals.command_brief_signals,
    command_brief_events_linked:
      operationalSignals.command_brief_signals.length > 0 &&
      (businessPackActive || anyEngineEnabled),
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}
