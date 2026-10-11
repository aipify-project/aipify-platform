import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function BaseIcon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className ?? "ak-icon"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function AkIconArrowUp(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20V4m-7 7 7-7 7 7" />
    </BaseIcon>
  );
}

export function AkIconClose(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </BaseIcon>
  );
}

export function AkIconMinimize(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
    </BaseIcon>
  );
}

export function AkIconDocument(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M8 13h8M8 17h5" />
    </BaseIcon>
  );
}

export function AkIconExternalLink(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 3h7v7m0-7L11 13" />
      <path d="M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    </BaseIcon>
  );
}

export function AkIconChevronRight(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9 5 7 7-7 7" />
    </BaseIcon>
  );
}

export function AkIconRocket(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 13c4-1 7-4 8-10-6 1-9 4-10 8m2 2-2-2m2 2-2 5-3-1m3-6-5 2 1 3m1 1c-3 0-4 2-4 4 2 0 4-1 4-4" />
      <circle cx="15.5" cy="7.5" r="1.5" />
    </BaseIcon>
  );
}

export function AkIconUser(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" />
    </BaseIcon>
  );
}

export function AkIconThumbUp(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm0 0 3.2-6.4A2 2 0 0 1 12 3.5V7h5.4a2 2 0 0 1 1.95 2.44l-1.2 5.2A2 2 0 0 1 16.2 16H7" />
    </BaseIcon>
  );
}

export function AkIconThumbDown(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M17 13V3h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3Zm0 0-3.2 6.4A2 2 0 0 1 12 20.5V17H6.6a2 2 0 0 1-1.95-2.44l1.2-5.2A2 2 0 0 1 7.8 8H17" />
    </BaseIcon>
  );
}

export function AkIconCopy(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </BaseIcon>
  );
}
