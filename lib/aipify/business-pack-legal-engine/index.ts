export * from "./types";
export * from "./parse";
export * from "./render";

export const BUSINESS_PACK_LEGAL_PRINCIPLE =
  "No Business Pack may be published without approved legal foundations. Company information inherits from company.config.ts only.";

export const LEGAL_DOCUMENT_LABELS: Record<string, string> = {
  terms_and_conditions: "Terms & Conditions",
  license_agreement: "License Agreement",
  acceptable_use_policy: "Acceptable Use Policy",
  privacy_addendum: "Privacy Addendum",
  subscription_terms: "Subscription Terms",
  cancellation_policy: "Cancellation Policy",
  limitation_of_liability: "Limitation of Liability",
  governing_law: "Governing Law Statement",
};
