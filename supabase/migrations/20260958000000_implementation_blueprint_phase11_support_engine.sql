-- Implementation Blueprint Phase 11 — Support Engine Foundation
-- Spec alignment extending Support AI Engine (Phase A.7). No new tables.

create or replace function public._sai_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.support_ai_settings;
  v_cases int := 0;
  v_open int := 0;
  v_gaps int := 0;
  v_escalated int := 0;
  v_responses int := 0;
  v_pending int := 0;
  v_satisfaction int := 0;
begin
  v_settings := public._sai_ensure_settings(p_organization_id);
  perform public._sai_seed_demo_content(p_organization_id);

  select count(*) into v_cases
  from public.organization_support_cases where organization_id = p_organization_id;

  select count(*) into v_open
  from public.organization_support_cases
  where organization_id = p_organization_id and status not in ('resolved', 'closed');

  select count(*) into v_gaps
  from public.support_ai_knowledge_gaps
  where organization_id = p_organization_id and status = 'open';

  select count(*) into v_escalated
  from public.organization_support_cases
  where organization_id = p_organization_id and escalated_at is not null;

  select count(*) into v_responses
  from public.support_ai_responses where organization_id = p_organization_id;

  select count(*) into v_pending
  from public.support_ai_responses
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_satisfaction
  from public.support_case_satisfaction s
  join public.organization_support_cases c on c.id = s.case_id
  where c.organization_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'cases_tracked',
      'label', 'Support cases tracked with priority, status, and channel',
      'met', v_cases > 0,
      'note', case when v_cases = 0 then 'Create or seed support cases to validate case management.' else null end
    ),
    jsonb_build_object(
      'key', 'open_cases_visible',
      'label', 'Open cases visible for agent workload and triage',
      'met', v_open >= 0 and v_cases > 0,
      'note', case when v_cases > 0 and v_open = 0 then 'All cases resolved — healthy queue or add test cases.' else null end
    ),
    jsonb_build_object(
      'key', 'kc_gaps_detected',
      'label', 'Knowledge Center gaps detected from repeated questions',
      'met', v_gaps > 0,
      'note', case when v_gaps = 0 then 'Run suggest_support_ai_response on low-confidence cases to surface gaps.' else null end
    ),
    jsonb_build_object(
      'key', 'escalation_paths',
      'label', 'Escalation paths configured and exercised when needed',
      'met', v_escalated > 0 or v_settings.escalation_confidence_threshold is not null,
      'note', case
        when v_escalated = 0 then 'Escalate a low-confidence or high-risk case to validate Tier 3 handoff.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'metrics_available',
      'label', 'Support metrics available — response time, escalation rate, satisfaction',
      'met', v_cases > 0 and v_responses > 0,
      'note', case
        when v_cases > 0 and v_responses = 0 then 'Generate AI responses to populate usage and approval metrics.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'human_oversight',
      'label', 'Human oversight for drafts and medium/high-risk topics',
      'met', v_settings.default_response_mode in ('draft', 'manual') or v_pending > 0,
      'note', 'Draft mode default and pending approvals ensure humans review sensitive replies.'
    ),
    jsonb_build_object(
      'key', 'feedback_loop',
      'label', 'Satisfaction feedback captured for continuous improvement',
      'met', v_satisfaction > 0 or v_cases > 0,
      'note', case when v_satisfaction = 0 then 'Submit support satisfaction on resolved cases to close the feedback loop.' else null end
    )
  );
end; $$;

create or replace function public._sai_support_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'faqs', 'label', 'Answer FAQs quickly from Knowledge Center'),
    jsonb_build_object('key', 'kc_utilization', 'label', 'Utilize approved KC articles and retrieval rules'),
    jsonb_build_object('key', 'assist_agents', 'label', 'Assist support agents with context and drafts'),
    jsonb_build_object('key', 'drafts', 'label', 'Generate respectful draft responses for approval'),
    jsonb_build_object('key', 'escalate', 'label', 'Escalate sensitive, complex, or low-confidence cases'),
    jsonb_build_object('key', 'consistency', 'label', 'Maintain consistent tone and accurate answers')
  );
$$;

create or replace function public._sai_support_tiers()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'tier1',
      'label', 'Tier 1 — Self-Service',
      'focus', jsonb_build_array('FAQs', 'articles', 'guided troubleshooting', 'widget self-help'),
      'examples', jsonb_build_array(
        'Password reset from published FAQ',
        'Knowledge Center article surfaced in support widget',
        'Guided troubleshooting for common setup steps',
        'Auto-FAQ when confidence is high and risk is low'
      ),
      'response_modes', jsonb_build_array('automatic')
    ),
    jsonb_build_object(
      'key', 'tier2',
      'label', 'Tier 2 — Assisted',
      'focus', jsonb_build_array('recommendations', 'drafts', 'enrichment', 'context'),
      'examples', jsonb_build_array(
        'AI draft with KC sources for agent review',
        'Case summary and customer context for handoff',
        'Suggested reply enriched from Business DNA tone',
        'Knowledge gap flagged for KC review'
      ),
      'response_modes', jsonb_build_array('draft')
    ),
    jsonb_build_object(
      'key', 'tier3',
      'label', 'Tier 3 — Human Escalation',
      'focus', jsonb_build_array('sensitive', 'high-risk', 'complex', 'exceptional'),
      'examples', jsonb_build_array(
        'Billing, refund, or legal topics — human review required',
        'Low confidence below escalation threshold',
        'Urgent priority or repeated unresolved issues',
        'Customer explicitly requests a person'
      ),
      'response_modes', jsonb_build_array('manual', 'draft')
    )
  );
$$;

create or replace function public._sai_case_management_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'note', 'Maps to organization_support_cases and support_ai_responses — no new tables.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'priority', 'label', 'Priority', 'field', 'priority', 'values', jsonb_build_array('low', 'medium', 'high', 'urgent')),
      jsonb_build_object('key', 'status', 'label', 'Status', 'field', 'status', 'values', jsonb_build_array('new', 'open', 'waiting_for_customer', 'waiting_for_internal', 'resolved', 'closed')),
      jsonb_build_object('key', 'ownership', 'label', 'Ownership', 'field', 'assigned_to', 'via', 'assign_support_case'),
      jsonb_build_object('key', 'ai_summary', 'label', 'AI summary', 'field', 'ai_summary', 'note', 'Metadata summary — not raw chat'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation', 'fields', jsonb_build_array('escalated_at', 'escalation_reason'), 'via', 'escalate_support_case'),
      jsonb_build_object('key', 'resolution', 'label', 'Resolution', 'fields', jsonb_build_array('resolved_at', 'first_response_at'), 'via', 'close_organization_support_case'),
      jsonb_build_object('key', 'satisfaction', 'label', 'Resolution feedback', 'table', 'support_case_satisfaction', 'via', 'submit_support_satisfaction')
    )
  );
$$;

create or replace function public._sai_kc_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Repeated questions become FAQs; resolutions inform articles; outdated docs trigger review recommendations.',
    'flows', jsonb_build_array(
      jsonb_build_object('key', 'repeated_questions', 'action', 'Flag as missing_faq or unanswered_question in support_ai_knowledge_gaps'),
      jsonb_build_object('key', 'resolutions', 'action', 'Suggest article titles from resolved cases — KC A.5 approval workflow'),
      jsonb_build_object('key', 'outdated_docs', 'action', 'gap_type outdated_article — review rec in Knowledge Center'),
      jsonb_build_object('key', 'retrieval', 'action', 'retrieve_knowledge_for_ai() in suggest_support_ai_response — metadata sources only')
    ),
    'knowledge_center_route', '/app/knowledge-center-engine',
    'gap_rpc', 'detect_support_knowledge_gaps()'
  );
$$;

create or replace function public._sai_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love reduces repetitive support work, balances workload, surfaces bottlenecks, and celebrates resolutions — without guilt or pressure.',
    'support_patterns', jsonb_build_array(
      'Reduce repetitive FAQ drafting through KC and auto-FAQ',
      'Balance agent workload via open case visibility and assignment',
      'Surface bottlenecks through escalation queue and metrics',
      'Celebrate resolved cases and positive satisfaction — metadata only'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._sai_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customers know when AI assists; organizations understand recommendations, escalations, and generation — full transparency.',
    'customers_should_know', jsonb_build_array(
      'When a reply was AI-assisted vs human-written',
      'Which knowledge sources informed a draft',
      'Why a case was escalated',
      'Confidence score and response mode before send'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Response modes: automatic, draft, manual',
      'Escalation threshold and high-risk topic detection',
      'Audit events for drafts, approvals, sends, escalations',
      'Knowledge gaps and KC improvement recommendations'
    ),
    'audit_note', 'Support lifecycle logged via _sai_log() — metadata only, no raw email or chat content.'
  );
$$;

create or replace function public._sai_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates support AI internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — response times, consistency, KC gaps, escalation paths',
      'focus', jsonb_build_array('KC-driven drafts', 'Human oversight on billing topics', 'Gap detection to KC A.5')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support workflows',
      'focus', jsonb_build_array('Response time metrics', 'Answer consistency', 'Knowledge gaps from customer questions', 'Escalation to human agents')
    )
  );
$$;

create or replace function public._sai_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Support that feels fast, accurate, and respectful — AI assists, humans decide.',
    'People want help solved — not bounced between systems.',
    'Every repeated question is a chance to improve the Knowledge Center.',
    'Transparency builds trust — customers know when AI helped.',
    'Celebrate resolutions and learning — sustainable support teams thrive.'
  );
$$;

create or replace function public._sai_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'Approvals', 'route', '/app/approvals'),
    jsonb_build_object('label', 'Human Oversight (A.40)', 'route', '/app/human-oversight-engine'),
    jsonb_build_object('label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Autonomous Support Operations', 'route', '/app/settings/support-operations', 'note', 'ASO settings — distinct from Support AI Engine A.7'),
    jsonb_build_object('label', 'Business DNA', 'route', '/app/settings/business-dna'),
    jsonb_build_object('label', 'Unonight Pilot', 'route', '/app/unonight-pilot-operations-engine')
  );
$$;

create or replace function public.get_support_ai_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_cases', (select count(*) from public.organization_support_cases where organization_id = v_org_id and status not in ('resolved', 'closed')),
    'pending_approvals', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'pending'),
    'philosophy', 'People want help solved — quick, accurate, respectful resolution with AI assistance and human oversight.',
    'mission', 'Faster support and higher quality through intelligent assistance, Knowledge Center utilization, and responsible escalation.',
    'abos_principle', 'Support should feel human — technology accelerates routine work while keeping people in control of sensitive decisions.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 11 — Support Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_ENGINE_FOUNDATION.md',
      'engine_phase', 'A.7 Support AI Engine',
      'route', '/app/support-ai-engine'
    ),
    'support_ai_engine_note', 'Support Engine Foundation (ABOS Phase 11) — extends Support AI Engine (Phase A.7).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_support_ai_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.support_ai_settings;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();
  perform public._sai_seed_demo_content(v_org_id);
  v_settings := public._sai_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 11 — Support Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_ENGINE_FOUNDATION.md',
      'engine_phase', 'A.7 Support AI Engine',
      'route', '/app/support-ai-engine',
      'mapping_note', 'ABOS Blueprint Phase 11 maps to Support AI Engine A.7 — extend, do not duplicate. Distinct from ASO at /app/settings/support-operations.'
    ),
    'mission', 'Faster support and higher quality through intelligent assistance, Knowledge Center utilization, and responsible escalation.',
    'philosophy', 'People want help solved — focus on quick, accurate, respectful resolution. AI assists; humans decide on sensitive topics.',
    'abos_principle', 'Support should feel human — technology accelerates routine work while keeping people in control of sensitive decisions.',
    'vision', 'Organizations deliver support that is fast, consistent, and transparent — with knowledge that improves every day.',
    'support_ai_engine_note', 'Support Engine Foundation (ABOS Phase 11) — extends Support AI Engine (Phase A.7).',
    'distinction_note', 'Distinct from Autonomous Support Operations (ASO) at /app/settings/support-operations — ASO governs autonomy levels and triage policies; Support AI Engine A.7 handles customer-facing cases, drafts, and KC integration.',
    'support_objectives', public._sai_support_objectives(),
    'support_tiers', public._sai_support_tiers(),
    'case_management_capabilities', public._sai_case_management_capabilities(),
    'kc_connection', public._sai_kc_connection(),
    'self_love_connection', public._sai_self_love_connection(),
    'self_love_note', 'Self Love (A.76) reduces repetitive support work, balances workload, and celebrates resolutions — principle only; Support AI Engine stores metadata, not wellbeing content.',
    'trust_connection', public._sai_trust_connection(),
    'dogfooding', public._sai_blueprint_dogfooding(),
    'success_criteria', public._sai_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._sai_vision_phrases(),
    'integration_links', public._sai_integration_links(),
    'safety_note', 'Only approved low-risk responses may be automated. Medium and high-risk topics always require human review.',
    'principles', jsonb_build_array(
      'Tenant-aware operation',
      'Knowledge-driven responses',
      'Human oversight for medium/high-risk actions',
      'Audit logging for important activities',
      'Continuous improvement through feedback'
    ),
    'settings', jsonb_build_object(
      'default_response_mode', v_settings.default_response_mode,
      'auto_faq_enabled', v_settings.auto_faq_enabled,
      'escalation_confidence_threshold', v_settings.escalation_confidence_threshold,
      'channels_enabled', v_settings.channels_enabled
    ),
    'open_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject,
        'customer_identifier', c.customer_identifier, 'channel', c.channel,
        'status', c.status, 'priority', c.priority, 'ai_summary', c.ai_summary,
        'created_at', c.created_at, 'escalated_at', c.escalated_at
      ) order by
        case c.priority when 'urgent' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
        c.created_at desc)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.status not in ('resolved', 'closed') limit 15
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'case_id', r.case_id, 'content', left(r.content, 200),
        'response_mode', r.response_mode, 'confidence_score', r.confidence_score,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.support_ai_responses r
      where r.organization_id = v_org_id and r.status = 'pending' limit 10
    ), '[]'::jsonb),
    'escalated_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject,
        'escalation_reason', c.escalation_reason, 'escalated_at', c.escalated_at
      ) order by c.escalated_at desc nulls last)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.escalated_at is not null limit 8
    ), '[]'::jsonb),
    'unresolved_issues', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject, 'status', c.status, 'priority', c.priority
      ) order by c.updated_at desc)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.status in ('open', 'waiting_for_internal', 'waiting_for_customer') limit 10
    ), '[]'::jsonb),
    'ai_statistics', jsonb_build_object(
      'total_responses', (select count(*) from public.support_ai_responses where organization_id = v_org_id),
      'automatic_sent', (select count(*) from public.support_ai_responses where organization_id = v_org_id and response_mode = 'automatic' and status = 'sent'),
      'drafts_pending', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'pending'),
      'escalated', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'escalated')
    ),
    'metrics', public.get_support_ai_metrics(),
    'knowledge_gaps', public.detect_support_knowledge_gaps(),
    'response_modes', jsonb_build_array('automatic', 'draft', 'manual'),
    'channels', jsonb_build_array('support_widget', 'admin_inbox', 'email_support')
  );
end; $$;

grant execute on function public._sai_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'support-engine-blueprint', 'Support Engine (ABOS Phase 11)',
  'Support Engine Foundation — extends Support AI Engine A.7 with tiers, KC connection, and live success criteria.',
  'authenticated', 68
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'support-engine-blueprint' and tenant_id is null
);
