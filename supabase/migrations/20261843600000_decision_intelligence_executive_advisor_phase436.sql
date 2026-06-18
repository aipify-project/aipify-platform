-- Phase 436 — Decision Intelligence & Executive Advisor (Customer App)
-- Route: /app/intelligence/decisions · Builds on Phase 125 decision intelligence permissions

create table if not exists public.decision_intelligence_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  option_analysis_enabled boolean not null default true,
  outcome_tracking_enabled boolean not null default true,
  executive_briefings_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.decision_intelligence_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'active_decisions', 'recommended_decisions', 'strategic_reviews',
    'risk_analysis', 'decision_history', 'outcome_tracking'
  )),
  title text not null,
  description text not null default '' check (char_length(description) <= 500),
  owner_label text not null default '',
  business_area text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status_key text not null default 'waiting' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified'
  )),
  reasoning text not null default '',
  decision_date date,
  outcome_summary text not null default '',
  expected_result text not null default '',
  actual_result text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decision_intelligence_decisions_org_idx
  on public.decision_intelligence_decisions (organization_id, section_key, status_key, updated_at desc);

create table if not exists public.decision_intelligence_options (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_id uuid not null references public.decision_intelligence_decisions (id) on delete cascade,
  option_key text not null check (option_key in ('option_a', 'option_b', 'option_c')),
  label text not null,
  benefits text not null default '',
  risks text not null default '',
  cost_label text not null default '',
  complexity text not null default 'medium',
  expected_outcome text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists decision_intelligence_options_decision_idx
  on public.decision_intelligence_options (decision_id, option_key);

create table if not exists public.decision_intelligence_advisor (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_id uuid references public.decision_intelligence_decisions (id) on delete set null,
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  supporting_evidence text not null default '',
  confidence_level text not null default 'moderate' check (confidence_level in ('low', 'moderate', 'high')),
  potential_risks text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decision_intelligence_advisor_org_idx
  on public.decision_intelligence_advisor (organization_id, status, created_at desc);

create table if not exists public.decision_intelligence_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_category text not null check (risk_category in (
    'operational', 'financial', 'customer', 'vendor', 'security'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'requires_attention',
  suggested_action text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decision_intelligence_risks_org_idx
  on public.decision_intelligence_risks (organization_id, resolved, updated_at desc);

create table if not exists public.decision_intelligence_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_type text not null check (briefing_type in ('morning', 'weekly', 'monthly')),
  title text not null,
  what_changed text not null default '',
  requires_attention text not null default '',
  recommended_actions text not null default '',
  generated_at timestamptz not null default now()
);

create index if not exists decision_intelligence_briefings_org_idx
  on public.decision_intelligence_briefings (organization_id, briefing_type, generated_at desc);

create table if not exists public.decision_intelligence_center_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists decision_intelligence_center_audit_org_idx
  on public.decision_intelligence_center_audit (organization_id, created_at desc);

alter table public.decision_intelligence_center_settings enable row level security;
alter table public.decision_intelligence_decisions enable row level security;
alter table public.decision_intelligence_options enable row level security;
alter table public.decision_intelligence_advisor enable row level security;
alter table public.decision_intelligence_risks enable row level security;
alter table public.decision_intelligence_briefings enable row level security;
alter table public.decision_intelligence_center_audit enable row level security;
revoke all on public.decision_intelligence_center_settings from authenticated, anon;
revoke all on public.decision_intelligence_decisions from authenticated, anon;
revoke all on public.decision_intelligence_options from authenticated, anon;
revoke all on public.decision_intelligence_advisor from authenticated, anon;
revoke all on public.decision_intelligence_risks from authenticated, anon;
revoke all on public.decision_intelligence_briefings from authenticated, anon;
revoke all on public.decision_intelligence_center_audit from authenticated, anon;

create or replace function public._dic436_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('decision_intelligence.manage', v_org_id),
    'can_manage', public._irp_has_permission('decision_intelligence.manage', v_org_id),
    'can_view', public._irp_has_permission('decision_intelligence.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._dic436_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.decision_intelligence_center_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._dic436_decision_json(d public.decision_intelligence_decisions)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', d.id, 'title', d.title, 'description', d.description, 'owner', d.owner_label,
    'business_area', d.business_area, 'priority', d.priority, 'status_key', d.status_key,
    'section_key', d.section_key, 'reasoning', d.reasoning, 'decision_date', d.decision_date,
    'outcome_summary', d.outcome_summary, 'expected_result', d.expected_result,
    'actual_result', d.actual_result, 'item_type', 'decision'
  );
$$;

create or replace function public._dic436_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_decision_id uuid; v_launch_id uuid;
begin
  insert into public.decision_intelligence_center_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.decision_intelligence_decisions where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.decision_intelligence_decisions (
    organization_id, section_key, title, description, owner_label, business_area,
    priority, status_key, reasoning
  ) values (
    p_org_id, 'active_decisions', 'Expand Growth Partner recruitment',
    'Evaluate expanding the Growth Partner program to new regions.',
    'CEO', 'Growth', 'high', 'requires_attention',
    'Partner-generated revenue increased 34% during the last quarter.'
  ) returning id into v_decision_id;

  insert into public.decision_intelligence_options (
    organization_id, decision_id, option_key, label, benefits, risks, cost_label, complexity, expected_outcome
  ) values
    (p_org_id, v_decision_id, 'option_a', 'Expand recruitment now',
     'Faster partner pipeline and regional coverage.', 'Onboarding capacity strain.', 'Medium', 'medium',
     'Partner revenue +15–20% within two quarters.'),
    (p_org_id, v_decision_id, 'option_b', 'Pilot in one region first',
     'Lower risk with measurable pilot outcomes.', 'Slower national expansion.', 'Low', 'low',
     'Validated playbook before scale.'),
    (p_org_id, v_decision_id, 'option_c', 'Maintain current pace',
     'Stable operations and predictable workload.', 'Missed growth window.', 'Minimal', 'low',
     'Incremental partner growth only.');

  insert into public.decision_intelligence_advisor (
    organization_id, decision_id, recommendation, reason, supporting_evidence,
    confidence_level, potential_risks
  ) values (
    p_org_id, v_decision_id, 'Expand Growth Partner recruitment.',
    'Partner-generated revenue increased 34% during the last quarter.',
    'Quarterly partner revenue trend +34%; onboarding capacity available in Q3.',
    'high', 'Onboarding bandwidth and partner quality control during rapid expansion.'
  );

  insert into public.decision_intelligence_decisions (
    organization_id, section_key, title, description, owner_label, business_area,
    priority, status_key
  ) values
    (p_org_id, 'recommended_decisions', 'Review customer concentration', 'Top three customers represent increasing revenue share.', 'CFO', 'Finance', 'high', 'requires_attention'),
    (p_org_id, 'strategic_reviews', 'Quarterly strategic review — Q2', 'Review revenue, customers, growth, operations, support, and retention.', 'Executive Team', 'Executive', 'high', 'waiting');

  insert into public.decision_intelligence_decisions (
    organization_id, section_key, title, description, owner_label, business_area,
    priority, status_key, reasoning, decision_date, outcome_summary, expected_result, actual_result
  ) values (
    p_org_id, 'decision_history', 'Launch Business Pack', 'Approved launch of Business Pack module.',
    'Product Lead', 'Product', 'medium', 'completed',
    'Market demand validated through pilot customers.', current_date - 120,
    'Revenue increased 18%', '10% revenue growth', '12.4% revenue growth'
  );

  insert into public.decision_intelligence_decisions (
    organization_id, section_key, title, description, owner_label, business_area,
    priority, status_key, expected_result, actual_result, outcome_summary
  ) values (
    p_org_id, 'outcome_tracking', 'Business Pack launch outcome',
    'Track expected vs actual revenue impact from Business Pack launch.',
    'Product Lead', 'Product', 'medium', 'completed',
    '10% revenue growth', '12.4% revenue growth', 'Outcome exceeded expectation by 2.4 points.'
  ) returning id into v_launch_id;

  insert into public.decision_intelligence_risks (
    organization_id, risk_category, title, summary, status_key, suggested_action
  ) values
    (p_org_id, 'customer', 'Customer concentration risk increasing', 'Top three customers represent a growing share of revenue.', 'requires_attention', 'Diversify customer acquisition channels.'),
    (p_org_id, 'operational', 'Support capacity during growth', 'Support volume may exceed capacity during partner expansion.', 'waiting', 'Review staffing plan before Q3 expansion.'),
    (p_org_id, 'vendor', 'Critical vendor renewal window', 'Hosting vendor contract enters renewal period.', 'requires_attention', 'Begin renewal negotiation early.'),
    (p_org_id, 'financial', 'Cash flow sensitivity', 'Expansion investment may affect short-term cash flow.', 'information', 'Model cash scenarios before approval.'),
    (p_org_id, 'security', 'Partner access governance', 'New partners require consistent access review.', 'waiting', 'Align with permission access governance review.');

  insert into public.decision_intelligence_briefings (
    organization_id, briefing_type, title, what_changed, requires_attention, recommended_actions
  ) values
    (p_org_id, 'morning', 'Morning executive briefing',
     'Partner revenue trend up 34%. Two active decisions require review.',
     'Customer concentration risk flagged. Growth Partner expansion decision pending.',
     'Review option analysis for partner expansion. Schedule customer diversification review.'),
    (p_org_id, 'weekly', 'Weekly executive briefing',
     'Business Pack outcome exceeded target. Support volume stable.',
     'Vendor renewal and customer concentration require attention this week.',
     'Complete strategic review prep. Acknowledge advisor recommendation or request more evidence.'),
    (p_org_id, 'monthly', 'Monthly executive briefing',
     'Revenue growth 12.4% vs 10% target. Retention stable.',
     'Operational capacity planning for Q3 expansion.',
     'Finalize quarterly strategic review. Update outcome tracking for active initiatives.');
end; $$;

create or replace function public.get_decision_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_active jsonb; v_recommended jsonb; v_reviews jsonb; v_history jsonb; v_outcomes jsonb;
  v_risks jsonb; v_advisor jsonb; v_briefings jsonb; v_options jsonb;
begin
  perform public._irp_require_permission('decision_intelligence.view');
  v_ctx := public._dic436_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._dic436_seed(v_org_id);

  select coalesce(jsonb_agg(public._dic436_decision_json(d) order by d.updated_at desc), '[]'::jsonb)
  into v_active from public.decision_intelligence_decisions d
  where d.organization_id = v_org_id and d.section_key = 'active_decisions';

  select coalesce(jsonb_agg(public._dic436_decision_json(d) order by d.priority desc), '[]'::jsonb)
  into v_recommended from public.decision_intelligence_decisions d
  where d.organization_id = v_org_id and d.section_key = 'recommended_decisions';

  select coalesce(jsonb_agg(public._dic436_decision_json(d) order by d.updated_at desc), '[]'::jsonb)
  into v_reviews from public.decision_intelligence_decisions d
  where d.organization_id = v_org_id and d.section_key = 'strategic_reviews';

  select coalesce(jsonb_agg(public._dic436_decision_json(d) order by d.decision_date desc nulls last), '[]'::jsonb)
  into v_history from public.decision_intelligence_decisions d
  where d.organization_id = v_org_id and d.section_key = 'decision_history';

  select coalesce(jsonb_agg(public._dic436_decision_json(d) order by d.updated_at desc), '[]'::jsonb)
  into v_outcomes from public.decision_intelligence_decisions d
  where d.organization_id = v_org_id and d.section_key = 'outcome_tracking';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_category', r.risk_category, 'title', r.title, 'summary', r.summary,
    'status_key', r.status_key, 'suggested_action', r.suggested_action, 'item_type', 'risk'
  ) order by r.created_at desc), '[]'::jsonb)
  into v_risks from public.decision_intelligence_risks r
  where r.organization_id = v_org_id and not r.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'decision_id', a.decision_id, 'recommendation', a.recommendation,
    'reason', a.reason, 'supporting_evidence', a.supporting_evidence,
    'confidence_level', a.confidence_level, 'potential_risks', a.potential_risks,
    'status', a.status, 'item_type', 'advisor'
  ) order by a.created_at desc), '[]'::jsonb)
  into v_advisor from public.decision_intelligence_advisor a
  where a.organization_id = v_org_id and a.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'briefing_type', b.briefing_type, 'title', b.title,
    'what_changed', b.what_changed, 'requires_attention', b.requires_attention,
    'recommended_actions', b.recommended_actions, 'generated_at', b.generated_at,
    'item_type', 'briefing'
  ) order by b.generated_at desc), '[]'::jsonb)
  into v_briefings from public.decision_intelligence_briefings b
  where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'decision_id', o.decision_id, 'option_key', o.option_key, 'label', o.label,
    'benefits', o.benefits, 'risks', o.risks, 'cost_label', o.cost_label,
    'complexity', o.complexity, 'expected_outcome', o.expected_outcome, 'item_type', 'option'
  ) order by o.option_key), '[]'::jsonb)
  into v_options from public.decision_intelligence_options o
  where o.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most organizations do not suffer from lack of data — they suffer from lack of decision clarity. Aipify helps leaders decide with evidence.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All recommendations are explainable, evidence-backed, and auditable — no hidden reasoning.',
    'sections', jsonb_build_object(
      'active_decisions', v_active,
      'recommended_decisions', v_recommended,
      'strategic_reviews', v_reviews,
      'risk_analysis', v_risks,
      'decision_history', v_history,
      'outcome_tracking', v_outcomes
    ),
    'option_analysis', v_options,
    'executive_advisor', v_advisor,
    'executive_briefings', v_briefings,
    'statistics', jsonb_build_object(
      'active_count', jsonb_array_length(v_active),
      'recommended_count', jsonb_array_length(v_recommended),
      'review_count', jsonb_array_length(v_reviews),
      'risk_count', jsonb_array_length(v_risks),
      'history_count', jsonb_array_length(v_history),
      'outcome_count', jsonb_array_length(v_outcomes),
      'advisor_count', jsonb_array_length(v_advisor)
    ),
    'privacy_note', 'Metadata and decision patterns only — humans retain final authority on every decision.'
  );
end; $$;

create or replace function public.manage_decision_intelligence_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._dic436_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'complete', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'advisor' then
    update public.decision_intelligence_advisor set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'decision' then
    update public.decision_intelligence_decisions set
      status_key = case p_action when 'complete' then 'completed' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'risk' then
    update public.decision_intelligence_risks set
      resolved = p_action in ('resolve', 'dismiss'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._dic436_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Decision intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_decision_intelligence_center() to authenticated;
grant execute on function public.manage_decision_intelligence_item(text, uuid, text) to authenticated;
