-- Implementation Blueprint Phase 45 — Sales Coach & Enablement Engine
-- Extends Sales Expert Operating System (Phase A.95 + Phase 41). No new tables.

create or replace function public._scebp_blueprint_companion_roles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'mentor', 'emoji', '🌹', 'label', 'Mentor', 'description', 'Patient guidance and professional development — celebrates progress'),
    jsonb_build_object('key', 'strategist', 'emoji', '🦉', 'label', 'Strategist', 'description', 'Pipeline priorities, opportunity focus, and thoughtful planning'),
    jsonb_build_object('key', 'motivator', 'emoji', '🔔', 'label', 'Motivator', 'description', 'Encouragement and momentum — never punitive or shaming'),
    jsonb_build_object('key', 'companion', 'emoji', '❤️', 'label', 'Companion', 'description', 'Supportive presence through setbacks and busy seasons'),
    jsonb_build_object('key', 'performance_advisor', 'emoji', '📈', 'label', 'Performance advisor', 'description', 'Transparent metrics and development opportunities — strengths first')
  );
$$;

create or replace function public._scebp_blueprint_coach_dashboard_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'monthly_commission_overview', 'label', 'Monthly commission overview'),
    jsonb_build_object('key', 'new_customers', 'label', 'New customers'),
    jsonb_build_object('key', 'renewal_stats', 'label', 'Renewal stats'),
    jsonb_build_object('key', 'conversion_rates', 'label', 'Conversion rates'),
    jsonb_build_object('key', 'upcoming_follow_ups', 'label', 'Upcoming follow-ups'),
    jsonb_build_object('key', 'scheduled_demos', 'label', 'Scheduled demos'),
    jsonb_build_object('key', 'personal_goals', 'label', 'Personal goals'),
    jsonb_build_object('key', 'suggested_next_actions', 'label', 'Suggested next actions')
  );
$$;

create or replace function public._scebp_blueprint_daily_briefing_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'opportunities', 'example', 'You have opportunities that may benefit from a thoughtful follow-up this week.'),
    jsonb_build_object('key', 'renewals', 'example', 'A few customer relationships may be ready for a renewal conversation.'),
    jsonb_build_object('key', 'activity_comparison', 'example', 'Your outreach this week is steady — consistency often matters more than intensity.'),
    jsonb_build_object('key', 'consistency', 'example', 'Small, reliable steps forward often build the strongest partnerships.')
  );
$$;

create or replace function public._scebp_blueprint_activity_recommendations_scaffold()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'contact_local_businesses', 'label', 'Contact local businesses', 'tone', 'supportive'),
    jsonb_build_object('key', 'follow_ups', 'label', 'Thoughtful follow-ups', 'tone', 'supportive'),
    jsonb_build_object('key', 'schedule_demo', 'label', 'Schedule a demo', 'tone', 'supportive'),
    jsonb_build_object('key', 'revisit_inactive', 'label', 'Revisit an inactive opportunity', 'tone', 'supportive'),
    jsonb_build_object('key', 'ask_introductions', 'label', 'Ask for introductions', 'tone', 'supportive')
  );
$$;

create or replace function public._scebp_blueprint_field_sales_coaching()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Field sales coaching supports personal visits, sector demos, and in-person meetings — gentle nudges, never pressure.',
    'nudges', jsonb_build_array(
      jsonb_build_object('key', 'personal_visit', 'label', 'Personal visit', 'example', 'A local business may appreciate an in-person conversation.'),
      jsonb_build_object('key', 'sector_demo', 'label', 'Sector demo', 'example', 'Consider a sector-focused demo when several prospects share similar needs.'),
      jsonb_build_object('key', 'in_person_meeting', 'label', 'In-person meeting', 'example', 'Face-to-face meetings can strengthen trust when timing feels right.')
    )
  );
$$;

create or replace function public._scebp_blueprint_demonstration_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'checklists', jsonb_build_array(
      'Confirm audience roles and priorities',
      'Review industry talking points',
      'Prepare discovery questions',
      'Define recommended next steps before closing'
    ),
    'industry_talking_points', jsonb_build_array(
      jsonb_build_object('sector', 'Commerce', 'point', 'Operational efficiency and customer experience without replacing existing systems.'),
      jsonb_build_object('sector', 'Professional services', 'point', 'Install-first AI that works inside existing workflows.'),
      jsonb_build_object('sector', 'Operations', 'point', 'Transparent approvals, metadata-first learning, and human control.')
    ),
    'discovery_questions', jsonb_build_array(
      'What does a typical week look like for your team?',
      'Where do repetitive tasks slow people down?',
      'How do you prefer to evaluate new operational tools?',
      'What would success look like in the first 90 days?'
    ),
    'recommended_next_steps', jsonb_build_array(
      'Summarize what you heard',
      'Offer a focused follow-up or pilot scope',
      'Share relevant KC articles — metadata only',
      'Schedule onboarding or implementation conversation'
    )
  );
$$;

create or replace function public._scebp_blueprint_objection_handling_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'objection', 'We do not have time',
      'response', 'That is understandable. Many teams start with a short discovery conversation to see if Aipify fits their workflow — no commitment required.',
      'tone', 'honest_professional'
    ),
    jsonb_build_object(
      'objection', 'We already use another system',
      'response', 'Aipify is designed to work inside your existing systems — install-first, not a replacement admin panel. We can explore where augmentation helps most.',
      'tone', 'customer_focused'
    ),
    jsonb_build_object(
      'objection', 'We cannot afford it',
      'response', 'Budget matters. We can review plan options and the value of reducing operational friction — you decide what makes sense for your organization.',
      'tone', 'honest_professional'
    ),
    jsonb_build_object(
      'objection', 'We need to think about it',
      'response', 'Of course. I am happy to send a brief summary and remain available when timing feels right — no pressure.',
      'tone', 'customer_focused'
    )
  );
$$;

create or replace function public._scebp_blueprint_communication_coaching()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'email', 'label', 'Email', 'guidance', 'One-to-one, professional tone — personalize placeholders, never mass campaigns.'),
      jsonb_build_object('key', 'meeting_prep', 'label', 'Meeting prep', 'guidance', 'Review customer metadata, goals, and discovery questions before each conversation.'),
      jsonb_build_object('key', 'discovery', 'label', 'Discovery', 'guidance', 'Listen first — understand workflow before recommending modules.'),
      jsonb_build_object('key', 'follow_up', 'label', 'Follow-up', 'guidance', 'Timely, helpful follow-ups that respect the customer''s pace.'),
      jsonb_build_object('key', 'proposal', 'label', 'Proposal', 'guidance', 'Clear scope, transparent pricing for consulting, separate subscription relationship with Aipify.')
    )
  );
$$;

create or replace function public._scebp_blueprint_personal_performance_insights_scaffold()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strengths and opportunities — encourage development, never shame.',
    'strength_examples', jsonb_build_array(
      'Consistent follow-up cadence',
      'Strong onboarding completion rates',
      'Thoughtful discovery conversations'
    ),
    'opportunity_examples', jsonb_build_array(
      'Re-engage dormant opportunities when timing allows',
      'Schedule demos for prospects in proposal stage',
      'Deepen product knowledge via Training Center'
    )
  );
$$;

create or replace function public._scebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Healthy boundaries, sustainable pacing, and recovery after setbacks — sales coaching never implies burnout is success.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Recovery after a quiet week is part of sustainable sales — not a failure.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Protect focus time; quality conversations matter more than volume alone.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences coaching tone — Coach & Enablement stores metadata and suggestions only.'
  );
$$;

create or replace function public._scebp_blueprint_bell_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Coach-specific Bell Moments celebrate early wins — cross-link Phase 41 _sprbp_* milestones where appropriate.',
    'moments', jsonb_build_array(
      jsonb_build_object('emoji', '🔔', 'key', 'first_demo', 'label', 'First demo', 'example', 'Your first demo is a meaningful step — preparation matters.'),
      jsonb_build_object('emoji', '🔔', 'key', 'first_customer', 'label', 'First customer', 'example', 'You helped an organization begin their Aipify journey.', 'phase41_key', 'first_customer'),
      jsonb_build_object('emoji', '🔔', 'key', 'first_renewal', 'label', 'First renewal', 'example', 'A renewal reflects trust built over time.', 'phase41_key', 'first_renewal'),
      jsonb_build_object('emoji', '🌹', 'key', 'first_enterprise', 'label', 'First enterprise opportunity', 'example', 'Enterprise conversations deserve thoughtful preparation.', 'phase41_key', 'first_enterprise'),
      jsonb_build_object('emoji', '🌹', 'key', 'first_year', 'label', 'First year', 'example', 'A year of professional partnership — celebrate consistency.', 'phase41_key', 'first_year')
    ),
    'phase41_cross_link', 'Performance & Recognition tab — _sprbp_blueprint_bell_moments() for team celebrations'
  );
$$;

create or replace function public._scebp_blueprint_sales_training_integration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'training_tab_route', '/app/sales-expert-engine',
    'training_tab_note', 'Sales Expert OS Training Center tab',
    'foundations_route', '/app/learning-training-engine',
    'foundations_label', 'Learning & Training A.36',
    'certification_route', '/app/certification-achievement-engine',
    'certification_label', 'Certification & Achievement A.37',
    'principle', 'Coach links existing training surfaces — does not duplicate Learning Engine content.'
  );
$$;

create or replace function public._scebp_blueprint_roleplay_simulation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'scenarios', jsonb_build_array(
      jsonb_build_object('key', 'practice_conversations', 'label', 'Practice conversations', 'note', 'Supportive roleplay — discovery and rapport'),
      jsonb_build_object('key', 'demo_prep', 'label', 'Demo prep', 'note', 'Walk through demonstration checklist'),
      jsonb_build_object('key', 'objection_scenarios', 'label', 'Objection scenarios', 'note', 'Honest responses from objection library')
    ),
    'simulation_lab_route', '/app/simulations',
    'simulation_lab_note', 'Cross-link Simulation Lab for decision practice — distinct from sales roleplay scaffold'
  );
$$;

create or replace function public._scebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent metrics, optional suggestions, and clear explanation of how insights are generated.',
    'experts_should_understand', jsonb_build_array(
      'Coach summary derives from tenant-scoped customer, opportunity, commission, and follow-up metadata',
      'Activity recommendations are supportive suggestions — never mandatory or punitive',
      'Performance insights highlight strengths and opportunities without ranking shame',
      'Daily briefing uses counts and pipeline stages only — no email or chat content'
    ),
    'metadata_only', true,
    'insights_generated_from', jsonb_build_array('_seos_engagement_summary', '_sprbp_milestone_progress', 'organization_sales_expert_opportunities')
  );
$$;

create or replace function public._scebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Internal Sales Reps and Experts validate coaching tone, briefing quality, and enablement scaffolds',
      'focus', jsonb_build_array('Supportive language', 'Demo guidance', 'Objection library quality', 'Sustainable pacing')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts refine coach recommendations before broader rollout',
      'note', 'Dogfooding ensures coaching never sounds punitive'
    )
  );
$$;

create or replace function public._scebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Sales Experts should feel equipped, respected, and supported — not judged.',
    'Coaching strengthens confidence; it does not replace human judgment.',
    'Every conversation is an opportunity to help an organization work smarter — at a sustainable pace.'
  );
$$;

create or replace function public._scebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Healthy boundaries and recovery after setbacks'),
    jsonb_build_object('key', 'certification', 'label', 'Certification A.37', 'route', '/app/certification-achievement-engine', 'note', 'Certification pathways and achievement milestones'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'note', 'Foundations and sales training content'),
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance & Recognition Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Bell moments overlap — reference Phase 41 tab, do not duplicate'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation Lab Phase 22', 'route', '/app/simulations', 'note', 'Decision practice — roleplay scaffold distinct'),
    jsonb_build_object('key', 'sales_expert_portal', 'label', 'Sales Expert Portal', 'route', '/app/sales-expert-engine', 'note', 'Coach & Enablement tab on Sales Expert OS A.95')
  );
$$;

create or replace function public._scebp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Performance & Recognition Phase 41 (milestones and leaderboards) — Phase 45 is daily coaching, enablement, demonstration guidance, and supportive activity recommendations within /app/sales-expert-engine Coach tab. Cross-links Phase 41 bell moments; never punitive or shaming.';
$$;

create or replace function public._scebp_coach_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_milestones jsonb;
  v_new_customers int := 0;
  v_renewals int := 0;
  v_demos int := 0;
  v_follow_ups int := 0;
  v_conversion_pct numeric;
  v_total int := 0;
  v_won int := 0;
begin
  v_engagement := public._seos_engagement_summary(p_organization_id);
  v_milestones := public._sprbp_milestone_progress(p_organization_id);

  select count(*) filter (where created_at >= date_trunc('month', now())),
         count(*) filter (where subscription_status = 'active' and updated_at > created_at + interval '30 days')
    into v_new_customers, v_renewals
  from public.organization_sales_expert_customers
  where organization_id = p_organization_id;

  select count(*) into v_demos
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id
    and status = 'open'
    and pipeline_stage in ('demo', 'proposal', 'negotiation');

  v_follow_ups := coalesce((v_engagement->>'upcoming_follow_ups')::int, 0);

  select count(*), count(*) filter (where status = 'won')
    into v_total, v_won
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id;

  v_conversion_pct := case when v_total > 0 then round((v_won::numeric / v_total) * 100, 1) else null end;

  return jsonb_build_object(
    'monthly_commissions_pending', v_engagement->'monthly_commissions_pending',
    'monthly_commissions_paid', v_engagement->'monthly_commissions_paid',
    'forecasted_commissions', v_engagement->'forecasted_commissions',
    'new_customers_this_month', v_new_customers,
    'renewal_count', v_renewals,
    'retention_rate_pct', v_milestones->'retention_rate_pct',
    'conversion_rate_pct', v_conversion_pct,
    'upcoming_follow_ups', v_follow_ups,
    'scheduled_demos', v_demos,
    'active_opportunities', v_engagement->'active_opportunities',
    'active_customers', v_milestones->'active_customers',
    'suggested_next_actions_count', least(5, v_follow_ups + v_demos),
    'privacy_note', 'Counts from tenant-scoped customer, opportunity, and commission metadata only.'
  );
end; $$;

create or replace function public._scebp_daily_briefing(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_opps int := 0;
  v_follow_ups int := 0;
  v_new_30d int := 0;
  v_items jsonb := '[]'::jsonb;
begin
  v_summary := public._scebp_coach_summary(p_organization_id);
  v_opps := coalesce((v_summary->>'active_opportunities')::int, 0);
  v_follow_ups := coalesce((v_summary->>'upcoming_follow_ups')::int, 0);
  v_new_30d := coalesce((public._sprbp_milestone_progress(p_organization_id)->>'new_customers_30d')::int, 0);

  if v_opps > 0 then
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'key', 'opportunities',
      'message', format('You have %s open opportunit%s that may benefit from a thoughtful follow-up.', v_opps, case when v_opps = 1 then 'y' else 'ies' end)
    ));
  end if;

  if v_follow_ups > 0 then
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'key', 'follow_ups',
      'message', format('%s follow-up%s scheduled in the next two weeks — steady outreach builds trust.', v_follow_ups, case when v_follow_ups = 1 then ' is' else 's are' end)
    ));
  end if;

  if v_new_30d > 0 then
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'key', 'new_customers',
      'message', format('%s new customer relationship%s this month — consider a brief check-in.', v_new_30d, case when v_new_30d = 1 then '' else 's' end)
    ));
  end if;

  if jsonb_array_length(v_items) = 0 then
    v_items := jsonb_build_array(jsonb_build_object(
      'key', 'consistency',
      'message', 'Small, reliable steps forward often build the strongest partnerships — choose one meaningful action today.'
    ));
  end if;

  return jsonb_build_object(
    'greeting_tone', 'supportive_morning',
    'items', v_items,
    'examples', public._scebp_blueprint_daily_briefing_examples(),
    'privacy_note', 'Briefing from pipeline and follow-up counts only — no PII.'
  );
end; $$;

create or replace function public._scebp_activity_recommendations(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_inactive int := 0;
  v_demos int := 0;
  v_follow_ups int := 0;
  v_items jsonb := '[]'::jsonb;
begin
  v_summary := public._scebp_coach_summary(p_organization_id);
  v_demos := coalesce((v_summary->>'scheduled_demos')::int, 0);
  v_follow_ups := coalesce((v_summary->>'upcoming_follow_ups')::int, 0);

  select count(*) into v_inactive
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id
    and status = 'open'
    and updated_at < now() - interval '30 days';

  if v_follow_ups > 0 then
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'key', 'follow_ups', 'label', 'Thoughtful follow-ups', 'priority', 'high',
      'reason', format('%s upcoming follow-up%s — timely outreach respects customer pace.', v_follow_ups, case when v_follow_ups = 1 then '' else 's' end)
    ));
  end if;

  if v_demos > 0 then
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'key', 'schedule_demo', 'label', 'Schedule or prepare demos', 'priority', 'high',
      'reason', format('%s opportunit%s in demo or later stages.', v_demos, case when v_demos = 1 then 'y is' else 'ies are' end)
    ));
  end if;

  if v_inactive > 0 then
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'key', 'revisit_inactive', 'label', 'Revisit inactive opportunities', 'priority', 'medium',
      'reason', format('%s open opportunit%s without recent activity — a gentle check-in may help.', v_inactive, case when v_inactive = 1 then 'y' else 'ies' end)
    ));
  end if;

  v_items := v_items || jsonb_build_array(jsonb_build_object(
    'key', 'contact_local_businesses', 'label', 'Contact local businesses', 'priority', 'medium',
    'reason', 'Expanding your network with relevant local conversations — at your own pace.'
  ));

  v_items := v_items || jsonb_build_array(jsonb_build_object(
    'key', 'ask_introductions', 'label', 'Ask for introductions', 'priority', 'low',
    'reason', 'Satisfied customers may willingly introduce peers — always optional, never pressured.'
  ));

  return jsonb_build_object(
    'principle', 'Supportive suggestions only — never punitive.',
    'recommendations', v_items,
    'scaffold', public._scebp_blueprint_activity_recommendations_scaffold()
  );
end; $$;

create or replace function public._scebp_performance_insights(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_milestones jsonb;
  v_summary jsonb;
  v_strengths jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_retention numeric;
  v_follow_ups int;
  v_new_30d int;
begin
  v_milestones := public._sprbp_milestone_progress(p_organization_id);
  v_summary := public._scebp_coach_summary(p_organization_id);
  v_retention := (v_milestones->>'retention_rate_pct')::numeric;
  v_follow_ups := coalesce((v_summary->>'upcoming_follow_ups')::int, 0);
  v_new_30d := coalesce((v_milestones->>'new_customers_30d')::int, 0);

  if v_follow_ups > 0 then
    v_strengths := v_strengths || jsonb_build_array(jsonb_build_object(
      'key', 'follow_up_cadence', 'label', 'Consistent follow-up cadence', 'note', 'Scheduled follow-ups show reliable engagement.'
    ));
  end if;

  if v_retention is not null and v_retention >= 70 then
    v_strengths := v_strengths || jsonb_build_array(jsonb_build_object(
      'key', 'retention', 'label', 'Strong customer retention', 'note', format('Retention around %s%% — relationships matter.', v_retention)
    ));
  end if;

  if v_new_30d > 0 then
    v_strengths := v_strengths || jsonb_build_array(jsonb_build_object(
      'key', 'new_customers', 'label', 'New customer momentum', 'note', format('%s new relationships in the last 30 days.', v_new_30d)
    ));
  end if;

  if jsonb_array_length(v_strengths) = 0 then
    v_strengths := jsonb_build_array(jsonb_build_object(
      'key', 'foundation', 'label', 'Building your foundation', 'note', 'Every partnership starts with thoughtful first conversations.'
    ));
  end if;

  if coalesce((v_summary->>'scheduled_demos')::int, 0) > 0 then
    v_opportunities := v_opportunities || jsonb_build_array(jsonb_build_object(
      'key', 'demo_prep', 'label', 'Prepare upcoming demos', 'note', 'Review demonstration guidance before each session.'
    ));
  end if;

  v_opportunities := v_opportunities || jsonb_build_array(jsonb_build_object(
    'key', 'training', 'label', 'Deepen product knowledge', 'note', 'Training Center and certification pathways strengthen confidence.'
  ));

  return jsonb_build_object(
    'principle', 'Strengths and opportunities — encourage development, never shame.',
    'strengths', v_strengths,
    'opportunities', v_opportunities,
    'scaffold', public._scebp_blueprint_personal_performance_insights_scaffold(),
    'privacy_note', 'Insights from aggregate metadata only.'
  );
end; $$;

create or replace function public._scebp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_coach jsonb;
  v_briefing jsonb;
begin
  v_coach := public._scebp_coach_summary(p_organization_id);
  v_briefing := public._scebp_daily_briefing(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'companion_roles',
      'label', 'Sales Companion roles documented',
      'met', jsonb_array_length(public._scebp_blueprint_companion_roles()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'coach_dashboard',
      'label', 'Coach dashboard fields and live summary',
      'met', jsonb_array_length(public._scebp_blueprint_coach_dashboard_fields()) >= 8,
      'note', 'Live summary from _scebp_coach_summary().'
    ),
    jsonb_build_object(
      'key', 'daily_briefing',
      'label', 'Daily sales briefing generates supportive guidance',
      'met', jsonb_array_length(v_briefing->'items') >= 1,
      'note', null
    ),
    jsonb_build_object(
      'key', 'activity_recommendations',
      'label', 'Activity recommendations are supportive — not punitive',
      'met', (public._scebp_activity_recommendations(p_organization_id)->>'principle') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'objection_library',
      'label', 'Objection handling library scaffolded',
      'met', jsonb_array_length(public._scebp_blueprint_objection_handling_library()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'training_integration',
      'label', 'Sales Training Center integration linked',
      'met', (public._scebp_blueprint_sales_training_integration()->>'foundations_route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection for sustainable pacing',
      'met', (public._scebp_blueprint_self_love_connection()->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains how coach insights are generated',
      'met', jsonb_array_length(public._scebp_blueprint_trust_connection()->'experts_should_understand') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dogfooding_ready',
      'label', 'Dogfooding scaffold for Aipify Group Sales Reps',
      'met', (public._scebp_blueprint_dogfooding()->'aipify_group'->>'role') is not null,
      'note', case when coalesce((v_coach->>'active_customers')::int, 0) = 0
        then 'Add customers to validate live coach summary.'
        else null end
    )
  );
end; $$;

-- Extend dashboard — preserve ALL A.95 + Phase 41 fields; append Phase 45
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
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_perf jsonb; v_coach jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);

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
    'coach_suggested_actions', v_coach->'suggested_next_actions_count',
    'coach_scheduled_demos', v_coach->'scheduled_demos',
    'coach_brief_summary', format(
      '%s follow-ups · %s demos · %s new this month',
      coalesce(v_coach->>'upcoming_follow_ups', '0'),
      coalesce(v_coach->>'scheduled_demos', '0'),
      coalesce(v_coach->>'new_customers_this_month', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._scebp_blueprint_companion_roles() to authenticated;
grant execute on function public._scebp_blueprint_coach_dashboard_fields() to authenticated;
grant execute on function public._scebp_blueprint_daily_briefing_examples() to authenticated;
grant execute on function public._scebp_blueprint_activity_recommendations_scaffold() to authenticated;
grant execute on function public._scebp_blueprint_field_sales_coaching() to authenticated;
grant execute on function public._scebp_blueprint_demonstration_guidance() to authenticated;
grant execute on function public._scebp_blueprint_objection_handling_library() to authenticated;
grant execute on function public._scebp_blueprint_communication_coaching() to authenticated;
grant execute on function public._scebp_blueprint_personal_performance_insights_scaffold() to authenticated;
grant execute on function public._scebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._scebp_blueprint_bell_moments() to authenticated;
grant execute on function public._scebp_blueprint_sales_training_integration() to authenticated;
grant execute on function public._scebp_blueprint_roleplay_simulation() to authenticated;
grant execute on function public._scebp_blueprint_trust_connection() to authenticated;
grant execute on function public._scebp_blueprint_dogfooding() to authenticated;
grant execute on function public._scebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._scebp_blueprint_integration_links() to authenticated;
grant execute on function public._scebp_coach_summary(uuid) to authenticated;
grant execute on function public._scebp_daily_briefing(uuid) to authenticated;
grant execute on function public._scebp_activity_recommendations(uuid) to authenticated;
grant execute on function public._scebp_performance_insights(uuid) to authenticated;
grant execute on function public._scebp_blueprint_success_criteria(uuid) to authenticated;
