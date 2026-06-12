-- Implementation Blueprint Phase 19 — Marketplace & Ecosystem Engine
-- Spec alignment extending Marketplace & Partner Ecosystem Foundation Engine (Phase A.45). No new tables.

create or replace function public._mpfe_blueprint_ecosystem_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'business_packs', 'label', 'Business Packs', 'description', 'Outcome-oriented solution bundles from certified partners and Aipify catalog', 'route', '/app/business-packs-foundation-engine'),
    jsonb_build_object('key', 'industry_packs', 'label', 'Industry Packs', 'description', 'Industry-specific patterns, terminology, and operational guidance', 'route', '/app/industry-intelligence-foundation-engine'),
    jsonb_build_object('key', 'connector_marketplace', 'label', 'Connector Marketplace', 'description', 'Modular integrations for Shopify, WordPress, Slack, and more', 'route', '/app/integration-engine'),
    jsonb_build_object('key', 'knowledge_packs', 'label', 'Knowledge Packs', 'description', 'Approved terminology, best practices, and procedures', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'companion_skills', 'label', 'Companion Skills', 'description', 'Executive, Support, Commerce, and Knowledge companions — unified experience (future)', 'route', '/app/companion-identity-engine', 'status', 'future_scaffold'),
    jsonb_build_object('key', 'partner_contributions', 'label', 'Partner contributions', 'description', 'Governed partner offerings with certification and quality review', 'route', '/app/marketplace-partner-ecosystem-foundation-engine')
  );
$$;

create or replace function public._mpfe_blueprint_industry_packs()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'pack_key', 'support',
      'display_name', 'Support Industry Pack',
      'description', 'Support workflows, escalation patterns, and knowledge-first customer operations',
      'examples', jsonb_build_array('Ticket triage templates', 'Escalation playbooks', 'Support terminology packs'),
      'route', '/app/industry-intelligence-foundation-engine',
      'cross_link', 'Industry Intelligence Foundation (A.44)'
    ),
    jsonb_build_object(
      'pack_key', 'commerce',
      'display_name', 'Commerce Industry Pack',
      'description', 'Retail and e-commerce operations — orders, returns, product intelligence',
      'examples', jsonb_build_array('Order support workflows', 'Returns handling', 'Commerce analytics patterns'),
      'route', '/app/industry-intelligence-foundation-engine',
      'cross_link', 'Business Packs A.43 — e_commerce catalog seed'
    ),
    jsonb_build_object(
      'pack_key', 'healthcare',
      'display_name', 'Healthcare Industry Pack',
      'description', 'Healthcare terminology, compliance-aware procedures, and patient-support scaffolding (metadata)',
      'examples', jsonb_build_array('Clinical terminology packs', 'Compliance-aware escalation', 'Patient communication best practices'),
      'route', '/app/industry-intelligence-foundation-engine',
      'status', 'metadata_scaffold'
    ),
    jsonb_build_object(
      'pack_key', 'education',
      'display_name', 'Education Industry Pack',
      'description', 'Education sector patterns — enrollment support, learning operations, and institutional knowledge',
      'examples', jsonb_build_array('Enrollment support workflows', 'Learning operations checklists', 'Institutional knowledge packs'),
      'route', '/app/industry-intelligence-foundation-engine',
      'status', 'metadata_scaffold'
    )
  );
$$;

create or replace function public._mpfe_blueprint_connector_marketplace()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('connector_key', 'shopify', 'label', 'Shopify', 'category', 'commerce', 'route', '/app/integration-engine', 'integration_engine_phase', 'A.8'),
    jsonb_build_object('connector_key', 'wordpress', 'label', 'WordPress', 'category', 'content', 'route', '/app/integration-engine', 'integration_engine_phase', 'A.8'),
    jsonb_build_object('connector_key', 'woocommerce', 'label', 'WooCommerce', 'category', 'commerce', 'route', '/app/integration-engine', 'integration_engine_phase', 'A.8'),
    jsonb_build_object('connector_key', 'slack', 'label', 'Slack', 'category', 'collaboration', 'route', '/app/integration-engine', 'integration_engine_phase', 'A.8'),
    jsonb_build_object('connector_key', 'teams', 'label', 'Microsoft Teams', 'category', 'collaboration', 'route', '/app/integration-engine', 'integration_engine_phase', 'A.8')
  );
$$;

create or replace function public._mpfe_blueprint_knowledge_packs()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge Packs bundle approved terminology, best practices, and procedures — sourced from Knowledge Center, not raw customer content.',
    'pack_types', jsonb_build_array(
      jsonb_build_object('key', 'terminology', 'label', 'Terminology packs', 'description', 'Industry and role-specific vocabulary for consistent communication'),
      jsonb_build_object('key', 'best_practices', 'label', 'Best practices', 'description', 'Approved operational patterns and guidance'),
      jsonb_build_object('key', 'procedures', 'label', 'Procedures', 'description', 'Step-by-step workflows linked to Knowledge Center articles')
    ),
    'route', '/app/knowledge-center-engine',
    'cross_link', 'Knowledge Center Engine (A.5)',
    'boundary', 'Metadata and approved articles only — no raw email, chat, or PII in knowledge packs.'
  );
$$;

create or replace function public._mpfe_blueprint_companion_skills()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'future_scaffold',
    'principle', 'Companion Skills provide a unified experience across Executive, Support, Commerce, and Knowledge domains — distinct personas, one Aipify companion identity.',
    'companions', jsonb_build_array(
      jsonb_build_object('key', 'executive_companion', 'label', 'Executive Companion', 'domain', 'executive', 'route', '/app/executive-insights-engine', 'status', 'future'),
      jsonb_build_object('key', 'support_companion', 'label', 'Support Companion', 'domain', 'support', 'route', '/app/support-ai-engine', 'status', 'future'),
      jsonb_build_object('key', 'commerce_companion', 'label', 'Commerce Companion', 'domain', 'commerce', 'route', '/app/integration-engine', 'status', 'future'),
      jsonb_build_object('key', 'knowledge_companion', 'label', 'Knowledge Companion', 'domain', 'knowledge', 'route', '/app/knowledge-center-engine', 'status', 'future')
    ),
    'identity_route', '/app/companion-identity-engine',
    'cross_link', 'Companion Identity Engine (A.84)',
    'boundary', 'Companion Skills scaffold only — activation flows through existing engines until unified experience ships.'
  );
$$;

create or replace function public._mpfe_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recommend relevant packs, encourage gradual adoption, and avoid complexity — ecosystem growth should feel welcoming, not overwhelming.',
    'practices', jsonb_build_array(
      'Start with one pack or connector that matches the most urgent outcome',
      'Add industry packs and modular connectors only when the team is ready',
      'Celebrate early activation wins without pressure to enable everything',
      'Self Love supports sustainable ecosystem rollout — never guilt or urgency'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences rollout tone — Marketplace Ecosystem does not store wellbeing content.'
  );
$$;

create or replace function public._mpfe_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should always understand who created ecosystem content, what permissions are required, what value is provided, and how to disable contributions.',
    'operators_should_know', jsonb_build_array(
      'Who created each partner offering and certification level',
      'Permissions required before activation — human approval for partners and offerings',
      'Value provided by each pack, connector, or knowledge contribution',
      'How to suspend partners, disable integrations, or deactivate packs'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Approved partners only appear in production marketplace views',
      'Full audit for approvals, suspensions, and offering publications',
      'Metadata only — no partner PII beyond governance fields on dashboard',
      'Distinct from Module Marketplace A.23 licensing and Commercial Packages tiers'
    ),
    'disable_routes', jsonb_build_object(
      'integrations', '/app/integration-engine',
      'business_packs', '/app/business-packs-foundation-engine',
      'modules', '/app/module-marketplace-foundation-engine',
      'partners', '/app/marketplace-partner-ecosystem-foundation-engine'
    )
  );
$$;

create or replace function public._mpfe_blueprint_quality_guardian_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Quality Guardian reviews ecosystem contributions — quality assessments, governance checks, and human approval before broad activation.',
    'governance_patterns', jsonb_build_array(
      'Partner certification and re-certification workflows',
      'Offering quality indicators — transparent, not hidden',
      'Quality scans on integrations and operational modules',
      'Escalation when confidence is low or risk is high'
    ),
    'route', '/app/quality-guardian-engine',
    'phase', 'A.13',
    'boundary', 'Quality Guardian governs quality — Marketplace Ecosystem governs partner catalog and activation metadata.'
  );
$$;

create or replace function public._mpfe_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates ecosystem contributions internally; Unonight pilots commerce ecosystem activation.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding',
      'contributions', jsonb_build_array('Internal knowledge packs', 'Companion skills scaffold', 'Platform connectors'),
      'note', 'Validate partner governance, knowledge pack metadata, and connector activation flows before broad release'
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce ecosystem',
      'contributions', jsonb_build_array('Commerce industry pack alignment', 'Shopify/WooCommerce connectors', 'Support + commerce business packs'),
      'note', 'E-Commerce pack with Integration Engine connectivity and partner offerings'
    )
  );
$$;

create or replace function public._mpfe_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'module_marketplace', 'label', 'Module Marketplace (A.23)', 'route', '/app/module-marketplace-foundation-engine'),
    jsonb_build_object('key', 'business_packs', 'label', 'Business Packs (A.43)', 'route', '/app/business-packs-foundation-engine'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'industry_intelligence', 'label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine'),
    jsonb_build_object('key', 'quality_guardian', 'label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine')
  );
$$;

create or replace function public._mpfe_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'No single platform solves everything — the ecosystem grows alongside organizations.',
    'Activating capabilities should feel like welcoming a helpful companion, not configuring software.',
    'Easy activation, trustworthy contributions, manageable complexity.',
    'Industry packs accelerate adoption — start where the organization already operates.',
    'Modular connectors extend ABOS without replacing customer systems.',
    'Humans approve — Aipify discovers, prepares, and explains ecosystem value.'
  );
$$;

create or replace function public._mpfe_ecosystem_activation_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_integrations int := 0;
  v_pending_integrations int := 0;
  v_active_business_packs int := 0;
  v_enabled_modules int := 0;
  v_approved_partners int := 0;
  v_published_offerings int := 0;
  v_org_partner_submissions int := 0;
begin
  if to_regclass('public.organization_integrations') is not null then
    select count(*) into v_active_integrations
    from public.organization_integrations
    where organization_id = p_organization_id and status = 'active' and enabled = true;

    select count(*) into v_pending_integrations
    from public.organization_integrations
    where organization_id = p_organization_id and status in ('pending', 'failed');
  end if;

  if to_regclass('public.organization_business_packs') is not null then
    select count(*) into v_active_business_packs
    from public.organization_business_packs
    where organization_id = p_organization_id;
  end if;

  if to_regclass('public.organization_modules') is not null then
    select count(*) into v_enabled_modules
    from public.organization_modules
    where organization_id = p_organization_id and enabled = true;
  end if;

  if to_regclass('public.partners') is not null then
    select count(*) into v_approved_partners
    from public.partners where status = 'approved';

    select count(*) into v_org_partner_submissions
    from public.partners where submitted_by_organization_id = p_organization_id;
  end if;

  if to_regclass('public.marketplace_offerings') is not null then
    select count(*) into v_published_offerings
    from public.marketplace_offerings where status = 'published';
  end if;

  return jsonb_build_object(
    'active_integrations', v_active_integrations,
    'pending_integrations', v_pending_integrations,
    'active_business_packs', v_active_business_packs,
    'enabled_modules', v_enabled_modules,
    'approved_partners', v_approved_partners,
    'published_offerings', v_published_offerings,
    'org_partner_submissions', v_org_partner_submissions,
    'activation_summary', format(
      '%s active integrations, %s business packs, %s enabled modules, %s approved partners, %s published offerings.',
      v_active_integrations, v_active_business_packs, v_enabled_modules, v_approved_partners, v_published_offerings
    ),
    'privacy_note', 'Counts only — no credentials, partner PII, or customer operational content.'
  );
end; $$;

create or replace function public._mpfe_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_activation jsonb;
  v_active_integrations int := 0;
  v_active_business_packs int := 0;
  v_enabled_modules int := 0;
  v_approved_partners int := 0;
  v_published_offerings int := 0;
  v_pending_partners int := 0;
begin
  v_activation := public._mpfe_ecosystem_activation_summary(p_organization_id);
  v_active_integrations := coalesce((v_activation->>'active_integrations')::int, 0);
  v_active_business_packs := coalesce((v_activation->>'active_business_packs')::int, 0);
  v_enabled_modules := coalesce((v_activation->>'enabled_modules')::int, 0);
  v_approved_partners := coalesce((v_activation->>'approved_partners')::int, 0);
  v_published_offerings := coalesce((v_activation->>'published_offerings')::int, 0);

  if to_regclass('public.partners') is not null then
    select count(*) into v_pending_partners from public.partners where status = 'pending';
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'ecosystem_objectives_documented',
      'label', 'Ecosystem objectives cover Business Packs, Industry Packs, Connectors, Knowledge, and Companion Skills',
      'met', jsonb_array_length(public._mpfe_blueprint_ecosystem_objectives()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'easy_activation',
      'label', 'Organization has activated at least one ecosystem capability (integration, pack, or module)',
      'met', v_active_integrations > 0 or v_active_business_packs > 0 or v_enabled_modules > 0,
      'note', case
        when v_active_integrations = 0 and v_active_business_packs = 0 and v_enabled_modules = 0
          then 'Connect an integration, activate a business pack, or enable a module to begin ecosystem adoption.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'trustworthy_contributions',
      'label', 'Partner governance available — approved partners and quality indicators',
      'met', v_approved_partners > 0,
      'note', case when v_pending_partners > 0 then format('%s partner applications pending human review.', v_pending_partners) else null end
    ),
    jsonb_build_object(
      'key', 'industry_packs_metadata',
      'label', 'Industry pack examples documented (Support, Commerce, Healthcare, Education)',
      'met', jsonb_array_length(public._mpfe_blueprint_industry_packs()) >= 4,
      'note', 'Industry packs cross-link Industry Intelligence A.44 — metadata scaffold for Healthcare and Education.'
    ),
    jsonb_build_object(
      'key', 'modular_connectors',
      'label', 'Connector marketplace lists modular integrations cross-linked to Integration Engine A.8',
      'met', jsonb_array_length(public._mpfe_blueprint_connector_marketplace()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'manageable_complexity',
      'label', 'Self Love connection encourages gradual adoption — one capability at a time',
      'met', true,
      'note', 'Self Love is a principle — recommend relevant packs without pressure to enable everything.'
    ),
    jsonb_build_object(
      'key', 'quality_governance',
      'label', 'Quality Guardian connection documented for ecosystem contribution review',
      'met', (public._mpfe_blueprint_quality_guardian_connection()->>'route') is not null,
      'note', 'Partner certification, offering quality indicators, and quality scans — humans approve.'
    ),
    jsonb_build_object(
      'key', 'offerings_available',
      'label', 'Published marketplace offerings available for discovery',
      'met', v_published_offerings > 0,
      'note', case when v_published_offerings = 0 then 'Offerings populate after partner approval and publication workflow.' else null end
    )
  );
end; $$;

create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
    'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
    'pending_reviews', coalesce((select count(*) from public.partners where status = 'pending'), 0),
    'philosophy', 'Certified partner ecosystem with governed offerings.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 19,
      'title', 'Marketplace & Ecosystem Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE19_MARKETPLACE_ECOSYSTEM.md'
    ),
    'mission', 'Discover, activate, and benefit from ecosystem extensions — Business Packs, Industry Packs, Connectors, Knowledge Packs, and Companion Skills.',
    'abos_principle', 'No single platform solves everything — empower contributors and grow the ecosystem openly.',
    'ecosystem_activation_summary', public._mpfe_ecosystem_activation_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('ecosystem.view');
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Curated partner ecosystem — approved partners, offerings, and certification with human governance. Extends Module Marketplace (A.23), Business Packs (A.43), and API Platform (A.21).',
    'principles', jsonb_build_array(
      'Approved partners only in production views',
      'Certification levels with re-certification workflow',
      'Offering quality indicators — transparent, not hidden',
      'Full audit for approvals, suspensions, and publications',
      'Metadata only — no partner PII in dashboard'
    ),
    'summary', jsonb_build_object(
      'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
      'pending_partners', coalesce((select count(*) from public.partners where status = 'pending'), 0),
      'suspended_partners', coalesce((select count(*) from public.partners where status = 'suspended'), 0),
      'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
      'strategic_partners', coalesce((select count(*) from public.partners where certification_level = 'strategic' and status = 'approved'), 0),
      'org_submissions', coalesce((select count(*) from public.partners where submitted_by_organization_id = v_org_id), 0)
    ),
    'approved_partners', coalesce((
      select jsonb_agg(row_to_json(p) order by
        case p.certification_level when 'strategic' then 0 when 'advanced' then 1 when 'certified' then 2 else 3 end,
        p.partner_name)
      from public.partners p where p.status = 'approved'
    ), '[]'::jsonb),
    'pending_partners', coalesce((
      select jsonb_agg(row_to_json(p) order by p.created_at desc)
      from public.partners p where p.status = 'pending'
    ), '[]'::jsonb),
    'offerings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'offering', row_to_json(o),
        'partner_name', p.partner_name,
        'partner_certification', p.certification_level
      ) order by o.title)
      from public.marketplace_offerings o
      join public.partners p on p.id = o.partner_id
      where o.status = 'published' and p.status = 'approved'
    ), '[]'::jsonb),
    'certification_breakdown', coalesce((
      select jsonb_object_agg(certification_level, cnt)
      from (
        select certification_level, count(*) as cnt
        from public.partners where status = 'approved'
        group by certification_level
      ) s
    ), '{}'::jsonb),
    'quality_indicators', coalesce((
      select jsonb_object_agg(coalesce(quality_indicator, 'unrated'), cnt)
      from (
        select quality_indicator, count(*) as cnt
        from public.marketplace_offerings where status = 'published'
        group by quality_indicator
      ) s
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'module_marketplace', jsonb_build_object('route', '/app/module-marketplace-foundation-engine', 'note', 'Activate modules from marketplace catalog'),
      'business_packs', jsonb_build_object('route', '/app/business-packs-foundation-engine', 'note', 'Business pack offerings from certified partners')
    ),
    'recent_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_type', al.action_type,
        'entity_type', al.entity_type,
        'created_at', al.created_at,
        'metadata', al.metadata
      ) order by al.created_at desc)
      from (
        select action_type, entity_type, created_at, metadata
        from public.audit_logs
        where organization_id = v_org_id
          and action_type in (
            'partner_submitted_for_review', 'partner_application_reviewed',
            'partner_approved', 'partner_suspended', 'partner_recertified',
            'offering_published', 'offering_suspended'
          )
        order by created_at desc
        limit 10
      ) al
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 19,
      'title', 'Marketplace & Ecosystem Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE19_MARKETPLACE_ECOSYSTEM.md',
      'mapping_note', 'ABOS Blueprint Phase 19 maps to Marketplace & Partner Ecosystem Foundation Engine A.45 — extend, do not duplicate Module Marketplace A.23 or Business Packs A.43.'
    ),
    'mission', 'Discover, activate, and benefit from ecosystem extensions — Business Packs, Industry Packs, Connectors, Knowledge Packs, and Companion Skills.',
    'abos_principle', 'No single platform solves everything — empower contributors and grow the ecosystem openly.',
    'ecosystem_objectives', public._mpfe_blueprint_ecosystem_objectives(),
    'industry_packs', public._mpfe_blueprint_industry_packs(),
    'connector_marketplace', public._mpfe_blueprint_connector_marketplace(),
    'knowledge_packs', public._mpfe_blueprint_knowledge_packs(),
    'companion_skills', public._mpfe_blueprint_companion_skills(),
    'self_love_connection', public._mpfe_blueprint_self_love_connection(),
    'trust_connection', public._mpfe_blueprint_trust_connection(),
    'quality_guardian_connection', public._mpfe_blueprint_quality_guardian_connection(),
    'dogfooding', public._mpfe_blueprint_dogfooding(),
    'integration_links', public._mpfe_blueprint_integration_links(),
    'ecosystem_activation_summary', public._mpfe_ecosystem_activation_summary(v_org_id),
    'success_criteria', public._mpfe_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._mpfe_blueprint_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._mpfe_blueprint_ecosystem_objectives() to authenticated;
grant execute on function public._mpfe_blueprint_industry_packs() to authenticated;
grant execute on function public._mpfe_blueprint_connector_marketplace() to authenticated;
grant execute on function public._mpfe_blueprint_knowledge_packs() to authenticated;
grant execute on function public._mpfe_blueprint_companion_skills() to authenticated;
grant execute on function public._mpfe_blueprint_self_love_connection() to authenticated;
grant execute on function public._mpfe_blueprint_trust_connection() to authenticated;
grant execute on function public._mpfe_blueprint_quality_guardian_connection() to authenticated;
grant execute on function public._mpfe_blueprint_dogfooding() to authenticated;
grant execute on function public._mpfe_blueprint_integration_links() to authenticated;
grant execute on function public._mpfe_blueprint_vision_phrases() to authenticated;
grant execute on function public._mpfe_ecosystem_activation_summary(uuid) to authenticated;
grant execute on function public._mpfe_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'marketplace-ecosystem-engine-blueprint', 'Marketplace & Ecosystem Engine (ABOS Phase 19)',
  'Marketplace & Ecosystem Engine — extends Marketplace & Partner Ecosystem Foundation Engine A.45 with ecosystem objectives, industry packs, connectors, and live activation summary.',
  'authenticated', 97
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'marketplace-ecosystem-engine-blueprint' and tenant_id is null
);
