-- Phase Airbnb 29 — Aipify Hosts Property Health Score Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostphs_* (engine), _ahostbp391_* (blueprint)

create table if not exists public.aipify_hosts_property_health_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'portfolio_overview' check (
    default_section in (
      'portfolio_overview', 'property_scores', 'open_risks', 'recommended_actions'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_property_health_settings enable row level security;
revoke all on public.aipify_hosts_property_health_settings from authenticated, anon;

create table if not exists public.aipify_hosts_property_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  score_key text not null,
  overall_score numeric(5,2) not null default 0,
  score_level text not null default 'attention_required' check (
    score_level in ('excellent', 'good', 'attention_required', 'critical')
  ),
  score_trend numeric(5,2) not null default 0,
  guest_experience_score numeric(5,2) not null default 0,
  operations_score numeric(5,2) not null default 0,
  safety_score numeric(5,2) not null default 0,
  maintenance_score numeric(5,2) not null default 0,
  finance_score numeric(5,2) not null default 0,
  compliance_score numeric(5,2) not null default 0,
  input_occupancy numeric(5,2) not null default 0,
  input_guest_satisfaction numeric(5,2) not null default 0,
  input_cleaning_completion numeric(5,2) not null default 0,
  input_maintenance_status numeric(5,2) not null default 0,
  input_incident_history numeric(5,2) not null default 0,
  input_inspection_results numeric(5,2) not null default 0,
  input_supply_readiness numeric(5,2) not null default 0,
  input_access_readiness numeric(5,2) not null default 0,
  input_document_readiness numeric(5,2) not null default 0,
  top_strengths jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, property_id),
  unique (tenant_id, score_key)
);
create index if not exists aipify_hosts_property_health_scores_tenant_idx
  on public.aipify_hosts_property_health_scores (tenant_id, score_level, overall_score);
alter table public.aipify_hosts_property_health_scores enable row level security;
revoke all on public.aipify_hosts_property_health_scores from authenticated, anon;

create table if not exists public.aipify_hosts_property_health_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  health_score_id uuid references public.aipify_hosts_property_health_scores (id) on delete cascade,
  risk_key text not null,
  risk_indicator text not null check (
    risk_indicator in (
      'cleaning_overdue', 'maintenance_overdue', 'open_critical_incident',
      'low_supplies', 'missing_access_instructions', 'expired_document', 'failed_inspection'
    )
  ),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  summary text not null,
  is_resolved boolean not null default false,
  unresolved_since timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, risk_key)
);
create index if not exists aipify_hosts_property_health_risks_tenant_idx
  on public.aipify_hosts_property_health_risks (tenant_id, is_resolved, severity);
alter table public.aipify_hosts_property_health_risks enable row level security;
revoke all on public.aipify_hosts_property_health_risks from authenticated, anon;

create table if not exists public.aipify_hosts_property_health_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  health_score_id uuid references public.aipify_hosts_property_health_scores (id) on delete cascade,
  recommendation_key text not null,
  action_summary text not null,
  action_category text not null default 'operations' check (
    action_category in ('guest_experience', 'operations', 'safety', 'maintenance', 'finance', 'compliance')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  is_completed boolean not null default false,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
create index if not exists aipify_hosts_property_health_recommendations_tenant_idx
  on public.aipify_hosts_property_health_recommendations (tenant_id, is_completed, priority);
alter table public.aipify_hosts_property_health_recommendations enable row level security;
revoke all on public.aipify_hosts_property_health_recommendations from authenticated, anon;

create table if not exists public.aipify_hosts_property_health_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  snapshot_date date not null default current_date,
  overall_score numeric(5,2) not null,
  score_level text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_property_health_history_tenant_idx
  on public.aipify_hosts_property_health_history (tenant_id, snapshot_date desc);
alter table public.aipify_hosts_property_health_history enable row level security;
revoke all on public.aipify_hosts_property_health_history from authenticated, anon;

create table if not exists public.aipify_hosts_property_health_overrides (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  health_score_id uuid references public.aipify_hosts_property_health_scores (id) on delete set null,
  previous_score numeric(5,2) not null,
  override_score numeric(5,2) not null,
  override_reason text not null,
  overridden_by text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_hosts_property_health_overrides enable row level security;
revoke all on public.aipify_hosts_property_health_overrides from authenticated, anon;

create table if not exists public.aipify_hosts_property_health_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_property_health_events_tenant_idx
  on public.aipify_hosts_property_health_events (tenant_id, created_at desc);
alter table public.aipify_hosts_property_health_events enable row level security;
revoke all on public.aipify_hosts_property_health_events from authenticated, anon;

create or replace function public._ahostphs_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_property_health_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_property_health_settings;
begin
  insert into public.aipify_hosts_property_health_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_property_health_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostphs_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_property_health_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'property_health_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostphs_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'team_events', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostphs_score_level(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'excellent'
    when p_score >= 70 then 'good'
    when p_score >= 50 then 'attention_required'
    else 'critical'
  end; $$;

create or replace function public._ahostphs_compute_overall(
  p_occupancy numeric, p_guest numeric, p_cleaning numeric, p_maint numeric,
  p_incident numeric, p_inspection numeric, p_supply numeric, p_access numeric, p_document numeric
) returns numeric language sql immutable as $$
  select round((
    p_occupancy + p_guest + p_cleaning + p_maint + p_incident +
    p_inspection + p_supply + p_access + p_document
  ) / 9.0, 1); $$;

create or replace function public._ahostbp391_positioning() returns text language sql immutable as $$
  select 'Operational health per property — scores, risks, and recommended actions so you know what needs attention within 60 seconds.'; $$;

create or replace function public._ahostbp391_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'portfolio_overview', 'label', 'Portfolio Overview'),
    jsonb_build_object('key', 'property_scores', 'label', 'Property Scores'),
    jsonb_build_object('key', 'open_risks', 'label', 'Open Risks'),
    jsonb_build_object('key', 'recommended_actions', 'label', 'Recommended Actions')
  ); $$;

create or replace function public._ahostphs_score_row(p_s public.aipify_hosts_property_health_scores, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_s.id, 'score_key', p_s.score_key, 'property_id', p_s.property_id,
    'property', coalesce(p_property, '—'),
    'overall_score', p_s.overall_score, 'score_level', p_s.score_level,
    'score_trend', p_s.score_trend,
    'guest_experience_score', p_s.guest_experience_score,
    'operations_score', p_s.operations_score,
    'safety_score', p_s.safety_score,
    'maintenance_score', p_s.maintenance_score,
    'finance_score', p_s.finance_score,
    'compliance_score', p_s.compliance_score,
    'inputs', jsonb_build_object(
      'occupancy_status', p_s.input_occupancy,
      'guest_satisfaction', p_s.input_guest_satisfaction,
      'cleaning_completion', p_s.input_cleaning_completion,
      'maintenance_status', p_s.input_maintenance_status,
      'incident_history', p_s.input_incident_history,
      'inspection_results', p_s.input_inspection_results,
      'supply_readiness', p_s.input_supply_readiness,
      'access_readiness', p_s.input_access_readiness,
      'document_readiness', p_s.input_document_readiness
    ),
    'top_strengths', p_s.top_strengths,
    'computed_at', p_s.computed_at::text
  ); $$;

create or replace function public._ahostphs_risk_row(p_r public.aipify_hosts_property_health_risks, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_r.id, 'risk_key', p_r.risk_key, 'property_id', p_r.property_id,
    'property', coalesce(p_property, '—'),
    'risk_indicator', p_r.risk_indicator, 'severity', p_r.severity,
    'summary', p_r.summary, 'is_resolved', p_r.is_resolved,
    'unresolved_since', p_r.unresolved_since::text,
    'hours_unresolved', round(extract(epoch from (now() - p_r.unresolved_since)) / 3600)::int
  ); $$;

create or replace function public._ahostphs_recommendation_row(
  p_rec public.aipify_hosts_property_health_recommendations, p_property text
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_rec.id, 'recommendation_key', p_rec.recommendation_key,
    'property_id', p_rec.property_id, 'property', coalesce(p_property, '—'),
    'action_summary', p_rec.action_summary, 'action_category', p_rec.action_category,
    'priority', p_rec.priority, 'is_completed', p_rec.is_completed
  ); $$;

create or replace function public._ahostphs_seed_health(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_prop1 uuid; v_prop2 uuid; v_score1 uuid; v_score2 uuid;
begin
  if exists (select 1 from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop1 from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' order by display_name limit 1;
  select id into v_prop2 from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' order by display_name offset 1 limit 1;
  if v_prop1 is null then return; end if;
  if v_prop2 is null then v_prop2 := v_prop1; end if;

  insert into public.aipify_hosts_property_health_scores (
    tenant_id, property_id, score_key, overall_score, score_level, score_trend,
    guest_experience_score, operations_score, safety_score, maintenance_score, finance_score, compliance_score,
    input_occupancy, input_guest_satisfaction, input_cleaning_completion, input_maintenance_status,
    input_incident_history, input_inspection_results, input_supply_readiness, input_access_readiness, input_document_readiness,
    top_strengths
  ) values
    (v_tenant_id, v_prop1, 'phs_001', 88.5, 'excellent', 2.5,
      92, 90, 88, 85, 87, 90,
      90, 95, 92, 88, 85, 90, 88, 92, 90,
      '["Strong guest satisfaction","Consistent cleaning completion","Access instructions current"]'::jsonb),
    (v_tenant_id, v_prop2, 'phs_002', 42.0, 'critical', -8.0,
      55, 48, 50, 40, 45, 38,
      60, 50, 35, 30, 25, 40, 45, 30, 35,
      '["Occupancy stable"]'::jsonb);

  select id into v_score1 from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id and score_key = 'phs_001';
  select id into v_score2 from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id and score_key = 'phs_002';

  insert into public.aipify_hosts_property_health_risks (
    tenant_id, property_id, health_score_id, risk_key, risk_indicator, severity, summary, unresolved_since
  ) values
    (v_tenant_id, v_prop2, v_score2, 'phs_risk_001', 'cleaning_overdue', 'high',
      'Departure cleaning overdue by 2 days', now() - interval '50 hours'),
    (v_tenant_id, v_prop2, v_score2, 'phs_risk_002', 'open_critical_incident', 'critical',
      'Open critical incident — water leak reported', now() - interval '30 hours'),
    (v_tenant_id, v_prop2, v_score2, 'phs_risk_003', 'low_supplies', 'medium',
      'Linens and toiletries below restock threshold', now() - interval '20 hours'),
    (v_tenant_id, v_prop2, v_score2, 'phs_risk_004', 'expired_document', 'high',
      'Insurance certificate expired', now() - interval '72 hours'),
    (v_tenant_id, v_prop2, v_score2, 'phs_risk_005', 'failed_inspection', 'high',
      'Last inspection failed — bathroom fixtures', now() - interval '24 hours');

  insert into public.aipify_hosts_property_health_recommendations (
    tenant_id, property_id, health_score_id, recommendation_key, action_summary, action_category, priority
  ) values
    (v_tenant_id, v_prop2, v_score2, 'phs_rec_001', 'Schedule emergency maintenance for water leak', 'maintenance', 'critical'),
    (v_tenant_id, v_prop2, v_score2, 'phs_rec_002', 'Complete overdue departure cleaning', 'operations', 'high'),
    (v_tenant_id, v_prop2, v_score2, 'phs_rec_003', 'Restock linens and guest supplies', 'operations', 'high'),
    (v_tenant_id, v_prop2, v_score2, 'phs_rec_004', 'Renew expired insurance document', 'compliance', 'high'),
    (v_tenant_id, v_prop1, v_score1, 'phs_rec_005', 'Schedule routine inspection to maintain excellent score', 'safety', 'low');

  insert into public.aipify_hosts_property_health_history (tenant_id, property_id, snapshot_date, overall_score, score_level)
  values
    (v_tenant_id, v_prop1, current_date - 14, 86.0, 'excellent'),
    (v_tenant_id, v_prop1, current_date - 7, 87.5, 'excellent'),
    (v_tenant_id, v_prop1, current_date, 88.5, 'excellent'),
    (v_tenant_id, v_prop2, current_date - 14, 58.0, 'attention_required'),
    (v_tenant_id, v_prop2, current_date - 7, 50.0, 'attention_required'),
    (v_tenant_id, v_prop2, current_date, 42.0, 'critical');
end; $$;

create or replace function public._ahostphs_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'overall_score', coalesce(round(avg(overall_score), 1), 0),
    'portfolio_level', public._ahostphs_score_level(coalesce(avg(overall_score), 0)),
    'excellent_count', (select count(*)::int from public.aipify_hosts_property_health_scores
      where tenant_id = p_tenant_id and score_level = 'excellent'),
    'good_count', (select count(*)::int from public.aipify_hosts_property_health_scores
      where tenant_id = p_tenant_id and score_level = 'good'),
    'attention_count', (select count(*)::int from public.aipify_hosts_property_health_scores
      where tenant_id = p_tenant_id and score_level = 'attention_required'),
    'critical_count', (select count(*)::int from public.aipify_hosts_property_health_scores
      where tenant_id = p_tenant_id and score_level = 'critical'),
    'open_risks', (select count(*)::int from public.aipify_hosts_property_health_risks
      where tenant_id = p_tenant_id and not is_resolved),
    'pending_actions', (select count(*)::int from public.aipify_hosts_property_health_recommendations
      where tenant_id = p_tenant_id and not is_completed),
    'avg_score_trend', coalesce(round(avg(score_trend), 1), 0)
  )
  from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id; $$;

create or replace function public._ahostphs_score_trend(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(
    jsonb_build_object('date', h.snapshot_date::text, 'score', h.overall_score, 'level', h.score_level)
    order by h.snapshot_date
  ), '[]'::jsonb)
  from (
    select snapshot_date, round(avg(overall_score), 1) as overall_score,
      public._ahostphs_score_level(avg(overall_score)) as score_level
    from public.aipify_hosts_property_health_history
    where tenant_id = p_tenant_id and snapshot_date >= current_date - 14
    group by snapshot_date
  ) h; $$;

create or replace function public._ahostphs_top_strengths(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(distinct elem), '[]'::jsonb)
  from public.aipify_hosts_property_health_scores s,
    lateral jsonb_array_elements_text(s.top_strengths) elem
  where s.tenant_id = p_tenant_id and s.score_level in ('excellent', 'good')
  limit 5; $$;

create or replace function public._ahostphs_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select s.id, p.display_name, s.overall_score from public.aipify_hosts_property_health_scores s
    join public.aipify_hosts_properties p on p.id = s.property_id
    where s.tenant_id = p_tenant_id and s.score_level = 'critical'
  loop
    perform public._ahostphs_push_notification(p_tenant_id, 'phs_crit_' || r.id::text, 'critical',
      'Property Critical', r.display_name || ' health score is critical (' || r.overall_score || ')');
  end loop;

  for r in
    select s.id, p.display_name, s.score_trend from public.aipify_hosts_property_health_scores s
    join public.aipify_hosts_properties p on p.id = s.property_id
    where s.tenant_id = p_tenant_id and s.score_trend <= -5
  loop
    perform public._ahostphs_push_notification(p_tenant_id, 'phs_drop_' || r.id::text, 'high',
      'Score Drop', r.display_name || ' score dropped significantly (' || r.score_trend || ')');
  end loop;

  for r in
    select rk.id, p.display_name, rk.risk_indicator from public.aipify_hosts_property_health_risks rk
    join public.aipify_hosts_properties p on p.id = rk.property_id
    where rk.tenant_id = p_tenant_id and not rk.is_resolved
      and rk.unresolved_since <= now() - interval '48 hours'
  loop
    perform public._ahostphs_push_notification(p_tenant_id, 'phs_risk48_' || r.id::text, 'high',
      'Risk Unresolved 48h', r.display_name || ' — ' || replace(r.risk_indicator, '_', ' '));
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_property_health_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_hs public.aipify_hosts_property_health_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hs := public._ahostphs_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_hs.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp391_positioning(),
    'route', '/app/aipify-hosts/property-health',
    'stats', public._ahostphs_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_property_health_dashboard(
  p_section text default 'portfolio_overview',
  p_property_id uuid default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_hs public.aipify_hosts_property_health_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_scores jsonb; v_risks jsonb; v_recs jsonb; v_detail jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hs := public._ahostphs_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_hs.default_section, 'portfolio_overview');
  perform public._ahostphs_seed_health(v_tenant_id);
  perform public._ahostphs_check_notifications(v_tenant_id);
  perform public._ahostphs_log_event(v_tenant_id, 'dashboard_view', 'Property Health viewed',
    jsonb_build_object('section', v_section, 'property_id', p_property_id));

  select coalesce(jsonb_agg(
    public._ahostphs_score_row(s, p.display_name) order by s.overall_score
  ), '[]'::jsonb) into v_scores
  from public.aipify_hosts_property_health_scores s
  left join public.aipify_hosts_properties p on p.id = s.property_id
  where s.tenant_id = v_tenant_id
    and (p_property_id is null or s.property_id = p_property_id)
    and (v_section <> 'property_scores' or true);

  select coalesce(jsonb_agg(
    public._ahostphs_risk_row(r, p.display_name) order by r.severity desc, r.unresolved_since
  ), '[]'::jsonb) into v_risks
  from public.aipify_hosts_property_health_risks r
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id and not r.is_resolved
    and (p_property_id is null or r.property_id = p_property_id)
    and (v_section in ('portfolio_overview', 'open_risks', 'property_scores') or v_section = 'open_risks');

  select coalesce(jsonb_agg(
    public._ahostphs_recommendation_row(rec, p.display_name) order by
      case rec.priority when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end
  ), '[]'::jsonb) into v_recs
  from public.aipify_hosts_property_health_recommendations rec
  left join public.aipify_hosts_properties p on p.id = rec.property_id
  where rec.tenant_id = v_tenant_id and not rec.is_completed
    and (p_property_id is null or rec.property_id = p_property_id)
    and (v_section in ('portfolio_overview', 'recommended_actions', 'property_scores') or v_section = 'recommended_actions');

  if p_property_id is not null then
    select public._ahostphs_score_row(s, p.display_name) into v_detail
    from public.aipify_hosts_property_health_scores s
    left join public.aipify_hosts_properties p on p.id = s.property_id
    where s.tenant_id = v_tenant_id and s.property_id = p_property_id;
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_hs.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'selected_property_id', p_property_id,
    'positioning', public._ahostbp391_positioning(),
    'governance', jsonb_build_object(
      'role_based_visibility', true,
      'audit_score_override', true,
      'audit_action_completion', true
    ),
    'sections', public._ahostbp391_sections(),
    'score_levels', jsonb_build_array('excellent', 'good', 'attention_required', 'critical'),
    'score_inputs', jsonb_build_array(
      'occupancy_status', 'guest_satisfaction', 'cleaning_completion', 'maintenance_status',
      'incident_history', 'inspection_results', 'supply_readiness', 'access_readiness', 'document_readiness'
    ),
    'risk_indicators', jsonb_build_array(
      'cleaning_overdue', 'maintenance_overdue', 'open_critical_incident', 'low_supplies',
      'missing_access_instructions', 'expired_document', 'failed_inspection'
    ),
    'category_labels', jsonb_build_array(
      'guest_experience', 'operations', 'safety', 'maintenance', 'finance', 'compliance'
    ),
    'stats', public._ahostphs_dashboard_stats(v_tenant_id),
    'score_trend', public._ahostphs_score_trend(v_tenant_id),
    'top_strengths', public._ahostphs_top_strengths(v_tenant_id),
    'property_scores', v_scores,
    'open_risks', v_risks,
    'recommended_actions', v_recs,
    'property_detail', coalesce(v_detail, 'null'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 29 — Property Health Score Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_29_PROPERTY_HEALTH.text',
      'route', '/app/aipify-hosts/property-health'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_property_health_action(
  p_action_type text,
  p_property_id uuid default null,
  p_recommendation_id uuid default null,
  p_risk_id uuid default null,
  p_notes text default null,
  p_override_score numeric default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_rec public.aipify_hosts_property_health_recommendations;
  v_score public.aipify_hosts_property_health_scores;
  v_task_key text; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'open_property' then
    perform public._ahostphs_log_event(v_tenant_id, 'open_property', 'Property opened from health dashboard',
      jsonb_build_object('property_id', p_property_id));
    v_summary := 'Property opened';

  elsif p_action_type = 'create_task' then
    v_task_key := 'task_phs_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority
    ) values (
      v_tenant_id, p_property_id, v_task_key, 'Property health follow-up',
      coalesce(p_notes, 'Task created from Property Health Score'), 'maintenance', 'high'
    );
    v_summary := 'Task created';

  elsif p_action_type = 'schedule_inspection' then
    begin
      insert into public.aipify_hosts_inspections (
        tenant_id, property_id, inspection_key, inspection_type, inspection_status, scheduled_date
      ) values (
        v_tenant_id, p_property_id,
        'insp_phs_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
        'routine', 'scheduled', current_date + 3
      );
    exception when undefined_table then null;
    end;
    v_summary := 'Inspection scheduled';

  elsif p_action_type = 'view_incidents' then
    perform public._ahostphs_log_event(v_tenant_id, 'view_incidents', 'Incidents viewed from health dashboard',
      jsonb_build_object('property_id', p_property_id));
    v_summary := 'Incidents viewed';

  elsif p_action_type = 'review_supplies' then
    perform public._ahostphs_log_event(v_tenant_id, 'review_supplies', 'Supplies review initiated',
      jsonb_build_object('property_id', p_property_id));
    v_summary := 'Supplies review initiated';

  elsif p_action_type = 'complete_recommendation' then
    select * into v_rec from public.aipify_hosts_property_health_recommendations
    where id = p_recommendation_id and tenant_id = v_tenant_id;
    if v_rec.id is null then raise exception 'Recommendation not found'; end if;
    update public.aipify_hosts_property_health_recommendations set
      is_completed = true, completed_at = now(), updated_at = now()
    where id = p_recommendation_id;
    perform public._ahostphs_log_event(v_tenant_id, 'action_completed', 'Recommended action completed',
      jsonb_build_object('recommendation_id', p_recommendation_id));
    v_summary := 'Action completed';

  elsif p_action_type = 'resolve_risk' then
    update public.aipify_hosts_property_health_risks set
      is_resolved = true, updated_at = now()
    where id = p_risk_id and tenant_id = v_tenant_id;
    perform public._ahostphs_log_event(v_tenant_id, 'risk_resolved', 'Risk resolved',
      jsonb_build_object('risk_id', p_risk_id));
    v_summary := 'Risk resolved';

  elsif p_action_type = 'override_score' then
    select * into v_score from public.aipify_hosts_property_health_scores
    where property_id = p_property_id and tenant_id = v_tenant_id;
    if v_score.id is null then raise exception 'Health score not found'; end if;
    insert into public.aipify_hosts_property_health_overrides (
      tenant_id, property_id, health_score_id, previous_score, override_score, override_reason
    ) values (
      v_tenant_id, p_property_id, v_score.id, v_score.overall_score,
      coalesce(p_override_score, v_score.overall_score), coalesce(p_notes, 'Manual override')
    );
    update public.aipify_hosts_property_health_scores set
      overall_score = coalesce(p_override_score, overall_score),
      score_level = public._ahostphs_score_level(coalesce(p_override_score, overall_score)),
      updated_at = now()
    where id = v_score.id;
    perform public._ahostphs_log_event(v_tenant_id, 'score_override', 'Score override applied',
      jsonb_build_object('property_id', p_property_id, 'override_score', p_override_score));
    v_summary := 'Score override applied';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostphs_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'property_id', p_property_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_property_health_knowledge_airbnb29()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-property-health', 'Hosts Property Health Score',
    'Property health scores, readiness, risk management, and hospitality quality standards.', 325
  );
  perform public._ahostkc_seed_article('aipify-hosts-property-health', 'understanding-property-health-score', 'Understanding Property Health Score',
    'Health scores combine occupancy, guest satisfaction, cleaning, maintenance, incidents, inspections, supplies, access, and documents.');
  perform public._ahostkc_seed_article('aipify-hosts-property-health', 'improving-property-readiness', 'Improving property readiness',
    'Address open risks and complete recommended actions to raise scores from Attention Required or Critical to Good or Excellent.');
  perform public._ahostkc_seed_article('aipify-hosts-property-health', 'managing-property-risk', 'Managing property risk',
    'Monitor risk indicators including overdue cleaning, critical incidents, low supplies, and expired documents.');
  perform public._ahostkc_seed_article('aipify-hosts-property-health', 'hospitality-quality-standards', 'Hospitality quality standards',
    'Maintain consistent guest experience, operations, safety, maintenance, finance, and compliance categories per property.');
end; $$;

select public.seed_aipify_hosts_property_health_knowledge_airbnb29();

grant execute on function public.get_aipify_hosts_property_health_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_property_health_dashboard(text, uuid, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_property_health_action(text, uuid, uuid, uuid, text, numeric, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_property_health_knowledge_airbnb29() to authenticated;
