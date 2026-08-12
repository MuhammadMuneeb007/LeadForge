import type { NextConfig } from "next";

const developmentScriptPolicy = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), camera=(), microphone=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value:
      `default-src 'self'; script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.openfreemap.org https://tiles.openfreemap.org; connect-src 'self' https://*.openfreemap.org https://tiles.openfreemap.org; worker-src 'self' blob:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
