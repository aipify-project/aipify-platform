import type { KompisConfirmationLevel } from "./enums";
import { getKompisWorkspaceToolDefinition } from "./tool-registry";
import type { KompisConfirmationCard, KompisWorkspacePermissions } from "./types";

export type BuildConfirmationInput = {
  tool_key: string;
  permissions: KompisWorkspacePermissions;
  summary: string;
  consequences: string[];
  is_public?: boolean;
  is_financial?: boolean;
  is_irreversible?: boolean;
  now?: Date;
  confirmation_id?: string;
};

export type ConfirmationGateResult =
  | { ok: true; level: "none"; proceed: true }
  | { ok: true; level: Exclude<KompisConfirmationLevel, "none" | "prohibited">; card: KompisConfirmationCard }
  | { ok: false; code: string; message: string };

/**
 * Canonical confirmation gate. Kompis never confirms on behalf of the user.
 * Writes with public/financial/irreversible consequence require at least explicit/strong.
 */
export function evaluateKompisConfirmationGate(input: BuildConfirmationInput): ConfirmationGateResult {
  if (!input.permissions.enabled) {
    return { ok: false, code: "workspace_disabled", message: "Workspace assistant is not enabled" };
  }
  if (!input.permissions.allowed_tools.includes(input.tool_key)) {
    return { ok: false, code: "tool_denied", message: "Tool is not allowed for this user" };
  }

  const def = getKompisWorkspaceToolDefinition(input.tool_key);
  if (!def || !def.enabled || def.deprecated) {
    return { ok: false, code: "tool_unavailable", message: "Tool is unavailable" };
  }

  let level =
    input.permissions.confirmation_levels[input.tool_key] ?? def.default_confirmation;

  if (level === "prohibited") {
    return { ok: false, code: "tool_prohibited", message: "Tool is prohibited by policy" };
  }

  if (def.kind === "write" || def.kind === "draft") {
    if (input.is_irreversible && (level === "none" || level === "lightweight")) {
      level = "strong";
    } else if (
      (input.is_public || input.is_financial) &&
      (level === "none" || level === "lightweight")
    ) {
      level = "explicit";
    }
  }

  if (level === "none") {
    return { ok: true, level: "none", proceed: true };
  }

  const now = input.now ?? new Date();
  const expires = new Date(now.getTime() + 10 * 60 * 1000);

  return {
    ok: true,
    level,
    card: {
      confirmation_id: input.confirmation_id ?? `conf_${now.getTime()}`,
      tool_key: input.tool_key,
      level,
      summary: input.summary.trim(),
      consequences: input.consequences.map((c) => c.trim()).filter(Boolean),
      is_public: input.is_public === true,
      is_financial: input.is_financial === true,
      is_irreversible: input.is_irreversible === true,
      expires_at: expires.toISOString(),
    },
  };
}

export function requiresUserConfirmation(level: KompisConfirmationLevel): boolean {
  return level === "lightweight" || level === "explicit" || level === "strong";
}
