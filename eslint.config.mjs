import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // The site navigates by full document loads on purpose: a
      // Content-Security-Policy attaches to the document, so a client-side
      // transition would carry one page's policy — and any already-executed ad
      // runtime — into the next page. See the note in next.config.ts.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    ".venv/**",
    "legacy-python/**",
    "data/**",
    "coverage/**",
  ]),
]);
