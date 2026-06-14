-- Phase 99 — Aipify Manifesto & Founding Vision
-- Principle: Purpose beyond functionality.

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
    'aipify_manifesto'
  )
);

-- ---------------------------------------------------------------------------
-- 1. manifesto_settings
-- ---------------------------------------------------------------------------
create table if not exists public.manifesto_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  manifesto_enabled boolean not null default true,
  acknowledgement_required boolean not null default true,
  vision_publication_enabled boolean not null default true,
  review_cycle_months int not null default 12,
  current_version text not null default '1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.manifesto_settings enable row level security;
revoke all on public.manifesto_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. manifesto_versions + founding_statements
-- ---------------------------------------------------------------------------
create table if not exists public.manifesto_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_label text not null,
  title text not null,
  founding_belief text not null,
  aipify_promise text not null,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  effective_at timestamptz not null default now(),
  unique (tenant_id, version_label)
);

alter table public.manifesto_versions enable row level security;
revoke all on public.manifesto_versions from authenticated, anon;

create table if not exists public.founding_statements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_id uuid references public.manifesto_versions (id) on delete cascade,
  statement_key text not null,
  title text not null,
  content text not null,
  sort_order int not null default 0,
  unique (tenant_id, statement_key)
);

alter table public.founding_statements enable row level security;
revoke all on public.founding_statements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. strategic_themes, organizational_commitments, vision_updates
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_themes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_id uuid references public.manifesto_versions (id) on delete cascade,
  theme_key text not null,
  theme_number int not null,
  title text not null,
  description text not null,
  category text not null default 'belief' check (
    category in ('belief', 'aspiration', 'philosophy', 'view')
  ),
  sort_order int not null default 0,
  unique (tenant_id, theme_key)
);

alter table public.strategic_themes enable row level security;
revoke all on public.strategic_themes from authenticated, anon;

create table if not exists public.organizational_commitments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  commitment_key text not null,
  title text not null,
  description text not null,
  commitment_type text not null check (
    commitment_type in ('customer', 'employee', 'partner', 'responsibility', 'global')
  ),
  status text not null default 'active' check (status in ('active', 'reviewed', 'updated')),
  unique (tenant_id, commitment_key)
);

alter table public.organizational_commitments enable row level security;
revoke all on public.organizational_commitments from authenticated, anon;

create table if not exists public.vision_updates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  update_type text not null check (
    update_type in ('maturity', 'expression', 'strategic', 'stakeholder', 'publication')
  ),
  title text not null,
  summary text,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'deferred')
  ),
  alignment_score numeric(5, 2),
  scheduled_at timestamptz,
  completed_at timestamptz
);

alter table public.vision_updates enable row level security;
revoke all on public.vision_updates from authenticated, anon;

create table if not exists public.manifesto_stakeholder_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vision_update_id uuid references public.vision_updates (id) on delete set null,
  feedback_summary text not null,
  stakeholder_type text not null default 'customer' check (
    stakeholder_type in ('customer', 'employee', 'partner', 'executive', 'prospect', 'advisory', 'community')
  ),
  created_at timestamptz not null default now()
);

alter table public.manifesto_stakeholder_feedback enable row level security;
revoke all on public.manifesto_stakeholder_feedback from authenticated, anon;

create table if not exists public.manifesto_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  theme_id uuid references public.strategic_themes (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  acknowledged_at timestamptz not null default now(),
  unique (tenant_id, theme_id, user_id)
);

alter table public.manifesto_acknowledgements enable row level security;
revoke all on public.manifesto_acknowledgements from authenticated, anon;

create table if not exists public.vision_publications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  publication_key text not null,
  title text not null,
  summary text not null,
  audience text not null default 'all' check (
    audience in ('all', 'customers', 'employees', 'partners', 'executives', 'prospects')
  ),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz not null default now(),
  unique (tenant_id, publication_key)
);

alter table public.vision_publications enable row level security;
revoke all on public.vision_publications from authenticated, anon;

create table if not exists public.manifesto_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.manifesto_briefings enable row level security;
revoke all on public.manifesto_briefings from authenticated, anon;

create table if not exists public.manifesto_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.manifesto_audit_log enable row level security;
revoke all on public.manifesto_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers (_amf_)
-- ---------------------------------------------------------------------------
create or replace function public._amf_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._amf_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._amf_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.manifesto_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'aipify_manifesto_' || p_event_type, 'aipify_manifesto', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._amf_ensure_settings(p_tenant_id uuid)
returns public.manifesto_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.manifesto_settings;
begin
  insert into public.manifesto_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.manifesto_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._amf_seed_version(p_tenant_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_version_id uuid;
begin
  insert into public.manifesto_versions (tenant_id, version_label, title, founding_belief, aipify_promise, status)
  select p_tenant_id, '1.0', 'Aipify Manifesto',
    'Businesses should not have to navigate complexity alone. Artificial intelligence should become a trusted companion for everyone.',
    'Aipify promises to pursue progress without losing perspective. To innovate without abandoning responsibility. To scale without sacrificing humanity.',
    'active'
  where not exists (select 1 from public.manifesto_versions v where v.tenant_id = p_tenant_id and v.version_label = '1.0')
  returning id into v_version_id;

  if v_version_id is null then
    select id into v_version_id from public.manifesto_versions where tenant_id = p_tenant_id and version_label = '1.0';
  end if;

  return v_version_id;
end; $$;

create or replace function public._amf_seed_founding_statements(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_version_id uuid;
begin
  v_version_id := public._amf_seed_version(p_tenant_id);

  insert into public.founding_statements (tenant_id, version_id, statement_key, title, content, sort_order)
  select p_tenant_id, v_version_id, v.key, v.title, v.content, v.ord
  from (values
    ('founding_statement', 'The Founding Statement',
     'AIPIFY was founded on a simple idea: Businesses deserve intelligent support systems that help people perform at their best. The future of work should feel more empowering, more meaningful, and more connected.', 1),
    ('problem_we_observe', 'The Problem We Observe',
     'Modern organizations face increasing complexity — administrative burdens, information overload, fragmented systems, and rising expectations. Technology often introduces additional complexity instead of reducing it.', 2),
    ('future_we_envision', 'The Future We Envision',
     'Every business has access to intelligent assistance. People spend less time on unnecessary tasks. Knowledge becomes more accessible. Technology supports human wellbeing and strengthens relationships.', 3),
    ('what_aipify_shall_become', 'What AIPIFY Shall Become',
     'AIPIFY shall become an AI Business Operating System — an intelligent companion helping organizations operate more effectively, not merely a chatbot, automation tool, or support platform.', 4)
  ) as v(key, title, content, ord)
  where not exists (select 1 from public.founding_statements f where f.tenant_id = p_tenant_id and f.statement_key = v.key);
end; $$;

create or replace function public._amf_seed_themes(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_version_id uuid;
begin
  v_version_id := public._amf_seed_version(p_tenant_id);

  insert into public.strategic_themes (tenant_id, version_id, theme_key, theme_number, title, description, category, sort_order)
  select p_tenant_id, v_version_id, v.key, v.num, v.title, v.item_description, v.cat, v.num
  from (values
    ('technology_flourish', 1, 'Technology Should Help People Flourish', 'We believe that technology should help people flourish.', 'belief'),
    ('reduce_complexity', 2, 'Complexity Should Be Reduced', 'We believe complexity should be reduced, not multiplied.', 'belief'),
    ('intelligent_support', 3, 'Organizations Deserve Intelligent Support', 'We believe organizations deserve intelligent support.', 'belief'),
    ('trust_earned', 4, 'Trust Must Be Earned', 'We believe trust must be earned repeatedly through reliability, transparency, and consistency.', 'belief'),
    ('innovation_responsibility', 5, 'Innovation Requires Responsibility', 'We believe innovation should be intentional and serve genuine needs.', 'belief'),
    ('learning_never_ends', 6, 'Learning Never Ends', 'We believe learning is essential as organizations, markets, and technology evolve.', 'belief'),
    ('future_more_human', 7, 'The Future Can Become More Human', 'We believe the future of work can become more human, not less.', 'belief'),
    ('build_toward_future', 8, 'We Choose to Build Toward That Future', 'And we choose to build toward that future.', 'belief'),
    ('empower_people', 9, 'Empower People', 'We aspire to build systems that empower people and simplify complexity.', 'aspiration'),
    ('technology_adapts', 10, 'Technology Adapts to People', 'Technology should adapt to people. People should not be forced to adapt to technology.', 'philosophy'),
    ('ai_as_amplifier', 11, 'AI as an Amplifier', 'We view AI as an amplifier that strengthens human capability, not diminishes human dignity.', 'view'),
    ('global_local_understanding', 12, 'Global Success Requires Local Understanding', 'AIPIFY aspires to serve organizations across cultures while respecting local understanding.', 'view')
  ) as v(key, num, title, item_description, cat)
  where not exists (select 1 from public.strategic_themes t where t.tenant_id = p_tenant_id and t.theme_key = v.key);
end; $$;

create or replace function public._amf_seed_commitments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_commitments (tenant_id, commitment_key, title, description, commitment_type)
  select p_tenant_id, v.key, v.title, v.item_description, v.type
  from (values
    ('listen_carefully', 'Listen Carefully', 'We commit to listening carefully to customers and stakeholders.', 'customer'),
    ('improve_continuously', 'Improve Continuously', 'We commit to improving continuously and communicating honestly.', 'customer'),
    ('act_responsibly', 'Act Responsibly', 'We commit to acting responsibly and building thoughtfully.', 'customer'),
    ('meaningful_work', 'Meaningful Work Matters', 'Technology should help people focus on creativity, problem solving, and strategic thinking.', 'employee'),
    ('professional_growth', 'Support Professional Growth', 'We believe technology should create space for professional growth and human connection.', 'employee'),
    ('mutual_respect', 'Mutual Respect', 'Partnerships shall be built on mutual respect, shared learning, and integrity.', 'partner'),
    ('transparency_partners', 'Transparency with Partners', 'Partnerships require transparency and a shared commitment to customer success.', 'partner'),
    ('capability_responsibility', 'Capability Brings Responsibility', 'We shall strive to make decisions that support long-term wellbeing and societal benefit.', 'responsibility'),
    ('cultural_diversity', 'Respect for Diversity', 'Global success requires local understanding. Respect for diversity strengthens innovation.', 'global')
  ) as v(key, title, item_description, type)
  where not exists (select 1 from public.organizational_commitments c where c.tenant_id = p_tenant_id and c.commitment_key = v.key);
end; $$;

create or replace function public._amf_seed_vision_updates(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.vision_updates (tenant_id, update_type, title, summary, status, alignment_score, scheduled_at, completed_at)
  select p_tenant_id, v.type, v.title, v.summary, v.status, v.score, v.sched, v.completed
  from (values
    ('strategic', 'Annual Vision Review', 'Leadership review of manifesto alignment and strategic direction.', 'scheduled', null::numeric, now() + interval '120 days', null::timestamptz),
    ('maturity', 'Q1 Vision Maturity Assessment', 'Assessment of how product decisions reflect founding vision.', 'completed', 93.0, now() - interval '60 days', now() - interval '30 days'),
    ('stakeholder', 'Partner Vision Alignment', 'Partner feedback on manifesto clarity and shared purpose.', 'completed', 90.0, now() - interval '45 days', now() - interval '10 days')
  ) as v(type, title, summary, status, score, sched, completed)
  where not exists (select 1 from public.vision_updates u where u.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._amf_seed_publications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.vision_publications (tenant_id, publication_key, title, summary, audience, status, published_at)
  select p_tenant_id, v.key, v.title, v.summary, v.audience, 'published', now() - v.days * interval '1 day'
  from (values
    ('founding_vision', 'Founding Vision Statement', 'Why AIPIFY was created and what it seeks to become.', 'all', 90),
    ('customer_promise', 'The AIPIFY Promise', 'Our commitment to progress, responsibility, and humanity at scale.', 'customers', 60),
    ('partner_vision', 'Partner Vision Brief', 'Shared aspirations for partners contributing to the ecosystem.', 'partners', 30)
  ) as v(key, title, summary, audience, days)
  where not exists (select 1 from public.vision_publications p where p.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._amf_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_themes int;
  v_acknowledged int;
  v_alignment numeric;
  v_manifesto_score numeric;
begin
  select count(*) into v_themes from public.strategic_themes where tenant_id = p_tenant_id;
  select count(distinct theme_id) into v_acknowledged from public.manifesto_acknowledgements where tenant_id = p_tenant_id;

  select coalesce(avg(alignment_score), 91.0) into v_alignment
  from public.vision_updates where tenant_id = p_tenant_id and status = 'completed';

  v_manifesto_score := least(100, round(
    v_alignment * 0.5 +
    coalesce(100.0 * v_acknowledged / nullif(v_themes, 0), 0) * 0.3 +
    10, 1
  ));

  return jsonb_build_object(
    'manifesto_score', v_manifesto_score,
    'themes_count', v_themes,
    'themes_acknowledged', v_acknowledged,
    'vision_alignment_score', round(v_alignment, 1),
    'publications_count', (select count(*) from public.vision_publications where tenant_id = p_tenant_id and status = 'published')
  );
end; $$;

create or replace function public._amf_trust_explanation(p_tenant_id uuid, p_score numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'amf-score-' || p_tenant_id::text,
    'aipify_manifesto',
    'aipify_manifesto',
    'Manifesto alignment: ' || p_score || '/100',
    'Purpose beyond functionality. The Manifesto reminds us why AIPIFY exists.',
    jsonb_build_array(
      jsonb_build_object('source', 'strategic_themes'),
      jsonb_build_object('source', 'founding_statements'),
      jsonb_build_object('source', 'vision_publications')
    ),
    jsonb_build_array('human_oversight', 'transparency', 'audit_logged'),
    'high', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.acknowledge_manifesto_theme(p_theme_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._amf_require_tenant();
  v_user_id := public._amf_auth_user_id();
  insert into public.manifesto_acknowledgements (tenant_id, theme_id, user_id)
  values (v_tenant_id, p_theme_id, v_user_id)
  on conflict (tenant_id, theme_id, user_id) do nothing;
  perform public._amf_log_audit(v_tenant_id, 'theme_acknowledged', 'Manifesto theme acknowledged', 'acknowledgement',
    jsonb_build_object('theme_id', p_theme_id));
  return jsonb_build_object('status', 'acknowledged');
end; $$;

create or replace function public.complete_vision_update(p_update_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._amf_require_tenant();
  update public.vision_updates
  set status = 'completed', completed_at = now(), alignment_score = coalesce(alignment_score, 88.0)
  where id = p_update_id and tenant_id = v_tenant_id;
  perform public._amf_log_audit(v_tenant_id, 'vision_update_completed', 'Vision update completed', 'vision_governance',
    jsonb_build_object('update_id', p_update_id));
  return jsonb_build_object('status', 'completed');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_aipify_manifesto_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._amf_require_tenant();
  perform public._amf_ensure_settings(v_tenant_id);
  perform public._amf_seed_themes(v_tenant_id);
  v_metrics := public._amf_refresh_metrics(v_tenant_id);

  v_summary := 'Manifesto briefing: alignment ' || (v_metrics->>'manifesto_score') || '/100, '
    || (v_metrics->>'themes_count') || ' themes, '
    || (v_metrics->>'themes_acknowledged') || ' acknowledged.';

  insert into public.manifesto_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics)
  returning id into v_id;

  perform public._amf_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_aipify_manifesto_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_settings public.manifesto_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._amf_ensure_settings(v_tenant_id);
  perform public._amf_seed_themes(v_tenant_id);
  v_metrics := public._amf_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'manifesto_score', v_metrics->'manifesto_score',
    'themes_count', v_metrics->'themes_count',
    'current_version', v_settings.current_version,
    'philosophy', 'Purpose beyond functionality.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_aipify_manifesto_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.manifesto_settings;
  v_version public.manifesto_versions;
  v_metrics jsonb;
  v_user_id uuid;
begin
  v_tenant_id := public._amf_require_tenant();
  v_user_id := public._amf_auth_user_id();
  v_settings := public._amf_ensure_settings(v_tenant_id);
  perform public._amf_seed_founding_statements(v_tenant_id);
  perform public._amf_seed_themes(v_tenant_id);
  perform public._amf_seed_commitments(v_tenant_id);
  perform public._amf_seed_vision_updates(v_tenant_id);
  perform public._amf_seed_publications(v_tenant_id);
  v_metrics := public._amf_refresh_metrics(v_tenant_id);
  perform public._amf_trust_explanation(v_tenant_id, (v_metrics->>'manifesto_score')::numeric);

  select * into v_version from public.manifesto_versions
  where tenant_id = v_tenant_id and version_label = v_settings.current_version limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Purpose beyond functionality.',
    'safety_note', 'The Manifesto provides strategic direction — it complements the Constitution and applicable legal requirements.',
    'manifesto_enabled', v_settings.manifesto_enabled,
    'acknowledgement_required', v_settings.acknowledgement_required,
    'vision_publication_enabled', v_settings.vision_publication_enabled,
    'current_version', v_settings.current_version,
    'review_cycle_months', v_settings.review_cycle_months,
    'manifesto_score', v_metrics->'manifesto_score',
    'themes_count', v_metrics->'themes_count',
    'themes_acknowledged', v_metrics->'themes_acknowledged',
    'vision_alignment_score', v_metrics->'vision_alignment_score',
    'publications_count', v_metrics->'publications_count',
    'founding_belief', coalesce(v_version.founding_belief, 'Businesses should not have to navigate complexity alone.'),
    'aipify_promise', coalesce(v_version.aipify_promise, 'To pursue progress without losing perspective.'),
    'founding_statements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'statement_key', f.statement_key, 'title', f.title, 'content', f.content
      ) order by f.sort_order)
      from public.founding_statements f where f.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strategic_themes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'theme_key', t.theme_key, 'theme_number', t.theme_number,
        'title', t.title, 'description', t.description, 'category', t.category,
        'acknowledged', exists(
          select 1 from public.manifesto_acknowledgements a
          where a.theme_id = t.id and a.tenant_id = v_tenant_id
            and (a.user_id = v_user_id or a.user_id is null)
        )
      ) order by t.sort_order)
      from public.strategic_themes t where t.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'organizational_commitments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'description', c.description,
        'commitment_type', c.commitment_type, 'status', c.status
      ))
      from public.organizational_commitments c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'vision_updates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', u.id, 'update_type', u.update_type, 'title', u.title,
        'summary', u.summary, 'status', u.status,
        'alignment_score', u.alignment_score, 'scheduled_at', u.scheduled_at
      ) order by u.scheduled_at asc nulls last)
      from public.vision_updates u where u.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'vision_publications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'summary', p.summary,
        'audience', p.audience, 'status', p.status, 'published_at', p.published_at
      ) order by p.published_at desc)
      from public.vision_publications p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'target_audiences', jsonb_build_array(
      'Customers', 'Employees', 'Partners', 'Executives',
      'Prospective Employees', 'Advisory Boards', 'Community Members'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.manifesto_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'constitution', 'Principles that guide behavior alongside vision',
      'knowledge_center', 'Vision documentation and FAQ',
      'academy', 'Founding vision learning programs',
      'partners', 'Partner portal vision alignment',
      'global_expansion', 'Local understanding within global vision'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-manifesto', 'AIPIFY Vision & Manifesto', 'Why AIPIFY exists and what future it seeks to help create.', 'authenticated', 43
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-manifesto' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_aipify_manifesto_card() to authenticated;
grant execute on function public.get_aipify_manifesto_dashboard() to authenticated;
grant execute on function public.generate_aipify_manifesto_briefing() to authenticated;
grant execute on function public.acknowledge_manifesto_theme(uuid) to authenticated;
grant execute on function public.complete_vision_update(uuid) to authenticated;
