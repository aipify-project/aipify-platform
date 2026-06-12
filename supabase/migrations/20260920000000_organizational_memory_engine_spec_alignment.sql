-- Organizational Memory Engine — spec alignment (memory levels, workspace scope, knowledge sources)
-- Extends Phase A.34 · integrates with Organization & Workspace Engine (A.75) · Self Love (A.76 planned)

alter table public.organization_memory_records
  add column if not exists memory_level text not null default 'organization' check (
    memory_level in ('session', 'workspace', 'organization', 'strategic')
  ),
  add column if not exists workspace_id uuid references public.organization_workspaces (id) on delete set null,
  add column if not exists knowledge_source_type text check (
    knowledge_source_type is null or knowledge_source_type in (
      'knowledge_center', 'internal_documentation', 'faq', 'support_conversation',
      'meeting_notes', 'policy_procedure', 'case_resolution', 'manual_entry', 'other'
    )
  );

create index if not exists organization_memory_records_level_idx
  on public.organization_memory_records (organization_id, memory_level, status);

create index if not exists organization_memory_records_workspace_idx
  on public.organization_memory_records (workspace_id, status)
  where workspace_id is not null;

-- ---------------------------------------------------------------------------
-- Updated JSON helper
-- ---------------------------------------------------------------------------
create or replace function public._ome_record_json(r public.organization_memory_records)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id,
    'organization_id', r.organization_id,
    'workspace_id', r.workspace_id,
    'memory_level', r.memory_level,
    'knowledge_source_type', r.knowledge_source_type,
    'category', r.category,
    'title', r.title,
    'summary', r.summary,
    'detailed_context', r.detailed_context,
    'source_reference', r.source_reference,
    'visibility', r.visibility,
    'status', r.status,
    'reference_count', r.reference_count,
    'created_by', r.created_by,
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
$$;

-- ---------------------------------------------------------------------------
-- Create record — optional memory level, workspace, knowledge source
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_memory_record(
  p_category text,
  p_title text,
  p_summary text default '',
  p_detailed_context jsonb default '{}'::jsonb,
  p_source_reference text default null,
  p_visibility text default 'internal',
  p_memory_level text default 'organization',
  p_workspace_id uuid default null,
  p_knowledge_source_type text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_memory_records;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.create');

  if p_workspace_id is not null then
    if not exists (
      select 1 from public.organization_workspaces w
      where w.id = p_workspace_id and w.organization_id = v_org_id and w.status = 'active'
    ) then
      raise exception 'Workspace not found';
    end if;
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.organization_memory_records (
    organization_id, workspace_id, memory_level, knowledge_source_type,
    category, title, summary, detailed_context,
    source_reference, visibility, created_by
  ) values (
    v_org_id, p_workspace_id, coalesce(p_memory_level, 'organization'), p_knowledge_source_type,
    p_category, p_title,
    public._ome_truncate_summary(p_summary),
    coalesce(p_detailed_context, '{}'::jsonb),
    p_source_reference, coalesce(p_visibility, 'internal'), v_user_id
  ) returning * into v_row;

  perform public._ome_log(v_org_id, 'memory_record_created', 'memory_record', v_row.id,
    jsonb_build_object(
      'category', p_category, 'title', p_title, 'visibility', p_visibility,
      'memory_level', v_row.memory_level, 'workspace_id', v_row.workspace_id
    ));

  return public._ome_record_json(v_row);
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard — ABOS-aligned philosophy, memory levels, Self Love note
-- ---------------------------------------------------------------------------
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
    'philosophy', 'Aipify should not start from zero every day. Knowledge should not disappear when employees leave.',
    'mission', 'Transform scattered organizational information into structured, usable, and actionable intelligence.',
    'abos_principle', 'A healthy organization preserves what it learns. Aipify helps organizations remember, improve, and grow together.',
    'self_love_note', 'Self Love (A.76 planned) will monitor memory quality — duplicates, outdated docs, contradictions, and cleanup recommendations.',
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
      'Scheduled reviews and archival with full audit accountability'
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

grant execute on function public.create_organization_memory_record(
  text, text, text, jsonb, text, text, text, uuid, text
) to authenticated;
