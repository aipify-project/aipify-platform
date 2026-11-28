-- Post-apply assertions for disposable local validation

do $$
declare
  v_payload jsonb;
  v_ok boolean;
begin
  -- Columns present
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'product_type'
  ) then
    raise exception 'ASSERT FAIL: product_type missing';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'depends_on_product_keys'
  ) then
    raise exception 'ASSERT FAIL: depends_on_product_keys missing';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'category_id'
  ) then
    raise exception 'ASSERT FAIL: category_id missing';
  end if;

  -- Self-ref rejected
  begin
    update public.csp_sales_products
    set depends_on_product_keys = array['design_pack']
    where product_key = 'design_pack';
    raise exception 'ASSERT FAIL: self-ref should have been rejected';
  exception
    when others then
      if sqlerrm not like '%cannot include self%' then
        raise;
      end if;
  end;

  -- Unknown key rejected
  begin
    update public.csp_sales_products
    set depends_on_product_keys = array['does_not_exist']
    where product_key = 'design_pack';
    raise exception 'ASSERT FAIL: unknown key should have been rejected';
  exception
    when others then
      if sqlerrm not like '%unknown product_key%' then
        raise;
      end if;
  end;

  -- Valid ALL deps accepted
  update public.csp_sales_products
  set
    product_type = 'addon',
    category_id = 'addons',
    depends_on_product_keys = array['kompis_web', 'kompis_bedrift']
  where product_key = 'design_pack';

  update public.csp_sales_products
  set product_type = 'primary', category_id = 'kompis', depends_on_product_keys = '{}'::text[]
  where product_key in ('kompis_web', 'kompis_bedrift');

  -- Cycle rejected: A→B→A
  begin
    update public.csp_sales_products
    set depends_on_product_keys = array['design_pack']
    where product_key = 'kompis_web';
    raise exception 'ASSERT FAIL: cycle should have been rejected';
  exception
    when others then
      if sqlerrm not like '%cycle%' then
        raise;
      end if;
  end;

  -- Reset primary deps after cycle attempt
  update public.csp_sales_products
  set depends_on_product_keys = '{}'::text[]
  where product_key = 'kompis_web';

  -- List RPC shape (auth.uid null → unauthorized in security definer without jwt)
  -- Local docker has no auth.uid(); expect unauthorized unless we stub.
  -- Verify function body exists and dependency_semantics is in definition.
  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'csp_list_app_store_products'
  ) then
    raise exception 'ASSERT FAIL: csp_list_app_store_products missing';
  end if;

  if position('dependency_semantics' in pg_get_functiondef('public.csp_list_app_store_products()'::regprocedure)) = 0 then
    raise exception 'ASSERT FAIL: list RPC missing dependency_semantics';
  end if;

  if position('depends_on_product_keys' in pg_get_functiondef('public.csp_list_app_store_products()'::regprocedure)) = 0 then
    raise exception 'ASSERT FAIL: list RPC missing depends_on_product_keys';
  end if;

  raise notice 'LOCAL_SQL_VALIDATE_PASS';
end $$;

select 'LOCAL_SQL_VALIDATE_PASS' as status;
