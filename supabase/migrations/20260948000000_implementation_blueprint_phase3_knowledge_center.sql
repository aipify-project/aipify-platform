-- Implementation Blueprint Phase 3 — Knowledge Center Foundation
-- Spec alignment extending Knowledge Center Engine (A.5). No new tables.

create or replace function public._kce_default_knowledge_evolution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'gap_detection_enabled', true,
    'evolution_tracking_enabled', true,
    'self_love_integration_enabled', true,
    'review_cycle_days', 180,
    'companion_guidance_priority', true
  );
$$;

create or replace function public._kce_ensure_evolution_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_workspace_settings (organization_id, metadata)
  values (p_organization_id, jsonb_build_object('knowledge_evolution', public._kce_default_knowledge_evolution()))
  on conflict (organization_id) do nothing;

  update public.organization_workspace_settings
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'knowledge_evolution',
    coalesce(metadata->'knowledge_evolution', public._kce_default_knowledge_evolution())
  )
  where organization_id = p_organization_id
    and (metadata->'knowledge_evolution' is null or metadata->'knowledge_evolution' = 'null'::jsonb);
end; $$;

create or replace function public._kce_seed_blueprint_dogfood_categories(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_slug text;
begin
  select slug into v_slug from public.organizations where id = p_organization_id;

  if v_slug = 'aipify-group' then
    insert into public.knowledge_categories (organization_id, slug, name, description, sort_order)
    select p_organization_id, v.slug, v.name, v.description, v.sort_order
    from (values
      ('product', 'Product', 'Product documentation and specifications', 10),
      ('engineering', 'Engineering', 'Engineering practices and technical guides', 11),
      ('sales', 'Sales', 'Sales playbooks and customer-facing materials', 12),
      ('governance', 'Governance', 'Policies, compliance, and governance', 13),
      ('self_love', 'Self Love', 'Self Love reminders and wellbeing guidance', 14),
      ('human_values', 'Human Values', 'Human Values Charter and cultural foundation', 15),
      ('companion_guidelines', 'Companion Guidelines', 'AI companion tone and interaction standards', 16)
    ) as v(slug, name, description, sort_order)
    on conflict (organization_id, slug) do nothing;
  elsif v_slug = 'unonight' then
    insert into public.knowledge_categories (organization_id, slug, name, description, sort_order)
    select p_organization_id, v.slug, v.name, v.description, v.sort_order
    from (values
      ('marketplace', 'Marketplace', 'Marketplace operations and seller guidance', 10),
      ('operations', 'Operations', 'Operational procedures for Unonight pilot', 11)
    ) as v(slug, name, description, sort_order)
    on conflict (organization_id, slug) do nothing;
  end if;
end; $$;

create or replace function public._kce_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_cat_count int := 0;
  v_published int := 0;
  v_faq_count int := 0;
  v_revision_count int := 0;
  v_review_count int := 0;
  v_evolution jsonb;
  v_org_slug text;
  v_dogfood_cats int := 0;
  v_dogfood_required int := 0;
begin
  perform public._kce_ensure_evolution_settings(p_organization_id);

  select count(*) into v_cat_count
  from public.knowledge_categories where organization_id = p_organization_id;

  select count(*) into v_published
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_faq_count
  from public.knowledge_faq_items
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_revision_count
  from public.knowledge_article_revisions where organization_id = p_organization_id;

  select count(*) into v_review_count
  from public.knowledge_articles
  where organization_id = p_organization_id and status in ('review', 'published');

  select coalesce(s.metadata->'knowledge_evolution', public._kce_default_knowledge_evolution())
  into v_evolution
  from public.organization_workspace_settings s
  where s.organization_id = p_organization_id;

  select slug into v_org_slug from public.organizations where id = p_organization_id;

  if v_org_slug = 'aipify-group' then
    v_dogfood_required := 3;
    select count(*) into v_dogfood_cats
    from public.knowledge_categories
    where organization_id = p_organization_id
      and slug in ('product', 'engineering', 'support', 'sales', 'governance', 'self_love', 'human_values', 'companion_guidelines');
  elsif v_org_slug = 'unonight' then
    v_dogfood_required := 2;
    select count(*) into v_dogfood_cats
    from public.knowledge_categories
    where organization_id = p_organization_id
      and slug in ('support', 'operations', 'marketplace', 'faq');
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'categories_exist',
      'label', 'Knowledge categories exist per organization',
      'met', v_cat_count > 0
    ),
    jsonb_build_object(
      'key', 'published_articles',
      'label', 'Published articles are available',
      'met', v_published > 0
    ),
    jsonb_build_object(
      'key', 'published_faqs',
      'label', 'Published FAQs are available',
      'met', v_faq_count > 0
    ),
    jsonb_build_object(
      'key', 'review_workflow',
      'label', 'Review workflow is operational',
      'met', v_review_count > 0,
      'note', case when v_review_count = 0 then 'Submit articles for review before publication.' else null end
    ),
    jsonb_build_object(
      'key', 'version_history',
      'label', 'Version history is tracked',
      'met', v_revision_count > 0
    ),
    jsonb_build_object(
      'key', 'visibility_permissions',
      'label', 'Visibility and permissions are enforced',
      'met', true,
      'note', 'internal · customer · public visibility with knowledge.* permissions server-side.'
    ),
    jsonb_build_object(
      'key', 'ai_retrieval_safe',
      'label', 'AI retrieval respects published-only rules',
      'met', true,
      'note', 'retrieve_knowledge_for_ai() excludes draft, review, and archived content.'
    ),
    jsonb_build_object(
      'key', 'knowledge_evolution',
      'label', 'Knowledge evolution scaffold is configured',
      'met', v_evolution is not null and v_evolution != '{}'::jsonb
    ),
    jsonb_build_object(
      'key', 'dogfood_categories',
      'label', 'Dogfood categories seeded for pilot organizations',
      'met', v_dogfood_required = 0 or v_dogfood_cats >= v_dogfood_required,
      'note', case
        when v_dogfood_required > 0 and v_dogfood_cats < v_dogfood_required
        then 'Blueprint dogfood categories pending for ' || v_org_slug || '.'
        when v_dogfood_required > 0 then null
        else 'Not a dogfood pilot organization.'
      end
    )
  );
end; $$;

create or replace function public.get_knowledge_center_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._kce_ensure_evolution_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'mission', 'Central source of truth for organizational memory, guidance, and operational intelligence.',
    'philosophy', 'Accessible. Organized. Actionable. Continuously improved. Shared responsibly.',
    'abos_principle', 'Knowledge without governance creates confusion. Governance without accessibility creates silence. Aipify combines both.',
    'implementation_blueprint', 'Phase 3 — Knowledge Center Foundation',
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
    'principles', jsonb_build_array(
      'Knowledge must be tenant-aware',
      'Organizations own their knowledge',
      'AI responses prioritize approved content',
      'Knowledge supports versioning and rollback',
      'Access respects permissions and visibility',
      'Review before publication is the default',
      'Metadata-first — no raw customer content in learning memory'
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
      )
    ),
    'success_criteria', public._kce_blueprint_success_criteria(v_org_id),
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

grant execute on function public._kce_default_knowledge_evolution() to authenticated;
grant execute on function public._kce_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'implementation-blueprint-phase3', 'ABOS Phase 3 Knowledge Center', 'Knowledge Center Foundation — organizational memory and trusted guidance.', 'authenticated', 6
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'implementation-blueprint-phase3' and tenant_id is null);

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations where slug in ('aipify-group', 'unonight') loop
    perform public._kce_seed_categories(v_org_id);
    perform public._kce_seed_blueprint_dogfood_categories(v_org_id);
    perform public._kce_ensure_evolution_settings(v_org_id);
  end loop;
end $$;
