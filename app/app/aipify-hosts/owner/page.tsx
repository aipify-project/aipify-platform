import { AipifyHostsOwnerCenterDashboardPanel } from "@/components/app/aipify-hosts-owner-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsOwnerPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.owner";
  const c = "hosts.common";

  const sectionKeys = ["owner_stays", "property_blocks", "availability_overrides", "block_history"] as const;
  const blockTypeKeys = ["personal_stay", "family_stay", "maintenance_block", "inspection_block", "operational_block", "seasonal_closure"] as const;
  const blockStatusKeys = ["scheduled", "active", "completed", "cancelled"] as const;
  const overrideTypeKeys = ["block_reservations", "extend_hold", "min_stay_adjustment"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    upcomingPersonalStays: t(`${p}.upcomingPersonalStays`),
    activePropertyBlocks: t(`${p}.activePropertyBlocks`),
    seasonalClosures: t(`${p}.seasonalClosures`),
    availabilityImpact: t(`${p}.availabilityImpact`),
    impactOverview: t(`${p}.impactOverview`),
    blockedNights: t(`${p}.blockedNights`),
    propertiesAffected: t(`${p}.propertiesAffected`),
    blockConflicts: t(`${p}.blockConflicts`),
    reservationsBlocked: t(`${p}.reservationsBlocked`),
    reservationsBlockedNote: t(`${p}.reservationsBlockedNote`),
    property: t(`${p}.property`),
    blockType: t(`${p}.blockType`),
    startDate: t(`${p}.startDate`),
    endDate: t(`${p}.endDate`),
    nights: t(`${p}.nights`),
    status: t(`${p}.status`),
    notes: t(`${p}.notes`),
    actions: t(`${p}.actions`),
    overrideType: t(`${p}.overrideType`),
    activateBlock: t(`${p}.activateBlock`),
    cancelBlock: t(`${p}.cancelBlock`),
    emptyBlocksTitle: t(`${p}.emptyBlocksTitle`),
    emptyBlocksMessage: t(`${p}.emptyBlocksMessage`),
    emptyOverridesTitle: t(`${p}.emptyOverridesTitle`),
    emptyOverridesMessage: t(`${p}.emptyOverridesMessage`),
    calMaster: t(`${p}.calMaster`),
    calProperty: t(`${p}.calProperty`),
    calOccupancy: t(`${p}.calOccupancy`),
    calOperations: t(`${p}.calOperations`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of blockTypeKeys) labels[`blocktype_${key}`] = t(`${p}.blockTypes.${key}`);
  for (const key of blockStatusKeys) labels[`blockstatus_${key}`] = t(`${p}.blockStatuses.${key}`);
  for (const key of overrideTypeKeys) labels[`overridetype_${key}`] = t(`${p}.overrideTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsOwnerCenterDashboardPanel labels={labels} />
    </div>
  );
}
