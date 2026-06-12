-- Implementation Blueprint Phase 47 — Sales Community & Mentorship Engine
-- Extends Sales Expert Operating System (Phase A.95 + Phase 41 + 45 + 46 + 42 + Marketing 33-extension).

-- ---------------------------------------------------------------------------
-- Optional scaffold tables — metadata only, tenant-scoped, no PII
-- ---------------------------------------------------------------------------
create table if not exists public.sales_expert_community_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  mentorship_enabled boolean not null default true,
  regional_group text not null default 'nordic' check (
    regional_group in ('nordic', 'europe', 'global', 'en', 'no', 'sv', 'da')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_expert_success_stories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  category text not null check (
    category in (
      'first_customer', 'outreach_ideas', 'challenges_overcome',
      'implementation_wins', 'renewals', 'best_practices', 'mentorship'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  author_display text not null default 'Sales Expert',
  is_scaffold boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sales_expert_success_stories_org_idx
  on public.sales_expert_success_stories (organization_id, category, created_at desc);

create table if not exists public.sales_expert_mentorship_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  mentor_user_id uuid references public.users (id) on delete set null,
  mentee_user_id uuid references public.users (id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'active', 'completed', 'declined', 'paused')
  ),
  voluntary boolean not null default true,
  guidance_focus text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, mentor_user_id, mentee_user_id)
);

create index if not exists sales_expert_mentorship_links_org_idx
  on public.sales_expert_mentorship_links (organization_id, status);

alter table public.sales_expert_community_settings enable row level security;
alter table public.sales_expert_success_stories enable row level security;
alter table public.sales_expert_mentorship_links enable row level security;
revoke all on public.sales_expert_community_settings from authenticated, anon;
revoke all on public.sales_expert_success_stories from authenticated, anon;
revoke all on public.sales_expert_mentorship_links from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers (_scmbp_*)
-- ---------------------------------------------------------------------------
create or replace function public._scmbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Community & Collective Intelligence Phase 89 / Blueprint 24 at /app/community — tenant org-wide knowledge sharing. Phase 47 is Sales Expert peer community and voluntary mentorship within /app/sales-expert-engine Community tab. Cross-links Coach Phase 45/46, Gratitude A.89, Academy Phase 94, Partner Success A.73, Self Love A.76, Phase 41 encouragement leaderboards — collaboration over aggressive competition, no public shaming.';
$$;

create or replace function public._scmbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Build a supportive Sales Expert community where partners learn from each other, share honest success stories, and grow through voluntary mentorship — never alone in the journey.';
$$;

create or replace function public._scmbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Peer learning strengthens everyone. Mentorship is voluntary and respectful. Recognition educates — it does not boast. Community dialogue is constructive, professional, and trust-building.';
$$;

create or replace function public._scmbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) grows when Sales Experts support each other — humans decide, Aipify informs and connects. Community amplifies capability without replacing individual judgment.';
$$;

create or replace function public._scmbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'peer_learning', 'label', 'Peer learning', 'description', 'Share practical lessons from real partner experiences — metadata only'),
    jsonb_build_object('key', 'mentorship', 'label', 'Voluntary mentorship', 'description', 'Experienced experts guide newer partners on demos, follow-ups, confidence, and implementation'),
    jsonb_build_object('key', 'best_practices', 'label', 'Best practices library', 'description', 'Honest playbooks and outreach ideas — educate, not boast'),
    jsonb_build_object('key', 'recognition', 'label', 'Community recognition', 'description', 'Mentor, Community Contributor, Knowledge Champion — encouraging not shaming'),
    jsonb_build_object('key', 'problem_solving', 'label', 'Collaborative problem-solving', 'description', 'Q&A and discussions with constructive dialogue'),
    jsonb_build_object('key', 'belonging', 'label', 'Belonging', 'description', 'Sales Experts are not alone — perspective and encouragement through setbacks')
  );
$$;

create or replace function public._scmbp_blueprint_mentorship_program()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Voluntary mentorship — experienced Sales Experts support newer partners without pressure or hierarchy shame.',
    'status', 'metadata_scaffold',
    'voluntary', true,
    'guidance_areas', jsonb_build_array(
      jsonb_build_object('key', 'demo_preparation', 'label', 'Demo preparation', 'note', 'Structure, discovery questions, honest positioning'),
      jsonb_build_object('key', 'follow_up', 'label', 'Follow-up rhythm', 'note', 'Sustainable cadence — Self Love A.76 pacing respected'),
      jsonb_build_object('key', 'confidence', 'label', 'Confidence building', 'note', 'Encouragement after setbacks — growth not fear'),
      jsonb_build_object('key', 'implementation', 'label', 'Implementation guidance', 'note', 'Onboarding scope, handoff, realistic timelines')
    ),
    'matching_note', 'Mentor-mentee links are voluntary — either party may decline or pause without penalty.',
    'coach_cross_link', 'Phase 45/46 Coach tab recommends mentors and resources — community complements daily coaching'
  );
$$;

create or replace function public._scmbp_blueprint_community_hub()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community hub for discussions, success stories, Q&A, inspiration, and best practice library.',
    'status', 'metadata_scaffold',
    'channels', jsonb_build_array(
      jsonb_build_object('key', 'discussions', 'label', 'Discussions', 'emoji', '💬', 'example_prompt', 'What helped you prepare for your first discovery call?'),
      jsonb_build_object('key', 'success_stories', 'label', 'Success stories', 'emoji', '🌹', 'example_prompt', 'Share how you supported a customer through onboarding — lessons, not boasting.'),
      jsonb_build_object('key', 'qa', 'label', 'Q&A', 'emoji', '🦉', 'example_prompt', 'How do you handle renewal conversations when a customer is uncertain?'),
      jsonb_build_object('key', 'inspiration', 'label', 'Inspiration', 'emoji', '🔔', 'example_prompt', 'A small win this week that reminded you why you chose ethical sales.'),
      jsonb_build_object('key', 'best_practices', 'label', 'Best practice library', 'emoji', '📚', 'example_prompt', 'A follow-up template approach that respects customer timelines.')
    ),
    'trust_rules', jsonb_build_array(
      'Respect and professionalism',
      'Constructive dialogue — no harassment or shaming',
      'Honest advice — no misleading claims about Aipify capabilities',
      'Metadata only in stories — no customer PII'
    )
  );
$$;

create or replace function public._scmbp_blueprint_success_story_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'first_customer', 'label', 'First customer', 'note', 'How you earned trust on your first engagement'),
    jsonb_build_object('key', 'outreach_ideas', 'label', 'Outreach ideas', 'note', 'Ethical approaches that worked — one channel at a time'),
    jsonb_build_object('key', 'challenges_overcome', 'label', 'Challenges overcome', 'note', 'Setbacks and what you learned — educate peers'),
    jsonb_build_object('key', 'implementation_wins', 'label', 'Implementation wins', 'note', 'Quality onboarding outcomes — metadata only'),
    jsonb_build_object('key', 'renewals', 'label', 'Renewals', 'note', 'Relationship-focused renewal conversations'),
    jsonb_build_object('key', 'best_practices', 'label', 'Best practices', 'note', 'Reusable patterns without overpromising'),
    jsonb_build_object('key', 'mentorship', 'label', 'Mentorship reflections', 'note', 'What voluntary mentorship taught both sides')
  );
$$;

create or replace function public._scmbp_blueprint_community_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition celebrates contribution and learning — never aggressive ranking or public shaming.',
    'badges', jsonb_build_array(
      jsonb_build_object('key', 'mentor', 'emoji', '🌹', 'label', 'Mentor', 'description', 'Voluntarily guides newer Sales Experts with patience and honesty'),
      jsonb_build_object('key', 'community_contributor', 'emoji', '🔔', 'label', 'Community Contributor', 'description', 'Shares helpful discussions and answers that educate peers'),
      jsonb_build_object('key', 'knowledge_champion', 'emoji', '🦉', 'label', 'Knowledge Champion', 'description', 'Curates best practices and honest success stories for the library')
    ),
    'leaderboard_cross_link', 'Phase 41 encouragement leaderboards — collaboration over competition',
    'gratitude_cross_link', 'Gratitude & Recognition A.89 — voluntary appreciation, not vanity metrics'
  );
$$;

create or replace function public._scmbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'You are not alone in the Sales Expert journey — community offers encouragement, perspective, and support through setbacks.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'A quiet week does not define your worth — peers have been there too.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Asking for help in the community is strength — not weakness.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Celebrate small progress — sustainable pace builds lasting customer relationships.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences community tone — encouragement only, never pressure.'
  );
$$;

create or replace function public._scmbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community trust requires respect, professionalism, and honest representation of Aipify capabilities.',
    'experts_should_understand', jsonb_build_array(
      'Success story summaries are metadata only — max 500 characters, no customer PII',
      'Mentorship is voluntary — either party may decline or pause',
      'No harassment, shaming, or misleading advice about product capabilities',
      'Regional groups are scaffolds — en/no/sv/da localization supported',
      'Distinct from /app/community Phase 89 org-wide knowledge sharing',
      'Coach tab may recommend community discussions and mentors — complementary surfaces'
    ),
    'metadata_only', true
  );
$$;

create or replace function public._scmbp_blueprint_sales_coach_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Coach recommends relevant discussions, mentors, and community resources — never replaces human judgment.',
    'recommendations', jsonb_build_array(
      jsonb_build_object('key', 'discussions', 'label', 'Recommended discussions', 'example', 'After a tough demo, peers may share discovery tips in Q&A.'),
      jsonb_build_object('key', 'mentors', 'label', 'Mentor matching', 'example', 'Certified experts may volunteer as mentors — voluntary only.'),
      jsonb_build_object('key', 'resources', 'label', 'Resource cross-links', 'example', 'Coach tab links to best practice library and Academy Phase 94 scaffolds.')
    ),
    'coach_tab_cross_link', 'Phase 45 Coach & Enablement — daily coaching complements community belonging',
    'certification_cross_link', 'Phase 46 Certification — mentors often hold Sales Expert tier or above'
  );
$$;

create or replace function public._scmbp_blueprint_regional_groups()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Regional groups support localized peer connection — Nordic first, expandable.',
    'groups', jsonb_build_array(
      jsonb_build_object('key', 'nordic', 'label', 'Nordic', 'locales', jsonb_build_array('no', 'sv', 'da', 'en')),
      jsonb_build_object('key', 'europe', 'label', 'Europe', 'locales', jsonb_build_array('en')),
      jsonb_build_object('key', 'global', 'label', 'Global', 'locales', jsonb_build_array('en'))
    ),
    'default_group', 'nordic',
    'i18n_note', 'Community UI uses customerApp.salesExpertEngine.* in en/no/sv/da'
  );
$$;

create or replace function public._scmbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group Sales Experts participate in the community first — validate mentorship tone, story categories, and recognition badges',
      'focus', jsonb_build_array('Voluntary mentorship workflow', 'Success story library tone', 'Trust and anti-shaming rules', 'Coach-to-community recommendations')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot partner organizations join regional groups before broader rollout',
      'note', 'Dogfooding ensures community never feels competitive or punitive'
    )
  );
$$;

create or replace function public._scmbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Sales Experts grow faster together — when learning is honest and encouragement is genuine.',
    'Mentorship is a gift freely given — never an obligation or status weapon.',
    'Community recognition educates peers and celebrates contribution — not ego.'
  );
$$;

create or replace function public._scmbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'coach_enablement', 'label', 'Coach & Enablement Phase 45', 'route', '/app/sales-expert-engine', 'note', 'Coach tab — recommends discussions and mentors'),
    jsonb_build_object('key', 'certification_field', 'label', 'Certification Phase 46', 'route', '/app/sales-expert-engine', 'note', 'Certification tab — mentor competency scaffold'),
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance & Recognition Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Encouragement leaderboards — not shaming'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition experiences — cross-link only'),
    jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine', 'note', 'Customer success patterns — metadata cross-link'),
    jsonb_build_object('key', 'learning_academy', 'label', 'Academy Phase 94', 'route', '/app/learning-training-engine', 'note', 'Training content — community complements Academy'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Setbacks support and sustainable pacing'),
    jsonb_build_object('key', 'org_community', 'label', 'Org Community Phase 89', 'route', '/app/community', 'note', 'Tenant org knowledge — NOT Sales Expert peer community')
  );
$$;

create or replace function public._scmbp_ensure_settings(p_organization_id uuid)
returns public.sales_expert_community_settings language plpgsql security definer set search_path = public as $$
declare
  v_row public.sales_expert_community_settings;
begin
  perform public._seos_ensure_settings(p_organization_id);

  insert into public.sales_expert_community_settings (organization_id, mentorship_enabled, regional_group)
  values (p_organization_id, true, 'nordic')
  on conflict (organization_id) do nothing;

  select * into v_row from public.sales_expert_community_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._scmbp_seed_org_stories(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.sales_expert_success_stories s
    where s.organization_id = p_organization_id
  ) then
    return;
  end if;

  insert into public.sales_expert_success_stories (organization_id, title, category, summary, author_display, is_scaffold)
  values
    (
      p_organization_id,
      'First customer trust',
      'first_customer',
      'Focused on listening during discovery — recommended only modules that matched their workflow. Customer chose Business plan after a honest demo.',
      'Experienced Sales Expert (scaffold)',
      true
    ),
    (
      p_organization_id,
      'Ethical LinkedIn outreach',
      'outreach_ideas',
      'Shared one helpful KC article per week with a personal note — no mass messaging. Two discovery calls from genuine conversations.',
      'Community Contributor (scaffold)',
      true
    ),
    (
      p_organization_id,
      'Recovery after a quiet month',
      'challenges_overcome',
      'Used Coach tab pacing and community Q&A for perspective. Returned to one channel at a time — signed a customer the following quarter.',
      'Sales Expert peer (scaffold)',
      true
    ),
    (
      p_organization_id,
      'Implementation handoff win',
      'implementation_wins',
      'Documented onboarding scope in portal metadata — customer team trained at their pace. Renewal conversation felt collaborative, not transactional.',
      'Mentor (scaffold)',
      true
    ),
    (
      p_organization_id,
      'Renewal through relationship',
      'renewals',
      'Checked in quarterly with useful resources — never pressure. Customer renewed because outcomes were visible in their operations.',
      'Knowledge Champion (scaffold)',
      true
    );
end; $$;

create or replace function public._scmbp_success_stories_list(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', s.id,
      'title', s.title,
      'category', s.category,
      'summary', s.summary,
      'author_display', s.author_display,
      'is_scaffold', s.is_scaffold,
      'created_at', s.created_at
    ) order by s.created_at desc)
    from public.sales_expert_success_stories s
    where s.organization_id = p_organization_id
    limit 30
  ), '[]'::jsonb);
end; $$;

create or replace function public._scmbp_mentorship_links_list(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', m.id,
      'mentor_user_id', m.mentor_user_id,
      'mentee_user_id', m.mentee_user_id,
      'status', m.status,
      'voluntary', m.voluntary,
      'guidance_focus', m.guidance_focus,
      'created_at', m.created_at
    ) order by m.created_at desc)
    from public.sales_expert_mentorship_links m
    where m.organization_id = p_organization_id
    limit 20
  ), '[]'::jsonb);
end; $$;

create or replace function public._scmbp_community_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.sales_expert_community_settings;
  v_stories_count int;
  v_active_mentorships int;
  v_contributors int;
begin
  v_settings := public._scmbp_ensure_settings(p_organization_id);
  perform public._scmbp_seed_org_stories(p_organization_id);

  select count(*)::int into v_stories_count
  from public.sales_expert_success_stories s
  where s.organization_id = p_organization_id;

  select count(*)::int into v_active_mentorships
  from public.sales_expert_mentorship_links m
  where m.organization_id = p_organization_id and m.status = 'active';

  select count(distinct s.author_display)::int into v_contributors
  from public.sales_expert_success_stories s
  where s.organization_id = p_organization_id;

  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'mentorship_enabled', v_settings.mentorship_enabled,
    'regional_group', v_settings.regional_group,
    'stories_count', v_stories_count,
    'active_mentorships', v_active_mentorships,
    'contributors_count', v_contributors,
    'privacy_note', 'Community summary metadata only — no customer PII in stories or mentorship links.'
  );
end; $$;

create or replace function public._scmbp_community_center_bundle(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.sales_expert_community_settings;
  v_summary jsonb;
begin
  v_settings := public._scmbp_ensure_settings(p_organization_id);
  perform public._scmbp_seed_org_stories(p_organization_id);
  v_summary := public._scmbp_community_summary(p_organization_id);

  return jsonb_build_object(
    'mission', public._scmbp_blueprint_mission(),
    'philosophy', public._scmbp_blueprint_philosophy(),
    'abos_principle', public._scmbp_blueprint_abos_principle(),
    'objectives', public._scmbp_blueprint_objectives(),
    'mentorship_program', public._scmbp_blueprint_mentorship_program(),
    'community_hub', public._scmbp_blueprint_community_hub(),
    'success_story_categories', public._scmbp_blueprint_success_story_categories(),
    'success_stories', public._scmbp_success_stories_list(p_organization_id),
    'community_recognition', public._scmbp_blueprint_community_recognition(),
    'sales_coach_connection', public._scmbp_blueprint_sales_coach_connection(),
    'regional_groups', public._scmbp_blueprint_regional_groups(),
    'self_love', public._scmbp_blueprint_self_love_connection(),
    'trust', public._scmbp_blueprint_trust_connection(),
    'dogfooding', public._scmbp_blueprint_dogfooding(),
    'summary', v_summary,
    'mentorship_links', public._scmbp_mentorship_links_list(p_organization_id),
    'settings', jsonb_build_object(
      'mentorship_enabled', v_settings.mentorship_enabled,
      'regional_group', v_settings.regional_group
    ),
    'distinction_note', public._scmbp_distinction_note(),
    'integration_links', public._scmbp_blueprint_integration_links(),
    'success_criteria', public._scmbp_blueprint_success_criteria(p_organization_id),
    'vision', public._scmbp_blueprint_vision_phrases(),
    'privacy_note', 'Metadata only — story summaries max 500 chars, author display names only, no customer PII.'
  );
end; $$;

create or replace function public._scmbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
begin
  v_summary := public._scmbp_community_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'community_objectives',
      'label', 'Six community objectives documented',
      'met', jsonb_array_length(public._scmbp_blueprint_objectives()) = 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'mentorship_voluntary',
      'label', 'Mentorship program is voluntary',
      'met', (public._scmbp_blueprint_mentorship_program()->>'voluntary')::boolean = true,
      'note', null
    ),
    jsonb_build_object(
      'key', 'community_hub',
      'label', 'Community hub channels scaffolded',
      'met', jsonb_array_length(public._scmbp_blueprint_community_hub()->'channels') >= 5,
      'note', 'Live discussions pending future phase'
    ),
    jsonb_build_object(
      'key', 'success_stories',
      'label', 'Success story library with metadata summaries',
      'met', (v_summary->>'stories_count')::int >= 1,
      'note', 'Scaffold stories seeded per organization — max 500 char summaries'
    ),
    jsonb_build_object(
      'key', 'community_recognition',
      'label', 'Community recognition badges — encouraging not shaming',
      'met', jsonb_array_length(public._scmbp_blueprint_community_recognition()->'badges') = 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'coach_connection',
      'label', 'Sales Coach connection recommends discussions and mentors',
      'met', jsonb_array_length(public._scmbp_blueprint_sales_coach_connection()->'recommendations') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'regional_groups',
      'label', 'Regional groups scaffold with i18n locales',
      'met', jsonb_array_length(public._scmbp_blueprint_regional_groups()->'groups') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — not alone in the journey',
      'met', (public._scmbp_blueprint_self_love_connection()->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust rules — no harassment, shaming, or misleading advice',
      'met', jsonb_array_length(public._scmbp_blueprint_trust_connection()->'experts_should_understand') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dogfooding_ready',
      'label', 'Dogfooding scaffold for Aipify Group Sales Expert community',
      'met', (public._scmbp_blueprint_dogfooding()->'aipify_group'->>'role') is not null,
      'note', case when (v_summary->>'active_mentorships')::int = 0
        then 'Voluntary mentorship links appear when mentors and mentees opt in.'
        else null end
    )
  );
end; $$;

create or replace function public.get_sales_expert_operating_system_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_summary jsonb;
  v_base jsonb;
begin
  perform public._irp_require_permission('sales_expert.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sales Expert Operating System — partner portal for pipeline, commissions, training, and one-to-one follow-up. Metadata only — no mass email.',
    'principles', jsonb_build_array(
      'Official partner tiers — never Affiliate publicly',
      'Aipify subscription: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert',
      'One-to-one email only — mass campaigns explicitly not supported',
      'Human approval for sensitive commission and program changes',
      'Metadata only — no raw email bodies or customer PII in logs'
    ),
    'privacy_note', 'Customer org names and commission metadata only — no email content or PII stored.',
    'engine_phase', 'A.95',
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension',
      'title', 'Sales Expert Operating System',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'parent', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', v_summary,
    'sections', jsonb_build_object(
      'dashboard', jsonb_build_object(
        'revenue_overview', v_summary,
        'monthly_commissions', jsonb_build_object(
          'pending', v_summary->'monthly_commissions_pending',
          'paid', v_summary->'monthly_commissions_paid',
          'forecasted', v_summary->'forecasted_commissions'
        ),
        'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
        'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
        'active_opportunities', v_summary->'active_opportunities'
      ),
      'customers', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'org_name', c.org_name, 'status', c.status,
          'subscription_status', c.subscription_status,
          'onboarding_progress', c.onboarding_progress,
          'next_follow_up', c.next_follow_up,
          'notes_metadata', c.notes_metadata
        ) order by c.next_follow_up nulls last)
        from public.organization_sales_expert_customers c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'currency', o.currency,
          'next_action', o.next_action, 'recommended_action', o.recommended_action,
          'status', o.status, 'customer_id', o.customer_id
        ) order by
          case o.pipeline_stage
            when 'negotiation' then 0 when 'proposal' then 1 when 'demo' then 2 else 3 end)
        from public.organization_sales_expert_opportunities o
        where o.organization_id = v_org_id and o.status = 'open' limit 50
      ), '[]'::jsonb),
      'commissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'commission_type', c.commission_type, 'amount', c.amount,
          'currency', c.currency, 'status', c.status,
          'subscription_plan_key', c.subscription_plan_key, 'period_month', c.period_month
        ) order by c.period_month desc)
        from public.organization_sales_expert_commissions c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(jsonb_build_object(
          'template_key', t.template_key, 'title', t.title,
          'subject_pattern', t.subject_pattern, 'category', t.category,
          'placeholders', t.placeholders
        ) order by t.template_key)
        from public.organization_sales_expert_email_templates t
        where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'emails', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'template_key', e.template_key, 'subject_metadata', e.subject_metadata,
          'status', e.status, 'delivery_mode', e.delivery_mode,
          'scheduled_for', e.scheduled_for, 'sent_at', e.sent_at
        ) order by e.created_at desc)
        from public.organization_sales_expert_emails e
        where e.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'follow_ups', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
          'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
        ) order by f.scheduled_for)
        from public.organization_sales_expert_follow_ups f
        where f.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'bookings', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', b.id, 'booking_type', b.booking_type, 'scheduled_at', b.scheduled_at,
          'duration_minutes', b.duration_minutes, 'status', b.status,
          'timezone', b.timezone, 'customer_id', b.customer_id
        ) order by b.scheduled_at)
        from public.organization_sales_expert_bookings b
        where b.organization_id = v_org_id
          and b.status in ('scheduled', 'confirmed')
          and b.scheduled_at >= now() - interval '1 day'
        limit 30
      ), '[]'::jsonb)
    ),
    'official_terminology', public._seos_blueprint_official_terminology(),
    'portal_sections', public._seos_blueprint_portal_sections(),
    'blueprint_email_templates', public._seos_blueprint_email_templates_list(),
    'follow_up_cadences', public._seos_blueprint_follow_up_cadences(),
    'implementation_services', public._seos_blueprint_implementation_services_pricing(),
    'subscription_principles', public._seos_blueprint_subscription_principles(),
    'commercial_commission_summary', public._seos_commercial_commission_summary(v_org_id),
    'mass_email_supported', false,
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'partners', 'label', 'Partner Certification Phase 91', 'route', '/app/partners'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'certification', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine'),
      jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine')
    ),
    'training_center', jsonb_build_object(
      'foundations_route', '/app/learning-training-engine',
      'certification_route', '/app/certification-achievement-engine',
      'demo_simulations_note', 'Demo simulations scaffold — metadata only',
      'product_updates_note', 'Product update briefings via Notification Engine — metadata cross-link'
    ),
    'resource_library', jsonb_build_object(
      'status', 'metadata_scaffold',
      'categories', jsonb_build_array('Marketing materials', 'Playbooks', 'Product sheets', 'Templates', 'Case studies'),
      'privacy_note', 'Resource metadata only — assets stored in approved KC or partner program surfaces.'
    ),
    'distinction_note', public._seos_distinction_note()
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase41', jsonb_build_object(
      'phase', 41,
      'title', 'Sales Performance & Recognition Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE41_SALES_PERFORMANCE_RECOGNITION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — cross-links Gratitude & Recognition A.89 Phase 9, not a duplicate engine.'
    ),
    'performance_recognition_mission', 'Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify.',
    'performance_recognition_philosophy', 'Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.',
    'performance_recognition_abos_principle', 'People thrive when their efforts are noticed. Recognition should reinforce values, not ego.',
    'performance_objectives', public._sprbp_blueprint_objectives(),
    'performance_dashboard_fields', public._sprbp_blueprint_performance_dashboard_fields(),
    'performance_summary', public._sprbp_performance_summary(v_org_id),
    'milestone_recognition', public._sprbp_blueprint_milestones(),
    'milestone_progress', public._sprbp_milestone_progress(v_org_id),
    'bell_moments', public._sprbp_blueprint_bell_moments(),
    'recognition_roses', public._sprbp_blueprint_recognition_roses(),
    'leaderboards', public._sprbp_blueprint_leaderboards(),
    'performance_self_love_connection', public._sprbp_blueprint_self_love_connection(),
    'performance_trust_connection', public._sprbp_blueprint_trust_connection(),
    'performance_dogfooding', public._sprbp_blueprint_dogfooding(),
    'performance_vision_phrases', public._sprbp_blueprint_vision_phrases(),
    'performance_integration_links', public._sprbp_blueprint_integration_links(),
    'performance_blueprint_success_criteria', public._sprbp_blueprint_success_criteria(v_org_id),
    'performance_distinction_note', public._sprbp_distinction_note()
  ) || jsonb_build_object(
    'implementation_blueprint_phase45', jsonb_build_object(
      'phase', 45,
      'title', 'Sales Coach & Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Coach & Enablement tab; cross-links Phase 41 bell moments without duplication.'
    ),
    'sales_coach_mission', 'Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.',
    'sales_coach_philosophy', 'Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.',
    'sales_coach_abos_principle', 'People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.',
    'sales_companion_roles', public._scebp_blueprint_companion_roles(),
    'sales_coach_dashboard_fields', public._scebp_blueprint_coach_dashboard_fields(),
    'sales_coach_summary', public._scebp_coach_summary(v_org_id),
    'daily_sales_briefing', public._scebp_daily_briefing(v_org_id),
    'sales_activity_recommendations', public._scebp_activity_recommendations(v_org_id),
    'field_sales_coaching', public._scebp_blueprint_field_sales_coaching(),
    'demonstration_guidance', public._scebp_blueprint_demonstration_guidance(),
    'objection_handling_library', public._scebp_blueprint_objection_handling_library(),
    'communication_coaching', public._scebp_blueprint_communication_coaching(),
    'personal_performance_insights', public._scebp_performance_insights(v_org_id),
    'sales_coach_self_love_connection', public._scebp_blueprint_self_love_connection(),
    'sales_coach_bell_moments', public._scebp_blueprint_bell_moments(),
    'sales_training_integration', public._scebp_blueprint_sales_training_integration(),
    'roleplay_simulation', public._scebp_blueprint_roleplay_simulation(),
    'sales_coach_trust_connection', public._scebp_blueprint_trust_connection(),
    'sales_coach_dogfooding', public._scebp_blueprint_dogfooding(),
    'sales_coach_success_criteria', public._scebp_blueprint_success_criteria(v_org_id),
    'sales_coach_vision_phrases', public._scebp_blueprint_vision_phrases(),
    'sales_coach_distinction_note', public._scebp_distinction_note(),
    'sales_coach_integration_links', public._scebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase46', jsonb_build_object(
      'phase', 46,
      'title', 'Sales Coach Certification & Field Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Certification & Field Enablement tab; cross-links A.37, A.36, Phase 91, Phase 45 coach tab.'
    ),
    'sales_certification_mission', 'Develop competent professionals — training strengthens confidence; certification reflects genuine competence.',
    'sales_certification_philosophy', 'Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.',
    'sales_certification_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.',
    'sales_training_pathway', public._sccfebp_blueprint_sales_training_pathway(),
    'sales_simulation_engine', public._sccfebp_blueprint_sales_simulation_engine(),
    'telephone_sales_coaching', public._sccfebp_blueprint_telephone_sales_coaching(),
    'assessment_principles', public._sccfebp_blueprint_assessment_principles(),
    'certification_requirements', public._sccfebp_blueprint_certification_requirements(),
    'reassessment_principles', public._sccfebp_blueprint_reassessment_principles(),
    'certification_display', public._sccfebp_blueprint_certification_display(),
    'email_enablement_center', public._sccfebp_blueprint_email_enablement_center(),
    'implementation_pricing_guidance', public._sccfebp_blueprint_implementation_pricing_guidance(),
    'installation_experience_journey', public._sccfebp_blueprint_installation_experience_journey(),
    'field_sales_enablement', public._sccfebp_blueprint_field_sales_enablement(),
    'sales_performance_culture', public._sccfebp_blueprint_sales_performance_culture(),
    'sales_certification_summary', public._sccfebp_certification_summary(v_org_id),
    'sales_certification_self_love_connection', public._sccfebp_blueprint_self_love_connection(),
    'sales_certification_trust_connection', public._sccfebp_blueprint_trust_connection(),
    'sales_certification_dogfooding', public._sccfebp_blueprint_dogfooding(),
    'sales_certification_success_criteria', public._sccfebp_blueprint_success_criteria(v_org_id),
    'sales_certification_vision_phrases', public._sccfebp_blueprint_vision_phrases(),
    'sales_certification_distinction_note', public._sccfebp_distinction_note(),
    'sales_certification_integration_links', public._sccfebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'sales_expert_marketing_center', public._seosmc_marketing_center_bundle(v_org_id)
  ) || jsonb_build_object(
    'implementation_blueprint_phase42', jsonb_build_object(
      'phase', 42,
      'title', 'Sales Demo & Experience Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE42_SALES_DEMO_EXPERIENCE.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Demo tab; cross-links Coach Phase 45/46, Certification Module 4, Simulation Lab Phase 78 (NOT sales demos).'
    ),
    'sales_demo_mission', 'Help Sales Experts deliver outcome-focused demonstrations that help prospects envision a better future.',
    'sales_demo_philosophy', 'People invest in outcomes, not features. Demos should inspire confidence through honest, tailored storytelling.',
    'sales_demo_objectives', public._sdebp_blueprint_objectives(),
    'demo_environments', public._sdebp_blueprint_demo_environments(),
    'demo_data_examples', public._sdebp_blueprint_demo_data_examples(),
    'industry_demonstrations', public._sdebp_blueprint_industry_demonstrations(),
    'demo_guidance', public._sdebp_blueprint_demo_guidance(),
    'discovery_question_library', public._sdebp_blueprint_discovery_question_library(),
    'demo_flow_structure', public._sdebp_blueprint_demo_flow_structure(),
    'custom_demo_experiences', public._sdebp_blueprint_custom_demo_experiences(),
    'demo_links_scaffold', public._sdebp_blueprint_demo_links_scaffold(),
    'demo_links_summary', public._sdebp_demo_links_summary(v_org_id),
    'companion_demo_experience', public._sdebp_blueprint_companion_demo_experience(),
    'sales_demo_self_love_connection', public._sdebp_blueprint_self_love_connection(),
    'sales_demo_trust_connection', public._sdebp_blueprint_trust_connection(),
    'sales_demo_dogfooding', public._sdebp_blueprint_dogfooding(),
    'sales_demo_success_criteria', public._sdebp_blueprint_success_criteria(v_org_id),
    'sales_demo_vision_phrases', public._sdebp_blueprint_vision_phrases(),
    'sales_demo_abos_principle', 'Aipify Business Operating System (ABOS) demos show how operational AI augments people — humans decide, Aipify informs and prepares.',
    'sales_demo_distinction_note', public._sdebp_distinction_note(),
    'sales_demo_integration_links', public._sdebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase43', jsonb_build_object(
      'phase', 43,
      'title', 'Sales Engagement & Booking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE43_SALES_ENGAGEMENT_BOOKING.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Engagement & Booking tab; cross-links Context Engine calendars, Coach 45/46, Unified Tasks A.62, Meeting Collaboration A.61, Self Love A.76.'
    ),
    'engagement_mission', 'Help Sales Experts schedule meetings professionally, follow up consistently, and prepare thoughtfully — trust through consistency.',
    'engagement_philosophy', 'Follow-up demonstrates professionalism. Booking should feel personal and respectful — never pressure or mass outreach.',
    'engagement_abos_principle', 'Aipify Business Operating System (ABOS) partners build trust through prepared, consistent engagement — humans decide; Aipify informs and prepares.',
    'engagement_objectives', public._sebbp_blueprint_objectives(),
    'booking_center', public._sebbp_blueprint_booking_center(),
    'calendar_integrations', public._sebbp_blueprint_calendar_integrations(),
    'discovery_meetings', public._sebbp_blueprint_discovery_meetings(),
    'demonstration_bookings', public._sebbp_blueprint_demonstration_bookings(),
    'follow_up_engagement', public._sebbp_blueprint_follow_up_engagement(),
    'meeting_preparation', public._sebbp_blueprint_meeting_preparation(),
    'engagement_history', public._sebbp_engagement_history(v_org_id),
    'engagement_summary', public._sebbp_engagement_summary(v_org_id),
    'engagement_self_love_connection', public._sebbp_blueprint_self_love_connection(),
    'engagement_trust_connection', public._sebbp_blueprint_trust_connection(),
    'engagement_dogfooding', public._sebbp_blueprint_dogfooding(),
    'engagement_success_criteria', public._sebbp_blueprint_success_criteria(v_org_id),
    'engagement_vision_phrases', public._sebbp_blueprint_vision_phrases(),
    'engagement_distinction_note', public._sebbp_distinction_note(),
    'engagement_integration_links', public._sebbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase44', jsonb_build_object(
      'phase', 44,
      'title', 'Customer Renewal & Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE44_CUSTOMER_RENEWAL_EXPANSION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Renewal & Expansion tab; distinct from Autonomous Execution Framework Phase 44 (/app/action-center).'
    ),
    'renewal_expansion_mission', 'Help Sales Experts nurture long-term customer partnerships through renewal awareness, health insights, and consultative expansion — never aggressive upsell.',
    'renewal_expansion_philosophy', 'Renewals should feel intentional, not accidental. Customer health metadata supports care — never surveillance or blame.',
    'renewal_expansion_abos_principle', 'Aipify Business Operating System (ABOS) partnerships grow when organizations succeed — humans decide, Aipify prepares renewal conversations with clarity.',
    'renewal_expansion_objectives', public._crebp_blueprint_objectives(),
    'renewal_dashboard_fields', public._crebp_blueprint_renewal_dashboard_fields(),
    'renewal_expansion_summary', public._crebp_renewal_summary(v_org_id),
    'renewal_companion_examples', public._crebp_blueprint_companion_examples(),
    'customer_health_insights', public._crebp_blueprint_health_insights(),
    'success_review_questions', public._crebp_blueprint_success_review_questions(),
    'expansion_opportunities', public._crebp_blueprint_expansion_opportunities(),
    'renewal_playbooks', public._crebp_blueprint_renewal_playbooks(),
    'customer_celebration_experiences', public._crebp_blueprint_celebration_experiences(),
    'churn_prevention_support', public._crebp_blueprint_churn_prevention(),
    'renewal_sales_expert_insights', public._crebp_blueprint_sales_expert_insights(),
    'renewal_expansion_self_love_connection', public._crebp_blueprint_self_love_connection(),
    'renewal_expansion_trust_connection', public._crebp_blueprint_trust_connection(),
    'renewal_expansion_dogfooding', public._crebp_blueprint_dogfooding(),
    'renewal_expansion_success_criteria', public._crebp_blueprint_success_criteria(v_org_id),
    'renewal_expansion_vision_phrases', public._crebp_blueprint_vision_phrases(),
    'renewal_expansion_distinction_note', public._crebp_distinction_note(),
    'renewal_expansion_integration_links', public._crebp_blueprint_integration_links()

  )  ) || jsonb_build_object(
    'implementation_blueprint_phase47', jsonb_build_object(
      'phase', 47,
      'title', 'Sales Community & Mentorship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE47_SALES_COMMUNITY_MENTORSHIP.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Community tab; peer learning and voluntary mentorship within partner portal.'
    ),
    'sales_community_mission', public._scmbp_blueprint_mission(),
    'sales_community_philosophy', public._scmbp_blueprint_philosophy(),
    'sales_community_abos_principle', public._scmbp_blueprint_abos_principle(),
    'sales_community_objectives', public._scmbp_blueprint_objectives(),
    'sales_expert_community_center', public._scmbp_community_center_bundle(v_org_id),
    'sales_community_distinction_note', public._scmbp_distinction_note(),
    'sales_community_integration_links', public._scmbp_blueprint_integration_links(),
    'sales_community_success_criteria', public._scmbp_blueprint_success_criteria(v_org_id),
    'sales_community_vision_phrases', public._scmbp_blueprint_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
  v_perf jsonb;
  v_coach jsonb;
  v_cert jsonb;
  v_marketing jsonb;
  v_demo_env jsonb;
  v_demo_links jsonb;
  v_renewal jsonb;
  v_engagement jsonb;
  v_community jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  perform public._scmbp_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);
  v_renewal := public._crebp_renewal_summary(v_org_id);
  v_engagement := public._sebbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Professional partner portal — Customers, Opportunities, Pipeline, Commission Overview.',
    'engine_phase', 'A.95',
    'route', '/app/sales-expert-engine',
    'active_opportunities', v_summary->'active_opportunities',
    'monthly_commissions_pending', v_summary->'monthly_commissions_pending',
    'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
    'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
    'milestones_achieved', v_perf->'milestones_achieved',
    'performance_recognition_phase', 41,
    'sales_coach_enablement_phase', 45,
    'sales_certification_field_enablement_phase', 46,
    'sales_expert_marketing_center_phase', '33-extension-marketing',
    'sales_demo_experience_phase', 42,
    'sales_engagement_booking_phase', 43,
    'customer_renewal_expansion_phase', 44,
    'coach_suggested_actions', v_coach->'suggested_next_actions_count',
    'coach_scheduled_demos', v_coach->'scheduled_demos',
    'coach_brief_summary', format(
      '%s follow-ups · %s demos · %s new this month',
      coalesce(v_coach->>'upcoming_follow_ups', '0'),
      coalesce(v_coach->>'scheduled_demos', '0'),
      coalesce(v_coach->>'new_customers_this_month', '0')
    ),
    'certification_tier_label', v_cert->'current_tier_label',
    'certification_attempts_remaining', v_cert->'attempts_remaining',
    'certification_brief_summary', format(
      '%s · %s attempts remaining',
      coalesce(v_cert->>'current_tier_label', 'Training in progress'),
      coalesce(v_cert->>'attempts_remaining', '3')
    ),
    'marketing_link_clicks', v_marketing->'link_clicks',
    'marketing_signups', v_marketing->'signups',
    'marketing_subscriptions', v_marketing->'subscriptions',
    'marketing_brief_summary', format(
      '%s clicks · %s signups · %s subscriptions',
      coalesce(v_marketing->>'link_clicks', '0'),
      coalesce(v_marketing->>'signups', '0'),
      coalesce(v_marketing->>'subscriptions', '0')
    ),
    'demo_environments_count', jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb)),
    'demo_links_active_count', v_demo_links->'active_links_count',
    'demo_brief_summary', format(
      '%s demo environments · %s active links (scaffold)',
      coalesce(jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb))::text, '0'),
      coalesce(v_demo_links->>'active_links_count', '0')
    ),
    'renewal_upcoming_count', v_renewal->'upcoming_renewals_count',
    'renewal_at_risk_count', v_renewal->'at_risk_count',
    'renewal_brief_summary', format(
      '%s upcoming · %s at-risk · readiness %s%%',
      coalesce(v_renewal->>'upcoming_renewals_count', '0'),
      coalesce(v_renewal->>'at_risk_count', '0'),
      coalesce(v_renewal->>'average_readiness_pct', '0')
    ),
    'engagement_scheduled_bookings', v_engagement->'scheduled_bookings',
    'engagement_upcoming_bookings_7d', v_engagement->'upcoming_bookings_7d',
    'engagement_booking_page_url', v_engagement->'booking_page_url',
    'engagement_brief_summary', format(
      '%s follow-ups · %s bookings · %s this week',
      coalesce(v_engagement->>'upcoming_follow_ups', '0'),
      coalesce(v_engagement->>'scheduled_bookings', '0'),
      coalesce(v_engagement->>'upcoming_bookings_7d', '0')
    ),
    'sales_community_mentorship_phase', 47,
    'community_stories_count', v_community->'stories_count',
    'community_active_mentorships', v_community->'active_mentorships',
    'community_brief_summary', format(
      '%s stories · %s mentorships · %s contributors',
      coalesce(v_community->>'stories_count', '0'),
      coalesce(v_community->>'active_mentorships', '0'),
      coalesce(v_community->>'contributors_count', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._scmbp_distinction_note() to authenticated;
grant execute on function public._scmbp_blueprint_mission() to authenticated;
grant execute on function public._scmbp_blueprint_philosophy() to authenticated;
grant execute on function public._scmbp_blueprint_abos_principle() to authenticated;
grant execute on function public._scmbp_blueprint_objectives() to authenticated;
grant execute on function public._scmbp_blueprint_mentorship_program() to authenticated;
grant execute on function public._scmbp_blueprint_community_hub() to authenticated;
grant execute on function public._scmbp_blueprint_success_story_categories() to authenticated;
grant execute on function public._scmbp_blueprint_community_recognition() to authenticated;
grant execute on function public._scmbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._scmbp_blueprint_trust_connection() to authenticated;
grant execute on function public._scmbp_blueprint_sales_coach_connection() to authenticated;
grant execute on function public._scmbp_blueprint_regional_groups() to authenticated;
grant execute on function public._scmbp_blueprint_dogfooding() to authenticated;
grant execute on function public._scmbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._scmbp_blueprint_integration_links() to authenticated;
grant execute on function public._scmbp_ensure_settings(uuid) to authenticated;
grant execute on function public._scmbp_seed_org_stories(uuid) to authenticated;
grant execute on function public._scmbp_success_stories_list(uuid) to authenticated;
grant execute on function public._scmbp_mentorship_links_list(uuid) to authenticated;
grant execute on function public._scmbp_community_summary(uuid) to authenticated;
grant execute on function public._scmbp_community_center_bundle(uuid) to authenticated;
grant execute on function public._scmbp_blueprint_success_criteria(uuid) to authenticated;
