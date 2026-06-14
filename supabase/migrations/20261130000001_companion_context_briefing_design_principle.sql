-- Companion Context Briefing — Design Principle (extends Briefing System Phase 60)
-- Context-specific companion summaries for major Customer App pages. Metadata only — no PII content.

-- ---------------------------------------------------------------------------
-- 1. Helpers (_acb_*)
-- ---------------------------------------------------------------------------
create or replace function public._acb_require_tenant()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'No tenant context';
  end if;
  return v_tenant_id;
end;
$$;

create or replace function public._acb_key_item(
  p_title text,
  p_summary text default null,
  p_severity text default 'info',
  p_action_url text default null,
  p_icon text default 'check'
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'title', p_title,
    'summary', p_summary,
    'severity', coalesce(p_severity, 'info'),
    'action_url', p_action_url,
    'icon', coalesce(p_icon, 'check')
  );
$$;

create or replace function public._acb_context_summary(p_context text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_context text;
  v_summary text;
  v_companion_note text;
  v_key_items jsonb := '[]'::jsonb;
  v_metrics jsonb := '{}'::jsonb;
  v_open_support int := 0;
  v_escalated int := 0;
  v_resolved_today int := 0;
  v_pending_approvals int := 0;
  v_high_risk_approvals int := 0;
  v_briefing_events int := 0;
  v_learning_active int := 0;
  v_learning_pending int := 0;
  v_invoices_due int := 0;
  v_sub_status text;
  v_install_active int := 0;
  v_install_pending int := 0;
  v_profile record;
  v_success_score numeric;
  v_health_band text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object(
      'summary', null,
      'key_items', '[]'::jsonb,
      'metrics', '{}'::jsonb,
      'companion_note', null
    );
  end if;

  v_context := lower(trim(coalesce(p_context, 'home')));

  -- Shared counts (safe when tables exist)
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'support_cases') then
    select count(*) into v_open_support
    from public.support_cases sc
    where sc.tenant_id = v_tenant_id
      and sc.status in ('received', 'triaged', 'draft', 'pending_approval', 'open');

    select count(*) into v_escalated
    from public.support_cases sc
    where sc.tenant_id = v_tenant_id and sc.status = 'escalated';

    select count(*) into v_resolved_today
    from public.support_cases sc
    where sc.tenant_id = v_tenant_id
      and sc.status in ('resolved', 'closed', 'auto_replied')
      and coalesce(sc.resolved_at, sc.updated_at, sc.created_at)::date = current_date;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'action_requests') then
    select count(*) into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_tenant_id and ar.status = 'pending';

    select count(*) into v_high_risk_approvals
    from public.action_requests ar
    where ar.tenant_id = v_tenant_id and ar.status = 'pending' and ar.risk_level >= 3;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'aipify_briefing_events') then
    select count(*) into v_briefing_events
    from public.aipify_briefing_events e
    where e.tenant_id = v_tenant_id
      and e.occurred_at >= now() - interval '24 hours';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'customer_learning_memory') then
    select count(*) into v_learning_active
    from public.customer_learning_memory m
    where m.tenant_id = v_tenant_id and m.status = 'active';

    select count(*) into v_learning_pending
    from public.customer_learning_reviews r
    where r.tenant_id = v_tenant_id
      and r.action_type = 'recorded'
      and r.created_at >= now() - interval '7 days';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'invoices') then
    select count(*) into v_invoices_due
    from public.invoices i
    where i.customer_id = v_tenant_id
      and i.status in ('sent', 'draft')
      and i.due_date between current_date and current_date + interval '14 days';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'subscriptions') then
    select s.status into v_sub_status
    from public.subscriptions s
    where s.customer_id = v_tenant_id
    order by s.created_at desc
    limit 1;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'installations') then
    select
      count(*) filter (where i.status = 'active'),
      count(*) filter (where i.status = 'pending')
    into v_install_active, v_install_pending
    from public.installations i
    join public.customers c on c.company_id = i.company_id
    where c.id = v_tenant_id;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'customer_profiles') then
    select cp.success_score, cp.health_band
    into v_success_score, v_health_band
    from public.customer_profiles cp
    where cp.tenant_id = v_tenant_id;
  end if;

  case
    when v_context = 'home' then
      v_summary := case
        when v_briefing_events > 0 then
          format('Aipify gathered %s operational signals since your last visit.', v_briefing_events)
        else
          'Aipify is ready to guide your day — calm priorities across your workspace.'
      end;
      v_companion_note := 'Your home Companion brief draws from verified module activity only.';
      if v_pending_approvals > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s approval(s) awaiting review', v_pending_approvals),
          'Review when you are ready — nothing executes without your decision.',
          case when v_high_risk_approvals > 0 then 'high' else 'medium' end,
          '/app/approvals',
          'alert'
        );
      end if;

    when v_context in ('customers', 'customer_success') then
      v_summary := case
        when v_health_band in ('at_risk', 'critical') then
          'Aipify noticed your customer journey needs additional attention.'
        when v_success_score is not null and v_success_score < 60 then
          'Aipify noticed opportunities to strengthen customer success this week.'
        else
          'Customer success signals look steady. Aipify is watching journey health for you.'
      end;
      v_companion_note := 'Lifecycle summaries use scores and bands — never private customer conversations.';
      v_metrics := jsonb_build_object(
        'success_score', coalesce(v_success_score, 0),
        'health_band', coalesce(v_health_band, 'unknown')
      );
      if v_health_band in ('at_risk', 'critical', 'support_opportunity') then
        v_key_items := v_key_items || public._acb_key_item(
          'Review customer journey health',
          'Companion guidance is available in lifecycle playbooks.',
          'medium',
          '/app/customer-lifecycle'
        );
      end if;

    when v_context in ('billing', 'license') then
      v_summary := case
        when coalesce(v_sub_status, 'active') in ('active', 'trialing') and v_invoices_due > 0 then
          format('Revenue remains healthy. %s invoice(s) are approaching due dates.', v_invoices_due)
        when coalesce(v_sub_status, 'active') = 'past_due' then
          'Aipify noticed a billing item that may need your attention soon.'
        when coalesce(v_sub_status, 'active') in ('active', 'trialing') then
          'Revenue and license posture look healthy. Aipify is monitoring renewal timing.'
        else
          'Aipify is ready to summarize billing and license posture when data is connected.'
      end;
      v_companion_note := 'Billing briefings use subscription and invoice metadata only — no payment instrument details.';
      v_metrics := jsonb_build_object(
        'invoices_approaching_due', v_invoices_due,
        'subscription_status', coalesce(v_sub_status, 'unknown')
      );
      if v_invoices_due > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s invoice(s) due within 14 days', v_invoices_due),
          null,
          'medium',
          '/app/settings/billing'
        );
      end if;

    when v_context = 'support' then
      v_summary := case
        when v_resolved_today > 0 then
          format('Aipify resolved %s support request(s) today.', v_resolved_today)
        when v_open_support > 0 then
          format('Aipify is tracking %s open support request(s) for your team.', v_open_support)
        else
          'Support queue looks calm. Aipify will surface new cases as they arrive.'
      end;
      v_companion_note := 'Support briefings count cases and statuses — never email or chat content.';
      v_metrics := jsonb_build_object(
        'open_cases', v_open_support,
        'escalated_cases', v_escalated,
        'resolved_today', v_resolved_today
      );
      if v_escalated > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s escalated case(s)', v_escalated),
          'Worth a thoughtful review when you have a moment.',
          'high',
          '/app/support-ai-engine',
          'alert'
        );
      elsif v_open_support > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s open case(s)', v_open_support),
          null,
          'info',
          '/app/support-ai-engine'
        );
      end if;

    when v_context = 'approvals' then
      v_summary := case
        when v_pending_approvals > 0 then
          format('Aipify prepared %s action(s) awaiting your approval.', v_pending_approvals)
        else
          'No pending approvals. Aipify will prepare actions for your review when needed.'
      end;
      v_companion_note := 'Approvals remain human-controlled — Aipify prepares, you decide.';
      v_metrics := jsonb_build_object(
        'pending_approvals', v_pending_approvals,
        'high_risk_pending', v_high_risk_approvals
      );
      if v_high_risk_approvals > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s higher-risk approval(s)', v_high_risk_approvals),
          'Sensitive actions always wait for explicit approval.',
          'high',
          '/app/approvals',
          'alert'
        );
      elsif v_pending_approvals > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s pending approval(s)', v_pending_approvals),
          null,
          'medium',
          '/app/approvals'
        );
      end if;

    when v_context = 'command_center' then
      v_summary := case
        when v_briefing_events > 0 then
          format('Aipify noticed %s signal(s) across your command center in the last day.', v_briefing_events)
        else
          'Command Center is calm. Aipify will highlight what matters as activity returns.'
      end;
      v_companion_note := 'Presence and command briefings prioritize verified events — no noise.';
      v_metrics := jsonb_build_object(
        'recent_signals', v_briefing_events,
        'pending_approvals', v_pending_approvals
      );
      if v_pending_approvals > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s approval(s) in queue', v_pending_approvals),
          null,
          'medium',
          '/app/approvals'
        );
      end if;

    when v_context in ('commerce', 'commerce_intelligence') then
      v_summary := 'Aipify is watching commerce signals — opportunities, margins, and store fit.';
      v_companion_note := 'Commerce intelligence uses product and trend metadata — not customer PII.';
      v_key_items := v_key_items || public._acb_key_item(
        'Review opportunity discovery',
        'Companion guidance is available on the Commerce Intelligence dashboard.',
        'info',
        '/app/commerce-intelligence'
      );

    when v_context = 'commerce_performance' then
      v_summary := 'Aipify is tracking profitability patterns across your commerce portfolio.';
      v_companion_note := 'Performance briefings summarize margin and revenue trends — metadata only.';
      v_key_items := v_key_items || public._acb_key_item(
        'Open performance overview',
        'Profit coaching surfaces when enough commerce data is connected.',
        'info',
        '/app/commerce-performance'
      );

    when v_context = 'product_automation' then
      v_summary := 'Aipify is ready to guide catalog automation — drafts and approvals stay in your control.';
      v_companion_note := 'Product automation briefings describe pipeline status, not raw catalog content.';
      v_key_items := v_key_items || public._acb_key_item(
        'Review automation pipeline',
        null,
        'info',
        '/app/product-automation'
      );

    when v_context = 'dropshipping' then
      v_summary := 'Aipify is monitoring dropshipping operations — delivery risks and supplier awareness.';
      v_companion_note := 'Operations briefings use alert counts and health bands only.';
      v_key_items := v_key_items || public._acb_key_item(
        'Check operational health',
        null,
        'info',
        '/app/dropshipping-operations'
      );

    when v_context = 'learning' then
      v_summary := case
        when v_learning_active > 0 then
          format('Aipify has %s active learning pattern(s) improving suggestions with you.', v_learning_active)
        else
          'Learning is in assisted mode. Aipify will suggest patterns for your review.'
      end;
      v_companion_note := 'Learning memory stores approved metadata only — never raw customer content.';
      v_metrics := jsonb_build_object(
        'active_patterns', v_learning_active,
        'recent_recorded', v_learning_pending
      );
      if v_learning_active > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s active pattern(s)', v_learning_active),
          'You can review or remove any learning at any time.',
          'info',
          '/app/learning/review'
        );
      end if;

    when v_context = 'install' then
      v_summary := case
        when v_install_pending > 0 then
          format('Aipify noticed %s installation(s) still completing setup.', v_install_pending)
        when v_install_active > 0 then
          format('%s active installation(s) connected. Aipify is learning your environment.', v_install_active)
        else
          'Install Aipify where you work — the Companion will guide setup step by step.'
      end;
      v_companion_note := 'Install briefings report connection status only — never installation secrets.';
      v_metrics := jsonb_build_object(
        'active_installations', v_install_active,
        'pending_installations', v_install_pending
      );
      if v_install_pending > 0 then
        v_key_items := v_key_items || public._acb_key_item(
          format('%s pending install(s)', v_install_pending),
          'Complete setup when you are ready.',
          'medium',
          '/app/install'
        );
      end if;

    else
      v_summary := 'Aipify is here as your Companion — calm guidance for this workspace.';
      v_companion_note := 'Context briefings summarize verified activity metadata only.';
  end case;

  return jsonb_build_object(
    'summary', v_summary,
    'key_items', coalesce(v_key_items, '[]'::jsonb),
    'metrics', coalesce(v_metrics, '{}'::jsonb),
    'companion_note', v_companion_note
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Public RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_context_briefing(p_context text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_context text;
  v_settings public.aipify_briefing_settings;
  v_body jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_context := lower(trim(coalesce(p_context, 'home')));
  v_settings := public._bs_ensure_settings(v_tenant_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'has_customer', true,
      'enabled', false,
      'context', v_context
    );
  end if;

  v_body := public._acb_context_summary(v_context);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', true,
    'context', v_context,
    'summary', v_body ->> 'summary',
    'key_items', coalesce(v_body -> 'key_items', '[]'::jsonb),
    'metrics', coalesce(v_body -> 'metrics', '{}'::jsonb),
    'companion_note', v_body ->> 'companion_note',
    'privacy_note', 'Companion briefings summarize verified module activity only — metadata, calm tone, human control.'
  );
end;
$$;

grant execute on function public._acb_require_tenant() to authenticated;
grant execute on function public._acb_context_summary(text) to authenticated;
grant execute on function public.get_companion_context_briefing(text) to authenticated;
