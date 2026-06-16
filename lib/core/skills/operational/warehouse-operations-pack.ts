import { operationalSkill } from "./_defaults";

export const warehouseOperationsPackSkill = operationalSkill({
  id: "warehouse-operations-pack",
  name: "Warehouse Operations",
  description: "Inventory intelligence, fulfillment, shipping, and printer workflows for warehouse teams.",
  purpose: "Help warehouse staff ask, retrieve, pack, and ship with fewer clicks and fewer errors.",
  dataSources: ["inventory_metadata", "fulfillment_orders", "shipping_carriers", "printer_queue"],
  permissionsRequired: ["aipify_warehouse", "staff"],
  approvalRequirements:
    "Inventory adjustments, order cancellations, and refund shipments require explicit approval.",
  learningBehaviour: "operational_metadata",
  escalationRules: ["inventory_adjustment", "order_cancellation", "refund_shipment"],
  rollbackSupport: true,
  ownerTeam: "product",
  status: "active",
  enabledByDefault: false,
  requiresApproval: true,
  supportsLearning: true,
  requiresInstallation: true,
  version: "1.0.0",
  layers: ["customer_app", "embedded"],
  moduleKey: "aipify_warehouse",
  releaseStage: "general_availability",
});
