-- Implementation Blueprint Phase 92 — Human Potential & Talent Development Engine
-- Extends Learning & Training Engine Phase A.36 + Blueprint Phase 31 Training & Certification. No new tables.
-- Distinct from Enterprise Deployment Framework repo Phase 92 at /app/enterprise/framework and Hope Engine A.92.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._hptdbp92_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 92 — Human Potential & Talent Development Engine at /app/learning-training-engine. Extends Learning & Training Engine Phase A.36 and Blueprint Phase 31 Training & Certification (_tcbp_*). Phase 31 = training/certification competence; Phase 92 = human potential, strength-based development, Career Companion support, talent mobility. Distinct from Enterprise Deployment Framework repo Phase 92 at /app/enterprise/framework (phase number collision). Distinct from Hope Engine A.92 at /app/hope-engine (repo engine phase collision). Empowerment not control — no hidden performance scoring. Helpers use _hptdbp92_* only — never collide with _tcbp_* or _lte_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._hptdbp92_mission()
returns text language sql immutable as $$
  select 'Create environments where individuals discover strengths, develop capabilities, and contribute meaningfully.';
$$;

create or replace function public._hptdbp92_philosophy()
returns text language sql immutable as $$
  select 'Organizations create conditions for growth — not merely extract productivity. Development should feel supportive and human-led, not evaluative or controlling.';
$$;

create or replace function public._hptdbp92_abos_principle()
returns text language sql immutable as $$
  select 'People become more capable when organizations invest in their growth — Aipify creates conditions for discovery and development; humans decide direction and pace.';
$$;

create or replace function public._hptdbp92_vision()
returns text language sql immutable as $$
  select 'We are helping people become more than they believed possible.';
$$;

create or replace function public._hptdbp92_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strength_discovery', 'label', 'Strength discovery', 'description', 'Help individuals recognize emerging strengths and interests — metadata scaffolds only'),
    jsonb_build_object('key', 'capability_development', 'label', 'Capability development', 'description', 'Develop capabilities through meaningful, self-paced learning paths'),
    jsonb_build_object('key', 'meaningful_contribution', 'label', 'Meaningful contribution', 'description', 'Connect growth to ways people contribute to the organization'),
    jsonb_build_object('key', 'career_growth', 'label', 'Career growth', 'description', 'Support career development and internal mobility pathways'),
    jsonb_build_object('key', 'empowerment_not_control', 'label', 'Empowerment not control', 'description', 'Human-led development — Aipify informs and prepares, never hidden scoring'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth', 'description', 'Growth conditions that remain sustainable — patience, not productivity extraction')
  );
$$;

create or replace function public._hptdbp92_development_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Development questions — strength-oriented reflection, not performance evaluation.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'strengths', 'question', 'What strengths are emerging through your work?', 'description', 'Wisdom-oriented strength discovery — development not evaluation'),
      jsonb_build_object('emoji', '🌹', 'key', 'milestones', 'question', 'What learning milestones deserve recognition?', 'description', 'Celebrate progress — cross-link Gratitude & Recognition A.89'),
      jsonb_build_object('emoji', '❤️', 'key', 'supportive_development', 'question', 'How can development feel supportive rather than evaluative?', 'description', 'Career Companion tone — patient mastery, not pressure'),
      jsonb_build_object('emoji', '🔔', 'key', 'pathways', 'question', 'What pathways would help you grow in directions that interest you?', 'description', 'Interest-led pathways — talent mobility scaffold')
    ),
    'reflection_note', 'Questions invite development reflection — humans decide what to pursue; Aipify scaffolds options.'
  );
$$;

create or replace function public._hptdbp92_strength_based_development()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strength-based development — focus on emerging capabilities, not deficit scoring.',
    'practices', jsonb_build_array(
      'Focus on strengths and interests — not hidden performance rankings',
      'Individual aspirations acknowledged — optional interest metadata only',
      'Growth-oriented Career Companion support — development not evaluation',
      'Patient mastery — cross-link Self Love A.76 sustainable learning principles'
    ),
    'boundary_note', 'Aipify surfaces learning pathways and progress metadata — never punitive individual scoring.'
  );
$$;

create or replace function public._hptdbp92_learning_pathways()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'onboarding',
      'title', 'Onboarding pathways',
      'designed_for', jsonb_build_array('New team members'),
      'topics', jsonb_build_array('Role orientation', 'First-week guidance', 'Companion introduction', 'Core workflows'),
      'cross_link', '/app/settings/employee-knowledge',
      'cross_link_note', 'Employee Knowledge EKE onboarding paths — cross-link only'
    ),
    jsonb_build_object(
      'key', 'role_specific',
      'title', 'Role-specific pathways',
      'designed_for', jsonb_build_array('Owner', 'Administrator', 'Support', 'Manager', 'Viewer'),
      'topics', jsonb_build_array('Role responsibilities', 'Module adoption', 'Knowledge checks', 'Team readiness'),
      'mapped_path_keys', jsonb_build_array('onboarding_getting_started', 'support_ai_basics', 'admin_operations', 'manager_analytics')
    ),
    jsonb_build_object(
      'key', 'leadership_development',
      'title', 'Leadership development',
      'designed_for', jsonb_build_array('Leaders', 'Emerging leaders'),
      'topics', jsonb_build_array('Executive companion readiness', 'Strategic intelligence', 'Decision support', 'Team development'),
      'certification_route', '/app/certification-achievement-engine',
      'mapped_path_keys', jsonb_build_array('manager_analytics', 'manager_reporting')
    ),
    jsonb_build_object(
      'key', 'sales_expert_certification',
      'title', 'Sales Expert certification journeys',
      'designed_for', jsonb_build_array('Sales Representatives', 'Sales Experts', 'Partners'),
      'topics', jsonb_build_array('Product knowledge', 'Customer communication', 'Certification milestones', 'Partner readiness'),
      'cross_link', '/app/sales-expert-engine',
      'cross_link_note', 'Sales Expert A.95 certification journeys — cross-link only'
    ),
    jsonb_build_object(
      'key', 'cross_functional',
      'title', 'Cross-functional exposure',
      'designed_for', jsonb_build_array('Team members exploring new areas'),
      'topics', jsonb_build_array('Adjacent role awareness', 'Collaboration skills', 'Internal mobility interests', 'Capability breadth'),
      'cross_link', '/app/growth-evolution-engine',
      'cross_link_note', 'Growth & Evolution A.81 — post-learning capability integration'
    )
  );
$$;

create or replace function public._hptdbp92_career_companion_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Career Companion support — development not evaluation. Aipify informs and prepares; humans decide pace and direction.',
    'companion_name', 'Career Companion',
    'not_label', 'AI coach',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'strengths_emerging', 'prompt', 'Strengths often emerge through practice — would reviewing your completed learning paths help identify growth areas?', 'consideration', 'Development dialogue — not performance review'),
      jsonb_build_object('emoji', '🌹', 'key', 'milestone_recognition', 'prompt', 'Recent learning milestones may deserve recognition — shall I highlight achievements from your training progress?', 'consideration', 'Celebrate progress — cross-link Gratitude A.89'),
      jsonb_build_object('emoji', '❤️', 'key', 'supportive_pace', 'prompt', 'Mastery develops over time — would exploring optional pathways at your own pace feel supportive?', 'consideration', 'Patient development — Self Love A.76 principle')
    ),
    'boundary_note', 'Career Companion scaffolds development options — never evaluates individuals or assigns hidden scores.'
  );
$$;

create or replace function public._hptdbp92_talent_mobility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Talent mobility — internal opportunities, expressed interests, cross-functional pathways, leadership readiness scaffolds.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'internal_opportunities', 'label', 'Internal opportunities', 'description', 'Cross-link available learning paths and certification programs — metadata only'),
      jsonb_build_object('key', 'expressed_interests', 'label', 'Expressed interests', 'description', 'Optional interest signals — human-declared, never inferred scoring'),
      jsonb_build_object('key', 'cross_functional', 'label', 'Cross-functional pathways', 'description', 'Exposure paths across roles and teams — complements role-specific training'),
      jsonb_build_object('key', 'leadership_readiness', 'label', 'Leadership readiness', 'description', 'Leadership development pathway completion — aggregate team readiness only, no individual ranking')
    ),
    'privacy_note', 'Mobility scaffolds are optional and transparent — no hidden performance scoring or forced pathways.'
  );
$$;

create or replace function public._hptdbp92_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable development pace, patience with mastery, celebration of progress.',
    'practices', jsonb_build_array(
      'Patient mastery — no guilt for incomplete or overdue paths',
      'Normalize learning curves — knowledge checks allow retakes',
      'Celebrate progress without perfection pressure',
      'Sustainable development — cross-link Time & Attention Guardian'
    ),
    'journey_phrase', 'Development at a human pace — becoming more than you believed possible.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable development reflection — principle only; Human Potential Blueprint stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._hptdbp92_recognition_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition connection — celebrate learning milestones, resilience, and meaningful contributions.',
    'recognition_types', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'learning_milestones', 'label', 'Learning milestones', 'description', 'Path completions and certification achievements — cross-link A.37 badges'),
      jsonb_build_object('emoji', '🌹', 'key', 'resilience_through_learning', 'label', 'Resilience through learning', 'description', 'Progress despite difficulty — strength-based narrative'),
      jsonb_build_object('emoji', '🌹', 'key', 'meaningful_contributions', 'label', 'Meaningful contributions', 'description', 'How developed capabilities support team and organizational goals')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Recognition is human-led — Aipify highlights metadata milestones, never automated performance judgments.'
  );
$$;

create or replace function public._hptdbp92_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent talent development — empowerment not control.',
    'organizations_should_understand', jsonb_build_array(
      'What development data represents — learning progress and pathway completion metadata only',
      'How progress is measured — completion percentages and assessment scores, never hidden rankings',
      'What remains optional — self-paced paths, interest signals, and mobility scaffolds',
      'Empowerment not control — humans decide development direction and pace'
    ),
    'leaders_should_know', jsonb_build_array(
      'Team readiness aggregates counts only — no individual comparison or scoring',
      'Career Companion supports development — not evaluation or performance management',
      'Distinct from operational learning memory, HR systems, and surveillance tooling',
      'Privacy principles enforced — no hidden scoring, forced pathways, or unfair comparison'
    ),
    'audit_note', 'Training progress audited via user_learning_progress — metadata only, tenant-scoped.'
  );
$$;

create or replace function public._hptdbp92_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — empowerment not control in talent development.',
    'forbidden', jsonb_build_array(
      'Hidden performance scoring or individual ranking',
      'Forced development pathways without human consent',
      'Reducing people to metrics alone',
      'Unfair comparison between individuals'
    ),
    'required', jsonb_build_array(
      'Transparent progress measurement — completion and assessment metadata only',
      'Optional pathways and interest signals — human-declared',
      'Aggregate team readiness — no individual surveillance',
      'Career Companion development tone — supportive, not evaluative'
    ),
    'boundary_note', 'Aipify creates conditions for growth — organizations and individuals retain agency.'
  );
$$;

create or replace function public._hptdbp92_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates human potential development patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert growth, leadership development, product team learning, companion stewardship',
      'focus', jsonb_build_array(
        'Sales Expert certification and growth journeys',
        'Leadership development and executive companion readiness',
        'Product team learning paths and capability building',
        'Companion stewardship and Career Companion tone validation'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce team development and role-specific growth',
      'focus', jsonb_build_array(
        'Commerce support team capability development',
        'Administrator and manager growth pathways',
        'Seasonal team onboarding and cross-functional exposure'
      )
    )
  );
$$;

create or replace function public._hptdbp92_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are helping people become more than they believed possible.',
    'Organizations create conditions for growth — not merely extract productivity.',
    'Development feels supportive — not evaluative or controlling.',
    'Strengths emerge through meaningful work and patient learning.',
    'Humans decide direction and pace — Aipify informs and prepares.',
    'Empowerment not control — no hidden performance scoring.'
  );
$$;

create or replace function public._hptdbp92_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employee_knowledge_eke', 'label', 'Employee Knowledge Engine (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Onboarding paths and internal knowledge — cross-link only'),
    jsonb_build_object('key', 'human_success_phase82', 'label', 'Human Success (Repo Phase 82)', 'route', '/app/human-success', 'note', 'Adoption journeys complement development pathways'),
    jsonb_build_object('key', 'certification_a37', 'label', 'Certification & Achievement (A.37)', 'route', '/app/certification-achievement-engine', 'note', 'Certificates and badges built on A.36 completion'),
    jsonb_build_object('key', 'gratitude_recognition_a89', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Learning milestones and meaningful contributions'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable development pace — principle only'),
    jsonb_build_object('key', 'inclusion_a83', 'label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Inclusive development environments — cross-link'),
    jsonb_build_object('key', 'change_management_a47', 'label', 'Change Management (A.47)', 'route', '/app/change-management-engine', 'note', 'Training hooks via assign_change_training()'),
    jsonb_build_object('key', 'sales_expert_a95', 'label', 'Sales Expert (A.95)', 'route', '/app/sales-expert-engine', 'note', 'Certification journeys for sales growth'),
    jsonb_build_object('key', 'growth_evolution_a81', 'label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Post-learning capability integration'),
    jsonb_build_object('key', 'blueprint_phase31', 'label', 'Training & Certification (Blueprint Phase 31)', 'route', '/app/learning-training-engine', 'note', 'Competence and certification focus — Phase 92 is human potential on same route'),
    jsonb_build_object('key', 'hope_engine_a92', 'label', 'Hope Engine (A.92)', 'route', '/app/hope-engine', 'note', 'Hope and forward momentum — repo engine phase collision'),
    jsonb_build_object('key', 'enterprise_framework_repo92', 'label', 'Enterprise Deployment Framework (Repo Phase 92)', 'route', '/app/enterprise/framework', 'note', 'Enterprise readiness — phase number collision only')
  );
$$;

create or replace function public._hptdbp92_engagement_summary(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tcbp jsonb;
  v_active_paths int := 0;
  v_user_completed int := 0;
  v_user_assigned int := 0;
begin
  v_tcbp := public._tcbp_engagement_summary(p_organization_id, p_user_id);
  v_active_paths := coalesce((v_tcbp->>'active_learning_paths')::int, 0);
  v_user_completed := coalesce((v_tcbp->>'user_completed_paths')::int, 0);
  v_user_assigned := coalesce((v_tcbp->>'user_assigned_paths')::int, 0);

  return jsonb_build_object(
    'active_learning_paths', v_active_paths,
    'user_assigned_paths', v_user_assigned,
    'user_completed_paths', v_user_completed,
    'learning_pathways', jsonb_array_length(public._hptdbp92_learning_pathways()),
    'development_questions', jsonb_array_length(public._hptdbp92_development_questions()->'questions'),
    'career_companion_examples', jsonb_array_length(public._hptdbp92_career_companion_support()->'examples'),
    'talent_mobility_dimensions', jsonb_array_length(public._hptdbp92_talent_mobility()->'dimensions'),
    'recognition_types', jsonb_array_length(public._hptdbp92_recognition_connection()->'recognition_types'),
    'privacy_forbidden_count', jsonb_array_length(public._hptdbp92_privacy_principles()->'forbidden'),
    'training_engagement', v_tcbp,
    'privacy_note', 'Metadata only — pathway counts, completion progress, and scaffold dimensions. No hidden scoring, no PII, no individual ranking.'
  );
end; $$;

create or replace function public._hptdbp92_success_criteria(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_user_completed int := 0;
  v_active_paths int := 0;
begin
  v_engagement := public._hptdbp92_engagement_summary(p_organization_id, p_user_id);
  v_user_completed := coalesce((v_engagement->>'user_completed_paths')::int, 0);
  v_active_paths := coalesce((v_engagement->>'active_learning_paths')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'strength_discovery',
      'label', 'Strength discovery — development questions and strength-based practices documented',
      'met', jsonb_array_length(public._hptdbp92_development_questions()->'questions') >= 4
        and (public._hptdbp92_strength_based_development()->>'principle') is not null,
      'note', 'Strength-oriented reflection — development not evaluation.'
    ),
    jsonb_build_object(
      'key', 'capability_development',
      'label', 'Capability development — learning pathways and active paths available',
      'met', jsonb_array_length(public._hptdbp92_learning_pathways()) >= 5 and v_active_paths > 0,
      'note', case when v_active_paths = 0 then 'Seed learning paths via _lte_seed_org_content.' else null end
    ),
    jsonb_build_object(
      'key', 'career_companion_support',
      'label', 'Career Companion support — development not evaluation',
      'met', jsonb_array_length(public._hptdbp92_career_companion_support()->'examples') >= 3,
      'note', 'Career Companion — not AI coach. Humans decide pace.'
    ),
    jsonb_build_object(
      'key', 'talent_mobility',
      'label', 'Talent mobility — internal opportunities and cross-functional scaffolds',
      'met', jsonb_array_length(public._hptdbp92_talent_mobility()->'dimensions') >= 4,
      'note', 'Optional interest signals — no hidden scoring.'
    ),
    jsonb_build_object(
      'key', 'recognition_connection',
      'label', 'Recognition connection — milestones, learning, resilience, contributions',
      'met', jsonb_array_length(public._hptdbp92_recognition_connection()->'recognition_types') >= 3,
      'note', 'Cross-link Gratitude & Recognition A.89.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no hidden scoring, forced pathways, or unfair comparison',
      'met', jsonb_array_length(public._hptdbp92_privacy_principles()->'forbidden') >= 4,
      'note', 'Empowerment not control.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent development data and optional pathways',
      'met', jsonb_array_length(public._hptdbp92_trust_connection()->'organizations_should_understand') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable development and patient mastery',
      'met', (public._hptdbp92_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Development at a human pace — becoming more than you believed possible.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links EKE, Human Success, Certification, Gratitude, Change Management, Sales Expert, Growth',
      'met', jsonb_array_length(public._hptdbp92_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate development storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sales Expert growth, leadership dev, product team learning',
      'met', (public._hptdbp92_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'phase31_distinction',
      'label', 'Phase 31 Training & Certification preserved — competence focus distinct from human potential',
      'met', true,
      'note', 'Phase 31 = training/certification; Phase 92 = human potential and talent development.'
    ),
    jsonb_build_object(
      'key', 'meaningful_contribution',
      'label', 'Meaningful contribution — progress records or assigned development paths',
      'met', v_user_completed > 0 or v_user_assigned > 0 or v_active_paths >= 3,
      'note', 'Connect growth to organizational contribution through completed learning metadata.'
    )
  );
end; $$;

create or replace function public._hptdbp92_human_potential_blueprint_block(p_organization_id uuid, p_user_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 92 — Human Potential & Talent Development Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE92_HUMAN_POTENTIAL_TALENT_DEVELOPMENT.md',
    'engine_phase', 'A.36 Learning & Training Engine',
    'route', '/app/learning-training-engine',
    'mapping_note', 'ABOS Blueprint Phase 92 extends A.36 + Phase 31 with strength-based development, Career Companion support, talent mobility, and empowerment-first privacy. Distinct from Enterprise Deployment repo Phase 92 and Hope Engine A.92.',
    'distinction_note', public._hptdbp92_distinction_note(),
    'mission', public._hptdbp92_mission(),
    'philosophy', public._hptdbp92_philosophy(),
    'abos_principle', public._hptdbp92_abos_principle(),
    'objectives', public._hptdbp92_objectives(),
    'development_questions', public._hptdbp92_development_questions(),
    'strength_based_development', public._hptdbp92_strength_based_development(),
    'learning_pathways', public._hptdbp92_learning_pathways(),
    'career_companion_support', public._hptdbp92_career_companion_support(),
    'talent_mobility', public._hptdbp92_talent_mobility(),
    'self_love_connection', public._hptdbp92_self_love_connection(),
    'recognition_connection', public._hptdbp92_recognition_connection(),
    'trust_connection', public._hptdbp92_trust_connection(),
    'privacy_principles', public._hptdbp92_privacy_principles(),
    'dogfooding', public._hptdbp92_dogfooding(),
    'success_criteria', public._hptdbp92_success_criteria(p_organization_id, p_user_id),
    'vision', public._hptdbp92_vision(),
    'vision_phrases', public._hptdbp92_vision_phrases(),
    'integration_links', public._hptdbp92_integration_links(),
    'engagement_summary', public._hptdbp92_engagement_summary(p_organization_id, p_user_id),
    'privacy_note', 'Human potential blueprint data is metadata only — pathway counts, completion progress, scaffold dimensions. No hidden scoring, no PII, no individual ranking. Humans decide direction; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 31 fields; append Phase 92
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_training_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings jsonb;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._lte_seed_org_content(v_org_id);

  select coalesce(jsonb_object_agg(s.setting_key, s.setting_value), '{}'::jsonb)
  into v_settings
  from public.learning_training_settings s
  where s.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Self-paced education for Aipify module adoption — metadata-only content references, not AI learning memory.',
    'principles', jsonb_build_array(
      'Tenant-aware learning paths with role-specific training',
      'Knowledge Center article references — no raw PII',
      'First-login guidance integrated with Customer Onboarding (A.10)',
      'Team readiness aggregates only for managers and reviewers',
      'Distinct from Phase 29 Learning Engine (customer_learning_memory)'
    ),
    'summary', jsonb_build_object(
      'assigned_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id
      ), 0),
      'completed_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id and status = 'completed'
      ), 0),
      'in_progress_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id and status = 'in_progress'
      ), 0),
      'overdue_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id
          and due_at < now() and status not in ('completed', 'expired')
      ), 0),
      'available_paths', coalesce((
        select count(*) from public.learning_paths
        where organization_id = v_org_id and status = 'active'
      ), 0)
    ),
    'assigned_paths', public.get_training_progress(),
    'recommended_paths', public._lte_recommended_paths(v_org_id, v_user_id),
    'overdue_training', coalesce((
      select jsonb_agg(jsonb_build_object(
        'path_title', lp.title,
        'path_key', lp.path_key,
        'due_at', ulp.due_at,
        'completion_percentage', ulp.completion_percentage
      ) order by ulp.due_at)
      from public.user_learning_progress ulp
      join public.learning_paths lp on lp.id = ulp.learning_path_id
      where ulp.organization_id = v_org_id and ulp.user_id = v_user_id
        and ulp.due_at < now() and ulp.status not in ('completed', 'expired')
    ), '[]'::jsonb),
    'recommended_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', tm.id,
        'module_key', tm.module_key,
        'title', tm.title,
        'content_type', tm.content_type,
        'estimated_duration', tm.estimated_duration,
        'content_ref', tm.content_ref,
        'path_title', lp.title
      ) order by tm.sort_order)
      from public.training_modules tm
      join public.learning_paths lp on lp.id = tm.learning_path_id
      where tm.organization_id = v_org_id
        and lp.id in (
          select (elem->>'id')::uuid
          from jsonb_array_elements(public._lte_recommended_paths(v_org_id, v_user_id)) elem
          where elem->>'id' is not null
        )
      limit 12
    ), '[]'::jsonb),
    'learning_paths', coalesce((
      select jsonb_agg(row_to_json(lp) order by lp.category, lp.path_key)
      from public.learning_paths lp
      where lp.organization_id = v_org_id and lp.status = 'active'
    ), '[]'::jsonb),
    'team_readiness', case
      when public._irp_has_permission('learning_training.review') then public._lte_team_readiness(v_org_id)
      else jsonb_build_object('aggregate_only', true, 'access_denied', true)
    end,
    'onboarding_integration', coalesce((
      select jsonb_build_object(
        'current_step', o.current_step,
        'completion_percentage', o.completion_percentage,
        'first_login_guidance', coalesce((v_settings->'defaults'->>'first_login_guidance')::boolean, true),
        'onboarding_route', '/app/customer-onboarding-engine'
      )
      from public.organization_onboarding o
      where o.organization_id = v_org_id
    ), jsonb_build_object('current_step', 'welcome', 'completion_percentage', 0)),
    'settings', v_settings,
    'distinction_note', public._tcbp_distinction_note(),
    'mission', 'Help organizations accelerate adoption, strengthen competence, and create long-term success through guided learning and certification experiences.',
    'blueprint_philosophy', 'Knowledge creates confidence. Confidence accelerates adoption. Learning should feel achievable — not intimidating.',
    'abos_principle', 'The most powerful tools create the greatest value when people understand how to use them confidently. Learning transforms capability into impact.',
    'vision', 'People should feel empowered rather than overwhelmed — we know how to succeed with this.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 31,
      'title', 'Training & Certification Engine',
      'engine_phase', 'A.36',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE31_TRAINING_CERTIFICATION.md'
    ),
    'training_objectives', public._tcbp_blueprint_training_objectives(),
    'blueprint_learning_paths', public._tcbp_blueprint_learning_paths(),
    'learning_experiences', public._tcbp_blueprint_learning_experiences(),
    'certification_principles', public._tcbp_blueprint_certification_principles(),
    'companion_examples', public._tcbp_blueprint_companion_examples(),
    'self_love_connection', public._tcbp_blueprint_self_love_connection(),
    'trust_connection_blueprint', public._tcbp_blueprint_trust_connection(),
    'knowledge_center_connection', public._tcbp_blueprint_knowledge_center_connection(),
    'dogfooding_blueprint', public._tcbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._tcbp_blueprint_integration_links(),
    'blueprint_vision_phrases', public._tcbp_blueprint_vision_phrases(),
    'engagement_summary', public._tcbp_engagement_summary(v_org_id, v_user_id),
    'blueprint_success_criteria', public._tcbp_blueprint_success_criteria(v_org_id, v_user_id),
    'implementation_blueprint_phase92', jsonb_build_object(
      'phase', 'Phase 92 — Human Potential & Talent Development Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE92_HUMAN_POTENTIAL_TALENT_DEVELOPMENT.md',
      'engine_phase', 'A.36 Learning & Training Engine',
      'route', '/app/learning-training-engine',
      'mapping_note', 'ABOS Blueprint Phase 92 extends A.36 + Phase 31 with strength-based development, Career Companion support, and talent mobility. Distinct from Enterprise Deployment repo Phase 92 and Hope Engine A.92.'
    ),
    'human_potential_engine_note', 'Human Potential & Talent Development Engine (ABOS Phase 92) — discover strengths, develop capabilities, contribute meaningfully — empowerment not control.',
    'human_potential_talent_development_blueprint', public._hptdbp92_human_potential_blueprint_block(v_org_id, v_user_id),
    'human_potential_distinction_note', public._hptdbp92_distinction_note(),
    'human_potential_mission', public._hptdbp92_mission(),
    'human_potential_philosophy', public._hptdbp92_philosophy(),
    'human_potential_abos_principle', public._hptdbp92_abos_principle(),
    'human_potential_objectives', public._hptdbp92_objectives(),
    'human_potential_development_questions', public._hptdbp92_development_questions(),
    'human_potential_strength_based_development', public._hptdbp92_strength_based_development(),
    'human_potential_learning_pathways', public._hptdbp92_learning_pathways(),
    'human_potential_career_companion_support', public._hptdbp92_career_companion_support(),
    'human_potential_talent_mobility', public._hptdbp92_talent_mobility(),
    'human_potential_self_love_connection', public._hptdbp92_self_love_connection(),
    'human_potential_recognition_connection', public._hptdbp92_recognition_connection(),
    'human_potential_trust_connection', public._hptdbp92_trust_connection(),
    'human_potential_privacy_principles', public._hptdbp92_privacy_principles(),
    'human_potential_dogfooding', public._hptdbp92_dogfooding(),
    'human_potential_integration_links', public._hptdbp92_integration_links(),
    'human_potential_engagement_summary', public._hptdbp92_engagement_summary(v_org_id, v_user_id),
    'human_potential_success_criteria', public._hptdbp92_success_criteria(v_org_id, v_user_id),
    'human_potential_vision', public._hptdbp92_vision(),
    'human_potential_vision_phrases', public._hptdbp92_vision_phrases(),
    'human_potential_privacy_note', 'Human potential blueprint data is metadata only — no hidden scoring, no PII, no individual ranking. Humans decide direction; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 31 fields; append Phase 92 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_training_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_assigned int;
  v_completed int;
  v_overdue int;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._lte_seed_org_content(v_org_id);

  select
    count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where due_at < now() and status not in ('completed', 'expired'))
  into v_assigned, v_completed, v_overdue
  from public.user_learning_progress
  where organization_id = v_org_id and user_id = v_user_id;

  return jsonb_build_object(
    'has_organization', true,
    'assigned_paths', v_assigned,
    'completed_paths', v_completed,
    'overdue_paths', v_overdue,
    'philosophy', 'Self-paced training for Aipify module adoption.',
    'mission', 'Accelerate adoption through guided learning and certification.',
    'abos_principle', 'Learning transforms capability into impact.',
    'blueprint_phase', 31,
    'engine_phase', 'A.36',
    'route', '/app/learning-training-engine',
    'implementation_blueprint_phase92', jsonb_build_object(
      'phase', 'Phase 92 — Human Potential & Talent Development Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE92_HUMAN_POTENTIAL_TALENT_DEVELOPMENT.md',
      'engine_phase', 'A.36 Learning & Training Engine',
      'route', '/app/learning-training-engine'
    ),
    'human_potential_mission', public._hptdbp92_mission(),
    'human_potential_abos_principle', public._hptdbp92_abos_principle(),
    'human_potential_engagement_summary', public._hptdbp92_engagement_summary(v_org_id, v_user_id),
    'human_potential_note', 'Human Potential & Talent Development Engine (ABOS Phase 92) — strength-based development, Career Companion support, empowerment not control.',
    'human_potential_vision_note', 'We are helping people become more than they believed possible.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._hptdbp92_distinction_note() to authenticated;
grant execute on function public._hptdbp92_mission() to authenticated;
grant execute on function public._hptdbp92_philosophy() to authenticated;
grant execute on function public._hptdbp92_abos_principle() to authenticated;
grant execute on function public._hptdbp92_vision() to authenticated;
grant execute on function public._hptdbp92_objectives() to authenticated;
grant execute on function public._hptdbp92_development_questions() to authenticated;
grant execute on function public._hptdbp92_strength_based_development() to authenticated;
grant execute on function public._hptdbp92_learning_pathways() to authenticated;
grant execute on function public._hptdbp92_career_companion_support() to authenticated;
grant execute on function public._hptdbp92_talent_mobility() to authenticated;
grant execute on function public._hptdbp92_self_love_connection() to authenticated;
grant execute on function public._hptdbp92_recognition_connection() to authenticated;
grant execute on function public._hptdbp92_trust_connection() to authenticated;
grant execute on function public._hptdbp92_privacy_principles() to authenticated;
grant execute on function public._hptdbp92_dogfooding() to authenticated;
grant execute on function public._hptdbp92_vision_phrases() to authenticated;
grant execute on function public._hptdbp92_integration_links() to authenticated;
grant execute on function public._hptdbp92_engagement_summary(uuid, uuid) to authenticated;
grant execute on function public._hptdbp92_success_criteria(uuid, uuid) to authenticated;
grant execute on function public._hptdbp92_human_potential_blueprint_block(uuid, uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-potential-talent-development-blueprint-phase92', 'Human Potential & Talent Development Engine (ABOS Phase 92)',
  'Human Potential & Talent Development Engine — extends Learning & Training A.36 + Phase 31 with strength-based development, Career Companion support, talent mobility, and empowerment-first privacy. No hidden scoring.',
  'authenticated', 123
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'human-potential-talent-development-blueprint-phase92' and tenant_id is null
);
