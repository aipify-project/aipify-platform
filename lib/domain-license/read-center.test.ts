import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { performDomainLicenseAction } from "@/lib/domain-license";
import {
  DomainCenterAccessError,
  readOrganizationDomainCenter,
  type OrganizationDomainReadClient,
} from "@/lib/domain-license/read-center";
import type { RpcClient } from "@/lib/core/rpc-client";

const ROOT = process.cwd();
const ORG = "00000000-0000-4000-8000-0000000000b1";
const OTHER = "00000000-0000-4000-8000-0000000000b2";

const READ_PATHS = [
  "lib/website-kompis-site-context/load-sites.ts",
  "lib/website-kompis-connection/load-summary.ts",
  "app/api/app/domains/route.ts",
  "app/api/app/domains/website-kompis/route.ts",
  "app/api/assistant/domain-context/route.ts",
  "app/api/website-kompis/sites/route.ts",
  "app/api/website-kompis/faq/route.ts",
  "app/app/website-kompis/faq/page.tsx",
  "app/app/website-kompis/connection/page.tsx",
  "app/app/website-kompis/page.tsx",
];

for (const path of READ_PATHS) {
  const source = readFileSync(join(ROOT, path), "utf8");
  assert.doesNotMatch(source, /get_domain_license_center|getDomainLicenseCenter/);
  assert.doesNotMatch(source, /get_companion_domain_context|getCompanionDomainContext/);
}

const actionSource = readFileSync(join(ROOT, "app/api/app/domains/action/route.ts"), "utf8");
assert.match(actionSource, /performDomainLicenseAction/);
assert.doesNotMatch(actionSource, /get_domain_license_center|getDomainLicenseCenter/);

type Row = Record<string, unknown>;
type QueryValue = { data: unknown; error: { message: string } | null };

function queryValue(data: unknown): QueryValue {
  return { data, error: null };
}

function memoryAdmin(seed: { domains: Row[]; packs: Row[]; assignments: Row[]; pool: Row | null }) {
  const writes: string[] = [];
  const snapshot = JSON.stringify(seed);
  const admin: OrganizationDomainReadClient = {
    from(table: string) {
      return {
        select() {
          const filters: Array<[string, unknown]> = [];
          const builder = {
            eq(column: string, value: unknown) {
              filters.push([column, value]);
              return builder;
            },
            maybeSingle() {
              const org = filters.find(([column]) => column === "organization_id")?.[1];
              const data =
                table === "organization_domain_license_pool" && seed.pool?.organization_id === org
                  ? seed.pool
                  : null;
              return Promise.resolve(queryValue(data));
            },
            then<TResult1 = QueryValue, TResult2 = never>(
              onfulfilled?: ((value: QueryValue) => TResult1 | PromiseLike<TResult1>) | null,
              onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
            ): PromiseLike<TResult1 | TResult2> {
              const org = filters.find(([column]) => column === "organization_id")?.[1];
              const sourceRows =
                table === "organization_domains"
                  ? seed.domains
                  : table === "domain_business_pack_installations"
                    ? seed.packs
                    : table === "domain_user_assignments"
                      ? seed.assignments
                      : [];
              const data = sourceRows.filter((row) => row.organization_id === org);
              return Promise.resolve(queryValue(data)).then(onfulfilled, onrejected);
            },
          };
          return builder;
        },
      };
    },
  };
  return {
    admin,
    writes,
    unchanged() {
      return JSON.stringify(seed) === snapshot && writes.length === 0;
    },
  };
}

function session(
  userRole: string | null,
  organizationRole: string | null,
  organizationId: string | null = ORG,
  hasMembership = true,
): RpcClient {
  const calls: string[] = [];
  const client = {
    calls,
    async rpc(name: string) {
      calls.push(name);
      if (name !== "get_app_organization_context") {
        throw new Error(`unexpected rpc ${name}`);
      }
      return {
        data: {
          authenticated: true,
          state: hasMembership ? "ready" : "membership_missing",
          user_role: userRole,
          organization_role: organizationRole,
          organization_id: organizationId,
          customer_id: organizationId,
          has_customer: true,
          has_organization_membership: hasMembership,
          has_app_access: hasMembership,
        },
        error: null,
      };
    },
  };
  return client as unknown as RpcClient & { calls: string[] };
}

const seed = {
  domains: [
    {
      id: "00000000-0000-4000-8000-0000000000d1",
      organization_id: ORG,
      domain: "example.com",
      display_name: "Example",
      domain_status: "active",
      connected_platform: "custom_website",
      license_status: "included",
      is_primary: true,
      verification_status: "verified",
      created_at: "2026-10-01T00:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-8000-0000000000d2",
      organization_id: ORG,
      domain: "pending.example",
      domain_status: "pending",
      is_primary: false,
      license_status: "licensed",
      verification_status: "pending",
      created_at: "2026-10-02T00:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-8000-0000000000d3",
      organization_id: OTHER,
      domain: "other.example",
      domain_status: "active",
      is_primary: true,
    },
  ],
  packs: [
    {
      organization_id: ORG,
      domain_id: "00000000-0000-4000-8000-0000000000d1",
      pack_key: "pack_example",
      license_status: "active",
      installed_at: "2026-10-03T00:00:00.000Z",
    },
  ],
  assignments: [
    { organization_id: ORG, domain_id: "00000000-0000-4000-8000-0000000000d1" },
  ],
  pool: { organization_id: ORG, included_licenses: 1, purchased_licenses: 0 },
};

async function readAs(userRole: string, organizationRole: string) {
  const store = memoryAdmin(seed);
  const client = session(userRole, organizationRole) as RpcClient & { calls: string[] };
  const first = await readOrganizationDomainCenter(client, { admin: store.admin });
  const second = await readOrganizationDomainCenter(client, { admin: store.admin });
  await Promise.all([
    readOrganizationDomainCenter(client, { admin: store.admin }),
    readOrganizationDomainCenter(client, { admin: store.admin }),
  ]);
  assert.deepEqual(client.calls, [
    "get_app_organization_context",
    "get_app_organization_context",
    "get_app_organization_context",
    "get_app_organization_context",
  ]);
  assert.equal(store.unchanged(), true);
  assert.deepEqual(first, second);
  return first;
}

async function main() {
const owner = await readAs("owner", "owner");
assert.equal(owner.found, true);
assert.equal(owner.primary_domain_id, "00000000-0000-4000-8000-0000000000d1");
assert.equal(owner.active_domains?.length, 1);
assert.equal(owner.active_domains?.[0]?.domain, "example.com");
assert.equal(owner.pending_domains?.length, 1);
assert.equal(owner.active_domains?.[0]?.assigned_users, 1);
assert.equal(owner.license_summary?.used, 2);
assert.equal(owner.installed_packs?.length, 1);
assert.equal(owner.active_domains?.some((row) => row.domain === "other.example"), false);

const administrator = await readAs("staff", "administrator");
assert.equal(administrator.found, true);
assert.equal(administrator.active_domains?.length, 1);

const mappedAdmin = await readAs("staff", "organization_admin");
assert.equal(mappedAdmin.found, true);

for (const [userRole, organizationRole] of [
  ["admin", "viewer"],
  ["admin", "organization_member"],
  ["owner", "organization_manager"],
] as const) {
  const client = session(userRole, organizationRole) as RpcClient & { calls: string[] };
  const store = memoryAdmin(seed);
  await assert.rejects(
    () => readOrganizationDomainCenter(client, { admin: store.admin }),
    (error: unknown) => error instanceof DomainCenterAccessError,
  );
  assert.deepEqual(client.calls, ["get_app_organization_context"]);
  assert.equal(store.unchanged(), true);
}

const globalAdminWithoutMembership = session("admin", "organization_admin", ORG, false);
const deniedStore = memoryAdmin(seed);
await assert.rejects(
  () => readOrganizationDomainCenter(globalAdminWithoutMembership, { admin: deniedStore.admin }),
  (error: unknown) => error instanceof DomainCenterAccessError,
);
assert.equal(deniedStore.unchanged(), true);

const emptyStore = memoryAdmin({ domains: [], packs: [], assignments: [], pool: null });
const empty = await readOrganizationDomainCenter(session("owner", "owner"), { admin: emptyStore.admin });
assert.equal(empty.found, true);
assert.equal(empty.primary_domain_id, undefined);
assert.deepEqual(empty.active_domains, []);
assert.deepEqual(empty.pending_domains, []);
assert.equal(empty.license_summary, undefined);
assert.equal(emptyStore.unchanged(), true);

const missingOrg = session("owner", "owner", null);
const missing = await readOrganizationDomainCenter(missingOrg, { admin: memoryAdmin(seed).admin });
assert.equal(missing.found, false);

const mutationCalls: string[] = [];
await performDomainLicenseAction(
  {
    async rpc(name: string) {
      mutationCalls.push(name);
      return { data: { ok: true, domain_id: "00000000-0000-4000-8000-0000000000d4" }, error: null };
    },
  } as unknown as RpcClient,
  "create_domain",
  { domain: "new.example", connected_platform: "custom_website" },
);
assert.deepEqual(mutationCalls, ["perform_domain_license_action"]);

console.log("domain-license/read-center.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
