-- Revoke direct client write privileges on approved reference defs tables.
-- SELECT for anon/authenticated is preserved; RLS and policies unchanged (handled separately).

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON TABLE
  public.apt610_channel_defs,
  public.apt610_scope_defs,
  public.apt610_section_defs,
  public.apt610_status_defs,
  public.cmp614_commission_status_defs,
  public.cmp614_section_defs,
  public.crm611_section_defs,
  public.int618_section_defs,
  public.int618_status_defs,
  public.inv613_section_defs,
  public.inv613_stock_status_defs,
  public.net616_section_defs,
  public.net616_status_defs,
  public.pay617_section_defs,
  public.pay617_status_defs,
  public.prof615_data_quality_defs,
  public.prof615_profitability_status_defs,
  public.prof615_section_defs,
  public.sx619_section_defs,
  public.sx619_status_defs,
  public.ta609_entry_method_defs,
  public.ta609_record_status_defs,
  public.ta609_section_defs,
  public.vac606_activation_option_defs,
  public.vac606_availability_level_defs,
  public.vac606_coverage_level_defs,
  public.vac606_scope_defs
FROM anon, authenticated;
