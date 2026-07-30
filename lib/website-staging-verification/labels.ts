import type { Translator } from "@/lib/i18n/translate";

export type WebsiteStagingVerificationLabels = {
  title: string;
  subtitle: string;
  noSensitiveInfo: string;
  loading: string;
  errorTitle: string;
  retry: string;

  kpiTotalRuns: string;
  kpiPassedRuns: string;
  kpiFailedRuns: string;
  kpiBlockedRuns: string;
  kpiLastRunAt: string;
  never: string;

  environmentTitle: string;
  noEnvironmentTitle: string;
  noEnvironmentBody: string;
  ensureEnvironment: string;
  ensureEnvironmentHelp: string;
  environmentStatusActive: string;
  environmentStatusAttention: string;
  environmentStatusArchived: string;
  stagingHost: string;
  accessTokenPresent: string;
  accessTokenMissing: string;
  accessTokenIssued: string;
  accessTokenIssuedHelp: string;
  openStagingPreview: string;

  fixturesTitle: string;
  fixturesEmpty: string;
  fixtureKeyLabel: string;
  fixtureKeyPlaceholder: string;
  fixtureLocaleLabel: string;
  fixtureLocalePlaceholder: string;
  fixturePathLabel: string;
  createFixture: string;
  archiveFixture: string;
  archiveFixtureConfirm: string;
  fixtureStatusActive: string;
  fixtureStatusArchived: string;

  runsTitle: string;
  runsEmpty: string;
  startRun: string;
  resumeRun: string;
  verifyRuntime: string;
  selectFixture: string;
  runStatusPending: string;
  runStatusRunning: string;
  runStatusPassed: string;
  runStatusFailed: string;
  runStatusPartial: string;
  runStatusBlocked: string;

  phaseInitialized: string;
  phaseFirstCandidateBuilt: string;
  phaseFirstPreviewCreated: string;
  phaseFirstPublished: string;
  phaseFirstVerified: string;
  phaseSecondCandidateBuilt: string;
  phaseSecondPreviewCreated: string;
  phaseSecondPublished: string;
  phaseSecondVerified: string;
  phaseRolledBack: string;
  phaseRollbackVerified: string;
  phaseCompleted: string;

  startedAt: string;
  completedAt: string;
  safeErrorCode: string;
  internalReasonLabel: string;
  internalReasonPlaceholder: string;
  confirmCheckboxLabel: string;
  confirmationRequired: string;

  actionSucceeded: string;
  actionFailed: string;

  rendererBanner: string;
  rendererTitle: string;
  rendererNotFoundTitle: string;
  rendererNotFoundBody: string;
  rendererPageNotFoundTitle: string;
  rendererPageNotFoundBody: string;
  rendererInvalidTitle: string;
  rendererInvalidBody: string;
  rendererEmptyBlocks: string;

  productionIsolation: string;
  stagingPreviewPath: string;
  checksumExpected: string;
  checksumActual: string;
  checksumMatch: string;
  checksumMismatch: string;
  statusColumn: string;
  phaseColumn: string;

  controlTitle: string;
  appLicense: string;
  websiteKompisCapability: string;
  canonicalDelivery: string;
  acknowledgement: string;
  noindexStatus: string;
  currentStagingVersion: string;
  latestRun: string;
  firstPublish: string;
  secondPublish: string;
  rollbackResult: string;
  auditReference: string;
  blockersTitle: string;
  blockersNone: string;
  durationLabel: string;
  present: string;
  absent: string;
  activeLabel: string;
  inactiveLabel: string;
};

export function buildWebsiteStagingVerificationLabels(t: Translator): WebsiteStagingVerificationLabels {
  const p = "platform.websiteReleaseVerification";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    noSensitiveInfo: t(`${p}.noSensitiveInfo`),
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    retry: t(`${p}.retry`),

    kpiTotalRuns: t(`${p}.kpiTotalRuns`),
    kpiPassedRuns: t(`${p}.kpiPassedRuns`),
    kpiFailedRuns: t(`${p}.kpiFailedRuns`),
    kpiBlockedRuns: t(`${p}.kpiBlockedRuns`),
    kpiLastRunAt: t(`${p}.kpiLastRunAt`),
    never: t(`${p}.never`),

    environmentTitle: t(`${p}.environmentTitle`),
    noEnvironmentTitle: t(`${p}.noEnvironmentTitle`),
    noEnvironmentBody: t(`${p}.noEnvironmentBody`),
    ensureEnvironment: t(`${p}.ensureEnvironment`),
    ensureEnvironmentHelp: t(`${p}.ensureEnvironmentHelp`),
    environmentStatusActive: t(`${p}.environmentStatusActive`),
    environmentStatusAttention: t(`${p}.environmentStatusAttention`),
    environmentStatusArchived: t(`${p}.environmentStatusArchived`),
    stagingHost: t(`${p}.stagingHost`),
    accessTokenPresent: t(`${p}.accessTokenPresent`),
    accessTokenMissing: t(`${p}.accessTokenMissing`),
    accessTokenIssued: t(`${p}.accessTokenIssued`),
    accessTokenIssuedHelp: t(`${p}.accessTokenIssuedHelp`),
    openStagingPreview: t(`${p}.openStagingPreview`),

    fixturesTitle: t(`${p}.fixturesTitle`),
    fixturesEmpty: t(`${p}.fixturesEmpty`),
    fixtureKeyLabel: t(`${p}.fixtureKeyLabel`),
    fixtureKeyPlaceholder: t(`${p}.fixtureKeyPlaceholder`),
    fixtureLocaleLabel: t(`${p}.fixtureLocaleLabel`),
    fixtureLocalePlaceholder: t(`${p}.fixtureLocalePlaceholder`),
    fixturePathLabel: t(`${p}.fixturePathLabel`),
    createFixture: t(`${p}.createFixture`),
    archiveFixture: t(`${p}.archiveFixture`),
    archiveFixtureConfirm: t(`${p}.archiveFixtureConfirm`),
    fixtureStatusActive: t(`${p}.fixtureStatusActive`),
    fixtureStatusArchived: t(`${p}.fixtureStatusArchived`),

    runsTitle: t(`${p}.runsTitle`),
    runsEmpty: t(`${p}.runsEmpty`),
    startRun: t(`${p}.startRun`),
    resumeRun: t(`${p}.resumeRun`),
    verifyRuntime: t(`${p}.verifyRuntime`),
    selectFixture: t(`${p}.selectFixture`),
    runStatusPending: t(`${p}.runStatusPending`),
    runStatusRunning: t(`${p}.runStatusRunning`),
    runStatusPassed: t(`${p}.runStatusPassed`),
    runStatusFailed: t(`${p}.runStatusFailed`),
    runStatusPartial: t(`${p}.runStatusPartial`),
    runStatusBlocked: t(`${p}.runStatusBlocked`),

    phaseInitialized: t(`${p}.phaseInitialized`),
    phaseFirstCandidateBuilt: t(`${p}.phaseFirstCandidateBuilt`),
    phaseFirstPreviewCreated: t(`${p}.phaseFirstPreviewCreated`),
    phaseFirstPublished: t(`${p}.phaseFirstPublished`),
    phaseFirstVerified: t(`${p}.phaseFirstVerified`),
    phaseSecondCandidateBuilt: t(`${p}.phaseSecondCandidateBuilt`),
    phaseSecondPreviewCreated: t(`${p}.phaseSecondPreviewCreated`),
    phaseSecondPublished: t(`${p}.phaseSecondPublished`),
    phaseSecondVerified: t(`${p}.phaseSecondVerified`),
    phaseRolledBack: t(`${p}.phaseRolledBack`),
    phaseRollbackVerified: t(`${p}.phaseRollbackVerified`),
    phaseCompleted: t(`${p}.phaseCompleted`),

    startedAt: t(`${p}.startedAt`),
    completedAt: t(`${p}.completedAt`),
    safeErrorCode: t(`${p}.safeErrorCode`),
    internalReasonLabel: t(`${p}.internalReasonLabel`),
    internalReasonPlaceholder: t(`${p}.internalReasonPlaceholder`),
    confirmCheckboxLabel: t(`${p}.confirmCheckboxLabel`),
    confirmationRequired: t(`${p}.confirmationRequired`),

    actionSucceeded: t(`${p}.actionSucceeded`),
    actionFailed: t(`${p}.actionFailed`),

    rendererBanner: t(`${p}.rendererBanner`),
    rendererTitle: t(`${p}.rendererTitle`),
    rendererNotFoundTitle: t(`${p}.rendererNotFoundTitle`),
    rendererNotFoundBody: t(`${p}.rendererNotFoundBody`),
    rendererPageNotFoundTitle: t(`${p}.rendererPageNotFoundTitle`),
    rendererPageNotFoundBody: t(`${p}.rendererPageNotFoundBody`),
    rendererInvalidTitle: t(`${p}.rendererInvalidTitle`),
    rendererInvalidBody: t(`${p}.rendererInvalidBody`),
    rendererEmptyBlocks: t(`${p}.rendererEmptyBlocks`),

    productionIsolation: t(`${p}.productionIsolation`),
    stagingPreviewPath: t(`${p}.stagingPreviewPath`),
    checksumExpected: t(`${p}.checksumExpected`),
    checksumActual: t(`${p}.checksumActual`),
    checksumMatch: t(`${p}.checksumMatch`),
    checksumMismatch: t(`${p}.checksumMismatch`),
    statusColumn: t(`${p}.statusColumn`),
    phaseColumn: t(`${p}.phaseColumn`),

    controlTitle: t(`${p}.controlTitle`),
    appLicense: t(`${p}.appLicense`),
    websiteKompisCapability: t(`${p}.websiteKompisCapability`),
    canonicalDelivery: t(`${p}.canonicalDelivery`),
    acknowledgement: t(`${p}.acknowledgement`),
    noindexStatus: t(`${p}.noindexStatus`),
    currentStagingVersion: t(`${p}.currentStagingVersion`),
    latestRun: t(`${p}.latestRun`),
    firstPublish: t(`${p}.firstPublish`),
    secondPublish: t(`${p}.secondPublish`),
    rollbackResult: t(`${p}.rollbackResult`),
    auditReference: t(`${p}.auditReference`),
    blockersTitle: t(`${p}.blockersTitle`),
    blockersNone: t(`${p}.blockersNone`),
    durationLabel: t(`${p}.durationLabel`),
    present: t(`${p}.present`),
    absent: t(`${p}.absent`),
    activeLabel: t(`${p}.activeLabel`),
    inactiveLabel: t(`${p}.inactiveLabel`),
  };
}

export function websiteStagingRunPhaseLabelKey(
  phase: string,
): keyof WebsiteStagingVerificationLabels {
  switch (phase) {
    case "first_candidate_built":
      return "phaseFirstCandidateBuilt";
    case "first_preview_created":
      return "phaseFirstPreviewCreated";
    case "first_published":
      return "phaseFirstPublished";
    case "first_verified":
      return "phaseFirstVerified";
    case "second_candidate_built":
      return "phaseSecondCandidateBuilt";
    case "second_preview_created":
      return "phaseSecondPreviewCreated";
    case "second_published":
      return "phaseSecondPublished";
    case "second_verified":
      return "phaseSecondVerified";
    case "rolled_back":
      return "phaseRolledBack";
    case "rollback_verified":
      return "phaseRollbackVerified";
    case "completed":
      return "phaseCompleted";
    default:
      return "phaseInitialized";
  }
}

export function websiteStagingRunStatusLabelKey(
  status: string,
): keyof WebsiteStagingVerificationLabels {
  switch (status) {
    case "running":
      return "runStatusRunning";
    case "passed":
      return "runStatusPassed";
    case "failed":
      return "runStatusFailed";
    case "partial":
      return "runStatusPartial";
    case "blocked":
      return "runStatusBlocked";
    default:
      return "runStatusPending";
  }
}

export function websiteStagingEnvironmentStatusLabelKey(
  status: string,
): keyof WebsiteStagingVerificationLabels {
  switch (status) {
    case "attention":
      return "environmentStatusAttention";
    case "archived":
      return "environmentStatusArchived";
    default:
      return "environmentStatusActive";
  }
}

export function websiteStagingFixtureStatusLabelKey(
  status: string,
): keyof WebsiteStagingVerificationLabels {
  return status === "archived" ? "fixtureStatusArchived" : "fixtureStatusActive";
}
