-- Phase 590 — Enterprise Command Center, Executive Operations & Since Last Login Intelligence Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/command-center/*
-- Helpers: _ecc590_*

create table if not exists public.organization_ecc590_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  since_last_login_enabled boolean not null default true,
  morning_briefing_enabled boolean not null default true,
  priority_engine_enabled boolean not null default true,
  alert_engine_enabled boolean not null default true,
  timeline_enabled boolean not null default true,
  mobile_executive_mode_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_ecc590_settings enable row level security;
revoke all on public.organization_ecc590_settings from authenticated, anon;

create table if not exists public.organization_ecc590_since_last_login (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_key text not null,
  item_title text not null,
  item_category text not null check (
    item_category in (
      'customer', 'business_pack', 'contract', 'approval', 'revenue',
      'knowledge', 'partner', 'risk', 'opportunity', 'operational'
    )
  ),
  item_count integer not null default 1,
  priority text not null default 'information' check (
    priority in ('information', 'attention', 'urgent', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, item_key)
);

alter table public.organization_ecc590_since_last_login enable row level security;
revoke all on public.organization_ecc590_since_last_login from authenticated, anon;

create table if not exists public.organization_ecc590_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_key text not null,
  briefing_title text not null,
  briefing_type text not null default 'daily_executive' check (
    briefing_type in ('daily_executive', 'weekly_leadership', 'companion_summary')
  ),
  revenue_summary text not null default '',
  customer_summary text not null default '',
  risk_summary text not null default '',
  operational_summary text not null default '',
  growth_summary text not null default '',
  companion_recommendations text not null default '',
  briefing_status text not null default 'available' check (
    briefing_status in ('available', 'generated', 'reviewed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, briefing_key)
);

alter table public.organization_ecc590_briefings enable row level security;
revoke all on public.organization_ecc590_briefings from authenticated, anon;

create table if not exists public.organization_ecc590_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_key text not null,
  health_title text not null,
  health_score integer not null default 75 check (health_score between 0 and 100),
  health_status text not null default 'healthy',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, health_key)
);

alter table public.organization_ecc590_health enable row level security;
revoke all on public.organization_ecc590_health from authenticated, anon;

create table if not exists public.organization_ecc590_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_key text not null,
  alert_title text not null,
  alert_type text not null check (
    alert_type in (
      'customer_risk', 'invoice_overdue', 'contract_expiring', 'revenue_decline',
      'security', 'compliance', 'approval_delay', 'operational'
    )
  ),
  priority text not null default 'attention' check (
    priority in ('information', 'attention', 'urgent', 'critical')
  ),
  alert_status text not null default 'open' check (alert_status in ('open', 'acknowledged', 'resolved')),
  companion_recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, alert_key)
);

alter table public.organization_ecc590_alerts enable row level security;
revoke all on public.organization_ecc590_alerts from authenticated, anon;

create table if not exists public.organization_ecc590_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'expansion', 'market', 'business_pack', 'partner', 'operational_improvement'
    )
  ),
  priority text not null default 'attention',
  opportunity_status text not null default 'open',
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_ecc590_opportunities enable row level security;
revoke all on public.organization_ecc590_opportunities from authenticated, anon;

create table if not exists public.organization_ecc590_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  action_type text not null check (
    action_type in ('approval', 'review', 'decision', 'contract', 'compliance', 'executive_task')
  ),
  priority text not null default 'attention',
  action_status text not null default 'pending',
  due_at timestamptz,
  record_href text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_ecc590_actions enable row level security;
revoke all on public.organization_ecc590_actions from authenticated, anon;

create table if not exists public.organization_ecc590_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_key text not null,
  event_title text not null,
  event_type text not null check (
    event_type in (
      'customer', 'contract', 'invoice', 'risk', 'approval', 'knowledge', 'partner', 'operational'
    )
  ),
  occurred_at timestamptz not null default now(),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, event_key)
);

alter table public.organization_ecc590_timeline enable row level security;
revoke all on public.organization_ecc590_timeline from authenticated, anon;

create table if not exists public.organization_ecc590_board_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null check (
    report_type in ('executive_summary', 'board_summary', 'monthly_mbr', 'quarterly_qbr', 'annual')
  ),
  report_status text not null default 'available',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, report_key)
);

alter table public.organization_ecc590_board_reports enable row level security;
revoke all on public.organization_ecc590_board_reports from authenticated, anon;

create table if not exists public.organization_ecc590_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  events_count integer not null default 0,
  risks_count integer not null default 0,
  opportunities_count integer not null default 0,
  approvals_count integer not null default 0,
  alerts_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_ecc590_business_packs enable row level security;
revoke all on public.organization_ecc590_business_packs from authenticated, anon;

create table if not exists public.organization_ecc590_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'executive_command',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_ecc590_audit_logs enable row level security;
revoke all on public.organization_ecc590_audit_logs from authenticated, anon;

create or replace function public._ecc590_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ecc590_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'executive_command'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ecc590_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'executive_command'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._ecc590_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ecc590_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ecc590_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ecc590_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_ecc590_since_last_login where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_ecc590_since_last_login (
    organization_id, item_key, item_title, item_category, item_count, priority, summary
  ) values
    (p_org_id, 'new_customers', 'New Customers', 'customer', 3, 'information', '3 new customers since last login.'),
    (p_org_id, 'packs_activated', 'Business Packs Activated', 'business_pack', 2, 'information', '2 packs activated.'),
    (p_org_id, 'contract_expiring', 'Contract Expiring', 'contract', 1, 'urgent', '1 contract expiring within 30 days.'),
    (p_org_id, 'approvals_done', 'Approvals Completed', 'approval', 4, 'information', '4 approvals completed.'),
    (p_org_id, 'revenue_alerts', 'Revenue Alerts', 'revenue', 2, 'attention', '2 revenue alerts require review.'),
    (p_org_id, 'knowledge_updates', 'Knowledge Articles Updated', 'knowledge', 7, 'information', '7 knowledge articles updated.'),
    (p_org_id, 'partner_leads', 'New Partner Leads', 'partner', 5, 'attention', '5 new partner leads registered.');

  insert into public.organization_ecc590_briefings (
    organization_id, briefing_key, briefing_title, briefing_type,
    revenue_summary, customer_summary, risk_summary, operational_summary, growth_summary,
    companion_recommendations, briefing_status, summary
  ) values (
    p_org_id, 'daily_exec', 'Daily Executive Briefing', 'daily_executive',
    'MRR stable with 14% YoY growth.', '3 new customers; 1 renewal at risk.',
    '2 strategic risks under monitor.', 'Operations healthy; 4 approvals pending.',
    '5 expansion opportunities identified.',
    'Review contract expiring and revenue alerts first.',
    'generated', 'Morning executive briefing ready.'
  );

  insert into public.organization_ecc590_health (
    organization_id, health_key, health_title, health_score, health_status, summary
  ) values
    (p_org_id, 'revenue', 'Revenue Health', 82, 'healthy', 'Revenue on track.'),
    (p_org_id, 'customer', 'Customer Health', 76, 'needs_attention', 'One renewal at risk.'),
    (p_org_id, 'execution', 'Execution Health', 79, 'healthy', 'Initiatives progressing.'),
    (p_org_id, 'compliance', 'Compliance Health', 88, 'healthy', 'No open compliance failures.'),
    (p_org_id, 'knowledge', 'Knowledge Health', 91, 'excellent', 'Strong knowledge adoption.'),
    (p_org_id, 'resource', 'Resource Health', 74, 'needs_attention', 'Capacity nearing limits.'),
    (p_org_id, 'governance', 'Governance Health', 85, 'healthy', 'Board items on schedule.');

  insert into public.organization_ecc590_alerts (
    organization_id, alert_key, alert_title, alert_type, priority, companion_recommendation, summary
  ) values
    (p_org_id, 'major_customer_risk', 'Major Customer Risk', 'customer_risk', 'urgent',
     'Schedule executive review and retention plan.', 'Top account health declining.'),
    (p_org_id, 'invoice_overdue', 'Large Invoice Overdue', 'invoice_overdue', 'attention',
     'Escalate to finance and customer success.', 'Invoice 45 days overdue.'),
    (p_org_id, 'approval_delay', 'Critical Approval Delay', 'approval_delay', 'critical',
     'Complete pending executive approval today.', 'Trust action awaiting sign-off.');

  insert into public.organization_ecc590_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type, priority, recommendation, summary
  ) values
    (p_org_id, 'expansion_acme', 'Expansion — Acme Ops', 'expansion', 'attention',
     'Recommend Knowledge Pack upgrade.', 'Cross-sell opportunity identified.'),
    (p_org_id, 'partner_nordic', 'Partner — Nordic Integrator', 'partner', 'information',
     'Schedule partner intro call.', 'New partner lead qualified.');

  insert into public.organization_ecc590_actions (
    organization_id, action_key, action_title, action_type, priority, action_status, record_href, summary
  ) values
    (p_org_id, 'approval_trust', 'Pending Trust Approval', 'approval', 'critical', 'pending', '/app/approvals', 'Level 3 action awaiting approval.'),
    (p_org_id, 'review_contract', 'Contract Review', 'contract', 'urgent', 'pending', '/app/revenue/retention', 'Vendor contract expiring.'),
    (p_org_id, 'decision_market', 'Market Entry Decision', 'decision', 'attention', 'pending', '/app/strategy/opportunities', 'Executive decision required.');

  insert into public.organization_ecc590_timeline (
    organization_id, event_key, event_title, event_type, occurred_at, summary
  ) values
    (p_org_id, 'evt_customer', 'Customer Added', 'customer', now() - interval '2 hours', 'Nordic Retail Group onboarded.'),
    (p_org_id, 'evt_contract', 'Contract Signed', 'contract', now() - interval '5 hours', 'Enterprise agreement signed.'),
    (p_org_id, 'evt_invoice', 'Invoice Paid', 'invoice', now() - interval '8 hours', 'Large invoice collected.'),
    (p_org_id, 'evt_risk', 'Risk Detected', 'risk', now() - interval '12 hours', 'Customer health alert triggered.'),
    (p_org_id, 'evt_approval', 'Approval Completed', 'approval', now() - interval '1 day', 'Trust action approved.'),
    (p_org_id, 'evt_knowledge', 'Knowledge Updated', 'knowledge', now() - interval '1 day', 'Support playbook updated.'),
    (p_org_id, 'evt_partner', 'Partner Registered', 'partner', now() - interval '2 days', 'Growth Partner enrolled.');

  insert into public.organization_ecc590_board_reports (
    organization_id, report_key, report_title, report_type, report_status, summary
  ) values
    (p_org_id, 'exec_summary', 'Executive Summary', 'executive_summary', 'available', 'One-click executive summary.'),
    (p_org_id, 'board_summary', 'Board Summary', 'board_summary', 'available', 'Board-ready overview.'),
    (p_org_id, 'mbr', 'Monthly Business Review', 'monthly_mbr', 'available', 'MBR report template.'),
    (p_org_id, 'qbr', 'Quarterly Business Review', 'quarterly_qbr', 'available', 'QBR report template.'),
    (p_org_id, 'annual', 'Annual Summary', 'annual', 'available', 'Annual performance summary.');

  insert into public.organization_ecc590_business_packs (
    organization_id, pack_key, pack_title, events_count, risks_count, opportunities_count, approvals_count, alerts_count, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 12, 2, 1, 3, 1, 'Support Pack → Customer Events.'),
    (p_org_id, 'finance', 'Finance Pack', 8, 1, 0, 2, 2, 'Finance Pack → Revenue Events.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', 6, 0, 1, 1, 0, 'Warehouse Pack → Operational Events.');

  perform public._ecc590_log(p_org_id, 'briefing_generated', 'Executive command center baseline seeded.');
end; $$;

create or replace function public.get_organization_executive_command_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_since jsonb := '{}'::jsonb;
  v_health_avg integer;
begin
  v_org_id := public._ecc590_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._ecc590_seed(v_org_id);

  if to_regprocedure('public._aact538_build_since_last_login(uuid,uuid,boolean)') is not null and v_user_id is not null then
    begin
      v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    exception when others then v_since := '{}'::jsonb;
    end;
  end if;

  select coalesce(round(avg(health_score)), 78) into v_health_avg
  from public.organization_ecc590_health where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Executives should not need to search for information — information should come to them.',
      'privacy_note', 'Executive command metadata only — leadership decides outcomes.',
      'overall_health_score', v_health_avg,
      'activity_since_login', v_since,
      'stats', jsonb_build_object(
        'since_last_login_items', (select count(*) from public.organization_ecc590_since_last_login where organization_id = v_org_id),
        'open_alerts', (select count(*) from public.organization_ecc590_alerts where organization_id = v_org_id and alert_status = 'open'),
        'pending_actions', (select count(*) from public.organization_ecc590_actions where organization_id = v_org_id and action_status = 'pending'),
        'open_opportunities', (select count(*) from public.organization_ecc590_opportunities where organization_id = v_org_id and opportunity_status = 'open'),
        'critical_items', (select count(*) from public.organization_ecc590_alerts where organization_id = v_org_id and priority = 'critical' and alert_status = 'open')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object('alert_title', a.alert_title, 'recommendation', a.companion_recommendation))
        from public.organization_ecc590_alerts a
        where a.organization_id = v_org_id and a.alert_status = 'open'
        order by case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end
        limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Executives should not need to search for information — information should come to them.',
    'privacy_note', 'Executive command metadata only.',
    'overall_health_score', v_health_avg,
    'activity_since_login', v_since,
    'since_last_login', coalesce((select jsonb_agg(jsonb_build_object(
      'item_key', s.item_key, 'item_title', s.item_title, 'item_category', s.item_category,
      'item_count', s.item_count, 'priority', s.priority, 'summary', s.summary
    ) order by case s.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end)
    from public.organization_ecc590_since_last_login s where s.organization_id = v_org_id), '[]'::jsonb),
    'briefings', coalesce((select jsonb_agg(jsonb_build_object(
      'briefing_key', b.briefing_key, 'briefing_title', b.briefing_title, 'briefing_type', b.briefing_type,
      'revenue_summary', b.revenue_summary, 'customer_summary', b.customer_summary,
      'risk_summary', b.risk_summary, 'operational_summary', b.operational_summary,
      'growth_summary', b.growth_summary, 'companion_recommendations', b.companion_recommendations,
      'briefing_status', b.briefing_status, 'summary', b.summary
    ) order by b.briefing_type) from public.organization_ecc590_briefings b where b.organization_id = v_org_id), '[]'::jsonb),
    'health', coalesce((select jsonb_agg(jsonb_build_object(
      'health_key', h.health_key, 'health_title', h.health_title, 'health_score', h.health_score,
      'health_status', h.health_status, 'summary', h.summary
    ) order by h.health_title) from public.organization_ecc590_health h where h.organization_id = v_org_id), '[]'::jsonb),
    'alerts', coalesce((select jsonb_agg(jsonb_build_object(
      'alert_key', a.alert_key, 'alert_title', a.alert_title, 'alert_type', a.alert_type,
      'priority', a.priority, 'alert_status', a.alert_status,
      'companion_recommendation', a.companion_recommendation, 'summary', a.summary
    ) order by case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end)
    from public.organization_ecc590_alerts a where a.organization_id = v_org_id), '[]'::jsonb),
    'opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
      'opportunity_type', o.opportunity_type, 'priority', o.priority,
      'opportunity_status', o.opportunity_status, 'recommendation', o.recommendation, 'summary', o.summary
    ) order by o.opportunity_title) from public.organization_ecc590_opportunities o where o.organization_id = v_org_id), '[]'::jsonb),
    'actions', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', a.action_key, 'action_title', a.action_title, 'action_type', a.action_type,
      'priority', a.priority, 'action_status', a.action_status, 'due_at', a.due_at,
      'record_href', a.record_href, 'summary', a.summary
    ) order by case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end)
    from public.organization_ecc590_actions a where a.organization_id = v_org_id), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', t.event_key, 'event_title', t.event_title, 'event_type', t.event_type,
      'occurred_at', t.occurred_at, 'summary', t.summary
    ) order by t.occurred_at desc) from public.organization_ecc590_timeline t where t.organization_id = v_org_id), '[]'::jsonb),
    'board_reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title,
      'report_type', r.report_type, 'report_status', r.report_status, 'summary', r.summary
    ) order by r.report_title) from public.organization_ecc590_board_reports r where r.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'events_count', p.events_count,
      'risks_count', p.risks_count, 'opportunities_count', p.opportunities_count,
      'approvals_count', p.approvals_count, 'alerts_count', p.alerts_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_ecc590_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_ecc590_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_executive', jsonb_build_object(
      'since_last_login', true, 'critical_alerts', true, 'approvals', true,
      'risks', true, 'revenue', true, 'companion_summary', true
    ),
    'command_prompts', jsonb_build_array(
      'Summarize my organization.',
      'Show major changes.',
      'Prepare leadership briefing.',
      'Show top risks.',
      'Show top opportunities.',
      'Prepare board update.'
    )
  );
end;
$$;

create or replace function public.get_aipify_executive_command_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_executive_command_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Executive Command Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'since_login',
        'observation', format('%s updates since last login.', v_stats->>'since_last_login_items'),
        'recommendation', 'Review since-last-login summary before other dashboards.',
        'href', '/app/command-center/since-last-login'
      ),
      jsonb_build_object(
        'key', 'attention',
        'observation', format('%s open alert(s) — %s critical.', v_stats->>'open_alerts', v_stats->>'critical_items'),
        'recommendation', 'Address critical and urgent alerts first.',
        'href', '/app/command-center/alerts'
      ),
      jsonb_build_object(
        'key', 'actions',
        'observation', format('%s pending action(s) in Action Center.', v_stats->>'pending_actions'),
        'recommendation', 'Complete approvals and executive tasks awaiting decision.',
        'href', '/app/command-center/approvals'
      ),
      jsonb_build_object(
        'key', 'opportunities',
        'observation', format('%s proactive opportunity(ies) detected.', v_stats->>'open_opportunities'),
        'recommendation', 'Review expansion and partner opportunities.',
        'href', '/app/command-center/opportunities'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_executive_command_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_executive_command_center('overview');
end;
$$;

grant execute on function public.get_organization_executive_command_center(text) to authenticated;
grant execute on function public.get_aipify_executive_command_advisor_bundle() to authenticated;
grant execute on function public.get_organization_executive_command_mobile_summary() to authenticated;
