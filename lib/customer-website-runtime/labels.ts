import type { KompisOperatorSeverityTone } from "@/lib/kompis-operator/severity";

type Translator = (key: string) => string;

export type CustomerWebsiteRuntimeLabels = {
  title: string;
  sectionTitle: string;
  contractVersion: string;
  installationConnected: string;
  websiteProvisioned: string;
  runtimeEnabled: string;
  runtimeDisabled: string;
  homepageEnabled: string;
  homepageDisabled: string;
  mountedPaths: string;
  noMountedPaths: string;
  activeVersion: string;
  noActiveVersion: string;
  manifestChecksum: string;
  dbVerification: string;
  acknowledgementStatus: string;
  httpVerification: string;
  fullyVerified: string;
  notFullyVerified: string;
  lastVerified: string;
  safeFallback: string;
  fallbackCustomerRuntime: string;
  fallbackUnavailable: string;
  publishReadiness: string;
  rollbackReadiness: string;
  blockers: string;
  noBlockers: string;
  statusVerified: string;
  statusPending: string;
  statusAttention: string;
  statusMismatch: string;
  statusStale: string;
  statusFailed: string;
  statusBlocked: string;
  statusNotConfigured: string;
  statusNotPublished: string;
  retryVerify: string;
  reconcile: string;
  updateConfig: string;
  suspendRuntime: string;
  enableRuntime: string;
  internalReason: string;
  reasonRequired: string;
  confirmation: string;
  confirmationRequired: string;
  cancel: string;
  close: string;
  save: string;
  loading: string;
  error: string;
  unauthorized: string;
  forbidden: string;
  emptyTitle: string;
  emptyDescription: string;
  integrationHelpTitle: string;
  integrationHelpBody: string;
  expectedChecksum: string;
  observedChecksum: string;
  configVersion: string;
  successConfig: string;
  successVerify: string;
  verifyHttp: string;
  verifying: string;
  saving: string;
};

export function buildCustomerWebsiteRuntimeLabels(t: Translator): CustomerWebsiteRuntimeLabels {
  const p = "platform.customerWebsiteRuntime";
  return {
    title: t(`${p}.title`),
    sectionTitle: t(`${p}.sectionTitle`),
    contractVersion: t(`${p}.contractVersion`),
    installationConnected: t(`${p}.installationConnected`),
    websiteProvisioned: t(`${p}.websiteProvisioned`),
    runtimeEnabled: t(`${p}.runtimeEnabled`),
    runtimeDisabled: t(`${p}.runtimeDisabled`),
    homepageEnabled: t(`${p}.homepageEnabled`),
    homepageDisabled: t(`${p}.homepageDisabled`),
    mountedPaths: t(`${p}.mountedPaths`),
    noMountedPaths: t(`${p}.noMountedPaths`),
    activeVersion: t(`${p}.activeVersion`),
    noActiveVersion: t(`${p}.noActiveVersion`),
    manifestChecksum: t(`${p}.manifestChecksum`),
    dbVerification: t(`${p}.dbVerification`),
    acknowledgementStatus: t(`${p}.acknowledgementStatus`),
    httpVerification: t(`${p}.httpVerification`),
    fullyVerified: t(`${p}.fullyVerified`),
    notFullyVerified: t(`${p}.notFullyVerified`),
    lastVerified: t(`${p}.lastVerified`),
    safeFallback: t(`${p}.safeFallback`),
    fallbackCustomerRuntime: t(`${p}.fallbackCustomerRuntime`),
    fallbackUnavailable: t(`${p}.fallbackUnavailable`),
    publishReadiness: t(`${p}.publishReadiness`),
    rollbackReadiness: t(`${p}.rollbackReadiness`),
    blockers: t(`${p}.blockers`),
    noBlockers: t(`${p}.noBlockers`),
    statusVerified: t(`${p}.statusVerified`),
    statusPending: t(`${p}.statusPending`),
    statusAttention: t(`${p}.statusAttention`),
    statusMismatch: t(`${p}.statusMismatch`),
    statusStale: t(`${p}.statusStale`),
    statusFailed: t(`${p}.statusFailed`),
    statusBlocked: t(`${p}.statusBlocked`),
    statusNotConfigured: t(`${p}.statusNotConfigured`),
    statusNotPublished: t(`${p}.statusNotPublished`),
    retryVerify: t(`${p}.retryVerify`),
    reconcile: t(`${p}.reconcile`),
    updateConfig: t(`${p}.updateConfig`),
    suspendRuntime: t(`${p}.suspendRuntime`),
    enableRuntime: t(`${p}.enableRuntime`),
    internalReason: t(`${p}.internalReason`),
    reasonRequired: t(`${p}.reasonRequired`),
    confirmation: t(`${p}.confirmation`),
    confirmationRequired: t(`${p}.confirmationRequired`),
    cancel: t(`${p}.cancel`),
    close: t(`${p}.close`),
    save: t(`${p}.save`),
    loading: t(`${p}.loading`),
    error: t(`${p}.error`),
    unauthorized: t(`${p}.unauthorized`),
    forbidden: t(`${p}.forbidden`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyDescription: t(`${p}.emptyDescription`),
    integrationHelpTitle: t(`${p}.integrationHelpTitle`),
    integrationHelpBody: t(`${p}.integrationHelpBody`),
    expectedChecksum: t(`${p}.expectedChecksum`),
    observedChecksum: t(`${p}.observedChecksum`),
    configVersion: t(`${p}.configVersion`),
    successConfig: t(`${p}.successConfig`),
    successVerify: t(`${p}.successVerify`),
    verifyHttp: t(`${p}.verifyHttp`),
    verifying: t(`${p}.verifying`),
    saving: t(`${p}.saving`),
  };
}

export function buildAppCustomerWebsiteRuntimeLabels(t: Translator): CustomerWebsiteRuntimeLabels {
  const p = "customerApp.websiteRuntime";
  return {
    title: t(`${p}.title`),
    sectionTitle: t(`${p}.sectionTitle`),
    contractVersion: t(`${p}.contractVersion`),
    installationConnected: t(`${p}.installationConnected`),
    websiteProvisioned: t(`${p}.websiteProvisioned`),
    runtimeEnabled: t(`${p}.runtimeEnabled`),
    runtimeDisabled: t(`${p}.runtimeDisabled`),
    homepageEnabled: t(`${p}.homepageEnabled`),
    homepageDisabled: t(`${p}.homepageDisabled`),
    mountedPaths: t(`${p}.mountedPaths`),
    noMountedPaths: t(`${p}.noMountedPaths`),
    activeVersion: t(`${p}.activeVersion`),
    noActiveVersion: t(`${p}.noActiveVersion`),
    manifestChecksum: t(`${p}.manifestChecksum`),
    dbVerification: t(`${p}.dbVerification`),
    acknowledgementStatus: t(`${p}.acknowledgementStatus`),
    httpVerification: t(`${p}.httpVerification`),
    fullyVerified: t(`${p}.fullyVerified`),
    notFullyVerified: t(`${p}.notFullyVerified`),
    lastVerified: t(`${p}.lastVerified`),
    safeFallback: t(`${p}.safeFallback`),
    fallbackCustomerRuntime: t(`${p}.fallbackCustomerRuntime`),
    fallbackUnavailable: t(`${p}.fallbackUnavailable`),
    publishReadiness: t(`${p}.publishReadiness`),
    rollbackReadiness: t(`${p}.rollbackReadiness`),
    blockers: t(`${p}.blockers`),
    noBlockers: t(`${p}.noBlockers`),
    statusVerified: t(`${p}.statusVerified`),
    statusPending: t(`${p}.statusPending`),
    statusAttention: t(`${p}.statusAttention`),
    statusMismatch: t(`${p}.statusMismatch`),
    statusStale: t(`${p}.statusStale`),
    statusFailed: t(`${p}.statusFailed`),
    statusBlocked: t(`${p}.statusBlocked`),
    statusNotConfigured: t(`${p}.statusNotConfigured`),
    statusNotPublished: t(`${p}.statusNotPublished`),
    retryVerify: t(`${p}.retryVerify`),
    reconcile: t(`${p}.reconcile`),
    updateConfig: t(`${p}.updateConfig`),
    suspendRuntime: t(`${p}.suspendRuntime`),
    enableRuntime: t(`${p}.enableRuntime`),
    internalReason: t(`${p}.internalReason`),
    reasonRequired: t(`${p}.reasonRequired`),
    confirmation: t(`${p}.confirmation`),
    confirmationRequired: t(`${p}.confirmationRequired`),
    cancel: t(`${p}.cancel`),
    close: t(`${p}.close`),
    save: t(`${p}.save`),
    loading: t(`${p}.loading`),
    error: t(`${p}.error`),
    unauthorized: t(`${p}.unauthorized`),
    forbidden: t(`${p}.forbidden`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyDescription: t(`${p}.emptyDescription`),
    integrationHelpTitle: t(`${p}.integrationHelpTitle`),
    integrationHelpBody: t(`${p}.integrationHelpBody`),
    expectedChecksum: t(`${p}.expectedChecksum`),
    observedChecksum: t(`${p}.observedChecksum`),
    configVersion: t(`${p}.configVersion`),
    successConfig: t(`${p}.successConfig`),
    successVerify: t(`${p}.successVerify`),
    verifyHttp: t(`${p}.verifyHttp`),
    verifying: t(`${p}.verifying`),
    saving: t(`${p}.saving`),
  };
}

export function runtimeAckStatusLabelKey(
  status: string | null | undefined,
): keyof CustomerWebsiteRuntimeLabels {
  switch (status) {
    case "verified":
      return "statusVerified";
    case "pending":
      return "statusPending";
    case "attention":
      return "statusAttention";
    case "mismatch":
      return "statusMismatch";
    case "stale":
      return "statusStale";
    case "failed":
      return "statusFailed";
    case "blocked":
      return "statusBlocked";
    case "not_published":
      return "statusNotPublished";
    default:
      return "statusNotConfigured";
  }
}

export function runtimeAckStatusTone(status: string | null | undefined): KompisOperatorSeverityTone {
  switch (status) {
    case "verified":
      return "success";
    case "pending":
    case "attention":
    case "stale":
      return "warning";
    case "mismatch":
    case "failed":
    case "blocked":
      return "danger";
    default:
      return "muted";
  }
}

export function runtimeFullyVerifiedTone(fullyVerified: boolean): KompisOperatorSeverityTone {
  return fullyVerified ? "success" : "warning";
}

/** Locale keys required for parity checks — discover locales from filesystem in tests. */
export const CUSTOMER_WEBSITE_RUNTIME_LABEL_KEYS = [
  "title",
  "sectionTitle",
  "contractVersion",
  "installationConnected",
  "websiteProvisioned",
  "runtimeEnabled",
  "runtimeDisabled",
  "homepageEnabled",
  "homepageDisabled",
  "mountedPaths",
  "noMountedPaths",
  "activeVersion",
  "noActiveVersion",
  "manifestChecksum",
  "dbVerification",
  "acknowledgementStatus",
  "httpVerification",
  "fullyVerified",
  "notFullyVerified",
  "lastVerified",
  "safeFallback",
  "fallbackCustomerRuntime",
  "fallbackUnavailable",
  "publishReadiness",
  "rollbackReadiness",
  "blockers",
  "noBlockers",
  "statusVerified",
  "statusPending",
  "statusAttention",
  "statusMismatch",
  "statusStale",
  "statusFailed",
  "statusBlocked",
  "statusNotConfigured",
  "statusNotPublished",
  "retryVerify",
  "reconcile",
  "updateConfig",
  "suspendRuntime",
  "enableRuntime",
  "internalReason",
  "reasonRequired",
  "confirmation",
  "confirmationRequired",
  "cancel",
  "close",
  "save",
  "loading",
  "error",
  "unauthorized",
  "forbidden",
  "emptyTitle",
  "emptyDescription",
  "integrationHelpTitle",
  "integrationHelpBody",
  "expectedChecksum",
  "observedChecksum",
  "configVersion",
  "successConfig",
  "successVerify",
  "verifyHttp",
  "verifying",
  "saving",
] as const;
