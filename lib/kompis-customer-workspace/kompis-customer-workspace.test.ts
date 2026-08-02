import assert from "node:assert/strict";
import {
  KOMPIS_CUSTOMER_WORKSPACE_FIXTURES,
  buildKompisWorkspaceContext,
  createAuthenticatedHandoffFromPublic,
  downgradeSessionOnLogout,
  evaluateKompisConfirmationGate,
  fixtureDraftWithConfirmation,
  fixtureKnowledgeOnly,
  fixturePublicOnly,
  listKompisWorkspaceLocales,
  parseKompisCustomerWorkspaceContract,
  previewKompisWorkspaceEffectiveAccess,
  resolveKompisWorkspacePermissions,
  resolveKompisWorkspaceLocalizedText,
} from "./index";

assert.equal(KOMPIS_CUSTOMER_WORKSPACE_FIXTURES.length, 7);

for (const fixture of KOMPIS_CUSTOMER_WORKSPACE_FIXTURES) {
  const parsed = parseKompisCustomerWorkspaceContract(fixture, {
    expectedTenantKey: fixture.tenant_key,
  });
  assert.equal(parsed.ok, true, `fixture ${fixture.tenant_key} should parse`);
  if (parsed.ok) {
    assert.equal(parsed.contract.risk_policies.private_messages_enabled, false);
  }
}

assert.equal(parseKompisCustomerWorkspaceContract(null).ok, false);

const draft = {
  ...fixtureKnowledgeOnly,
  versioning: { ...fixtureKnowledgeOnly.versioning, status: "draft" as const },
};
assert.equal(parseKompisCustomerWorkspaceContract(draft).ok, false);
assert.equal(parseKompisCustomerWorkspaceContract(draft, { allowDraft: true }).ok, true);

// Force invalid private messages via raw parse
const privateRaw = JSON.parse(JSON.stringify(fixtureKnowledgeOnly));
privateRaw.risk_policies.private_messages_enabled = true;
assert.equal(parseKompisCustomerWorkspaceContract(privateRaw).ok, false);

const publicPerms = resolveKompisWorkspacePermissions({
  contract: fixturePublicOnly,
  context: {
    surface: "authenticated_portal",
    route: "/portal/home",
    module: "account",
    user_role: "member",
    access_tier: "standard",
    entity_type: null,
  },
});
assert.equal(publicPerms.enabled, false);
assert.ok(publicPerms.denied_reasons.includes("surface_disabled"));

const knowledgePerms = resolveKompisWorkspacePermissions({
  contract: fixtureKnowledgeOnly,
  context: {
    surface: "authenticated_portal",
    route: "/portal/home",
    module: "account",
    user_role: "member",
    access_tier: "standard",
    entity_type: null,
  },
});
assert.equal(knowledgePerms.enabled, true);
assert.ok(knowledgePerms.allowed_tools.includes("search_knowledge"));
assert.equal(knowledgePerms.allowed_tools.includes("publish_item"), false);

const deniedRoute = resolveKompisWorkspacePermissions({
  contract: fixtureKnowledgeOnly,
  context: {
    surface: "authenticated_portal",
    route: "/admin/users",
    module: "admin",
    user_role: "member",
    access_tier: "standard",
    entity_type: null,
  },
});
assert.equal(deniedRoute.enabled, false);

const handoff = createAuthenticatedHandoffFromPublic({
  contract: fixtureKnowledgeOnly,
  public_session: {
    session_id: "pub_1",
    tenant_id: fixtureKnowledgeOnly.tenant_key,
    locale: "no",
    topic_summary: "Access help",
  },
  authenticated_user: {
    user_id: "user_1",
    tenant_id: fixtureKnowledgeOnly.tenant_key,
  },
});
assert.equal(handoff.ok, true);
if (handoff.ok) {
  assert.equal(handoff.session.kind, "authenticated");
  assert.equal(handoff.session.user_id, "user_1");
  assert.equal(handoff.preserved_locale, "no");
  assert.equal(handoff.dropped_sensitive_assumptions, true);
  const downgraded = downgradeSessionOnLogout(handoff.session);
  assert.equal(downgraded.authenticated_tools_removed, true);
  assert.equal(downgraded.user_id, null);
}

const crossTenant = createAuthenticatedHandoffFromPublic({
  contract: fixtureKnowledgeOnly,
  public_session: {
    session_id: "pub_2",
    tenant_id: "other_tenant",
    locale: "en",
  },
  authenticated_user: {
    user_id: "user_1",
    tenant_id: fixtureKnowledgeOnly.tenant_key,
  },
});
assert.equal(crossTenant.ok, false);

const ctx = buildKompisWorkspaceContext({
  contract: fixtureKnowledgeOnly,
  tenant_id: fixtureKnowledgeOnly.tenant_key,
  surface: "authenticated_portal",
  route: "/portal/home",
  module: "account",
  user_role: "member",
  access_tier: "standard",
  locale: "en",
  safe_summary: "Account overview",
});
assert.equal(ctx.ok, true);

const badField = buildKompisWorkspaceContext({
  contract: fixtureKnowledgeOnly,
  tenant_id: fixtureKnowledgeOnly.tenant_key,
  surface: "authenticated_portal",
  route: "/portal/home",
  module: "account",
  user_role: "member",
  access_tier: "standard",
  locale: "en",
  safe_summary: "Account overview",
  proposed_fields: { private_messages: "secret" },
});
assert.equal(badField.ok, false);

const draftPerms = resolveKompisWorkspacePermissions({
  contract: fixtureDraftWithConfirmation,
  context: {
    surface: "authenticated_portal",
    route: "/portal/catalog",
    module: "catalog",
    user_role: "member",
    access_tier: "standard",
    entity_type: "item",
  },
});
const confirm = evaluateKompisConfirmationGate({
  tool_key: "publish_item",
  permissions: draftPerms,
  summary: "Publish listing",
  consequences: ["Becomes publicly visible"],
  is_public: true,
});
assert.equal(confirm.ok, true);
if (confirm.ok && confirm.level !== "none") {
  assert.ok(confirm.level === "strong" || confirm.level === "explicit");
  assert.ok(confirm.card.consequences.length > 0);
}

const deniedWrite = evaluateKompisConfirmationGate({
  tool_key: "publish_item",
  permissions: knowledgePerms,
  summary: "Publish listing",
  consequences: [],
});
assert.equal(deniedWrite.ok, false);

const locales = listKompisWorkspaceLocales();
assert.ok(locales.includes("en"));
assert.ok(locales.includes("es"));
assert.ok(locales.length >= 7);
assert.equal(
  resolveKompisWorkspaceLocalizedText({ en: "Hello", no: "Hei" }, "zz").value,
  "Hello"
);

const preview = previewKompisWorkspaceEffectiveAccess({
  contract: fixtureKnowledgeOnly,
  surface: "authenticated_portal",
  route: "/portal/home",
  module: "account",
  user_role: "member",
  access_tier: "standard",
});
assert.equal(preview.preview_only, true);
assert.equal(preview.permissions.enabled, true);

console.log("kompis-customer-workspace.test.ts: ok");
