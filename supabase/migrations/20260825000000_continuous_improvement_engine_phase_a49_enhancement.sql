-- Phase A.49 — Continuous Improvement Engine enhancement (extends A.33)
-- Adds improvement initiatives, review cycles, success measurements, org memory hooks, and recommendation RPCs.

-- ---------------------------------------------------------------------------
-- 1. improvement_initiatives
-- ---------------------------------------------------------------------------
create table if not exists public.improvement_initiatives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_title text not null,
  source text not null default 'feedback',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'strategic')),
  status text not null default 'proposed' check (
    status in ('proposed', 'approved', 'in_progress', 'completed', 'deferred', 'rejected')
  ),
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists improvement_initiatives_org_status_idx
  on public.improvement_initiatives (organization_id, status, priority, created_at desc);

alter table public.improvement_initiatives enable row level security;
revoke all on public.improvement_initiatives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. improvement_review_cycles
-- ---------------------------------------------------------------------------
create table if not exists public.improvement_review_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.improvement_initiatives (id) on delete cascade,
  cycle_number int not null default 1,
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'in_review', 'completed', 'skipped')
  ),
  findings_summary text,
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists improvement_review_cycles_initiative_idx
  on public.improvement_review_cycles (initiative_id, cycle_number);

alter table public.improvement_review_cycles enable row level security;
revoke all on public.improvement_review_cycles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. improvement_success_measurements
-- ---------------------------------------------------------------------------
create table if not exists public.improvement_success_measurements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.improvement_initiatives (id) on delete cascade,
  metric_key text not null,
  baseline_value numeric not null default 0,
  current_value numeric not null default 0,
  improvement_percentage numeric not null default 0,
  measured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists improvement_success_measurements_initiative_idx
  on public.improvement_success_measurements (initiative_id, measured_at desc);

alter table public.improvement_success_measurements enable row level security;
revoke all on public.improvement_success_measurements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. improvement_memory_links (Organizational Memory A.34 hooks — metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.improvement_memory_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.improvement_initiatives (id) on delete cascade,
  memory_entry_id uuid,
  link_type text not null default 'decision_context' check (
    link_type in ('decision_context', 'lesson_learned', 'outcome_record')
  ),
  metadata jsonb not null default '{}'::jsonb,
  linked_by uuid references public.users (id) on delete set null,
  linked_at timestamptz not null default now()
);

create index if not exists improvement_memory_links_initiative_idx
  on public.improvement_memory_links (initiative_id, linked_at desc);

alter table public.improvement_memory_links enable row level security;
revoke all on public.improvement_memory_links from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. improvements.review permission
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'continuous_improvement', v.description
from (values
  ('improvements.review', 'Review Improvements', 'Review improvement initiatives and success measurements')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'improvements.review'),
  ('administrator', 'improvements.review'),
  ('manager', 'improvements.review')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cie_memory_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organizational_memory_entries' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'linked_initiatives', coalesce((
      select count(distinct initiative_id) from public.improvement_memory_links
      where organization_id = p_organization_id
    ), 0),
    'memory_entries', coalesce((
      select count(*) from public.organizational_memory_entries
      where organization_id = p_organization_id and status != 'archived'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cie_seed_initiatives(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.improvement_initiatives (organization_id, initiative_title, source, priority, status, description)
  select p_organization_id, v.title, v.src, v.pri, v.status, v.desc
  from (values
    ('Reduce support escalation friction', 'quality_guardian', 'high', 'proposed', 'Review escalation patterns and propose workflow refinements'),
    ('Accelerate module adoption onboarding', 'customer_success', 'strategic', 'approved', 'Low adoption scores suggest guided onboarding improvements'),
    ('Expand Knowledge Center coverage', 'user_feedback', 'medium', 'in_progress', 'Recurring support topics indicate documentation gaps')
  ) as v(title, src, pri, status, desc)
  where not exists (select 1 from public.improvement_initiatives where organization_id = p_organization_id limit 1);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_improvement_initiative(
  p_initiative_title text,
  p_source text default 'feedback',
  p_priority text default 'medium',
  p_description text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('improvements.manage');
  v_org_id := public._mta_require_organization();
  insert into public.improvement_initiatives (organization_id, initiative_title, source, priority, description)
  values (v_org_id, left(p_initiative_title, 200), left(coalesce(p_source, 'feedback'), 100), coalesce(p_priority, 'medium'), left(coalesce(p_description, ''), 500))
  returning id into v_id;
  perform public._cie_log(v_org_id, 'improvement_initiative_created', 'improvement_initiative', v_id, jsonb_build_object('title', p_initiative_title));
  return jsonb_build_object('id', v_id, 'status', 'proposed');
end; $$;

create or replace function public.review_improvement_initiative(
  p_initiative_id uuid,
  p_status text,
  p_findings_summary text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_cycle_id uuid; v_cycle_num int;
begin
  perform public._irp_require_permission('improvements.review');
  v_org_id := public._mta_require_organization();
  update public.improvement_initiatives
  set status = p_status, updated_at = now()
  where id = p_initiative_id and organization_id = v_org_id;
  select coalesce(max(cycle_number), 0) + 1 into v_cycle_num
  from public.improvement_review_cycles where initiative_id = p_initiative_id;
  insert into public.improvement_review_cycles (organization_id, initiative_id, cycle_number, review_status, findings_summary, reviewed_at)
  values (v_org_id, p_initiative_id, v_cycle_num, 'completed', left(coalesce(p_findings_summary, ''), 500), now())
  returning id into v_cycle_id;
  perform public._cie_log(v_org_id, 'improvement_initiative_reviewed', 'improvement_initiative', p_initiative_id, jsonb_build_object('status', p_status));
  return jsonb_build_object('id', p_initiative_id, 'status', p_status, 'review_cycle_id', v_cycle_id);
end; $$;

create or replace function public.suggest_improvement_initiatives()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'suggestions', jsonb_build_array(
      jsonb_build_object('initiative_title', 'Improve support response consistency', 'source', 'quality_guardian', 'priority', 'high', 'confidence', 'moderate', 'rationale', 'Quality findings suggest recurring escalation patterns'),
      jsonb_build_object('initiative_title', 'Streamline onboarding checklists', 'source', 'customer_success', 'priority', 'strategic', 'confidence', 'high', 'rationale', 'Health scores indicate adoption friction in early lifecycle'),
      jsonb_build_object('initiative_title', 'Document top support topics', 'source', 'user_feedback', 'priority', 'medium', 'confidence', 'moderate', 'rationale', 'Feedback volume suggests knowledge gaps')
    )
  );
end; $$;

create or replace function public.get_continuous_improvement_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_seed_items(v_org_id);
  perform public._cie_seed_initiatives(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-guided continuous improvement — feedback drives refinement without silent auto-changes.',
    'principles', jsonb_build_array('Human-guided improvement', 'Explainable optimization', 'Outcome validation', 'Feedback collection', 'Governance-respecting'),
    'summary', jsonb_build_object(
      'active', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
      'implemented', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status = 'implemented'), 0),
      'feedback_count', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id), 0),
      'initiatives_active', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status in ('proposed', 'approved', 'in_progress')), 0),
      'initiatives_completed', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status = 'completed'), 0)
    ),
    'items', coalesce((
      select jsonb_agg(row_to_json(i) order by case i.priority when 'strategic' then 0 when 'high' then 1 else 2 end, i.created_at desc)
      from public.improvement_items i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(n) order by case n.priority when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, n.created_at desc)
      from public.improvement_initiatives n where n.organization_id = v_org_id and n.status not in ('rejected', 'deferred')
    ), '[]'::jsonb),
    'review_cycles', coalesce((
      select jsonb_agg(row_to_json(c) order by c.reviewed_at desc nulls last)
      from public.improvement_review_cycles c where c.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'success_measurements', coalesce((
      select jsonb_agg(row_to_json(m) order by m.measured_at desc)
      from public.improvement_success_measurements m where m.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'trends', jsonb_build_object(
      'feedback_30d', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id and created_at > now() - interval '30 days'), 0),
      'initiatives_completed_90d', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status = 'completed' and updated_at > now() - interval '90 days'), 0),
      'avg_improvement_pct', coalesce((select round(avg(improvement_percentage), 1) from public.improvement_success_measurements where organization_id = v_org_id), 0)
    ),
    'memory_integration', public._cie_memory_summary(v_org_id),
    'recent_feedback', coalesce((
      select jsonb_agg(row_to_json(f) order by f.created_at desc)
      from public.improvement_feedback f where f.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.measured_at desc)
      from public.improvement_outcomes o where o.organization_id = v_org_id limit 10
    ), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public.create_improvement_initiative(text, text, text, text) to authenticated;
grant execute on function public.review_improvement_initiative(uuid, text, text) to authenticated;
grant execute on function public.suggest_improvement_initiatives() to authenticated;
