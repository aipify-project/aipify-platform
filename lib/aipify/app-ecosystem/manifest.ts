import { APP_CATEGORIES, APP_RISK_LEVELS } from "./types";

export type AppManifest = {
  name: string;
  app_key: string;
  version: string;
  author: string;
  description?: string;
  category: string;
  permissions: string[];
  deployment_modes?: string[];
  required_modules?: string[];
  minimum_aipify_version?: string;
  risk_level: string;
  support_contact?: string;
};

const REQUIRED_FIELDS: (keyof AppManifest)[] = [
  "name",
  "app_key",
  "version",
  "author",
  "category",
  "permissions",
  "risk_level",
];

/** Client-side manifest validation (mirrors server validate_app_manifest). */
export function validateAppManifest(manifest: Partial<AppManifest>): {
  valid: boolean;
  errors: string[];
  sandbox_required: boolean;
} {
  const errors: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    const val = manifest[field];
    if (val === undefined || val === null || val === "") {
      errors.push(`missing_${field}`);
    }
  }

  if (manifest.category && !APP_CATEGORIES.includes(manifest.category as (typeof APP_CATEGORIES)[number])) {
    errors.push("invalid_category");
  }

  if (manifest.risk_level && !APP_RISK_LEVELS.includes(manifest.risk_level as (typeof APP_RISK_LEVELS)[number])) {
    errors.push("invalid_risk_level");
  }

  if (manifest.permissions && !Array.isArray(manifest.permissions)) {
    errors.push("permissions_must_be_array");
  }

  return {
    valid: errors.length === 0,
    errors,
    sandbox_required: manifest.author !== "Aipify",
  };
}
