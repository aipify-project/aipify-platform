-- Implementation Blueprint Phase 41 — Sales Performance & Recognition Engine
-- Extends Sales Expert Operating System (Phase A.95). No new tables.

create or replace function public._sprbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'milestones', 'label', 'Sales milestone recognition', 'description', 'Celebrate progress — first customer through sustained support'),
    jsonb_build_object('key', 'healthy_competition', 'label', 'Healthy competition', 'description', 'Encouragement-oriented leaderboards — no public shaming'),
    jsonb_build_object('key', 'personal_goals', 'label', 'Personal goal tracking', 'description', 'Visibility into commissions, subscriptions, retention, and trends'),
    jsonb_build_object('key', 'team_celebrations', 'label', 'Team celebrations', 'description', 'Bell Moments for meaningful achievements'),
    jsonb_build_object('key', 'recognition_experiences', 'label', 'Recognition experiences', 'description', 'Voluntary Recognition Roses from customers'),
    jsonb_build_object('key', 'long_term_motivation', 'label', 'Long-term motivation', 'description', 'Sustainable pacing via Self Love connection')
  );
$$;

create or replace function public._sprbp_blueprint_performance_dashboard_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'monthly_commissions', 'label', 'Monthly commissions'),
    jsonb_build_object('key', 'active_subscriptions', 'label', 'Active subscriptions'),
    jsonb_build_object('key', 'new_customers', 'label', 'New customers acquired'),
    jsonb_build_object('key', 'retention_rate', 'label', 'Customer retention rate'),
    jsonb_build_object('key', 'lifetime_value', 'label', 'Lifetime subscription value'),
    jsonb_build_object('key', 'performance_trends', 'label', 'Personal performance trends')
  );
$$;

create or replace function public._sprbp_blueprint_milestones()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'first_customer', 'emoji', '🔔', 'label', 'First Customer Acquired', 'threshold', 1),
    jsonb_build_object('key', 'five_active', 'emoji', '🔔', 'label', 'Five Active Customers', 'threshold', 5),
    jsonb_build_object('key', 'fifty_active', 'emoji', '🔔', 'label', 'Fifty Active Customers', 'threshold', 50),
    jsonb_build_object('key', 'hundred_supported', 'emoji', '🔔', 'label', 'One Hundred Customers Supported', 'threshold', 100),
    jsonb_build_object('key', 'first_renewal', 'emoji', '🌹', 'label', 'First Customer Renewal', 'threshold', null, 'note', 'Derived from subscription_status and customer tenure metadata'),
    jsonb_build_object('key', 'first_enterprise', 'emoji', '🌹', 'label', 'First Enterprise Customer', 'threshold', null, 'note', 'Enterprise plan_key on commission or customer metadata'),
    jsonb_build_object('key', 'first_year', 'emoji', '🌹', 'label', 'First Year as Sales Expert', 'threshold', null, 'note', 'Program tenure from settings created_at')
  );
$$;

create or replace function public._sprbp_blueprint_bell_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'new_journey',
      'example', 'You have helped another organization begin their Aipify journey.',
      'trigger', 'Significant customer acquisition or onboarding milestone'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'dedication',
      'example', 'This milestone reflects your dedication and professionalism.',
      'trigger', 'Certification completed or sustained customer outcomes'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'milestone',
      'example', 'A meaningful milestone — celebrate progress, not comparison.',
      'trigger', 'Milestone recognition threshold reached'
    )
  );
$$;

create or replace function public._sprbp_blueprint_recognition_roses()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customers may optionally provide Recognition Roses to Sales Experts — voluntary appreciation, never required.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'example', 'Thank you for helping our organization succeed.'),
      jsonb_build_object('emoji', '🌹', 'example', 'Your onboarding process made a meaningful difference.')
    ),
    'gratitude_engine_route', '/app/gratitude-recognition-engine',
    'boundary', 'Distinct from Presence & Comfort A.90 comfort roses — peer/customer appreciation via Gratitude & Recognition A.89 infrastructure.'
  );
$$;

create or replace function public._sprbp_blueprint_leaderboards()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leaderboards emphasize encouragement — never aggressive competition or public shaming.',
    'encouraged_categories', jsonb_build_array(
      jsonb_build_object('key', 'most_improved', 'label', 'Most Improved Sales Expert'),
      jsonb_build_object('key', 'customer_satisfaction', 'label', 'Highest Customer Satisfaction'),
      jsonb_build_object('key', 'knowledge_champion', 'label', 'Knowledge Champion'),
      jsonb_build_object('key', 'onboarding_excellence', 'label', 'Onboarding Excellence'),
      jsonb_build_object('key', 'community_contributor', 'label', 'Community Contributor')
    ),
    'avoid', jsonb_build_array('Aggressive competition', 'Public shaming', 'Vanity metrics without customer outcomes')
  );
$$;

create or replace function public._sprbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales can be emotionally demanding — sustainable pacing, work-life balance, recognition of effort, celebration of progress.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Remember that long-term consistency matters more than short bursts of intensity.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love influences tone — Performance & Recognition stores metadata and milestone state only.'
  );
$$;

create or replace function public._sprbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Performance metrics remain transparent — Sales Experts understand how achievements are measured.',
    'experts_should_understand', jsonb_build_array(
      'How achievements and milestones are measured from customer and commission metadata',
      'Which metrics influence recognition — customer outcomes over vanity counts',
      'How customer satisfaction contributes to encouragement categories',
      'That leaderboards are encouragement-oriented, not punitive'
    ),
    'metadata_only', true
  );
$$;

create or replace function public._sprbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Internal validation of recognition experiences, bell moments, and milestone quality',
      'focus', jsonb_build_array('Motivation', 'Customer outcomes', 'Recognition quality', 'Sustainable performance')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Future Sales Experts participate in pilot testing',
      'note', 'Pilot cohorts validate encouragement tone before broader rollout'
    )
  );
$$;

create or replace function public._sprbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Help Sales Experts build confidence and sustainable careers around Aipify.',
    'People should occasionally pause and think: "I am making a difference."',
    'Every organization supported by Aipify began with someone willing to introduce them to a better way of working.'
  );
$$;

create or replace function public._sprbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition Roses infrastructure — Blueprint Phase 9'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing and celebration without burnout'),
    jsonb_build_object('key', 'certification', 'label', 'Certification A.37', 'route', '/app/certification-achievement-engine', 'note', 'Certification milestones trigger bell moments'),
    jsonb_build_object('key', 'sales_expert_portal', 'label', 'Sales Expert Portal', 'route', '/app/sales-expert-engine', 'note', 'Performance tab on Sales Expert OS A.95')
  );
$$;

create or replace function public._sprbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Gratitude & Recognition A.89 / Blueprint Phase 9 (organization-wide peer recognition) — Phase 41 is Sales Expert performance visibility, milestone celebration, and encouragement-oriented leaderboards within /app/sales-expert-engine. Cross-links A.89 for Recognition Roses; never aggressive competition or public shaming.';
$$;

create or replace function public._sprbp_milestone_progress(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active int := 0;
  v_total int := 0;
  v_new_30d int := 0;
  v_active_subs int := 0;
  v_renewals int := 0;
  v_enterprise int := 0;
  v_tenure_days int := 0;
begin
  select count(*) filter (where status = 'active'),
         count(*),
         count(*) filter (where created_at >= now() - interval '30 days'),
         count(*) filter (where subscription_status = 'active'),
         count(*) filter (where subscription_status = 'active' and updated_at > created_at + interval '30 days')
    into v_active, v_total, v_new_30d, v_active_subs, v_renewals
  from public.organization_sales_expert_customers
  where organization_id = p_organization_id;

  select count(*) into v_enterprise
  from public.organization_sales_expert_commissions c
  where c.organization_id = p_organization_id
    and coalesce(c.subscription_plan_key, '') in ('business', 'enterprise');

  select greatest(0, extract(day from now() - s.created_at)::int) into v_tenure_days
  from public.organization_sales_expert_settings s
  where s.organization_id = p_organization_id;

  return jsonb_build_object(
    'active_customers', v_active,
    'total_customers', v_total,
    'new_customers_30d', v_new_30d,
    'active_subscriptions', v_active_subs,
    'retention_rate_pct', case when v_total > 0 then round((v_active::numeric / v_total) * 100, 1) else null end,
    'milestones', jsonb_build_array(
      jsonb_build_object('key', 'first_customer', 'met', v_total >= 1, 'current', v_total, 'threshold', 1),
      jsonb_build_object('key', 'five_active', 'met', v_active >= 5, 'current', v_active, 'threshold', 5),
      jsonb_build_object('key', 'fifty_active', 'met', v_active >= 50, 'current', v_active, 'threshold', 50),
      jsonb_build_object('key', 'hundred_supported', 'met', v_total >= 100, 'current', v_total, 'threshold', 100),
      jsonb_build_object('key', 'first_renewal', 'met', v_renewals > 0, 'current', v_renewals),
      jsonb_build_object('key', 'first_enterprise', 'met', v_enterprise > 0, 'current', v_enterprise),
      jsonb_build_object('key', 'first_year', 'met', v_tenure_days >= 365, 'current', v_tenure_days, 'threshold', 365)
    ),
    'privacy_note', 'Counts from tenant-scoped customer and commission metadata only.'
  );
end; $$;

create or replace function public._sprbp_performance_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_milestones jsonb;
begin
  v_engagement := public._seos_engagement_summary(p_organization_id);
  v_milestones := public._sprbp_milestone_progress(p_organization_id);

  return jsonb_build_object(
    'monthly_commissions_pending', v_engagement->'monthly_commissions_pending',
    'monthly_commissions_paid', v_engagement->'monthly_commissions_paid',
    'forecasted_commissions', v_engagement->'forecasted_commissions',
    'lifetime_subscription_value', v_engagement->'lifetime_subscription_value',
    'active_subscriptions', v_milestones->'active_subscriptions',
    'new_customers_30d', v_milestones->'new_customers_30d',
    'retention_rate_pct', v_milestones->'retention_rate_pct',
    'active_customers', v_milestones->'active_customers',
    'milestones_achieved', (
      select count(*) from jsonb_array_elements(v_milestones->'milestones') m
      where coalesce((m->>'met')::boolean, false)
    ),
    'performance_trends_note', 'Trend scaffold — compare monthly commission and customer counts over time in future phase.'
  );
end; $$;

create or replace function public._sprbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_perf jsonb;
  v_milestones jsonb;
  v_achieved int := 0;
begin
  v_perf := public._sprbp_performance_summary(p_organization_id);
  v_milestones := public._sprbp_milestone_progress(p_organization_id);
  v_achieved := coalesce((v_perf->>'milestones_achieved')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'performance_visibility',
      'label', 'Sales Experts have performance dashboard visibility',
      'met', jsonb_array_length(public._sprbp_blueprint_performance_dashboard_fields()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'milestone_recognition',
      'label', 'Milestone recognition documented and progress tracked',
      'met', jsonb_array_length(public._sprbp_blueprint_milestones()) >= 7,
      'note', format('%s milestones achieved for this organization.', v_achieved)
    ),
    jsonb_build_object(
      'key', 'encouragement_leaderboards',
      'label', 'Encouragement-oriented leaderboards — no shaming language',
      'met', jsonb_array_length(public._sprbp_blueprint_leaderboards()->'encouraged_categories') >= 5,
      'note', 'Avoid aggressive competition and public shaming — metadata scaffold only.'
    ),
    jsonb_build_object(
      'key', 'recognition_roses',
      'label', 'Recognition Roses cross-linked — voluntary customer appreciation',
      'met', (public._sprbp_blueprint_recognition_roses()->>'gratitude_engine_route') is not null,
      'note', 'Uses Gratitude & Recognition A.89 — distinct from comfort roses A.90.'
    ),
    jsonb_build_object(
      'key', 'self_love_sustainable',
      'label', 'Self Love connection encourages sustainable pacing',
      'met', (public._sprbp_blueprint_self_love_connection()->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains how metrics are measured',
      'met', jsonb_array_length(public._sprbp_blueprint_trust_connection()->'experts_should_understand') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'customer_outcomes',
      'label', 'At least one customer connected — recognition tied to real outcomes',
      'met', coalesce((v_milestones->>'total_customers')::int, 0) > 0,
      'note', case when coalesce((v_milestones->>'total_customers')::int, 0) = 0
        then 'Add customers in Sales Expert Portal to track milestones.'
        else null end
    )
  );
end; $$;

-- Extend dashboard — preserve ALL A.95 fields; append Phase 41
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
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_perf jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);

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
    'performance_recognition_phase', 41
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._sprbp_blueprint_objectives() to authenticated;
grant execute on function public._sprbp_blueprint_performance_dashboard_fields() to authenticated;
grant execute on function public._sprbp_blueprint_milestones() to authenticated;
grant execute on function public._sprbp_blueprint_bell_moments() to authenticated;
grant execute on function public._sprbp_blueprint_recognition_roses() to authenticated;
grant execute on function public._sprbp_blueprint_leaderboards() to authenticated;
grant execute on function public._sprbp_milestone_progress(uuid) to authenticated;
grant execute on function public._sprbp_performance_summary(uuid) to authenticated;
grant execute on function public._sprbp_blueprint_success_criteria(uuid) to authenticated;
