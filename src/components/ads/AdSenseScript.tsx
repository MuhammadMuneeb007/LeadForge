const client = "ca-pub-9384419506874151";

/**
 * Google AdSense page-level loader.
 *
 * Rendered as a plain async <script> rather than next/script so React hoists it
 * into <head> during server rendering: the tag is then present in the initial
 * HTML of the article, where AdSense verification looks for it. React
 * deduplicates hoisted scripts by src, so a page can only ever load one.
 *
 * Render this only on substantial original editorial pages. It is deliberately
 * absent from the root layout, the application workspace, result and map
 * screens, error states, the /guides index, and the about, privacy, terms and
 * contact pages.
 *
 * The exclusion holds only because the site navigates by full document loads.
 * Once this script has run, its ad runtime lives in the JavaScript context, and
 * a client-side transition to an unmonetised page would take that runtime with
 * it. See the note in next.config.ts before adding next/link anywhere.
 */
export function AdSenseScript() {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
