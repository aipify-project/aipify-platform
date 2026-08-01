import { buildOnboardingMessageCatalog } from "@/lib/app-portal/integrations/labels";
import type { Translator } from "@/lib/i18n/translate";
import { buildPlatformProviderOnboardingLabels } from "./admin-labels";

export type ProviderAdminStatusLabels = {
  active: string;
  production_ready: string;
  preview: string;
  development: string;
  not_available_yet: string;
  blocked: string;
  contract_required: string;
  contract_invalid: string;
  deprecated: string;
  reference_only: string;
};

export type PlatformProviderOnboardingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  loadFailed: string;
  pageLoadFailed: string;
  retry: string;
  goBack: string;
  providers: string;
  fixtures: string;
  save: string;
  saved: string;
  invalidContract: string;
  invalidContractBody: string;
  partialLoadWarning: string;
  openContract: string;
  contactAdmin: string;
  technicalReference: string;
  denied: string;
  advancedEditor: string;
  selectProvider: string;
  available: string;
  unavailable: string;
  preview: string;
  backHref: string;
  searchPlaceholder: string;
  filterAll: string;
  filterAvailable: string;
  filterReference: string;
  filterNeedsContract: string;
  filterInvalid: string;
  tabOverview: string;
  tabEdit: string;
  tabPreview: string;
  tabAdvancedJson: string;
  editContract: string;
  previewInApp: string;
  validateContract: string;
  viewHistory: string;
  advancedJsonWarning: string;
  formatJson: string;
  copyJson: string;
  resetJson: string;
  unsavedChanges: string;
  cancel: string;
  createContract: string;
  contractMissing: string;
  contractMissingBody: string;
  referenceBadge: string;
  referenceOnlyNotice: string;
  previewPurpose: string;
  previewDesktop: string;
  previewMobile: string;
  previewLight: string;
  previewDark: string;
  showDetails: string;
  validateContracts: string;
  openFirstIssue: string;
  issuesCount: string;
  providerKeySecondary: string;
  lastUpdated: string;
  sectionBasics: string;
  sectionConnection: string;
  sectionCapabilities: string;
  sectionScopes: string;
  sectionResponsibilities: string;
  sectionDocs: string;
  sectionPolicies: string;
  validationPassed: string;
  validationFailed: string;
  dirtyIndicator: string;
  openProviderList: string;
  closeProviderList: string;
  status: ProviderAdminStatusLabels;
};

export type PlatformProviderOnboardingPanelSerializableProps = {
  labels: PlatformProviderOnboardingLabels;
  messageCatalog: Record<string, string>;
};

export function buildPlatformProviderOnboardingPanelProps(
  t: Translator
): PlatformProviderOnboardingPanelSerializableProps {
  return {
    messageCatalog: buildOnboardingMessageCatalog(t),
    labels: buildPlatformProviderOnboardingLabels(t),
  };
}

/** Detect the Production crash class: functions passed across the RSC client boundary. */
export function assertSerializableClientProps(value: unknown): void {
  const seen = new WeakSet<object>();
  const walk = (node: unknown, path: string): void => {
    if (typeof node === "function") {
      throw new Error(
        `Functions cannot be passed directly to Client Components (${path})`
      );
    }
    if (node === null || typeof node !== "object") return;
    if (seen.has(node as object)) return;
    seen.add(node as object);
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }
    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      walk(child, path ? `${path}.${key}` : key);
    }
  };
  walk(value, "props");
  JSON.parse(JSON.stringify(value));
}
