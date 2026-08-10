# Data sources

## OpenStreetMap

Business records are read from OpenStreetMap using a bounded Overpass query around trusted GeoNames coordinates. Attribution: © OpenStreetMap contributors; database licensed under ODbL. Coverage and contact fields vary, so users must verify records.

## GeoNames

`scripts/build-city-index.ts` downloads the official `cities5000.zip` and `admin1CodesASCII.txt`, then builds `src/data/cities/cities.json`. GeoNames data is licensed under CC BY 4.0. The browser queries LeadForge’s own city endpoint; it does not geocode free-form locations live.

## MapLibre and OpenFreeMap

Map rendering uses open-source MapLibre GL JS and the OpenFreeMap Liberty style. Tile/style availability is independent of LeadForge; production operators should follow upstream usage rules.

## Public websites

Contact discovery is explicit and capped. The server reads a listing’s public homepage and at most one same-host contact/about page. It enforces HTTP(S), public DNS/IP destinations, redirect validation, time and byte limits, and low concurrency. It does not bypass authentication or robots/access controls.
