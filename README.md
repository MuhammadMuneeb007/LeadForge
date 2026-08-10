# LeadForge

LeadForge is a self-hostable local-business discovery app built entirely on open data. Choose a country, city, radius, and up to three supported categories; it returns public business records that can be mapped, filtered, enriched from their public websites, saved locally, and exported.

**Live demo:** [leadforge-umber.vercel.app](https://leadforge-umber.vercel.app)

**Source:** [github.com/MuhammadMuneeb007/LeadForge](https://github.com/MuhammadMuneeb007/LeadForge)

## Live product demo

[![Open the live LeadForge demo](docs/assets/leadforge-demo.gif)](https://leadforge-umber.vercel.app)

**[Launch LeadForge →](https://leadforge-umber.vercel.app)**

No account, paid data API, server database, browser automation, or email provider is required.

## Stack and data

- Next.js 16, React 19, strict TypeScript
- OpenStreetMap business data through Overpass
- GeoNames `cities5000` offline city autocomplete
- MapLibre GL JS and the OpenFreeMap Liberty style
- IndexedDB search history and saved leads
- CSV and GeoJSON serialization
- SSRF-protected, opt-in public website contact discovery

OpenStreetMap coverage varies and is not a statement of buying intent. Verify every record and follow applicable privacy, anti-spam, and outreach laws.

## Run locally

Requires Node.js 20.9+.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. If port 3000 is already occupied, use `npm run dev -- -p 3001`.

The committed city index is ready to use. Refresh it from official GeoNames files with:

```powershell
npm run data:cities
```

## Configuration

See `.env.example`. `BUSINESS_DATA_PROVIDER=osm` is the default. `mock` provides deterministic local/demo results. The `overture` choice is an intentionally disabled extension point until a bounded spatial GeoParquet backend is configured.

The default public Overpass and map infrastructure is suitable for considerate interactive use, not bulk extraction. Search limits, caching, request coalescing, response caps, timeouts, and per-instance rate limits are built in. For commercial traffic, operate appropriate infrastructure and add platform-level distributed rate limiting/WAF rules.

## Commands

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

See [data sources](docs/DATA-SOURCES.md), [deployment](docs/DEPLOYMENT.md), and the in-app `/about/data` page.

## License

Application code: MIT. Upstream datasets and tiles retain their own licenses and attribution requirements.
