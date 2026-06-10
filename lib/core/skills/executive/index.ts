export { priorityRecommendationsSkill } from "./priority-recommendations";
export { riskIdentificationSkill } from "./risk-identification";
export { opportunityDetectionSkill } from "./opportunity-detection";
export { weeklyExecutiveSummariesSkill } from "./weekly-executive-summaries";
export { monthlyExecutiveReportsSkill } from "./monthly-executive-reports";
export { approvalInsightsSkill } from "./approval-insights";

import { priorityRecommendationsSkill } from "./priority-recommendations";
import { riskIdentificationSkill } from "./risk-identification";
import { opportunityDetectionSkill } from "./opportunity-detection";
import { weeklyExecutiveSummariesSkill } from "./weekly-executive-summaries";
import { monthlyExecutiveReportsSkill } from "./monthly-executive-reports";
import { approvalInsightsSkill } from "./approval-insights";

export const EXECUTIVE_SKILLS = [
  priorityRecommendationsSkill,
  riskIdentificationSkill,
  opportunityDetectionSkill,
  weeklyExecutiveSummariesSkill,
  monthlyExecutiveReportsSkill,
  approvalInsightsSkill,
] as const;
