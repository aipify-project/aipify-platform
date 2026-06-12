-- Implementation Blueprint Phase 46 — Sales Coach Certification & Field Enablement Engine
-- Extends Sales Expert Operating System (Phase A.95 + Phase 41 + Phase 45). No new tables.

create or replace function public._sccfebp_blueprint_sales_training_pathway()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Six-module sales training pathway — training strengthens confidence; certification reflects genuine competence.',
    'status', 'metadata_scaffold',
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'introduction', 'order', 1, 'label', 'Introduction to Aipify', 'topics', jsonb_build_array('Philosophy', 'Companion model', 'Business value')),
      jsonb_build_object('key', 'ethical_sales', 'order', 2, 'label', 'Ethical Sales Practices', 'topics', jsonb_build_array('Honest representation', 'Customer-first conversations', 'Transparency')),
      jsonb_build_object('key', 'discovery', 'order', 3, 'label', 'Discovery Conversations', 'topics', jsonb_build_array('Active listening', 'Workflow understanding', 'Qualification without pressure')),
      jsonb_build_object('key', 'demonstrations', 'order', 4, 'label', 'Aipify Demonstrations', 'topics', jsonb_build_array('Install-first positioning', 'Demo structure', 'Next steps')),
      jsonb_build_object('key', 'implementation', 'order', 5, 'label', 'Implementation Fundamentals', 'topics', jsonb_build_array('Onboarding scope', 'Customer success handoff', 'Realistic timelines')),
      jsonb_build_object('key', 'customer_success', 'order', 6, 'label', 'Customer Success', 'topics', jsonb_build_array('Renewal conversations', 'Expansion opportunities', 'Long-term partnership'))
    ),
    'foundations_route', '/app/learning-training-engine',
    'certification_route', '/app/certification-achievement-engine'
  );
$$;

create or replace function public._sccfebp_blueprint_sales_simulation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Aipify acts as customer — safe practice scaffold for cold conversations, discovery, demos, objections, and renewals.',
    'scenarios', jsonb_build_array(
      jsonb_build_object('key', 'cold_conversation', 'label', 'Cold conversations', 'note', 'Opening rapport without pressure'),
      jsonb_build_object('key', 'discovery', 'label', 'Discovery', 'note', 'Understand workflow before recommending'),
      jsonb_build_object('key', 'demo', 'label', 'Demonstrations', 'note', 'Walk through install-first value'),
      jsonb_build_object('key', 'objections', 'label', 'Objections', 'note', 'Honest responses — growth not fear'),
      jsonb_build_object('key', 'renewal', 'label', 'Renewals', 'note', 'Relationship-focused renewal conversations')
    ),
    'coach_tab_cross_link', 'Phase 45 roleplay_simulation — complementary practice surfaces',
    'simulation_lab_route', '/app/simulations',
    'boundary', 'Simulation scaffold — not a live AI customer roleplay engine yet'
  );
$$;

create or replace function public._sccfebp_blueprint_telephone_sales_coaching()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Five-step telephone framework — structure not scripts. Curiosity and respect over pressure.',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'intro', 'label', 'Introduction', 'guidance', 'Brief, professional opening — who you are and why you are calling'),
      jsonb_build_object('order', 2, 'key', 'curiosity_discovery', 'label', 'Curiosity and discovery', 'guidance', 'Ask about their workflow — listen more than you speak'),
      jsonb_build_object('order', 3, 'key', 'opportunities', 'label', 'Opportunities', 'guidance', 'Reflect what you heard — where Aipify may help without overpromising'),
      jsonb_build_object('order', 4, 'key', 'demo_invitation', 'label', 'Demo invitation', 'guidance', 'Offer a focused demo or discovery session — optional, never forced'),
      jsonb_build_object('order', 5, 'key', 'next_steps', 'label', 'Next steps', 'guidance', 'Summarize agreements, send follow-up metadata, respect their timeline')
    )
  );
$$;

create or replace function public._sccfebp_blueprint_assessment_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Assessments encourage growth — not fear. Mastery not exclusion.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'product_understanding', 'label', 'Product understanding', 'description', 'Install-first ABOS positioning and module awareness'),
      jsonb_build_object('key', 'communication', 'label', 'Communication', 'description', 'Professional, customer-focused language'),
      jsonb_build_object('key', 'ethical_judgment', 'label', 'Ethical judgment', 'description', 'Honest representation and appropriate expectations'),
      jsonb_build_object('key', 'customer_focus', 'label', 'Customer focus', 'description', 'Discovery-first — understand before recommending'),
      jsonb_build_object('key', 'demo_readiness', 'label', 'Demo readiness', 'description', 'Prepared demonstrations with clear next steps')
    ),
    'tone', 'growth_not_fear'
  );
$$;

create or replace function public._sccfebp_blueprint_certification_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification tiers use official partner terminology — never Affiliate publicly.',
    'tiers', jsonb_build_array(
      jsonb_build_object(
        'key', 'certified_sales_representative',
        'label', 'Certified Sales Representative',
        'public_label', 'Aipify Sales Representative',
        'minimum_score_pct', 75,
        'requirements', jsonb_build_array('Complete training pathway modules 1–3', 'Pass written assessment ≥75%', 'Ethical sales acknowledgment')
      ),
      jsonb_build_object(
        'key', 'sales_expert',
        'label', 'Sales Expert',
        'public_label', 'Aipify Sales Expert',
        'minimum_score_pct', 85,
        'requirements', jsonb_build_array('Complete all six training modules', 'Pass written assessment ≥85%', 'Successful discovery simulation', 'Demo readiness review')
      ),
      jsonb_build_object(
        'key', 'elite_sales_expert',
        'label', 'Elite Sales Expert',
        'public_label', 'Aipify Expert Partner',
        'minimum_score_pct', 95,
        'requirements', jsonb_build_array('Pass written assessment ≥95%', 'Practical excellence review', 'Customer success case metadata', 'Renewal conversation competency')
      )
    ),
    'forbidden_public_terms', jsonb_build_array('Affiliate', 'Referral hustler')
  );
$$;

create or replace function public._sccfebp_blueprint_reassessment_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Retakes allowed — mastery not exclusion. Growth over gatekeeping.',
    'max_attempts_before_review', 3,
    'rules', jsonb_build_array(
      'Unlimited learning access — assessments measure readiness, not worth',
      'After 3 attempts below threshold, review training materials before next attempt',
      'Coaching support available via Coach tab — never punitive',
      'Practical excellence review for Elite tier — human judgment alongside scores'
    ),
    'reassessment_note', 'Material review recommended after max attempts — not permanent exclusion'
  );
$$;

create or replace function public._sccfebp_blueprint_certification_display()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Certification display on profiles, partner directories, and dashboards — dates and identifiers scaffold.',
    'display_surfaces', jsonb_build_array(
      jsonb_build_object('key', 'sales_expert_profile', 'label', 'Sales Expert profile', 'fields', jsonb_build_array('tier_label', 'certified_at', 'identifier')),
      jsonb_build_object('key', 'partner_directory', 'label', 'Partner directory', 'route', '/app/partners', 'fields', jsonb_build_array('tier_label', 'certification_badge')),
      jsonb_build_object('key', 'portal_dashboard', 'label', 'Sales Expert portal', 'route', '/app/sales-expert-engine', 'fields', jsonb_build_array('current_tier', 'next_milestone'))
    ),
    'identifier_format', 'ASE-{year}-{sequence}',
    'privacy_note', 'Display metadata only — no customer PII on certification badges'
  );
$$;

create or replace function public._sccfebp_blueprint_email_enablement_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Email templates with expert details, booking links, and certification status — one-to-one only.',
    'mass_unsolicited_outreach', false,
    'boundary', 'NO mass unsolicited outreach — explicit platform boundary',
    'template_metadata_extensions', jsonb_build_array(
      jsonb_build_object('key', 'expert_display_name', 'label', 'Expert display name', 'source', 'organization_sales_expert_settings'),
      jsonb_build_object('key', 'booking_link', 'label', 'Booking link', 'source', 'organization_sales_expert_settings'),
      jsonb_build_object('key', 'certification_status', 'label', 'Certification status', 'source', 'partner_certification_metadata'),
      jsonb_build_object('key', 'personal_link', 'label', 'Personal link', 'source', 'organization_sales_expert_settings')
    ),
    'email_center_tab', 'Sales Expert OS Email Center tab — extends existing templates, no new mass-send capability'
  );
$$;

create or replace function public._sccfebp_blueprint_implementation_pricing_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Non-binding illustrative examples — Sales Experts set their own consulting pricing.',
    'currency', 'NOK',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'discovery_session', 'label', 'Discovery session', 'illustrative_price', 2500, 'note', '60–90 minute workflow review'),
      jsonb_build_object('key', 'basic_implementation', 'label', 'Basic implementation', 'illustrative_price', 15000, 'note', 'Install, onboarding, initial training'),
      jsonb_build_object('key', 'standard_implementation', 'label', 'Standard implementation', 'illustrative_price', 35000, 'note', 'Multi-module rollout with team training'),
      jsonb_build_object('key', 'enterprise_implementation', 'label', 'Enterprise implementation', 'illustrative_price', 75000, 'note', 'Complex environment — scope defined jointly')
    ),
    'consulting_note', 'Consulting fees: Customer ↔ Sales Expert. Aipify subscription: Customer ↔ Aipify — separate relationships.',
    'non_binding', true
  );
$$;

create or replace function public._sccfebp_blueprint_installation_experience_journey()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Subscribe → welcome → onboarding → install → companion-led training',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'subscribe', 'label', 'Subscribe', 'description', 'Customer selects Aipify plan through Sales Expert link'),
      jsonb_build_object('order', 2, 'key', 'welcome', 'label', 'Welcome', 'description', 'Personal welcome and expectation setting — one-to-one'),
      jsonb_build_object('order', 3, 'key', 'onboarding', 'label', 'Onboarding', 'description', 'Scope, roles, and timeline agreed'),
      jsonb_build_object('order', 4, 'key', 'install', 'label', 'Install', 'description', 'Modern install experience — token-free wizard'),
      jsonb_build_object('order', 5, 'key', 'companion_training', 'label', 'Companion-led training', 'description', 'Five-step enablement — product familiarity at customer pace')
    ),
    'install_route', '/app/install',
    'companion_note', 'Companion nudges support training — never replaces human Sales Expert judgment'
  );
$$;

create or replace function public._sccfebp_blueprint_field_sales_enablement()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion nudges for field sales — in-person demos, sector opportunities, thoughtful follow-ups.',
    'distinct_from', 'Phase 45 field_sales_coaching — Phase 46 emphasizes certification-ready field enablement',
    'nudges', jsonb_build_array(
      jsonb_build_object('key', 'in_person_demo', 'label', 'In-person demo', 'example', 'A local business may appreciate seeing Aipify in context — prepare certification talking points.'),
      jsonb_build_object('key', 'sector_opportunity', 'label', 'Sector opportunity', 'example', 'Several prospects in the same sector may benefit from a focused industry conversation.'),
      jsonb_build_object('key', 'certified_follow_up', 'label', 'Certified follow-up', 'example', 'Follow up with helpful KC articles — reference your certification tier professionally.')
    ),
    'coach_tab_cross_link', 'Phase 45 Coach tab — daily coaching complements field enablement'
  );
$$;

create or replace function public._sccfebp_blueprint_sales_performance_culture()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Performance culture emphasizes customer satisfaction, sustainable growth, implementation excellence, and professional development — not revenue comparison.',
    'pillars', jsonb_build_array(
      jsonb_build_object('key', 'customer_satisfaction', 'label', 'Customer satisfaction', 'description', 'Successful implementations and renewals matter more than volume'),
      jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth', 'description', 'Steady pipeline development — Self Love A.76 boundaries respected'),
      jsonb_build_object('key', 'implementation_excellence', 'label', 'Implementation excellence', 'description', 'Quality onboarding and handoff — certified competency'),
      jsonb_build_object('key', 'professional_development', 'label', 'Professional development', 'description', 'Training, certification, and coaching — growth not fear')
    ),
    'avoid', jsonb_build_array('Revenue leaderboards as primary motivation', 'Comparing experts destructively', 'Pressure tactics')
  );
$$;

create or replace function public._sccfebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification and field work should strengthen confidence — never imply burnout is success.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Retaking an assessment is learning — not failure.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Sustainable field pace builds stronger customer relationships than intensity alone.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences certification tone — metadata and encouragement only.'
  );
$$;

create or replace function public._sccfebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent assessment criteria, honest simulation scaffolds, and clear certification boundaries.',
    'experts_should_understand', jsonb_build_array(
      'Certification tiers and score thresholds are documented — assessments scaffold until fully live',
      'Simulation engine is metadata scaffold — Aipify acts as customer in future practice mode',
      'Email enablement extends one-to-one templates only — mass outreach explicitly not supported',
      'Certification summary derives from partner program metadata when available',
      'Implementation pricing examples are non-binding — Sales Experts set own rates'
    ),
    'metadata_only', true,
    'insights_generated_from', jsonb_build_array('partners.certification_level', 'organization_sales_expert_settings.metadata', '_sccfebp_certification_summary')
  );
$$;

create or replace function public._sccfebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify uses Sales Coach certification pathway internally first — Sales Reps and Experts validate training modules and assessment tone',
      'focus', jsonb_build_array('Training module quality', 'Simulation scaffold usefulness', 'Certification tier clarity', 'Field enablement nudges')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts complete certification pathway before broader partner rollout',
      'note', 'Dogfooding ensures certification never feels punitive'
    )
  );
$$;

create or replace function public._sccfebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Competent professionals build trust — certification should mean genuine readiness to help organizations.',
    'Training strengthens confidence; assessment encourages growth — never fear.',
    'Field enablement supports in-person excellence — at a sustainable, respectful pace.'
  );
$$;

create or replace function public._sccfebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'certification_achievement', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine', 'note', 'Achievement milestones and certification pathways'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'note', 'Foundations and sales training content'),
    jsonb_build_object('key', 'partner_certification', 'label', 'Partner Certification Phase 91', 'route', '/app/partners', 'note', 'Partner directory and certification workflow'),
    jsonb_build_object('key', 'coach_enablement', 'label', 'Coach & Enablement Phase 45', 'route', '/app/sales-expert-engine', 'note', 'Coach tab — daily coaching on same dashboard'),
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance & Recognition Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Performance tab — milestones and Recognition Roses'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition experiences — cross-link, do not duplicate'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing and recovery after setbacks')
  );
$$;

create or replace function public._sccfebp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Coach & Enablement Phase 45 (daily coaching) and Performance & Recognition Phase 41 (milestones) — Phase 46 is certification pathway, simulation scaffold, field enablement, and email template metadata within /app/sales-expert-engine Certification & Field Enablement tab. Cross-links A.37, A.36, Phase 91 — never duplicates.';
$$;

create or replace function public._sccfebp_certification_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_partner record;
  v_metadata jsonb;
  v_tier text;
begin
  select p.certification_level, p.status, p.partner_name, p.created_at
    into v_partner
  from public.partners p
  where p.submitted_by_organization_id = p_organization_id
  order by p.created_at desc
  limit 1;

  select s.metadata into v_metadata
  from public.organization_sales_expert_settings s
  where s.organization_id = p_organization_id;

  v_tier := coalesce(
    v_metadata->>'sales_certification_tier',
    v_partner.certification_level
  );

  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'current_tier_key', v_tier,
    'current_tier_label', case
      when v_tier is not null then public._mpfe_tier_label(v_tier)
      else 'Training in progress'
    end,
    'partner_status', v_partner.status,
    'partner_name_metadata', case when v_partner.partner_name is not null then left(v_partner.partner_name, 80) else null end,
    'assessment_attempts_used', coalesce((v_metadata->>'assessment_attempts_used')::int, 0),
    'max_attempts_before_review', 3,
    'attempts_remaining', greatest(0, 3 - coalesce((v_metadata->>'assessment_attempts_used')::int, 0)),
    'next_recommended_module', coalesce(v_metadata->>'next_training_module', 'introduction'),
    'certification_route', '/app/certification-achievement-engine',
    'privacy_note', 'Summary from partner certification metadata and settings — no customer PII.'
  );
exception when others then
  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'current_tier_label', 'Training in progress',
    'privacy_note', 'No certification data yet — complete training pathway to begin.'
  );
end; $$;

create or replace function public._sccfebp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
begin
  v_summary := public._sccfebp_certification_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'training_pathway',
      'label', 'Six-module sales training pathway documented',
      'met', jsonb_array_length(public._sccfebp_blueprint_sales_training_pathway()->'modules') = 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'simulation_engine',
      'label', 'Sales simulation engine scaffolded',
      'met', jsonb_array_length(public._sccfebp_blueprint_sales_simulation_engine()->'scenarios') >= 5,
      'note', 'Metadata scaffold — live simulation pending'
    ),
    jsonb_build_object(
      'key', 'certification_tiers',
      'label', 'Certification tier requirements documented',
      'met', jsonb_array_length(public._sccfebp_blueprint_certification_requirements()->'tiers') = 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'reassessment',
      'label', 'Reassessment principles — mastery not exclusion',
      'met', (public._sccfebp_blueprint_reassessment_principles()->>'max_attempts_before_review')::int = 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'email_boundary',
      'label', 'Email enablement excludes mass unsolicited outreach',
      'met', (public._sccfebp_blueprint_email_enablement_center()->>'mass_unsolicited_outreach')::boolean = false,
      'note', null
    ),
    jsonb_build_object(
      'key', 'installation_journey',
      'label', 'Installation experience journey defined',
      'met', jsonb_array_length(public._sccfebp_blueprint_installation_experience_journey()->'steps') = 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'field_enablement',
      'label', 'Field sales enablement nudges scaffolded',
      'met', jsonb_array_length(public._sccfebp_blueprint_field_sales_enablement()->'nudges') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection for sustainable certification pacing',
      'met', (public._sccfebp_blueprint_self_love_connection()->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains certification scaffolds',
      'met', jsonb_array_length(public._sccfebp_blueprint_trust_connection()->'experts_should_understand') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dogfooding_ready',
      'label', 'Dogfooding scaffold for Aipify Group Sales Coach',
      'met', (public._sccfebp_blueprint_dogfooding()->'aipify_group'->>'role') is not null,
      'note', case when (v_summary->>'current_tier_key') is null
        then 'Complete training modules to populate certification summary.'
        else null end
    )
  );
end; $$;

-- Extend dashboard — preserve ALL A.95 + Phase 41 + Phase 45 fields; append Phase 46
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
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);

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
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._sccfebp_blueprint_sales_training_pathway() to authenticated;
grant execute on function public._sccfebp_blueprint_sales_simulation_engine() to authenticated;
grant execute on function public._sccfebp_blueprint_telephone_sales_coaching() to authenticated;
grant execute on function public._sccfebp_blueprint_assessment_principles() to authenticated;
grant execute on function public._sccfebp_blueprint_certification_requirements() to authenticated;
grant execute on function public._sccfebp_blueprint_reassessment_principles() to authenticated;
grant execute on function public._sccfebp_blueprint_certification_display() to authenticated;
grant execute on function public._sccfebp_blueprint_email_enablement_center() to authenticated;
grant execute on function public._sccfebp_blueprint_implementation_pricing_guidance() to authenticated;
grant execute on function public._sccfebp_blueprint_installation_experience_journey() to authenticated;
grant execute on function public._sccfebp_blueprint_field_sales_enablement() to authenticated;
grant execute on function public._sccfebp_blueprint_sales_performance_culture() to authenticated;
grant execute on function public._sccfebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._sccfebp_blueprint_trust_connection() to authenticated;
grant execute on function public._sccfebp_blueprint_dogfooding() to authenticated;
grant execute on function public._sccfebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._sccfebp_blueprint_integration_links() to authenticated;
grant execute on function public._sccfebp_certification_summary(uuid) to authenticated;
grant execute on function public._sccfebp_blueprint_success_criteria(uuid) to authenticated;
