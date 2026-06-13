import type { TrustDomainIconId } from "@/lib/platform/trust-center/config";

type Props = {
  icon: TrustDomainIconId;
  className?: string;
};

export function TrustDomainIcon({ icon, className = "h-5 w-5" }: Props) {
  const stroke = "currentColor";
  const props = {
    className,
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke,
    strokeWidth: 1.8,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "shield-user":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <circle cx="12" cy="11" r="2.5" />
          <path strokeLinecap="round" d="M8.5 15.5c.9 1 2.1 1.5 3.5 1.5s2.6-.5 3.5-1.5" />
        </svg>
      );
    case "scale":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 7h14M7 7l-2 5h4L7 7zM17 7l-2 5h4L17 7z" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h8a3 3 0 013 3v13H8a3 3 0 00-3-3V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5h8a3 3 0 013 3v13" />
        </svg>
      );
    case "target":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20s-6.5-4.2-8.5-8.2C1.8 8.4 3.6 5.5 6.5 5.5c1.7 0 3.2.9 3.9 2.2.7-1.3 2.2-2.2 3.9-2.2 2.9 0 4.7 2.9 3 6.3C18.5 15.8 12 20 12 20z"
          />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path strokeLinecap="round" d="M3.5 19c.8-3 3.2-5 5.5-5s4.7 2 5.5 5M14 19c.5-2 2-3.5 4-3.5" />
        </svg>
      );
    case "check-circle":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.2 2.2 4.8-5" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...props}>
          <rect x="4" y="8" width="16" height="11" rx="2" />
          <path strokeLinecap="round" d="M9 8V6a3 3 0 016 0v2" />
        </svg>
      );
    case "shield-check":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect x="6" y="10" width="12" height="10" rx="2" />
          <path strokeLinecap="round" d="M8 10V8a4 4 0 018 0v2" />
        </svg>
      );
    case "alert-triangle":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l8.5 14H3.5L12 4z" />
          <path strokeLinecap="round" d="M12 10v3M12 16.5h.01" />
        </svg>
      );
    case "fingerprint":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            d="M12 11a3 3 0 013 3c0 4-6 4-6 8M9 11.5V11a3 3 0 016 0v4.5c0 3-6 3-6 6"
          />
          <path strokeLinecap="round" d="M12 4v2M7 6l1 1.5M17 6l-1 1.5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
