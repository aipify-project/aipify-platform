const MODULE_AREA_LABEL_KEYS: Record<string, string> = {
  integration: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.integration",
  approval: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.approval",
  approval_delay: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.approvalDelay",
  alert: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.alerts",
  customer_risk: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.customerRisk",
  revenue_decline: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.revenue",
  security: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.security",
  compliance: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.compliance",
  billing: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.billing",
  license: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.license",
  invoice_overdue: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.billing",
  payment_failed: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.billing",
  subscription_issue: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.billing",
  integration_failure: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.integration",
  integration_disconnected: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.integration",
  integration_error: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.integration",
  data_quality: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.dataQuality",
  organizational_health: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.organizationalHealth",
  business_pack: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.businessPack",
  task: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.tasks",
  support: "customerApp.executiveCommandCenter.commandBriefOverview.moduleAreas.support",
};

function normalizeModuleKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function resolveCommandBriefModuleAreaLabelKey(moduleArea: string): string | null {
  const key = normalizeModuleKey(moduleArea);
  if (MODULE_AREA_LABEL_KEYS[key]) return MODULE_AREA_LABEL_KEYS[key];

  for (const [needle, labelKey] of Object.entries(MODULE_AREA_LABEL_KEYS)) {
    if (key.includes(needle)) return labelKey;
  }

  return null;
}
