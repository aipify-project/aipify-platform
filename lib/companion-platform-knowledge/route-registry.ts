import { COMPANION_EXPERIENCE_ROUTE } from "@/lib/app/companion";
import { APP_PORTAL_NAV, APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import type { UserRole } from "@/lib/tenant/types";
import type { PlatformKnowledgeCategory, PlatformRouteEntry } from "./types";

const ROUTE_DESCRIPTIONS: Record<string, string> = {
  appDashboard: "customerApp.companionPlatformKnowledge.routes.appDashboard.description",
  sinceLastLogin: "customerApp.companionPlatformKnowledge.routes.sinceLastLogin.description",
  appNotifications: "customerApp.companionPlatformKnowledge.routes.appNotifications.description",
  teamMembers: "customerApp.companionPlatformKnowledge.routes.teamMembers.description",
  rolesPermissions: "customerApp.companionPlatformKnowledge.routes.rolesPermissions.description",
  subscription: "customerApp.companionPlatformKnowledge.routes.subscription.description",
  paymentHistory: "customerApp.companionPlatformKnowledge.routes.paymentHistory.description",
  invoices: "customerApp.companionPlatformKnowledge.routes.invoices.description",
  upgradeOptions: "customerApp.companionPlatformKnowledge.routes.upgradeOptions.description",
  knowledgeCenter: "customerApp.companionPlatformKnowledge.routes.knowledgeCenter.description",
  contactSupport: "customerApp.companionPlatformKnowledge.routes.contactSupport.description",
  supportRequests: "customerApp.companionPlatformKnowledge.routes.supportRequests.description",
  accountSecurity: "customerApp.companionPlatformKnowledge.routes.accountSecurity.description",
  preferences: "customerApp.companionPlatformKnowledge.routes.preferences.description",
  integrations: "customerApp.companionPlatformKnowledge.routes.integrations.description",
  connectIntegration: "customerApp.companionPlatformKnowledge.routes.connectIntegration.description",
  connectedIntegrations: "customerApp.companionPlatformKnowledge.routes.connectedIntegrations.description",
  apiAccess: "customerApp.companionPlatformKnowledge.routes.apiAccess.description",
  aipifyCompanion: "customerApp.companionPlatformKnowledge.routes.aipifyCompanion.description",
  commandBrief: "customerApp.companionPlatformKnowledge.routes.commandBrief.description",
  installedBusinessPacks: "customerApp.companionPlatformKnowledge.routes.installedBusinessPacks.description",
  availableBusinessPacks: "customerApp.companionPlatformKnowledge.routes.availableBusinessPacks.description",
  activityOverview: "customerApp.companionPlatformKnowledge.routes.activityOverview.description",
};

const NAV_GROUP_CATEGORY: Record<string, PlatformKnowledgeCategory> = {
  home: "navigation",
  organization: "organization",
  businessPacks: "business_packs",
  operations: "navigation",
  intelligence: "companion",
  billing: "billing",
  support: "support",
  account: "account",
  appPlatform: "integrations",
};

const BILLING_ROLES: UserRole[] = ["owner", "admin"];
const TEAM_ADMIN_ROLES: UserRole[] = ["owner", "admin"];

function categoryForNavId(navId: string, groupId: string): PlatformKnowledgeCategory {
  if (navId === "accountSecurity") return "security";
  if (navId === "rolesPermissions") return "organization";
  return NAV_GROUP_CATEGORY[groupId] ?? "navigation";
}

function rolesForNavId(navId: string): UserRole[] | undefined {
  if (["subscription", "paymentHistory", "invoices", "upgradeOptions"].includes(navId)) {
    return BILLING_ROLES;
  }
  if (["teamMembers", "rolesPermissions"].includes(navId)) {
    return TEAM_ADMIN_ROLES;
  }
  return undefined;
}

/** Canonical APP route registry derived from nav-config plus companion routes. */
export function buildPlatformRouteRegistry(): PlatformRouteEntry[] {
  const entries: PlatformRouteEntry[] = [];

  for (const group of APP_PORTAL_NAV_GROUPS) {
    for (const item of group.items) {
      entries.push({
        routeKey: item.id,
        href: item.href,
        titleKey: item.labelKey,
        descriptionKey: ROUTE_DESCRIPTIONS[item.id] ?? item.labelKey,
        category: categoryForNavId(item.id, group.id),
        featureKey: item.featureKey,
        requiredRoles: rolesForNavId(item.id),
        navId: item.id,
      });
    }
  }

  return entries;
}

export const PLATFORM_ROUTE_REGISTRY: PlatformRouteEntry[] = buildPlatformRouteRegistry();

export function getPlatformRouteByKey(routeKey: string): PlatformRouteEntry | undefined {
  return PLATFORM_ROUTE_REGISTRY.find((r) => r.routeKey === routeKey);
}

export function getPlatformRouteByHref(href: string): PlatformRouteEntry | undefined {
  return PLATFORM_ROUTE_REGISTRY.find((r) => r.href === href);
}

/** Route search aliases for natural-language matching. */
export const ROUTE_SEARCH_ALIASES: Record<string, string[]> = {
  teamMembers: ["team", "employee", "ansatte", "medarbeider", "invite", "inviter"],
  rolesPermissions: ["role", "roller", "permission", "tilgang", "admin"],
  subscription: ["subscription", "abonnement", "plan", "license"],
  paymentHistory: ["receipt", "kvittering", "payment", "betaling"],
  invoices: ["invoice", "faktura", "bill"],
  upgradeOptions: ["upgrade", "oppgrader", "oppgradere"],
  accountSecurity: ["2fa", "two factor", "tofaktor", "security", "sikkerhet"],
  connectIntegration: ["shopify", "integrate", "integrasjon", "koble", "connect"],
  contactSupport: ["support", "hjelp", "contact", "kontakt"],
  knowledgeCenter: ["knowledge", "kunnskap", "faq", "help center"],
  sinceLastLogin: ["since last", "siden sist", "catch up", "oppdatering"],
  aipifyCompanion: ["companion", "aipify companion"],
  commandBrief: ["command brief", "briefing", "command center"],
  availableBusinessPacks: ["business pack", "business packs", "modul"],
  installWebApp: ["web app", "install app", "pwa", "installer"],
};

export const COMPANION_PRIMARY_ROUTE = COMPANION_EXPERIENCE_ROUTE;

export function resolveRouteKeyFromQuery(query: string): string | undefined {
  const q = query.toLowerCase();
  for (const [routeKey, aliases] of Object.entries(ROUTE_SEARCH_ALIASES)) {
    if (aliases.some((alias) => q.includes(alias))) {
      return routeKey;
    }
  }
  for (const item of APP_PORTAL_NAV) {
    const slug = item.href.split("/").pop()?.replace(/-/g, " ");
    if (slug && q.includes(slug)) return item.id;
  }
  return undefined;
}

export const PLATFORM_ROUTE_COUNT = PLATFORM_ROUTE_REGISTRY.length;
