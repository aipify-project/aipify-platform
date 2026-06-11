-- Phase 80 — Continuity, Resilience & Crisis Management Engine
-- Core principle: Aipify supports crisis response. Humans lead crisis response.

-- ---------------------------------------------------------------------------
-- 1. continuity_plans
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists continuity_plans_tenant_idx
  on public.continuity_plans (tenant_id, status);

alter table public.continuity_plans enable row level security;
revoke all on public.continuity_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. continuity_critical_processes
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_critical_processes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  continuity_plan_id uuid not null references public.continuity_plans (id) on delete cascade,
  process_name text not null,
  process_key text not null,
  owner_role_id uuid references public.digital_twin_roles (id) on delete set null,
  criticality_level text not null default 'high' check (criticality_level in ('medium', 'high', 'critical')),
  created_at timestamptz not null default now(),
  unique (tenant_id, process_key)
);

alter table public.continuity_critical_processes enable row level security;
revoke all on public.continuity_critical_processes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. continuity_backup_assignments
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_backup_assignments (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.continuity_critical_processes (id) on delete cascade,
  primary_owner_role_key text not null,
  secondary_owner_role_key text,
  tertiary_owner_role_key text,
  created_at timestamptz not null default now(),
  unique (process_id)
);

alter table public.continuity_backup_assignments enable row level security;
revoke all on public.continuity_backup_assignments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. continuity_incident_events
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_incident_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_level int not null check (incident_level between 1 and 4),
  category text not null,
  summary text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'investigating', 'recovering', 'resolved', 'closed')),
  incident_mode_active boolean not null default false,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists continuity_incident_events_tenant_idx
  on public.continuity_incident_events (tenant_id, status, created_at desc);

alter table public.continuity_incident_events enable row level security;
revoke all on public.continuity_incident_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. continuity_recovery_actions
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_recovery_actions (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.continuity_incident_events (id) on delete cascade,
  action_title text not null,
  assigned_role_key text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.continuity_recovery_actions enable row level security;
revoke all on public.continuity_recovery_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. continuity_scores
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overall_score numeric(5, 2) not null default 75.00,
  readiness_band text not null default 'prepared',
  backup_score numeric(5, 2) not null default 75.00,
  recovery_score numeric(5, 2) not null default 75.00,
  escalation_score numeric(5, 2) not null default 75.00,
  communication_score numeric(5, 2) not null default 75.00,
  redundancy_score numeric(5, 2) not null default 75.00,
  documentation_score numeric(5, 2) not null default 75.00,
  created_at timestamptz not null default now()
);

create index if not exists continuity_scores_tenant_idx
  on public.continuity_scores (tenant_id, created_at desc);

alter table public.continuity_scores enable row level security;
revoke all on public.continuity_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. continuity_incident_mode
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_incident_mode (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  active boolean not null default false,
  incident_id uuid references public.continuity_incident_events (id) on delete set null,
  activated_at timestamptz,
  activated_by uuid references public.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.continuity_incident_mode enable row level security;
revoke all on public.continuity_incident_mode from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. continuity_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.continuity_briefings enable row level security;
revoke all on public.continuity_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. continuity_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.continuity_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.continuity_audit_log enable row level security;
revoke all on public.continuity_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_cnt_)
-- ---------------------------------------------------------------------------
create or replace function public._cnt_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cnt_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._cnt_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.continuity_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._cnt_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'continuity_' || p_event_type, 'continuity', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._cnt_readiness_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'highly_prepared'
    when p_score >= 75 then 'prepared'
    when p_score >= 60 then 'improvement_recommended'
    when p_score >= 40 then 'resilience_concerns'
    else 'critical_gap'
  end;
$$;

create or replace function public._cnt_incident_level_label(p_level int)
returns text language sql immutable as $$
  select case p_level
    when 1 then 'localized'
    when 2 then 'departmental'
    when 3 then 'organizational'
    when 4 then 'critical_crisis'
    else 'unknown'
  end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Seed continuity plans
-- ---------------------------------------------------------------------------
create or replace function public._cnt_seed_continuity()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_plan_id uuid;
  v_proc_support uuid;
  v_proc_finance uuid;
  v_proc_security uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return; end if;
  if exists (select 1 from public.continuity_plans where tenant_id = v_tenant_id limit 1) then return; end if;

  perform public._dtw_seed_twin();

  insert into public.continuity_plans (tenant_id, title, description, status)
  values (v_tenant_id, 'Core Business Continuity Plan',
    'Critical processes, backup ownership, and recovery procedures for operational disruptions.', 'active')
  returning id into v_plan_id;

  insert into public.continuity_critical_processes (
    tenant_id, continuity_plan_id, process_name, process_key, criticality_level
  ) values
    (v_tenant_id, v_plan_id, 'Support Escalations', 'support_escalation', 'critical'),
    (v_tenant_id, v_plan_id, 'Finance Approvals', 'finance_approvals', 'high'),
    (v_tenant_id, v_plan_id, 'Security Reviews', 'security_reviews', 'critical'),
    (v_tenant_id, v_plan_id, 'Knowledge Ownership', 'knowledge_ownership', 'high')
  on conflict (tenant_id, process_key) do nothing;

  select id into v_proc_support from public.continuity_critical_processes
  where tenant_id = v_tenant_id and process_key = 'support_escalation';
  select id into v_proc_finance from public.continuity_critical_processes
  where tenant_id = v_tenant_id and process_key = 'finance_approvals';
  select id into v_proc_security from public.continuity_critical_processes
  where tenant_id = v_tenant_id and process_key = 'security_reviews';

  if v_proc_support is not null then
    insert into public.continuity_backup_assignments (process_id, primary_owner_role_key, secondary_owner_role_key, tertiary_owner_role_key)
    values (v_proc_support, 'support_lead', 'support_lead', 'operations_manager')
    on conflict (process_id) do nothing;
  end if;
  if v_proc_finance is not null then
    insert into public.continuity_backup_assignments (process_id, primary_owner_role_key, secondary_owner_role_key, tertiary_owner_role_key)
    values (v_proc_finance, 'operations_manager', 'compliance_reviewer', 'operations_manager')
    on conflict (process_id) do nothing;
  end if;
  if v_proc_security is not null then
    insert into public.continuity_backup_assignments (process_id, primary_owner_role_key, secondary_owner_role_key, tertiary_owner_role_key)
    values (v_proc_security, 'operations_manager', 'compliance_reviewer', 'operations_manager')
    on conflict (process_id) do nothing;
  end if;

  insert into public.continuity_incident_mode (tenant_id, active) values (v_tenant_id, false)
  on conflict (tenant_id) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Calculate Continuity Readiness Score
-- ---------------------------------------------------------------------------
create or replace function public.calculate_continuity_readiness_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_processes int;
  v_backups int;
  v_backup_score numeric;
  v_recovery numeric := 78;
  v_escalation numeric := 80;
  v_comm numeric := 82;
  v_redundancy numeric;
  v_docs numeric := 75;
  v_overall numeric;
  v_band text;
  v_gaps int;
  v_id uuid;
begin
  v_tenant_id := public._cnt_require_tenant();
  perform public._cnt_seed_continuity();

  select count(*) into v_processes from public.continuity_critical_processes where tenant_id = v_tenant_id;
  select count(*) into v_backups from public.continuity_backup_assignments b
  join public.continuity_critical_processes p on p.id = b.process_id where p.tenant_id = v_tenant_id;

  v_gaps := greatest(0, v_processes - v_backups);
  v_backup_score := greatest(40, least(100, 60 + v_backups * 10 - v_gaps * 15));
  v_redundancy := v_backup_score;

  begin
    select coalesce((public.calculate_digital_twin_health_score()->>'twin_health_score')::numeric, 70)
    into v_escalation;
  exception when others then v_escalation := 70;
  end;

  v_overall := round((v_backup_score + v_recovery + v_escalation + v_comm + v_redundancy + v_docs) / 6.0, 1);
  v_band := public._cnt_readiness_band(v_overall);

  insert into public.continuity_scores (
    tenant_id, overall_score, readiness_band,
    backup_score, recovery_score, escalation_score, communication_score,
    redundancy_score, documentation_score
  ) values (
    v_tenant_id, v_overall, v_band,
    v_backup_score, v_recovery, v_escalation, v_comm, v_redundancy, v_docs
  ) returning id into v_id;

  perform public._cnt_log_audit(v_tenant_id, 'readiness_calculated',
    'Continuity Readiness: ' || v_overall || ' (' || v_band || ')',
    jsonb_build_object('score_id', v_id));

  return jsonb_build_object(
    'overall_score', v_overall,
    'readiness_band', v_band,
    'backup_score', v_backup_score,
    'recovery_score', v_recovery,
    'escalation_score', v_escalation,
    'communication_score', v_comm,
    'redundancy_score', v_redundancy,
    'documentation_score', v_docs,
    'backup_gaps', v_gaps,
    'human_leadership_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Incident mode
-- ---------------------------------------------------------------------------
create or replace function public.activate_continuity_incident_mode(
  p_incident_level int, p_category text, p_summary text, p_description text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_incident_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._cnt_require_tenant();
  v_user_id := public._cnt_auth_user_id();

  insert into public.continuity_incident_events (
    tenant_id, incident_level, category, summary, description, status, incident_mode_active, created_by
  ) values (
    v_tenant_id, p_incident_level, p_category, p_summary, p_description, 'investigating', true, v_user_id
  ) returning id into v_incident_id;

  insert into public.continuity_recovery_actions (incident_id, action_title, assigned_role_key, status)
  values
    (v_incident_id, 'Assess incident scope and impact', 'operations_manager', 'pending'),
    (v_incident_id, 'Activate backup ownership paths', 'support_lead', 'pending'),
    (v_incident_id, 'Notify leadership — human approval required', 'operations_manager', 'pending');

  insert into public.continuity_incident_mode (tenant_id, active, incident_id, activated_at, activated_by, updated_at)
  values (v_tenant_id, true, v_incident_id, now(), v_user_id, now())
  on conflict (tenant_id) do update set
    active = true, incident_id = v_incident_id, activated_at = now(), activated_by = v_user_id, updated_at = now();

  perform public._cnt_log_audit(v_tenant_id, 'incident_mode_activated',
    'Incident Mode activated: ' || p_summary,
    jsonb_build_object('incident_id', v_incident_id, 'level', p_incident_level));

  begin
    perform public.generate_decision_explanation(
      'continuity-inc-' || v_incident_id::text, 'action', 'continuity',
      'Incident Mode activated — ' || p_summary,
      'Incident Mode increases visibility and prioritizes continuity workflows. It does NOT grant additional authority. Human leadership remains responsible.',
      jsonb_build_array('incident_level', p_category, 'continuity_plan'),
      jsonb_build_array('human_leadership_required', 'no_governance_bypass'),
      case when p_incident_level >= 4 then 'high' when p_incident_level >= 2 then 'medium' else 'low' end,
      jsonb_build_array('deactivate_incident_mode', 'escalate_to_leadership'),
      jsonb_build_array('Review recovery actions', 'Validate backup owners', 'Approve crisis communications'),
      jsonb_build_object('simple', 'Incident Mode is active. Follow continuity procedures under human leadership.')
    );
  exception when others then null;
  end;

  return jsonb_build_object(
    'incident_id', v_incident_id,
    'incident_mode_active', true,
    'incident_level', p_incident_level,
    'level_label', public._cnt_incident_level_label(p_incident_level),
    'human_leadership_required', true,
    'note', 'Incident Mode does not grant additional authority.'
  );
end; $$;

create or replace function public.deactivate_continuity_incident_mode()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cnt_require_tenant();

  update public.continuity_incident_mode set active = false, updated_at = now() where tenant_id = v_tenant_id;
  update public.continuity_incident_events set status = 'resolved', resolved_at = now()
  where tenant_id = v_tenant_id and status in ('open', 'investigating', 'recovering') and incident_mode_active;

  perform public._cnt_log_audit(v_tenant_id, 'incident_mode_deactivated', 'Incident Mode deactivated', '{}'::jsonb);

  return jsonb_build_object('incident_mode_active', false, 'human_leadership_required', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Continuity briefing
-- ---------------------------------------------------------------------------
create or replace function public.generate_continuity_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_readiness jsonb;
  v_incidents jsonb;
  v_plans jsonb;
  v_summary text;
  v_id uuid;
begin
  v_tenant_id := public._cnt_require_tenant();
  perform public._cnt_seed_continuity();
  v_readiness := public.calculate_continuity_readiness_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'incident_level', i.incident_level, 'category', i.category,
    'summary', i.summary, 'status', i.status
  ) order by i.created_at desc), '[]'::jsonb) into v_incidents
  from public.continuity_incident_events i where i.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'status', p.status,
    'process_count', (select count(*) from public.continuity_critical_processes cp where cp.continuity_plan_id = p.id)
  )), '[]'::jsonb) into v_plans
  from public.continuity_plans p where p.tenant_id = v_tenant_id and p.status = 'active';

  v_summary := 'Continuity Briefing — readiness ' || (v_readiness->>'overall_score') || ', human leadership mandatory.';

  insert into public.continuity_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, jsonb_build_object(
    'readiness', v_readiness,
    'incidents', v_incidents,
    'plans', v_plans,
    'readiness_gaps', jsonb_build_object('backup_gaps', v_readiness->'backup_gaps'),
    'recommended_improvements', jsonb_build_array(
      'Validate backup owner assignments',
      'Review escalation continuity paths',
      'Update recovery documentation'
    ),
    'human_leadership_required', true
  )) returning id into v_id;

  perform public._cnt_log_audit(v_tenant_id, 'briefing_generated', v_summary, jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', (
    select content from public.continuity_briefings where id = v_id
  ));
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_continuity_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_band text; v_mode boolean; v_open int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select overall_score, readiness_band into v_score, v_band
  from public.continuity_scores where tenant_id = v_tenant_id order by created_at desc limit 1;

  select active into v_mode from public.continuity_incident_mode where tenant_id = v_tenant_id;

  select count(*) into v_open from public.continuity_incident_events
  where tenant_id = v_tenant_id and status not in ('resolved', 'closed');

  return jsonb_build_object(
    'has_customer', true,
    'overall_score', coalesce(v_score, 75),
    'readiness_band', coalesce(v_band, 'prepared'),
    'incident_mode_active', coalesce(v_mode, false),
    'open_incidents', v_open,
    'philosophy', 'Aipify supports resilience. Humans lead resilience.',
    'human_leadership_required', true
  );
end; $$;

create or replace function public.get_continuity_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_readiness jsonb;
  v_plans jsonb;
  v_processes jsonb;
  v_incidents jsonb;
  v_mode jsonb;
  v_briefings jsonb;
begin
  v_tenant_id := public._cnt_require_tenant();
  perform public._cnt_seed_continuity();
  v_readiness := public.calculate_continuity_readiness_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'description', p.description, 'status', p.status
  )), '[]'::jsonb) into v_plans from public.continuity_plans p where p.tenant_id = v_tenant_id and p.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cp.id, 'process_name', cp.process_name, 'process_key', cp.process_key,
    'criticality_level', cp.criticality_level,
    'backup', (
      select jsonb_build_object(
        'primary', b.primary_owner_role_key,
        'secondary', b.secondary_owner_role_key,
        'tertiary', b.tertiary_owner_role_key
      ) from public.continuity_backup_assignments b where b.process_id = cp.id
    )
  )), '[]'::jsonb) into v_processes from public.continuity_critical_processes cp where cp.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'incident_level', i.incident_level,
    'level_label', public._cnt_incident_level_label(i.incident_level),
    'category', i.category, 'summary', i.summary, 'status', i.status,
    'created_at', i.created_at
  ) order by i.created_at desc), '[]'::jsonb) into v_incidents
  from public.continuity_incident_events i where i.tenant_id = v_tenant_id limit 15;

  select jsonb_build_object(
    'active', coalesce(m.active, false),
    'incident_id', m.incident_id,
    'activated_at', m.activated_at
  ) into v_mode from public.continuity_incident_mode m where m.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.continuity_briefings b where b.tenant_id = v_tenant_id limit 5;

  perform public._cnt_log_audit(v_tenant_id, 'dashboard_viewed', 'Continuity dashboard accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'human_leadership_required', true,
    'overall_score', v_readiness->'overall_score',
    'readiness_band', v_readiness->'readiness_band',
    'readiness_components', jsonb_build_object(
      'backup', v_readiness->'backup_score',
      'recovery', v_readiness->'recovery_score',
      'escalation', v_readiness->'escalation_score',
      'communication', v_readiness->'communication_score',
      'redundancy', v_readiness->'redundancy_score',
      'documentation', v_readiness->'documentation_score'
    ),
    'incident_mode', coalesce(v_mode, '{"active":false}'::jsonb),
    'plans', v_plans,
    'critical_processes', v_processes,
    'incidents', v_incidents,
    'briefings', v_briefings,
    'incident_levels', jsonb_build_array(
      jsonb_build_object('level', 1, 'label', 'Localized Incident'),
      jsonb_build_object('level', 2, 'label', 'Departmental Incident'),
      jsonb_build_object('level', 3, 'label', 'Organizational Incident'),
      jsonb_build_object('level', 4, 'label', 'Critical Crisis')
    ),
    'integrations', jsonb_build_object(
      'digital_twin', 'Backup owners and alternative approval paths',
      'simulation_lab', 'Continuity scenario preparation',
      'aoc', 'Resilience gap detection',
      'action_center', 'Incident tasks and recovery tracking',
      'executive_briefing', 'Continuity summaries',
      'security', 'Security incident coordination'
    )
  );
end; $$;

create or replace function public.get_continuity_incident(p_incident_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_inc public.continuity_incident_events; v_actions jsonb;
begin
  v_tenant_id := public._cnt_require_tenant();
  select * into v_inc from public.continuity_incident_events
  where id = p_incident_id and tenant_id = v_tenant_id;
  if v_inc.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'action_title', a.action_title, 'assigned_role_key', a.assigned_role_key, 'status', a.status
  ) order by a.created_at), '[]'::jsonb) into v_actions
  from public.continuity_recovery_actions a where a.incident_id = v_inc.id;

  return jsonb_build_object(
    'incident', jsonb_build_object(
      'id', v_inc.id, 'incident_level', v_inc.incident_level,
      'level_label', public._cnt_incident_level_label(v_inc.incident_level),
      'category', v_inc.category, 'summary', v_inc.summary, 'description', v_inc.description,
      'status', v_inc.status, 'incident_mode_active', v_inc.incident_mode_active,
      'created_at', v_inc.created_at
    ),
    'recovery_actions', v_actions,
    'human_leadership_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'continuity', 'Continuity & Resilience', 'Continuity planning, incident mode, and crisis management guides.', 'authenticated', 24
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'continuity' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 17. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.calculate_continuity_readiness_score() to authenticated;
grant execute on function public.activate_continuity_incident_mode(int, text, text, text) to authenticated;
grant execute on function public.deactivate_continuity_incident_mode() to authenticated;
grant execute on function public.generate_continuity_briefing() to authenticated;
grant execute on function public.get_continuity_card() to authenticated;
grant execute on function public.get_continuity_dashboard() to authenticated;
grant execute on function public.get_continuity_incident(uuid) to authenticated;
