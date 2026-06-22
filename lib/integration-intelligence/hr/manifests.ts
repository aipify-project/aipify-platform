import type { HrProviderManifest } from "./types";

const HR_PACK = "hr_pack";
const EMPLOYEES_VIEW = "employees.view";
const EMPLOYEES_MANAGE = "employees.manage";
const PEOPLE_VIEW = "people.view";
const PEOPLE_MANAGE = "people.manage";

function readCapability(
  capability_key: HrProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = EMPLOYEES_VIEW,
  privacy_sensitive = false,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive,
  };
}

function writeCapability(
  capability_key: HrProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = EMPLOYEES_MANAGE,
) {
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: true,
    risk_level: 2 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: false,
  };
}

/** HR / People Operations Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const HR_PROVIDER_MANIFESTS: readonly HrProviderManifest[] = [
  {
    provider_key: "workforce_employee_directory",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hr.providers.workforce_employee_directory",
    source_engine: "employee_management",
    implementation_status: "partial",
    business_pack_key: HR_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_employee_directory",
    capabilities: [
      readCapability("employee.read", "employee", EMPLOYEES_VIEW, true),
      readCapability("department.read", "department"),
      readCapability("role.read", "role"),
    ],
  },
  {
    provider_key: "workforce_team",
    display_name_key: "customerApp.companionPlatformKnowledge.hr.providers.workforce_team",
    source_engine: "team_center",
    implementation_status: "partial",
    business_pack_key: HR_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_team",
    capabilities: [readCapability("team.read", "team", null)],
  },
  {
    provider_key: "workforce_lifecycle",
    display_name_key: "customerApp.companionPlatformKnowledge.hr.providers.workforce_lifecycle",
    source_engine: "employee_lifecycle",
    implementation_status: "partial",
    business_pack_key: HR_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_lifecycle",
    capabilities: [
      readCapability("onboarding.read", "onboarding"),
      readCapability("employee.read", "employee_status", EMPLOYEES_VIEW, true),
      writeCapability("onboarding.create", "onboarding", EMPLOYEES_MANAGE),
    ],
  },
  {
    provider_key: "workforce_people_operations",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hr.providers.workforce_people_operations",
    source_engine: "people_operations",
    implementation_status: "partial",
    business_pack_key: HR_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_people_operations",
    capabilities: [
      readCapability("training.read", "training", PEOPLE_VIEW),
      readCapability("certification.read", "certification", PEOPLE_VIEW),
      readCapability("performance.read", "performance", PEOPLE_VIEW),
      writeCapability("task.assign", "task", PEOPLE_MANAGE),
      writeCapability("employee.update", "employee", EMPLOYEES_MANAGE),
    ],
  },
  {
    provider_key: "workforce_scheduling_hr",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hr.providers.workforce_scheduling_hr",
    source_engine: "workforce_scheduling",
    implementation_status: "partial",
    business_pack_key: HR_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_scheduling_hr",
    capabilities: [readCapability("schedule.read", "schedule", PEOPLE_VIEW)],
  },
  {
    provider_key: "workforce_absence_hr",
    display_name_key: "customerApp.companionPlatformKnowledge.hr.providers.workforce_absence_hr",
    source_engine: "absence_coverage",
    implementation_status: "partial",
    business_pack_key: HR_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_absence_hr",
    capabilities: [readCapability("absence.read", "absence", PEOPLE_VIEW, true)],
  },
  {
    provider_key: "workforce_knowledge",
    display_name_key: "customerApp.companionPlatformKnowledge.hr.providers.workforce_knowledge",
    source_engine: "employee_knowledge",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key: "customerApp.companionPlatformKnowledge.hr.searchTerms.workforce_knowledge",
    capabilities: [readCapability("training.read", "knowledge", null)],
  },
  {
    provider_key: "hr_pack_adapter",
    display_name_key: "customerApp.companionPlatformKnowledge.hr.providers.hr_pack_adapter",
    source_engine: "hr_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key: "customerApp.companionPlatformKnowledge.hr.searchTerms.hr_pack_adapter",
    capabilities: [
      readCapability("employee.read", "employee", EMPLOYEES_VIEW, true),
      readCapability("onboarding.read", "onboarding"),
    ],
  },
];
