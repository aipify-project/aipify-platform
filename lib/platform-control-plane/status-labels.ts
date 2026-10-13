/**
 * Canonical Platform label mapping for control-plane / settlement statuses.
 * Prefer this over per-page mappers. Technical codes are secondary only.
 */

import type { Translator } from "@/lib/i18n/translate";
import {
  isKnownControlPlaneStatus,
  toneForControlPlaneStatus,
  type PlatformControlPlaneStatus,
  type PlatformSemanticTone,
} from "./status";

export function labelSettlementOpsStatus(t: Translator, code: string | null | undefined): string {
  const key = (code ?? "unknown").trim() || "unknown";
  const path = `platform.controlPlane.settlementOps.statuses.${key}`;
  const translated = t(path);
  if (translated !== path) return translated;
  const unknown = t("platform.controlPlane.settlementOps.statuses.unknown");
  return unknown !== "platform.controlPlane.settlementOps.statuses.unknown" ? unknown : "Unknown";
}

export function presentControlPlaneOrSettlementStatus(
  t: Translator,
  code: string | null | undefined,
): { label: string; tone: PlatformSemanticTone; technicalCode: string | null } {
  const raw = (code ?? "").trim();
  if (!raw) {
    return {
      label: t("platform.controlPlane.health.unknown"),
      tone: "gray",
      technicalCode: null,
    };
  }

  if (isKnownControlPlaneStatus(raw)) {
    const status = raw as PlatformControlPlaneStatus;
    return {
      label: labelSettlementOpsStatus(t, raw),
      tone: toneForControlPlaneStatus(status),
      technicalCode: raw,
    };
  }

  const severityTone: PlatformSemanticTone =
    raw.includes("mismatch") || raw === "critical" || raw === "rejected"
      ? "red"
      : raw.includes("pending") || raw.includes("await") || raw === "attention"
        ? "amber"
        : raw === "paid" || raw === "approved" || raw === "matched"
          ? "green"
          : "gray";

  return {
    label: labelSettlementOpsStatus(t, raw),
    tone: severityTone,
    technicalCode: raw,
  };
}
