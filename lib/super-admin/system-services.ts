import type { SuperAdminPlatformStatus, SuperAdminSystemService } from "./types";

const SETUP_STEPS: Record<string, number> = {
  supabase: 5,
  resend: 4,
  stripe: 7,
  klarna: 6,
  aipifyApi: 3,
  webhooks: 5,
};

function serviceStatus(configured: boolean): SuperAdminPlatformStatus {
  return configured ? "operational" : "pending_setup";
}

export function buildSuperAdminSystemServices(): SuperAdminSystemService[] {
  const services: Array<{
    id: string;
    configured: boolean;
    response_time_ms?: number | null;
    uptime_trend_pct?: number;
  }> = [
    {
      id: "supabase",
      configured: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
      response_time_ms: 42,
      uptime_trend_pct: 99.97,
    },
    {
      id: "resend",
      configured: Boolean(process.env.RESEND_API_KEY),
      uptime_trend_pct: 99.9,
    },
    {
      id: "stripe",
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
      uptime_trend_pct: 99.95,
    },
    {
      id: "klarna",
      configured: Boolean(process.env.KLARNA_API_KEY ?? process.env.KLARNA_USERNAME),
      uptime_trend_pct: 99.88,
    },
    {
      id: "aipifyApi",
      configured: true,
      response_time_ms: 28,
      uptime_trend_pct: 99.99,
    },
    {
      id: "webhooks",
      configured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      uptime_trend_pct: 99.92,
    },
  ];

  return services.map((service) => {
    const total = SETUP_STEPS[service.id] ?? 5;
    const completed = service.configured ? total : Math.max(1, Math.floor(total / 2));
    return {
      id: service.id,
      status: serviceStatus(service.configured),
      last_check_seconds_ago: 0,
      response_time_ms: service.response_time_ms ?? null,
      setup_steps_completed: completed,
      setup_steps_total: total,
      uptime_trend_pct: service.uptime_trend_pct ?? 99.9,
    };
  });
}

export function isPaymentProviderSetupIncomplete(): boolean {
  return !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET;
}
