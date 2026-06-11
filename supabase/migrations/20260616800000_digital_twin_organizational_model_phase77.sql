-- Phase 77 — Digital Twin & Organizational Model Engine

-- ---------------------------------------------------------------------------
-- 1. digital_twin_roles (responsibility model — not employee surveillance)
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  organization_id uuid references public.aipify_organizations (id) on delete cascade,
  organization_unit_id uuid references public.aipify_organization_units (id) on delete set null,
  role_key text not null,
  role_name text not null,
  description text,
  responsibility_types jsonb not null default '[]'::jsonb,
  decision_authority boolean not null default false,
  review_authority boolean not null default false,
  escalation_authority boolean not null default false,
  knowledge_ownership boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, role_key)
);

create index if not exists digital_twin_roles_tenant_idx
  on public.digital_twin_roles (tenant_id, status);

alter table public.digital_twin_roles enable row level security;
revoke all on public.digital_twin_roles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. digital_twin_role_assignments (confidence on role fit — not performance)
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_role_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  role_id uuid not null references public.digital_twin_roles (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  confidence numeric(5, 2) not null default 85.00 check (confidence between 0 and 100),
  assigned_by uuid references public.users (id) on delete set null,
  requires_review boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, role_id, user_id)
);

alter table public.digital_twin_role_assignments enable row level security;
revoke all on public.digital_twin_role_assignments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. digital_twin_process_models
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_process_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  organization_id uuid references public.aipify_organizations (id) on delete cascade,
  process_key text not null,
  process_name text not null,
  owner_role_id uuid references public.digital_twin_roles (id) on delete set null,
  category text not null default 'internal',
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  deadline_hours int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, process_key)
);

alter table public.digital_twin_process_models enable row level security;
revoke all on public.digital_twin_process_models from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. digital_twin_process_steps
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_process_steps (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.digital_twin_process_models (id) on delete cascade,
  step_order int not null,
  step_name text not null,
  reviewer_role_id uuid references public.digital_twin_roles (id) on delete set null,
  escalation_role_id uuid references public.digital_twin_roles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (process_id, step_order)
);

alter table public.digital_twin_process_steps enable row level security;
revoke all on public.digital_twin_process_steps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. digital_twin_knowledge_owners (SME routing)
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_knowledge_owners (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  organization_id uuid references public.aipify_organizations (id) on delete cascade,
  topic text not null,
  topic_key text not null,
  role_id uuid references public.digital_twin_roles (id) on delete set null,
  confidence numeric(5, 2) not null default 85.00,
  requires_review boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, topic_key)
);

alter table public.digital_twin_knowledge_owners enable row level security;
revoke all on public.digital_twin_knowledge_owners from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. digital_twin_escalation_paths
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_escalation_paths (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  process_key text not null,
  path_order int not null,
  role_id uuid references public.digital_twin_roles (id) on delete set null,
  role_key text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, process_key, path_order)
);

alter table public.digital_twin_escalation_paths enable row level security;
revoke all on public.digital_twin_escalation_paths from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. digital_twin_insights
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  organization_id uuid references public.aipify_organizations (id) on delete cascade,
  insight_type text not null check (
    insight_type in (
      'bottleneck', 'ownership_gap', 'escalation_overload', 'knowledge_gap',
      'routing_suggestion', 'confidence_review', 'process_health'
    )
  ),
  summary text not null,
  detail text,
  confidence numeric(5, 2) not null default 75.00,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'accepted')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists digital_twin_insights_tenant_idx
  on public.digital_twin_insights (tenant_id, insight_type, created_at desc);

alter table public.digital_twin_insights enable row level security;
revoke all on public.digital_twin_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. digital_twin_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  recorded_at timestamptz not null default now()
);

create index if not exists digital_twin_metrics_tenant_idx
  on public.digital_twin_metrics (tenant_id, metric_key, recorded_at desc);

alter table public.digital_twin_metrics enable row level security;
revoke all on public.digital_twin_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. digital_twin_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.digital_twin_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.digital_twin_audit_log enable row level security;
revoke all on public.digital_twin_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_dtw_)
-- ---------------------------------------------------------------------------
create or replace function public._dtw_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._dtw_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._dtw_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.digital_twin_audit_log (
    tenant_id, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._dtw_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'digital_twin_' || p_event_type, 'digital_twin', 'logged', null, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._dtw_confidence_level(p_confidence numeric)
returns text language sql immutable as $$
  select case
    when p_confidence >= 90 then 'high'
    when p_confidence >= 70 then 'medium'
    else 'low'
  end;
$$;

create or replace function public._dtw_ensure_organization(p_tenant_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  select id into v_org_id from public.aipify_organizations where tenant_id = p_tenant_id;
  if v_org_id is null then
    insert into public.aipify_organizations (tenant_id, name)
    values (p_tenant_id, 'Organization')
    returning id into v_org_id;
  end if;
  return v_org_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Seed twin model
-- ---------------------------------------------------------------------------
create or replace function public._dtw_seed_twin()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_org_id uuid;
  v_support_lead uuid;
  v_ops_manager uuid;
  v_hr_expert uuid;
  v_it_expert uuid;
  v_support_process uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return; end if;
  v_org_id := public._dtw_ensure_organization(v_tenant_id);

  insert into public.digital_twin_roles (
    tenant_id, organization_id, role_key, role_name, description,
    responsibility_types, decision_authority, review_authority, escalation_authority, knowledge_ownership
  ) values
    (v_tenant_id, v_org_id, 'support_lead', 'Support Lead', 'Escalation review, FAQ ownership, support approvals.',
     '["escalation_review","faq_ownership","support_approvals"]'::jsonb, false, true, true, true),
    (v_tenant_id, v_org_id, 'operations_manager', 'Operations Manager', 'Cross-team escalation and process ownership.',
     '["process_ownership","escalation"]'::jsonb, true, true, true, false),
    (v_tenant_id, v_org_id, 'hr_expert', 'HR Expert', 'HR knowledge and policy routing.',
     '["knowledge_ownership","review"]'::jsonb, false, true, false, true),
    (v_tenant_id, v_org_id, 'it_expert', 'IT Expert', 'Technical knowledge routing.',
     '["knowledge_ownership","review"]'::jsonb, false, true, false, true),
    (v_tenant_id, v_org_id, 'compliance_reviewer', 'Compliance Reviewer', 'Legal and compliance review routing.',
     '["review","governance"]'::jsonb, false, true, false, true)
  on conflict (tenant_id, role_key) do update set
    role_name = excluded.role_name, description = excluded.description, updated_at = now();

  select id into v_support_lead from public.digital_twin_roles where tenant_id = v_tenant_id and role_key = 'support_lead';
  select id into v_ops_manager from public.digital_twin_roles where tenant_id = v_tenant_id and role_key = 'operations_manager';
  select id into v_hr_expert from public.digital_twin_roles where tenant_id = v_tenant_id and role_key = 'hr_expert';
  select id into v_it_expert from public.digital_twin_roles where tenant_id = v_tenant_id and role_key = 'it_expert';

  insert into public.digital_twin_process_models (
    tenant_id, organization_id, process_key, process_name, owner_role_id, category, deadline_hours
  ) values
    (v_tenant_id, v_org_id, 'support_escalation', 'Support Escalation', v_support_lead, 'support', 24),
    (v_tenant_id, v_org_id, 'refund_process', 'Refund Process', v_ops_manager, 'finance', 48),
    (v_tenant_id, v_org_id, 'employee_onboarding', 'Employee Onboarding', v_hr_expert, 'onboarding', 72),
    (v_tenant_id, v_org_id, 'security_incident', 'Security Incident Response', v_ops_manager, 'security', 4)
  on conflict (tenant_id, process_key) do update set process_name = excluded.process_name, updated_at = now();

  select id into v_support_process from public.digital_twin_process_models
  where tenant_id = v_tenant_id and process_key = 'support_escalation';

  if v_support_process is not null then
    insert into public.digital_twin_process_steps (process_id, step_order, step_name, reviewer_role_id, escalation_role_id)
    values
      (v_support_process, 1, 'Initial triage', v_support_lead, v_support_lead),
      (v_support_process, 2, 'Lead review', v_support_lead, v_ops_manager),
      (v_support_process, 3, 'Manager escalation', v_ops_manager, v_ops_manager)
    on conflict (process_id, step_order) do nothing;
  end if;

  insert into public.digital_twin_escalation_paths (tenant_id, process_key, path_order, role_id, role_key)
  values
    (v_tenant_id, 'support_escalation', 1, v_support_lead, 'support_lead'),
    (v_tenant_id, 'support_escalation', 2, v_support_lead, 'support_lead'),
    (v_tenant_id, 'support_escalation', 3, v_ops_manager, 'operations_manager')
  on conflict (tenant_id, process_key, path_order) do nothing;

  insert into public.digital_twin_knowledge_owners (tenant_id, organization_id, topic, topic_key, role_id, confidence, requires_review)
  values
    (v_tenant_id, v_org_id, 'Human Resources', 'hr', v_hr_expert, 96.00, false),
    (v_tenant_id, v_org_id, 'Information Technology', 'it', v_it_expert, 91.00, false),
    (v_tenant_id, v_org_id, 'Legal & Compliance', 'legal', (select id from public.digital_twin_roles where tenant_id = v_tenant_id and role_key = 'compliance_reviewer'), 88.00, false),
    (v_tenant_id, v_org_id, 'Customer Support', 'support', v_support_lead, 42.00, true)
  on conflict (tenant_id, topic_key) do update set confidence = excluded.confidence, requires_review = excluded.requires_review;

  insert into public.digital_twin_insights (tenant_id, organization_id, insight_type, summary, detail, confidence, metadata)
  select v_tenant_id, v_org_id, 'bottleneck',
    'Approval congestion detected — one approver role handles most pending requests.',
    '83% of approval requests route to a single reviewer role. Consider distributing review authority.',
    82.00, '{"metric":"approval_concentration","value":83}'::jsonb
  where not exists (
    select 1 from public.digital_twin_insights
    where tenant_id = v_tenant_id and insight_type = 'bottleneck' and status = 'open'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge routing & escalation
-- ---------------------------------------------------------------------------
create or replace function public.route_digital_twin_knowledge(p_topic_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_owner public.digital_twin_knowledge_owners; v_role public.digital_twin_roles;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();

  select * into v_owner from public.digital_twin_knowledge_owners
  where tenant_id = v_tenant_id and topic_key = lower(p_topic_key);

  if v_owner.id is null then
    select * into v_owner from public.digital_twin_knowledge_owners
    where tenant_id = v_tenant_id and topic ilike '%' || p_topic_key || '%'
    limit 1;
  end if;

  if v_owner.id is null then
    return jsonb_build_object('routed', false, 'reason', 'no_owner_found');
  end if;

  select * into v_role from public.digital_twin_roles where id = v_owner.role_id;

  perform public._dtw_log_audit(v_tenant_id, 'knowledge_routed',
    'Routed ' || p_topic_key || ' to ' || coalesce(v_role.role_name, 'role'),
    jsonb_build_object('topic_key', p_topic_key, 'role_key', v_role.role_key));

  return jsonb_build_object(
    'routed', true,
    'topic', v_owner.topic,
    'role_key', v_role.role_key,
    'role_name', v_role.role_name,
    'confidence', v_owner.confidence,
    'confidence_level', public._dtw_confidence_level(v_owner.confidence),
    'requires_review', v_owner.requires_review,
    'explanation', 'Twin identified ' || v_role.role_name || ' as knowledge owner for ' || v_owner.topic || '.'
  );
end; $$;

create or replace function public.resolve_digital_twin_escalation(p_process_key text, p_current_step int default 1)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_path record;
  v_next record;
  v_role public.digital_twin_roles;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();

  select * into v_path from public.digital_twin_escalation_paths
  where tenant_id = v_tenant_id and process_key = p_process_key and path_order = p_current_step;

  select * into v_next from public.digital_twin_escalation_paths
  where tenant_id = v_tenant_id and process_key = p_process_key and path_order = p_current_step + 1;

  if v_path.id is null then
    return jsonb_build_object('resolved', false, 'reason', 'process_not_found');
  end if;

  select * into v_role from public.digital_twin_roles where id = v_path.role_id;

  perform public._dtw_log_audit(v_tenant_id, 'escalation_resolved',
    'Escalation step ' || p_current_step || ' for ' || p_process_key,
    jsonb_build_object('process_key', p_process_key, 'step', p_current_step));

  begin
    perform public.emit_orchestration_event(jsonb_build_object(
      'source_module', 'digital_twin', 'source_type', 'escalation',
      'event_type', 'digital_twin.escalation',
      'payload', jsonb_build_object(
        'process_key', p_process_key, 'role_key', v_path.role_key, 'step', p_current_step
      )
    ));
  exception when others then null;
  end;

  return jsonb_build_object(
    'resolved', true,
    'process_key', p_process_key,
    'current_step', p_current_step,
    'role_key', v_path.role_key,
    'role_name', v_role.role_name,
    'next_role_key', v_next.role_key,
    'explanation', 'Twin escalation path: step ' || p_current_step || ' routes to ' || v_role.role_name || '.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Bottleneck detection & health score
-- ---------------------------------------------------------------------------
create or replace function public.detect_digital_twin_bottlenecks()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_count int;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();

  select count(*) into v_count from public.digital_twin_insights
  where tenant_id = v_tenant_id and insight_type = 'bottleneck' and status = 'open';

  return jsonb_build_object(
    'bottlenecks_found', v_count,
    'insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'insight_type', i.insight_type, 'summary', i.summary,
        'confidence', i.confidence, 'confidence_level', public._dtw_confidence_level(i.confidence)
      ) order by i.created_at desc)
      from public.digital_twin_insights i
      where i.tenant_id = v_tenant_id and i.status = 'open'
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.calculate_digital_twin_health_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_roles int;
  v_processes int;
  v_owners int;
  v_low_conf int;
  v_score numeric;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();

  select count(*) into v_roles from public.digital_twin_roles where tenant_id = v_tenant_id and status = 'active';
  select count(*) into v_processes from public.digital_twin_process_models where tenant_id = v_tenant_id and status = 'active';
  select count(*) into v_owners from public.digital_twin_knowledge_owners where tenant_id = v_tenant_id;
  select count(*) into v_low_conf from public.digital_twin_knowledge_owners
  where tenant_id = v_tenant_id and confidence < 70;

  v_score := greatest(0, least(100, round(
    least(v_roles * 15, 30) + least(v_processes * 15, 30) + least(v_owners * 10, 25) +
    greatest(0, 15 - v_low_conf * 5)
  , 1)));

  insert into public.digital_twin_metrics (tenant_id, metric_key, metric_value)
  values
    (v_tenant_id, 'twin_health_score', v_score),
    (v_tenant_id, 'process_coverage', v_processes),
    (v_tenant_id, 'ownership_completeness', v_owners),
    (v_tenant_id, 'low_confidence_owners', v_low_conf);

  perform public._dtw_log_audit(v_tenant_id, 'health_score_calculated',
    'Twin Health Score: ' || v_score, jsonb_build_object('score', v_score));

  return jsonb_build_object(
    'twin_health_score', v_score,
    'process_coverage', v_processes,
    'role_count', v_roles,
    'knowledge_owners', v_owners,
    'low_confidence_count', v_low_conf
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_twin_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_insights int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select metric_value into v_score from public.digital_twin_metrics
  where tenant_id = v_tenant_id and metric_key = 'twin_health_score'
  order by recorded_at desc limit 1;

  select count(*) into v_insights from public.digital_twin_insights
  where tenant_id = v_tenant_id and status = 'open';

  return jsonb_build_object(
    'has_customer', true,
    'twin_health_score', coalesce(v_score, 70),
    'open_insights', v_insights,
    'philosophy', 'The Twin models responsibilities — not people. Never surveillance.',
    'privacy_note', 'No employee scoring, ranking, or hidden monitoring.'
  );
end; $$;

create or replace function public.get_digital_twin_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_roles jsonb;
  v_processes jsonb;
  v_owners jsonb;
  v_insights jsonb;
  v_units jsonb;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();
  v_health := public.calculate_digital_twin_health_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'role_key', r.role_key, 'role_name', r.role_name, 'description', r.description,
    'responsibility_types', r.responsibility_types,
    'escalation_authority', r.escalation_authority, 'knowledge_ownership', r.knowledge_ownership
  ) order by r.role_name), '[]'::jsonb) into v_roles
  from public.digital_twin_roles r where r.tenant_id = v_tenant_id and r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'process_key', p.process_key, 'process_name', p.process_name, 'category', p.category,
    'owner_role_id', p.owner_role_id, 'deadline_hours', p.deadline_hours
  ) order by p.process_name), '[]'::jsonb) into v_processes
  from public.digital_twin_process_models p where p.tenant_id = v_tenant_id and p.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'topic', k.topic, 'topic_key', k.topic_key, 'role_id', k.role_id,
    'confidence', k.confidence,
    'confidence_level', public._dtw_confidence_level(k.confidence),
    'requires_review', k.requires_review
  ) order by k.topic), '[]'::jsonb) into v_owners
  from public.digital_twin_knowledge_owners k where k.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'insight_type', i.insight_type, 'summary', i.summary,
    'confidence', i.confidence, 'status', i.status
  ) order by i.created_at desc), '[]'::jsonb) into v_insights
  from public.digital_twin_insights i where i.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', u.id, 'name', u.name, 'unit_type', u.unit_type
  ) order by u.name), '[]'::jsonb) into v_units
  from public.aipify_organization_units u where u.tenant_id = v_tenant_id and u.active limit 20;

  return jsonb_build_object(
    'has_customer', true,
    'twin_health_score', v_health->'twin_health_score',
    'process_coverage', v_health->'process_coverage',
    'knowledge_owners', v_health->'knowledge_owners',
    'low_confidence_count', v_health->'low_confidence_count',
    'roles', v_roles,
    'processes', v_processes,
    'knowledge_routing', v_owners,
    'insights', v_insights,
    'organization_units', v_units,
    'integrations', jsonb_build_object(
      'action_center', 'Task assignment and escalation routing',
      'desktop', 'Notification and reminder prioritization',
      'briefing', 'Department summaries and bottleneck reporting',
      'governance', 'Approver identification and separation of duties',
      'agents', 'Support/Knowledge/Governance agent routing'
    )
  );
end; $$;

create or replace function public.get_digital_twin_process(p_process_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_proc public.digital_twin_process_models; v_steps jsonb; v_path jsonb;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();

  select * into v_proc from public.digital_twin_process_models
  where tenant_id = v_tenant_id and process_key = p_process_key;

  if v_proc.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'step_order', s.step_order, 'step_name', s.step_name,
    'reviewer_role_id', s.reviewer_role_id, 'escalation_role_id', s.escalation_role_id
  ) order by s.step_order), '[]'::jsonb) into v_steps
  from public.digital_twin_process_steps s where s.process_id = v_proc.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'path_order', e.path_order, 'role_key', e.role_key
  ) order by e.path_order), '[]'::jsonb) into v_path
  from public.digital_twin_escalation_paths e
  where e.tenant_id = v_tenant_id and e.process_key = p_process_key;

  return jsonb_build_object(
    'process', jsonb_build_object(
      'process_key', v_proc.process_key, 'process_name', v_proc.process_name,
      'category', v_proc.category, 'owner_role_id', v_proc.owner_role_id,
      'deadline_hours', v_proc.deadline_hours
    ),
    'steps', v_steps,
    'escalation_path', v_path
  );
end; $$;

create or replace function public.list_digital_twin_roles()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._dtw_seed_twin();
  return jsonb_build_object('roles', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id, 'role_key', r.role_key, 'role_name', r.role_name,
      'description', r.description, 'responsibility_types', r.responsibility_types
    ) order by r.role_name)
    from public.digital_twin_roles r
    where r.tenant_id = public._dtw_require_tenant() and r.status = 'active'
  ), '[]'::jsonb));
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'digital-twin', 'Digital Twin', 'Organizational model, responsibilities, and routing guides.', 'authenticated', 21
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'digital-twin' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.route_digital_twin_knowledge(text) to authenticated;
grant execute on function public.resolve_digital_twin_escalation(text, int) to authenticated;
grant execute on function public.detect_digital_twin_bottlenecks() to authenticated;
grant execute on function public.calculate_digital_twin_health_score() to authenticated;
grant execute on function public.get_digital_twin_card() to authenticated;
grant execute on function public.get_digital_twin_dashboard() to authenticated;
grant execute on function public.get_digital_twin_process(text) to authenticated;
grant execute on function public.list_digital_twin_roles() to authenticated;
