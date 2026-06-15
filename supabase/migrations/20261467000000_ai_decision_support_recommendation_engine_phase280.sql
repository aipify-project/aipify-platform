-- Phase 280 — AI Decision Support & Recommendation Engine (Platform Admin)

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.platform_decision_recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null check (
    category in (
      'customer_success', 'revenue_growth', 'product_improvements', 'support_optimization',
      'operational_efficiency', 'security_awareness', 'governance_improvements'
    )
  ),
  impact_level text not null default 'medium' check (
    impact_level in ('low', 'medium', 'high', 'strategic')
  ),
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  status text not null default 'new' check (
    status in ('new', 'under_review', 'accepted', 'implemented', 'dismissed')
  ),
  recommended_actions jsonb not null default '[]'::jsonb,
  owner text not null default '',
  note text not null default '',
  roadmap_link text not null default '',
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_decision_recommendations_status_idx
  on public.platform_decision_recommendations (status, impact_level desc);

create index if not exists platform_decision_recommendations_category_idx
  on public.platform_decision_recommendations (category, confidence_score desc);

create table if not exists public.platform_decision_tasks (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references public.platform_decision_recommendations (id) on delete cascade,
  title text not null,
  owner text not null default '',
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists platform_decision_tasks_rec_idx
  on public.platform_decision_tasks (recommendation_id);

create table if not exists public.platform_decision_audit_logs (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid references public.platform_decision_recommendations (id) on delete set null,
  event_type text not null check (
    event_type in (
      'recommendation_generated', 'recommendation_reviewed', 'recommendation_accepted',
      'recommendation_dismissed', 'task_created'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_decision_audit_created_idx
  on public.platform_decision_audit_logs (created_at desc);

alter table public.platform_decision_recommendations enable row level security;
alter table public.platform_decision_tasks enable row level security;
alter table public.platform_decision_audit_logs enable row level security;

revoke all on public.platform_decision_recommendations from authenticated, anon;
revoke all on public.platform_decision_tasks from authenticated, anon;
revoke all on public.platform_decision_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pdc280_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._pdc280_log_audit(
  p_recommendation_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.platform_decision_audit_logs (recommendation_id, event_type, summary, context)
  values (p_recommendation_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._pdc280_build_recommendation_row(p_rec public.platform_decision_recommendations)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tasks jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id,
    'title', t.title,
    'owner', t.owner,
    'status', t.status,
    'created_at', t.created_at
  ) order by t.created_at desc), '[]'::jsonb)
  into v_tasks
  from public.platform_decision_tasks t
  where t.recommendation_id = p_rec.id;

  return jsonb_build_object(
    'id', p_rec.id,
    'title', p_rec.title,
    'description', p_rec.description,
    'category', p_rec.category,
    'impact_level', p_rec.impact_level,
    'confidence_score', p_rec.confidence_score,
    'status', p_rec.status,
    'recommended_actions', p_rec.recommended_actions,
    'owner', p_rec.owner,
    'note', p_rec.note,
    'roadmap_link', p_rec.roadmap_link,
    'generated_at', p_rec.generated_at,
    'updated_at', p_rec.updated_at,
    'tasks', v_tasks
  );
end;
$$;

create or replace function public._pdc280_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.platform_decision_recommendations limit 1) then return; end if;

  insert into public.platform_decision_recommendations (
    title, description, category, impact_level, confidence_score, status, recommended_actions
  ) values
    (
      'Customer health declining — Unonight pilot',
      'Health score dropped 12 points over 30 days. Proactive success intervention recommended.',
      'customer_success', 'high', 91, 'new',
      '["Offer onboarding assistance", "Schedule executive review", "Recommend additional training"]'::jsonb
    ),
    (
      'Enterprise expansion opportunity — NordTech AS',
      'Usage patterns indicate readiness for Business plan modules and multi-install rollout.',
      'revenue_growth', 'strategic', 84, 'under_review',
      '["Schedule expansion review", "Prepare enterprise proposal", "Assign Growth Partner follow-up"]'::jsonb
    ),
    (
      'Feature requested by multiple customers',
      'Customer Journey Analytics export enhancements requested by 5 enterprise tenants.',
      'product_improvements', 'high', 78, 'new',
      '["Prioritize roadmap item", "Link to Roadmap Center", "Validate with product owner"]'::jsonb
    ),
    (
      'Recurring support issue — payment webhook retries',
      '17 support cases in 30 days on webhook retry behavior. Self-service gap identified.',
      'support_optimization', 'medium', 72, 'under_review',
      '["Increase self-service documentation", "Create automation opportunity", "Update response templates"]'::jsonb
    ),
    (
      'Enable mandatory 2FA for platform admins',
      'Two platform admin accounts have not enabled 2FA. Security governance review advised.',
      'security_awareness', 'high', 88, 'new',
      '["Enable mandatory 2FA", "Review privileged accounts", "Investigate unusual activity"]'::jsonb
    ),
    (
      'Overdue policy review — billing grace period',
      'Billing & License Grace Period Policy review date passed. Compliance Center flag active.',
      'governance_improvements', 'medium', 76, 'new',
      '["Update governance policies", "Assign policy owner", "Schedule compliance review"]'::jsonb
    ),
    (
      'Renewal intervention recommended — Q3 cohort',
      '3 enterprise renewals within 45 days show declining engagement signals.',
      'revenue_growth', 'high', 69, 'new',
      '["Renewal intervention recommended", "Assign customer success owner", "Prepare retention playbook"]'::jsonb
    ),
    (
      'Improve onboarding flow for Growth Partners',
      'Partner certification completion rate below target. Operational efficiency opportunity.',
      'operational_efficiency', 'medium', 54, 'dismissed',
      '["Review partner onboarding checklist", "Reduce setup steps", "Add guided walkthrough"]'::jsonb
    ),
    (
      'Knowledge article required — SSO troubleshooting',
      'Low resolution effectiveness on Enterprise SSO documentation. Knowledge Evolution gap linked.',
      'product_improvements', 'medium', 81, 'accepted',
      '["Create knowledge article", "Expand troubleshooting steps", "Add localization"]'::jsonb
    );

  insert into public.platform_decision_audit_logs (event_type, summary)
  values
    ('recommendation_generated', 'Decision Center initialized with seed recommendations.'),
    ('recommendation_reviewed', 'Executive summary baseline generated.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_decision_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_recommendations jsonb;
  v_audit jsonb;
  v_executive_summary text;
  v_category_filter text;
  v_impact_filter text;
  v_status_filter text;
  v_owner_filter text;
  v_confidence_min integer;
  v_high_impact jsonb;
  v_risks jsonb;
begin
  perform public._pdc280_require_platform_admin();
  perform public._pdc280_seed_if_empty();

  v_category_filter := nullif(p_filters->>'category', '');
  v_impact_filter := nullif(p_filters->>'impact_level', '');
  v_status_filter := nullif(p_filters->>'status', '');
  v_owner_filter := nullif(p_filters->>'owner', '');
  v_confidence_min := nullif(p_filters->>'confidence_min', '')::integer;

  v_overview := jsonb_build_object(
    'recommendations_generated', (select count(*)::int from public.platform_decision_recommendations),
    'recommendations_accepted', (select count(*)::int from public.platform_decision_recommendations where status = 'accepted'),
    'recommendations_declined', (select count(*)::int from public.platform_decision_recommendations where status = 'dismissed'),
    'high_impact_opportunities', (
      select count(*)::int from public.platform_decision_recommendations
      where impact_level in ('high', 'strategic') and status in ('new', 'under_review', 'accepted')
    ),
    'risks_identified', (
      select count(*)::int from public.platform_decision_recommendations
      where category in ('security_awareness', 'governance_improvements')
        and impact_level in ('high', 'strategic')
        and status not in ('dismissed', 'implemented')
    ),
    'pending_reviews', (
      select count(*)::int from public.platform_decision_recommendations
      where status in ('new', 'under_review')
    )
  );

  select coalesce(jsonb_agg(public._pdc280_build_recommendation_row(r) order by r.confidence_score desc), '[]'::jsonb)
  into v_recommendations
  from public.platform_decision_recommendations r
  where (v_category_filter is null or r.category = v_category_filter)
    and (v_impact_filter is null or r.impact_level = v_impact_filter)
    and (v_status_filter is null or r.status = v_status_filter)
    and (v_owner_filter is null or r.owner ilike '%' || v_owner_filter || '%')
    and (v_confidence_min is null or r.confidence_score >= v_confidence_min);

  select coalesce(jsonb_agg(public._pdc280_build_recommendation_row(r) order by r.impact_level desc, r.confidence_score desc), '[]'::jsonb)
  into v_high_impact
  from public.platform_decision_recommendations r
  where r.impact_level in ('high', 'strategic') and r.status in ('new', 'under_review', 'accepted')
  limit 5;

  select coalesce(jsonb_agg(public._pdc280_build_recommendation_row(r) order by r.confidence_score desc), '[]'::jsonb)
  into v_risks
  from public.platform_decision_recommendations r
  where r.category in ('security_awareness', 'governance_improvements')
    and r.status not in ('dismissed', 'implemented')
  limit 5;

  v_executive_summary := 'Based on current data, Aipify has identified the following opportunities and risks.';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'recommendation_id', l.recommendation_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.platform_decision_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Information alone is not enough. The true value of intelligence lies in helping people make better decisions at the right time.',
    'executive_summary', v_executive_summary,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'recommendations', v_recommendations,
    'high_impact', coalesce(v_high_impact, '[]'::jsonb),
    'risks', coalesce(v_risks, '[]'::jsonb),
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_platform_decision_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
begin
  perform public._pdc280_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := (p_payload->>'id')::uuid;

  case v_action
    when 'accept_recommendation' then
      update public.platform_decision_recommendations set
        status = 'accepted',
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_accepted',
        coalesce(p_payload->>'summary', 'Recommendation accepted.'), p_payload
      );

    when 'dismiss_recommendation' then
      update public.platform_decision_recommendations set
        status = 'dismissed',
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_dismissed',
        coalesce(p_payload->>'summary', 'Recommendation dismissed.'), p_payload
      );

    when 'start_review' then
      update public.platform_decision_recommendations set
        status = 'under_review',
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_reviewed',
        coalesce(p_payload->>'summary', 'Recommendation moved to under review.'), p_payload
      );

    when 'mark_implemented' then
      update public.platform_decision_recommendations set
        status = 'implemented',
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_accepted',
        coalesce(p_payload->>'summary', 'Recommendation marked implemented.'), p_payload
      );

    when 'assign_owner' then
      update public.platform_decision_recommendations set
        owner = coalesce(p_payload->>'owner', owner),
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_reviewed',
        format('Owner assigned: %s', coalesce(p_payload->>'owner', '')), p_payload
      );

    when 'add_note' then
      update public.platform_decision_recommendations set
        note = coalesce(p_payload->>'note', note),
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_reviewed',
        'Note added to recommendation.', p_payload
      );

    when 'link_roadmap' then
      update public.platform_decision_recommendations set
        roadmap_link = coalesce(p_payload->>'roadmap_link', roadmap_link),
        updated_at = now()
      where id = v_id;
      perform public._pdc280_log_audit(
        v_id, 'recommendation_reviewed',
        coalesce(p_payload->>'summary', 'Recommendation linked to roadmap.'), p_payload
      );

    when 'create_task' then
      insert into public.platform_decision_tasks (recommendation_id, title, owner)
      values (
        v_id,
        coalesce(p_payload->>'task_title', 'Follow-up task'),
        coalesce(p_payload->>'owner', '')
      );
      perform public._pdc280_log_audit(
        v_id, 'task_created',
        coalesce(p_payload->>'summary', 'Task created from recommendation.'), p_payload
      );

    else
      raise exception 'Invalid action';
  end case;

  return public.get_platform_decision_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_platform_decision_center(jsonb) to authenticated;
grant execute on function public.record_platform_decision_action(jsonb) to authenticated;
