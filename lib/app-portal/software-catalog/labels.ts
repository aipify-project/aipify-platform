import type { Translator } from "@/lib/i18n/translate";
import type { SoftwareCatalogStatus } from "./types";

const NS = "customerApp.portalStructure.softwareCatalog";

export type SoftwareCatalogLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  error: string;
  retry: string;
  partialNotice: string;
  currentPackage: string;
  packages: string;
  modules: string;
  businessPacks: string;
  activeModules: string;
  availableModules: string;
  seeDetails: string;
  contactSales: string;
  filterAll: string;
  statuses: Record<SoftwareCatalogStatus, string>;
  sourceTypes: {
    package: string;
    module: string;
    business_pack: string;
  };
};

export function buildSoftwareCatalogLabels(t: Translator): SoftwareCatalogLabels {
  return {
    title: t(`${NS}.title`),
    subtitle: t(`${NS}.subtitle`),
    loading: t(`${NS}.loading`),
    empty: t(`${NS}.empty`),
    error: t(`${NS}.error`),
    retry: t(`${NS}.retry`),
    partialNotice: t(`${NS}.partialNotice`),
    currentPackage: t(`${NS}.currentPackage`),
    packages: t(`${NS}.packages`),
    modules: t(`${NS}.modules`),
    businessPacks: t(`${NS}.businessPacks`),
    activeModules: t(`${NS}.activeModules`),
    availableModules: t(`${NS}.availableModules`),
    seeDetails: t(`${NS}.seeDetails`),
    contactSales: t(`${NS}.contactSales`),
    filterAll: t(`${NS}.filterAll`),
    statuses: {
      active: t(`${NS}.statuses.active`),
      included: t(`${NS}.statuses.included`),
      available: t(`${NS}.statuses.available`),
      pending_approval: t(`${NS}.statuses.pendingApproval`),
      unavailable: t(`${NS}.statuses.unavailable`),
    },
    sourceTypes: {
      package: t(`${NS}.sourceTypes.package`),
      module: t(`${NS}.sourceTypes.module`),
      business_pack: t(`${NS}.sourceTypes.businessPack`),
    },
  };
}
