import { AipifyHostsSuppliesCenterDashboardPanel } from "@/components/app/aipify-hosts-supplies-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsSuppliesPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.supplies";
  const c = "hosts.common";

  const catKeys = [
    "bathroom_supplies", "kitchen_supplies", "cleaning_supplies", "bedroom_supplies",
    "guest_welcome_items", "safety_supplies", "maintenance_supplies",
  ] as const;
  const statusKeys = ["in_stock", "low_stock", "out_of_stock", "discontinued"] as const;
  const sectionKeys = ["inventory_overview", "property_supplies", "low_stock_alerts", "purchase_history", "suppliers"] as const;
  const healthKeys = ["healthy", "attention", "critical"] as const;
  const purchStatusKeys = ["pending", "completed", "cancelled"] as const;
  const taskKeys = ["restock_supplies", "verify_inventory", "update_quantities", "assign_responsibility", "purchase_task"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    totalItems: t(`${p}.totalItems`),
    lowStockCount: t(`${p}.lowStockCount`),
    outOfStockCount: t(`${p}.outOfStockCount`),
    pendingOrders: t(`${p}.pendingOrders`),
    supplierCount: t(`${p}.supplierCount`),
    itemName: t(`${p}.itemName`),
    category: t(`${p}.category`),
    property: t(`${p}.property`),
    currentQty: t(`${p}.currentQty`),
    minimumQty: t(`${p}.minimumQty`),
    unitType: t(`${p}.unitType`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    reorder: t(`${p}.reorder`),
    assignPurchase: t(`${p}.assignPurchase`),
    restock: t(`${p}.restock`),
    escalate: t(`${p}.escalate`),
    updateQty: t(`${p}.updateQty`),
    addItem: t(`${p}.addItem`),
    itemNamePlaceholder: t(`${p}.itemNamePlaceholder`),
    allProperties: t(`${p}.allProperties`),
    outstandingOrders: t(`${p}.outstandingOrders`),
    supplier: t(`${p}.supplier`),
    purchaseDate: t(`${p}.purchaseDate`),
    quantity: t(`${p}.quantity`),
    cost: t(`${p}.cost`),
    addSupplier: t(`${p}.addSupplier`),
    supplierNamePlaceholder: t(`${p}.supplierNamePlaceholder`),
    preferred: t(`${p}.preferred`),
    inventoryTasks: t(`${p}.inventoryTasks`),
    emptyItemsTitle: t(`${p}.emptyItemsTitle`),
    emptyItemsMessage: t(`${p}.emptyItemsMessage`),
    emptyPropertyTitle: t(`${p}.emptyPropertyTitle`),
    emptyPropertyMessage: t(`${p}.emptyPropertyMessage`),
    emptyPurchasesTitle: t(`${p}.emptyPurchasesTitle`),
    emptyPurchasesMessage: t(`${p}.emptyPurchasesMessage`),
    emptySuppliersTitle: t(`${p}.emptySuppliersTitle`),
    emptySuppliersMessage: t(`${p}.emptySuppliersMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of catKeys) labels[`cat_${key}`] = t(`${p}.categories.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of healthKeys) labels[`health_${key}`] = t(`${p}.health.${key}`);
  for (const key of purchStatusKeys) labels[`purchstatus_${key}`] = t(`${p}.purchaseStatuses.${key}`);
  for (const key of taskKeys) labels[`task_${key}`] = t(`${p}.tasks.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsSuppliesCenterDashboardPanel labels={labels} />
    </div>
  );
}
