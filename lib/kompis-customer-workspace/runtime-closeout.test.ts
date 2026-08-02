import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  createAuthenticatedHandoffFromPublic,
  evaluateKompisConfirmationGate,
  fixtureKnowledgeOnly,
  listKompisWorkspaceLocales,
  resolveKompisWorkspacePermissions,
} from "./index";
import { LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();
const HOST = join(ROOT, "components/app/kompis-customer-workspace/KompisCustomerWorkspaceHost.tsx");
const PAGE = join(ROOT, "app/app/kompis-workspace/page.tsx");
const INVOKE = join(ROOT, "app/api/kompis-customer-workspace/invoke/route.ts");
const EXECUTE = join(ROOT, "app/api/kompis-customer-workspace/execute/route.ts");
const ADMIN = join(ROOT, "app/api/kompis-customer-workspace/admin/route.ts");
const HANDOFF = join(ROOT, "app/api/kompis-customer-workspace/handoff/route.ts");
const ADAPTERS = join(ROOT, "lib/kompis-customer-workspace/adapters.ts");
const MIGRATION = join(
  ROOT,
  "supabase/migrations/20261937500000_kompis_authenticated_customer_workspace_v1.sql"
);
const RULE = join(ROOT, ".cursor/rules/kompis-core-authenticated-customer-workspace.mdc");

const hostSrc = readFileSync(HOST, "utf8");
const pageSrc = readFileSync(PAGE, "utf8");
const invokeSrc = readFileSync(INVOKE, "utf8");
const executeSrc = readFileSync(EXECUTE, "utf8");
const adminSrc = readFileSync(ADMIN, "utf8");
const handoffSrc = readFileSync(HANDOFF, "utf8");
const adaptersSrc = readFileSync(ADAPTERS, "utf8");
const migrationSrc = readFileSync(MIGRATION, "utf8");
const ruleSrc = readFileSync(RULE, "utf8");

// A. Runtime chain mounted
assert.match(pageSrc, /KompisCustomerWorkspaceHost/);
assert.match(hostSrc, /KompisCustomerWorkspaceShell/);
assert.match(hostSrc, /\/api\/kompis-customer-workspace\/invoke/);
assert.match(invokeSrc, /executeKompisReadAccessStatus/);
assert.match(invokeSrc, /executeKompisCreateDraft/);
assert.match(invokeSrc, /proposeKompisUpdatePreference/);
assert.match(executeSrc, /confirmKompisPrivilegedAction/);

// B. Adapters are real runtime (not fixture-only)
assert.match(adaptersSrc, /record_kompis_customer_workspace_tool_invocation/);
assert.match(adaptersSrc, /create_kompis_customer_workspace_draft/);
assert.match(adaptersSrc, /create_kompis_customer_workspace_confirmation/);
assert.match(adaptersSrc, /confirm_kompis_customer_workspace_action/);
assert.equal(adaptersSrc.includes("fixtureKnowledgeOnly"), false);

// C. Draft never auto-executes
assert.match(adaptersSrc, /executed: false/);
assert.match(migrationSrc, /'executed', false/);

// D. Confirmation required for privileged write
const confirmPerms = resolveKompisWorkspacePermissions({
  contract: {
    ...fixtureKnowledgeOnly,
    enabled: true,
    authenticated_enabled: true,
    allowed_routes: ["/app", "/app/*", "/app/kompis-workspace"],
    tool_permissions: [
      {
        tool_key: "update_preference",
        enabled: true,
        kind: "write",
        confirmation_level: "explicit",
        roles: [],
        access_tiers: [],
        modules: [],
        routes: [],
        risk_classification: "moderate",
      },
    ],
  },
  context: {
    surface: "authenticated_portal",
    route: "/app/kompis-workspace",
    module: "account",
    user_role: "member",
    access_tier: "standard",
    entity_type: null,
  },
});
assert.equal(confirmPerms.enabled, true);
assert.ok(confirmPerms.allowed_tools.includes("update_preference"));
const gate = evaluateKompisConfirmationGate({
  tool_key: "update_preference",
  permissions: confirmPerms,
  summary: "Update preference",
  consequences: ["Changes preference"],
});
assert.equal(gate.ok, true);
assert.notEqual(gate.ok && gate.level === "none", true);
if (gate.ok && gate.level !== "none") {
  assert.ok(gate.card.confirmation_id);
}

// E. Handoff safe
assert.match(handoffSrc, /createAuthenticatedHandoffFromPublic/);
assert.match(handoffSrc, /auto_executed: false/);
assert.match(handoffSrc, /Invalid return path/);
const handoff = createAuthenticatedHandoffFromPublic({
  contract: fixtureKnowledgeOnly,
  public_session: {
    session_id: "pub_closeout",
    tenant_id: fixtureKnowledgeOnly.tenant_key,
    locale: "no",
    topic_summary: "Continue help",
  },
  authenticated_user: {
    user_id: "user_closeout",
    tenant_id: fixtureKnowledgeOnly.tenant_key,
  },
});
assert.equal(handoff.ok, true);

// F. Admin controls
assert.match(adminSrc, /get_kompis_customer_workspace_admin_state/);
assert.match(adminSrc, /set_kompis_customer_workspace_enabled/);
assert.match(hostSrc, /data-kompis-admin/);

// G. Migration rename + runtime tables
assert.match(migrationSrc, /kompis_customer_workspace_drafts/);
assert.match(migrationSrc, /kompis_customer_workspace_confirmations/);
assert.equal(
  readFileSync(
    join(ROOT, "supabase/migrations/20261937200000_core_app_installation_handoff_lifecycle_v1.sql"),
    "utf8"
  ).includes("kompis_customer_workspace_contracts"),
  false
);

// H. Locale dynamic list
assert.deepEqual([...listKompisWorkspaceLocales()], [...LOCALES]);
for (const locale of LOCALES) {
  const json = JSON.parse(
    readFileSync(join(ROOT, `locales/${locale}/customer-app/portalStructure.json`), "utf8")
  );
  const wiz = json.portalStructure.kompisWorkspace;
  assert.ok(wiz.runtime.readAction);
  assert.ok(wiz.admin.enable);
  assert.ok(wiz.tools.getMyAccessStatus);
}

// I. Cursor rule closeout principles
assert.match(ruleSrc, /Read \/ draft \/ action are distinct/i);
assert.match(ruleSrc, /Draft never auto-executes/i);
assert.match(ruleSrc, /Fixture-only proof is insufficient/i);
assert.match(ruleSrc, /Public-auth handoff must revalidate/i);

console.log("runtime-closeout.test.ts: ok");
