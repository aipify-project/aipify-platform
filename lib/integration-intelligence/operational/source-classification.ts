export type OperationalDataClassification =
  | "live"
  | "demo"
  | "seed"
  | "test"
  | "showcase"
  | "unknown";

export type OperationalReadiness = "ready" | "unavailable" | "uncertified";

export type OperationalFreshness = "fresh" | "stale" | "unknown";

export type OperationalSourceMetadata = {
  data_classification?: string | null;
  source_verified?: boolean | null;
  readiness?: string | null;
  freshness?: string | null;
  source_reference?: string | null;
};

function normalizeClassification(
  value: string | null | undefined,
): OperationalDataClassification | null {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (
    normalized === "live" ||
    normalized === "demo" ||
    normalized === "seed" ||
    normalized === "test" ||
    normalized === "showcase" ||
    normalized === "unknown"
  ) {
    return normalized;
  }
  return null;
}

function normalizeReadiness(value: string | null | undefined): OperationalReadiness | null {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "ready" || normalized === "unavailable" || normalized === "uncertified") {
    return normalized;
  }
  return null;
}

/** Live customer operational data — requires explicit certified provider metadata. */
export function isPresentableOperationalRecord(record: OperationalSourceMetadata): boolean {
  const classification = normalizeClassification(record.data_classification);
  const readiness = normalizeReadiness(record.readiness);

  if (!classification || classification !== "live") return false;
  if (record.source_verified !== true) return false;
  if (!readiness || readiness !== "ready") return false;
  return true;
}

export function resolveOperationalMetadataGapReason(
  record: OperationalSourceMetadata,
): "demo_data_not_presentable" | "source_unavailable" | "registry_not_connected" {
  const classification = normalizeClassification(record.data_classification);
  if (!classification || classification === "unknown") return "registry_not_connected";
  if (classification !== "live") return "demo_data_not_presentable";
  if (record.source_verified !== true) return "registry_not_connected";
  if (normalizeReadiness(record.readiness) === "uncertified") return "registry_not_connected";
  return "source_unavailable";
}

export function isUncertifiedOperationalRecord(record: OperationalSourceMetadata): boolean {
  const classification = normalizeClassification(record.data_classification);
  const readiness = normalizeReadiness(record.readiness);
  if (!classification || classification === "unknown") return true;
  if (!readiness || readiness === "uncertified") return true;
  return false;
}
