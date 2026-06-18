import type { Translator } from "@/lib/i18n/translate";

export function buildBuildGovernanceLabels(t: Translator) {
  const p = "platform.buildGovernance";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    back: t(`${p}.back`),
    loading: t(`${p}.loading`),
    emptyState: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    runScan: t(`${p}.runScan`),
    registryTitle: t(`${p}.registryTitle`),
    registrySubtitle: t(`${p}.registrySubtitle`),
    openRegistry: t(`${p}.openRegistry`),
    health: {
      buildStatus: t(`${p}.health.buildStatus`),
      typecheckStatus: t(`${p}.health.typecheckStatus`),
      routeValidation: t(`${p}.health.routeValidation`),
      duplicateRouteCheck: t(`${p}.health.duplicateRouteCheck`),
      routeCount: t(`${p}.health.routeCount`),
      apiRouteCount: t(`${p}.health.apiRouteCount`),
      dynamicRouteCount: t(`${p}.health.dynamicRouteCount`),
      buildDuration: t(`${p}.health.buildDuration`),
      lastDeployment: t(`${p}.health.lastDeployment`),
      warnings: t(`${p}.health.warnings`),
      criticalIssues: t(`${p}.health.criticalIssues`),
      pass: t(`${p}.health.pass`),
      fail: t(`${p}.health.fail`),
      warn: t(`${p}.health.warn`),
      unknown: t(`${p}.health.unknown`),
    },
    stats: {
      total: t(`${p}.stats.total`),
      api: t(`${p}.stats.api`),
      marketing: t(`${p}.stats.marketing`),
      customer: t(`${p}.stats.customer`),
      platform: t(`${p}.stats.platform`),
      super: t(`${p}.stats.super`),
      businessPacks: t(`${p}.stats.businessPacks`),
      trend: t(`${p}.stats.trend`),
    },
    registry: {
      route: t(`${p}.registry.route`),
      owner: t(`${p}.registry.owner`),
      module: t(`${p}.registry.module`),
      modified: t(`${p}.registry.modified`),
      status: t(`${p}.registry.status`),
      category: t(`${p}.registry.category`),
      filterAll: t(`${p}.registry.filterAll`),
    },
    categories: {
      customer_app: t(`${p}.categories.customerApp`),
      platform_admin: t(`${p}.categories.platformAdmin`),
      super_admin: t(`${p}.categories.superAdmin`),
      api: t(`${p}.categories.api`),
      marketing: t(`${p}.categories.marketing`),
      business_packs: t(`${p}.categories.businessPacks`),
      other: t(`${p}.categories.other`),
    },
  };
}

export type BuildGovernanceLabels = ReturnType<typeof buildBuildGovernanceLabels>;
