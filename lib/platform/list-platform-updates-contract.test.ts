import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();

function sha256File(relPath: string): string {
  const body = readFileSync(join(ROOT, relPath));
  return createHash("sha256").update(body).digest("hex");
}

/** Mirrors PlatformUpdatesPanel missing-RPC detection (contract). */
export function isMissingListPlatformUpdatesError(message: string | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes("could not find the function") ||
    m.includes("does not exist") ||
    m.includes("list_platform_updates") ||
    m.includes("42883") ||
    m.includes("pgrst202")
  );
}

test("v1 candidate SHA matches gate expectation (do not mutate silently)", () => {
  const expected = "0c4775ab98b2d5b82d61341d764d73eef2d209db6cd852b3037f661ca666e2f5";
  const actual = sha256File(
    "docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_v1.sql",
  );
  assert.equal(actual, expected);
});

test("hardened v2 candidate SHA matches sidecar file", () => {
  const actual = sha256File(
    "docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_hardened_v2.sql",
  );
  const sidecar = readFileSync(
    join(
      ROOT,
      "docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_hardened_v2.sql.sha256",
    ),
    "utf8",
  )
    .trim()
    .split(/\s+/)[0];
  assert.equal(actual, sidecar);
  assert.equal(
    actual,
    "92c7e51e7f92015617c59a1a9e4d797a53bbf5e7c00fc28da1653f836380a55a",
  );
});

test("hardened v2 revokes PUBLIC/anon and keeps response shape + admin gate", () => {
  const sql = readFileSync(
    join(
      ROOT,
      "docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_hardened_v2.sql",
    ),
    "utf8",
  );
  assert.match(sql, /security definer/i);
  assert.match(sql, /set search_path = public/i);
  assert.match(sql, /is_platform_admin\(\)/);
  assert.match(sql, /raise exception 'Not authorized'/);
  assert.match(sql, /from public\.platform_updates u/);
  assert.match(sql, /platform_update_targets/);
  assert.match(sql, /revoke all on function public\.list_platform_updates\(\) from public;/i);
  assert.match(sql, /revoke all on function public\.list_platform_updates\(\) from anon;/i);
  assert.match(sql, /grant execute on function public\.list_platform_updates\(\) to authenticated;/i);
  assert.doesNotMatch(sql, /insert into public\.platform_updates/i);
  assert.doesNotMatch(sql, /update public\.platform_updates/i);
  assert.doesNotMatch(sql, /delete from public\.platform_updates/i);
});

test("missing RPC detector covers PostgREST/Postgres absence codes", () => {
  assert.equal(
    isMissingListPlatformUpdatesError('Could not find the function public.list_platform_updates'),
    true,
  );
  assert.equal(isMissingListPlatformUpdatesError("function does not exist"), true);
  assert.equal(isMissingListPlatformUpdatesError("PGRST202"), true);
  assert.equal(isMissingListPlatformUpdatesError("42883"), true);
  assert.equal(isMissingListPlatformUpdatesError("Not authorized"), false);
  assert.equal(isMissingListPlatformUpdatesError(undefined), false);
});

test("locale parity for deployments rpc-missing and retry keys", () => {
  const locales = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
  for (const locale of locales) {
    const data = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
    ) as {
      driftHub?: {
        deployments?: {
          rpcMissingTitle?: string;
          rpcMissingBody?: string;
          loadError?: string;
          retry?: string;
          empty?: string;
        };
      };
    };
    const dep = data.driftHub?.deployments;
    assert.ok(dep?.rpcMissingTitle, `missing rpcMissingTitle ${locale}`);
    assert.ok(dep?.rpcMissingBody, `missing rpcMissingBody ${locale}`);
    assert.ok(dep?.loadError, `missing loadError ${locale}`);
    assert.ok(dep?.retry, `missing retry ${locale}`);
    assert.ok(dep?.empty, `missing empty ${locale}`);
  }

  const no = JSON.parse(
    readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"),
  ) as {
    driftHub: { deployments: { rpcMissingTitle: string; retry: string } };
  };
  assert.equal(
    no.driftHub.deployments.rpcMissingTitle,
    "Oppdateringshistorikk er ikke tilgjengelig i dette miljøet",
  );
  assert.equal(no.driftHub.deployments.retry, "Prøv igjen");
});

console.log("list-platform-updates-contract: all tests passed");
