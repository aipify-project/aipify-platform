import { AipifyHostsAccessCenterDashboardPanel } from "@/components/app/aipify-hosts-access-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsAccessPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsAccessCenter");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsAccessCenter";

  const methodKeys = ["smart_lock", "lockbox", "physical_key", "reception", "other"] as const;
  const codeStatusKeys = ["scheduled", "active", "expired", "revoked"] as const;
  const verificationKeys = ["verified", "pending", "not_verified"] as const;
  const integrationKeys = ["prepared", "connected", "disconnected"] as const;
  const providerKeys = ["yale", "nuki", "august", "schlage", "other"] as const;
  const timelineKeys = ["guest_arrival", "access_activated", "access_expired", "access_revoked"] as const;

  const labels: Record<string, string> = {
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    exploreGuidance: t(`${p}.exploreGuidance`),
    governanceNote: t(`${p}.governanceNote`),
    property: t(`${p}.property`),
    accessMethod: t(`${p}.accessMethod`),
    accessReady: t(`${p}.accessReady`),
    upcomingArrivals: t(`${p}.upcomingArrivals`),
    actions: t(`${p}.actions`),
    ready: t(`${p}.ready`),
    notReady: t(`${p}.notReady`),
    missingInstructionsFlag: t(`${p}.missingInstructionsFlag`),
    viewProfile: t(`${p}.viewProfile`),
    emptyOverviewTitle: t(`${p}.emptyOverviewTitle`),
    emptyOverviewMessage: t(`${p}.emptyOverviewMessage`),
    emptyOverviewCta: t(`${p}.emptyOverviewCta`),
    deviceLabel: t(`${p}.deviceLabel`),
    provider: t(`${p}.provider`),
    integrationStatus: t(`${p}.integrationStatus`),
    emptyLocksTitle: t(`${p}.emptyLocksTitle`),
    emptyLocksMessage: t(`${p}.emptyLocksMessage`),
    locksFutureNote: t(`${p}.locksFutureNote`),
    lockboxLocation: t(`${p}.lockboxLocation`),
    verificationStatus: t(`${p}.verificationStatus`),
    emptyLockboxesTitle: t(`${p}.emptyLockboxesTitle`),
    emptyLockboxesMessage: t(`${p}.emptyLockboxesMessage`),
    checkInGuidance: t(`${p}.checkInGuidance`),
    parkingGuidance: t(`${p}.parkingGuidance`),
    buildingEntry: t(`${p}.buildingEntry`),
    wifiInformation: t(`${p}.wifiInformation`),
    incompleteInstructions: t(`${p}.incompleteInstructions`),
    emptyInstructionsTitle: t(`${p}.emptyInstructionsTitle`),
    emptyInstructionsMessage: t(`${p}.emptyInstructionsMessage`),
    emptyInstructionsCta: t(`${p}.emptyInstructionsCta`),
    guestName: t(`${p}.guestName`),
    codeMasked: t(`${p}.codeMasked`),
    validUntil: t(`${p}.validUntil`),
    codeStatus: t(`${p}.codeStatus`),
    revokeCode: t(`${p}.revokeCode`),
    emptyCodesTitle: t(`${p}.emptyCodesTitle`),
    emptyCodesMessage: t(`${p}.emptyCodesMessage`),
    codesManualNote: t(`${p}.codesManualNote`),
    emptyEventsTitle: t(`${p}.emptyEventsTitle`),
    emptyEventsMessage: t(`${p}.emptyEventsMessage`),
    accessTimeline: t(`${p}.accessTimeline`),
    propertyAccessProfile: t(`${p}.propertyAccessProfile`),
    accessInstructions: t(`${p}.accessInstructions`),
    emergencyProcedure: t(`${p}.emergencyProcedure`),
    backupContact: t(`${p}.backupContact`),
    markAccessReady: t(`${p}.markAccessReady`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of methodKeys) labels[`method_${key}`] = t(`${p}.methods.${key}`);
  for (const key of codeStatusKeys) labels[`codestatus_${key}`] = t(`${p}.codeStatuses.${key}`);
  for (const key of verificationKeys) labels[`verification_${key}`] = t(`${p}.verification.${key}`);
  for (const key of integrationKeys) labels[`integration_${key}`] = t(`${p}.integration.${key}`);
  for (const key of providerKeys) labels[`provider_${key}`] = t(`${p}.providers.${key}`);
  for (const key of timelineKeys) labels[`timeline_${key}`] = t(`${p}.timeline.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsAccessCenterDashboardPanel labels={labels} />
    </div>
  );
}
