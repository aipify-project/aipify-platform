# Commerce & Retail Operations Pack — FAQ

## How does Commerce Pack work?

The Commerce & Retail Operations Pack is the Industry Pack home for retail operators at `/app/commerce`. It federates Commerce Intelligence, Product Automation, Dropshipping, Performance, Multi-Store, and related engines on the shared ABOS foundation. Install via Industry Packs at `/app/industry-packs`.

## How are stores managed?

Stores are tracked in `commerce_store_profiles` with platform, domain, country, language, and currency metadata. Connect stores from Commerce Center or use the create store action. Multi-store portfolios are supported via `commerce_retail_portfolios`.

## How are products managed?

Products are federated from Commerce Intelligence (`commerce_products`) when available. Product opportunities surface margin and growth recommendations via `product_opportunities`. Manage products from Commerce Center or `/app/commerce-intelligence`.

## How is profitability measured?

Revenue, profit, conversion rate, and commerce health score are aggregated in the overview block from revenue trend reports and commerce health scores. View executive metrics in Commerce Center and Commerce Performance at `/app/commerce-performance`.

## How do supplier operations work?

Supplier profiles include reliability scores and lead times when the supplier engine is available. Dropshipping and supplier intelligence remain at `/app/dropshipping-operations` and `/app/supplier-intelligence`.

## How does portfolio management work?

Portfolios support single store, multi-store, multi-brand, multi-country, and enterprise commerce structures via `commerce_retail_portfolios`. Create portfolios from Commerce Center actions.

## How does this relate to Commerce Intelligence?

Commerce Intelligence (`/app/commerce-intelligence`) remains the operational product and margin engine. Commerce Pack (`/app/commerce`) is the canonical Industry Pack entry point that federates commerce modules without duplicating engines.
