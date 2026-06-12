export const EMPLOYEE_RANGES = [
  "1-5",
  "6-25",
  "26-100",
  "101-250",
  "251-1000",
  "1000+",
] as const;

export type EmployeeRange = (typeof EMPLOYEE_RANGES)[number];

export const ORGANIZATION_TYPES = [
  "company",
  "growth_partner",
  "consultant",
  "freelancer",
  "internal_team_pilot",
] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const PRIMARY_USE_CASES = [
  "customer_support",
  "operations_automation",
  "executive_intelligence",
  "knowledge_management",
  "team_productivity",
  "commerce_operations",
  "growth_partner_services",
  "internal_pilot",
] as const;

export type PrimaryUseCase = (typeof PRIMARY_USE_CASES)[number];

export const INDUSTRIES = [
  "technology",
  "retail_ecommerce",
  "professional_services",
  "healthcare",
  "finance",
  "manufacturing",
  "education",
  "hospitality",
  "nonprofit",
  "other",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "protonmail.com",
  "proton.me",
  "aol.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
  "zoho.com",
] as const;

export const COUNTRY_OPTIONS = [
  { code: "NO", dial: "+47" },
  { code: "SE", dial: "+46" },
  { code: "DK", dial: "+45" },
  { code: "FI", dial: "+358" },
  { code: "GB", dial: "+44" },
  { code: "DE", dial: "+49" },
  { code: "US", dial: "+1" },
  { code: "NL", dial: "+31" },
  { code: "FR", dial: "+33" },
  { code: "ES", dial: "+34" },
] as const;

export const REGISTRATION_STORAGE_KEY = "aipify-registration-wizard";
