-- Implementation Blueprint Phase 112 — Skills & Extensions Marketplace Engine
-- Extends Marketplace & Business Pack Ecosystem repo Phase 69. No new tables.
-- Distinct from Skill Store Phase 63 at /app/skills (installation engine — cross-link).
-- Distinct from Module Marketplace A.23 at /app/module-marketplace-foundation-engine.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._sembp112_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 112 — Skills & Extensions Marketplace Engine at /app/marketplace. Extends Marketplace & Business Pack Ecosystem repo Phase 69 (_mkp_*) and preserves ALL baseline dashboard and card fields. Trusted marketplace of Skills and Extensions expanding Companion capabilities — safe innovation, wisdom guides expansion. Skill Store Phase 63 at /app/skills is the installation engine for individual skills — marketplace uses install_tenant_skill via precheck/install RPCs, NOT duplicate. SkillOS Phase 22 at /platform/skills and lib/core/skills/registry.ts — global skill definitions. Module Marketplace A.23 at /app/module-marketplace-foundation-engine — module licensing, distinct from skills marketplace. Marketplace Governance Phase 90 at /app/marketplace-governance — QA, fraud, policy cross-link for skill quality assurance. Marketplace Partner Ecosystem A.45 + Blueprint 19 at /app/marketplace-partner-ecosystem-foundation-engine — partner offerings. Growth Partner Phase 107 at /app/partners — partner-published skills/packs. Industry Packs Blueprint Phase 111 at /app/business-packs-foundation-engine — industry enhancements cross-link. API Platform A.21 at /app/api-platform-engine — developer ecosystem cross-link. Trust & Action Phase 30 at /app/approvals — permission approval for installs. Helpers use _sembp112_* — never collide with _mkp_*.';
$$;

create or replace function public._sembp112_mission()
returns text language sql immutable as $$
  select 'Trusted marketplace of Skills and Extensions expanding Companion capabilities.';
$$;

create or replace function public._sembp112_philosophy()
returns text language sql immutable as $$
  select 'Ecosystems strengthen platforms — safe innovation, wisdom guides expansion. Organizations activate what creates value; every item declares permissions before installation.';
$$;

create or replace function public._sembp112_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Skills & Extensions Marketplace extends Phase 69 governed catalog. Aipify informs and prepares install prechecks; humans approve permissions and activation. Skill Store remains the installation engine.';
$$;

create or replace function public._sembp112_vision()
returns text language sql immutable as $$
  select 'Aipify evolves alongside our needs.';
$$;

create or replace function public._sembp112_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trusted_discovery', 'label', 'Trusted discovery', 'emoji', '🦉', 'description', 'Browse Skills and Extensions with transparent permissions, risk level, and deployment compatibility'),
    jsonb_build_object('key', 'governed_installation', 'label', 'Governed installation', 'emoji', '🔔', 'description', 'Precheck, approval for medium/high risk, install via Skill Store — org control over activate and remove'),
    jsonb_build_object('key', 'extension_ecosystem', 'label', 'Extension ecosystem', 'emoji', '🌹', 'description', 'Integrations, workflow enhancements, widgets, industry connectors, platform capabilities'),
    jsonb_build_object('key', 'quality_assurance', 'label', 'Quality assurance', 'emoji', '🦉', 'description', 'Security, reliability, UX, documentation — Marketplace Governance Phase 90 cross-link'),
    jsonb_build_object('key', 'growth_partner_offerings', 'label', 'Growth Partner offerings', 'emoji', '🌹', 'description', 'Partner skills, industry packs, templates, advisory, workflow accelerators'),
    jsonb_build_object('key', 'developer_ecosystem', 'label', 'Developer ecosystem', 'emoji', '🔔', 'description', 'APIs, docs, testing environments, submission guidelines, certification — API Platform A.21 cross-link')
  );
$$;

create or replace function public._sembp112_skills_marketplace_concept()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Skills marketplace — organizations control the full lifecycle; Aipify never auto-activates without governance.',
    'lifecycle', jsonb_build_array(
      jsonb_build_object('step', 'install', 'label', 'Install', 'description', 'Precheck plan, deployment, dependencies, modules, Policy Engine — then install included Skills via install_tenant_skill'),
      jsonb_build_object('step', 'configure', 'label', 'Configure', 'description', 'Review settings, permissions, and included assets — admin configures before activation'),
      jsonb_build_object('step', 'activate', 'label', 'Activate', 'description', 'Enable installed item — entitlement and audit events recorded'),
      jsonb_build_object('step', 'update', 'label', 'Update', 'description', 'Update available status — review changelog and permissions before applying'),
      jsonb_build_object('step', 'remove', 'label', 'Remove', 'description', 'Disable or uninstall safely — configuration archived, business data retained per Phase 69 policy')
    ),
    'skill_store_route', '/app/skills',
    'boundary_note', 'Marketplace discovers and governs packs — Skill Store Phase 63 executes individual skill installs.'
  );
$$;

create or replace function public._sembp112_skill_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Skill categories — mapped to registry skills and official marketplace catalog items where available.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'commerce',
        'label', 'Commerce Skills',
        'description', 'Product intelligence, quality monitoring, and commerce operations',
        'example_skills', jsonb_build_array(
          jsonb_build_object('skill_id', 'quality-guardian', 'label', 'Quality Guardian', 'marketplace_item', 'aipify.website_quality_pack'),
          jsonb_build_object('skill_id', 'image-guardian', 'label', 'Image Guardian', 'marketplace_item', 'aipify.website_quality_pack'),
          jsonb_build_object('skill_id', 'performance-guardian', 'label', 'Performance Guardian', 'marketplace_item', 'aipify.website_quality_pack')
        ),
        'cross_link', '/app/commerce-intelligence'
      ),
      jsonb_build_object(
        'key', 'support',
        'label', 'Support Skills',
        'description', 'Support AI, knowledge, FAQ, and escalation workflows',
        'example_skills', jsonb_build_array(
          jsonb_build_object('skill_id', 'knowledge-center', 'label', 'Knowledge Center', 'marketplace_item', 'aipify.support_starter_pack'),
          jsonb_build_object('skill_id', 'knowledge-center', 'label', 'Knowledge Center Starter', 'marketplace_item', 'aipify.knowledge_center_starter_pack')
        ),
        'cross_link', '/app/support-ai-engine'
      ),
      jsonb_build_object(
        'key', 'executive',
        'label', 'Executive Skills',
        'description', 'Briefings, command center summaries, and executive visibility',
        'example_skills', jsonb_build_array(
          jsonb_build_object('skill_id', 'executive-briefing', 'label', 'Executive Briefing', 'marketplace_item', 'aipify.executive_briefing_pack'),
          jsonb_build_object('skill_id', 'executive-briefing', 'label', 'Executive Briefing (Desktop)', 'marketplace_item', 'aipify.desktop_companion_pack')
        ),
        'cross_link', '/app/command-center'
      ),
      jsonb_build_object(
        'key', 'growth_partner',
        'label', 'Growth Partner Skills',
        'description', 'Partner-published skills, packs, and workflow accelerators',
        'example_skills', jsonb_build_array(
          jsonb_build_object('skill_id', 'partner_offering', 'label', 'Certified partner offerings', 'marketplace_item', null, 'route', '/app/partners'),
          jsonb_build_object('skill_id', 'industry_pack', 'label', 'Industry pack templates', 'marketplace_item', null, 'route', '/app/business-packs-foundation-engine')
        ),
        'cross_link', '/app/partners'
      ),
      jsonb_build_object(
        'key', 'personal_companion',
        'label', 'Personal Companion Skills',
        'description', 'Desktop Companion, memory, learning, and identity-adjacent capabilities',
        'example_skills', jsonb_build_array(
          jsonb_build_object('skill_id', 'desktop-companion', 'label', 'Desktop Companion', 'marketplace_item', 'aipify.desktop_companion_pack'),
          jsonb_build_object('skill_id', 'memory-engine', 'label', 'Memory Engine', 'marketplace_item', 'aipify.memory_learning_pack'),
          jsonb_build_object('skill_id', 'approval-center', 'label', 'Approval Center', 'marketplace_item', 'aipify.governance_starter_pack')
        ),
        'cross_link', '/app/companion-identity-engine'
      )
    )
  );
$$;

create or replace function public._sembp112_extensions_marketplace()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Extensions marketplace — integrations and platform capabilities beyond individual Skills.',
    'extension_types', jsonb_build_array(
      jsonb_build_object('key', 'integrations', 'label', 'Integrations', 'description', 'Connector packs and integration workflows — Integration Engine A.8 cross-link', 'route', '/app/integration-engine'),
      jsonb_build_object('key', 'workflow_enhancements', 'label', 'Workflow enhancements', 'description', 'Workflow templates bundled in business packs — Workflow Orchestration A.42 cross-link', 'route', '/app/workflow-orchestration-engine'),
      jsonb_build_object('key', 'widgets', 'label', 'Widgets', 'description', 'Embeddable UI and dashboard widgets from App Ecosystem Phase 75', 'route', '/app/apps'),
      jsonb_build_object('key', 'industry_connectors', 'label', 'Industry connectors', 'description', 'Vertical-specific connectors and industry pack assets — Industry Packs Blueprint Phase 111', 'route', '/app/business-packs-foundation-engine'),
      jsonb_build_object('key', 'platform_capabilities', 'label', 'Platform capabilities', 'description', 'Module activation scaffolds — Module Marketplace A.23 distinct from skills', 'route', '/app/module-marketplace-foundation-engine')
    ),
    'boundary_note', 'Extensions declare permissions and risk — humans approve before activation.'
  );
$$;

create or replace function public._sembp112_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion adaptation — marketplace recommendations align with org needs; wisdom guides expansion.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'permissions_first', 'prompt', 'This pack includes Support and Knowledge Skills — would reviewing permissions before install feel wise?', 'consideration', 'Context before activation — humans approve'),
      jsonb_build_object('emoji', '🌹', 'key', 'gradual_adoption', 'prompt', 'Governance Starter Pack fits your approval workflow — shall Aipify prepare a configure checklist?', 'consideration', 'Gradual adoption — not overwhelming catalog growth'),
      jsonb_build_object('emoji', '🔔', 'key', 'quality_cross_link', 'prompt', 'Marketplace Governance reviewed this item — quality signals look healthy. Ready to precheck install?', 'consideration', 'Phase 90 QA cross-link — transparency before install')
    ),
    'boundary_note', 'Companion scaffolds discovery — never auto-installs without governance.'
  );
$$;

create or replace function public._sembp112_skill_quality_assurance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Skill quality assurance — not everything that can be listed should be published.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'security', 'label', 'Security review', 'description', 'Permission scope, data access, and trust alignment — Security & Compliance pack cross-link'),
      jsonb_build_object('key', 'reliability', 'label', 'Reliability', 'description', 'Install success, update stability, and dependency integrity'),
      jsonb_build_object('key', 'ux', 'label', 'User experience', 'description', 'Clear descriptions, deployment compatibility, and onboarding guidance'),
      jsonb_build_object('key', 'documentation', 'label', 'Documentation', 'description', 'Knowledge Center articles, FAQ, and developer docs linked from item detail'),
      jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment', 'description', 'Policy Engine, Approval Center, and Marketplace Governance Phase 90 pre/post publish review')
    ),
    'marketplace_governance_route', '/app/marketplace-governance',
    'boundary_note', 'QA is cross-link scaffolding — Phase 90 Quality Guardian remains authoritative for publish governance.'
  );
$$;

create or replace function public._sembp112_growth_partner_marketplace()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner marketplace — certified partner skills, packs, and advisory offerings.',
    'offering_types', jsonb_build_array(
      jsonb_build_object('key', 'specialized_skills', 'label', 'Specialized Skills', 'description', 'Partner-certified operational and domain Skills', 'route', '/app/partners'),
      jsonb_build_object('key', 'industry_packs', 'label', 'Industry packs', 'description', 'Vertical templates and industry enhancements — Blueprint Phase 111 cross-link', 'route', '/app/business-packs-foundation-engine'),
      jsonb_build_object('key', 'templates', 'label', 'Templates', 'description', 'Workflow, email, and knowledge templates from partner catalog', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'advisory', 'label', 'Advisory offerings', 'description', 'Implementation and growth advisory — Growth Partner Phase 107', 'route', '/app/partners'),
      jsonb_build_object('key', 'workflow_accelerators', 'label', 'Workflow accelerators', 'description', 'Pre-built workflow packs — Workflow Orchestration A.42 cross-link', 'route', '/app/workflow-orchestration-engine')
    ),
    'boundary_note', 'Partner offerings require certification and human approval before tenant install.'
  );
$$;

create or replace function public._sembp112_developer_ecosystem()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Developer ecosystem — build, test, and submit Skills and Extensions with governance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'apis', 'label', 'APIs', 'description', 'Tenant-scoped API keys and webhooks — API Platform A.21', 'route', '/app/api-platform-engine'),
      jsonb_build_object('key', 'docs', 'label', 'Documentation', 'description', 'Developer portal, manifest spec, SDK — App Ecosystem Phase 75', 'route', '/developers'),
      jsonb_build_object('key', 'testing_envs', 'label', 'Testing environments', 'description', 'Sandbox runtime and install precheck before publish', 'route', '/app/apps'),
      jsonb_build_object('key', 'submission_guidelines', 'label', 'Submission guidelines', 'description', 'Permissions, risk level, deployment support declarations required'),
      jsonb_build_object('key', 'certification', 'label', 'Certification', 'description', 'Partner certification tracks — Phase 91 cross-link', 'route', '/app/partners')
    ),
    'developer_settings_route', '/app/settings/developer',
    'boundary_note', 'Developer submissions enter governance queue — Phase 90 review before general catalog.'
  );
$$;

create or replace function public._sembp112_installation_experience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Installation experience — browse → review → permissions → install → configure → activate.',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'browse', 'label', 'Browse', 'description', 'Catalog and recommendations — filter by type, category, industry, risk'),
      jsonb_build_object('order', 2, 'key', 'review_details', 'label', 'Review details', 'description', 'Item detail with versions, reviews, included Skills, and documentation'),
      jsonb_build_object('order', 3, 'key', 'understand_permissions', 'label', 'Understand permissions', 'description', 'Required permissions, risk level, deployment compatibility — precheck_marketplace_install'),
      jsonb_build_object('order', 4, 'key', 'install', 'label', 'Install', 'description', 'install_marketplace_item with approval when medium/high risk — Skill Store cross-link'),
      jsonb_build_object('order', 5, 'key', 'configure', 'label', 'Configure', 'description', 'Settings and included asset activation — admin review'),
      jsonb_build_object('order', 6, 'key', 'activate', 'label', 'Activate', 'description', 'Enable installed item — entitlement active, orchestration event emitted')
    ),
    'skill_store_route', '/app/skills',
    'approvals_route', '/app/approvals',
    'boundary_note', 'Humans approve permissions and activation — no silent install paths.'
  );
$$;

create or replace function public._sembp112_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — gradual adoption; organizations need not install everything at once.',
    'quotes', jsonb_build_array(
      'Your marketplace can grow at a human pace — activate packs that create value, not catalog anxiety.',
      'Permission review before install protects wellbeing — rushed activations create avoidable operational stress.',
      'Not every featured pack needs your energy today — wisdom guides which Skills deserve attention.',
      'Rest is part of sustainable platform expansion — gradual adoption beats overwhelming installs.'
    ),
    'practices', jsonb_build_array(
      'Review permissions calmly before install — no urgency pressure',
      'Celebrate thoughtful pack selection — not only rapid catalog growth',
      'Disable or uninstall safely when value no longer fits — org control preserved',
      'Cross-link Self Love A.76 rhythms for sustainable adoption pacing'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; marketplace stores catalog metadata, not personal content.'
  );
$$;

create or replace function public._sembp112_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — strategic capability expansion with governance visibility.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'capability_roadmap', 'label', 'Capability roadmap', 'description', 'Leaders see installed packs, updates available, and recommended next steps'),
      jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility', 'description', 'Risk level and approval requirements transparent before org-wide activation'),
      jsonb_build_object('key', 'partner_strategy', 'label', 'Partner strategy', 'description', 'Growth Partner and certified offerings align with org goals — Phase 107 cross-link'),
      jsonb_build_object('key', 'governance_oversight', 'label', 'Governance oversight', 'description', 'Approval Center and Marketplace Governance — leaders govern expansion')
    ),
    'executive_route', '/app/executive-insights-engine',
    'approvals_route', '/app/approvals',
    'boundary_note', 'Leadership sees aggregate install metadata — not cross-tenant marketplace analytics.'
  );
$$;

create or replace function public._sembp112_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent marketplace installs — what Skills access, permissions, developer transparency.',
    'users_should_see', jsonb_build_array(
      'Required permissions and risk level on every item before install',
      'Precheck results — missing modules, dependencies, deployment mode',
      'Approval requirement for medium/high risk items — Trust & Action Phase 30 cross-link',
      'Developer author type, documentation ref, and included Skills list',
      'Audit events via marketplace install logs — install, enable, disable, uninstall'
    ),
    'operators_should_understand', jsonb_build_array(
      'Marketplace uses Skill Store install_tenant_skill — not parallel install logic',
      'Phase 90 governance reviews quality before and after publish',
      'Restricted items excluded from general catalog — policy enforced server-side',
      'Tenant isolation mandatory — no cross-tenant catalog or install data'
    ),
    'approvals_route', '/app/approvals',
    'audit_note', 'marketplace.item.installed orchestration events — metadata only, no PII in payloads.'
  );
$$;

create or replace function public._sembp112_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — responsible innovation in marketplace expansion.',
    'must_avoid', jsonb_build_array(
      'Unnecessary complexity — too many packs activated without value review',
      'Security sacrifice — bypassing permission precheck or approval for high-risk items',
      'Low-quality submissions in general catalog without Phase 90 governance review',
      'Ungoverned growth — auto-install without admin review and Policy Engine validation'
    ),
    'org_control', 'Organizations activate what creates value — install, configure, activate, update, remove under org control.',
    'boundary_note', 'Marketplace scaffolds discovery — humans govern every sensitive activation.'
  );
$$;

create or replace function public._sembp112_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — Aipify uses its own marketplace for Commerce, Executive, Support Skills and partner contributions.',
    'commerce_skills', jsonb_build_array(
      jsonb_build_object('pack', 'Website Quality Pack', 'item_key', 'aipify.website_quality_pack', 'skills', jsonb_build_array('quality-guardian', 'image-guardian', 'performance-guardian')),
      jsonb_build_object('pack', 'Memory & Learning Pack', 'item_key', 'aipify.memory_learning_pack', 'skills', jsonb_build_array('memory-engine'))
    ),
    'executive_skills', jsonb_build_array(
      jsonb_build_object('pack', 'Executive Briefing Pack', 'item_key', 'aipify.executive_briefing_pack', 'skills', jsonb_build_array('executive-briefing')),
      jsonb_build_object('pack', 'Desktop Companion Pack', 'item_key', 'aipify.desktop_companion_pack', 'skills', jsonb_build_array('desktop-companion', 'executive-briefing'))
    ),
    'support_skills', jsonb_build_array(
      jsonb_build_object('pack', 'Support Starter Pack', 'item_key', 'aipify.support_starter_pack', 'skills', jsonb_build_array('knowledge-center')),
      jsonb_build_object('pack', 'Knowledge Center Starter Pack', 'item_key', 'aipify.knowledge_center_starter_pack', 'skills', jsonb_build_array('knowledge-center'))
    ),
    'growth_partner_contributions', jsonb_build_object(
      'route', '/app/partners',
      'note', 'Certified partner offerings enter marketplace via A.45 + Phase 107 governance'
    ),
    'developer_onboarding', jsonb_build_object(
      'route', '/developers',
      'note', 'Internal and partner developers use API Platform A.21 + App Ecosystem Phase 75 submission flow'
    ),
    'unonight_pilot', 'Unonight pilot validates official seed packs before public catalog expansion.'
  );
$$;

create or replace function public._sembp112_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Aipify evolves alongside our needs.',
    'Ecosystems strengthen platforms — safe innovation, wisdom guides expansion.',
    '🦉 Review permissions before install — context before activation.',
    '🌹 Activate packs that fit your organization — gradual adoption over catalog anxiety.',
    '🔔 Marketplace Governance ensures quality — Phase 90 cross-link for assurance.',
    'Skill Store executes installs — marketplace governs discovery and precheck.',
    'Organizations control install, configure, activate, update, and remove.',
    'Aipify informs and prepares — humans approve every governed install.'
  );
$$;

create or replace function public._sembp112_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'skill_store_phase63', 'label', 'Skill Store (Phase 63)', 'route', '/app/skills', 'note', 'Installation engine for individual skills — install_tenant_skill'),
    jsonb_build_object('key', 'skillos_phase22', 'label', 'SkillOS (Phase 22)', 'route', '/platform/skills', 'note', 'Global skill definitions and registry governance'),
    jsonb_build_object('key', 'module_marketplace_a23', 'label', 'Module Marketplace (A.23)', 'route', '/app/module-marketplace-foundation-engine', 'note', 'Module licensing — distinct from skills marketplace'),
    jsonb_build_object('key', 'marketplace_governance_phase90', 'label', 'Marketplace Governance (Phase 90)', 'route', '/app/marketplace-governance', 'note', 'QA, fraud, policy — skill quality assurance cross-link'),
    jsonb_build_object('key', 'marketplace_partner_a45', 'label', 'Marketplace Partner Ecosystem (A.45)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Partner offerings and certification workflow'),
    jsonb_build_object('key', 'growth_partner_phase107', 'label', 'Growth Partner Ecosystem (Phase 107)', 'route', '/app/partners', 'note', 'Partner-published skills and packs'),
    jsonb_build_object('key', 'industry_packs_phase111', 'label', 'Industry Packs (Blueprint Phase 111)', 'route', '/app/business-packs-foundation-engine', 'note', 'Industry enhancements cross-link'),
    jsonb_build_object('key', 'api_platform_a21', 'label', 'API Platform (A.21)', 'route', '/app/api-platform-engine', 'note', 'Developer APIs and webhooks'),
    jsonb_build_object('key', 'trust_actions_phase30', 'label', 'Trust & Action (Phase 30)', 'route', '/app/approvals', 'note', 'Permission approval for installs'),
    jsonb_build_object('key', 'app_ecosystem_phase75', 'label', 'App Ecosystem (Phase 75)', 'route', '/app/apps', 'note', 'Developer portal and sandbox extensions'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Marketplace guides and FAQ')
  );
$$;

create or replace function public._sembp112_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_catalog int := 0;
  v_installed int := 0;
  v_updates int := 0;
begin
  perform public._mkp_seed_catalog();
  select count(*) into v_catalog from public.marketplace_items where status = 'published';
  select count(*) into v_installed from public.tenant_marketplace_installs
    where tenant_id = p_tenant_id and status in ('installed', 'active');
  select count(*) into v_updates from public.tenant_marketplace_installs
    where tenant_id = p_tenant_id and status = 'update_available';

  return jsonb_build_object(
    'catalog_count', v_catalog,
    'installed_count', v_installed,
    'updates_available', v_updates,
    'skill_categories', jsonb_array_length(public._sembp112_skill_categories()->'categories'),
    'install_flow_steps', jsonb_array_length(public._sembp112_installation_experience()->'steps'),
    'objectives_documented', jsonb_array_length(public._sembp112_objectives()),
    'qa_dimensions', jsonb_array_length(public._sembp112_skill_quality_assurance()->'dimensions'),
    'integration_links', jsonb_array_length(public._sembp112_integration_links()),
    'companion_examples', jsonb_array_length(public._sembp112_companion_adaptation()->'examples'),
    'privacy_note', 'Aggregate marketplace counts and blueprint scaffolds only — no cross-tenant catalog browsing or PII.'
  );
end; $$;

create or replace function public._sembp112_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_catalog int := 0;
  v_installed int := 0;
begin
  perform public._mkp_seed_catalog();
  v_engagement := public._sembp112_engagement_summary(p_tenant_id);
  v_catalog := coalesce((v_engagement->>'catalog_count')::int, 0);
  v_installed := coalesce((v_engagement->>'installed_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'trusted_catalog',
      'label', 'Trusted catalog — official seed packs published with permissions declared',
      'met', v_catalog >= 8,
      'note', case when v_catalog < 8 then 'Seed catalog should expose at least 8 official packs.' else null end
    ),
    jsonb_build_object(
      'key', 'governed_install_flow',
      'label', 'Governed install flow — browse through activate documented (6 steps)',
      'met', jsonb_array_length(public._sembp112_installation_experience()->'steps') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'skill_categories',
      'label', 'Skill categories — Commerce, Support, Executive, Growth Partner, Personal Companion',
      'met', jsonb_array_length(public._sembp112_skill_categories()->'categories') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'quality_assurance',
      'label', 'Quality assurance dimensions — security, reliability, UX, documentation, governance',
      'met', jsonb_array_length(public._sembp112_skill_quality_assurance()->'dimensions') >= 5,
      'note', 'Cross-link Marketplace Governance Phase 90 for publish review.'
    ),
    jsonb_build_object(
      'key', 'tenant_install_activity',
      'label', 'Tenant install activity — at least one governed install or catalog ready',
      'met', v_installed >= 1 or v_catalog >= 1,
      'note', case when v_installed < 1 then 'Install a pack from catalog to complete tenant activity criterion.' else null end
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 69 baseline fields preserved on dashboard and card',
      'met', to_regclass('public.marketplace_items') is not null,
      'note', '_mkp_* tables and RPC behavior intact'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — Skill Store install engine, marketplace governs discovery',
      'met', true,
      'note', 'Humans approve; Aipify informs and prepares.'
    )
  );
end; $$;

create or replace function public._sembp112_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 112 — Skills & Extensions Marketplace Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE112_SKILLS_EXTENSIONS_MARKETPLACE.md',
    'engine_phase', 'Repo Phase 69 Marketplace & Business Pack Ecosystem',
    'route', '/app/marketplace',
    'mapping_note', 'ABOS Blueprint Phase 112 extends Phase 69 — trusted Skills and Extensions marketplace. Skill Store Phase 63 is install engine.',
    'distinction_note', public._sembp112_distinction_note(),
    'mission', public._sembp112_mission(),
    'philosophy', public._sembp112_philosophy(),
    'abos_principle', public._sembp112_abos_principle(),
    'objectives', public._sembp112_objectives(),
    'skills_marketplace_concept', public._sembp112_skills_marketplace_concept(),
    'skill_categories', public._sembp112_skill_categories(),
    'extensions_marketplace', public._sembp112_extensions_marketplace(),
    'companion_adaptation', public._sembp112_companion_adaptation(),
    'skill_quality_assurance', public._sembp112_skill_quality_assurance(),
    'growth_partner_marketplace', public._sembp112_growth_partner_marketplace(),
    'developer_ecosystem', public._sembp112_developer_ecosystem(),
    'installation_experience', public._sembp112_installation_experience(),
    'self_love_connection', public._sembp112_self_love_connection(),
    'leadership_connection', public._sembp112_leadership_connection(),
    'trust_connection', public._sembp112_trust_connection(),
    'limitation_principles', public._sembp112_limitation_principles(),
    'dogfooding', public._sembp112_dogfooding(),
    'success_criteria', public._sembp112_success_criteria(p_tenant_id),
    'vision', public._sembp112_vision(),
    'vision_phrases', public._sembp112_vision_phrases(),
    'integration_links', public._sembp112_integration_links(),
    'engagement_summary', public._sembp112_engagement_summary(p_tenant_id),
    'privacy_note', 'Skills & Extensions Marketplace blueprint data is catalog metadata and governance scaffolds only. No auto-install without approval. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Card RPC — preserve ALL baseline fields; append Phase 112
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._mkp_seed_catalog();
  v_engagement := public._sembp112_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'catalog_count', (select count(*) from public.marketplace_items where status = 'published'),
    'installed_count', (select count(*) from public.tenant_marketplace_installs where tenant_id = v_tenant_id and status in ('installed', 'active')),
    'updates_available', (select count(*) from public.tenant_marketplace_installs where tenant_id = v_tenant_id and status = 'update_available'),
    'philosophy', 'Discover safe, governed packs — Skills, templates, and Knowledge Center content in one install.',
    'privacy_note', 'Every item declares permissions, risk level, and deployment compatibility before installation.',
    'implementation_blueprint_phase112', jsonb_build_object(
      'phase', 'Phase 112 — Skills & Extensions Marketplace Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE112_SKILLS_EXTENSIONS_MARKETPLACE.md',
      'engine_phase', 'Repo Phase 69 Marketplace & Business Pack Ecosystem',
      'route', '/app/marketplace',
      'mapping_note', 'ABOS Blueprint Phase 112 extends Phase 69 — Skill Store Phase 63 is install engine.'
    ),
    'marketplace_mission', public._sembp112_mission(),
    'marketplace_abos_principle', public._sembp112_abos_principle(),
    'marketplace_engagement_summary', v_engagement,
    'marketplace_note', 'Skills & Extensions Marketplace (ABOS Phase 112) — trusted catalog with governed install flow; humans approve permissions.',
    'marketplace_vision_note', public._sembp112_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL baseline fields; append Phase 112
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_featured jsonb;
  v_installed jsonb;
  v_recommended jsonb;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_seed_catalog();

  select coalesce(jsonb_agg(public._mkp_item_json(i, false) order by i.install_count desc), '[]'::jsonb)
  into v_featured
  from (select * from public.marketplace_items where status = 'published' order by install_count desc limit 6) i;

  select coalesce(jsonb_agg(jsonb_build_object(
    'install_id', ti.id, 'status', ti.status, 'installed_at', ti.installed_at,
    'item', public._mkp_item_json(mi, true)
  ) order by ti.installed_at desc), '[]'::jsonb) into v_installed
  from public.tenant_marketplace_installs ti
  join public.marketplace_items mi on mi.id = ti.item_id
  where ti.tenant_id = v_tenant_id and ti.status not in ('uninstalled', 'failed');

  v_recommended := public.get_marketplace_recommendations();

  return jsonb_build_object(
    'has_customer', true,
    'featured', v_featured,
    'installed', v_installed,
    'recommended', v_recommended,
    'catalog_count', (select count(*) from public.marketplace_items where status = 'published'),
    'implementation_blueprint_phase112', jsonb_build_object(
      'phase', 'Phase 112 — Skills & Extensions Marketplace Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE112_SKILLS_EXTENSIONS_MARKETPLACE.md',
      'engine_phase', 'Repo Phase 69 Marketplace & Business Pack Ecosystem',
      'route', '/app/marketplace',
      'mapping_note', 'ABOS Blueprint Phase 112 extends Phase 69 — Skill Store Phase 63 is install engine; Phase 90 governs quality.'
    ),
    'marketplace_engine_note', 'Skills & Extensions Marketplace (ABOS Phase 112) — trusted Skills and Extensions expanding Companion capabilities — safe innovation.',
    'skills_extensions_marketplace_blueprint', public._sembp112_blueprint_block(v_tenant_id),
    'marketplace_distinction_note', public._sembp112_distinction_note(),
    'marketplace_mission', public._sembp112_mission(),
    'marketplace_philosophy', public._sembp112_philosophy(),
    'marketplace_abos_principle', public._sembp112_abos_principle(),
    'marketplace_objectives', public._sembp112_objectives(),
    'skills_marketplace_concept', public._sembp112_skills_marketplace_concept(),
    'skill_categories', public._sembp112_skill_categories(),
    'extensions_marketplace', public._sembp112_extensions_marketplace(),
    'companion_adaptation', public._sembp112_companion_adaptation(),
    'skill_quality_assurance', public._sembp112_skill_quality_assurance(),
    'growth_partner_marketplace', public._sembp112_growth_partner_marketplace(),
    'developer_ecosystem', public._sembp112_developer_ecosystem(),
    'installation_experience', public._sembp112_installation_experience(),
    'marketplace_self_love_connection', public._sembp112_self_love_connection(),
    'marketplace_leadership_connection', public._sembp112_leadership_connection(),
    'marketplace_trust_connection', public._sembp112_trust_connection(),
    'marketplace_limitation_principles', public._sembp112_limitation_principles(),
    'marketplace_dogfooding', public._sembp112_dogfooding(),
    'sembp112_integration_links', public._sembp112_integration_links(),
    'marketplace_engagement_summary', public._sembp112_engagement_summary(v_tenant_id),
    'marketplace_success_criteria', public._sembp112_success_criteria(v_tenant_id),
    'marketplace_vision', public._sembp112_vision(),
    'marketplace_vision_phrases', public._sembp112_vision_phrases(),
    'marketplace_privacy_note', 'Marketplace blueprint data is catalog metadata and governance scaffolds only. Precheck and approval required for governed installs. Humans decide; Aipify informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._sembp112_distinction_note() to authenticated;
grant execute on function public._sembp112_mission() to authenticated;
grant execute on function public._sembp112_philosophy() to authenticated;
grant execute on function public._sembp112_abos_principle() to authenticated;
grant execute on function public._sembp112_vision() to authenticated;
grant execute on function public._sembp112_objectives() to authenticated;
grant execute on function public._sembp112_skills_marketplace_concept() to authenticated;
grant execute on function public._sembp112_skill_categories() to authenticated;
grant execute on function public._sembp112_extensions_marketplace() to authenticated;
grant execute on function public._sembp112_companion_adaptation() to authenticated;
grant execute on function public._sembp112_skill_quality_assurance() to authenticated;
grant execute on function public._sembp112_growth_partner_marketplace() to authenticated;
grant execute on function public._sembp112_developer_ecosystem() to authenticated;
grant execute on function public._sembp112_installation_experience() to authenticated;
grant execute on function public._sembp112_self_love_connection() to authenticated;
grant execute on function public._sembp112_leadership_connection() to authenticated;
grant execute on function public._sembp112_trust_connection() to authenticated;
grant execute on function public._sembp112_limitation_principles() to authenticated;
grant execute on function public._sembp112_dogfooding() to authenticated;
grant execute on function public._sembp112_vision_phrases() to authenticated;
grant execute on function public._sembp112_integration_links() to authenticated;
grant execute on function public._sembp112_engagement_summary(uuid) to authenticated;
grant execute on function public._sembp112_success_criteria(uuid) to authenticated;
grant execute on function public._sembp112_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'skills-extensions-marketplace-blueprint-phase112', 'Skills & Extensions Marketplace (ABOS Phase 112)',
  'Skills & Extensions Marketplace — trusted catalog, governed install flow, skill categories, extensions, QA cross-link Phase 90, developer ecosystem. Safe innovation; orgs activate what creates value.',
  'authenticated', 142
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'skills-extensions-marketplace-blueprint-phase112' and tenant_id is null
);
