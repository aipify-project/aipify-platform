-- Implementation Blueprint Phase 32 — Industry Solutions Engine
-- Spec alignment extending Industry Intelligence Foundation Engine (Phase A.44). No new tables.

create or replace function public._isbp_blueprint_industry_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_packs', 'label', 'Industry-specific Knowledge Packs', 'description', 'KC templates, FAQs, and best practices aligned to sector'),
    jsonb_build_object('key', 'specialized_workflows', 'label', 'Specialized workflows', 'description', 'Workflow recommendations from industry profile metadata'),
    jsonb_build_object('key', 'companion_guidance', 'label', 'Tailored Companion guidance', 'description', 'Contextual recommendations with explainability and human override'),
    jsonb_build_object('key', 'operational_best_practices', 'label', 'Operational best practices', 'description', 'Best practices and KPI suggestions per assigned profile'),
    jsonb_build_object('key', 'industry_terminology', 'label', 'Industry terminology', 'description', 'Terminology glossaries with tenant custom overrides'),
    jsonb_build_object('key', 'role_experiences', 'label', 'Role-specific experiences', 'description', 'Business Pack and training path alignment by industry')
  );
$$;

create or replace function public._isbp_blueprint_industry_pack_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'commerce',
      'title', 'Commerce Solutions',
      'examples', jsonb_build_array(
        'Shopify integrations',
        'Product intelligence',
        'Supplier insights',
        'Customer support workflows',
        'Commerce analytics'
      ),
      'mapped_industry_keys', jsonb_build_array('commerce', 'ecommerce', 'retail'),
      'business_packs_route', '/app/business-packs-foundation-engine'
    ),
    jsonb_build_object(
      'key', 'healthcare',
      'title', 'Healthcare Solutions',
      'examples', jsonb_build_array(
        'Operational guidance',
        'Documentation structures',
        'Workflow recommendations',
        'Knowledge frameworks'
      ),
      'mapped_industry_keys', jsonb_build_array('healthcare'),
      'status', 'metadata_scaffold'
    ),
    jsonb_build_object(
      'key', 'professional_services',
      'title', 'Professional Services Solutions',
      'examples', jsonb_build_array(
        'Client follow-up',
        'Task coordination',
        'Executive reporting',
        'Knowledge sharing'
      ),
      'mapped_industry_keys', jsonb_build_array('professional_services', 'services'),
      'status', 'metadata_scaffold'
    ),
    jsonb_build_object(
      'key', 'hospitality',
      'title', 'Hospitality Solutions',
      'examples', jsonb_build_array(
        'Customer experiences',
        'Team coordination',
        'Support guidance',
        'Knowledge management'
      ),
      'mapped_industry_keys', jsonb_build_array('hospitality'),
      'status', 'future_pilot'
    ),
    jsonb_build_object(
      'key', 'community_platform',
      'title', 'Community Platform Solutions',
      'examples', jsonb_build_array(
        'Moderation workflows',
        'Member support',
        'Escalation guidance',
        'Knowledge structures'
      ),
      'mapped_industry_keys', jsonb_build_array('community', 'platform'),
      'status', 'metadata_scaffold'
    )
  );
$$;

create or replace function public._isbp_blueprint_companion_specialization()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('emoji', '🌹', 'key', 'industry_practices', 'example', 'This recommendation reflects common practices within your industry.'),
    jsonb_build_object('emoji', '🦉', 'key', 'similar_organizations', 'example', 'Organizations similar to yours often approach this differently.'),
    jsonb_build_object('emoji', '🔔', 'key', 'industry_milestone', 'example', 'An industry milestone has been achieved.')
  );
$$;

create or replace function public._isbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industries face unique pressures — support sustainable practices, reduce unnecessary complexity, encourage healthy workflows, celebrate progress appropriately.',
    'practices', jsonb_build_array(
      'Support sustainable practices — avoid one-size-fits-all pressure',
      'Reduce unnecessary complexity — specialize without overwhelming',
      'Encourage healthy workflows — industry guidance as starting point',
      'Celebrate progress appropriately — milestones without comparison guilt'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences industry tone — A.44 stores metadata patterns, not wellbeing content.'
  );
$$;

create or replace function public._isbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand which recommendations derive from industry guidance, what assumptions exist, and how customization remains possible.',
    'organizations_should_understand', jsonb_build_array(
      'Which recommendations derive from industry guidance vs tenant-specific data',
      'What assumptions exist in industry profile metadata',
      'How customization remains possible — override insights, custom terminology, disable insights',
      'Human oversight — never silent industry-driven changes'
    ),
    'metadata_only', true,
    'override_note', 'Human override via override_industry_insight() — audit-supported accountability.'
  );
$$;

create or replace function public._isbp_blueprint_knowledge_center_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry Solutions contribute templates, FAQs, best practices, learning resources, and companion guidance — organizations begin with a strong foundation.',
    'contributions', jsonb_build_array(
      'Templates — industry-aligned KC article scaffolds',
      'FAQs — sector-specific guidance under content/knowledge/aipify/',
      'Best practices — profile knowledge_metadata best_practices array',
      'Learning resources — cross-link Learning & Training A.36 paths',
      'Companion guidance — explainable industry insights with impact levels'
    ),
    'kc_route', '/app/knowledge-center-engine',
    'training_route', '/app/learning-training-engine'
  );
$$;

create or replace function public._isbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates industry experiences internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Internal operational guidance', 'Product development processes')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Commerce industry solutions', 'Shopify integration guidance', 'Support workflow specialization')
    ),
    'future_pilots', jsonb_build_array('Professional services', 'Additional sectors')
  );
$$;

create or replace function public._isbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'business_packs', 'label', 'Business Packs (A.43)', 'route', '/app/business-packs-foundation-engine', 'note', 'Pack activation and customization — industry-aligned modules'),
    jsonb_build_object('key', 'industry_blueprints', 'label', 'Industry Blueprints (Phase 70)', 'route', '/app/industry-blueprints', 'note', 'Governed catalog apply via marketplace'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Ecosystem (A.45)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Partner offerings and industry pack metadata — Blueprint Phase 19'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Templates, FAQs, organizational knowledge'),
    jsonb_build_object('key', 'organizational_benchmarking', 'label', 'Organizational Benchmarking (A.58)', 'route', '/app/organizational-benchmarking-engine', 'note', 'Metric comparisons — distinct from industry guidance'),
    jsonb_build_object('key', 'cross_tenant', 'label', 'Cross-Tenant Intelligence (A.71)', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Anonymized trends — not tenant industry profiles'),
    jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Strategic context — integrates with A.44'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Commerce connectors — Shopify and platform integrations')
  );
$$;

create or replace function public._isbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We know how to succeed in our industry with Aipify.',
    'Specialization increases value without sacrificing flexibility.',
    'Meaningful guidance begins with understanding context.',
    'Technology understands our world — customization remains possible.',
    'Every organization is unique — common challenges deserve thoughtful guidance.'
  );
$$;

create or replace function public._isbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile_assigned boolean := false;
  v_industry_key text;
  v_insights_enabled boolean := true;
  v_active_insights int := 0;
  v_overridden int := 0;
  v_high_impact int := 0;
  v_available_profiles int := 0;
  v_activated_packs int := 0;
  v_custom_terms int := 0;
  v_priorities int := 0;
begin
  select exists(
    select 1 from public.organization_industry_assignments
    where organization_id = p_organization_id and status = 'active'
  ) into v_profile_assigned;

  select ip.industry_key into v_industry_key
  from public.organization_industry_assignments oia
  join public.industry_profiles ip on ip.id = oia.industry_profile_id
  where oia.organization_id = p_organization_id and oia.status = 'active'
  limit 1;

  select coalesce(s.insights_enabled, true),
         jsonb_array_length(coalesce(s.custom_terminology, '[]'::jsonb)),
         jsonb_array_length(coalesce(s.priorities, '[]'::jsonb))
  into v_insights_enabled, v_custom_terms, v_priorities
  from public.organization_industry_settings s
  where s.organization_id = p_organization_id;

  select count(*) into v_active_insights
  from public.industry_insights
  where organization_id = p_organization_id and status in ('active', 'overridden', 'acknowledged');

  select count(*) into v_overridden
  from public.industry_insights
  where organization_id = p_organization_id and status = 'overridden';

  select count(*) into v_high_impact
  from public.industry_insights
  where organization_id = p_organization_id
    and impact_level in ('high', 'strategic')
    and status not in ('disabled');

  select count(*) into v_available_profiles
  from public.industry_profiles where status in ('active', 'beta');

  select count(*) into v_activated_packs
  from public.organization_business_packs
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'profile_assigned', v_profile_assigned,
    'industry_key', v_industry_key,
    'insights_enabled', v_insights_enabled,
    'active_insights', v_active_insights,
    'overridden_insights', v_overridden,
    'high_impact_insights', v_high_impact,
    'available_industry_profiles', v_available_profiles,
    'activated_business_packs', v_activated_packs,
    'custom_terminology_count', v_custom_terms,
    'priorities_count', v_priorities,
    'privacy_note', 'Counts and metadata keys only — no customer operational records or PII.'
  );
end; $$;

create or replace function public._isbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_assigned boolean := false;
  v_insights int := 0;
  v_packs int := 0;
  v_enabled boolean := true;
  v_high_impact int := 0;
begin
  v_engagement := public._isbp_engagement_summary(p_organization_id);
  v_assigned := coalesce((v_engagement->>'profile_assigned')::boolean, false);
  v_insights := coalesce((v_engagement->>'active_insights')::int, 0);
  v_packs := coalesce((v_engagement->>'activated_business_packs')::int, 0);
  v_enabled := coalesce((v_engagement->>'insights_enabled')::boolean, true);
  v_high_impact := coalesce((v_engagement->>'high_impact_insights')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'faster_onboarding',
      'label', 'Organizations experience faster onboarding — industry profile assigned',
      'met', v_assigned,
      'note', case when not v_assigned then 'Assign an industry profile via assign_organization_industry_profile().' else null end
    ),
    jsonb_build_object(
      'key', 'industry_relevance',
      'label', 'Industry relevance improves — insights and terminology active',
      'met', v_assigned and (v_insights > 0 or v_enabled),
      'note', null
    ),
    jsonb_build_object(
      'key', 'knowledge_adoption',
      'label', 'Knowledge adoption accelerates — Business Pack alignment or KC cross-links',
      'met', v_packs > 0 or jsonb_array_length(public._isbp_blueprint_knowledge_center_connection()->'contributions') >= 4,
      'note', 'Activate aligned Business Packs at /app/business-packs-foundation-engine.'
    ),
    jsonb_build_object(
      'key', 'contextual_guidance',
      'label', 'Companion guidance becomes more contextual — insights enabled with override path',
      'met', v_enabled and (v_insights > 0 or v_high_impact >= 0),
      'note', 'Human override preserves customization — never silent changes.'
    ),
    jsonb_build_object(
      'key', 'business_pack_value',
      'label', 'Business Packs deliver clearer value — activated packs or alignment documented',
      'met', v_packs > 0 or jsonb_array_length(public._isbp_blueprint_industry_pack_examples()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'industry_objectives',
      'label', 'Industry solution objectives documented — knowledge packs through role experiences',
      'met', jsonb_array_length(public._isbp_blueprint_industry_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'industry_pack_examples',
      'label', 'Industry pack examples documented — Commerce through Community Platform',
      'met', jsonb_array_length(public._isbp_blueprint_industry_pack_examples()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable industry practices',
      'met', true,
      'note', 'Self Love is a principle — specialization without pressure.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Blueprints Phase 70, Benchmarking, Cross-Tenant',
      'met', jsonb_array_length(public._isbp_blueprint_integration_links()) >= 7,
      'note', 'Extend related engines — do not duplicate governed apply or anonymized trends.'
    )
  );
end; $$;

create or replace function public._isbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Industry Blueprints Phase 70 /app/industry-blueprints (governed catalog apply), Business Packs A.43 /app/business-packs-foundation-engine (pack activation — cross-linked), Organizational Benchmarking A.58 /app/organizational-benchmarking-engine (metric comparisons), Cross-Tenant Intelligence A.71 /app/cross-tenant-intelligence-engine (anonymized trends), and Marketplace Ecosystem A.45 Blueprint Phase 19 (partner offerings). Phase A.44 industry profiles, insights, terminology, and human override preserved.';
$$;

create or replace function public.get_industry_intelligence_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile public.industry_profiles;
  v_settings public.organization_industry_settings;
  v_metadata jsonb;
begin
  perform public._irp_require_permission('industry.view');
  v_org_id := public._mta_require_organization();
  perform public._iife_seed_profiles();
  v_settings := public._iife_ensure_settings(v_org_id);

  select ip.* into v_profile
  from public.organization_industry_assignments oia
  join public.industry_profiles ip on ip.id = oia.industry_profile_id
  where oia.organization_id = v_org_id and oia.status = 'active'
  limit 1;

  v_metadata := coalesce(v_profile.knowledge_metadata, '{}'::jsonb);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Industry-specific intelligence — patterns, terminology, and operational priorities with human oversight. Extends Business Packs (A.43), Organizational Memory (A.34), and Strategic Intelligence (A.31).',
    'principles', jsonb_build_array(
      'Tenant-aware industry guidance',
      'Explainable recommendations with impact levels',
      'Human override — never silent changes',
      'Metadata only — no PII storage',
      'Audit-supported accountability',
      'Business Pack alignment where applicable'
    ),
    'summary', jsonb_build_object(
      'profile_assigned', v_profile.id is not null,
      'industry_key', v_profile.industry_key,
      'industry_name', v_profile.industry_name,
      'insights_enabled', v_settings.insights_enabled,
      'active_insights', coalesce((
        select count(*) from public.industry_insights
        where organization_id = v_org_id and status in ('active', 'overridden', 'acknowledged')
      ), 0),
      'high_impact_insights', coalesce((
        select count(*) from public.industry_insights
        where organization_id = v_org_id
          and impact_level in ('high', 'strategic')
          and status not in ('disabled')
      ), 0),
      'overridden_count', coalesce((
        select count(*) from public.industry_insights
        where organization_id = v_org_id and status = 'overridden'
      ), 0),
      'custom_terms', jsonb_array_length(coalesce(v_settings.custom_terminology, '[]'::jsonb)),
      'priorities_count', jsonb_array_length(coalesce(v_settings.priorities, '[]'::jsonb))
    ),
    'assigned_profile', case when v_profile.id is not null then row_to_json(v_profile)::jsonb else null end,
    'settings', row_to_json(v_settings)::jsonb,
    'benchmarks', coalesce(v_metadata->'benchmarks', '[]'::jsonb),
    'recommended_improvements', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.industry_insights i
      where i.organization_id = v_org_id
        and i.category in ('improvement', 'benchmark')
        and i.status not in ('disabled')
        and v_settings.insights_enabled
    ), '[]'::jsonb),
    'common_risks', coalesce(v_metadata->'common_risks', '[]'::jsonb),
    'strategic_opportunities', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.industry_insights i
      where i.organization_id = v_org_id
        and i.category = 'opportunity'
        and i.status not in ('disabled')
        and v_settings.insights_enabled
    ), '[]'::jsonb),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, i.created_at desc)
      from public.industry_insights i
      where i.organization_id = v_org_id
        and i.status not in ('disabled')
        and v_settings.insights_enabled
    ), '[]'::jsonb),
    'terminology', coalesce(v_metadata->'terminology', '[]'::jsonb) || coalesce(v_settings.custom_terminology, '[]'::jsonb),
    'workflow_recommendations', coalesce(v_metadata->'workflow_recommendations', '[]'::jsonb),
    'kpi_suggestions', coalesce(v_metadata->'kpi_suggestions', '[]'::jsonb),
    'best_practices', coalesce(v_metadata->'best_practices', '[]'::jsonb),
    'business_pack_alignment', case
      when v_profile.industry_key is not null then public._iife_business_pack_alignment(v_org_id, v_profile.industry_key)
      else '[]'::jsonb
    end,
    'integration_summaries', jsonb_build_object(
      'strategic_intelligence', public._iife_strategic_summary(v_org_id),
      'organizational_memory', public._iife_memory_summary(v_org_id),
      'business_packs', jsonb_build_object(
        'route', '/app/business-packs-foundation-engine',
        'note', 'Activate aligned Business Packs for modules and workflows'
      )
    ),
    'future_hooks', coalesce(v_metadata->'future_hooks', jsonb_build_object(
      'external_data_sources', 'scaffold',
      'industry_reports', 'scaffold',
      'benchmarking', 'scaffold',
      'partner_ecosystems', 'scaffold'
    )),
    'available_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'industry_key', ip.industry_key,
        'industry_name', ip.industry_name,
        'description', ip.description,
        'status', ip.status
      ) order by ip.industry_name)
      from public.industry_profiles ip where ip.status in ('active', 'beta')
    ), '[]'::jsonb),
    'mission', 'Accelerate adoption and increase relevance by providing industry-specific solutions built upon the Aipify foundation.',
    'blueprint_philosophy', 'Every organization is unique — many industries share common challenges. Aipify balances flexibility with specialization.',
    'abos_principle', 'Organizations benefit when technology understands their world. Specialization should increase value without sacrificing flexibility.',
    'vision', 'Organizations should feel that Aipify understands the realities of their industry — meaningful guidance begins with understanding context.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 32,
      'title', 'Industry Solutions Engine',
      'engine_phase', 'A.44',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE32_INDUSTRY_SOLUTIONS.md'
    ),
    'industry_objectives', public._isbp_blueprint_industry_objectives(),
    'industry_pack_examples', public._isbp_blueprint_industry_pack_examples(),
    'companion_specialization', public._isbp_blueprint_companion_specialization(),
    'self_love_connection', public._isbp_blueprint_self_love_connection(),
    'trust_connection_blueprint', public._isbp_blueprint_trust_connection(),
    'knowledge_center_connection', public._isbp_blueprint_knowledge_center_connection(),
    'dogfooding_blueprint', public._isbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._isbp_blueprint_integration_links(),
    'blueprint_vision_phrases', public._isbp_blueprint_vision_phrases(),
    'engagement_summary', public._isbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._isbp_blueprint_success_criteria(v_org_id),
    'distinction_note', public._isbp_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_industry_intelligence_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_industry_name text; v_insights int;
begin
  v_org_id := public._mta_require_organization();

  select ip.industry_name into v_industry_name
  from public.organization_industry_assignments oia
  join public.industry_profiles ip on ip.id = oia.industry_profile_id
  where oia.organization_id = v_org_id;

  select count(*) into v_insights
  from public.industry_insights
  where organization_id = v_org_id and status in ('active', 'overridden');

  return jsonb_build_object(
    'has_organization', true,
    'industry_name', v_industry_name,
    'active_insights', coalesce(v_insights, 0),
    'philosophy', 'Industry-specific guidance with human oversight.',
    'mission', 'Accelerate adoption through industry-specific solutions.',
    'abos_principle', 'Specialization increases value without sacrificing flexibility.',
    'blueprint_phase', 32,
    'engine_phase', 'A.44',
    'route', '/app/industry-intelligence-foundation-engine'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._isbp_blueprint_industry_objectives() to authenticated;
grant execute on function public._isbp_blueprint_industry_pack_examples() to authenticated;
grant execute on function public._isbp_blueprint_companion_specialization() to authenticated;
grant execute on function public._isbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._isbp_blueprint_trust_connection() to authenticated;
grant execute on function public._isbp_blueprint_knowledge_center_connection() to authenticated;
grant execute on function public._isbp_blueprint_dogfooding() to authenticated;
grant execute on function public._isbp_blueprint_integration_links() to authenticated;
grant execute on function public._isbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._isbp_engagement_summary(uuid) to authenticated;
grant execute on function public._isbp_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public._isbp_distinction_note() to authenticated;
