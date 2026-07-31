/**
 * Classify identities that must never appear in ordinary customer APP views.
 * Prefer authoritative markers when present; fall back to durable patterns
 * for gate/smoke/probe accounts created without classification columns.
 */

export type AppIdentityClassification =
  | "REAL_CUSTOMER_DATA"
  | "QA_FIXTURE"
  | "SMOKE_TEST"
  | "PROBE_DATA"
  | "DEMO_DATA"
  | "EXAMPLE_PLACEHOLDER"
  | "UNKNOWN";

const NON_PRODUCTION_EMAIL_PATTERNS: RegExp[] = [
  /\.invalid$/i,
  /@example\.com$/i,
  /@example\./i,
  /@aipify-gate\.invalid$/i,
  /@.*aipify-showcase\.invalid$/i,
];

const NON_PRODUCTION_NAME_PATTERNS: RegExp[] = [
  /^oaa-debug-/i,
  /^oaa-direct-grant-probe-/i,
  /^oaa-gate-/i,
  /^p\d+[a-z]*-smoke-/i,
  /-smoke-viewer-/i,
  /-probe-/i,
  /^Former Employee Demo$/i,
];

export function classifyAppIdentity(input: {
  email?: string | null;
  fullName?: string | null;
  name?: string | null;
  classification?: string | null;
}): AppIdentityClassification {
  const explicit = String(input.classification ?? "")
    .trim()
    .toLowerCase();
  if (explicit === "live" || explicit === "real" || explicit === "production") {
    return "REAL_CUSTOMER_DATA";
  }
  if (explicit === "demo" || explicit === "seed" || explicit === "showcase") {
    return "DEMO_DATA";
  }
  if (explicit === "test" || explicit === "qa") {
    return "QA_FIXTURE";
  }
  if (explicit === "smoke") {
    return "SMOKE_TEST";
  }
  if (explicit === "probe") {
    return "PROBE_DATA";
  }

  const email = String(input.email ?? "").trim();
  const name = String(input.fullName ?? input.name ?? "").trim();

  if (NON_PRODUCTION_EMAIL_PATTERNS.some((re) => re.test(email))) {
    if (/smoke/i.test(email) || /smoke/i.test(name)) return "SMOKE_TEST";
    if (/probe/i.test(email) || /probe/i.test(name)) return "PROBE_DATA";
    if (/example\.com/i.test(email)) return "EXAMPLE_PLACEHOLDER";
    if (/showcase/i.test(email)) return "DEMO_DATA";
    return "QA_FIXTURE";
  }

  if (NON_PRODUCTION_NAME_PATTERNS.some((re) => re.test(name))) {
    if (/smoke/i.test(name)) return "SMOKE_TEST";
    if (/probe/i.test(name)) return "PROBE_DATA";
    return "QA_FIXTURE";
  }

  if (!email && !name) return "UNKNOWN";
  return "REAL_CUSTOMER_DATA";
}

export function isProductionPresentableIdentity(input: {
  email?: string | null;
  fullName?: string | null;
  name?: string | null;
  classification?: string | null;
}): boolean {
  return classifyAppIdentity(input) === "REAL_CUSTOMER_DATA";
}

export function filterProductionPresentableIdentities<
  T extends {
    email?: string | null;
    full_name?: string | null;
    fullName?: string | null;
    name?: string | null;
    classification?: string | null;
  },
>(items: T[]): T[] {
  return items.filter((item) =>
    isProductionPresentableIdentity({
      email: item.email,
      fullName: item.full_name ?? item.fullName,
      name: item.name,
      classification: item.classification,
    }),
  );
}
