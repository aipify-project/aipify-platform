import type { UserRole } from "@/lib/tenant/types";
import type { PlatformCorpusEntry, PlatformKnowledgeAction, PlatformRouteEntry } from "./types";
import { getPlatformRouteByKey } from "./route-registry";

export type PermissionContext = {
  userRole: UserRole;
  enabledFeatures?: string[];
  planKey?: string;
};

export function canAccessRoute(route: PlatformRouteEntry, ctx: PermissionContext): boolean {
  if (route.requiredRoles && route.requiredRoles.length > 0) {
    if (!route.requiredRoles.includes(ctx.userRole)) return false;
  }
  if (route.featureKey && ctx.enabledFeatures && ctx.enabledFeatures.length > 0) {
    if (!ctx.enabledFeatures.includes(route.featureKey)) return false;
  }
  return true;
}

export function canAccessArticle(article: PlatformCorpusEntry, ctx: PermissionContext): boolean {
  if (article.requiredRoles && article.requiredRoles.length > 0) {
    if (!article.requiredRoles.includes(ctx.userRole)) return false;
  }
  return true;
}

export function filterActionsByPermission(
  actions: PlatformKnowledgeAction[],
  ctx: PermissionContext,
): PlatformKnowledgeAction[] {
  return actions.filter((action) => {
    const route = getPlatformRouteByKey(action.routeKey);
    if (!route) return true;
    return canAccessRoute(route, ctx);
  });
}

export function resolveActionLabelForRestrictedRole(
  routeKey: string,
  ctx: PermissionContext,
  restrictedLabel: string,
): string | undefined {
  const route = getPlatformRouteByKey(routeKey);
  if (!route) return undefined;
  if (canAccessRoute(route, ctx)) return undefined;
  return restrictedLabel;
}
