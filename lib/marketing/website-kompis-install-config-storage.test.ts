import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  WEBSITE_KOMPIS_INSTALL_CONFIG_READ_RPC,
  WEBSITE_KOMPIS_INSTALL_CONFIG_UPDATE_RPC,
  WEBSITE_KOMPIS_PUBLIC_INSTALL_CONFIG_RPC,
  loadWebsiteKompisInstallConfigFromStorage,
} from "@/lib/marketing/website-kompis-install-config-storage";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20261932700000_website_kompis_install_config_storage.sql",
  ),
  "utf8",
);

assert.match(migration, /tenant_public_companion_install_config/);
assert.match(migration, /get_website_kompis_install_config/);
assert.match(migration, /get_website_kompis_public_install_config/);
assert.match(migration, /update_website_kompis_install_config/);
assert.match(migration, /_wpkf_sanitize_install_config_patch/);
assert.match(migration, /_wpkf_normalize_install_config_json/);
assert.match(migration, /grant execute on function public\.get_website_kompis_public_install_config\(uuid, text\) to anon;/);
assert.match(
  migration,
  /grant execute on function public\.update_website_kompis_install_config\(uuid, jsonb\) to authenticated;/,
);
assert.match(migration, /revoke all on function public\.update_website_kompis_install_config\(uuid, jsonb\) from public, anon;/);
assert.match(migration, /iconUrl/);
assert.match(migration, /website_kompis_install_config/);
assert.equal(migration.includes("tenant_id"), true);
assert.equal(migration.includes("grant select"), true);

assert.equal(WEBSITE_KOMPIS_INSTALL_CONFIG_READ_RPC, "get_website_kompis_install_config");
assert.equal(
  WEBSITE_KOMPIS_PUBLIC_INSTALL_CONFIG_RPC,
  "get_website_kompis_public_install_config",
);
assert.equal(WEBSITE_KOMPIS_INSTALL_CONFIG_UPDATE_RPC, "update_website_kompis_install_config");

async function runStorageLoaderTests() {
  const installId = "11111111-1111-4111-8111-111111111111";
  const domain = "example-a.test";

  const loaded = await loadWebsiteKompisInstallConfigFromStorage(
    { installId, domain },
    {
      supabase: {
        rpc: async () => ({
          data: {
            ok: true,
            install_id: installId,
            config: {
              iconVariant: "companion-purple-dark",
              enabled: false,
            },
            normalized_config: {
              iconVariant: "companion-purple-dark",
              enabled: false,
            },
            updated_at: "2026-07-05T12:00:00.000Z",
          },
          error: null,
        }),
      } as unknown as Pick<SupabaseClient, "rpc">,
    },
  );

  assert.deepEqual(loaded, {
    iconVariant: "companion-purple-dark",
    enabled: false,
  });

  const missing = await loadWebsiteKompisInstallConfigFromStorage(
    { installId, domain },
    {
      supabase: {
        rpc: async () => ({ data: { ok: false }, error: null }),
      } as unknown as Pick<SupabaseClient, "rpc">,
    },
  );
  assert.equal(missing, null);

  const noContext = await loadWebsiteKompisInstallConfigFromStorage(
    { installId: null, domain: null },
    {
      supabase: {
        rpc: async () => {
          throw new Error("RPC should not run without visitor context");
        },
      } as unknown as Pick<SupabaseClient, "rpc">,
    },
  );
  assert.equal(noContext, null);
}

runStorageLoaderTests()
  .then(() => {
    console.log("website-kompis-install-config-storage.test.ts: all assertions passed");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
