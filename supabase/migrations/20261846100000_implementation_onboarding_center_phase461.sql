-- Phase 461 — Aipify Implementation & Onboarding Center (Customer App)
-- Route hub: /app/onboarding

create table if not exists public.implementation_onboarding_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  launch_status text not null default 'setup_in_progress' check (
    launch_status in ('setup_in_progress', 'ready_for_launch', 'launched')
  ),
  companion_name text not null default 'Aipify',
  companion_theme text not null default 'professional',
  launched_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.implementation_onboarding_checklist (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  step_key text not null check (step_key in (
    'organization_profile', 'users', 'permissions', 'companion_setup',
    'knowledge_center', 'integrations', 'business_pack_setup', 'training', 'go_live'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  progress_state text not null default 'not_started' check (
    progress_state in ('not_started', 'in_progress', 'complete')
  ),
  status_key text not null default 'waiting' check (status_key in (
    'completed', 'not_allowed', 'requires_attention', 'information', 'restricted', 'verified', 'waiting'
  )),
  sort_order int not null default 0,
  completed_at timestamptz,
  completed_by uuid references public.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (organization_id, step_key)
);

create index if not exists implementation_onboarding_checklist_org_idx
  on public.implementation_onboarding_checklist (organization_id, sort_order);

create table if not exists public.implementation_onboarding_organization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  setup_key text not null check (setup_key in (
    'company_information', 'departments', 'teams', 'locations',
    'languages', 'time_zone', 'business_type'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  value_label text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, setup_key)
);

create table if not exists public.implementation_onboarding_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  invite_key text not null,
  invitee_label text not null,
  role_label text not null default '',
  invite_status text not null default 'pending' check (
    invite_status in ('pending', 'accepted', 'expired')
  ),
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, invite_key)
);

create table if not exists public.implementation_onboarding_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  config_key text not null check (config_key in (
    'companion_name', 'companion_theme', 'language_preferences',
    'notification_preferences', 'working_hours', 'executive_updates', 'daily_briefings'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  value_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, config_key)
);

create table if not exists public.implementation_onboarding_knowledge (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  knowledge_type text not null check (knowledge_type in (
    'documents', 'policies', 'faqs', 'guides', 'processes', 'templates', 'readiness_score'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, knowledge_type)
);

create table if not exists public.implementation_onboarding_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_name text not null,
  category text not null default 'productivity',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, integration_key)
);

create table if not exists public.implementation_onboarding_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_name text not null,
  pack_category text not null default 'available' check (
    pack_category in ('available', 'installed', 'recommended')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

create table if not exists public.implementation_onboarding_training (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  module_title text not null,
  training_category text not null default 'recommended' check (
    training_category in ('required', 'recommended', 'completed', 'role_based', 'certification')
  ),
  role_label text not null default '',
  progress_label text not null default '',
  status_key text not null default 'waiting',
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create table if not exists public.implementation_onboarding_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_day text not null check (milestone_day in ('day_1', 'day_7', 'day_30', 'day_90')),
  title text not null,
  recommended_actions text not null default '' check (char_length(recommended_actions) <= 500),
  expected_milestones text not null default '' check (char_length(expected_milestones) <= 500),
  success_indicators text not null default '' check (char_length(success_indicators) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, milestone_day)
);

create table if not exists public.implementation_onboarding_companion_guidance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  guidance_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  recommendation text not null default '' check (char_length(recommendation) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, guidance_key)
);

create table if not exists public.implementation_onboarding_executive (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'setup_progress', 'team_adoption', 'training_progress', 'launch_readiness'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.implementation_onboarding_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, recommendation_key)
);

create table if not exists public.implementation_onboarding_launch (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  checklist_key text not null check (checklist_key in (
    'users_invited', 'training_completed', 'knowledge_uploaded',
    'companion_activated', 'integrations_connected', 'business_packs_installed'
  )),
  title text not null,
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, checklist_key)
);

create table if not exists public.implementation_onboarding_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '' check (char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists implementation_onboarding_audit_org_idx
  on public.implementation_onboarding_audit (organization_id, created_at desc);

alter table public.implementation_onboarding_settings enable row level security;
alter table public.implementation_onboarding_checklist enable row level security;
alter table public.implementation_onboarding_organization enable row level security;
alter table public.implementation_onboarding_users enable row level security;
alter table public.implementation_onboarding_companion enable row level security;
alter table public.implementation_onboarding_knowledge enable row level security;
alter table public.implementation_onboarding_integrations enable row level security;
alter table public.implementation_onboarding_business_packs enable row level security;
alter table public.implementation_onboarding_training enable row level security;
alter table public.implementation_onboarding_timeline enable row level security;
alter table public.implementation_onboarding_companion_guidance enable row level security;
alter table public.implementation_onboarding_executive enable row level security;
alter table public.implementation_onboarding_recommendations enable row level security;
alter table public.implementation_onboarding_launch enable row level security;
alter table public.implementation_onboarding_audit enable row level security;

revoke all on public.implementation_onboarding_settings from authenticated, anon;
revoke all on public.implementation_onboarding_checklist from authenticated, anon;
revoke all on public.implementation_onboarding_organization from authenticated, anon;
revoke all on public.implementation_onboarding_users from authenticated, anon;
revoke all on public.implementation_onboarding_companion from authenticated, anon;
revoke all on public.implementation_onboarding_knowledge from authenticated, anon;
revoke all on public.implementation_onboarding_integrations from authenticated, anon;
revoke all on public.implementation_onboarding_business_packs from authenticated, anon;
revoke all on public.implementation_onboarding_training from authenticated, anon;
revoke all on public.implementation_onboarding_timeline from authenticated, anon;
revoke all on public.implementation_onboarding_companion_guidance from authenticated, anon;
revoke all on public.implementation_onboarding_executive from authenticated, anon;
revoke all on public.implementation_onboarding_recommendations from authenticated, anon;
revoke all on public.implementation_onboarding_launch from authenticated, anon;
revoke all on public.implementation_onboarding_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'implementation_onboarding_center', v.description
from (values
  ('implementation_onboarding.view', 'View Implementation & Onboarding Center', 'View onboarding progress, checklist, and launch readiness'),
  ('implementation_onboarding.manage', 'Manage Implementation & Onboarding Center', 'Complete setup steps and launch organization')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'implementation_onboarding.view'), ('owner', 'implementation_onboarding.manage'),
  ('administrator', 'implementation_onboarding.view'), ('administrator', 'implementation_onboarding.manage'),
  ('manager', 'implementation_onboarding.view'),
  ('employee', 'implementation_onboarding.view'),
  ('support_agent', 'implementation_onboarding.view'),
  ('moderator', 'implementation_onboarding.view'),
  ('viewer', 'implementation_onboarding.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._ioc461_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if not public._irp_has_permission('implementation_onboarding.view', v_org_id) then
    return jsonb_build_object('found', false, 'error', 'Access denied');
  end if;
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_manage', public._irp_has_permission('implementation_onboarding.manage', v_org_id),
    'can_executive', public._irp_has_permission('implementation_onboarding.manage', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._ioc461_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.implementation_onboarding_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._ioc461_progress_to_status(p_state text)
returns text language sql immutable as $$
  select case p_state
    when 'complete' then 'completed'
    when 'in_progress' then 'information'
    else 'waiting'
  end;
$$;

create or replace function public._ioc461_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.implementation_onboarding_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.implementation_onboarding_checklist where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.implementation_onboarding_checklist
    (organization_id, step_key, title, summary, progress_state, status_key, sort_order)
  values
    (p_org_id, 'organization_profile', 'Organization Profile', 'Company information, departments, and business context.', 'in_progress', 'information', 1),
    (p_org_id, 'users', 'Users', 'Invite employees, managers, and administrators.', 'not_started', 'waiting', 2),
    (p_org_id, 'permissions', 'Permissions', 'Assign roles and access policies.', 'not_started', 'waiting', 3),
    (p_org_id, 'companion_setup', 'Companion Setup', 'Configure your Aipify Companion preferences.', 'not_started', 'waiting', 4),
    (p_org_id, 'knowledge_center', 'Knowledge Center', 'Import documents, policies, and guides.', 'not_started', 'waiting', 5),
    (p_org_id, 'integrations', 'Integrations', 'Connect Microsoft 365, Google Workspace, and business systems.', 'not_started', 'waiting', 6),
    (p_org_id, 'business_pack_setup', 'Business Pack Setup', 'Install recommended Business Packs for your industry.', 'not_started', 'waiting', 7),
    (p_org_id, 'training', 'Training', 'Complete required and role-based training modules.', 'not_started', 'waiting', 8),
    (p_org_id, 'go_live', 'Go Live', 'Review launch readiness and activate your organization.', 'not_started', 'waiting', 9);

  insert into public.implementation_onboarding_organization
    (organization_id, setup_key, title, summary, value_label, status_key)
  values
    (p_org_id, 'company_information', 'Company Information', 'Legal name, industry, and primary contact.', 'Pending review', 'information'),
    (p_org_id, 'departments', 'Departments', 'Organizational departments and structure.', 'Not configured', 'waiting'),
    (p_org_id, 'teams', 'Teams', 'Working teams and reporting lines.', 'Not configured', 'waiting'),
    (p_org_id, 'locations', 'Locations', 'Offices and operational locations.', 'Not configured', 'waiting'),
    (p_org_id, 'languages', 'Languages', 'Supported workspace languages.', 'English', 'verified'),
    (p_org_id, 'time_zone', 'Time Zone', 'Primary business time zone.', 'Europe/Oslo', 'verified'),
    (p_org_id, 'business_type', 'Business Type', 'Industry and operational model.', 'Pending selection', 'waiting');

  insert into public.implementation_onboarding_users
    (organization_id, invite_key, invitee_label, role_label, invite_status, status_key)
  values
    (p_org_id, 'admin_invite', 'Administrator invitation', 'Administrator', 'pending', 'waiting'),
    (p_org_id, 'manager_invite', 'Manager invitation', 'Manager', 'pending', 'waiting'),
    (p_org_id, 'team_invite', 'Team member invitation', 'Employee', 'pending', 'waiting');

  insert into public.implementation_onboarding_companion
    (organization_id, config_key, title, summary, value_label, status_key)
  values
    (p_org_id, 'companion_name', 'Companion Name', 'How your organization addresses Aipify.', 'Aipify', 'information'),
    (p_org_id, 'companion_theme', 'Companion Theme', 'Visual and tone preferences.', 'Professional', 'information'),
    (p_org_id, 'language_preferences', 'Language Preferences', 'Companion communication language.', 'English', 'verified'),
    (p_org_id, 'notification_preferences', 'Notification Preferences', 'Channels and alert levels.', 'Not configured', 'waiting'),
    (p_org_id, 'working_hours', 'Working Hours', 'When Aipify should prioritize business context.', 'Not configured', 'waiting'),
    (p_org_id, 'executive_updates', 'Executive Updates', 'Leadership briefing preferences.', 'Not configured', 'waiting'),
    (p_org_id, 'daily_briefings', 'Daily Briefings', 'Morning briefing schedule.', 'Not configured', 'waiting');

  insert into public.implementation_onboarding_knowledge
    (organization_id, knowledge_type, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'documents', 'Documents', 'Upload operational documents.', 'Items', '0', 'waiting'),
    (p_org_id, 'policies', 'Policies', 'Internal policies and standards.', 'Items', '0', 'waiting'),
    (p_org_id, 'faqs', 'FAQs', 'Frequently asked questions.', 'Items', '0', 'waiting'),
    (p_org_id, 'guides', 'Guides', 'Step-by-step operational guides.', 'Items', '0', 'waiting'),
    (p_org_id, 'processes', 'Processes', 'Business process documentation.', 'Items', '0', 'waiting'),
    (p_org_id, 'templates', 'Templates', 'Email and response templates.', 'Items', '0', 'waiting'),
    (p_org_id, 'readiness_score', 'Knowledge Readiness Score', 'Overall knowledge preparation.', 'Score', '12%', 'requires_attention');

  insert into public.implementation_onboarding_integrations
    (organization_id, integration_key, integration_name, category, status_key)
  values
    (p_org_id, 'microsoft_365', 'Microsoft 365', 'productivity', 'waiting'),
    (p_org_id, 'google_workspace', 'Google Workspace', 'productivity', 'waiting'),
    (p_org_id, 'slack', 'Slack', 'communication', 'waiting'),
    (p_org_id, 'teams', 'Microsoft Teams', 'communication', 'waiting'),
    (p_org_id, 'shopify', 'Shopify', 'commerce', 'waiting'),
    (p_org_id, 'wordpress', 'WordPress', 'cms', 'waiting'),
    (p_org_id, 'woocommerce', 'WooCommerce', 'commerce', 'waiting'),
    (p_org_id, 'stripe', 'Stripe', 'payments', 'waiting'),
    (p_org_id, 'fiken', 'Fiken', 'finance', 'waiting'),
    (p_org_id, 'future_integrations', 'Future Integrations', 'roadmap', 'information');

  insert into public.implementation_onboarding_business_packs
    (organization_id, pack_key, pack_name, pack_category, summary, status_key)
  values
    (p_org_id, 'hosts', 'Aipify Hosts', 'recommended', 'Hospitality and guest operations.', 'information'),
    (p_org_id, 'commerce', 'Commerce', 'recommended', 'Retail and e-commerce operations.', 'information'),
    (p_org_id, 'support', 'Support', 'available', 'Customer support operations.', 'waiting'),
    (p_org_id, 'warehouse', 'Warehouse', 'available', 'Inventory and logistics.', 'waiting'),
    (p_org_id, 'property_management', 'Property Management', 'available', 'Real estate portfolio operations.', 'waiting');

  insert into public.implementation_onboarding_training
    (organization_id, module_key, module_title, training_category, role_label, progress_label, status_key, sort_order)
  values
    (p_org_id, 'owner_fundamentals', 'Owner Training', 'required', 'Owner', 'Not started', 'waiting', 1),
    (p_org_id, 'admin_setup', 'Admin Training', 'required', 'Administrator', 'Not started', 'waiting', 2),
    (p_org_id, 'support_basics', 'Support Training', 'role_based', 'Support', 'Not started', 'waiting', 3),
    (p_org_id, 'manager_operations', 'Manager Training', 'role_based', 'Manager', 'Not started', 'waiting', 4),
    (p_org_id, 'companion_intro', 'Companion Introduction', 'recommended', 'All roles', 'Not started', 'information', 5),
    (p_org_id, 'certification_core', 'Core Certification', 'certification', 'All roles', '0%', 'waiting', 6);

  insert into public.implementation_onboarding_timeline
    (organization_id, milestone_day, title, recommended_actions, expected_milestones, success_indicators, status_key)
  values
    (p_org_id, 'day_1', 'Day 1 — Welcome & Foundation',
     'Complete organization profile, invite administrators, review Companion setup.',
     'Workspace established, first admin invited, onboarding checklist started.',
     'Owner logged in, setup progress visible, next step clear.', 'information'),
    (p_org_id, 'day_7', 'Day 7 — Team & Knowledge',
     'Invite team members, upload initial knowledge, connect primary integration.',
     'Core team invited, knowledge center started, one integration connected.',
     'Multiple users active, knowledge readiness improving.', 'information'),
    (p_org_id, 'day_30', 'Day 30 — Adoption & Training',
     'Complete required training, install Business Packs, review launch readiness.',
     'Training modules in progress, recommended packs evaluated, readiness above 70%.',
     'Team adoption metrics improving, Companion guidance acknowledged.', 'information'),
    (p_org_id, 'day_90', 'Day 90 — Launch & Optimize',
     'Launch organization, monitor adoption, refine knowledge and integrations.',
     'Organization launched, training certified, integrations operational.',
     'Launch readiness achieved, customer success milestones met.', 'information');

  insert into public.implementation_onboarding_companion_guidance
    (organization_id, guidance_key, title, insight, recommendation, status_key)
  values
    (p_org_id, 'knowledge_empty', 'Knowledge Center is empty',
     'Your Knowledge Center has no approved content yet.',
     'Upload policies, FAQs, and guides so Aipify can support your team from day one.', 'information'),
    (p_org_id, 'invites_pending', 'Team invitations pending',
     'Several team invitations have not been accepted.',
     'Follow up with invited administrators and managers to accelerate adoption.', 'requires_attention'),
    (p_org_id, 'commerce_pack', 'Commerce Pack available',
     'Commerce operations pack is recommended for your plan.',
     'Review Business Pack installation to unlock retail and e-commerce capabilities.', 'information');

  insert into public.implementation_onboarding_executive
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'setup_progress', '11%', '1 of 9 checklist items in progress', 'waiting'),
    (p_org_id, 'team_adoption', '0%', 'No accepted invitations yet', 'waiting'),
    (p_org_id, 'training_progress', '0%', 'Required modules not started', 'waiting'),
    (p_org_id, 'launch_readiness', '11%', 'Setup in progress', 'waiting');

  insert into public.implementation_onboarding_recommendations
    (organization_id, recommendation_key, title, insight, status_key)
  values
    (p_org_id, 'complete_org_profile', 'Complete organization profile',
     'Finish company information and business type to unlock team and integration setup.', 'information'),
    (p_org_id, 'invite_admins', 'Invite administrators',
     'Add at least one administrator to share setup responsibilities.', 'requires_attention'),
    (p_org_id, 'connect_m365', 'Connect Microsoft 365 or Google Workspace',
     'Calendar and email context improves Companion briefings and scheduling.', 'information');

  insert into public.implementation_onboarding_launch
    (organization_id, checklist_key, title, status_key)
  values
    (p_org_id, 'users_invited', 'Users invited', 'waiting'),
    (p_org_id, 'training_completed', 'Training completed', 'waiting'),
    (p_org_id, 'knowledge_uploaded', 'Knowledge uploaded', 'waiting'),
    (p_org_id, 'companion_activated', 'Companion activated', 'waiting'),
    (p_org_id, 'integrations_connected', 'Integrations connected', 'waiting'),
    (p_org_id, 'business_packs_installed', 'Business Packs installed', 'waiting');

  perform public._ioc461_log(
    p_org_id, null, 'onboarding_center', null, 'seed',
    'Implementation & Onboarding Center initialized with guided setup checklist.'
  );
end; $$;

create or replace function public._ioc461_compute_readiness(p_org_id uuid)
returns int language plpgsql stable security definer set search_path = public as $$
declare
  v_total int := 0;
  v_complete int := 0;
  v_score int;
begin
  select count(*), count(*) filter (where progress_state = 'complete')
  into v_total, v_complete
  from public.implementation_onboarding_checklist
  where organization_id = p_org_id;

  if v_total = 0 then return 0; end if;
  v_score := round((v_complete::numeric / v_total) * 100)::int;

  update public.implementation_onboarding_executive
  set metric_value = v_score || '%',
      trend_label = v_complete || ' of ' || v_total || ' checklist items complete',
      status_key = case
        when v_score >= 85 then 'verified'
        when v_score >= 50 then 'information'
        else 'waiting'
      end,
      updated_at = now()
  where organization_id = p_org_id and metric_key = 'launch_readiness';

  return v_score;
end; $$;

create or replace function public.get_customer_implementation_onboarding_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_org public.organizations;
  v_owner_name text := '';
  v_days_since int := 0;
  v_readiness int := 0;
  v_setup_pct int := 0;
  v_launch_status text;
  v_checklist jsonb := '[]'::jsonb;
  v_organization jsonb := '[]'::jsonb;
  v_users jsonb := '[]'::jsonb;
  v_companion jsonb := '[]'::jsonb;
  v_knowledge jsonb := '[]'::jsonb;
  v_integrations jsonb := '[]'::jsonb;
  v_packs jsonb := '[]'::jsonb;
  v_training jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_guidance jsonb := '[]'::jsonb;
  v_executive jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_launch jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_complete int := 0;
  v_total int := 0;
begin
  v_ctx := public._ioc461_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return v_ctx;
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._ioc461_seed(v_org_id);
  v_readiness := public._ioc461_compute_readiness(v_org_id);

  select * into v_org from public.organizations where id = v_org_id;

  select coalesce(u.full_name, '')
  into v_owner_name
  from public.organization_users ou
  join public.users u on u.id = ou.user_id
  where ou.organization_id = v_org_id and ou.role = 'owner' and ou.status = 'active'
  limit 1;

  v_days_since := greatest(0, (current_date - v_org.created_at::date));

  select launch_status into v_launch_status
  from public.implementation_onboarding_settings where organization_id = v_org_id;

  select count(*) filter (where progress_state = 'complete'), count(*)
  into v_complete, v_total
  from public.implementation_onboarding_checklist where organization_id = v_org_id;

  if v_total > 0 then
    v_setup_pct := round((v_complete::numeric / v_total) * 100)::int;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'step_key', c.step_key, 'title', c.title, 'summary', c.summary,
    'progress_state', c.progress_state, 'status_key', c.status_key,
    'sort_order', c.sort_order, 'completed_at', c.completed_at, 'item_type', 'checklist'
  ) order by c.sort_order), '[]'::jsonb)
  into v_checklist from public.implementation_onboarding_checklist c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'setup_key', o.setup_key, 'title', o.title, 'summary', o.summary,
    'value_label', o.value_label, 'status_key', o.status_key, 'item_type', 'organization'
  ) order by o.setup_key), '[]'::jsonb)
  into v_organization from public.implementation_onboarding_organization o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', u.id, 'invite_key', u.invite_key, 'invitee_label', u.invitee_label,
    'role_label', u.role_label, 'invite_status', u.invite_status,
    'status_key', u.status_key, 'item_type', 'user_invite'
  ) order by u.invitee_label), '[]'::jsonb)
  into v_users from public.implementation_onboarding_users u where u.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'config_key', c.config_key, 'title', c.title, 'summary', c.summary,
    'value_label', c.value_label, 'status_key', c.status_key, 'item_type', 'companion'
  ) order by c.config_key), '[]'::jsonb)
  into v_companion from public.implementation_onboarding_companion c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', k.id, 'knowledge_type', k.knowledge_type, 'title', k.title, 'summary', k.summary,
    'metric_label', k.metric_label, 'metric_value', k.metric_value,
    'status_key', k.status_key, 'item_type', 'knowledge'
  ) order by k.knowledge_type), '[]'::jsonb)
  into v_knowledge from public.implementation_onboarding_knowledge k where k.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'integration_key', i.integration_key, 'integration_name', i.integration_name,
    'category', i.category, 'status_key', i.status_key, 'item_type', 'integration'
  ) order by i.integration_name), '[]'::jsonb)
  into v_integrations from public.implementation_onboarding_integrations i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'pack_key', p.pack_key, 'pack_name', p.pack_name,
    'pack_category', p.pack_category, 'summary', p.summary,
    'status_key', p.status_key, 'item_type', 'business_pack'
  ) order by p.pack_category, p.pack_name), '[]'::jsonb)
  into v_packs from public.implementation_onboarding_business_packs p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'module_key', t.module_key, 'module_title', t.module_title,
    'training_category', t.training_category, 'role_label', t.role_label,
    'progress_label', t.progress_label, 'status_key', t.status_key,
    'sort_order', t.sort_order, 'item_type', 'training'
  ) order by t.sort_order), '[]'::jsonb)
  into v_training from public.implementation_onboarding_training t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'milestone_day', t.milestone_day, 'title', t.title,
    'recommended_actions', t.recommended_actions, 'expected_milestones', t.expected_milestones,
    'success_indicators', t.success_indicators, 'status_key', t.status_key, 'item_type', 'timeline'
  ) order by t.milestone_day), '[]'::jsonb)
  into v_timeline from public.implementation_onboarding_timeline t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'guidance_key', g.guidance_key, 'title', g.title,
    'insight', g.insight, 'recommendation', g.recommendation,
    'status_key', g.status_key, 'item_type', 'guidance'
  ) order by g.updated_at desc), '[]'::jsonb)
  into v_guidance from public.implementation_onboarding_companion_guidance g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by e.metric_key), '[]'::jsonb)
  into v_executive from public.implementation_onboarding_executive e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_key', r.recommendation_key, 'title', r.title,
    'insight', r.insight, 'status_key', r.status_key, 'item_type', 'recommendation'
  ) order by r.title), '[]'::jsonb)
  into v_recommendations from public.implementation_onboarding_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'checklist_key', l.checklist_key, 'title', l.title,
    'status_key', l.status_key, 'item_type', 'launch_checklist'
  ) order by l.checklist_key), '[]'::jsonb)
  into v_launch from public.implementation_onboarding_launch l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', audit_row.id, 'item_type', audit_row.item_type, 'action', audit_row.action,
    'description', audit_row.description, 'created_at', audit_row.created_at, 'item_type_label', 'audit'
  )), '[]'::jsonb)
  into v_audit
  from (
    select a.id, a.item_type, a.action, a.description, a.created_at
    from public.implementation_onboarding_audit a
    where a.organization_id = v_org_id
    order by a.created_at desc
    limit 20
  ) audit_row;

  return jsonb_build_object(
    'found', true,
    'organization_name', v_org.name,
    'plan_label', initcap(replace(v_org.subscription_plan, '_', ' ')),
    'owner_name', v_owner_name,
    'setup_progress_pct', v_setup_pct,
    'days_since_signup', v_days_since,
    'launch_status', coalesce(v_launch_status, 'setup_in_progress'),
    'launch_readiness_score', v_readiness,
    'launch_readiness_label', case
      when v_readiness >= 85 then 'Ready for Launch'
      when v_readiness >= 50 then 'Approaching Launch'
      else 'Setup In Progress'
    end,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'governance_note', 'Every setup step records who completed it, when it was completed, and what changed — full audit and approval history.',
    'privacy_note', 'Onboarding data is tenant-scoped. Platform Admin sees aggregates only.',
    'checklist', v_checklist,
    'organization_setup', v_organization,
    'user_setup', v_users,
    'companion_setup', v_companion,
    'knowledge_setup', v_knowledge,
    'integrations', v_integrations,
    'business_packs', v_packs,
    'training_center', v_training,
    'customer_success_timeline', v_timeline,
    'companion_guidance', v_guidance,
    'executive_overview', v_executive,
    'top_recommendations', v_recommendations,
    'go_live_checklist', v_launch,
    'audit_history', v_audit,
    'statistics', jsonb_build_object(
      'checklist_complete', v_complete,
      'checklist_total', v_total,
      'integration_count', jsonb_array_length(v_integrations),
      'training_count', jsonb_array_length(v_training)
    )
  );
end; $$;

create or replace function public.launch_implementation_onboarding_organization()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_readiness int;
begin
  v_ctx := public._ioc461_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    return jsonb_build_object('ok', false, 'error', 'Manage permission required');
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_readiness := public._ioc461_compute_readiness(v_org_id);

  if v_readiness < 50 then
    return jsonb_build_object('ok', false, 'error', 'Launch readiness must be at least 50%');
  end if;

  update public.implementation_onboarding_settings
  set launch_status = 'launched', launched_at = now(), updated_at = now()
  where organization_id = v_org_id;

  update public.implementation_onboarding_checklist
  set progress_state = 'complete', status_key = 'completed', completed_at = now(), completed_by = v_user_id, updated_at = now()
  where organization_id = v_org_id and step_key = 'go_live';

  perform public._ioc461_log(
    v_org_id, v_user_id, 'launch', null, 'launch_organization',
    'Organization launched via Implementation & Onboarding Center.'
  );

  return jsonb_build_object('ok', true, 'launch_readiness_score', v_readiness);
end; $$;

grant execute on function public.get_customer_implementation_onboarding_center() to authenticated;
grant execute on function public.launch_implementation_onboarding_organization() to authenticated;
