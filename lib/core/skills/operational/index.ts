export { supportAssistantSkill } from "./support-assistant";
export { presenceEngineSkill } from "./presence-engine";
export { executiveBriefingsSkill } from "./executive-briefings";
export { knowledgeAssistantSkill } from "./knowledge-assistant";
export { healthMonitoringSkill } from "./health-monitoring";
export { recommendationsEngineSkill } from "./recommendations-engine";
export { actionEngineSkill } from "./action-engine";
export { selfHealingEngineSkill } from "./self-healing-engine";
export { billingMonitoringSkill } from "./billing-monitoring";
export { installationMonitoringSkill } from "./installation-monitoring";

import { supportAssistantSkill } from "./support-assistant";
import { presenceEngineSkill } from "./presence-engine";
import { executiveBriefingsSkill } from "./executive-briefings";
import { knowledgeAssistantSkill } from "./knowledge-assistant";
import { healthMonitoringSkill } from "./health-monitoring";
import { recommendationsEngineSkill } from "./recommendations-engine";
import { actionEngineSkill } from "./action-engine";
import { selfHealingEngineSkill } from "./self-healing-engine";
import { billingMonitoringSkill } from "./billing-monitoring";
import { installationMonitoringSkill } from "./installation-monitoring";

export const OPERATIONAL_SKILLS = [
  supportAssistantSkill,
  presenceEngineSkill,
  executiveBriefingsSkill,
  knowledgeAssistantSkill,
  healthMonitoringSkill,
  recommendationsEngineSkill,
  actionEngineSkill,
  selfHealingEngineSkill,
  billingMonitoringSkill,
  installationMonitoringSkill,
] as const;
