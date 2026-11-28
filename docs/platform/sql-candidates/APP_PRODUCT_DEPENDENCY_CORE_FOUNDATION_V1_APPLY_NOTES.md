# APP Product Dependency Core Foundation V1 — Apply Notes

**Status:** AUTHORING_ONLY — not LIVE. No Staging/Production apply without exact owner YES per file SHA + environment.

## Artifacts

| File | Role |
|---|---|
| `app_store_product_category_type_dependency_v1.sql` | Legacy sketch (preserved) SHA `dfe390bf…c83c` |
| `app_store_product_dependency_core_foundation_v1.sql` | Executable candidate (this foundation) |
| `app_store_product_dependency_core_foundation_v1.sql.sha256` | Full SHA256 pin |
| `lib/app-portal/customer-catalog/dependency-purchase-gate.ts` | Later checkout gate contract (not wired) |

## Environments

- Staging Core: `auedugihkduoaikfusqe`
- Production Core: `qbcqoixhrvhnuwphefvw`

## Preflight facts (do not re-apply channel schema)

- Both envs already have `csp_sales_products.publish_app` / `publish_sale` / `master_active`
- Both lack `product_type`, `depends_on_product_keys`, `category_id`
- Staging has `csp_list_app_store_products`; Production does **not**
- `publish_app` count is 0 on both (no business backfill in this candidate)

## `csp_list_app_store_products` diff (vs channel RPC / Staging)

Preserved: `auth.uid()` gate · `channel_schema` fail-closed · filter `publish_app AND master_active` · no prices/commission · EXECUTE `authenticated` only · revoke public/anon/service_role.

Added payload keys:

- `dependency_semantics`: `'all'`
- per product: `product_type`, `category_id`, `category` (alias), `depends_on_product_keys`, `depends_on` (alias)

Production: function is **created** (currently missing). Staging: **replaced** in place.

## Apply order

1. Owner YES naming **this** candidate file + SHA256 + **Staging**
2. Pre-checks Staging:
   - columns absent
   - `publish_app` present
   - RLS on + forced; no anon/auth table grants
3. Apply `app_store_product_dependency_core_foundation_v1.sql` to Staging only
4. Post-checks Staging:
   - three columns present
   - `csp_list_app_store_products()` returns `dependency_semantics=all` and taxonomy fields
   - EXECUTE granted to `authenticated` only
5. Separate owner YES for **Production** (same SHA) then apply
6. Later (separate task): wire `evaluateDependencyPurchaseGate` into checkout; keep checkout closed until owner opens it

## Agent 1 coordination

- Do **not** edit variant/commission candidates or `lib/product-catalog/variant-commission*`
- Shared table `csp_sales_products` — additive columns only; avoid concurrent RPC rewrites of `csp_list_app_store_products` without merge coordination
- Sales Partner → APP module remains Agent 1

## Later Product Center UI (not in this job)

- Editor should call `csp_set_app_store_product_taxonomy`
- APP store width token when UI ships: `AppLayoutClasses.pageWidth` / `APP_CONTENT_MAX_WIDTH_PX=1560` (`lib/design/app-layout.ts`)
- Do not change APP shell/nav/Support in dependency work

## Rollback

See SQL header ROLLBACK block. Prefer restoring prior list RPC body over dropping Production-first install if RPC was newly created there.
