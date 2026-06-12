-- Implementation Blueprint Phase 5 — Integration & Connectivity Foundation
-- Spec alignment extending Integration Engine (Phase A.8). No new tables.

create or replace function public._ige_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active int := 0;
  v_catalog int := 0;
  v_sync_logs int := 0;
  v_audit int := 0;
  v_permissions int := 0;
  v_webhooks int := 0;
  v_credentials int := 0;
begin
  select count(*) into v_active
  from public.organization_integrations
  where organization_id = p_organization_id and status = 'active' and enabled;

  select count(*) into v_catalog
  from public.integration_catalog where is_available and not is_future;

  select count(*) into v_sync_logs
  from public.integration_sync_logs where organization_id = p_organization_id;

  select count(*) into v_audit
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and action_type in (
      'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
      'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
      'integration_webhook_received', 'integration_webhook_failed', 'integration_removed'
    );

  select count(*) into v_permissions
  from public.organization_role_permissions
  where organization_id = p_organization_id and permission_key like 'integrations.%';

  select count(*) into v_webhooks
  from public.integration_webhook_events where organization_id = p_organization_id;

  select count(*) into v_credentials
  from public.organization_integrations
  where organization_id = p_organization_id and credentials_reference is not null;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'connect_services',
      'label', 'Organizations can connect external services securely',
      'met', v_active > 0,
      'note', case when v_active = 0 then 'Connect an available integration from the catalog or Unonight pilot.' else null end
    ),
    jsonb_build_object(
      'key', 'permission_scopes',
      'label', 'Integration permissions are scoped and enforceable',
      'met', v_permissions > 0,
      'note', 'integrations.* permissions via organization_role_permissions — explicit consent required.'
    ),
    jsonb_build_object(
      'key', 'audit_trails',
      'label', 'Integration lifecycle events are auditable',
      'met', v_audit > 0 or v_sync_logs > 0,
      'note', 'Established, granted, revoked, sync, failure, and webhook events logged.'
    ),
    jsonb_build_object(
      'key', 'modular_connectors',
      'label', 'Modular connector architecture with catalog',
      'met', v_catalog > 0
    ),
    jsonb_build_object(
      'key', 'reduced_friction',
      'label', 'Setup and sync reduce operational friction',
      'met', v_active > 0 and (v_sync_logs > 0 or v_credentials > 0),
      'note', case
        when v_active > 0 and v_sync_logs = 0 then 'Trigger a sync to validate connectivity.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'cross_system_assistance',
      'label', 'Cross-system assistance via sync and webhooks',
      'met', v_webhooks > 0 or v_sync_logs > 0,
      'note', 'Support AI and Admin Assistant consume integration signals — metadata only.'
    )
  );
end; $$;

create or replace function public.get_integration_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_integrations', (
      select count(*) from public.organization_integrations
      where organization_id = v_org_id and status = 'active' and enabled
    ),
    'failed_integrations', (
      select count(*) from public.organization_integrations
      where organization_id = v_org_id and status = 'failed'
    ),
    'philosophy', 'Meet organizations where they work — reduce friction; technology adapts to people.',
    'mission', 'Provide a secure, scalable, and extensible integration framework that connects Aipify to the systems organizations already use.',
    'abos_principle', 'Technology should adapt to people. Integrations should extend existing workflows — not replace them.',
    'integration_engine_note', 'Integration Engine (ABOS Phase 5) — extends Integration Engine (Phase A.8).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_integration_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('integrations.view');
  v_org_id := public._mta_require_organization();
  perform public._ige_seed_demo_integrations(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'mission', 'Provide a secure, scalable, and extensible integration framework that connects Aipify to the systems organizations already use.',
    'philosophy', 'Meet organizations where they work — reduce friction; technology adapts to people. Integrations extend workflows without forcing new habits.',
    'abos_principle', 'Technology should adapt to people. Integrations should extend existing workflows — not replace them.',
    'vision', 'Connected systems should feel like one calm operational layer — transparent, permission-aware, and easy to configure or disable.',
    'integration_engine_note', 'Integration & Connectivity Foundation (ABOS Phase 5) — extends Integration Engine (Phase A.8).',
    'integration_principles', jsonb_build_array(
      'Secure — credentials encrypted server-side, never exposed to frontend',
      'Transparent — connected systems, scopes, and actions visible to administrators',
      'Permission-aware — explicit consent and scoped integrations.* permissions',
      'Auditable — lifecycle, sync, webhook, and approval events logged',
      'Easy to configure and disable — independent activation per organization'
    ),
    'platform_priorities', jsonb_build_array(
      jsonb_build_object(
        'category', 'commerce',
        'label', 'Commerce',
        'integrations', jsonb_build_array('Shopify', 'WooCommerce', 'WordPress'),
        'status', 'catalog_scaffold'
      ),
      jsonb_build_object(
        'category', 'communication',
        'label', 'Communication',
        'integrations', jsonb_build_array('Gmail', 'Outlook', 'Slack', 'Microsoft Teams'),
        'status', 'planned'
      ),
      jsonb_build_object(
        'category', 'productivity',
        'label', 'Productivity',
        'integrations', jsonb_build_array('Google Calendar', 'Microsoft Calendar', 'Task systems'),
        'status', 'planned'
      ),
      jsonb_build_object(
        'category', 'support',
        'label', 'Support',
        'integrations', jsonb_build_array('Native Aipify Support AI', 'Future ticketing systems'),
        'status', 'active_scaffold'
      )
    ),
    'install_connection', jsonb_build_object(
      'capabilities', jsonb_build_array(
        'Detect connected systems during installation',
        'Recommend integrations based on discovery',
        'Guide setup with human approval at permission review',
        'Validate connectivity via sync and webhook tests'
      ),
      'install_engine_route', '/app/aipify-install-engine',
      'install_wizard_route', '/app/install'
    ),
    'permission_requirements', jsonb_build_array(
      'Explicit consent before connecting external systems',
      'Scoped integrations.* permissions per role',
      'Human approval for medium and high-risk connection scopes',
      'Periodic access reviews via security settings',
      'Immediate revocation and disable paths'
    ),
    'audit_requirements', jsonb_build_array(
      'Integration established and connected',
      'Permissions granted and revoked',
      'Credential rotation events',
      'Sync executed, failed, and retried',
      'Webhook received, validated, or failed',
      'Approval events for sensitive connection scopes'
    ),
    'self_love_note', 'Self Love (A.76 planned) will reduce integration burden — minimize duplicate setup, celebrate early connected wins, and encourage patience during rollout. Scaffold only — full A.76 integration is future work; Integration Engine does not store wellbeing content.',
    'trust_connection', jsonb_build_object(
      'principle', 'Organizations should always understand which systems are connected, what information is shared, what actions Aipify may perform, and how to disable integrations.',
      'organizations_should_understand', jsonb_build_array(
        'Which external systems are connected',
        'What information is shared (metadata only by default)',
        'What actions Aipify may perform through integrations',
        'How to review, approve, and disable connections'
      ),
      'disable_path', 'Disable integrations from this dashboard or via integrations.disable permission — credentials remain vaulted until revoked.'
    ),
    'connector_architecture', jsonb_build_object(
      'note', 'Modular connector framework — integration_catalog defines available connectors; organization_integrations stores tenant connections; credential vault, sync logs, and webhooks are independent modules per connector.',
      'modules', jsonb_build_array('catalog', 'credentials', 'sync', 'webhooks', 'audit')
    ),
    'dogfooding', jsonb_build_object(
      'principle', 'Aipify connects internally first; lessons improve customer integration guidance.',
      'aipify_group', jsonb_build_object(
        'slug', 'aipify-group',
        'role', 'Internal validation',
        'integrations', jsonb_build_array('Gmail', 'Google Calendar', 'Knowledge Center sync')
      ),
      'unonight', jsonb_build_object(
        'slug', 'unonight',
        'role', 'First external pilot',
        'integrations', jsonb_build_array('Shopify (planned)', 'Unonight pilot', 'Support workflows')
      )
    ),
    'success_criteria', public._ige_blueprint_success_criteria(v_org_id),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Install & Adoption Engine', 'route', '/app/aipify-install-engine'),
      jsonb_build_object('label', 'Install Wizard (Phase 17)', 'route', '/app/install'),
      jsonb_build_object('label', 'Audit & Accountability (A.4)', 'route', '/app/audit-accountability'),
      jsonb_build_object('label', 'Trust & Explainability', 'route', '/app/trust'),
      jsonb_build_object('label', 'Approvals', 'route', '/app/approvals'),
      jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine')
    ),
    'safety_note', 'Credentials are encrypted server-side and never exposed to frontend systems.',
    'principles', jsonb_build_array(
      'Tenant-aware integrations',
      'Secure credential handling',
      'Audit logging for integration events',
      'Modular integration architecture',
      'Independent activation per organization'
    ),
    'connected_integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'integration_name', i.integration_name,
        'status', i.status, 'enabled', i.enabled, 'last_sync_at', i.last_sync_at,
        'last_error', i.last_error, 'has_credentials', i.credentials_reference is not null,
        'configuration', i.configuration - 'secret' - 'api_key' - 'password'
      ) order by i.integration_name)
      from public.organization_integrations i where i.organization_id = v_org_id and i.status <> 'archived'
    ), '[]'::jsonb),
    'catalog', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_key', c.integration_key, 'integration_name', c.integration_name,
        'category', c.category, 'description', c.description,
        'is_available', c.is_available, 'is_future', c.is_future
      ) order by c.sort_order)
      from public.integration_catalog c
    ), '[]'::jsonb),
    'recent_failures', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'integration_id', l.integration_id, 'sync_type', l.sync_type,
        'error_message', l.error_message, 'retry_count', l.retry_count, 'started_at', l.started_at
      ) order by l.started_at desc)
      from public.integration_sync_logs l
      where l.organization_id = v_org_id and l.status = 'failed' limit 8
    ), '[]'::jsonb),
    'recent_webhooks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'integration_id', w.integration_id, 'event_type', w.event_type,
        'status', w.status, 'signature_valid', w.signature_valid, 'created_at', w.created_at
      ) order by w.created_at desc)
      from public.integration_webhook_events w
      where w.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'pending_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'integration_name', i.integration_name,
        'status', i.status, 'warning', case
          when i.status = 'pending' then 'Awaiting activation'
          when i.status = 'failed' then coalesce(i.last_error, 'Sync failure')
          when not i.enabled then 'Integration disabled'
          else 'Configuration review recommended'
        end
      ))
      from public.organization_integrations i
      where i.organization_id = v_org_id
        and (i.status in ('pending', 'failed') or not i.enabled or i.last_error is not null)
    ), '[]'::jsonb),
    'health_summary', jsonb_build_object(
      'active', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'active' and enabled),
      'failed', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'failed'),
      'disabled', (select count(*) from public.organization_integrations where organization_id = v_org_id and (not enabled or status = 'disabled')),
      'pending', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'pending')
    ),
    'unonight_pilot', (
      select jsonb_build_object(
        'connected', exists(select 1 from public.organization_integrations where organization_id = v_org_id and integration_key = 'unonight' and enabled),
        'status', (select status from public.organization_integrations where organization_id = v_org_id and integration_key = 'unonight' limit 1),
        'last_sync_at', (select last_sync_at from public.organization_integrations where organization_id = v_org_id and integration_key = 'unonight' limit 1)
      )
    )
  );
end; $$;

grant execute on function public._ige_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'integration-connectivity-blueprint', 'Integration & Connectivity (ABOS Phase 5)', 'Secure, permission-aware integration framework — connect systems organizations already use.', 'authenticated', 67
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'integration-connectivity-blueprint' and tenant_id is null);
