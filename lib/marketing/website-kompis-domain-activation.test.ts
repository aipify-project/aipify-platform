import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  WEBSITE_KOMPIS_ACTIVATE_DOMAIN_RPC,
  WEBSITE_KOMPIS_DEACTIVATE_DOMAIN_RPC,
  assertWebsiteKompisPublicActivationPayload,
  buildWebsiteKompisPublicEmbedPayload,
  mapCustomerDomainRecordToActivationStatus,
  parseWebsiteKompisDomainActivationRpc,
  resolveWebsiteKompisTrustedVisitorContext,
} from "@/lib/marketing/website-kompis-domain-activation";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20261932800000_website_kompis_domain_activation_binding.sql",
  ),
  "utf8",
);

assert.match(migration, /activate_website_kompis_for_domain/);
assert.match(migration, /deactivate_website_kompis_for_domain/);
assert.match(migration, /_wpkf_assert_verified_domain_access/);
assert.match(migration, /grant execute on function public\.activate_website_kompis_for_domain\(uuid\) to authenticated;/);
assert.match(migration, /revoke all on function public\.activate_website_kompis_for_domain\(uuid\) from public, anon;/);
assert.match(migration, /verification_status <> 'verified'/);
assert.match(migration, /website_kompis_domain_activation/);

const exampleInstallId = "11111111-1111-4111-8111-111111111111";
const exampleDomain = "example-a.test";
const exampleDomainId = "22222222-2222-4222-8222-222222222222";

const rpcPayload = {
  ok: true,
  install_id: exampleInstallId,
  domain: exampleDomain,
  status: "active",
  enabled: true,
  normalized_config: {
    enabled: true,
    iconVariant: "companion-purple-light",
    welcomeMessageVariant: "compact",
    fallbackTone: "short-direct",
    sources: {
      faq: true,
      currentPage: true,
      publicSiteIndex: false,
      aipifyPublic: true,
    },
  },
};

const activation = parseWebsiteKompisDomainActivationRpc(rpcPayload);
assert.ok(activation);
assert.equal(activation.installId, exampleInstallId);
assert.equal(activation.domain, exampleDomain);
assert.equal(activation.status, "active");
assert.equal(activation.config.iconVariant, "companion-purple-light");
assert.equal("tenantId" in activation, false);
assert.equal("customerId" in activation, false);

const embedPayload = buildWebsiteKompisPublicEmbedPayload(activation!, {
  metadataOrigin: "https://aipify.ai",
});
assert.match(embedPayload.metadataUrl, /installId=11111111-1111-4111-8111-111111111111/);
assert.match(embedPayload.metadataUrl, /domain=example-a\.test/);
assert.equal(embedPayload.enabled, true);
assert.equal(embedPayload.normalizedConfig.iconVariant, "companion-purple-light");
assertWebsiteKompisPublicActivationPayload(embedPayload);

assert.equal(
  mapCustomerDomainRecordToActivationStatus({
    verificationStatus: "verified",
    status: "active",
    enabled: true,
  }),
  "active",
);
assert.equal(
  mapCustomerDomainRecordToActivationStatus({
    verificationStatus: "pending",
    status: "active",
  }),
  "pending_verification",
);
assert.equal(
  mapCustomerDomainRecordToActivationStatus({
    verificationStatus: "verified",
    status: "pending",
  }),
  "pending_verification",
);
assert.equal(
  mapCustomerDomainRecordToActivationStatus({
    verificationStatus: "verified",
    status: "active",
    enabled: false,
  }),
  "disabled",
);

const installIdOnly = resolveWebsiteKompisTrustedVisitorContext({
  installId: exampleInstallId,
  requestHost: "aipify.ai",
});
assert.equal(installIdOnly.installId, exampleInstallId);
assert.equal(installIdOnly.domain, null);

const domainOnly = resolveWebsiteKompisTrustedVisitorContext({
  clientDomain: exampleDomain,
  requestHost: "aipify.ai",
});
assert.equal(domainOnly.domain, exampleDomain);
assert.equal(domainOnly.installId, null);

const wrongDomain = resolveWebsiteKompisTrustedVisitorContext({
  installId: exampleInstallId,
  clientDomain: "wrong.example",
  requestHost: "aipify.ai",
});
assert.equal(wrongDomain.domain, "wrong.example");

assert.equal(parseWebsiteKompisDomainActivationRpc({ ok: false }), null);
assert.equal(parseWebsiteKompisDomainActivationRpc({ ok: true, install_id: "bad", domain: exampleDomain }), null);

async function runActivationRpcClientTests() {
  let activateArgs: Record<string, unknown> | null = null;
  const supabase = {
    rpc: async (name: string, args: Record<string, unknown>) => {
      if (name === WEBSITE_KOMPIS_ACTIVATE_DOMAIN_RPC) {
        activateArgs = args;
        return { data: rpcPayload, error: null };
      }
      if (name === WEBSITE_KOMPIS_DEACTIVATE_DOMAIN_RPC) {
        return {
          data: {
            ...rpcPayload,
            status: "disabled",
            enabled: false,
            normalized_config: { ...rpcPayload.normalized_config, enabled: false },
          },
          error: null,
        };
      }
      return { data: null, error: { message: "unexpected rpc" } };
    },
  } as unknown as Pick<SupabaseClient, "rpc">;

  const { activateWebsiteKompisForDomain, deactivateWebsiteKompisForDomain } = await import(
    "./website-kompis-domain-activation-client"
  );

  const activated = await activateWebsiteKompisForDomain(supabase, exampleDomainId);
  assert.deepEqual(activateArgs, { p_domain_id: exampleDomainId });
  assert.equal(activated?.installId, exampleInstallId);
  assert.equal(activated?.domain, exampleDomain);

  const deactivated = await deactivateWebsiteKompisForDomain(supabase, exampleDomainId);
  assert.equal(deactivated?.status, "disabled");
  assert.equal(deactivated?.config.enabled, false);
}

runActivationRpcClientTests()
  .then(() => {
    console.log("website-kompis-domain-activation.test.ts: all assertions passed");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
