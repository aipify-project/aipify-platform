import { resolveAppHref } from "./route-aliases";

export type AppNavId =
  | "overview"
  | "briefing"
  | "executive"
  | "presence"
  | "assistant"
  | "recommendations"
  | "learning"
  | "skills"
  | "marketplace"
  | "industryBlueprints"
  | "globalLearning"
  | "evolution"
  | "valueEngine"
  | "agents"
  | "appEcosystem"
  | "trustEngine"
  | "digitalTwin"
  | "simulationLab"
  | "operationsCenter"
  | "continuityEngine"
  | "approvals"
  | "actionCenter"
  | "businessPulse"
  | "strategicGoals"
  | "frictionIntelligence"
  | "organizationalMemory"
  | "organizationalIntelligence"
  | "predictiveIntelligence"
  | "adaptiveAutomation"
  | "governance"
  | "enterprise"
  | "quality"
  | "knowledgeCenter"
  | "installations"
  | "domains"
  | "team"
  | "license"
  | "security"
  | "orchestration"
  | "settings";

export type AppNavItem = {
  id: AppNavId;
  href: string;
  labelKey: string;
};

/** Canonical Customer App 1.0 navigation (Phase 28). */
export const APP_NAV: AppNavItem[] = [
  { id: "overview", href: "/app", labelKey: "customerApp.nav.overview" },
  { id: "briefing", href: "/app/briefing", labelKey: "customerApp.nav.briefing" },
  { id: "executive", href: "/app/executive", labelKey: "customerApp.nav.executive" },
  { id: "presence", href: "/app/presence", labelKey: "customerApp.nav.presence" },
  { id: "assistant", href: "/app/assistant", labelKey: "customerApp.nav.assistant" },
  {
    id: "recommendations",
    href: "/app/recommendations",
    labelKey: "customerApp.nav.recommendations",
  },
  { id: "learning", href: "/app/learning", labelKey: "customerApp.nav.learning" },
  { id: "skills", href: "/app/skills", labelKey: "customerApp.nav.skills" },
  { id: "marketplace", href: "/app/marketplace", labelKey: "customerApp.nav.marketplace" },
  { id: "industryBlueprints", href: "/app/industry-blueprints", labelKey: "customerApp.nav.industryBlueprints" },
  { id: "globalLearning", href: "/app/global-learning", labelKey: "customerApp.nav.globalLearning" },
  { id: "evolution", href: "/app/evolution", labelKey: "customerApp.nav.evolution" },
  { id: "valueEngine", href: "/app/value", labelKey: "customerApp.nav.valueEngine" },
  { id: "agents", href: "/app/agents", labelKey: "customerApp.nav.agents" },
  { id: "appEcosystem", href: "/app/apps", labelKey: "customerApp.nav.appEcosystem" },
  { id: "trustEngine", href: "/app/trust", labelKey: "customerApp.nav.trustEngine" },
  { id: "digitalTwin", href: "/app/digital-twin", labelKey: "customerApp.nav.digitalTwin" },
  { id: "simulationLab", href: "/app/simulations", labelKey: "customerApp.nav.simulationLab" },
  { id: "operationsCenter", href: "/app/operations", labelKey: "customerApp.nav.operationsCenter" },
  { id: "continuityEngine", href: "/app/continuity", labelKey: "customerApp.nav.continuityEngine" },
  { id: "approvals", href: "/app/approvals", labelKey: "customerApp.nav.approvals" },
  { id: "actionCenter", href: "/app/action-center", labelKey: "customerApp.nav.actionCenter" },
  { id: "businessPulse", href: "/app/business-pulse", labelKey: "customerApp.nav.businessPulse" },
  { id: "strategicGoals", href: "/app/goals", labelKey: "customerApp.nav.strategicGoals" },
  { id: "frictionIntelligence", href: "/app/friction", labelKey: "customerApp.nav.frictionIntelligence" },
  { id: "organizationalMemory", href: "/app/memory", labelKey: "customerApp.nav.organizationalMemory" },
  { id: "organizationalIntelligence", href: "/app/insights", labelKey: "customerApp.nav.organizationalIntelligence" },
  { id: "predictiveIntelligence", href: "/app/predictions", labelKey: "customerApp.nav.predictiveIntelligence" },
  { id: "adaptiveAutomation", href: "/app/automations", labelKey: "customerApp.nav.adaptiveAutomation" },
  { id: "governance", href: "/app/governance", labelKey: "customerApp.nav.governance" },
  { id: "enterprise", href: "/app/enterprise", labelKey: "customerApp.nav.enterprise" },
  { id: "quality", href: "/app/quality", labelKey: "customerApp.nav.quality" },
  { id: "knowledgeCenter", href: "/app/knowledge-center", labelKey: "customerApp.nav.knowledgeCenter" },
  { id: "installations", href: "/app/installations", labelKey: "customerApp.nav.installations" },
  { id: "domains", href: "/app/domains", labelKey: "customerApp.nav.domains" },
  { id: "team", href: "/app/team", labelKey: "customerApp.nav.team" },
  { id: "license", href: "/app/license", labelKey: "customerApp.nav.license" },
  { id: "security", href: "/app/security", labelKey: "customerApp.nav.security" },
  { id: "orchestration", href: "/app/orchestration", labelKey: "customerApp.nav.orchestration" },
  { id: "settings", href: "/app/settings", labelKey: "customerApp.nav.settings" },
];

export const APP_MOBILE_NAV_IDS: AppNavId[] = [
  "overview",
  "executive",
  "presence",
  "approvals",
  "settings",
];

export function getAppActiveNavId(pathname: string): AppNavId {
  if (pathname === "/app" || pathname === "/dashboard") return "overview";
  if (pathname.startsWith("/app/executive")) return "executive";
  if (
    pathname.startsWith("/app/presence") ||
    pathname.startsWith("/app/command-center") ||
    pathname.startsWith("/app/desktop")
  ) {
    return "presence";
  }
  if (pathname.startsWith("/app/assistant")) return "assistant";
  if (pathname.startsWith("/app/recommendations")) return "recommendations";
  if (pathname.startsWith("/app/learning")) return "learning";
  if (pathname.startsWith("/app/skills")) return "skills";
  if (pathname.startsWith("/app/marketplace")) return "marketplace";
  if (pathname.startsWith("/app/industry-blueprints")) return "industryBlueprints";
  if (pathname.startsWith("/app/global-learning")) return "globalLearning";
  if (pathname.startsWith("/app/evolution")) return "evolution";
  if (pathname.startsWith("/app/value")) return "valueEngine";
  if (pathname.startsWith("/app/agents")) return "agents";
  if (pathname.startsWith("/app/apps")) return "appEcosystem";
  if (pathname.startsWith("/app/trust")) return "trustEngine";
  if (pathname.startsWith("/app/digital-twin")) return "digitalTwin";
  if (pathname.startsWith("/app/simulations")) return "simulationLab";
  if (pathname.startsWith("/app/operations")) return "operationsCenter";
  if (pathname.startsWith("/app/continuity")) return "continuityEngine";
  if (pathname.startsWith("/app/approvals")) return "approvals";
  if (pathname.startsWith("/app/action-center") || pathname.startsWith("/app/actions")) {
    return "actionCenter";
  }
  if (pathname.startsWith("/app/business-pulse") || pathname.startsWith("/dashboard/business-pulse")) {
    return "businessPulse";
  }
  if (pathname.startsWith("/app/goals") || pathname.startsWith("/dashboard/goals")) {
    return "strategicGoals";
  }
  if (pathname.startsWith("/app/friction") || pathname.startsWith("/dashboard/friction")) {
    return "frictionIntelligence";
  }
  if (
    pathname.startsWith("/app/memory") ||
    pathname.startsWith("/dashboard/memory")
  ) {
    return "organizationalMemory";
  }
  if (pathname.startsWith("/app/insights") || pathname.startsWith("/app/organization") || pathname.startsWith("/app/workflows")) {
    return "organizationalIntelligence";
  }
  if (pathname.startsWith("/app/predictions")) {
    return "predictiveIntelligence";
  }
  if (
    pathname.startsWith("/app/automations") ||
    pathname.startsWith("/app/automation-library") ||
    pathname.startsWith("/app/automation-executions")
  ) {
    return "adaptiveAutomation";
  }
  if (pathname.startsWith("/app/governance")) {
    return "governance";
  }
  if (pathname.startsWith("/app/enterprise")) {
    return "enterprise";
  }
  if (pathname.startsWith("/app/quality")) {
    return "quality";
  }
  if (pathname.startsWith("/app/knowledge-center")) {
    return "knowledgeCenter";
  }
  if (
    pathname.startsWith("/app/install") ||
    pathname.startsWith("/app/installations") ||
    pathname.startsWith("/dashboard/installs")
  ) {
    return "installations";
  }
  if (pathname.startsWith("/app/domains")) return "domains";
  if (pathname.startsWith("/app/team") || pathname.startsWith("/dashboard/team")) {
    return "team";
  }
  if (pathname.startsWith("/app/license") || pathname.startsWith("/dashboard/license")) {
    return "license";
  }
  if (pathname.startsWith("/app/security") || pathname.startsWith("/app/settings/security")) {
    return "security";
  }
  if (pathname.startsWith("/app/compliance")) {
    return "security";
  }
  if (pathname.startsWith("/app/orchestration")) {
    return "orchestration";
  }
  if (pathname.startsWith("/app/settings") || pathname.startsWith("/dashboard/settings")) {
    return "settings";
  }
  if (pathname.startsWith("/app/welcome")) return "overview";
  return "overview";
}

/** Nav items with hrefs resolved to active routes during /dashboard → /app migration. */
export function getAppNavItemsForShell(): AppNavItem[] {
  return APP_NAV.map((item) => ({
    ...item,
    href: resolveAppHref(item.href),
  }));
}
