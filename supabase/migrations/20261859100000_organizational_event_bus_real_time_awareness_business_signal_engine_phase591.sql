-- Phase 591 — Organizational Event Bus, Real-Time Awareness & Business Signal Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/events/*
-- Helpers: _oeb591_*

create table if not exists public.organization_oeb591_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  event_bus_enabled boolean not null default true,
  signal_engine_enabled boolean not null default true,
  correlation_enabled boolean not null default true,
  alert_orchestration_enabled boolean not null default true,
  retention_days integer not null default 90,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_oeb591_settings enable row level security;
revoke all on public.organization_oeb591_settings from authenticated, anon;

create table if not exists public.organization_oeb591_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_key text not null,
  event_type text not null,
  event_source text not null default 'aipify_core',
  severity text not null default 'information' check (
    severity in ('information', 'positive', 'attention', 'risk', 'critical')
  ),
  business_pack text,
  entity_ref text not null default '',
  event_status text not null default 'active' check (event_status in ('active', 'archived')),
  summary text not null default '' check (char_length(summary) <= 500),
  occurred_at timestamptz not null default now(),
  unique (organization_id, event_key)
);

alter table public.organization_oeb591_events enable row level security;
revoke all on public.organization_oeb591_events from authenticated, anon;

create table if not exists public.organization_oeb591_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_class text not null default 'information' check (
    signal_class in ('information', 'positive', 'attention', 'risk', 'critical')
  ),
  pattern_summary text not null default '',
  source_event_count integer not null default 1,
  companion_recommendation text not null default '',
  signal_status text not null default 'open',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, signal_key)
);

alter table public.organization_oeb591_signals enable row level security;
revoke all on public.organization_oeb591_signals from authenticated, anon;

create table if not exists public.organization_oeb591_correlations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  correlation_key text not null,
  correlation_title text not null,
  chain_steps jsonb not null default '[]'::jsonb,
  outcome_summary text not null default '',
  severity text not null default 'attention',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, correlation_key)
);

alter table public.organization_oeb591_correlations enable row level security;
revoke all on public.organization_oeb591_correlations from authenticated, anon;

create table if not exists public.organization_oeb591_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  subscription_key text not null,
  subscription_title text not null,
  event_category text not null check (
    event_category in ('revenue', 'customer', 'partner', 'risk', 'compliance', 'business_pack')
  ),
  delivery_channels jsonb not null default '["desktop","mobile","internal"]'::jsonb,
  subscription_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, subscription_key)
);

alter table public.organization_oeb591_subscriptions enable row level security;
revoke all on public.organization_oeb591_subscriptions from authenticated, anon;

create table if not exists public.organization_oeb591_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_key text not null,
  alert_title text not null,
  alert_channel text not null default 'internal' check (
    alert_channel in ('desktop', 'mobile', 'email', 'internal', 'integration')
  ),
  severity text not null default 'attention',
  alert_status text not null default 'open',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, alert_key)
);

alter table public.organization_oeb591_alerts enable row level security;
revoke all on public.organization_oeb591_alerts from authenticated, anon;

create table if not exists public.organization_oeb591_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_key text not null,
  source_title text not null,
  source_type text not null default 'business_pack',
  events_emitted integer not null default 0,
  source_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, source_key)
);

alter table public.organization_oeb591_sources enable row level security;
revoke all on public.organization_oeb591_sources from authenticated, anon;

create table if not exists public.organization_oeb591_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  history_key text not null,
  history_title text not null,
  history_type text not null check (
    history_type in ('recent', 'historical', 'archived', 'pattern', 'signal')
  ),
  record_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, history_key)
);

alter table public.organization_oeb591_history enable row level security;
revoke all on public.organization_oeb591_history from authenticated, anon;

create table if not exists public.organization_oeb591_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  events_count integer not null default 0,
  signals_count integer not null default 0,
  alerts_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_oeb591_business_packs enable row level security;
revoke all on public.organization_oeb591_business_packs from authenticated, anon;

create table if not exists public.organization_oeb591_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'event_bus',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_oeb591_audit_logs enable row level security;
revoke all on public.organization_oeb591_audit_logs from authenticated, anon;

create or replace function public._oeb591_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._oeb591_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'event_bus'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_oeb591_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'event_bus'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._oeb591_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_oeb591_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._oeb591_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._oeb591_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_oeb591_events where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_oeb591_events (
    organization_id, event_key, event_type, event_source, severity, business_pack, entity_ref, summary, occurred_at
  ) values
    (p_org_id, 'evt_customer_created', 'customer_created', 'crm', 'positive', null, 'customer:nordic-retail', 'Customer Created — Nordic Retail Group.', now() - interval '15 minutes'),
    (p_org_id, 'evt_invoice_paid', 'invoice_paid', 'finance_pack', 'positive', 'finance', 'invoice:inv-8842', 'Invoice Paid — large enterprise invoice collected.', now() - interval '45 minutes'),
    (p_org_id, 'evt_contract_signed', 'contract_signed', 'contracts', 'positive', null, 'contract:ent-2026', 'Contract Signed — enterprise agreement.', now() - interval '2 hours'),
    (p_org_id, 'evt_approval_done', 'approval_completed', 'trust_actions', 'information', null, 'approval:trust-441', 'Approval Completed — trust action approved.', now() - interval '3 hours'),
    (p_org_id, 'evt_pack_activated', 'business_pack_activated', 'business_packs', 'positive', 'support', 'pack:support', 'Business Pack Activated — Support Pack.', now() - interval '4 hours'),
    (p_org_id, 'evt_knowledge_updated', 'knowledge_updated', 'knowledge', 'information', 'support', 'article:playbook-12', 'Knowledge Updated — support playbook revised.', now() - interval '5 hours'),
    (p_org_id, 'evt_risk_identified', 'risk_identified', 'risk_engine', 'risk', null, 'risk:renewal-acme', 'Risk Identified — renewal risk on top account.', now() - interval '6 hours'),
    (p_org_id, 'evt_vendor_added', 'vendor_added', 'procurement', 'information', null, 'vendor:cloud-host', 'Vendor Added — cloud infrastructure vendor.', now() - interval '8 hours'),
    (p_org_id, 'evt_partner_registered', 'partner_registered', 'growth', 'positive', null, 'partner:nordic-int', 'Partner Registered — Nordic Integrator enrolled.', now() - interval '10 hours');

  insert into public.organization_oeb591_signals (
    organization_id, signal_key, signal_title, signal_class, pattern_summary, source_event_count, companion_recommendation, summary
  ) values
    (p_org_id, 'sig_cx_risk', 'Customer Experience Risk', 'risk', '5 support escalations in 24h', 5,
     'Review top accounts and assign executive sponsor.', 'Pattern detected from support escalations.'),
    (p_org_id, 'sig_growth', 'Growth Signal', 'positive', '20 new customers this week', 20,
     'Prepare onboarding capacity and success coverage.', 'Strong acquisition velocity detected.'),
    (p_org_id, 'sig_revenue', 'Revenue Signal', 'positive', '3 large invoices paid', 3,
     'Confirm expansion conversations with finance stakeholders.', 'Positive revenue momentum.'),
    (p_org_id, 'sig_renewal_risk', 'Renewal Risk Signal', 'critical', 'Contract review after complaint chain', 3,
     'Escalate to customer success and executive review.', 'Correlated events indicate renewal risk.');

  insert into public.organization_oeb591_correlations (
    organization_id, correlation_key, correlation_title, chain_steps, outcome_summary, severity, summary
  ) values (
    p_org_id, 'corr_renewal', 'Renewal Risk Chain', jsonb_build_array(
      'Customer Complaint', 'Support Escalation', 'Contract Review', 'Renewal Risk'
    ), 'Companion understands relationships across complaint → escalation → contract → renewal.',
    'critical', 'Event correlation: complaint chain to renewal risk.'
  );

  insert into public.organization_oeb591_subscriptions (
    organization_id, subscription_key, subscription_title, event_category, delivery_channels, summary
  ) values
    (p_org_id, 'sub_revenue', 'Revenue Events', 'revenue', '["desktop","email","internal"]'::jsonb, 'Subscribe to revenue-related signals.'),
    (p_org_id, 'sub_customer', 'Customer Events', 'customer', '["desktop","mobile","internal"]'::jsonb, 'Subscribe to customer lifecycle events.'),
    (p_org_id, 'sub_risk', 'Risk Events', 'risk', '["desktop","mobile","email","internal"]'::jsonb, 'Subscribe to risk and compliance signals.'),
    (p_org_id, 'sub_partner', 'Partner Events', 'partner', '["desktop","internal"]'::jsonb, 'Subscribe to partner and growth events.'),
    (p_org_id, 'sub_compliance', 'Compliance Events', 'compliance', '["email","internal"]'::jsonb, 'Subscribe to compliance events.'),
    (p_org_id, 'sub_pack', 'Business Pack Events', 'business_pack', '["desktop","mobile","internal"]'::jsonb, 'Subscribe to Business Pack activity.');

  insert into public.organization_oeb591_alerts (
    organization_id, alert_key, alert_title, alert_channel, severity, summary
  ) values
    (p_org_id, 'alert_desktop_cx', 'Desktop — Customer Experience Risk', 'desktop', 'risk', 'Delivered to Desktop Companion.'),
    (p_org_id, 'alert_mobile_renewal', 'Mobile — Renewal Risk Signal', 'mobile', 'critical', 'Delivered to Mobile Access.'),
    (p_org_id, 'alert_email_revenue', 'Email — Revenue Signal Digest', 'email', 'positive', 'Daily revenue signal digest.');

  insert into public.organization_oeb591_sources (
    organization_id, source_key, source_title, source_type, events_emitted, summary
  ) values
    (p_org_id, 'src_core', 'Aipify Core', 'platform', 120, 'Core platform event source.'),
    (p_org_id, 'src_finance', 'Finance Pack', 'business_pack', 45, 'Payment and invoice events.'),
    (p_org_id, 'src_support', 'Support Pack', 'business_pack', 78, 'Support and escalation events.'),
    (p_org_id, 'src_warehouse', 'Warehouse Pack', 'business_pack', 34, 'Inventory and fulfillment events.'),
    (p_org_id, 'src_hosts', 'Hosts Pack', 'business_pack', 22, 'Property and hospitality events.');

  insert into public.organization_oeb591_history (
    organization_id, history_key, history_title, history_type, record_count, summary
  ) values
    (p_org_id, 'hist_recent', 'Recent Activity', 'recent', 250, 'Last 7 days of organizational activity.'),
    (p_org_id, 'hist_historical', 'Historical Activity', 'historical', 4200, 'Full retention window activity.'),
    (p_org_id, 'hist_archived', 'Archived Events', 'archived', 890, 'Events moved to archive after retention.'),
    (p_org_id, 'hist_patterns', 'Pattern History', 'pattern', 38, 'Detected patterns over time.'),
    (p_org_id, 'hist_signals', 'Signal History', 'signal', 156, 'Generated signals history.');

  insert into public.organization_oeb591_business_packs (
    organization_id, pack_key, pack_title, events_count, signals_count, alerts_count, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', 45, 8, 2, 'Finance Pack → Payment Events.'),
    (p_org_id, 'support', 'Support Pack', 78, 12, 4, 'Support Pack → Support Events.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', 34, 5, 1, 'Warehouse Pack → Inventory Events.'),
    (p_org_id, 'hosts', 'Hosts Pack', 22, 3, 0, 'Hosts Pack → Property Events.');

  perform public._oeb591_log(p_org_id, 'event_created', 'Organizational event bus baseline seeded.');
end; $$;

create or replace function public.get_organization_event_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_positive integer;
  v_risk integer;
  v_critical integer;
begin
  v_org_id := public._oeb591_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._oeb591_seed(v_org_id);

  select count(*) into v_positive from public.organization_oeb591_signals
  where organization_id = v_org_id and signal_class = 'positive' and signal_status = 'open';
  select count(*) into v_risk from public.organization_oeb591_signals
  where organization_id = v_org_id and signal_class in ('risk', 'attention') and signal_status = 'open';
  select count(*) into v_critical from public.organization_oeb591_signals
  where organization_id = v_org_id and signal_class = 'critical' and signal_status = 'open';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Data tells organizations what happened. Signals tell organizations what matters.',
      'privacy_note', 'Event and signal metadata only — no raw operational records.',
      'executive_dashboard', jsonb_build_object(
        'positive_signals', v_positive,
        'risk_signals', v_risk,
        'critical_signals', v_critical,
        'growth_signals', (select count(*) from public.organization_oeb591_signals where organization_id = v_org_id and signal_key = 'sig_growth'),
        'revenue_signals', (select count(*) from public.organization_oeb591_signals where organization_id = v_org_id and signal_key = 'sig_revenue')
      ),
      'stats', jsonb_build_object(
        'registry_events', (select count(*) from public.organization_oeb591_events where organization_id = v_org_id and event_status = 'active'),
        'open_signals', (select count(*) from public.organization_oeb591_signals where organization_id = v_org_id and signal_status = 'open'),
        'open_alerts', (select count(*) from public.organization_oeb591_alerts where organization_id = v_org_id and alert_status = 'open'),
        'active_subscriptions', (select count(*) from public.organization_oeb591_subscriptions where organization_id = v_org_id and subscription_status = 'active'),
        'event_sources', (select count(*) from public.organization_oeb591_sources where organization_id = v_org_id and source_status = 'active')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_title', s.signal_title, 'recommendation', s.companion_recommendation
        ) order by case s.signal_class when 'critical' then 1 when 'risk' then 2 when 'attention' then 3 when 'positive' then 4 else 5 end)
        from public.organization_oeb591_signals s
        where s.organization_id = v_org_id and s.signal_status = 'open'
        limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Data tells organizations what happened. Signals tell organizations what matters.',
    'privacy_note', 'Event and signal metadata only.',
    'executive_dashboard', jsonb_build_object(
      'positive_signals', v_positive,
      'risk_signals', v_risk,
      'critical_signals', v_critical,
      'growth_signals', (select count(*) from public.organization_oeb591_signals where organization_id = v_org_id and signal_key = 'sig_growth'),
      'revenue_signals', (select count(*) from public.organization_oeb591_signals where organization_id = v_org_id and signal_key = 'sig_revenue')
    ),
    'registry', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', e.event_key, 'event_type', e.event_type, 'event_source', e.event_source,
      'severity', e.severity, 'business_pack', e.business_pack, 'entity_ref', e.entity_ref,
      'event_status', e.event_status, 'summary', e.summary, 'occurred_at', e.occurred_at
    ) order by e.occurred_at desc) from public.organization_oeb591_events e where e.organization_id = v_org_id), '[]'::jsonb),
    'live_activity', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', e.event_key, 'event_title', initcap(replace(e.event_type, '_', ' ')),
      'event_type', e.event_type, 'severity', e.severity, 'summary', e.summary, 'occurred_at', e.occurred_at
    ) order by e.occurred_at desc) from public.organization_oeb591_events e
    where e.organization_id = v_org_id and e.event_status = 'active' limit 25), '[]'::jsonb),
    'signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'signal_title', s.signal_title, 'signal_class', s.signal_class,
      'pattern_summary', s.pattern_summary, 'source_event_count', s.source_event_count,
      'companion_recommendation', s.companion_recommendation, 'signal_status', s.signal_status, 'summary', s.summary
    ) order by case s.signal_class when 'critical' then 1 when 'risk' then 2 when 'attention' then 3 when 'positive' then 4 else 5 end)
    from public.organization_oeb591_signals s where s.organization_id = v_org_id), '[]'::jsonb),
    'correlations', coalesce((select jsonb_agg(jsonb_build_object(
      'correlation_key', c.correlation_key, 'correlation_title', c.correlation_title,
      'chain_steps', c.chain_steps, 'outcome_summary', c.outcome_summary,
      'severity', c.severity, 'summary', c.summary
    ) order by c.correlation_title) from public.organization_oeb591_correlations c where c.organization_id = v_org_id), '[]'::jsonb),
    'alerts', coalesce((select jsonb_agg(jsonb_build_object(
      'alert_key', a.alert_key, 'alert_title', a.alert_title, 'alert_channel', a.alert_channel,
      'severity', a.severity, 'alert_status', a.alert_status, 'summary', a.summary
    ) order by case a.severity when 'critical' then 1 when 'risk' then 2 when 'attention' then 3 else 4 end)
    from public.organization_oeb591_alerts a where a.organization_id = v_org_id), '[]'::jsonb),
    'subscriptions', coalesce((select jsonb_agg(jsonb_build_object(
      'subscription_key', s.subscription_key, 'subscription_title', s.subscription_title,
      'event_category', s.event_category, 'delivery_channels', s.delivery_channels,
      'subscription_status', s.subscription_status, 'summary', s.summary
    ) order by s.subscription_title) from public.organization_oeb591_subscriptions s where s.organization_id = v_org_id), '[]'::jsonb),
    'sources', coalesce((select jsonb_agg(jsonb_build_object(
      'source_key', s.source_key, 'source_title', s.source_title, 'source_type', s.source_type,
      'events_emitted', s.events_emitted, 'source_status', s.source_status, 'summary', s.summary
    ) order by s.source_title) from public.organization_oeb591_sources s where s.organization_id = v_org_id), '[]'::jsonb),
    'history', coalesce((select jsonb_agg(jsonb_build_object(
      'history_key', h.history_key, 'history_title', h.history_title, 'history_type', h.history_type,
      'record_count', h.record_count, 'summary', h.summary
    ) order by h.history_title) from public.organization_oeb591_history h where h.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'events_count', p.events_count,
      'signals_count', p.signals_count, 'alerts_count', p.alerts_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_oeb591_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'signal_briefing', 'What important signals appeared today?',
      'weekly_changes', 'What changed this week?',
      'emerging_patterns', 'What patterns are emerging?',
      'risk_watch', 'What risks should we watch?'
    ),
    'alert_orchestration', jsonb_build_object(
      'desktop', true, 'mobile', true, 'email', true, 'internal', true, 'integrations', 'future'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_oeb591_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'signals', true, 'alerts', true, 'activity', true, 'trends', true, 'briefings', true
    )
  );
end;
$$;

create or replace function public.get_aipify_signal_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_event_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Signal Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'signals_today',
        'observation', format('%s open signal(s) across the event bus.', v_stats->>'open_signals'),
        'recommendation', 'Review signal classification before operational dashboards.',
        'href', '/app/events/signals'
      ),
      jsonb_build_object(
        'key', 'critical',
        'observation', format('%s critical signal(s) require immediate attention.', v_exec->>'critical_signals'),
        'recommendation', 'Address critical and risk signals first.',
        'href', '/app/events/alerts'
      ),
      jsonb_build_object(
        'key', 'activity',
        'observation', format('%s active events in registry.', v_stats->>'registry_events'),
        'recommendation', 'Scan live activity for emerging patterns.',
        'href', '/app/events/live-activity'
      ),
      jsonb_build_object(
        'key', 'growth',
        'observation', format('%s growth signal(s) detected.', v_exec->>'growth_signals'),
        'recommendation', 'Review expansion and onboarding capacity.',
        'href', '/app/events/signals'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_event_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_event_center('overview');
end;
$$;

grant execute on function public.get_organization_event_center(text) to authenticated;
grant execute on function public.get_aipify_signal_advisor_bundle() to authenticated;
grant execute on function public.get_organization_event_center_mobile_summary() to authenticated;
