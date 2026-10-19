-- NOT APPLIED
-- Read-only count for the Website Kompis FAQ library.
-- Do not execute until the owner approves this exact file and its SHA-256.
-- This does not publish, update, or delete FAQ rows.
-- Global "select all matches" stays disabled until a separate approved id snapshot exists.

create or replace function public.count_tenant_public_companion_faq_items(
  p_status text default null,
  p_locale text default null,
  p_content_type text default null,
  p_query text default null,
  p_install_id uuid default null
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
  v_total integer;
  v_published integer;
  v_draft integer;
  v_archived integer;
  v_legacy_null integer;
  v_site_scoped integer;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_query := lower(trim(coalesce(p_query, '')));

  select
    count(*)::integer,
    count(*) filter (where f.status = 'published')::integer,
    count(*) filter (where f.status = 'draft')::integer,
    count(*) filter (where f.status = 'archived')::integer,
    count(*) filter (where f.install_id is null)::integer,
    count(*) filter (where p_install_id is not null and f.install_id = p_install_id)::integer
  into v_total, v_published, v_draft, v_archived, v_legacy_null, v_site_scoped
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant_id
    and (p_install_id is null or f.install_id = p_install_id or f.install_id is null)
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
    'legacyNull', v_legacy_null,
    'siteScoped', v_site_scoped,
    'installScoped', p_install_id is not null
  );
end;
$$;

revoke all on function public.count_tenant_public_companion_faq_items(text, text, text, text, uuid) from public, anon;
grant execute on function public.count_tenant_public_companion_faq_items(text, text, text, text, uuid) to authenticated;
