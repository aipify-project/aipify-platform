import type { SupabaseClient } from "@supabase/supabase-js";
import { parseCustomerLicenseCenter } from "@/lib/companion-platform-knowledge/pricing-bridge";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { companionDirectTurnDictionarySplits } from "@/lib/companion-runtime/companion-oaa-dictionary-splits";
import { createTranslator } from "@/lib/i18n/translate";
import { resolveAnswerLocale } from "@/lib/companion-platform-knowledge/language";
import { coerceToCustomerActiveLocale, type CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions/parse";
import { resolveAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  createEmptyCompanionTenantContext,
  type CompanionTenantContext,
} from "@/lib/companion-runtime/companion-tenant-context";
import { loadCompanionOperationalContext } from "@/lib/companion-runtime/load-companion-operational-context";
import { loadCompanionIdentityContext } from "@/lib/companion-runtime/load-companion-identity-context";
import { loadCompanionSupportContext } from "@/lib/companion-runtime/load-companion-support-context";
import { matchOperationalQuery, detectOperationalQueryKind } from "@/lib/companion-runtime/companion-operational-query-match";
import {
  buildGroundedOperationalAnswer,
  buildOperationalGapAnswer,
} from "@/lib/companion-runtime/operational-answer";
import { resolveOrganizationIntelligenceAnswer } from "@/lib/companion-runtime/organization-intelligence-routing";
import { resolveAuthorizationTargetCompanionAnswer } from "@/lib/companion-runtime/authorization-target-routing";
import { resolveOrganizationIntelligenceIntent } from "@/lib/companion-runtime/organization-intelligence-intent";
import { resolvePlatformFoundationAnswer } from "@/lib/companion-runtime/platform-foundation-routing";
import { isPlatformFoundationQuery } from "@/lib/companion-runtime/platform-foundation-intent";
import { resolveCompanionExplicitIntent } from "@/lib/companion-runtime/companion-explicit-intent";
import { buildCompanionExplicitIntentAnswer } from "@/lib/companion-runtime/companion-explicit-intent-answer";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { buildReplyFromSearchJson } from "./build-reply";
import type { CompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";

async function loadMemberCountDirectTurnTenantContext(
  supabase: SupabaseClient,
  locale: CustomerActiveLocale,
): Promise<CompanionTenantContext> {
  const [orgContext, permissionsResult] = await Promise.all([
    resolveAppOrganizationContext(supabase),
    supabase.rpc("get_identity_permissions_dashboard"),
  ]);

  const effectivePermissions = permissionsResult.error
    ? []
    : (parseIdentityPermissionsDashboard(permissionsResult.data)?.user_permissions ?? []);

  const organizationId = orgContext.organization_id;

  return {
    ...createEmptyCompanionTenantContext({ locale }),
    organizationId,
    companyId: organizationId,
    organizationName: orgContext.workspace_name ?? null,
    organizationRole:
      orgContext.organization_role === "organization_owner" ||
      orgContext.organization_role === "organization_admin" ||
      orgContext.organization_role === "organization_manager" ||
      orgContext.organization_role === "organization_member"
        ? orgContext.organization_role
        : null,
    subscriptionStatus: orgContext.license_status ?? null,
    effectivePermissions,
  };
}

async function loadDirectTurnDictionary(locale: CustomerActiveLocale) {
  const dict = await getCustomerAppDictionaryForSplits(locale, companionDirectTurnDictionarySplits());
  const t = createTranslator(dict);
  return { dict, t, companionLabels: buildCompanionExperienceLabels(t) };
}

async function loadMinimalDirectTurnTenantContext(
  supabase: SupabaseClient,
  locale: CustomerActiveLocale,
): Promise<CompanionTenantContext> {
  const [orgContext, permissionsResult, licenseResult] = await Promise.all([
    resolveAppOrganizationContext(supabase),
    supabase.rpc("get_identity_permissions_dashboard"),
    supabase.rpc("get_customer_license_center"),
  ]);

  const subscription = parseCustomerLicenseCenter(licenseResult.data);
  const effectivePermissions = permissionsResult.error
    ? []
    : (parseIdentityPermissionsDashboard(permissionsResult.data)?.user_permissions ?? []);

  const subscriptionStatus = subscription?.status ?? orgContext.license_status ?? null;
  const organizationId = orgContext.organization_id;

  return {
    ...createEmptyCompanionTenantContext({ locale }),
    organizationId,
    companyId: organizationId,
    organizationName: orgContext.workspace_name ?? null,
    organizationRole:
      orgContext.organization_role === "organization_owner" ||
      orgContext.organization_role === "organization_admin" ||
      orgContext.organization_role === "organization_manager" ||
      orgContext.organization_role === "organization_member"
        ? orgContext.organization_role
        : null,
    planKey: subscription?.planKey ?? null,
    subscriptionStatus,
    effectivePermissions,
  };
}

async function loadDirectTurnTenantContext(
  supabase: SupabaseClient,
  locale: CustomerActiveLocale,
): Promise<CompanionTenantContext> {
  const [orgContext, permissionsResult, licenseResult, identityContext] = await Promise.all([
    resolveAppOrganizationContext(supabase),
    supabase.rpc("get_identity_permissions_dashboard"),
    supabase.rpc("get_customer_license_center"),
    loadCompanionIdentityContext(supabase, locale),
  ]);

  const subscription = parseCustomerLicenseCenter(licenseResult.data);
  const effectivePermissions = permissionsResult.error
    ? []
    : (parseIdentityPermissionsDashboard(permissionsResult.data)?.user_permissions ?? []);

  const subscriptionStatus = subscription?.status ?? orgContext.license_status ?? null;
  const organizationId = orgContext.organization_id;

  const operationalLoad = await loadCompanionOperationalContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    enabledModules: [],
    activeBusinessPacks: [],
  });

  const supportContext = await loadCompanionSupportContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders: [],
    activeBusinessPacks: [],
  });

  return {
    ...createEmptyCompanionTenantContext({ locale }),
    organizationId,
    companyId: organizationId,
    organizationName: orgContext.workspace_name ?? null,
    organizationRole:
      orgContext.organization_role === "organization_owner" ||
      orgContext.organization_role === "organization_admin" ||
      orgContext.organization_role === "organization_manager" ||
      orgContext.organization_role === "organization_member"
        ? orgContext.organization_role
        : null,
    planKey: subscription?.planKey ?? null,
    subscriptionStatus,
    effectivePermissions,
    identityContext,
    operationalContext: operationalLoad.operationalContext,
    commandBriefAvailable: operationalLoad.commandBriefAvailable,
    sinceLastLoginAvailable: operationalLoad.sinceLastLoginAvailable,
    supportContext,
  };
}

export async function executeDirectOrganizationOrFoundationTurn(
  supabase: SupabaseClient,
  input: {
    query: string;
    locale: string;
    conversationId: string;
    route: CompanionTurnRoute | "datetime";
    userMessageId?: string | null;
  },
): Promise<
  | { ok: true; assistantContent: string; assistantPayload: Record<string, unknown>; route: string; capability?: string }
  | { ok: false; error: string; should_queue?: boolean; route: string }
> {
  const locale = coerceToCustomerActiveLocale(
    resolveAnswerLocale(input.locale, input.query),
  );
  const memberIntent = resolveOrganizationIntelligenceIntent(input.query, locale);
  const operationalPhrase = detectOperationalQueryKind(input.query);
  const foundationQuery =
    input.route === "foundation" || isPlatformFoundationQuery(input.query);

  const explicitIntent = resolveCompanionExplicitIntent(input.query);
  if (explicitIntent) {
    const [{ t, companionLabels }, tenantContext] = await Promise.all([
      loadDirectTurnDictionary(locale),
      explicitIntent.kind === "companion_registration_meta"
        ? Promise.resolve(createEmptyCompanionTenantContext({ locale }))
        : loadMinimalDirectTurnTenantContext(supabase, locale),
    ]);
    const answer = await buildCompanionExplicitIntentAnswer({
      intent: explicitIntent,
      query: input.query,
      supabase,
      tenantContext,
      t,
      locale,
    });
    const built = buildReplyFromSearchJson(
      { found: true, query: input.query, answer },
      companionLabels,
      input.query,
    );
    return {
      ok: true,
      assistantContent: built.message.directAnswer ?? built.message.content,
      assistantPayload: {
        ...built.payload,
        route: "exact_source",
        capability: `explicit_intent.${explicitIntent.kind}`,
      },
      route: "exact_source",
      capability: `explicit_intent.${explicitIntent.kind}`,
    };
  }

  const loadTenantContext = () => {
    if (memberIntent?.kind === "member_count") {
      return loadMemberCountDirectTurnTenantContext(supabase, locale);
    }
    if (operationalPhrase) {
      return loadDirectTurnTenantContext(supabase, locale);
    }
    return loadMinimalDirectTurnTenantContext(supabase, locale);
  };

  const [{ t, companionLabels }, tenantContext] = await Promise.all([
    loadDirectTurnDictionary(locale),
    loadTenantContext(),
  ]);
  const operationalMatch = matchOperationalQuery(input.query, tenantContext);

  if (foundationQuery) {
    const foundationContext =
      tenantContext.organizationId != null
        ? tenantContext
        : await loadMinimalDirectTurnTenantContext(supabase, locale);
    const foundation = await resolvePlatformFoundationAnswer(input.query, {
      t,
      activeLocale: locale,
      supabase,
      tenantContext: foundationContext,
      companionSurface: true,
      conversationId: input.conversationId,
    });
    if (!foundation) {
      return { ok: false, error: "foundation_unresolved", route: "foundation" };
    }
    const built = buildReplyFromSearchJson(
      { found: true, query: input.query, answer: foundation.answer },
      companionLabels,
      input.query,
    );
    return {
      ok: true,
      assistantContent: built.message.directAnswer ?? built.message.content,
      assistantPayload: { ...built.payload, route: "foundation", capability: "platform_foundation" },
      route: "foundation",
      capability: "platform_foundation",
    };
  }

  if (operationalPhrase && !operationalMatch) {
    const gap = buildOperationalGapAnswer(t, "unavailable");
    const built = buildReplyFromSearchJson(
      { found: true, query: input.query, answer: gap },
      companionLabels,
      input.query,
    );
    return {
      ok: true,
      assistantContent: built.message.directAnswer ?? built.message.content,
      assistantPayload: {
        ...built.payload,
        route: "exact_source",
        capability: `operational.${operationalPhrase.kind}`,
        operational_unavailable: true,
      },
      route: "exact_source",
      capability: `operational.${operationalPhrase.kind}`,
    };
  }

  if (operationalMatch) {
    if (
      tenantContext.operationalContext.warnings.includes("permission_denied") ||
      tenantContext.operationalContext.warnings.includes("app_suspended")
    ) {
      const reason = tenantContext.operationalContext.warnings.includes("permission_denied")
        ? "permission_denied"
        : "unavailable";
      const gap = buildOperationalGapAnswer(t, reason);
      const built = buildReplyFromSearchJson(
        { found: true, query: input.query, answer: gap },
        companionLabels,
        input.query,
      );
      return {
        ok: true,
        assistantContent: built.message.directAnswer ?? built.message.content,
        assistantPayload: {
          ...built.payload,
          route: "exact_source",
          capability: `operational.${operationalMatch.kind}`,
        },
        route: "exact_source",
        capability: `operational.${operationalMatch.kind}`,
      };
    }

    const answer = buildGroundedOperationalAnswer(
      tenantContext.operationalContext,
      operationalMatch,
      t,
      locale,
    );
    const built = buildReplyFromSearchJson(
      { found: true, query: input.query, answer },
      companionLabels,
      input.query,
    );
    return {
      ok: true,
      assistantContent: built.message.directAnswer ?? built.message.content,
      assistantPayload: {
        ...built.payload,
        route: "exact_source",
        capability: `operational.${operationalMatch.kind}`,
      },
      route: "exact_source",
      capability: `operational.${operationalMatch.kind}`,
    };
  }

  const orgResult = await (async () => {
    const authorizationTargetAnswer = resolveAuthorizationTargetCompanionAnswer(input.query, {
      t,
      locale,
      userMessageId: input.userMessageId ?? null,
      organizationId: tenantContext.organizationId ?? null,
    });
    if (authorizationTargetAnswer) return authorizationTargetAnswer;

    return resolveOrganizationIntelligenceAnswer(input.query, {
      t,
      tenantContext,
      supabase,
      activeLocale: locale,
      companionSurface: true,
      userMessageId: input.userMessageId ?? null,
    });
  })();

  if (!orgResult) {
    return { ok: false, error: "org_intent_unresolved", should_queue: true, route: "exact_source" };
  }

  const built = buildReplyFromSearchJson(
    { found: true, query: input.query, answer: orgResult.answer },
    companionLabels,
    input.query,
  );

  return {
    ok: true,
    assistantContent: built.message.directAnswer ?? built.message.content,
    assistantPayload: {
      ...built.payload,
      route: "exact_source",
      capability: orgResult.answer.sourceId ?? "organization_intelligence",
    },
    route: "exact_source",
    capability: orgResult.answer.sourceId ?? "organization_intelligence",
  };
}
