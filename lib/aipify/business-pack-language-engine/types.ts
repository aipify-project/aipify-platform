export type PackLocale = "en" | "no" | "sv" | "da" | "de" | "es" | "fr" | "nl" | "pl" | "uk";

export type TranslationStatus = "complete" | "partial" | "pending";

export type PackLanguageRow = {
  locale: string;
  label: string;
  translation_status: TranslationStatus;
  enabled: boolean;
  regional?: {
    date_format?: string;
    number_format?: string;
    currency?: string;
    timezone?: string;
  };
};

export type BusinessPackLanguageCenter = {
  found: boolean;
  pack_key?: string;
  principle?: string;
  definition?: {
    pack_name: string;
    mandatory_languages: string[];
    optional_languages: string[];
    default_language: string;
    locale_namespace: string;
    locale_resource_path: string;
    localization_scope: string[];
    translation_completion_percent: number;
  };
  overview?: {
    installed_languages: PackLanguageRow[];
    available_languages: PackLanguageRow[];
    default_language: string;
    default_language_label: string;
    translation_completion_percent: number;
    installation_complete: boolean;
    resources_generated_at: string | null;
  };
  installation_flow?: string[];
  fallback_rules?: string[];
  notifications?: Array<{ key: string; localized: boolean }>;
  governance_note?: string;
  language_center_route?: string;
  landing_route?: string;
};

export type BusinessPackLanguageEngineDashboard = {
  has_access: boolean;
  is_platform_admin?: boolean;
  principle?: string;
  mandatory_languages?: string[];
  optional_languages?: string[];
  installation_flow?: string[];
  localization_scope?: string[];
  governance?: Record<string, string>;
  forbidden?: string[];
  summary?: Record<string, number>;
  definitions?: Array<Record<string, unknown>>;
  recent_audit?: Array<Record<string, unknown>>;
  success_criteria?: string[];
};

/** Maps pack_key to locale file slug under locales/{locale}/packs/ or top-level namespace. */
export const PACK_LOCALE_NAMESPACE: Record<string, string> = {
  aipify_hosts: "hosts",
  aipify_commerce: "packs/aipify-commerce",
  aipify_support: "packs/aipify-support",
  aipify_executive: "packs/aipify-executive",
  aipify_growth: "packs/aipify-growth",
  general_business: "packs/aipify-essentials",
};

export const MANDATORY_PACK_LANGUAGES = ["en", "no", "sv", "da"] as const;
