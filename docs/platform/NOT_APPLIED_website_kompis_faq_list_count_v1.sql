-- NOT APPLIED
-- Read-only count for the Website Kompis FAQ library.
-- Do not execute until the owner approves this exact file and its SHA-256.
-- This does not publish, update, or delete FAQ rows.
-- Site scope matches the APP list filter:
--   tenant: every row in the tenant (no installation to split on)
--   single_site: the selected installation plus legacy rows with no installation
--   multi_site: only the selected installation
-- Select-all stays off in the APP until this function returns an exact total.

create or replace function public.count_tenant_public_companion_faq_items(
  p_status text default null,
  p_locale text default null,
  p_content_type text default null,
  p_query text default null,
  p_install_id uuid default null,
  p_site_scope text default 'tenant'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_query text;
  v_scope text;
  v_total integer;
  v_published integer;
  v_draft integer;
  v_archived integer;
  v_draft_public_safe integer;
  v_draft_needs_review integer;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_query := lower(trim(coalesce(p_query, '')));
  v_scope := lower(trim(coalesce(p_site_scope, 'tenant')));

  if v_scope not in ('tenant', 'single_site', 'multi_site') then
    raise exception 'invalid faq site scope';
  end if;

  if v_scope in ('single_site', 'multi_site') and p_install_id is null then
    raise exception 'faq site scope requires an installation';
  end if;

  select
    count(*)::integer,
    count(*) filter (where f.status = 'published')::integer,
    count(*) filter (where f.status = 'draft')::integer,
    count(*) filter (where f.status = 'archived')::integer,
    count(*) filter (where f.status = 'draft' and f.public_safe is true)::integer,
    count(*) filter (where f.status = 'draft' and f.public_safe is distinct from true)::integer
  into v_total, v_published, v_draft, v_archived, v_draft_public_safe, v_draft_needs_review
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant_id
    and (
      v_scope = 'tenant'
      or (v_scope = 'single_site' and (f.install_id = p_install_id or f.install_id is null))
      or (v_scope = 'multi_site' and f.install_id = p_install_id)
    )
    and (p_status is null or f.status = p_status)
    and (p_locale is null or f.locale = p_locale)
    and (p_content_type is null or f.content_type = p_content_type)
    and (
      v_query = ''
      or lower(f.title) like '%' || v_query || '%'
      or lower(coalesce(f.question, '')) like '%' || v_query || '%'
      or lower(f.answer) like '%' || v_query || '%'
      or lower(coalesce(f.category, '')) like '%' || v_query || '%'
      or exists (
        select 1
        from unnest(f.tags) tag
        where lower(tag) like '%' || v_query || '%'
      )
    );

  return jsonb_build_object(
    'total', v_total,
    'published', v_published,
    'draft', v_draft,
    'archived', v_archived,
    'draftPublicSafe', v_draft_public_safe,
    'draftNeedsReview', v_draft_needs_review,
    'siteScope', v_scope,
    'installScoped', v_scope <> 'tenant'
  );
end;
$$;

revoke all on function public.count_tenant_public_companion_faq_items(text, text, text, text, uuid, text) from public, anon;
grant execute on function public.count_tenant_public_companion_faq_items(text, text, text, text, uuid, text) to authenticated;
