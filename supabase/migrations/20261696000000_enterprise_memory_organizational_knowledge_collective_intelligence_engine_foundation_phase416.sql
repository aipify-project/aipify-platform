-- Phase 416 — Enterprise Memory, Organizational Knowledge & Collective Intelligence Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/knowledge/memory. Helpers: _gemokci416_*
-- Organizational memory, decision memory, collective intelligence, and knowledge retention.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_memory_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  memory_mode text not null default 'assisted' check (
    memory_mode in ('assisted', 'supervised', 'enterprise')
  ),
  memory_health_score integer not null default 77 check (memory_health_score between 0 and 100),
  knowledge_coverage_percent numeric(5, 2) not null default 0 check (knowledge_coverage_percent between 0 and 100),
  retention_policy jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_memory_sources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_key text not null,
  source_name text not null,
  source_type text not null default 'custom' check (
    source_type in (
      'knowledge_center', 'documents', 'policies', 'procedures', 'meeting_notes',
      'projects', 'emails', 'workflows', 'business_packs', 'industry_packs',
      'companion', 'custom'
    )
  ),
  source_status text not null default 'active' check (
    source_status in ('active', 'paused', 'archived')
  ),
  connection_metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, source_key)
);

create index if not exists organizational_memory_sources_tenant_idx
  on public.organizational_memory_sources (tenant_id, source_type);

create table if not exists public.organizational_memory_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  asset_key text not null,
  asset_title text not null,
  asset_type text not null default 'operational' check (
    asset_type in (
      'policy', 'process', 'best_practice', 'lesson_learned', 'template',
      'playbook', 'operational', 'institutional', 'custom'
    )
  ),
  asset_status text not null default 'active' check (
    asset_status in ('draft', 'active', 'review', 'validated', 'archived')
  ),
  department text not null default '',
  owner_name text not null default '',
  freshness_score integer not null default 75 check (freshness_score between 0 and 100),
  validation_status text not null default 'pending' check (
    validation_status in ('pending', 'validated', 'needs_review', 'outdated')
  ),
  content_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, asset_key)
);

create index if not exists organizational_memory_assets_tenant_idx
  on public.organizational_memory_assets (tenant_id, asset_type);

create table if not exists public.organizational_memory_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  decision_key text not null,
  decision_title text not null,
  decision_owner text not null default '',
  decision_status text not null default 'proposed' check (
    decision_status in (
      'proposed', 'review', 'approved', 'implemented', 'tracked', 'preserved', 'archived'
    )
  ),
  reasoning text not null default '',
  approvals jsonb not null default '[]'::jsonb,
  outcome_summary text not null default '',
  review_at timestamptz,
  historical_context text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, decision_key)
);

create index if not exists organizational_memory_decisions_tenant_idx
  on public.organizational_memory_decisions (tenant_id, decision_status);

create table if not exists public.organizational_memory_operational (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_type text not null default 'project' check (
    record_type in (
      'project', 'workflow', 'incident', 'resolution', 'customer_outcome',
      'operational_change', 'improvement', 'custom'
    )
  ),
  record_status text not null default 'active' check (
    record_status in ('active', 'completed', 'archived')
  ),
  department text not null default '',
  outcome_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, record_key)
);

create index if not exists organizational_memory_operational_tenant_idx
  on public.organizational_memory_operational (tenant_id, record_type);

create table if not exists public.organizational_memory_lessons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  lesson_key text not null,
  lesson_title text not null,
  lesson_type text not null default 'improvement' check (
    lesson_type in (
      'success', 'failure', 'improvement', 'operational_insight',
      'customer_insight', 'implementation', 'growth', 'custom'
    )
  ),
  lesson_summary text not null default '',
  department text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, lesson_key)
);

create index if not exists organizational_memory_lessons_tenant_idx
  on public.organizational_memory_lessons (tenant_id, lesson_type);

create table if not exists public.organizational_memory_retention (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  retention_key text not null,
  retention_title text not null,
  gap_type text not null default 'coverage' check (
    gap_type in (
      'coverage', 'freshness', 'ownership', 'validation', 'aging', 'outdated', 'custom'
    )
  ),
  gap_status text not null default 'open' check (
    gap_status in ('open', 'in_progress', 'resolved', 'archived')
  ),
  priority text not null default 'moderate' check (priority in ('low', 'moderate', 'high')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, retention_key)
);

create index if not exists organizational_memory_retention_tenant_idx
  on public.organizational_memory_retention (tenant_id, gap_status);

create table if not exists public.organizational_memory_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'prior_decision', 'similar_project', 'process_improvement', 'ownership_review',
      'department_gap', 'similar_issue_resolved', 'related_decision', 'historical_context',
      'coverage_improvement', 'outdated_process'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists organizational_memory_advisor_signals_tenant_idx
  on public.organizational_memory_advisor_signals (tenant_id, created_at desc);

create table if not exists public.organizational_memory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'knowledge_added', 'knowledge_updated', 'decision_recorded', 'decision_reviewed',
      'knowledge_validated', 'knowledge_archived', 'memory_policy_updated',
      'knowledge_ownership_changed', 'lesson_captured', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organizational_memory_audit_logs_tenant_idx
  on public.organizational_memory_audit_logs (tenant_id, created_at desc);

alter table public.organizational_memory_settings enable row level security;
alter table public.organizational_memory_sources enable row level security;
alter table public.organizational_memory_assets enable row level security;
alter table public.organizational_memory_decisions enable row level security;
alter table public.organizational_memory_operational enable row level security;
alter table public.organizational_memory_lessons enable row level security;
alter table public.organizational_memory_retention enable row level security;
alter table public.organizational_memory_advisor_signals enable row level security;
alter table public.organizational_memory_audit_logs enable row level security;

revoke all on public.organizational_memory_settings from authenticated, anon;
revoke all on public.organizational_memory_sources from authenticated, anon;
revoke all on public.organizational_memory_assets from authenticated, anon;
revoke all on public.organizational_memory_decisions from authenticated, anon;
revoke all on public.organizational_memory_operational from authenticated, anon;
revoke all on public.organizational_memory_lessons from authenticated, anon;
revoke all on public.organizational_memory_retention from authenticated, anon;
revoke all on public.organizational_memory_advisor_signals from authenticated, anon;
revoke all on public.organizational_memory_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_organizational_memory_engine', v.description
from (values
  ('organizational_memory.view', 'View Organizational Memory', 'View knowledge assets, decision memory, collective intelligence, and retention'),
  ('organizational_memory.manage', 'Manage Organizational Memory', 'Capture decisions, knowledge assets, lessons, validation, and retention policies')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gemokci416_*
-- ---------------------------------------------------------------------------
create or replace function public._gemokci416_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional') then
    raise exception 'Organizational Memory requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gemokci416_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.organizational_memory_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gemokci416_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.organizational_memory_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.organizational_memory_settings;
begin
  insert into public.organizational_memory_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.organizational_memory_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gemokci416_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.organizational_memory_sources where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_memory_sources (tenant_id, source_key, source_name, source_type) values
      (p_tenant_id, 'knowledge-center', 'Knowledge Center', 'knowledge_center'),
      (p_tenant_id, 'documents', 'Documents', 'documents'),
      (p_tenant_id, 'policies', 'Policies', 'policies'),
      (p_tenant_id, 'procedures', 'Procedures', 'procedures'),
      (p_tenant_id, 'workflows', 'Workflows', 'workflows'),
      (p_tenant_id, 'business-packs', 'Business Packs', 'business_packs'),
      (p_tenant_id, 'companion', 'Companion Interactions', 'companion');
  end if;

  if not exists (select 1 from public.organizational_memory_assets where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_memory_assets (
      tenant_id, asset_key, asset_title, asset_type, department, owner_name,
      freshness_score, validation_status, content_summary
    ) values
      (p_tenant_id, 'POL-ONBOARD', 'Employee onboarding policy', 'policy', 'HR', 'People Operations', 82, 'validated', 'Standard onboarding procedures and role expectations.'),
      (p_tenant_id, 'PROC-SUPPORT', 'Support escalation playbook', 'playbook', 'Support', 'Support Lead', 78, 'validated', 'Tiered support escalation and resolution workflow.'),
      (p_tenant_id, 'BP-OPS', 'Operational best practices', 'best_practice', 'Operations', 'Operations Manager', 74, 'needs_review', 'Documented operational improvements from prior quarters.');
  end if;

  if not exists (select 1 from public.organizational_memory_retention where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_memory_retention (
      tenant_id, retention_key, retention_title, gap_type, gap_status, priority, summary
    ) values
      (p_tenant_id, 'gap-finance', 'Finance process documentation gap', 'coverage', 'open', 'moderate', 'Finance department knowledge coverage below target.'),
      (p_tenant_id, 'gap-ownership', 'Policy ownership review needed', 'ownership', 'open', 'high', 'Several policies require assigned owner validation.');
  end if;
end;
$$;

create or replace function public._gemokci416_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.organizational_memory_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.organizational_memory_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'prior_decision',
      'A decision was made previously on a similar topic.',
      'Historical context reduces repeated deliberation and preserves institutional continuity.',
      'Review Decision Memory before approving related operational changes.',
      'low', 'high'
    ),
    (
      p_tenant_id, 'similar_project',
      'A similar project exists in operational memory.',
      'Prior project outcomes can inform planning and reduce implementation risk.',
      'Open Operational Memory and compare project resolutions.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'department_gap',
      'A department knowledge gap was identified.',
      'Knowledge loss risk increases when coverage gaps persist across departments.',
      'Review Knowledge Retention and assign ownership for gap remediation.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'coverage_improvement',
      'Knowledge coverage can be improved in key operational areas.',
      'Stronger coverage improves discovery, continuity, and collective intelligence.',
      'Capture lessons learned and validate outstanding knowledge assets.',
      'moderate', 'moderate'
    );
end;
$$;

create or replace function public._gemokci416_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_assets integer := 0;
  v_documents integer := 0;
  v_decisions integer := 0;
  v_processes integer := 0;
  v_coverage numeric := 0;
  v_health integer := 77;
  v_growth numeric := 0;
  v_sources integer := 0;
begin
  select count(*)::int into v_assets
  from public.organizational_memory_assets
  where tenant_id = p_tenant_id and asset_status != 'archived';

  select count(*)::int into v_documents
  from public.organizational_memory_assets
  where tenant_id = p_tenant_id and asset_type in ('template', 'playbook', 'policy') and asset_status != 'archived';

  select count(*)::int into v_decisions
  from public.organizational_memory_decisions
  where tenant_id = p_tenant_id and decision_status != 'archived';

  select count(*)::int into v_processes
  from public.organizational_memory_assets
  where tenant_id = p_tenant_id and asset_type in ('process', 'playbook', 'operational') and asset_status != 'archived';

  select count(*)::int into v_sources
  from public.organizational_memory_sources
  where tenant_id = p_tenant_id and source_status = 'active';

  select coalesce(knowledge_coverage_percent, 0), coalesce(memory_health_score, 77)
  into v_coverage, v_health
  from public.organizational_memory_settings where tenant_id = p_tenant_id;

  if v_coverage = 0 and v_assets > 0 then
    v_coverage := least(92, 45 + v_assets * 6 + v_sources * 2);
  end if;

  v_growth := round(v_assets * 1.2 + v_decisions * 2.5, 1);

  return jsonb_build_object(
    'knowledge_assets', v_assets,
    'documents', v_documents,
    'decisions_captured', v_decisions,
    'processes_captured', v_processes,
    'knowledge_coverage', round(v_coverage, 1),
    'memory_health_score', v_health,
    'knowledge_growth', v_growth,
    'active_sources', v_sources
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.organizational_memory_settings;
  v_sources jsonb := '[]'::jsonb;
  v_assets jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_operational jsonb := '[]'::jsonb;
  v_lessons jsonb := '[]'::jsonb;
  v_retention jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('organizational_memory.view');
  v_ctx := public._gemokci416_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gemokci416_ensure_settings(v_org_id, v_tenant_id);
  perform public._gemokci416_seed_defaults(v_tenant_id);
  perform public._gemokci416_seed_advisor(v_tenant_id);
  v_overview := public._gemokci416_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'source_key', s.source_key, 'source_name', s.source_name,
    'source_type', s.source_type, 'source_status', s.source_status
  ) order by s.source_name), '[]'::jsonb)
  into v_sources
  from public.organizational_memory_sources s
  where s.tenant_id = v_tenant_id and s.source_status = 'active'
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'asset_key', a.asset_key, 'asset_title', a.asset_title,
    'asset_type', a.asset_type, 'asset_status', a.asset_status,
    'department', a.department, 'owner_name', a.owner_name,
    'freshness_score', a.freshness_score, 'validation_status', a.validation_status
  ) order by a.updated_at desc), '[]'::jsonb)
  into v_assets
  from public.organizational_memory_assets a
  where a.tenant_id = v_tenant_id and a.asset_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'decision_key', d.decision_key, 'decision_title', d.decision_title,
    'decision_owner', d.decision_owner, 'decision_status', d.decision_status,
    'reasoning', d.reasoning, 'outcome_summary', d.outcome_summary,
    'review_at', d.review_at, 'created_at', d.created_at
  ) order by d.updated_at desc), '[]'::jsonb)
  into v_decisions
  from public.organizational_memory_decisions d
  where d.tenant_id = v_tenant_id and d.decision_status != 'archived'
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'record_key', o.record_key, 'record_title', o.record_title,
    'record_type', o.record_type, 'record_status', o.record_status,
    'department', o.department, 'outcome_summary', o.outcome_summary
  ) order by o.updated_at desc), '[]'::jsonb)
  into v_operational
  from public.organizational_memory_operational o
  where o.tenant_id = v_tenant_id and o.record_status != 'archived'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lesson_key', l.lesson_key, 'lesson_title', l.lesson_title,
    'lesson_type', l.lesson_type, 'lesson_summary', l.lesson_summary, 'department', l.department
  ) order by l.updated_at desc), '[]'::jsonb)
  into v_lessons
  from public.organizational_memory_lessons l
  where l.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'retention_key', r.retention_key, 'retention_title', r.retention_title,
    'gap_type', r.gap_type, 'gap_status', r.gap_status, 'priority', r.priority, 'summary', r.summary
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_retention
  from public.organizational_memory_retention r
  where r.tenant_id = v_tenant_id and r.gap_status != 'archived'
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.organizational_memory_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.organizational_memory_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Employees come and go. Projects begin and end. Organizational knowledge should remain.',
    'mission', 'Enterprise Memory & Collective Intelligence — capture, structure, protect, retrieve, and improve organizational knowledge.',
    'abos_principle', 'Knowledge should remain inside the organization — not inside individual employees.',
    'knowledge_center_route', '/app/knowledge-center',
    'distinction_note', 'Enterprise organizational memory — distinct from personal PAME memory and Learning Engine customer learning.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/knowledge/memory'),
      jsonb_build_object('key', 'sources', 'route', '/app/knowledge/memory/sources'),
      jsonb_build_object('key', 'organizational', 'route', '/app/knowledge/memory/organizational'),
      jsonb_build_object('key', 'decisions', 'route', '/app/knowledge/memory/decisions'),
      jsonb_build_object('key', 'operational', 'route', '/app/knowledge/memory/operational'),
      jsonb_build_object('key', 'collective', 'route', '/app/knowledge/memory/collective'),
      jsonb_build_object('key', 'analytics', 'route', '/app/knowledge/memory/analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/knowledge/memory/governance')
    ),
    'knowledge_sources', v_sources,
    'knowledge_assets', v_assets,
    'decisions', v_decisions,
    'operational_memory', v_operational,
    'lessons_learned', v_lessons,
    'retention_items', v_retention,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'sources_route', '/app/knowledge/memory/sources',
      'organizational_route', '/app/knowledge/memory/organizational',
      'decisions_route', '/app/knowledge/memory/decisions',
      'operational_route', '/app/knowledge/memory/operational',
      'collective_route', '/app/knowledge/memory/collective',
      'analytics_route', '/app/knowledge/memory/analytics',
      'governance_route', '/app/knowledge/memory/governance',
      'knowledge_center_route', '/app/knowledge-center',
      'learning_route', '/app/learning'
    ),
    'executive_dashboard', jsonb_build_object(
      'memory_health', v_overview->>'memory_health_score',
      'decision_coverage', v_overview->>'decisions_captured',
      'knowledge_growth', v_overview->>'knowledge_growth',
      'knowledge_coverage', v_overview->>'knowledge_coverage',
      'knowledge_assets', v_overview->>'knowledge_assets',
      'executive_route', '/app/knowledge/memory/analytics'
    ),
    'privacy_note', 'Organizational knowledge isolated per tenant — metadata-first memory with governance and full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.organizational_memory_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_asset_id uuid;
  v_decision_id uuid;
  v_lesson_id uuid;
begin
  perform public._irp_require_permission('organizational_memory.manage');
  v_ctx := public._gemokci416_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gemokci416_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'add_knowledge_asset' then
    insert into public.organizational_memory_assets (
      tenant_id, asset_key, asset_title, asset_type, department, owner_name, content_summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'asset_key', 'KNW-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'asset_title', 'Knowledge asset'),
      coalesce(p_payload->>'asset_type', 'operational'),
      coalesce(p_payload->>'department', ''),
      coalesce(p_payload->>'owner_name', 'Aipify Companion'),
      coalesce(p_payload->>'content_summary', '')
    ) returning id into v_asset_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'knowledge_added', 'Knowledge asset added',
      jsonb_build_object('asset_id', v_asset_id)
    );

    return jsonb_build_object('ok', true, 'asset_id', v_asset_id);
  end if;

  if v_action = 'record_decision' then
    insert into public.organizational_memory_decisions (
      tenant_id, decision_key, decision_title, decision_owner, decision_status,
      reasoning, outcome_summary, historical_context, review_at
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'decision_key', 'DEC-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'decision_title', 'Organizational decision'),
      coalesce(p_payload->>'decision_owner', ''),
      coalesce(p_payload->>'decision_status', 'proposed'),
      coalesce(p_payload->>'reasoning', ''),
      coalesce(p_payload->>'outcome_summary', ''),
      coalesce(p_payload->>'historical_context', ''),
      now() + interval '90 days'
    ) returning id into v_decision_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'decision_recorded', 'Decision recorded in organizational memory',
      jsonb_build_object('decision_id', v_decision_id)
    );

    return jsonb_build_object('ok', true, 'decision_id', v_decision_id);
  end if;

  if v_action = 'capture_lesson' then
    insert into public.organizational_memory_lessons (
      tenant_id, lesson_key, lesson_title, lesson_type, lesson_summary, department
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'lesson_key', 'LSN-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'lesson_title', 'Lesson learned'),
      coalesce(p_payload->>'lesson_type', 'improvement'),
      coalesce(p_payload->>'lesson_summary', ''),
      coalesce(p_payload->>'department', '')
    ) returning id into v_lesson_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'lesson_captured', 'Lesson learned captured',
      jsonb_build_object('lesson_id', v_lesson_id)
    );

    return jsonb_build_object('ok', true, 'lesson_id', v_lesson_id);
  end if;

  if v_action = 'validate_knowledge' then
    update public.organizational_memory_assets
    set
      validation_status = 'validated',
      asset_status = 'validated',
      freshness_score = least(100, freshness_score + 5),
      updated_at = now()
    where tenant_id = v_tenant_id and asset_key = coalesce(p_payload->>'asset_key', 'POL-ONBOARD')
    returning id into v_asset_id;

    update public.organizational_memory_settings
    set memory_health_score = least(100, memory_health_score + 1), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'knowledge_validated', 'Knowledge asset validated',
      jsonb_build_object('asset_id', v_asset_id)
    );

    return jsonb_build_object('ok', true, 'asset_id', v_asset_id);
  end if;

  if v_action = 'archive_knowledge' then
    update public.organizational_memory_assets
    set asset_status = 'archived', updated_at = now()
    where tenant_id = v_tenant_id and asset_key = coalesce(p_payload->>'asset_key', '')
    returning id into v_asset_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'knowledge_archived', 'Knowledge asset archived',
      jsonb_build_object('asset_id', v_asset_id)
    );

    return jsonb_build_object('ok', true, 'asset_id', v_asset_id);
  end if;

  if v_action = 'review_decision' then
    update public.organizational_memory_decisions
    set
      decision_status = 'tracked',
      review_at = now() + interval '90 days',
      updated_at = now()
    where tenant_id = v_tenant_id and decision_key = coalesce(p_payload->>'decision_key', '')
    returning id into v_decision_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'decision_reviewed', 'Decision review completed',
      jsonb_build_object('decision_id', v_decision_id)
    );

    return jsonb_build_object('ok', true, 'decision_id', v_decision_id);
  end if;

  if v_action = 'update_retention_policy' then
    update public.organizational_memory_settings
    set
      retention_policy = coalesce(p_payload->'retention_policy', retention_policy),
      knowledge_coverage_percent = least(100, knowledge_coverage_percent + 2),
      updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gemokci416_log_audit(
      v_tenant_id, 'memory_policy_updated', 'Memory retention policy updated',
      jsonb_build_object('policy', p_payload->'retention_policy')
    );

    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unsupported organizational memory action: %', v_action;
end;
$$;

grant execute on function public.get_organizational_memory_center() to authenticated;
grant execute on function public.organizational_memory_action(jsonb) to authenticated;
