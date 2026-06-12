-- Implementation Blueprint Phase 71 — Enterprise Knowledge Fabric Engine
-- Extends Knowledge Center Engine (A.5) Phases 3 and 14. No new tables.
-- Blueprint helpers use _ekfbp_* — engine helpers remain _kce_*.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ekfbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 71 — Enterprise Knowledge Fabric at /app/knowledge-center-engine. Extends Knowledge Center Engine Phase A.5 (Phases 3 and 14 already extended — preserve ALL fields). Distinct from Cross-Tenant Intelligence A.71 at /app/cross-tenant-intelligence-engine (repo phase number collision). Distinct from KC Phase 55 self-knowledge at /app/knowledge-center. Distinct from Organizational Memory A.34 at /app/organizational-memory-engine (Blueprint Phase 55 memory continuity — cross-link). Distinct from Employee Knowledge EKE Phase 41 at /app/settings/employee-knowledge. Distinct from Business DNA support knowledge at /app/settings/business-dna. Distinct from Wisdom Engine A.93. Engine helpers use _kce_* — blueprint Phase 71 MUST use _ekfbp_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._ekfbp_mission()
returns text language sql immutable as $$
  select 'Unified knowledge fabric spanning the enterprise — continuity, decision-making, and operational effectiveness.';
$$;

create or replace function public._ekfbp_philosophy()
returns text language sql immutable as $$
  select 'Hidden knowledge loses value. The right people need the right information at the right time — wisdom when it is actionable, not overload.';
$$;

create or replace function public._ekfbp_abos_principle()
returns text language sql immutable as $$
  select 'Knowledge surviving beyond roles becomes strategic advantage. Aipify informs and prepares; humans decide what to share and publish.';
$$;

create or replace function public._ekfbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_unification', 'label', 'Knowledge unification', 'description', 'Connect internal docs, KC articles, policies, and approved metadata into one tenant fabric'),
    jsonb_build_object('key', 'contextual_retrieval', 'label', 'Contextual retrieval', 'description', 'Surface relevant resources with explainable context — not keyword dumps'),
    jsonb_build_object('key', 'cross_system_understanding', 'label', 'Cross-system understanding', 'description', 'Relate support signals, workflows, and KC content without duplicating operational records'),
    jsonb_build_object('key', 'knowledge_governance', 'label', 'Knowledge governance', 'description', 'Ownership, review schedules, approval requirements, and access boundaries'),
    jsonb_build_object('key', 'organizational_continuity', 'label', 'Organizational continuity', 'description', 'Preserve institutional knowledge, reduce individual dependency, strengthen onboarding'),
    jsonb_build_object('key', 'actionable_intelligence', 'label', 'Actionable intelligence', 'description', 'Recommendations with sources and next steps — understanding, not overload')
  );
$$;

create or replace function public._ekfbp_knowledge_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'internal_docs', 'label', 'Internal documentation', 'description', 'Tenant-owned articles and playbooks in Knowledge Center Engine'),
    jsonb_build_object('key', 'kc_articles', 'label', 'KC articles & FAQs', 'description', 'Published organizational knowledge via approval workflow'),
    jsonb_build_object('key', 'policies_procedures', 'label', 'Policies and procedures', 'description', 'Governance and operational policy articles — metadata summaries only'),
    jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries', 'description', 'Approved summary metadata — never raw meeting transcripts'),
    jsonb_build_object('key', 'support_histories', 'label', 'Support histories', 'description', 'Support gap and outcome metadata from Support AI — no raw chat content'),
    jsonb_build_object('key', 'training_resources', 'label', 'Training resources', 'description', 'Onboarding and skill development articles — cross-link Employee Knowledge EKE'),
    jsonb_build_object('key', 'workflow_docs', 'label', 'Workflow documentation', 'description', 'Process and playbook articles linked to operations'),
    jsonb_build_object('key', 'future_integrations', 'label', 'Future integrations', 'description', 'Scaffold for external knowledge connectors — read-only first per Trust Architecture')
  );
$$;

create or replace function public._ekfbp_knowledge_discovery()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge discovery — relevant resources, similar situations, and articles needing review.',
    'signals', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'relevant_resources', 'label', 'Relevant resources', 'description', 'Contextual retrieval of published articles and FAQs matching the user''s need'),
      jsonb_build_object('emoji', '🌹', 'key', 'similar_situations', 'label', 'Similar documented situations', 'description', 'Related articles and FAQs from category and topic metadata — heuristic scaffold'),
      jsonb_build_object('emoji', '🔔', 'key', 'articles_needing_review', 'label', 'Articles needing review', 'description', 'Stale content, overdue reviews, and draft queue items surfaced for human attention')
    )
  );
$$;

create or replace function public._ekfbp_contextual_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Contextual intelligence — why a document matters, related assets, previous decisions, and recommended next steps. Understanding, not overload.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'why_it_matters', 'label', 'Why this document matters', 'description', 'Summary and category context explain relevance to the current question'),
      jsonb_build_object('key', 'related_assets', 'label', 'Related assets', 'description', 'Linked categories, FAQs, and related content scaffold — metadata only'),
      jsonb_build_object('key', 'previous_decisions', 'label', 'Previous decisions', 'description', 'Cross-link Organizational Memory A.34 decision register metadata — not raw records'),
      jsonb_build_object('key', 'recommended_next_steps', 'label', 'Recommended next steps', 'description', 'Action hints from proactive recommendations — humans approve all changes')
    ),
    'boundary_note', 'Context is advisory — KC approval workflow remains authoritative for publication.'
  );
$$;

create or replace function public._ekfbp_knowledge_governance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge governance — ownership, review schedules, approval requirements, and access boundaries.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'ownership', 'label', 'Ownership', 'description', 'Authors and reviewers tracked per article — accountability without blame'),
      jsonb_build_object('key', 'review_schedules', 'label', 'Review schedules', 'description', 'review_due_at and evolution review cycle — gentle reminders, never guilt language'),
      jsonb_build_object('key', 'approval_requirements', 'label', 'Approval requirements', 'description', 'Draft → review → published workflow — AI never auto-publishes'),
      jsonb_build_object('key', 'access_boundaries', 'label', 'Access boundaries', 'description', 'Visibility levels and knowledge.* permissions enforced server-side')
    ),
    'audit_note', 'Governance events logged via knowledge audit — metadata only.'
  );
$$;

create or replace function public._ekfbp_knowledge_gaps()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge gaps — recurring questions, undocumented practices, and knowledge concentration risks.',
    'gap_types', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'recurring_questions', 'label', 'Recurring questions need documentation', 'description', 'Open support_ai_knowledge_gaps and FAQ creation opportunities — question metadata only'),
      jsonb_build_object('emoji', '🌹', 'key', 'undocumented_practices', 'label', 'Undocumented practices', 'description', 'Workflow changes without playbook updates — human review before article drafts'),
      jsonb_build_object('emoji', '🔔', 'key', 'concentration_risks', 'label', 'Knowledge concentration risks', 'description', 'Critical topics owned by few authors or single categories — continuity scaffold for leadership review')
    ),
    'metadata_note', 'Gap signals are metadata only — no raw support chat, email, or customer content.'
  );
$$;

create or replace function public._ekfbp_organizational_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational continuity — reduce individual dependency, preserve institutional knowledge, strengthen onboarding, and strategic memory.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'reduce_dependency', 'label', 'Reduce individual dependency', 'description', 'Documented playbooks and FAQs so knowledge survives role changes'),
      jsonb_build_object('key', 'institutional_knowledge', 'label', 'Preserve institutional knowledge', 'description', 'Version history, categories, and Organizational Memory A.34 cross-links'),
      jsonb_build_object('key', 'onboarding', 'label', 'Onboarding support', 'description', 'Training and companion categories guide new team members sustainably'),
      jsonb_build_object('key', 'strategic_memory', 'label', 'Strategic memory', 'description', 'Strategic articles and decision context metadata — distinct from live operational records')
    ),
    'organizational_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Memory captures how things unfolded; the fabric explains how things should work — both evolve together.'
  );
$$;

create or replace function public._ekfbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — clarity, confidence, reduced cognitive burden, and shared learning.',
    'practices', jsonb_build_array(
      'Clarity over complexity in documentation',
      'Confidence through accessible, approved answers',
      'Reduced cognitive burden — right information at the right time',
      'Shared learning — knowledge shared generously benefits everyone'
    ),
    'journey_phrase', 'Knowledge shared generously benefits everyone.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable documentation pace — not perfectionism or guilt-based motivation.'
  );
$$;

create or replace function public._ekfbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — knowledge health, emerging documentation needs, and positive sharing practices.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_health', 'label', 'Knowledge health', 'description', 'Freshness, coverage, and quality scores from live KC metadata'),
      jsonb_build_object('key', 'documentation_needs', 'label', 'Emerging documentation needs', 'description', 'Support gaps, stale articles, and creation opportunities — metadata only'),
      jsonb_build_object('key', 'sharing_practices', 'label', 'Positive sharing practices', 'description', 'Published articles, review completion, and category coverage trends')
    ),
    'dialogue_note', 'Insights encourage dialogue — humans decide priorities; Aipify prepares context only.'
  );
$$;

create or replace function public._ekfbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires sources in responses, confidence levels, and transparent approval processes for visibility.',
    'users_should_see', jsonb_build_array(
      'Which published sources informed each retrieval or recommendation',
      'Confidence levels and when to escalate to human review',
      'That humans approve all publication and visibility changes',
      'No raw support chat, email, or customer content in fabric signals'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Health scores and gap counts are illustrative metadata — not team quality judgments',
      'Discovery heuristics require human confirmation before merges or archival',
      'Cross-tenant intelligence A.71 is platform-scoped — distinct from tenant fabric',
      'Employee Knowledge EKE and Business DNA remain separate approved sources'
    ),
    'audit_note', 'Fabric recommendations are advisory — KC approval workflow remains authoritative.'
  );
$$;

create or replace function public._ekfbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates the enterprise knowledge fabric internally — product documentation, Sales Expert training, companion guidance, and organizational learning.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'focus', jsonb_build_array(
        'Product documentation and release playbooks',
        'Sales Expert training materials and partner guidance',
        'Companion guidelines and approved phrasing',
        'Organizational learning from support gap trends'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'focus', jsonb_build_array(
        'Marketplace operations and seller guidance freshness',
        'Support escalation policies and FAQ hygiene',
        'Pilot lessons learned → operations articles',
        'Onboarding paths for new team members'
      )
    )
  );
$$;

create or replace function public._ekfbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We know more than we realized, and we can now access that knowledge when it matters most.',
    'Knowledge flows freely, responsibly, and meaningfully across the enterprise.',
    'The right people receive the right information at the right time.',
    'Hidden knowledge loses value — shared knowledge becomes strategic advantage.',
    'Understanding, not overload — wisdom when it is actionable.'
  );
$$;

create or replace function public._ekfbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Blueprint Phase 55 memory continuity — cross-link for decision and retrospective context'),
    jsonb_build_object('label', 'Employee Knowledge (EKE Phase 41)', 'route', '/app/settings/employee-knowledge', 'note', 'Role-based internal guidance — distinct from tenant KC fabric'),
    jsonb_build_object('label', 'Business DNA', 'route', '/app/settings/business-dna', 'note', 'Support templates and tone — distinct from organizational KC articles'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine', 'note', 'support_ai_knowledge_gaps feed gap signals — metadata only'),
    jsonb_build_object('label', 'Cross-Tenant Intelligence (A.71)', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Platform-scoped — repo phase number collision with Blueprint Phase 71'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Wisdom interventions — distinct from knowledge fabric retrieval'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Clarity and sustainable documentation — principle only'),
    jsonb_build_object('label', 'KC Self-Knowledge (Phase 55)', 'route', '/app/knowledge-center', 'note', 'Aipify product self-knowledge — distinct from tenant organizational fabric'),
    jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Phase 3 foundation + Phase 14 evolution + Phase 71 fabric')
  );
$$;

create or replace function public._ekfbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_published int := 0;
  v_faq_published int := 0;
  v_categories int := 0;
  v_draft_review int := 0;
  v_open_gaps int := 0;
  v_overdue_review int := 0;
  v_health jsonb;
begin
  select count(*) into v_published
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_faq_published
  from public.knowledge_faq_items
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_categories
  from public.knowledge_categories
  where organization_id = p_organization_id;

  select count(*) into v_draft_review
  from public.knowledge_articles
  where organization_id = p_organization_id and status in ('draft', 'review');

  select count(*) into v_overdue_review
  from public.knowledge_articles
  where organization_id = p_organization_id
    and status = 'published'
    and review_due_at is not null
    and review_due_at < now();

  select count(*) into v_open_gaps
  from public.support_ai_knowledge_gaps
  where organization_id = p_organization_id and status = 'open';

  v_health := public._kce_compute_knowledge_health_scores(p_organization_id);

  return jsonb_build_object(
    'published_articles', coalesce(v_published, 0),
    'published_faqs', coalesce(v_faq_published, 0),
    'categories', coalesce(v_categories, 0),
    'draft_and_review_queue', coalesce(v_draft_review, 0),
    'overdue_reviews', coalesce(v_overdue_review, 0),
    'open_support_gaps', coalesce(v_open_gaps, 0),
    'freshness_score', v_health->'freshness_score',
    'coverage_score', v_health->'coverage_score',
    'quality_score', v_health->'quality_score',
    'knowledge_sources', jsonb_array_length(public._ekfbp_knowledge_sources()),
    'discovery_signals', jsonb_array_length(public._ekfbp_knowledge_discovery()->'signals'),
    'gap_types', jsonb_array_length(public._ekfbp_knowledge_gaps()->'gap_types'),
    'privacy_note', 'Metadata only — article, FAQ, category, gap, and health counts. No raw support content or PII.'
  );
end; $$;

create or replace function public._ekfbp_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_published int := 0;
  v_faq int := 0;
  v_categories int := 0;
  v_gaps int := 0;
  v_revisions int := 0;
  v_evolution jsonb;
begin
  perform public._kce_ensure_evolution_settings(p_organization_id);
  v_engagement := public._ekfbp_engagement_summary(p_organization_id);
  v_published := coalesce((v_engagement->>'published_articles')::int, 0);
  v_faq := coalesce((v_engagement->>'published_faqs')::int, 0);
  v_categories := coalesce((v_engagement->>'categories')::int, 0);
  v_gaps := coalesce((v_engagement->>'open_support_gaps')::int, 0);

  select count(*) into v_revisions
  from public.knowledge_article_revisions
  where organization_id = p_organization_id;

  select coalesce(s.metadata->'knowledge_evolution', public._kce_default_knowledge_evolution())
  into v_evolution
  from public.organization_workspace_settings s
  where s.organization_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'easier_access',
      'label', 'Easier access to organizational knowledge — published articles and FAQs available',
      'met', v_published + v_faq >= 1,
      'note', case when v_published + v_faq < 1 then 'Publish at least one article or FAQ to validate fabric access.' else null end
    ),
    jsonb_build_object(
      'key', 'visible_gaps',
      'label', 'Visible knowledge gaps — gap types documented and support gaps monitored',
      'met', coalesce((v_evolution->>'gap_detection_enabled')::boolean, false),
      'note', case when v_gaps > 0 then v_gaps::text || ' open support gap(s) from metadata.' else 'Gap detection enabled — healthy baseline or Support AI not yet active.' end
    ),
    jsonb_build_object(
      'key', 'stronger_continuity',
      'label', 'Stronger organizational continuity — version history and continuity practices documented',
      'met', v_revisions >= 1 or v_categories >= 2,
      'note', 'Version history and multi-category coverage reduce individual dependency.'
    ),
    jsonb_build_object(
      'key', 'improved_onboarding',
      'label', 'Improved onboarding — training sources and categories support new team members',
      'met', v_categories >= 1 and jsonb_array_length(public._ekfbp_knowledge_sources()) >= 6,
      'note', case when v_categories < 1 then 'Seed knowledge categories for onboarding paths.' else null end
    ),
    jsonb_build_object(
      'key', 'increased_trust',
      'label', 'Increased trust in knowledge — sources, confidence, and approval processes documented',
      'met', jsonb_array_length(public._ekfbp_trust_connection()->'users_should_see') >= 4,
      'note', 'Published-only AI retrieval with human approval workflow.'
    ),
    jsonb_build_object(
      'key', 'knowledge_discovery',
      'label', 'Knowledge discovery — relevant resources, similar situations, articles needing review (🦉🌹🔔)',
      'met', jsonb_array_length(public._ekfbp_knowledge_discovery()->'signals') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'contextual_intelligence',
      'label', 'Contextual intelligence — why it matters, related assets, decisions, next steps',
      'met', jsonb_array_length(public._ekfbp_contextual_intelligence()->'dimensions') >= 4,
      'note', 'Understanding, not overload.'
    ),
    jsonb_build_object(
      'key', 'knowledge_governance',
      'label', 'Knowledge governance — ownership, review schedules, approval, access boundaries',
      'met', jsonb_array_length(public._ekfbp_knowledge_governance()->'elements') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — health, documentation needs, positive sharing practices',
      'met', jsonb_array_length(public._ekfbp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'organizational_memory_link',
      'label', 'Organizational Memory A.34 cross-link for continuity and strategic memory',
      'met', coalesce((v_evolution->>'organizational_memory_sync_scaffold')::boolean, false),
      'note', 'Blueprint Phase 55 memory continuity — cross-link only.'
    ),
    jsonb_build_object(
      'key', 'fabric_objectives',
      'label', 'Blueprint objectives — unification, retrieval, governance, continuity, actionable intelligence',
      'met', jsonb_array_length(public._ekfbp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — knowledge surviving beyond roles becomes strategic advantage',
      'met', true,
      'note', 'Knowledge flows freely, responsibly, meaningfully.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve Phase 3 + Phase 14 fields; append Phase 71
-- ---------------------------------------------------------------------------
create or replace function public.get_knowledge_center_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_health jsonb;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._kce_ensure_evolution_settings(v_org_id);
  v_health := public._kce_compute_knowledge_health_scores(v_org_id);
  v_engagement := public._ekfbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'mission', 'Central source of truth for organizational memory, guidance, and operational intelligence.',
    'philosophy', 'Accessible. Organized. Actionable. Continuously improved. Shared responsibly.',
    'abos_principle', 'Knowledge without governance creates confusion. Governance without accessibility creates silence. Aipify combines both.',
    'implementation_blueprint', 'Phase 3 — Knowledge Center Foundation',
    'implementation_blueprint_phase14', jsonb_build_object(
      'phase', 'Phase 14 — Knowledge Evolution',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE14_KNOWLEDGE_EVOLUTION_FOUNDATION.md',
      'freshness_score', v_health->'freshness_score',
      'coverage_score', v_health->'coverage_score',
      'quality_score', v_health->'quality_score'
    ),
    'implementation_blueprint_phase71', jsonb_build_object(
      'phase', 'Phase 71 — Enterprise Knowledge Fabric',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE71_ENTERPRISE_KNOWLEDGE_FABRIC.md',
      'engine', 'Knowledge Center Engine (A.5)',
      'route', '/app/knowledge-center-engine',
      'mission', public._ekfbp_mission(),
      'abos_principle', public._ekfbp_abos_principle()
    ),
    'fabric_mission', public._ekfbp_mission(),
    'fabric_abos_principle', public._ekfbp_abos_principle(),
    'engagement_summary', v_engagement,
    'fabric_note', 'Enterprise Knowledge Fabric (ABOS Phase 71) — unified tenant knowledge atop Phases 3 and 14.',
    'published_articles', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status = 'published'
    ),
    'drafts_awaiting_review', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status in ('draft', 'review')
    ),
    'faq_count', (
      select count(*) from public.knowledge_faq_items
      where organization_id = v_org_id and status = 'published'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL Phase 3 + Phase 14 fields; append Phase 71
-- ---------------------------------------------------------------------------
create or replace function public.get_knowledge_center_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org record;
  v_evolution jsonb;
begin
  perform public._irp_require_permission('knowledge.view');
  v_org_id := public._mta_require_organization();
  perform public._kce_seed_demo_content(v_org_id);
  perform public._kce_seed_blueprint_dogfood_categories(v_org_id);
  perform public._kce_ensure_evolution_settings(v_org_id);

  select o.id, o.name, o.slug, o.status into v_org
  from public.organizations o where o.id = v_org_id;

  select coalesce(s.metadata->'knowledge_evolution', public._kce_default_knowledge_evolution())
  into v_evolution
  from public.organization_workspace_settings s
  where s.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Accessible. Organized. Actionable. Continuously improved. Shared responsibly.',
    'mission', 'Central source of truth for organizational memory, companion guidance, support knowledge, and operational intelligence.',
    'abos_principle', 'Knowledge without governance creates confusion. Governance without accessibility creates silence. Aipify combines both.',
    'vision', 'Organizational memory is the intelligence layer beneath every ABOS module. Build it carefully.',
    'safety_note', 'AI prioritizes published knowledge. Unpublished and archived content is never used for customer-facing responses.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 3 — Knowledge Center Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_CENTER_FOUNDATION.md',
      'engine', 'Knowledge Center Engine (A.5)'
    ),
    'implementation_blueprint_phase14', jsonb_build_object(
      'phase', 'Phase 14 — Knowledge Evolution',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE14_KNOWLEDGE_EVOLUTION_FOUNDATION.md',
      'engine', 'Knowledge Center Engine (A.5)',
      'mission', 'Maintain relevant, accurate, useful knowledge through proactive, explainable recommendations.',
      'philosophy', 'Knowledge is not static — organizations, processes, and customers evolve.'
    ),
    'implementation_blueprint_phase71', jsonb_build_object(
      'phase', 'Phase 71 — Enterprise Knowledge Fabric',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE71_ENTERPRISE_KNOWLEDGE_FABRIC.md',
      'engine', 'Knowledge Center Engine (A.5)',
      'route', '/app/knowledge-center-engine',
      'mission', public._ekfbp_mission(),
      'philosophy', public._ekfbp_philosophy(),
      'mapping_note', 'ABOS Blueprint Phase 71 extends Phases 3 and 14 with unified tenant knowledge fabric — discovery, contextual intelligence, governance, gaps, continuity, and live engagement summary.'
    ),
    'enterprise_knowledge_fabric_note', 'Enterprise Knowledge Fabric (ABOS Phase 71) — unified tenant knowledge spanning continuity, decision-making, and operational effectiveness.',
    'blueprint_distinction_note', public._ekfbp_distinction_note(),
    'fabric_mission', public._ekfbp_mission(),
    'fabric_philosophy', public._ekfbp_philosophy(),
    'fabric_abos_principle', public._ekfbp_abos_principle(),
    'fabric_objectives', public._ekfbp_objectives(),
    'knowledge_sources', public._ekfbp_knowledge_sources(),
    'knowledge_discovery', public._ekfbp_knowledge_discovery(),
    'contextual_intelligence', public._ekfbp_contextual_intelligence(),
    'fabric_knowledge_governance', public._ekfbp_knowledge_governance(),
    'fabric_knowledge_gaps', public._ekfbp_knowledge_gaps(),
    'organizational_continuity', public._ekfbp_organizational_continuity(),
    'fabric_self_love_connection', public._ekfbp_self_love_connection(),
    'leadership_insights', public._ekfbp_leadership_insights(),
    'fabric_trust_connection', public._ekfbp_trust_connection(),
    'fabric_dogfooding', public._ekfbp_dogfooding(),
    'engagement_summary', public._ekfbp_engagement_summary(v_org_id),
    'fabric_success_criteria', public._ekfbp_success_criteria(v_org_id),
    'fabric_vision_phrases', public._ekfbp_vision_phrases(),
    'fabric_integration_links', public._ekfbp_integration_links(),
    'principles', jsonb_build_array(
      'Knowledge must be tenant-aware',
      'Organizations own their knowledge',
      'AI responses prioritize approved content',
      'Knowledge supports versioning and rollback',
      'Access respects permissions and visibility',
      'Review before publication is the default',
      'Metadata-first — no raw customer content in learning memory',
      'Evolution recommendations are advisory — humans approve all changes'
    ),
    'kc_objectives', jsonb_build_array(
      'Organizational memory',
      'Companion guidance',
      'Support knowledge base',
      'Employee learning',
      'Playbooks',
      'Values and culture',
      'FAQ',
      'Decision support context'
    ),
    'evolution_objectives', public._kce_evolution_objectives(),
    'knowledge_types', jsonb_build_array(
      jsonb_build_object('key', 'operational', 'label', 'Operational', 'description', 'Day-to-day procedures and workflows'),
      jsonb_build_object('key', 'support', 'label', 'Support', 'description', 'Customer and internal support documentation'),
      jsonb_build_object('key', 'organizational', 'label', 'Organizational', 'description', 'Policies, governance, and structure'),
      jsonb_build_object('key', 'companion', 'label', 'Companion', 'description', 'AI companion tone and approved phrasing'),
      jsonb_build_object('key', 'training', 'label', 'Training', 'description', 'Employee onboarding and skill development'),
      jsonb_build_object('key', 'strategic', 'label', 'Strategic', 'description', 'Long-term direction and decision context')
    ),
    'article_structure', jsonb_build_array(
      'Title and summary',
      'Category and tags (tags scaffold)',
      'Author and reviewer workflow',
      'Approval and publication status',
      'Version history with rollback',
      'Related content (scaffold)',
      'Visibility levels',
      'Timestamps — created, updated, published, review due'
    ),
    'visibility_levels', jsonb_build_array(
      jsonb_build_object('blueprint', 'public', 'engine', 'public', 'description', 'External audiences'),
      jsonb_build_object('blueprint', 'organization', 'engine', 'internal', 'description', 'All organization members'),
      jsonb_build_object('blueprint', 'workspace', 'engine', 'internal', 'description', 'Workspace-scoped access (scaffold)'),
      jsonb_build_object('blueprint', 'restricted', 'engine', 'internal', 'description', 'Role-gated via knowledge.* permissions')
    ),
    'knowledge_evolution', v_evolution,
    'health_indicators', public._kce_compute_knowledge_health_scores(v_org_id),
    'proactive_recommendations', public._kce_knowledge_evolution_recommendations(v_org_id),
    'creation_opportunities', public._kce_knowledge_creation_opportunities(),
    'self_love_connection', public._kce_evolution_self_love_connection(),
    'organizational_memory_connection', public._kce_evolution_organizational_memory_connection(),
    'trust_connection', public._kce_evolution_trust_connection(),
    'companion_integration', jsonb_build_object(
      'retrieval_rpc', 'retrieve_knowledge_for_ai',
      'published_only', true,
      'companion_guidelines_category', 'companion_guidelines',
      'self_love_scaffold', 'A.76 — metadata alignment only'
    ),
    'dogfooding', jsonb_build_object(
      'principle', 'Aipify dogfoods KC internally; Unonight validates externally.',
      'aipify_group', jsonb_build_object(
        'slug', 'aipify-group',
        'categories', jsonb_build_array(
          'Product', 'Engineering', 'Support', 'Sales', 'Governance',
          'Self Love', 'Human Values', 'Companion Guidelines'
        )
      ),
      'unonight', jsonb_build_object(
        'slug', 'unonight',
        'categories', jsonb_build_array('Support', 'Operations', 'Marketplace', 'FAQ')
      ),
      'evolution', public._kce_evolution_dogfooding()
    ),
    'success_criteria', public._kce_blueprint_success_criteria(v_org_id),
    'evolution_success_criteria', public._kce_evolution_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._kce_evolution_vision_phrases(),
    'integration_links', public._kce_evolution_integration_links(),
    'organization', jsonb_build_object('id', v_org.id, 'name', v_org.name, 'slug', v_org.slug, 'status', v_org.status),
    'published_articles', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status = 'published'
    ),
    'drafts_awaiting_review', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status in ('draft', 'review')
    ),
    'faq_count', (
      select count(*) from public.knowledge_faq_items
      where organization_id = v_org_id and status = 'published'
    ),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('slug', c.slug, 'name', c.name, 'description', c.description) order by c.sort_order)
      from public.knowledge_categories c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'published_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'slug', a.slug, 'language', a.language,
        'visibility', a.visibility, 'version', a.version, 'view_count', a.view_count,
        'published_at', a.published_at, 'category_slug', c.slug
      ) order by a.published_at desc nulls last)
      from public.knowledge_articles a
      left join public.knowledge_categories c on c.id = a.category_id
      where a.organization_id = v_org_id and a.status = 'published' limit 10
    ), '[]'::jsonb),
    'awaiting_review', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'slug', a.slug, 'status', a.status, 'version', a.version,
        'updated_at', a.updated_at, 'category_slug', c.slug
      ) order by a.updated_at desc)
      from public.knowledge_articles a
      left join public.knowledge_categories c on c.id = a.category_id
      where a.organization_id = v_org_id and a.status in ('draft', 'review') limit 10
    ), '[]'::jsonb),
    'outdated_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'review_due_at', a.review_due_at, 'status', a.status
      ) order by a.review_due_at asc nulls last)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published'
        and a.review_due_at is not null and a.review_due_at < now() limit 10
    ), '[]'::jsonb),
    'most_viewed', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'view_count', a.view_count, 'slug', a.slug
      ) order by a.view_count desc)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published' limit 8
    ), '[]'::jsonb),
    'needs_update', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'review_due_at', a.review_due_at, 'updated_at', a.updated_at
      ) order by a.review_due_at asc nulls last)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published'
        and (
          (a.review_due_at is not null and a.review_due_at <= now() + interval '30 days')
          or a.updated_at < now() - interval '6 months'
        ) limit 10
    ), '[]'::jsonb),
    'recent_faqs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'question', f.question, 'status', f.status, 'visibility', f.visibility
      ) order by f.updated_at desc)
      from public.knowledge_faq_items f
      where f.organization_id = v_org_id limit 8
    ), '[]'::jsonb),
    'import_formats', jsonb_build_array('text', 'markdown', 'faq', 'support_doc'),
    'blueprint_integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Organization & Workspaces (A.75)', 'route', '/app/organization-workspace-engine'),
      jsonb_build_object('label', 'Identity & Permissions (A.2)', 'route', '/app/identity-access'),
      jsonb_build_object('label', 'Admin Assistant (A.6)', 'route', '/app/admin-assistant-engine'),
      jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
      jsonb_build_object('label', 'Self Love Engine (A.76)', 'route', '/app/self-love-engine'),
      jsonb_build_object('label', 'KC Self-Knowledge (Phase 55)', 'route', '/app/knowledge-center')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ekfbp_distinction_note() to authenticated;
grant execute on function public._ekfbp_mission() to authenticated;
grant execute on function public._ekfbp_philosophy() to authenticated;
grant execute on function public._ekfbp_abos_principle() to authenticated;
grant execute on function public._ekfbp_objectives() to authenticated;
grant execute on function public._ekfbp_knowledge_sources() to authenticated;
grant execute on function public._ekfbp_knowledge_discovery() to authenticated;
grant execute on function public._ekfbp_contextual_intelligence() to authenticated;
grant execute on function public._ekfbp_knowledge_governance() to authenticated;
grant execute on function public._ekfbp_knowledge_gaps() to authenticated;
grant execute on function public._ekfbp_organizational_continuity() to authenticated;
grant execute on function public._ekfbp_self_love_connection() to authenticated;
grant execute on function public._ekfbp_leadership_insights() to authenticated;
grant execute on function public._ekfbp_trust_connection() to authenticated;
grant execute on function public._ekfbp_dogfooding() to authenticated;
grant execute on function public._ekfbp_vision_phrases() to authenticated;
grant execute on function public._ekfbp_integration_links() to authenticated;
grant execute on function public._ekfbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ekfbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'implementation-blueprint-phase71', 'ABOS Phase 71 Enterprise Knowledge Fabric', 'Enterprise Knowledge Fabric — unified tenant knowledge spanning discovery, contextual intelligence, governance, gaps, continuity, and live engagement summary.', 'authenticated', 8
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'implementation-blueprint-phase71' and tenant_id is null);
