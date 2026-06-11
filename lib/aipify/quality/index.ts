export * from "./types";
export * from "./parse";
export { UNONIGHT_QUALITY_CHECKS } from "./presets/unonight-checks";
export { UNONIGHT_SAMPLE_IMAGES, UNONIGHT_TARGET_PAGES } from "./presets/unonight-frontend-checks";
export { runAllQualityScanners, getChecksForTenant } from "./scanners";
export { runFrontendExperienceScan } from "./frontend-scanner";
export { evaluateImageAsset } from "./image-guardian";
export { evaluatePageSnapshot } from "./performance-guardian";
export { runQualityScanJob, seedTenantQualityChecks, generateGuardianReportJob } from "./jobs";
export {
  QUALITY_INCIDENT_KNOWLEDGE_SLUGS,
  knowledgeSlugForIncident,
  linkIncidentToKnowledge,
  linkIncidentsToKnowledge,
} from "./knowledge-links";

export const QG_MODULE_PATH = "aipify-core/modules/quality-guardian/phase-58";

export const QG_CORE_PRINCIPLE =
  "Expected behaviour is documented first. Observation compares reality to intent. Reports — not silent production changes.";

export const QG_OBSERVATION_NOTE =
  "Quality Guardian runs in observation mode. It creates reports and recommendations; production fixes require governance approval.";
