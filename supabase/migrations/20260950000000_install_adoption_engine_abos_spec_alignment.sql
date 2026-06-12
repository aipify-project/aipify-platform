-- Install & Adoption Engine — ABOS spec alignment (extends Phase A.22 Aipify Install Engine)
-- Maps to /app/aipify-install-engine — no new tables, dashboard/card framing only.

create or replace function public._ain_adoption_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_install public.organization_installations;
  v_discoveries int := 0;
  v_completed boolean := false;
  v_in_progress boolean := false;
begin
  select * into v_install
  from public.organization_installations
  where organization_id = p_organization_id
  order by created_at desc limit 1;

  if v_install.id is not null then
    select count(*) into v_discoveries
    from public.install_discovery_results where installation_id = v_install.id;
    v_completed := v_install.installation_status = 'completed';
    v_in_progress := v_install.installation_status in ('in_progress', 'pending');
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'onboard_successfully',
      'label', 'Organizations can onboard successfully',
      'met', v_completed or v_in_progress
    ),
    jsonb_build_object(
      'key', 'organizational_context',
      'label', 'Aipify can understand organizational context',
      'met', v_discoveries > 0,
      'note', case when v_discoveries = 0 then 'Run environment discovery to map structure and workflows.' else null end
    ),
    jsonb_build_object(
      'key', 'friction_decreases',
      'label', 'Adoption friction decreases over time',
      'met', v_completed or coalesce(v_install.completion_percentage, 0) >= 50
    ),
    jsonb_build_object(
      'key', 'measurable_value',
      'label', 'Customers experience measurable value quickly',
      'met', v_completed,
      'note', case when not v_completed then 'Complete installation and accept recommendations to activate value.' else null end
    ),
    jsonb_build_object(
      'key', 'companion_trust',
      'label', 'Companion trust begins developing naturally',
      'met', v_completed,
      'note', 'Trust grows through transparent discovery, permission review, and gradual adoption.'
    ),
    jsonb_build_object(
      'key', 'transparency',
      'label', 'Organizations understand what Aipify learns and why',
      'met', true,
      'note', 'Permission review and audit trail — metadata only, human approval required.'
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
    'philosophy', 'The easiest systems to adopt are the systems that understand their environment.',
    'mission', 'Reduce friction during onboarding and accelerate time-to-value through intelligent installation, discovery and adoption experiences.',
    'abos_principle', 'Technology should adapt to people. People should not be forced to adapt entirely to technology.',
    'install_adoption_engine_note', 'Install & Adoption Engine — Aipify adapts to organizations; organizations do not rebuild around Aipify.'
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
    'philosophy', 'The easiest systems to adopt are the systems that understand their environment. Aipify integrates into existing workflows respectfully and intelligently.',
    'mission', 'Reduce friction during onboarding and accelerate time-to-value through intelligent installation, discovery and adoption experiences.',
    'abos_principle', 'Technology should adapt to people. People should not be forced to adapt entirely to technology.',
    'vision', 'Adoption should feel less like installation and more like welcoming a new companion to the team.',
    'install_adoption_engine_note', 'Install & Adoption Engine (ABOS) — extends Aipify Install Engine (A.22) and Install Engine (Phase 17).',
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
    'self_love_note', 'Self Love (A.76 planned) supports gradual feature introduction, celebrates early wins, encourages patience, and helps organizations feel empowered — not pressured.',
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
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._ain_adoption_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'install-adoption-engine', 'Install & Adoption (ABOS)', 'Guided onboarding, discovery, and adoption — Aipify adapts to your organization.', 'authenticated', 66
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'install-adoption-engine' and tenant_id is null);
