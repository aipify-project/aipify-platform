import { AipifyHostsPropertyCenterDashboardPanel } from "@/components/app/aipify-hosts-property-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsPropertiesPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsPropertyCenter";

  const typeKeys = ["apartment", "house", "cabin", "villa", "shared_accommodation", "other"] as const;
  const statusKeys = ["active", "inactive", "under_maintenance", "seasonal_closure", "occupied", "vacant", "low", "moderate", "high", "critical"] as const;
  const roleKeys = ["property_manager", "cleaner", "maintenance", "support_contact"] as const;
  const amenityKeys = ["wifi", "parking", "kitchen", "washer", "dryer", "heating", "air_conditioning", "tv", "workspace", "child_friendly"] as const;
  const timelineKeys = ["arrival", "departure", "cleaning", "maintenance", "property_change"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    exploreGuidance: t(`${p}.exploreGuidance`),
    governanceNote: t(`${p}.governanceNote`),
    selectProperty: t(`${p}.selectProperty`),
    allPropertiesList: t(`${p}.allPropertiesList`),
    addProperty: t(`${p}.addProperty`),
    addPropertyTitle: t(`${p}.addPropertyTitle`),
    addPropertyDescription: t(`${p}.addPropertyDescription`),
    propertyNamePlaceholder: t(`${p}.propertyNamePlaceholder`),
    saveProperty: t(`${p}.saveProperty`),
    saving: t(`${p}.saving`),
    propertyCreated: t(`${p}.propertyCreated`),
    createFailed: t(`${p}.createFailed`),
    upgradeRequired: t(`${p}.upgradeRequired`),
    upgradeNow: t(`${p}.upgradeNow`),
    upgradeWorkflow: t(`${p}.upgradeWorkflow`),
    emptyPropertiesTitle: t(`${p}.emptyPropertiesTitle`),
    emptyPropertiesMessage: t(`${p}.emptyPropertiesMessage`),
    viewReports: t(`${p}.viewReports`),
    viewOperations: t(`${p}.viewOperations`),
    editProperty: t(`${p}.editProperty`),
    archiveProperty: t(`${p}.archiveProperty`),
    propertyName: t(`${p}.propertyName`),
    propertyType: t(`${p}.propertyType`),
    address: t(`${p}.address`),
    status: t(`${p}.propertyStatus`),
    occupancyStatus: t(`${p}.occupancyStatus`),
    healthScore: t(`${p}.healthScore`),
    assignedTeam: t(`${p}.assignedTeam`),
    description: t(`${p}.description`),
    max_guests: t(`${p}.maxGuests`),
    bedrooms: t(`${p}.bedrooms`),
    bathrooms: t(`${p}.bathrooms`),
    check_in_time: t(`${p}.checkInTime`),
    check_out_time: t(`${p}.checkOutTime`),
    display_name: t(`${p}.propertyName`),
    saveChanges: t(`${p}.saveChanges`),
    cancel: t(`${p}.cancel`),
    tasks_open: t(`${p}.tasksOpen`),
    tasks_upcoming: t(`${p}.tasksUpcoming`),
    tasks_completed: t(`${p}.tasksCompleted`),
    openIncidents: t(`${p}.openIncidents`),
    resolvedIncidents: t(`${p}.resolvedIncidents`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of typeKeys) labels[`type_${key}`] = t(`${p}.types.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.status.${key}`);
  for (const key of roleKeys) labels[`role_${key}`] = t(`${p}.roles.${key}`);
  for (const key of amenityKeys) labels[`amenity_${key}`] = t(`${p}.amenities.${key}`);
  for (const key of timelineKeys) labels[`type_${key}`] = t(`${p}.timeline.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsPropertyCenterDashboardPanel labels={labels} />
    </div>
  );
}
