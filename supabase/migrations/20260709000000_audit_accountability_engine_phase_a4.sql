-- Phase A.4 — Audit Log & Accountability Engine
-- Principle: every critical action is logged, tenant-aware, immutable, and traceable.

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
    'identity_permissions', 'secure_ai_action', 'audit_accountability'
  )
);

-- ---------------------------------------------------------------------------
-- 1. audit_logs (canonical unified audit table)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_type text not null default 'user' check (actor_type in ('user', 'ai', 'system')),
  actor_user_id uuid references public.users (id) on delete set null,
  actor_role text,
  action_type text not null,
  entity_type text,
  entity_id uuid,
  action_summary text,
  metadata jsonb not null default '{}'::jsonb,
  ai_involved boolean not null default false,
  approval_required boolean not null default false,
  approval_status text not null default 'not_required' check (
    approval_status in ('not_required', 'pending', 'approved', 'rejected')
  ),
  ip_address text,
  user_agent text,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_org_created_idx
  on public.audit_logs (organization_id, created_at desc);
create index if not exists audit_logs_org_action_idx
  on public.audit_logs (organization_id, action_type);
create index if not exists audit_logs_org_actor_idx
  on public.audit_logs (organization_id, actor_type, ai_involved);
create index if not exists audit_logs_org_entity_idx
  on public.audit_logs (organization_id, entity_type);

alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from authenticated, anon;

-- Immutability: block direct mutation
create or replace function public._ala_prevent_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'Audit log entries are immutable';
end; $$;

drop trigger if exists audit_logs_immutable on public.audit_logs;
create trigger audit_logs_immutable
  before update or delete on public.audit_logs
  for each row execute function public._ala_prevent_audit_mutation();

-- ---------------------------------------------------------------------------
-- 2. audit_log_exports
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log_exports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  exported_by uuid references public.users (id) on delete set null,
  export_format text not null check (export_format in ('csv', 'xlsx', 'pdf')),
  export_filters jsonb not null default '{}'::jsonb,
  record_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.audit_log_exports enable row level security;
revoke all on public.audit_log_exports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. audit_retention_policies
-- ---------------------------------------------------------------------------
create table if not exists public.audit_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  active_retention_months int not null default 12,
  archive_retention_months int,
  enterprise_retention_months int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.audit_retention_policies enable row level security;
revoke all on public.audit_retention_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Backfill from organization_audit_logs
-- ---------------------------------------------------------------------------
insert into public.audit_logs (
  id, organization_id, actor_type, actor_user_id, actor_role, action_type,
  entity_type, entity_id, action_summary, metadata, ai_involved,
  approval_required, approval_status, ip_address, user_agent, created_at
)
select
  l.id, l.organization_id,
  case when l.ai_involved then 'ai' when l.actor_user_id is null then 'system' else 'user' end,
  l.actor_user_id, l.actor_role, l.action_type, l.entity_type, l.entity_id,
  coalesce(l.metadata->>'summary', initcap(replace(l.action_type, '_', ' '))),
  l.metadata, l.ai_involved, l.approval_required,
  coalesce(l.approval_status, case when l.approval_required then 'pending' else 'not_required' end),
  l.ip_address, l.user_agent, l.created_at
from public.organization_audit_logs l
where not exists (select 1 from public.audit_logs a where a.id = l.id);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_ala_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ala_redact_metadata(p_metadata jsonb)
returns jsonb language plpgsql immutable as $$
declare v_result jsonb := p_metadata;
begin
  if v_result ? 'password' then v_result := v_result - 'password'; end if;
  if v_result ? 'secret' then v_result := v_result - 'secret'; end if;
  if v_result ? 'token' then v_result := v_result - 'token'; end if;
  if v_result ? 'credentials' then v_result := v_result - 'credentials'; end if;
  return v_result;
end; $$;

create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'support_reply_sent', 'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

create or replace function public._ala_ensure_retention(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_retention_policies (organization_id)
  values (p_organization_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ala_create_audit_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_actor_type text default 'user',
  p_ai_involved boolean default false,
  p_approval_required boolean default false,
  p_approval_status text default 'not_required',
  p_action_summary text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_ip_address text default null,
  p_user_agent text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_membership public.organization_users;
  v_id uuid;
  v_summary text;
begin
  v_user_id := public._mta_app_user_id();
  begin
    v_membership := public._mta_membership_active(p_organization_id, v_user_id);
  exception when others then
    v_membership := null;
  end;

  v_summary := coalesce(p_action_summary, initcap(replace(p_action_type, '_', ' ')));

  insert into public.audit_logs (
    organization_id, actor_type, actor_user_id, actor_role, action_type,
    entity_type, entity_id, action_summary, metadata, ai_involved,
    approval_required, approval_status, ip_address, user_agent
  ) values (
    p_organization_id,
    case when p_ai_involved then 'ai' when p_actor_type = 'system' then 'system' else coalesce(p_actor_type, 'user') end,
    v_user_id, v_membership.role, p_action_type, p_entity_type, p_entity_id,
    v_summary, public._ala_redact_metadata(p_metadata), p_ai_involved,
    p_approval_required,
    coalesce(nullif(p_approval_status, ''), case when p_approval_required then 'pending' else 'not_required' end),
    p_ip_address, p_user_agent
  ) returning id into v_id;

  return v_id;
end; $$;

-- Bridge legacy helper to canonical audit_logs
create or replace function public._mta_create_audit_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_ai_involved boolean default false,
  p_approval_required boolean default false,
  p_approval_status text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  v_id := public._ala_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id,
    case when p_ai_involved then 'ai' else 'user' end,
    p_ai_involved, p_approval_required,
    coalesce(p_approval_status, case when p_approval_required then 'pending' else 'not_required' end),
    coalesce(p_metadata->>'summary', initcap(replace(p_action_type, '_', ' '))),
    p_metadata
  );

  insert into public.organization_audit_logs (
    id, organization_id, actor_user_id, actor_role, action_type, entity_type, entity_id,
    ai_involved, approval_required, approval_status, metadata
  )
  select
    v_id, organization_id, actor_user_id, actor_role, action_type, entity_type, entity_id,
    ai_involved, approval_required,
    case approval_status when 'not_required' then null else approval_status end,
    metadata
  from public.audit_logs where id = v_id
  on conflict (id) do nothing;

  return v_id;
end; $$;

create or replace function public._ala_seed_demo_events(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ala_ensure_retention(p_organization_id);

  insert into public.audit_logs (
    organization_id, actor_type, action_type, entity_type, action_summary,
    ai_involved, approval_required, approval_status, metadata, created_at
  )
  select p_organization_id, v.actor, v.action, v.entity, v.summary, v.ai, v.approval, v.approval_status, v.meta, now() - v.ago
  from (values
    ('user', 'login', 'user', 'User signed in successfully', false, false, 'not_required', '{}'::jsonb, interval '2 hours'),
    ('user', 'role_changed', 'role', 'Administrator role assigned to team member', false, false, 'not_required', '{"user_id":"demo"}'::jsonb, interval '1 day'),
    ('ai', 'ai_action_suggested', 'ai_action', 'AI suggested support reply draft', true, true, 'pending', '{"action_key":"support_reply"}'::jsonb, interval '45 minutes'),
    ('user', 'ai_action_executed', 'ai_action', 'Low-risk FAQ response executed automatically', true, false, 'not_required', '{"action_key":"faq_response"}'::jsonb, interval '30 minutes'),
    ('system', 'module_enabled', 'module', 'Knowledge Center module enabled', false, false, 'not_required', '{"module_key":"knowledge_center"}'::jsonb, interval '3 days'),
    ('user', 'failed_login', 'user', 'Failed login attempt detected', false, false, 'not_required', '{"attempts":1}'::jsonb, interval '5 days')
  ) as v(actor, action, entity, summary, ai, approval, approval_status, meta, ago)
  where not exists (
    select 1 from public.audit_logs a
    where a.organization_id = p_organization_id and a.action_type = v.action and a.created_at > now() - interval '7 days'
    limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Search & export RPCs
-- ---------------------------------------------------------------------------
create or replace function public.search_audit_logs(p_filters jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('audit.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', l.id, 'actor_type', l.actor_type, 'actor_role', l.actor_role,
      'action_type', l.action_type, 'entity_type', l.entity_type, 'entity_id', l.entity_id,
      'action_summary', l.action_summary, 'ai_involved', l.ai_involved,
      'approval_status', l.approval_status, 'metadata', l.metadata, 'created_at', l.created_at
    ) order by l.created_at desc)
    from public.audit_logs l
    where l.organization_id = v_org_id
      and l.archived_at is null
      and (p_filters->>'action_type' is null or l.action_type = p_filters->>'action_type')
      and (p_filters->>'entity_type' is null or l.entity_type = p_filters->>'entity_type')
      and (p_filters->>'actor_type' is null or l.actor_type = p_filters->>'actor_type')
      and (p_filters->>'approval_status' is null or l.approval_status = p_filters->>'approval_status')
      and (p_filters->>'ai_involved' is null or l.ai_involved = (p_filters->>'ai_involved')::boolean)
      and (p_filters->>'from_date' is null or l.created_at >= (p_filters->>'from_date')::timestamptz)
      and (p_filters->>'to_date' is null or l.created_at <= (p_filters->>'to_date')::timestamptz)
    limit coalesce((p_filters->>'limit')::int, 50)
  ), '[]'::jsonb);
end; $$;

create or replace function public.export_audit_logs(
  p_format text default 'csv',
  p_filters jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_records jsonb;
  v_count int;
  v_export_id uuid;
begin
  perform public._irp_require_permission('audit.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_format not in ('csv', 'xlsx', 'pdf') then
    raise exception 'Unsupported export format';
  end if;

  v_records := public.search_audit_logs(p_filters || jsonb_build_object('limit', 1000));
  v_count := coalesce(jsonb_array_length(v_records), 0);

  insert into public.audit_log_exports (organization_id, exported_by, export_format, export_filters, record_count)
  values (v_org_id, v_user_id, p_format, p_filters, v_count)
  returning id into v_export_id;

  perform public._ala_create_audit_log(
    v_org_id, 'audit_exported', 'organization', v_org_id, 'user', false, false, 'not_required',
    'Audit log export generated',
    jsonb_build_object('export_id', v_export_id, 'format', p_format, 'record_count', v_count, 'filters', p_filters)
  );

  return jsonb_build_object(
    'export_id', v_export_id,
    'format', p_format,
    'record_count', v_count,
    'exported_by', v_user_id,
    'export_timestamp', now(),
    'records', v_records
  );
end; $$;

create or replace function public.get_audit_accountability_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('audit.view');
  v_org_id := public._mta_require_organization();
  perform public._ala_seed_demo_events(v_org_id);
  perform public._ala_ensure_retention(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Transparency, traceability, and trust — every critical action is recorded and immutable.',
    'safety_note', 'Audit logs are tenant-aware. Sensitive data is redacted. Entries cannot be edited or deleted through normal UI.',
    'principles', jsonb_build_array(
      'Every critical action must be logged',
      'Audit logs are tenant-aware',
      'AI involvement is identifiable',
      'Logs are immutable',
      'Sensitive data is protected'
    ),
    'recent_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'actor_type', l.actor_type, 'actor_role', l.actor_role,
        'action_type', l.action_type, 'entity_type', l.entity_type,
        'action_summary', l.action_summary, 'ai_involved', l.ai_involved,
        'approval_status', l.approval_status, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.audit_logs l where l.organization_id = v_org_id and l.archived_at is null limit 15
    ), '[]'::jsonb),
    'pending_approvals', (
      select count(*) from public.audit_logs
      where organization_id = v_org_id and approval_status = 'pending'
    ),
    'ai_activity_timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_type', l.action_type, 'action_summary', l.action_summary,
        'approval_status', l.approval_status, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.audit_logs l
      where l.organization_id = v_org_id and l.ai_involved = true limit 10
    ), '[]'::jsonb),
    'failed_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_type', l.action_type, 'action_summary', l.action_summary, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.audit_logs l
      where l.organization_id = v_org_id and l.action_type in ('failed_login', 'ai_action_failed') limit 10
    ), '[]'::jsonb),
    'security_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_type', l.action_type, 'action_summary', l.action_summary, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.audit_logs l
      where l.organization_id = v_org_id
        and l.action_type in ('login', 'failed_login', 'logout', 'permission_granted', 'permission_removed', 'role_changed')
      limit 10
    ), '[]'::jsonb),
    'top_action_categories', coalesce((
      select jsonb_agg(jsonb_build_object('action_type', t.action_type, 'count', t.cnt) order by t.cnt desc)
      from (
        select action_type, count(*) as cnt
        from public.audit_logs where organization_id = v_org_id and archived_at is null
        group by action_type order by cnt desc limit 8
      ) t
    ), '[]'::jsonb),
    'retention_policy', (
      select jsonb_build_object(
        'active_retention_months', p.active_retention_months,
        'archive_retention_months', p.archive_retention_months,
        'enterprise_retention_months', p.enterprise_retention_months
      )
      from public.audit_retention_policies p where p.organization_id = v_org_id
    ),
    'total_events', (select count(*) from public.audit_logs where organization_id = v_org_id and archived_at is null),
    'ai_events', (select count(*) from public.audit_logs where organization_id = v_org_id and ai_involved = true),
    'export_formats', jsonb_build_array('csv', 'xlsx', 'pdf')
  );
end; $$;

create or replace function public.get_audit_accountability_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'total_events', (select count(*) from public.audit_logs where organization_id = v_org_id and archived_at is null),
    'philosophy', 'Complete accountability for every critical action.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ala_seed_demo_events(v_org_id);
    perform public._ala_ensure_retention(v_org_id);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 7. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'audit-accountability', 'Audit Log & Accountability', 'Immutable audit trails, transparency, and compliance exports.', 'authenticated', 54
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'audit-accountability' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 8. Public create helper + grants
-- ---------------------------------------------------------------------------
create or replace function public.create_audit_log(
  p_action_type text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_actor_type text default 'user',
  p_ai_involved boolean default false,
  p_approval_required boolean default false,
  p_approval_status text default 'not_required',
  p_action_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if not public._ala_should_audit(p_action_type) then
    return null;
  end if;
  v_org_id := public._mta_require_organization();
  return public._ala_create_audit_log(
    v_org_id, p_action_type, p_entity_type, p_entity_id, p_actor_type,
    p_ai_involved, p_approval_required, p_approval_status, p_action_summary, p_metadata
  );
end; $$;

grant execute on function public.create_audit_log(text, text, uuid, text, boolean, boolean, text, text, jsonb) to authenticated;
grant execute on function public.search_audit_logs(jsonb) to authenticated;
grant execute on function public.export_audit_logs(text, jsonb) to authenticated;
grant execute on function public.get_audit_accountability_dashboard() to authenticated;
grant execute on function public.get_audit_accountability_card() to authenticated;
