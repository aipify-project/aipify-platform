import { defineSkill } from "../define";

export const travelCompanionSkill = defineSkill({
  id: "travel-companion",
  name: "Aipify Travel Companion",
  description:
    "Future Companion Module — travel planning, preparation, and logistics. Never unauthorized bookings.",
  purpose:
    "Help people navigate travel with confidence and preparedness — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All bookings and reservations require explicit approval via Trust & Action and financial guardrails.",
  learningBehaviour: "approved_only",
  tenantIsolation: "tenant",
  escalationRules: [],
  rollbackSupport: false,
  ownerTeam: "product",
  category: "future",
  status: "planned",
  enabledByDefault: false,
  requiresApproval: true,
  supportsLearning: false,
  requiresInstallation: false,
  minimumPlan: "growth",
  core: false,
  tenantScoped: true,
  version: "0.0.1",
  layers: ["customer_app"],
  moduleKey: "aipify_travel_companion",
  releaseStage: "aipify_internal",
});
