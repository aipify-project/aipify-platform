import type { Translator } from "@/lib/i18n/translate";
import type { ServiceNetworkSection } from "./config";

export type ServiceNetworkLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  hierarchyNote: string;
  noRecords: string;
  locationSelector: string;
  allLocations: string;
  sections: Record<ServiceNetworkSection, string>;
  stats: {
    locations: string;
    resources: string;
    providers: string;
    activeRentals: string;
    pendingRentals: string;
    locationGroups: string;
  };
  companionRecommendations: string;
  integrations: string;
  auditRecent: string;
  detail: {
    back: string;
    overview: string;
    assignments: string;
    relatedResources: string;
    notFound: string;
  };
  entityTypes: {
    location: string;
    resource: string;
    provider: string;
    rental: string;
  };
  filters: {
    search: string;
    location: string;
    status: string;
    type: string;
  };
  emptyStates: {
    noLocations: string;
    noResources: string;
    noProviders: string;
    noRentals: string;
    createLocation: string;
    createResource: string;
    createProvider: string;
    createRental: string;
  };
  validation: {
    passed: string;
    failed: string;
    loading: string;
  };
};

export function buildServiceNetworkLabels(t: Translator): ServiceNetworkLabels {
  const p = "customerApp.serviceNetwork";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    hierarchyNote: t(`${p}.hierarchyNote`),
    noRecords: t(`${p}.noRecords`),
    locationSelector: t(`${p}.locationSelector`),
    allLocations: t(`${p}.allLocations`),
    sections: {
      network: t(`${p}.sections.network`),
      locations: t(`${p}.sections.locations`),
      resources: t(`${p}.sections.resources`),
      providers: t(`${p}.sections.providers`),
      rentals: t(`${p}.sections.rentals`),
    },
    stats: {
      locations: t(`${p}.stats.locations`),
      resources: t(`${p}.stats.resources`),
      providers: t(`${p}.stats.providers`),
      activeRentals: t(`${p}.stats.activeRentals`),
      pendingRentals: t(`${p}.stats.pendingRentals`),
      locationGroups: t(`${p}.stats.locationGroups`),
    },
    companionRecommendations: t(`${p}.companionRecommendations`),
    integrations: t(`${p}.integrations`),
    auditRecent: t(`${p}.auditRecent`),
    detail: {
      back: t(`${p}.detail.back`),
      overview: t(`${p}.detail.overview`),
      assignments: t(`${p}.detail.assignments`),
      relatedResources: t(`${p}.detail.relatedResources`),
      notFound: t(`${p}.detail.notFound`),
    },
    entityTypes: {
      location: t(`${p}.entityTypes.location`),
      resource: t(`${p}.entityTypes.resource`),
      provider: t(`${p}.entityTypes.provider`),
      rental: t(`${p}.entityTypes.rental`),
    },
    filters: {
      search: t(`${p}.filters.search`),
      location: t(`${p}.filters.location`),
      status: t(`${p}.filters.status`),
      type: t(`${p}.filters.type`),
    },
    emptyStates: {
      noLocations: t(`${p}.emptyStates.noLocations`),
      noResources: t(`${p}.emptyStates.noResources`),
      noProviders: t(`${p}.emptyStates.noProviders`),
      noRentals: t(`${p}.emptyStates.noRentals`),
      createLocation: t(`${p}.emptyStates.createLocation`),
      createResource: t(`${p}.emptyStates.createResource`),
      createProvider: t(`${p}.emptyStates.createProvider`),
      createRental: t(`${p}.emptyStates.createRental`),
    },
    validation: {
      passed: t(`${p}.validation.passed`),
      failed: t(`${p}.validation.failed`),
      loading: t(`${p}.validation.loading`),
    },
  };
}
