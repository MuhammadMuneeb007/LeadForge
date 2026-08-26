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

## Where advertising runs

**Monetised — these four routes load the AdSense script:**

- `/guides/how-leadforge-works`
- `/guides/open-business-data`
- `/guides/responsible-business-outreach`
- `/guides/exporting-business-data`

**Ad-free — everything else, including:**

- `/` and the entire application workspace: search configuration, loading
  states, results, statistics, filters, map, list/split views, Discover, Saved,
  the empty Saved state, CSV import, custom business entry, every error and
  notice state
- `/guides` — the index page carries no ad script
- `/about`, `/about/data`, `/privacy`, `/terms`, `/contact`
- the 404 page and all `/api/*` routes

No manual ad units were placed anywhere. The page-level loader is used, so
placement within the four articles is governed by Auto Ads settings in the
AdSense dashboard. There is no ad code in `LeadCard`, `LeadList`, `LeadMap`, the
result statistics, the saved view, the generated phone/email lists, the header
or its drop-downs, the table of contents, the previous/next navigation, the
callouts, or the footer.

## How the boundary is enforced

Three independent mechanisms, because any one of them alone has a failure mode.

### 1. The loader is rendered per page, not in a layout

`src/components/ads/AdSenseScript.tsx` is rendered explicitly by each of the four
article pages. It is not in the root layout and not in `GuideLayout`, so the set
of monetised pages is visible in a `grep` rather than implied by a shared
component. A unit test asserts that each article renders it and that the index,
about, privacy, terms and contact pages do not.

### 2. The loader is in the initial server-rendered HTML

The component renders a plain async `<script>` element rather than using
`next/script`. React hoists it into `<head>` during server rendering, so the tag
is present in the HTML that AdSense verification fetches, and React deduplicates
hoisted scripts by `src`, so a page can only ever load one. Verified on a
production build: each article serves exactly one `<script>` tag for the loader.

### 3. Navigation always loads a new document

A Content-Security-Policy header attaches to the **document**, not to the route,
and an App Router client-side transition does not replace it. With `next/link`
that produced two defects: navigating `/guides` → an article kept the
restrictive policy and blocked the ad loader, and navigating an article → the
workspace kept the article's policy *and* the already-executed ad runtime, so
Auto Ads could have placed ads on unmonetised screens.

The site therefore uses plain `<a>` elements instead of `next/link`, so every
navigation loads a new document with its own policy and a clean JavaScript
context. `@next/next/no-html-link-for-pages` is switched off in
`eslint.config.mjs` for that reason, and the notes in `next.config.ts` and
`AdSenseScript.tsx` say the same thing at the point of use. **Do not reintroduce
`next/link` without moving this boundary somewhere that survives client-side
routing.**

## Security headers

Every route, monetised articles included, receives:

`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` and `Cross-Origin-Opener-Policy`.

**Content-Security-Policy is applied to every route except the four monetised
articles.** This is a deliberate exception. Advertising needs a moving set of
Google and DoubleClick origins across the `script-src`, `frame-src`, `img-src`
and `connect-src` directives; enumerating them by hand is brittle, and when
Google adds an origin the failure mode is a silently empty ad slot rather than a
visible error. Rather than maintain that list — or weaken the policy everywhere
to accommodate it — the four article routes are exempted and everything else
keeps the strict policy, which contains **no advertising origins at all**:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://*.openfreemap.org https://tiles.openfreemap.org;
connect-src 'self' https://*.openfreemap.org https://tiles.openfreemap.org;
worker-src 'self' blob:; font-src 'self' data:; frame-ancestors 'none';
base-uri 'self'; form-action 'self'
```

The exemption is scoped by an explicit slug list in `next.config.ts`. A path that
merely looks like a new guide still receives the policy, so the safe case is the
default, and a unit test asserts that list matches `guides` in
`src/lib/navigation.ts`.

## Content

Server-rendered, independently crawlable pages with original editorial content,
all written from the actual behaviour of this repository:

| Route | Purpose |
| --- | --- |
| `/about` | What LeadForge is, why it exists, data sources, local storage, limitations, responsible-use philosophy, open-source status |
| `/privacy` | Standalone privacy policy covering application data and advertising/Google disclosures |
| `/terms` | Terms and acceptable use |
| `/contact` | Support routes: bugs, features, data concerns, private security disclosure |
| `/guides` | Editorial index of the four guides |
| `/guides/how-leadforge-works` | Full workflow walkthrough |
| `/guides/open-business-data` | Open geographic data, coverage, verification, attribution |
| `/guides/responsible-business-outreach` | Verification, relevance, opt-outs, jurisdictional differences |
| `/guides/exporting-business-data` | Exports, CSV columns, import behaviour, cleaning, protecting the file |

Each article has a hero with a category badge, a sticky table of contents built
from real section anchors, numbered sections, previous/next navigation and two
related guides. No reading times, view counts, ratings, author credentials or
publication dates were invented.

## Crawling and metadata

- `src/app/robots.ts` — allows crawling, disallows `/api/`, points at the sitemap.
- `src/app/sitemap.ts` — the eleven public content URLs; no API routes and no
  generated per-location pages.
- Root metadata sets `metadataBase`, a title template, Open Graph, Twitter and
  robots metadata. Every standalone page sets a unique title, description,
  canonical URL and Open Graph title/description.
- Factual JSON-LD only: `SoftwareApplication` on the homepage, `TechArticle` on
  each guide.

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
2. Confirm `ads.txt` is detected once the new deployment is live.
3. Set the privacy-policy URL to `https://leadforge-umber.vercel.app/privacy`.
4. Open **Privacy & messaging** and configure the European regulations message
   with a Google-certified CMP. Publish it and confirm it is live.
5. Review **Auto ads** settings. The loader only runs on the four article
   routes, but check that no page-level override, ad-placement rule or
   experiment is configured that would place ads elsewhere.
6. Verify in a browser that the homepage, `/guides`, `/privacy`, `/terms`,
   `/contact`, `/about` and `/about/data` issue no `adsbygoogle` request, and
   that an article page does.
7. Only then request a new site review.

## Manual checklist — Google Search Console

1. Confirm the property is verified for the deployed domain.
2. Submit `https://leadforge-umber.vercel.app/sitemap.xml`.
3. Use URL Inspection on the homepage and each guide URL; confirm each is
   crawlable and that the reported canonical matches the intended one.
4. Request indexing for `/about`, `/guides` and the four guide pages.
5. Check the Page Indexing report after a few days, and confirm `/robots.txt`
   reports no unexpected blocks.

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

Approval is Google's decision. Nothing here guarantees it.
