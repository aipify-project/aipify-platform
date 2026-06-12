-- Implementation Blueprint Phase 42 — Sales Demo & Experience Engine
-- Extends Sales Expert Operating System (Phase A.95 + Phase 41 + Phase 45 + Phase 46).

-- ---------------------------------------------------------------------------
-- Optional scaffold tables — metadata only, no customer PII
-- ---------------------------------------------------------------------------
create table if not exists public.sales_expert_demo_environments (
  id uuid primary key default gen_random_uuid(),
  environment_key text not null unique,
  label text not null,
  description text not null default '',
  industry_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_expert_demo_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  slug text not null,
  environment_key text not null,
  expires_at timestamptz,
  access_mode text not null default 'read_only' check (
    access_mode in ('read_only', 'guided', 'preview')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create index if not exists sales_expert_demo_links_org_idx
  on public.sales_expert_demo_links (organization_id, expires_at);

alter table public.sales_expert_demo_environments enable row level security;
alter table public.sales_expert_demo_links enable row level security;
revoke all on public.sales_expert_demo_environments from authenticated, anon;
revoke all on public.sales_expert_demo_links from authenticated, anon;

insert into public.sales_expert_demo_environments (environment_key, label, description, industry_key, metadata)
values
  ('small_business', 'Small business', 'Everyday operational workflows — support, tasks, and assistant guidance at approachable scale.', 'general', '{"status":"metadata_scaffold"}'::jsonb),
  ('support_focused', 'Support-focused', 'Support tickets, knowledge articles, triage, and escalation — metadata-only simulated cases.', 'operations', '{"status":"metadata_scaffold"}'::jsonb),
  ('executive', 'Executive', 'Morning briefings, executive dashboards, decision support, and presence — outcomes over vanity metrics.', 'leadership', '{"status":"metadata_scaffold"}'::jsonb),
  ('commerce', 'Commerce', 'Commerce operations, customer experience, and operational efficiency without replacing existing storefronts.', 'commerce', '{"status":"metadata_scaffold"}'::jsonb),
  ('community_platform', 'Community platform', 'Member engagement, knowledge sharing, and community operations — collaborative workflows.', 'community', '{"status":"metadata_scaffold"}'::jsonb),
  ('enterprise', 'Enterprise', 'Multi-module rollout, approvals, trust boundaries, and enterprise governance scaffolds.', 'enterprise', '{"status":"metadata_scaffold"}'::jsonb)
on conflict (environment_key) do nothing;

-- ---------------------------------------------------------------------------
-- Blueprint helpers (_sdebp_*)
-- ---------------------------------------------------------------------------
create or replace function public._sdebp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Commercial Packages Phase 42 (migration 20260613000000_commercial_packages_phase42.sql — subscription packages and tenant module licensing at /app/settings/billing). Implementation Blueprint Phase 42 Sales Demo & Experience extends Sales Expert OS A.95 Demo tab at /app/sales-expert-engine. Cross-links Coach Phase 45/46 demonstration guidance, Certification Phase 46 Module 4, Simulation Lab Phase 78 (/app/simulations — strategic what-if, NOT sales demos), Marketing Center Phase 33 extension, Self Love A.76, Global Expansion Phase 35 i18n. Demo environments and links are metadata scaffolds — no fake live provisioning.';
$$;

create or replace function public._sdebp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'interactive_demos', 'label', 'Interactive demos', 'description', 'Guided walkthroughs that show outcomes — not feature lists'),
    jsonb_build_object('key', 'industry_examples', 'label', 'Industry examples', 'description', 'Commerce, professional services, community platforms — tailored talking points'),
    jsonb_build_object('key', 'guided_journeys', 'label', 'Guided journeys', 'description', 'Intro → discovery → tailored demo → Q&A → summary → next steps'),
    jsonb_build_object('key', 'companion_presentations', 'label', 'Companion-assisted presentations', 'description', 'Companion examples 🌹🦉🔔 during demos — technology supports people'),
    jsonb_build_object('key', 'scenario_storytelling', 'label', 'Scenario storytelling', 'description', 'Operational narratives with simulated metadata — honest about what is live vs scaffold'),
    jsonb_build_object('key', 'secure_demo_environments', 'label', 'Secure demo environments', 'description', 'Read-only, time-limited demo link scaffolds — no customer PII')
  );
$$;

create or replace function public._sdebp_blueprint_demo_environments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Demo environments help prospects envision a better future — people invest in outcomes, not features.',
    'environments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'key', e.environment_key,
        'label', e.label,
        'description', e.description,
        'industry_key', e.industry_key,
        'metadata', e.metadata
      ) order by e.environment_key)
      from public.sales_expert_demo_environments e
    ), '[]'::jsonb),
    'boundary', 'Catalog metadata only — live demo provisioning requires explicit future phase approval'
  );
$$;

create or replace function public._sdebp_blueprint_demo_data_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Simulated metadata only — no raw customer records, email content, or PII.',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'support_tickets', 'label', 'Support tickets', 'note', 'Sample triage cases with category and confidence metadata'),
      jsonb_build_object('key', 'kc_articles', 'label', 'Knowledge Center articles', 'note', 'Approved KC article titles and categories — not full content'),
      jsonb_build_object('key', 'executive_dashboards', 'label', 'Executive dashboards', 'note', 'Aggregate KPI placeholders — tenant-scoped in live demos only'),
      jsonb_build_object('key', 'tasks_workflows', 'label', 'Tasks and workflows', 'note', 'Workflow orchestration metadata — Phase 40 cross-link'),
      jsonb_build_object('key', 'bell_moments', 'label', 'Bell moments', 'note', '🔔 Gentle milestone celebrations — Phase 41 cross-link'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'note', '🌹 Voluntary appreciation examples — Gratitude A.89 cross-link'),
      jsonb_build_object('key', 'sales_opportunities', 'label', 'Sales opportunities', 'note', 'Pipeline stage metadata — partner portal context only')
    )
  );
$$;

create or replace function public._sdebp_blueprint_industry_demonstrations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Tailor demonstrations to industry outcomes — install-first, not replacement admin panels.',
    'industries', jsonb_build_array(
      jsonb_build_object(
        'key', 'commerce',
        'label', 'Commerce',
        'use_cases', jsonb_build_array(
          'Operational efficiency without replacing existing storefront systems',
          'Support AI and order-status guidance inside existing admin',
          'Customer experience improvements through install-first augmentation'
        )
      ),
      jsonb_build_object(
        'key', 'professional_services',
        'label', 'Professional services',
        'use_cases', jsonb_build_array(
          'Knowledge management and client communication workflows',
          'Decision support and executive briefings for partners',
          'Repetitive task reduction — people remain in control'
        )
      ),
      jsonb_build_object(
        'key', 'community_platforms',
        'label', 'Community platforms',
        'use_cases', jsonb_build_array(
          'Member support and moderation assistance',
          'Knowledge sharing and onboarding paths',
          'Community health summaries — metadata only'
        )
      )
    )
  );
$$;

create or replace function public._sdebp_blueprint_demo_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion examples during demos — technology supports people, never replaces judgment.',
    'coach_tab_cross_link', 'Phase 45 demonstration_guidance — extend and cross-reference, do not duplicate',
    'certification_cross_link', 'Phase 46 Module 4 — Aipify Demonstrations (install-first positioning, demo structure, next steps)',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'welcome', 'example', 'Welcome — Aipify works alongside your team in the systems you already use.'),
      jsonb_build_object('emoji', '🦉', 'key', 'workflow', 'example', 'This workflow could be simpler — here is where Aipify prepares and you decide.'),
      jsonb_build_object('emoji', '🔔', 'key', 'milestone', 'example', 'When your team reaches a milestone, Aipify celebrates progress gently — never pressure.')
    ),
    'presentation_tips', jsonb_build_array(
      'Lead with outcomes the prospect cares about',
      'Use discovery answers to choose demo environment',
      'Pause for questions — demos are conversations, not monologues',
      'Be honest about simulated vs live data'
    )
  );
$$;

create or replace function public._sdebp_blueprint_discovery_question_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Discovery before demonstration — understand workflow before recommending.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational_challenges',
        'label', 'Operational challenges',
        'questions', jsonb_build_array(
          'What operational tasks consume the most time each week?',
          'Where do handoffs between teams create friction?',
          'What would a smoother week look like for your team?'
        )
      ),
      jsonb_build_object(
        'key', 'knowledge_management',
        'label', 'Knowledge management',
        'questions', jsonb_build_array(
          'How does your team find answers to recurring questions?',
          'Where does institutional knowledge live today?',
          'What happens when a key person is unavailable?'
        )
      ),
      jsonb_build_object(
        'key', 'repetitive_tasks',
        'label', 'Repetitive tasks',
        'questions', jsonb_build_array(
          'Which tasks feel repetitive but still require human judgment?',
          'What would you automate only with explicit approval?',
          'How do you evaluate new operational tools today?'
        )
      ),
      jsonb_build_object(
        'key', 'success_six_months',
        'label', 'Success in six months',
        'questions', jsonb_build_array(
          'If we spoke again in six months, what would success look like?',
          'Which outcome would matter most to your leadership?',
          'What would make this investment clearly worthwhile?'
        )
      )
    )
  );
$$;

create or replace function public._sdebp_blueprint_demo_flow_structure()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Structured flow — flexible delivery. Outcomes-focused, not script-driven.',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'intro', 'label', 'Introduction', 'guidance', 'Brief, professional opening — who you are and why you are meeting'),
      jsonb_build_object('order', 2, 'key', 'discovery', 'label', 'Discovery', 'guidance', 'Ask operational questions — listen more than you demonstrate'),
      jsonb_build_object('order', 3, 'key', 'tailored_demo', 'label', 'Tailored demo', 'guidance', 'Choose environment and scenarios based on discovery — simulated metadata only'),
      jsonb_build_object('order', 4, 'key', 'qa', 'label', 'Q&A', 'guidance', 'Invite questions — honest about integration requirements and scaffolds'),
      jsonb_build_object('order', 5, 'key', 'summary', 'label', 'Summary', 'guidance', 'Reflect what you heard and what Aipify may help with — no overpromising'),
      jsonb_build_object('order', 6, 'key', 'next_steps', 'label', 'Next steps', 'guidance', 'Offer focused follow-up, pilot scope, or onboarding conversation — respect their timeline')
    )
  );
$$;

create or replace function public._sdebp_blueprint_custom_demo_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support_first', 'label', 'Support-first', 'description', 'Lead with support triage, knowledge articles, and confidence scoring — ASO cross-link'),
    jsonb_build_object('key', 'knowledge_first', 'label', 'Knowledge-first', 'description', 'Employee knowledge, onboarding paths, and gap detection — EKE cross-link'),
    jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Briefings, decision support, and operational visibility — executive dashboard metadata'),
    jsonb_build_object('key', 'commerce', 'label', 'Commerce', 'description', 'Commerce operations and customer experience — distinct from Commerce Performance Phase 104')
  );
$$;

create or replace function public._sdebp_blueprint_demo_links_scaffold()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Secure demo links — 24-hour access, read-only, guided mode. Scaffold only — no fake live provisioning.',
    'access_modes', jsonb_build_array(
      jsonb_build_object('key', 'read_only', 'label', 'Read-only', 'description', 'Prospect views simulated environment — no write actions'),
      jsonb_build_object('key', 'guided', 'label', 'Guided', 'description', 'Sales Expert narrates — companion cues visible, human leads'),
      jsonb_build_object('key', 'preview', 'label', 'Preview', 'description', 'Short preview link — expires after 24 hours')
    ),
    'default_expiry_hours', 24,
    'fields', jsonb_build_array('slug', 'environment_key', 'expires_at', 'access_mode'),
    'boundary', 'Demo link generation is metadata scaffold — live secure provisioning requires future phase approval',
    'honest_notice', 'What prospects see is simulated metadata — integrations require customer approval and install'
  );
$$;

create or replace function public._sdebp_blueprint_companion_demo_experience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companions support demos — warm welcome, workflow simplification, technology supports people.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'welcome', 'label', 'Welcome', 'example', 'Welcome — Aipify is here to help your team work smarter, not harder.'),
      jsonb_build_object('emoji', '🦉', 'key', 'workflow_simplification', 'label', 'Workflow simplification', 'example', 'This step could be simpler — Aipify can prepare the draft and your team approves.'),
      jsonb_build_object('emoji', '❤️', 'key', 'people_first', 'label', 'Technology supports people', 'example', 'Aipify augments your team — humans decide, Aipify informs and prepares.')
    ),
    'self_love_note', 'Preparation checklists and talking points build confidence — you do not need to memorize everything.'
  );
$$;

create or replace function public._sdebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Demo preparation should strengthen confidence — preparation checklists, talking points, not memorize everything.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Use the demo flow as a guide — adapt to the conversation, do not perform a script.'),
      jsonb_build_object('emoji', '❤️', 'example', 'It is okay to pause and say "I will confirm that integration detail" — honesty builds trust.')
    ),
    'preparation_checklist', jsonb_build_array(
      'Review discovery notes and choose demo environment',
      'Confirm simulated vs live data boundaries with prospect',
      'Prepare 2–3 outcome-focused talking points',
      'Plan recommended next steps before closing'
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences demo tone — metadata and encouragement only.'
  );
$$;

create or replace function public._sdebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Honest demos — transparent about simulated vs actual data and integration requirements.',
    'experts_should_understand', jsonb_build_array(
      'Demo environments and data examples are simulated metadata — not live customer systems',
      'Secure demo links are scaffold metadata — 24h read-only/guided modes documented, live provisioning pending',
      'Integration requirements need customer approval — install-first, read-only first per Trust Architecture',
      'Simulation Lab Phase 78 (/app/simulations) is strategic what-if — NOT sales demo environments',
      'Coach Phase 45 demonstration_guidance complements this tab — cross-reference, do not duplicate'
    ),
    'metadata_only', true
  );
$$;

create or replace function public._sdebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group Sales Experts validate demo environments, flow structure, and honest simulation notices internally first',
      'focus', jsonb_build_array('Outcome-focused demo language', 'Industry talking points quality', 'Discovery question usefulness', 'Trust transparency')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts test demo link scaffold copy and environment catalog before broader partner rollout',
      'note', 'Dogfooding ensures demos never overpromise live capabilities'
    )
  );
$$;

create or replace function public._sdebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'People invest in outcomes — demos should help prospects envision a better future.',
    'Discovery before demonstration — understand workflow before recommending Aipify.',
    'Honest about simulated vs live — trust grows through transparency, not perfection.'
  );
$$;

create or replace function public._sdebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'coach_enablement', 'label', 'Coach & Enablement Phase 45', 'route', '/app/sales-expert-engine', 'note', 'Coach tab — demonstration guidance cross-reference'),
    jsonb_build_object('key', 'certification_field', 'label', 'Certification Phase 46 Module 4', 'route', '/app/sales-expert-engine', 'note', 'Aipify Demonstrations training module'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation Lab Phase 78', 'route', '/app/simulations', 'note', 'Strategic what-if — NOT sales demos'),
    jsonb_build_object('key', 'marketing_center', 'label', 'Marketing Center Phase 33 extension', 'route', '/app/marketing-center-engine', 'note', 'Marketing materials scaffold — if present on disk'),
    jsonb_build_object('key', 'global_expansion', 'label', 'Global Expansion Phase 35', 'route', '/app/localization-global-expansion-engine', 'note', 'Demo content i18n en/no/sv/da'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Demo preparation confidence — not memorize everything'),
    jsonb_build_object('key', 'workflow_orchestration', 'label', 'Workflow Orchestration Phase 40', 'route', '/app/workflow-orchestration-engine', 'note', 'Tasks/workflows demo data cross-link')
  );
$$;

create or replace function public._sdebp_demo_links_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_count int := 0;
begin
  select count(*) into v_count
  from public.sales_expert_demo_links l
  where l.organization_id = p_organization_id
    and (l.expires_at is null or l.expires_at > now());

  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'active_links_count', v_count,
    'scaffold_note', 'Demo links table ready — live secure link generation pending future phase',
    'default_expiry_hours', 24,
    'privacy_note', 'Slug and environment metadata only — no prospect PII stored.'
  );
exception when others then
  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'active_links_count', 0,
    'scaffold_note', 'Demo links scaffold — no links created yet.'
  );
end; $$;

create or replace function public._sdebp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_env_count int := 0;
  v_links jsonb;
begin
  select count(*) into v_env_count from public.sales_expert_demo_environments;
  v_links := public._sdebp_demo_links_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'demo_environments',
      'label', 'Demo environment catalog documented',
      'met', v_env_count >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'demo_flow',
      'label', 'Six-step demo flow structure defined',
      'met', jsonb_array_length(public._sdebp_blueprint_demo_flow_structure()->'steps') = 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'discovery_library',
      'label', 'Discovery question library with four categories',
      'met', jsonb_array_length(public._sdebp_blueprint_discovery_question_library()->'categories') = 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'industry_demonstrations',
      'label', 'Industry demonstrations for commerce, services, community',
      'met', jsonb_array_length(public._sdebp_blueprint_industry_demonstrations()->'industries') = 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'demo_links_scaffold',
      'label', 'Secure demo links scaffold documented',
      'met', (public._sdebp_blueprint_demo_links_scaffold()->>'default_expiry_hours')::int = 24,
      'note', 'Metadata scaffold — live provisioning pending'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains simulated vs live demos',
      'met', jsonb_array_length(public._sdebp_blueprint_trust_connection()->'experts_should_understand') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'coach_cross_link',
      'label', 'Coach Phase 45 demonstration guidance cross-linked',
      'met', (public._sdebp_blueprint_demo_guidance()->>'coach_tab_cross_link') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection for demo preparation confidence',
      'met', (public._sdebp_blueprint_self_love_connection()->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Commercial Packages Phase 42 collision documented',
      'met', public._sdebp_distinction_note() like '%Commercial Packages Phase 42%',
      'note', null
    ),
    jsonb_build_object(
      'key', 'demo_links_table',
      'label', 'Demo links table scaffold ready',
      'met', (v_links->>'status') = 'metadata_scaffold',
      'note', case when (v_links->>'active_links_count')::int = 0
        then 'Create demo links when live provisioning is approved.'
        else null end
    )
  );
end; $$;

-- Extend dashboard — preserve ALL A.95 + Phase 41 + Phase 45 + Phase 46 fields; append Phase 42
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
  v_settings := public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
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
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);

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
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._sdebp_distinction_note() to authenticated;
grant execute on function public._sdebp_blueprint_objectives() to authenticated;
grant execute on function public._sdebp_blueprint_demo_environments() to authenticated;
grant execute on function public._sdebp_blueprint_demo_data_examples() to authenticated;
grant execute on function public._sdebp_blueprint_industry_demonstrations() to authenticated;
grant execute on function public._sdebp_blueprint_demo_guidance() to authenticated;
grant execute on function public._sdebp_blueprint_discovery_question_library() to authenticated;
grant execute on function public._sdebp_blueprint_demo_flow_structure() to authenticated;
grant execute on function public._sdebp_blueprint_custom_demo_experiences() to authenticated;
grant execute on function public._sdebp_blueprint_demo_links_scaffold() to authenticated;
grant execute on function public._sdebp_blueprint_companion_demo_experience() to authenticated;
grant execute on function public._sdebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._sdebp_blueprint_trust_connection() to authenticated;
grant execute on function public._sdebp_blueprint_dogfooding() to authenticated;
grant execute on function public._sdebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._sdebp_blueprint_integration_links() to authenticated;
grant execute on function public._sdebp_demo_links_summary(uuid) to authenticated;
grant execute on function public._sdebp_blueprint_success_criteria(uuid) to authenticated;
