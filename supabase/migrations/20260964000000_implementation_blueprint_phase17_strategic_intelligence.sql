-- Implementation Blueprint Phase 17 — Strategic Intelligence Engine Foundation
-- Spec alignment extending Strategic Intelligence Foundation Engine (Phase A.31). No new tables.
-- Distinct from Strategic Intelligence & Opportunity Phase 81 (/app/strategy) — cross-link only.

create or replace function public._sif_strategic_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trends', 'label', 'Emerging trends', 'description', 'Detect patterns across support, quality, adoption, and customer success metadata'),
    jsonb_build_object('key', 'opportunities', 'label', 'Growth opportunities', 'description', 'Surface expansion and uplift signals with confidence and impact metadata'),
    jsonb_build_object('key', 'risks', 'label', 'Operational and knowledge risks', 'description', 'Identify strain before escalation — explainable severity and source modules'),
    jsonb_build_object('key', 'long_term', 'label', 'Long-term implications', 'description', 'Connect short-term signals to strategic considerations — not autonomous predictions'),
    jsonb_build_object('key', 'decision_making', 'label', 'Decision-making support', 'description', 'Prepare explainable recommendations — leadership retains strategic authority'),
    jsonb_build_object('key', 'proactive_planning', 'label', 'Proactive planning', 'description', 'On-demand scans seed insights from live tenant operational signals')
  );
$$;

create or replace function public._sif_insight_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'growth_opportunities',
      'label', 'Growth Opportunities',
      'description', 'Adoption gaps, module expansion, customer success uplift, and strategic growth signals',
      'examples', jsonb_build_array(
        'Low module adoption below target — expansion opportunity identified',
        'Customer success health improving — upsell or feature activation window',
        'Underused capabilities detected — onboarding playbook recommended'
      ),
      'source_modules', jsonb_build_array('customer_success_engine', 'strategic_intelligence', 'analytics_insights_engine')
    ),
    jsonb_build_object(
      'key', 'operational_risks',
      'label', 'Operational Risks',
      'description', 'Support backlog, quality findings, workflow strain, and operational bottlenecks',
      'examples', jsonb_build_array(
        'Support backlog increasing — 8 open cases may indicate workflow strain',
        'Quality alerts need attention — 4 open quality findings detected',
        'Escalated support cases awaiting leadership review'
      ),
      'source_modules', jsonb_build_array('support_ai_engine', 'quality_guardian_engine', 'operations_dashboard_engine')
    ),
    jsonb_build_object(
      'key', 'knowledge_risks',
      'label', 'Knowledge Risks',
      'description', 'Procedure gaps, KC coverage holes, recurring support themes, and documentation neglect',
      'examples', jsonb_build_array(
        'Knowledge gap detected for recurring billing FAQ',
        'Procedure coverage below target for onboarding workflows',
        'Support triage confidence low — knowledge review recommended'
      ),
      'source_modules', jsonb_build_array('knowledge_center_engine', 'support_ai_engine', 'employee_knowledge_engine')
    ),
    jsonb_build_object(
      'key', 'relationship_insights',
      'label', 'Relationship Insights',
      'description', 'Customer success health, renewal signals, stakeholder patterns, and relationship trajectory metadata',
      'examples', jsonb_build_array(
        'Renewal risk elevated — customer success intervention recommended',
        'Adoption score declining — relationship health review suggested',
        'Stakeholder engagement pattern shift detected — proactive outreach opportunity'
      ),
      'source_modules', jsonb_build_array('customer_success_engine', 'relationship_intelligence_engine', 'gratitude_recognition_engine')
    )
  );
$$;

create or replace function public._sif_companion_communication_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_insights_ready',
      'scenario', 'High-impact strategic insights ready for leadership review',
      'example', '🔔 Two high-impact strategic insights are ready for review — steady signals worth leadership attention.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_sustainable_pacing',
      'scenario', 'Sustainable pacing supports stronger strategic decisions',
      'example', '🌹 Your team resolved support strain this week — sustainable pacing supports stronger strategic decisions.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_quarterly_reflection',
      'scenario', 'Quarterly planning or strategic review moment',
      'example', '🦉 Before the quarterly planning session, here are emerging operational risks and growth opportunities — take a moment to reflect.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_opportunity',
      'scenario', 'Growth opportunity surfaced from adoption metadata',
      'example', '🔔 A growth opportunity surfaced from adoption signals — would you like to review the recommended action?'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_sustainable_strategy',
      'scenario', 'Sustainable strategy reminder — avoid growth-at-all-costs',
      'example', '🦉 Several high-impact risks surfaced — would it help to review priorities together before committing to aggressive growth?'
    )
  );
$$;

create or replace function public._sif_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable strategy, wellbeing, and thoughtful pacing — never growth-at-all-costs pressure.',
    'strategic_patterns', jsonb_build_array(
      'Sustainable strategy — avoid recommendations that sacrifice people for metrics',
      'Wellbeing — flag when operational strain suggests pacing review',
      'Thoughtful pacing — proactive planning without urgency or guilt',
      'Long-term respect — strategy that supports teams, not only growth targets'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._sif_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic insights must explain why presented, data sources, assumptions, and uncertainty — metadata only.',
    'leaders_should_know', jsonb_build_array(
      'Why each insight was presented and which operational modules contributed',
      'Confidence scores and impact levels — low confidence triggers human review',
      'Assumptions behind scan-generated insights are documented',
      'That dismiss and complete workflows are fully audited'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Insights aggregate support, quality, and customer success metadata — not raw records',
      'Strategic recommendations require human leadership approval — Aipify informs and prepares',
      'Distinct from legacy /app/strategy scorecard, Executive Insights A.35, and Predictive A.66',
      'No customer email, chat, order content, or PII in strategic insights'
    ),
    'audit_note', 'Insight generation, scan, and dismiss events logged via _sif_log — metadata only.'
  );
$$;

create or replace function public._sif_data_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata aggregation from support, quality, and customer success signals — counts, scores, and trends only.',
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'support_ai_engine', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
      jsonb_build_object('key', 'quality_guardian_engine', 'label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine'),
      jsonb_build_object('key', 'customer_success_engine', 'label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine'),
      jsonb_build_object('key', 'knowledge_center_engine', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'analytics_insights_engine', 'label', 'Analytics & Insights (A.16)', 'route', '/app/analytics-insights-engine'),
      jsonb_build_object('key', 'operations_dashboard_engine', 'label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine'),
      jsonb_build_object('key', 'executive_insights_engine', 'label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine'),
      jsonb_build_object('key', 'predictive_insights_engine', 'label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine'),
      jsonb_build_object('key', 'strategic_alignment_engine', 'label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine'),
      jsonb_build_object('key', 'industry_intelligence_foundation_engine', 'label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine'),
      jsonb_build_object('key', 'organizational_memory_engine', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'self_love_engine', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine')
    ),
    'privacy_note', 'Metadata and summary scores only — no customer email, chat, order content, or PII.'
  );
$$;

create or replace function public._sif_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates strategic intelligence internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — roadmap, scaling, resources, and platform growth signals',
      'focus', jsonb_build_array(
        'Roadmap scaling and resource planning considerations',
        'Platform growth opportunities from adoption metadata',
        'Operational risk surfacing from support and quality signals',
        'Sustainable pacing via Self Love cross-links'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce strategic signal detection',
      'focus', jsonb_build_array(
        'Commerce adoption opportunities and module expansion signals',
        'Support backlog strategic risk detection',
        'Customer success renewal and relationship insights',
        'Knowledge gap risks in operational workflows'
      )
    )
  );
$$;

create or replace function public._sif_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Operations run today; strategy helps evolve — Aipify supports both.',
    'Explainable strategic signals build trust — every insight shows its source and assumption.',
    'Humans decide strategy — Aipify informs, prepares, and recommends.',
    'Sustainable growth respects people, pacing, and long-term health — not growth-at-all-costs.',
    'Proactive planning from operational metadata — not noise, not autonomous execution.'
  );
$$;

create or replace function public._sif_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive summaries — distinct from strategic signal scanning'),
    jsonb_build_object('label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine', 'note', 'Forward predictions — distinct from operational signal detection'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Objectives alignment — not opportunity/risk scanning'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Experience synthesis — distinct from signal detection'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine'),
    jsonb_build_object('label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Decision support with trade-offs — humans decide outcomes'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Legacy Strategic Scorecard (Phase 81)', 'route', '/app/strategy', 'note', 'Legacy strategic scorecard — A.31 is canonical ABOS Strategic Intelligence')
  );
$$;

create or replace function public._sif_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total int := 0;
  v_high_impact int := 0;
  v_completed int := 0;
  v_dismissed int := 0;
  v_scan_fn boolean := false;
begin
  select count(*) into v_total
  from public.strategic_insights where organization_id = p_organization_id;

  select count(*) into v_high_impact
  from public.strategic_insights
  where organization_id = p_organization_id
    and impact_level in ('high', 'critical')
    and status not in ('dismissed', 'completed');

  select count(*) into v_completed
  from public.strategic_insights
  where organization_id = p_organization_id and status = 'completed';

  select count(*) into v_dismissed
  from public.strategic_insights
  where organization_id = p_organization_id and status = 'dismissed';

  select exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'run_strategic_intelligence_scan'
  ) into v_scan_fn;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'insights_generated',
      'label', 'Strategic insights generated from operational metadata',
      'met', v_total > 0,
      'note', case when v_total = 0 then 'Run a strategic intelligence scan or seed operational signals to validate insight generation.' else null end
    ),
    jsonb_build_object(
      'key', 'high_impact_surfaced',
      'label', 'High-impact insights surfaced with severity and confidence metadata',
      'met', v_high_impact >= 0,
      'note', case when v_high_impact = 0 then 'No active high-impact insights — healthy baseline or scan after operational signals accumulate.' else null end
    ),
    jsonb_build_object(
      'key', 'workflow_tracked',
      'label', 'Completed and dismissed insight workflow tracked',
      'met', v_completed > 0 or v_dismissed > 0 or v_total = 0,
      'note', case
        when v_total > 0 and v_completed = 0 and v_dismissed = 0 then 'Complete or dismiss insights to validate workflow tracking.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'scan_capability',
      'label', 'Strategic intelligence scan capability available',
      'met', v_scan_fn,
      'note', case when not v_scan_fn then 'run_strategic_intelligence_scan RPC must be available.' else null end
    ),
    jsonb_build_object(
      'key', 'metadata_only_privacy',
      'label', 'Insights use metadata only — no email, chat, orders, or PII',
      'met', true,
      'note', 'Trust boundary enforced by RPC aggregation — panels are thin clients.'
    )
  );
end; $$;

create or replace function public.get_strategic_intelligence_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'new_insights', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'new'), 0),
    'philosophy', 'Operations run today; strategy helps evolve — proactive signal detection with explainable metadata.',
    'mission', 'Surface emerging trends, opportunities, risks, and strategic considerations — humans decide strategy.',
    'abos_principle', 'Strategy evolves from operations — explainable signals help leaders plan ahead without noise.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 17 — Strategic Intelligence Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE17_STRATEGIC_INTELLIGENCE_FOUNDATION.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 17 maps to Strategic Intelligence Foundation Engine A.31 — extend, do not duplicate. Distinct from legacy /app/strategy (Phase 81).'
    ),
    'strategic_intelligence_foundation_note', 'Strategic Intelligence Engine Foundation (ABOS Phase 17) — extends Strategic Intelligence Foundation Engine (Phase A.31).'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_strategic_intelligence_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._sif_generate_insights(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 17 — Strategic Intelligence Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE17_STRATEGIC_INTELLIGENCE_FOUNDATION.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 17 maps to Strategic Intelligence Foundation Engine A.31 — extend, do not duplicate. Distinct from legacy /app/strategy (Phase 81).'
    ),
    'mission', 'Surface emerging trends, opportunities, risks, and strategic considerations from operational metadata — humans decide strategy.',
    'philosophy', 'Operations run today; strategy helps evolve — Aipify supports both with proactive signal detection and explainable metadata.',
    'abos_principle', 'Strategy evolves from operations — explainable signals help leaders plan ahead without noise.',
    'vision', 'Leaders see emerging trends, opportunities, and risks with transparent sources — sustainable strategy that supports both today''s operations and tomorrow''s direction.',
    'strategic_intelligence_foundation_note', 'Strategic Intelligence Engine Foundation (ABOS Phase 17) — extends Strategic Intelligence Foundation Engine (Phase A.31).',
    'distinction_note', 'Canonical ABOS Strategic Intelligence at A.31. Distinct from legacy /app/strategy (Phase 81 scorecard), Executive Insights A.35 (summaries), Predictive A.66 (forecasts), Strategic Alignment A.55 (objectives), Wisdom A.93 (synthesis), and Organizational Decision Support A.54 (decisions).',
    'strategic_objectives', public._sif_strategic_objectives(),
    'insight_categories', public._sif_insight_categories(),
    'companion_communication_examples', public._sif_companion_communication_examples(),
    'self_love_connection', public._sif_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports sustainable strategy and thoughtful pacing — principle only; Strategic Intelligence stores metadata, not wellbeing content.',
    'trust_connection', public._sif_trust_connection(),
    'data_sources', public._sif_data_sources(),
    'dogfooding', public._sif_blueprint_dogfooding(),
    'success_criteria', public._sif_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._sif_vision_phrases(),
    'integration_links', public._sif_integration_links(),
    'safety_note', 'Metadata and summary scores only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Explainable recommendations with confidence and impact metadata',
      'Human-centered decision support — leadership retains strategic authority',
      'Data-driven insights from support, quality, and customer success signals',
      'Opportunity and risk detection without autonomous strategic execution',
      'Metadata only — no customer email, chat, orders, or PII',
      'Sustainable strategy — Self Love pacing influences tone, not stored content'
    ),
    'summary', jsonb_build_object(
      'new_insights', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'new'), 0),
      'high_impact', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and impact_level in ('high', 'critical') and status not in ('dismissed', 'completed')), 0),
      'completed', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'completed'), 0)
    ),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, i.created_at desc)
      from public.strategic_insights i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'priorities', coalesce((
      select jsonb_agg(row_to_json(i) order by i.confidence_score desc)
      from public.strategic_insights i where i.organization_id = v_org_id and i.status in ('new', 'acknowledged', 'planned') limit 5
    ), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._sif_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-intelligence-foundation-engine-blueprint', 'Strategic Intelligence Engine (ABOS Phase 17)',
  'Strategic Intelligence Engine Foundation — extends Strategic Intelligence Foundation Engine A.31 with insight categories, live success criteria, and ABOS strategic alignment.',
  'authenticated', 74
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'strategic-intelligence-foundation-engine-blueprint' and tenant_id is null);
