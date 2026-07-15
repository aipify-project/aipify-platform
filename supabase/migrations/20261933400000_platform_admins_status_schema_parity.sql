-- Restore the platform_admins schema contract used by Platform server access.

ALTER TABLE public.platform_admins
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS suspended_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.platform_admins
  DROP CONSTRAINT IF EXISTS platform_admins_status_check;

ALTER TABLE public.platform_admins
  ADD CONSTRAINT platform_admins_status_check
  CHECK (status IN ('active', 'suspended'));
