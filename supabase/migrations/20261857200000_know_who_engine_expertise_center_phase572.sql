-- Phase 572 — Organizational Knowledge Operations, Expertise Discovery & Know-Who Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/expertise
-- Helpers: _cmex572_*

create table if not exists public.organization_companion_expertise_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  expertise_enabled boolean not null default true,
  know_who_enabled boolean not null default true,
  mentorship_enabled boolean not null default true,
  succession_risk_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_expertise_settings enable row level security;
revoke all on public.organization_companion_expertise_settings from authenticated, anon;

create table if not exists public.organization_companion_expertise_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  profile_name text not null,
  profile_type text not null check (
    profile_type in (
      'employee', 'manager', 'partner', 'consultant',
      'external_expert', 'knowledge_contributor'
    )
  ),
  department text not null default '',
  role_title text not null default '',
  availability text not null default 'available' check (
    availability in ('available', 'limited', 'busy', 'unavailable')
  ),
  expertise_areas jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  business_packs jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  experience_years integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, profile_key)
);

alter table public.organization_companion_expertise_profiles enable row level security;
revoke all on public.organization_companion_expertise_profiles from authenticated, anon;

create table if not exists public.organization_companion_expertise_knowledge_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_key text not null,
  asset_title text not null,
  asset_type text not null check (
    asset_type in (
      'policy', 'procedure', 'playbook', 'template',
      'document', 'workflow', 'knowledge_asset'
    )
  ),
  owner_name text not null default '',
  backup_owner_name text not null default '',
  department text not null default '',
  review_schedule text not null default '',
  ownership_status text not null default 'owned' check (
    ownership_status in ('owned', 'unowned', 'review_due', 'at_risk')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, asset_key)
);

alter table public.organization_companion_expertise_knowledge_assets enable row level security;
revoke all on public.organization_companion_expertise_knowledge_assets from authenticated, anon;

create table if not exists public.organization_companion_expertise_critical_map (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  map_key text not null,
  map_title text not null,
  risk_type text not null check (
    risk_type in (
      'single_person_dependency', 'high_risk_area', 'unowned_process',
      'missing_documentation', 'knowledge_bottleneck'
    )
  ),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'high', 'critical')
  ),
  risk_status text not null default 'open' check (
    risk_status in ('open', 'mitigating', 'resolved', 'accepted')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, map_key)
);

alter table public.organization_companion_expertise_critical_map enable row level security;
revoke all on public.organization_companion_expertise_critical_map from authenticated, anon;

create table if not exists public.organization_companion_expertise_mentorship (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  mentorship_key text not null,
  mentor_name text not null,
  mentee_name text not null default '',
  mentorship_type text not null check (
    mentorship_type in ('mentor', 'specialist', 'expert', 'new_employee')
  ),
  learning_path text not null default '',
  mentorship_status text not null default 'active' check (
    mentorship_status in ('active', 'planned', 'completed', 'paused')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, mentorship_key)
);

alter table public.organization_companion_expertise_mentorship enable row level security;
revoke all on public.organization_companion_expertise_mentorship from authenticated, anon;

create table if not exists public.organization_companion_expertise_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_key text not null,
  project_title text not null,
  project_outcome text not null default '',
  lessons_learned text not null default '' check (char_length(lessons_learned) <= 500),
  contributors jsonb not null default '[]'::jsonb,
  business_impact text not null default '',
  project_status text not null default 'completed' check (
    project_status in ('active', 'completed', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, project_key)
);

alter table public.organization_companion_expertise_projects enable row level security;
revoke all on public.organization_companion_expertise_projects from authenticated, anon;

create table if not exists public.organization_companion_expertise_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null,
  recommendation_type text not null check (
    recommendation_type in (
      'review', 'project_help', 'customer_expert', 'past_solution',
      'meeting_participant', 'approval', 'know_who'
    )
  ),
  recommended_expert text not null default '',
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, recommendation_key)
);

alter table public.organization_companion_expertise_recommendations enable row level security;
revoke all on public.organization_companion_expertise_recommendations from authenticated, anon;

create table if not exists public.organization_companion_expertise_succession_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_category text not null check (
    risk_category in (
      'retirement_risk', 'departure_risk', 'single_expert_risk', 'knowledge_concentration'
    )
  ),
  concentration_pct numeric(5,2) not null default 0 check (concentration_pct between 0 and 100),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'high', 'critical')
  ),
  mitigation_status text not null default 'open' check (
    mitigation_status in ('open', 'capture_recommended', 'in_progress', 'mitigated')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, risk_key)
);

alter table public.organization_companion_expertise_succession_risks enable row level security;
revoke all on public.organization_companion_expertise_succession_risks from authenticated, anon;

create table if not exists public.organization_companion_expertise_department_maps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  department_title text not null,
  department_type text not null check (
    department_type in (
      'finance', 'operations', 'support', 'partner', 'executive', 'warehouse', 'custom'
    )
  ),
  expert_count integer not null default 0,
  coverage_score numeric(5,2) not null default 0 check (coverage_score between 0 and 100),
  specialists jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, department_key)
);

alter table public.organization_companion_expertise_department_maps enable row level security;
revoke all on public.organization_companion_expertise_department_maps from authenticated, anon;

create table if not exists public.organization_companion_expertise_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  skills jsonb not null default '[]'::jsonb,
  specialists jsonb not null default '[]'::jsonb,
  knowledge_owners jsonb not null default '[]'::jsonb,
  training_resources jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_expertise_business_packs enable row level security;
revoke all on public.organization_companion_expertise_business_packs from authenticated, anon;

create table if not exists public.organization_companion_expertise_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'expertise' check (
    audit_category in (
      'expert', 'skill', 'knowledge_owner', 'mentor', 'risk', 'report', 'expertise'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_expertise_audit_logs_org_idx
  on public.organization_companion_expertise_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_expertise_audit_logs enable row level security;
revoke all on public.organization_companion_expertise_audit_logs from authenticated, anon;

create or replace function public._cmex572_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmex572_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'expertise'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_expertise_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'expertise'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmex572_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_expertise_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmex572_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_expertise_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_expertise_profiles (
    organization_id, profile_key, profile_name, profile_type, department, role_title,
    availability, expertise_areas, skills, certifications, projects, business_packs, languages, experience_years, summary
  ) values
    (p_org_id, 'exp_finance_lead', 'Anna Berg', 'manager', 'Finance', 'Finance Operations Lead', 'available',
     '["Supplier onboarding","Finance workflows","Budget approvals"]'::jsonb,
     '["ERP","Procurement","Compliance"]'::jsonb, '["CPA","Procurement Certified"]'::jsonb,
     '["Q4 budget rollout","Vendor migration"]'::jsonb, '["finance"]'::jsonb, '["no","en"]'::jsonb, 12,
     'Primary finance workflow owner — supplier onboarding and approval chains.'),
    (p_org_id, 'exp_support_lead', 'Jonas Nilsen', 'employee', 'Support', 'Support Team Lead', 'limited',
     '["Customer escalation","Support procedures","Knowledge base"]'::jsonb,
     '["Triage","Business DNA","Escalation"]'::jsonb, '[]'::jsonb,
     '["Support Pack rollout"]'::jsonb, '["support"]'::jsonb, '["no","en","sv"]'::jsonb, 8,
     'Handled similar customer issues — recommended for complex support reviews.'),
    (p_org_id, 'exp_warehouse_mgr', 'Erik Solberg', 'manager', 'Operations', 'Warehouse Manager', 'available',
     '["Inventory","Reorder workflows","Warehouse Pack"]'::jsonb,
     '["Inventory","Logistics","WMS"]'::jsonb, '["Supply Chain Basics"]'::jsonb,
     '["Inventory optimization 2025"]'::jsonb, '["warehouse"]'::jsonb, '["no"]'::jsonb, 15,
     'Built warehouse reorder process — deep operational experience.'),
    (p_org_id, 'exp_partner_consult', 'Maria Santos', 'consultant', 'Partners', 'Implementation Consultant', 'available',
     '["Growth Partners","Onboarding","Training"]'::jsonb,
     '["Implementation","Change management"]'::jsonb, '["Growth Partner Certified"]'::jsonb,
     '["Nordic partner rollout"]'::jsonb, '[]'::jsonb, '["en","pt"]'::jsonb, 6,
     'External expert for partner implementations and training paths.'),
    (p_org_id, 'exp_exec_advisor', 'CTO Office', 'knowledge_contributor', 'Executive', 'Technology Advisor', 'limited',
     '["Architecture","Security review","Approval policies"]'::jsonb,
     '["Governance","Security","Integrations"]'::jsonb, '[]'::jsonb,
     '["Platform migration"]'::jsonb, '[]'::jsonb, '["en"]'::jsonb, 20,
     'Executive expertise for sensitive approvals and architecture decisions.');

  insert into public.organization_companion_expertise_knowledge_assets (
    organization_id, asset_key, asset_title, asset_type, owner_name, backup_owner_name, department, review_schedule, ownership_status, summary
  ) values
    (p_org_id, 'asset_supplier_onboarding', 'Supplier Onboarding Playbook', 'playbook', 'Anna Berg', 'Finance Team', 'Finance', 'Quarterly', 'owned',
     'Who knows supplier onboarding — Anna Berg owns this playbook.'),
    (p_org_id, 'asset_support_escalation', 'Support Escalation Procedure', 'procedure', 'Jonas Nilsen', 'Support Manager', 'Support', 'Monthly', 'owned',
     'Support escalation workflow with approved knowledge chain.'),
    (p_org_id, 'asset_reorder_workflow', 'Inventory Reorder Workflow', 'workflow', 'Erik Solberg', 'Operations Backup', 'Operations', 'Quarterly', 'owned',
     'Warehouse Pack reorder workflow — Erik built this process.'),
    (p_org_id, 'asset_partner_training', 'Growth Partner Training Template', 'template', '', '', 'Partners', '', 'unowned',
     'Orphaned knowledge — assign owner recommended.'),
    (p_org_id, 'asset_finance_policy', 'Finance Approval Policy', 'policy', 'Anna Berg', 'CFO Office', 'Finance', 'Annual', 'review_due',
     'Policy review due — backup owner assigned.');

  insert into public.organization_companion_expertise_critical_map (
    organization_id, map_key, map_title, risk_type, risk_level, risk_status, summary
  ) values
    (p_org_id, 'crit_reorder', 'Single owner — reorder workflow', 'single_person_dependency', 'high', 'open',
     'Erik Solberg owns 90% of inventory reorder knowledge — succession risk.'),
    (p_org_id, 'crit_partner_template', 'Unowned partner training template', 'unowned_process', 'moderate', 'open',
     'Growth Partner training template has no assigned owner.'),
    (p_org_id, 'crit_finance_docs', 'Missing finance workflow documentation', 'missing_documentation', 'moderate', 'mitigating',
     'Some finance sub-processes lack documented playbooks.'),
    (p_org_id, 'crit_support_kb', 'Support knowledge bottleneck', 'knowledge_bottleneck', 'high', 'open',
     'Escalation knowledge concentrated in two support leads.'),
    (p_org_id, 'crit_supplier', 'High-risk supplier onboarding area', 'high_risk_area', 'critical', 'open',
     'Supplier onboarding affects multiple departments — expertise map required.');

  insert into public.organization_companion_expertise_mentorship (
    organization_id, mentorship_key, mentor_name, mentee_name, mentorship_type, learning_path, mentorship_status, summary
  ) values
    (p_org_id, 'mentor_support_new', 'Jonas Nilsen', 'New Support Employee', 'mentor', 'Support onboarding path', 'active',
     'New Support Employee → Recommended Mentor → Knowledge Resources → Training Plan.'),
    (p_org_id, 'mentor_finance', 'Anna Berg', 'Finance Analyst', 'specialist', 'Finance workflows certification', 'planned',
     'Finance specialist mentorship for supplier onboarding.'),
    (p_org_id, 'mentor_warehouse', 'Erik Solberg', 'Warehouse Associate', 'expert', 'Warehouse Pack training', 'active',
     'Inventory and reorder expertise transfer in progress.');

  insert into public.organization_companion_expertise_projects (
    organization_id, project_key, project_title, project_outcome, lessons_learned, contributors, business_impact, project_status, summary
  ) values
    (p_org_id, 'proj_vendor_migration', 'Vendor Migration 2025', 'Successful migration with zero downtime',
     'Document owner assignments early; cross-train backup owners.',
     '["Anna Berg","Finance Team"]'::jsonb, 'Reduced procurement cycle time 18%', 'completed',
     'Anna Berg led — relevant for supplier and finance questions.'),
    (p_org_id, 'proj_support_pack', 'Support Pack Rollout', 'Faster triage with governed knowledge',
     'Pair new hires with mentors before peak season.',
     '["Jonas Nilsen","Support Team"]'::jsonb, 'Response time improved 22%', 'completed',
     'Jonas handled similar customer rollout — ask for support expertise.'),
    (p_org_id, 'proj_inventory_opt', 'Inventory Optimization', 'Reorder automation live',
     'Capture tribal knowledge before key staff transitions.',
     '["Erik Solberg"]'::jsonb, 'Stockouts reduced 15%', 'active',
     'Erik built this process — who built this process? Erik Solberg.');

  insert into public.organization_companion_expertise_recommendations (
    organization_id, recommendation_key, recommendation_title, recommendation_type, recommended_expert, confidence, summary
  ) values
    (p_org_id, 'rec_supplier_review', 'Who should review supplier onboarding change?', 'review', 'Anna Berg', 'high',
     'Anna Berg owns supplier onboarding playbook and finance workflows.'),
    (p_org_id, 'rec_customer_help', 'Who understands this customer previously?', 'customer_expert', 'Jonas Nilsen', 'high',
     'Jonas Nilsen handled similar support escalations for this account type.'),
    (p_org_id, 'rec_meeting_inventory', 'Who should join inventory planning meeting?', 'meeting_participant', 'Erik Solberg', 'high',
     'Erik Solberg has relevant warehouse and reorder project experience.'),
    (p_org_id, 'rec_past_solution', 'Who has solved this before?', 'past_solution', 'Anna Berg', 'moderate',
     'Vendor migration project — same domain as current procurement question.'),
    (p_org_id, 'rec_approval_cto', 'Who can approve architecture change?', 'approval', 'CTO Office', 'high',
     'Executive advisor for sensitive technology approvals.');

  insert into public.organization_companion_expertise_succession_risks (
    organization_id, risk_key, risk_title, risk_category, concentration_pct, risk_level, mitigation_status, summary
  ) values
    (p_org_id, 'succ_reorder', 'Reorder workflow — single expert', 'single_expert_risk', 90, 'critical', 'capture_recommended',
     'One employee owns 90% of reorder process — knowledge capture recommended.'),
    (p_org_id, 'succ_finance_retire', 'Finance lead retirement horizon', 'retirement_risk', 65, 'high', 'open',
     'Anna Berg holds critical finance workflow knowledge — plan succession.'),
    (p_org_id, 'succ_support_depart', 'Support lead departure risk', 'departure_risk', 55, 'moderate', 'in_progress',
     'Cross-training underway for support escalation procedures.'),
    (p_org_id, 'succ_kb_concentration', 'Support knowledge concentration', 'knowledge_concentration', 72, 'high', 'capture_recommended',
     'Knowledge concentrated in two support experts — diversify ownership.');

  insert into public.organization_companion_expertise_department_maps (
    organization_id, department_key, department_title, department_type, expert_count, coverage_score, specialists, summary
  ) values
    (p_org_id, 'dept_finance', 'Finance Expertise', 'finance', 2, 85,
     '["Anna Berg","Finance Team"]'::jsonb, 'Finance Pack — finance experts and workflow owners visible.'),
    (p_org_id, 'dept_support', 'Support Expertise', 'support', 3, 78,
     '["Jonas Nilsen","Support Team"]'::jsonb, 'Support Pack — support experts and escalation owners.'),
    (p_org_id, 'dept_operations', 'Operations Expertise', 'operations', 2, 82,
     '["Erik Solberg"]'::jsonb, 'Warehouse Pack — inventory and operations specialists.'),
    (p_org_id, 'dept_partner', 'Partner Expertise', 'partner', 1, 70,
     '["Maria Santos"]'::jsonb, 'Growth Partners — implementation and training specialists.'),
    (p_org_id, 'dept_executive', 'Executive Expertise', 'executive', 1, 75,
     '["CTO Office"]'::jsonb, 'Executive approvals, architecture, and governance expertise.');

  insert into public.organization_companion_expertise_business_packs (
    organization_id, pack_key, pack_title, skills, specialists, knowledge_owners, training_resources, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', '["Procurement","Budget","Compliance"]'::jsonb,
     '["Anna Berg"]'::jsonb, '["Supplier Onboarding Playbook","Finance Approval Policy"]'::jsonb,
     '["Finance workflows certification"]'::jsonb, 'Finance Pack → Finance Experts.'),
    (p_org_id, 'support', 'Support Pack', '["Triage","Escalation","Knowledge"]'::jsonb,
     '["Jonas Nilsen"]'::jsonb, '["Support Escalation Procedure"]'::jsonb,
     '["Support onboarding path"]'::jsonb, 'Support Pack → Support Experts.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', '["Inventory","Reorder","WMS"]'::jsonb,
     '["Erik Solberg"]'::jsonb, '["Inventory Reorder Workflow"]'::jsonb,
     '["Warehouse Pack training"]'::jsonb, 'Warehouse Pack → Inventory Experts.');
end; $$;

create or replace function public.get_organization_companion_expertise_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_profiles jsonb; v_assets jsonb;
  v_critical jsonb; v_mentorship jsonb; v_projects jsonb; v_recommendations jsonb;
  v_succession jsonb; v_departments jsonb; v_packs jsonb; v_skills jsonb;
  v_executive jsonb; v_companion jsonb; v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmex572_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmex572_ensure_settings(v_org_id);
  perform public._cmex572_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'expert_count', (select count(*) from public.organization_companion_expertise_profiles where organization_id = v_org_id),
    'knowledge_assets', (select count(*) from public.organization_companion_expertise_knowledge_assets where organization_id = v_org_id),
    'owned_assets', (select count(*) from public.organization_companion_expertise_knowledge_assets where organization_id = v_org_id and ownership_status = 'owned'),
    'unowned_assets', (select count(*) from public.organization_companion_expertise_knowledge_assets where organization_id = v_org_id and ownership_status = 'unowned'),
    'critical_risks', (select count(*) from public.organization_companion_expertise_critical_map where organization_id = v_org_id and risk_status = 'open'),
    'succession_risks', (select count(*) from public.organization_companion_expertise_succession_risks where organization_id = v_org_id and mitigation_status in ('open', 'capture_recommended')),
    'active_mentorships', (select count(*) from public.organization_companion_expertise_mentorship where organization_id = v_org_id and mentorship_status = 'active'),
    'department_coverage', coalesce((select round(avg(coverage_score)) from public.organization_companion_expertise_department_maps where organization_id = v_org_id), 0),
    'companion_recommendations', (select count(*) from public.organization_companion_expertise_recommendations where organization_id = v_org_id)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'profile_key', p.profile_key, 'profile_name', p.profile_name, 'profile_type', p.profile_type,
    'department', p.department, 'role_title', p.role_title, 'availability', p.availability,
    'expertise_areas', p.expertise_areas, 'skills', p.skills, 'certifications', p.certifications,
    'projects', p.projects, 'business_packs', p.business_packs, 'languages', p.languages,
    'experience_years', p.experience_years, 'summary', p.summary
  ) order by p.profile_name), '[]'::jsonb)
  into v_profiles from public.organization_companion_expertise_profiles p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'asset_key', a.asset_key, 'asset_title', a.asset_title, 'asset_type', a.asset_type,
    'owner_name', a.owner_name, 'backup_owner_name', a.backup_owner_name, 'department', a.department,
    'review_schedule', a.review_schedule, 'ownership_status', a.ownership_status, 'summary', a.summary
  ) order by a.asset_title), '[]'::jsonb)
  into v_assets from public.organization_companion_expertise_knowledge_assets a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'map_key', c.map_key, 'map_title', c.map_title, 'risk_type', c.risk_type,
    'risk_level', c.risk_level, 'risk_status', c.risk_status, 'summary', c.summary
  ) order by case c.risk_level when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_critical from public.organization_companion_expertise_critical_map c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'mentorship_key', m.mentorship_key, 'mentor_name', m.mentor_name, 'mentee_name', m.mentee_name,
    'mentorship_type', m.mentorship_type, 'learning_path', m.learning_path,
    'mentorship_status', m.mentorship_status, 'summary', m.summary
  ) order by m.mentor_name), '[]'::jsonb)
  into v_mentorship from public.organization_companion_expertise_mentorship m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'project_key', pr.project_key, 'project_title', pr.project_title, 'project_outcome', pr.project_outcome,
    'lessons_learned', pr.lessons_learned, 'contributors', pr.contributors, 'business_impact', pr.business_impact,
    'project_status', pr.project_status, 'summary', pr.summary
  ) order by pr.project_title), '[]'::jsonb)
  into v_projects from public.organization_companion_expertise_projects pr where pr.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'recommendation_key', r.recommendation_key, 'recommendation_title', r.recommendation_title,
    'recommendation_type', r.recommendation_type, 'recommended_expert', r.recommended_expert,
    'confidence', r.confidence, 'summary', r.summary
  ) order by r.recommendation_title), '[]'::jsonb)
  into v_recommendations from public.organization_companion_expertise_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'risk_key', s.risk_key, 'risk_title', s.risk_title, 'risk_category', s.risk_category,
    'concentration_pct', s.concentration_pct, 'risk_level', s.risk_level,
    'mitigation_status', s.mitigation_status, 'summary', s.summary
  ) order by s.concentration_pct desc), '[]'::jsonb)
  into v_succession from public.organization_companion_expertise_succession_risks s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'department_key', d.department_key, 'department_title', d.department_title, 'department_type', d.department_type,
    'expert_count', d.expert_count, 'coverage_score', d.coverage_score, 'specialists', d.specialists, 'summary', d.summary
  ) order by d.department_title), '[]'::jsonb)
  into v_departments from public.organization_companion_expertise_department_maps d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title, 'skills', bp.skills,
    'specialists', bp.specialists, 'knowledge_owners', bp.knowledge_owners,
    'training_resources', bp.training_resources, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_expertise_business_packs bp where bp.organization_id = v_org_id;

  select coalesce(jsonb_agg(distinct skill order by skill), '[]'::jsonb)
  into v_skills
  from (
    select jsonb_array_elements_text(p.skills) as skill
    from public.organization_companion_expertise_profiles p where p.organization_id = v_org_id
  ) skills;

  select jsonb_build_object(
    'knowledge_risks', (select count(*) from public.organization_companion_expertise_critical_map where organization_id = v_org_id and risk_level in ('high', 'critical')),
    'expertise_coverage', coalesce((select round(avg(coverage_score)) from public.organization_companion_expertise_department_maps where organization_id = v_org_id), 0),
    'mentorship_activity', (select count(*) from public.organization_companion_expertise_mentorship where organization_id = v_org_id and mentorship_status = 'active'),
    'knowledge_ownership_gaps', (select count(*) from public.organization_companion_expertise_knowledge_assets where organization_id = v_org_id and ownership_status in ('unowned', 'at_risk')),
    'succession_risks', (select count(*) from public.organization_companion_expertise_succession_risks where organization_id = v_org_id and risk_level in ('high', 'critical')),
    'companion_recommendations', v_recommendations
  ) into v_executive;

  select jsonb_build_object(
    'know_who_prompts', jsonb_build_array(
      'Who knows supplier onboarding?', 'Who understands finance workflows?',
      'Who built this process?', 'Who handled this customer previously?',
      'Who should I ask?', 'Who owns this process?', 'Who can approve this?'
    ),
    'expertise_advisor_prompts', jsonb_build_array(
      'Who should review this?', 'Who can help with this project?',
      'Who should join this meeting?', 'Generate expertise report.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'expertise_report', jsonb_build_object('experts', (select count(*) from public.organization_companion_expertise_profiles where organization_id = v_org_id)),
    'ownership_report', jsonb_build_object('assets', (select count(*) from public.organization_companion_expertise_knowledge_assets where organization_id = v_org_id)),
    'risk_report', v_succession,
    'mentorship_report', v_mentorship
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_expertise_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Knowledge tells organizations what exists. Expertise tells organizations who can help.',
    'philosophy', 'One Expertise Engine. One Know-Who Framework. One Organizational Intelligence Layer.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'expert_directory', v_profiles,
    'knowledge_owners', v_assets,
    'critical_knowledge_map', v_critical,
    'mentorship', v_mentorship,
    'projects', v_projects,
    'recommendations', v_recommendations,
    'succession_risks', v_succession,
    'departments', v_departments,
    'business_packs', v_packs,
    'skills', v_skills,
    'executive_dashboard', v_executive,
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object('expertise', '/app/expertise'),
    'mobile_access', jsonb_build_object(
      'find_experts', true, 'review_knowledge_owners', true,
      'view_mentors', true, 'review_expertise_maps', true, 'request_assistance', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_expertise_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_profile_key text := coalesce(p_payload->>'profile_key', '');
  v_asset_key text := coalesce(p_payload->>'asset_key', '');
  v_risk_key text := coalesce(p_payload->>'risk_key', '');
begin
  v_org_id := public._cmex572_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_expertise' then
    perform public._cmex572_log(v_org_id, 'expertise_refreshed', 'Expertise center refreshed', p_payload, 'expertise');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'assign_knowledge_owner' and v_asset_key <> '' then
    update public.organization_companion_expertise_knowledge_assets
    set owner_name = coalesce(p_payload->>'owner_name', owner_name),
        ownership_status = 'owned'
    where organization_id = v_org_id and asset_key = v_asset_key;
    perform public._cmex572_log(v_org_id, 'knowledge_owner_assigned', 'Knowledge owner assigned', p_payload, 'knowledge_owner');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'assign_mentor' then
    perform public._cmex572_log(v_org_id, 'mentor_assigned', 'Mentor assigned', p_payload, 'mentor');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_risk' and v_risk_key <> '' then
    perform public._cmex572_log(v_org_id, 'risk_identified', 'Succession risk identified', p_payload, 'risk');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_expertise_report' then
    perform public._cmex572_log(v_org_id, 'expertise_report_generated', 'Expertise report generated', p_payload, 'report');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_expert_skills' and v_profile_key <> '' then
    perform public._cmex572_log(v_org_id, 'skill_updated', 'Expert skills updated', p_payload, 'skill');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_expert' then
    perform public._cmex572_log(v_org_id, 'expert_added', 'Expert added to directory', p_payload, 'expert');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_expertise_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmex572_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_expertise_center('overview')->'overview')
    || jsonb_build_object(
      'found', true,
      'route', '/app/expertise',
      'mobile_access', jsonb_build_object(
        'find_experts', true, 'review_knowledge_owners', true,
        'view_mentors', true, 'review_expertise_maps', true, 'request_assistance', true
      )
    );
end; $$;

create or replace function public.get_assistant_companion_expertise_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmex572_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion connects people with expertise — who knows what, who has solved similar problems, who should be involved.',
    'advisor_prompts', jsonb_build_array(
      'Who should I ask?', 'Who owns this process?', 'Who can approve this?',
      'Who understands this system?', 'Who knows supplier onboarding?',
      'Generate expertise report.'
    ),
    'expert_count', (select count(*) from public.organization_companion_expertise_profiles where organization_id = v_org_id),
    'unowned_assets', (select count(*) from public.organization_companion_expertise_knowledge_assets where organization_id = v_org_id and ownership_status = 'unowned'),
    'succession_risks', (select count(*) from public.organization_companion_expertise_succession_risks where organization_id = v_org_id and risk_level in ('high', 'critical')),
    'route', '/app/expertise'
  );
end; $$;

grant execute on function public.get_organization_companion_expertise_center(text) to authenticated;
grant execute on function public.perform_organization_companion_expertise_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_expertise_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_expertise_advisor_context() to authenticated;
