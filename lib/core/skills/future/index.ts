export { marketingAssistantSkill } from "./marketing-assistant";
export { commerceAssistantSkill } from "./commerce-assistant";
export { recruitmentAssistantSkill } from "./recruitment-assistant";

import { marketingAssistantSkill } from "./marketing-assistant";
import { commerceAssistantSkill } from "./commerce-assistant";
import { recruitmentAssistantSkill } from "./recruitment-assistant";

export const FUTURE_SKILLS = [
  marketingAssistantSkill,
  commerceAssistantSkill,
  recruitmentAssistantSkill,
] as const;
