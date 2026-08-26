import type { NextConfig } from "next";

const developmentScriptPolicy =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

/**
 * The guide articles that load the AdSense script.
 *
 * Kept in step with `guides` in src/lib/navigation.ts by a unit test — this file
 * is loaded by the Next.js config loader before path aliases exist, so it
 * cannot import the list directly.
 */
const monetisedArticleSlugs = [
  "how-leadforge-works",
  "open-business-data",
  "responsible-business-outreach",
  "exporting-business-data",
];

/**
 * Content-Security-Policy for everything that is not a monetised article.
 *
 * Advertising needs a moving set of Google and DoubleClick origins across the
 * script, frame, image and connect directives. Enumerating them by hand is
 * brittle: an origin Google adds later is silently blocked, and the failure
 * looks like an empty ad slot rather than an error. So the four article routes
 * are exempt from CSP entirely — they still receive every other security
 * header — while every other route, meaning the whole application, the policy
 * pages and the /guides index, keeps this restrictive policy with no
 * advertising origins in it at all.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${developmentScriptPolicy}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.openfreemap.org https://tiles.openfreemap.org",
  "connect-src 'self' https://*.openfreemap.org https://tiles.openfreemap.org",
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** Applied to every route, monetised articles included. */
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

const policyHeader = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

/**
 * Matches every path except the monetised articles. Anything that merely looks
 * like a new guide still receives the policy, so the safe case is the default.
 */
const nonArticleSource = `/:path((?!guides/(?:${monetisedArticleSlugs.join("|")})).*)`;

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
      // At most one of the following matches a path; the articles match neither.
      { source: "/", headers: policyHeader },
      { source: nonArticleSource, headers: policyHeader },
    ];
  },
};

export default nextConfig;
