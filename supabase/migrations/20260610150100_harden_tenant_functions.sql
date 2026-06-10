create or replace function public.slugify_company_name(company_name text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  base_slug text;
begin
  base_slug := lower(trim(company_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  if base_slug = '' then
    base_slug := 'company';
  end if;

  return base_slug;
end;
$$;

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
revoke execute on function public.slugify_company_name(text) from public, anon, authenticated;
