-- Sales Expert Engine — Knowledge Center category (FAQ & portal guidance)
-- Phase 33 extension · Sales Expert FAQ available in portal and KC

insert into public.aipify_knowledge_categories (slug, title, description, visibility, sort_order)
select 'sales-expert-engine', 'Sales Expert Program', 'FAQ and guidance for Aipify Sales Representatives, Sales Experts, and partners — commissions, portal, email, and professional expectations.', 'authenticated', 78
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'sales-expert-engine' and tenant_id is null);
