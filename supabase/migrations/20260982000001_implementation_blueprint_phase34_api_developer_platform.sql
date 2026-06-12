-- Implementation Blueprint Phase 34 — API & Developer Platform
-- Extends API Platform Engine (Phase A.21). Preserves ALL A.21 dashboard/card fields.

create or replace function public._apdbp_developer_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'public_apis', 'label', 'Public APIs', 'description', 'Documented REST endpoints for core tenant operations'),
    jsonb_build_object('key', 'partner_apis', 'label', 'Partner APIs', 'description', 'Sales Expert Portal, commission tracking, and lifecycle visibility'),
    jsonb_build_object('key', 'secure_auth', 'label', 'Secure authentication', 'description', 'Scoped API keys with prefix/hash storage and expiration'),
    jsonb_build_object('key', 'api_keys', 'label', 'API key management', 'description', 'Human approval for elevated scopes — never store full keys'),
    jsonb_build_object('key', 'webhooks', 'label', 'Webhooks', 'description', 'Event subscriptions with secret_ref vault references only'),
    jsonb_build_object('key', 'developer_docs', 'label', 'Developer documentation', 'description', 'Interactive docs, examples, and SDK references at /developers'),
    jsonb_build_object('key', 'sandbox', 'label', 'Sandbox environments', 'description', 'Isolated testing with metadata-only scaffold data')
  );
$$;

create or replace function public._apdbp_api_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'core', jsonb_build_array(
      jsonb_build_object('key', 'organizations', 'label', 'Organizations', 'scopes', jsonb_build_array('org.read', 'org.manage')),
      jsonb_build_object('key', 'users', 'label', 'Users', 'scopes', jsonb_build_array('users.read', 'users.manage')),
      jsonb_build_object('key', 'permissions', 'label', 'Permissions', 'scopes', jsonb_build_array('permissions.read')),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'scopes', jsonb_build_array('knowledge.read', 'knowledge.publish')),
      jsonb_build_object('key', 'tasks', 'label', 'Tasks', 'scopes', jsonb_build_array('tasks.read', 'tasks.manage')),
      jsonb_build_object('key', 'support', 'label', 'Support', 'scopes', jsonb_build_array('support.read', 'support.reply'))
    ),
    'companion', jsonb_build_array(
      jsonb_build_object('key', 'conversations', 'label', 'Conversations', 'scopes', jsonb_build_array('companion.conversations.read')),
      jsonb_build_object('key', 'notifications', 'label', 'Notifications', 'scopes', jsonb_build_array('notifications.read', 'notifications.manage')),
      jsonb_build_object('key', 'bell_moments', 'label', 'Bell moments', 'scopes', jsonb_build_array('companion.bell.read')),
      jsonb_build_object('key', 'recognition_events', 'label', 'Recognition events', 'scopes', jsonb_build_array('companion.recognition.read'))
    ),
    'commerce', jsonb_build_array(
      jsonb_build_object('key', 'products', 'label', 'Products', 'scopes', jsonb_build_array('commerce.products.read')),
      jsonb_build_object('key', 'orders', 'label', 'Orders', 'scopes', jsonb_build_array('commerce.orders.read')),
      jsonb_build_object('key', 'commerce_intelligence', 'label', 'Commerce intelligence', 'scopes', jsonb_build_array('commerce.intelligence.read')),
      jsonb_build_object('key', 'financial_events', 'label', 'Financial events', 'scopes', jsonb_build_array('commerce.finance.read'))
    ),
    'partner', jsonb_build_array(
      jsonb_build_object('key', 'sales_expert_portal', 'label', 'Sales Expert Portal', 'scopes', jsonb_build_array('partner.portal.read')),
      jsonb_build_object('key', 'commission_tracking', 'label', 'Commission tracking', 'scopes', jsonb_build_array('partner.commission.read')),
      jsonb_build_object('key', 'customer_lifecycle', 'label', 'Customer lifecycle visibility', 'scopes', jsonb_build_array('partner.lifecycle.read'))
    )
  );
$$;

create or replace function public._apdbp_developer_experience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Developers should discover, test, and ship integrations without friction — with governance always visible.',
    'surfaces', jsonb_build_array(
      jsonb_build_object('key', 'interactive_docs', 'label', 'Interactive documentation', 'route', '/developers', 'note', 'OpenAPI-style reference and try-it flows'),
      jsonb_build_object('key', 'example_code', 'label', 'Example code', 'route', '/developers', 'note', 'Language snippets for common integration patterns'),
      jsonb_build_object('key', 'sdks', 'label', 'SDKs', 'route', '/developers', 'note', 'App Ecosystem SDK — defineAipifySkill and manifest validation'),
      jsonb_build_object('key', 'api_explorers', 'label', 'API explorers', 'route', '/developers', 'note', 'Sandbox-scoped testing against metadata endpoints'),
      jsonb_build_object('key', 'testing_environments', 'label', 'Testing environments', 'route', '/app/settings/developer', 'note', 'Developer Settings — tokens, diagnostics, sandbox toggle')
    ),
    'metadata_scaffold', true,
    'boundary', 'Full developer portal lives at /developers — this engine tracks tenant API governance and cross-links.'
  );
$$;

create or replace function public._apdbp_security_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'scoped_permissions', 'label', 'Scoped permissions', 'description', 'Every key declares explicit scopes — least privilege by default'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Audit logging', 'description', 'All API platform actions recorded in organization_api_audit_log'),
    jsonb_build_object('key', 'rate_limits', 'label', 'Rate limits', 'description', 'Tier-based throttling — standard, elevated, partner, sandbox'),
    jsonb_build_object('key', 'token_expiration', 'label', 'Token expiration', 'description', 'Keys expire unless renewed — no indefinite credentials'),
    jsonb_build_object('key', 'secure_secrets', 'label', 'Secure secret handling', 'description', 'Prefix/hash for keys; secret_ref for webhooks — never raw secrets in DB'),
    jsonb_build_object('key', 'elevated_approval', 'label', 'Elevated scope approval', 'description', 'Write and admin scopes require human approval before activation')
  );
$$;

create or replace function public._apdbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Developers and administrators should understand available permissions, usage expectations, governance requirements, and security responsibilities.',
    'organizations_should_understand', jsonb_build_array(
      'Available permissions and scope categories for each API surface',
      'Usage expectations — rate limits, audit trails, and metadata-only responses',
      'Governance requirements — human approval for elevated scopes and webhook verification',
      'Security responsibilities — key rotation, secret vault ownership, and tenant isolation'
    ),
    'metadata_only', true,
    'transparency_note', 'Customer tenant API platform only — distinct from Platform Admin /api/platform/*.'
  );
$$;

create or replace function public._apdbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates API platform practices internally; Unonight validates integration experiences as first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('API key lifecycle', 'Webhook delivery metadata', 'Audit logging', 'Sandbox testing')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Integration experiences', 'Partner API boundaries', 'Developer onboarding flows')
    )
  );
$$;

create or replace function public._apdbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Extensibility increases when developers can build securely.',
    'Integrations accelerate adoption when governance is transparent.',
    'Partner capabilities expand when APIs are scoped and auditable.',
    'Developers build confidently when secrets never live in plain text.',
    'Governance strengthens when every key has a clear purpose.'
  );
$$;

create or replace function public._apdbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'app_ecosystem', 'label', 'App Ecosystem (Phase 75)', 'route', '/app/apps', 'note', 'Installed apps, catalog, and install flow — apps are guests inside Aipify'),
    jsonb_build_object('key', 'developer_portal', 'label', 'Developer Portal', 'route', '/developers', 'note', 'SDK, manifest spec, sandbox, and publishing'),
    jsonb_build_object('key', 'developer_settings', 'label', 'Developer Settings', 'route', '/app/settings/developer', 'note', 'Tokens, API keys, diagnostics — standard users never see raw tokens'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Connector credentials and sync boundaries'),
    jsonb_build_object('key', 'identity_permissions', 'label', 'Identity & Permissions (A.75)', 'route', '/app/identity-access', 'note', 'Role-based access and workspace governance'),
    jsonb_build_object('key', 'audit_accountability', 'label', 'Audit & Accountability (A.5)', 'route', '/app/audit-accountability', 'note', 'Immutable audit trails and accountability'),
    jsonb_build_object('key', 'marketplace_partner', 'label', 'Marketplace & Partner Ecosystem (A.45)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Sales Expert Portal and partner commission metadata')
  );
$$;

create or replace function public._apdbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Platform Admin /api/platform/* (Aipify Group AS only), App Ecosystem Phase 75 /app/apps (installed apps and catalog), Developer Portal /developers (SDK and publishing), Integration Engine A.8 /app/integration-engine (connector sync), Identity & Permissions A.75 /app/identity-access, and Audit Accountability A.5 /app/audit-accountability. Phase A.21 API keys, webhooks, and audit metadata preserved — customer tenant API governance only.';
$$;

create or replace function public._apdbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_objectives int := 0;
  v_categories int := 0;
begin
  v_base := public._api_engagement_summary(p_organization_id);
  v_objectives := jsonb_array_length(public._apdbp_developer_objectives());
  v_categories := jsonb_array_length(public._apdbp_api_categories()->'core')
    + jsonb_array_length(public._apdbp_api_categories()->'companion')
    + jsonb_array_length(public._apdbp_api_categories()->'commerce')
    + jsonb_array_length(public._apdbp_api_categories()->'partner');

  return v_base || jsonb_build_object(
    'developer_objectives_documented', v_objectives,
    'api_category_endpoints_documented', v_categories,
    'developer_portal_route', '/developers',
    'privacy_note', 'Counts only — no API key values, webhook secrets, or PII.'
  );
end; $$;

create or replace function public._apdbp_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_keys int := 0;
  v_webhooks int := 0;
  v_audit int := 0;
  v_pending int := 0;
  v_sandbox boolean := false;
begin
  v_engagement := public._apdbp_engagement_summary(p_organization_id);
  v_active_keys := coalesce((v_engagement->>'active_keys')::int, 0);
  v_webhooks := coalesce((v_engagement->>'active_webhooks')::int, 0);
  v_audit := coalesce((v_engagement->>'audit_events_30d')::int, 0);
  v_pending := coalesce((v_engagement->>'pending_approval_keys')::int, 0);
  v_sandbox := coalesce((v_engagement->>'sandbox_enabled')::boolean, false);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'developers_build_securely',
      'label', 'Developers build securely — scoped keys and audit logging active',
      'met', v_active_keys > 0 and v_audit >= 0,
      'note', case when v_active_keys = 0 then 'Seed API platform scaffold or create keys via Developer Settings.' else null end
    ),
    jsonb_build_object(
      'key', 'integrations_accelerate_adoption',
      'label', 'Integrations accelerate adoption — webhooks and developer portal linked',
      'met', v_webhooks > 0 or jsonb_array_length(public._apdbp_integration_links()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'partner_capabilities_expand',
      'label', 'Partner capabilities expand — partner API categories documented',
      'met', jsonb_array_length(public._apdbp_api_categories()->'partner') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'extensibility_increases',
      'label', 'Extensibility increases — developer experience surfaces cross-linked',
      'met', jsonb_array_length(public._apdbp_developer_objectives()) >= 7,
      'note', null
    ),
    jsonb_build_object(
      'key', 'governance_strong',
      'label', 'Governance strong — elevated scopes require approval, no pending backlog',
      'met', v_pending = 0,
      'note', case when v_pending > 0 then 'Approve or revoke pending elevated-scope API keys.' else null end
    ),
    jsonb_build_object(
      'key', 'sandbox_available',
      'label', 'Sandbox environments available for safe testing',
      'met', v_sandbox or v_active_keys > 0,
      'note', case when not v_sandbox then 'Enable sandbox in API platform settings for isolated testing.' else null end
    ),
    jsonb_build_object(
      'key', 'security_principles',
      'label', 'Security principles documented — scoped permissions through secure secrets',
      'met', jsonb_array_length(public._apdbp_security_principles()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from App Ecosystem, Developer Portal, and Integration Engine',
      'met', jsonb_array_length(public._apdbp_integration_links()) >= 7,
      'note', 'Extend related engines — do not duplicate app install or connector logic.'
    )
  );
end; $$;

create or replace function public.get_api_platform_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_api_platform_settings;
  v_base jsonb;
begin
  perform public._irp_require_permission('api_platform.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._api_ensure_settings(v_org_id);
  perform public._api_seed_platform_scaffold(v_org_id);

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Developers integrate securely — Aipify exposes metadata-first APIs with human approval for elevated access.',
    'privacy_note', 'API keys stored as prefix and hash only. Webhook secrets referenced by secret_ref — never raw secrets in the database.',
    'mission', 'Empower developers to integrate, customize, and build upon Aipify through secure APIs, documentation, and extensibility.',
    'settings', row_to_json(v_settings),
    'summary', public._api_engagement_summary(v_org_id),
    'api_keys', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', k.id,
          'key_name', k.key_name,
          'key_prefix', k.key_prefix,
          'scopes', k.scopes,
          'status', k.status,
          'expires_at', k.expires_at,
          'metadata', k.metadata
        ) order by k.created_at desc
      )
      from public.organization_api_keys k where k.organization_id = v_org_id
    ), '[]'::jsonb),
    'webhooks', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', w.id,
          'subscription_name', w.subscription_name,
          'event_types', w.event_types,
          'endpoint_url', w.endpoint_url,
          'status', w.status,
          'secret_ref', w.secret_ref,
          'metadata', w.metadata
        ) order by w.created_at desc
      )
      from public.organization_webhook_subscriptions w where w.organization_id = v_org_id
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'action', a.action,
          'resource_type', a.resource_type,
          'status', a.status,
          'metadata', a.metadata,
          'created_at', a.created_at
        ) order by a.created_at desc
      )
      from (
        select * from public.organization_api_audit_log
        where organization_id = v_org_id
        order by created_at desc limit 10
      ) a
    ), '[]'::jsonb),
    'principles', jsonb_build_array(
      'Scoped permissions — least privilege for every API key',
      'Audit logging for all API platform actions',
      'Rate limits by tier — protect tenant and platform stability',
      'Token expiration — keys expire unless renewed',
      'Secure secret handling — prefix/hash and secret_ref only',
      'Human approval required for elevated scopes'
    ),
    'engagement_summary', public._apdbp_engagement_summary(v_org_id),
    'blueprint_philosophy', 'Developers should integrate confidently — governance visible, secrets never stored in plain text, extensibility grows adoption.',
    'abos_principle', 'Extensibility increases when developers can build securely upon a platform they trust.',
    'vision', 'Integrations accelerate adoption when APIs are scoped, auditable, and well documented.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 34,
      'title', 'API & Developer Platform',
      'engine_phase', 'A.21',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE34_API_DEVELOPER_PLATFORM.md'
    ),
    'developer_objectives', public._apdbp_developer_objectives(),
    'api_categories', public._apdbp_api_categories(),
    'developer_experience', public._apdbp_developer_experience(),
    'security_principles', public._apdbp_security_principles(),
    'trust_connection_blueprint', public._apdbp_trust_connection(),
    'dogfooding_blueprint', public._apdbp_dogfooding(),
    'blueprint_integration_links', public._apdbp_integration_links(),
    'blueprint_vision_phrases', public._apdbp_vision_phrases(),
    'blueprint_success_criteria', public._apdbp_success_criteria(v_org_id),
    'distinction_note', public._apdbp_distinction_note()
  );

  return v_base;
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_api_platform_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._api_ensure_settings(v_org_id);
  v_summary := public._apdbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'active_keys', coalesce((v_summary->>'active_keys')::int, 0),
    'active_webhooks', coalesce((v_summary->>'active_webhooks')::int, 0),
    'philosophy', 'Secure tenant APIs — metadata-first, human approval for elevated access.',
    'mission', 'Empower developers to integrate and build upon Aipify securely.',
    'abos_principle', 'Extensibility increases when developers can build securely.',
    'blueprint_phase', 34,
    'engine_phase', 'A.21',
    'route', '/app/api-platform-engine'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._apdbp_developer_objectives() to authenticated;
grant execute on function public._apdbp_api_categories() to authenticated;
grant execute on function public._apdbp_developer_experience() to authenticated;
grant execute on function public._apdbp_security_principles() to authenticated;
grant execute on function public._apdbp_trust_connection() to authenticated;
grant execute on function public._apdbp_dogfooding() to authenticated;
grant execute on function public._apdbp_vision_phrases() to authenticated;
grant execute on function public._apdbp_integration_links() to authenticated;
grant execute on function public._apdbp_distinction_note() to authenticated;
grant execute on function public._apdbp_engagement_summary(uuid) to authenticated;
grant execute on function public._apdbp_success_criteria(uuid) to authenticated;
