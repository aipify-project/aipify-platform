# AIPIFY_VARIANT_COMMISSION_PRODUCTION_PERSISTENCE_ACTIVATED

**Status:** gate activation in progress — see PR  
**Change:** `VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION = true`  
**NON-EFFECTS:** no SQL · no Production DB writes in this job · no Stripe · no payment · no settlement · no test product/variant/commission create

Preflight: Production `qbcqoixhrvhnuwphefvw` tables+RPCs present; settlement/stripe markers still false on RPCs; admin gates intact.
