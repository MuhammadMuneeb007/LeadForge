# AdSense review readiness

This document records the code changes made to address two Google AdSense policy
findings — **Google-served ads on screens without publisher-content** and **low
value content** — and the configuration work that has to be done by hand in the
Google dashboards afterwards.

Nothing in the "manual" sections below has been performed by the code changes.
They are the site owner's responsibility.

## Publisher ID and ads.txt

- Publisher ID: `ca-pub-9384419506874151`
- `public/ads.txt` contains the matching record and was left unchanged:
  `google.com, pub-9384419506874151, DIRECT, f08c47fec0942fa0`

## What was fixed in the code

### Advertising placement

- **AdSense removed from the global root layout.** `src/app/layout.tsx` no longer
  injects the loader, so no URL loads advertising by default.
- **A single controlled loader component** was added at
  `src/components/ads/AdSenseScript.tsx` (using `next/script`). It is rendered
  explicitly, page by page.
- **The application workspace is excluded.** The homepage — search configuration,
  loading state, results, statistics, filters, map, list/split views, saved
  leads, the empty Saved state, CSV import, custom business entry and every error
  or notice state — loads no advertising script.
- **Policy and support pages are excluded.** `/privacy`, `/terms`, `/contact`,
  `/about` and `/about/data` load no advertising script.
- **Error pages are excluded.** A `not-found.tsx` was added; it carries no ads.
- **Replicated business data is never monetised.** No ad code exists in
  `LeadCard`, `LeadList`, `LeadMap`, the result statistics, the saved view, or
  any generated phone/email list.
- **Loading mechanism.** The loader uses `next/script` with the default
  `afterInteractive` strategy, so the served HTML carries a preload link for the
  script and the tag itself is added to `<head>` during hydration. If the AdSense
  dashboard ever reports that the ad code cannot be found on a guide page,
  replace the `<Script>` in `AdSenseScript.tsx` with a plain
  `<script async src={...} crossOrigin="anonymous" />` element — React hoists
  async script elements into `<head>` and renders them server-side, putting the
  tag directly in the HTML. Do not add both; that would load the script twice.
- **Only substantial original articles are monetised** — the four guides under
  `/guides/*`. No manual ad units were placed; the page-level loader is used, so
  placement is governed by Auto Ads settings in the AdSense dashboard.

### Content

New server-rendered, independently crawlable pages with original editorial
content, all written from the actual behaviour of this repository:

| Route | Purpose |
| --- | --- |
| `/about` | What LeadForge is, why it exists, data sources, local storage, limitations, responsible-use philosophy, open-source status |
| `/privacy` | Standalone privacy policy covering application data and advertising/Google disclosures |
| `/terms` | Terms and acceptable use |
| `/contact` | Support routes: bugs, features, data concerns, private security disclosure |
| `/guides` | Index of the educational resources |
| `/guides/how-leadforge-works` | Full workflow walkthrough |
| `/guides/open-business-data` | Open geographic data, coverage, verification, attribution |
| `/guides/responsible-business-outreach` | Verification, relevance, opt-outs, jurisdictional differences |
| `/guides/exporting-business-data` | Exports, CSV columns, import behaviour, cleaning, protecting the file |

The previous client-side "About" view inside the application was replaced by the
real `/about` URL. Its "Clear my local data" control moved with it, so no
functionality was lost.

### Crawling and metadata

- `src/app/robots.ts` — allows crawling, disallows `/api/`, points at the sitemap.
- `src/app/sitemap.ts` — lists the eleven public content URLs; no API routes and
  no generated per-location pages.
- Root metadata gained `metadataBase`, a title template, Open Graph, Twitter and
  robots metadata; the "public-beta" wording was removed.
- Every standalone page sets a unique title, description, canonical URL and Open
  Graph title/description.
- Factual JSON-LD only: `SoftwareApplication` on the homepage, `TechArticle` on
  each guide. No ratings, prices, review counts, author credentials or dates were
  invented.

### Security headers

The Content-Security-Policy is now built per route. Every route except the four
guide articles keeps the original policy **minus**
`https://pagead2.googlesyndication.com`, which is no longer needed there — that
includes the `/guides` index, which carries no ad script. Only the
`/guides/<article>` routes add the minimum Google advertising origins required by
the AdSense loader and Auto Ads:

- `script-src`: `pagead2.googlesyndication.com`, `*.googlesyndication.com`,
  `partner.googleadservices.com`, `adservice.google.com`,
  `googleads.g.doubleclick.net`
- `img-src`: `*.googlesyndication.com`, `*.doubleclick.net`, `*.google.com`,
  `*.gstatic.com`
- `connect-src`: `pagead2.googlesyndication.com`, `*.googlesyndication.com`,
  `googleads.g.doubleclick.net`, `*.google.com`
- `frame-src` and `fenced-frame-src`: `googleads.g.doubleclick.net`,
  `tpc.googlesyndication.com`, `www.google.com` (ad iframes; there was no
  `frame-src` directive before, so `default-src 'self'` would have blocked them)

`frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Content-Type-Options` and `Cross-Origin-Opener-Policy` are unchanged, and no
wildcard or `unsafe-*` source was added.

## Consent and privacy messaging — manual, required

No consent banner was written into this codebase. A homemade banner would not
satisfy Google's requirements, and claiming that it did would be worse than
having none.

Instead, `/privacy` is written to serve as the site's privacy-policy URL, and it
is deliberately free of any advertising script. **The site owner must configure
Google's Privacy & Messaging in the AdSense dashboard**, including a
Google-certified CMP / "European regulations" message for EEA, UK and Swiss
traffic, before relying on personalised advertising for those visitors.

## Manual checklist — Google AdSense

1. Confirm the site is still connected and authorised in the AdSense account.
2. Confirm `ads.txt` is detected (Sites → the site → ads.txt status) once the new
   deployment is live.
3. Set the privacy-policy URL to `https://leadforge-umber.vercel.app/privacy`.
4. Open **Privacy & messaging** and configure the European regulations message
   with a Google-certified CMP. Publish it and confirm it is live.
5. Review **Auto ads** settings. The page-level loader only runs on `/guides/*`,
   but check that no page-level override, ad-placement rule or experiment is
   configured that would place ads elsewhere.
6. Verify in a browser that the homepage, `/privacy`, `/terms`, `/contact`,
   `/about` and `/about/data` load no `adsbygoogle` request, and that a guide
   page does.
7. Only then request a new site review.

## Manual checklist — Google Search Console

1. Confirm the property is verified for the deployed domain.
2. Submit `https://leadforge-umber.vercel.app/sitemap.xml`.
3. Use URL Inspection on the homepage and on each guide URL; confirm each is
   crawlable and that the reported canonical matches the intended one.
4. Request indexing for `/about`, `/guides` and the four guide pages.
5. Check the Page Indexing report after a few days for anything excluded, and
   confirm `/robots.txt` reports no unexpected blocks.

## Manual checklist — deployment

1. Deploy to Vercel and wait for the build to finish.
2. Optionally set `NEXT_PUBLIC_SITE_URL` if the canonical domain ever changes;
   it defaults to `https://leadforge-umber.vercel.app`.
3. Spot-check `/robots.txt`, `/sitemap.xml` and `/ads.txt` on the live domain.
4. Confirm the application still works end to end: search, map, filters, save,
   contact discovery, import and each export.

## Editorial review before requesting a review

The guide, about, privacy, terms and contact pages were written for this
remediation and have not been read by a human maintainer. Read them before
submitting the site for review, and correct anything that does not match how you
want the project described.
