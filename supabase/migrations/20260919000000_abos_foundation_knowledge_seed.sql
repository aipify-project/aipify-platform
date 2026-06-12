-- ABOS Foundation — Knowledge Center category seed

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'abos',
  'Aipify Business Operating System (ABOS)',
  'Product architecture framing — six pillars, install-first operations, not an AI chatbot.',
  'authenticated',
  101
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'abos' and tenant_id is null
);
