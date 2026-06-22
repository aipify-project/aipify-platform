import type { CompanionMetricKind } from "./companion-query-match";

export type MetricValueState = "value" | "zero" | "null" | "missing";

export type MetricExtraction = {
  kind: CompanionMetricKind;
  state: MetricValueState;
  label: string;
  value?: string | number | boolean;
  items?: string[];
  groups?: Array<{ key: string; count: number }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pickField(data: Record<string, unknown>, field: string | null): unknown {
  if (field && field in data) return data[field];
  return undefined;
}

function firstArrayField(data: Record<string, unknown>): { key: string; value: unknown[] } | null {
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) return { key, value };
  }
  return null;
}

function classifyNumeric(value: unknown): MetricValueState {
  if (value === null) return "null";
  if (value === undefined) return "missing";
  if (typeof value === "number") return value === 0 ? "zero" : "value";
  if (typeof value === "string" && value.trim() === "") return "missing";
  return "value";
}

export function extractMetricFromData(
  data: Record<string, unknown>,
  kind: CompanionMetricKind,
  field: string | null,
): MetricExtraction {
  const label = field ?? kind;

  if (kind === "count") {
    const direct = pickField(data, field);
    const arrayField = firstArrayField(data);
    const target = Array.isArray(direct) ? direct : arrayField?.value;
    if (!target) {
      return { kind, state: "missing", label };
    }
    const count = target.length;
    return {
      kind,
      state: count === 0 ? "zero" : "value",
      label: field ?? arrayField?.key ?? "count",
      value: count,
    };
  }

  if (kind === "total") {
    const raw = pickField(data, field ?? "total");
    const state = classifyNumeric(raw);
    if (state === "missing") return { kind, state, label };
    return { kind, state, label, value: raw as number };
  }

  if (kind === "status") {
    const candidates = [field ?? "status", "availability", "connection_status"].filter(Boolean) as string[];
    for (const key of candidates) {
      if (!(key in data)) continue;
      const raw = data[key];
      if (raw === null) return { kind, state: "null", label: key };
      return { kind, state: "value", label: key, value: String(raw) };
    }
    return { kind, state: "missing", label };
  }

  if (kind === "list") {
    const raw = pickField(data, field);
    const arrayField = Array.isArray(raw) ? raw : firstArrayField(data)?.value;
    if (!arrayField) return { kind, state: "missing", label };
    const items = arrayField.map((entry) => String(entry));
    return {
      kind,
      state: items.length === 0 ? "zero" : "value",
      label: field ?? "list",
      items,
    };
  }

  if (kind === "latest") {
    const raw =
      pickField(data, field ?? "checked_at") ??
      pickField(data, "last_verified_at") ??
      pickField(data, "last_used_at");
    if (raw === undefined) return { kind, state: "missing", label };
    if (raw === null) return { kind, state: "null", label };
    return { kind, state: "value", label, value: String(raw) };
  }

  if (kind === "trend") {
    const raw = pickField(data, field ?? "trend");
    if (!isRecord(raw)) return { kind, state: "missing", label };
    const groups = Object.entries(raw)
      .filter(([, value]) => typeof value === "number")
      .map(([key, value]) => ({ key, count: value as number }));
    if (groups.length === 0) return { kind, state: "missing", label };
    return { kind, state: "value", label, groups };
  }

  if (kind === "grouped_count") {
    const raw = pickField(data, field);
    if (!isRecord(raw)) return { kind, state: "missing", label };
    const groups = Object.entries(raw).map(([key, value]) => ({
      key,
      count: typeof value === "number" ? value : Number(value) || 0,
    }));
    return {
      kind,
      state: groups.length === 0 ? "zero" : "value",
      label,
      groups,
    };
  }

  return { kind, state: "missing", label };
}

export function formatMetricStateLabel(
  state: MetricValueState,
  t: (key: string) => string,
): string {
  switch (state) {
    case "missing":
      return t("customerApp.companionPlatformKnowledge.grounded.valueMissing");
    case "null":
      return t("customerApp.companionPlatformKnowledge.grounded.valueNull");
    case "zero":
      return t("customerApp.companionPlatformKnowledge.grounded.valueZero");
    default:
      return "";
  }
}
