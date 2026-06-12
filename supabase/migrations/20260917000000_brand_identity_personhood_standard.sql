-- Brand Identity & Personhood Standard — Knowledge Center category seed

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'brand-identity',
  'Brand Identity & Personhood',
  'How Aipify refers to itself as a trusted business companion — not generic AI terminology.',
  'authenticated',
  100
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'brand-identity' and tenant_id is null
);
