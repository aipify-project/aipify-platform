-- Phase 556 — Companion Skills Ecosystem, Specialist Marketplace & Capability Engine
-- Capability layer: Companion gains expertise through approved skills — organizations decide scope.
-- Feature owner: CUSTOMER APP. Routes: /app/companion/skills, /app/companion/skills/marketplace, /app/companion/skills/training

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_skills_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  skills_ecosystem_enabled boolean not null default true,
  marketplace_enabled boolean not null default true,
  training_enabled boolean not null default true,
  governance_required boolean not null default true,
  explicit_permissions_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_skills_settings enable row level security;
revoke all on public.organization_companion_skills_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Skill registry & marketplace
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_skills_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  skill_key text not null,
  skill_id_label text not null,
  skill_name text not null,
  category text not null default 'operations' check (
    category in (
      'operations', 'finance', 'sales', 'marketing', 'projects', 'support', 'people',
      'inventory', 'procurement', 'risk', 'compliance', 'executive', 'industry', 'custom'
    )
  ),
  description text not null default '' check (char_length(description) <= 500),
  version_label text not null default '1.0.0',
  provider_label text not null default 'Aipify',
  permissions jsonb not null default '[]'::jsonb,
  knowledge_sources jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  business_packs jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (
    status in ('active', 'installing', 'requires_attention', 'permission_required', 'disabled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, skill_key)
);

alter table public.organization_companion_skills_registry enable row level security;
revoke all on public.organization_companion_skills_registry from authenticated, anon;

create table if not exists public.organization_companion_skills_marketplace (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  marketplace_key text not null,
  skill_name text not null,
  category text not null default 'operations',
  description text not null default '' check (char_length(description) <= 500),
  version_label text not null default '1.0.0',
  provider_label text not null default 'Aipify',
  required_permissions jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  install_status text not null default 'available' check (
    install_status in ('available', 'installing', 'installed', 'update_available')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, marketplace_key)
);

alter table public.organization_companion_skills_marketplace enable row level security;
revoke all on public.organization_companion_skills_marketplace from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Specialists, knowledge sources, training, profiles, bundles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_skills_specialists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  specialist_key text not null,
  specialist_name text not null,
  specialist_type text not null,
  composed_skills jsonb not null default '[]'::jsonb,
  capability_summary text not null default '' check (char_length(capability_summary) <= 500),
  usage_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'training', 'disabled')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, specialist_key)
);

alter table public.organization_companion_skills_specialists enable row level security;
revoke all on public.organization_companion_skills_specialists from authenticated, anon;

create table if not exists public.organization_companion_skills_knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_key text not null,
  source_type text not null check (
    source_type in (
      'knowledge_center', 'document', 'policy', 'playbook', 'business_pack', 'connector', 'approved_external'
    )
  ),
  source_label text not null,
  governed boolean not null default true,
  linked_skills jsonb not null default '[]'::jsonb,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, source_key)
);

alter table public.organization_companion_skills_knowledge_sources enable row level security;
revoke all on public.organization_companion_skills_knowledge_sources from authenticated, anon;

create table if not exists public.organization_companion_skills_training (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  training_key text not null,
  skill_key text not null,
  skill_label text not null,
  specialist_key text not null default '',
  training_source text not null default 'policy',
  source_label text not null,
  progress_pct integer not null default 0 check (progress_pct between 0 and 100),
  status text not null default 'in_progress' check (
    status in ('pending', 'in_progress', 'completed', 'recommended')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, training_key)
);

alter table public.organization_companion_skills_training enable row level security;
revoke all on public.organization_companion_skills_training from authenticated, anon;

create table if not exists public.organization_companion_skills_capability_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  profile_name text not null,
  specialist_type text not null,
  capabilities jsonb not null default '[]'::jsonb,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, profile_key)
);

alter table public.organization_companion_skills_capability_profiles enable row level security;
revoke all on public.organization_companion_skills_capability_profiles from authenticated, anon;

create table if not exists public.organization_companion_skills_capability_bundles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  bundle_key text not null,
  bundle_name text not null,
  bundle_type text not null default 'custom',
  included_skills jsonb not null default '[]'::jsonb,
  install_status text not null default 'available' check (
    install_status in ('available', 'partial', 'installed')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, bundle_key)
);

alter table public.organization_companion_skills_capability_bundles enable row level security;
revoke all on public.organization_companion_skills_capability_bundles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Business pack skills, health, audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_skills_business_pack_skills (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_label text not null,
  provided_skills jsonb not null default '[]'::jsonb,
  knowledge_modules jsonb not null default '[]'::jsonb,
  capabilities jsonb not null default '[]'::jsonb,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, pack_key)
);

alter table public.organization_companion_skills_business_pack_skills enable row level security;
revoke all on public.organization_companion_skills_business_pack_skills from authenticated, anon;

create table if not exists public.organization_companion_skills_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  skill_key text not null,
  skill_label text not null,
  usage_score integer not null default 70 check (usage_score between 0 and 100),
  accuracy_score integer not null default 75 check (accuracy_score between 0 and 100),
  recommendation_score integer not null default 72 check (recommendation_score between 0 and 100),
  training_status text not null default 'in_progress',
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  business_value_score integer not null default 70 check (business_value_score between 0 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'needs_attention', 'review_required')
  ),
  summary text not null default '',
  updated_at timestamptz not null default now(),
  unique (organization_id, skill_key)
);

alter table public.organization_companion_skills_health enable row level security;
revoke all on public.organization_companion_skills_health from authenticated, anon;

create table if not exists public.organization_companion_skills_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'skill_installed', 'skill_removed', 'skill_trained', 'skill_activated',
      'permission_granted', 'capability_added', 'specialist_created', 'skill_updated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_skills_audit_logs_org_idx
  on public.organization_companion_skills_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_skills_audit_logs enable row level security;
revoke all on public.organization_companion_skills_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._csk556_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._csk556_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_skills_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._csk556_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_skills_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._csk556_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_skills_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_skills_registry (
    organization_id, skill_key, skill_id_label, skill_name, category, description,
    version_label, permissions, knowledge_sources, business_packs, status
  ) values
    (p_org_id, 'skill_exec_brief', 'CSK-EXE-001', 'Executive Briefing Skill', 'executive',
     'Generates executive briefings from approved organizational data.',
     '1.2.0', '["read","analyze","summarize","recommend","prepare"]'::jsonb,
     '["Knowledge Center","Executive Policies"]'::jsonb, '["Executive Pack"]'::jsonb, 'active'),
    (p_org_id, 'skill_support_triage', 'CSK-SUP-001', 'Support Triage Skill', 'support',
     'Triages support cases using approved knowledge and escalation rules.',
     '1.1.0', '["read","analyze","summarize","recommend","escalate"]'::jsonb,
     '["Knowledge Center","Support Playbooks"]'::jsonb, '["Support Pack"]'::jsonb, 'active'),
    (p_org_id, 'skill_revenue_forecast', 'CSK-REV-001', 'Revenue Forecast Skill', 'finance',
     'Prepares revenue forecasts from subscription and pipeline metadata.',
     '1.0.0', '["read","analyze","summarize","recommend"]'::jsonb,
     '["Financial Policies","Revenue Reports"]'::jsonb, '["Finance Pack"]'::jsonb, 'requires_attention');

  insert into public.organization_companion_skills_marketplace (
    organization_id, marketplace_key, skill_name, category, description, required_permissions, install_status, summary
  ) values
    (p_org_id, 'mkt_contract_analysis', 'Contract Analysis Skill', 'compliance',
     'Analyzes contracts using approved legal templates and policies.',
     '["read","analyze","summarize","recommend"]'::jsonb, 'available', 'Install for contract review assistance.'),
    (p_org_id, 'mkt_meeting_prep', 'Meeting Preparation Skill', 'executive',
     'Prepares meeting briefs from calendar and knowledge sources.',
     '["read","analyze","prepare"]'::jsonb, 'available', 'Install for executive meeting preparation.'),
    (p_org_id, 'mkt_inventory_forecast', 'Inventory Forecast Skill', 'inventory',
     'Forecasts inventory needs from warehouse operational metadata.',
     '["read","analyze","recommend","monitor"]'::jsonb, 'available', 'Install for warehouse operations.'),
    (p_org_id, 'mkt_partner_intel', 'Partner Intelligence Skill', 'sales',
     'Provides partner performance insights from approved aggregates.',
     '["read","analyze","summarize"]'::jsonb, 'update_available', 'Update available for partner intelligence.');

  insert into public.organization_companion_skills_specialists (
    organization_id, specialist_key, specialist_name, specialist_type, composed_skills, capability_summary, usage_count
  ) values
    (p_org_id, 'spec_support', 'Support Companion', 'support',
     '["Support Triage Skill","Knowledge Search"]'::jsonb, 'Cases, escalations, knowledge, customer success.', 124),
    (p_org_id, 'spec_executive', 'Executive Companion', 'executive',
     '["Executive Briefing Skill","Revenue Forecast Skill"]'::jsonb, 'Forecasting, strategy, risks, executive briefings.', 86),
    (p_org_id, 'spec_finance', 'Finance Companion', 'finance',
     '["Revenue Forecast Skill"]'::jsonb, 'Financial policies, procedures, reports.', 52);

  insert into public.organization_companion_skills_knowledge_sources (
    organization_id, source_key, source_type, source_label, governed, linked_skills, summary
  ) values
    (p_org_id, 'src_knowledge_center', 'knowledge_center', 'Knowledge Center', true,
     '["Executive Briefing Skill","Support Triage Skill"]'::jsonb, 'Approved organizational knowledge base.'),
    (p_org_id, 'src_support_playbooks', 'playbook', 'Support Playbooks', true,
     '["Support Triage Skill"]'::jsonb, 'Support procedure playbooks — governed access.'),
    (p_org_id, 'src_financial_policies', 'policy', 'Financial Policies', true,
     '["Revenue Forecast Skill"]'::jsonb, 'Finance policy documents for skill training.');

  insert into public.organization_companion_skills_training (
    organization_id, training_key, skill_key, skill_label, specialist_key, training_source, source_label, progress_pct, status, summary
  ) values
    (p_org_id, 'tr_finance_policies', 'skill_revenue_forecast', 'Revenue Forecast Skill', 'spec_finance',
     'policy', 'Financial Policies', 100, 'completed', 'Finance Companion trained on financial policies.'),
    (p_org_id, 'tr_exec_brief', 'skill_exec_brief', 'Executive Briefing Skill', 'spec_executive',
     'playbook', 'Executive Briefing Playbook', 65, 'in_progress', 'Executive briefing standards training in progress.');

  insert into public.organization_companion_skills_capability_profiles (
    organization_id, profile_key, profile_name, specialist_type, capabilities, summary
  ) values
    (p_org_id, 'prof_executive', 'Executive Companion Profile', 'executive',
     '["Forecasting","Strategy","Risks","Executive Briefings"]'::jsonb, 'Executive capability profile.'),
    (p_org_id, 'prof_support', 'Support Companion Profile', 'support',
     '["Cases","Escalations","Knowledge","Customer Success"]'::jsonb, 'Support capability profile.');

  insert into public.organization_companion_skills_capability_bundles (
    organization_id, bundle_key, bundle_name, bundle_type, included_skills, install_status, summary
  ) values
    (p_org_id, 'bundle_executive', 'Executive Bundle', 'executive',
     '["Executive Briefing Skill","Meeting Preparation Skill","Revenue Forecast Skill"]'::jsonb, 'partial',
     'Executive bundle — partial install.'),
    (p_org_id, 'bundle_support', 'Support Bundle', 'support',
     '["Support Triage Skill","Customer Success Skill"]'::jsonb, 'installed', 'Support bundle fully installed.'),
    (p_org_id, 'bundle_warehouse', 'Warehouse Bundle', 'inventory',
     '["Inventory Forecast Skill"]'::jsonb, 'available', 'Warehouse bundle available for install.');

  insert into public.organization_companion_skills_business_pack_skills (
    organization_id, pack_key, pack_label, provided_skills, knowledge_modules, capabilities, summary
  ) values
    (p_org_id, 'finance_pack', 'Finance Pack', '["Revenue Forecast Skill"]'::jsonb,
     '["Financial Policies"]'::jsonb, '["Forecasting","Reporting"]'::jsonb, 'Finance Pack skills and knowledge.'),
    (p_org_id, 'support_pack', 'Support Pack', '["Support Triage Skill"]'::jsonb,
     '["Support Playbooks"]'::jsonb, '["Triage","Escalation"]'::jsonb, 'Support Pack skills.'),
    (p_org_id, 'hosts_pack', 'Hosts Pack', '["Property Operations Skill"]'::jsonb,
     '["Hospitality Procedures"]'::jsonb, '["Guest Operations"]'::jsonb, 'Hospitality Pack skills.');

  insert into public.organization_companion_skills_health (
    organization_id, skill_key, skill_label, usage_score, accuracy_score, recommendation_score,
    training_status, performance_score, business_value_score, health_status, summary
  ) values
    (p_org_id, 'skill_exec_brief', 'Executive Briefing Skill', 88, 92, 90, 'completed', 91, 85, 'healthy',
     'High usage with strong accuracy and business value.'),
    (p_org_id, 'skill_support_triage', 'Support Triage Skill', 82, 86, 84, 'completed', 87, 80, 'healthy',
     'Healthy support triage skill performance.'),
    (p_org_id, 'skill_revenue_forecast', 'Revenue Forecast Skill', 45, 68, 62, 'in_progress', 65, 58, 'needs_attention',
     'Needs attention — training incomplete, lower accuracy.');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_skills_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
begin
  v_org_id := public._csk556_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._csk556_ensure_settings(v_org_id);
  perform public._csk556_seed(v_org_id);

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'The Companion should not know everything by default. The Companion gains expertise through approved skills. Organizations decide what Companion knows and can do.',
    'governance_note', 'Every knowledge source must be governed. Skills must never bypass governance.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', jsonb_build_object(
      'installed_skills', (select count(*) from public.organization_companion_skills_registry where organization_id = v_org_id),
      'active_skills', (select count(*) from public.organization_companion_skills_registry where organization_id = v_org_id and status = 'active'),
      'marketplace_available', (select count(*) from public.organization_companion_skills_marketplace where organization_id = v_org_id and install_status = 'available'),
      'specialists', (select count(*) from public.organization_companion_skills_specialists where organization_id = v_org_id),
      'knowledge_sources', (select count(*) from public.organization_companion_skills_knowledge_sources where organization_id = v_org_id),
      'training_in_progress', (select count(*) from public.organization_companion_skills_training where organization_id = v_org_id and status in ('pending', 'in_progress')),
      'capability_bundles', (select count(*) from public.organization_companion_skills_capability_bundles where organization_id = v_org_id),
      'skills_needing_attention', (select count(*) from public.organization_companion_skills_health where organization_id = v_org_id and health_status != 'healthy')
    ),
    'skill_registry', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.skill_name)
      from public.organization_companion_skills_registry s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'skill_marketplace', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.skill_name)
      from public.organization_companion_skills_marketplace m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'specialist_framework', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.usage_count desc)
      from public.organization_companion_skills_specialists s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'knowledge_source_governance', coalesce((
      select jsonb_agg(to_jsonb(k) order by k.source_label)
      from public.organization_companion_skills_knowledge_sources k where k.organization_id = v_org_id
    ), '[]'::jsonb),
    'skill_permissions', jsonb_build_object(
      'allowed_actions', jsonb_build_array(
        'read', 'analyze', 'summarize', 'recommend', 'prepare', 'monitor', 'execute_approved_actions'
      ),
      'explicit_required', true,
      'governance_required', true
    ),
    'training_engine', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.updated_at desc)
      from public.organization_companion_skills_training t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'capability_profiles', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.profile_name)
      from public.organization_companion_skills_capability_profiles p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'capability_bundles', coalesce((
      select jsonb_agg(to_jsonb(b) order by b.bundle_name)
      from public.organization_companion_skills_capability_bundles b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'business_pack_integration', coalesce((
      select jsonb_agg(to_jsonb(b) order by b.pack_label)
      from public.organization_companion_skills_business_pack_skills b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'skill_health_monitoring', coalesce((
      select jsonb_agg(to_jsonb(h) order by h.performance_score desc)
      from public.organization_companion_skills_health h where h.organization_id = v_org_id
    ), '[]'::jsonb),
    'installation_workflow', jsonb_build_object(
      'steps', jsonb_build_array(
        'marketplace', 'select_skill', 'review_permissions', 'review_dependencies',
        'approve', 'install', 'train', 'activate'
      )
    ),
    'companion_skill_advisor', jsonb_build_object(
      'advisor_prompts', jsonb_build_array(
        'Which skills are currently installed?',
        'Which skills are underused?',
        'What skills should we install next?',
        'Which specialist would help our organization most?',
        'Review skill health and training recommendations.'
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'installed_skills', (select count(*) from public.organization_companion_skills_registry where organization_id = v_org_id),
      'skill_adoption', coalesce((select round(avg(usage_score))::int from public.organization_companion_skills_health where organization_id = v_org_id), 0),
      'skill_performance', coalesce((select round(avg(performance_score))::int from public.organization_companion_skills_health where organization_id = v_org_id), 0),
      'capability_coverage', (select count(*) from public.organization_companion_skills_capability_profiles where organization_id = v_org_id),
      'specialist_usage', (select coalesce(sum(usage_count), 0) from public.organization_companion_skills_specialists where organization_id = v_org_id),
      'training_active', (select count(*) from public.organization_companion_skills_training where organization_id = v_org_id and status = 'in_progress')
    ),
    'reports', jsonb_build_object(
      'skill_usage', (select count(*) from public.organization_companion_skills_registry where organization_id = v_org_id and status = 'active'),
      'skill_performance', coalesce((select round(avg(performance_score))::int from public.organization_companion_skills_health where organization_id = v_org_id), 0),
      'capability_growth', (select count(*) from public.organization_companion_skills_capability_bundles where organization_id = v_org_id),
      'specialist_adoption', (select count(*) from public.organization_companion_skills_specialists where organization_id = v_org_id),
      'training_activity', (select count(*) from public.organization_companion_skills_training where organization_id = v_org_id)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_companion_skills_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'install_skills', true, 'review_specialists', true, 'review_permissions', true, 'review_training', true, 'review_performance', true
    ),
    'routes', jsonb_build_object(
      'skills_center', '/app/companion/skills',
      'marketplace', '/app/companion/skills/marketplace',
      'training', '/app/companion/skills/training',
      'legacy_marketplace', '/app/companion-marketplace',
      'skills_workspace', '/app/skills'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_companion_skills_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_mkt record;
begin
  perform public._bde_require_admin();
  v_org_id := public._csk556_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'install_skill' then
    select * into v_mkt from public.organization_companion_skills_marketplace
    where organization_id = v_org_id and marketplace_key = coalesce(p_payload->>'marketplace_key', marketplace_key)
    limit 1;

    insert into public.organization_companion_skills_registry (
      organization_id, skill_key, skill_id_label, skill_name, category, description,
      permissions, status
    ) values (
      v_org_id,
      coalesce(p_payload->>'skill_key', 'skill_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'skill_id_label', 'CSK-NEW-001'),
      coalesce(p_payload->>'skill_name', coalesce(v_mkt.skill_name, 'New Skill')),
      coalesce(p_payload->>'category', coalesce(v_mkt.category, 'custom')),
      coalesce(p_payload->>'description', coalesce(v_mkt.description, '')),
      coalesce(v_mkt.required_permissions, '["read","analyze"]'::jsonb),
      'installing'
    );

    if v_mkt.marketplace_key is not null then
      update public.organization_companion_skills_marketplace
      set install_status = 'installed' where organization_id = v_org_id and marketplace_key = v_mkt.marketplace_key;
    end if;

    perform public._csk556_log(v_org_id, 'skill_installed', 'Skill installation initiated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'activate_skill' then
    update public.organization_companion_skills_registry
    set status = 'active', updated_at = now()
    where organization_id = v_org_id and skill_key = coalesce(p_payload->>'skill_key', skill_key);
    perform public._csk556_log(v_org_id, 'skill_activated', 'Skill activated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'remove_skill' then
    update public.organization_companion_skills_registry
    set status = 'disabled', updated_at = now()
    where organization_id = v_org_id and skill_key = coalesce(p_payload->>'skill_key', skill_key);
    perform public._csk556_log(v_org_id, 'skill_removed', 'Skill disabled.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'complete_training' then
    update public.organization_companion_skills_training
    set status = 'completed', progress_pct = 100, updated_at = now()
    where organization_id = v_org_id and training_key = coalesce(p_payload->>'training_key', training_key);
    perform public._csk556_log(v_org_id, 'skill_trained', 'Skill training completed.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'grant_permission' then
    update public.organization_companion_skills_registry
    set permissions = coalesce(p_payload->'permissions', permissions), status = 'active', updated_at = now()
    where organization_id = v_org_id and skill_key = coalesce(p_payload->>'skill_key', skill_key);
    perform public._csk556_log(v_org_id, 'permission_granted', 'Skill permissions granted.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'create_specialist' then
    insert into public.organization_companion_skills_specialists (
      organization_id, specialist_key, specialist_name, specialist_type, composed_skills, capability_summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'specialist_key', 'spec_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'specialist_name', 'New Specialist'),
      coalesce(p_payload->>'specialist_type', 'custom'),
      coalesce(p_payload->'composed_skills', '[]'::jsonb),
      coalesce(p_payload->>'capability_summary', '')
    );
    perform public._csk556_log(v_org_id, 'specialist_created', 'Companion specialist created.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'install_bundle' then
    update public.organization_companion_skills_capability_bundles
    set install_status = 'installed'
    where organization_id = v_org_id and bundle_key = coalesce(p_payload->>'bundle_key', bundle_key);
    perform public._csk556_log(v_org_id, 'capability_added', 'Capability bundle installed.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

create or replace function public.get_organization_companion_skills_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_skills_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'installed_skills', v_center->'overview'->'installed_skills',
    'active_skills', v_center->'overview'->'active_skills',
    'specialists', v_center->'overview'->'specialists',
    'training_in_progress', v_center->'overview'->'training_in_progress',
    'skills_needing_attention', v_center->'overview'->'skills_needing_attention',
    'routes', v_center->'routes',
    'mobile_access', v_center->'mobile_access'
  );
end; $$;

create or replace function public.get_companion_skills_advisor_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_skills_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'governance_note', v_center->'governance_note',
    'advisor', v_center->'companion_skill_advisor',
    'installed_skills', v_center->'skill_registry',
    'marketplace', v_center->'skill_marketplace',
    'health', v_center->'skill_health_monitoring',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_companion_skills_center(text) to authenticated;
grant execute on function public.perform_organization_companion_skills_action(text, jsonb) to authenticated;
grant execute on function public.get_organization_companion_skills_mobile_summary() to authenticated;
grant execute on function public.get_companion_skills_advisor_context(text) to authenticated;
