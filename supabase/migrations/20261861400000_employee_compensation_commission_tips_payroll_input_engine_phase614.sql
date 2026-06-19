-- Phase 614 — Employee Compensation, Commission, Tips & Payroll Input Engine
-- Feature owner: CUSTOMER APP (/app/compensation)
-- Helpers: _cmp614_*
-- NOT a payroll system — prepares payroll INPUT only
-- Integrates Phase 588/609/610/611/612/606/607 — does not duplicate

-- ---------------------------------------------------------------------------
-- Section registry (96 sections)
-- ---------------------------------------------------------------------------
create table if not exists public.cmp614_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 96),
  domain_key text not null,
  section_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('compensation_profiles', 1, 'compensation_profiles', 'Employee compensation profiles', 'Employee compensation profiles')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('compensation_models', 2, 'compensation_models', 'Compensation models (salary, hourly, commission, hybrid)', 'Compensation models (salary, hourly, commission, hybrid)')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('effective_dated_rules', 3, 'effective_dated_rules', 'Effective-dated compensation rules', 'Effective-dated compensation rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('rule_hierarchy', 4, 'rule_hierarchy', 'Rule hierarchy global→dept→role→location→service→employee', 'Rule hierarchy global→dept→role→location→service→employee')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_plans', 5, 'commission_plans', 'Commission plans catalog', 'Commission plans catalog')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_types', 6, 'commission_types', 'Commission type definitions', 'Commission type definitions')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_basis', 7, 'commission_basis', 'Commission basis (revenue, margin, units)', 'Commission basis (revenue, margin, units)')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_eligibility', 8, 'commission_eligibility', 'Commission eligibility rules', 'Commission eligibility rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('growth_partner_separation', 9, 'growth_partner_separation', 'Growth Partner separation', 'Growth Partner separation — never mix with employee payroll')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_commission', 10, 'service_commission', 'Service commission rules', 'Service commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('product_commission', 11, 'product_commission', 'Product commission rules', 'Product commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('membership_commission', 12, 'membership_commission', 'Membership commission rules', 'Membership commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('package_commission', 13, 'package_commission', 'Package commission rules', 'Package commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('rebooking_commission', 14, 'rebooking_commission', 'Rebooking commission rules', 'Rebooking commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('new_customer_commission', 15, 'new_customer_commission', 'New customer commission rules', 'New customer commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('multi_employee_commission', 16, 'multi_employee_commission', 'Multi-employee commission splits', 'Multi-employee commission splits')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('team_commission', 17, 'team_commission', 'Team commission pools', 'Team commission pools')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('tiered_commission', 18, 'tiered_commission', 'Tiered commission schedules', 'Tiered commission schedules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_caps', 19, 'commission_caps', 'Commission caps', 'Commission caps')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_floors', 20, 'commission_floors', 'Commission floors', 'Commission floors')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('discount_impact_rules', 21, 'discount_impact_rules', 'Discount impact on commission', 'Discount impact on commission')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('refund_impact_rules', 22, 'refund_impact_rules', 'Refund impact on commission', 'Refund impact on commission')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('partial_refund_rules', 23, 'partial_refund_rules', 'Partial refund commission rules', 'Partial refund commission rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('cancellation_impact_rules', 24, 'cancellation_impact_rules', 'Cancellation impact on commission', 'Cancellation impact on commission')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('chargeback_impact_rules', 25, 'chargeback_impact_rules', 'Chargeback impact on commission', 'Chargeback impact on commission')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_ledger', 26, 'commission_ledger', 'Immutable commission ledger entries', 'Immutable commission ledger entries')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_status_catalog', 27, 'commission_status_catalog', 'Commission status catalog', 'Commission status catalog — icon + text always')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('pos612_tip_collection', 28, 'pos612_tip_collection', 'Phase 612 tip collection link', 'Phase 612 tip collection link — allocation only here')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('tip_pools', 29, 'tip_pools', 'Tip pools for payroll input', 'Tip pools for payroll input')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('tip_distribution', 30, 'tip_distribution', 'Tip distribution methods', 'Tip distribution methods')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('tip_refunds', 31, 'tip_refunds', 'Tip refund handling', 'Tip refund handling')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('cash_tips', 32, 'cash_tips', 'Cash tip declarations', 'Cash tip declarations')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('tip_privacy', 33, 'tip_privacy', 'Tip privacy', 'Tip privacy — aggregated analytics only')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('bonus_rules', 34, 'bonus_rules', 'Bonus engine rules', 'Bonus engine rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('manual_bonuses', 35, 'manual_bonuses', 'Manual bonus entries', 'Manual bonus entries')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('governed_deductions', 36, 'governed_deductions', 'Governed deduction rules', 'Governed deduction rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('expense_input_links', 37, 'expense_input_links', 'Expense input connection', 'Expense input connection — consume Phase expense engine')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('time609_connection', 38, 'time609_connection', 'Phase 609 approved hours/overtime/TOIL/on-call only', 'Phase 609 approved hours/overtime/TOIL/on-call only')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('payroll_periods', 39, 'payroll_periods', 'Payroll periods', 'Payroll periods')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('payroll_input_records', 40, 'payroll_input_records', 'Payroll input records', 'Payroll input records — not payroll processing')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('payroll_categories', 41, 'payroll_categories', 'Payroll input categories', 'Payroll input categories')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('readiness_validation', 42, 'readiness_validation', 'Payroll readiness validation checks', 'Payroll readiness validation checks')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('payroll_exceptions', 43, 'payroll_exceptions', 'Payroll exception queue', 'Payroll exception queue')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('approval_workflow', 44, 'approval_workflow', 'Compensation approval workflow', 'Compensation approval workflow')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('approval_segmentation', 45, 'approval_segmentation', 'Approval segmentation by team or role', 'Approval segmentation by team or role')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('segregation_of_duties', 46, 'segregation_of_duties', 'Segregation of duties rules', 'Segregation of duties rules')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('employee_preview', 47, 'employee_preview', 'Employee compensation preview', 'Employee compensation preview')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('dispute_process', 48, 'dispute_process', 'Non-punitive dispute process', 'Non-punitive dispute process')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('corrections', 49, 'corrections', 'Compensation corrections', 'Compensation corrections')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('retroactive_adjustments', 50, 'retroactive_adjustments', 'Retroactive adjustments', 'Retroactive adjustments')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('period_locking', 51, 'period_locking', 'Payroll period locking', 'Payroll period locking')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('period_reopening', 52, 'period_reopening', 'Governed period reopening', 'Governed period reopening')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('export_center', 53, 'export_center', 'Payroll export center metadata', 'Payroll export center metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('provider_mapping', 54, 'provider_mapping', 'External payroll provider mapping', 'External payroll provider mapping')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('export_versioning', 55, 'export_versioning', 'Export versioning', 'Export versioning')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('reconciliation', 56, 'reconciliation', 'Payroll input reconciliation', 'Payroll input reconciliation')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('fiken_export_prep', 57, 'fiken_export_prep', 'Fiken export signals prep', 'Fiken export signals prep')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('cost_allocation', 58, 'cost_allocation', 'Cost allocation metadata', 'Cost allocation metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('labor_cost_signals_615', 59, 'labor_cost_signals_615', 'Phase 615 labor cost signals prep', 'Phase 615 labor cost signals prep — no profitability calc')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('contractor_input', 60, 'contractor_input', 'Contractor compensation input', 'Contractor compensation input — separate from employees')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('vacation606_integration', 61, 'vacation606_integration', 'Phase 606 vacation continuity integration', 'Phase 606 vacation continuity integration')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('continuity607_integration', 62, 'continuity607_integration', 'Phase 607 crisis continuity integration', 'Phase 607 crisis continuity integration')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase588_revenue_connection', 63, 'phase588_revenue_connection', 'Phase 588 verified revenue connection', 'Phase 588 verified revenue connection')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase610_booking_connection', 64, 'phase610_booking_connection', 'Phase 610 booking revenue connection', 'Phase 610 booking revenue connection')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase611_crm_connection', 65, 'phase611_crm_connection', 'Phase 611 CRM/membership connection', 'Phase 611 CRM/membership connection')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('companion_advisor', 66, 'companion_advisor', 'Companion Compensation Advisor metadata', 'Companion Compensation Advisor metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('employee_dashboard', 67, 'employee_dashboard', 'Employee compensation dashboard', 'Employee compensation dashboard')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('manager_dashboard', 68, 'manager_dashboard', 'Manager compensation dashboard', 'Manager compensation dashboard')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('executive_dashboard', 69, 'executive_dashboard', 'Executive compensation dashboard', 'Executive compensation dashboard')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('since_last_login', 70, 'since_last_login', 'Since Last Login integration', 'Since Last Login integration')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('mobile_summary', 71, 'mobile_summary', 'Mobile compensation summary', 'Mobile compensation summary')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('notifications', 72, 'notifications', 'Compensation notifications', 'Compensation notifications')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('access_control', 73, 'access_control', 'Access control', 'Access control — APP roles')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('security_privacy', 74, 'security_privacy', 'Security and privacy governance', 'Security and privacy governance')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('retention_policies', 75, 'retention_policies', 'Retention policies', 'Retention policies')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('compensation_policies', 76, 'compensation_policies', 'Compensation policy center', 'Compensation policy center')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('policy_acknowledgements', 77, 'policy_acknowledgements', 'Policy acknowledgement tracking', 'Policy acknowledgement tracking')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('legal_governance', 78, 'legal_governance', 'Legal governance and warnings', 'Legal governance and warnings')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('analytics', 79, 'analytics', 'Compensation analytics', 'Compensation analytics — aggregate only')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('fairness_review', 80, 'fairness_review', 'Fairness review', 'Fairness review — not surveillance')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('reports_catalog', 81, 'reports_catalog', 'Compensation reports catalog', 'Compensation reports catalog')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_plan_center', 82, 'commission_plan_center', 'Commission Plan Center route metadata', 'Commission Plan Center route metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('payroll_period_center', 83, 'payroll_period_center', 'Payroll Period Center route metadata', 'Payroll Period Center route metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('exception_center', 84, 'exception_center', 'Exception Center route metadata', 'Exception Center route metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('policy_center', 85, 'policy_center', 'Compensation Policy Center route metadata', 'Compensation Policy Center route metadata')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('my_compensation_view', 86, 'my_compensation_view', 'Employee self-service my compensation view', 'Employee self-service my compensation view')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('payroll_input_queue', 87, 'payroll_input_queue', 'Payroll input readiness queue', 'Payroll input readiness queue')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('adjustment_ledger', 88, 'adjustment_ledger', 'Adjustment ledger entries', 'Adjustment ledger entries')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('bonus_accruals', 89, 'bonus_accruals', 'Bonus accrual tracking', 'Bonus accrual tracking')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('tip_allocation_runs', 90, 'tip_allocation_runs', 'Tip allocation run records', 'Tip allocation run records')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('commission_events', 91, 'commission_events', 'Commission-eligible event prep from checkout', 'Commission-eligible event prep from checkout')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('revenue_verification_signals', 92, 'revenue_verification_signals', 'Verified revenue signals from Phase 612', 'Verified revenue signals from Phase 612')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('rental616_boundary', 93, 'rental616_boundary', 'Phase 616 rental model boundary metadata only', 'Phase 616 rental model boundary metadata only')
on conflict (section_key) do nothing;

insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('integration_hub', 94, 'integration_hub', 'Cross-phase integration hub references', 'Cross-phase integration hub references')
on conflict (section_key) do nothing;

create table if not exists public.cmp614_commission_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  status_group text not null default 'workflow' check (
    status_group in ('workflow', 'commission', 'tip', 'bonus', 'payroll', 'approval', 'export')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.cmp614_commission_status_defs (status_key, status_title, icon_key, status_group, summary) values
  ('recorded', 'Recorded Work', 'edit', 'workflow', 'Work recorded — not yet approved.'),
  ('approved', 'Approved', 'check-circle', 'approval', 'Manager-approved work or revenue.'),
  ('verified_revenue', 'Verified Revenue', 'shield-check', 'commission', 'Payment verified — commission-eligible.'),
  ('commission_pending', 'Commission Pending', 'clock', 'commission', 'Commission calculated — awaiting approval.'),
  ('commission_approved', 'Commission Approved', 'badge-check', 'commission', 'Commission approved for payroll input.'),
  ('payroll_ready', 'Payroll Ready', 'briefcase', 'payroll', 'Validated for payroll export input.'),
  ('exported', 'Exported', 'upload', 'export', 'Payroll input exported to external provider.'),
  ('externally_processed', 'Externally Processed', 'external-link', 'export', 'Processed by external payroll — Aipify does not run payroll.'),
  ('disputed', 'Disputed', 'message-circle', 'workflow', 'Employee dispute — non-punitive review.'),
  ('locked', 'Locked', 'lock', 'payroll', 'Period locked — governed reopen only.')
on conflict (status_key) do nothing;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_cmp614_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  compensation_center_enabled boolean not null default true,
  commission_plans_enabled boolean not null default true,
  tip_allocation_enabled boolean not null default true,
  bonus_engine_enabled boolean not null default true,
  payroll_input_enabled boolean not null default true,
  growth_partner_separation_enforced boolean not null default true,
  segregation_of_duties_required boolean not null default true,
  employee_preview_enabled boolean not null default true,
  dispute_process_enabled boolean not null default true,
  fiken_export_prep_enabled boolean not null default false,
  companion_advisor_enabled boolean not null default true,
  since_last_login_enabled boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_cmp614_settings enable row level security;
revoke all on public.organization_cmp614_settings from authenticated, anon;

-- Employee compensation profiles
create table if not exists public.organization_cmp614_compensation_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'compensation_profiles',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_compensation_profiles enable row level security;
revoke all on public.organization_cmp614_compensation_profiles from authenticated, anon;

-- Compensation models (salary, hourly, commission, hybrid)
create table if not exists public.organization_cmp614_compensation_models (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'compensation_models',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_compensation_models enable row level security;
revoke all on public.organization_cmp614_compensation_models from authenticated, anon;

-- Effective-dated compensation rules
create table if not exists public.organization_cmp614_effective_dated_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'effective_dated_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_effective_dated_rules enable row level security;
revoke all on public.organization_cmp614_effective_dated_rules from authenticated, anon;

-- Rule hierarchy global→dept→role→location→service→employee
create table if not exists public.organization_cmp614_rule_hierarchy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'rule_hierarchy',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_rule_hierarchy enable row level security;
revoke all on public.organization_cmp614_rule_hierarchy from authenticated, anon;

-- Commission plans catalog
create table if not exists public.organization_cmp614_commission_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_plans',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_plans enable row level security;
revoke all on public.organization_cmp614_commission_plans from authenticated, anon;

-- Commission type definitions
create table if not exists public.organization_cmp614_commission_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_types',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_types enable row level security;
revoke all on public.organization_cmp614_commission_types from authenticated, anon;

-- Commission basis (revenue, margin, units)
create table if not exists public.organization_cmp614_commission_basis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_basis',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_basis enable row level security;
revoke all on public.organization_cmp614_commission_basis from authenticated, anon;

-- Commission eligibility rules
create table if not exists public.organization_cmp614_commission_eligibility (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_eligibility',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_eligibility enable row level security;
revoke all on public.organization_cmp614_commission_eligibility from authenticated, anon;

-- Growth Partner separation — never mix with employee payroll
create table if not exists public.organization_cmp614_growth_partner_separation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'growth_partner_separation',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_growth_partner_separation enable row level security;
revoke all on public.organization_cmp614_growth_partner_separation from authenticated, anon;

-- Service commission rules
create table if not exists public.organization_cmp614_service_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_service_commission enable row level security;
revoke all on public.organization_cmp614_service_commission from authenticated, anon;

-- Product commission rules
create table if not exists public.organization_cmp614_product_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_product_commission enable row level security;
revoke all on public.organization_cmp614_product_commission from authenticated, anon;

-- Membership commission rules
create table if not exists public.organization_cmp614_membership_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'membership_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_membership_commission enable row level security;
revoke all on public.organization_cmp614_membership_commission from authenticated, anon;

-- Package commission rules
create table if not exists public.organization_cmp614_package_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'package_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_package_commission enable row level security;
revoke all on public.organization_cmp614_package_commission from authenticated, anon;

-- Rebooking commission rules
create table if not exists public.organization_cmp614_rebooking_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'rebooking_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_rebooking_commission enable row level security;
revoke all on public.organization_cmp614_rebooking_commission from authenticated, anon;

-- New customer commission rules
create table if not exists public.organization_cmp614_new_customer_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'new_customer_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_new_customer_commission enable row level security;
revoke all on public.organization_cmp614_new_customer_commission from authenticated, anon;

-- Multi-employee commission splits
create table if not exists public.organization_cmp614_multi_employee_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'multi_employee_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_multi_employee_commission enable row level security;
revoke all on public.organization_cmp614_multi_employee_commission from authenticated, anon;

-- Team commission pools
create table if not exists public.organization_cmp614_team_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'team_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_team_commission enable row level security;
revoke all on public.organization_cmp614_team_commission from authenticated, anon;

-- Tiered commission schedules
create table if not exists public.organization_cmp614_tiered_commission (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tiered_commission',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_tiered_commission enable row level security;
revoke all on public.organization_cmp614_tiered_commission from authenticated, anon;

-- Commission caps
create table if not exists public.organization_cmp614_commission_caps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_caps',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_caps enable row level security;
revoke all on public.organization_cmp614_commission_caps from authenticated, anon;

-- Commission floors
create table if not exists public.organization_cmp614_commission_floors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_floors',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_floors enable row level security;
revoke all on public.organization_cmp614_commission_floors from authenticated, anon;

-- Discount impact on commission
create table if not exists public.organization_cmp614_discount_impact_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'discount_impact_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_discount_impact_rules enable row level security;
revoke all on public.organization_cmp614_discount_impact_rules from authenticated, anon;

-- Refund impact on commission
create table if not exists public.organization_cmp614_refund_impact_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'refund_impact_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_refund_impact_rules enable row level security;
revoke all on public.organization_cmp614_refund_impact_rules from authenticated, anon;

-- Partial refund commission rules
create table if not exists public.organization_cmp614_partial_refund_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'partial_refund_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_partial_refund_rules enable row level security;
revoke all on public.organization_cmp614_partial_refund_rules from authenticated, anon;

-- Cancellation impact on commission
create table if not exists public.organization_cmp614_cancellation_impact_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cancellation_impact_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_cancellation_impact_rules enable row level security;
revoke all on public.organization_cmp614_cancellation_impact_rules from authenticated, anon;

-- Chargeback impact on commission
create table if not exists public.organization_cmp614_chargeback_impact_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'chargeback_impact_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_chargeback_impact_rules enable row level security;
revoke all on public.organization_cmp614_chargeback_impact_rules from authenticated, anon;

-- Immutable commission ledger entries
create table if not exists public.organization_cmp614_commission_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_ledger',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_ledger enable row level security;
revoke all on public.organization_cmp614_commission_ledger from authenticated, anon;

-- Commission status catalog — icon + text always
create table if not exists public.organization_cmp614_commission_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_status_catalog',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_status_catalog enable row level security;
revoke all on public.organization_cmp614_commission_status_catalog from authenticated, anon;

-- Phase 612 tip collection link — allocation only here
create table if not exists public.organization_cmp614_pos612_tip_collection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'pos612_tip_collection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_pos612_tip_collection enable row level security;
revoke all on public.organization_cmp614_pos612_tip_collection from authenticated, anon;

-- Tip pools for payroll input
create table if not exists public.organization_cmp614_tip_pools (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tip_pools',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_tip_pools enable row level security;
revoke all on public.organization_cmp614_tip_pools from authenticated, anon;

-- Tip distribution methods
create table if not exists public.organization_cmp614_tip_distribution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tip_distribution',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_tip_distribution enable row level security;
revoke all on public.organization_cmp614_tip_distribution from authenticated, anon;

-- Tip refund handling
create table if not exists public.organization_cmp614_tip_refunds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tip_refunds',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_tip_refunds enable row level security;
revoke all on public.organization_cmp614_tip_refunds from authenticated, anon;

-- Cash tip declarations
create table if not exists public.organization_cmp614_cash_tips (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cash_tips',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_cash_tips enable row level security;
revoke all on public.organization_cmp614_cash_tips from authenticated, anon;

-- Tip privacy — aggregated analytics only
create table if not exists public.organization_cmp614_tip_privacy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tip_privacy',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_tip_privacy enable row level security;
revoke all on public.organization_cmp614_tip_privacy from authenticated, anon;

-- Bonus engine rules
create table if not exists public.organization_cmp614_bonus_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'bonus_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_bonus_rules enable row level security;
revoke all on public.organization_cmp614_bonus_rules from authenticated, anon;

-- Manual bonus entries
create table if not exists public.organization_cmp614_manual_bonuses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'manual_bonuses',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_manual_bonuses enable row level security;
revoke all on public.organization_cmp614_manual_bonuses from authenticated, anon;

-- Governed deduction rules
create table if not exists public.organization_cmp614_governed_deductions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'governed_deductions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_governed_deductions enable row level security;
revoke all on public.organization_cmp614_governed_deductions from authenticated, anon;

-- Expense input connection — consume Phase expense engine
create table if not exists public.organization_cmp614_expense_input_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'expense_input_links',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_expense_input_links enable row level security;
revoke all on public.organization_cmp614_expense_input_links from authenticated, anon;

-- Phase 609 approved hours/overtime/TOIL/on-call only
create table if not exists public.organization_cmp614_time609_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'time609_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_time609_connection enable row level security;
revoke all on public.organization_cmp614_time609_connection from authenticated, anon;

-- Payroll periods
create table if not exists public.organization_cmp614_payroll_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payroll_periods',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_payroll_periods enable row level security;
revoke all on public.organization_cmp614_payroll_periods from authenticated, anon;

-- Payroll input records — not payroll processing
create table if not exists public.organization_cmp614_payroll_input_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payroll_input_records',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_payroll_input_records enable row level security;
revoke all on public.organization_cmp614_payroll_input_records from authenticated, anon;

-- Payroll input categories
create table if not exists public.organization_cmp614_payroll_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payroll_categories',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_payroll_categories enable row level security;
revoke all on public.organization_cmp614_payroll_categories from authenticated, anon;

-- Payroll readiness validation checks
create table if not exists public.organization_cmp614_readiness_validation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'readiness_validation',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_readiness_validation enable row level security;
revoke all on public.organization_cmp614_readiness_validation from authenticated, anon;

-- Payroll exception queue
create table if not exists public.organization_cmp614_payroll_exceptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payroll_exceptions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_payroll_exceptions enable row level security;
revoke all on public.organization_cmp614_payroll_exceptions from authenticated, anon;

-- Compensation approval workflow
create table if not exists public.organization_cmp614_approval_workflow (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'approval_workflow',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_approval_workflow enable row level security;
revoke all on public.organization_cmp614_approval_workflow from authenticated, anon;

-- Approval segmentation by team or role
create table if not exists public.organization_cmp614_approval_segmentation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'approval_segmentation',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_approval_segmentation enable row level security;
revoke all on public.organization_cmp614_approval_segmentation from authenticated, anon;

-- Segregation of duties rules
create table if not exists public.organization_cmp614_segregation_of_duties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'segregation_of_duties',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_segregation_of_duties enable row level security;
revoke all on public.organization_cmp614_segregation_of_duties from authenticated, anon;

-- Employee compensation preview
create table if not exists public.organization_cmp614_employee_preview (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_preview',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_employee_preview enable row level security;
revoke all on public.organization_cmp614_employee_preview from authenticated, anon;

-- Non-punitive dispute process
create table if not exists public.organization_cmp614_dispute_process (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'dispute_process',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_dispute_process enable row level security;
revoke all on public.organization_cmp614_dispute_process from authenticated, anon;

-- Compensation corrections
create table if not exists public.organization_cmp614_corrections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'corrections',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_corrections enable row level security;
revoke all on public.organization_cmp614_corrections from authenticated, anon;

-- Retroactive adjustments
create table if not exists public.organization_cmp614_retroactive_adjustments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'retroactive_adjustments',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_retroactive_adjustments enable row level security;
revoke all on public.organization_cmp614_retroactive_adjustments from authenticated, anon;

-- Payroll period locking
create table if not exists public.organization_cmp614_period_locking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'period_locking',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_period_locking enable row level security;
revoke all on public.organization_cmp614_period_locking from authenticated, anon;

-- Governed period reopening
create table if not exists public.organization_cmp614_period_reopening (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'period_reopening',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_period_reopening enable row level security;
revoke all on public.organization_cmp614_period_reopening from authenticated, anon;

-- Payroll export center metadata
create table if not exists public.organization_cmp614_export_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'export_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_export_center enable row level security;
revoke all on public.organization_cmp614_export_center from authenticated, anon;

-- External payroll provider mapping
create table if not exists public.organization_cmp614_provider_mapping (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'provider_mapping',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_provider_mapping enable row level security;
revoke all on public.organization_cmp614_provider_mapping from authenticated, anon;

-- Export versioning
create table if not exists public.organization_cmp614_export_versioning (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'export_versioning',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_export_versioning enable row level security;
revoke all on public.organization_cmp614_export_versioning from authenticated, anon;

-- Payroll input reconciliation
create table if not exists public.organization_cmp614_reconciliation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reconciliation',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_reconciliation enable row level security;
revoke all on public.organization_cmp614_reconciliation from authenticated, anon;

-- Fiken export signals prep
create table if not exists public.organization_cmp614_fiken_export_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fiken_export_prep',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_fiken_export_prep enable row level security;
revoke all on public.organization_cmp614_fiken_export_prep from authenticated, anon;

-- Cost allocation metadata
create table if not exists public.organization_cmp614_cost_allocation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cost_allocation',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_cost_allocation enable row level security;
revoke all on public.organization_cmp614_cost_allocation from authenticated, anon;

-- Phase 615 labor cost signals prep — no profitability calc
create table if not exists public.organization_cmp614_labor_cost_signals_615 (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'labor_cost_signals_615',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_labor_cost_signals_615 enable row level security;
revoke all on public.organization_cmp614_labor_cost_signals_615 from authenticated, anon;

-- Contractor compensation input — separate from employees
create table if not exists public.organization_cmp614_contractor_input (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'contractor_input',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_contractor_input enable row level security;
revoke all on public.organization_cmp614_contractor_input from authenticated, anon;

-- Phase 606 vacation continuity integration
create table if not exists public.organization_cmp614_vacation606_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vacation606_integration',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_vacation606_integration enable row level security;
revoke all on public.organization_cmp614_vacation606_integration from authenticated, anon;

-- Phase 607 crisis continuity integration
create table if not exists public.organization_cmp614_continuity607_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'continuity607_integration',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_continuity607_integration enable row level security;
revoke all on public.organization_cmp614_continuity607_integration from authenticated, anon;

-- Phase 588 verified revenue connection
create table if not exists public.organization_cmp614_phase588_revenue_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase588_revenue_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_phase588_revenue_connection enable row level security;
revoke all on public.organization_cmp614_phase588_revenue_connection from authenticated, anon;

-- Phase 610 booking revenue connection
create table if not exists public.organization_cmp614_phase610_booking_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase610_booking_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_phase610_booking_connection enable row level security;
revoke all on public.organization_cmp614_phase610_booking_connection from authenticated, anon;

-- Phase 611 CRM/membership connection
create table if not exists public.organization_cmp614_phase611_crm_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase611_crm_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_phase611_crm_connection enable row level security;
revoke all on public.organization_cmp614_phase611_crm_connection from authenticated, anon;

-- Companion Compensation Advisor metadata
create table if not exists public.organization_cmp614_companion_advisor (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'companion_advisor',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_companion_advisor enable row level security;
revoke all on public.organization_cmp614_companion_advisor from authenticated, anon;

-- Employee compensation dashboard
create table if not exists public.organization_cmp614_employee_dashboard (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_dashboard',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_employee_dashboard enable row level security;
revoke all on public.organization_cmp614_employee_dashboard from authenticated, anon;

-- Manager compensation dashboard
create table if not exists public.organization_cmp614_manager_dashboard (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'manager_dashboard',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_manager_dashboard enable row level security;
revoke all on public.organization_cmp614_manager_dashboard from authenticated, anon;

-- Executive compensation dashboard
create table if not exists public.organization_cmp614_executive_dashboard (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'executive_dashboard',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_executive_dashboard enable row level security;
revoke all on public.organization_cmp614_executive_dashboard from authenticated, anon;

-- Since Last Login integration
create table if not exists public.organization_cmp614_since_last_login (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'since_last_login',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_since_last_login enable row level security;
revoke all on public.organization_cmp614_since_last_login from authenticated, anon;

-- Mobile compensation summary
create table if not exists public.organization_cmp614_mobile_summary (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'mobile_summary',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_mobile_summary enable row level security;
revoke all on public.organization_cmp614_mobile_summary from authenticated, anon;

-- Compensation notifications
create table if not exists public.organization_cmp614_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'notifications',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_notifications enable row level security;
revoke all on public.organization_cmp614_notifications from authenticated, anon;

-- Access control — APP roles
create table if not exists public.organization_cmp614_access_control (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'access_control',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_access_control enable row level security;
revoke all on public.organization_cmp614_access_control from authenticated, anon;

-- Security and privacy governance
create table if not exists public.organization_cmp614_security_privacy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'security_privacy',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_security_privacy enable row level security;
revoke all on public.organization_cmp614_security_privacy from authenticated, anon;

-- Retention policies
create table if not exists public.organization_cmp614_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'retention_policies',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_retention_policies enable row level security;
revoke all on public.organization_cmp614_retention_policies from authenticated, anon;

-- Compensation policy center
create table if not exists public.organization_cmp614_compensation_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'compensation_policies',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_compensation_policies enable row level security;
revoke all on public.organization_cmp614_compensation_policies from authenticated, anon;

-- Policy acknowledgement tracking
create table if not exists public.organization_cmp614_policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'policy_acknowledgements',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_policy_acknowledgements enable row level security;
revoke all on public.organization_cmp614_policy_acknowledgements from authenticated, anon;

-- Legal governance and warnings
create table if not exists public.organization_cmp614_legal_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'legal_governance',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_legal_governance enable row level security;
revoke all on public.organization_cmp614_legal_governance from authenticated, anon;

-- Compensation analytics — aggregate only
create table if not exists public.organization_cmp614_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'analytics',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_analytics enable row level security;
revoke all on public.organization_cmp614_analytics from authenticated, anon;

-- Fairness review — not surveillance
create table if not exists public.organization_cmp614_fairness_review (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fairness_review',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_fairness_review enable row level security;
revoke all on public.organization_cmp614_fairness_review from authenticated, anon;

-- Compensation reports catalog
create table if not exists public.organization_cmp614_reports_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reports_catalog',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_reports_catalog enable row level security;
revoke all on public.organization_cmp614_reports_catalog from authenticated, anon;

-- Commission Plan Center route metadata
create table if not exists public.organization_cmp614_commission_plan_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_plan_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_plan_center enable row level security;
revoke all on public.organization_cmp614_commission_plan_center from authenticated, anon;

-- Payroll Period Center route metadata
create table if not exists public.organization_cmp614_payroll_period_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payroll_period_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_payroll_period_center enable row level security;
revoke all on public.organization_cmp614_payroll_period_center from authenticated, anon;

-- Exception Center route metadata
create table if not exists public.organization_cmp614_exception_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'exception_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_exception_center enable row level security;
revoke all on public.organization_cmp614_exception_center from authenticated, anon;

-- Compensation Policy Center route metadata
create table if not exists public.organization_cmp614_policy_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'policy_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_policy_center enable row level security;
revoke all on public.organization_cmp614_policy_center from authenticated, anon;

-- Employee self-service my compensation view
create table if not exists public.organization_cmp614_my_compensation_view (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'my_compensation_view',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_my_compensation_view enable row level security;
revoke all on public.organization_cmp614_my_compensation_view from authenticated, anon;

-- Payroll input readiness queue
create table if not exists public.organization_cmp614_payroll_input_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payroll_input_queue',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_payroll_input_queue enable row level security;
revoke all on public.organization_cmp614_payroll_input_queue from authenticated, anon;

-- Adjustment ledger entries
create table if not exists public.organization_cmp614_adjustment_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'adjustment_ledger',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_adjustment_ledger enable row level security;
revoke all on public.organization_cmp614_adjustment_ledger from authenticated, anon;

-- Bonus accrual tracking
create table if not exists public.organization_cmp614_bonus_accruals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'bonus_accruals',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_bonus_accruals enable row level security;
revoke all on public.organization_cmp614_bonus_accruals from authenticated, anon;

-- Tip allocation run records
create table if not exists public.organization_cmp614_tip_allocation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tip_allocation_runs',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_tip_allocation_runs enable row level security;
revoke all on public.organization_cmp614_tip_allocation_runs from authenticated, anon;

-- Commission-eligible event prep from checkout
create table if not exists public.organization_cmp614_commission_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_events',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_commission_events enable row level security;
revoke all on public.organization_cmp614_commission_events from authenticated, anon;

-- Verified revenue signals from Phase 612
create table if not exists public.organization_cmp614_revenue_verification_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'revenue_verification_signals',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_revenue_verification_signals enable row level security;
revoke all on public.organization_cmp614_revenue_verification_signals from authenticated, anon;

-- Phase 616 rental model boundary metadata only
create table if not exists public.organization_cmp614_rental616_boundary (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'rental616_boundary',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_rental616_boundary enable row level security;
revoke all on public.organization_cmp614_rental616_boundary from authenticated, anon;

-- Cross-phase integration hub references
create table if not exists public.organization_cmp614_integration_hub (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'integration_hub',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_cmp614_integration_hub enable row level security;
revoke all on public.organization_cmp614_integration_hub from authenticated, anon;

create table if not exists public.organization_cmp614_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'compensation',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_cmp614_audit_logs enable row level security;
revoke all on public.organization_cmp614_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cmp614_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmp614_status(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key, 'status_title', d.status_title,
      'icon_key', d.icon_key, 'status_group', d.status_group
    ) from public.cmp614_commission_status_defs d where d.status_key = p_status_key
  ), jsonb_build_object('status_key', p_status_key, 'status_title', p_status_key, 'icon_key', 'circle', 'status_group', 'workflow'));
$$;

create or replace function public._cmp614_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'compensation'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cmp614_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'compensation'), left(coalesce(p_summary, ''), 500), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmp614_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cmp614_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmp614_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_cmp614_commission_plans where organization_id = p_org_id limit 1) then
    return;
  end if;

  perform public._cmp614_ensure_settings(p_org_id);

  insert into public.organization_cmp614_compensation_profiles (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'compensati_base', initcap(replace('compensation_profiles', '_', ' ')), 'active', 'circle', 'Active', 'compensation_profiles', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 compensation_profiles.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_compensation_models (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'compensati_base', initcap(replace('compensation_models', '_', ' ')), 'active', 'circle', 'Active', 'compensation_models', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 compensation_models.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_effective_dated_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'effectived_base', initcap(replace('effective_dated_rules', '_', ' ')), 'active', 'circle', 'Active', 'effective_dated_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 effective_dated_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_rule_hierarchy (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'rulehierar_base', initcap(replace('rule_hierarchy', '_', ' ')), 'active', 'circle', 'Active', 'rule_hierarchy', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 rule_hierarchy.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_plans (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_plans', '_', ' ')), 'active', 'circle', 'Active', 'commission_plans', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_plans.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_types (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_types', '_', ' ')), 'active', 'circle', 'Active', 'commission_types', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_types.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_basis (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_basis', '_', ' ')), 'active', 'circle', 'Active', 'commission_basis', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_basis.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_eligibility (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_eligibility', '_', ' ')), 'active', 'circle', 'Active', 'commission_eligibility', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_eligibility.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_growth_partner_separation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'growthpart_base', initcap(replace('growth_partner_separation', '_', ' ')), 'active', 'circle', 'Active', 'growth_partner_separation', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 growth_partner_separation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_service_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'servicecom_base', initcap(replace('service_commission', '_', ' ')), 'active', 'circle', 'Active', 'service_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 service_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_product_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'productcom_base', initcap(replace('product_commission', '_', ' ')), 'active', 'circle', 'Active', 'product_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 product_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_membership_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'membership_base', initcap(replace('membership_commission', '_', ' ')), 'active', 'circle', 'Active', 'membership_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 membership_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_package_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'packagecom_base', initcap(replace('package_commission', '_', ' ')), 'active', 'circle', 'Active', 'package_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 package_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_rebooking_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'rebookingc_base', initcap(replace('rebooking_commission', '_', ' ')), 'active', 'circle', 'Active', 'rebooking_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 rebooking_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_new_customer_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'newcustome_base', initcap(replace('new_customer_commission', '_', ' ')), 'active', 'circle', 'Active', 'new_customer_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 new_customer_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_multi_employee_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'multiemplo_base', initcap(replace('multi_employee_commission', '_', ' ')), 'active', 'circle', 'Active', 'multi_employee_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 multi_employee_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_team_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'teamcommis_base', initcap(replace('team_commission', '_', ' ')), 'active', 'circle', 'Active', 'team_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 team_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_tiered_commission (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'tieredcomm_base', initcap(replace('tiered_commission', '_', ' ')), 'active', 'circle', 'Active', 'tiered_commission', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 tiered_commission.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_caps (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_caps', '_', ' ')), 'active', 'circle', 'Active', 'commission_caps', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_caps.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_floors (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_floors', '_', ' ')), 'active', 'circle', 'Active', 'commission_floors', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_floors.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_discount_impact_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'discountim_base', initcap(replace('discount_impact_rules', '_', ' ')), 'active', 'circle', 'Active', 'discount_impact_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 discount_impact_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_refund_impact_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'refundimpa_base', initcap(replace('refund_impact_rules', '_', ' ')), 'active', 'circle', 'Active', 'refund_impact_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 refund_impact_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_partial_refund_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'partialref_base', initcap(replace('partial_refund_rules', '_', ' ')), 'active', 'circle', 'Active', 'partial_refund_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 partial_refund_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_cancellation_impact_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'cancellati_base', initcap(replace('cancellation_impact_rules', '_', ' ')), 'active', 'circle', 'Active', 'cancellation_impact_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 cancellation_impact_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_chargeback_impact_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'chargeback_base', initcap(replace('chargeback_impact_rules', '_', ' ')), 'active', 'circle', 'Active', 'chargeback_impact_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 chargeback_impact_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_ledger (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_ledger', '_', ' ')), 'active', 'circle', 'Active', 'commission_ledger', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_ledger.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_status_catalog', '_', ' ')), 'active', 'circle', 'Active', 'commission_status_catalog', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_pos612_tip_collection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'pos612tipc_base', initcap(replace('pos612_tip_collection', '_', ' ')), 'active', 'circle', 'Active', 'pos612_tip_collection', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 pos612_tip_collection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_tip_pools (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'tippools_base', initcap(replace('tip_pools', '_', ' ')), 'active', 'circle', 'Active', 'tip_pools', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 tip_pools.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_tip_distribution (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'tipdistrib_base', initcap(replace('tip_distribution', '_', ' ')), 'active', 'circle', 'Active', 'tip_distribution', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 tip_distribution.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_tip_refunds (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'tiprefunds_base', initcap(replace('tip_refunds', '_', ' ')), 'active', 'circle', 'Active', 'tip_refunds', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 tip_refunds.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_cash_tips (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'cashtips_base', initcap(replace('cash_tips', '_', ' ')), 'active', 'circle', 'Active', 'cash_tips', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 cash_tips.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_tip_privacy (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'tipprivacy_base', initcap(replace('tip_privacy', '_', ' ')), 'active', 'circle', 'Active', 'tip_privacy', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 tip_privacy.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_bonus_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'bonusrules_base', initcap(replace('bonus_rules', '_', ' ')), 'active', 'circle', 'Active', 'bonus_rules', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 bonus_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_manual_bonuses (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'manualbonu_base', initcap(replace('manual_bonuses', '_', ' ')), 'active', 'circle', 'Active', 'manual_bonuses', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 manual_bonuses.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_governed_deductions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'governedde_base', initcap(replace('governed_deductions', '_', ' ')), 'active', 'circle', 'Active', 'governed_deductions', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 governed_deductions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_expense_input_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'expenseinp_base', initcap(replace('expense_input_links', '_', ' ')), 'active', 'circle', 'Active', 'expense_input_links', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 expense_input_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_time609_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'time609con_base', initcap(replace('time609_connection', '_', ' ')), 'active', 'circle', 'Active', 'time609_connection', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 time609_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_periods (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'payrollper_base', initcap(replace('payroll_periods', '_', ' ')), 'active', 'circle', 'Active', 'payroll_periods', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 payroll_periods.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_input_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'payrollinp_base', initcap(replace('payroll_input_records', '_', ' ')), 'active', 'circle', 'Active', 'payroll_input_records', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 payroll_input_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_categories (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'payrollcat_base', initcap(replace('payroll_categories', '_', ' ')), 'active', 'circle', 'Active', 'payroll_categories', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 payroll_categories.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_readiness_validation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'readinessv_base', initcap(replace('readiness_validation', '_', ' ')), 'active', 'circle', 'Active', 'readiness_validation', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 readiness_validation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_exceptions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'payrollexc_base', initcap(replace('payroll_exceptions', '_', ' ')), 'active', 'circle', 'Active', 'payroll_exceptions', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 payroll_exceptions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_approval_workflow (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'approvalwo_base', initcap(replace('approval_workflow', '_', ' ')), 'active', 'circle', 'Active', 'approval_workflow', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 approval_workflow.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_approval_segmentation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'approvalse_base', initcap(replace('approval_segmentation', '_', ' ')), 'active', 'circle', 'Active', 'approval_segmentation', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 approval_segmentation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_segregation_of_duties (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'segregatio_base', initcap(replace('segregation_of_duties', '_', ' ')), 'active', 'circle', 'Active', 'segregation_of_duties', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 segregation_of_duties.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_employee_preview (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'employeepr_base', initcap(replace('employee_preview', '_', ' ')), 'active', 'circle', 'Active', 'employee_preview', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 employee_preview.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_dispute_process (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'disputepro_base', initcap(replace('dispute_process', '_', ' ')), 'active', 'circle', 'Active', 'dispute_process', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 dispute_process.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_corrections (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'correction_base', initcap(replace('corrections', '_', ' ')), 'active', 'circle', 'Active', 'corrections', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 corrections.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_retroactive_adjustments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'retroactiv_base', initcap(replace('retroactive_adjustments', '_', ' ')), 'active', 'circle', 'Active', 'retroactive_adjustments', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 retroactive_adjustments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_period_locking (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'periodlock_base', initcap(replace('period_locking', '_', ' ')), 'active', 'circle', 'Active', 'period_locking', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 period_locking.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_period_reopening (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'periodreop_base', initcap(replace('period_reopening', '_', ' ')), 'active', 'circle', 'Active', 'period_reopening', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 period_reopening.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_export_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'exportcent_base', initcap(replace('export_center', '_', ' ')), 'active', 'circle', 'Active', 'export_center', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 export_center.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_provider_mapping (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'providerma_base', initcap(replace('provider_mapping', '_', ' ')), 'active', 'circle', 'Active', 'provider_mapping', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 provider_mapping.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_export_versioning (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'exportvers_base', initcap(replace('export_versioning', '_', ' ')), 'active', 'circle', 'Active', 'export_versioning', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 export_versioning.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_reconciliation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'reconcilia_base', initcap(replace('reconciliation', '_', ' ')), 'active', 'circle', 'Active', 'reconciliation', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 reconciliation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_fiken_export_prep (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'fikenexpor_base', initcap(replace('fiken_export_prep', '_', ' ')), 'active', 'circle', 'Active', 'fiken_export_prep', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 fiken_export_prep.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_cost_allocation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'costalloca_base', initcap(replace('cost_allocation', '_', ' ')), 'active', 'circle', 'Active', 'cost_allocation', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 cost_allocation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_labor_cost_signals_615 (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'laborcosts_base', initcap(replace('labor_cost_signals_615', '_', ' ')), 'active', 'circle', 'Active', 'labor_cost_signals_615', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 labor_cost_signals_615.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_contractor_input (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'contractor_base', initcap(replace('contractor_input', '_', ' ')), 'active', 'circle', 'Active', 'contractor_input', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 contractor_input.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_vacation606_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'vacation60_base', initcap(replace('vacation606_integration', '_', ' ')), 'active', 'circle', 'Active', 'vacation606_integration', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 vacation606_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_continuity607_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'continuity_base', initcap(replace('continuity607_integration', '_', ' ')), 'active', 'circle', 'Active', 'continuity607_integration', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 continuity607_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_phase588_revenue_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'phase588re_base', initcap(replace('phase588_revenue_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase588_revenue_connection', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 phase588_revenue_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_phase610_booking_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'phase610bo_base', initcap(replace('phase610_booking_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase610_booking_connection', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 phase610_booking_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_phase611_crm_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'phase611cr_base', initcap(replace('phase611_crm_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase611_crm_connection', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 phase611_crm_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_companion_advisor (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'companiona_base', initcap(replace('companion_advisor', '_', ' ')), 'active', 'circle', 'Active', 'companion_advisor', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 companion_advisor.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_employee_dashboard (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'employeeda_base', initcap(replace('employee_dashboard', '_', ' ')), 'active', 'circle', 'Active', 'employee_dashboard', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 employee_dashboard.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_manager_dashboard (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'managerdas_base', initcap(replace('manager_dashboard', '_', ' ')), 'active', 'circle', 'Active', 'manager_dashboard', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 manager_dashboard.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_executive_dashboard (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'executived_base', initcap(replace('executive_dashboard', '_', ' ')), 'active', 'circle', 'Active', 'executive_dashboard', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 executive_dashboard.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_since_last_login (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'sincelastl_base', initcap(replace('since_last_login', '_', ' ')), 'active', 'circle', 'Active', 'since_last_login', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 since_last_login.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_mobile_summary (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'mobilesumm_base', initcap(replace('mobile_summary', '_', ' ')), 'active', 'circle', 'Active', 'mobile_summary', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 mobile_summary.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_notifications (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'notificati_base', initcap(replace('notifications', '_', ' ')), 'active', 'circle', 'Active', 'notifications', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 notifications.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_access_control (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'accesscont_base', initcap(replace('access_control', '_', ' ')), 'active', 'circle', 'Active', 'access_control', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 access_control.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_security_privacy (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'securitypr_base', initcap(replace('security_privacy', '_', ' ')), 'active', 'circle', 'Active', 'security_privacy', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 security_privacy.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_retention_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'retentionp_base', initcap(replace('retention_policies', '_', ' ')), 'active', 'circle', 'Active', 'retention_policies', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 retention_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_compensation_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'compensati_base', initcap(replace('compensation_policies', '_', ' ')), 'active', 'circle', 'Active', 'compensation_policies', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 compensation_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_policy_acknowledgements (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'policyackn_base', initcap(replace('policy_acknowledgements', '_', ' ')), 'active', 'circle', 'Active', 'policy_acknowledgements', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 policy_acknowledgements.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_legal_governance (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'legalgover_base', initcap(replace('legal_governance', '_', ' ')), 'active', 'circle', 'Active', 'legal_governance', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 legal_governance.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'analytics_base', initcap(replace('analytics', '_', ' ')), 'active', 'circle', 'Active', 'analytics', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_fairness_review (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'fairnessre_base', initcap(replace('fairness_review', '_', ' ')), 'active', 'circle', 'Active', 'fairness_review', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 fairness_review.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_reports_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'reportscat_base', initcap(replace('reports_catalog', '_', ' ')), 'active', 'circle', 'Active', 'reports_catalog', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 reports_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_plan_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_plan_center', '_', ' ')), 'active', 'circle', 'Active', 'commission_plan_center', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_plan_center.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_period_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'payrollper_base', initcap(replace('payroll_period_center', '_', ' ')), 'active', 'circle', 'Active', 'payroll_period_center', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 payroll_period_center.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_exception_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'exceptionc_base', initcap(replace('exception_center', '_', ' ')), 'active', 'circle', 'Active', 'exception_center', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 exception_center.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_policy_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'policycent_base', initcap(replace('policy_center', '_', ' ')), 'active', 'circle', 'Active', 'policy_center', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 policy_center.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_my_compensation_view (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'mycompensa_base', initcap(replace('my_compensation_view', '_', ' ')), 'active', 'circle', 'Active', 'my_compensation_view', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 my_compensation_view.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_input_queue (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'payrollinp_base', initcap(replace('payroll_input_queue', '_', ' ')), 'active', 'circle', 'Active', 'payroll_input_queue', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 payroll_input_queue.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_adjustment_ledger (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'adjustment_base', initcap(replace('adjustment_ledger', '_', ' ')), 'active', 'circle', 'Active', 'adjustment_ledger', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 adjustment_ledger.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_bonus_accruals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'bonusaccru_base', initcap(replace('bonus_accruals', '_', ' ')), 'active', 'circle', 'Active', 'bonus_accruals', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 bonus_accruals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_tip_allocation_runs (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'tipallocat_base', initcap(replace('tip_allocation_runs', '_', ' ')), 'active', 'circle', 'Active', 'tip_allocation_runs', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 tip_allocation_runs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_events (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'commission_base', initcap(replace('commission_events', '_', ' ')), 'active', 'circle', 'Active', 'commission_events', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 commission_events.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_revenue_verification_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'revenuever_base', initcap(replace('revenue_verification_signals', '_', ' ')), 'active', 'circle', 'Active', 'revenue_verification_signals', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 revenue_verification_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_rental616_boundary (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'rental616b_base', initcap(replace('rental616_boundary', '_', ' ')), 'active', 'circle', 'Active', 'rental616_boundary', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 rental616_boundary.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, 'integratio_base', initcap(replace('integration_hub', '_', ' ')), 'active', 'circle', 'Active', 'integration_hub', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 integration_hub.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_growth_partner_separation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'gp_separation', 'Growth Partner payroll separation', 'enforced', 'shield', 'Enforced', 'growth_partner_separation',
    'Growth Partner commissions never mix with employee payroll — attribution preserved.',
    '{"partner_attribution":true,"employee_payroll_isolated":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_ledger (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, employee_label, amount, currency_code, period_label, immutable, summary, metadata
  ) values (
    p_org_id, 'cl_entry_1', 'Service commission — verified sale', 'commission_approved', 'badge-check', 'Commission approved', 'commission_ledger',
    'Primary Employee', 450.00, 'NOK', 'March 2026', true,
    'Immutable ledger entry — verified revenue from Phase 612 checkout.',
    '{"phase612_ref":"pos612","verified_revenue":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_pos612_tip_collection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'tips612_link', 'Phase 612 tip collection', 'linked', 'heart', 'Tips collected', 'pos612_tip_collection', 'phase612_cart_tips',
    'Phase 612 collects tips — Phase 614 allocates pools and prepares payroll input only.',
    '{"phase612_ref":"organization_pos612_cart_tips","duplicate_collection":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_time609_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'time609_link', 'Approved hours connection', 'linked', 'timer', 'Time linked', 'time609_connection', 'phase609_time_attendance',
    'Phase 609 approved hours, overtime, TOIL, and on-call only — no duplicate time engine.',
    '{"phase609_ref":"get_organization_time_attendance_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_periods (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, period_label, summary, metadata
  ) values (
    p_org_id, 'pp_mar_2026', 'March 2026 Payroll Period', 'payroll_ready', 'briefcase', 'Payroll ready', 'payroll_periods', 'March 2026',
    'Payroll period — validate readiness before export input.',
    '{"locked":false,"route":"/app/compensation/payroll-periods"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_rental616_boundary (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'rent616_boundary', 'Phase 616 rental boundary', 'metadata_only', 'home', 'Boundary only', 'rental616_boundary',
    'Phase 616 rental model boundary metadata — not implemented in Phase 614.',
    '{"phase616":"rental_model","implemented":false,"compatible_interface":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_labor_cost_signals_615 (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'labor615_prep', 'Labor cost signals prep', 'metadata_only', 'trending-up', 'Signals prep', 'labor_cost_signals_615',
    'Phase 615 labor cost signals — metadata only, no profitability calculation here.',
    '{"phase615_ref":"labor_cost","calculate_profitability":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values
    (p_org_id, 'int_588', 'Verified revenue', 'linked', 'trending-up', 'Revenue linked', 'integration_hub', 'phase588', 'Phase 588 verified revenue — integrate only.', '{"href":"/app/revenue-growth"}'::jsonb),
    (p_org_id, 'int_609', 'Time & attendance', 'linked', 'timer', 'Time linked', 'integration_hub', 'phase609', 'Phase 609 approved hours.', '{"href":"/app/time-attendance"}'::jsonb),
    (p_org_id, 'int_610', 'Booking revenue', 'linked', 'calendar', 'Booking linked', 'integration_hub', 'phase610', 'Phase 610 booking revenue.', '{"href":"/app/booking"}'::jsonb),
    (p_org_id, 'int_611', 'CRM & packages', 'linked', 'users', 'CRM linked', 'integration_hub', 'phase611', 'Phase 611 membership/packages.', '{"href":"/app/clients"}'::jsonb),
    (p_org_id, 'int_612', 'Checkout & tips', 'linked', 'shopping-cart', 'Checkout linked', 'integration_hub', 'phase612', 'Phase 612 checkout and tip collection.', '{"href":"/app/checkout"}'::jsonb),
    (p_org_id, 'int_606', 'Vacation continuity', 'linked', 'sun', 'Vacation linked', 'integration_hub', 'phase606', 'Phase 606 vacation mode.', '{"href":"/app/absence"}'::jsonb),
    (p_org_id, 'int_607', 'Crisis continuity', 'linked', 'shield', 'Continuity linked', 'integration_hub', 'phase607', 'Phase 607 crisis continuity.', '{"href":"/app/resilience/emergency"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  perform public._cmp614_log(p_org_id, 'compensation_seeded', 'Compensation center baseline seeded — Phase 614.');
end; $$;

create or replace function public._cmp614_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''employee_label'', employee_label, ''amount'', amount,
      ''currency_code'', currency_code, ''period_label'', period_label, ''priority'', priority,
      ''integration_ref'', integration_ref, ''immutable'', immutable,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_cmp614_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

create or replace function public.get_organization_compensation_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_cmp614_settings;
  v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._cmp614_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmp614_seed(v_org_id);
  select * into v_settings from public.organization_cmp614_settings where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'compensation_phase614',
      'principle', 'Aipify prepares payroll INPUT — not payroll processing. Humans approve; external systems pay.',
      'privacy_note', 'Employee compensation data is tenant-scoped. Growth Partner commissions never mix with employee payroll.',
      'distinction_note', 'Recorded work → Approved → Verified revenue → Commission-eligible → Payroll-ready → Exported → Externally processed',
      'section_count', 96,
      'settings', jsonb_build_object(
        'payroll_input_enabled', coalesce(v_settings.payroll_input_enabled, true),
        'growth_partner_separation_enforced', coalesce(v_settings.growth_partner_separation_enforced, true),
        'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true)
      ),
      'stats', jsonb_build_object(
        'commission_pending', (select count(*) from public.organization_cmp614_commission_ledger where organization_id = v_org_id and record_status = 'commission_pending'),
        'payroll_ready', (select count(*) from public.organization_cmp614_payroll_input_records where organization_id = v_org_id and record_status = 'payroll_ready'),
        'open_exceptions', (select count(*) from public.organization_cmp614_payroll_exceptions where organization_id = v_org_id and record_status = 'active'),
        'pending_approvals', (select count(*) from public.organization_cmp614_approval_workflow where organization_id = v_org_id and record_status = 'approval_required'),
        'tip_pools_open', (select count(*) from public.organization_cmp614_tip_pools where organization_id = v_org_id and record_status = 'active')
      ),
      'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_number', s.section_number,
        'domain_key', s.domain_key, 'section_title', s.section_title, 'summary', s.summary
      ) order by s.section_number) from public.cmp614_section_defs s), '[]'::jsonb),
      'commission_status_defs', coalesce((select jsonb_agg(public._cmp614_status(d.status_key) order by d.status_key)
        from public.cmp614_commission_status_defs d), '[]'::jsonb),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('key', 'approvals', 'observation', 'Commission and payroll input items may await approval.',
          'recommendation', 'Review approvals with segregation of duties before export.', 'href', '/app/compensation/approvals'),
        jsonb_build_object('key', 'exceptions', 'observation', 'Payroll exceptions block readiness validation.',
          'recommendation', 'Resolve exceptions before locking the payroll period.', 'href', '/app/compensation/exceptions')
      ),
      'integrations', public._cmp614_section_rows(v_org_id, 'integration_hub')
    );
  end if;

  case v_section
    when 'employees' then v_rows := public._cmp614_section_rows(v_org_id, 'compensation_profiles');
    when 'compensation_plans' then v_rows := public._cmp614_section_rows(v_org_id, 'commission_plans');
    when 'commissions' then v_rows := public._cmp614_section_rows(v_org_id, 'commission_ledger');
    when 'tips' then v_rows := public._cmp614_section_rows(v_org_id, 'tip_pools');
    when 'bonuses' then v_rows := public._cmp614_section_rows(v_org_id, 'bonus_rules');
    when 'adjustments' then v_rows := public._cmp614_section_rows(v_org_id, 'adjustment_ledger');
    when 'payroll_periods' then v_rows := public._cmp614_section_rows(v_org_id, 'payroll_periods');
    when 'approvals' then v_rows := public._cmp614_section_rows(v_org_id, 'approval_workflow');
    when 'payroll_input' then v_rows := public._cmp614_section_rows(v_org_id, 'payroll_input_records');
    when 'exports' then v_rows := public._cmp614_section_rows(v_org_id, 'export_center');
    when 'reconciliation' then v_rows := public._cmp614_section_rows(v_org_id, 'reconciliation');
    when 'policies' then v_rows := public._cmp614_section_rows(v_org_id, 'compensation_policies');
    when 'reports' then v_rows := public._cmp614_section_rows(v_org_id, 'reports_catalog');
    when 'my_compensation' then v_rows := public._cmp614_section_rows(v_org_id, 'my_compensation_view');
    when 'plans' then v_rows := public._cmp614_section_rows(v_org_id, 'commission_plan_center');
    when 'exceptions' then v_rows := public._cmp614_section_rows(v_org_id, 'payroll_exceptions');
    else v_rows := '[]'::jsonb;
  end case;

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'compensation_phase614',
    'principle', 'Aipify prepares payroll INPUT — not payroll processing.',
    'privacy_note', 'Growth Partner commissions never mix with employee payroll.',
    'commission_status_defs', coalesce((select jsonb_agg(public._cmp614_status(d.status_key) order by d.status_key)
      from public.cmp614_commission_status_defs d), '[]'::jsonb),
    'records', v_rows,
    'integrations', public._cmp614_section_rows(v_org_id, 'integration_hub'),
    'since_last_login', coalesce((select jsonb_build_object(
      'pending_approvals', (select count(*) from public.organization_cmp614_approval_workflow where organization_id = v_org_id and record_status = 'approval_required'),
      'open_exceptions', (select count(*) from public.organization_cmp614_payroll_exceptions where organization_id = v_org_id and record_status = 'active'),
      'summary', 'Compensation changes since last login.'
    )), '{}'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_cmp614_audit_logs where organization_id = v_org_id order by created_at desc limit 15
    ) l), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_employee_my_compensation(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v_center := public.get_organization_compensation_center('my_compensation');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  return v_center || jsonb_build_object(
    'view', 'employee_self',
    'section', v_section,
    'principle', 'Your compensation preview — disputes and corrections are non-punitive.',
    'employee_preview', public._cmp614_section_rows(public._cmp614_org(), 'employee_preview'),
    'commission_ledger', public._cmp614_section_rows(public._cmp614_org(), 'commission_ledger'),
    'tip_allocations', public._cmp614_section_rows(public._cmp614_org(), 'tip_allocation_runs'),
    'bonuses', public._cmp614_section_rows(public._cmp614_org(), 'manual_bonuses'),
    'disputes', public._cmp614_section_rows(public._cmp614_org(), 'dispute_process')
  );
end; $$;

create or replace function public.get_aipify_companion_compensation_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_compensation_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Compensation Advisor',
    'principle', 'Aipify observes compensation readiness and prepares payroll input — humans approve and external systems process pay.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'approvals',
        'observation', format('%s item(s) awaiting compensation approval.', v_stats->>'pending_approvals'),
        'impact', 'Unapproved commissions and adjustments cannot reach payroll-ready status.',
        'recommendation', 'Review approvals with segregation of duties before export.',
        'effort', 'low',
        'href', '/app/compensation/approvals'
      ),
      jsonb_build_object(
        'key', 'exceptions',
        'observation', format('%s payroll exception(s) open.', v_stats->>'open_exceptions'),
        'impact', 'Exceptions block payroll period readiness validation.',
        'recommendation', 'Resolve exceptions in the Exception Center before locking the period.',
        'effort', 'medium',
        'href', '/app/compensation/exceptions'
      ),
      jsonb_build_object(
        'key', 'tips',
        'observation', 'Phase 612 collects tips — Phase 614 allocates pools for payroll input.',
        'impact', 'Tip allocation must complete before payroll export includes tip earnings.',
        'recommendation', 'Review tip pools and distribution before payroll input export.',
        'effort', 'low',
        'href', '/app/compensation/tips'
      ),
      jsonb_build_object(
        'key', 'separation',
        'observation', 'Growth Partner commissions remain separate from employee payroll.',
        'impact', 'Mixing partner and employee compensation violates governance policy.',
        'recommendation', 'Confirm Growth Partner separation policy is acknowledged.',
        'effort', 'low',
        'href', '/app/compensation/policies'
      )
    ),
    'center', v_center
  );
end; $$;

grant execute on function public.get_organization_compensation_center(text) to authenticated;
grant execute on function public.get_employee_my_compensation(text) to authenticated;
grant execute on function public.get_aipify_companion_compensation_advisor_bundle() to authenticated;
