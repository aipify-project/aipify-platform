# Hospitality & Accommodation Pack — FAQ

## How does Hospitality Pack work?

The Hospitality Pack is the Industry Pack home for accommodation operators at `/app/hospitality`. It federates Aipify Hosts capabilities — properties, reservations, guests, cleaning, maintenance, revenue, and reviews — on the shared ABOS foundation. Install via Industry Packs at `/app/industry-packs`.

## How are reservations managed?

Reservations are tracked in the Booking Center (`aipify_hosts_booking_reservations`) with statuses: inquiry, pending, confirmed, checked in, checked out, and cancelled. Manage reservations from Hospitality Center or `/app/aipify-hosts/bookings`.

## How do cleaning workflows operate?

Cleaning Operations assigns cleaners, tracks checklists, inspection status, and completion verification. Open Cleaning from Hospitality Operations or `/app/aipify-hosts/cleaning`. Turnover must be documented before guest arrival when human oversight is enabled.

## How is occupancy measured?

Occupancy is calculated from active properties and in-stay reservations via the executive summary engine. View occupancy in Hospitality Overview and the Executive Dashboard at `/app/aipify-hosts/executive`.

## How are guest reviews managed?

Reviews are tracked in the Reputation Center with ratings, feedback trends, and response workflows. Open Reviews from Hospitality modules or `/app/aipify-hosts/reputation`.

## How does portfolio management work?

Portfolios support single property, multi-property, regional, enterprise, and franchise structures via `hospitality_portfolios`. Property profiles extend Aipify Hosts properties with type, capacity, amenities, and owner metadata.

## How does this relate to Aipify Hosts?

Aipify Hosts (`/app/aipify-hosts`) remains the operational module layer. Hospitality Pack (`/app/hospitality`) is the canonical Industry Pack entry point that federates Hosts without duplicating engines.
