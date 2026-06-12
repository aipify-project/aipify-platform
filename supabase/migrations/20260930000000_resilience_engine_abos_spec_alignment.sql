-- ABOS Resilience Engine — spec alignment (extends Phase A.50 Organizational Resilience Engine)
-- Maps to /app/organizational-resilience-engine — NOT a new route. No new tables — dashboard framing only.

create or replace function public.get_organizational_resilience_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'purpose', 'Help organizations remain stable, adaptive, and effective during disruption, uncertainty, and crisis.',
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'principles', jsonb_build_array(
      'Preparedness',
      'Operational continuity',
      'Role clarity',
      'Structured recovery',
      'Continuous learning',
      'Audit accountability'
    ),
    'resilience_dimensions', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational',
        'examples', jsonb_build_array(
          'Critical process continuity and fallback procedures',
          'Service recovery priorities during disruption',
          'Integration and workflow redundancy'
        )
      ),
      jsonb_build_object(
        'key', 'knowledge',
        'label', 'Knowledge',
        'examples', jsonb_build_array(
          'Documented procedures and approved playbooks',
          'Role clarity and escalation paths',
          'Institutional memory capture after events'
        )
      ),
      jsonb_build_object(
        'key', 'human',
        'label', 'Human',
        'examples', jsonb_build_array(
          'Team capacity and backup role assignments',
          'Recovery periods after intense response',
          'Sustainable workload during prolonged disruption'
        )
      ),
      jsonb_build_object(
        'key', 'customer',
        'label', 'Customer',
        'examples', jsonb_build_array(
          'Communication during disruption',
          'Service expectations and status transparency',
          'Coordinated customer-facing updates'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic',
        'examples', jsonb_build_array(
          'Priority decisions during crisis',
          'Adaptation choices under uncertainty',
          'Long-term recovery and capability rebuilding'
        )
      )
    ),
    'crisis_support_guidance', 'During disruption, Aipify surfaces relevant information, approved procedures, and clear next steps — coordinating response while humans lead decisions.',
    'crisis_examples', jsonb_build_array(
      'Here is what we know and what we are doing next.',
      'These are the approved procedures for this scenario.',
      'Human leadership retains decision authority — Aipify coordinates and informs.',
      'Roles and escalation paths are visible — reducing confusion during uncertainty.'
    ),
    'self_love_note', 'Self Love (A.76) supports recovery periods, overload detection, post-event reflection, celebrating progress, and sustainable adjustments — never pressure or guilt during crisis recovery.',
    'growth_evolution_note', 'Growth & Evolution (A.81) integrates post-adversity lessons learned, improvements, capabilities strengthened, and wisdom from difficulty — at /app/growth-evolution-engine.',
    'trust_engine_note', 'Trust Engine (Phase 76) provides calm, transparent, honest communication during uncertainty — explainability at /app/trust.',
    'continuity_phase80_note', 'Continuity, Resilience & Crisis (Phase 80) at /app/continuity handles backup ownership, incident mode, readiness score, and crisis briefings — complements A.50 scenario planning.',
    'distinction_note', 'ABOS Resilience Engine maps to Organizational Resilience Engine A.50 at /app/organizational-resilience-engine — not a new route. Distinct from Phase 80 Continuity (/app/continuity), Organizational Health A.56 (/app/organizational-health-engine), and Growth & Evolution A.81 (/app/growth-evolution-engine).',
    'integration_links', jsonb_build_array(
      jsonb_build_object(
        'label', 'Continuity, Resilience & Crisis (Phase 80)',
        'route', '/app/continuity',
        'description', 'Backup ownership, incident mode, readiness score — complements scenario planning.'
      ),
      jsonb_build_object(
        'label', 'Growth & Evolution Engine (A.81)',
        'route', '/app/growth-evolution-engine',
        'description', 'Post-adversity learning cycles, lessons learned, and capability strengthening.'
      ),
      jsonb_build_object(
        'label', 'Trust Engine (Phase 76)',
        'route', '/app/trust',
        'description', 'Calm, transparent, honest communication during uncertainty.'
      ),
      jsonb_build_object(
        'label', 'Organizational Health (A.56)',
        'route', '/app/organizational-health-engine',
        'description', 'Aggregate health indicators — distinct from resilience planning.'
      ),
      jsonb_build_object(
        'label', 'Incident Response Coordination (A.51)',
        'route', '/app/incident-response-coordination-engine',
        'description', 'Coordinated incident response with ownership and escalation.'
      )
    ),
    'summary', jsonb_build_object(
      'total_plans', coalesce((
        select count(*) from public.resilience_plans where organization_id = v_org_id
      ), 0),
      'active_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'draft_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'open_vulnerabilities', coalesce((
        select count(*) from public.resilience_vulnerabilities
        where organization_id = v_org_id and status in ('open', 'mitigating')
      ), 0),
      'completed_simulations', coalesce((
        select count(*) from public.resilience_simulations
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'under_review'
      ), 0)
    ),
    'plans', coalesce((
      select jsonb_agg(row_to_json(rp) order by rp.created_at desc)
      from public.resilience_plans rp where rp.organization_id = v_org_id
    ), '[]'::jsonb),
    'simulations', coalesce((
      select jsonb_agg(row_to_json(rs) order by rs.created_at desc)
      from public.resilience_simulations rs where rs.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'vulnerabilities', coalesce((
      select jsonb_agg(row_to_json(rv) order by rv.created_at desc)
      from public.resilience_vulnerabilities rv where rv.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(rr) order by rr.review_date desc)
      from public.resilience_reviews rr where rr.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ore_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'security_trust', 'Extends Security & Trust (A.18) with vulnerability tracking',
      'operations_center', 'Aligns with Operations Center Foundation (A.32) event context',
      'executive_insights', 'Executive summary via get_resilience_executive_summary() — A.35',
      'organizational_memory', 'Review completion may capture lessons learned — metadata only (A.34)',
      'continuous_improvement', 'Findings scaffold improvement workflow (A.33)'
    ),
    'integration_summaries', jsonb_build_object(
      'security', public._ore_security_summary(v_org_id),
      'operations', public._ore_operations_summary(v_org_id),
      'memory', public._ore_memory_summary(v_org_id),
      'improvement', public._ore_improvement_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_resilience_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = v_org_id and status in ('open', 'mitigating')
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;
