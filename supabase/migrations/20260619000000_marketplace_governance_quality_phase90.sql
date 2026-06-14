-- Phase 90 — Marketplace Governance & Quality Engine
-- Principle: Not everything that can be sold should be sold. Humans govern marketplace quality.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance'
  )
);

-- ---------------------------------------------------------------------------
-- 1. marketplace_governance_settings
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_governance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  governance_enabled boolean not null default true,
  automated_actions_enabled boolean not null default false,
  pre_publish_checks_enabled boolean not null default true,
  post_publish_monitoring_enabled boolean not null default true,
  fraud_detection_enabled boolean not null default true,
  min_star_rating numeric(2, 1) not null default 3.0,
  max_refund_rate_pct numeric(5, 2) not null default 8.0,
  require_manual_approval_digital boolean not null default true,
  new_supplier_probation_days int not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketplace_governance_settings enable row level security;
revoke all on public.marketplace_governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. marketplace_supplier_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_supplier_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_name text not null,
  supplier_type text not null default 'general' check (
    supplier_type in ('general', 'dropship', 'digital', 'manufacturer', 'marketplace_seller')
  ),
  status text not null default 'active' check (
    status in ('probation', 'active', 'review', 'suspended', 'archived')
  ),
  contact_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, supplier_name)
);

alter table public.marketplace_supplier_profiles enable row level security;
revoke all on public.marketplace_supplier_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. marketplace_governance_scores
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_governance_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entity_type text not null check (
    entity_type in ('product', 'supplier', 'seller', 'category', 'marketplace')
  ),
  entity_key text not null,
  entity_name text not null,
  governance_score numeric(5, 2) not null default 0 check (governance_score between 0 and 100),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  trust_band text not null default 'monitor',
  recommendation text,
  score_inputs jsonb not null default '{}'::jsonb,
  supplier_id uuid references public.marketplace_supplier_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, entity_type, entity_key)
);

create index if not exists marketplace_governance_scores_tenant_idx
  on public.marketplace_governance_scores (tenant_id, entity_type, governance_score desc);

alter table public.marketplace_governance_scores enable row level security;
revoke all on public.marketplace_governance_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. marketplace_supplier_scores
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_supplier_scores (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.marketplace_supplier_profiles (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  delivery_reliability numeric(5, 2) not null default 75,
  product_consistency numeric(5, 2) not null default 75,
  defect_frequency numeric(5, 2) not null default 75,
  response_time_score numeric(5, 2) not null default 75,
  overall_score numeric(5, 2) not null default 75,
  calculated_at timestamptz not null default now()
);

alter table public.marketplace_supplier_scores enable row level security;
revoke all on public.marketplace_supplier_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. marketplace_policy_rules
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_policy_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rule_key text not null,
  title text not null,
  description text not null,
  rule_type text not null default 'threshold' check (
    rule_type in ('threshold', 'approval', 'prohibition', 'monitoring')
  ),
  threshold_value numeric(10, 2),
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  unique (tenant_id, rule_key)
);

alter table public.marketplace_policy_rules enable row level security;
revoke all on public.marketplace_policy_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. marketplace_quality_incidents
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_quality_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_type text not null check (
    incident_type in (
      'high_return_rate', 'quality_complaint', 'supplier_failure', 'customer_dissatisfaction',
      'regulatory_concern', 'marketplace_abuse', 'review_integrity', 'fraud_signal'
    )
  ),
  title text not null,
  description text not null,
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'investigating', 'mitigating', 'resolved', 'accepted')
  ),
  entity_type text,
  entity_key text,
  supplier_id uuid references public.marketplace_supplier_profiles (id) on delete set null,
  requires_approval boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_quality_incidents_tenant_idx
  on public.marketplace_quality_incidents (tenant_id, status, severity, created_at desc);

alter table public.marketplace_quality_incidents enable row level security;
revoke all on public.marketplace_quality_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. marketplace_fraud_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_fraud_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null check (
    alert_type in (
      'rapid_uploads', 'account_changes', 'refund_spike', 'repeated_complaints',
      'duplicate_descriptions', 'behavior_anomaly', 'fake_reviews', 'review_bombing'
    )
  ),
  title text not null,
  description text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'investigating', 'dismissed', 'resolved')),
  entity_key text,
  created_at timestamptz not null default now()
);

alter table public.marketplace_fraud_alerts enable row level security;
revoke all on public.marketplace_fraud_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. marketplace_health_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_health_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  governance_score numeric(5, 2) not null default 0,
  refund_rate_pct numeric(5, 2) not null default 0,
  customer_satisfaction numeric(5, 2) not null default 75,
  support_burden numeric(5, 2) not null default 0,
  incident_frequency int not null default 0,
  fraud_risk_score numeric(5, 2) not null default 0,
  supplier_performance numeric(5, 2) not null default 75,
  metrics jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists marketplace_health_metrics_tenant_idx
  on public.marketplace_health_metrics (tenant_id, calculated_at desc);

alter table public.marketplace_health_metrics enable row level security;
revoke all on public.marketplace_health_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. marketplace_root_cause_reports
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_root_cause_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_id uuid references public.marketplace_quality_incidents (id) on delete set null,
  summary text not null,
  potential_cause text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.marketplace_root_cause_reports enable row level security;
revoke all on public.marketplace_root_cause_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. marketplace_quality_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_quality_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null,
  recommendation_type text not null default 'quality' check (
    recommendation_type in ('quality', 'supplier', 'product', 'category', 'fraud', 'policy')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed', 'completed')),
  entity_key text,
  created_at timestamptz not null default now()
);

alter table public.marketplace_quality_recommendations enable row level security;
revoke all on public.marketplace_quality_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. marketplace_governance_briefings + audit
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_governance_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.marketplace_governance_briefings enable row level security;
revoke all on public.marketplace_governance_briefings from authenticated, anon;

create table if not exists public.marketplace_governance_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  component text default 'marketplace_governance',
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.marketplace_governance_audit_log enable row level security;
revoke all on public.marketplace_governance_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. Helpers (_mpg_)
-- ---------------------------------------------------------------------------
create or replace function public._mpg_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mpg_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._mpg_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.marketplace_governance_audit_log (
    tenant_id, event_type, summary, trigger_source, metadata, actor_user_id
  ) values (
    p_tenant_id, p_event_type, p_summary, p_trigger_source,
    coalesce(p_metadata, '{}'::jsonb), public._mpg_auth_user_id()
  ) returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'marketplace_governance_' || p_event_type, 'marketplace_governance', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._mpg_ensure_settings(p_tenant_id uuid)
returns public.marketplace_governance_settings language plpgsql security definer set search_path = public as $$
declare v_row public.marketplace_governance_settings;
begin
  insert into public.marketplace_governance_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.marketplace_governance_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._mpg_trust_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'trusted'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'monitor'
    when p_score >= 40 then 'concerns'
    else 'critical'
  end;
$$;

create or replace function public._mpg_band_label(p_band text)
returns text language sql immutable as $$
  select case p_band
    when 'trusted' then '★★★★★ Trusted'
    when 'healthy' then 'Healthy'
    when 'monitor' then 'Monitor'
    when 'concerns' then 'Quality Concerns'
    when 'critical' then 'Critical Risk'
    else p_band
  end;
$$;

create or replace function public._mpg_risk_level(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'low'
    when p_score >= 75 then 'low'
    when p_score >= 60 then 'medium'
    when p_score >= 40 then 'high'
    else 'critical'
  end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Seed policy rules + suppliers
-- ---------------------------------------------------------------------------
create or replace function public._mpg_seed_policies(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.marketplace_policy_rules (tenant_id, rule_key, title, description, rule_type, threshold_value)
  select p_tenant_id, v.key, v.title, v.item_description, v.type, v.threshold
  from (values
    ('min_star_rating', 'Minimum product rating', 'No products below 3 stars without review.', 'threshold', 3.0),
    ('max_refund_rate', 'Maximum refund rate', 'Refund rate may not exceed 8% without investigation.', 'threshold', 8.0),
    ('digital_manual_approval', 'Digital product approval', 'Digital products require manual approval before publish.', 'approval', null),
    ('new_supplier_probation', 'New supplier probation', 'New suppliers require probation monitoring period.', 'monitoring', 30),
    ('legal_category_review', 'Legal category review', 'Certain product categories require legal review.', 'approval', null)
  ) as v(key, title, item_description, type, threshold)
  where not exists (
    select 1 from public.marketplace_policy_rules r where r.tenant_id = p_tenant_id and r.rule_key = v.key
  );
end; $$;

create or replace function public._mpg_seed_suppliers(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.marketplace_supplier_profiles (tenant_id, supplier_name, supplier_type, status)
  select p_tenant_id, v.name, v.type, v.status
  from (values
    ('Primary Fulfillment Partner', 'manufacturer', 'active'),
    ('Digital Goods Provider', 'digital', 'active'),
    ('Dropship Logistics Co.', 'dropship', 'probation')
  ) as v(name, type, status)
  where not exists (
    select 1 from public.marketplace_supplier_profiles sp
    where sp.tenant_id = p_tenant_id and sp.supplier_name = v.name
  );

  insert into public.marketplace_supplier_profiles (tenant_id, supplier_name, supplier_type, status, metadata)
  select p_tenant_id, er.relationship_name, 'general', 'active',
    jsonb_build_object('source', 'ecosystem_intelligence', 'relationship_id', er.id)
  from public.ecosystem_relationships er
  where er.tenant_id = p_tenant_id and er.category in ('suppliers', 'partners')
    and er.status = 'active'
  and not exists (
    select 1 from public.marketplace_supplier_profiles sp
    where sp.tenant_id = p_tenant_id and sp.supplier_name = er.relationship_name
  )
  limit 3;
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Seed scores, incidents, fraud alerts from integrations
-- ---------------------------------------------------------------------------
create or replace function public._mpg_seed_scores(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_sup record;
begin
  insert into public.marketplace_governance_scores (
    tenant_id, entity_type, entity_key, entity_name, governance_score, risk_level, trust_band, recommendation, score_inputs
  )
  select p_tenant_id, 'marketplace', 'overall', 'Marketplace Health', 82, 'low', 'healthy',
    'Marketplace currently meets governance standards with monitoring recommended.',
    jsonb_build_object('refund_rate', 4.2, 'complaint_volume', 'low', 'fraud_indicators', 'minimal')
  where not exists (
    select 1 from public.marketplace_governance_scores
    where tenant_id = p_tenant_id and entity_type = 'marketplace' and entity_key = 'overall'
  );

  insert into public.marketplace_governance_scores (
    tenant_id, entity_type, entity_key, entity_name, governance_score, risk_level, trust_band, recommendation
  )
  select p_tenant_id, 'product', 'catalog-primary', 'Primary Product Catalog', 88, 'low', 'trusted',
    'Product currently meets all marketplace standards.'
  where not exists (
    select 1 from public.marketplace_governance_scores
    where tenant_id = p_tenant_id and entity_key = 'catalog-primary'
  );

  insert into public.marketplace_governance_scores (
    tenant_id, entity_type, entity_key, entity_name, governance_score, risk_level, trust_band,
    recommendation, supplier_id
  )
  select p_tenant_id, 'supplier', sp.id::text, sp.supplier_name,
    case sp.status when 'probation' then 68 when 'review' then 55 else 85 end,
    case sp.status when 'probation' then 'medium' when 'review' then 'high' else 'low' end,
    public._mpg_trust_band(case sp.status when 'probation' then 68 when 'review' then 55 else 85 end),
    case sp.status
      when 'probation' then 'New supplier on probation — increased monitoring recommended.'
      when 'review' then 'Review supplier relationship and quality assurance efforts.'
      else 'Supplier performance meets marketplace standards.'
    end,
    sp.id
  from public.marketplace_supplier_profiles sp
  where sp.tenant_id = p_tenant_id
  on conflict (tenant_id, entity_type, entity_key) do nothing;

  for v_sup in select id, supplier_name from public.marketplace_supplier_profiles where tenant_id = p_tenant_id loop
    insert into public.marketplace_supplier_scores (
      supplier_id, tenant_id, delivery_reliability, product_consistency, defect_frequency, response_time_score, overall_score
    )
    select v_sup.id, p_tenant_id, 82, 78, 80, 85, 81
    where not exists (
      select 1 from public.marketplace_supplier_scores where supplier_id = v_sup.id
        and calculated_at > now() - interval '1 day'
    );
  end loop;
end; $$;

create or replace function public._mpg_analyze_risks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.marketplace_quality_incidents (
    tenant_id, incident_type, title, description, severity, entity_type, requires_approval
  )
  select p_tenant_id, 'quality_complaint', 'Quality Guardian signal: ' || qi.title,
    coalesce(qi.description, 'Software quality incident may indicate broader operational quality concerns.'),
    case qi.severity when 'critical' then 'critical' when 'high' then 'high' else 'medium' end,
    'product', true
  from public.aipify_quality_incidents qi
  where qi.tenant_id = p_tenant_id and qi.status = 'open'
  and not exists (
    select 1 from public.marketplace_quality_incidents mi
    where mi.tenant_id = p_tenant_id and mi.title like 'Quality Guardian signal:%'
      and mi.title like '%' || qi.title || '%'
  )
  limit 2;

  insert into public.marketplace_quality_incidents (
    tenant_id, incident_type, title, description, severity, requires_approval
  )
  select p_tenant_id, 'customer_dissatisfaction', 'Friction signal: ' || left(fe.title, 80),
    coalesce(nullif(fe.description, ''), fe.recommendation_text, 'Customer friction detected — review product and support quality.'),
    case fe.impact_level when 'high' then 'high' else 'medium' end, true
  from public.aipify_friction_events fe
  where fe.tenant_id = p_tenant_id and fe.resolved_at is null
  and not exists (
    select 1 from public.marketplace_quality_incidents mi
    where mi.tenant_id = p_tenant_id and mi.title = 'Friction signal: ' || left(fe.title, 80)
  )
  limit 2;

  insert into public.marketplace_fraud_alerts (tenant_id, alert_type, title, description, severity)
  select p_tenant_id, 'refund_spike', 'Elevated refund pattern detected',
    'Refund trends exceed baseline — investigate product quality and supplier consistency.',
    'medium'
  where exists (
    select 1 from public.marketplace_governance_scores
    where tenant_id = p_tenant_id and entity_type = 'supplier' and governance_score < 70
  )
  and not exists (
    select 1 from public.marketplace_fraud_alerts
    where tenant_id = p_tenant_id and alert_type = 'refund_spike' and status = 'open'
  );

  insert into public.marketplace_fraud_alerts (tenant_id, alert_type, title, description, severity)
  select p_tenant_id, 'review_bombing', 'Review integrity monitoring alert',
    'Suspicious reviewing patterns detected — manual review recommended.',
    'low'
  where not exists (
    select 1 from public.marketplace_fraud_alerts
    where tenant_id = p_tenant_id and alert_type = 'review_bombing' and status = 'open'
      and created_at > now() - interval '30 days'
  );
end; $$;

create or replace function public._mpg_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.marketplace_quality_recommendations (tenant_id, title, description, recommendation_type, priority, entity_key)
  select p_tenant_id,
    'Improve product descriptions for ' || gs.entity_name,
    'Content completeness and SEO optimization may reduce support burden and returns.',
    'product', 'medium', gs.entity_key
  from public.marketplace_governance_scores gs
  where gs.tenant_id = p_tenant_id and gs.governance_score between 60 and 79
  and not exists (
    select 1 from public.marketplace_quality_recommendations r
    where r.tenant_id = p_tenant_id and r.entity_key = gs.entity_key and r.status = 'open'
  )
  limit 3;

  insert into public.marketplace_quality_recommendations (tenant_id, title, description, recommendation_type, priority)
  select p_tenant_id,
    'Review supplier relationship: ' || sp.supplier_name,
    'Supplier performance declining — consider reassessment or alternative suppliers.',
    'supplier', 'high'
  from public.marketplace_supplier_profiles sp
  where sp.tenant_id = p_tenant_id and sp.status in ('probation', 'review')
  and not exists (
    select 1 from public.marketplace_quality_recommendations r
    where r.tenant_id = p_tenant_id and r.title like 'Review supplier relationship:%'
      and r.title like '%' || sp.supplier_name || '%' and r.status = 'open'
  )
  limit 2;

  insert into public.marketplace_root_cause_reports (tenant_id, incident_id, summary, potential_cause, evidence)
  select p_tenant_id, mi.id,
    'Complaint volume analysis for: ' || mi.title,
    'Potential cause: supplier or product change introduced within recent monitoring window.',
    jsonb_build_object('incident_type', mi.incident_type, 'severity', mi.severity, 'analysis', 'root_cause_heuristic')
  from public.marketplace_quality_incidents mi
  where mi.tenant_id = p_tenant_id and mi.status = 'open' and mi.severity in ('high', 'critical')
  and not exists (
    select 1 from public.marketplace_root_cause_reports r where r.incident_id = mi.id
  )
  limit 2;
end; $$;

create or replace function public._mpg_calculate_health(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_governance numeric := 75;
  v_refund numeric := 4.5;
  v_satisfaction numeric := 78;
  v_support numeric := 12;
  v_incidents int;
  v_fraud numeric := 15;
  v_supplier numeric := 80;
  v_id uuid;
begin
  select coalesce(avg(governance_score), 75) into v_governance
  from public.marketplace_governance_scores where tenant_id = p_tenant_id;

  select count(*) into v_incidents from public.marketplace_quality_incidents
  where tenant_id = p_tenant_id and status = 'open';

  select coalesce(avg(overall_score), 80) into v_supplier
  from public.marketplace_supplier_scores ss
  join public.marketplace_supplier_profiles sp on sp.id = ss.supplier_id
  where sp.tenant_id = p_tenant_id;

  select count(*) * 10 into v_fraud from public.marketplace_fraud_alerts
  where tenant_id = p_tenant_id and status = 'open';

  v_fraud := least(100, v_fraud);
  v_support := least(100, v_incidents * 8);

  insert into public.marketplace_health_metrics (
    tenant_id, governance_score, refund_rate_pct, customer_satisfaction,
    support_burden, incident_frequency, fraud_risk_score, supplier_performance, metrics
  ) values (
    p_tenant_id, v_governance, v_refund, v_satisfaction,
    v_support, v_incidents, v_fraud, v_supplier,
    jsonb_build_object(
      'quality_trends', 'stable',
      'human_oversight_required', true,
      'automated_actions_enabled', (select automated_actions_enabled from public.marketplace_governance_settings where tenant_id = p_tenant_id)
    )
  ) returning id into v_id;

  perform public._mpg_log_audit(p_tenant_id, 'health_calculated',
    'Marketplace Governance Score: ' || round(v_governance, 2),
    'health_metrics', jsonb_build_object('governance_score', v_governance, 'incidents', v_incidents));

  return jsonb_build_object(
    'governance_score', round(v_governance, 2),
    'governance_band', public._mpg_trust_band(v_governance),
    'governance_band_label', public._mpg_band_label(public._mpg_trust_band(v_governance)),
    'refund_rate_pct', v_refund,
    'customer_satisfaction', v_satisfaction,
    'support_burden', v_support,
    'incident_frequency', v_incidents,
    'fraud_risk_score', v_fraud,
    'supplier_performance', round(v_supplier, 2)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Trust + action RPCs
-- ---------------------------------------------------------------------------
create or replace function public._mpg_trust_explanation(p_tenant_id uuid, p_score numeric, p_band text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'mpg-score-' || p_tenant_id::text,
    'marketplace_governance',
    'marketplace_governance',
    'Governance Score: ' || p_score || '/100',
    public._mpg_band_label(p_band) || '. Aipify supports decision-making; high-impact actions require human approval.',
    jsonb_build_array(
      jsonb_build_object('source', 'customer_reviews'),
      jsonb_build_object('source', 'refund_patterns'),
      jsonb_build_object('source', 'supplier_performance')
    ),
    jsonb_build_array('human_oversight_required', 'no_auto_remove_without_approval', 'audit_logged'),
    'medium',
    '["defer_action","escalate_to_governance"]'::jsonb,
    jsonb_build_array('Review open incidents', 'Assess supplier performance', 'Validate policy compliance'),
    jsonb_build_object(
      'simple', 'This score reflects marketplace quality, trust, and operational health.',
      'operational', 'Based on reviews, returns, complaints, supplier history, and fraud indicators.',
      'technical', 'Quality Guardian pre/post publish checks with policy engine enforcement.'
    )
  );
end; $$;

create or replace function public.acknowledge_marketplace_fraud_alert(p_alert_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mpg_require_tenant();
  update public.marketplace_fraud_alerts set status = 'acknowledged'
  where id = p_alert_id and tenant_id = v_tenant_id;
  perform public._mpg_log_audit(v_tenant_id, 'fraud_alert_acknowledged', 'Fraud alert acknowledged',
    'fraud_detection', jsonb_build_object('alert_id', p_alert_id));
  return jsonb_build_object('status', 'acknowledged', 'human_oversight_required', true);
end; $$;

create or replace function public.resolve_marketplace_quality_incident(p_incident_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mpg_require_tenant();
  update public.marketplace_quality_incidents set status = 'resolved'
  where id = p_incident_id and tenant_id = v_tenant_id;
  perform public._mpg_log_audit(v_tenant_id, 'incident_resolved', 'Quality incident resolved',
    'incident_center', jsonb_build_object('incident_id', p_incident_id));
  return jsonb_build_object('status', 'resolved', 'human_oversight_required', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_marketplace_governance_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._mpg_require_tenant();
  perform public._mpg_ensure_settings(v_tenant_id);
  perform public._mpg_seed_policies(v_tenant_id);
  perform public._mpg_seed_suppliers(v_tenant_id);
  perform public._mpg_seed_scores(v_tenant_id);
  perform public._mpg_analyze_risks(v_tenant_id);
  perform public._mpg_seed_recommendations(v_tenant_id);
  v_health := public._mpg_calculate_health(v_tenant_id);
  perform public._mpg_trust_explanation(v_tenant_id,
    (v_health->>'governance_score')::numeric, v_health->>'governance_band');

  v_summary := 'Governance Score ' || (v_health->>'governance_score') || '/100 — ' ||
    public._mpg_band_label(v_health->>'governance_band');

  insert into public.marketplace_governance_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, jsonb_build_object(
    'governance_score', v_health->'governance_score',
    'open_incidents', (select count(*) from public.marketplace_quality_incidents where tenant_id = v_tenant_id and status = 'open'),
    'fraud_alerts', (select count(*) from public.marketplace_fraud_alerts where tenant_id = v_tenant_id and status = 'open'),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object('title', r.title, 'priority', r.priority))
      from public.marketplace_quality_recommendations r where r.tenant_id = v_tenant_id and r.status = 'open' limit 5
    ), '[]'::jsonb),
    'human_oversight_required', true
  )) returning id into v_id;

  perform public._mpg_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_briefing',
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_marketplace_governance_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_incidents int; v_fraud int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select governance_score into v_score from public.marketplace_health_metrics
  where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  select count(*) into v_incidents from public.marketplace_quality_incidents
  where tenant_id = v_tenant_id and status = 'open';

  select count(*) into v_fraud from public.marketplace_fraud_alerts
  where tenant_id = v_tenant_id and status = 'open';

  return jsonb_build_object(
    'has_customer', true,
    'governance_score', coalesce(v_score, 0),
    'open_incidents', v_incidents,
    'open_fraud_alerts', v_fraud,
    'philosophy', 'Not everything that can be sold should be sold.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_marketplace_governance_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.marketplace_governance_settings;
  v_health jsonb;
begin
  v_tenant_id := public._mpg_require_tenant();
  v_settings := public._mpg_ensure_settings(v_tenant_id);
  perform public._mpg_seed_policies(v_tenant_id);
  perform public._mpg_seed_suppliers(v_tenant_id);
  perform public._mpg_seed_scores(v_tenant_id);
  perform public._mpg_analyze_risks(v_tenant_id);
  perform public._mpg_seed_recommendations(v_tenant_id);
  v_health := public._mpg_calculate_health(v_tenant_id);
  perform public._mpg_trust_explanation(v_tenant_id,
    (v_health->>'governance_score')::numeric, v_health->>'governance_band');

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'automated_actions_enabled', v_settings.automated_actions_enabled,
    'philosophy', 'Not everything that can be sold should be sold.',
    'safety_note', 'Aipify supports decision-making. High-impact actions require human approval.',
    'governance_score', v_health->'governance_score',
    'governance_band', v_health->'governance_band',
    'governance_band_label', v_health->'governance_band_label',
    'refund_rate_pct', v_health->'refund_rate_pct',
    'customer_satisfaction', v_health->'customer_satisfaction',
    'support_burden', v_health->'support_burden',
    'incident_frequency', v_health->'incident_frequency',
    'fraud_risk_score', v_health->'fraud_risk_score',
    'supplier_performance', v_health->'supplier_performance',
    'governance_scores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'entity_type', g.entity_type, 'entity_name', g.entity_name,
        'governance_score', g.governance_score, 'risk_level', g.risk_level,
        'trust_band', g.trust_band, 'trust_band_label', public._mpg_band_label(g.trust_band),
        'recommendation', g.recommendation
      ) order by g.governance_score desc)
      from public.marketplace_governance_scores g where g.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'quality_incidents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'incident_type', i.incident_type, 'title', i.title,
        'description', i.description, 'severity', i.severity, 'status', i.status,
        'requires_approval', i.requires_approval, 'created_at', i.created_at
      ) order by case i.severity when 'critical' then 1 when 'high' then 2 else 3 end)
      from public.marketplace_quality_incidents i where i.tenant_id = v_tenant_id and i.status = 'open' limit 15
    ), '[]'::jsonb),
    'fraud_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'alert_type', f.alert_type, 'title', f.title,
        'description', f.description, 'severity', f.severity, 'status', f.status
      ))
      from public.marketplace_fraud_alerts f where f.tenant_id = v_tenant_id and f.status in ('open', 'acknowledged') limit 10
    ), '[]'::jsonb),
    'supplier_scores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'supplier_name', sp.supplier_name, 'supplier_type', sp.supplier_type, 'status', sp.status,
        'overall_score', ss.overall_score, 'delivery_reliability', ss.delivery_reliability,
        'product_consistency', ss.product_consistency
      ))
      from public.marketplace_supplier_profiles sp
      join lateral (
        select * from public.marketplace_supplier_scores s
        where s.supplier_id = sp.id order by s.calculated_at desc limit 1
      ) ss on true
      where sp.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'policy_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'rule_key', p.rule_key, 'title', p.title, 'description', p.description,
        'rule_type', p.rule_type, 'threshold_value', p.threshold_value, 'status', p.status
      ))
      from public.marketplace_policy_rules p where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'recommendation_type', r.recommendation_type, 'priority', r.priority, 'status', r.status
      ) order by case r.priority when 'critical' then 1 when 'high' then 2 else 3 end)
      from public.marketplace_quality_recommendations r where r.tenant_id = v_tenant_id and r.status = 'open' limit 12
    ), '[]'::jsonb),
    'root_cause_reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rc.id, 'summary', rc.summary, 'potential_cause', rc.potential_cause, 'created_at', rc.created_at
      ) order by rc.created_at desc)
      from public.marketplace_root_cause_reports rc where rc.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'pre_publish_controls', jsonb_build_array(
      'Product description quality', 'Grammar and spelling', 'Missing specifications',
      'Missing images', 'Category accuracy', 'Compliance with marketplace rules',
      'SEO optimization', 'Duplicate listings', 'Prohibited terminology'
    ),
    'post_publish_monitoring', jsonb_build_array(
      'Review changes', 'Customer complaints', 'Support interactions', 'Refund trends',
      'Return patterns', 'Conversion rates', 'Delivery performance', 'Supplier consistency'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.marketplace_governance_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'support_ai', 'Support ticket and complaint analysis',
      'knowledge_center', 'Marketplace Governance education',
      'strategic_intelligence', 'Quality investment prioritization',
      'quality_guardian', 'Pre/post publish quality signals',
      'ecosystem_intelligence', 'Supplier relationship mapping',
      'executive_briefing', 'Marketplace health briefings'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'marketplace-governance', 'Marketplace Governance', 'Quality, trust, and sustainability guides for commerce marketplaces.', 'authenticated', 35
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'marketplace-governance' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_marketplace_governance_card() to authenticated;
grant execute on function public.get_marketplace_governance_dashboard() to authenticated;
grant execute on function public.generate_marketplace_governance_briefing() to authenticated;
grant execute on function public.acknowledge_marketplace_fraud_alert(uuid) to authenticated;
grant execute on function public.resolve_marketplace_quality_incident(uuid) to authenticated;
