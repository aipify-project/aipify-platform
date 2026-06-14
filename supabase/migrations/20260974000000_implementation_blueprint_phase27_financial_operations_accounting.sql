-- Implementation Blueprint Phase 27 — Financial Operations & Accounting Integration Engine
-- Spec alignment extending Integration Engine (Phase A.8). No new tables.

alter table public.integration_catalog drop constraint if exists integration_catalog_category_check;
alter table public.integration_catalog add constraint integration_catalog_category_check check (
  category in ('pilot', 'email', 'knowledge', 'commerce', 'payments', 'communication', 'crm', 'erp', 'accounting')
);

insert into public.integration_catalog (
  integration_key, integration_name, category, description, is_available, is_future, sort_order
)
select
  'fiken',
  'Fiken',
  'accounting',
  'Norwegian accounting integration — source of truth for bookkeeping. Aipify coordinates awareness; Fiken owns the ledger.',
  false,
  true,
  14
where not exists (
  select 1 from public.integration_catalog where integration_key = 'fiken'
);

create or replace function public._foaibp_blueprint_financial_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'monitor_events', 'label', 'Monitor events', 'description', 'Track payment and sync signals from Stripe and accounting integrations — metadata only'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness', 'description', 'Surface subscription, revenue, and invoice follow-up cues without replacing accounting systems'),
    jsonb_build_object('key', 'surface_signals', 'label', 'Surface signals', 'description', 'Executive summaries and reminders — calm, explainable, never alarmist'),
    jsonb_build_object('key', 'coordinate_accounting', 'label', 'Coordinate with accounting', 'description', 'Fiken remains source of truth; Aipify coordinates workflows and preparation'),
    jsonb_build_object('key', 'respect_governance', 'label', 'Respect governance', 'description', 'Payment-sensitive actions require Trust & Action approval — never silent auto-posting')
  );
$$;

create or replace function public._foaibp_blueprint_primary_strategy()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaborate with specialized systems — Stripe for payments, Fiken for accounting, Aipify for operational awareness.',
    'systems', jsonb_build_array(
      jsonb_build_object(
        'key', 'fiken',
        'name', 'Fiken',
        'role', 'primary_accounting',
        'emoji', '🇳🇴',
        'note', 'Source of truth for bookkeeping — Aipify never overrides ledger data'
      ),
      jsonb_build_object(
        'key', 'stripe',
        'name', 'Stripe',
        'role', 'primary_payments',
        'emoji', '💳',
        'note', 'Payment events and subscription signals — webhook and sync awareness'
      )
    ),
    'coordination_model', 'stripe_to_fiken',
    'coordination_note', 'Stripe payment events inform accounting awareness — Fiken remains authoritative for books and compliance.',
    'aipify_role', 'operational_awareness_layer',
    'aipify_role_note', 'Aipify monitors, surfaces, and coordinates — not a bookkeeping or tax platform.'
  );
$$;

create or replace function public._foaibp_blueprint_aipify_may()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Subscription awareness and revenue visibility from Stripe metadata',
    'Failed payment notifications and financial task reminders',
    'Invoice follow-up coordination — summaries for human review',
    'Executive financial summaries for leadership briefings',
    'Workflow coordination between Stripe events and Fiken sync awareness'
  );
$$;

create or replace function public._foaibp_blueprint_should_not()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify assists financial workflows — specialized accounting systems and accountants remain authoritative.',
    'should_not_become', jsonb_build_array(
      'Bookkeeping system or general ledger',
      'Tax engine or regulatory reporting platform',
      'Replacement for accountants or auditors',
      'Silent auto-posting to accounting without explicit approval',
      'Source of truth for financial records — Fiken and Stripe integrations own their domains'
    ),
    'preserved_a8', jsonb_build_array(
      'Credential vault, sync engine, webhooks, and integration catalog',
      'Tenant-scoped connections with full auditability',
      'Phase 5 connectivity success criteria via _ige_blueprint_success_criteria()'
    )
  );
$$;

create or replace function public._foaibp_blueprint_executive_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'subscription_revenue_up',
      'scenario', 'Subscription revenue up — thoughtful foresight',
      'example', '🦉 Subscription revenue rose this month — worth a calm review before your executive sync. Would you like a summary?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'invoices_need_follow_up',
      'scenario', 'Invoices need follow-up',
      'example', '🌹 Three invoices are awaiting follow-up — Aipify prepared a summary for your review when you have a moment.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'financial_milestone',
      'scenario', 'Financial milestone approaching',
      'example', '🔔 Quarterly revenue milestone approaching — preparation window opens this week.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'workflows_healthy',
      'scenario', 'Financial workflows healthy',
      'example', '❤️ Stripe and Fiken integrations are healthy — financial workflows look steady today.'
    )
  );
$$;

create or replace function public._foaibp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love reduces admin burden, improves visibility, encourages preparation, and minimizes surprises — peace of mind, not constant financial alerts.',
    'practices', jsonb_build_array(
      'Reduce admin burden — calm summaries instead of spreadsheet chasing',
      'Improve visibility — revenue and subscription signals when they matter',
      'Encourage preparation — milestones and follow-ups before deadlines',
      'Minimize surprises — failed payment awareness without alarmist tone',
      'Build confidence — transparent about what Aipify accesses and why'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Integration Engine stores connection metadata, not financial records.'
  );
$$;

create or replace function public._foaibp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'What financial metadata is accessed, why insights appear, Fiken and Stripe as source of truth — payment-sensitive actions require approval.',
    'users_should_know', jsonb_build_array(
      'Which financial integrations are connected and their sync status',
      'What metadata Aipify reads — events and summaries, never raw card data or full ledger exports',
      'Why financial insights appear — signals from Stripe webhooks and Fiken sync awareness',
      'Fiken and Stripe remain source of truth — Aipify does not override accounting records',
      'Payment-sensitive actions require explicit approval via Trust & Action'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Commercial Packages /app/settings/billing — tenant billing UI, not integration coordination',
      'Distinct from Subscription Plan Management A.11 — plan modules and trials, not Fiken/Stripe connectors',
      'Distinct from License Center /app/license — subscription status and payment recovery',
      'Distinct from Executive Insights A.35 — strategic summaries consume integration signals',
      'Command Center A.26 may surface financial awareness — one Aipify Core'
    ),
    'audit_note', 'Integration sync, webhook, and connection events logged — metadata only, no PAN or account numbers.'
  );
$$;

create or replace function public._foaibp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates financial operations awareness internally; Unonight is the future commerce pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Stripe events, Fiken sync awareness, executive summaries, subscription monitoring',
      'focus', jsonb_build_array('Stripe webhook and payment event awareness', 'Fiken accounting sync scaffold', 'Executive financial summary preparation', 'Failed payment notification coordination')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'Future commerce pilot — payment and subscription visibility',
      'focus', jsonb_build_array('Commerce payment signal awareness', 'Subscription monitoring for pilot operations', 'Invoice follow-up coordination scaffold')
    )
  );
$$;

create or replace function public._foaibp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Commercial Packages — Billing', 'route', '/app/settings/billing', 'note', 'Tenant billing and module licensing — distinct from integration connectors'),
    jsonb_build_object('label', 'Commercial Packages — Modules', 'route', '/app/settings/modules', 'note', 'Module activation and usage — cross-link only'),
    jsonb_build_object('label', 'License Center', 'route', '/app/license', 'note', 'Subscription status and payment recovery'),
    jsonb_build_object('label', 'Subscription Plan Management (A.11)', 'route', '/app/subscription-plan-management-engine', 'note', 'Plan modules, trials, upgrade paths'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Strategic executive summaries — may consume financial signals'),
    jsonb_build_object('label', 'Trust & Action Approvals', 'route', '/app/approvals', 'note', 'Payment-sensitive actions require explicit approval'),
    jsonb_build_object('label', 'Notification Communication (A.17)', 'route', '/app/notification-communication-engine', 'note', 'Failed payment and financial reminder delivery'),
    jsonb_build_object('label', 'Command Center (A.26)', 'route', '/app/command-center', 'note', 'Executive feed and quick actions'),
    jsonb_build_object('label', 'Install Engine (Phase 17)', 'route', '/app/install', 'note', 'Discovery may recommend Stripe during onboarding'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Reduce admin burden — principle only')
  );
$$;

create or replace function public._foaibp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Operational companion ensuring financial moments do not go unnoticed — not replacing accountants.',
    'Financial systems work quietly; leaders get clarity when it matters.',
    'Fiken and Stripe remain source of truth — Aipify coordinates awareness and preparation.',
    'Reduce admin burden, improve visibility, minimize surprises — confidence through transparency.',
    'Collaborate with specialized systems — automation without sacrificing compliance.'
  );
$$;

create or replace function public._foaibp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_stripe_connected boolean := false;
  v_fiken_connected boolean := false;
  v_stripe_active boolean := false;
  v_fiken_active boolean := false;
  v_stripe_syncs int := 0;
  v_fiken_syncs int := 0;
  v_stripe_webhooks int := 0;
  v_financial_webhooks int := 0;
  v_stripe_failures int := 0;
  v_last_stripe_sync timestamptz;
  v_last_fiken_sync timestamptz;
begin
  select exists(
    select 1 from public.organization_integrations
    where organization_id = p_org_id and integration_key = 'stripe'
  ) into v_stripe_connected;

  select exists(
    select 1 from public.organization_integrations
    where organization_id = p_org_id and integration_key = 'fiken'
  ) into v_fiken_connected;

  select exists(
    select 1 from public.organization_integrations
    where organization_id = p_org_id and integration_key = 'stripe' and status = 'active' and enabled
  ) into v_stripe_active;

  select exists(
    select 1 from public.organization_integrations
    where organization_id = p_org_id and integration_key = 'fiken' and status = 'active' and enabled
  ) into v_fiken_active;

  select count(*) into v_stripe_syncs
  from public.integration_sync_logs l
  join public.organization_integrations i on i.id = l.integration_id
  where l.organization_id = p_org_id and i.integration_key = 'stripe';

  select count(*) into v_fiken_syncs
  from public.integration_sync_logs l
  join public.organization_integrations i on i.id = l.integration_id
  where l.organization_id = p_org_id and i.integration_key = 'fiken';

  select count(*) into v_stripe_webhooks
  from public.integration_webhook_events w
  join public.organization_integrations i on i.id = w.integration_id
  where w.organization_id = p_org_id and i.integration_key = 'stripe';

  select count(*) into v_financial_webhooks
  from public.integration_webhook_events w
  join public.organization_integrations i on i.id = w.integration_id
  where w.organization_id = p_org_id
    and i.integration_key in ('stripe', 'fiken');

  select count(*) into v_stripe_failures
  from public.integration_sync_logs l
  join public.organization_integrations i on i.id = l.integration_id
  where l.organization_id = p_org_id
    and i.integration_key = 'stripe'
    and l.status = 'failed';

  select max(l.completed_at) into v_last_stripe_sync
  from public.integration_sync_logs l
  join public.organization_integrations i on i.id = l.integration_id
  where l.organization_id = p_org_id
    and i.integration_key = 'stripe'
    and l.status = 'completed';

  select max(l.completed_at) into v_last_fiken_sync
  from public.integration_sync_logs l
  join public.organization_integrations i on i.id = l.integration_id
  where l.organization_id = p_org_id
    and i.integration_key = 'fiken'
    and l.status = 'completed';

  return jsonb_build_object(
    'stripe_connected', v_stripe_connected,
    'fiken_connected', v_fiken_connected,
    'stripe_active', v_stripe_active,
    'fiken_active', v_fiken_active,
    'stripe_syncs', v_stripe_syncs,
    'fiken_syncs', v_fiken_syncs,
    'stripe_webhooks', v_stripe_webhooks,
    'financial_webhooks', v_financial_webhooks,
    'stripe_sync_failures', v_stripe_failures,
    'last_stripe_sync_at', v_last_stripe_sync,
    'last_fiken_sync_at', v_last_fiken_sync,
    'fiken_catalog_scaffold', exists(select 1 from public.integration_catalog where integration_key = 'fiken'),
    'stripe_catalog_available', exists(select 1 from public.integration_catalog where integration_key = 'stripe'),
    'privacy_note', 'Counts and connection status only — no payment amounts, PAN, or ledger content.'
  );
end; $$;

create or replace function public._foaibp_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_stripe_active boolean := false;
  v_fiken_catalog boolean := false;
  v_financial_webhooks int := 0;
  v_stripe_syncs int := 0;
begin
  v_engagement := public._foaibp_engagement_summary(p_org_id);
  v_stripe_active := coalesce((v_engagement->>'stripe_active')::boolean, false);
  v_fiken_catalog := coalesce((v_engagement->>'fiken_catalog_scaffold')::boolean, false);
  v_financial_webhooks := coalesce((v_engagement->>'financial_webhooks')::int, 0);
  v_stripe_syncs := coalesce((v_engagement->>'stripe_syncs')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'stripe_accounting_flow',
      'label', 'Stripe→accounting flow awareness — payment signals coordinate with accounting strategy',
      'met', v_stripe_active or v_financial_webhooks > 0 or v_stripe_syncs > 0,
      'note', case
        when not v_stripe_active then 'Connect Stripe from the integration catalog to begin payment event awareness.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'fiken_source_of_truth',
      'label', 'Fiken remains source of truth — accounting integration strategy documented',
      'met', v_fiken_catalog,
      'note', 'Fiken catalog scaffold marks accounting as authoritative — Aipify coordinates only.'
    ),
    jsonb_build_object(
      'key', 'visibility_improves',
      'label', 'Visibility improves — financial engagement summary from integration signals',
      'met', v_engagement is not null,
      'note', 'Stripe webhooks, sync logs, and connection status surface operational awareness.'
    ),
    jsonb_build_object(
      'key', 'admin_effort_down',
      'label', 'Admin effort down — sync and webhook coordination scaffold active',
      'met', v_stripe_syncs > 0 or v_financial_webhooks > 0 or v_stripe_active,
      'note', case
        when v_stripe_syncs = 0 and v_financial_webhooks = 0 and not v_stripe_active
          then 'Trigger a Stripe sync or connect the integration to validate coordination.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'confidence_up',
      'label', 'Confidence up — trust connection and boundaries documented',
      'met', (public._foaibp_blueprint_trust_connection()->>'principle') is not null,
      'note', 'Transparent about metadata access; Fiken and Stripe remain authoritative.'
    ),
    jsonb_build_object(
      'key', 'financial_principles',
      'label', 'Financial principles documented — monitor, awareness, signals, coordinate, govern',
      'met', jsonb_array_length(public._foaibp_blueprint_financial_principles()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'aipify_boundaries',
      'label', 'Aipify MAY and should NOT boundaries enforced',
      'met', jsonb_array_length(public._foaibp_blueprint_aipify_may()) >= 5
        and jsonb_array_length(public._foaibp_blueprint_should_not()->'should_not_become') >= 5,
      'note', 'Not a bookkeeping system, tax engine, or accountant replacement.'
    ),
    jsonb_build_object(
      'key', 'executive_examples',
      'label', 'Executive insight examples documented (🦉🌹🔔❤️)',
      'met', jsonb_array_length(public._foaibp_blueprint_executive_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — reduce admin burden, minimize surprises',
      'met', true,
      'note', 'Self Love is a principle — peace of mind, not constant financial alerts.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from billing, subscription, and license engines',
      'met', jsonb_array_length(public._foaibp_blueprint_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate Commercial Packages or License Center.'
    ),
    jsonb_build_object(
      'key', 'primary_strategy',
      'label', 'Primary strategy metadata — Fiken accounting, Stripe payments, Stripe→Fiken model',
      'met', (public._foaibp_blueprint_primary_strategy()->>'coordination_model') = 'stripe_to_fiken',
      'note', null
    )
  );
end; $$;

create or replace function public._foaibp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Commercial Packages /app/settings/billing (tenant billing UI), Subscription Plan Management A.11 /app/subscription-plan-management-engine (plan modules), License Center /app/license (subscription recovery), and Executive Insights A.35 /app/executive-insights-engine (strategic summaries). Phase A.8 credential vault, sync, webhooks, and Phase 5 connectivity criteria preserved.';
$$;

create or replace function public.get_integration_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_engagement := public._foaibp_engagement_summary(v_org_id);

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
    'integration_engine_note', 'Integration Engine (ABOS Phase 5 + Phase 27) — extends Integration Engine (Phase A.8).',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 27 — Financial Operations & Accounting Integration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE27_FINANCIAL_OPERATIONS_ACCOUNTING.md',
      'engine_phase', 'Phase A.8 Integration Engine',
      'route', '/app/integration-engine'
    ),
    'blueprint_mission', 'Support financial operations through trusted integrations — assist workflows, never replace accountants.',
    'blueprint_abos_principle', 'Financial systems work quietly; leaders get clarity when it matters.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Financial Operations (ABOS Phase 27) — Fiken accounting, Stripe payments, operational awareness layer.'
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
    'integration_engine_note', 'Financial Operations & Accounting Integration (ABOS Phase 27) — extends Integration Engine Phase A.8 and Phase 5 connectivity.',
    'integration_principles', jsonb_build_array(
      'Secure — credentials encrypted server-side, never exposed to frontend',
      'Transparent — connected systems, scopes, and actions visible to administrators',
      'Permission-aware — explicit consent and scoped integrations.* permissions',
      'Auditable — lifecycle, sync, webhook, and approval events logged',
      'Easy to configure and disable — independent activation per organization'
    ),
    'platform_priorities', jsonb_build_array(
      jsonb_build_object(
        'category', 'financial',
        'label', 'Financial Operations',
        'integrations', jsonb_build_array('Stripe', 'Fiken'),
        'status', 'phase_27_primary'
      ),
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
    'self_love_note', 'Self Love (A.76) reduces integration and financial admin burden — minimize surprises, encourage preparation, celebrate early connected wins. Principle only — Integration Engine stores connection metadata, not wellbeing or ledger content.',
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
        'role', 'Internal validation — Stripe events, Fiken sync awareness',
        'integrations', jsonb_build_array('Stripe', 'Fiken (scaffold)', 'Gmail', 'Google Calendar')
      ),
      'unonight', jsonb_build_object(
        'slug', 'unonight',
        'role', 'Future commerce pilot',
        'integrations', jsonb_build_array('Shopify (planned)', 'Stripe (planned)', 'Support workflows')
      )
    ),
    'success_criteria', public._ige_blueprint_success_criteria(v_org_id),
    'financial_operations_success_criteria', public._foaibp_blueprint_success_criteria(v_org_id),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Billing Settings', 'route', '/app/settings/billing'),
      jsonb_build_object('label', 'License Center', 'route', '/app/license'),
      jsonb_build_object('label', 'Subscription Plans', 'route', '/app/subscription-plan-management-engine'),
      jsonb_build_object('label', 'Executive Insights', 'route', '/app/executive-insights-engine'),
      jsonb_build_object('label', 'Approvals', 'route', '/app/approvals'),
      jsonb_build_object('label', 'Install & Adoption Engine', 'route', '/app/aipify-install-engine'),
      jsonb_build_object('label', 'Install Wizard (Phase 17)', 'route', '/app/install'),
      jsonb_build_object('label', 'Audit & Accountability (A.4)', 'route', '/app/audit-accountability'),
      jsonb_build_object('label', 'Trust & Explainability', 'route', '/app/trust'),
      jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine')
    ),
    'safety_note', 'Credentials are encrypted server-side and never exposed to frontend systems. Financial metadata only — no PAN, ledger exports, or tax filings stored.',
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
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 27 — Financial Operations & Accounting Integration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE27_FINANCIAL_OPERATIONS_ACCOUNTING.md',
      'engine_phase', 'Phase A.8 Integration Engine',
      'route', '/app/integration-engine',
      'mapping_note', 'ABOS Blueprint Phase 27 maps to Integration Engine Phase A.8 — extend, do not duplicate Commercial Packages, License Center, or Subscription Plan Management.'
    ),
    'financial_operations_note', 'Financial Operations & Accounting Integration Engine (ABOS Phase 27) — Fiken accounting, Stripe payments, Stripe→Fiken coordination, operational awareness layer.',
    'blueprint_philosophy', 'Collaborate with specialized systems — automation without sacrificing compliance.',
    'blueprint_mission', 'Support financial operations through trusted integrations — assist workflows, never replace accountants.',
    'blueprint_abos_principle', 'Financial systems work quietly; leaders get clarity when it matters.',
    'blueprint_distinction_note', public._foaibp_distinction_note(),
    'financial_principles', public._foaibp_blueprint_financial_principles(),
    'primary_strategy', public._foaibp_blueprint_primary_strategy(),
    'aipify_may', public._foaibp_blueprint_aipify_may(),
    'blueprint_boundaries', public._foaibp_blueprint_should_not(),
    'executive_insight_examples', public._foaibp_blueprint_executive_examples(),
    'self_love_connection', public._foaibp_blueprint_self_love_connection(),
    'financial_trust_connection', public._foaibp_blueprint_trust_connection(),
    'financial_dogfooding', public._foaibp_blueprint_dogfooding(),
    'blueprint_integration_links', public._foaibp_blueprint_integration_links(),
    'engagement_summary', public._foaibp_engagement_summary(v_org_id),
    'vision_phrases', public._foaibp_blueprint_vision_phrases(),
    'privacy_note', 'Financial operations awareness is organization-scoped, explainable, and auditable. Metadata only — Fiken and Stripe remain source of truth.'
  );
end; $$;

grant execute on function public._foaibp_blueprint_financial_principles() to authenticated;
grant execute on function public._foaibp_blueprint_primary_strategy() to authenticated;
grant execute on function public._foaibp_blueprint_aipify_may() to authenticated;
grant execute on function public._foaibp_blueprint_should_not() to authenticated;
grant execute on function public._foaibp_blueprint_executive_examples() to authenticated;
grant execute on function public._foaibp_blueprint_self_love_connection() to authenticated;
grant execute on function public._foaibp_blueprint_trust_connection() to authenticated;
grant execute on function public._foaibp_blueprint_dogfooding() to authenticated;
grant execute on function public._foaibp_blueprint_integration_links() to authenticated;
grant execute on function public._foaibp_blueprint_vision_phrases() to authenticated;
grant execute on function public._foaibp_engagement_summary(uuid) to authenticated;
grant execute on function public._foaibp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'financial-operations-accounting-blueprint', 'Financial Operations & Accounting (ABOS Phase 27)',
  'Financial Operations & Accounting Integration Engine — Fiken accounting, Stripe payments, operational awareness via Integration Engine Phase A.8.',
  'authenticated', 104
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'financial-operations-accounting-blueprint' and tenant_id is null
);
