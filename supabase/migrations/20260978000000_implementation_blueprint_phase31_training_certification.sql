-- Implementation Blueprint Phase 31 — Training & Certification Engine
-- Spec alignment extending Learning & Training Engine (Phase A.36). No new tables.

create or replace function public._tcbp_blueprint_training_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'self_paced', 'label', 'Self-paced learning', 'description', 'Users progress at their own pace with clear modules and estimated durations'),
    jsonb_build_object('key', 'guided_onboarding', 'label', 'Guided onboarding journeys', 'description', 'Integrated with Customer Onboarding A.10 first-login guidance'),
    jsonb_build_object('key', 'role_based_paths', 'label', 'Role-based training paths', 'description', 'Owner, administrator, support, manager, and viewer paths seeded per organization'),
    jsonb_build_object('key', 'interactive_experiences', 'label', 'Interactive learning experiences', 'description', 'Walkthroughs, checklists, articles, and knowledge checks'),
    jsonb_build_object('key', 'companion_education', 'label', 'Companion-assisted education', 'description', 'Calm guidance — encourage growth, not perfection'),
    jsonb_build_object('key', 'certification_opportunities', 'label', 'Certification opportunities', 'description', 'Cross-link Certification & Achievement Engine A.37 for competence validation')
  );
$$;

create or replace function public._tcbp_blueprint_learning_paths()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'aipify_foundations',
      'title', 'Aipify Foundations',
      'designed_for', jsonb_build_array('All users'),
      'topics', jsonb_build_array('What Aipify is', 'Companion principles', 'Core navigation', 'Daily workflows'),
      'mapped_path_keys', jsonb_build_array('onboarding_getting_started'),
      'kc_route', '/app/knowledge-center-engine'
    ),
    jsonb_build_object(
      'key', 'support_specialist_certification',
      'title', 'Support Specialist Certification',
      'designed_for', jsonb_build_array('Support teams'),
      'topics', jsonb_build_array('Support Engine', 'Knowledge Center usage', 'Escalation workflows', 'Customer communication'),
      'mapped_path_keys', jsonb_build_array('support_ai_basics', 'support_knowledge_center'),
      'certification_route', '/app/certification-achievement-engine'
    ),
    jsonb_build_object(
      'key', 'executive_companion_certification',
      'title', 'Executive Companion Certification',
      'designed_for', jsonb_build_array('Leaders'),
      'topics', jsonb_build_array('Executive Insights', 'Strategic Intelligence', 'Operations Center', 'Decision support'),
      'mapped_path_keys', jsonb_build_array('manager_analytics', 'manager_reporting'),
      'certification_route', '/app/certification-achievement-engine'
    ),
    jsonb_build_object(
      'key', 'administrator_certification',
      'title', 'Administrator Certification',
      'designed_for', jsonb_build_array('Administrators'),
      'topics', jsonb_build_array('Workspaces', 'Permissions', 'Governance', 'Integrations', 'Quality Guardian'),
      'mapped_path_keys', jsonb_build_array('admin_operations', 'admin_approvals', 'admin_integrations', 'owner_governance'),
      'certification_route', '/app/certification-achievement-engine'
    )
  );
$$;

create or replace function public._tcbp_blueprint_learning_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Interactive walkthroughs',
    'Scenario-based learning',
    'Knowledge checks',
    'Companion guidance',
    'Simulation exercises'
  );
$$;

create or replace function public._tcbp_blueprint_certification_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certifications should represent meaningful competence — not participation alone.',
    'requirements', jsonb_build_array(
      'Completion requirements — required modules and assessments passed',
      'Knowledge assessments — passing scores on training_assessments',
      'Practical demonstrations — walkthrough and checklist completion tracked as metadata',
      'Recertification opportunities — expiry and renewal via Certification A.37'
    ),
    'certification_engine_route', '/app/certification-achievement-engine'
  );
$$;

create or replace function public._tcbp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('emoji', '🌹', 'key', 'excellent_progress', 'example', 'You are making excellent progress.'),
    jsonb_build_object('emoji', '🔔', 'key', 'learning_milestone', 'example', 'A learning milestone has been achieved.'),
    jsonb_build_object('emoji', '🦉', 'key', 'practice_easier', 'example', 'This concept becomes easier with practice.'),
    jsonb_build_object('emoji', '❤️', 'key', 'mastery_over_time', 'example', 'Remember that mastery develops over time.')
  );
$$;

create or replace function public._tcbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning should remain sustainable — encourage patience, normalize mistakes, celebrate progress, reduce fear of failure.',
    'practices', jsonb_build_array(
      'Encourage patience — no guilt for overdue or incomplete paths',
      'Normalize mistakes — knowledge checks allow retakes',
      'Celebrate progress — milestones without perfection pressure',
      'Reduce fear of failure — companion tone supports, never judges'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences learning tone — A.36 stores progress metadata, not wellbeing content.'
  );
$$;

create or replace function public._tcbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand what certifications represent, how learning progress is measured, which competencies have been validated, and what remains optional.',
    'organizations_should_understand', jsonb_build_array(
      'What certifications represent — competence validated through requirements, not automatic badges',
      'How learning progress is measured — completion percentages and assessment scores only',
      'Which competencies have been validated — certificate status from A.37',
      'What remains optional — self-paced paths and non-required modules'
    ),
    'metadata_only', true,
    'transparency_note', 'Team readiness aggregates counts only — no raw training content or PII.'
  );
$$;

create or replace function public._tcbp_blueprint_knowledge_center_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Training content should integrate with FAQs, procedures, organizational knowledge, best practices, and industry guidance.',
    'integrations', jsonb_build_array(
      'KC article references via content_ref on learning_paths and training_modules',
      'FAQ cross-links under content/knowledge/aipify/learning-training-engine/',
      'Organizational knowledge from Knowledge Center Engine A.5',
      'Best practices and industry guidance via Business Packs and KC categories'
    ),
    'kc_route', '/app/knowledge-center-engine'
  );
$$;

create or replace function public._tcbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates training experiences internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Employee onboarding', 'Product understanding', 'Support readiness', 'Executive enablement')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Commerce support training', 'Administrator certification', 'Team readiness for launch')
    )
  );
$$;

create or replace function public._tcbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'certification_a37', 'label', 'Certification & Achievement (A.37)', 'route', '/app/certification-achievement-engine', 'note', 'Certificates, badges, team readiness — built on A.36 completion'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine (Phase 65/29)', 'route', '/app/learning', 'note', 'Operational learning memory — distinct from user education'),
    jsonb_build_object('key', 'customer_onboarding', 'label', 'Customer Onboarding (A.10)', 'route', '/app/customer-onboarding-engine', 'note', 'Ten-step onboarding journey — Learn stage integration'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'FAQs, procedures, organizational knowledge'),
    jsonb_build_object('key', 'academy', 'label', 'Academy Engine', 'route', '/app/academy-engine', 'note', 'Platform academy scaffold — distinct from tenant training paths'),
    jsonb_build_object('key', 'blueprint_phase28', 'label', 'Onboarding & Success (Blueprint Phase 28)', 'route', '/app/customer-onboarding-engine', 'note', 'Early success moments complement training milestones'),
    jsonb_build_object('key', 'change_management', 'label', 'Change Management (A.47)', 'route', '/app/change-management-engine', 'note', 'Training hooks via assign_change_training()')
  );
$$;

create or replace function public._tcbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We know how to succeed with this.',
    'Learning transforms capability into impact.',
    'People feel empowered rather than overwhelmed.',
    'Teams grow together through achievable paths.',
    'Confidence accelerates adoption.'
  );
$$;

create or replace function public._tcbp_engagement_summary(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_assigned int := 0;
  v_completed int := 0;
  v_in_progress int := 0;
  v_overdue int := 0;
  v_active_paths int := 0;
  v_assessments int := 0;
  v_org_completions int := 0;
  v_org_progress int := 0;
  v_cert_definitions int := 0;
  v_active_certs int := 0;
  v_user_certs int := 0;
  v_badges int := 0;
begin
  select
    count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'in_progress'),
    count(*) filter (where due_at < now() and status not in ('completed', 'expired'))
  into v_assigned, v_completed, v_in_progress, v_overdue
  from public.user_learning_progress
  where organization_id = p_organization_id and user_id = p_user_id;

  select count(*) into v_active_paths
  from public.learning_paths
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_assessments
  from public.training_assessments
  where organization_id = p_organization_id;

  select
    count(*) filter (where status = 'completed'),
    count(*)
  into v_org_completions, v_org_progress
  from public.user_learning_progress
  where organization_id = p_organization_id;

  select count(*) into v_cert_definitions
  from public.certification_definitions
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_active_certs
  from public.user_certifications
  where organization_id = p_organization_id and certificate_status = 'active';

  select count(*) into v_user_certs
  from public.user_certifications
  where organization_id = p_organization_id and user_id = p_user_id and certificate_status = 'active';

  select count(*) into v_badges
  from public.user_achievement_badges
  where organization_id = p_organization_id and user_id = p_user_id;

  return jsonb_build_object(
    'user_assigned_paths', v_assigned,
    'user_completed_paths', v_completed,
    'user_in_progress_paths', v_in_progress,
    'user_overdue_paths', v_overdue,
    'active_learning_paths', v_active_paths,
    'training_assessments', v_assessments,
    'org_completed_progress_records', v_org_completions,
    'org_total_progress_records', v_org_progress,
    'active_certification_programs', v_cert_definitions,
    'org_active_certificates', v_active_certs,
    'user_active_certificates', v_user_certs,
    'user_badges_awarded', v_badges,
    'privacy_note', 'Counts only — no training content, assessment answers, or PII.'
  );
end; $$;

create or replace function public._tcbp_blueprint_success_criteria(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_paths int := 0;
  v_user_assigned int := 0;
  v_user_completed int := 0;
  v_org_completions int := 0;
  v_cert_programs int := 0;
  v_assessments int := 0;
begin
  v_engagement := public._tcbp_engagement_summary(p_organization_id, p_user_id);
  v_active_paths := coalesce((v_engagement->>'active_learning_paths')::int, 0);
  v_user_assigned := coalesce((v_engagement->>'user_assigned_paths')::int, 0);
  v_user_completed := coalesce((v_engagement->>'user_completed_paths')::int, 0);
  v_org_completions := coalesce((v_engagement->>'org_completed_progress_records')::int, 0);
  v_cert_programs := coalesce((v_engagement->>'active_certification_programs')::int, 0);
  v_assessments := coalesce((v_engagement->>'training_assessments')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'onboarding_success',
      'label', 'Organizations onboard more successfully — active paths and user assignments',
      'met', v_active_paths >= 3 and (v_user_assigned > 0 or v_org_completions > 0),
      'note', case when v_active_paths < 3 then 'Seed learning paths via _lte_seed_org_content.' else null end
    ),
    jsonb_build_object(
      'key', 'learning_confidence',
      'label', 'Learning confidence increases — completions and assessments available',
      'met', v_user_completed > 0 or v_assessments > 0,
      'note', case when v_user_completed = 0 and v_assessments = 0 then 'Complete a path module or pass a knowledge check.' else null end
    ),
    jsonb_build_object(
      'key', 'certification_value',
      'label', 'Certification pathways feel valuable — programs defined or cross-linked',
      'met', v_cert_programs > 0 or jsonb_array_length(public._tcbp_blueprint_learning_paths()) >= 4,
      'note', 'Blueprint paths map to A.37 certification programs at /app/certification-achievement-engine.'
    ),
    jsonb_build_object(
      'key', 'adoption_accelerates',
      'label', 'Adoption accelerates — progress records accumulating',
      'met', v_org_completions > 0 or v_user_assigned > 0,
      'note', null
    ),
    jsonb_build_object(
      'key', 'long_term_success',
      'label', 'Long-term customer success improves — team readiness and paths documented',
      'met', v_active_paths >= 5,
      'note', 'Role-based paths for owner, admin, support, manager, and onboarding.'
    ),
    jsonb_build_object(
      'key', 'training_objectives',
      'label', 'Training objectives documented — self-paced through certification',
      'met', jsonb_array_length(public._tcbp_blueprint_training_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'learning_paths',
      'label', 'Blueprint learning paths documented — Foundations through Administrator',
      'met', jsonb_array_length(public._tcbp_blueprint_learning_paths()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable learning, patience, progress',
      'met', true,
      'note', 'Self Love is a principle — mastery develops over time.'
    ),
    jsonb_build_object(
      'key', 'kc_connection',
      'label', 'Knowledge Center connection — training integrates with KC content',
      'met', (public._tcbp_blueprint_knowledge_center_connection()->>'kc_route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Learning Engine, Certification A.37, Academy',
      'met', jsonb_array_length(public._tcbp_blueprint_integration_links()) >= 6,
      'note', 'Extend related engines — do not duplicate operational learning memory.'
    )
  );
end; $$;

create or replace function public._tcbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Learning Engine Phase 65/29 /app/learning (operational customer_learning_memory), Certification & Achievement A.37 /app/certification-achievement-engine (certificates and badges — cross-linked), Academy Engine /app/academy-engine (platform academy), and Blueprint Phase 23 learning adaptation (extends Phase 65 only). Phase A.36 user education paths, progress, assessments, and team readiness preserved.';
$$;

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
    'blueprint_success_criteria', public._tcbp_blueprint_success_criteria(v_org_id, v_user_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

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
    'route', '/app/learning-training-engine'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._tcbp_blueprint_training_objectives() to authenticated;
grant execute on function public._tcbp_blueprint_learning_paths() to authenticated;
grant execute on function public._tcbp_blueprint_learning_experiences() to authenticated;
grant execute on function public._tcbp_blueprint_certification_principles() to authenticated;
grant execute on function public._tcbp_blueprint_companion_examples() to authenticated;
grant execute on function public._tcbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._tcbp_blueprint_trust_connection() to authenticated;
grant execute on function public._tcbp_blueprint_knowledge_center_connection() to authenticated;
grant execute on function public._tcbp_blueprint_dogfooding() to authenticated;
grant execute on function public._tcbp_blueprint_integration_links() to authenticated;
grant execute on function public._tcbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._tcbp_engagement_summary(uuid, uuid) to authenticated;
grant execute on function public._tcbp_blueprint_success_criteria(uuid, uuid) to authenticated;
grant execute on function public._tcbp_distinction_note() to authenticated;
