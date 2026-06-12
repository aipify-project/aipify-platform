-- Implementation Blueprint Phase 15 — Business Packs & Productization Foundation
-- Spec alignment extending Business Packs Foundation Engine (Phase A.43). No new tables.
-- Productization = outcome-oriented presentation layer on existing business_packs catalog.

create or replace function public._bpf_blueprint_productization_packs()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'blueprint_key', 'aipify_essentials',
      'display_name', 'Aipify Essentials',
      'target_audience', 'Small businesses and teams starting with calm daily assistance',
      'outcome_summary', 'Stay organized with knowledge, basic tasks, and friendly companion guidance',
      'examples', jsonb_build_array(
        'Companion guidance for everyday questions',
        'Knowledge Center for approved answers',
        'Basic task follow-up and reminders',
        'FAQ assistance for common customer questions'
      ),
      'mapped_pack_key', 'general_business',
      'mapping_note', 'Blueprint Essentials maps to General Business catalog seed — no pack_key rename',
      'module_routes', jsonb_build_array(
        '/app/knowledge-center-engine',
        '/app/unified-task-follow-up-engine',
        '/app/companion-identity-engine'
      )
    ),
    jsonb_build_object(
      'blueprint_key', 'aipify_support',
      'display_name', 'Aipify Support',
      'target_audience', 'Teams handling customer inquiries and escalations',
      'outcome_summary', 'Respond faster with triage, knowledge recommendations, and clear escalation paths',
      'examples', jsonb_build_array(
        'Support workflows and ticket assistance',
        'Knowledge recommendations during replies',
        'Escalation handling with human approval',
        'Quality checks on support operations'
      ),
      'mapped_pack_key', 'support_operations',
      'mapping_note', 'Blueprint Support maps to Support Operations catalog seed',
      'module_routes', jsonb_build_array(
        '/app/support-ai-engine',
        '/app/knowledge-center-engine',
        '/app/quality-guardian-engine'
      )
    ),
    jsonb_build_object(
      'blueprint_key', 'aipify_operations',
      'display_name', 'Aipify Operations',
      'target_audience', 'Operations leaders coordinating tasks, summaries, and organizational memory',
      'outcome_summary', 'Clearer daily operations — tasks, executive summaries, workflows, and shared context',
      'examples', jsonb_build_array(
        'Unified task follow-up and accountability',
        'Executive summaries and operational briefings',
        'Workflow orchestration scaffold',
        'Organizational memory for decisions and patterns'
      ),
      'mapped_pack_key', 'general_business',
      'mapping_note', 'Operations extends General Business with operations-oriented modules in blueprint metadata — catalog seed unchanged',
      'module_routes', jsonb_build_array(
        '/app/unified-task-follow-up-engine',
        '/app/operations-dashboard-engine',
        '/app/organizational-memory-engine',
        '/app/workflow-orchestration-engine'
      )
    ),
    jsonb_build_object(
      'blueprint_key', 'aipify_commerce',
      'display_name', 'Aipify Commerce',
      'target_audience', 'Retail and e-commerce teams on Shopify, WooCommerce, or similar platforms',
      'outcome_summary', 'Commerce-aware support, product intelligence, and integration-ready operations',
      'examples', jsonb_build_array(
        'Order and returns support workflows',
        'Commerce analytics and insights',
        'Integration connectivity for storefronts',
        'Product intelligence scaffolding'
      ),
      'mapped_pack_key', 'e_commerce',
      'mapping_note', 'Blueprint Commerce maps to E-Commerce catalog seed (pack_key e_commerce)',
      'module_routes', jsonb_build_array(
        '/app/integration-engine',
        '/app/support-ai-engine',
        '/app/analytics-insights-engine'
      )
    ),
    jsonb_build_object(
      'blueprint_key', 'aipify_enterprise',
      'display_name', 'Aipify Enterprise',
      'target_audience', 'Large organizations requiring governance, integrations, and executive oversight',
      'outcome_summary', 'Governance, integrations, executive companion, and permission-aware operations',
      'examples', jsonb_build_array(
        'Enterprise governance and compliance scaffolding',
        'Integration connectivity across systems',
        'Executive companion and strategic summaries',
        'Permission and approval workflows'
      ),
      'mapped_pack_key', 'enterprise_governance',
      'mapping_note', 'Blueprint Enterprise maps to reserved Enterprise Governance seed — future activation',
      'is_reserved', true,
      'module_routes', jsonb_build_array(
        '/app/enterprise-readiness-engine',
        '/app/integration-engine',
        '/app/governance-policy-engine',
        '/app/audit-accountability'
      )
    )
  );
$$;

create or replace function public._bpf_blueprint_modular_addons()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'addon_key', 'recognition_celebration',
      'label', 'Recognition & celebration',
      'outcome', 'Celebrate wins and strengthen team morale',
      'route', '/app/gratitude-recognition-engine',
      'source', 'Gratitude Recognition Engine'
    ),
    jsonb_build_object(
      'addon_key', 'executive_insights',
      'label', 'Executive insights',
      'outcome', 'Briefings and summaries for leadership clarity',
      'route', '/app/executive',
      'source', 'Executive dashboard and briefings'
    ),
    jsonb_build_object(
      'addon_key', 'industry_packs',
      'label', 'Industry packs',
      'outcome', 'Industry-specific patterns and operational guidance',
      'route', '/app/industry-intelligence-foundation-engine',
      'source', 'Industry Intelligence Foundation (A.44)'
    ),
    jsonb_build_object(
      'addon_key', 'marketplace_modules',
      'label', 'Marketplace modules',
      'outcome', 'Add specialized capabilities as needs evolve',
      'route', '/app/module-marketplace-foundation-engine',
      'source', 'Module Marketplace Foundation (A.23)'
    )
  );
$$;

create or replace function public._bpf_blueprint_packaging_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Address recognizable problems — support overload, scattered knowledge, commerce friction',
    'Easy to explain — outcomes first; technical names stay in admin context',
    'Measurable value — faster responses, organized knowledge, clearer operations',
    'Scale — start with one pack, add capabilities as needs grow',
    'Flexible — combine catalog packs with modular add-ons from Module Marketplace'
  );
$$;

create or replace function public._bpf_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reduce overwhelm — start with what is needed and grow gradually. Productization encourages one clear pack first.',
    'practices', jsonb_build_array(
      'Begin with Essentials or the pack that matches the most urgent outcome',
      'Add modular add-ons only when the team is ready',
      'Celebrate early activation wins without pressure to enable everything',
      'Self Love supports sustainable rollout — never guilt or urgency'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences rollout tone — Business Packs does not store wellbeing content.'
  );
$$;

create or replace function public._bpf_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should always understand what each pack includes, how to upgrade, and the value delivered.',
    'qualities', jsonb_build_array(
      'Transparent — review step shows modules, workflows, and install context before activation',
      'Explainable — activation log records each step with metadata only',
      'Upgradeable — additional packs and marketplace modules without losing prior settings',
      'Honest — reserved packs marked future; no fake activation'
    ),
    'review_route', '/api/aipify/business-packs-foundation-engine/review',
    'commercial_packages_note', 'Subscription plan tiers (starter/growth/business/enterprise) gate module licensing separately from productization packs.'
  );
$$;

create or replace function public._bpf_blueprint_website_presentation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Present outcomes, not engine jargon — align with Positioning Foundation.',
    'outcomes', jsonb_build_array('Time', 'Clarity', 'Support', 'Confidence', 'Sustainable growth'),
    'avoid', jsonb_build_array(
      'Leading with internal engine names on marketing pages',
      'Implying customers must understand ABOS architecture to buy',
      'Conflating productization packs with subscription plan tier names'
    ),
    'positioning_doc', 'POSITIONING_FOUNDATION.md',
    'kc_article_slug', 'positioning-foundation',
    'plain_language', 'Aipify is a digital coworker that helps your business stay organized, respond faster, and work smarter.'
  );
$$;

create or replace function public._bpf_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify productizes internally first; pilots validate outcome messaging before broad release.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'packs', jsonb_build_array('Aipify Essentials', 'Aipify Operations'),
      'note', 'General Business + operations modules — dogfood productization copy and activation flow'
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First customer pilot',
      'packs', jsonb_build_array('Aipify Support', 'Aipify Operations'),
      'note', 'Support Operations + task/workflow alignment'
    ),
    'commerce_pilots', jsonb_build_object(
      'role', 'Commerce productization pilot',
      'packs', jsonb_build_array('Aipify Commerce'),
      'note', 'E-Commerce pack with Integration Engine (Phase 5) connectivity'
    )
  );
$$;

create or replace function public._bpf_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Choosing a solution — not configuring software',
    'Outcomes customers can explain in one sentence',
    'Calm select → review → activate → customize flow',
    'Expandable through marketplace add-ons without starting over'
  );
$$;

create or replace function public._bpf_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'module_marketplace', 'label', 'Module Marketplace (A.23)', 'route', '/app/module-marketplace-foundation-engine'),
    jsonb_build_object('key', 'commercial_modules', 'label', 'Commercial Packages — Modules', 'route', '/app/settings/modules'),
    jsonb_build_object('key', 'commercial_billing', 'label', 'Commercial Packages — Billing', 'route', '/app/settings/billing'),
    jsonb_build_object('key', 'install_engine', 'label', 'Install & Adoption Engine (A.22)', 'route', '/app/aipify-install-engine'),
    jsonb_build_object('key', 'industry_intelligence', 'label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine'),
    jsonb_build_object('key', 'positioning_foundation', 'label', 'Positioning Foundation', 'route', '/app/knowledge-center-engine', 'kc_slug', 'positioning-foundation'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine')
  );
$$;

create or replace function public._bpf_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active int := 0;
  v_catalog int := 0;
  v_recommended int := 0;
  v_activation_logs int := 0;
  v_recommended_keys text[];
begin
  select count(*) into v_active
  from public.organization_business_packs
  where organization_id = p_organization_id;

  select count(*) into v_catalog
  from public.business_packs
  where status in ('active', 'beta') and is_future = false;

  v_recommended_keys := public._bpf_recommend_pack_keys(p_organization_id);

  select count(*) into v_recommended
  from public.business_packs bp
  where bp.pack_key = any(v_recommended_keys)
    and bp.status in ('active', 'beta')
    and bp.is_future = false;

  select count(*) into v_activation_logs
  from public.business_pack_activation_log
  where organization_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'active_packs',
      'label', 'Organization has activated at least one business pack',
      'met', v_active > 0,
      'note', case when v_active = 0 then 'Review a productization pack and activate its mapped catalog pack.' else null end
    ),
    jsonb_build_object(
      'key', 'catalog_available',
      'label', 'Business pack catalog is available for selection',
      'met', v_catalog > 0
    ),
    jsonb_build_object(
      'key', 'recommendations',
      'label', 'Context-aware pack recommendations are surfaced',
      'met', v_recommended > 0,
      'note', 'Recommendations derive from industry, install context, and Business DNA metadata.'
    ),
    jsonb_build_object(
      'key', 'activation_audit',
      'label', 'Pack activation steps are recorded in the activation log',
      'met', v_activation_logs > 0,
      'note', case when v_active > 0 and v_activation_logs = 0 then 'Activation log should populate after first pack activation.' else null end
    ),
    jsonb_build_object(
      'key', 'productization_framing',
      'label', 'Blueprint productization packs map to catalog seeds without renaming pack_key',
      'met', true,
      'note', 'Five blueprint packs mapped via metadata — Essentials→general_business, Support→support_operations, Operations→general_business, Commerce→e_commerce, Enterprise→enterprise_governance (reserved).'
    ),
    jsonb_build_object(
      'key', 'distinct_from_plans',
      'label', 'Productization packs are distinct from subscription plan tiers',
      'met', true,
      'note', 'Commercial package tiers (starter/growth/business/enterprise) gate licensing at /app/settings/modules — separate from outcome-oriented productization.'
    )
  );
end; $$;

create or replace function public.get_business_packs_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_packs', coalesce((
      select count(*) from public.organization_business_packs where organization_id = v_org_id
    ), 0),
    'available_packs', coalesce((
      select count(*) from public.business_packs bp
      where bp.status in ('active', 'beta') and bp.is_future = false
        and not exists (
          select 1 from public.organization_business_packs obp
          where obp.organization_id = v_org_id and obp.business_pack_id = bp.id
        )
    ), 0),
    'philosophy', 'Activate curated packs — modules, workflows, and install context in one flow.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 15,
      'title', 'Business Packs & Productization Foundation',
      'engine_phase', 'A.43'
    ),
    'mission', 'Package capabilities into clear value-driven solutions — customers buy outcomes, not complexity.',
    'abos_principle', 'Customers buy outcomes. ABOS delivers them through curated packs humans approve.',
    'productization_pack_count', jsonb_array_length(public._bpf_blueprint_productization_packs())
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_business_packs_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_recommended text[];
begin
  perform public._irp_require_permission('business_packs.view');
  v_org_id := public._mta_require_organization();
  perform public._bpf_seed_catalog();

  v_recommended := public._bpf_recommend_pack_keys(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Curated business packs — select, review modules and workflows, activate with human approval, then customize. Integrates Module Marketplace (A.23), Workflow Orchestration (A.42), and Install Engine (A.22).',
    'principles', jsonb_build_array(
      'Select → review → activate → customize',
      'Modules enabled via Module Marketplace Foundation',
      'Workflows registered via Workflow Orchestration scaffold',
      'Install context synced via Install Engine recommendations',
      'Metadata-only — no raw customer content in pack definitions',
      'Industry Blueprints remain complementary — integrate, do not duplicate'
    ),
    'summary', jsonb_build_object(
      'active_count', coalesce((
        select count(*) from public.organization_business_packs obp
        where obp.organization_id = v_org_id
      ), 0),
      'available_count', coalesce((
        select count(*) from public.business_packs bp
        where bp.status in ('active', 'beta') and bp.is_future = false
          and not exists (
            select 1 from public.organization_business_packs obp
            where obp.organization_id = v_org_id and obp.business_pack_id = bp.id
          )
      ), 0),
      'recommended_count', coalesce((
        select count(*) from public.business_packs bp
        where bp.pack_key = any(v_recommended) and bp.status in ('active', 'beta') and bp.is_future = false
      ), 0),
      'future_reserved', coalesce((select count(*) from public.business_packs where is_future), 0),
      'pending_updates', coalesce((
        select count(*) from public.organization_business_packs obp
        join public.business_packs bp on bp.id = obp.business_pack_id
        where obp.organization_id = v_org_id
          and obp.customizations->>'acknowledged_version' is distinct from bp.version
      ), 0),
      'customized_count', coalesce((
        select count(*) from public.organization_business_packs obp
        where obp.organization_id = v_org_id
          and obp.customizations != '{}'::jsonb
      ), 0)
    ),
    'active_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'activation', row_to_json(obp)::jsonb,
        'pack', row_to_json(bp)::jsonb,
        'customization_status', case
          when obp.customizations = '{}'::jsonb then 'default'
          when obp.customizations->>'acknowledged_version' is distinct from bp.version then 'update_available'
          else 'customized'
        end
      ) order by obp.activated_at desc)
      from public.organization_business_packs obp
      join public.business_packs bp on bp.id = obp.business_pack_id
      where obp.organization_id = v_org_id
    ), '[]'::jsonb),
    'available_packs', coalesce((
      select jsonb_agg(row_to_json(bp) order by bp.pack_name)
      from public.business_packs bp
      where bp.status in ('active', 'beta') and bp.is_future = false
        and not exists (
          select 1 from public.organization_business_packs obp
          where obp.organization_id = v_org_id and obp.business_pack_id = bp.id
        )
    ), '[]'::jsonb),
    'recommended_packs', coalesce((
      select jsonb_agg(row_to_json(bp) order by array_position(v_recommended, bp.pack_key))
      from public.business_packs bp
      where bp.pack_key = any(v_recommended) and bp.status in ('active', 'beta') and bp.is_future = false
    ), '[]'::jsonb),
    'future_packs', coalesce((
      select jsonb_agg(jsonb_build_object('pack_key', bp.pack_key, 'pack_name', bp.pack_name, 'industry', bp.industry, 'status', bp.status))
      from public.business_packs bp where bp.is_future = true order by bp.pack_name
    ), '[]'::jsonb),
    'recent_activation_logs', coalesce((
      select jsonb_agg(row_to_json(l) order by l.created_at desc)
      from public.business_pack_activation_log l
      where l.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'module_marketplace', 'Modules activated via organization_modules and tenant_modules sync',
      'workflow_orchestration', 'Workflows registered in aipify_workflow_definitions',
      'install_engine', 'Install recommendations accepted when organization_installations exists',
      'industry_blueprints', 'Vertical profiles at /app/industry-blueprints — complementary to business packs'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 15,
      'title', 'Business Packs & Productization Foundation',
      'engine_phase', 'A.43',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE15_BUSINESS_PACKS_PRODUCTIZATION_FOUNDATION.md'
    ),
    'mission', 'Package capabilities into clear value-driven solutions — customers buy outcomes, not complexity.',
    'abos_principle', 'Customers buy outcomes. ABOS delivers them through curated packs humans approve.',
    'packaging_principles', public._bpf_blueprint_packaging_principles(),
    'productization_packs', public._bpf_blueprint_productization_packs(),
    'modular_addons', public._bpf_blueprint_modular_addons(),
    'self_love_connection', public._bpf_blueprint_self_love_connection(),
    'trust_connection', public._bpf_blueprint_trust_connection(),
    'website_presentation_principles', public._bpf_blueprint_website_presentation_principles(),
    'dogfooding', public._bpf_blueprint_dogfooding(),
    'success_criteria', public._bpf_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._bpf_blueprint_vision_phrases(),
    'integration_links', public._bpf_blueprint_integration_links(),
    'commercial_packages_distinction', jsonb_build_object(
      'productization_layer', 'Outcome-oriented blueprint packs on this dashboard — map to business_packs catalog',
      'subscription_layer', 'Plan tiers starter/growth/business/enterprise gate module licensing via tenant_modules',
      'billing_route', '/app/settings/billing',
      'modules_route', '/app/settings/modules'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._bpf_blueprint_productization_packs() to authenticated;
grant execute on function public._bpf_blueprint_success_criteria(uuid) to authenticated;
