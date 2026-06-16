-- Foundation 04 — Business Pack Legal Engine
-- Feature owner: PLATFORM FOUNDATION. Helpers: _bpleg_* (engine), _bplegf04_* (blueprint)
-- Core principle: No Business Pack may be published without approved legal foundations.
-- Company fields use placeholders resolved from company.config.ts — never hardcoded in documents.

create table if not exists public.business_pack_legal_definitions (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  publication_status text not null default 'published' check (
    publication_status in ('draft', 'published', 'requires_update', 'withdrawn')
  ),
  pack_terms jsonb not null default '{}'::jsonb,
  governing_law text not null default 'Norwegian Law',
  jurisdiction text not null default 'Norway',
  company_field_placeholders jsonb not null default '["legal_company_name","organization_number","headquarters_address","country","contact_email","website"]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.business_pack_legal_definitions enable row level security;
revoke all on public.business_pack_legal_definitions from authenticated, anon;

create table if not exists public.business_pack_legal_documents (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  document_key text not null check (
    document_key in (
      'terms_and_conditions', 'license_agreement', 'acceptable_use_policy',
      'privacy_addendum', 'subscription_terms', 'cancellation_policy',
      'limitation_of_liability', 'governing_law'
    )
  ),
  title text not null,
  version text not null default '1.0.0',
  body_template text not null,
  effective_date date not null default current_date,
  published_at timestamptz not null default now(),
  requires_acceptance boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  unique (pack_key, document_key, version)
);

create index if not exists business_pack_legal_documents_pack_idx
  on public.business_pack_legal_documents (pack_key, document_key);

alter table public.business_pack_legal_documents enable row level security;
revoke all on public.business_pack_legal_documents from authenticated, anon;

create table if not exists public.business_pack_legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  document_key text not null,
  document_version text not null,
  accepted_at timestamptz not null default now(),
  accepted_by uuid references public.users (id) on delete set null,
  reacceptance boolean not null default false,
  context jsonb not null default '{}'::jsonb,
  unique (tenant_id, pack_key, document_key, document_version)
);

create index if not exists business_pack_legal_acceptances_tenant_idx
  on public.business_pack_legal_acceptances (tenant_id, pack_key);

alter table public.business_pack_legal_acceptances enable row level security;
revoke all on public.business_pack_legal_acceptances from authenticated, anon;

create table if not exists public.business_pack_legal_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text not null,
  action text not null check (
    action in (
      'legal_acceptance', 'reacceptance', 'document_published', 'document_updated',
      'material_change_notified', 'center_view', 'activation_blocked_pending_acceptance'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_legal_audit_tenant_idx
  on public.business_pack_legal_audit_logs (tenant_id, created_at desc);

alter table public.business_pack_legal_audit_logs enable row level security;
revoke all on public.business_pack_legal_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_pack_legal', v.description
from (values
  ('business_pack_legal.view', 'View Business Pack Legal', 'View legal center and agreements'),
  ('business_pack_legal.accept', 'Accept Business Pack Legal', 'Accept terms and license agreements'),
  ('business_pack_legal.manage', 'Manage Business Pack Legal', 'Manage legal document lifecycle'),
  ('business_pack_legal.publish', 'Publish Business Pack Legal', 'Publish approved legal documents')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_pack_legal.view'), ('owner', 'business_pack_legal.accept'),
  ('administrator', 'business_pack_legal.view'), ('administrator', 'business_pack_legal.accept'),
  ('manager', 'business_pack_legal.view'),
  ('viewer', 'business_pack_legal.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bpleg_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_legal.view');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpleg_require_accept()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('business_pack_legal.accept');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpleg_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bpleg_log(
  p_tenant_id uuid, p_pack_key text, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_legal_audit_logs (tenant_id, pack_key, action, summary, actor_user_id, context)
  values (p_tenant_id, p_pack_key, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bplegf04_principle()
returns text language sql immutable as $$
  select 'No Business Pack may be published without approved legal foundations. Company information inherits from company.config.ts only.';
$$;

create or replace function public._bplegf04_mandatory_documents()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'terms_and_conditions', 'license_agreement', 'acceptable_use_policy', 'privacy_addendum',
    'subscription_terms', 'cancellation_policy', 'limitation_of_liability', 'governing_law'
  );
$$;

create or replace function public._bplegf04_company_placeholders()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'legal_company_name', '{{legal_company_name}}',
    'organization_number', '{{organization_number}}',
    'headquarters_address', '{{headquarters_address}}',
    'country', '{{country}}',
    'contact_email', '{{contact_email}}',
    'website', '{{website}}'
  );
$$;

create or replace function public._bpleg_default_pack_terms(p_pack_name text, p_scope text)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'scope', p_scope,
    'intended_use', 'Licensed operational use within approved capacity limits for ' || p_pack_name || '.',
    'license_limitations', 'Capacity-based licensing only — no ownership of software or underlying platform.',
    'customer_responsibilities', 'Lawful use, accurate account information, safeguarding credentials, compliance with Acceptable Use Policy.',
    'platform_responsibilities', '{{legal_company_name}} provides the service, maintains security baseline, and publishes transparent legal documentation.',
    'data_handling_principles', 'Customer owns operational data. Platform stores metadata required for service delivery — never prohibited content categories.'
  );
$$;

create or replace function public._bpleg_seed_legal()
returns void language plpgsql security definer set search_path = public as $$
declare v_pack record;
  v_doc record;
begin
  for v_pack in
    select * from (values
      ('aipify_hosts', 'Aipify Hosts', 'Hospitality property operations, guest communications, and revenue visibility.'),
      ('aipify_commerce', 'Aipify Commerce', 'Commerce operations, order support, and margin analytics.'),
      ('aipify_support', 'Aipify Support', 'Customer support operations with knowledge-backed workflows.'),
      ('aipify_executive', 'Aipify Executive', 'Executive briefings and leadership visibility.'),
      ('aipify_growth', 'Aipify Growth', 'Growth intelligence and expansion guidance.'),
      ('general_business', 'Aipify Essentials', 'Core operational modules for everyday business administration.')
    ) as t(pack_key, pack_name, scope)
  loop
    insert into public.business_pack_legal_definitions (
      pack_key, pack_name, publication_status, pack_terms, governing_law, jurisdiction, published_at
    ) values (
      v_pack.pack_key, v_pack.pack_name, 'published',
      public._bpleg_default_pack_terms(v_pack.pack_name, v_pack.scope),
      'Norwegian Law', 'Norway', now()
    ) on conflict (pack_key) do update set
      pack_name = excluded.pack_name,
      pack_terms = excluded.pack_terms,
      publication_status = 'published',
      updated_at = now();

    for v_doc in
      select * from (values
        ('terms_and_conditions', 'Terms & Conditions', '1.0.0',
          'These Terms & Conditions govern use of {{pack_name}} provided by {{legal_company_name}} (Org. {{organization_number}}), {{headquarters_address}}, {{country}}. Contact: {{contact_email}} · {{website}}. Scope: licensed operational use only. Customers must comply with all applicable laws and the Acceptable Use Policy. {{legal_company_name}} may update terms with notice for material changes.',
          true),
        ('license_agreement', 'License Agreement', '1.0.0',
          '{{legal_company_name}} grants a non-exclusive, non-transferable license to use {{pack_name}} subject to capacity limits, subscription tier, and trial restrictions defined in the License Center. Software remains proprietary property of {{legal_company_name}}. Termination follows the Cancellation Policy.',
          true),
        ('acceptable_use_policy', 'Acceptable Use Policy', '1.0.0',
          'Prohibited: illegal use; unauthorized access attempts; abuse of integrations; circumvention of licensing controls; harassment or harmful behavior; misuse of automated actions without approved limits; storage of prohibited data categories.',
          false),
        ('privacy_addendum', 'Privacy Addendum', '1.0.0',
          'Data processed: operational metadata required to deliver {{pack_name}}. Purpose: service delivery, security, billing, and audit. Customer responsibilities: lawful collection and consent where required. {{legal_company_name}} responsibilities: metadata-first processing, tenant isolation, transparent audit. Privacy contact: {{contact_email}}.',
          false),
        ('subscription_terms', 'Subscription Terms', '1.0.0',
          'Billing: monthly or annual as selected. Renewal: automatic unless cancelled per Cancellation Policy. Upgrades: effective immediately upon approved payment (Paid = Access Now). Downgrades: require usage within new capacity limits. Failed payment: grace period then service pause — settings preserved.',
          false),
        ('cancellation_policy', 'Cancellation Policy', '1.0.0',
          'Cancellation via billing settings or written notice to {{contact_email}}. Data retention: customer settings and configuration preserved during grace; operational metadata retained per audit requirements. Service termination: access paused after grace — never silent deletion of approved configuration.',
          false),
        ('limitation_of_liability', 'Limitation of Liability', '1.0.0',
          'Service provided as operational assistance — humans retain decision authority. {{legal_company_name}} liability limited to fees paid in the preceding twelve months except where prohibited by law. Service availability targets are best-effort with transparent maintenance windows. Force majeure: events beyond reasonable control.',
          false),
        ('governing_law', 'Governing Law Statement', '1.0.0',
          'Governing law: Norwegian Law. Jurisdiction: Norway. Disputes resolved in Norwegian courts unless mandatory consumer law requires otherwise.',
          false)
      ) as d(document_key, title, version, body_template, requires_acceptance)
    loop
      insert into public.business_pack_legal_documents (
        pack_key, document_key, title, version, body_template, effective_date, requires_acceptance
      ) values (
        v_pack.pack_key,
        replace(v_doc.body_template, '{{pack_name}}', v_pack.pack_name),
        v_doc.title,
        v_doc.version,
        replace(v_doc.body_template, '{{pack_name}}', v_pack.pack_name),
        current_date,
        v_doc.requires_acceptance
      )
      on conflict (pack_key, document_key, version) do update set
        title = excluded.title,
        body_template = excluded.body_template,
        requires_acceptance = excluded.requires_acceptance;
    end loop;
  end loop;
end; $$;

-- Fix seed: document insert had wrong column order - rewrite seed function correctly
create or replace function public._bpleg_seed_legal()
returns void language plpgsql security definer set search_path = public as $$
declare v_pack record;
begin
  for v_pack in
    select * from (values
      ('aipify_hosts', 'Aipify Hosts', 'Hospitality property operations, guest communications, and revenue visibility.'),
      ('aipify_commerce', 'Aipify Commerce', 'Commerce operations, order support, and margin analytics.'),
      ('aipify_support', 'Aipify Support', 'Customer support operations with knowledge-backed workflows.'),
      ('aipify_executive', 'Aipify Executive', 'Executive briefings and leadership visibility.'),
      ('aipify_growth', 'Aipify Growth', 'Growth intelligence and expansion guidance.'),
      ('general_business', 'Aipify Essentials', 'Core operational modules for everyday business administration.')
    ) as t(pack_key, pack_name, scope)
  loop
    insert into public.business_pack_legal_definitions (
      pack_key, pack_name, publication_status, pack_terms, governing_law, jurisdiction, published_at
    ) values (
      v_pack.pack_key, v_pack.pack_name, 'published',
      public._bpleg_default_pack_terms(v_pack.pack_name, v_pack.scope),
      'Norwegian Law', 'Norway', now()
    ) on conflict (pack_key) do update set
      pack_name = excluded.pack_name,
      pack_terms = excluded.pack_terms,
      publication_status = 'published',
      updated_at = now();

    insert into public.business_pack_legal_documents (pack_key, document_key, title, version, body_template, requires_acceptance)
    values
      (v_pack.pack_key, 'terms_and_conditions', 'Terms & Conditions', '1.0.0',
        'These Terms & Conditions govern use of ' || v_pack.pack_name || ' provided by {{legal_company_name}} (Org. {{organization_number}}), {{headquarters_address}}, {{country}}. Contact: {{contact_email}} · {{website}}. Scope: licensed operational use only.',
        true),
      (v_pack.pack_key, 'license_agreement', 'License Agreement', '1.0.0',
        '{{legal_company_name}} grants a non-exclusive license to use ' || v_pack.pack_name || ' subject to capacity limits and subscription terms. Software remains proprietary property of {{legal_company_name}}.',
        true),
      (v_pack.pack_key, 'acceptable_use_policy', 'Acceptable Use Policy', '1.0.0',
        'Prohibited: illegal use; unauthorized access; abuse of integrations; circumvention of licensing; harassment; misuse of automated actions beyond approved limits.',
        false),
      (v_pack.pack_key, 'privacy_addendum', 'Privacy Addendum', '1.0.0',
        'Operational metadata processed to deliver ' || v_pack.pack_name || '. Customer owns data. {{legal_company_name}} applies metadata-first processing and tenant isolation. Contact: {{contact_email}}.',
        false),
      (v_pack.pack_key, 'subscription_terms', 'Subscription Terms', '1.0.0',
        'Monthly or annual billing. Renewal automatic unless cancelled. Upgrades effective on approved payment. Failed payment: grace period then pause — settings preserved.',
        false),
      (v_pack.pack_key, 'cancellation_policy', 'Cancellation Policy', '1.0.0',
        'Cancel via billing or {{contact_email}}. Configuration preserved during grace. Service paused after grace — never silent deletion of approved settings.',
        false),
      (v_pack.pack_key, 'limitation_of_liability', 'Limitation of Liability', '1.0.0',
        '{{legal_company_name}} liability limited to fees paid in preceding twelve months except where law prohibits. Best-effort availability. Force majeure applies.',
        false),
      (v_pack.pack_key, 'governing_law', 'Governing Law Statement', '1.0.0',
        'Governing law: Norwegian Law. Jurisdiction: Norway.',
        false)
    on conflict (pack_key, document_key, version) do update set
      title = excluded.title,
      body_template = excluded.body_template,
      requires_acceptance = excluded.requires_acceptance;
  end loop;
end; $$;

create or replace function public._bpleg_acceptance_status(p_tenant_id uuid, p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_required jsonb := '[]'::jsonb;
  v_doc record;
  v_accepted boolean;
begin
  for v_doc in
    select d.document_key, d.version, d.title
    from public.business_pack_legal_documents d
    where d.pack_key = p_pack_key and d.requires_acceptance = true
    order by d.document_key
  loop
    select exists(
      select 1 from public.business_pack_legal_acceptances a
      where a.tenant_id = p_tenant_id and a.pack_key = p_pack_key
        and a.document_key = v_doc.document_key and a.document_version = v_doc.version
    ) into v_accepted;
    v_required := v_required || jsonb_build_object(
      'document_key', v_doc.document_key,
      'title', v_doc.title,
      'version', v_doc.version,
      'accepted', v_accepted
    );
  end loop;
  return v_required;
end; $$;

create or replace function public.get_business_pack_legal_center(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_def public.business_pack_legal_definitions;
  v_acceptance jsonb;
  v_all_accepted boolean := true;
  v_doc jsonb;
begin
  perform public._bpleg_require_view();
  v_tenant_id := public._bpleg_require_tenant();
  perform public._bpleg_seed_legal();

  select * into v_def from public.business_pack_legal_definitions where pack_key = p_pack_key;
  if v_def.id is null then
    return jsonb_build_object('found', false, 'pack_key', p_pack_key);
  end if;

  v_acceptance := public._bpleg_acceptance_status(v_tenant_id, p_pack_key);
  if jsonb_array_length(v_acceptance) = 0 then
    v_all_accepted := true;
  else
    for v_doc in select * from jsonb_array_elements(v_acceptance)
    loop
      if (v_doc->>'accepted')::boolean = false then v_all_accepted := false; end if;
    end loop;
  end if;

  perform public._bpleg_log(v_tenant_id, p_pack_key, 'center_view', 'Legal center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._bplegf04_principle(),
    'pack_key', p_pack_key,
    'definition', jsonb_build_object(
      'pack_name', v_def.pack_name,
      'publication_status', v_def.publication_status,
      'pack_terms', v_def.pack_terms,
      'governing_law', v_def.governing_law,
      'jurisdiction', v_def.jurisdiction,
      'company_field_placeholders', v_def.company_field_placeholders,
      'company_config_source', 'company.config.ts'
    ),
    'overview', jsonb_build_object(
      'governing_law', v_def.governing_law,
      'jurisdiction', v_def.jurisdiction,
      'publication_status', v_def.publication_status,
      'all_required_accepted', v_all_accepted,
      'activation_blocked', not v_all_accepted
    ),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'document_key', d.document_key,
        'title', d.title,
        'version', d.version,
        'body_template', d.body_template,
        'effective_date', d.effective_date,
        'published_at', d.published_at,
        'requires_acceptance', d.requires_acceptance,
        'accepted', exists(
          select 1 from public.business_pack_legal_acceptances a
          where a.tenant_id = v_tenant_id and a.pack_key = p_pack_key
            and a.document_key = d.document_key and a.document_version = d.version
        )
      ) order by d.document_key)
      from public.business_pack_legal_documents d where d.pack_key = p_pack_key
    ), '[]'::jsonb),
    'acceptance_required', v_acceptance,
    'company_placeholders', public._bplegf04_company_placeholders(),
    'mandatory_documents', public._bplegf04_mandatory_documents(),
    'governance_note', 'Legal company information inherits from company.config.ts — hardcoded legal entity details are prohibited.',
    'legal_center_route', '/app/marketplace/packs/' || p_pack_key || '/legal'
  );
end; $$;

create or replace function public.get_business_pack_legal_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpleg_require_view();
  perform public._bpleg_seed_legal();

  return jsonb_build_object(
    'has_access', true,
    'is_platform_admin', public.is_platform_admin(),
    'principle', public._bplegf04_principle(),
    'mandatory_documents', public._bplegf04_mandatory_documents(),
    'governance', jsonb_build_object(
      'super_admin', 'Defines legal standards',
      'platform_admin', 'Publishes approved legal documents',
      'customers', 'View accepted agreements',
      'growth_partners', 'View partner-specific agreements only'
    ),
    'forbidden', jsonb_build_array(
      'Publishing packs without approved legal foundations',
      'Hardcoded legal company information outside company.config.ts'
    ),
    'summary', jsonb_build_object(
      'pack_definitions', (select count(*) from public.business_pack_legal_definitions where publication_status = 'published'),
      'legal_documents', (select count(*) from public.business_pack_legal_documents),
      'acceptance_records', (select count(*) from public.business_pack_legal_acceptances),
      'audit_events', (select count(*) from public.business_pack_legal_audit_logs)
    ),
    'definitions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', d.pack_key,
        'pack_name', d.pack_name,
        'publication_status', d.publication_status,
        'governing_law', d.governing_law,
        'document_count', (select count(*) from public.business_pack_legal_documents doc where doc.pack_key = d.pack_key),
        'legal_center_route', '/app/marketplace/packs/' || d.pack_key || '/legal'
      ) order by d.pack_name)
      from public.business_pack_legal_definitions d
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from (select * from public.business_pack_legal_audit_logs order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'success_criteria', jsonb_build_array(
      'Every pack legally complete before Marketplace availability',
      'Transparent consistent enterprise-grade legal standards',
      'Company identity from company.config.ts only'
    )
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.get_business_pack_legal_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpleg_seed_legal();
  return jsonb_build_object(
    'has_access', true,
    'pack_count', (select count(*) from public.business_pack_legal_definitions where publication_status = 'published'),
    'principle', public._bplegf04_principle()
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.perform_business_pack_legal_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_doc record;
  v_version text;
begin
  v_tenant_id := public._bpleg_require_tenant();

  if p_action_type = 'accept_required_documents' then
    perform public._bpleg_require_accept();
    for v_doc in
      select document_key, version from public.business_pack_legal_documents
      where pack_key = p_pack_key and requires_acceptance = true
    loop
      insert into public.business_pack_legal_acceptances (
        tenant_id, pack_key, document_key, document_version, accepted_by, reacceptance
      ) values (
        v_tenant_id, p_pack_key, v_doc.document_key, v_doc.version,
        public._mta_app_user_id(),
        exists(
          select 1 from public.business_pack_legal_acceptances a
          where a.tenant_id = v_tenant_id and a.pack_key = p_pack_key
            and a.document_key = v_doc.document_key
            and a.document_version is distinct from v_doc.version
        )
      ) on conflict (tenant_id, pack_key, document_key, document_version) do nothing;
      perform public._bpleg_log(v_tenant_id, p_pack_key, 'legal_acceptance',
        'Accepted ' || v_doc.document_key || ' v' || v_doc.version, p_payload);
    end loop;
    return jsonb_build_object(
      'action', p_action_type,
      'status', 'accepted',
      'message', 'Required legal agreements accepted. You may proceed with activation.',
      'acceptance_status', public._bpleg_acceptance_status(v_tenant_id, p_pack_key)
    );
  end if;

  if p_action_type = 'accept_document' then
    perform public._bpleg_require_accept();
    v_version := coalesce(p_payload->>'document_version', '1.0.0');
    insert into public.business_pack_legal_acceptances (
      tenant_id, pack_key, document_key, document_version, accepted_by
    ) values (
      v_tenant_id, p_pack_key, p_payload->>'document_key', v_version, public._mta_app_user_id()
    ) on conflict (tenant_id, pack_key, document_key, document_version) do nothing;
    perform public._bpleg_log(v_tenant_id, p_pack_key, 'legal_acceptance',
      'Accepted document ' || (p_payload->>'document_key'), p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'accepted');
  end if;

  if p_action_type = 'check_activation_eligibility' then
    return jsonb_build_object(
      'action', p_action_type,
      'eligible', coalesce((
        select bool_and((elem->>'accepted')::boolean)
        from jsonb_array_elements(public._bpleg_acceptance_status(v_tenant_id, p_pack_key)) elem
      ), true),
      'acceptance_status', public._bpleg_acceptance_status(v_tenant_id, p_pack_key)
    );
  end if;

  if p_action_type = 'publish_legal' then
    if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
    perform public._bpleg_seed_legal();
    update public.business_pack_legal_definitions
    set publication_status = 'published', published_at = now(), updated_at = now()
    where pack_key = p_pack_key;
    perform public._bpleg_log(v_tenant_id, p_pack_key, 'document_published', 'Legal documents published', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'published');
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_business_pack_legal_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'legal-compliance', 'Legal & Compliance',
    'Terms, license agreements, subscription policies, and privacy principles for Aipify Business Packs.', 375
  );
  perform public._ahostkc_seed_article('legal-compliance', 'understanding-terms', 'Understanding Terms & Conditions',
    'Terms & Conditions define scope of service, intended use, and responsibilities for each Business Pack. Company information always reflects company.config.ts.');
  perform public._ahostkc_seed_article('legal-compliance', 'understanding-license-agreements', 'Understanding License Agreements',
    'License Agreements specify capacity metrics, trial limits, upgrade requirements, and termination conditions. You receive a license — not software ownership.');
  perform public._ahostkc_seed_article('legal-compliance', 'subscription-policies', 'Subscription Policies Explained',
    'Subscription Terms cover billing frequency, renewal, upgrades, downgrades, failed payment grace periods, and refund eligibility.');
  perform public._ahostkc_seed_article('legal-compliance', 'privacy-principles', 'Privacy Principles',
    'Privacy Addenda explain what data is processed, why, and customer vs platform responsibilities. Customer owns operational data.');
  perform public._ahostkc_seed_article('legal-compliance', 'cancellation-procedures', 'Cancellation Procedures',
    'Cancellation Policy defines notice methods, data retention, and service termination effects. Settings are preserved — never silently deleted.');
end; $$;

select public._bpleg_seed_legal();
select public.seed_business_pack_legal_knowledge();

grant execute on function public.get_business_pack_legal_center(text) to authenticated;
grant execute on function public.get_business_pack_legal_engine_dashboard() to authenticated;
grant execute on function public.get_business_pack_legal_engine_card() to authenticated;
grant execute on function public.perform_business_pack_legal_action(text, text, jsonb) to authenticated;
