export type MarketingSearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: "page" | "knowledge" | "business_pack" | "enterprise" | "security" | "growth_partner";
};

export type WebsiteHealthReport = {
  checked_at: string;
  checks: Array<{
    id: string;
    status: "pass" | "warn" | "pending";
    summary: string;
  }>;
  completion: Array<{ id: string; complete: boolean }>;
};

export type WebsiteGovernanceBundle = {
  version: string;
  approved_terms: string[];
  forbidden_terms: string[];
  design: Record<string, unknown>;
  principles: string[];
  completion: Array<{ id: string; complete: boolean }>;
};
