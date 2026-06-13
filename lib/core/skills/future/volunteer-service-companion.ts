import { defineSkill } from "../define";

export const volunteerServiceCompanionSkill = defineSkill({
  id: "volunteer-service-companion",
  name: "Aipify Volunteer & Service Companion",
  description:
    "Future Companion Module — volunteering coordination, recognition, and community service. Never pressures individuals to volunteer.",
  purpose:
    "Help individuals and organizations coordinate acts of service with ease and sustainability — planted for future release.",
  dataSources: [],
  permissionsRequired: ["owner", "admin"],
  approvalRequirements:
    "All service actions require user approval. Never pressure volunteering or replace human leadership.",
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
  moduleKey: "aipify_volunteer_service_companion",
  releaseStage: "aipify_internal",
});
