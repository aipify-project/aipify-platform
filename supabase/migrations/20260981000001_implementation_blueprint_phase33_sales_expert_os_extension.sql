-- Phase 33 Extension — link Sales Expert OS from Marketplace Partner Ecosystem dashboard
-- Preserves ALL existing Phase 19 + Phase 33 dashboard fields

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
      'Official partner tiers — Sales Representative, Sales Expert, Certified, Expert',
      'Offering quality indicators — transparent, not hidden',
      'Full audit for approvals, suspensions, and publications',
      'Metadata only — no partner PII in dashboard'
    ),
    'summary', jsonb_build_object(
      'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
      'pending_partners', coalesce((select count(*) from public.partners where status = 'pending'), 0),
      'suspended_partners', coalesce((select count(*) from public.partners where status = 'suspended'), 0),
      'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
      'expert_partners', coalesce((select count(*) from public.partners where certification_level = 'expert' and status = 'approved'), 0),
      'sales_expert_partners', coalesce((select count(*) from public.partners where certification_level = 'sales_expert' and status = 'approved'), 0),
      'org_submissions', coalesce((select count(*) from public.partners where submitted_by_organization_id = v_org_id), 0)
    ),
    'approved_partners', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id, 'partner_name', p.partner_name, 'partner_type', p.partner_type,
          'status', p.status, 'certification_level', p.certification_level,
          'certification_level_label', public._mpfe_tier_label(p.certification_level)
        ) order by
          case p.certification_level
            when 'expert' then 0 when 'certified' then 1 when 'sales_expert' then 2 else 3 end,
          p.partner_name)
      from public.partners p where p.status = 'approved'
    ), '[]'::jsonb),
    'pending_partners', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id, 'partner_name', p.partner_name, 'partner_type', p.partner_type,
          'status', p.status, 'certification_level', p.certification_level,
          'certification_level_label', public._mpfe_tier_label(p.certification_level)
        ) order by p.created_at desc)
      from public.partners p where p.status = 'pending'
    ), '[]'::jsonb),
    'offerings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'offering', row_to_json(o),
        'partner_name', p.partner_name,
        'partner_certification', p.certification_level,
        'partner_certification_label', public._mpfe_tier_label(p.certification_level)
      ) order by o.title)
      from public.marketplace_offerings o
      join public.partners p on p.id = o.partner_id
      where o.status = 'published' and p.status = 'approved'
    ), '[]'::jsonb),
    'certification_breakdown', coalesce((
      select jsonb_object_agg(certification_level, public._mpfe_tier_label(certification_level))
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
      'business_packs', jsonb_build_object('route', '/app/business-packs-foundation-engine', 'note', 'Business pack offerings from certified partners'),
      'sales_expert_os', jsonb_build_object('route', '/app/sales-expert-engine', 'note', 'Sales Expert Operating System — partner portal for pipeline and commissions')
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
    'vision_phrases', public._mpfe_blueprint_vision_phrases(),
    'partner_mission', public._penbp_blueprint_mission(),
    'partner_philosophy', public._penbp_blueprint_philosophy(),
    'partner_abos_principle', 'Verified expertise earns trust — official partner tiers must be credible and outcomes-driven.',
    'partner_vision', 'Organizations locate experts they trust — partners deliver measurable value through credible certification and collaboration.',
    'implementation_blueprint_phase33', jsonb_build_object(
      'phase', 33,
      'title', 'Partner & Aipify Expert Network Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md',
      'mapping_note', 'ABOS Blueprint Phase 33 extends A.45 with expert network tiers, partner discovery, certification cross-links — preserves Phase 19 ecosystem fields. See PARTNER_TERMINOLOGY_UPDATE.md.'
    ),
    'partner_objectives', public._penbp_blueprint_partner_objectives(),
    'partner_tiers', public._penbp_blueprint_partner_tiers(),
    'partner_capabilities', public._penbp_blueprint_partner_capabilities(),
    'partner_marketplace_connection', public._penbp_blueprint_partner_marketplace_connection(),
    'partner_portal_terminology', public._penbp_blueprint_partner_portal_terminology(),
    'compensation_principle', public._penbp_blueprint_compensation_principle(),
    'partner_self_love_connection', public._penbp_blueprint_self_love_connection(),
    'partner_trust_connection', public._penbp_blueprint_trust_connection(),
    'certification_connection', public._penbp_blueprint_certification_connection(),
    'partner_dogfooding', public._penbp_blueprint_dogfooding(),
    'penbp_integration_links', public._penbp_blueprint_integration_links() || jsonb_build_array(
      jsonb_build_object(
        'key', 'sales_expert_os',
        'label', 'Sales Expert Operating System (A.95)',
        'route', '/app/sales-expert-engine',
        'note', 'Partner portal — Customers, Opportunities, Pipeline, Commission Overview'
      )
    ),
    'partner_engagement_summary', public._penbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._penbp_blueprint_success_criteria(v_org_id),
    'partner_vision_phrases', public._penbp_blueprint_vision_phrases(),
    'blueprint_distinction_note', public._penbp_distinction_note(),
    'sales_expert_os_link', jsonb_build_object(
      'label', 'Sales Expert Portal',
      'route', '/app/sales-expert-engine',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'note', 'Distinct from Partner Success A.73 — partner-facing pipeline, commissions, and one-to-one email'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;
