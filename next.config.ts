import type { NextConfig } from "next";

const developmentScriptPolicy =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

/**
 * Google advertising origins. These are added ONLY to the Content-Security-Policy
 * of the /guides pages, which are the only routes that load the AdSense script.
 * Every other route keeps the stricter policy with no advertising origins.
 */
const adScriptOrigins =
  "https://pagead2.googlesyndication.com https://*.googlesyndication.com https://partner.googleadservices.com https://adservice.google.com https://googleads.g.doubleclick.net";
const adFrameOrigins =
  "https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com";
const adImageOrigins =
  "https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com";
const adConnectOrigins =
  "https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://*.google.com";

const contentSecurityPolicy = (ads: boolean) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${developmentScriptPolicy}${ads ? ` ${adScriptOrigins}` : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://*.openfreemap.org https://tiles.openfreemap.org${ads ? ` ${adImageOrigins}` : ""}`,
    `connect-src 'self' https://*.openfreemap.org https://tiles.openfreemap.org${ads ? ` ${adConnectOrigins}` : ""}`,
    ...(ads
      ? [`frame-src ${adFrameOrigins}`, `fenced-frame-src ${adFrameOrigins}`]
      : []),
    "worker-src 'self' blob:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), camera=(), microphone=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const policyHeader = (ads: boolean) => [
  { key: "Content-Security-Policy", value: contentSecurityPolicy(ads) },
];

/**
 * A Content-Security-Policy header attaches to the document, not to the route.
 * An App Router client-side transition does not replace it, so a soft navigation
 * would carry one page's policy — and any already-executed ad runtime — into the
 * next page. The site therefore uses plain <a> elements rather than next/link:
 * every navigation loads a new document, so each page gets its own policy and a
 * clean JavaScript context. Do not reintroduce next/link without moving this
 * boundary somewhere that survives client-side routing.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Exactly one of the following matches any given path.
      { source: "/guides/:path+", headers: policyHeader(true) },
      { source: "/guides", headers: policyHeader(false) },
      { source: "/", headers: policyHeader(false) },
      { source: "/:path((?!guides).*)", headers: policyHeader(false) },
    ];
  },
};

export default nextConfig;
