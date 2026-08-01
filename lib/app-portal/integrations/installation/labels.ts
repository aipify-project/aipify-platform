import type { InstallationSupportMode, InstallationWizardState } from "./enums";

const BASE = "customerApp.portalStructure.integrations.installationWizard";

export function installationWizardMessageKeys() {
  return {
    reassurance: `${BASE}.reassurance`,
    technicalRequired: `${BASE}.technicalRequired`,
    progress: `${BASE}.progress`,
    estimatedTime: `${BASE}.estimatedTime`,
    responsible: `${BASE}.responsible`,
    continueLater: `${BASE}.actions.continueLater`,
    primaryContinue: `${BASE}.primaryContinue`,
    primaryBack: `${BASE}.primaryBack`,
    comingLater: `${BASE}.comingLater`,
    invitePlaceholder: `${BASE}.invitePlaceholder`,
    loading: `${BASE}.loading`,
    waiting: `${BASE}.waiting`,
    blocked: `${BASE}.blocked`,
    error: `${BASE}.error`,
    completed: `${BASE}.completed`,
    testTesting: `${BASE}.test.testing`,
    testOk: `${BASE}.test.ok`,
    testNeedInfo: `${BASE}.test.needInfo`,
    testFollowUp: `${BASE}.test.followUp`,
    testFailed: `${BASE}.test.failed`,
    testRetry: `${BASE}.test.retry`,
    testAskHelp: `${BASE}.test.askHelp`,
    activateGate: `${BASE}.activateGate`,
    pauseSaved: `${BASE}.pauseSaved`,
    resume: `${BASE}.resume`,
    staleContract: `${BASE}.staleContract`,
    previewBadge: `${BASE}.preview.badge`,
    previewNotice: `${BASE}.preview.notice`,
    previewReadOnlyAction: `${BASE}.preview.readOnlyAction`,
    previewClose: `${BASE}.preview.close`,
    previewSampleCredential: `${BASE}.preview.sampleCredential`,
    supportModes: {
      self_service: `${BASE}.supportModes.selfService`,
      guided: `${BASE}.supportModes.guided`,
      aipify_managed: `${BASE}.supportModes.aipifyManaged`,
      partner_managed: `${BASE}.supportModes.partnerManaged`,
      customer_it_managed: `${BASE}.supportModes.customerItManaged`,
    } satisfies Record<InstallationSupportMode, string>,
    states: {
      not_started: `${BASE}.states.notStarted`,
      support_selection: `${BASE}.states.supportSelection`,
      awaiting_customer: `${BASE}.states.awaitingCustomer`,
      awaiting_aipify: `${BASE}.states.awaitingAipify`,
      awaiting_partner: `${BASE}.states.awaitingPartner`,
      awaiting_provider: `${BASE}.states.awaitingProvider`,
      awaiting_customer_it: `${BASE}.states.awaitingCustomerIt`,
      in_progress: `${BASE}.states.inProgress`,
      credentials_required: `${BASE}.states.credentialsRequired`,
      configuration_required: `${BASE}.states.configurationRequired`,
      ready_for_test: `${BASE}.states.readyForTest`,
      testing: `${BASE}.states.testing`,
      test_failed: `${BASE}.states.testFailed`,
      verified: `${BASE}.states.verified`,
      ready_for_activation: `${BASE}.states.readyForActivation`,
      active: `${BASE}.states.active`,
      paused: `${BASE}.states.paused`,
      blocked: `${BASE}.states.blocked`,
      unsupported: `${BASE}.states.unsupported`,
      cancelled: `${BASE}.states.cancelled`,
      completed: `${BASE}.states.completed`,
    } satisfies Record<InstallationWizardState, string>,
  };
}

export type InstallationWizardLabels = {
  reassurance: string;
  technicalRequired: string;
  progressLabel: string;
  estimatedTime: (minutes: number) => string;
  responsibleParty: (party: string) => string;
  supportModeLabel: (mode: InstallationSupportMode) => string;
  stateLabel: (state: InstallationWizardState) => string;
  continueLater: string;
  primaryContinue: string;
  primaryBack: string;
  comingLater: string;
  invitePlaceholder: string;
  waiting: string;
  blocked: string;
  errorGeneric: string;
  completed: string;
  testTesting: string;
  testOk: string;
  testNeedInfo: string;
  testFollowUp: string;
  testFailed: string;
  testRetry: string;
  testAskHelp: string;
  activateGate: string;
  pauseSaved: string;
  resume: string;
  staleContract: string;
  previewBadge: string;
  previewNotice: string;
  previewReadOnlyAction: string;
  previewClose: string;
  previewSampleCredential: string;
  emptyFallback: string;
  messageCatalog: Record<string, string>;
};

export function buildInstallationWizardLabels(
  t: (key: string) => string
): InstallationWizardLabels {
  const keys = installationWizardMessageKeys();
  const catalog: Record<string, string> = {};
  const put = (key: string) => {
    catalog[key] = t(key);
  };
  put(keys.reassurance);
  put(keys.technicalRequired);
  put(keys.previewBadge);
  put(keys.previewNotice);
  put(keys.previewReadOnlyAction);
  put(keys.previewClose);
  put(keys.previewSampleCredential);
  Object.values(keys.supportModes).forEach(put);
  Object.values(keys.states).forEach(put);

  return {
    reassurance: t(keys.reassurance),
    technicalRequired: t(keys.technicalRequired),
    progressLabel: t(keys.progress),
    estimatedTime: (minutes) =>
      t(keys.estimatedTime).replace("{minutes}", String(minutes)),
    responsibleParty: (party) => t(`${BASE}.responsibleParties.${party}`) || party,
    supportModeLabel: (mode) => t(keys.supportModes[mode]),
    stateLabel: (state) => t(keys.states[state]),
    continueLater: t(keys.continueLater),
    primaryContinue: t(keys.primaryContinue),
    primaryBack: t(keys.primaryBack),
    comingLater: t(keys.comingLater),
    invitePlaceholder: t(keys.invitePlaceholder),
    waiting: t(keys.waiting),
    blocked: t(keys.blocked),
    errorGeneric: t(keys.error),
    completed: t(keys.completed),
    testTesting: t(keys.testTesting),
    testOk: t(keys.testOk),
    testNeedInfo: t(keys.testNeedInfo),
    testFollowUp: t(keys.testFollowUp),
    testFailed: t(keys.testFailed),
    testRetry: t(keys.testRetry),
    testAskHelp: t(keys.testAskHelp),
    activateGate: t(keys.activateGate),
    pauseSaved: t(keys.pauseSaved),
    resume: t(keys.resume),
    staleContract: t(keys.staleContract),
    previewBadge: t(keys.previewBadge),
    previewNotice: t(keys.previewNotice),
    previewReadOnlyAction: t(keys.previewReadOnlyAction),
    previewClose: t(keys.previewClose),
    previewSampleCredential: t(keys.previewSampleCredential),
    emptyFallback: t(`${BASE}.emptyFallback`),
    messageCatalog: catalog,
  };
}
