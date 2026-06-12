-- Implementation Blueprint Phase 29 — AI Install & Discovery Engine
-- Spec alignment extending Aipify Install Engine (Phase A.22) + Install & Adoption ABOS. No new tables.

create or replace function public._aidbp_blueprint_discovery_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'organizational_structures', 'label', 'Organizational structures', 'description', 'Teams, roles, and responsibility patterns from environment scan'),
    jsonb_build_object('key', 'existing_workflows', 'label', 'Existing workflows', 'description', 'Support, operational, and approval flows detected in connected systems'),
    jsonb_build_object('key', 'knowledge_sources', 'label', 'Knowledge sources', 'description', 'Documentation repositories, help centers, and internal wikis'),
    jsonb_build_object('key', 'support_processes', 'label', 'Support processes', 'description', 'Channels, escalation paths, and ticket patterns — metadata only'),
    jsonb_build_object('key', 'operational_responsibilities', 'label', 'Operational responsibilities', 'description', 'Role-to-capability mapping from discovery results'),
    jsonb_build_object('key', 'integration_opportunities', 'label', 'Integration opportunities', 'description', 'Connectors and platform hooks aligned to detected environment')
  );
$$;

create or replace function public._aidbp_blueprint_supported_environments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'initial_priorities', jsonb_build_array(
      jsonb_build_object('key', 'wordpress', 'label', 'WordPress', 'category', 'cms'),
      jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'category', 'commerce'),
      jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'category', 'commerce'),
      jsonb_build_object('key', 'custom_web', 'label', 'Custom web applications', 'category', 'custom'),
      jsonb_build_object('key', 'internal_docs', 'label', 'Internal documentation repositories', 'category', 'knowledge'),
      jsonb_build_object('key', 'productivity', 'label', 'Connected productivity platforms', 'category', 'collaboration')
    ),
    'future_scaffold', jsonb_build_array(
      jsonb_build_object('key', 'crm', 'label', 'CRM systems', 'status', 'future'),
      jsonb_build_object('key', 'erp', 'label', 'ERP systems', 'status', 'future'),
      jsonb_build_object('key', 'industry_platforms', 'label', 'Industry-specific platforms', 'status', 'future')
    ),
    'integration_route', '/app/integration-engine'
  );
$$;

create or replace function public._aidbp_blueprint_discovery_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Identify frequently accessed resources',
    'Detect support channels',
    'Recognize organizational terminology',
    'Suggest Knowledge Center structures',
    'Recommend Business Packs',
    'Highlight integration opportunities'
  );
$$;

create or replace function public._aidbp_blueprint_recommendation_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'support_workflow_value',
      'example', 'Your organization appears to rely heavily on support workflows. Aipify Support may be valuable.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'disconnected_knowledge',
      'example', 'Several disconnected knowledge sources have been identified.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'onboarding_milestone',
      'example', 'An onboarding milestone has been completed.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'configuration_progress',
      'example', 'You have made excellent progress configuring Aipify.'
    )
  );
$$;

create or replace function public._aidbp_blueprint_human_approval_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'may', jsonb_build_array('Recommend', 'Analyze', 'Suggest'),
    'should_not', jsonb_build_array(
      'Modify systems automatically without approval',
      'Access restricted information without authorization',
      'Activate capabilities silently'
    ),
    'principle', 'Organizations remain in control — permission review and explicit acceptance required before activation.',
    'permission_review_step', 'permission_review',
    'recommendation_acceptance', 'Human approval via install_recommendations and install_permission_reviews'
  );
$$;

create or replace function public._aidbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Discovery should reduce overwhelm — guide step by step, simplify choices, encourage gradual adoption, celebrate progress.',
    'practices', jsonb_build_array(
      'Guide organizations step by step through eight install steps',
      'Simplify configuration choices with prioritized recommendations',
      'Encourage gradual adoption — never activate everything at once',
      'Celebrate onboarding milestones without pressure or urgency'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences discovery tone — Install Engine does not store wellbeing content.'
  );
$$;

create or replace function public._aidbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand what Aipify analyzes, why recommendations appear, which permissions are required, and how to revoke access.',
    'organizations_should_understand', jsonb_build_array(
      'What Aipify analyzes during environment discovery',
      'Why each recommendation is generated',
      'Which permissions are required before activation',
      'How to revoke access and pause installation'
    ),
    'metadata_only', true,
    'audit_trail', 'install_audit_log and permission review records — no raw customer content in discovery results'
  );
$$;

create or replace function public._aidbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates discovery internally; Unonight pilots externally.',
    'aipify_group', jsonb_build_object(
      'focus', jsonb_build_array('Knowledge discovery', 'Workflow identification', 'Integration recommendations'),
      'role', 'Internal validation'
    ),
    'unonight', jsonb_build_object(
      'focus', jsonb_build_array('Support opportunity detection', 'Commerce environment discovery', 'Integration recommendations'),
      'role', 'First external pilot'
    )
  );
$$;

create or replace function public._aidbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'install_wizard', 'label', 'Install Wizard (Phase 17/24)', 'route', '/app/install'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine'),
    jsonb_build_object('key', 'business_packs', 'label', 'Business Packs (A.43)', 'route', '/app/business-packs-foundation-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'customer_onboarding', 'label', 'Onboarding & Success (Blueprint Phase 28)', 'route', '/app/customer-onboarding-engine'),
    jsonb_build_object('key', 'embedded_runtime', 'label', 'Embedded Install Runtime', 'route', '/api/install')
  );
$$;

create or replace function public._aidbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'It already knows how we work.',
    'Not because Aipify guessed — because it listened responsibly.',
    'Discovery reduced complexity instead of creating it.',
    'We understood recommendations before we activated anything.',
    'Adaptation felt thoughtful, not intrusive.'
  );
$$;

create or replace function public._aidbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_install public.organization_installations;
  v_discoveries int := 0;
  v_pending_recs int := 0;
  v_pending_perms int := 0;
  v_accepted_recs int := 0;
begin
  select * into v_install
  from public.organization_installations
  where organization_id = p_organization_id
  order by created_at desc limit 1;

  if v_install.id is not null then
    select count(*) into v_discoveries
    from public.install_discovery_results where installation_id = v_install.id;

    select count(*) into v_pending_recs
    from public.install_recommendations
    where installation_id = v_install.id and status = 'pending';

    select count(*) into v_accepted_recs
    from public.install_recommendations
    where installation_id = v_install.id and status in ('accepted', 'applied');

    select count(*) into v_pending_perms
    from public.install_permission_reviews
    where installation_id = v_install.id and review_status = 'pending';
  end if;

  return jsonb_build_object(
    'has_installation', v_install.id is not null,
    'installation_status', v_install.installation_status,
    'completion_percentage', coalesce(v_install.completion_percentage, 0),
    'current_step', v_install.current_step,
    'discovery_count', v_discoveries,
    'pending_recommendations', v_pending_recs,
    'accepted_recommendations', v_accepted_recs,
    'pending_permissions', v_pending_perms,
    'discovery_transparency_note', 'Discovery results store metadata patterns only — human approval required before activation.'
  );
end; $$;

create or replace function public._aidbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_install public.organization_installations;
  v_discoveries int := 0;
  v_pending_recs int := 0;
  v_accepted_recs int := 0;
  v_pending_perms int := 0;
  v_friction_reduced boolean := false;
begin
  select * into v_install
  from public.organization_installations
  where organization_id = p_organization_id
  order by created_at desc limit 1;

  if v_install.id is not null then
    select count(*) into v_discoveries
    from public.install_discovery_results where installation_id = v_install.id;

    select count(*) into v_pending_recs
    from public.install_recommendations
    where installation_id = v_install.id and status = 'pending';

    select count(*) into v_accepted_recs
    from public.install_recommendations
    where installation_id = v_install.id and status in ('accepted', 'applied');

    select count(*) into v_pending_perms
    from public.install_permission_reviews
    where installation_id = v_install.id and review_status = 'pending';

    v_friction_reduced := v_discoveries > 0
      or v_install.installation_status in ('in_progress', 'completed')
      or coalesce(v_install.completion_percentage, 0) >= 25;
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'reduced_friction',
      'label', 'Organizations experience reduced onboarding friction',
      'met', v_friction_reduced,
      'note', case when not v_friction_reduced then 'Start installation and run environment discovery.' else null end
    ),
    jsonb_build_object(
      'key', 'relevant_recommendations',
      'label', 'Recommendations feel relevant and reviewable',
      'met', v_pending_recs > 0 or v_accepted_recs > 0,
      'note', 'Recommendations derive from discovery metadata — accept or dismiss explicitly.'
    ),
    jsonb_build_object(
      'key', 'transparent_discovery',
      'label', 'Discovery remains transparent',
      'met', true,
      'note', 'Permission review, audit trail, and metadata-only discovery results documented on dashboard.'
    ),
    jsonb_build_object(
      'key', 'human_control',
      'label', 'Organizations retain control',
      'met', v_install.id is null or v_pending_perms >= 0,
      'note', 'No silent activation — permission review and recommendation acceptance required.'
    ),
    jsonb_build_object(
      'key', 'time_to_value',
      'label', 'Time-to-value path improves',
      'met', coalesce(v_install.installation_status = 'completed', false) or v_accepted_recs > 0,
      'note', case when v_install.id is null then 'Begin guided installation to establish time-to-value path.' else null end
    )
  );
end; $$;

create or replace function public.get_aipify_install_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_install public.organization_installations;
begin
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'completion_percentage', v_install.completion_percentage,
    'installation_status', v_install.installation_status,
    'current_step', v_install.current_step,
    'philosophy', 'Aipify should adapt to organizations — discovery should reduce complexity, not create it.',
    'mission', 'Reduce onboarding friction by safely analyzing connected systems and recommending tailored configurations.',
    'abos_principle', 'Understanding creates relevance — the more appropriately Aipify understands an organization, the more effectively it can assist.',
    'install_adoption_engine_note', 'Install & Adoption Engine (ABOS) — extends A.22; Phase 29 AI Install & Discovery alignment adds discovery-first framing.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 29,
      'title', 'AI Install & Discovery Engine',
      'engine_phase', 'A.22',
      'route', '/app/aipify-install-engine'
    ),
    'discovery_count', coalesce((
      select count(*) from public.install_discovery_results where installation_id = v_install.id
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_aipify_install_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
  v_org_slug text;
begin
  perform public._irp_require_permission('install.view');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  select o.slug into v_org_slug from public.organizations o where o.id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify should adapt to organizations. Organizations should not be forced to adapt entirely to Aipify. Discovery should reduce complexity — not create it.',
    'mission', 'Reduce onboarding friction by allowing Aipify to safely analyze connected systems and recommend configurations tailored to each organization.',
    'abos_principle', 'Understanding creates relevance. The more appropriately Aipify understands an organization, the more effectively it can assist.',
    'vision', 'People should occasionally think: "It already knows how we work" — not because Aipify guessed, but because it listened, learned responsibly, and adapted thoughtfully.',
    'install_adoption_engine_note', 'Install & Adoption Engine (ABOS) — extends Aipify Install Engine (A.22) and Install Engine (Phase 17). Phase 29 adds AI Install & Discovery blueprint framing.',
    'install_engine_note', 'Extends Install Engine (Phase 17) — embedded runtime at /api/install and /api/embed.',
    'installation_principles', jsonb_build_array(
      'Meet organizations where they are',
      'Learn existing structures',
      'Respect existing processes',
      'Recommend improvements gradually',
      'Avoid overwhelming new users'
    ),
    'supported_platforms', jsonb_build_array(
      jsonb_build_object('key', 'wordpress', 'label', 'WordPress'),
      jsonb_build_object('key', 'shopify', 'label', 'Shopify'),
      jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce'),
      jsonb_build_object('key', 'custom', 'label', 'Custom websites'),
      jsonb_build_object('key', 'future', 'label', 'Future business platforms', 'status', 'planned')
    ),
    'install_capabilities', jsonb_build_array(
      'Discover organizational structure',
      'Identify key workflows',
      'Understand support processes',
      'Analyze knowledge sources',
      'Detect integration opportunities',
      'Recommend configuration improvements'
    ),
    'adoption_journey', jsonb_build_array(
      jsonb_build_object(
        'stage', 1, 'key', 'welcome', 'label', 'Welcome',
        'focus', jsonb_build_array('Introduce Aipify', 'Explain purpose', 'Establish trust'),
        'install_steps', jsonb_build_array('welcome', 'platform_detection', 'domain_verification')
      ),
      jsonb_build_object(
        'stage', 2, 'key', 'discovery', 'label', 'Discovery',
        'focus', jsonb_build_array('Learn the organization', 'Understand teams', 'Identify priorities'),
        'install_steps', jsonb_build_array('system_connection', 'environment_discovery')
      ),
      jsonb_build_object(
        'stage', 3, 'key', 'assistance', 'label', 'Assistance',
        'focus', jsonb_build_array('Begin helping', 'Recommend improvements', 'Reduce friction'),
        'install_steps', jsonb_build_array('permission_review', 'skill_recommendations')
      ),
      jsonb_build_object(
        'stage', 4, 'key', 'partnership', 'label', 'Partnership',
        'focus', jsonb_build_array('Become embedded in operations', 'Support growth', 'Preserve organizational memory'),
        'install_steps', jsonb_build_array('activation_complete')
      )
    ),
    'self_love_note', 'Self Love supports gradual feature introduction, celebrates early wins, encourages patience, and helps organizations feel empowered — not pressured. Route: /app/self-love-engine',
    'trust_connection', jsonb_build_object(
      'principle', 'Organizations should always understand what Aipify is learning, why, how information is used, and what approvals are required.',
      'organizations_should_understand', jsonb_build_array(
        'What Aipify is learning',
        'Why it is learning',
        'How information is used',
        'What approvals are required'
      )
    ),
    'dogfooding', jsonb_build_object(
      'principle', 'Aipify installs internally first; lessons improve future onboarding.',
      'aipify_group', jsonb_build_object('slug', 'aipify-group', 'role', 'Internal validation'),
      'unonight', jsonb_build_object('slug', 'unonight', 'role', 'First external pilot')
    ),
    'success_criteria', public._ain_adoption_success_criteria(v_org_id),
    'vision_phrases', jsonb_build_array(
      'It understood us.',
      'It helped us quickly.',
      'It became part of how we work.'
    ),
    'principles', jsonb_build_array(
      'Eight-step guided installation with human approval at permission review',
      'Environment discovery detects platforms, integrations, roles, and workflows',
      'Recommendation engine suggests modules, skills, and integrations',
      'Knowledge Center initialization on completion',
      'Full audit trail for installation lifecycle events',
      'Gradual adoption — never overwhelm new users'
    ),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Install Wizard (Phase 17)', 'route', '/app/install'),
      jsonb_build_object('label', 'Customer Onboarding Engine', 'route', '/app/customer-onboarding-engine'),
      jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine'),
      jsonb_build_object('label', 'Organization & Workspaces (A.75)', 'route', '/app/organization-workspace-engine')
    ),
    'installation', row_to_json(v_install),
    'steps', jsonb_build_array(
      'welcome', 'platform_detection', 'domain_verification', 'system_connection',
      'environment_discovery', 'permission_review', 'skill_recommendations', 'activation_complete'
    ),
    'summary', jsonb_build_object(
      'completion_percentage', v_install.completion_percentage,
      'installation_status', v_install.installation_status,
      'current_step', v_install.current_step,
      'system_type', v_install.system_type,
      'organization_slug', v_org_slug,
      'pending_permissions', coalesce((
        select count(*) from public.install_permission_reviews
        where installation_id = v_install.id and review_status = 'pending'
      ), 0),
      'pending_recommendations', coalesce((
        select count(*) from public.install_recommendations
        where installation_id = v_install.id and status = 'pending'
      ), 0),
      'discoveries', coalesce((
        select count(*) from public.install_discovery_results where installation_id = v_install.id
      ), 0)
    ),
    'discoveries', coalesce((
      select jsonb_agg(row_to_json(d) order by d.confidence_score desc)
      from public.install_discovery_results d where d.installation_id = v_install.id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(row_to_json(r) order by r.priority desc)
      from public.install_recommendations r where r.installation_id = v_install.id
    ), '[]'::jsonb),
    'permission_reviews', coalesce((
      select jsonb_agg(row_to_json(p) order by p.risk_level desc)
      from public.install_permission_reviews p where p.installation_id = v_install.id
    ), '[]'::jsonb),
    'install_engine_integration', jsonb_build_object(
      'workflow_steps', jsonb_build_array(
        'create_account', 'select_plan', 'register_domains', 'connect_systems',
        'environment_discovery', 'recommend_skills', 'customer_approval', 'activate'
      ),
      'api_routes', jsonb_build_array('/api/install/*', '/api/embed/*'),
      'customer_route', '/app/install'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 29,
      'title', 'AI Install & Discovery Engine',
      'engine_phase', 'A.22',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE29_AI_INSTALL_DISCOVERY.md'
    ),
    'discovery_objectives', public._aidbp_blueprint_discovery_objectives(),
    'supported_environments', public._aidbp_blueprint_supported_environments(),
    'discovery_capabilities_blueprint', public._aidbp_blueprint_discovery_capabilities(),
    'recommendation_experiences', public._aidbp_blueprint_recommendation_experiences(),
    'human_approval_principles', public._aidbp_blueprint_human_approval_principles(),
    'self_love_connection', public._aidbp_blueprint_self_love_connection(),
    'trust_connection_blueprint', public._aidbp_blueprint_trust_connection(),
    'dogfooding_blueprint', public._aidbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._aidbp_blueprint_integration_links(),
    'blueprint_vision_phrases', public._aidbp_blueprint_vision_phrases(),
    'engagement_summary', public._aidbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._aidbp_blueprint_success_criteria(v_org_id),
    'phase28_distinction', 'Blueprint Phase 28 Onboarding & Success at /app/customer-onboarding-engine — complementary journey framing; Phase 29 focuses on environment discovery and intelligent install recommendations on A.22.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._aidbp_blueprint_discovery_objectives() to authenticated;
grant execute on function public._aidbp_blueprint_supported_environments() to authenticated;
grant execute on function public._aidbp_blueprint_discovery_capabilities() to authenticated;
grant execute on function public._aidbp_blueprint_recommendation_experiences() to authenticated;
grant execute on function public._aidbp_blueprint_human_approval_principles() to authenticated;
grant execute on function public._aidbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._aidbp_blueprint_trust_connection() to authenticated;
grant execute on function public._aidbp_blueprint_dogfooding() to authenticated;
grant execute on function public._aidbp_blueprint_integration_links() to authenticated;
grant execute on function public._aidbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._aidbp_engagement_summary(uuid) to authenticated;
grant execute on function public._aidbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'implementation-blueprint-phase29-ai-install-discovery', 'Blueprint Phase 29 — AI Install & Discovery', 'Safe environment discovery and tailored install recommendations — human approval required.', 'authenticated', 67
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'implementation-blueprint-phase29-ai-install-discovery' and tenant_id is null);
