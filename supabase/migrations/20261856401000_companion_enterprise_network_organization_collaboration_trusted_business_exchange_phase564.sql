-- Phase 564 — Companion Enterprise Network, Organization Collaboration & Trusted Business Exchange
-- Feature owner: CUSTOMER APP
-- Routes: /app/network, /app/network/workspaces
-- Helpers: _cmen564_*

create table if not exists public.organization_enterprise_network_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  network_enabled boolean not null default true,
  explicit_data_sharing_required boolean not null default true,
  trust_review_required boolean not null default true,
  growth_partner_network_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_enterprise_network_settings enable row level security;
revoke all on public.organization_enterprise_network_settings from authenticated, anon;

create table if not exists public.organization_enterprise_network_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  registry_key text not null,
  partner_org_name text not null,
  industry text not null default 'general',
  country text not null default 'NO',
  verification_status text not null default 'verified' check (
    verification_status in ('pending', 'verified', 'connected', 'review_required', 'suspended')
  ),
  relationship_status text not null default 'connected' check (
    relationship_status in ('pending', 'verified', 'connected', 'review_required', 'suspended')
  ),
  relationship_type text not null default 'partner' check (
    relationship_type in (
      'customer', 'supplier', 'partner', 'vendor', 'consultant',
      'service_provider', 'distributor', 'reseller', 'custom'
    )
  ),
  connected_domains jsonb not null default '[]'::jsonb,
  business_packs jsonb not null default '[]'::jsonb,
  trust_status text not null default 'verified' check (
    trust_status in ('trusted', 'verified', 'limited_trust', 'review_required')
  ),
  trust_score numeric(5,2) not null default 75,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, registry_key)
);

alter table public.organization_enterprise_network_registry enable row level security;
revoke all on public.organization_enterprise_network_registry from authenticated, anon;

create table if not exists public.organization_enterprise_network_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connection_key text not null,
  partner_org_name text not null,
  connection_status text not null default 'connected' check (
    connection_status in ('pending', 'verified', 'connected', 'review_required', 'suspended')
  ),
  relationship_type text not null default 'partner',
  trust_level text not null default 'verified' check (
    trust_level in ('trusted', 'verified', 'limited_trust', 'review_required')
  ),
  permissions_granted jsonb not null default '[]'::jsonb,
  connected_at timestamptz not null default now(),
  unique (organization_id, connection_key)
);

alter table public.organization_enterprise_network_connections enable row level security;
revoke all on public.organization_enterprise_network_connections from authenticated, anon;

create table if not exists public.organization_enterprise_network_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  invitation_key text not null,
  target_org_name text not null,
  relationship_type text not null default 'partner',
  invitation_status text not null default 'pending' check (
    invitation_status in ('pending', 'approved', 'declined', 'expired')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  sent_at timestamptz not null default now(),
  unique (organization_id, invitation_key)
);

alter table public.organization_enterprise_network_invitations enable row level security;
revoke all on public.organization_enterprise_network_invitations from authenticated, anon;

create table if not exists public.organization_enterprise_network_collaborations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  collaboration_key text not null,
  collaboration_title text not null,
  partner_org_name text not null,
  collaboration_type text not null default 'joint_project' check (
    collaboration_type in (
      'joint_project', 'vendor_relationship', 'partner_relationship',
      'customer_relationship', 'supplier_collaboration', 'custom'
    )
  ),
  collaboration_status text not null default 'active' check (
    collaboration_status in ('active', 'pending', 'review_required', 'completed', 'suspended')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, collaboration_key)
);

alter table public.organization_enterprise_network_collaborations enable row level security;
revoke all on public.organization_enterprise_network_collaborations from authenticated, anon;

create table if not exists public.organization_enterprise_network_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_key text not null,
  workspace_title text not null,
  partner_org_name text not null,
  workspace_type text not null default 'joint_project' check (
    workspace_type in (
      'joint_project', 'vendor_relationship', 'partner_relationship',
      'customer_relationship', 'supplier_collaboration', 'custom'
    )
  ),
  workspace_status text not null default 'active' check (
    workspace_status in ('active', 'pending', 'review_required', 'archived')
  ),
  permission_categories jsonb not null default '["view","comment","collaborate"]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workspace_key)
);

alter table public.organization_enterprise_network_workspaces enable row level security;
revoke all on public.organization_enterprise_network_workspaces from authenticated, anon;

create table if not exists public.organization_enterprise_network_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_key text not null,
  document_title text not null,
  partner_org_name text not null,
  document_type text not null default 'contract' check (
    document_type in ('contract', 'policy', 'specification', 'report', 'custom')
  ),
  document_status text not null default 'shared' check (
    document_status in ('draft', 'pending_approval', 'shared', 'expired', 'revoked')
  ),
  version text not null default '1.0',
  expires_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, document_key)
);

alter table public.organization_enterprise_network_documents enable row level security;
revoke all on public.organization_enterprise_network_documents from authenticated, anon;

create table if not exists public.organization_enterprise_network_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  message_key text not null,
  message_type text not null default 'collaboration_request' check (
    message_type in (
      'organization_message', 'collaboration_request', 'approval_request',
      'project_discussion', 'partner_communication'
    )
  ),
  partner_org_name text not null,
  subject text not null,
  message_status text not null default 'open' check (
    message_status in ('open', 'pending', 'resolved', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  sent_at timestamptz not null default now(),
  unique (organization_id, message_key)
);

alter table public.organization_enterprise_network_messages enable row level security;
revoke all on public.organization_enterprise_network_messages from authenticated, anon;

create table if not exists public.organization_enterprise_network_reputation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  reputation_key text not null,
  partner_org_name text not null,
  reputation_label text not null default 'trusted_supplier' check (
    reputation_label in (
      'excellent_partner', 'trusted_supplier', 'review_recommended', 'limited_history'
    )
  ),
  project_success_score numeric(5,2) not null default 80,
  response_time_score numeric(5,2) not null default 75,
  collaboration_quality_score numeric(5,2) not null default 78,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, reputation_key)
);

alter table public.organization_enterprise_network_reputation enable row level security;
revoke all on public.organization_enterprise_network_reputation from authenticated, anon;

create table if not exists public.organization_enterprise_network_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'network' check (
    metric_category in ('network', 'collaboration', 'trust', 'revenue', 'growth')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_enterprise_network_analytics enable row level security;
revoke all on public.organization_enterprise_network_analytics from authenticated, anon;

create table if not exists public.organization_enterprise_network_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'network' check (
    audit_category in (
      'connection', 'workspace', 'document', 'permission', 'trust',
      'collaboration', 'invitation', 'purchase'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_enterprise_network_audit_logs_org_idx
  on public.organization_enterprise_network_audit_logs (organization_id, created_at desc);

alter table public.organization_enterprise_network_audit_logs enable row level security;
revoke all on public.organization_enterprise_network_audit_logs from authenticated, anon;

create or replace function public._cmen564_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmen564_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'network'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_enterprise_network_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'network'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmen564_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_enterprise_network_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmen564_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_enterprise_network_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_enterprise_network_registry (
    organization_id, registry_key, partner_org_name, industry, country,
    verification_status, relationship_status, relationship_type,
    connected_domains, business_packs, trust_status, trust_score, summary
  ) values
    (p_org_id, 'org_nordic_supply', 'Nordic Supply AS', 'operations', 'NO',
     'verified', 'connected', 'supplier', '["nordicsupply.no"]'::jsonb, '["pack_warehouse"]'::jsonb,
     'trusted', 92, 'Verified supplier — warehouse and logistics collaboration.'),
    (p_org_id, 'org_baltic_partner', 'Baltic Growth Partners', 'consulting', 'SE',
     'verified', 'connected', 'partner', '["balticgrowth.se"]'::jsonb, '["pack_executive"]'::jsonb,
     'verified', 88, 'Growth Partner — joint opportunities and lead sharing.'),
    (p_org_id, 'org_eu_vendor', 'EU Vendor Solutions GmbH', 'technology', 'DE',
     'review_required', 'review_required', 'vendor', '["euvendor.de"]'::jsonb, '[]'::jsonb,
     'limited_trust', 62, 'Vendor relationship — trust review recommended.');

  insert into public.organization_enterprise_network_connections (
    organization_id, connection_key, partner_org_name, connection_status,
    relationship_type, trust_level, permissions_granted
  ) values
    (p_org_id, 'conn_nordic', 'Nordic Supply AS', 'connected', 'supplier', 'trusted',
     '["view","comment","collaborate","upload"]'::jsonb),
    (p_org_id, 'conn_baltic', 'Baltic Growth Partners', 'connected', 'partner', 'verified',
     '["view","comment","collaborate","approve"]'::jsonb),
    (p_org_id, 'conn_eu_vendor', 'EU Vendor Solutions GmbH', 'review_required', 'vendor', 'review_required',
     '["view"]'::jsonb);

  insert into public.organization_enterprise_network_invitations (
    organization_id, invitation_key, target_org_name, relationship_type, invitation_status, summary
  ) values
    (p_org_id, 'inv_finland_ops', 'Finland Operations Oy', 'supplier', 'pending',
     'Connection invitation — supplier collaboration for Nordic expansion.'),
    (p_org_id, 'inv_dk_consult', 'Copenhagen Advisory ApS', 'consultant', 'pending',
     'Consultant relationship — project advisory and review.');

  insert into public.organization_enterprise_network_collaborations (
    organization_id, collaboration_key, collaboration_title, partner_org_name,
    collaboration_type, collaboration_status, summary
  ) values
    (p_org_id, 'collab_q3_launch', 'Q3 Product Launch', 'Baltic Growth Partners',
     'joint_project', 'active', 'Cross-organization launch coordination with shared reporting.'),
    (p_org_id, 'collab_supply_chain', 'Supply Chain Optimization', 'Nordic Supply AS',
     'supplier_collaboration', 'active', 'Inventory and delivery coordination — governed data sharing.');

  insert into public.organization_enterprise_network_workspaces (
    organization_id, workspace_key, workspace_title, partner_org_name,
    workspace_type, workspace_status, permission_categories, summary
  ) values
    (p_org_id, 'ws_q3_launch', 'Q3 Launch Workspace', 'Baltic Growth Partners',
     'joint_project', 'active', '["view","comment","collaborate","upload","approve"]'::jsonb,
     'Shared tasks, documents, and reporting for Q3 launch.'),
    (p_org_id, 'ws_vendor_review', 'Vendor Contract Review', 'EU Vendor Solutions GmbH',
     'vendor_relationship', 'review_required', '["view","comment"]'::jsonb,
     'Contract review workspace — permission review required before upload.');

  insert into public.organization_enterprise_network_documents (
    organization_id, document_key, document_title, partner_org_name,
    document_type, document_status, version, summary
  ) values
    (p_org_id, 'doc_supply_agreement', 'Supply Agreement 2026', 'Nordic Supply AS',
     'contract', 'shared', '2.1', 'Master supply agreement — auditable exchange.'),
    (p_org_id, 'doc_launch_spec', 'Launch Specification', 'Baltic Growth Partners',
     'specification', 'pending_approval', '1.0', 'Product launch spec — approval required before share.');

  insert into public.organization_enterprise_network_messages (
    organization_id, message_key, message_type, partner_org_name, subject, message_status, summary
  ) values
    (p_org_id, 'msg_conn_request', 'collaboration_request', 'Finland Operations Oy',
     'Connection request received', 'pending', 'New connection request — verification and permission review required.'),
    (p_org_id, 'msg_doc_share', 'approval_request', 'Baltic Growth Partners',
     'Launch spec approval', 'open', 'Approval required before sharing launch specification.');

  insert into public.organization_enterprise_network_reputation (
    organization_id, reputation_key, partner_org_name, reputation_label,
    project_success_score, response_time_score, collaboration_quality_score, summary
  ) values
    (p_org_id, 'rep_nordic', 'Nordic Supply AS', 'trusted_supplier', 94, 91, 90,
     'Consistent delivery and strong collaboration quality.'),
    (p_org_id, 'rep_baltic', 'Baltic Growth Partners', 'excellent_partner', 96, 88, 93,
     'Excellent partner — high project success and response times.'),
    (p_org_id, 'rep_eu_vendor', 'EU Vendor Solutions GmbH', 'review_recommended', 70, 65, 68,
     'Limited history — review recommended before expanding permissions.');

  insert into public.organization_enterprise_network_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_connected_orgs', 'Connected Organizations', 3, 'network'),
    (p_org_id, 'metric_shared_projects', 'Shared Projects', 2, 'collaboration'),
    (p_org_id, 'metric_avg_trust', 'Average Trust Score', 81, 'trust'),
    (p_org_id, 'metric_network_growth', 'Network Growth %', 18, 'growth');
end; $$;

create or replace function public.get_organization_enterprise_network_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_organizations jsonb; v_connections jsonb;
  v_invitations jsonb; v_collaborations jsonb; v_workspaces jsonb; v_trust jsonb;
  v_reports jsonb; v_executive jsonb; v_integrations jsonb; v_audit jsonb;
begin
  v_org_id := public._cmen564_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmen564_ensure_settings(v_org_id);
  perform public._cmen564_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'connected_organizations', (select count(*) from public.organization_enterprise_network_registry where organization_id = v_org_id and relationship_status = 'connected'),
    'pending_invitations', (select count(*) from public.organization_enterprise_network_invitations where organization_id = v_org_id and invitation_status = 'pending'),
    'active_collaborations', (select count(*) from public.organization_enterprise_network_collaborations where organization_id = v_org_id and collaboration_status = 'active'),
    'shared_workspaces', (select count(*) from public.organization_enterprise_network_workspaces where organization_id = v_org_id and workspace_status = 'active'),
    'trust_reviews_required', (select count(*) from public.organization_enterprise_network_registry where organization_id = v_org_id and trust_status = 'review_required'),
    'average_trust_score', coalesce((select round(avg(trust_score)::numeric, 1) from public.organization_enterprise_network_registry where organization_id = v_org_id), 75)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'registry_key', r.registry_key, 'partner_org_name', r.partner_org_name, 'industry', r.industry,
    'country', r.country, 'verification_status', r.verification_status,
    'relationship_status', r.relationship_status, 'relationship_type', r.relationship_type,
    'connected_domains', r.connected_domains, 'business_packs', r.business_packs,
    'trust_status', r.trust_status, 'trust_score', r.trust_score, 'summary', r.summary
  ) order by r.trust_score desc), '[]'::jsonb)
  into v_organizations from public.organization_enterprise_network_registry r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'connection_key', c.connection_key, 'partner_org_name', c.partner_org_name,
    'connection_status', c.connection_status, 'relationship_type', c.relationship_type,
    'trust_level', c.trust_level, 'permissions_granted', c.permissions_granted, 'connected_at', c.connected_at
  ) order by c.connected_at desc), '[]'::jsonb)
  into v_connections from public.organization_enterprise_network_connections c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'invitation_key', i.invitation_key, 'target_org_name', i.target_org_name,
    'relationship_type', i.relationship_type, 'invitation_status', i.invitation_status,
    'summary', i.summary, 'sent_at', i.sent_at
  ) order by i.sent_at desc), '[]'::jsonb)
  into v_invitations from public.organization_enterprise_network_invitations i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'collaboration_key', c.collaboration_key, 'collaboration_title', c.collaboration_title,
    'partner_org_name', c.partner_org_name, 'collaboration_type', c.collaboration_type,
    'collaboration_status', c.collaboration_status, 'summary', c.summary
  ) order by c.collaboration_title), '[]'::jsonb)
  into v_collaborations from public.organization_enterprise_network_collaborations c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'workspace_key', w.workspace_key, 'workspace_title', w.workspace_title,
    'partner_org_name', w.partner_org_name, 'workspace_type', w.workspace_type,
    'workspace_status', w.workspace_status, 'permission_categories', w.permission_categories, 'summary', w.summary
  ) order by w.workspace_title), '[]'::jsonb)
  into v_workspaces from public.organization_enterprise_network_workspaces w where w.organization_id = v_org_id;

  select jsonb_build_object(
    'trust_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'partner_org_name', r.partner_org_name, 'trust_status', r.trust_status,
        'trust_score', r.trust_score, 'relationship_type', r.relationship_type
      ) order by r.trust_score desc)
      from public.organization_enterprise_network_registry r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'reputation', coalesce((
      select jsonb_agg(jsonb_build_object(
        'partner_org_name', rep.partner_org_name, 'reputation_label', rep.reputation_label,
        'project_success_score', rep.project_success_score,
        'response_time_score', rep.response_time_score,
        'collaboration_quality_score', rep.collaboration_quality_score, 'summary', rep.summary
      ) order by rep.project_success_score desc)
      from public.organization_enterprise_network_reputation rep where rep.organization_id = v_org_id
    ), '[]'::jsonb),
    'trust_levels', jsonb_build_object(
      'trusted', 'Trusted', 'verified', 'Verified',
      'limited_trust', 'Limited Trust', 'review_required', 'Review Required'
    ),
    'data_sharing_rule', 'No organization data is shared automatically — explicit approval required.'
  ) into v_trust;

  select jsonb_build_object(
    'network_activity', coalesce((
      select jsonb_agg(jsonb_build_object('metric_title', a.metric_title, 'metric_value', a.metric_value, 'metric_category', a.metric_category)
        order by a.metric_category)
      from public.organization_enterprise_network_analytics a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'trust_trends', jsonb_build_object('average_trust_score', coalesce((select round(avg(trust_score)::numeric, 1) from public.organization_enterprise_network_registry where organization_id = v_org_id), 75)),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Approve Finland Operations connection', 'reason', 'Pending invitation — supplier collaboration opportunity'),
      jsonb_build_object('title', 'Review EU Vendor trust status', 'reason', 'Limited trust — permission review recommended'),
      jsonb_build_object('title', 'Open Q3 Launch Workspace', 'reason', 'Active cross-organization project with shared reporting')
    )
  ) into v_reports;

  select jsonb_build_object(
    'connected_organizations', (select count(*) from public.organization_enterprise_network_registry where organization_id = v_org_id and relationship_status = 'connected'),
    'trust_scores', coalesce((select round(avg(trust_score)::numeric, 1) from public.organization_enterprise_network_registry where organization_id = v_org_id), 75),
    'shared_projects', (select count(*) from public.organization_enterprise_network_collaborations where organization_id = v_org_id and collaboration_status = 'active'),
    'collaboration_activity', (select count(*) from public.organization_enterprise_network_collaborations where organization_id = v_org_id),
    'network_growth', coalesce((select metric_value from public.organization_enterprise_network_analytics where organization_id = v_org_id and metric_key = 'metric_network_growth'), 0),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'connection_workflow', jsonb_build_array(
      'Invite Organization', 'Verification', 'Permission Review',
      'Connection Approved', 'Relationship Created', 'Audit Logged'
    ),
    'data_sharing_framework', jsonb_build_object(
      'rule', 'No automatic sharing — organizations explicitly approve what, who, and duration.',
      'shareable_types', jsonb_build_array('Documents', 'Projects', 'Tasks', 'Contracts', 'Reports', 'Knowledge Assets'),
      'permission_categories', jsonb_build_array('View', 'Comment', 'Collaborate', 'Upload', 'Approve', 'Manage', 'Custom')
    ),
    'relationship_types', jsonb_build_array(
      'customer', 'supplier', 'partner', 'vendor', 'consultant',
      'service_provider', 'distributor', 'reseller', 'custom'
    ),
    'network_advisor_prompts', jsonb_build_array(
      'Show connected organizations.', 'Recommend trusted providers.',
      'Find collaboration opportunities.', 'Review trust status.', 'Generate network summary.'
    ),
    'document_exchange', coalesce((
      select jsonb_agg(jsonb_build_object(
        'document_key', d.document_key, 'document_title', d.document_title,
        'partner_org_name', d.partner_org_name, 'document_type', d.document_type,
        'document_status', d.document_status, 'version', d.version, 'summary', d.summary
      ) order by d.document_title)
      from public.organization_enterprise_network_documents d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'network_messages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'message_key', m.message_key, 'message_type', m.message_type,
        'partner_org_name', m.partner_org_name, 'subject', m.subject,
        'message_status', m.message_status, 'summary', m.summary
      ) order by m.sent_at desc)
      from public.organization_enterprise_network_messages m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'growth_partner_network', jsonb_build_object(
      'enabled', true,
      'note', 'Growth Partners may collaborate on joint opportunities — customers remain owned by Platform.',
      'route', '/app/growth-partner-operations'
    ),
    'marketplace_integration', jsonb_build_object(
      'provider_marketplace', '/app/companion/ecosystem',
      'companion_marketplace', '/app/companion/marketplace',
      'business_packs', '/app/settings/modules'
    ),
    'collaboration_assistant_prompts', jsonb_build_array(
      'Create shared workspace.', 'Invite supplier.', 'Share contract.',
      'Coordinate project.', 'Request review.'
    )
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_enterprise_network_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Most business systems stop at the organization boundary — Aipify safely connects organizations through governed collaboration.',
    'philosophy', 'No organization data is shared automatically. Companion facilitates collaboration — human governance remains.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'organizations', v_organizations,
    'connections', v_connections,
    'invitations', v_invitations,
    'collaborations', v_collaborations,
    'workspaces', v_workspaces,
    'trust', v_trust,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'network', '/app/network',
      'workspaces', '/app/network/workspaces',
      'ecosystem', '/app/companion/ecosystem',
      'marketplace', '/app/companion/marketplace'
    ),
    'notifications', jsonb_build_object(
      'connection_request_received', true, 'connection_approved', true,
      'workspace_invitation', true, 'document_shared', true,
      'trust_score_changed', true, 'collaboration_review_required', true
    ),
    'mobile_access', jsonb_build_object(
      'manage_connections', true, 'review_relationships', true,
      'manage_workspaces', true, 'review_shared_documents', true, 'review_trust_status', true
    )
  );
end; $$;

create or replace function public.perform_organization_enterprise_network_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_invitation_key text := coalesce(p_payload->>'invitation_key', '');
  v_connection_key text := coalesce(p_payload->>'connection_key', '');
  v_workspace_key text := coalesce(p_payload->>'workspace_key', '');
  v_document_key text := coalesce(p_payload->>'document_key', '');
  v_inv record;
begin
  v_org_id := public._cmen564_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'approve_invitation' and v_invitation_key <> '' then
    select * into v_inv from public.organization_enterprise_network_invitations
    where organization_id = v_org_id and invitation_key = v_invitation_key limit 1;
    if v_inv is null then raise exception 'Invitation not found'; end if;
    update public.organization_enterprise_network_invitations
    set invitation_status = 'approved' where organization_id = v_org_id and invitation_key = v_invitation_key;
    insert into public.organization_enterprise_network_connections (
      organization_id, connection_key, partner_org_name, connection_status,
      relationship_type, trust_level, permissions_granted
    ) values (
      v_org_id, 'conn_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      v_inv.target_org_name, 'connected', v_inv.relationship_type, 'verified', '["view","comment","collaborate"]'::jsonb
    );
    perform public._cmen564_log(v_org_id, 'organization_connected', 'Connection approved and relationship created', p_payload, 'connection');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'remove_connection' and v_connection_key <> '' then
    delete from public.organization_enterprise_network_connections
    where organization_id = v_org_id and connection_key = v_connection_key;
    perform public._cmen564_log(v_org_id, 'connection_removed', 'Connection removed', p_payload, 'connection');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_workspace' then
    insert into public.organization_enterprise_network_workspaces (
      organization_id, workspace_key, workspace_title, partner_org_name,
      workspace_type, workspace_status, permission_categories, summary
    ) values (
      v_org_id, 'ws_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'workspace_title', 'New Shared Workspace'),
      coalesce(p_payload->>'partner_org_name', 'Partner Organization'),
      coalesce(p_payload->>'workspace_type', 'joint_project'), 'pending',
      '["view","comment","collaborate"]'::jsonb,
      coalesce(p_payload->>'summary', 'Shared workspace created — permission review may be required.')
    );
    perform public._cmen564_log(v_org_id, 'workspace_created', 'Shared workspace created', p_payload, 'workspace');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'share_document' and v_document_key <> '' then
    update public.organization_enterprise_network_documents
    set document_status = 'shared', version = version || '.1'
    where organization_id = v_org_id and document_key = v_document_key;
    perform public._cmen564_log(v_org_id, 'document_shared', 'Document shared with partner organization', p_payload, 'document');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_data_sharing' and v_workspace_key <> '' then
    update public.organization_enterprise_network_workspaces
    set workspace_status = 'active',
        permission_categories = coalesce(p_payload->'permission_categories', '["view","comment","collaborate","upload"]'::jsonb)
    where organization_id = v_org_id and workspace_key = v_workspace_key;
    perform public._cmen564_log(v_org_id, 'permission_granted', 'Data sharing permissions approved', p_payload, 'permission');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_network' then
    perform public._cmen564_log(v_org_id, 'network_refreshed', 'Enterprise network refreshed', p_payload, 'network');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_enterprise_network_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmen564_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_enterprise_network_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/network');
end; $$;

create or replace function public.get_assistant_companion_network_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmen564_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands network relationships — recommend trusted providers and collaboration opportunities.',
    'advisor_prompts', jsonb_build_array(
      'Show connected organizations.', 'Recommend trusted providers.',
      'Find collaboration opportunities.', 'Review trust status.', 'Generate network summary.'
    ),
    'connected_count', (select count(*) from public.organization_enterprise_network_registry where organization_id = v_org_id and relationship_status = 'connected'),
    'pending_invitations', (select count(*) from public.organization_enterprise_network_invitations where organization_id = v_org_id and invitation_status = 'pending'),
    'trust_reviews', (select count(*) from public.organization_enterprise_network_registry where organization_id = v_org_id and trust_status = 'review_required'),
    'route', '/app/network'
  );
end; $$;

grant execute on function public.get_organization_enterprise_network_center(text) to authenticated;
grant execute on function public.perform_organization_enterprise_network_action(jsonb) to authenticated;
grant execute on function public.get_organization_enterprise_network_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_network_advisor_context() to authenticated;
