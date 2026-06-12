-- Implementation Blueprint Phase 28 — Onboarding & Success Engine
-- Spec alignment extending Customer Onboarding Engine (Phase A.10). No new tables.

create or replace function public._osbp_blueprint_onboarding_journey()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'welcome',
      'label', 'Welcome',
      'order', 1,
      'description', 'Introduce Aipify, set expectations, and acknowledge getting started',
      'a10_steps', jsonb_build_array('welcome', 'organization_profile'),
      'objectives', jsonb_build_array('Understand what Aipify offers', 'Complete organization profile', 'Acknowledge getting started guide')
    ),
    jsonb_build_object(
      'key', 'connect',
      'label', 'Connect',
      'order', 2,
      'description', 'Integrations, permissions, validate environments, and connect systems',
      'a10_steps', jsonb_build_array('integrations', 'secure_ai_actions'),
      'objectives', jsonb_build_array('Connect first integration', 'Review AI action policies', 'Validate environment permissions')
    ),
    jsonb_build_object(
      'key', 'learn',
      'label', 'Learn',
      'order', 3,
      'description', 'Knowledge Center foundations, workflows, and train stakeholders gradually',
      'a10_steps', jsonb_build_array('knowledge_center', 'team_setup'),
      'objectives', jsonb_build_array('Publish first knowledge article', 'Invite team members', 'Explore recommended KC articles')
    ),
    jsonb_build_object(
      'key', 'activate',
      'label', 'Activate',
      'order', 4,
      'description', 'Support, tasks, executive summaries, and go-live readiness',
      'a10_steps', jsonb_build_array('module_activation', 'support_ai', 'admin_assistant', 'go_live'),
      'objectives', jsonb_build_array('Activate core modules', 'Configure support channels', 'Explore operations dashboard', 'Complete security review')
    ),
    jsonb_build_object(
      'key', 'grow',
      'label', 'Grow',
      'order', 5,
      'description', 'Advanced capabilities, Business Packs, and thoughtful expansion',
      'a10_steps', jsonb_build_array('go_live'),
      'objectives', jsonb_build_array('Complete onboarding', 'Explore Business Packs', 'Plan gradual feature expansion', 'Cross-link Customer Success for ongoing health')
    )
  );
$$;

create or replace function public._osbp_blueprint_early_success_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'first_kc_article_live',
      'scenario', 'First Knowledge Center article live',
      'example', '🔔 Your first Knowledge Center article is live — a foundation others can build on.',
      'checklist_key', 'publish_first_article'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'team_completed_onboarding',
      'scenario', 'Team completed onboarding',
      'example', '🌹 Your team completed onboarding — Aipify is ready to support daily work together.',
      'checklist_key', 'invite_team_member'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'first_support_workflow',
      'scenario', 'First support workflow configured',
      'example', '🔔 Your first support workflow is configured — customers can get help through your channels.',
      'checklist_key', 'configure_support_channels'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'celebrate_milestone',
      'scenario', 'Celebrate early success milestone',
      'example', '❤️ You reached an early success milestone — small wins build confidence for what is next.',
      'checklist_key', 'acknowledge_getting_started'
    )
  );
$$;

create or replace function public._osbp_blueprint_customer_success_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'adoption_progress', 'label', 'Adoption progress', 'description', 'Track checklist and step completion trends — guided setup through activation'),
    jsonb_build_object('key', 'feature_utilization', 'label', 'Feature utilization', 'description', 'Core modules activated, operations dashboard explored, and companion preferences configured'),
    jsonb_build_object('key', 'kc_growth', 'label', 'Knowledge Center growth', 'description', 'Articles published, team trained on foundations, and knowledge gaps addressed early'),
    jsonb_build_object('key', 'support_outcomes', 'label', 'Support outcomes', 'description', 'Support channels configured, workflows ready, and early resolution patterns established'),
    jsonb_build_object('key', 'engagement', 'label', 'Engagement', 'description', 'Team invitations, stakeholder training, and consistent operations dashboard use'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Satisfaction and confidence', 'description', 'Confidence building through guided wins — never pressure; cross-link Customer Success A.26 for ongoing health')
  );
$$;

create or replace function public._osbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Gradual features, avoid overwhelm, celebrate small wins, patience — onboarding succeeds when people feel supported, not rushed.',
    'practices', jsonb_build_array(
      'Introduce features gradually — ten-step flow and checklist prevent overwhelm',
      'Celebrate small wins — early success moments acknowledge progress',
      'Support patience — no guilt language for incomplete items',
      'Respect attention — onboarding recommendations are optional guidance',
      'Build confidence — each checklist item is a manageable step forward'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Onboarding tracks progress metadata only.'
  );
$$;

create or replace function public._osbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'What Aipify is doing, why recommendations appear, available capabilities, and how success is measured — transparent, metadata only.',
    'users_should_know', jsonb_build_array(
      'Onboarding tracks progress metadata — operational data stays in respective modules',
      'Knowledge Center recommendations explain which articles help the current step',
      'Checklist items map to real setup actions — humans complete each step',
      'Success is measured by completion trends, not surveillance or pressure',
      'Customer Success A.26 handles ongoing health — distinct from setup journey'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Aipify Install Engine A.22 — technical installation and discovery',
      'Distinct from Customer Success A.26 — health scores, interventions, renewal risk',
      'Distinct from Launch Readiness A.25 — pre-launch go-live review',
      'Distinct from Modern Install Phase 24 — embedded wizard at /app/install',
      'Phase A.10 ten-step flow and checklist preserved alongside five blueprint stages'
    ),
    'audit_note', 'Onboarding started, step advanced, checklist completed, and onboarding completed events logged — metadata only.'
  );
$$;

create or replace function public._osbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates onboarding internally; Unonight is the first external pilot for time-to-value.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — installation simplicity, time-to-value, feature understanding, confidence',
      'focus', jsonb_build_array('Guided setup through ten-step flow', 'KC article foundations for internal teams', 'Integration and permission validation', 'Early wins before advanced capabilities')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce onboarding and team activation',
      'focus', jsonb_build_array('Commerce module activation', 'Support channel configuration', 'Team onboarding for daily operations', 'Time-to-value measurement from checklist completion')
    )
  );
$$;

create or replace function public._osbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Aipify Install Engine (A.22)', 'route', '/app/aipify-install-engine', 'note', 'Technical installation and environment discovery — Install & Adoption ABOS aligned, cross-link only'),
    jsonb_build_object('label', 'Modern Install (Phase 24)', 'route', '/app/install', 'note', 'Token-free install wizard — embedded runtime, distinct from org onboarding'),
    jsonb_build_object('label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine', 'note', 'Ongoing health scores, adoption, interventions — distinct from setup journey'),
    jsonb_build_object('label', 'Launch Readiness (A.25)', 'route', '/app/launch-readiness-engine', 'note', 'Pre-launch checklist and go-live review'),
    jsonb_build_object('label', 'Business Packs (A.43 Phase 15)', 'route', '/app/business-packs-foundation-engine', 'note', 'Thoughtful expansion in Grow stage'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'KC foundations and article recommendations'),
    jsonb_build_object('label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Connect stage — integrations and permissions'),
    jsonb_build_object('label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine', 'note', 'Configure companion preferences during activation'),
    jsonb_build_object('label', 'Learning & Training (A.36)', 'route', '/app/learning-training-engine', 'note', 'Train stakeholders in Learn stage'),
    jsonb_build_object('label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine', 'note', 'Explore operations during activation'),
    jsonb_build_object('label', 'Value Realization Engine', 'route', '/app/value-realization-engine', 'note', 'Measure time-to-value and early wins'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Gradual pacing and small wins — principle only')
  );
$$;

create or replace function public._osbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Easy to adopt despite depth — guided, not overwhelmed.',
    'We understood it, benefited, and were never left alone.',
    'Technology succeeds when people succeed — onboarding begins the relationship.',
    'First experiences matter — supported from the beginning.',
    'Small wins build confidence for thoughtful expansion.'
  );
$$;

create or replace function public._osbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_row public.organization_onboarding;
  v_checklist_total int := 0;
  v_checklist_done int := 0;
  v_step_index int := 0;
  v_total_steps int := 10;
  v_completed boolean := false;
  v_days_since_start int := 0;
begin
  v_row := public._cob_ensure_onboarding(p_org_id);
  perform public._cob_recalc_completion(p_org_id);
  select * into v_row from public.organization_onboarding where organization_id = p_org_id;

  select count(*) into v_checklist_total
  from public.onboarding_checklist_items where organization_id = p_org_id;

  select count(*) into v_checklist_done
  from public.onboarding_checklist_items where organization_id = p_org_id and completed;

  v_step_index := public._cob_step_index(v_row.current_step);
  v_total_steps := array_length(public._cob_steps(), 1);
  v_completed := v_row.completed_at is not null;
  v_days_since_start := greatest(0, extract(day from now() - v_row.started_at)::int);

  return jsonb_build_object(
    'current_step', v_row.current_step,
    'step_index', v_step_index,
    'total_steps', v_total_steps,
    'completion_percentage', v_row.completion_percentage,
    'checklist_total', v_checklist_total,
    'checklist_completed', v_checklist_done,
    'checklist_remaining', v_checklist_total - v_checklist_done,
    'onboarding_completed', v_completed,
    'days_since_start', v_days_since_start,
    'started_at', v_row.started_at,
    'completed_at', v_row.completed_at,
    'privacy_note', 'Counts and progress metadata only — no PII or operational content.'
  );
end; $$;

create or replace function public._osbp_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_pct numeric := 0;
  v_done int := 0;
  v_total int := 0;
  v_completed boolean := false;
  v_step_index int := 0;
  v_has_integration boolean := false;
  v_has_kc boolean := false;
  v_has_team boolean := false;
begin
  v_engagement := public._osbp_engagement_summary(p_org_id);
  v_pct := coalesce((v_engagement->>'completion_percentage')::numeric, 0);
  v_done := coalesce((v_engagement->>'checklist_completed')::int, 0);
  v_total := coalesce((v_engagement->>'checklist_total')::int, 0);
  v_completed := coalesce((v_engagement->>'onboarding_completed')::boolean, false);
  v_step_index := coalesce((v_engagement->>'step_index')::int, 0);

  select exists(
    select 1 from public.onboarding_checklist_items
    where organization_id = p_org_id and checklist_key = 'connect_first_integration' and completed
  ) into v_has_integration;

  select exists(
    select 1 from public.onboarding_checklist_items
    where organization_id = p_org_id and checklist_key = 'publish_first_article' and completed
  ) into v_has_kc;

  select exists(
    select 1 from public.onboarding_checklist_items
    where organization_id = p_org_id and checklist_key = 'invite_team_member' and completed
  ) into v_has_team;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'onboarding_completion',
      'label', 'Onboarding completion — checklist and steps progressing toward go-live',
      'met', v_completed or v_pct >= 50,
      'note', case when not v_completed and v_pct < 50 then 'Complete checklist items and advance steps to reach 50% completion.' else null end
    ),
    jsonb_build_object(
      'key', 'decreased_time_to_value',
      'label', 'Decreased time-to-value — early checklist items completed quickly',
      'met', v_done >= 3 or v_completed,
      'note', case when v_done < 3 then 'Complete profile, team invite, or first article for early time-to-value signals.' else null end
    ),
    jsonb_build_object(
      'key', 'increased_adoption',
      'label', 'Increased adoption — modules, integrations, and operations explored',
      'met', v_has_integration or v_step_index >= 5 or v_completed,
      'note', case when not v_has_integration and v_step_index < 5 then 'Connect first integration or advance to module activation.' else null end
    ),
    jsonb_build_object(
      'key', 'stronger_confidence',
      'label', 'Stronger confidence — early success moments and milestones documented',
      'met', jsonb_array_length(public._osbp_blueprint_early_success_moments()) >= 4,
      'note', 'Celebrate first KC article, team onboarding, support workflow, and milestones.'
    ),
    jsonb_build_object(
      'key', 'long_term_engagement',
      'label', 'Long-term engagement — team setup and KC foundations established',
      'met', v_has_team and v_has_kc,
      'note', case when not (v_has_team and v_has_kc) then 'Invite team members and publish first KC article for sustained engagement.' else null end
    ),
    jsonb_build_object(
      'key', 'onboarding_journey',
      'label', 'Onboarding journey documented — Welcome, Connect, Learn, Activate, Grow',
      'met', jsonb_array_length(public._osbp_blueprint_onboarding_journey()) = 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'early_success_moments',
      'label', 'Early success moments documented (🔔🌹❤️)',
      'met', jsonb_array_length(public._osbp_blueprint_early_success_moments()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'customer_success_objectives',
      'label', 'Customer success objectives documented — adoption, utilization, KC, support, engagement',
      'met', jsonb_array_length(public._osbp_blueprint_customer_success_objectives()) >= 6,
      'note', 'Cross-link Customer Success A.26 for ongoing health beyond setup.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — gradual features, celebrate small wins, patience',
      'met', true,
      'note', 'Self Love is a principle — guided pacing, not pressure.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust transparency — explainable recommendations and progress measurement',
      'met', (public._osbp_blueprint_trust_connection()->>'principle') is not null,
      'note', 'What Aipify is doing and how success is measured — metadata only.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Install A.22, Success A.26, Launch Readiness A.25',
      'met', jsonb_array_length(public._osbp_blueprint_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate installation or ongoing health logic.'
    ),
    jsonb_build_object(
      'key', 'engine_active',
      'label', 'Onboarding engine active for organization',
      'met', v_total > 0,
      'note', case when v_total = 0 then 'Onboarding checklist will seed on first dashboard load.' else null end
    )
  );
end; $$;

create or replace function public._osbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Aipify Install Engine A.22 /app/aipify-install-engine (technical installation and discovery — Install & Adoption ABOS already aligned), Customer Success Engine A.26 /app/customer-success-engine (ongoing health scores, interventions, renewal risk), Launch Readiness A.25 /app/launch-readiness-engine (pre-launch go-live review), and Modern Install Phase 24 /app/install (embedded wizard). Phase A.10 ten-step flow, checklist, and KC recommendations preserved.';
$$;

create or replace function public.get_customer_onboarding_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_onboarding;
  v_steps text[];
  v_recommendations jsonb;
begin
  perform public._irp_require_permission('onboarding.view');
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  v_steps := public._cob_steps();
  perform public._cob_recalc_completion(v_org_id);
  select * into v_row from public.organization_onboarding where organization_id = v_org_id;
  v_recommendations := public.get_onboarding_recommendations();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Guided onboarding helps organizations activate Aipify confidently — step by step with checklist and knowledge support.',
    'safety_note', 'Onboarding tracks progress metadata only. Operational data remains in respective modules.',
    'principles', jsonb_build_array(
      'Ten-step guided flow',
      'Actionable checklist items',
      'Knowledge Center recommendations',
      'Progress tracking with audit trail',
      'Owner and administrator control'
    ),
    'current_step', v_row.current_step,
    'step_index', public._cob_step_index(v_row.current_step),
    'total_steps', array_length(v_steps, 1),
    'steps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'step_key', s.step,
        'step_index', s.ordinality - 1,
        'completed', public._cob_step_index(v_row.current_step) >= s.ordinality - 1,
        'current', v_row.current_step = s.step
      ) order by s.ordinality)
      from unnest(v_steps) with ordinality as s(step, ordinality)
    ), '[]'::jsonb),
    'completion_percentage', v_row.completion_percentage,
    'completed_at', v_row.completed_at,
    'checklist', coalesce((
      select jsonb_agg(jsonb_build_object(
        'checklist_key', c.checklist_key, 'title', c.title,
        'completed', c.completed, 'completed_at', c.completed_at
      ) order by c.created_at)
      from public.onboarding_checklist_items c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'checklist_completed', (
      select count(*) from public.onboarding_checklist_items where organization_id = v_org_id and completed
    ),
    'checklist_total', (
      select count(*) from public.onboarding_checklist_items where organization_id = v_org_id
    ),
    'recommendations', v_recommendations,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 28 — Onboarding & Success Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE28_ONBOARDING_SUCCESS.md',
      'engine_phase', 'Phase A.10 Customer Onboarding Engine',
      'route', '/app/customer-onboarding-engine',
      'mapping_note', 'ABOS Blueprint Phase 28 maps to Customer Onboarding Engine Phase A.10 — extend, do not duplicate Install A.22, Customer Success A.26, or Launch Readiness A.25.'
    ),
    'onboarding_success_note', 'Onboarding & Success Engine (ABOS Phase 28) — extends Customer Onboarding Engine Phase A.10 with blueprint journey stages, early success moments, customer success objectives, and live engagement summary.',
    'blueprint_philosophy', 'First experiences matter — supported from the beginning; success without technical expertise.',
    'blueprint_mission', 'Deliver value quickly after adoption — guide setup through long-term success, not merely installed.',
    'blueprint_abos_principle', 'Technology succeeds when people succeed — onboarding is the beginning of the relationship.',
    'vision', 'Easy to adopt despite depth — guided, not overwhelmed; we understood it, benefited, and were never left alone.',
    'blueprint_distinction_note', public._osbp_distinction_note(),
    'onboarding_journey', public._osbp_blueprint_onboarding_journey(),
    'early_success_moments', public._osbp_blueprint_early_success_moments(),
    'customer_success_objectives', public._osbp_blueprint_customer_success_objectives(),
    'self_love_connection', public._osbp_blueprint_self_love_connection(),
    'trust_connection', public._osbp_blueprint_trust_connection(),
    'dogfooding', public._osbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._osbp_blueprint_integration_links(),
    'engagement_summary', public._osbp_engagement_summary(v_org_id),
    'success_criteria', public._osbp_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._osbp_blueprint_vision_phrases(),
    'privacy_note', 'Onboarding is organization-scoped, explainable, and auditable. Progress metadata only — no operational content.'
  );
end; $$;

create or replace function public.get_customer_onboarding_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_onboarding;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_row := public._cob_ensure_onboarding(v_org_id);
  perform public._cob_recalc_completion(v_org_id);
  select * into v_row from public.organization_onboarding where organization_id = v_org_id;
  v_engagement := public._osbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'current_step', v_row.current_step,
    'completion_percentage', v_row.completion_percentage,
    'completed', v_row.completed_at is not null,
    'checklist_remaining', (
      select count(*) from public.onboarding_checklist_items
      where organization_id = v_org_id and not completed
    ),
    'philosophy', 'Guided setup for new organizations.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 28 — Onboarding & Success Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE28_ONBOARDING_SUCCESS.md',
      'engine_phase', 'Phase A.10 Customer Onboarding Engine',
      'route', '/app/customer-onboarding-engine'
    ),
    'mission', 'Deliver value quickly after adoption — guide setup through long-term success.',
    'abos_principle', 'Technology succeeds when people succeed — onboarding begins the relationship.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Onboarding & Success Engine (ABOS Phase 28) — extends Phase A.10 with journey stages, early success moments, and live success criteria.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._osbp_blueprint_onboarding_journey() to authenticated;
grant execute on function public._osbp_blueprint_early_success_moments() to authenticated;
grant execute on function public._osbp_blueprint_customer_success_objectives() to authenticated;
grant execute on function public._osbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._osbp_blueprint_trust_connection() to authenticated;
grant execute on function public._osbp_blueprint_dogfooding() to authenticated;
grant execute on function public._osbp_blueprint_integration_links() to authenticated;
grant execute on function public._osbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._osbp_engagement_summary(uuid) to authenticated;
grant execute on function public._osbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'onboarding-success-blueprint', 'Onboarding & Success Engine (ABOS Phase 28)',
  'Onboarding & Success Engine — extends Phase A.10 with journey stages, early success moments, customer success objectives, and live engagement summary.',
  'authenticated', 103
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'onboarding-success-blueprint' and tenant_id is null
);
