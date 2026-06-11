-- Phase 59b: Quality Guardian Knowledge Center FAQ categories

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-reports', 'Developer Reports', 'Quality Guardian developer and admin reports', 'authenticated', 95
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-reports' and tenant_id is null);

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-incidents', 'Incident Severity', 'How Quality Guardian classifies and prioritizes incidents', 'authenticated', 96
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-incidents' and tenant_id is null);

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-governance', 'Governance & Safety', 'Approval rules and safe fixes for Quality Guardian', 'authenticated', 97
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-governance' and tenant_id is null);

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-troubleshooting', 'Troubleshooting', 'Scan frequency, trends, and operational questions', 'authenticated', 98
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-troubleshooting' and tenant_id is null);

update public.aipify_knowledge_categories
set name = 'Frontend Experience', description = 'Frontend UX checks and expected behaviour'
where slug = 'quality-frontend' and tenant_id is null;

update public.aipify_knowledge_categories
set name = 'Quality Guardian', description = 'Software and frontend health monitoring overview'
where slug = 'quality_guardian' and tenant_id is null;
