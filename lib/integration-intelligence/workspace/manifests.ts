import type { WorkspaceProviderManifest } from "./types";

const CALENDAR_VIEW = "calendar.view";
const CALENDAR_MANAGE = "calendar.manage";
const TASKS_VIEW = "tasks.view";
const TASKS_MANAGE = "tasks.manage";
const DOCUMENTS_VIEW = "documents.view";
const DOCUMENTS_MANAGE = "documents.manage";
const UNIVERSAL_SEARCH_VIEW = "universal_search.view";
const NOTIFICATIONS_VIEW = "notifications.view";
const NOTIFICATIONS_MANAGE = "notifications.manage";
const PRINT_VIEW = "print.view";
const PRINT_EXECUTE = "print.execute";

function readCapability(
  capability_key: WorkspaceProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null,
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
  capability_key: WorkspaceProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null,
  options?: { irreversible?: boolean; privacy_sensitive?: boolean },
) {
  const irreversible = options?.irreversible ?? false;
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: !irreversible,
    risk_level: (irreversible ? 3 : 2) as 2 | 3,
    entity,
    required_permission: permission,
    privacy_sensitive: options?.privacy_sensitive ?? false,
  };
}

/** Blueprint-derived workspace manifests — capability IDs originate here, not in Core orchestrator. */
export const WORKSPACE_PROVIDER_MANIFESTS: readonly WorkspaceProviderManifest[] = [
  {
    provider_key: "organization_calendar",
    display_name_key:
      "customerApp.companionPlatformKnowledge.workspace.providers.organization_calendar",
    source_engine: "calendar_scheduling",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.workspace.searchTerms.organization_calendar",
    capabilities: [
      readCapability("calendar.read", "calendar", CALENDAR_VIEW),
      writeCapability("calendar.event.create", "calendar", CALENDAR_MANAGE),
    ],
  },
  {
    provider_key: "context_engine_calendar",
    display_name_key:
      "customerApp.companionPlatformKnowledge.workspace.providers.context_engine_calendar",
    source_engine: "context_engine",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.workspace.searchTerms.context_engine_calendar",
    capabilities: [
      readCapability("calendar.read", "calendar", CALENDAR_VIEW, true),
      writeCapability("calendar.event.create", "calendar", CALENDAR_MANAGE),
    ],
  },
  {
    provider_key: "organization_tasks",
    display_name_key:
      "customerApp.companionPlatformKnowledge.workspace.providers.organization_tasks",
    source_engine: "task_management",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.workspace.searchTerms.organization_tasks",
    capabilities: [
      readCapability("task.read", "task", TASKS_VIEW),
      writeCapability("task.create", "task", TASKS_MANAGE),
    ],
  },
  {
    provider_key: "support_email_drafts",
    display_name_key:
      "customerApp.companionPlatformKnowledge.workspace.providers.support_email_drafts",
    source_engine: "business_dna",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.workspace.searchTerms.support_email_drafts",
    capabilities: [
      readCapability("email.read", "email", null, true),
      writeCapability("email.draft", "email", null, { privacy_sensitive: true }),
      writeCapability("email.send", "email", null, { irreversible: true, privacy_sensitive: true }),
    ],
  },
  {
    provider_key: "organization_documents",
    display_name_key:
      "customerApp.companionPlatformKnowledge.workspace.providers.organization_documents",
    source_engine: "document_knowledge",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.workspace.searchTerms.organization_documents",
    capabilities: [
      readCapability("document.read", "document", DOCUMENTS_VIEW),
      readCapability("file.search", "document", DOCUMENTS_VIEW),
      writeCapability("document.create", "document", DOCUMENTS_MANAGE),
    ],
  },
  {
    provider_key: "universal_search",
    display_name_key: "customerApp.companionPlatformKnowledge.workspace.providers.universal_search",
    source_engine: "universal_search",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.workspace.searchTerms.universal_search",
    capabilities: [readCapability("file.search", "search", UNIVERSAL_SEARCH_VIEW)],
  },
  {
    provider_key: "organization_notifications",
    display_name_key:
      "customerApp.companionPlatformKnowledge.workspace.providers.organization_notifications",
    source_engine: "notification_orchestration",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.workspace.searchTerms.organization_notifications",
    capabilities: [
      readCapability("notification.read", "notification", NOTIFICATIONS_VIEW),
      writeCapability("notification.send", "notification", NOTIFICATIONS_MANAGE),
    ],
  },
  {
    provider_key: "print_output",
    display_name_key: "customerApp.companionPlatformKnowledge.workspace.providers.print_output",
    source_engine: "print_output",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.workspace.searchTerms.print_output",
    capabilities: [
      readCapability("document.read", "print", PRINT_VIEW),
      writeCapability("print.execute", "print", PRINT_EXECUTE),
    ],
  },
];
