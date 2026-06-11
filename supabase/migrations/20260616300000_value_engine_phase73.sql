-- Phase 73 — Value Engine & Impact Analytics

-- ---------------------------------------------------------------------------
-- 1. roi_settings
-- ---------------------------------------------------------------------------
create table if not exists public.roi_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  support_hourly_rate numeric(10,2) not null default 35,
  admin_hourly_rate numeric(10,2) not null default 45,
  management_hourly_rate numeric(10,2) not null default 80,
  default_hourly_rate numeric(10,2) not null default 45,
  currency text not null default 'USD',
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.roi_settings enable row level security;
revoke all on public.roi_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. value_events
-- ---------------------------------------------------------------------------
create table if not exists public.value_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_module text not null,
  event_type text not null,
  category text not null,
  estimated_time_saved_minutes numeric(10,2) not null default 0,
  estimated_value numeric(12,2),
  evidence jsonb not null default '{}'::jsonb,
  evidence_ref text,
  created_at timestamptz not null default now()
);

create index if not exists value_events_tenant_idx
  on public.value_events (tenant_id, created_at desc);

create index if not exists value_events_tenant_category_idx
  on public.value_events (tenant_id, category, created_at desc);

alter table public.value_events enable row level security;
revoke all on public.value_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. value_metrics (aggregated snapshots)
-- ---------------------------------------------------------------------------
create table if not exists public.value_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  metric_key text not null,
  metric_value numeric(14,4) not null default 0,
  unit text not null default 'count',
  evidence_ref text,
  recorded_at timestamptz not null default now()
);

create index if not exists value_metrics_tenant_idx
  on public.value_metrics (tenant_id, category, recorded_at desc);

alter table public.value_metrics enable row level security;
revoke all on public.value_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. impact_scores
-- ---------------------------------------------------------------------------
create table if not exists public.impact_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overall_score numeric(5,2) not null default 0 check (overall_score between 0 and 100),
  time_saved_score numeric(5,2) not null default 0,
  support_score numeric(5,2) not null default 0,
  quality_score numeric(5,2) not null default 0,
  knowledge_score numeric(5,2) not null default 0,
  automation_score numeric(5,2) not null default 0,
  governance_score numeric(5,2) not null default 0,
  productivity_score numeric(5,2) not null default 0,
  operational_score numeric(5,2) not null default 0,
  trend_delta numeric(5,2),
  evidence_summary jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now()
);

create index if not exists impact_scores_tenant_idx
  on public.impact_scores (tenant_id, generated_at desc);

alter table public.impact_scores enable row level security;
revoke all on public.impact_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. value_reports
-- ---------------------------------------------------------------------------
create table if not exists public.value_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_type text not null check (
    report_type in ('weekly', 'monthly', 'quarterly', 'annual', 'custom')
  ),
  title text not null,
  summary text,
  report_payload jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now()
);

create index if not exists value_reports_tenant_idx
  on public.value_reports (tenant_id, generated_at desc);

alter table public.value_reports enable row level security;
revoke all on public.value_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. value_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.value_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists value_audit_log_tenant_idx
  on public.value_audit_log (tenant_id, created_at desc);

alter table public.value_audit_log enable row level security;
revoke all on public.value_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers (_val_)
-- ---------------------------------------------------------------------------
create or replace function public._val_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._val_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._val_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._val_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.value_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb),
    coalesce(p_user_id, public._val_auth_user_id()))
  returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'value_' || p_event_type, 'value_engine', 'logged', p_user_id, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._val_ensure_roi_settings(p_tenant_id uuid)
returns public.roi_settings language plpgsql security definer set search_path = public as $$
declare v_row public.roi_settings;
begin
  insert into public.roi_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_row from public.roi_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._val_time_saved_rule(p_event_type text)
returns table(minutes numeric, category text, evidence_key text) language sql stable as $$
  select v.minutes, v.category, v.evidence_key from (values
    ('support_draft_used', 5::numeric, 'support_efficiency', 'Conservative estimate: draft saved manual reply time'),
    ('support_draft_accepted', 5::numeric, 'support_efficiency', 'Draft accepted without rewrite'),
    ('faq_deflected', 3::numeric, 'support_efficiency', 'FAQ resolved issue without escalation'),
    ('faq_resolved', 3::numeric, 'knowledge', 'Knowledge article resolved inquiry'),
    ('knowledge_gap_resolved', 5::numeric, 'knowledge', 'Gap closed with new documentation'),
    ('briefing_opened', 10::numeric, 'time_saved', 'Briefing replaced manual status review'),
    ('action_completed', 2::numeric, 'productivity', 'Task completed via Action Center'),
    ('reminder_completed', 2::numeric, 'time_saved', 'Desktop reminder completed'),
    ('automation_executed', 5::numeric, 'automation', 'Automation avoided manual step'),
    ('quality_issue_detected', 0::numeric, 'quality', 'Issue identified — risk reduction, no time claim'),
    ('quality_issue_resolved', 3::numeric, 'quality', 'Quality finding addressed'),
    ('governance_block', 0::numeric, 'risk_reduction', 'High-risk action prevented'),
    ('approval_enforced', 1::numeric, 'risk_reduction', 'Approval workflow enforced')
  ) as v(event_type, minutes, category, evidence_key)
  where v.event_type = p_event_type;
$$;

create or replace function public._val_hourly_rate_for_category(p_roi public.roi_settings, p_category text)
returns numeric language sql immutable as $$
  select case p_category
    when 'support_efficiency' then p_roi.support_hourly_rate
    when 'risk_reduction' then p_roi.management_hourly_rate
    else p_roi.default_hourly_rate
  end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Record value event
-- ---------------------------------------------------------------------------
create or replace function public.record_value_event(
  p_source_module text,
  p_event_type text,
  p_category text default null,
  p_evidence jsonb default '{}'::jsonb,
  p_evidence_ref text default null,
  p_time_saved_minutes numeric default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_roi public.roi_settings;
  v_rule record;
  v_minutes numeric;
  v_cat text;
  v_evidence text;
  v_value numeric;
  v_event_id uuid;
begin
  v_tenant_id := public._val_require_tenant();
  v_roi := public._val_ensure_roi_settings(v_tenant_id);

  select * into v_rule from public._val_time_saved_rule(p_event_type);
  if found then
    v_minutes := coalesce(p_time_saved_minutes, v_rule.minutes, 2);
    v_cat := coalesce(p_category, v_rule.category, 'productivity');
    v_evidence := coalesce(v_rule.evidence_key, 'Conservative rule-based estimate');
  else
    v_minutes := coalesce(p_time_saved_minutes, 2);
    v_cat := coalesce(p_category, 'productivity');
    v_evidence := 'Default conservative time estimate';
  end if;

  if v_roi.enabled and v_minutes > 0 then
    v_value := round((v_minutes / 60.0) * public._val_hourly_rate_for_category(v_roi, v_cat), 2);
  end if;

  insert into public.value_events (
    tenant_id, source_module, event_type, category,
    estimated_time_saved_minutes, estimated_value, evidence, evidence_ref
  ) values (
    v_tenant_id, p_source_module, p_event_type, v_cat,
    v_minutes, v_value,
    coalesce(p_evidence, '{}'::jsonb) || jsonb_build_object('explanation', v_evidence),
    p_evidence_ref
  ) returning id into v_event_id;

  perform public._val_log_audit(v_tenant_id, 'event_created', 'Value event recorded',
    jsonb_build_object('event_id', v_event_id, 'event_type', p_event_type, 'minutes', v_minutes));

  return jsonb_build_object('event_id', v_event_id, 'minutes', v_minutes, 'estimated_value', v_value);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Collect signals from modules
-- ---------------------------------------------------------------------------
create or replace function public.collect_value_signals()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_count int := 0;
  v_row record;
begin
  v_tenant_id := public._val_require_tenant();

  for v_row in
    select event_type, source_module, count(*) as cnt
    from public.learning_events
    where tenant_id = v_tenant_id and created_at > now() - interval '30 days'
    group by event_type, source_module
    limit 50
  loop
    if v_row.event_type in ('support_answer_helpful', 'suggestion_approved') then
      perform public.record_value_event(v_row.source_module, 'support_draft_accepted', 'support_efficiency',
        jsonb_build_object('count', v_row.cnt, 'source', 'learning_events'));
      v_count := v_count + 1;
    elsif v_row.event_type = 'knowledge_gap_resolved' then
      perform public.record_value_event(v_row.source_module, 'knowledge_gap_resolved', 'knowledge',
        jsonb_build_object('count', v_row.cnt));
      v_count := v_count + 1;
    elsif v_row.event_type = 'action_completed' then
      perform public.record_value_event(v_row.source_module, 'action_completed', 'productivity',
        jsonb_build_object('count', v_row.cnt));
      v_count := v_count + 1;
    end if;
  end loop;

  for v_row in
    select count(*) as cnt from public.tenant_marketplace_installs
    where tenant_id = v_tenant_id and status in ('installed', 'active')
  loop
    if v_row.cnt > 0 then
      insert into public.value_metrics (tenant_id, category, metric_key, metric_value, unit, evidence_ref)
      values (v_tenant_id, 'operational', 'marketplace_packs_active', v_row.cnt, 'count', 'tenant_marketplace_installs');
    end if;
  end loop;

  for v_row in
    select b.title, count(r.id) as applied
    from public.tenant_industry_profiles p
    join public.industry_blueprints b on b.id = p.selected_blueprint_id
    left join public.blueprint_recommendations r on r.tenant_id = p.tenant_id and r.status = 'applied'
    where p.tenant_id = v_tenant_id
    group by b.title
  loop
    insert into public.value_metrics (tenant_id, category, metric_key, metric_value, unit, evidence_ref)
    values (v_tenant_id, 'operational', 'blueprint_' || lower(replace(v_row.title, ' ', '_')), v_row.applied, 'components_applied', 'blueprint_recommendations');
  end loop;

  perform public._val_log_audit(v_tenant_id, 'signals_collected', v_count || ' value signals collected',
    jsonb_build_object('count', v_count));

  return jsonb_build_object('collected', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Impact score generator
-- ---------------------------------------------------------------------------
create or replace function public.generate_impact_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_prev public.impact_scores;
  v_time numeric := 0;
  v_support numeric := 0;
  v_quality numeric := 0;
  v_knowledge numeric := 0;
  v_automation numeric := 0;
  v_governance numeric := 0;
  v_productivity numeric := 0;
  v_operational numeric := 0;
  v_overall numeric;
  v_trend numeric;
  v_total_minutes numeric;
  v_total_value numeric;
  v_score_id uuid;
begin
  v_tenant_id := public._val_require_tenant();
  perform public.collect_value_signals();

  select coalesce(sum(estimated_time_saved_minutes), 0) into v_total_minutes
  from public.value_events where tenant_id = v_tenant_id and created_at > now() - interval '30 days';

  select coalesce(sum(estimated_value), 0) into v_total_value
  from public.value_events where tenant_id = v_tenant_id and created_at > now() - interval '30 days'
    and estimated_value is not null;

  select least(100, round(count(*) * 3 + coalesce(sum(estimated_time_saved_minutes), 0) / 10, 1)) into v_support
  from public.value_events where tenant_id = v_tenant_id and category = 'support_efficiency'
    and created_at > now() - interval '30 days';

  select least(100, round(count(*) * 4, 1)) into v_knowledge
  from public.value_events where tenant_id = v_tenant_id and category = 'knowledge'
    and created_at > now() - interval '30 days';

  select least(100, round(count(*) * 5, 1)) into v_quality
  from public.value_events where tenant_id = v_tenant_id and category = 'quality'
    and created_at > now() - interval '30 days';

  select least(100, round(count(*) * 4, 1)) into v_automation
  from public.value_events where tenant_id = v_tenant_id and category = 'automation'
    and created_at > now() - interval '30 days';

  select least(100, round(count(*) * 6, 1)) into v_governance
  from public.value_events where tenant_id = v_tenant_id and category = 'risk_reduction'
    and created_at > now() - interval '30 days';

  select least(100, round(count(*) * 3 + coalesce(sum(estimated_time_saved_minutes), 0) / 15, 1)) into v_productivity
  from public.value_events where tenant_id = v_tenant_id and category = 'productivity'
    and created_at > now() - interval '30 days';

  select least(100, coalesce(max(metric_value), 0) * 5) into v_operational
  from public.value_metrics where tenant_id = v_tenant_id and category = 'operational'
    and recorded_at > now() - interval '30 days';

  v_time := least(100, round(v_total_minutes / 6, 1));

  v_overall := round((
    v_time * 0.15 + v_support * 0.2 + v_quality * 0.1 + v_knowledge * 0.15 +
    v_automation * 0.1 + v_governance * 0.1 + v_productivity * 0.1 + v_operational * 0.1
  ), 1);

  select * into v_prev from public.impact_scores
  where tenant_id = v_tenant_id order by generated_at desc limit 1;

  v_trend := case when v_prev.id is not null then v_overall - v_prev.overall_score else null end;

  insert into public.impact_scores (
    tenant_id, overall_score, time_saved_score, support_score, quality_score,
    knowledge_score, automation_score, governance_score, productivity_score,
    operational_score, trend_delta, evidence_summary
  ) values (
    v_tenant_id, v_overall, v_time, v_support, v_quality, v_knowledge,
    v_automation, v_governance, v_productivity, v_operational, v_trend,
    jsonb_build_object(
      'total_minutes_30d', v_total_minutes,
      'total_estimated_value_30d', v_total_value,
      'method', 'conservative_weighted_categories',
      'evidence', 'Based on traceable value_events in last 30 days'
    )
  ) returning id into v_score_id;

  perform public._val_log_audit(v_tenant_id, 'impact_score_generated', 'Impact score: ' || v_overall,
    jsonb_build_object('score_id', v_score_id, 'overall', v_overall));

  return jsonb_build_object('score_id', v_score_id, 'overall_score', v_overall, 'trend_delta', v_trend);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_value_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score public.impact_scores;
  v_minutes numeric;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public._val_seed_demo_events(v_tenant_id);

  select * into v_score from public.impact_scores
  where tenant_id = v_tenant_id order by generated_at desc limit 1;

  if v_score.id is null then
    perform public.generate_impact_score();
    select * into v_score from public.impact_scores
    where tenant_id = v_tenant_id order by generated_at desc limit 1;
  end if;

  select coalesce(sum(estimated_time_saved_minutes), 0) into v_minutes
  from public.value_events where tenant_id = v_tenant_id and created_at > now() - interval '30 days';

  return jsonb_build_object(
    'has_customer', true,
    'impact_score', v_score.overall_score,
    'trend_delta', v_score.trend_delta,
    'minutes_saved_30d', v_minutes,
    'philosophy', 'Every metric is explainable, traceable, and conservative.',
    'privacy_note', 'ROI estimates are optional and never guaranteed.'
  );
end; $$;

create or replace function public.get_value_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score public.impact_scores;
  v_roi public.roi_settings;
  v_minutes numeric;
  v_value numeric;
  v_timeline jsonb;
  v_marketplace jsonb;
  v_blueprint jsonb;
begin
  v_tenant_id := public._val_require_tenant();
  perform public.generate_impact_score();

  select * into v_score from public.impact_scores
  where tenant_id = v_tenant_id order by generated_at desc limit 1;
  v_roi := public._val_ensure_roi_settings(v_tenant_id);

  select coalesce(sum(estimated_time_saved_minutes), 0),
         coalesce(sum(estimated_value), 0)
  into v_minutes, v_value
  from public.value_events where tenant_id = v_tenant_id and created_at > now() - interval '30 days';

  select coalesce(jsonb_agg(t.row order by t.month_key), '[]'::jsonb) into v_timeline
  from (
    select
      date_trunc('month', e.created_at) as month_key,
      jsonb_build_object(
        'month', to_char(date_trunc('month', e.created_at), 'YYYY-MM'),
        'minutes_saved', round(sum(e.estimated_time_saved_minutes)::numeric, 1),
        'event_count', count(*)
      ) as row
    from public.value_events e
    where e.tenant_id = v_tenant_id and e.created_at > now() - interval '6 months'
    group by date_trunc('month', e.created_at)
  ) t;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack', mi.title,
    'item_key', mi.item_key,
    'minutes_saved', coalesce((
      select sum(ve.estimated_time_saved_minutes) from public.value_events ve
      where ve.tenant_id = v_tenant_id and ve.evidence_ref = mi.item_key
    ), 0),
    'status', ti.status
  )), '[]'::jsonb) into v_marketplace
  from public.tenant_marketplace_installs ti
  join public.marketplace_items mi on mi.id = ti.item_id
  where ti.tenant_id = v_tenant_id and ti.status not in ('uninstalled', 'failed');

  select jsonb_build_object(
    'blueprint_title', b.title,
    'industry_category', b.industry_category,
    'applied_components', (
      select count(*) from public.blueprint_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'applied'
    )
  ) into v_blueprint
  from public.tenant_industry_profiles p
  left join public.industry_blueprints b on b.id = p.selected_blueprint_id
  where p.tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'impact_score', row_to_json(v_score)::jsonb,
    'roi_enabled', v_roi.enabled,
    'minutes_saved_30d', v_minutes,
    'estimated_value_30d', case when v_roi.enabled then v_value else null end,
    'currency', v_roi.currency,
    'timeline', v_timeline,
    'marketplace_impact', v_marketplace,
    'blueprint_impact', v_blueprint,
    'category_scores', jsonb_build_object(
      'time_saved', v_score.time_saved_score,
      'support', v_score.support_score,
      'quality', v_score.quality_score,
      'knowledge', v_score.knowledge_score,
      'automation', v_score.automation_score,
      'governance', v_score.governance_score,
      'productivity', v_score.productivity_score,
      'operational', v_score.operational_score
    )
  );
end; $$;

create or replace function public.get_impact_score()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score public.impact_scores;
begin
  v_tenant_id := public._val_require_tenant();
  select * into v_score from public.impact_scores
  where tenant_id = v_tenant_id order by generated_at desc limit 1;
  if v_score.id is null then
    return public.generate_impact_score();
  end if;
  return row_to_json(v_score)::jsonb;
end; $$;

create or replace function public.list_value_events(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._val_require_tenant();
  return jsonb_build_object('events', coalesce((
    select jsonb_agg(row_to_json(e)::jsonb order by e.created_at desc)
    from (select * from public.value_events where tenant_id = v_tenant_id
          order by created_at desc limit coalesce(p_limit, 50)) e
  ), '[]'::jsonb));
end; $$;

create or replace function public.get_roi_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._val_require_tenant();
  return row_to_json(public._val_ensure_roi_settings(v_tenant_id))::jsonb;
end; $$;

create or replace function public.update_roi_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._val_require_tenant();
  v_user_id := public._val_auth_user_id();
  perform public._val_require_admin();
  perform public._val_ensure_roi_settings(v_tenant_id);

  update public.roi_settings set
    support_hourly_rate = coalesce((p_patch->>'support_hourly_rate')::numeric, support_hourly_rate),
    admin_hourly_rate = coalesce((p_patch->>'admin_hourly_rate')::numeric, admin_hourly_rate),
    management_hourly_rate = coalesce((p_patch->>'management_hourly_rate')::numeric, management_hourly_rate),
    default_hourly_rate = coalesce((p_patch->>'default_hourly_rate')::numeric, default_hourly_rate),
    currency = coalesce(p_patch->>'currency', currency),
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    updated_at = now()
  where tenant_id = v_tenant_id;

  perform public._val_log_audit(v_tenant_id, 'roi_settings_updated', 'ROI settings updated', p_patch, v_user_id);
  return public.get_roi_settings();
end; $$;

create or replace function public.generate_value_report(p_report_type text default 'monthly')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_score public.impact_scores;
  v_roi public.roi_settings;
  v_report_id uuid;
  v_title text;
  v_payload jsonb;
  v_minutes numeric;
  v_value numeric;
begin
  v_tenant_id := public._val_require_tenant();
  v_user_id := public._val_auth_user_id();
  perform public._val_require_admin();
  perform public.generate_impact_score();

  select * into v_score from public.impact_scores
  where tenant_id = v_tenant_id order by generated_at desc limit 1;
  v_roi := public._val_ensure_roi_settings(v_tenant_id);

  v_title := initcap(p_report_type) || ' Value Report — ' || to_char(now(), 'YYYY-MM-DD');

  select coalesce(sum(estimated_time_saved_minutes), 0),
         coalesce(sum(estimated_value), 0)
  into v_minutes, v_value
  from public.value_events where tenant_id = v_tenant_id
    and created_at > case p_report_type
      when 'weekly' then now() - interval '7 days'
      when 'quarterly' then now() - interval '90 days'
      when 'annual' then now() - interval '365 days'
      else now() - interval '30 days'
    end;

  v_payload := jsonb_build_object(
    'impact_score', v_score.overall_score,
    'trend_delta', v_score.trend_delta,
    'minutes_saved', v_minutes,
    'estimated_value', case when v_roi.enabled then v_value else null end,
    'currency', v_roi.currency,
    'category_scores', jsonb_build_object(
      'support', v_score.support_score, 'quality', v_score.quality_score,
      'knowledge', v_score.knowledge_score, 'automation', v_score.automation_score,
      'governance', v_score.governance_score, 'productivity', v_score.productivity_score
    ),
    'evidence_note', 'All figures derived from traceable value_events with conservative rules.',
    'roi_disclaimer', 'ROI is estimated and not guaranteed.'
  );

  insert into public.value_reports (tenant_id, report_type, title, summary, report_payload)
  values (
    v_tenant_id, p_report_type, v_title,
    'Impact Score ' || v_score.overall_score || '/100 — ' || round(v_minutes / 60, 1) || ' hours saved.',
    v_payload
  ) returning id into v_report_id;

  perform public._val_log_audit(v_tenant_id, 'report_generated', v_title,
    jsonb_build_object('report_id', v_report_id, 'type', p_report_type), v_user_id);

  return jsonb_build_object('report_id', v_report_id, 'title', v_title, 'payload', v_payload);
end; $$;

create or replace function public.list_value_reports(p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._val_require_tenant();
  return jsonb_build_object('reports', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id, 'report_type', r.report_type, 'title', r.title,
      'summary', r.summary, 'generated_at', r.generated_at,
      'payload', r.report_payload
    ) order by r.generated_at desc)
    from public.value_reports r where r.tenant_id = v_tenant_id
    limit coalesce(p_limit, 20)
  ), '[]'::jsonb));
end; $$;

create or replace function public.detect_value_opportunities()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_opportunities jsonb := '[]'::jsonb;
  v_pack_count int;
  v_desktop_events int;
  v_evolution_pending int;
begin
  v_tenant_id := public._val_require_tenant();

  select count(*) into v_pack_count from public.tenant_marketplace_installs
  where tenant_id = v_tenant_id and status in ('installed', 'active');

  if v_pack_count < 2 then
    v_opportunities := v_opportunities || jsonb_build_array(jsonb_build_object(
      'type', 'marketplace', 'title', 'Support Pack adoption opportunity',
      'summary', 'Installing Support Starter Pack may save an estimated 22 hours/month based on similar deployments.',
      'priority', 'medium', 'evidence', 'Conservative benchmark — not guaranteed'
    ));
  end if;

  select count(*) into v_desktop_events from public.value_events
  where tenant_id = v_tenant_id and source_module ilike '%desktop%' and created_at > now() - interval '30 days';

  if v_desktop_events < 5 then
    v_opportunities := v_opportunities || jsonb_build_array(jsonb_build_object(
      'type', 'desktop', 'title', 'Desktop Companion underutilized',
      'summary', 'Reminder completion signals are low — enabling Desktop Companion may improve follow-through.',
      'priority', 'low', 'evidence', 'Low value_event count from desktop module'
    ));
  end if;

  select count(*) into v_evolution_pending from public.core_evolution_proposals
  where status = 'pending';

  if v_evolution_pending > 0 then
    v_opportunities := v_opportunities || jsonb_build_array(jsonb_build_object(
      'type', 'evolution', 'title', 'Core improvements pending review',
      'summary', v_evolution_pending || ' evolution proposals may create value if approved and implemented.',
      'priority', 'medium', 'evidence', 'core_evolution_proposals pending count'
    ));
  end if;

  return jsonb_build_object('opportunities', v_opportunities);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Seed demo events for tenants with activity
-- ---------------------------------------------------------------------------
create or replace function public._val_seed_demo_events(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists(select 1 from public.value_events where tenant_id = p_tenant_id limit 1) then return; end if;

  insert into public.value_events (tenant_id, source_module, event_type, category, estimated_time_saved_minutes, evidence, evidence_ref)
  values
    (p_tenant_id, 'support', 'support_draft_accepted', 'support_efficiency', 5,
     '{"explanation":"Conservative estimate: draft saved manual reply time","demo":true}'::jsonb, 'learning_events'),
    (p_tenant_id, 'knowledge_center', 'faq_resolved', 'knowledge', 3,
     '{"explanation":"FAQ resolved issue without escalation","demo":true}'::jsonb, null),
    (p_tenant_id, 'briefing', 'briefing_opened', 'time_saved', 10,
     '{"explanation":"Briefing replaced manual status review","demo":true}'::jsonb, null),
    (p_tenant_id, 'action_center', 'action_completed', 'productivity', 2,
     '{"explanation":"Task completed via Action Center","demo":true}'::jsonb, null),
    (p_tenant_id, 'quality', 'quality_issue_detected', 'quality', 0,
     '{"explanation":"Issue identified — risk reduction, no time claim","demo":true}'::jsonb, null),
    (p_tenant_id, 'governance', 'governance_block', 'risk_reduction', 0,
     '{"explanation":"High-risk action prevented","demo":true}'::jsonb, null);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. KC category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'value-engine', 'Value Engine & Impact Analytics', 'Impact Score, ROI settings, and value reporting guides.', 'authenticated', 17
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'value-engine' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.record_value_event(text, text, text, jsonb, text, numeric) to authenticated;
grant execute on function public.collect_value_signals() to authenticated;
grant execute on function public.generate_impact_score() to authenticated;
grant execute on function public.get_value_engine_card() to authenticated;
grant execute on function public.get_value_engine_dashboard() to authenticated;
grant execute on function public.get_impact_score() to authenticated;
grant execute on function public.list_value_events(int) to authenticated;
grant execute on function public.get_roi_settings() to authenticated;
grant execute on function public.update_roi_settings(jsonb) to authenticated;
grant execute on function public.generate_value_report(text) to authenticated;
grant execute on function public.list_value_reports(int) to authenticated;
grant execute on function public.detect_value_opportunities() to authenticated;
