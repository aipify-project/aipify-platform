-- Implementation Blueprint Phase 90 — Continuous Improvement & Organizational Evolution Engine
-- Extends Continuous Improvement Engine (Phase A.33 + A.49). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._cioebp90_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 90 — Continuous Improvement & Organizational Evolution Engine at /app/continuous-improvement-engine. Extends Continuous Improvement Engine Phase A.33 + A.49. Distinct from Marketplace Governance & Quality repo Phase 90 at /app/marketplace-governance (repo phase number collision). Distinct from Presence & Comfort Protocol Phase A.90 at /app/presence-comfort-protocol. Distinct from Growth & Evolution A.81 at /app/growth-evolution-engine (long-term growth orchestration). Distinct from Evolution Governance repo Phase 84 at /app/evolution (Aipify software evolution — not organizational evolution). Distinct from Innovation Lab Phase 96 / Blueprint 38 at /app/innovation-lab (controlled experiment validation). Cross-link Organizational Memory A.34, Learning Engine /app/learning, Executive Insights A.35 / Blueprint 82, Community Phase 89, Capability Maturity A.57, Organizational Health A.56 — do not duplicate. Helpers: _cie_* (A.33/A.49), Blueprint Phase 90 uses _cioebp90_* only. Meaningful evolution not constant disruption.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cioebp90_mission()
returns text language sql immutable as $$
  select 'Sustainable habits of learning, experimentation, and evolution through reflection and adaptation.';
$$;

create or replace function public._cioebp90_philosophy()
returns text language sql immutable as $$
  select 'Progress not perfection — curious, humble, intentional evolution.';
$$;

create or replace function public._cioebp90_abos_principle()
returns text language sql immutable as $$
  select 'Meaningful evolution through learning together — improvement serves people and outcomes, not change for its own sake.';
$$;

create or replace function public._cioebp90_vision()
returns text language sql immutable as $$
  select 'We are becoming better because we are willing to learn together.';
$$;

create or replace function public._cioebp90_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning_habits', 'label', 'Learning habits', 'description', 'Observe → Reflect → Experiment → Learn → Adapt → Repeat — sustainable improvement cycles'),
    jsonb_build_object('key', 'improvement_discovery', 'label', 'Improvement discovery', 'description', 'Surface opportunities from meetings, support, feedback, Sales Expert, KC, executive reflections, and community intelligence'),
    jsonb_build_object('key', 'safe_experimentation', 'label', 'Safe experimentation', 'description', 'Small pilots, learning reviews, and governance-respecting innovation — visible and human-approved'),
    jsonb_build_object('key', 'organizational_evolution', 'label', 'Organizational evolution', 'description', 'Maintain · Improve · Transform — intentional pacing without constant disruption'),
    jsonb_build_object('key', 'outcome_validation', 'label', 'Outcome validation', 'description', 'Measure improvement with success metrics — without excessive optimization pressure'),
    jsonb_build_object('key', 'cross_engine_integration', 'label', 'Cross-engine integration', 'description', 'Connect memory, learning, executive insights, maturity, health, and community signals — metadata only')
  );
$$;

create or replace function public._cioebp90_improvement_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_what_works',
      'scenario', 'What is working',
      'question', '🦉 Which patterns deserve preservation and reinforcement — what is the organization learning to keep?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_what_could_improve',
      'scenario', 'What could improve',
      'question', '🌹 Where might small experiments reduce friction or strengthen outcomes — with curiosity, not criticism?'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'heart_what_we_learned',
      'scenario', 'What did we learn',
      'question', '❤️ What compassion and honesty help the team learn from imperfect improvement cycles?'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_recognition',
      'scenario', 'What deserves recognition',
      'question', '🔔 Which improvement efforts deserve acknowledgment — effort and learning, not only successful outcomes?'
    )
  );
$$;

create or replace function public._cioebp90_improvement_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Phase 72 / A.61 — decisions, action items, and meeting continuity patterns'),
    jsonb_build_object('key', 'support', 'label', 'Support AI & ASO', 'route', '/app/support-ai-engine', 'note', 'Support triage, escalation patterns, and knowledge gaps — metadata only'),
    jsonb_build_object('key', 'customer_feedback', 'label', 'Customer feedback', 'route', '/app/customer-success-engine', 'note', 'Adoption, satisfaction, and success signals — no PII in improvement payloads'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert ecosystem', 'route', '/app/sales-expert-engine', 'note', 'Partner portal insights, onboarding friction, and field feedback loops'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Documentation gaps and recurring support topics'),
    jsonb_build_object('key', 'executive_reflections', 'label', 'Executive reflections', 'route', '/app/executive-insights-engine', 'note', 'Executive Insights A.35 / Blueprint 82 — leadership reflection scaffolds, not stored journals'),
    jsonb_build_object('key', 'community_intelligence', 'label', 'Community intelligence', 'route', '/app/community', 'note', 'Phase 89 collective intelligence — cross-link only')
  );
$$;

create or replace function public._cioebp90_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_observe_patterns',
      'scenario', 'Observe patterns — curiosity not criticism',
      'prompt', '🦉 Aipify noticed recurring support topics this month — would a gentle review of improvement opportunities help, without pressure to change everything at once?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_gentle_experiment',
      'scenario', 'Suggest gentle experiments',
      'prompt', '🌹 A small onboarding experiment could reduce early friction — Aipify can prepare a pilot outline for your review when you are ready.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_learning_milestone',
      'scenario', 'Celebrate learning milestones',
      'prompt', '🔔 Your team completed an improvement review cycle — the learning matters even when the outcome is still in progress.'
    )
  );
$$;

create or replace function public._cioebp90_experimentation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Small experiments, pilots, learning reviews, and safe innovation — visible stages with human approval before broader change.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'small_experiments', 'label', 'Small experiments', 'description', 'Bounded scope and time — test before scaling'),
      jsonb_build_object('key', 'pilots', 'label', 'Pilots', 'description', 'Controlled cohorts with success criteria and rollback plans'),
      jsonb_build_object('key', 'learning_reviews', 'label', 'Learning reviews', 'description', 'Structured review cycles with findings summaries — human-led'),
      jsonb_build_object('key', 'safe_innovation', 'label', 'Safe innovation', 'description', 'Governance-respecting — distinct from Innovation Lab Phase 96 validation pipeline at /app/innovation-lab')
    ),
    'boundary_note', 'CIE experiments feed operational improvement — Innovation Lab validates ideas in controlled lab conditions; cross-link, do not duplicate.'
  );
$$;

create or replace function public._cioebp90_organizational_evolution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations evolve through maintain · improve · transform — intentional pacing, not constant disruption.',
    'modes', jsonb_build_array(
      jsonb_build_object('key', 'maintain', 'label', 'Maintain', 'description', 'Preserve what works — stability and reliability deserve recognition'),
      jsonb_build_object('key', 'improve', 'label', 'Improve', 'description', 'Incremental refinement through feedback, initiatives, and measured outcomes'),
      jsonb_build_object('key', 'transform', 'label', 'Transform', 'description', 'Intentional larger change with governance, stakeholder communication, and learning reviews')
    ),
    'growth_evolution_route', '/app/growth-evolution-engine',
    'evolution_governance_route', '/app/evolution',
    'boundary_note', 'Growth & Evolution A.81 orchestrates long-term growth; Evolution Governance Phase 84 is Aipify software evolution — this blueprint covers operational CI + org evolution habits on CIE.'
  );
$$;

create or replace function public._cioebp90_learning_cycles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuous improvement follows a repeatable learning cycle — observe, reflect, experiment, learn, adapt, repeat.',
    'steps', jsonb_build_array(
      jsonb_build_object('key', 'observe', 'label', 'Observe', 'description', 'Notice patterns from feedback, support, operations, and executive signals — metadata only'),
      jsonb_build_object('key', 'reflect', 'label', 'Reflect', 'description', 'Human-guided review — what matters, what is noise, what deserves compassion'),
      jsonb_build_object('key', 'experiment', 'label', 'Experiment', 'description', 'Small approved pilots and initiatives — no silent auto-implementation'),
      jsonb_build_object('key', 'learn', 'label', 'Learn', 'description', 'Capture lessons toward Organizational Memory A.34 — metadata hooks only'),
      jsonb_build_object('key', 'adapt', 'label', 'Adapt', 'description', 'Adjust processes, documentation, or workflows based on validated outcomes'),
      jsonb_build_object('key', 'repeat', 'label', 'Repeat', 'description', 'Sustainable habits — progress not perfection')
    ),
    'cycle_phrase', 'Observe → Reflect → Experiment → Learn → Adapt → Repeat'
  );
$$;

create or replace function public._cioebp90_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports compassion in improvement — celebrate effort, reduce guilt about imperfect cycles, and protect sustainable pacing.',
    'practices', jsonb_build_array(
      'Progress not perfection — improvement cycles are learning journeys',
      'Compassion toward setbacks — unsuccessful experiments still teach',
      'Sustainable pacing — avoid endless change and optimization pressure',
      'Recognition of effort — 🔔 celebrate learning milestones, not only wins'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — CIE stores improvement metadata, not wellbeing journal content.'
  );
$$;

create or replace function public._cioebp90_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights connect improvement to strategic context — executive reflections, health signals, and maturity trends inform prioritization.',
    'insight_sources', jsonb_build_array(
      jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights A.35', 'route', '/app/executive-insights-engine', 'description', 'Organization health, risks, and recommended actions — metadata summaries'),
      jsonb_build_object('key', 'executive_reflection', 'label', 'Executive Reflection Blueprint 82', 'route', '/app/executive-insights-engine', 'description', 'Leadership reflection scaffolds — private by default, growth not evaluation'),
      jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health A.56', 'route', '/app/organizational-health-engine', 'description', 'Aggregate health indicators — cross-link for improvement prioritization'),
      jsonb_build_object('key', 'capability_maturity', 'label', 'Capability Maturity A.57', 'route', '/app/capability-maturity-engine', 'description', 'Maturity roadmaps — improvement initiatives may align with maturity gaps')
    ),
    'boundary_note', 'Leadership retains all prioritization decisions — Aipify prepares improvement scaffolds and counts only.'
  );
$$;

create or replace function public._cioebp90_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuous improvement must explain what signals contribute, what humans approve, and that no silent auto-implementation occurs.',
    'what_contributes', jsonb_build_array(
      'Improvement feedback counts and source metadata — not raw customer conversations',
      'Initiative status, review cycles, and success measurement aggregates',
      'Organizational memory link counts via _cie_memory_summary — not memory content',
      'Suggestion scaffolds from quality, success, and support pattern metadata'
    ),
    'human_control', jsonb_build_array(
      'improvements.manage — create initiatives',
      'improvements.review — review cycles and findings',
      'improvements.approve — approve improvement items',
      'Governance-respecting — no silent auto-implementation'
    ),
    'audit_note', 'Initiative creation, review, and status changes logged via _cie_log — metadata only.',
    'governance_route', '/app/governance-policy-engine'
  );
$$;

create or replace function public._cioebp90_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meaningful evolution not constant disruption — avoid endless change, improvement for its own sake, and excessive optimization pressure.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'avoid_endless_change', 'label', 'Avoid endless change', 'description', 'Not every signal requires action — discernment and pacing matter'),
      jsonb_build_object('key', 'avoid_improvement_for_its_own_sake', 'label', 'Avoid improvement for its own sake', 'description', 'Change must serve people, outcomes, and strategy — not activity metrics'),
      jsonb_build_object('key', 'avoid_excessive_optimization', 'label', 'Avoid excessive optimization pressure', 'description', 'Progress not perfection — sustainable habits beat perpetual tuning'),
      jsonb_build_object('key', 'meaningful_evolution', 'label', 'Meaningful evolution', 'description', 'Maintain · Improve · Transform — intentional modes, not constant disruption')
    ),
    'vision_phrase', 'We are becoming better because we are willing to learn together.'
  );
$$;

create or replace function public._cioebp90_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates continuous improvement patterns internally; Unonight is the first external pilot.',
    'focus_areas', jsonb_build_array(
      'Product development — internal improvement cycles for ABOS capabilities',
      'Sales Expert ecosystem — partner onboarding and field feedback loops',
      'Support operations — escalation patterns and knowledge gap closure',
      'Companion experience — proactive guidance and improvement discovery',
      'Knowledge Center — documentation gaps from support and install patterns'
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product dev, Sales Expert, support, companion, KC improvement cycles',
      'focus', jsonb_build_array(
        'ABOS capability improvement initiatives from internal operations metadata',
        'Sales Expert onboarding friction and partner portal feedback loops',
        'Support triage and KC documentation gap patterns',
        'Companion proactive guidance refinement through learning reviews',
        'Install and onboarding improvement from Unonight pilot signals'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support, onboarding, and customer feedback improvement',
      'focus', jsonb_build_array(
        'Support escalation friction reduction initiatives',
        'Onboarding checklist and adoption improvement pilots',
        'Customer feedback-driven KC coverage expansion',
        'Community and success signal integration for improvement discovery'
      )
    )
  );
$$;

create or replace function public._cioebp90_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Long-term organizational growth orchestration — complementary to CIE operational improvement'),
    jsonb_build_object('key', 'evolution_governance', 'label', 'Evolution Governance (repo Phase 84)', 'route', '/app/evolution', 'note', 'Aipify software evolution — distinct from organizational evolution habits'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab (Phase 96 / Blueprint 38)', 'route', '/app/innovation-lab', 'note', 'Controlled experiment validation — experiments may feed CI initiatives'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Lesson capture via improvement_memory_links — metadata only'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'route', '/app/learning', 'note', 'Aipify learns with customer approval — distinct from org improvement initiatives'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights (A.35 / Blueprint 82)', 'route', '/app/executive-insights-engine', 'note', 'Executive reflection and health signals for improvement prioritization'),
    jsonb_build_object('key', 'community', 'label', 'Community (Phase 89)', 'route', '/app/community', 'note', 'Collective intelligence — improvement source cross-link'),
    jsonb_build_object('key', 'capability_maturity', 'label', 'Capability Maturity (A.57)', 'route', '/app/capability-maturity-engine', 'note', 'Maturity roadmaps align with improvement initiatives'),
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Health indicators inform improvement discovery'),
    jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion (Blueprint 72 / A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting decisions and action items as improvement sources'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Compassion and sustainable pacing in improvement — principle only'),
    jsonb_build_object('key', 'marketplace_governance', 'label', 'Marketplace Governance (repo Phase 90)', 'route', '/app/marketplace-governance', 'note', 'Repo phase number collision — quality governance, not CI org evolution')
  );
$$;

create or replace function public._cioebp90_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_items', coalesce((
      select count(*) from public.improvement_items
      where organization_id = p_organization_id and status in ('identified', 'under_review', 'approved')
    ), 0),
    'implemented_items', coalesce((
      select count(*) from public.improvement_items
      where organization_id = p_organization_id and status = 'implemented'
    ), 0),
    'feedback_count', coalesce((
      select count(*) from public.improvement_feedback where organization_id = p_organization_id
    ), 0),
    'initiatives_active', coalesce((
      select count(*) from public.improvement_initiatives
      where organization_id = p_organization_id and status in ('proposed', 'approved', 'in_progress')
    ), 0),
    'initiatives_completed', coalesce((
      select count(*) from public.improvement_initiatives
      where organization_id = p_organization_id and status = 'completed'
    ), 0),
    'review_cycles_completed', coalesce((
      select count(*) from public.improvement_review_cycles
      where organization_id = p_organization_id and review_status = 'completed'
    ), 0),
    'avg_improvement_pct', coalesce((
      select round(avg(improvement_percentage), 1) from public.improvement_success_measurements
      where organization_id = p_organization_id
    ), 0),
    'memory_integration', public._cie_memory_summary(p_organization_id),
    'summary_note', 'Continuous improvement engagement — metadata counts only; humans approve all changes.'
  );
end; $$;

create or replace function public._cioebp90_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._cioebp90_engagement_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Six organizational evolution objectives documented',
      'met', jsonb_array_length(public._cioebp90_objectives()) >= 6,
      'note', 'Learning habits, discovery, safe experimentation, evolution modes, outcome validation, cross-engine integration.'
    ),
    jsonb_build_object(
      'key', 'improvement_questions',
      'label', 'Improvement questions — 🦉🌹❤️🔔 curiosity not criticism',
      'met', jsonb_array_length(public._cioebp90_improvement_questions()) >= 4,
      'note', 'What works, what could improve, what we learned, what deserves recognition.'
    ),
    jsonb_build_object(
      'key', 'improvement_sources',
      'label', 'Improvement sources cross-linked — meetings, support, feedback, Sales Expert, KC, executive, community',
      'met', jsonb_array_length(public._cioebp90_improvement_sources()) >= 7,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — 🦉🌹🔔 curiosity not criticism',
      'met', jsonb_array_length(public._cioebp90_companion_guidance()) >= 3,
      'note', 'Observe patterns, gentle experiments, learning milestones.'
    ),
    jsonb_build_object(
      'key', 'experimentation_principles',
      'label', 'Experimentation principles — small experiments, pilots, learning reviews, safe innovation',
      'met', jsonb_array_length((public._cioebp90_experimentation_principles()->'elements')) >= 4,
      'note', 'Distinct from Innovation Lab Phase 96 validation pipeline.'
    ),
    jsonb_build_object(
      'key', 'organizational_evolution',
      'label', 'Organizational evolution modes — maintain · improve · transform',
      'met', jsonb_array_length((public._cioebp90_organizational_evolution()->'modes')) = 3,
      'note', 'Intentional pacing — not constant disruption.'
    ),
    jsonb_build_object(
      'key', 'learning_cycles',
      'label', 'Learning cycle — Observe → Reflect → Experiment → Learn → Adapt → Repeat',
      'met', jsonb_array_length((public._cioebp90_learning_cycles()->'steps')) = 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — progress not perfection and sustainable pacing',
      'met', (public._cioebp90_self_love_connection()->'self_love_route') is not null,
      'note', 'Principle only — no wellbeing content in CIE tables.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — executive, health, and maturity cross-links',
      'met', jsonb_array_length((public._cioebp90_leadership_insights()->'insight_sources')) >= 4,
      'note', 'Leadership retains prioritization decisions.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust — explainable signals, human approval, audit metadata',
      'met', jsonb_array_length((public._cioebp90_trust_connection()->'human_control')) >= 4,
      'note', 'No silent auto-implementation.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — avoid endless change and excessive optimization pressure',
      'met', jsonb_array_length((public._cioebp90_limitation_principles()->'limitations')) >= 4,
      'note', 'Meaningful evolution not constant disruption.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Growth A.81, Evolution 84, Innovation 96, Memory A.34, Learning, Executive, Community, Maturity, Health',
      'met', jsonb_array_length(public._cioebp90_integration_links()) >= 10,
      'note', 'Distinct from Marketplace repo Phase 90 and Presence A.90.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — product dev, Sales Expert, support, companion, KC',
      'met', (public._cioebp90_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'live_engagement',
      'label', 'Live continuous improvement engagement summary',
      'met', v_engagement ? 'initiatives_active',
      'note', format(
        '%s active initiatives, %s completed, %s feedback items, avg improvement %s%%.',
        coalesce((v_engagement->>'initiatives_active')::int, 0),
        coalesce((v_engagement->>'initiatives_completed')::int, 0),
        coalesce((v_engagement->>'feedback_count')::int, 0),
        coalesce((v_engagement->>'avg_improvement_pct')::numeric, 0)
      )
    ),
    jsonb_build_object(
      'key', 'vision',
      'label', 'Vision — willing to learn together',
      'met', length(public._cioebp90_vision()) > 20,
      'note', public._cioebp90_vision()
    )
  );
end; $$;

create or replace function public._cioebp90_blueprint_block()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'phase', 90,
    'title', 'Continuous Improvement & Organizational Evolution Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE90_CONTINUOUS_IMPROVEMENT_ORGANIZATIONAL_EVOLUTION.md',
    'engine_phase', 'Phase A.33 + A.49 — Continuous Improvement Engine',
    'route', '/app/continuous-improvement-engine',
    'mapping_note', 'ABOS Blueprint Phase 90 extends A.33 + A.49 — distinct from Marketplace Governance repo Phase 90 and Presence A.90.',
    'distinction_note', public._cioebp90_distinction_note(),
    'mission', public._cioebp90_mission(),
    'philosophy', public._cioebp90_philosophy(),
    'abos_principle', public._cioebp90_abos_principle(),
    'vision', public._cioebp90_vision(),
    'objectives', public._cioebp90_objectives(),
    'improvement_questions', public._cioebp90_improvement_questions(),
    'improvement_sources', public._cioebp90_improvement_sources(),
    'companion_guidance', public._cioebp90_companion_guidance(),
    'experimentation_principles', public._cioebp90_experimentation_principles(),
    'organizational_evolution', public._cioebp90_organizational_evolution(),
    'learning_cycles', public._cioebp90_learning_cycles(),
    'self_love_connection', public._cioebp90_self_love_connection(),
    'leadership_insights', public._cioebp90_leadership_insights(),
    'trust_connection', public._cioebp90_trust_connection(),
    'limitation_principles', public._cioebp90_limitation_principles(),
    'dogfooding', public._cioebp90_dogfooding(),
    'integration_links', public._cioebp90_integration_links()
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Replace dashboard — preserve ALL A.49 fields; append blueprint block
-- ---------------------------------------------------------------------------
create or replace function public.get_continuous_improvement_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_seed_items(v_org_id);
  perform public._cie_seed_initiatives(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-guided continuous improvement — feedback drives refinement without silent auto-changes.',
    'principles', jsonb_build_array('Human-guided improvement', 'Explainable optimization', 'Outcome validation', 'Feedback collection', 'Governance-respecting'),
    'summary', jsonb_build_object(
      'active', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
      'implemented', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status = 'implemented'), 0),
      'feedback_count', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id), 0),
      'initiatives_active', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status in ('proposed', 'approved', 'in_progress')), 0),
      'initiatives_completed', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status = 'completed'), 0)
    ),
    'items', coalesce((
      select jsonb_agg(row_to_json(i) order by case i.priority when 'strategic' then 0 when 'high' then 1 else 2 end, i.created_at desc)
      from public.improvement_items i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(n) order by case n.priority when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, n.created_at desc)
      from public.improvement_initiatives n where n.organization_id = v_org_id and n.status not in ('rejected', 'deferred')
    ), '[]'::jsonb),
    'review_cycles', coalesce((
      select jsonb_agg(row_to_json(c) order by c.reviewed_at desc nulls last)
      from public.improvement_review_cycles c where c.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'success_measurements', coalesce((
      select jsonb_agg(row_to_json(m) order by m.measured_at desc)
      from public.improvement_success_measurements m where m.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'trends', jsonb_build_object(
      'feedback_30d', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id and created_at > now() - interval '30 days'), 0),
      'initiatives_completed_90d', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status = 'completed' and updated_at > now() - interval '90 days'), 0),
      'avg_improvement_pct', coalesce((select round(avg(improvement_percentage), 1) from public.improvement_success_measurements where organization_id = v_org_id), 0)
    ),
    'memory_integration', public._cie_memory_summary(v_org_id),
    'recent_feedback', coalesce((
      select jsonb_agg(row_to_json(f) order by f.created_at desc)
      from public.improvement_feedback f where f.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.measured_at desc)
      from public.improvement_outcomes o where o.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'continuous_improvement_organizational_evolution_blueprint', public._cioebp90_blueprint_block() || jsonb_build_object(
      'success_criteria', public._cioebp90_success_criteria(v_org_id),
      'engagement_summary', public._cioebp90_engagement_summary(v_org_id)
    )
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Replace card — preserve ALL A.33 fields; append blueprint block
-- ---------------------------------------------------------------------------
create or replace function public.get_continuous_improvement_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_improvements', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
    'philosophy', 'Continuous refinement through feedback and outcomes.',
    'initiatives_active', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status in ('proposed', 'approved', 'in_progress')), 0),
    'continuous_improvement_organizational_evolution_blueprint', public._cioebp90_blueprint_block() || jsonb_build_object(
      'success_criteria', public._cioebp90_success_criteria(v_org_id),
      'engagement_summary', public._cioebp90_engagement_summary(v_org_id),
      'blueprint_note', 'Continuous Improvement & Organizational Evolution (ABOS Phase 90) — extends A.33 + A.49 with learning cycles, experimentation principles, and org evolution scaffolding.'
    )
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._cioebp90_distinction_note() to authenticated;
grant execute on function public._cioebp90_mission() to authenticated;
grant execute on function public._cioebp90_philosophy() to authenticated;
grant execute on function public._cioebp90_abos_principle() to authenticated;
grant execute on function public._cioebp90_vision() to authenticated;
grant execute on function public._cioebp90_objectives() to authenticated;
grant execute on function public._cioebp90_improvement_questions() to authenticated;
grant execute on function public._cioebp90_improvement_sources() to authenticated;
grant execute on function public._cioebp90_companion_guidance() to authenticated;
grant execute on function public._cioebp90_experimentation_principles() to authenticated;
grant execute on function public._cioebp90_organizational_evolution() to authenticated;
grant execute on function public._cioebp90_learning_cycles() to authenticated;
grant execute on function public._cioebp90_self_love_connection() to authenticated;
grant execute on function public._cioebp90_leadership_insights() to authenticated;
grant execute on function public._cioebp90_trust_connection() to authenticated;
grant execute on function public._cioebp90_limitation_principles() to authenticated;
grant execute on function public._cioebp90_dogfooding() to authenticated;
grant execute on function public._cioebp90_integration_links() to authenticated;
grant execute on function public._cioebp90_engagement_summary(uuid) to authenticated;
grant execute on function public._cioebp90_success_criteria(uuid) to authenticated;
grant execute on function public._cioebp90_blueprint_block() to authenticated;
