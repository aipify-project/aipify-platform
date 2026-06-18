-- Phase 464 — Aipify Customer Community & Network Center (Customer App)
-- Route hub: /app/community

create table if not exists public.customer_community_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  member_reputation_tier text not null default 'new_member' check (
    member_reputation_tier in (
      'new_member', 'active_contributor', 'trusted_contributor', 'community_expert', 'community_leader'
    )
  ),
  marketplace_prep_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_community_hub_highlights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  highlight_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  highlight_type text not null default 'discussion' check (
    highlight_type in ('discussion', 'topic', 'event', 'contributor', 'group')
  ),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, highlight_key)
);

create table if not exists public.customer_community_discussions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  discussion_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  category text not null default 'general' check (category in (
    'general', 'operations', 'support', 'commerce', 'hospitality',
    'growth_partners', 'enterprise', 'companion', 'integrations'
  )),
  discussion_type text not null default 'question' check (
    discussion_type in ('question', 'idea', 'recommendation', 'operational', 'business_pack', 'companion')
  ),
  replies_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, discussion_key)
);

create table if not exists public.customer_community_industry_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  group_key text not null,
  group_name text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  members_label text not null default '',
  joined boolean not null default false,
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, group_key)
);

create table if not exists public.customer_community_best_practices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  practice_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  practice_type text not null default 'template' check (
    practice_type in (
      'template', 'workflow', 'process', 'companion_use_case',
      'business_pack_config', 'success_story'
    )
  ),
  moderation_status text not null default 'pending' check (
    moderation_status in ('pending', 'approved', 'rejected')
  ),
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, practice_key)
);

create table if not exists public.customer_community_reputation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'helpful_answers', 'contributions', 'approved_content', 'certifications', 'engagement'
  )),
  title text not null,
  value_label text not null default '',
  reputation_tier text not null default 'new_member',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.customer_community_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  event_type text not null default 'webinar' check (
    event_type in ('webinar', 'workshop', 'certification', 'industry', 'partner', 'meetup')
  ),
  event_timing text not null default 'upcoming' check (event_timing in ('upcoming', 'past')),
  date_label text not null default '',
  registration_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, event_key)
);

create table if not exists public.customer_community_partner_network (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  partner_area text not null default 'collaboration' check (
    partner_area in (
      'sales_discussions', 'customer_acquisition', 'best_practices',
      'collaboration', 'certification_updates'
    )
  ),
  status_key text not null default 'restricted',
  updated_at timestamptz not null default now(),
  unique (organization_id, item_key)
);

create table if not exists public.customer_community_intelligence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  feed_target text not null default 'knowledge_center' check (
    feed_target in ('knowledge_center', 'business_packs', 'product_roadmap', 'community')
  ),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, insight_key)
);

create table if not exists public.customer_community_companion_guidance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  guidance_key text not null,
  example_question text not null,
  answer_summary text not null default '' check (char_length(answer_summary) <= 500),
  related_content text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, guidance_key)
);

create table if not exists public.customer_community_success_stories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  story_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  story_type text not null default 'customer' check (
    story_type in ('customer', 'growth_partner', 'implementation', 'business_pack')
  ),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, story_key)
);

create table if not exists public.customer_community_certifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cert_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  progress_label text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, cert_key)
);

create table if not exists public.customer_community_marketplace_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prep_key text not null check (prep_key in (
    'templates', 'workflow_packs', 'knowledge_packs', 'community_resources'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  architecture_note text not null default '' check (char_length(architecture_note) <= 500),
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, prep_key)
);

create table if not exists public.customer_community_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'community_growth', 'active_members', 'top_contributors', 'popular_topics', 'industry_trends', 'community_health'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.customer_community_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  governance_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  role_scope text not null default 'member' check (
    role_scope in ('member', 'contributor', 'moderator', 'community_manager', 'admin')
  ),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, governance_key)
);

create table if not exists public.customer_community_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '' check (char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists customer_community_audit_org_idx
  on public.customer_community_audit (organization_id, created_at desc);

alter table public.customer_community_settings enable row level security;
alter table public.customer_community_hub_highlights enable row level security;
alter table public.customer_community_discussions enable row level security;
alter table public.customer_community_industry_groups enable row level security;
alter table public.customer_community_best_practices enable row level security;
alter table public.customer_community_reputation enable row level security;
alter table public.customer_community_events enable row level security;
alter table public.customer_community_partner_network enable row level security;
alter table public.customer_community_intelligence enable row level security;
alter table public.customer_community_companion_guidance enable row level security;
alter table public.customer_community_success_stories enable row level security;
alter table public.customer_community_certifications enable row level security;
alter table public.customer_community_marketplace_prep enable row level security;
alter table public.customer_community_executive_metrics enable row level security;
alter table public.customer_community_governance enable row level security;
alter table public.customer_community_audit enable row level security;

revoke all on public.customer_community_settings from authenticated, anon;
revoke all on public.customer_community_hub_highlights from authenticated, anon;
revoke all on public.customer_community_discussions from authenticated, anon;
revoke all on public.customer_community_industry_groups from authenticated, anon;
revoke all on public.customer_community_best_practices from authenticated, anon;
revoke all on public.customer_community_reputation from authenticated, anon;
revoke all on public.customer_community_events from authenticated, anon;
revoke all on public.customer_community_partner_network from authenticated, anon;
revoke all on public.customer_community_intelligence from authenticated, anon;
revoke all on public.customer_community_companion_guidance from authenticated, anon;
revoke all on public.customer_community_success_stories from authenticated, anon;
revoke all on public.customer_community_certifications from authenticated, anon;
revoke all on public.customer_community_marketplace_prep from authenticated, anon;
revoke all on public.customer_community_executive_metrics from authenticated, anon;
revoke all on public.customer_community_governance from authenticated, anon;
revoke all on public.customer_community_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'customer_community_network_center', v.description
from (values
  ('customer_community.view', 'View Customer Community & Network Center', 'View discussions, groups, events, and community intelligence'),
  ('customer_community.manage', 'Manage Customer Community & Network Center', 'Moderate content and manage community governance')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'customer_community.view'), ('owner', 'customer_community.manage'),
  ('administrator', 'customer_community.view'), ('administrator', 'customer_community.manage'),
  ('manager', 'customer_community.view'),
  ('employee', 'customer_community.view'),
  ('support_agent', 'customer_community.view'),
  ('moderator', 'customer_community.view'), ('moderator', 'customer_community.manage'),
  ('viewer', 'customer_community.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._ccn464_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if not public._irp_has_permission('customer_community.view', v_org_id) then
    return jsonb_build_object('found', false, 'error', 'Access denied');
  end if;
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_manage', public._irp_has_permission('customer_community.manage', v_org_id),
    'can_moderate', public._irp_has_permission('customer_community.manage', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._ccn464_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.customer_community_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._ccn464_reputation_status(p_tier text)
returns text language sql immutable as $$
  select case p_tier
    when 'community_leader' then 'verified'
    when 'community_expert' then 'verified'
    when 'trusted_contributor' then 'verified'
    when 'active_contributor' then 'information'
    else 'waiting'
  end;
$$;

create or replace function public._ccn464_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.customer_community_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.customer_community_discussions where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.customer_community_hub_highlights
    (organization_id, highlight_key, title, summary, highlight_type, status_key)
  values
    (p_org_id, 'disc_hospitality_onboarding', 'Hospitality onboarding workflows', 'Popular discussion on guest check-in automation.', 'discussion', 'information'),
    (p_org_id, 'topic_companion_briefings', 'Companion executive briefings', 'Trending topic across Enterprise customers.', 'topic', 'verified'),
    (p_org_id, 'event_webinar_commerce', 'Commerce Pack webinar — Jun 25', 'Live workshop on retail operations with Aipify.', 'event', 'information'),
    (p_org_id, 'contributor_nordic_ops', 'Nordic Operations Collective', 'Featured contributor — 47 helpful answers.', 'contributor', 'verified');

  insert into public.customer_community_discussions
    (organization_id, discussion_key, title, summary, category, discussion_type, replies_label, status_key)
  values
    (p_org_id, 'q_support_triage', 'Best support triage workflow?', 'How are other teams configuring Business DNA for support?', 'support', 'question', '24 replies', 'information'),
    (p_org_id, 'idea_companion_focus', 'Companion focus mode for managers', 'Suggestion for quiet-hours integration with TAG.', 'companion', 'idea', '12 replies', 'information'),
    (p_org_id, 'rec_commerce_pack', 'Commerce Pack for multi-store', 'Recommendation thread from retail operators.', 'commerce', 'recommendation', '18 replies', 'verified'),
    (p_org_id, 'ops_hospitality_hosts', 'Aipify Hosts operational setup', 'Operational discussion on guest intelligence workflows.', 'hospitality', 'operational', '31 replies', 'verified'),
    (p_org_id, 'bp_support_config', 'Support Pack configuration patterns', 'Business Pack discussion — escalation rules.', 'support', 'business_pack', '9 replies', 'information');

  insert into public.customer_community_industry_groups
    (organization_id, group_key, group_name, summary, members_label, joined, status_key)
  values
    (p_org_id, 'hospitality', 'Hospitality Network', 'Hotels, hosts, and guest operations.', '842 members', false, 'information'),
    (p_org_id, 'commerce', 'Commerce Network', 'Retail and e-commerce operators.', '1,204 members', true, 'verified'),
    (p_org_id, 'support_leaders', 'Support Leaders', 'Customer support and service excellence.', '567 members', false, 'information'),
    (p_org_id, 'property', 'Property Management', 'Real estate and portfolio operations.', '389 members', false, 'waiting'),
    (p_org_id, 'healthcare', 'Healthcare', 'Clinic and patient operations — future group.', '124 members', false, 'waiting'),
    (p_org_id, 'professional', 'Professional Services', 'Consulting and client delivery.', '456 members', false, 'information');

  insert into public.customer_community_best_practices
    (organization_id, practice_key, title, summary, practice_type, moderation_status, status_key)
  values
    (p_org_id, 'tpl_onboarding_checklist', '30-day onboarding checklist template', 'Shared template for post-launch adoption.', 'template', 'approved', 'verified'),
    (p_org_id, 'wf_support_escalation', 'Support escalation workflow', 'Approved process for tier-2 escalations.', 'workflow', 'approved', 'verified'),
    (p_org_id, 'companion_briefing_ops', 'Companion morning briefing setup', 'Use case for operations managers.', 'companion_use_case', 'approved', 'information'),
    (p_org_id, 'bp_commerce_config', 'Commerce Pack starter configuration', 'Business Pack config — pending moderation.', 'business_pack_config', 'pending', 'waiting');

  insert into public.customer_community_reputation
    (organization_id, metric_key, title, value_label, reputation_tier, status_key)
  values
    (p_org_id, 'helpful_answers', 'Helpful answers', '3', 'active_contributor', 'information'),
    (p_org_id, 'contributions', 'Contributions', '7', 'active_contributor', 'information'),
    (p_org_id, 'approved_content', 'Approved content', '2', 'active_contributor', 'verified'),
    (p_org_id, 'certifications', 'Certifications', '1 in progress', 'active_contributor', 'waiting'),
    (p_org_id, 'engagement', 'Community engagement', 'Moderate', 'active_contributor', 'information');

  update public.customer_community_settings
  set member_reputation_tier = 'active_contributor'
  where organization_id = p_org_id;

  insert into public.customer_community_events
    (organization_id, event_key, title, summary, event_type, event_timing, date_label, registration_label, status_key)
  values
    (p_org_id, 'webinar_commerce', 'Commerce Pack deep dive', 'Live webinar with product and customer panel.', 'webinar', 'upcoming', 'Jun 25, 2026', 'Open — Register', 'information'),
    (p_org_id, 'workshop_onboarding', 'Onboarding excellence workshop', 'Hands-on workshop for administrators.', 'workshop', 'upcoming', 'Jul 10, 2026', 'Limited seats', 'information'),
    (p_org_id, 'cert_core', 'Core certification session', 'Community certification prep session.', 'certification', 'upcoming', 'Aug 5, 2026', 'Registration required', 'waiting'),
    (p_org_id, 'meetup_nordic', 'Nordic community meetup', 'Past meetup — recording available.', 'meetup', 'past', 'May 12, 2026', 'Recording available', 'verified');

  insert into public.customer_community_partner_network
    (organization_id, item_key, title, summary, partner_area, status_key)
  values
    (p_org_id, 'partner_sales', 'Sales discussion forum', 'Growth Partner sales strategies — role-isolated area.', 'sales_discussions', 'restricted'),
    (p_org_id, 'partner_acquisition', 'Customer acquisition patterns', 'Anonymised acquisition insights for partners.', 'customer_acquisition', 'restricted'),
    (p_org_id, 'partner_cert', 'Certification updates Q2', 'Latest partner certification requirements.', 'certification_updates', 'information');

  insert into public.customer_community_intelligence
    (organization_id, insight_key, title, insight, feed_target, status_key)
  values
    (p_org_id, 'faq_onboarding', 'Top FAQ: onboarding timeline', 'Most asked — typical time-to-value 30 days.', 'knowledge_center', 'information'),
    (p_org_id, 'topic_hospitality', 'Emerging: hospitality automation', 'Growing interest in guest intelligence workflows.', 'business_packs', 'information'),
    (p_org_id, 'feature_calendar', 'Requested: advanced calendar sync', 'Frequently requested integration enhancement.', 'product_roadmap', 'requires_attention'),
    (p_org_id, 'challenge_support', 'Common challenge: support triage', 'Operational challenge across Support Pack users.', 'community', 'information');

  insert into public.customer_community_companion_guidance
    (organization_id, guidance_key, example_question, answer_summary, related_content, status_key)
  values
    (p_org_id, 'hospitality_peers', 'What are other Hospitality customers doing?', 'Surface Hospitality Network discussions and approved Hosts Pack workflows.', 'Hospitality Network · 3 best practices', 'information'),
    (p_org_id, 'onboarding_practices', 'Show best practices for onboarding.', 'Community-approved onboarding checklist and workshop events.', 'Best Practices Library · Events', 'verified'),
    (p_org_id, 'popular_workflows', 'What workflows are most popular?', 'Support escalation and Commerce Pack configs rank highest this quarter.', 'Community Intelligence · Discussions', 'information');

  insert into public.customer_community_success_stories
    (organization_id, story_key, title, summary, story_type, status_key)
  values
    (p_org_id, 'customer_retail', 'Retail operator reduces support load 40%', 'Commerce Pack adoption story — illustrative scenario.', 'customer', 'verified'),
    (p_org_id, 'partner_nordic', 'Growth Partner accelerates hospitality rollout', 'Partner-led implementation success.', 'growth_partner', 'information'),
    (p_org_id, 'impl_30day', '30-day onboarding to full adoption', 'Implementation timeline success pattern.', 'implementation', 'verified');

  insert into public.customer_community_certifications
    (organization_id, cert_key, title, summary, progress_label, status_key)
  values
    (p_org_id, 'core_cert', 'Aipify Core Certification', 'Foundation certification for community contributors.', '25%', 'waiting'),
    (p_org_id, 'commerce_cert', 'Commerce Pack Specialist', 'Advanced certification for retail operators.', 'Not started', 'waiting');

  insert into public.customer_community_marketplace_prep
    (organization_id, prep_key, title, summary, architecture_note, status_key)
  values
    (p_org_id, 'templates', 'Template marketplace (preparation)', 'Architecture scaffold for future template sharing — no commerce yet.', 'Tables and approval workflow defined; payment integration deferred.', 'waiting'),
    (p_org_id, 'workflow_packs', 'Workflow Packs (preparation)', 'Future community workflow pack distribution.', 'Pack metadata schema ready; listing UI not enabled.', 'waiting'),
    (p_org_id, 'knowledge_packs', 'Knowledge Packs (preparation)', 'Future knowledge pack sharing from community.', 'Integrates with Knowledge Center approval chain.', 'waiting'),
    (p_org_id, 'community_resources', 'Community resources (preparation)', 'General resource marketplace architecture.', 'Governance and audit hooks in place; commerce disabled.', 'waiting');

  insert into public.customer_community_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'community_growth', '+18%', 'vs last quarter', 'verified'),
    (p_org_id, 'active_members', '2,847', 'Across industry groups', 'information'),
    (p_org_id, 'top_contributors', '124', 'Trusted contributors this month', 'verified'),
    (p_org_id, 'popular_topics', 'Support · Commerce · Companion', 'Trending categories', 'information'),
    (p_org_id, 'industry_trends', 'Hospitality automation rising', 'Community intelligence signal', 'information'),
    (p_org_id, 'community_health', '87%', 'Engagement and moderation health', 'verified');

  insert into public.customer_community_governance
    (organization_id, governance_key, title, summary, role_scope, status_key)
  values
    (p_org_id, 'moderation', 'Content moderation', 'All submissions subject to moderation before publication.', 'moderator', 'verified'),
    (p_org_id, 'reporting', 'Reporting and escalation', 'Members can report content; moderators review within SLA.', 'moderator', 'verified'),
    (p_org_id, 'approval', 'Approval workflows', 'Best practices and stories require approval before community visibility.', 'community_manager', 'verified'),
    (p_org_id, 'audit', 'Audit logging', 'Posts, comments, approvals, reports, and moderation actions logged.', 'admin', 'verified');

  perform public._ccn464_log(
    p_org_id, null, 'community_network_center', null, 'seed',
    'Customer Community & Network Center initialized with discussions, groups, and intelligence baseline.'
  );
end; $$;

create or replace function public.get_customer_community_network_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_settings public.customer_community_settings;
  v_highlights jsonb := '[]'::jsonb;
  v_discussions jsonb := '[]'::jsonb;
  v_groups jsonb := '[]'::jsonb;
  v_practices jsonb := '[]'::jsonb;
  v_reputation jsonb := '[]'::jsonb;
  v_events jsonb := '[]'::jsonb;
  v_partner jsonb := '[]'::jsonb;
  v_intelligence jsonb := '[]'::jsonb;
  v_companion jsonb := '[]'::jsonb;
  v_stories jsonb := '[]'::jsonb;
  v_certs jsonb := '[]'::jsonb;
  v_marketplace jsonb := '[]'::jsonb;
  v_executive jsonb := '[]'::jsonb;
  v_governance jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_tier text;
  v_tier_status text;
begin
  v_ctx := public._ccn464_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return v_ctx;
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._ccn464_seed(v_org_id);

  select * into v_settings from public.customer_community_settings where organization_id = v_org_id;
  v_tier := coalesce(v_settings.member_reputation_tier, 'new_member');
  v_tier_status := public._ccn464_reputation_status(v_tier);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'highlight_key', h.highlight_key, 'title', h.title, 'summary', h.summary,
    'highlight_type', h.highlight_type, 'status_key', h.status_key, 'item_type', 'highlight'
  ) order by h.updated_at desc), '[]'::jsonb)
  into v_highlights from public.customer_community_hub_highlights h where h.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'discussion_key', d.discussion_key, 'title', d.title, 'summary', d.summary,
    'category', d.category, 'discussion_type', d.discussion_type, 'replies_label', d.replies_label,
    'status_key', d.status_key, 'item_type', 'discussion'
  ) order by d.updated_at desc), '[]'::jsonb)
  into v_discussions from public.customer_community_discussions d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'group_key', g.group_key, 'group_name', g.group_name, 'summary', g.summary,
    'members_label', g.members_label, 'joined', g.joined, 'status_key', g.status_key, 'item_type', 'industry_group'
  ) order by g.group_name), '[]'::jsonb)
  into v_groups from public.customer_community_industry_groups g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'practice_key', p.practice_key, 'title', p.title, 'summary', p.summary,
    'practice_type', p.practice_type, 'moderation_status', p.moderation_status,
    'status_key', p.status_key, 'item_type', 'best_practice'
  ) order by p.title), '[]'::jsonb)
  into v_practices from public.customer_community_best_practices p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'metric_key', r.metric_key, 'title', r.title, 'value_label', r.value_label,
    'reputation_tier', r.reputation_tier, 'status_key', r.status_key, 'item_type', 'reputation_metric'
  ) order by r.metric_key), '[]'::jsonb)
  into v_reputation from public.customer_community_reputation r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_key', e.event_key, 'title', e.title, 'summary', e.summary,
    'event_type', e.event_type, 'event_timing', e.event_timing, 'date_label', e.date_label,
    'registration_label', e.registration_label, 'status_key', e.status_key, 'item_type', 'event'
  ) order by e.event_timing, e.date_label), '[]'::jsonb)
  into v_events from public.customer_community_events e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'item_key', p.item_key, 'title', p.title, 'summary', p.summary,
    'partner_area', p.partner_area, 'status_key', p.status_key, 'item_type', 'partner_network'
  ) order by p.title), '[]'::jsonb)
  into v_partner from public.customer_community_partner_network p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'insight_key', i.insight_key, 'title', i.title, 'insight', i.insight,
    'feed_target', i.feed_target, 'status_key', i.status_key, 'item_type', 'intelligence'
  ) order by i.title), '[]'::jsonb)
  into v_intelligence from public.customer_community_intelligence i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'guidance_key', c.guidance_key, 'example_question', c.example_question,
    'answer_summary', c.answer_summary, 'related_content', c.related_content,
    'status_key', c.status_key, 'item_type', 'companion_guidance'
  ) order by c.guidance_key), '[]'::jsonb)
  into v_companion from public.customer_community_companion_guidance c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'story_key', s.story_key, 'title', s.title, 'summary', s.summary,
    'story_type', s.story_type, 'status_key', s.status_key, 'item_type', 'success_story'
  ) order by s.title), '[]'::jsonb)
  into v_stories from public.customer_community_success_stories s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'cert_key', c.cert_key, 'title', c.title, 'summary', c.summary,
    'progress_label', c.progress_label, 'status_key', c.status_key, 'item_type', 'certification'
  ) order by c.cert_key), '[]'::jsonb)
  into v_certs from public.customer_community_certifications c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'prep_key', m.prep_key, 'title', m.title, 'summary', m.summary,
    'architecture_note', m.architecture_note, 'status_key', m.status_key, 'item_type', 'marketplace_prep'
  ) order by m.prep_key), '[]'::jsonb)
  into v_marketplace from public.customer_community_marketplace_prep m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by e.metric_key), '[]'::jsonb)
  into v_executive from public.customer_community_executive_metrics e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'governance_key', g.governance_key, 'title', g.title, 'summary', g.summary,
    'role_scope', g.role_scope, 'status_key', g.status_key, 'item_type', 'governance'
  ) order by g.governance_key), '[]'::jsonb)
  into v_governance from public.customer_community_governance g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', audit_row.id, 'item_type', audit_row.item_type, 'action', audit_row.action,
    'description', audit_row.description, 'created_at', audit_row.created_at, 'item_type_label', 'audit'
  )), '[]'::jsonb)
  into v_audit
  from (
    select a.id, a.item_type, a.action, a.description, a.created_at
    from public.customer_community_audit a
    where a.organization_id = v_org_id
    order by a.created_at desc
    limit 20
  ) audit_row;

  return jsonb_build_object(
    'found', true,
    'member_reputation_tier', v_tier,
    'member_reputation_status_key', v_tier_status,
    'marketplace_prep_enabled', coalesce(v_settings.marketplace_prep_enabled, false),
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_moderate', coalesce(v_ctx->>'can_moderate', 'false') = 'true',
    'governance_note', 'Posts, comments, approvals, reports, moderation actions, and reputation changes are fully audited.',
    'privacy_note', 'Community data respects tenant boundaries. Growth Partner areas are role-isolated.',
    'core_principle', 'The strongest platforms become ecosystems — customers learn from each other, not only from Aipify.',
    'hub_highlights', v_highlights,
    'discussions', v_discussions,
    'industry_groups', v_groups,
    'best_practices', v_practices,
    'reputation_metrics', v_reputation,
    'events', v_events,
    'partner_network', v_partner,
    'community_intelligence', v_intelligence,
    'companion_guidance', v_companion,
    'success_stories', v_stories,
    'certifications', v_certs,
    'marketplace_prep', v_marketplace,
    'executive_overview', v_executive,
    'governance_controls', v_governance,
    'audit_history', v_audit,
    'statistics', jsonb_build_object(
      'discussion_count', jsonb_array_length(v_discussions),
      'group_count', jsonb_array_length(v_groups),
      'event_count', jsonb_array_length(v_events),
      'story_count', jsonb_array_length(v_stories)
    )
  );
end; $$;

grant execute on function public.get_customer_community_network_center() to authenticated;
