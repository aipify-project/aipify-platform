-- Phase 344 — Companion Workspace Intelligence Engine
-- Feature owner: CUSTOMER APP (Desktop Companion). Route: /desktop/workspace. Helpers: _cwie344_*

create table if not exists public.companion_workspace_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  workspace_enabled boolean not null default false,
  workspace_analysis_approved boolean not null default false,
  project_discovery_approved boolean not null default false,
  application_awareness_approved boolean not null default false,
  relationship_discovery_approved boolean not null default false,
  local_file_awareness_approved boolean not null default false,
  always_ask_before_learning boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id)
);
alter table public.companion_workspace_settings enable row level security;
revoke all on public.companion_workspace_settings from authenticated, anon;

create table if not exists public.companion_workspace_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  project_key text not null,
  project_label text not null default '',
  parent_project_key text not null default '',
  project_status text not null default 'active' check (
    project_status in ('active', 'recently_active', 'needs_attention', 'dormant', 'archived', 'completed')
  ),
  health_status text not null default 'healthy' check (
    health_status in ('excellent', 'healthy', 'good', 'at_risk', 'dormant', 'completed')
  ),
  priority_level text not null default 'important' check (
    priority_level in ('highest', 'important', 'later', 'archived')
  ),
  last_activity_at timestamptz,
  open_tasks_count integer not null default 0,
  related_files_count integer not null default 0,
  application_hints jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, project_key)
);
create index if not exists companion_workspace_projects_user_idx
  on public.companion_workspace_projects (organization_id, auth_user_id, project_status, priority_level);
alter table public.companion_workspace_projects enable row level security;
revoke all on public.companion_workspace_projects from authenticated, anon;

create table if not exists public.companion_workspace_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  parent_key text not null default '',
  child_key text not null,
  child_label text not null default '',
  relationship_type text not null default 'contains' check (
    relationship_type in ('contains', 'related', 'depends_on', 'brand_assets')
  ),
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, parent_key, child_key)
);
create index if not exists companion_workspace_relationships_user_idx
  on public.companion_workspace_relationships (organization_id, auth_user_id, parent_key);
alter table public.companion_workspace_relationships enable row level security;
revoke all on public.companion_workspace_relationships from authenticated, anon;

create table if not exists public.companion_workspace_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  workflow_key text not null,
  workflow_label text not null default '',
  steps jsonb not null default '[]'::jsonb,
  application_chain text[] not null default '{}',
  workflow_status text not null default 'active' check (
    workflow_status in ('active', 'disabled', 'archived')
  ),
  times_observed integer not null default 1,
  last_observed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, workflow_key)
);
alter table public.companion_workspace_workflows enable row level security;
revoke all on public.companion_workspace_workflows from authenticated, anon;

create table if not exists public.companion_workspace_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  insight_type text not null default 'recommendation' check (
    insight_type in ('recommendation', 'attention', 'organization', 'duplicate', 'documentation', 'workflow')
  ),
  title text not null default '',
  message text not null default '',
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  related_project_key text not null default '',
  insight_status text not null default 'active' check (
    insight_status in ('active', 'dismissed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists companion_workspace_insights_user_idx
  on public.companion_workspace_insights (organization_id, auth_user_id, insight_status, created_at desc);
alter table public.companion_workspace_insights enable row level security;
revoke all on public.companion_workspace_insights from authenticated, anon;

create table if not exists public.companion_workspace_activity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  period_label text not null default '',
  activity_summary text not null default '',
  project_key text not null default '',
  application_name text not null default '',
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists companion_workspace_activity_user_idx
  on public.companion_workspace_activity (organization_id, auth_user_id, occurred_at desc);
alter table public.companion_workspace_activity enable row level security;
revoke all on public.companion_workspace_activity from authenticated, anon;

create table if not exists public.companion_workspace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists companion_workspace_audit_user_idx
  on public.companion_workspace_audit_logs (organization_id, auth_user_id, created_at desc);
alter table public.companion_workspace_audit_logs enable row level security;
revoke all on public.companion_workspace_audit_logs from authenticated, anon;

create or replace function public._cwie344bp_positioning() returns text language sql immutable as $$
  select 'Workspace Intelligence helps Aipify understand projects, relationships and workflows — suggestions only, permission first, never silent scanning.'; $$;

create or replace function public._cwie344_require_user()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'User context required'; end if;
  return jsonb_build_object('organization_id', v_org_id, 'auth_user_id', v_user_id);
end; $$;

create or replace function public._cwie344_log_audit(
  p_org_id uuid, p_user_id uuid, p_event text, p_summary text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_workspace_audit_logs (organization_id, auth_user_id, event_type, summary, metadata)
  values (p_org_id, p_user_id, p_event, left(p_summary, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cwie344_ensure_settings(p_org_id uuid, p_user_id uuid)
returns public.companion_workspace_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_workspace_settings;
begin
  insert into public.companion_workspace_settings (organization_id, auth_user_id)
  values (p_org_id, p_user_id)
  on conflict (organization_id, auth_user_id) do nothing;
  select * into v_row from public.companion_workspace_settings
  where organization_id = p_org_id and auth_user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._cwie344_seed_demo(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.companion_workspace_projects
    where organization_id = p_org_id and auth_user_id = p_user_id limit 1
  ) then return; end if;

  insert into public.companion_workspace_projects (
    organization_id, auth_user_id, project_key, project_label, parent_project_key,
    project_status, health_status, priority_level, last_activity_at, open_tasks_count, related_files_count, application_hints
  ) values
    (p_org_id, p_user_id, 'aipify_companion', 'Companion', 'aipify', 'active', 'excellent', 'highest', now() - interval '5 hours', 2, 8, '["Cursor","Canva"]'::jsonb),
    (p_org_id, p_user_id, 'aipify_investor_deck', 'Investor Deck', 'aipify', 'recently_active', 'good', 'important', now() - interval '2 days', 1, 5, '["Canva","PowerPoint"]'::jsonb),
    (p_org_id, p_user_id, 'aipify_branding', 'Branding', 'aipify', 'active', 'healthy', 'important', now() - interval '1 day', 0, 12, '["Canva","Illustrator"]'::jsonb),
    (p_org_id, p_user_id, 'aipify_desktop_app', 'Desktop App', 'aipify', 'active', 'good', 'highest', now() - interval '8 hours', 3, 6, '["Cursor","VS Code"]'::jsonb),
    (p_org_id, p_user_id, 'aipify_knowledge_center', 'Knowledge Center', 'aipify', 'recently_active', 'healthy', 'later', now() - interval '4 days', 0, 4, '["Cursor"]'::jsonb),
    (p_org_id, p_user_id, 'unonight_marketplace', 'Marketplace', 'unonight', 'needs_attention', 'at_risk', 'important', now() - interval '21 days', 2, 3, '["Canva","Shopify"]'::jsonb),
    (p_org_id, p_user_id, 'unonight_shop', 'Shop', 'unonight', 'dormant', 'dormant', 'later', now() - interval '30 days', 0, 2, '["Shopify"]'::jsonb),
    (p_org_id, p_user_id, 'unonight_mobile_ux', 'Mobile UX', 'unonight', 'recently_active', 'good', 'important', now() - interval '3 days', 1, 4, '["Figma","Canva"]'::jsonb),
    (p_org_id, p_user_id, 'unonight_admin', 'Admin', 'unonight', 'active', 'healthy', 'later', now() - interval '6 days', 0, 1, '["WordPress"]'::jsonb)
  on conflict (organization_id, auth_user_id, project_key) do nothing;

  insert into public.companion_workspace_relationships (
    organization_id, auth_user_id, parent_key, child_key, child_label, relationship_type, sort_order
  ) values
    (p_org_id, p_user_id, 'aipify', 'aipify_companion', 'Companion', 'contains', 10),
    (p_org_id, p_user_id, 'aipify', 'aipify_investor_deck', 'Investor Deck', 'contains', 20),
    (p_org_id, p_user_id, 'aipify', 'aipify_branding', 'Branding', 'contains', 30),
    (p_org_id, p_user_id, 'aipify', 'aipify_desktop_app', 'Desktop App', 'contains', 40),
    (p_org_id, p_user_id, 'aipify', 'aipify_knowledge_center', 'Knowledge Center', 'contains', 50),
    (p_org_id, p_user_id, 'aipify_branding', 'brand_logos', 'Logos', 'brand_assets', 10),
    (p_org_id, p_user_id, 'aipify_branding', 'brand_social', 'Social Media', 'brand_assets', 20),
    (p_org_id, p_user_id, 'aipify_branding', 'brand_presentations', 'Presentations', 'brand_assets', 30),
    (p_org_id, p_user_id, 'unonight', 'unonight_marketplace', 'Marketplace', 'contains', 10),
    (p_org_id, p_user_id, 'unonight', 'unonight_shop', 'Shop', 'contains', 20),
    (p_org_id, p_user_id, 'unonight', 'unonight_mobile_ux', 'Mobile UX', 'contains', 30),
    (p_org_id, p_user_id, 'unonight', 'unonight_admin', 'Admin', 'contains', 40)
  on conflict do nothing;

  insert into public.companion_workspace_workflows (
    organization_id, auth_user_id, workflow_key, workflow_label, steps, application_chain, times_observed, last_observed_at
  ) values
    (p_org_id, p_user_id, 'shopify_banner', 'Create Shopify Banner',
      '[{"step":"Design in Canva"},{"step":"Export PNG"},{"step":"Upload to Shopify"}]'::jsonb,
      array['Canva','Shopify'], 12, now() - interval '2 days'),
    (p_org_id, p_user_id, 'investor_deck', 'Create Investor Deck',
      '[{"step":"Draft in Canva"},{"step":"Export PDF"},{"step":"Share with stakeholders"}]'::jsonb,
      array['Canva','PowerPoint'], 8, now() - interval '5 days'),
    (p_org_id, p_user_id, 'partner_onboarding', 'Partner Onboarding',
      '[{"step":"Prepare materials"},{"step":"Send welcome pack"},{"step":"Schedule introduction"}]'::jsonb,
      array['Word','Outlook','Teams'], 4, now() - interval '10 days')
  on conflict do nothing;

  insert into public.companion_workspace_insights (
    organization_id, auth_user_id, insight_type, title, message, confidence_level, related_project_key
  ) values
    (p_org_id, p_user_id, 'attention', 'Project inactive', 'This project has not been updated in 21 days.', 'high', 'unonight_marketplace'),
    (p_org_id, p_user_id, 'recommendation', 'Related files', 'Three active files appear related to Investor Deck.', 'medium', 'aipify_investor_deck'),
    (p_org_id, p_user_id, 'documentation', 'Missing documentation', 'Desktop App project may be missing documentation.', 'medium', 'aipify_desktop_app'),
    (p_org_id, p_user_id, 'duplicate', 'Possible duplicates', 'These files appear duplicated in Brand Assets.', 'low', 'aipify_branding'),
    (p_org_id, p_user_id, 'organization', 'Brand Assets folder', 'Would you like to create a central Brand Assets folder?', 'medium', 'aipify_branding');

  insert into public.companion_workspace_activity (
    organization_id, auth_user_id, period_label, activity_summary, project_key, application_name, occurred_at
  ) values
    (p_org_id, p_user_id, 'Yesterday', 'Edited branding assets and reviewed Canva exports', 'aipify_branding', 'Canva', now() - interval '1 day'),
    (p_org_id, p_user_id, 'Last week', 'Worked on Desktop Companion specifications', 'aipify_desktop_app', 'Cursor', now() - interval '5 days'),
    (p_org_id, p_user_id, 'Last month', 'Organized Aipify and Unonight project folders', 'aipify', 'Finder', now() - interval '20 days');
end; $$;

create or replace function public._cwie344_health_score(p_org_id uuid, p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'label', case
      when avg(case health_status
        when 'excellent' then 100 when 'healthy' then 85 when 'good' then 75
        when 'at_risk' then 45 when 'dormant' then 30 else 60 end) >= 85 then 'Excellent'
      when avg(case health_status
        when 'excellent' then 100 when 'healthy' then 85 when 'good' then 75
        when 'at_risk' then 45 when 'dormant' then 30 else 60 end) >= 70 then 'Good'
      when avg(case health_status
        when 'excellent' then 100 when 'healthy' then 85 when 'good' then 75
        when 'at_risk' then 45 when 'dormant' then 30 else 60 end) >= 50 then 'Needs Attention'
      else 'At Risk'
    end,
    'score_pct', coalesce(round(avg(case health_status
      when 'excellent' then 100 when 'healthy' then 85 when 'good' then 75
      when 'at_risk' then 45 when 'dormant' then 30 else 60 end))::integer, 0),
    'factors', jsonb_build_array('Organization', 'Project activity', 'Task completion', 'Workspace structure')
  )
  from public.companion_workspace_projects
  where organization_id = p_org_id and auth_user_id = p_user_id;
$$;

create or replace function public.get_companion_workspace_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_settings public.companion_workspace_settings;
  v_health jsonb;
  v_active integer;
  v_pending integer;
  v_attention integer;
begin
  v_settings := public._cwie344_ensure_settings(v_org_id, v_user_id);
  if v_settings.workspace_enabled then perform public._cwie344_seed_demo(v_org_id, v_user_id); end if;
  v_health := public._cwie344_health_score(v_org_id, v_user_id);

  select count(*) filter (where project_status in ('active','recently_active')),
         coalesce(sum(open_tasks_count), 0),
         count(*) filter (where project_status = 'needs_attention')
  into v_active, v_pending, v_attention
  from public.companion_workspace_projects
  where organization_id = v_org_id and auth_user_id = v_user_id;

  return jsonb_build_object(
    'has_access', true,
    'empty_state', not v_settings.workspace_enabled,
    'positioning', public._cwie344bp_positioning(),
    'workspace_enabled', v_settings.workspace_enabled,
    'permissions', jsonb_build_object(
      'workspace_analysis_approved', v_settings.workspace_analysis_approved,
      'project_discovery_approved', v_settings.project_discovery_approved,
      'application_awareness_approved', v_settings.application_awareness_approved,
      'relationship_discovery_approved', v_settings.relationship_discovery_approved,
      'local_file_awareness_approved', v_settings.local_file_awareness_approved
    ),
    'workspace_health', v_health,
    'briefing', jsonb_build_object(
      'greeting', 'Good morning.',
      'active_projects', v_active,
      'pending_tasks', v_pending,
      'attention_projects', v_attention,
      'recommended_focus', 'Aipify Desktop Companion'
    ),
    'cross_link_phase343', '/desktop/memory',
    'privacy_note', 'Workspace Intelligence only operates within permissions you grant. No silent scanning.',
    'workflows', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workflow_key', w.workflow_key, 'workflow_label', w.workflow_label,
        'steps', w.steps, 'application_chain', w.application_chain, 'workflow_status', w.workflow_status,
        'times_observed', w.times_observed
      ) order by w.updated_at desc)
      from public.companion_workspace_workflows w
      where w.organization_id = v_org_id and w.auth_user_id = v_user_id and w.workflow_status != 'archived'
    ), '[]'::jsonb),
    'audit_logs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at::text
      ) order by a.created_at desc)
      from public.companion_workspace_audit_logs a
      where a.organization_id = v_org_id and a.auth_user_id = v_user_id
      limit 20
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_companion_workspace_projects()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cwie344_ensure_settings(v_org_id, v_user_id);
  if (select workspace_enabled from public.companion_workspace_settings where organization_id = v_org_id and auth_user_id = v_user_id) then
    perform public._cwie344_seed_demo(v_org_id, v_user_id);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'currently_active', coalesce((select jsonb_agg(to_jsonb(p)) from public.companion_workspace_projects p
      where p.organization_id = v_org_id and p.auth_user_id = v_user_id and p.project_status = 'active'), '[]'::jsonb),
    'recently_active', coalesce((select jsonb_agg(to_jsonb(p)) from public.companion_workspace_projects p
      where p.organization_id = v_org_id and p.auth_user_id = v_user_id and p.project_status = 'recently_active'), '[]'::jsonb),
    'needs_attention', coalesce((select jsonb_agg(to_jsonb(p)) from public.companion_workspace_projects p
      where p.organization_id = v_org_id and p.auth_user_id = v_user_id and p.project_status = 'needs_attention'), '[]'::jsonb),
    'archived', coalesce((select jsonb_agg(to_jsonb(p)) from public.companion_workspace_projects p
      where p.organization_id = v_org_id and p.auth_user_id = v_user_id and p.project_status in ('archived','completed','dormant')), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_companion_workspace_insights()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  return jsonb_build_object(
    'has_access', true,
    'insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'insight_type', i.insight_type, 'title', i.title, 'message', i.message,
        'confidence_level', i.confidence_level, 'related_project_key', i.related_project_key
      ) order by i.created_at desc)
      from public.companion_workspace_insights i
      where i.organization_id = v_org_id and i.auth_user_id = v_user_id and i.insight_status = 'active'
    ), '[]'::jsonb),
    'priorities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'level', p.priority_level, 'title', p.project_label, 'reason', p.health_status
      ) order by case p.priority_level when 'highest' then 1 when 'important' then 2 when 'later' then 3 else 4 end)
      from public.companion_workspace_projects p
      where p.organization_id = v_org_id and p.auth_user_id = v_user_id
        and p.priority_level in ('highest','important','later')
    ), '[]'::jsonb),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'period', a.period_label, 'summary', a.activity_summary, 'project_key', a.project_key,
        'application_name', a.application_name, 'occurred_at', a.occurred_at::text
      ) order by a.occurred_at desc)
      from public.companion_workspace_activity a
      where a.organization_id = v_org_id and a.auth_user_id = v_user_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_companion_workspace_relationships()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  if (select workspace_enabled from public.companion_workspace_settings where organization_id = v_org_id and auth_user_id = v_user_id) then
    perform public._cwie344_seed_demo(v_org_id, v_user_id);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'workspace_map', coalesce((
      select jsonb_agg(jsonb_build_object(
        'project_key', r.parent_key,
        'project_label', initcap(replace(r.parent_key, '_', ' ')),
        'children', (
          select jsonb_agg(jsonb_build_object(
            'project_key', c.child_key, 'label', c.child_label, 'relationship_type', c.relationship_type
          ) order by c.sort_order)
          from public.companion_workspace_relationships c
          where c.organization_id = v_org_id and c.auth_user_id = v_user_id and c.parent_key = r.parent_key
        )
      ) order by r.parent_key)
      from (select distinct parent_key from public.companion_workspace_relationships
        where organization_id = v_org_id and auth_user_id = v_user_id and parent_key in ('aipify','unonight')) r
    ), '[]'::jsonb),
    'nested_relationships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'parent_key', r.parent_key, 'child_key', r.child_key, 'child_label', r.child_label, 'relationship_type', r.relationship_type
      ) order by r.parent_key, r.sort_order)
      from public.companion_workspace_relationships r
      where r.organization_id = v_org_id and r.auth_user_id = v_user_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.save_companion_workspace_workflow(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_key text;
  v_action text := coalesce(p_payload->>'action', 'save');
begin
  v_key := coalesce(nullif(trim(p_payload->>'workflow_key'), ''), 'wf_' || left(replace(gen_random_uuid()::text, '-', ''), 12));

  if v_action = 'delete' then
    delete from public.companion_workspace_workflows
    where organization_id = v_org_id and auth_user_id = v_user_id and workflow_key = v_key;
  elsif v_action = 'disable' then
    update public.companion_workspace_workflows set workflow_status = 'disabled', updated_at = now()
    where organization_id = v_org_id and auth_user_id = v_user_id and workflow_key = v_key;
  else
    insert into public.companion_workspace_workflows (
      organization_id, auth_user_id, workflow_key, workflow_label, steps, application_chain, workflow_status
    ) values (
      v_org_id, v_user_id, v_key,
      coalesce(p_payload->>'workflow_label', 'Saved workflow'),
      coalesce(p_payload->'steps', '[]'::jsonb),
      coalesce(array(select jsonb_array_elements_text(p_payload->'application_chain')), '{}'),
      coalesce(p_payload->>'workflow_status', 'active')
    )
    on conflict (organization_id, auth_user_id, workflow_key) do update set
      workflow_label = excluded.workflow_label,
      steps = excluded.steps,
      application_chain = excluded.application_chain,
      workflow_status = excluded.workflow_status,
      updated_at = now();
  end if;

  perform public._cwie344_log_audit(v_org_id, v_user_id, 'workflow_' || v_action, 'Workflow updated: ' || v_key, p_payload);

  return jsonb_build_object(
    'has_access', true,
    'workflows', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workflow_key', w.workflow_key, 'workflow_label', w.workflow_label,
        'steps', w.steps, 'application_chain', w.application_chain, 'workflow_status', w.workflow_status,
        'times_observed', w.times_observed
      ) order by w.updated_at desc)
      from public.companion_workspace_workflows w
      where w.organization_id = v_org_id and w.auth_user_id = v_user_id and w.workflow_status != 'archived'
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.search_companion_workspace(p_query text, p_limit integer default 25)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_q text := lower(trim(coalesce(p_query, '')));
begin
  if v_q = '' then return jsonb_build_object('has_access', true, 'results', '[]'::jsonb); end if;

  return jsonb_build_object(
    'has_access', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(r) from (
        select jsonb_build_object('type', 'project', 'title', p.project_label, 'id', p.project_key) as r
        from public.companion_workspace_projects p
        where p.organization_id = v_org_id and p.auth_user_id = v_user_id
          and (lower(p.project_label) like '%' || v_q || '%' or lower(p.project_key) like '%' || v_q || '%')
        union all
        select jsonb_build_object('type', 'insight', 'title', i.title, 'id', i.id::text)
        from public.companion_workspace_insights i
        where i.organization_id = v_org_id and i.auth_user_id = v_user_id
          and (lower(i.title) like '%' || v_q || '%' or lower(i.message) like '%' || v_q || '%')
        union all
        select jsonb_build_object('type', 'workflow', 'title', w.workflow_label, 'id', w.workflow_key)
        from public.companion_workspace_workflows w
        where w.organization_id = v_org_id and w.auth_user_id = v_user_id
          and lower(w.workflow_label) like '%' || v_q || '%'
        limit greatest(1, least(p_limit, 50))
      ) sub
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.update_companion_workspace_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cwie344_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cwie344_ensure_settings(v_org_id, v_user_id);

  update public.companion_workspace_settings set
    workspace_enabled = coalesce((p_patch->>'workspace_enabled')::boolean, workspace_enabled),
    workspace_analysis_approved = coalesce((p_patch->>'workspace_analysis_approved')::boolean, workspace_analysis_approved),
    project_discovery_approved = coalesce((p_patch->>'project_discovery_approved')::boolean, project_discovery_approved),
    application_awareness_approved = coalesce((p_patch->>'application_awareness_approved')::boolean, application_awareness_approved),
    relationship_discovery_approved = coalesce((p_patch->>'relationship_discovery_approved')::boolean, relationship_discovery_approved),
    local_file_awareness_approved = coalesce((p_patch->>'local_file_awareness_approved')::boolean, local_file_awareness_approved),
    always_ask_before_learning = coalesce((p_patch->>'always_ask_before_learning')::boolean, always_ask_before_learning),
    updated_at = now()
  where organization_id = v_org_id and auth_user_id = v_user_id;

  if coalesce((p_patch->>'workspace_enabled')::boolean, false) then
    perform public._cwie344_seed_demo(v_org_id, v_user_id);
  end if;

  perform public._cwie344_log_audit(v_org_id, v_user_id, 'settings_updated', 'Workspace Intelligence settings updated', p_patch);
  return public.get_companion_workspace_center();
end; $$;

grant execute on function public.get_companion_workspace_center() to authenticated;
grant execute on function public.get_companion_workspace_projects() to authenticated;
grant execute on function public.get_companion_workspace_insights() to authenticated;
grant execute on function public.get_companion_workspace_relationships() to authenticated;
grant execute on function public.save_companion_workspace_workflow(jsonb) to authenticated;
grant execute on function public.search_companion_workspace(text, integer) to authenticated;
grant execute on function public.update_companion_workspace_settings(jsonb) to authenticated;
