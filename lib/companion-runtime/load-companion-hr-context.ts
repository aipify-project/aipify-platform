import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listHrProviderManifests } from "@/lib/integration-intelligence/hr/registry";
import type { HrProviderImplementationStatus } from "@/lib/integration-intelligence/hr/types";
import { isHrBusinessPackActive } from "@/lib/integration-intelligence/hr/types";
import {
  buildHrCapabilityRuntimeRef,
  createEmptyCompanionHrContext,
  type CompanionHrContext,
  type HrCommandBriefSignal,
  type HrProviderRuntimeStatus,
} from "./companion-hr-context";

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
  manifestStatus: HrProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): HrProviderRuntimeStatus {
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
    employee_management_enabled: input.engineEnabled,
    employee_lifecycle_enabled: input.engineEnabled,
    people_operations_enabled: input.engineEnabled,
    team_center_enabled: input.engineEnabled,
    workforce_scheduling_enabled: input.engineEnabled,
    absence_coverage_enabled: input.engineEnabled,
    employee_knowledge_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    employeeManagement: boolean;
    employeeLifecycle: boolean;
    peopleOperations: boolean;
    teamCenter: boolean;
    workforceScheduling: boolean;
    absenceCoverage: boolean;
    employeeKnowledge: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "workforce_employee_directory":
      return flags.employeeManagement;
    case "workforce_lifecycle":
      return flags.employeeLifecycle;
    case "workforce_people_operations":
      return flags.peopleOperations;
    case "workforce_team":
      return flags.teamCenter;
    case "workforce_scheduling_hr":
      return flags.workforceScheduling;
    case "workforce_absence_hr":
      return flags.absenceCoverage;
    case "workforce_knowledge":
      return flags.employeeKnowledge;
    case "hr_pack_adapter":
      return false;
    default:
      return false;
  }
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function extractHrOperationalSignals(input: {
  lifecycleContext: unknown;
  peopleContext: unknown;
  absenceData: unknown;
}): {
  vacation_mode_active: boolean;
  onboarding_in_progress_count: number | null;
  absence_attention_count: number | null;
  expiring_certifications_count: number | null;
  pending_tasks_count: number | null;
  command_brief_signals: HrCommandBriefSignal[];
} {
  const lifecycle =
    input.lifecycleContext && typeof input.lifecycleContext === "object"
      ? (input.lifecycleContext as Record<string, unknown>)
      : {};
  const people =
    input.peopleContext && typeof input.peopleContext === "object"
      ? (input.peopleContext as Record<string, unknown>)
      : {};
  const absence =
    input.absenceData && typeof input.absenceData === "object"
      ? (input.absenceData as Record<string, unknown>)
      : {};
  const absenceSettings =
    absence.settings && typeof absence.settings === "object"
      ? (absence.settings as Record<string, unknown>)
      : {};

  const onboardingInProgress = readCount(lifecycle.onboarding_in_progress);
  const trainingPending = readCount(lifecycle.training_pending);
  const pendingInvitations = readCount(lifecycle.pending_invitations);
  const upcomingReviews = readCount(people.upcoming_reviews);
  const expiringCertifications = Array.isArray(people.expiring_certifications)
    ? people.expiring_certifications.length
    : null;
  const leaveNextWeek = Array.isArray(people.leave_next_week) ? people.leave_next_week.length : null;

  const signals: HrCommandBriefSignal[] = [];
  if (onboardingInProgress !== null && onboardingInProgress > 0) {
    signals.push({ signal_key: "onboarding_in_progress", count: onboardingInProgress });
  }
  if (leaveNextWeek !== null && leaveNextWeek > 0) {
    signals.push({ signal_key: "absence_upcoming", count: leaveNextWeek });
  }
  if (expiringCertifications !== null && expiringCertifications > 0) {
    signals.push({ signal_key: "expiring_certifications", count: expiringCertifications });
  }
  if (trainingPending !== null && trainingPending > 0) {
    signals.push({ signal_key: "training_pending", count: trainingPending });
  }
  if (pendingInvitations !== null && pendingInvitations > 0) {
    signals.push({ signal_key: "pending_invitations", count: pendingInvitations });
  }
  if (upcomingReviews !== null && upcomingReviews > 0) {
    signals.push({ signal_key: "performance_reviews", count: upcomingReviews });
  }

  return {
    vacation_mode_active:
      absenceSettings.vacation_revenue_mode_enabled === true ||
      absenceSettings.vacation_mode_enabled === true,
    onboarding_in_progress_count: onboardingInProgress,
    absence_attention_count: leaveNextWeek,
    expiring_certifications_count: expiringCertifications,
    pending_tasks_count: trainingPending,
    command_brief_signals: signals,
  };
}

export async function loadCompanionHrContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionHrContext> {
  const businessPackActive = isHrBusinessPackActive(input.activeBusinessPacks);

  const [
    employeeManagementResult,
    employeeLifecycleResult,
    peopleOperationsResult,
    teamCenterResult,
    schedulingResult,
    absenceResult,
    employeeKnowledgeResult,
    lifecycleCompanionResult,
    peopleCompanionResult,
  ] = await Promise.all([
    supabase.rpc("get_employee_management_center"),
    supabase.rpc("get_employee_lifecycle_center", { p_section: null }),
    supabase.rpc("get_people_operations_center", { p_section: null }),
    supabase.rpc("get_customer_team_center"),
    supabase.rpc("get_organization_workforce_scheduling_center", { p_section: "overview" }),
    supabase.rpc("get_organization_absence_center", { p_section: "overview" }),
    supabase.rpc("get_customer_employee_knowledge_center"),
    supabase.rpc("get_companion_employee_lifecycle_context"),
    supabase.rpc("get_companion_people_operations_context"),
  ]);

  const permissionDenied = [
    employeeManagementResult,
    employeeLifecycleResult,
    peopleOperationsResult,
  ].some((result) => result.error && isPermissionDeniedMessage(result.error.message));

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionHrContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const employeeManagementEnabled = rpcEnabled(employeeManagementResult.data);
  const employeeLifecycleEnabled = rpcEnabled(employeeLifecycleResult.data);
  const peopleOperationsEnabled = rpcEnabled(peopleOperationsResult.data);
  const teamCenterEnabled = rpcEnabled(teamCenterResult.data);
  const workforceSchedulingEnabled = rpcEnabled(schedulingResult.data);
  const absenceCoverageEnabled = rpcEnabled(absenceResult.data);
  const employeeKnowledgeEnabled = rpcEnabled(employeeKnowledgeResult.data);

  const operationalSignals = extractHrOperationalSignals({
    lifecycleContext: lifecycleCompanionResult.data,
    peopleContext: peopleCompanionResult.data,
    absenceData: absenceResult.data,
  });

  const engineFlags = {
    employeeManagement: employeeManagementEnabled,
    employeeLifecycle: employeeLifecycleEnabled,
    peopleOperations: peopleOperationsEnabled,
    teamCenter: teamCenterEnabled,
    workforceScheduling: workforceSchedulingEnabled,
    absenceCoverage: absenceCoverageEnabled,
    employeeKnowledge: employeeKnowledgeEnabled,
  };

  const anyEngineEnabled = Object.values(engineFlags).some(Boolean);

  const providers: HrProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listHrProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: businessPackActive || anyEngineEnabled,
    });

    providerStatus.employee_management_enabled =
      engineFlags.employeeManagement && manifest.source_engine === "employee_management";
    providerStatus.employee_lifecycle_enabled =
      engineFlags.employeeLifecycle && manifest.source_engine === "employee_lifecycle";
    providerStatus.people_operations_enabled =
      engineFlags.peopleOperations && manifest.source_engine === "people_operations";
    providerStatus.team_center_enabled =
      engineFlags.teamCenter && manifest.source_engine === "team_center";
    providerStatus.workforce_scheduling_enabled =
      engineFlags.workforceScheduling && manifest.source_engine === "workforce_scheduling";
    providerStatus.absence_coverage_enabled =
      engineFlags.absenceCoverage && manifest.source_engine === "absence_coverage";
    providerStatus.employee_knowledge_enabled =
      engineFlags.employeeKnowledge && manifest.source_engine === "employee_knowledge";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildHrCapabilityRuntimeRef({
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

  return createEmptyCompanionHrContext({
    employee_management_enabled: employeeManagementEnabled,
    employee_lifecycle_enabled: employeeLifecycleEnabled,
    people_operations_enabled: peopleOperationsEnabled,
    team_center_enabled: teamCenterEnabled,
    workforce_scheduling_enabled: workforceSchedulingEnabled,
    absence_coverage_enabled: absenceCoverageEnabled,
    employee_knowledge_enabled: employeeKnowledgeEnabled,
    human_oversight_required: true,
    salary_change_blocked: true,
    termination_blocked: true,
    health_data_blocked: true,
    legal_decision_blocked: true,
    irreversible_access_change_blocked: true,
    role_filter_active: true,
    department_scope_active: true,
    least_privilege_enforced: true,
    vacation_mode_active: operationalSignals.vacation_mode_active,
    onboarding_in_progress_count: operationalSignals.onboarding_in_progress_count,
    absence_attention_count: operationalSignals.absence_attention_count,
    expiring_certifications_count: operationalSignals.expiring_certifications_count,
    pending_tasks_count: operationalSignals.pending_tasks_count,
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
