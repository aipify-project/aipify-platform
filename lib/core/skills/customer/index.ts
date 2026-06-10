export { faqAssistantSkill } from "./faq-assistant";
export { onboardingAssistantSkill } from "./onboarding-assistant";
export { invoiceExplanationAssistantSkill } from "./invoice-explanation-assistant";
export { escalationAssistantSkill } from "./escalation-assistant";
export { customerSupportAssistantSkill } from "./customer-support-assistant";
export { installationGuideAssistantSkill } from "./installation-guide-assistant";

import { faqAssistantSkill } from "./faq-assistant";
import { onboardingAssistantSkill } from "./onboarding-assistant";
import { invoiceExplanationAssistantSkill } from "./invoice-explanation-assistant";
import { escalationAssistantSkill } from "./escalation-assistant";
import { customerSupportAssistantSkill } from "./customer-support-assistant";
import { installationGuideAssistantSkill } from "./installation-guide-assistant";

export const CUSTOMER_SKILLS = [
  faqAssistantSkill,
  onboardingAssistantSkill,
  invoiceExplanationAssistantSkill,
  escalationAssistantSkill,
  customerSupportAssistantSkill,
  installationGuideAssistantSkill,
] as const;
