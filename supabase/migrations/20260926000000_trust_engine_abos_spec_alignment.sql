-- ABOS Trust Engine — spec alignment (extends Phase 76 Trust Transparency & Explainability)
-- Distinct from Trust & Reputation Engine (A.72). No new tables — dashboard framing only.

create or replace function public.get_trust_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_total int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select metric_value into v_score from public.explainability_trust_metrics
  where tenant_id = v_tenant_id and metric_key = 'trust_score'
  order by recorded_at desc limit 1;

  select count(*) into v_total from public.decision_explanations where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'trust_score', coalesce(v_score, 75),
    'explanation_count', v_total,
    'philosophy', 'Trust is earned continuously — through transparency, explainability, and accountable assistance.',
    'mission', 'Every important decision can be understood, reviewed, audited, and trusted.',
    'abos_principle', 'Trust cannot be demanded — it is earned through consistent transparency and human oversight.',
    'privacy_note', 'Explanations never expose secrets or cross-tenant data.'
  );
end; $$;

create or replace function public.get_trust_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_trust jsonb;
  v_explanations jsonb;
  v_metrics jsonb;
  v_feedback jsonb;
begin
  v_tenant_id := public._tte_require_tenant();
  v_trust := public.calculate_explainability_trust_score();

  select coalesce(jsonb_agg(public._tte_explanation_json(d) order by d.created_at desc), '[]'::jsonb)
  into v_explanations
  from public.decision_explanations d where d.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'metric_key', m.metric_key, 'metric_value', m.metric_value, 'recorded_at', m.recorded_at
  ) order by m.recorded_at desc), '[]'::jsonb)
  into v_metrics
  from public.explainability_trust_metrics m
  where m.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'rating', f.rating, 'comment', f.comment, 'created_at', f.created_at
  ) order by f.created_at desc), '[]'::jsonb)
  into v_feedback
  from public.explanation_feedback f where f.tenant_id = v_tenant_id limit 10;

  return jsonb_build_object(
    'has_customer', true,
    'trust_score', v_trust->'trust_score',
    'coverage', v_trust->'explanation_coverage',
    'view_rate', v_trust->'view_rate',
    'override_rate', v_trust->'override_rate',
    'escalations', v_trust->'escalations',
    'explanations', v_explanations,
    'metrics', v_metrics,
    'recent_feedback', v_feedback,
    'philosophy', 'Trust is earned continuously — through transparency, explainability, auditability, predictability, governance, and human oversight.',
    'mission', 'Every important decision can be understood, reviewed, audited, and trusted.',
    'abos_principle', 'Trust cannot be demanded — it is earned through consistent transparency and accountable assistance.',
    'self_love_note', 'Self Love (A.76) monitors trust health — explanation gaps, override spikes, and low-confidence clusters — and suggests transparency improvements without compromising privacy.',
    'explainability_framework', jsonb_build_object(
      'why', 'Decision summary and reasoning — what happened and why Aipify recommends this path.',
      'sources', 'Information used — approved metadata, knowledge references, and contextual signals (never raw customer content).',
      'assumptions', 'Rules applied and contextual assumptions — governance policies, approval tiers, and module constraints.',
      'alternatives', 'Alternatives considered — other viable paths and why they were not selected.',
      'confidence', 'Confidence level (high, medium, low) with honest communication — escalation when evidence is limited.'
    ),
    'transparency_requirements', jsonb_build_array(
      'No important decision without explanation',
      'Confidence communicated honestly — never false certainty',
      'Human override and escalation paths always visible',
      'Explanations never expose secrets, API keys, or cross-tenant data',
      'Governance and approval policies supplement explainability — never bypassed'
    ),
    'confidence_communication', jsonb_build_array(
      jsonb_build_object(
        'level', 'high',
        'label', 'High confidence',
        'when', 'Strong evidence, clear rules, and clear reasoning.',
        'example', 'Aipify is confident in this recommendation based on clear rules and strong supporting evidence.'
      ),
      jsonb_build_object(
        'level', 'moderate',
        'label', 'Moderate confidence',
        'when', 'Moderate evidence and partial certainty.',
        'example', 'Aipify has moderate confidence — review the reasoning and confirm before acting.'
      ),
      jsonb_build_object(
        'level', 'low',
        'label', 'Low confidence',
        'when', 'Limited information — escalation recommended.',
        'example', 'Confidence is limited — Aipify recommends human review or escalation before proceeding.'
      )
    ),
    'accountability_principles', jsonb_build_array(
      'Humans retain responsibility for consequential decisions',
      'Overrides are logged and auditable',
      'Escalation is preferred over invented reasoning',
      'Feedback improves explainability — questioning is encouraged'
    ),
    'auditability_fields', jsonb_build_array(
      'actor', 'event_type', 'timestamp', 'override_reason',
      'feedback_rating', 'decision_id', 'source_module', 'metadata_summary'
    ),
    'consistency_monitoring', jsonb_build_array(
      'Explanation coverage across decision types',
      'View rate and engagement with explanations',
      'Override and escalation frequency',
      'Feedback satisfaction trends',
      'Cross-module explainability alignment (governance, actions, support, automation)'
    ),
    'relationship_intelligence_note', 'Organizational Relationship Intelligence (A.78) complements trust explainability — relationship-aware decisions reference metadata summaries in explanations without exposing private communications.',
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Trust & Reputation Engine (A.72)', 'route', '/app/trust-reputation-engine', 'description', 'Entity-scoped reputation signals — complements explainability trust.'),
      jsonb_build_object('label', 'Approval Center', 'route', '/app/approvals', 'description', 'Action & Approval Engine — human approval for sensitive operations.'),
      jsonb_build_object('label', 'Human Oversight Engine (A.40)', 'route', '/app/human-oversight-engine', 'description', 'Organizational oversight, approval tiers, and accountability metrics.'),
      jsonb_build_object('label', 'Relationship Intelligence (A.78)', 'route', '/app/relationship-intelligence-engine', 'description', 'Organizational relationship context for trust-aware assistance.'),
      jsonb_build_object('label', 'Security & Trust Architecture', 'route', '/app/settings/security', 'description', 'Data ownership, access levels, and storage boundaries.')
    ),
    'privacy_note', 'Explanations and trust metrics use metadata only. No raw email, chat, orders, or cross-tenant content.'
  );
end; $$;

-- Knowledge Center category (seed only if missing)
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust', 'Trust & Explainability', 'How Aipify explains decisions and earns trust.', 'authenticated', 20
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'trust' and tenant_id is null);
