import type { InstallationSupportMode, InstallationWizardState } from "./enums";
import {
  installPresentationKeyForSupportMode,
  type InstallPresentationKey,
  type InstallSupportLifecycle,
} from "./install-selection";
import {
  previewPresentationKeyForSupportMode,
  type PreviewSupportPresentationKey,
} from "./preview-mode";

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
    handoffSubmitting: `${BASE}.handoff.submitting`,
    handoffFailed: `${BASE}.handoff.failed`,
    handoffInvalidRecipient: `${BASE}.handoff.invalidRecipient`,
    handoffNextStepHint: `${BASE}.handoff.nextStepHint`,
    handoffReferenceLabel: `${BASE}.handoff.referenceLabel`,
    handoffRequestedAtLabel: `${BASE}.handoff.requestedAtLabel`,
    handoffRecipientLabel: `${BASE}.handoff.recipientLabel`,
    handoffSuccess: {
      aipify_managed: `${BASE}.handoff.success.aipifyManaged`,
      guided: `${BASE}.handoff.success.guided`,
      customer_it_managed: `${BASE}.handoff.success.customerItManaged`,
      duplicate: `${BASE}.handoff.success.duplicate`,
    },
    itRecipientFieldLabel: `${BASE}.fields.itRecipient`,
    itRecipientFieldPlaceholder: `${BASE}.handoff.itRecipientPlaceholder`,
    installStatusAfterHandoff: {
      guided: `${BASE}.install.statusAfterHandoff.guided`,
    },
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
    previewActionsExampleHeading: `${BASE}.preview.actionsExampleHeading`,
    previewActionsUnavailable: `${BASE}.preview.actionsUnavailable`,
    previewStatus: {
      choose: `${BASE}.preview.status.choose`,
      aipify_managed: `${BASE}.preview.status.aipifyManaged`,
      guided: `${BASE}.preview.status.guided`,
      self_service: `${BASE}.preview.status.selfService`,
      customer_it_managed: `${BASE}.preview.status.customerItManaged`,
    } satisfies Record<PreviewSupportPresentationKey, string>,
    previewResponsibility: {
      choose: `${BASE}.preview.responsibility.choose`,
      aipify_managed: `${BASE}.preview.responsibility.aipifyManaged`,
      guided: `${BASE}.preview.responsibility.guided`,
      self_service: `${BASE}.preview.responsibility.selfService`,
      customer_it_managed: `${BASE}.preview.responsibility.customerItManaged`,
    } satisfies Record<PreviewSupportPresentationKey, string>,
    installActionsChooseHint: `${BASE}.install.actionsChooseHint`,
    installActionsHeading: `${BASE}.install.actionsHeading`,
    installSessionPersistError: `${BASE}.install.sessionPersistError`,
    installPrimaryActions: {
      aipify_managed: `${BASE}.install.primaryActions.aipifyManaged`,
      guided: `${BASE}.install.primaryActions.guided`,
      self_service: `${BASE}.install.primaryActions.selfService`,
      customer_it_managed: `${BASE}.install.primaryActions.customerItManaged`,
    } satisfies Record<Exclude<InstallPresentationKey, "choose">, string>,
    installStatus: {
      choose: `${BASE}.install.status.choose`,
      aipify_managed: `${BASE}.install.status.aipifyManaged`,
      guided: `${BASE}.install.status.guided`,
      self_service: `${BASE}.install.status.selfService`,
      customer_it_managed: `${BASE}.install.status.customerItManaged`,
    } satisfies Record<InstallPresentationKey, string>,
    installResponsibility: {
      choose: `${BASE}.install.responsibility.choose`,
      aipify_managed: `${BASE}.install.responsibility.aipifyManaged`,
      guided: `${BASE}.install.responsibility.guided`,
      self_service: `${BASE}.install.responsibility.selfService`,
      customer_it_managed: `${BASE}.install.responsibility.customerItManaged`,
    } satisfies Record<InstallPresentationKey, string>,
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
  loading: string;
  comingLater: string;
  invitePlaceholder: string;
  waiting: string;
  blocked: string;
  errorGeneric: string;
  completed: string;
  handoffSubmitting: string;
  handoffFailed: string;
  handoffInvalidRecipient: string;
  handoffNextStepHint: string;
  handoffReferenceLabel: string;
  handoffRequestedAtLabel: string;
  handoffRecipientLabel: string;
  itRecipientFieldLabel: string;
  itRecipientFieldPlaceholder: string;
  handoffSuccessNotice: (opts: {
    mode: InstallationSupportMode;
    reference: string;
    requestedAt: string;
    recipientEmail?: string | null;
    duplicate?: boolean;
  }) => string;
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
  previewActionsExampleHeading: string;
  previewActionsUnavailable: string;
  previewStatusForMode: (mode: InstallationSupportMode | null | undefined) => string;
  previewResponsibilityForMode: (mode: InstallationSupportMode | null | undefined) => string;
  installActionsChooseHint: string;
  installActionsHeading: string;
  installSessionPersistError: string;
  installPrimaryActionLabel: (mode: InstallationSupportMode) => string;
  installStatusForLifecycle: (
    mode: InstallationSupportMode | null | undefined,
    lifecycle: InstallSupportLifecycle,
    sessionState: InstallationWizardState | null | undefined
  ) => string;
  installResponsibilityForMode: (mode: InstallationSupportMode | null | undefined) => string;
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
  put(keys.previewActionsExampleHeading);
  put(keys.previewActionsUnavailable);
  put(keys.installActionsChooseHint);
  put(keys.installActionsHeading);
  put(keys.installSessionPersistError);
  put(keys.handoffSubmitting);
  put(keys.handoffFailed);
  put(keys.handoffInvalidRecipient);
  put(keys.handoffNextStepHint);
  put(keys.handoffReferenceLabel);
  put(keys.handoffRequestedAtLabel);
  put(keys.handoffRecipientLabel);
  put(keys.itRecipientFieldLabel);
  put(keys.itRecipientFieldPlaceholder);
  Object.values(keys.handoffSuccess).forEach(put);
  Object.values(keys.installStatusAfterHandoff).forEach(put);
  Object.values(keys.previewStatus).forEach(put);
  Object.values(keys.previewResponsibility).forEach(put);
  Object.values(keys.installStatus).forEach(put);
  Object.values(keys.installResponsibility).forEach(put);
  Object.values(keys.installPrimaryActions).forEach(put);
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
    loading: t(keys.loading),
    comingLater: t(keys.comingLater),
    invitePlaceholder: t(keys.invitePlaceholder),
    waiting: t(keys.waiting),
    blocked: t(keys.blocked),
    errorGeneric: t(keys.error),
    completed: t(keys.completed),
    handoffSubmitting: t(keys.handoffSubmitting),
    handoffFailed: t(keys.handoffFailed),
    handoffInvalidRecipient: t(keys.handoffInvalidRecipient),
    handoffNextStepHint: t(keys.handoffNextStepHint),
    handoffReferenceLabel: t(keys.handoffReferenceLabel),
    handoffRequestedAtLabel: t(keys.handoffRequestedAtLabel),
    handoffRecipientLabel: t(keys.handoffRecipientLabel),
    itRecipientFieldLabel: t(keys.itRecipientFieldLabel),
    itRecipientFieldPlaceholder: t(keys.itRecipientFieldPlaceholder),
    handoffSuccessNotice: ({ mode, reference, recipientEmail, duplicate }) => {
      if (duplicate) {
        return t(keys.handoffSuccess.duplicate).replace("{reference}", reference);
      }
      if (mode === "guided") {
        return t(keys.handoffSuccess.guided).replace("{reference}", reference);
      }
      if (mode === "customer_it_managed") {
        return t(keys.handoffSuccess.customer_it_managed)
          .replace("{reference}", reference)
          .replace("{email}", recipientEmail?.trim() || "—");
      }
      return t(keys.handoffSuccess.aipify_managed).replace("{reference}", reference);
    },
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
    previewActionsExampleHeading: t(keys.previewActionsExampleHeading),
    previewActionsUnavailable: t(keys.previewActionsUnavailable),
    previewStatusForMode: (mode) =>
      t(keys.previewStatus[previewPresentationKeyForSupportMode(mode)]),
    previewResponsibilityForMode: (mode) =>
      t(keys.previewResponsibility[previewPresentationKeyForSupportMode(mode)]),
    installActionsChooseHint: t(keys.installActionsChooseHint),
    installActionsHeading: t(keys.installActionsHeading),
    installSessionPersistError: t(keys.installSessionPersistError),
    installPrimaryActionLabel: (mode) => {
      const key = installPresentationKeyForSupportMode(mode);
      if (key === "choose") return t(keys.primaryContinue);
      return t(keys.installPrimaryActions[key]);
    },
    installStatusForLifecycle: (mode, lifecycle, sessionState) => {
      if (lifecycle === "handed_off") {
        if (mode === "guided") {
          return t(keys.installStatusAfterHandoff.guided);
        }
        if (sessionState) {
          return t(keys.states[sessionState]);
        }
      }
      return t(keys.installStatus[installPresentationKeyForSupportMode(mode)]);
    },
    installResponsibilityForMode: (mode) =>
      t(keys.installResponsibility[installPresentationKeyForSupportMode(mode)]),
    emptyFallback: t(`${BASE}.emptyFallback`),
    messageCatalog: catalog,
  };
}
