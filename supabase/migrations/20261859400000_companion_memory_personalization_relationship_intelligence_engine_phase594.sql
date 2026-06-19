-- Phase 594 — Aipify Companion Memory, Personalization & Relationship Intelligence Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/memory/*
-- Helpers: _cmri594_*

create table if not exists public.organization_cmri594_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  memory_center_enabled boolean not null default true,
  preference_engine_enabled boolean not null default true,
  relationship_intelligence_enabled boolean not null default true,
  review_center_enabled boolean not null default true,
  permission_governance_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_cmri594_settings enable row level security;
revoke all on public.organization_cmri594_settings from authenticated, anon;

create table if not exists public.organization_cmri594_memories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_key text not null,
  memory_title text not null,
  memory_class text not null check (
    memory_class in (
      'personal', 'organizational', 'operational', 'companion', 'knowledge', 'temporary', 'permanent'
    )
  ),
  retention_type text not null default 'permanent' check (retention_type in ('temporary', 'permanent')),
  memory_status text not null default 'active' check (memory_status in ('active', 'review', 'disabled')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, memory_key)
);

alter table public.organization_cmri594_memories enable row level security;
revoke all on public.organization_cmri594_memories from authenticated, anon;

create table if not exists public.organization_cmri594_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  preference_key text not null,
  preference_title text not null,
  preference_category text not null check (
    preference_category in (
      'language', 'timezone', 'notifications', 'work_schedule', 'communication',
      'dashboard', 'companion'
    )
  ),
  preference_value text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, preference_key)
);

alter table public.organization_cmri594_preferences enable row level security;
revoke all on public.organization_cmri594_preferences from authenticated, anon;

create table if not exists public.organization_cmri594_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  relationship_key text not null,
  relationship_title text not null,
  relationship_type text not null check (
    relationship_type in ('team', 'manager', 'customer', 'partner', 'department', 'project', 'mentor')
  ),
  health_score integer not null default 75 check (health_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, relationship_key)
);

alter table public.organization_cmri594_relationships enable row level security;
revoke all on public.organization_cmri594_relationships from authenticated, anon;

create table if not exists public.organization_cmri594_important_dates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  date_key text not null,
  date_title text not null,
  date_type text not null check (
    date_type in ('birthday', 'work_anniversary', 'contract_renewal', 'customer_milestone', 'partner_milestone', 'event')
  ),
  occurs_at date not null,
  reminder_status text not null default 'scheduled',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, date_key)
);

alter table public.organization_cmri594_important_dates enable row level security;
revoke all on public.organization_cmri594_important_dates from authenticated, anon;

create table if not exists public.organization_cmri594_follow_ups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  follow_up_key text not null,
  follow_up_title text not null,
  commitment_type text not null default 'customer',
  follow_up_status text not null default 'open',
  due_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, follow_up_key)
);

alter table public.organization_cmri594_follow_ups enable row level security;
revoke all on public.organization_cmri594_follow_ups from authenticated, anon;

create table if not exists public.organization_cmri594_context (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  context_key text not null,
  context_title text not null,
  context_type text not null check (
    context_type in ('discussion', 'decision', 'request', 'recommendation')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, context_key)
);

alter table public.organization_cmri594_context enable row level security;
revoke all on public.organization_cmri594_context from authenticated, anon;

create table if not exists public.organization_cmri594_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  permission_key text not null,
  permission_title text not null,
  can_remember boolean not null default true,
  retention_days integer,
  privacy_level text not null default 'metadata' check (privacy_level in ('metadata', 'restricted', 'prohibited')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, permission_key)
);

alter table public.organization_cmri594_permissions enable row level security;
revoke all on public.organization_cmri594_permissions from authenticated, anon;

create table if not exists public.organization_cmri594_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_action text not null check (
    review_action in ('review', 'delete', 'correct', 'approve', 'disable')
  ),
  review_status text not null default 'pending',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, review_key)
);

alter table public.organization_cmri594_reviews enable row level security;
revoke all on public.organization_cmri594_reviews from authenticated, anon;

create table if not exists public.organization_cmri594_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_title text not null,
  engine_name text not null,
  integration_status text not null default 'connected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, integration_key)
);

alter table public.organization_cmri594_integrations enable row level security;
revoke all on public.organization_cmri594_integrations from authenticated, anon;

create table if not exists public.organization_cmri594_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  preferences_count integer not null default 0,
  relationships_count integer not null default 0,
  follow_ups_count integer not null default 0,
  milestones_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_cmri594_business_packs enable row level security;
revoke all on public.organization_cmri594_business_packs from authenticated, anon;

create table if not exists public.organization_cmri594_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'companion_memory',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_cmri594_audit_logs enable row level security;
revoke all on public.organization_cmri594_audit_logs from authenticated, anon;

create or replace function public._cmri594_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmri594_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'companion_memory'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cmri594_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'companion_memory'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmri594_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cmri594_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmri594_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._cmri594_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_cmri594_memories where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_cmri594_memories (
    organization_id, memory_key, memory_title, memory_class, retention_type, memory_status, summary
  ) values
    (p_org_id, 'mem_personal_style', 'Prefers concise summaries', 'personal', 'permanent', 'active', 'Personal communication preference.'),
    (p_org_id, 'mem_org_renewal', 'Q2 renewal cycle focus', 'organizational', 'permanent', 'active', 'Organizational operational memory.'),
    (p_org_id, 'mem_ops_support', 'Support escalation pattern', 'operational', 'temporary', 'active', 'Operational context from last quarter.'),
    (p_org_id, 'mem_companion_brief', 'Executive briefing preference', 'companion', 'permanent', 'active', 'Companion personalization memory.'),
    (p_org_id, 'mem_knowledge_playbook', 'Support playbook v12 approved', 'knowledge', 'permanent', 'active', 'Knowledge memory integration.');

  insert into public.organization_cmri594_preferences (
    organization_id, preference_key, preference_title, preference_category, preference_value, summary
  ) values
    (p_org_id, 'pref_lang', 'Language', 'language', 'en', 'English preferred.'),
    (p_org_id, 'pref_tz', 'Timezone', 'timezone', 'Europe/Oslo', 'Oslo timezone.'),
    (p_org_id, 'pref_notify', 'Notifications', 'notifications', 'mobile + desktop', 'Prefers mobile notifications for urgent items.'),
    (p_org_id, 'pref_schedule', 'Work Schedule', 'work_schedule', 'Mon–Fri 08:00–17:00', 'Standard business hours.'),
    (p_org_id, 'pref_comm', 'Communication Style', 'communication', 'concise executive', 'Prefers concise summaries.'),
    (p_org_id, 'pref_dashboard', 'Dashboard Preferences', 'dashboard', 'executive overview first', 'Executive briefing on login.'),
    (p_org_id, 'pref_companion', 'Companion Preferences', 'companion', 'proactive reminders', 'Companion follow-up enabled.');

  insert into public.organization_cmri594_relationships (
    organization_id, relationship_key, relationship_title, relationship_type, health_score, summary
  ) values
    (p_org_id, 'rel_acme', 'Acme Retail — Customer', 'customer', 72, 'Key enterprise customer relationship.'),
    (p_org_id, 'rel_nordic', 'Nordic Integrator — Partner', 'partner', 85, 'Growth partner relationship.'),
    (p_org_id, 'rel_cs_team', 'Customer Success Team', 'team', 90, 'Internal team context.'),
    (p_org_id, 'rel_fin_mgr', 'Finance Manager', 'manager', 88, 'Approval and budget context.');

  insert into public.organization_cmri594_important_dates (
    organization_id, date_key, date_title, date_type, occurs_at, reminder_status, summary
  ) values
    (p_org_id, 'date_anniversary', 'Acme — Customer Anniversary', 'customer_milestone', current_date + interval '14 days', 'scheduled', 'Customer anniversary approaching — reminder generated.'),
    (p_org_id, 'date_renewal', 'Enterprise Contract Renewal', 'contract_renewal', current_date + interval '30 days', 'scheduled', 'Contract renewal milestone.'),
    (p_org_id, 'date_partner', 'Partner Milestone — Nordic Integrator', 'partner_milestone', current_date + interval '7 days', 'scheduled', 'Partner milestone review.');

  insert into public.organization_cmri594_follow_ups (
    organization_id, follow_up_key, follow_up_title, commitment_type, follow_up_status, due_at, summary
  ) values
    (p_org_id, 'fu_customer', 'Contact Acme about renewal', 'customer', 'open', now() + interval '3 days', 'Remember to contact customer.'),
    (p_org_id, 'fu_contract', 'Review vendor contract', 'vendor', 'open', now() + interval '5 days', 'Remember to review contract.'),
    (p_org_id, 'fu_proposal', 'Send expansion proposal', 'customer', 'open', now() + interval '2 days', 'Remember to send proposal.');

  insert into public.organization_cmri594_context (
    organization_id, context_key, context_title, context_type, summary
  ) values
    (p_org_id, 'ctx_discussion', 'Previous discussion — pricing options', 'discussion', 'Context from prior conversation.'),
    (p_org_id, 'ctx_decision', 'Previous decision — defer automation', 'decision', 'Decision memory for continuity.'),
    (p_org_id, 'ctx_request', 'Previous request — board summary', 'request', 'Request context retained.'),
    (p_org_id, 'ctx_rec', 'Previous recommendation — expand Support Pack', 'recommendation', 'Recommendation context.');

  insert into public.organization_cmri594_permissions (
    organization_id, permission_key, permission_title, can_remember, retention_days, privacy_level, summary
  ) values
    (p_org_id, 'perm_metadata', 'Operational Metadata', true, 365, 'metadata', 'Metadata-only memory allowed.'),
    (p_org_id, 'perm_restricted', 'Sensitive Categories', false, null, 'restricted', 'Requires explicit approval.'),
    (p_org_id, 'perm_prohibited', 'Prohibited Content', false, null, 'prohibited', 'Never store raw conversations or PII.');

  insert into public.organization_cmri594_reviews (
    organization_id, review_key, review_title, review_action, review_status, summary
  ) values
    (p_org_id, 'rev_pending', 'Review new personal memory', 'review', 'pending', 'User can review, delete, correct, approve, or disable.'),
    (p_org_id, 'rev_approve', 'Approve organizational memory', 'approve', 'pending', 'Transparency-first memory review.');

  insert into public.organization_cmri594_integrations (
    organization_id, integration_key, integration_title, engine_name, summary
  ) values
    (p_org_id, 'int_knowledge', 'Knowledge Engine', 'Knowledge Engine', 'Broader organizational context.'),
    (p_org_id, 'int_decision', 'Decision Engine', 'Decision Engine', 'Decision history integration.'),
    (p_org_id, 'int_learning', 'Learning Engine', 'Learning Engine', 'Approved learning metadata.'),
    (p_org_id, 'int_cs', 'Customer Success Engine', 'Customer Success', 'Customer relationship context.'),
    (p_org_id, 'int_events', 'Event Engine', 'Event Bus', 'Activity and milestone signals.');

  insert into public.organization_cmri594_business_packs (
    organization_id, pack_key, pack_title, preferences_count, relationships_count, follow_ups_count, milestones_count, summary
  ) values
    (p_org_id, 'hosts', 'Hosts Pack', 6, 4, 2, 3, 'Hosts Pack → Guest Preferences.'),
    (p_org_id, 'support', 'Support Pack', 5, 8, 6, 2, 'Support Pack → Customer History.'),
    (p_org_id, 'partner', 'Partner Pack', 3, 5, 4, 1, 'Partner Pack → Partner Relationships.');

  perform public._cmri594_log(p_org_id, 'memory_created', 'Companion memory center baseline seeded.');
end; $$;

create or replace function public.get_organization_memory_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v_org_id := public._cmri594_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmri594_seed(v_org_id);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'A great assistant remembers tasks. A great companion remembers context.',
      'privacy_note', 'Useful personalization only — metadata-first, governance and review always available.',
      'executive_dashboard', jsonb_build_object(
        'upcoming_milestones', (select count(*) from public.organization_cmri594_important_dates where organization_id = v_org_id),
        'open_follow_ups', (select count(*) from public.organization_cmri594_follow_ups where organization_id = v_org_id and follow_up_status = 'open'),
        'relationship_count', (select count(*) from public.organization_cmri594_relationships where organization_id = v_org_id),
        'avg_relationship_health', coalesce((select round(avg(health_score)) from public.organization_cmri594_relationships where organization_id = v_org_id), 75),
        'pending_reviews', (select count(*) from public.organization_cmri594_reviews where organization_id = v_org_id and review_status = 'pending'),
        'commitments', (select count(*) from public.organization_cmri594_follow_ups where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'memories', (select count(*) from public.organization_cmri594_memories where organization_id = v_org_id),
        'preferences', (select count(*) from public.organization_cmri594_preferences where organization_id = v_org_id),
        'relationships', (select count(*) from public.organization_cmri594_relationships where organization_id = v_org_id),
        'important_dates', (select count(*) from public.organization_cmri594_important_dates where organization_id = v_org_id),
        'follow_ups', (select count(*) from public.organization_cmri594_follow_ups where organization_id = v_org_id and follow_up_status = 'open'),
        'context_items', (select count(*) from public.organization_cmri594_context where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'follow_up_title', f.follow_up_title, 'recommendation', f.summary
        ) order by f.due_at nulls last)
        from public.organization_cmri594_follow_ups f
        where f.organization_id = v_org_id and f.follow_up_status = 'open'
        limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'A great assistant remembers tasks. A great companion remembers context.',
    'privacy_note', 'Useful personalization only — not surveillance.',
    'executive_dashboard', jsonb_build_object(
      'upcoming_milestones', (select count(*) from public.organization_cmri594_important_dates where organization_id = v_org_id),
      'open_follow_ups', (select count(*) from public.organization_cmri594_follow_ups where organization_id = v_org_id and follow_up_status = 'open'),
      'relationship_count', (select count(*) from public.organization_cmri594_relationships where organization_id = v_org_id),
      'avg_relationship_health', coalesce((select round(avg(health_score)) from public.organization_cmri594_relationships where organization_id = v_org_id), 75),
      'pending_reviews', (select count(*) from public.organization_cmri594_reviews where organization_id = v_org_id and review_status = 'pending'),
      'commitments', (select count(*) from public.organization_cmri594_follow_ups where organization_id = v_org_id)
    ),
    'memories', coalesce((select jsonb_agg(jsonb_build_object(
      'memory_key', m.memory_key, 'memory_title', m.memory_title, 'memory_class', m.memory_class,
      'retention_type', m.retention_type, 'memory_status', m.memory_status, 'summary', m.summary
    ) order by m.memory_class) from public.organization_cmri594_memories m where m.organization_id = v_org_id), '[]'::jsonb),
    'preferences', coalesce((select jsonb_agg(jsonb_build_object(
      'preference_key', p.preference_key, 'preference_title', p.preference_title,
      'preference_category', p.preference_category, 'preference_value', p.preference_value, 'summary', p.summary
    ) order by p.preference_category) from public.organization_cmri594_preferences p where p.organization_id = v_org_id), '[]'::jsonb),
    'relationships', coalesce((select jsonb_agg(jsonb_build_object(
      'relationship_key', r.relationship_key, 'relationship_title', r.relationship_title,
      'relationship_type', r.relationship_type, 'health_score', r.health_score, 'summary', r.summary
    ) order by r.health_score) from public.organization_cmri594_relationships r where r.organization_id = v_org_id), '[]'::jsonb),
    'important_dates', coalesce((select jsonb_agg(jsonb_build_object(
      'date_key', d.date_key, 'date_title', d.date_title, 'date_type', d.date_type,
      'occurs_at', d.occurs_at, 'reminder_status', d.reminder_status, 'summary', d.summary
    ) order by d.occurs_at) from public.organization_cmri594_important_dates d where d.organization_id = v_org_id), '[]'::jsonb),
    'follow_ups', coalesce((select jsonb_agg(jsonb_build_object(
      'follow_up_key', f.follow_up_key, 'follow_up_title', f.follow_up_title,
      'commitment_type', f.commitment_type, 'follow_up_status', f.follow_up_status,
      'due_at', f.due_at, 'summary', f.summary
    ) order by f.due_at nulls last) from public.organization_cmri594_follow_ups f where f.organization_id = v_org_id), '[]'::jsonb),
    'context', coalesce((select jsonb_agg(jsonb_build_object(
      'context_key', c.context_key, 'context_title', c.context_title,
      'context_type', c.context_type, 'summary', c.summary
    ) order by c.context_type) from public.organization_cmri594_context c where c.organization_id = v_org_id), '[]'::jsonb),
    'permissions', coalesce((select jsonb_agg(jsonb_build_object(
      'permission_key', p.permission_key, 'permission_title', p.permission_title,
      'can_remember', p.can_remember, 'retention_days', p.retention_days,
      'privacy_level', p.privacy_level, 'summary', p.summary
    ) order by p.permission_title) from public.organization_cmri594_permissions p where p.organization_id = v_org_id), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_title', r.review_title,
      'review_action', r.review_action, 'review_status', r.review_status, 'summary', r.summary
    ) order by r.review_status) from public.organization_cmri594_reviews r where r.organization_id = v_org_id), '[]'::jsonb),
    'integrations', coalesce((select jsonb_agg(jsonb_build_object(
      'integration_key', i.integration_key, 'integration_title', i.integration_title,
      'engine_name', i.engine_name, 'integration_status', i.integration_status, 'summary', i.summary
    ) order by i.integration_title) from public.organization_cmri594_integrations i where i.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'preferences_count', p.preferences_count,
      'relationships_count', p.relationships_count, 'follow_ups_count', p.follow_ups_count,
      'milestones_count', p.milestones_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_cmri594_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'follow_up', 'What should I follow up?',
      'commitments', 'What commitments exist?',
      'customers', 'Which customers need attention?',
      'dates', 'What important dates are approaching?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_cmri594_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'review_memory', true, 'add_reminders', true, 'review_commitments', true,
      'review_milestones', true, 'manage_preferences', true
    )
  );
end;
$$;

create or replace function public.get_aipify_relationship_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_memory_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Relationship Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'follow_up',
        'observation', format('%s open follow-up commitment(s).', v_stats->>'follow_ups'),
        'recommendation', 'Review follow-ups before end of week.',
        'href', '/app/memory/reports'
      ),
      jsonb_build_object(
        'key', 'dates',
        'observation', format('%s important date(s) on horizon.', v_stats->>'important_dates'),
        'recommendation', 'Prepare reminders for upcoming milestones.',
        'href', '/app/memory/organization'
      ),
      jsonb_build_object(
        'key', 'relationships',
        'observation', format('%s tracked relationship(s) — avg health %s.', v_stats->>'relationships', v_exec->>'avg_relationship_health'),
        'recommendation', 'Review customers needing attention.',
        'href', '/app/memory/relationships'
      ),
      jsonb_build_object(
        'key', 'review',
        'observation', format('%s memory review(s) pending.', v_exec->>'pending_reviews'),
        'recommendation', 'Complete memory review for transparency.',
        'href', '/app/memory/reviews'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_memory_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_memory_center('overview');
end;
$$;

grant execute on function public.get_organization_memory_center(text) to authenticated;
grant execute on function public.get_aipify_relationship_advisor_bundle() to authenticated;
grant execute on function public.get_organization_memory_center_mobile_summary() to authenticated;
