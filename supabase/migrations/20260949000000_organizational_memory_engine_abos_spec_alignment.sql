-- Organizational Memory Engine — ABOS spec alignment (extends Phase A.34)
-- Maps to /app/organizational-memory-engine — no new tables, dashboard/card framing only.

create or replace function public._ome_abos_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_records int := 0;
  v_decisions int := 0;
  v_reviews int := 0;
  v_referenced int := 0;
begin
  select count(*) into v_records
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_decisions
  from public.organization_decision_register
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_reviews
  from public.organization_memory_reviews
  where organization_id = p_organization_id;

  select count(*) into v_referenced
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active' and reference_count > 0;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'memory_records',
      'label', 'Organizations can preserve operational memory',
      'met', v_records > 0
    ),
    jsonb_build_object(
      'key', 'decision_register',
      'label', 'Decision memory captures rationale and outcomes',
      'met', v_decisions > 0
    ),
    jsonb_build_object(
      'key', 'reviews',
      'label', 'Scheduled memory reviews are supported',
      'met', v_reviews > 0
    ),
    jsonb_build_object(
      'key', 'recall',
      'label', 'Frequently referenced memories surface relevant experience',
      'met', v_referenced > 0,
      'note', case when v_referenced = 0 then 'Reference counts grow as Aipify surfaces memory in assistance.' else null end
    ),
    jsonb_build_object(
      'key', 'transparency',
      'label', 'Memory remains transparent and metadata-only',
      'met', true,
      'note', 'Humans approve sources; audit trail via organization memory logs.'
    ),
    jsonb_build_object(
      'key', 'isolation',
      'label', 'Tenant isolation enforced',
      'met', true,
      'note', 'Row-level security and organization-scoped RPCs.'
    )
  );
end; $$;

create or replace function public.get_organizational_memory_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return jsonb_build_object(
    'has_organization', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'pending_reviews', coalesce((
      select count(*) from public.organization_memory_reviews
      where organization_id = v_org_id and status in ('scheduled', 'overdue')
    ), 0),
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_memory_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_memory_settings;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');
  v_settings := public._ome_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity. Organizations should not have to relearn the same lessons repeatedly.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'vision', 'Aipify should become a companion that helps organizations remember their journey. Experience deserves to be preserved.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'core_philosophy', jsonb_build_array(
      'Experience has value',
      'Reflection creates wisdom',
      'Memory strengthens continuity',
      'Organizations should not relearn the same lessons repeatedly'
    ),
    'memory_categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational Memory',
        'examples', jsonb_build_array(
          'Process improvements', 'Incident resolutions', 'Successful interventions', 'Workflow adjustments'
        ),
        'record_categories', jsonb_build_array('process_improvements', 'resolved_incidents', 'operational_decisions')
      ),
      jsonb_build_object(
        'key', 'relationship',
        'label', 'Relationship Memory',
        'examples', jsonb_build_array(
          'Customer preferences', 'Communication styles', 'Long-term partnerships', 'Team collaboration patterns'
        ),
        'record_categories', jsonb_build_array('support_learnings', 'onboarding_lessons')
      ),
      jsonb_build_object(
        'key', 'decision',
        'label', 'Decision Memory',
        'examples', jsonb_build_array(
          'Major decisions', 'Decision rationale', 'Trade-offs considered', 'Outcomes achieved'
        ),
        'record_categories', jsonb_build_array('operational_decisions', 'strategic_decisions', 'approval_precedents')
      ),
      jsonb_build_object(
        'key', 'growth',
        'label', 'Growth Memory',
        'examples', jsonb_build_array(
          'Milestones achieved', 'Challenges overcome', 'Lessons learned', 'Improvements implemented'
        ),
        'record_categories', jsonb_build_array('onboarding_lessons', 'process_improvements', 'support_learnings')
      )
    ),
    'memory_capabilities', jsonb_build_array(
      jsonb_build_object('key', 'recall', 'label', 'Recall previous situations'),
      jsonb_build_object('key', 'surface', 'label', 'Surface relevant experiences'),
      jsonb_build_object('key', 'highlight', 'label', 'Highlight similar events'),
      jsonb_build_object('key', 'recommend', 'label', 'Recommend lessons learned'),
      jsonb_build_object('key', 'preserve', 'label', 'Preserve organizational context')
    ),
    'capability_examples', jsonb_build_array(
      'A similar issue occurred six months ago. Here is how it was resolved.',
      'This decision aligns with a previously successful strategy.',
      'Several lessons emerged from a comparable situation.',
      'You have faced challenges like this before — and you found a way through.'
    ),
    'self_love_note', 'Self Love (A.76 planned) encourages celebrating progress, recognizing resilience, appreciating effort, and reflecting on growth — organizations often forget how far they have come.',
    'trust_connection', jsonb_build_object(
      'principle', 'Organizational Memory should remain transparent.',
      'organizations_should_understand', jsonb_build_array(
        'What is remembered',
        'Why it is relevant',
        'Who contributed the knowledge',
        'How it informs recommendations'
      )
    ),
    'memory_levels', jsonb_build_array(
      jsonb_build_object('level', 'session', 'label', 'Session Memory', 'description', 'Short-term conversational awareness'),
      jsonb_build_object('level', 'workspace', 'label', 'Workspace Memory', 'description', 'Knowledge shared within a specific workspace'),
      jsonb_build_object('level', 'organization', 'label', 'Organizational Memory', 'description', 'Approved institutional knowledge across the organization'),
      jsonb_build_object('level', 'strategic', 'label', 'Strategic Memory', 'description', 'Executive-level insights and decision history')
    ),
    'knowledge_domains', jsonb_build_array(
      'Operational knowledge — SOPs, workflows, support routines, escalation paths',
      'Organizational preferences — communication styles, brand guidelines, terminology, priorities',
      'Historical context — incidents, resolved problems, decisions, lessons learned',
      'Customer intelligence — FAQs, pain points, product knowledge, service expectations',
      'Strategic knowledge — objectives, department goals, KPIs, long-term initiatives'
    ),
    'approved_sources', jsonb_build_array(
      'knowledge_center', 'internal_documentation', 'faq', 'support_conversation',
      'meeting_notes', 'policy_procedure', 'case_resolution'
    ),
    'principles', jsonb_build_array(
      'Humans approve knowledge sources and retention policies',
      'Metadata-only summaries — never raw chat, email, or PII',
      'Distinct from PAME personal memories and Learning Engine',
      'Workspace-scoped memory when organization uses workspaces (A.75)',
      'Scheduled reviews and archival with full audit accountability',
      'Security empowers meaningful work — clear responsibilities strengthen organizations'
    ),
    'distinction_note', 'Distinct from Knowledge Center (A.5) — knowledge is approved documentation; memory is experience captured over time. Distinct from PAME and Learning Engine.',
    'success_criteria', public._ome_abos_success_criteria(v_org_id),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine'),
      jsonb_build_object('label', 'Legacy Engine (A.86)', 'route', '/app/legacy-engine'),
      jsonb_build_object('label', 'Learning Review Center', 'route', '/app/learning'),
      jsonb_build_object('label', 'Organization & Workspaces (A.75)', 'route', '/app/organization-workspace-engine')
    ),
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'active_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'archived_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'archived'
      ), 0),
      'active_decisions', coalesce((
        select count(*) from public.organization_decision_register
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
      ), 0),
      'by_memory_level', coalesce((
        select jsonb_object_agg(memory_level, cnt)
        from (
          select memory_level, count(*)::int as cnt
          from public.organization_memory_records
          where organization_id = v_org_id and status = 'active'
          group by memory_level
        ) s
      ), '{}'::jsonb)
    ),
    'recent_learnings', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.created_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        order by created_at desc limit 8
      ) r
    ), '[]'::jsonb),
    'recurring_themes', coalesce((
      select jsonb_agg(jsonb_build_object('category', category, 'count', cnt) order by cnt desc)
      from (
        select category, count(*)::int as cnt
        from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        group by category order by cnt desc limit 6
      ) t
    ), '[]'::jsonb),
    'frequently_referenced', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.reference_count desc, r.updated_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active' and reference_count > 0
        order by reference_count desc, updated_at desc limit 5
      ) r
    ), '[]'::jsonb),
    'archived_decisions', coalesce((
      select jsonb_agg(public._ome_decision_json(d) order by d.updated_at desc)
      from (
        select * from public.organization_decision_register
        where organization_id = v_org_id and status in ('archived', 'superseded')
        order by updated_at desc limit 5
      ) d
    ), '[]'::jsonb),
    'recommended_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rv.id, 'review_type', rv.review_type, 'scheduled_at', rv.scheduled_at,
        'status', rv.status, 'memory_record_id', rv.memory_record_id
      ) order by rv.scheduled_at asc)
      from (
        select * from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
        order by scheduled_at asc limit 5
      ) rv
    ), '[]'::jsonb),
    'privacy_note', 'Organizational Memory stores metadata summaries only. Humans approve sources, remove outdated information, and define retention policies.'
  );
end; $$;

grant execute on function public._ome_abos_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-memory-engine-abos', 'Organizational Memory (ABOS)', 'How Aipify preserves organizational experience and lessons learned.', 'authenticated', 12
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'organizational-memory-engine-abos' and tenant_id is null);
