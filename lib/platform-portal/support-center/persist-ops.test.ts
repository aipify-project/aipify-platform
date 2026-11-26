import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import {
  PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_APPLIED,
  PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_PATH,
  PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_SHA256,
} from "./sql-candidate-contract";
import {
  deriveSupportTemplateKeyFromName,
  normalizeSupportTemplateKey,
  normalizeSupportTemplateLocale,
} from "./normalize-template-key";
import {
  listSupportTemplatesForUser,
  loadSupportSignatureForUser,
  mutateSupportTemplateForUser,
  saveSupportSignatureForUser,
} from "./persist-ops";
import { AIPIFY_CORE_PRODUCTION_PROJECT_REF } from "./staging-core-activation";
import { __resetSupportSignatureStoreForTests } from "./signature-store";
import { __resetSupportTemplateStoreForTests } from "./template-store";

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

assert.equal(PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_APPLIED, false);
assert.equal(existsSync(PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_PATH), true);
assert.equal(
  sha256File(PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_PATH),
  PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_SHA256,
);
const sql = readFileSync(PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_PATH, "utf8");
assert.match(sql, /platform_support_get_active_signature/);
assert.match(sql, /platform_support_upsert_signature/);
assert.match(sql, /platform_support_list_templates/);
assert.match(sql, /platform_support_upsert_template/);
assert.match(sql, /platform_support_archive_template/);
assert.match(sql, /p_assigned_support_owner_id/);
assert.match(sql, /platform_support_ticket_messages/);
assert.match(sql, /pg_advisory_xact_lock/);
assert.match(sql, /_pscpv1_normalize_key/);
assert.doesNotMatch(sql, /TODO|paste the complete REPLACE|PREPARED_ONLY_timeline_extension/);
assert.doesNotMatch(sql, /```/);

assert.deepEqual(normalizeSupportTemplateKey("Ack_Received"), {
  ok: true,
  value: "ack_received",
});
assert.equal(normalizeSupportTemplateKey("").ok, false);
assert.equal(normalizeSupportTemplateKey("Bad Key!").ok, false);
assert.equal(normalizeSupportTemplateKey("a".repeat(81)).ok, false);
assert.equal(normalizeSupportTemplateKey("-leading").ok, false);
assert.equal(normalizeSupportTemplateLocale("NO"), "no");
assert.equal(normalizeSupportTemplateLocale("xx"), null);
assert.equal(deriveSupportTemplateKeyFromName("Ny mal 123").ok, true);
assert.equal(deriveSupportTemplateKeyFromName("!!!").ok, false);

type RpcCall = { fn: string; args?: Record<string, unknown> };

function mockRpc(handlers: Record<string, (args?: Record<string, unknown>) => unknown>) {
  const calls: RpcCall[] = [];
  return {
    calls,
    rpc: async (fn: string, args?: Record<string, unknown>) => {
      calls.push({ fn, args });
      const handler = handlers[fn];
      if (!handler) {
        return {
          data: null,
          error: { message: `Could not find the function public.${fn}` },
        };
      }
      try {
        return { data: handler(args), error: null };
      } catch (error) {
        return {
          data: null,
          error: { message: error instanceof Error ? error.message : "error" },
        };
      }
    },
  };
}

async function main() {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`;

  __resetSupportSignatureStoreForTests();
  __resetSupportTemplateStoreForTests();

  {
    const rpc = mockRpc({});
    const loaded = await loadSupportSignatureForUser({ rpc });
    assert.equal(loaded.source, "workspace");
    assert.equal(loaded.persistConfigured, false);
    const saved = await saveSupportSignatureForUser({
      rpc,
      signature: {
        displayName: "Aipify Support",
        agentName: "Test",
        agentTitle: "",
        companyName: "Aipify Group AS",
        websiteUrl: "https://aipify.ai",
        supportEmail: "support@aipify.ai",
        phone: "",
        addressLine: "",
        includeLogo: true,
      },
    });
    assert.equal(saved.ok, true);
    if (saved.ok) assert.equal(saved.source, "workspace");
  }

  {
    let version = 0;
    let active: Record<string, unknown> | null = null;
    const rpc = mockRpc({
      platform_support_get_active_signature: () =>
        active
          ? { ok: true, found: true, signature: active }
          : { ok: true, found: false },
      platform_support_upsert_signature: (args) => {
        version += 1;
        active = {
          id: "sig-1",
          version,
          display_name: args?.p_display_name,
          agent_name_default: args?.p_agent_name_default,
          agent_title_default: args?.p_agent_title_default,
          company_name: "Aipify Group AS",
          website_url: "https://aipify.ai",
          support_email: "support@aipify.ai",
          phone: args?.p_phone,
          address_line: args?.p_address_line,
          logo_url:
            "https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png",
          include_logo: args?.p_include_logo,
          is_active: true,
        };
        return { ok: true, id: "sig-1", version };
      },
    });
    const saved = await saveSupportSignatureForUser({
      rpc,
      signature: {
        displayName: "Support desk",
        agentName: "Ada",
        agentTitle: "Agent",
        companyName: "Aipify Group AS",
        websiteUrl: "https://aipify.ai",
        supportEmail: "support@aipify.ai",
        phone: "",
        addressLine: "0150 Oslo",
        includeLogo: true,
      },
    });
    assert.equal(saved.ok, true);
    if (saved.ok) {
      assert.equal(saved.source, "core");
      assert.equal(saved.persistConfigured, true);
      assert.equal(saved.signature.agentName, "Ada");
      assert.equal(saved.signature.version, 1);
    }
    const reloaded = await loadSupportSignatureForUser({ rpc });
    assert.equal(reloaded.source, "core");
    assert.equal(reloaded.signature.agentName, "Ada");
    const again = await saveSupportSignatureForUser({
      rpc,
      signature: { ...reloaded.signature, agentName: "Bea" },
    });
    assert.equal(again.ok && again.signature.version, 2);
  }

  {
    const rpc = mockRpc({
      platform_support_get_active_signature: () => {
        throw new Error("Platform portal access denied");
      },
    });
    await assert.rejects(
      () => loadSupportSignatureForUser({ rpc }),
      (error: unknown) => error instanceof Error && error.message === "forbidden",
    );
  }

  {
    const rows = new Map<string, Record<string, unknown>>();
    const rpc = mockRpc({
      platform_support_list_templates: () => ({
        ok: true,
        items: [...rows.values()],
      }),
      platform_support_upsert_template: (args) => {
        const key = String(args?.p_template_key ?? "");
        if (!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(key)) {
          throw new Error("invalid argument: template_key format");
        }
        const locale = String(args?.p_locale ?? "no");
        const id = `${key}:${locale}`;
        const version = Number(rows.get(id)?.version ?? 0) + 1;
        const row = {
          id: `uuid-${version}`,
          template_key: key,
          version,
          name: args?.p_name,
          category: args?.p_category,
          locale,
          subject: args?.p_subject,
          body_text: args?.p_body_text,
          allowed_variables: [
            "customer_name",
            "ticket_number",
            "product_name",
            "agent_name",
          ],
          is_active: true,
          is_starter: Boolean(args?.p_is_starter),
          archived: false,
        };
        rows.set(id, row);
        return { ok: true, id: row.id, template_key: key, locale, version };
      },
      platform_support_archive_template: (args) => {
        const id = `${args?.p_template_key}:${args?.p_locale ?? "no"}`;
        const row = rows.get(id);
        if (!row) throw new Error("not found");
        row.is_active = false;
        row.archived = true;
        return { ok: true, archived: true, template_key: args?.p_template_key };
      },
    });

    const bad = await mutateSupportTemplateForUser({
      rpc,
      action: "create",
      body: {
        name: "Ok",
        templateKey: "Bad Key!",
        category: "intake",
        locale: "no",
        subject: "Emne her",
        body: "Hei {{customer_name}}, dette er en testmal.",
      },
    });
    assert.equal(bad.ok, false);

    const created = await mutateSupportTemplateForUser({
      rpc,
      action: "create",
      body: {
        name: "Velkomst",
        templateKey: "welcome_note",
        category: "intake",
        locale: "no",
        subject: "Velkommen",
        body: "Hei {{customer_name}}, takk for henvendelsen.",
      },
    });
    assert.equal(created.ok, true);
    if (created.ok) {
      assert.equal(created.source, "core");
      assert.equal(created.template.id, "welcome_note");
      assert.equal(created.template.version, 1);
    }

    const listed = await listSupportTemplatesForUser({ rpc });
    assert.equal(listed.source, "core");
    assert.equal(
      listed.items.some((t) => t.id === "welcome_note"),
      true,
    );

    const archived = await mutateSupportTemplateForUser({
      rpc,
      action: "archive",
      body: { id: "welcome_note", locale: "no" },
    });
    assert.equal(archived.ok, true);
    if (archived.ok) assert.equal(archived.template.archived, true);
  }

  __resetSupportSignatureStoreForTests();
  __resetTemplateStoreSafe();
  if (previousUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
  }

  console.log("persist-ops.test.ts: ok");
}

function __resetTemplateStoreSafe() {
  __resetSupportTemplateStoreForTests();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
