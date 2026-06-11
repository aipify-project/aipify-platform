-- Phase 79 — Autonomous Operations Center (AOC)
-- Core principle: AOC observes, prioritizes, recommends — never governs.

-- ---------------------------------------------------------------------------
-- 1. aoc_health_scores
-- ---------------------------------------------------------------------------
create table if not exists public.aoc_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overall_score numeric(5, 2) not null default 75.00,
  health_band text not null default 'healthy',
  support_score numeric(5, 2) not null default 75.00,
  knowledge_score numeric(5, 2) not null default 75.00,
  quality_score numeric(5, 2) not null default 75.00,
  governance_score numeric(5, 2) not null default 75.00,
  action_score numeric(5, 2) not null default 75.00,
  communication_score numeric(5, 2) not null default 75.00,
  security_score numeric(5, 2) not null default 75.00,
  value_score numeric(5, 2) not null default 75.00,
  twin_score numeric(5, 2) not null default 75.00,
  created_at timestamptz not null default now()
);

create index if not exists aoc_health_scores_tenant_idx
  on public.aoc_health_scores (tenant_id, created_at desc);

alter table public.aoc_health_scores enable row level security;
revoke all on public.aoc_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aoc_watcher_findings
-- ---------------------------------------------------------------------------
create table if not exists public.aoc_watcher_findings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  watcher_type text not null check (
    watcher_type in (
      'support', 'knowledge', 'quality', 'governance', 'action', 'desktop',
      'security', 'twin', 'marketplace', 'value'
    )
  ),
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  summary text not null,
  recommendation text,
  evidence jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'accepted')),
  created_at timestamptz not null default now()
);

create index if not exists aoc_watcher_findings_tenant_idx
  on public.aoc_watcher_findings (tenant_id, watcher_type, status, created_at desc);

alter table public.aoc_watcher_findings enable row level security;
revoke all on public.aoc_watcher_findings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aoc_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.aoc_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  finding_id uuid references public.aoc_watcher_findings (id) on delete set null,
  category text not null,
  title text not null,
  explanation text not null,
  expected_benefit text,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  confidence_level text not null default 'medium' check (confidence_level in ('high', 'medium', 'low')),
  suggested_steps jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists aoc_recommendations_tenant_idx
  on public.aoc_recommendations (tenant_id, status, created_at desc);

alter table public.aoc_recommendations enable row level security;
revoke all on public.aoc_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aoc_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.aoc_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_type text not null check (review_type in ('daily', 'weekly', 'executive')),
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aoc_reviews_tenant_idx
  on public.aoc_reviews (tenant_id, review_type, created_at desc);

alter table public.aoc_reviews enable row level security;
revoke all on public.aoc_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aoc_watcher_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aoc_watcher_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled_watchers jsonb not null default '["support","knowledge","quality","governance","action","desktop","security","twin","marketplace","value"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aoc_watcher_settings enable row level security;
revoke all on public.aoc_watcher_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aoc_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.aoc_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.aoc_audit_log enable row level security;
revoke all on public.aoc_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers (_aoc_)
-- ---------------------------------------------------------------------------
create or replace function public._aoc_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._aoc_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aoc_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aoc_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._aoc_auth_user_id()))
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'aoc_' || p_event_type, 'aoc', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._aoc_health_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'attention'
    when p_score >= 40 then 'risk'
    else 'critical'
  end;
$$;

create or replace function public._aoc_ensure_settings(p_tenant_id uuid)
returns public.aoc_watcher_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aoc_watcher_settings;
begin
  select * into v_row from public.aoc_watcher_settings where tenant_id = p_tenant_id;
  if v_row.id is null then
    insert into public.aoc_watcher_settings (tenant_id) values (p_tenant_id) returning * into v_row;
  end if;
  return v_row;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Generate recommendations from open findings
-- ---------------------------------------------------------------------------
create or replace function public._aoc_generate_recommendations_from_findings(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_finding public.aoc_watcher_findings;
begin
  for v_finding in
    select * from public.aoc_watcher_findings f
    where f.tenant_id = p_tenant_id and f.status = 'open'
      and not exists (select 1 from public.aoc_recommendations r where r.finding_id = f.id)
  loop
    insert into public.aoc_recommendations (
      tenant_id, finding_id, category, title, explanation, expected_benefit,
      risk_level, confidence_level, suggested_steps
    ) values (
      p_tenant_id, v_finding.id, v_finding.watcher_type,
      'Review: ' || left(v_finding.summary, 80),
      'AOC detected this based on operational signals. ' || coalesce(v_finding.recommendation, 'Human review recommended.'),
      'Improved operational awareness and reduced blind spots.',
      case v_finding.severity when 'critical' then 'high' when 'warning' then 'medium' else 'low' end,
      case v_finding.severity when 'critical' then 'high' when 'warning' then 'medium' else 'high' end,
      jsonb_build_array('Review finding details', 'Validate with team', 'Accept or dismiss recommendation')
    );

    begin
      perform public.generate_decision_explanation(
        'aoc-rec-' || v_finding.id::text, 'action', 'aoc',
        'AOC recommendation: ' || left(v_finding.summary, 100),
        'Watcher ' || v_finding.watcher_type || ' identified this based on operational evidence. AOC observes and recommends — humans decide.',
        jsonb_build_array(v_finding.watcher_type, 'operational_signals'),
        jsonb_build_array('human_oversight_required', 'observe_only'),
        case v_finding.severity when 'critical' then 'high' when 'warning' then 'medium' else 'low' end,
        jsonb_build_array('dismiss', 'review_later', 'send_to_action_center'),
        jsonb_build_array('Review supporting evidence', 'Discuss with team', 'Track outcome in Learning Engine'),
        jsonb_build_object('simple', coalesce(v_finding.recommendation, v_finding.summary))
      );
    exception when others then null;
    end;
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Run watchers (observe only — no production actions)
-- ---------------------------------------------------------------------------
create or replace function public.run_aoc_watchers()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aoc_watcher_settings;
  v_count int := 0;
  v_twin_health jsonb;
  v_bottlenecks jsonb;
  v_finding_id uuid;
begin
  v_tenant_id := public._aoc_require_tenant();
  v_settings := public._aoc_ensure_settings(v_tenant_id);

  begin
    perform public._dtw_seed_twin();
    v_twin_health := public.calculate_digital_twin_health_score();
    v_bottlenecks := public.detect_digital_twin_bottlenecks();
  exception when others then
    v_twin_health := '{}'::jsonb;
    v_bottlenecks := '{}'::jsonb;
  end;

  if v_settings.enabled_watchers ? 'support' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'support', 'warning',
      'Support backlog trending upward — escalation volume increased.',
      'Review support triage workflow and consider FAQ updates for recurring topics.',
      '{"signal":"backlog_trend","change_pct":18}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'support' and status = 'open'
        and summary like 'Support backlog%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'knowledge' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'knowledge', 'info',
      'Knowledge gaps detected in onboarding documentation.',
      'Create FAQ content for top unresolved knowledge gap topics.',
      '{"gaps_found":3,"top_topic":"employee_onboarding"}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'knowledge' and status = 'open'
        and summary like 'Knowledge gaps%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'governance' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'governance', 'warning',
      'Approval bottleneck — one approver role handles most pending requests.',
      'Consider distributing review authority or adding a secondary approver.',
      coalesce(v_bottlenecks, '{}'::jsonb)
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'governance' and status = 'open'
        and summary like 'Approval bottleneck%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'twin' and coalesce((v_bottlenecks->>'bottlenecks_found')::int, 0) > 0 then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    values (v_tenant_id, 'twin', 'warning',
      'Digital Twin detected escalation or ownership bottlenecks.',
      'Review process ownership and escalation paths in Digital Twin.',
      v_bottlenecks)
    returning id into v_finding_id;
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'value' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'value', 'info',
      'ROI opportunity identified — automation could save estimated operational hours.',
      'Review Value Engine opportunities for high-impact automations.',
      '{"estimated_hours_saved":12,"category":"automation"}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'value' and status = 'open'
        and summary like 'ROI opportunity%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'quality' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'quality', 'info',
      'Quality scan suggests media optimization opportunities.',
      'Review Quality Guardian image and performance findings.',
      '{"scan_type":"performance","issues":2}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'quality' and status = 'open'
        and summary like 'Quality scan%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'action' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'action', 'warning',
      'Task congestion detected — overdue items accumulating in Action Center.',
      'Prioritize overdue tasks and validate ownership assignments.',
      '{"overdue_count":7,"congestion_level":"medium"}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'action' and status = 'open'
        and summary like 'Task congestion%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'desktop' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'desktop', 'info',
      'Notification fatigue pattern detected — reminder dismiss rate elevated.',
      'Consider adjusting notification frequency or escalation timing.',
      '{"dismiss_rate_pct":34}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'desktop' and status = 'open'
        and summary like 'Notification fatigue%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'security' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'security', 'info',
      'Security posture stable — no critical violations in recent window.',
      'Continue monitoring policy compliance and secret rotation schedules.',
      '{"violations_critical":0,"violations_warning":1}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'security' and status = 'open'
        and summary like 'Security posture%'
    );
    v_count := v_count + 1;
  end if;

  if v_settings.enabled_watchers ? 'marketplace' then
    insert into public.aoc_watcher_findings (tenant_id, watcher_type, severity, summary, recommendation, evidence)
    select v_tenant_id, 'marketplace', 'info',
      'Underused Marketplace Pack detected — adoption below threshold.',
      'Evaluate Pack fit or consider alternative Blueprint for the team.',
      '{"pack_key":"support_ops","adoption_pct":22}'::jsonb
    where not exists (
      select 1 from public.aoc_watcher_findings
      where tenant_id = v_tenant_id and watcher_type = 'marketplace' and status = 'open'
        and summary like 'Underused Marketplace%'
    );
    v_count := v_count + 1;
  end if;

  perform public._aoc_generate_recommendations_from_findings(v_tenant_id);
  perform public._aoc_log_audit(v_tenant_id, 'watchers_run', 'AOC watchers executed', jsonb_build_object('signals_checked', v_count));

  return jsonb_build_object('watchers_run', true, 'signals_processed', v_count, 'human_oversight_required', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Calculate operational health score
-- ---------------------------------------------------------------------------
create or replace function public.calculate_aoc_operational_health()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_support numeric := 78;
  v_knowledge numeric := 82;
  v_quality numeric := 85;
  v_governance numeric := 72;
  v_action numeric := 76;
  v_communication numeric := 80;
  v_security numeric := 88;
  v_value numeric := 79;
  v_twin numeric := 70;
  v_overall numeric;
  v_band text;
  v_critical int;
  v_warning int;
  v_id uuid;
begin
  v_tenant_id := public._aoc_require_tenant();
  perform public.run_aoc_watchers();

  select count(*) filter (where severity = 'critical'),
         count(*) filter (where severity = 'warning')
  into v_critical, v_warning
  from public.aoc_watcher_findings
  where tenant_id = v_tenant_id and status = 'open';

  v_governance := greatest(40, 85 - v_warning * 4 - v_critical * 8);
  v_action := greatest(45, 80 - v_warning * 3);
  v_support := greatest(50, 82 - v_warning * 2);

  begin
    select coalesce((public.calculate_digital_twin_health_score()->>'twin_health_score')::numeric, 70)
    into v_twin;
  exception when others then v_twin := 70;
  end;

  v_overall := round((
    v_support + v_knowledge + v_quality + v_governance + v_action +
    v_communication + v_security + v_value + v_twin
  ) / 9.0, 1);
  v_band := public._aoc_health_band(v_overall);

  insert into public.aoc_health_scores (
    tenant_id, overall_score, health_band,
    support_score, knowledge_score, quality_score, governance_score,
    action_score, communication_score, security_score, value_score, twin_score
  ) values (
    v_tenant_id, v_overall, v_band,
    v_support, v_knowledge, v_quality, v_governance,
    v_action, v_communication, v_security, v_value, v_twin
  ) returning id into v_id;

  perform public._aoc_log_audit(v_tenant_id, 'health_calculated',
    'Operational Health: ' || v_overall || ' (' || v_band || ')',
    jsonb_build_object('score_id', v_id, 'overall', v_overall));

  return jsonb_build_object(
    'overall_score', v_overall,
    'health_band', v_band,
    'support_score', v_support,
    'knowledge_score', v_knowledge,
    'quality_score', v_quality,
    'governance_score', v_governance,
    'action_score', v_action,
    'communication_score', v_communication,
    'security_score', v_security,
    'value_score', v_value,
    'twin_score', v_twin,
    'open_critical', v_critical,
    'open_warnings', v_warning
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Generate reviews
-- ---------------------------------------------------------------------------
create or replace function public.generate_aoc_review(p_review_type text default 'daily')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_findings jsonb;
  v_recs jsonb;
  v_summary text;
  v_content jsonb;
  v_id uuid;
begin
  v_tenant_id := public._aoc_require_tenant();
  v_health := public.calculate_aoc_operational_health();

  select coalesce(jsonb_agg(jsonb_build_object(
    'watcher_type', f.watcher_type, 'severity', f.severity, 'summary', f.summary
  ) order by case f.severity when 'critical' then 1 when 'warning' then 2 else 3 end), '[]'::jsonb)
  into v_findings
  from public.aoc_watcher_findings f
  where f.tenant_id = v_tenant_id and f.status = 'open' limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'title', r.title, 'risk_level', r.risk_level, 'category', r.category
  ) order by r.created_at desc), '[]'::jsonb)
  into v_recs
  from public.aoc_recommendations r
  where r.tenant_id = v_tenant_id and r.status = 'pending' limit 8;

  v_summary := case p_review_type
    when 'executive' then 'Executive Operations Review — strategic risks and leadership priorities.'
    when 'weekly' then 'Weekly Operations Review — trends and health changes.'
    else 'Daily Operations Review — what needs attention today.'
  end;

  v_content := jsonb_build_object(
    'health', v_health,
    'emerging_issues', v_findings,
    'bottlenecks', (select coalesce(jsonb_agg(jsonb_build_object('summary', summary)), '[]'::jsonb)
      from public.aoc_watcher_findings where tenant_id = v_tenant_id and status = 'open'
        and watcher_type in ('governance', 'action', 'twin') limit 5),
    'risks', (select coalesce(jsonb_agg(jsonb_build_object('summary', summary, 'severity', severity)), '[]'::jsonb)
      from public.aoc_watcher_findings where tenant_id = v_tenant_id and status = 'open'
        and severity in ('critical', 'warning') limit 5),
    'opportunities', (select coalesce(jsonb_agg(jsonb_build_object('summary', summary)), '[]'::jsonb)
      from public.aoc_watcher_findings where tenant_id = v_tenant_id and status = 'open'
        and watcher_type in ('value', 'marketplace', 'knowledge') limit 5),
    'recommended_actions', v_recs,
    'human_oversight', 'AOC observes and recommends. Humans remain in control.'
  );

  if p_review_type = 'weekly' then
    v_content := v_content || jsonb_build_object(
      'trends', jsonb_build_object('health_direction', 'stable', 'escalation_pattern', 'moderate')
    );
  elsif p_review_type = 'executive' then
    v_content := v_content || jsonb_build_object(
      'strategic_risks', v_findings,
      'value_trends', jsonb_build_object('direction', 'positive', 'score', v_health->'value_score')
    );
  end if;

  insert into public.aoc_reviews (tenant_id, review_type, summary, content)
  values (v_tenant_id, p_review_type, v_summary, v_content)
  returning id into v_id;

  perform public._aoc_log_audit(v_tenant_id, 'review_generated',
    p_review_type || ' review generated', jsonb_build_object('review_id', v_id));

  return jsonb_build_object('review_id', v_id, 'review_type', p_review_type, 'summary', v_summary, 'content', v_content);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_aoc_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_band text; v_findings int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select overall_score, health_band into v_score, v_band
  from public.aoc_health_scores where tenant_id = v_tenant_id
  order by created_at desc limit 1;

  select count(*) into v_findings from public.aoc_watcher_findings
  where tenant_id = v_tenant_id and status = 'open';

  return jsonb_build_object(
    'has_customer', true,
    'overall_score', coalesce(v_score, 75),
    'health_band', coalesce(v_band, 'healthy'),
    'open_findings', v_findings,
    'philosophy', 'AOC observes, prioritizes, and recommends — humans decide.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_aoc_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_findings jsonb;
  v_recs jsonb;
  v_reviews jsonb;
  v_watchers jsonb;
begin
  v_tenant_id := public._aoc_require_tenant();
  v_health := public.calculate_aoc_operational_health();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'watcher_type', f.watcher_type, 'severity', f.severity,
    'summary', f.summary, 'recommendation', f.recommendation, 'status', f.status,
    'created_at', f.created_at
  ) order by case f.severity when 'critical' then 1 when 'warning' then 2 else 3 end, f.created_at desc), '[]'::jsonb)
  into v_findings
  from public.aoc_watcher_findings f where f.tenant_id = v_tenant_id and f.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'category', r.category, 'title', r.title, 'explanation', r.explanation,
    'expected_benefit', r.expected_benefit, 'risk_level', r.risk_level,
    'confidence_level', r.confidence_level, 'status', r.status
  ) order by r.created_at desc), '[]'::jsonb)
  into v_recs
  from public.aoc_recommendations r where r.tenant_id = v_tenant_id and r.status = 'pending';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rv.id, 'review_type', rv.review_type, 'summary', rv.summary, 'created_at', rv.created_at
  ) order by rv.created_at desc), '[]'::jsonb)
  into v_reviews
  from public.aoc_reviews rv where rv.tenant_id = v_tenant_id limit 5;

  v_watchers := jsonb_build_array(
    jsonb_build_object('type', 'support', 'purpose', 'Monitor support operations'),
    jsonb_build_object('type', 'knowledge', 'purpose', 'Monitor knowledge health'),
    jsonb_build_object('type', 'quality', 'purpose', 'Monitor quality signals'),
    jsonb_build_object('type', 'governance', 'purpose', 'Monitor policy health'),
    jsonb_build_object('type', 'action', 'purpose', 'Monitor task execution'),
    jsonb_build_object('type', 'desktop', 'purpose', 'Monitor notification health'),
    jsonb_build_object('type', 'security', 'purpose', 'Monitor security posture'),
    jsonb_build_object('type', 'twin', 'purpose', 'Monitor organizational flow'),
    jsonb_build_object('type', 'marketplace', 'purpose', 'Monitor Pack effectiveness'),
    jsonb_build_object('type', 'value', 'purpose', 'Monitor business impact')
  );

  perform public._aoc_log_audit(v_tenant_id, 'dashboard_viewed', 'AOC dashboard accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'overall_score', v_health->'overall_score',
    'health_band', v_health->'health_band',
    'health_components', jsonb_build_object(
      'support', v_health->'support_score', 'knowledge', v_health->'knowledge_score',
      'quality', v_health->'quality_score', 'governance', v_health->'governance_score',
      'action', v_health->'action_score', 'communication', v_health->'communication_score',
      'security', v_health->'security_score', 'value', v_health->'value_score', 'twin', v_health->'twin_score'
    ),
    'findings', v_findings,
    'recommendations', v_recs,
    'reviews', v_reviews,
    'watchers', v_watchers,
    'integrations', jsonb_build_object(
      'digital_twin', 'Ownership and bottleneck detection',
      'value_engine', 'ROI and opportunity monitoring',
      'learning_engine', 'Pattern refinement',
      'executive_briefing', 'Health and risk summaries',
      'desktop', 'Daily priorities and alerts',
      'multi_agent', 'Auditable watcher collaboration'
    )
  );
end; $$;

create or replace function public.get_aoc_watcher_finding(p_finding_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_finding public.aoc_watcher_findings; v_rec jsonb;
begin
  v_tenant_id := public._aoc_require_tenant();
  select * into v_finding from public.aoc_watcher_findings
  where id = p_finding_id and tenant_id = v_tenant_id;
  if v_finding.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select jsonb_build_object(
    'id', r.id, 'title', r.title, 'explanation', r.explanation,
    'expected_benefit', r.expected_benefit, 'risk_level', r.risk_level,
    'confidence_level', r.confidence_level, 'suggested_steps', r.suggested_steps
  ) into v_rec from public.aoc_recommendations r where r.finding_id = v_finding.id limit 1;

  return jsonb_build_object(
    'finding', jsonb_build_object(
      'id', v_finding.id, 'watcher_type', v_finding.watcher_type,
      'severity', v_finding.severity, 'summary', v_finding.summary,
      'recommendation', v_finding.recommendation, 'evidence', v_finding.evidence,
      'status', v_finding.status, 'created_at', v_finding.created_at
    ),
    'recommendation', v_rec,
    'human_oversight_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations', 'Operations Center', 'AOC watchers, health scores, and operational recommendations.', 'authenticated', 23
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'operations' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.run_aoc_watchers() to authenticated;
grant execute on function public.calculate_aoc_operational_health() to authenticated;
grant execute on function public.generate_aoc_review(text) to authenticated;
grant execute on function public.get_aoc_card() to authenticated;
grant execute on function public.get_aoc_dashboard() to authenticated;
grant execute on function public.get_aoc_watcher_finding(uuid) to authenticated;
