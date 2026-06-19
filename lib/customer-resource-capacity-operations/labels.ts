import type { Translator } from "@/lib/i18n/translate";
import type { ResourceCapacityLabels, ResourceCapacityTab } from "./types";
import { RESOURCE_CAPACITY_TABS } from "./constants";

export function buildResourceCapacityLabels(t: Translator): ResourceCapacityLabels {
  const p = "resourceCapacityOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      RESOURCE_CAPACITY_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<ResourceCapacityTab, string>,
    overview: {
      totalResources: t(`${p}.overview.totalResources`),
      overloadedResources: t(`${p}.overview.overloadedResources`),
      underutilizedResources: t(`${p}.overview.underutilizedResources`),
      openOverloads: t(`${p}.overview.openOverloads`),
      avgUtilization: t(`${p}.overview.avgUtilization`),
      availableCapacity: t(`${p}.overview.availableCapacity`),
      forecastShortages: t(`${p}.overview.forecastShortages`),
      activeAllocations: t(`${p}.overview.activeAllocations`),
      highRiskProjects: t(`${p}.overview.highRiskProjects`),
    },
    sections: {
      overloadDetection: t(`${p}.sections.overloadDetection`),
      underutilizationDetection: t(`${p}.sections.underutilizationDetection`),
      skillMatching: t(`${p}.sections.skillMatching`),
      projectCapacity: t(`${p}.sections.projectCapacity`),
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshResources: t(`${p}.actions.refreshResources`),
      generateCapacityReport: t(`${p}.actions.generateCapacityReport`),
      generateCapacityForecast: t(`${p}.actions.generateCapacityForecast`),
    },
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      at_risk: t(`${p}.healthStatus.at_risk`),
      overloaded: t(`${p}.healthStatus.overloaded`),
      underutilized: t(`${p}.healthStatus.underutilized`),
    },
    availabilityStatus: {
      available: t(`${p}.availabilityStatus.available`),
      partial: t(`${p}.availabilityStatus.partial`),
      unavailable: t(`${p}.availabilityStatus.unavailable`),
      idle: t(`${p}.availabilityStatus.idle`),
    },
    deliveryRisk: {
      low: t(`${p}.deliveryRisk.low`),
      moderate: t(`${p}.deliveryRisk.moderate`),
      high: t(`${p}.deliveryRisk.high`),
      critical: t(`${p}.deliveryRisk.critical`),
    },
  };
}
