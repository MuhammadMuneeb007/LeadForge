import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { DataAttribution } from "@/components/DataAttribution";

const title = "Data sources, privacy and attribution";
const description =
  "Where every LeadForge result comes from: OpenStreetMap listings, the GeoNames city index, OpenFreeMap tiles, optional website contact discovery, and local browser storage.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/data" },
  openGraph: { title: `${title} | LeadForge`, description, url: "/about/data" },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function DataPage() {
  return (
    <>
      <SiteHeader />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">DATA, PRIVACY &amp; ATTRIBUTION</p>
          <h1>Know exactly where every result comes from.</h1>
          <p>LeadForge combines open geographic data with local browser storage. It does not sell a private leads database or promise that every public listing is complete.</p>
        </header>
        <section className="data-principles">
          <article><strong>No account</strong><p>You can search, review, save, and export without creating a profile.</p></article>
          <article><strong>Local storage</strong><p>Saved records and search history stay in IndexedDB in your browser.</p></article>
          <article><strong>Manual enrichment</strong><p>Public websites are inspected only when you request contact discovery.</p></article>
        </section>
        <section className="source-list">
          <div><span>01</span><article><h2>OpenStreetMap business listings</h2><p>Geographically bounded Overpass queries provide names, categories, addresses, coordinates, websites, phones, and opening hours when contributors have supplied them. Records may be incomplete or outdated.</p></article></div>
          <div><span>02</span><article><h2>GeoNames city search</h2><p>A locally built country-aware city index powers suggestions without sending each keystroke to a live geocoding service.</p></article></div>
          <div><span>03</span><article><h2>OpenFreeMap map tiles</h2><p>MapLibre GL JS renders the map using the OpenFreeMap Liberty style. Operators can configure another compatible map style.</p></article></div>
          <div><span>04</span><article><h2>Public website contacts</h2><p>On request, LeadForge checks a listing’s public homepage and at most one same-site contact or about page. It blocks private-network destinations and does not bypass access controls.</p></article></div>
        </section>
        <section className="data-callout">
          <div><p className="kicker">RESPONSIBLE USE</p><h2>Treat every result as a starting point.</h2></div>
          <p>Verify contact details, follow local privacy and marketing laws, respect opt-out requests, and contact businesses with a relevant reason—not indiscriminate spam.</p>
        </section>
        <div className="doc-actions">
          <a className="doc-inline-link" href="/privacy">
            Full privacy policy →
          </a>
          <a className="doc-inline-link" href="/guides/open-business-data">
            Working with open business data →
          </a>
          <a className="doc-inline-link" href="/about">
            About LeadForge →
          </a>
        </div>
        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
