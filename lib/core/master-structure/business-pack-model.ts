import type { BusinessPackActivationStage } from "./types";

/** Phase 500 Business Pack lifecycle */
export const BUSINESS_PACK_ACTIVATION_FLOW: readonly {
  stage: BusinessPackActivationStage;
  actor: "platform" | "app" | "employee";
  description: string;
}[] = [
  {
    stage: "platform_catalog",
    actor: "platform",
    description: "PLATFORM sells and lists Business Pack in catalog.",
  },
  {
    stage: "app_purchased",
    actor: "app",
    description: "APP purchases or activates the pack for the organization.",
  },
  {
    stage: "pack_activated",
    actor: "app",
    description: "Pack installed and activated on tenant.",
  },
  {
    stage: "menu_visible",
    actor: "app",
    description: "Pack navigation appears in APP when licensed.",
  },
  {
    stage: "access_granted",
    actor: "app",
    description: "APP admin grants roles/permissions for pack modules.",
  },
  {
    stage: "employee_use",
    actor: "employee",
    description: "EMPLOYEES use pack modules within granted scope.",
  },
];

export const BUSINESS_PACK_RULES = [
  "PLATFORM sells Business Packs.",
  "APP purchases Business Packs.",
  "APP installs Business Packs.",
  "APP grants access.",
  "EMPLOYEES use Business Packs.",
  "Employees never purchase packs directly.",
] as const;
