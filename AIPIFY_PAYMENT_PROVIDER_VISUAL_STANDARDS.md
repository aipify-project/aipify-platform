# Aipify — Payment Provider Visual Standards

## Purpose

Define how third-party payment providers are visually presented throughout Aipify — premium enterprise experience while preserving trust in globally recognized payment brands.

## Core principle

**Respect the brand. Elevate the presentation.**

Aipify never redesigns trusted provider identities. Aipify creates a beautiful, consistent environment around them.

## Approved providers

- Stripe
- Klarna
- Vipps MobilePay
- DNB Invoice

## Official brand rule

Always use official logos, colors, proportions, and brand assets from `public/branding/payment-providers/`.

Never use AI-generated versions, modified colors, stretched/cropped logos, or unofficial variants.

## Premium card specifications

| Property | Value |
|----------|-------|
| Border radius | 16px (`rounded-2xl`) |
| Padding | 24px (`p-6`) |
| Border | 1px subtle neutral |
| Shadow | Soft; subtle elevation on hover |
| Background | Clean white |
| Logo spacing | Minimum 24px internal padding |

## Card structure

1. Provider logo (official asset, `object-contain`, never cropped)
2. Provider name
3. Provider description (tagline)
4. Positioning copy
5. Operational status (color **and** text)
6. Capabilities
7. Actions: Configure · Test Connection · View Logs · Documentation

## Implementation

```
public/branding/payment-providers/     — official SVG wordmarks
lib/payment-providers/visual-standards.ts
components/shared/payment-providers/
  PaymentProviderLogo.tsx
  PaymentProviderCard.tsx
  PaymentProvidersExperiencePanel.tsx
```

## Do not

- Place logos directly on the page without containers
- Force logos into circles
- Change brand colors or add gradients behind logos
- Modify logo proportions

## Final principle

Customers trust brands they recognize. Aipify preserves that trust while presenting providers within a premium enterprise environment.
