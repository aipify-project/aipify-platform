-- Phase 535 — Strategic Intelligence, Decision Support & Executive Advisory Engine
-- Extends Phase 436 (Decision Intelligence). Executive brain layer of Aipify.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_strategic_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  since_last_login_briefing_enabled boolean not null default true,
  companion_advisory_enabled boolean not null default true,
  forecast_engine_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_strategic_intelligence_settings enable row level security;
revoke all on public.organization_strategic_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Insights, recommendations, forecasts, trends, opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.organization_strategic_intelligence_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_number text,
  title text not null,
  summary text not null default '',
  insight_type text not null default 'pattern' check (
    insight_type in ('insight', 'pattern', 'warning', 'recommendation')
  ),
  source_domain text not null default 'organization-wide' check (
    source_domain in (
      'customers', 'sales', 'finance', 'inventory', 'projects', 'people',
      'support', 'business_pack', 'domain', 'partner', 'risk', 'organization-wide'
    )
  ),
  severity text not null default 'informational' check (
    severity in ('informational', 'moderate', 'high', 'critical')
  ),
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, insight_number)
);

alter table public.organization_strategic_intelligence_insights enable row level security;
revoke all on public.organization_strategic_intelligence_insights from authenticated, anon;

create table if not exists public.organization_strategic_intelligence_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_number text,
  title text not null,
  description text not null default '',
  category text not null default 'operational' check (
    category in (
      'operational', 'financial', 'sales', 'people', 'customer', 'risk', 'strategic'
    )
  ),
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'implemented', 'dismissed')
  ),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  expected_value text not null default '',
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, recommendation_number)
);

alter table public.organization_strategic_intelligence_recommendations enable row level security;
revoke all on public.organization_strategic_intelligence_recommendations from authenticated, anon;

create table if not exists public.organization_strategic_intelligence_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_number text,
  title text not null,
  forecast_type text not null default 'revenue' check (
    forecast_type in (
      'revenue', 'expense', 'growth', 'customer', 'inventory', 'workforce', 'partner'
    )
  ),
  period_label text not null default 'next_quarter',
  forecast_value numeric(14, 2),
  forecast_direction text not null default 'stable' check (
    forecast_direction in ('declining', 'stable', 'growing', 'accelerating')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, forecast_number)
);

alter table public.organization_strategic_intelligence_forecasts enable row level security;
revoke all on public.organization_strategic_intelligence_forecasts from authenticated, anon;

create table if not exists public.organization_strategic_intelligence_trends (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trend_key text not null,
  title text not null,
  trend_direction text not null default 'stable' check (
    trend_direction in ('growth', 'declining', 'stable', 'volatile')
  ),
  category text not null default 'operational',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, trend_key)
);

alter table public.organization_strategic_intelligence_trends enable row level security;
revoke all on public.organization_strategic_intelligence_trends from authenticated, anon;

create table if not exists public.organization_strategic_intelligence_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_number text,
  title text not null,
  description text not null default '',
  opportunity_type text not null default 'upsell' check (
    opportunity_type in (
      'upsell', 'cross_sell', 'customer_expansion', 'partner_growth',
      'operational_improvement', 'automation'
    )
  ),
  status text not null default 'identified' check (
    status in ('identified', 'review', 'approved', 'pursued', 'closed')
  ),
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_number)
);

alter table public.organization_strategic_intelligence_opportunities enable row level security;
revoke all on public.organization_strategic_intelligence_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Executive briefings & board reports
-- ---------------------------------------------------------------------------
create table if not exists public.organization_strategic_intelligence_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_type text not null default 'daily' check (
    briefing_type in ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'on_demand', 'since_last_login')
  ),
  title text not null,
  executive_summary text not null default '',
  what_changed text not null default '',
  requires_attention text not null default '',
  recommended_focus text not null default '',
  generated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists organization_strategic_intelligence_briefings_org_idx
  on public.organization_strategic_intelligence_briefings (organization_id, briefing_type, generated_at desc);

alter table public.organization_strategic_intelligence_briefings enable row level security;
revoke all on public.organization_strategic_intelligence_briefings from authenticated, anon;

create table if not exists public.organization_strategic_intelligence_board_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_number text,
  title text not null,
  report_type text not null default 'board_summary' check (
    report_type in (
      'board_summary', 'investor_report', 'executive_report',
      'department_report', 'quarterly_review', 'annual_review'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'ready', 'exported')),
  content_summary text not null default '',
  exportable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, report_number)
);

alter table public.organization_strategic_intelligence_board_reports enable row level security;
revoke all on public.organization_strategic_intelligence_board_reports from authenticated, anon;

create table if not exists public.organization_strategic_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_strategic_intelligence_audit_logs_org_idx
  on public.organization_strategic_intelligence_audit_logs (organization_id, created_at desc);

alter table public.organization_strategic_intelligence_audit_logs enable row level security;
revoke all on public.organization_strategic_intelligence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._sint535_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._sint535_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_strategic_intelligence_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._sint535_log(
  p_org_id uuid, p_action text, p_summary text,
  p_entity_type text default null, p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_strategic_intelligence_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._sint535_next_number(p_org_id uuid, p_prefix text, p_table regclass)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  execute format('select count(*) + 1 from %s where organization_id = $1', p_table) into v_seq using p_org_id;
  return p_prefix || '-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._sint535_compute_health_score(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score int := 100;
  v_status text := 'healthy';
  v_critical_risks int := 0;
  v_open_incidents int := 0;
  v_compliance_risks int := 0;
begin
  if to_regclass('public.organization_governance_risks') is not null then
    select count(*) into v_critical_risks
    from public.organization_governance_risks
    where organization_id = p_org_id and risk_control_status in ('critical', 'uncontrolled') and status not in ('closed', 'accepted');
  end if;

  if to_regclass('public.organization_risk_operations_incidents') is not null then
    select count(*) into v_open_incidents
    from public.organization_risk_operations_incidents
    where organization_id = p_org_id and status <> 'closed';
  end if;

  if to_regclass('public.organization_quality_operations_compliance_items') is not null then
    select count(*) into v_compliance_risks
    from public.organization_quality_operations_compliance_items
    where organization_id = p_org_id and status in ('non_compliant', 'restricted');
  end if;

  v_score := v_score - least(30, v_critical_risks * 8) - least(20, v_open_incidents * 5) - least(15, v_compliance_risks * 4);
  v_score := greatest(0, least(100, v_score));

  v_status := case
    when v_score >= 85 then 'excellent'
    when v_score >= 70 then 'healthy'
    when v_score >= 55 then 'stable'
    when v_score >= 40 then 'needs_attention'
    else 'critical'
  end;

  return jsonb_build_object(
    'organization_health_score', v_score,
    'health_status', v_status,
    'finance_signal', 'Integrates with Finance Engine',
    'customer_signal', 'Integrates with Customer Relationship Engine',
    'risk_signal', v_critical_risks,
    'compliance_signal', v_compliance_risks
  );
exception when others then
  return jsonb_build_object('organization_health_score', 75, 'health_status', 'stable');
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Strategic Intelligence Center
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_intelligence_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('strategic_intelligence.view');
  v_org_id := public._sint535_org();
  perform public._sint535_ensure_settings(v_org_id);
  perform public._sint535_log(v_org_id, 'center_view', 'Strategic Intelligence Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Data alone has little value. Understanding creates value. Action creates results.',
    'philosophy', 'Companion helps leaders make better decisions, but humans remain in control.',
    'organization_health', public._sint535_compute_health_score(v_org_id),
    'overview', jsonb_build_object(
      'organization_health_score', (public._sint535_compute_health_score(v_org_id)->>'organization_health_score')::int,
      'health_status', public._sint535_compute_health_score(v_org_id)->>'health_status',
      'open_insights', (select count(*) from public.organization_strategic_intelligence_insights where organization_id = v_org_id),
      'open_recommendations', (select count(*) from public.organization_strategic_intelligence_recommendations where organization_id = v_org_id and status = 'open'),
      'active_forecasts', (select count(*) from public.organization_strategic_intelligence_forecasts where organization_id = v_org_id),
      'identified_opportunities', (select count(*) from public.organization_strategic_intelligence_opportunities where organization_id = v_org_id and status in ('identified', 'review')),
      'trends_tracked', (select count(*) from public.organization_strategic_intelligence_trends where organization_id = v_org_id),
      'latest_briefing', (select generated_at from public.organization_strategic_intelligence_briefings where organization_id = v_org_id order by generated_at desc limit 1),
      'board_reports_ready', (select count(*) from public.organization_strategic_intelligence_board_reports where organization_id = v_org_id and status = 'ready')
    ),
    'executive_briefing', coalesce((
      select jsonb_build_object(
        'id', b.id, 'briefing_type', b.briefing_type, 'title', b.title,
        'executive_summary', b.executive_summary, 'what_changed', b.what_changed,
        'requires_attention', b.requires_attention, 'recommended_focus', b.recommended_focus,
        'generated_at', b.generated_at
      )
      from public.organization_strategic_intelligence_briefings b
      where b.organization_id = v_org_id
      order by b.generated_at desc limit 1
    ), '{}'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'briefing_type', b.briefing_type, 'title', b.title,
        'executive_summary', b.executive_summary, 'generated_at', b.generated_at
      ) order by b.generated_at desc)
      from (select * from public.organization_strategic_intelligence_briefings where organization_id = v_org_id order by generated_at desc limit 20) b
    ), '[]'::jsonb),
    'insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'insight_number', i.insight_number, 'title', i.title,
        'summary', i.summary, 'insight_type', i.insight_type, 'source_domain', i.source_domain,
        'severity', i.severity
      ) order by i.created_at desc)
      from (select * from public.organization_strategic_intelligence_insights where organization_id = v_org_id order by created_at desc limit 40) i
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'recommendation_number', r.recommendation_number, 'title', r.title,
        'description', r.description, 'category', r.category, 'status', r.status, 'confidence', r.confidence
      ) order by r.updated_at desc)
      from (select * from public.organization_strategic_intelligence_recommendations where organization_id = v_org_id order by updated_at desc limit 40) r
    ), '[]'::jsonb),
    'forecasts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'forecast_number', f.forecast_number, 'title', f.title,
        'forecast_type', f.forecast_type, 'period_label', f.period_label,
        'forecast_value', f.forecast_value, 'forecast_direction', f.forecast_direction, 'summary', f.summary
      ) order by f.updated_at desc)
      from (select * from public.organization_strategic_intelligence_forecasts where organization_id = v_org_id order by updated_at desc limit 30) f
    ), '[]'::jsonb),
    'trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'trend_key', t.trend_key, 'title', t.title,
        'trend_direction', t.trend_direction, 'category', t.category, 'summary', t.summary
      ) order by t.created_at desc)
      from (select * from public.organization_strategic_intelligence_trends where organization_id = v_org_id order by created_at desc limit 30) t
    ), '[]'::jsonb),
    'opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_number', o.opportunity_number, 'title', o.title,
        'opportunity_type', o.opportunity_type, 'status', o.status, 'description', o.description
      ) order by o.updated_at desc)
      from (select * from public.organization_strategic_intelligence_opportunities where organization_id = v_org_id order by updated_at desc limit 30) o
    ), '[]'::jsonb),
    'risk_intelligence', jsonb_build_object(
      'critical_risks', coalesce((
        select count(*) from public.organization_governance_risks
        where organization_id = v_org_id and risk_control_status in ('critical', 'uncontrolled') and status not in ('closed', 'accepted')
      ), 0),
      'risk_engine', '/app/risk',
      'governance_engine', '/app/governance',
      'quality_engine', '/app/quality-operations'
    ),
    'executive_dashboard', jsonb_build_object(
      'priorities', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'category', category))
        from (
          select title, category from public.organization_strategic_intelligence_recommendations
          where organization_id = v_org_id and status = 'open' order by updated_at desc limit 5
        ) x
      ), '[]'::jsonb),
      'decision_support', '/app/intelligence/decisions'
    ),
    'board_reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'report_number', r.report_number, 'title', r.title,
        'report_type', r.report_type, 'status', r.status, 'exportable', r.exportable
      ) order by r.updated_at desc)
      from (select * from public.organization_strategic_intelligence_board_reports where organization_id = v_org_id order by updated_at desc limit 20) r
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'recommendation_usage', (select count(*) from public.organization_strategic_intelligence_recommendations where organization_id = v_org_id and status = 'implemented'),
      'opportunities_discovered', (select count(*) from public.organization_strategic_intelligence_opportunities where organization_id = v_org_id),
      'forecast_count', (select count(*) from public.organization_strategic_intelligence_forecasts where organization_id = v_org_id)
    ),
    'companion_advisory', jsonb_build_object(
      'prompts', jsonb_build_array(
        'What should I focus on today?',
        'What concerns you most?',
        'What opportunities do you see?',
        'Generate board summary.',
        'Show biggest business risks.'
      ),
      'role', 'Advisor — never decision maker'
    ),
    'companion_insights', jsonb_build_object(
      'top_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'category', category))
        from (select title, category from public.organization_strategic_intelligence_recommendations where organization_id = v_org_id and status = 'open' limit 5) x
      ), '[]'::jsonb),
      'top_opportunities', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'opportunity_type', opportunity_type))
        from (select title, opportunity_type from public.organization_strategic_intelligence_opportunities where organization_id = v_org_id and status in ('identified', 'review') limit 5) x
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_strategic_intelligence_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'executive_briefing', 'insights', 'recommendations', 'forecasts',
      'trends', 'opportunities', 'risks', 'reports', 'executive_dashboard'
    ),
    'routes', jsonb_build_object(
      'intelligence', '/app/intelligence',
      'briefing', '/app/intelligence/briefing',
      'recommendations', '/app/intelligence/recommendations',
      'board_reports', '/app/intelligence/board-reports',
      'decisions', '/app/intelligence/decisions',
      'risk', '/app/risk',
      'governance', '/app/governance'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_strategic_intelligence_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
begin
  v_org_id := public._sint535_org();
  perform public._sint535_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in (
    'generate_briefing', 'generate_insight', 'generate_recommendation', 'generate_forecast',
    'generate_opportunity', 'create_board_report', 'acknowledge_recommendation',
    'refresh_health_score', 'record_trend'
  ) then
    perform public._irp_require_permission('strategic_intelligence.manage');
  else
    perform public._irp_require_permission('strategic_intelligence.view');
  end if;

  if p_action_type = 'generate_briefing' then
    insert into public.organization_strategic_intelligence_briefings (
      organization_id, briefing_type, title, executive_summary, what_changed, requires_attention, recommended_focus
    ) values (
      v_org_id,
      coalesce(p_payload->>'briefing_type', 'since_last_login'),
      coalesce(p_payload->>'title', 'Executive briefing'),
      coalesce(p_payload->>'executive_summary', 'Summary of key changes since last login.'),
      coalesce(p_payload->>'what_changed', 'Operational signals aggregated from connected engines.'),
      coalesce(p_payload->>'requires_attention', 'Review open recommendations and risks.'),
      coalesce(p_payload->>'recommended_focus', 'Focus on highest-impact priorities today.')
    ) returning id into v_id;
    perform public._sint535_log(v_org_id, 'executive_briefing_viewed', 'Executive briefing generated', 'briefing', v_id);
    return jsonb_build_object('ok', true, 'briefing_id', v_id);

  elsif p_action_type = 'generate_insight' then
    insert into public.organization_strategic_intelligence_insights (
      organization_id, insight_number, title, summary, insight_type, source_domain, severity
    ) values (
      v_org_id,
      public._sint535_next_number(v_org_id, 'INS', 'public.organization_strategic_intelligence_insights'::regclass),
      coalesce(p_payload->>'title', 'Insight'),
      coalesce(p_payload->>'summary', ''),
      coalesce(p_payload->>'insight_type', 'insight'),
      coalesce(p_payload->>'source_domain', 'organization-wide'),
      coalesce(p_payload->>'severity', 'informational')
    ) returning id into v_id;
    perform public._sint535_log(v_org_id, 'insight_generated', 'Insight generated', 'insight', v_id);
    return jsonb_build_object('ok', true, 'insight_id', v_id);

  elsif p_action_type = 'generate_recommendation' then
    insert into public.organization_strategic_intelligence_recommendations (
      organization_id, recommendation_number, title, description, category, confidence
    ) values (
      v_org_id,
      public._sint535_next_number(v_org_id, 'REC', 'public.organization_strategic_intelligence_recommendations'::regclass),
      coalesce(p_payload->>'title', 'Recommendation'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'category', 'operational'),
      coalesce(p_payload->>'confidence', 'moderate')
    ) returning id into v_id;
    perform public._sint535_log(v_org_id, 'recommendation_generated', 'Recommendation generated', 'recommendation', v_id);
    return jsonb_build_object('ok', true, 'recommendation_id', v_id);

  elsif p_action_type = 'generate_forecast' then
    insert into public.organization_strategic_intelligence_forecasts (
      organization_id, forecast_number, title, forecast_type, period_label, forecast_direction, summary
    ) values (
      v_org_id,
      public._sint535_next_number(v_org_id, 'FCST', 'public.organization_strategic_intelligence_forecasts'::regclass),
      coalesce(p_payload->>'title', 'Forecast'),
      coalesce(p_payload->>'forecast_type', 'revenue'),
      coalesce(p_payload->>'period_label', 'next_quarter'),
      coalesce(p_payload->>'forecast_direction', 'stable'),
      coalesce(p_payload->>'summary', '')
    ) returning id into v_id;
    perform public._sint535_log(v_org_id, 'forecast_generated', 'Forecast generated', 'forecast', v_id);
    return jsonb_build_object('ok', true, 'forecast_id', v_id);

  elsif p_action_type = 'generate_opportunity' then
    insert into public.organization_strategic_intelligence_opportunities (
      organization_id, opportunity_number, title, description, opportunity_type
    ) values (
      v_org_id,
      public._sint535_next_number(v_org_id, 'OPP', 'public.organization_strategic_intelligence_opportunities'::regclass),
      coalesce(p_payload->>'title', 'Opportunity'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'opportunity_type', 'upsell')
    ) returning id into v_id;
    perform public._sint535_log(v_org_id, 'opportunity_detected', 'Opportunity identified', 'opportunity', v_id);
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);

  elsif p_action_type = 'create_board_report' then
    insert into public.organization_strategic_intelligence_board_reports (
      organization_id, report_number, title, report_type, content_summary, status
    ) values (
      v_org_id,
      public._sint535_next_number(v_org_id, 'BRPT', 'public.organization_strategic_intelligence_board_reports'::regclass),
      coalesce(p_payload->>'title', 'Board report'),
      coalesce(p_payload->>'report_type', 'board_summary'),
      coalesce(p_payload->>'content_summary', 'Executive summary for board review.'),
      'ready'
    ) returning id into v_id;
    perform public._sint535_log(v_org_id, 'board_report_created', 'Board report created', 'board_report', v_id);
    return jsonb_build_object('ok', true, 'report_id', v_id);

  elsif p_action_type = 'acknowledge_recommendation' then
    update public.organization_strategic_intelligence_recommendations
    set status = 'acknowledged', updated_at = now()
    where id = (p_payload->>'recommendation_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'record_trend' then
    insert into public.organization_strategic_intelligence_trends (
      organization_id, trend_key, title, trend_direction, category, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'trend_key', 'trend-' || gen_random_uuid()::text),
      coalesce(p_payload->>'title', 'Trend'),
      coalesce(p_payload->>'trend_direction', 'stable'),
      coalesce(p_payload->>'category', 'operational'),
      coalesce(p_payload->>'summary', '')
    ) on conflict (organization_id, trend_key) do update set
      title = excluded.title,
      trend_direction = excluded.trend_direction,
      summary = excluded.summary
    returning id into v_id;
    return jsonb_build_object('ok', true, 'trend_id', v_id);

  elsif p_action_type = 'refresh_health_score' then
    return jsonb_build_object('ok', true, 'organization_health', public._sint535_compute_health_score(v_org_id));

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_strategic_intelligence_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('strategic_intelligence.view');
  v_org_id := public._sint535_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify should help leaders make better decisions faster.',
    'query', p_query,
    'organization_health', public._sint535_compute_health_score(v_org_id),
    'open_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'category', category))
      from (select title, category from public.organization_strategic_intelligence_recommendations where organization_id = v_org_id and status = 'open' limit 10) x
    ), '[]'::jsonb),
    'top_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', title))
      from (select title from public.organization_strategic_intelligence_opportunities where organization_id = v_org_id and status in ('identified', 'review') limit 10) x
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'What should I focus on today?',
      'What concerns you most?',
      'What opportunities do you see?',
      'Generate board summary.',
      'Show biggest business risks.'
    ),
    'routes', jsonb_build_object(
      'intelligence', '/app/intelligence',
      'briefing', '/app/intelligence/briefing',
      'recommendations', '/app/intelligence/recommendations',
      'decisions', '/app/intelligence/decisions'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_strategic_intelligence_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('strategic_intelligence.view');
  v_org_id := public._sint535_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('strategic_intelligence.manage', v_org_id),
    'organization_health_score', (public._sint535_compute_health_score(v_org_id)->>'organization_health_score')::int,
    'open_recommendations', (select count(*) from public.organization_strategic_intelligence_recommendations where organization_id = v_org_id and status = 'open'),
    'identified_opportunities', (select count(*) from public.organization_strategic_intelligence_opportunities where organization_id = v_org_id and status in ('identified', 'review')),
    'routes', jsonb_build_object(
      'intelligence', '/app/intelligence',
      'briefing', '/app/intelligence/briefing',
      'recommendations', '/app/intelligence/recommendations',
      'board_reports', '/app/intelligence/board-reports',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('intelligence', '/app/intelligence'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'strategic_intelligence', 'Strategic Intelligence & Executive Advisory', 'strategic-intelligence', 'reports',
    'Strategic intelligence center — briefings, insights, recommendations, forecasts, and board reporting.',
    'business', null, 'main', '/app/intelligence', 'licensed', 12
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('strategic_intelligence', 'strategic_intelligence.view', 'view', 'Strategic Intelligence — view briefings, insights, and forecasts'),
  ('strategic_intelligence', 'strategic_intelligence.manage', 'manage', 'Strategic Intelligence — generate reports and manage recommendations')
on conflict do nothing;

grant execute on function public._sint535_compute_health_score(uuid) to authenticated;
grant execute on function public.get_strategic_intelligence_operations_center(text) to authenticated;
grant execute on function public.perform_strategic_intelligence_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_strategic_intelligence_context(text) to authenticated;
grant execute on function public.get_my_strategic_intelligence_summary() to authenticated;
