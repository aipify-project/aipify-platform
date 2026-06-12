import type {
  AbosSuccessCriterion,
  ConnectorArchitecture,
  InstallConnection,
  IntegrationEngineCard,
  IntegrationEngineDashboard,
  IntegrationLink,
  PlatformPriority,
  TrustConnection,
} from "./types";

function parseStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? (value as string[]) : undefined;
}

function parseSuccessCriteria(value: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const c = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof c.key === "string" ? c.key : undefined,
      label: typeof c.label === "string" ? c.label : undefined,
      met: Boolean(c.met),
      note: typeof c.note === "string" ? c.note : null,
    };
  });
}

function parsePlatformPriorities(value: unknown): PlatformPriority[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const p = (item ?? {}) as Record<string, unknown>;
    return {
      category: typeof p.category === "string" ? p.category : undefined,
      label: typeof p.label === "string" ? p.label : undefined,
      integrations: Array.isArray(p.integrations) ? (p.integrations as string[]) : undefined,
      status: typeof p.status === "string" ? p.status : undefined,
    };
  });
}

function parseInstallConnection(value: unknown): InstallConnection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const i = value as Record<string, unknown>;
  return {
    capabilities: parseStringArray(i.capabilities),
    install_engine_route: typeof i.install_engine_route === "string" ? i.install_engine_route : undefined,
    install_wizard_route: typeof i.install_wizard_route === "string" ? i.install_wizard_route : undefined,
  };
}

function parseTrustConnection(value: unknown): TrustConnection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const t = value as Record<string, unknown>;
  return {
    principle: typeof t.principle === "string" ? t.principle : undefined,
    organizations_should_understand: parseStringArray(t.organizations_should_understand),
    disable_path: typeof t.disable_path === "string" ? t.disable_path : undefined,
  };
}

function parseConnectorArchitecture(value: unknown): ConnectorArchitecture | undefined {
  if (!value || typeof value !== "object") return undefined;
  const c = value as Record<string, unknown>;
  return {
    note: typeof c.note === "string" ? c.note : undefined,
    modules: parseStringArray(c.modules),
  };
}

function parseIntegrationLinks(value: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const l = (item ?? {}) as Record<string, unknown>;
    return {
      label: typeof l.label === "string" ? l.label : undefined,
      route: typeof l.route === "string" ? l.route : undefined,
    };
  });
}

export function parseIntegrationEngineCard(data: unknown): IntegrationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_integrations: Number(d.active_integrations ?? 0),
    failed_integrations: Number(d.failed_integrations ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    integration_engine_note:
      typeof d.integration_engine_note === "string" ? d.integration_engine_note : undefined,
  };
}

export function parseIntegrationEngineDashboard(data: unknown): IntegrationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    integration_engine_note:
      typeof d.integration_engine_note === "string" ? d.integration_engine_note : undefined,
    integration_principles: parseStringArray(d.integration_principles),
    platform_priorities: parsePlatformPriorities(d.platform_priorities),
    install_connection: parseInstallConnection(d.install_connection),
    permission_requirements: parseStringArray(d.permission_requirements),
    audit_requirements: parseStringArray(d.audit_requirements),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_connection: parseTrustConnection(d.trust_connection),
    connector_architecture: parseConnectorArchitecture(d.connector_architecture),
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as IntegrationEngineDashboard["dogfooding"])
        : undefined,
    success_criteria: parseSuccessCriteria(d.success_criteria),
    integration_links: parseIntegrationLinks(d.integration_links),
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: parseStringArray(d.principles),
    connected_integrations: Array.isArray(d.connected_integrations)
      ? (d.connected_integrations as IntegrationEngineDashboard["connected_integrations"])
      : [],
    catalog: Array.isArray(d.catalog) ? (d.catalog as IntegrationEngineDashboard["catalog"]) : [],
    recent_failures: Array.isArray(d.recent_failures)
      ? (d.recent_failures as IntegrationEngineDashboard["recent_failures"])
      : [],
    recent_webhooks: Array.isArray(d.recent_webhooks)
      ? (d.recent_webhooks as IntegrationEngineDashboard["recent_webhooks"])
      : [],
    pending_actions: Array.isArray(d.pending_actions)
      ? (d.pending_actions as IntegrationEngineDashboard["pending_actions"])
      : [],
    health_summary:
      typeof d.health_summary === "object" && d.health_summary
        ? (d.health_summary as IntegrationEngineDashboard["health_summary"])
        : undefined,
    unonight_pilot:
      typeof d.unonight_pilot === "object" && d.unonight_pilot
        ? (d.unonight_pilot as IntegrationEngineDashboard["unonight_pilot"])
        : undefined,
  };
}
