import Script from "next/script";

const client = "ca-pub-9384419506874151";

/**
 * Google AdSense page-level loader.
 *
 * Render this only on substantial original editorial pages. It is deliberately
 * absent from the root layout, the application workspace, result and map
 * screens, error states, and the privacy, terms and contact pages.
 */
export function AdSenseScript() {
  return (
    <Script
      id="adsense-loader"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
    />
  );
}
