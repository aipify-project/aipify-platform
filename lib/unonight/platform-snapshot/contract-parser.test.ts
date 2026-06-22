import assert from "node:assert/strict";
import test from "node:test";
import {
  organizationMatchesUnonightSnapshot,
  parseUnonightActiveModules,
  parseUnonightPlatformSnapshotDetailed,
} from "./contract-parser";

test("parses canonical nested platform snapshot contract", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    status: "available",
    api_version: "v1",
    organization: {
      id: "unonight",
      name: "Unonight",
      base_url: "https://www.unonight.com",
    },
    platform: {
      environment: "production",
      version: "2026.06",
      supported_locales: ["en", "no", "sv", "da"],
      active_modules: ["chat", "marketplace", "wishlist", "gifts", "verification", "rewards"],
    },
    checked_at: "2026-06-22T10:12:00.000Z",
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.snapshot.platform.active_modules, [
    "chat",
    "marketplace",
    "wishlist",
    "gifts",
    "verification",
    "rewards",
  ]);
});

test("parses flat Unonight-style payload with module objects and locale alias", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    status: "online",
    api_version: "v1",
    organization: {
      id: "unonight",
      name: "Unonight",
    },
    environment: "production",
    platform_version: "2026.06.1",
    modules: [
      { key: "chat", enabled: true },
      { key: "marketplace", enabled: true },
      { key: "legacy_feature", enabled: false },
    ],
    languages: ["en", "no", "sv", "da"],
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.snapshot.platform.active_modules, ["chat", "marketplace"]);
  assert.deepEqual(parsed.snapshot.platform.supported_locales, ["en", "no", "sv", "da"]);
  assert.equal(parsed.snapshot.organization.base_url, "https://www.unonight.com");
  assert.ok(parsed.snapshot.compatibilityNotes.includes("modules_alias"));
  assert.ok(parsed.snapshot.compatibilityNotes.includes("locales_alias"));
  assert.ok(parsed.snapshot.compatibilityNotes.includes("generated_checked_at"));
});

test("parses data-wrapped payload with modules map", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    data: {
      availability_status: "available",
      version: "v1",
      organization_id: "unonight",
      organization_name: "Unonight",
      environment: "production",
      platform_version: "2026.06.1",
      modules: {
        chat: true,
        marketplace: true,
        verification: true,
      },
    },
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.snapshot.platform.active_modules, ["chat", "marketplace", "verification"]);
  assert.ok(parsed.snapshot.compatibilityNotes.includes("data_wrapper"));
  assert.ok(parsed.snapshot.compatibilityNotes.includes("locales_missing"));
});

test("rejects unsafe payload keys", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    status: "available",
    api_version: "v1",
    organization: { id: "unonight", name: "Unonight", base_url: "https://www.unonight.com" },
    platform: {
      environment: "production",
      version: "1",
      supported_locales: ["en"],
      active_modules: ["chat"],
    },
    users: [],
    checked_at: "2026-06-22T10:12:00.000Z",
  });

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.code, "unsafe_payload");
});

test("module parser excludes disabled and unsafe module entries", () => {
  assert.deepEqual(
    parseUnonightActiveModules([
      { key: "chat", enabled: true },
      { key: "demo_mode", enabled: true },
      { key: "marketplace", enabled: false },
      "verification",
    ]),
    ["chat", "verification"],
  );
});

test("parses legacy Unonight nested platform.availability contract", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    organization: {
      name: "Unonight",
      slug: "unonight",
    },
    environment: "production",
    supported_locales: ["en"],
    active_modules: ["chat", "marketplace", "gifts"],
    platform: {
      availability: "available",
      api_version: "v1",
      checked_at: "2026-06-22T11:45:30.821909+00:00",
    },
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.snapshot.status, "available");
  assert.ok(parsed.snapshot.compatibilityNotes.includes("availability_alias"));
});

test("reports availability_status_missing when no status field exists", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    api_version: "v1",
    organization: { id: "unonight", name: "Unonight", base_url: "https://www.unonight.com" },
    platform: {
      environment: "production",
      supported_locales: ["en"],
      active_modules: ["chat"],
    },
    checked_at: "2026-06-22T10:12:00.000Z",
  });

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.code, "availability_status_missing");
});

test("reports availability_status_unknown for unrecognized status values", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    status: "mystery_state",
    api_version: "v1",
    organization: { id: "unonight", name: "Unonight", base_url: "https://www.unonight.com" },
    platform: {
      environment: "production",
      supported_locales: ["en"],
      active_modules: ["chat"],
    },
    checked_at: "2026-06-22T10:12:00.000Z",
  });

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.code, "availability_status_unknown");
});

test("maps is_available boolean to canonical status", () => {
  const parsed = parseUnonightPlatformSnapshotDetailed({
    is_available: true,
    api_version: "v1",
    organization: { id: "unonight", name: "Unonight", base_url: "https://www.unonight.com" },
    platform: {
      environment: "production",
      supported_locales: ["en"],
      active_modules: ["chat"],
    },
    checked_at: "2026-06-22T10:12:00.000Z",
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.snapshot.status, "available");
});

test("organization slug matching accepts Unonight namespace id", () => {
  assert.equal(
    organizationMatchesUnonightSnapshot({
      organizationId: "unonight",
      expectedOrganizationSlug: "unonight",
    }),
    true,
  );
});
