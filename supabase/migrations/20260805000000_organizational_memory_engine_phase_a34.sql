-- Phase A.34 — Organizational Memory Engine
-- Tenant-aware organizational memory with human-governed retention, metadata-only summaries.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'organizational_memory_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_memory_records
-- ---------------------------------------------------------------------------
create table if not exists public.organization_memory_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (
    category in (
      'operational_decisions', 'resolved_incidents', 'support_learnings',
      'approval_precedents', 'strategic_decisions', 'onboarding_lessons',
      'process_improvements'
    )
  ),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  detailed_context jsonb not null default '{}'::jsonb,
  source_reference text,
  visibility text not null default 'internal' check (
    visibility in ('private', 'internal', 'leadership')
  ),
  status text not null default 'active' check (
    status in ('active', 'archived', 'superseded')
  ),
  reference_count int not null default 0,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_memory_records_org_idx
  on public.organization_memory_records (organization_id, status, created_at desc);

create index if not exists organization_memory_records_category_idx
  on public.organization_memory_records (organization_id, category, status);

create index if not exists organization_memory_records_search_idx
  on public.organization_memory_records using gin (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, ''))
  );

alter table public.organization_memory_records enable row level security;
revoke all on public.organization_memory_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_decision_register
-- ---------------------------------------------------------------------------
create table if not exists public.organization_decision_register (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_record_id uuid references public.organization_memory_records (id) on delete set null,
  decision_title text not null,
  rationale text not null default '',
  alternatives text not null default '',
  expected_outcomes text not null default '',
  review_date date,
  status text not null default 'active' check (
    status in ('active', 'under_review', 'archived', 'superseded')
  ),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_decision_register_org_idx
  on public.organization_decision_register (organization_id, status, review_date);

alter table public.organization_decision_register enable row level security;
revoke all on public.organization_decision_register from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_memory_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.organization_memory_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_record_id uuid references public.organization_memory_records (id) on delete cascade,
  decision_id uuid references public.organization_decision_register (id) on delete cascade,
  review_type text not null default 'quarterly' check (
    review_type in ('quarterly', 'annual', 'event_triggered')
  ),
  scheduled_at timestamptz not null,
  completed_at timestamptz,
  review_outcome text,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'completed', 'skipped', 'overdue')
  ),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_memory_reviews_org_idx
  on public.organization_memory_reviews (organization_id, status, scheduled_at);

alter table public.organization_memory_reviews enable row level security;
revoke all on public.organization_memory_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_memory_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_memory_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  retention_days int not null default 365 check (retention_days between 30 and 3650),
  capture_rules jsonb not null default '{
    "operational_decisions": true,
    "resolved_incidents": true,
    "support_learnings": true,
    "approval_precedents": true,
    "strategic_decisions": true,
    "onboarding_lessons": true,
    "process_improvements": true
  }'::jsonb,
  auto_capture_enabled boolean not null default false,
  review_reminder_days int not null default 90,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_memory_settings enable row level security;
revoke all on public.organization_memory_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_memory_engine', v.description
from (values
  ('memory.view', 'View Organizational Memory', 'View organizational memory records and decisions'),
  ('memory.create', 'Create Organizational Memory', 'Create organizational memory records'),
  ('memory.edit', 'Edit Organizational Memory', 'Edit organizational memory records and decisions'),
  ('memory.archive', 'Archive Organizational Memory', 'Archive or supersede memory records'),
  ('memory.review', 'Review Organizational Memory', 'Schedule and complete memory reviews')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'memory.view'), ('owner', 'memory.create'), ('owner', 'memory.edit'),
  ('owner', 'memory.archive'), ('owner', 'memory.review'),
  ('administrator', 'memory.view'), ('administrator', 'memory.create'), ('administrator', 'memory.edit'),
  ('administrator', 'memory.archive'), ('administrator', 'memory.review'),
  ('manager', 'memory.view'), ('manager', 'memory.create'), ('manager', 'memory.edit'),
  ('manager', 'memory.review'),
  ('support_agent', 'memory.view'), ('support_agent', 'memory.create'),
  ('viewer', 'memory.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ome_ prefix — A.34 organization-scoped)
-- ---------------------------------------------------------------------------
create or replace function public._ome_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organizational_memory',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ome_truncate_summary(p_summary text)
returns text language sql immutable as $$
  select left(coalesce(p_summary, ''), 500);
$$;

create or replace function public._ome_ensure_settings(p_organization_id uuid)
returns public.organization_memory_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_memory_settings;
begin
  insert into public.organization_memory_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_memory_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._ome_user_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(u.role, 'viewer')
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public._ome_can_view_visibility(
  p_visibility text,
  p_created_by uuid,
  p_organization_id uuid
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_role text;
  v_user_id uuid;
begin
  v_role := public._ome_user_role();
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if p_visibility = 'private' then
    return p_created_by = v_user_id or v_role in ('owner', 'administrator');
  end if;

  if p_visibility = 'leadership' then
    return v_role in ('owner', 'administrator', 'manager');
  end if;

  return true;
end; $$;

create or replace function public._ome_record_json(r public.organization_memory_records)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id,
    'organization_id', r.organization_id,
    'category', r.category,
    'title', r.title,
    'summary', r.summary,
    'detailed_context', r.detailed_context,
    'source_reference', r.source_reference,
    'visibility', r.visibility,
    'status', r.status,
    'reference_count', r.reference_count,
    'created_by', r.created_by,
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
$$;

create or replace function public._ome_decision_json(d public.organization_decision_register)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', d.id,
    'organization_id', d.organization_id,
    'memory_record_id', d.memory_record_id,
    'decision_title', d.decision_title,
    'rationale', d.rationale,
    'alternatives', d.alternatives,
    'expected_outcomes', d.expected_outcomes,
    'review_date', d.review_date,
    'status', d.status,
    'created_by', d.created_by,
    'created_at', d.created_at,
    'updated_at', d.updated_at
  );
$$;

create or replace function public._ome_capture_allowed(
  p_organization_id uuid,
  p_category text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_settings public.organization_memory_settings;
begin
  v_settings := public._ome_ensure_settings(p_organization_id);
  if not v_settings.auto_capture_enabled then
    return false;
  end if;
  return coalesce((v_settings.capture_rules ->> p_category)::boolean, false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Public RPCs — records & decisions
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_memory_record(
  p_category text,
  p_title text,
  p_summary text default '',
  p_detailed_context jsonb default '{}'::jsonb,
  p_source_reference text default null,
  p_visibility text default 'internal'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_memory_records;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.create');

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.organization_memory_records (
    organization_id, category, title, summary, detailed_context,
    source_reference, visibility, created_by
  ) values (
    v_org_id, p_category, p_title,
    public._ome_truncate_summary(p_summary),
    coalesce(p_detailed_context, '{}'::jsonb),
    p_source_reference, coalesce(p_visibility, 'internal'), v_user_id
  ) returning * into v_row;

  perform public._ome_log(v_org_id, 'memory_record_created', 'memory_record', v_row.id,
    jsonb_build_object('category', p_category, 'title', p_title, 'visibility', p_visibility));

  return public._ome_record_json(v_row);
end; $$;

create or replace function public.update_organization_memory_record(
  p_record_id uuid,
  p_title text default null,
  p_summary text default null,
  p_detailed_context jsonb default null,
  p_source_reference text default null,
  p_visibility text default null,
  p_status text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_memory_records;
  v_old_visibility text;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.edit');

  select * into v_row from public.organization_memory_records
  where id = p_record_id and organization_id = v_org_id;
  if not found then raise exception 'Memory record not found'; end if;

  if not public._ome_can_view_visibility(v_row.visibility, v_row.created_by, v_org_id) then
    raise exception 'Insufficient visibility access';
  end if;

  v_old_visibility := v_row.visibility;

  update public.organization_memory_records set
    title = coalesce(p_title, title),
    summary = coalesce(public._ome_truncate_summary(p_summary), summary),
    detailed_context = coalesce(p_detailed_context, detailed_context),
    source_reference = coalesce(p_source_reference, source_reference),
    visibility = coalesce(p_visibility, visibility),
    status = coalesce(p_status, status),
    updated_at = now()
  where id = p_record_id
  returning * into v_row;

  if p_visibility is not null and p_visibility <> v_old_visibility then
    perform public._ome_log(v_org_id, 'memory_visibility_changed', 'memory_record', p_record_id,
      jsonb_build_object('visibility', p_visibility));
  else
    perform public._ome_log(v_org_id, 'memory_record_updated', 'memory_record', p_record_id, '{}'::jsonb);
  end if;

  return public._ome_record_json(v_row);
end; $$;

create or replace function public.perform_organization_memory_action(
  p_record_id uuid,
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_memory_records;
  v_new_status text;
begin
  v_org_id := public._mta_require_organization();

  select * into v_row from public.organization_memory_records
  where id = p_record_id and organization_id = v_org_id;
  if not found then raise exception 'Memory record not found'; end if;

  case p_action
    when 'archive' then
      perform public._irp_require_permission(v_org_id, 'memory.archive');
      v_new_status := 'archived';
    when 'supersede' then
      perform public._irp_require_permission(v_org_id, 'memory.archive');
      v_new_status := 'superseded';
    when 'restore' then
      perform public._irp_require_permission(v_org_id, 'memory.edit');
      v_new_status := 'active';
    when 'reference' then
      perform public._irp_require_permission(v_org_id, 'memory.view');
      update public.organization_memory_records
      set reference_count = reference_count + 1, updated_at = now()
      where id = p_record_id
      returning * into v_row;
      return public._ome_record_json(v_row);
    when 'change_visibility' then
      perform public._irp_require_permission(v_org_id, 'memory.edit');
      update public.organization_memory_records set
        visibility = coalesce(p_payload->>'visibility', visibility),
        updated_at = now()
      where id = p_record_id
      returning * into v_row;
      perform public._ome_log(v_org_id, 'memory_visibility_changed', 'memory_record', p_record_id,
        jsonb_build_object('visibility', v_row.visibility));
      return public._ome_record_json(v_row);
    else
      raise exception 'Unknown memory action: %', p_action;
  end case;

  update public.organization_memory_records
  set status = v_new_status, updated_at = now()
  where id = p_record_id
  returning * into v_row;

  perform public._ome_log(v_org_id, 'memory_record_' || p_action || 'd', 'memory_record', p_record_id,
    jsonb_build_object('status', v_new_status));

  return public._ome_record_json(v_row);
end; $$;

create or replace function public.create_organization_decision_register_entry(
  p_decision_title text,
  p_rationale text default '',
  p_alternatives text default '',
  p_expected_outcomes text default '',
  p_review_date date default null,
  p_memory_record_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_decision_register;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.create');

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.organization_decision_register (
    organization_id, memory_record_id, decision_title, rationale,
    alternatives, expected_outcomes, review_date, created_by
  ) values (
    v_org_id, p_memory_record_id, p_decision_title, p_rationale,
    p_alternatives, p_expected_outcomes, p_review_date, v_user_id
  ) returning * into v_row;

  perform public._ome_log(v_org_id, 'decision_register_created', 'decision_register', v_row.id,
    jsonb_build_object('decision_title', p_decision_title));

  return public._ome_decision_json(v_row);
end; $$;

create or replace function public.schedule_organization_memory_review(
  p_review_type text default 'quarterly',
  p_scheduled_at timestamptz default null,
  p_memory_record_id uuid default null,
  p_decision_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.review');

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.organization_memory_reviews (
    organization_id, memory_record_id, decision_id,
    review_type, scheduled_at, created_by
  ) values (
    v_org_id, p_memory_record_id, p_decision_id,
    coalesce(p_review_type, 'quarterly'),
    coalesce(p_scheduled_at, now() + interval '90 days'),
    v_user_id
  ) returning id into v_id;

  perform public._ome_log(v_org_id, 'memory_review_scheduled', 'memory_review', v_id,
    jsonb_build_object('review_type', p_review_type));

  return jsonb_build_object('id', v_id, 'scheduled', true);
end; $$;

create or replace function public.complete_organization_memory_review(
  p_review_id uuid,
  p_review_outcome text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_memory_reviews;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.review');

  update public.organization_memory_reviews set
    status = 'completed',
    completed_at = now(),
    review_outcome = coalesce(p_review_outcome, review_outcome)
  where id = p_review_id and organization_id = v_org_id
  returning * into v_row;

  if not found then raise exception 'Memory review not found'; end if;

  perform public._ome_log(v_org_id, 'memory_review_completed', 'memory_review', p_review_id, '{}'::jsonb);

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.save_organization_memory_settings(
  p_retention_days int default null,
  p_capture_rules jsonb default null,
  p_auto_capture_enabled boolean default null,
  p_review_reminder_days int default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_memory_settings;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.edit');
  perform public._ome_ensure_settings(v_org_id);

  update public.organization_memory_settings set
    retention_days = coalesce(p_retention_days, retention_days),
    capture_rules = coalesce(p_capture_rules, capture_rules),
    auto_capture_enabled = coalesce(p_auto_capture_enabled, auto_capture_enabled),
    review_reminder_days = coalesce(p_review_reminder_days, review_reminder_days),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ome_log(v_org_id, 'memory_settings_changed', 'memory_settings', v_row.id, '{}'::jsonb);

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.capture_organization_memory(
  p_category text,
  p_title text,
  p_summary text,
  p_source_reference text default null,
  p_detailed_context jsonb default '{}'::jsonb,
  p_capture_source text default 'manual'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_memory_records;
begin
  v_org_id := public._mta_require_organization();

  if p_capture_source <> 'manual' and not public._ome_capture_allowed(v_org_id, p_category) then
    return jsonb_build_object('captured', false, 'reason', 'auto_capture_disabled');
  end if;

  perform public._irp_require_permission(v_org_id, 'memory.create');

  insert into public.organization_memory_records (
    organization_id, category, title, summary, detailed_context,
    source_reference, visibility, created_by
  ) values (
    v_org_id, p_category, p_title,
    public._ome_truncate_summary(p_summary),
    coalesce(p_detailed_context, '{}'::jsonb) || jsonb_build_object('capture_source', p_capture_source),
    p_source_reference, 'internal',
    (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1)
  ) returning * into v_row;

  perform public._ome_log(v_org_id, 'memory_captured', 'memory_record', v_row.id,
    jsonb_build_object('category', p_category, 'capture_source', p_capture_source));

  return public._ome_record_json(v_row) || jsonb_build_object('captured', true);
end; $$;

create or replace function public.search_organization_memory_records(
  p_query text default '',
  p_category text default null,
  p_status text default 'active',
  p_limit int default 20
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return coalesce((
    select jsonb_agg(public._ome_record_json(r) order by r.updated_at desc)
    from public.organization_memory_records r
    where r.organization_id = v_org_id
      and (p_status is null or r.status = p_status)
      and (p_category is null or r.category = p_category)
      and public._ome_can_view_visibility(r.visibility, r.created_by, v_org_id)
      and (
        p_query = '' or p_query is null
        or to_tsvector('simple', coalesce(r.title, '') || ' ' || coalesce(r.summary, ''))
           @@ plainto_tsquery('simple', p_query)
      )
    limit greatest(1, least(p_limit, 100))
  ), '[]'::jsonb);
end; $$;

create or replace function public.list_organization_memory_decisions(
  p_status text default null,
  p_limit int default 20
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return coalesce((
    select jsonb_agg(public._ome_decision_json(d) order by d.updated_at desc)
    from public.organization_decision_register d
    where d.organization_id = v_org_id
      and (p_status is null or d.status = p_status)
    limit greatest(1, least(p_limit, 100))
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_memory_settings;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');
  v_settings := public._ome_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Experience creates wisdom. Wisdom deserves to be preserved — metadata summaries only, human-governed retention.',
    'principles', jsonb_build_array(
      'Tenant-aware memory with visibility controls',
      'Human-governed retention and scheduled reviews',
      'Explainable usage with source references',
      'Metadata-only summaries — never raw chat or PII',
      'Distinct from PAME personal memories and Learning Engine'
    ),
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'active_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'archived_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'archived'
      ), 0),
      'active_decisions', coalesce((
        select count(*) from public.organization_decision_register
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
      ), 0)
    ),
    'recent_learnings', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.created_at desc)
      from public.organization_memory_records r
      where r.organization_id = v_org_id and r.status = 'active'
        and public._ome_can_view_visibility(r.visibility, r.created_by, v_org_id)
      limit 10
    ), '[]'::jsonb),
    'recurring_themes', coalesce((
      select jsonb_agg(jsonb_build_object('category', sub.category, 'count', sub.cnt) order by sub.cnt desc)
      from (
        select category, count(*) as cnt
        from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        group by category
      ) sub
    ), '[]'::jsonb),
    'frequently_referenced', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.reference_count desc, r.updated_at desc)
      from public.organization_memory_records r
      where r.organization_id = v_org_id and r.status = 'active' and r.reference_count > 0
        and public._ome_can_view_visibility(r.visibility, r.created_by, v_org_id)
      limit 8
    ), '[]'::jsonb),
    'archived_decisions', coalesce((
      select jsonb_agg(public._ome_decision_json(d) order by d.updated_at desc)
      from public.organization_decision_register d
      where d.organization_id = v_org_id and d.status in ('archived', 'superseded')
      limit 10
    ), '[]'::jsonb),
    'recommended_reviews', coalesce((
      select jsonb_agg(row_to_json(rv) order by rv.scheduled_at)
      from public.organization_memory_reviews rv
      where rv.organization_id = v_org_id and rv.status in ('scheduled', 'overdue')
      limit 10
    ), '[]'::jsonb),
    'privacy_note', 'Organizational memory stores metadata summaries only. No raw email, chat, or PII.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_memory_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return jsonb_build_object(
    'has_organization', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'pending_reviews', coalesce((
      select count(*) from public.organization_memory_reviews
      where organization_id = v_org_id and status in ('scheduled', 'overdue')
    ), 0),
    'philosophy', 'Organizational wisdom preserved — metadata only.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-memory-engine', 'Organizational Memory Engine', 'Tenant-aware organizational memory with metadata summaries, decision register, and scheduled reviews.', 'authenticated', 72
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'organizational-memory-engine' and tenant_id is null);

grant execute on function public.create_organization_memory_record(text, text, text, jsonb, text, text) to authenticated;
grant execute on function public.update_organization_memory_record(uuid, text, text, jsonb, text, text, text) to authenticated;
grant execute on function public.perform_organization_memory_action(uuid, text, jsonb) to authenticated;
grant execute on function public.create_organization_decision_register_entry(text, text, text, text, date, uuid) to authenticated;
grant execute on function public.schedule_organization_memory_review(text, timestamptz, uuid, uuid) to authenticated;
grant execute on function public.complete_organization_memory_review(uuid, text) to authenticated;
grant execute on function public.save_organization_memory_settings(int, jsonb, boolean, int) to authenticated;
grant execute on function public.capture_organization_memory(text, text, text, text, jsonb, text) to authenticated;
grant execute on function public.search_organization_memory_records(text, text, text, int) to authenticated;
grant execute on function public.list_organization_memory_decisions(text, int) to authenticated;
grant execute on function public.get_organizational_memory_engine_dashboard() to authenticated;
grant execute on function public.get_organizational_memory_engine_card() to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ome_ensure_settings(v_org_id);
  end loop;
end $$;
