export { workflowDiscoverySkill } from "./workflow-discovery";
export { integrationDetectionSkill } from "./integration-detection";
export { domainValidationSkill } from "./domain-validation";
export { healthScanningSkill } from "./health-scanning";
export { systemMappingSkill } from "./system-mapping";
export { configurationAssessmentSkill } from "./configuration-assessment";
export { improvementRecommendationsSkill } from "./improvement-recommendations";

import { workflowDiscoverySkill } from "./workflow-discovery";
import { integrationDetectionSkill } from "./integration-detection";
import { domainValidationSkill } from "./domain-validation";
import { healthScanningSkill } from "./health-scanning";
import { systemMappingSkill } from "./system-mapping";
import { configurationAssessmentSkill } from "./configuration-assessment";
import { improvementRecommendationsSkill } from "./improvement-recommendations";

export const INSTALLATION_SKILLS = [
  workflowDiscoverySkill,
  integrationDetectionSkill,
  domainValidationSkill,
  healthScanningSkill,
  systemMappingSkill,
  configurationAssessmentSkill,
  improvementRecommendationsSkill,
] as const;
