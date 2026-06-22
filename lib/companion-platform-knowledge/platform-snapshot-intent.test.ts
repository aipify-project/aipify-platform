import assert from "node:assert/strict";
import { parseUnonightPlatformSnapshotDetailed } from "@/lib/unonight/platform-snapshot/contract-parser";
import { detectLivePlatformSnapshotIntent } from "./platform-snapshot-intent";

const acceptanceQuery =
  "Hvilke moduler rapporterer Unonight som aktive akkurat nå? Hent svaret direkte fra den verifiserte Unonight-integrasjonen.";

const intent = detectLivePlatformSnapshotIntent(acceptanceQuery, { locale: "no" });
assert.ok(intent);
assert.equal(intent?.providerKey, "unonight");
assert.equal(intent?.queryKind, "platform_active_modules");
assert.equal(intent?.blocksKnowledgeCenter, true);

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
if (parsed.ok) {
  assert.deepEqual(parsed.snapshot.platform.active_modules, [
    "chat",
    "marketplace",
    "wishlist",
    "gifts",
    "verification",
    "rewards",
  ]);
}

console.log("companion platform snapshot tests passed");
