-- Bootstrap prerequisites for Unonight pilot (Phase 57) on databases missing phases 42–55.
-- Idempotent — safe to re-run.

-- tenant_modules (Phase 42 core)
create table if not exists public.tenant_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  module_key text not null,
  suite_key text,
  enabled boolean not null default true,
  licensed boolean not null default false,
  status text not null default 'enabled' check (
    status in ('enabled', 'disabled', 'trial', 'beta', 'deprecated', 'enterprise_only')
  ),
  activated_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, module_key)
);

create index if not exists tenant_modules_tenant_idx
  on public.tenant_modules (tenant_id, licensed, enabled);

alter table public.tenant_modules enable row level security;
revoke all on public.tenant_modules from authenticated, anon;

-- Trust & governance (Phase 54 subset)
create table if not exists public.aipify_governance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  governance_mode text not null default 'safe' check (
    governance_mode in ('safe', 'balanced', 'autonomous_low_risk', 'enterprise_control')
  ),
  approval_defaults jsonb not null default '{"require_medium_risk": true, "require_high_risk": true}'::jsonb,
  emergency_controls_enabled boolean not null default true,
  explainability_enabled boolean not null default true,
  trust_scoring_enabled boolean not null default true,
  audit_retention_days int not null default 365,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_governance_settings enable row level security;
revoke all on public.aipify_governance_settings from authenticated, anon;

create table if not exists public.aipify_approval_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  title text not null,
  summary text not null,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  explanation text,
  approval_scope text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired', 'cancelled', 'paused')
  ),
  requested_by_ai boolean not null default false,
  requested_by_user_id uuid references public.users (id) on delete set null,
  approved_by_user_id uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  source_type text not null default 'governance' check (
    source_type in ('governance', 'action_request', 'automation', 'aef_action', 'insight', 'prediction')
  ),
  source_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_approval_requests enable row level security;
revoke all on public.aipify_approval_requests from authenticated, anon;

create table if not exists public.aipify_action_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  permission_level text not null default 'approval_required' check (
    permission_level in ('allowed', 'approval_required', 'blocked')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  requires_approval boolean not null default true,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, action_key)
);

alter table public.aipify_action_permissions enable row level security;
revoke all on public.aipify_action_permissions from authenticated, anon;

create table if not exists public.aipify_emergency_stop_state (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  enabled boolean not null default false,
  reason text,
  activated_by_user_id uuid references public.users (id) on delete set null,
  activated_at timestamptz,
  auto_resume boolean not null default false,
  resumed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.aipify_emergency_stop_state enable row level security;
revoke all on public.aipify_emergency_stop_state from authenticated, anon;

create or replace function public._tacc_is_emergency_active(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select e.enabled from public.aipify_emergency_stop_state e where e.tenant_id = p_tenant_id),
    false
  );
$$;

-- Knowledge center (Phase 55 subset)
create table if not exists public.aipify_knowledge_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  parent_category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  slug text not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  visibility text not null default 'admin_and_support' check (
    visibility in ('public', 'authenticated', 'admin_and_support', 'internal')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_knowledge_categories enable row level security;
revoke all on public.aipify_knowledge_categories from authenticated, anon;

create table if not exists public.aipify_knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  slug text not null,
  title text not null,
  summary text,
  body text not null default '',
  format text not null default 'markdown' check (format in ('markdown', 'plain_text', 'html_safe')),
  language text not null default 'en',
  article_type text not null default 'faq' check (
    article_type in ('faq', 'guide', 'troubleshooting', 'policy', 'api_doc', 'release_note', 'onboarding', 'internal_note')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'archived')
  ),
  visibility text not null default 'admin_and_support' check (
    visibility in ('public', 'authenticated', 'admin_and_support', 'internal')
  ),
  tags text[] not null default '{}',
  keywords text[] not null default '{}',
  source_path text,
  is_global boolean not null default false,
  priority int not null default 0,
  owner_user_id uuid references public.users (id) on delete set null,
  last_reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_knowledge_articles enable row level security;
revoke all on public.aipify_knowledge_articles from authenticated, anon;

create table if not exists public.aipify_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  question text not null,
  normalized_question text,
  language text,
  source_type text not null default 'support_chat' check (
    source_type in ('support_chat', 'admin_chat', 'onboarding', 'api', 'internal', 'customer_email')
  ),
  source_id text,
  user_id uuid references public.users (id) on delete set null,
  frequency_count int not null default 1,
  confidence_score numeric(4, 2),
  suggested_category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  suggested_title text,
  suggested_answer_draft text,
  status text not null default 'open' check (
    status in ('open', 'reviewing', 'in_review', 'drafted', 'article_created', 'dismissed', 'merged')
  ),
  assigned_user_id uuid references public.users (id) on delete set null,
  related_article_id uuid references public.aipify_knowledge_articles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_knowledge_gaps enable row level security;
revoke all on public.aipify_knowledge_gaps from authenticated, anon;

-- Workflow definitions (Phase 51 subset — no org unit FK)
create table if not exists public.aipify_workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  workflow_key text not null,
  description text,
  category text not null default 'internal' check (
    category in (
      'support', 'sales', 'onboarding', 'moderation', 'ecommerce',
      'finance', 'marketing', 'internal'
    )
  ),
  expected_response_time_minutes int,
  expected_completion_time_minutes int,
  owner_unit_id uuid,
  owner_user_id uuid references public.users (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);

create index if not exists aipify_workflow_definitions_tenant_idx
  on public.aipify_workflow_definitions (tenant_id, active);

alter table public.aipify_workflow_definitions enable row level security;
revoke all on public.aipify_workflow_definitions from authenticated, anon;

grant execute on function public._tacc_is_emergency_active(uuid) to authenticated;

-- Stubs required by provision_pilot_tenant (Phase 54 TACC) when Phase 54 is not yet applied
do $stub$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    join pg_type t on t.oid = p.prorettype
    where n.nspname = 'public'
      and p.proname = 'ensure_tacc_emergency_stop'
      and t.typname = 'aipify_emergency_stop_state'
  ) then
    null;
  else
    drop function if exists public.ensure_tacc_emergency_stop(uuid);
    execute $sql$
      create function public.ensure_tacc_emergency_stop(p_tenant_id uuid)
      returns void language plpgsql security definer set search_path = public as $fn$
      begin
        insert into public.aipify_emergency_stop_state (tenant_id, enabled)
        values (p_tenant_id, false)
        on conflict (tenant_id) do nothing;
      end;
      $fn$;
    $sql$;
  end if;

  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'seed_tacc_action_permissions'
  ) then
    execute $sql$
      create function public.seed_tacc_action_permissions(p_tenant_id uuid)
      returns void language plpgsql security definer set search_path = public as $fn$
      begin null; end;
      $fn$;
    $sql$;
  end if;
end $stub$;
