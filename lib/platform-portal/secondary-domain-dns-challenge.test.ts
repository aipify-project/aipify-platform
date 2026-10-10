import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  buildSecondaryDomainDnsRecordName,
  extractSecondaryDomainDnsChallengeToken,
  mapSecondaryDomainDnsChallengeRpcError,
  parseIssueSecondaryDomainDnsChallengeInput,
  parseIssueSecondaryDomainDnsChallengeResult,
  parseVerifySecondaryDomainDnsChallengeInput,
  parseVerifySecondaryDomainDnsChallengeResult,
} from "./secondary-domain-dns-challenge";

const CUSTOMER_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const INSTALL_ID = "bbbbbbbb-cccc-4ddd-8eee-ffffffffffff";
const DOMAIN_ID = "cccccccc-dddd-4eee-8fff-000000000000";
const CHALLENGE_ID = "dddddddd-eeee-4fff-8000-111111111111";
const TOKEN = "a".repeat(64);

const MIGRATION = join(
  process.cwd(),
  "supabase/migrations/20261937300000_core_secondary_host_dns_verify_existing_install_v1.sql",
);

describe("secondary domain DNS challenge parsers", () => {
  it("accepts valid issue input and rejects weak fields", () => {
    const ok = parseIssueSecondaryDomainDnsChallengeInput(CUSTOMER_ID, {
      installationId: INSTALL_ID,
      hostname: "www.example.com",
      internalReason: "bind secondary host for Website Kompis",
      idempotencyKey: "sdns-test-key-001",
      ttlHours: 24,
    });
    assert.equal(ok.ok, true);

    assert.equal(
      parseIssueSecondaryDomainDnsChallengeInput("bad", {
        installationId: INSTALL_ID,
        hostname: "www.example.com",
        internalReason: "reason long enough",
        idempotencyKey: "sdns-test-key-001",
      }).ok,
      false,
    );

    assert.equal(
      parseIssueSecondaryDomainDnsChallengeInput(CUSTOMER_ID, {
        installationId: INSTALL_ID,
        hostname: "www.example.com",
        internalReason: "no",
        idempotencyKey: "sdns-test-key-001",
      }).ok,
      false,
    );
  });

  it("parses issue and verify RPC payloads with safety flags", () => {
    const issued = parseIssueSecondaryDomainDnsChallengeResult({
      ok: true,
      idempotent_replay: false,
      customer_id: CUSTOMER_ID,
      installation_id: INSTALL_ID,
      domain: {
        id: DOMAIN_ID,
        hostname: "www.example.com",
        status: "pending",
        verification_status: "pending",
        installation_id: null,
      },
      challenge: {
        id: CHALLENGE_ID,
        status: "pending",
        dns_record_name: "_aipify-domain-challenge.www.example.com",
        dns_txt_value: TOKEN,
        expires_at: "2026-10-11T00:00:00Z",
        token_returned: true,
      },
      instructions: {
        record_type: "TXT",
        record_name: "_aipify-domain-challenge.www.example.com",
        record_value: TOKEN,
        note: "Publish then verify",
      },
      license_domain_reference_unchanged: true,
      installation_created: false,
    });
    assert.ok(issued);
    assert.equal(issued.challenge.dnsTxtValue, TOKEN);
    assert.equal(issued.licenseDomainReferenceUnchanged, true);
    assert.equal(issued.installationCreated, false);

    const verified = parseVerifySecondaryDomainDnsChallengeResult({
      ok: true,
      idempotent_replay: false,
      customer_id: CUSTOMER_ID,
      domain: {
        id: DOMAIN_ID,
        hostname: "www.example.com",
        status: "active",
        verification_status: "verified",
        installation_id: INSTALL_ID,
        verified_at: "2026-10-10T12:00:00Z",
      },
      challenge: {
        id: CHALLENGE_ID,
        status: "verified",
        verified_at: "2026-10-10T12:00:00Z",
      },
      license_domain_reference_unchanged: true,
      installation_created: false,
    });
    assert.ok(verified);
    assert.equal(verified.domain.verificationStatus, "verified");
    assert.equal(verified.domain.installationId, INSTALL_ID);
  });

  it("maps RPC errors without leaking secrets", () => {
    assert.deepEqual(mapSecondaryDomainDnsChallengeRpcError("HOSTNAME_OWNED_BY_OTHER_TENANT"), {
      status: 409,
      code: "hostname_owned_by_other_tenant",
    });
    assert.deepEqual(mapSecondaryDomainDnsChallengeRpcError("DNS_PROOF_MISMATCH"), {
      status: 409,
      code: "dns_proof_mismatch",
    });
    assert.deepEqual(mapSecondaryDomainDnsChallengeRpcError("CHALLENGE_EXPIRED"), {
      status: 409,
      code: "challenge_expired",
    });
  });
});

describe("secondary domain DNS TXT extraction", () => {
  it("builds deterministic record names", () => {
    assert.equal(
      buildSecondaryDomainDnsRecordName("www.Example.com."),
      "_aipify-domain-challenge.www.example.com",
    );
  });

  it("extracts exact and prefixed tokens; rejects empty", () => {
    assert.equal(
      extractSecondaryDomainDnsChallengeToken([[TOKEN]]),
      TOKEN,
    );
    assert.equal(
      extractSecondaryDomainDnsChallengeToken([[`aipify-domain-v1=${TOKEN}`]]),
      TOKEN,
    );
    assert.equal(extractSecondaryDomainDnsChallengeToken([["unrelated"]]), null);
    assert.equal(
      extractSecondaryDomainDnsChallengeToken([["wrong"]], TOKEN),
      null,
    );
  });

  it("requires presented token on verify input", () => {
    const missing = parseVerifySecondaryDomainDnsChallengeInput(CUSTOMER_ID, {
      challengeId: CHALLENGE_ID,
      internalReason: "verify secondary host after DNS",
      idempotencyKey: "sdns-verify-001",
    });
    assert.equal(missing.ok, false);

    const ok = parseVerifySecondaryDomainDnsChallengeInput(CUSTOMER_ID, {
      challengeId: CHALLENGE_ID,
      presentedToken: TOKEN,
      internalReason: "verify secondary host after DNS",
      idempotencyKey: "sdns-verify-001",
    });
    assert.equal(ok.ok, true);
  });
});

describe("secondary domain DNS migration contract", () => {
  const sql = readFileSync(MIGRATION, "utf8");

  it("creates challenge table with RLS forced and no public grants", () => {
    assert.match(sql, /create table if not exists public\.customer_domain_dns_challenges/);
    assert.match(sql, /enable row level security/);
    assert.match(sql, /force row level security/);
    assert.match(
      sql,
      /revoke all on table public\.customer_domain_dns_challenges from public, anon, authenticated/,
    );
  });

  it("issues pending domains without verified/active trust and without new installs", () => {
    assert.match(sql, /issue_platform_portal_secondary_domain_dns_challenge/);
    assert.match(sql, /null,\s*-- bind only after DNS proof/);
    assert.match(sql, /verification_status/);
    assert.match(sql, /'pending',\s*\n\s*'dns_txt'/);
    assert.match(sql, /INSTALLATION_CREATED_FORBIDDEN/);
    assert.match(sql, /LICENSE_DOMAIN_REFERENCE_MUTATION_FORBIDDEN/);
    assert.doesNotMatch(sql, /insert into public\.installations/i);
    assert.doesNotMatch(sql, /domain_reference\s*=/);
  });

  it("verify/bind requires presented token hash match and platform access", () => {
    assert.match(sql, /verify_and_bind_platform_portal_secondary_domain_dns_challenge/);
    assert.match(sql, /_ppsf258_require_platform_access\(\)/);
    assert.match(sql, /DNS_PROOF_MISMATCH/);
    assert.match(sql, /_secondary_domain_dns_challenge_hash/);
    assert.match(sql, /challenge_token_hash = repeat\('0', 64\)/);
    assert.doesNotMatch(sql, /p_verified\s+boolean/i);
    assert.doesNotMatch(sql, /verified\s*=\s*true/i);
  });

  it("grants execute only to authenticated and revokes public/anon", () => {
    assert.match(
      sql,
      /revoke all on function public\.issue_platform_portal_secondary_domain_dns_challenge[\s\S]*from public, anon;/,
    );
    assert.match(
      sql,
      /grant execute on function public\.issue_platform_portal_secondary_domain_dns_challenge[\s\S]*to authenticated;/,
    );
    assert.match(
      sql,
      /grant execute on function public\.verify_and_bind_platform_portal_secondary_domain_dns_challenge[\s\S]*to authenticated;/,
    );
  });

  it("audits without token material", () => {
    assert.match(sql, /platform_secondary_domain_dns_challenge_issue/);
    assert.match(sql, /platform_secondary_domain_dns_challenge_verify_bind/);
    assert.match(sql, /-- never include token or token hash/);
    assert.doesNotMatch(sql, /dns_txt_value.*audit/i);
  });

  it("does not hardcode customer or install identifiers", () => {
    assert.doesNotMatch(sql, /32d748eb-9a66-4174-a416-18a813610d3e/);
    assert.doesNotMatch(sql, /180c9d31-3340-4633-b210-3b64edf1e1be/);
    assert.doesNotMatch(sql, /unonight/i);
  });
});

describe("API route fail-closed contracts", () => {
  const issueRoute = readFileSync(
    join(
      process.cwd(),
      "app/api/platform-portal/customers/[id]/secondary-domain-dns-challenge/route.ts",
    ),
    "utf8",
  );
  const verifyRoute = readFileSync(
    join(
      process.cwd(),
      "app/api/platform-portal/customers/[id]/secondary-domain-dns-challenge/verify/route.ts",
    ),
    "utf8",
  );
  const resolveSource = readFileSync(
    join(process.cwd(), "lib/platform-portal/secondary-domain-dns-resolve.ts"),
    "utf8",
  );

  it("verify route uses live DNS and never trusts client verified flag", () => {
    assert.match(verifyRoute, /lookupSecondaryDomainDnsChallengeToken/);
    assert.match(verifyRoute, /presentedToken: dns\.token/);
    assert.match(verifyRoute, /Client cannot self-attest verification/);
    assert.doesNotMatch(verifyRoute, /bodyRecord\.verified/);
    assert.doesNotMatch(verifyRoute, /p_verified/);
    assert.match(verifyRoute, /licenseDomainReferenceUnchanged/);
    assert.match(verifyRoute, /installationCreated/);
  });

  it("issue route requires authenticated session and safety invariants", () => {
    assert.match(issueRoute, /getUser\(\)/);
    assert.match(issueRoute, /issue_platform_portal_secondary_domain_dns_challenge/);
    assert.match(issueRoute, /installationCreated/);
  });

  it("DNS resolve uses node dns promises with timeout", () => {
    assert.match(resolveSource, /resolveTxt/);
    assert.match(resolveSource, /DNS_LOOKUP_TIMEOUT/);
    assert.match(resolveSource, /server-only/);
  });
});
