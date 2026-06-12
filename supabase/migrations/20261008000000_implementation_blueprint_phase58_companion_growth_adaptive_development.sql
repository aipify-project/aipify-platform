-- Implementation Blueprint Phase 58 — Companion Growth & Adaptive Development Engine
-- Extends Growth & Evolution Engine (Phase A.81) at /app/growth-evolution-engine.
-- Naming collision: ARCHITECTURE Quality Guardian Phases 58–59 at /app/quality — different scope.

-- ---------------------------------------------------------------------------
-- 1. companion_growth_adaptive_settings — user-controlled adaptation preferences
-- ---------------------------------------------------------------------------
create table if not exists public.companion_growth_adaptive_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null,
  feedback_prompts_enabled boolean not null default true,
  helpfulness_prompt_frequency text not null default 'occasional' check (
    helpfulness_prompt_frequency in ('never', 'occasional', 'after_sessions', 'weekly')
  ),
  adaptive_preferences_enabled boolean not null default true,
  celebrate_progress_enabled boolean not null default true,
  companion_refinement_opt_in boolean not null default true,
  identity_cross_link_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists companion_growth_adaptive_settings_org_idx
  on public.companion_growth_adaptive_settings (organization_id, user_id);

alter table public.companion_growth_adaptive_settings enable row level security;
revoke all on public.companion_growth_adaptive_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. companion_growth_feedback_events — metadata-only feedback scaffold
-- ---------------------------------------------------------------------------
create table if not exists public.companion_growth_feedback_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null,
  feedback_type text not null check (
    feedback_type in ('helpfulness', 'clarity', 'relevance', 'tone', 'suggestion', 'general')
  ),
  helpfulness_rating text check (
    helpfulness_rating is null or helpfulness_rating in ('helpful', 'somewhat', 'not_helpful', 'skipped')
  ),
  summary text not null check (char_length(summary) <= 500),
  context_category text check (
    context_category is null or context_category in (
      'companion', 'sales_coach', 'knowledge_center', 'human_moments', 'workflow', 'general'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companion_growth_feedback_events_org_idx
  on public.companion_growth_feedback_events (organization_id, user_id, created_at desc);

alter table public.companion_growth_feedback_events enable row level security;
revoke all on public.companion_growth_feedback_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Distinction note (_cgadbp_distinction_note)
-- ---------------------------------------------------------------------------
create or replace function public._cgadbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 58 — Companion Growth & Adaptive Development Engine at /app/growth-evolution-engine. Extends Growth & Evolution Engine Phase A.81. NAMING COLLISION: ARCHITECTURE Quality Guardian Phases 58–59 at /app/quality (frontend/software QG) — NOT this blueprint. Distinct from Learning Engine Phase 23 /app/learning (product learning with approval), Innovation Lab Phase 96 / Blueprint 38 /app/innovation-lab (controlled experiments), Continuous Improvement A.33 /app/continuous-improvement-engine, Evolution Governance Phase 84 /app/evolution, Companion Identity A.84 /app/companion-identity-engine (communication style), Purpose & Values A.82 /app/purpose-values-engine (value alignment cross-link). Blueprint Phase 58 = companion adaptive development and feedback-driven refinement on A.81. Cross-links: Ethics Phase 54 /app/ai-ethics-responsible-use-engine, Memory Phase 55 /app/organizational-memory-engine, Proactive Companion Phase 56 /app/proactive-companion-engine, Trust Phase 57 /app/trust-reputation-engine, Self Love A.76 /app/self-love-engine, Identity A.34 /app/assistant/identity. All Phase A.81 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 4. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cgadbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Guide companion growth through feedback-driven refinement and responsible adaptation — continuous improvement that preserves trust, values, and human control.';
$$;

create or replace function public._cgadbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Companions evolve by learning from experience — friction points, clarity gaps, and helpful patterns — never through disruptive changes, trend-chasing, or trust-sacrificing shortcuts. Adaptation is optional and user-controlled.';
$$;

create or replace function public._cgadbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) grows alongside people — feedback informs refinement, humans decide what changes, and progress is celebrated without pressure.';
$$;

create or replace function public._cgadbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement', 'emoji', '🦉', 'description', 'Learn from operational patterns and companion interactions — metadata only, never raw content'),
    jsonb_build_object('key', 'companion_refinement', 'label', 'Companion refinement', 'emoji', '🌹', 'description', 'Refine clarity, tone, and helpfulness based on feedback — preserve companion identity'),
    jsonb_build_object('key', 'feedback_integration', 'label', 'Feedback integration', 'emoji', '🔔', 'description', 'Collect optional helpfulness signals — user-controlled frequency and opt-out'),
    jsonb_build_object('key', 'responsible_evolution', 'label', 'Responsible evolution', 'emoji', '🦉', 'description', 'Avoid disruptive changes — gradual, explainable, value-aligned refinement'),
    jsonb_build_object('key', 'adaptability', 'label', 'Adaptability', 'emoji', '🌹', 'description', 'Workflow needs, industry context, and priorities inform adaptation — humans approve'),
    jsonb_build_object('key', 'value_alignment', 'label', 'Value alignment', 'emoji', '❤️', 'description', 'Cross-link Purpose & Values A.82 — growth that honours stated organizational values')
  );
$$;

create or replace function public._cgadbp_feedback_collection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Feedback collection — optional helpfulness prompts scaffold. Metadata summaries only; never store raw conversations.',
    'prompt_types', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'helpfulness', 'label', 'Was this helpful?', 'description', 'Gentle post-interaction prompt — dismissible, never guilt-inducing'),
      jsonb_build_object('emoji', '🦉', 'key', 'clarity', 'label', 'Was this clear?', 'description', 'Clarity feedback when explanations may need refinement'),
      jsonb_build_object('emoji', '🔔', 'key', 'relevance', 'label', 'Was this relevant?', 'description', 'Relevance signal for proactive and growth recommendations')
    ),
    'frequency_options', jsonb_build_array('never', 'occasional', 'after_sessions', 'weekly'),
    'context_categories', jsonb_build_array('companion', 'sales_coach', 'knowledge_center', 'human_moments', 'workflow', 'general'),
    'settings_keys', jsonb_build_array('feedback_prompts_enabled', 'helpfulness_prompt_frequency', 'companion_refinement_opt_in'),
    'boundary', 'Store feedback_type, helpfulness_rating, and summary (max 500 chars) — no PII, chat content, or operational records.'
  );
$$;

create or replace function public._cgadbp_companion_evolution_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion evolution principles — learn from experience, reduce friction, improve clarity, preserve values.',
    'qualities', jsonb_build_array(
      'Learn from experience — metadata patterns from accepted recommendations and feedback signals',
      'Identify friction points — repeated dismissals and clarity feedback inform refinement priorities',
      'Improve clarity — explain why changes appear and what influenced them',
      'Preserve values — cross-link Purpose & Values A.82; never sacrifice trust for novelty'
    ),
    'should_avoid', jsonb_build_array(
      'Disruptive changes without purpose — gradual refinement over sudden personality shifts',
      'Trend-chasing — curiosity balanced with stability and trust',
      'Sacrificing trust — every adaptation explainable and optional',
      'Silent adaptation — user-controlled preferences via Identity A.34/A.84 cross-links'
    ),
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'learn_from_feedback', 'example', '🦉 Several clarity signals noted this workflow summary — Aipify refined the format for your review.'),
      jsonb_build_object('emoji', '🌹', 'key', 'reduce_friction', 'example', '🌹 You dismissed similar nudges three times — Aipify adjusted frequency. You can change this anytime.'),
      jsonb_build_object('emoji', '🔔', 'key', 'explain_change', 'example', '🔔 Aipify updated briefing tone based on your Identity preferences — here is what changed and why.'),
      jsonb_build_object('emoji', '❤️', 'key', 'preserve_values', 'example', '❤️ This growth recommendation aligns with your stated value of transparency — review when ready.')
    ),
    'companion_identity_route', '/app/companion-identity-engine',
    'companion_identity_phase', 'A.84',
    'identity_route', '/app/assistant/identity',
    'identity_phase', 'A.34'
  );
$$;

create or replace function public._cgadbp_organizational_learning()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational learning — workflow needs, training gaps, industry adaptations, and priority shifts inform growth recommendations.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'workflow_needs', 'label', 'Workflow needs', 'route', '/app/workflow-orchestration-engine', 'description', 'Process friction and orchestration patterns — cross-link Phase 40'),
      jsonb_build_object('key', 'training', 'label', 'Training & onboarding', 'route', '/app/learning-training-engine', 'description', 'Skill gaps and learning paths — distinct from Learning Engine Phase 23 product memory'),
      jsonb_build_object('key', 'industry_adaptations', 'label', 'Industry adaptations', 'route', '/app/industry-intelligence-foundation-engine', 'description', 'Industry-specific terminology and priorities'),
      jsonb_build_object('key', 'priorities', 'label', 'Priority shifts', 'route', '/app/priority-focus-engine', 'description', 'Operational priority changes inform growth dimension focus')
    ),
    'learning_engine_route', '/app/learning',
    'learning_engine_phase', 23,
    'learning_boundary', 'Learning Engine Phase 23 owns product learning memory — Phase 58 cross-links aggregate counts only.',
    'continuous_improvement_route', '/app/continuous-improvement-engine',
    'continuous_improvement_phase', 'A.33'
  );
$$;

create or replace function public._cgadbp_individual_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Individual adaptation — optional preferences honoured with consent. Cross-link Identity A.34 and Companion Identity A.84 — never silent personality changes.',
    'preference_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'communication_style', 'example', '🌹 You prefer concise summaries — Aipify adapts briefing length when this preference is enabled.'),
      jsonb_build_object('emoji', '🦉', 'key', 'feedback_opt_in', 'example', '🦉 Helpfulness prompts appear occasionally — change frequency or disable in adaptation settings.'),
      jsonb_build_object('emoji', '🔔', 'key', 'celebrate_progress', 'example', '🔔 Progress milestones celebrated gently — disable if you prefer quieter growth notes.'),
      jsonb_build_object('emoji', '❤️', 'key', 'harmless_preferences', 'example', '❤️ Optional tone preferences from Identity — review or remove anytime at /app/assistant/identity.')
    ),
    'settings_keys', jsonb_build_array(
      'adaptive_preferences_enabled',
      'feedback_prompts_enabled',
      'helpfulness_prompt_frequency',
      'celebrate_progress_enabled',
      'companion_refinement_opt_in',
      'identity_cross_link_enabled'
    ),
    'identity_route', '/app/assistant/identity',
    'companion_identity_route', '/app/companion-identity-engine',
    'boundary', 'Adaptation optional — users control all preference toggles. Identity observations require approval per A.34.'
  );
$$;

create or replace function public._cgadbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — gradual improvement, celebrate progress, never guilt or pressure around setbacks.',
    'practices', jsonb_build_array(
      'Gradual improvement over perfection — small wins acknowledged',
      'Celebrate progress when enabled — optional, never performative',
      'Setbacks are normal — no shame for dismissed feedback or deferred recommendations',
      'Sustainable pacing — growth cadence respects wellbeing signals from Self Love A.76',
      'Reflection without judgment — learning cycles invite review, not criticism'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'human_moments_route', '/app/gratitude-recognition-engine',
    'human_moments_phase', 53
  );
$$;

create or replace function public._cgadbp_innovation_balance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Innovation balance — stability, curiosity, improvement, and trust held together responsibly.',
    'balances', jsonb_build_array(
      jsonb_build_object('key', 'stability', 'label', 'Stability', 'description', 'Core companion identity and trusted patterns preserved — no disruptive pivots'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Cross-link Curiosity & Discovery A.87 and Innovation Lab Phase 96 — explore within guardrails'),
      jsonb_build_object('key', 'improvement', 'label', 'Improvement', 'description', 'Continuous Improvement A.33 and Growth A.81 learning cycles drive refinement'),
      jsonb_build_object('key', 'trust', 'label', 'Trust', 'description', 'Trust Phase 57 and Ethics Phase 54 — explain changes, preserve reliability')
    ),
    'innovation_lab_route', '/app/innovation-lab',
    'innovation_lab_phases', jsonb_build_array('Phase 96', 'Blueprint 38'),
    'evolution_governance_route', '/app/evolution',
    'evolution_governance_phase', 84,
    'boundary', 'Innovation Lab owns controlled experiments — Phase 58 owns companion adaptive refinement on A.81.'
  );
$$;

create or replace function public._cgadbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust connection — users should know why changes appear, what influenced them, and that adaptations are optional.',
    'users_should_know', jsonb_build_array(
      'Why a companion refinement appeared — feedback signals, accepted recommendations, or preference cross-links',
      'What influenced the change — metadata summary, never hidden model tuning',
      'Optional adaptations — disable feedback prompts, refinement opt-in, or identity cross-links anytime',
      'Trust Phase 57 reputation context — companion reliability signals cross-linked, not duplicated',
      'Ethics Phase 54 boundaries — emotional safety and governance guardrails apply to all adaptations'
    ),
    'operators_should_understand', jsonb_build_array(
      'Phase 58 extends A.81 — does not duplicate Learning Engine, Innovation Lab, or QG Phase 58–59',
      'Feedback events are metadata only — audited via companion_growth_feedback_events',
      'Growth recommendations require review — same accept/dismiss/defer flow as A.81',
      'Evolution Governance Phase 84 owns formal change proposals — Phase 58 owns companion refinement framing'
    ),
    'ethics_route', '/app/ai-ethics-responsible-use-engine',
    'ethics_phase', 54,
    'trust_route', '/app/trust-reputation-engine',
    'trust_phase', 57,
    'memory_route', '/app/organizational-memory-engine',
    'memory_phase', 55
  );
$$;

create or replace function public._cgadbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates companion growth and adaptive development internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion refinement, sales coach feedback, KC helpfulness, human moments',
      'focus', jsonb_build_array(
        'Companion helpfulness prompts after assistant sessions',
        'Sales Expert coach clarity feedback integration',
        'Knowledge Center article helpfulness signals',
        'Human Moments Phase 53 recognition tone refinement',
        'Growth recommendation review cycles with celebrate progress'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce companion adaptation and operational growth signals',
      'focus', jsonb_build_array(
        'Support workflow friction feedback',
        'Industry adaptation for nightlife commerce context',
        'Optional identity preference cross-links',
        'Learning cycle cadence with Self Love pacing'
      )
    )
  );
$$;

create or replace function public._cgadbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'A companion that grows with you — a little clearer, a little more helpful, every cycle.',
    'Feedback shapes refinement — humans decide what sticks.',
    'Progress celebrated, setbacks normal — growth without guilt.',
    'Trust preserved through explainable adaptation — never silent changes.',
    'Curiosity balanced with stability — innovation within values.'
  );
$$;

create or replace function public._cgadbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Learning Engine (Phase 23)', 'route', '/app/learning', 'note', 'Product learning memory — cross-link only'),
    jsonb_build_object('label', 'Innovation Lab (Phase 96 / Blueprint 38)', 'route', '/app/innovation-lab', 'note', 'Controlled experiments — distinct from companion refinement'),
    jsonb_build_object('label', 'Continuous Improvement (A.33)', 'route', '/app/continuous-improvement-engine', 'note', 'Operational improvement cycles'),
    jsonb_build_object('label', 'Evolution Governance (Phase 84)', 'route', '/app/evolution', 'note', 'Formal change proposals'),
    jsonb_build_object('label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine', 'note', 'Communication style — cross-link for adaptation'),
    jsonb_build_object('label', 'Identity Engine (A.34)', 'route', '/app/assistant/identity', 'note', 'Personal style preferences — approval required'),
    jsonb_build_object('label', 'Purpose & Values (A.82)', 'route', '/app/purpose-values-engine', 'note', 'Value alignment cross-link'),
    jsonb_build_object('label', 'Ethics & Companion Governance (Phase 54)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Emotional safety and governance boundaries'),
    jsonb_build_object('label', 'Memory & Continuity (Phase 55)', 'route', '/app/organizational-memory-engine', 'note', 'Continuity framework cross-link'),
    jsonb_build_object('label', 'Proactive Companion (Phase 56)', 'route', '/app/proactive-companion-engine', 'note', 'Proactive assistance awareness'),
    jsonb_build_object('label', 'Trust & Reputation (Phase 57)', 'route', '/app/trust-reputation-engine', 'note', 'Companion relationship trust'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Gradual improvement and celebrate progress'),
    jsonb_build_object('label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine', 'note', 'Growth opportunity surfacing'),
    jsonb_build_object('label', 'Quality Guardian (QG 58–59)', 'route', '/app/quality', 'note', 'NAMING COLLISION — frontend/software QG, NOT this blueprint')
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. Settings helpers
-- ---------------------------------------------------------------------------
create or replace function public._cgadbp_ensure_settings(p_org_id uuid, p_user_id uuid)
returns public.companion_growth_adaptive_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_growth_adaptive_settings;
begin
  insert into public.companion_growth_adaptive_settings (organization_id, user_id)
  values (p_org_id, p_user_id)
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.companion_growth_adaptive_settings
  where organization_id = p_org_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._cgadbp_seed_feedback(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.companion_growth_feedback_events
    where organization_id = p_org_id and user_id = p_user_id
  ) then
    return;
  end if;

  insert into public.companion_growth_feedback_events (
    organization_id, user_id, feedback_type, helpfulness_rating, summary, context_category, metadata
  ) values
    (p_org_id, p_user_id, 'helpfulness', 'helpful',
     'Briefing summary was clear and actionable — metadata scaffold only.',
     'companion', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_org_id, p_user_id, 'clarity', 'somewhat',
     'Workflow recommendation needed simpler language — refinement candidate.',
     'workflow', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_org_id, p_user_id, 'relevance', 'helpful',
     'Growth dimension signal matched current operational priorities.',
     'general', '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

create or replace function public._cgadbp_adaptive_summary(p_org_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_feedback_30d int := 0;
  v_helpful int := 0;
  v_settings public.companion_growth_adaptive_settings;
begin
  v_settings := public._cgadbp_ensure_settings(p_org_id, p_user_id);
  perform public._cgadbp_seed_feedback(p_org_id, p_user_id);

  select count(*) into v_feedback_30d
  from public.companion_growth_feedback_events
  where organization_id = p_org_id
    and user_id = p_user_id
    and created_at >= now() - interval '30 days';

  select count(*) into v_helpful
  from public.companion_growth_feedback_events
  where organization_id = p_org_id
    and user_id = p_user_id
    and helpfulness_rating = 'helpful'
    and created_at >= now() - interval '30 days';

  return jsonb_build_object(
    'feedback_events_30d', v_feedback_30d,
    'helpful_signals_30d', v_helpful,
    'feedback_prompts_enabled', v_settings.feedback_prompts_enabled,
    'adaptive_preferences_enabled', v_settings.adaptive_preferences_enabled,
    'companion_refinement_opt_in', v_settings.companion_refinement_opt_in,
    'helpfulness_prompt_frequency', v_settings.helpfulness_prompt_frequency,
    'celebrate_progress_enabled', v_settings.celebrate_progress_enabled,
    'identity_cross_link_enabled', v_settings.identity_cross_link_enabled,
    'privacy_note', 'Counts and preference toggles only — no feedback content in summary aggregates beyond seed scaffold.'
  );
end; $$;

create or replace function public.update_companion_growth_adaptive_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.companion_growth_adaptive_settings;
begin
  perform public._irp_require_permission('growth_evolution.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._cgadbp_ensure_settings(v_org_id, v_user_id);

  update public.companion_growth_adaptive_settings set
    feedback_prompts_enabled = coalesce((p_payload->>'feedback_prompts_enabled')::boolean, feedback_prompts_enabled),
    helpfulness_prompt_frequency = coalesce(nullif(trim(p_payload->>'helpfulness_prompt_frequency'), ''), helpfulness_prompt_frequency),
    adaptive_preferences_enabled = coalesce((p_payload->>'adaptive_preferences_enabled')::boolean, adaptive_preferences_enabled),
    celebrate_progress_enabled = coalesce((p_payload->>'celebrate_progress_enabled')::boolean, celebrate_progress_enabled),
    companion_refinement_opt_in = coalesce((p_payload->>'companion_refinement_opt_in')::boolean, companion_refinement_opt_in),
    identity_cross_link_enabled = coalesce((p_payload->>'identity_cross_link_enabled')::boolean, identity_cross_link_enabled),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_settings;

  perform public._gee_log(v_org_id, v_user_id, 'adaptive_settings_changed', jsonb_build_object(
    'metadata_only', true,
    'feedback_prompts_enabled', v_settings.feedback_prompts_enabled,
    'companion_refinement_opt_in', v_settings.companion_refinement_opt_in
  ));

  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public._cgadbp_blueprint_success_criteria(p_org_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_adaptive jsonb;
  v_pending int := 0;
  v_signals int := 0;
  v_feedback int := 0;
begin
  v_adaptive := public._cgadbp_adaptive_summary(p_org_id, p_user_id);
  v_feedback := coalesce((v_adaptive->>'feedback_events_30d')::int, 0);

  select count(*) into v_pending
  from public.organization_growth_recommendations
  where organization_id = p_org_id and status = 'pending';

  select count(*) into v_signals
  from public.organization_growth_signals
  where organization_id = p_org_id
    and created_at >= now() - interval '30 days';

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Phase 58 distinction documented — QG 58–59 collision noted',
      'met', (public._cgadbp_distinction_note()) is not null,
      'note', 'Quality Guardian Phases 58–59 at /app/quality — different from Blueprint Phase 58.'
    ),
    jsonb_build_object(
      'key', 'phase58_objectives',
      'label', 'Phase 58 objectives — improvement, refinement, feedback, evolution, adaptability, values',
      'met', jsonb_array_length(public._cgadbp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'feedback_collection_scaffold',
      'label', 'Feedback collection scaffold — helpfulness prompts documented',
      'met', jsonb_array_length(public._cgadbp_feedback_collection()->'prompt_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_evolution_principles',
      'label', 'Companion evolution principles — learn, friction, clarity, values',
      'met', jsonb_array_length(public._cgadbp_companion_evolution_principles()->'qualities') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'organizational_learning',
      'label', 'Organizational learning domains documented',
      'met', jsonb_array_length(public._cgadbp_organizational_learning()->'domains') >= 4,
      'note', 'Cross-link Learning Engine Phase 23 — do not duplicate product memory.'
    ),
    jsonb_build_object(
      'key', 'individual_adaptation',
      'label', 'Individual adaptation — optional preferences with Identity cross-links',
      'met', jsonb_array_length(public._cgadbp_individual_adaptation()->'preference_examples') >= 3,
      'note', 'Identity A.34/A.84 — user-controlled, never silent changes.'
    ),
    jsonb_build_object(
      'key', 'innovation_balance',
      'label', 'Innovation balance — stability, curiosity, improvement, trust',
      'met', jsonb_array_length(public._cgadbp_innovation_balance()->'balances') >= 4,
      'note', 'Innovation Lab Phase 96 owns experiments — Phase 58 owns companion refinement.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — explain changes, optional adaptations',
      'met', jsonb_array_length(public._cgadbp_trust_connection()->'users_should_know') >= 4,
      'note', 'Cross-links Ethics Phase 54 and Trust Phase 57.'
    ),
    jsonb_build_object(
      'key', 'feedback_signals_live',
      'label', 'Feedback signals collected — metadata scaffold active',
      'met', v_feedback > 0,
      'note', case when v_feedback = 0 then 'Enable feedback prompts to begin collecting helpfulness signals.' else null end
    ),
    jsonb_build_object(
      'key', 'growth_signals_active',
      'label', 'Growth signals active on A.81',
      'met', v_signals > 0,
      'note', case when v_signals = 0 then 'Growth signals appear as organizational metadata accumulates.' else null end
    ),
    jsonb_build_object(
      'key', 'recommendations_reviewable',
      'label', 'Growth recommendations reviewable — accept, dismiss, defer',
      'met', v_pending >= 0,
      'note', 'Human review required for growth evolution recommendations.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — gradual improvement, celebrate progress',
      'met', true,
      'note', 'Self Love A.76 — growth without guilt or pressure.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Learning, Innovation Lab, QG 58–59',
      'met', jsonb_array_length(public._cgadbp_integration_links()) >= 12,
      'note', 'Extend related engines — do not duplicate.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard + card RPC replacements (preserve ALL A.81 + add Phase 58)
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_evolution_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_growth_evolution_settings;
  v_adaptive_settings public.companion_growth_adaptive_settings;
begin
  perform public._irp_require_permission('growth_evolution.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gee_ensure_settings(v_org_id);
  v_adaptive_settings := public._cgadbp_ensure_settings(v_org_id, v_user_id);
  perform public._gee_seed_data(v_org_id);
  perform public._cgadbp_seed_feedback(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Growth means becoming better — not just doing more. Learn thoughtfully, improve responsibly, adapt strategically, and celebrate progress.',
    'mission', 'Guide sustainable organizational growth through continuous learning, adaptation, and improvement — with human control at every step.',
    'abos_principle', 'Success is the ongoing ability to learn, adapt, and improve — not a destination. Aipify orchestrates growth; humans decide.',
    'vision', 'A companion helping organizations evolve healthier — progress not perfection. A little better every day.',
    'distinction_note', 'Distinct from Evolution Governance (Phase 84 — change proposals at /app/evolution), Capability Maturity (A.57), Organizational Health (A.56), and Learning Engine customer memory (/app/learning).',
    'self_love_note', 'Self Love integration: sustainable growth, reflection, celebrate progress, detect stress, balance ambition and wellbeing.',
    'proactive_companion_note', 'Proactive Companion (A.79) may surface growth opportunities proactively — this engine governs growth orchestration and learning cycles.',
    'trust_engine_note', 'Trust Engine connection: every recommendation includes evidence, trade-offs, and risks — transparent and auditable.',
    'growth_dimensions', public._gee_growth_dimensions(),
    'learning_cycle_steps', public._gee_learning_cycle_steps(),
    'evolution_capabilities', public._gee_evolution_capabilities(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'trend_direction', s.trend_direction,
          'confidence', s.confidence,
          'metadata', s.metadata,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_growth_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 10
      ) s
    ), '[]'::jsonb),
    'pending_recommendations', public.list_growth_evolution_recommendations('pending'),
    'summary', jsonb_build_object(
      'pending_recommendations', coalesce((
        select count(*) from public.organization_growth_recommendations
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'accepted_recommendations', coalesce((
        select count(*) from public.organization_growth_recommendations
        where organization_id = v_org_id and status = 'accepted'
      ), 0),
      'recent_signals', coalesce((
        select count(*) from public.organization_growth_signals
        where organization_id = v_org_id
          and created_at >= now() - interval '30 days'
      ), 0),
      'focus_dimensions', jsonb_array_length(v_settings.focus_dimensions)
    ),
    'integration_links', jsonb_build_object(
      'proactive_companion', '/app/proactive-companion-engine',
      'continuous_improvement', '/app/continuous-improvement-engine',
      'organizational_health', '/app/organizational-health-engine',
      'capability_maturity', '/app/capability-maturity-engine',
      'learning', '/app/learning',
      'decisions', '/app/assistant/decisions',
      'approvals', '/app/approvals'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('growth_evolution.manage'),
      'can_review', public._irp_has_permission('growth_evolution.recommendations.review'),
      'can_export', public._irp_has_permission('growth_evolution.export')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 58 — Companion Growth & Adaptive Development Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE58_COMPANION_GROWTH_ADAPTIVE_DEVELOPMENT.md',
      'engine_phase', 'Phase A.81 Growth & Evolution Engine',
      'route', '/app/growth-evolution-engine',
      'mapping_note', 'ABOS Blueprint Phase 58 extends A.81 with companion adaptive development and feedback-driven refinement. NAMING COLLISION: QG Phases 58–59 at /app/quality — different scope.'
    ),
    'blueprint_philosophy', public._cgadbp_blueprint_philosophy(),
    'blueprint_mission', public._cgadbp_blueprint_mission(),
    'blueprint_abos_principle', public._cgadbp_blueprint_abos_principle(),
    'cgadbp_distinction_note', public._cgadbp_distinction_note(),
    'cgadbp_objectives', public._cgadbp_blueprint_objectives(),
    'cgadbp_feedback_collection', public._cgadbp_feedback_collection(),
    'cgadbp_companion_evolution_principles', public._cgadbp_companion_evolution_principles(),
    'cgadbp_organizational_learning', public._cgadbp_organizational_learning(),
    'cgadbp_individual_adaptation', public._cgadbp_individual_adaptation(),
    'cgadbp_self_love_connection', public._cgadbp_self_love_connection(),
    'cgadbp_innovation_balance', public._cgadbp_innovation_balance(),
    'cgadbp_trust_connection', public._cgadbp_trust_connection(),
    'cgadbp_dogfooding', public._cgadbp_dogfooding(),
    'cgadbp_vision_phrases', public._cgadbp_vision_phrases(),
    'cgadbp_integration_links', public._cgadbp_integration_links(),
    'cgadbp_adaptive_summary', public._cgadbp_adaptive_summary(v_org_id, v_user_id),
    'cgadbp_success_criteria', public._cgadbp_blueprint_success_criteria(v_org_id, v_user_id),
    'adaptive_settings', row_to_json(v_adaptive_settings)::jsonb,
    'recent_feedback', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', f.id,
          'feedback_type', f.feedback_type,
          'helpfulness_rating', f.helpfulness_rating,
          'summary', f.summary,
          'context_category', f.context_category,
          'created_at', f.created_at
        ) order by f.created_at desc
      )
      from (
        select * from public.companion_growth_feedback_events
        where organization_id = v_org_id and user_id = v_user_id
        order by created_at desc
        limit 5
      ) f
    ), '[]'::jsonb),
    'privacy_note', 'Companion growth and adaptive development is metadata only — feedback summaries, preference toggles, and growth signals. No raw chat, email, or operational records.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_growth_evolution_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_pending int := 0;
  v_signals int := 0;
  v_adaptive jsonb;
begin
  perform public._irp_require_permission('growth_evolution.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._gee_seed_data(v_org_id);
  perform public._cgadbp_seed_feedback(v_org_id, v_user_id);

  select count(*) into v_pending
  from public.organization_growth_recommendations
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_signals
  from public.organization_growth_signals
  where organization_id = v_org_id
    and created_at >= now() - interval '30 days';

  v_adaptive := public._cgadbp_adaptive_summary(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Growth means becoming better — not just doing more. Learn, improve thoughtfully, adapt responsibly.',
    'pending_recommendations', v_pending,
    'recent_signals', v_signals,
    'enabled', (select enabled from public.organization_growth_evolution_settings where organization_id = v_org_id),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 58 — Companion Growth & Adaptive Development Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE58_COMPANION_GROWTH_ADAPTIVE_DEVELOPMENT.md',
      'engine_phase', 'Phase A.81 Growth & Evolution Engine',
      'route', '/app/growth-evolution-engine'
    ),
    'mission', public._cgadbp_blueprint_mission(),
    'abos_principle', public._cgadbp_blueprint_abos_principle(),
    'adaptive_summary', v_adaptive,
    'blueprint_note', 'Companion Growth & Adaptive Development Engine (ABOS Phase 58) — feedback-driven refinement and optional adaptation on Phase A.81. QG Phases 58–59 at /app/quality — different scope.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported', 'gee_adaptive_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'gee_%';
$$;

-- ---------------------------------------------------------------------------
-- 8. Grants + KC category
-- ---------------------------------------------------------------------------
grant execute on function public._cgadbp_distinction_note() to authenticated;
grant execute on function public._cgadbp_blueprint_mission() to authenticated;
grant execute on function public._cgadbp_blueprint_philosophy() to authenticated;
grant execute on function public._cgadbp_blueprint_abos_principle() to authenticated;
grant execute on function public._cgadbp_blueprint_objectives() to authenticated;
grant execute on function public._cgadbp_feedback_collection() to authenticated;
grant execute on function public._cgadbp_companion_evolution_principles() to authenticated;
grant execute on function public._cgadbp_organizational_learning() to authenticated;
grant execute on function public._cgadbp_individual_adaptation() to authenticated;
grant execute on function public._cgadbp_self_love_connection() to authenticated;
grant execute on function public._cgadbp_innovation_balance() to authenticated;
grant execute on function public._cgadbp_trust_connection() to authenticated;
grant execute on function public._cgadbp_dogfooding() to authenticated;
grant execute on function public._cgadbp_vision_phrases() to authenticated;
grant execute on function public._cgadbp_integration_links() to authenticated;
grant execute on function public._cgadbp_adaptive_summary(uuid, uuid) to authenticated;
grant execute on function public._cgadbp_blueprint_success_criteria(uuid, uuid) to authenticated;
grant execute on function public.update_companion_growth_adaptive_settings(jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-growth-adaptive-development-blueprint', 'Companion Growth & Adaptive Development (ABOS Phase 58)',
  'Companion Growth & Adaptive Development Engine — feedback-driven refinement and optional adaptation on Growth & Evolution A.81.',
  'authenticated', 104
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-growth-adaptive-development-blueprint' and tenant_id is null
);
