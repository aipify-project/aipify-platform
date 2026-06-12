-- Implementation Blueprint Phase 111 — Industry Packs & Business Specialization Engine
-- Extends Business Packs Foundation Engine (Phase A.43). No new tables. Helpers: _ipsbp111_* only.

-- ---------------------------------------------------------------------------
-- 1. Distinction note (MANDATORY cross-links)
-- ---------------------------------------------------------------------------
create or replace function public._ipsbp111_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 111 — Industry Packs & Business Specialization at /app/business-packs-foundation-engine. THIS blueprint extends Business Packs Foundation A.43 (select → review → activate → customize). Cross-links: Industry Blueprints Phase 70 /app/industry-blueprints (vertical operating models — complementary, integrate not duplicate); Industry Intelligence Foundation A.44 /app/industry-intelligence-foundation-engine; Marketplace Business Pack Phase 69 /app/marketplace (catalog/entitlements); Blueprint Phase 15 Productization (extends A.43 outcome-oriented pack mapping); Blueprint Phase 32 Industry Solutions (extends A.44); Blueprint Phase 19 Marketplace Ecosystem (A.45 industry packs in marketplace); Commerce Companion Phase 110 /app/commerce-companion (Commerce Pack cross-link); Install Engine A.22 /app/install (select industry → activate pack flow); Growth Partner Phase 107 /app/partners (partner specialization); Knowledge Center A.5 /app/knowledge-center-engine (pack FAQs/templates). Helpers use _ipsbp111_* — never collide with _bpf_*.';
$$;

create or replace function public._ipsbp111_mission()
returns text language sql immutable as $$
  select 'Industry-specific Aipify Companion experiences — faster adoption through intelligent specialization humans approve.';
$$;

create or replace function public._ipsbp111_philosophy()
returns text language sql immutable as $$
  select 'One platform, intelligent adaptation — every industry has its language, challenges, and opportunities. Relevance not rigidity.';
$$;

create or replace function public._ipsbp111_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — industry packs orchestrate companions, knowledge, workflows, and dashboards without replacing tenant control. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._ipsbp111_vision()
returns text language sql immutable as $$
  select 'It feels like Aipify was designed specifically for us.';
$$;

create or replace function public._ipsbp111_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'industry_companion', 'label', 'Industry Companion experiences', 'emoji', '🌹', 'description', 'Companions speak the language of each sector — encouraging, contextual, human-centered'),
    jsonb_build_object('key', 'faster_adoption', 'label', 'Faster adoption', 'emoji', '🔔', 'description', 'Pre-configured packs reduce setup friction — select, review, activate at human pace'),
    jsonb_build_object('key', 'intelligent_adaptation', 'label', 'Intelligent adaptation', 'emoji', '🦉', 'description', 'One platform adapts terminology, workflows, and guidance per industry without duplicate engines'),
    jsonb_build_object('key', 'knowledge_templates', 'label', 'Knowledge & templates', 'emoji', '🦉', 'description', 'KC FAQs, templates, and best practices bundled per industry pack'),
    jsonb_build_object('key', 'install_activation_flow', 'label', 'Install activation flow', 'emoji', '🔔', 'description', 'Install Engine guides select industry → review pack → customize → activate → begin journey'),
    jsonb_build_object('key', 'relevance_not_rigidity', 'label', 'Relevance not rigidity', 'emoji', '🌹', 'description', 'Activate only what creates value — customization always available')
  );
$$;

create or replace function public._ipsbp111_business_pack_concept()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'A business pack bundles industry-specialized capabilities — companions, knowledge, workflows, dashboards, automations, templates, and best practices — activated with human approval.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'companions', 'label', 'Industry Companions', 'description', 'Companion tone, terminology, and proactive guidance adapted per pack — Identity Engine cross-link'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'description', 'Pack FAQs, templates, and approved articles — KC A.5 cross-link'),
      jsonb_build_object('key', 'workflows', 'label', 'Workflows', 'description', 'Industry-aligned workflow scaffolds via Workflow Orchestration A.42'),
      jsonb_build_object('key', 'dashboards', 'label', 'Dashboards', 'description', 'Dashboard layout metadata in pack components — thin client panels'),
      jsonb_build_object('key', 'automations', 'label', 'Automations', 'description', 'Trust-aligned automation scaffolds — human approval before sensitive actions'),
      jsonb_build_object('key', 'templates', 'label', 'Templates', 'description', 'KC templates and communication scaffolds per industry'),
      jsonb_build_object('key', 'best_practices', 'label', 'Best practices', 'description', 'Sector patterns from Industry Intelligence A.44 — metadata only')
    ),
    'activation_flow', 'select → review → activate → customize',
    'boundary_note', 'Packs orchestrate existing engines — never duplicate Industry Blueprints Phase 70 apply logic or domain RPCs.'
  );
$$;

create or replace function public._ipsbp111_example_industry_packs()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'pack_key', 'commerce_pack',
      'display_name', 'Commerce Pack',
      'mapped_catalog_pack_key', 'e_commerce',
      'mapping_note', 'Commerce Pack maps to e_commerce catalog seed (pack_key e_commerce) — cross-link Commerce Companion Phase 110',
      'is_future', false,
      'included_capabilities', jsonb_build_array(
        'Order and returns support workflows',
        'Commerce analytics and integration connectivity',
        'Commerce Companion daily briefings cross-link',
        'Product intelligence scaffolding',
        'Supplier and multi-store awareness metadata'
      ),
      'module_routes', jsonb_build_array(
        '/app/commerce-companion',
        '/app/commerce-intelligence',
        '/app/integration-engine',
        '/app/support-ai-engine',
        '/app/analytics-insights-engine'
      )
    ),
    jsonb_build_object(
      'pack_key', 'support_pack',
      'display_name', 'Support Pack',
      'mapped_catalog_pack_key', 'support_operations',
      'mapping_note', 'Support Pack maps to support_operations catalog seed',
      'is_future', false,
      'included_capabilities', jsonb_build_array(
        'Support AI triage and escalation workflows',
        'Knowledge recommendations during replies',
        'Quality Guardian operational checks',
        'FAQ and KC support templates'
      ),
      'module_routes', jsonb_build_array(
        '/app/support-ai-engine',
        '/app/knowledge-center-engine',
        '/app/quality-guardian-engine'
      )
    ),
    jsonb_build_object(
      'pack_key', 'executive_pack',
      'display_name', 'Executive Pack',
      'mapped_catalog_pack_key', 'general_business',
      'mapping_note', 'Executive Pack extends general_business catalog seed with executive modules in blueprint metadata — catalog seed unchanged',
      'is_future', false,
      'included_capabilities', jsonb_build_array(
        'Executive summaries and morning briefings',
        'Strategic decision support cross-links',
        'Organizational memory for leadership context',
        'Operations dashboard visibility'
      ),
      'module_routes', jsonb_build_array(
        '/app/executive',
        '/app/operations-dashboard-engine',
        '/app/organizational-memory-engine',
        '/app/command-center'
      )
    ),
    jsonb_build_object(
      'pack_key', 'sales_expert_pack',
      'display_name', 'Sales Expert Pack',
      'mapped_catalog_pack_key', 'professional_services',
      'mapping_note', 'Sales Expert Pack maps to professional_services catalog seed — Sales Expert OS Phase 33 cross-link',
      'is_future', false,
      'included_capabilities', jsonb_build_array(
        'Client intake and pipeline workflows',
        'Sales enablement knowledge and FAQs',
        'Partner and growth recommendations',
        'Executive reporting for sales leadership'
      ),
      'module_routes', jsonb_build_array(
        '/app/sales-expert-engine',
        '/app/partners',
        '/app/knowledge-center-engine',
        '/app/analytics-insights-engine'
      )
    ),
    jsonb_build_object(
      'pack_key', 'healthcare_pack',
      'display_name', 'Healthcare Pack',
      'mapped_catalog_pack_key', 'healthcare',
      'mapping_note', 'Healthcare Pack maps to reserved healthcare catalog seed — future activation',
      'is_future', true,
      'included_capabilities', jsonb_build_array(
        'Operational guidance scaffolds',
        'Documentation structure templates',
        'Compliance-aware workflow recommendations',
        'Knowledge frameworks for clinical operations'
      ),
      'module_routes', jsonb_build_array(
        '/app/industry-intelligence-foundation-engine',
        '/app/knowledge-center-engine',
        '/app/governance-policy-engine'
      )
    ),
    jsonb_build_object(
      'pack_key', 'education_pack',
      'display_name', 'Education Pack',
      'mapped_catalog_pack_key', 'education',
      'mapping_note', 'Education Pack maps to reserved education catalog seed — future activation',
      'is_future', true,
      'included_capabilities', jsonb_build_array(
        'Institution onboarding workflows',
        'Learning path and training templates',
        'Member and student support guidance',
        'Knowledge structures for educators'
      ),
      'module_routes', jsonb_build_array(
        '/app/learning-training-engine',
        '/app/knowledge-center-engine',
        '/app/support-ai-engine'
      )
    )
  );
$$;

create or replace function public._ipsbp111_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry packs adapt Aipify Companion communication — terminology, proactive guidance, and celebration — without impersonation or pressure.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'industry_welcome', 'prompt', 'Welcome — your Commerce Companion understands retail rhythms and speaks your language.', 'consideration', 'Encouraging specialization — not generic chatbot tone'),
      jsonb_build_object('emoji', '🦉', 'key', 'sector_context', 'prompt', 'Support teams in your industry often prioritize escalation clarity — shall Aipify prepare a review checklist?', 'consideration', 'Wisdom from sector patterns — humans decide'),
      jsonb_build_object('emoji', '🔔', 'key', 'pack_milestone', 'prompt', 'Your Support Pack activation is complete — companion onboarding can begin when you are ready.', 'consideration', 'Gentle milestone — no urgency pressure')
    ),
    'identity_route', '/app/companion-identity-engine',
    'boundary_note', 'Companion adaptation is metadata and tone — never stores raw customer conversations.'
  );
$$;

create or replace function public._ipsbp111_knowledge_center_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry packs contribute KC FAQs, templates, onboarding guides, and best-practice articles — organizations begin with sector-relevant knowledge.',
    'contributions', jsonb_build_array(
      jsonb_build_object('key', 'pack_faqs', 'label', 'Pack FAQs', 'description', 'Per-pack FAQ articles under content/knowledge/aipify/business-packs-foundation-engine/'),
      jsonb_build_object('key', 'kc_templates', 'label', 'KC templates', 'description', 'kc_templates array in business_packs.components metadata'),
      jsonb_build_object('key', 'onboarding_guides', 'label', 'Onboarding guides', 'description', 'Install journey articles cross-linked from pack activation'),
      jsonb_build_object('key', 'best_practices', 'label', 'Best practices', 'description', 'Industry Intelligence A.44 patterns surfaced as starting points')
    ),
    'route', '/app/knowledge-center-engine',
    'faq_slug', 'implementation-blueprint-phase111-faq'
  );
$$;

create or replace function public._ipsbp111_growth_partner_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner ecosystem connects industry pack specialization to certified partners — commerce, executive, support, sales enablement, and future verticals.',
    'specializations', jsonb_build_array(
      jsonb_build_object('key', 'commerce', 'label', 'Commerce specialization', 'description', 'Partners for storefront integration and commerce operations — Commerce Pack cross-link'),
      jsonb_build_object('key', 'executive', 'label', 'Executive specialization', 'description', 'Partners for leadership rollout and executive companion adoption'),
      jsonb_build_object('key', 'support', 'label', 'Support specialization', 'description', 'Partners for support operations and knowledge center setup'),
      jsonb_build_object('key', 'sales_enablement', 'label', 'Sales enablement', 'description', 'Sales Expert Pack and partner certification cross-link'),
      jsonb_build_object('key', 'future_verticals', 'label', 'Future verticals', 'description', 'Healthcare and Education packs reserved — partner specializations scaffold only')
    ),
    'route', '/app/partners',
    'boundary_note', 'Partner recommendations inform — humans choose partners and implementations.'
  );
$$;

create or replace function public._ipsbp111_installation_engine_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Simple install flow — select industry, review pack, customize, activate companion, begin journey. Install Engine A.22 orchestrates discovery and recommendations.',
    'steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'select_industry', 'label', 'Select industry', 'description', 'Install wizard captures industry and system context', 'route', '/app/install'),
      jsonb_build_object('step', 2, 'key', 'review_pack', 'label', 'Review pack', 'description', 'get_business_pack_review() shows modules, workflows, KC templates', 'route', '/app/business-packs-foundation-engine'),
      jsonb_build_object('step', 3, 'key', 'customize', 'label', 'Customize', 'description', 'customize_organization_business_pack() — governance and preferences', 'route', '/app/business-packs-foundation-engine'),
      jsonb_build_object('step', 4, 'key', 'activate_companion', 'label', 'Activate Companion', 'description', 'activate_organization_business_pack() with human approval', 'route', '/app/companion-identity-engine'),
      jsonb_build_object('step', 5, 'key', 'begin_journey', 'label', 'Begin journey', 'description', 'Onboarding checklist and KC guides — calm pacing', 'route', '/app/knowledge-center-engine')
    ),
    'install_route', '/app/install',
    'sync_note', '_bpf_sync_install_context() accepts pack module and workflow recommendations when organization_installations exists.'
  );
$$;

create or replace function public._ipsbp111_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry specialization should reduce overwhelm — activate one pack first, customize freely, grow when ready. No guilt for unused capabilities.',
    'quotes', jsonb_build_array(
      'You do not need every industry capability on day one — relevance beats completeness.',
      'Your pack can evolve as your business learns — customization is always yours.',
      'Sustainable adoption protects wellbeing — rushed enablement creates avoidable stress.',
      'Celebrate choosing the right pack — not enabling everything at once.'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports rollout wellbeing — Business Packs stores pack metadata only.'
  );
$$;

create or replace function public._ipsbp111_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — executive and industry packs provide leadership-appropriate visibility without replacing Command Center or Executive dashboards.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'executive_pack', 'label', 'Executive Pack alignment', 'description', 'Leadership briefings and organizational memory cross-links'),
      jsonb_build_object('key', 'industry_clarity', 'label', 'Industry clarity', 'description', 'Sector-specific summaries help leaders explain adoption to teams'),
      jsonb_build_object('key', 'command_center_distinction', 'label', 'Command Center distinction', 'description', 'Executive ops at /app/command-center — industry packs are specialization layer')
    ),
    'executive_route', '/app/executive',
    'command_center_route', '/app/command-center'
  );
$$;

create or replace function public._ipsbp111_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand what each industry pack includes, how customization works, and that activation requires human approval.',
    'qualities', jsonb_build_array(
      'Transparent — review step shows modules, workflows, KC templates, and governance before activation',
      'Explainable — activation log records each step with metadata only',
      'Customizable — customize_organization_business_pack() never locked after activation',
      'Honest — future packs (Healthcare, Education) marked reserved — no fake activation'
    ),
    'review_route', '/api/aipify/business-packs-foundation-engine/review',
    'metadata_only', true
  );
$$;

create or replace function public._ipsbp111_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relevance not rigidity — industry packs inform and prepare; they never impose unnecessary complexity or restrict customization.',
    'must_avoid', jsonb_build_array(
      'Unnecessary complexity — packs bundle value, not every engine',
      'Overwhelming onboarding — one primary pack first, add-ons when ready',
      'Identical assumptions — industry guidance is starting point, not mandate',
      'Restricting customization — tenants always override, disable, or extend pack settings'
    ),
    'relevance_note', 'Activate only capabilities that create value — unused modules remain available but not forced.'
  );
$$;

create or replace function public._ipsbp111_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify validates industry packs internally before broad release — companion onboarding included.',
    'packs', jsonb_build_array(
      jsonb_build_object('pack', 'Commerce Pack', 'mapped_key', 'e_commerce', 'tenant', 'commerce pilots', 'note', 'E-Commerce seed + Commerce Companion Phase 110 cross-link'),
      jsonb_build_object('pack', 'Executive Pack', 'mapped_key', 'general_business', 'tenant', 'aipify-group', 'note', 'Executive modules on General Business — internal leadership validation'),
      jsonb_build_object('pack', 'Support Pack', 'mapped_key', 'support_operations', 'tenant', 'unonight', 'note', 'First customer pilot — support operations specialization'),
      jsonb_build_object('pack', 'Sales Expert Pack', 'mapped_key', 'professional_services', 'tenant', 'sales pilots', 'note', 'Sales Expert OS Phase 33 + professional services seed')
    ),
    'companion_onboarding', 'Companion identity and proactive guidance validated during pack activation — metadata only.'
  );
$$;

create or replace function public._ipsbp111_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'industry_blueprints', 'label', 'Industry Blueprints (Phase 70)', 'route', '/app/industry-blueprints'),
    jsonb_build_object('key', 'industry_intelligence', 'label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace (Phase 69)', 'route', '/app/marketplace'),
    jsonb_build_object('key', 'commerce_companion', 'label', 'Commerce Companion (Phase 110)', 'route', '/app/commerce-companion'),
    jsonb_build_object('key', 'install_engine', 'label', 'Install Engine (A.22)', 'route', '/app/install'),
    jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner (Phase 107)', 'route', '/app/partners'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'module_marketplace', 'label', 'Module Marketplace (A.23)', 'route', '/app/module-marketplace-foundation-engine'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity', 'route', '/app/companion-identity-engine')
  );
$$;

create or replace function public._ipsbp111_success_criteria(p_organization_id uuid)
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
      'key', 'industry_pack_activated',
      'label', 'Organization activated an industry-aligned business pack',
      'met', v_active > 0,
      'note', case when v_active = 0 then 'Review an example industry pack and activate its mapped catalog pack.' else null end
    ),
    jsonb_build_object(
      'key', 'catalog_available',
      'label', 'Industry pack catalog seeds are available',
      'met', v_catalog > 0
    ),
    jsonb_build_object(
      'key', 'context_recommendations',
      'label', 'Install and industry context surfaces pack recommendations',
      'met', v_recommended > 0,
      'note', 'Recommendations derive from industry, install context, and Business DNA metadata.'
    ),
    jsonb_build_object(
      'key', 'activation_audit',
      'label', 'Pack activation steps recorded in activation log',
      'met', v_activation_logs > 0,
      'note', case when v_active > 0 and v_activation_logs = 0 then 'Activation log should populate after first pack activation.' else null end
    ),
    jsonb_build_object(
      'key', 'example_pack_mapping',
      'label', 'Example industry packs map to catalog pack_key seeds without rename',
      'met', true,
      'note', 'Commerce→e_commerce, Support→support_operations, Executive→general_business, Sales Expert→professional_services, Healthcare→healthcare (reserved), Education→education (reserved).'
    ),
    jsonb_build_object(
      'key', 'install_flow_documented',
      'label', 'Install flow documented — select → review → customize → activate → begin journey',
      'met', true,
      'note', 'Five-step flow in installation_engine_connection metadata — humans approve each activation.'
    )
  );
end; $$;

create or replace function public._ipsbp111_blueprint_block(p_organization_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 111,
    'title', 'Industry Packs & Business Specialization Engine',
    'engine_phase', 'A.43',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE111_INDUSTRY_PACKS_BUSINESS_SPECIALIZATION.md',
    'route', '/app/business-packs-foundation-engine',
    'distinction_note', public._ipsbp111_distinction_note(),
    'mission', public._ipsbp111_mission(),
    'philosophy', public._ipsbp111_philosophy(),
    'abos_principle', public._ipsbp111_abos_principle(),
    'objectives', public._ipsbp111_objectives(),
    'business_pack_concept', public._ipsbp111_business_pack_concept(),
    'example_industry_packs', public._ipsbp111_example_industry_packs(),
    'companion_adaptation', public._ipsbp111_companion_adaptation(),
    'knowledge_center_connection', public._ipsbp111_knowledge_center_connection(),
    'growth_partner_connection', public._ipsbp111_growth_partner_connection(),
    'installation_engine_connection', public._ipsbp111_installation_engine_connection(),
    'self_love_connection', public._ipsbp111_self_love_connection(),
    'leadership_connection', public._ipsbp111_leadership_connection(),
    'trust_connection', public._ipsbp111_trust_connection(),
    'limitation_principles', public._ipsbp111_limitation_principles(),
    'dogfooding', public._ipsbp111_dogfooding(),
    'success_criteria', public._ipsbp111_success_criteria(p_organization_id),
    'vision', public._ipsbp111_vision(),
    'integration_links', public._ipsbp111_integration_links(),
    'privacy_note', 'Industry pack blueprint metadata only — no raw customer content. Humans approve activation and customization.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Card RPC — preserve ALL Phase 15 fields; append Phase 111 blueprint
-- ---------------------------------------------------------------------------
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
      'phase', 111,
      'title', 'Industry Packs & Business Specialization Engine',
      'engine_phase', 'A.43',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE111_INDUSTRY_PACKS_BUSINESS_SPECIALIZATION.md',
      'extends_phase', 15,
      'extends_title', 'Business Packs & Productization Foundation'
    ),
    'mission', public._ipsbp111_mission(),
    'abos_principle', public._ipsbp111_abos_principle(),
    'productization_pack_count', jsonb_array_length(public._bpf_blueprint_productization_packs()),
    'example_industry_pack_count', jsonb_array_length(public._ipsbp111_example_industry_packs()),
    'ipsbp111_distinction_note', public._ipsbp111_distinction_note(),
    'ipsbp111_vision', public._ipsbp111_vision()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 15 fields; append Phase 111 blueprint
-- ---------------------------------------------------------------------------
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
      'phase', 111,
      'title', 'Industry Packs & Business Specialization Engine',
      'engine_phase', 'A.43',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE111_INDUSTRY_PACKS_BUSINESS_SPECIALIZATION.md',
      'extends_phase', 15,
      'extends_title', 'Business Packs & Productization Foundation',
      'extends_doc', 'IMPLEMENTATION_BLUEPRINT_PHASE15_BUSINESS_PACKS_PRODUCTIZATION_FOUNDATION.md'
    ),
    'mission', public._ipsbp111_mission(),
    'abos_principle', public._ipsbp111_abos_principle(),
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
    ),
    'ipsbp111_distinction_note', public._ipsbp111_distinction_note(),
    'industry_packs_business_specialization_blueprint', public._ipsbp111_blueprint_block(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ipsbp111_distinction_note() to authenticated;
grant execute on function public._ipsbp111_mission() to authenticated;
grant execute on function public._ipsbp111_philosophy() to authenticated;
grant execute on function public._ipsbp111_abos_principle() to authenticated;
grant execute on function public._ipsbp111_vision() to authenticated;
grant execute on function public._ipsbp111_objectives() to authenticated;
grant execute on function public._ipsbp111_business_pack_concept() to authenticated;
grant execute on function public._ipsbp111_example_industry_packs() to authenticated;
grant execute on function public._ipsbp111_companion_adaptation() to authenticated;
grant execute on function public._ipsbp111_knowledge_center_connection() to authenticated;
grant execute on function public._ipsbp111_growth_partner_connection() to authenticated;
grant execute on function public._ipsbp111_installation_engine_connection() to authenticated;
grant execute on function public._ipsbp111_self_love_connection() to authenticated;
grant execute on function public._ipsbp111_leadership_connection() to authenticated;
grant execute on function public._ipsbp111_trust_connection() to authenticated;
grant execute on function public._ipsbp111_limitation_principles() to authenticated;
grant execute on function public._ipsbp111_dogfooding() to authenticated;
grant execute on function public._ipsbp111_integration_links() to authenticated;
grant execute on function public._ipsbp111_success_criteria(uuid) to authenticated;
grant execute on function public._ipsbp111_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'business-packs-foundation-engine-blueprint-phase111', 'Industry Packs & Business Specialization (ABOS Phase 111)',
  'Industry-specific Companion experiences — intelligent specialization, install flow, and example packs mapped to A.43 catalog seeds.',
  'authenticated', 132
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'business-packs-foundation-engine-blueprint-phase111' and tenant_id is null
);
