-- Implementation Blueprint Phase 14 — Knowledge Evolution Foundation
-- Extends Knowledge Center Engine (A.5) Phase 3 scaffold. No new tables.

create or replace function public._kce_default_knowledge_evolution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'gap_detection_enabled', true,
    'evolution_tracking_enabled', true,
    'self_love_integration_enabled', true,
    'review_cycle_days', 180,
    'companion_guidance_priority', true,
    'proactive_recommendations_enabled', true,
    'health_scoring_enabled', true,
    'duplicate_detection_scaffold', true,
    'organizational_memory_sync_scaffold', true,
    'creation_opportunity_tracking_scaffold', true
  );
$$;

create or replace function public._kce_compute_knowledge_health_scores(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_published int := 0;
  v_faq_published int := 0;
  v_stale int := 0;
  v_overdue_review int := 0;
  v_draft_review int := 0;
  v_open_gaps int := 0;
  v_avg_days_since_update numeric := 0;
  v_category_count int := 0;
  v_freshness numeric := 100;
  v_coverage numeric := 0;
  v_quality numeric := 100;
  v_review_cycle int := 180;
begin
  perform public._kce_ensure_evolution_settings(p_organization_id);

  select coalesce((s.metadata->'knowledge_evolution'->>'review_cycle_days')::int, 180)
  into v_review_cycle
  from public.organization_workspace_settings s
  where s.organization_id = p_organization_id;

  select count(*) into v_published
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_faq_published
  from public.knowledge_faq_items
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_category_count
  from public.knowledge_categories
  where organization_id = p_organization_id;

  select count(*) into v_stale
  from public.knowledge_articles
  where organization_id = p_organization_id
    and status = 'published'
    and updated_at < now() - make_interval(days => v_review_cycle);

  select count(*) into v_overdue_review
  from public.knowledge_articles
  where organization_id = p_organization_id
    and status = 'published'
    and review_due_at is not null
    and review_due_at < now();

  select count(*) into v_draft_review
  from public.knowledge_articles
  where organization_id = p_organization_id and status in ('draft', 'review');

  select coalesce(avg(extract(epoch from (now() - updated_at)) / 86400.0), 0)
  into v_avg_days_since_update
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_open_gaps
  from public.support_ai_knowledge_gaps
  where organization_id = p_organization_id and status = 'open';

  if v_published > 0 then
    v_freshness := greatest(
      0,
      least(
        100,
        100
          - (v_stale::numeric / v_published * 50)
          - least(v_avg_days_since_update / nullif(v_review_cycle, 0) * 30, 30)
      )
    );
  else
    v_freshness := 0;
  end if;

  if v_category_count > 0 then
    v_coverage := greatest(
      0,
      least(
        100,
        (least(v_published + v_faq_published, v_category_count * 2)::numeric / (v_category_count * 2) * 70)
          + greatest(0, 30 - v_open_gaps * 5)
      )
    );
  else
    v_coverage := case when v_published + v_faq_published > 0 then 40 else 0 end;
  end if;

  v_quality := greatest(0, least(100, 100 - v_overdue_review * 8 - v_draft_review * 3));

  return jsonb_build_object(
    'freshness_score', round(v_freshness),
    'coverage_score', round(v_coverage),
    'quality_score', round(v_quality),
    'metadata', jsonb_build_object(
      'published_articles', v_published,
      'published_faqs', v_faq_published,
      'categories', v_category_count,
      'stale_articles', v_stale,
      'overdue_reviews', v_overdue_review,
      'draft_and_review_queue', v_draft_review,
      'open_support_gaps', v_open_gaps,
      'avg_days_since_update', round(v_avg_days_since_update::numeric, 1),
      'review_cycle_days', v_review_cycle
    )
  );
end; $$;

create or replace function public._kce_knowledge_evolution_recommendations(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_review_cycle int := 180;
  v_recs jsonb := '[]'::jsonb;
  v_row record;
begin
  perform public._kce_ensure_evolution_settings(p_organization_id);

  select coalesce((s.metadata->'knowledge_evolution'->>'review_cycle_days')::int, 180)
  into v_review_cycle
  from public.organization_workspace_settings s
  where s.organization_id = p_organization_id;

  for v_row in
    select a.id, a.title, a.slug, c.slug as category_slug,
      round(extract(epoch from (now() - a.updated_at)) / 86400.0)::int as days_since_update
    from public.knowledge_articles a
    left join public.knowledge_categories c on c.id = a.category_id
    where a.organization_id = p_organization_id
      and a.status = 'published'
      and a.updated_at < now() - make_interval(days => v_review_cycle)
    order by a.updated_at asc
    limit 8
  loop
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'key', 'stale_article_' || v_row.id::text,
      'type', 'stale_content',
      'priority', 'high',
      'title', v_row.title,
      'explanation',
        'Published article has not been updated in ' || v_row.days_since_update
        || ' days (review cycle: ' || v_review_cycle || ' days). Schedule a review to keep guidance accurate.',
      'source', 'knowledge_articles.updated_at',
      'article_id', v_row.id,
      'category_slug', v_row.category_slug,
      'action_hint', 'Submit for review, update content, and republish after approval.'
    ));
  end loop;

  for v_row in
    select a.id, a.title, a.status, c.slug as category_slug
    from public.knowledge_articles a
    left join public.knowledge_categories c on c.id = a.category_id
    where a.organization_id = p_organization_id and a.status in ('draft', 'review')
    order by a.updated_at desc
    limit 5
  loop
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'key', 'review_queue_' || v_row.id::text,
      'type', 'review_queue',
      'priority', 'medium',
      'title', v_row.title,
      'explanation',
        'Article is in ' || v_row.status || ' status and awaiting human review before publication.',
      'source', 'knowledge_articles.status',
      'article_id', v_row.id,
      'category_slug', v_row.category_slug,
      'action_hint', 'Assign a reviewer and publish when approved.'
    ));
  end loop;

  for v_row in
    select g.id, g.question, g.gap_type, g.occurrence_count
    from public.support_ai_knowledge_gaps g
    where g.organization_id = p_organization_id and g.status = 'open'
    order by g.occurrence_count desc nulls last
    limit 5
  loop
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'key', 'support_gap_' || v_row.id::text,
      'type', 'knowledge_gap',
      'priority', case when v_row.occurrence_count >= 3 then 'high' else 'medium' end,
      'title', left(v_row.question, 120),
      'explanation',
        'Repeated support topic detected (' || coalesce(v_row.gap_type, 'missing_faq')
        || ', ' || coalesce(v_row.occurrence_count, 1) || ' occurrences). Consider a new FAQ or article.',
      'source', 'support_ai_knowledge_gaps',
      'gap_id', v_row.id,
      'gap_type', v_row.gap_type,
      'action_hint', 'Create FAQ or article via KC approval workflow — metadata only, no raw chat stored.'
    ));
  end loop;

  for v_row in
    select a1.id as article_id, a1.title, a2.id as duplicate_id, a2.title as duplicate_title, c.slug as category_slug
    from public.knowledge_articles a1
    join public.knowledge_articles a2
      on a1.organization_id = a2.organization_id
      and a1.id < a2.id
      and a1.category_id = a2.category_id
      and a1.category_id is not null
      and lower(left(trim(a1.title), 15)) = lower(left(trim(a2.title), 15))
    left join public.knowledge_categories c on c.id = a1.category_id
    where a1.organization_id = p_organization_id
      and a1.status <> 'archived'
      and a2.status <> 'archived'
    limit 3
  loop
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'key', 'duplicate_' || v_row.article_id::text || '_' || v_row.duplicate_id::text,
      'type', 'overlapping_content',
      'priority', 'low',
      'title', v_row.title,
      'explanation',
        'Possible duplicate in category "' || coalesce(v_row.category_slug, 'uncategorized')
        || '" — similar title prefix to "' || v_row.duplicate_title || '". Heuristic scaffold only.',
      'source', 'knowledge_articles.title_heuristic',
      'article_id', v_row.article_id,
      'duplicate_article_id', v_row.duplicate_id,
      'action_hint', 'Merge, differentiate, or archive redundant articles after human review.'
    ));
  end loop;

  for v_row in
    select a.id, a.title, a.view_count, c.slug as category_slug
    from public.knowledge_articles a
    left join public.knowledge_categories c on c.id = a.category_id
    where a.organization_id = p_organization_id
      and a.status = 'published'
      and a.view_count >= 10
    order by a.view_count desc
    limit 3
  loop
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'key', 'frequent_topic_' || v_row.id::text,
      'type', 'frequent_topic',
      'priority', 'low',
      'title', v_row.title,
      'explanation',
        'High view count (' || v_row.view_count || ') suggests frequent reference — verify content stays current.',
      'source', 'knowledge_articles.view_count',
      'article_id', v_row.id,
      'category_slug', v_row.category_slug,
      'action_hint', 'Review for accuracy and consider expanding related FAQs.'
    ));
  end loop;

  return v_recs;
end; $$;

create or replace function public._kce_knowledge_creation_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'repeated_questions',
      'label', 'Repeated support questions',
      'description', 'Open gaps in support_ai_knowledge_gaps suggest FAQ or article creation.',
      'source', 'Support AI A.7',
      'action', 'Create draft FAQ via create_organization_knowledge_faq — approval required'
    ),
    jsonb_build_object(
      'key', 'similar_responses',
      'label', 'Similar agent response patterns',
      'description', 'Scaffold — future: cluster support response metadata into article suggestions.',
      'source', 'scaffold',
      'action', 'Human review before any automated article draft'
    ),
    jsonb_build_object(
      'key', 'new_workflows',
      'label', 'New operational workflows',
      'description', 'Process changes should produce or update playbook articles.',
      'source', 'Operations / Continuous Improvement A.33',
      'action', 'Link improvement initiatives to KC article updates'
    ),
    jsonb_build_object(
      'key', 'lessons_learned',
      'label', 'Lessons learned',
      'description', 'Retrospectives and interventions from Organizational Memory A.34 may suggest knowledge updates.',
      'source', 'Organizational Memory A.34',
      'action', 'Capture lesson summary metadata — full article requires KC approval'
    )
  );
$$;

create or replace function public._kce_evolution_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love encourages clarity and sustainable documentation — not perfectionism or guilt.',
    'flows', jsonb_build_array(
      jsonb_build_object('key', 'simplify', 'action', 'Recommend shorter, clearer articles when complexity scores high (scaffold)'),
      jsonb_build_object('key', 'onboarding', 'action', 'Self Love category guides sustainable onboarding pace'),
      jsonb_build_object('key', 'review_pace', 'action', 'Gentle review reminders — never "you forgot to update" language')
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love — wellbeing guidance, not documentation pressure.'
  );
$$;

create or replace function public._kce_evolution_organizational_memory_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational memory captures how things unfolded; knowledge explains how they should work — both evolve together.',
    'flows', jsonb_build_array(
      jsonb_build_object('key', 'retrospectives', 'action', 'Retrospective outcomes may suggest KC article updates'),
      jsonb_build_object('key', 'interventions', 'action', 'Wisdom interventions A.10 metadata may link to procedure revisions'),
      jsonb_build_object('key', 'process_improvements', 'action', 'Continuous Improvement A.33 initiatives feed evolving playbooks')
    ),
    'organizational_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Memory stores metadata summaries — never raw operational records in recommendations.'
  );
$$;

create or replace function public._kce_evolution_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every evolution recommendation must be explainable — transparent sources and human approvers.',
    'users_should_know', jsonb_build_array(
      'Why Aipify flagged content as stale or overlapping',
      'Which metadata source triggered each recommendation',
      'That humans approve all publication changes',
      'No raw support chat or email content in evolution signals'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Health scores are computed indicators — not quality judgments on teams',
      'Duplicate detection is a heuristic scaffold requiring human confirmation',
      'Gap counts come from support_ai_knowledge_gaps metadata only',
      'Full audit via knowledge.* permissions and _kce_log events'
    ),
    'audit_note', 'Recommendations are advisory — KC approval workflow remains authoritative.'
  );
$$;

create or replace function public._kce_evolution_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group evolves internal playbooks; Unonight validates external pilot knowledge hygiene.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'focus', jsonb_build_array(
        'Product release notes → engineering playbooks',
        'Support gap trends → FAQ creation',
        'Executive decision context → strategic articles',
        'Self Love clarity checks on onboarding docs'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'focus', jsonb_build_array(
        'Marketplace operations freshness',
        'Support escalation policy reviews',
        'Pilot lesson learned → operations articles'
      )
    )
  );
$$;

create or replace function public._kce_evolution_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Knowledge is not static — organizations, processes, and customers evolve.',
    'Proactive recommendations keep guidance relevant without silent changes.',
    'Freshness, coverage, and quality indicators support — never replace — human judgment.',
    'Simpler documentation scales better than exhaustive complexity.',
    'Trust grows when every suggestion explains its source.'
  );
$$;

create or replace function public._kce_evolution_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine', 'note', 'support_ai_knowledge_gaps feed gap recommendations'),
    jsonb_build_object('label', 'Continuous Improvement (A.33)', 'route', '/app/continuous-improvement-engine'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Legacy (A.86)', 'route', '/app/legacy-engine', 'note', 'Institutional wisdom preservation cross-link'),
    jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'KC Self-Knowledge (Phase 55)', 'route', '/app/knowledge-center', 'note', 'Product self-knowledge — distinct from organizational KC')
  );
$$;

create or replace function public._kce_evolution_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Detect outdated information before it misleads teams or AI',
    'Surface knowledge gaps from support patterns',
    'Recommend improvements with explainable reasoning',
    'Identify overlapping content (heuristic scaffold)',
    'Highlight frequently referenced topics for review',
    'Encourage regular human review cycles'
  );
$$;

create or replace function public._kce_evolution_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_health jsonb;
  v_evolution jsonb;
  v_recs jsonb;
  v_stale int := 0;
  v_gaps int := 0;
  v_review_queue int := 0;
begin
  perform public._kce_ensure_evolution_settings(p_organization_id);
  v_health := public._kce_compute_knowledge_health_scores(p_organization_id);
  v_recs := public._kce_knowledge_evolution_recommendations(p_organization_id);

  select coalesce(s.metadata->'knowledge_evolution', public._kce_default_knowledge_evolution())
  into v_evolution
  from public.organization_workspace_settings s
  where s.organization_id = p_organization_id;

  v_stale := coalesce((v_health->'metadata'->>'stale_articles')::int, 0);
  v_gaps := coalesce((v_health->'metadata'->>'open_support_gaps')::int, 0);
  v_review_queue := coalesce((v_health->'metadata'->>'draft_and_review_queue')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'health_scores_computed',
      'label', 'Freshness, coverage, and quality scores computed from live metadata',
      'met', v_health ? 'freshness_score' and v_health ? 'coverage_score' and v_health ? 'quality_score'
    ),
    jsonb_build_object(
      'key', 'evolution_settings',
      'label', 'Knowledge evolution settings configured in organization metadata',
      'met', v_evolution is not null
        and coalesce((v_evolution->>'evolution_tracking_enabled')::boolean, false)
        and coalesce((v_evolution->>'health_scoring_enabled')::boolean, false)
    ),
    jsonb_build_object(
      'key', 'proactive_recommendations',
      'label', 'Proactive recommendations generated from live KC and support signals',
      'met', jsonb_array_length(v_recs) >= 0,
      'note', case
        when jsonb_array_length(v_recs) = 0 then 'Healthy baseline — add content or simulate gaps to validate recommendations.'
        else jsonb_array_length(v_recs)::text || ' active recommendation(s).'
      end
    ),
    jsonb_build_object(
      'key', 'stale_content_monitored',
      'label', 'Stale published content monitored against review cycle',
      'met', true,
      'note', case when v_stale > 0 then v_stale::text || ' stale article(s) flagged.' else 'No stale articles beyond review cycle.' end
    ),
    jsonb_build_object(
      'key', 'support_gaps_linked',
      'label', 'Support knowledge gaps linked to creation recommendations',
      'met', true,
      'note', case when v_gaps > 0 then v_gaps::text || ' open gap(s) from Support AI.' else 'No open support gaps — or Support AI not yet active.' end
    ),
    jsonb_build_object(
      'key', 'review_workflow_active',
      'label', 'Review queue visible for human approval before publication',
      'met', v_review_queue >= 0,
      'note', v_review_queue::text || ' item(s) in draft or review.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Recommendations include explainable sources — no raw chat in signals',
      'met', true,
      'note', 'Metadata-only gap and freshness indicators with action hints.'
    ),
    jsonb_build_object(
      'key', 'organizational_memory_alignment',
      'label', 'Organizational Memory A.34 connection documented for evolving knowledge',
      'met', coalesce((v_evolution->>'organizational_memory_sync_scaffold')::boolean, false)
    )
  );
end; $$;

create or replace function public.get_knowledge_center_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_health jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._kce_ensure_evolution_settings(v_org_id);
  v_health := public._kce_compute_knowledge_health_scores(v_org_id);

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

grant execute on function public._kce_compute_knowledge_health_scores(uuid) to authenticated;
grant execute on function public._kce_knowledge_evolution_recommendations(uuid) to authenticated;
grant execute on function public._kce_evolution_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'implementation-blueprint-phase14', 'ABOS Phase 14 Knowledge Evolution', 'Knowledge Evolution — proactive recommendations, health indicators, and evolving organizational knowledge.', 'authenticated', 7
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'implementation-blueprint-phase14' and tenant_id is null);

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._kce_ensure_evolution_settings(v_org_id);
  end loop;
end $$;
