import type { Metadata } from "next";
import Link from "next/link";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { JsonLd } from "@/components/JsonLd";
import { DataAttribution } from "@/components/DataAttribution";
import { siteUrl } from "@/lib/site";

const title = "Exporting business data";
const description =
  "Every export LeadForge produces, what each CSV column holds, how importing works, and how to clean, de-duplicate and protect a list before it reaches a spreadsheet or CRM.";
const path = "/guides/exporting-business-data";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | LeadForge`, description, url: path },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function ExportGuide() {
  return (
    <>
      <AdSenseScript />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          description,
          url: `${siteUrl}${path}`,
          inLanguage: "en",
          isAccessibleForFree: true,
          about: "Exporting and importing business lists as CSV and GeoJSON",
        }}
      />
      <ContentNav
        label="Exporting business data"
        parent={{ href: "/guides", label: "Guides" }}
      />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">GUIDE</p>
          <h1>Getting a clean file out of LeadForge.</h1>
          <p>
            Exporting is where a browsing session turns into something you can
            work with. This guide covers what each export contains, the details
            of the CSV format that surprise people, how import behaves, and the
            clean-up worth doing before a list reaches a spreadsheet or a CRM.
          </p>
        </header>

        <div className="doc-body">
          <section>
            <h2>Decide what to export before you click</h2>
            <p>
              Every export button writes what is currently on screen, which
              means your filters are the selection mechanism. Narrow by
              category, city, distance or the presence of a phone number or
              website, and the export follows. The one exception is{" "}
              <strong>Export selected</strong>, which writes every record you
              have ticked — including ones a filter is currently hiding. That is
              deliberate: a shortlist you built by hand should not silently lose
              rows because you changed a filter afterwards.
            </p>
            <p>Five outputs are available from the results toolbar:</p>
            <ul>
              <li>
                <strong>Export all</strong> — every record matching the current
                filters.
              </li>
              <li>
                <strong>Export selected</strong> — only the records you ticked.
              </li>
              <li>
                <strong>Phone list</strong> — the filtered records that have a
                phone number.
              </li>
              <li>
                <strong>Email list</strong> — the filtered records that have at
                least one e-mail address.
              </li>
              <li>
                <strong>GeoJSON</strong> — the filtered records as geographic
                features.
              </li>
            </ul>
            <p>
              All of them are produced in your browser and download immediately
              — nothing is uploaded, and no copy is kept anywhere else. The
              phone and e-mail lists use the same columns as the full export;
              they are convenience filters, not different formats, so you keep
              the address and category context instead of ending up with a bare
              column of numbers.
            </p>
          </section>

          <section>
            <h2>What the CSV contains</h2>
            <p>
              Every CSV export uses the same seventeen columns, in this order:
            </p>
            <ul>
              <li>
                <code>business_name</code>, <code>category</code>,{" "}
                <code>city</code>, <code>country</code>, <code>address</code> —
                the identity of the record.
              </li>
              <li>
                <code>phone</code>, <code>email</code>, <code>website</code>,{" "}
                <code>opening_hours</code> — the contact fields, where they
                exist.
              </li>
              <li>
                <code>distance_km</code> — straight-line distance from your
                search centre, to two decimal places.
              </li>
              <li>
                <code>latitude</code>, <code>longitude</code>,{" "}
                <code>osm_url</code> — the location, and a link back to the
                underlying map record.
              </li>
              <li>
                <code>emails</code>, <code>socials</code> — every address and
                social profile found, separated by a semicolon and a space, so a
                record can carry more than one.
              </li>
              <li>
                <code>source</code>, <code>source_id</code> — where the record
                came from and its identifier in that source.
              </li>
            </ul>
            <p>
              The <code>source</code> column is worth understanding. Records
              found by searching are <code>openstreetmap</code>; ones you added
              by hand are <code>manual</code>; ones you brought in from a file
              are <code>imported</code>. Keeping that column, together with{" "}
              <code>source_id</code> and <code>osm_url</code>, is what lets you
              answer &ldquo;where did this row come from?&rdquo; six months
              later — and it is what makes the attribution obligations described
              in <Link href="/guides/open-business-data">the data guide</Link>{" "}
              practical to meet.
            </p>
            <p>
              Note that <code>email</code> and <code>emails</code> are not
              redundant. The first is the single address recorded in the map
              listing itself; the second is the full set, including anything
              contact discovery found on the business website.
            </p>
          </section>

          <section>
            <h2>Two CSV details that surprise people</h2>
            <p>
              <strong>Leading apostrophes.</strong> Any value beginning with{" "}
              <code>=</code>, <code>+</code>, <code>-</code> or <code>@</code>{" "}
              is written with a leading apostrophe. This is a deliberate safety
              measure: spreadsheet applications interpret those characters as
              the start of a formula, and a maliciously crafted field in an
              untrusted list could otherwise execute when the file is opened.
              The most visible effect is on international phone numbers, which
              start with <code>+</code>. The apostrophe is a spreadsheet
              text-marker rather than part of the value, and it can be stripped
              in bulk with a find-and-replace once the file is open — do that
              after import into your spreadsheet, not by editing the raw file.
            </p>
            <p>
              <strong>Everything is quoted.</strong> Fields are wrapped in
              double quotes and internal quotes are doubled, which is standard
              CSV escaping. Any tool that reads CSV properly will handle it. If
              a column looks wrong, the usual cause is opening the file by
              double-clicking rather than using your spreadsheet&rsquo;s import
              dialogue and specifying UTF-8 and comma separation — worth doing
              deliberately if your list contains accented business names.
            </p>
          </section>

          <section>
            <h2>When to use GeoJSON instead</h2>
            <p>
              The GeoJSON export writes a standard feature collection: one point
              feature per business, coordinates in longitude-latitude order,
              with the record&rsquo;s fields carried as feature properties. Use
              it when the question is geographic — territory planning, mapping
              coverage against your existing customers, or loading results into
              GIS software or another mapping tool. Use CSV when the question is
              about contacting people.
            </p>
            <p>
              The property set mirrors the CSV closely, with one difference
              worth knowing: it carries the record&rsquo;s internal identifier
              and omits the map link. If you need the link back to the map
              record, export the CSV as well.
            </p>
          </section>

          <section>
            <h2>Importing a list back in</h2>
            <p>
              <strong>Import CSV</strong> accepts a comma-separated file up to 5
              MB, and matches columns by header name rather than position. It
              recognises <code>business_name</code> (or{" "}
              <code>business name</code>, or <code>name</code>),{" "}
              <code>category</code> (or <code>business_type</code>),{" "}
              <code>city</code>, <code>country</code>, <code>address</code>,{" "}
              <code>phone</code> (or <code>phone_number</code>),{" "}
              <code>website</code> (or <code>url</code>), <code>email</code>,
              and <code>latitude</code>/<code>longitude</code> — including the{" "}
              <code>lat</code>, <code>lon</code> and <code>lng</code>{" "}
              abbreviations. Header matching is case-insensitive, so a file
              exported from another tool often works without editing.
            </p>
            <p>Three behaviours to plan around:</p>
            <ul>
              <li>
                <strong>A business name is required.</strong> Rows without one
                are skipped silently, so a row count that comes back lower than
                you expected usually means a blank or mislabelled name column.
              </li>
              <li>
                <strong>Coordinates matter.</strong> A row without usable
                latitude and longitude is imported, but it has no real position
                and will not sit anywhere meaningful on the map. If you want the
                map view to be useful, keep the coordinate columns.
              </li>
              <li>
                <strong>Import replaces the current result list</strong> and
                does not save anything by itself. Select the records you want
                and save them, exactly as you would after a search.
              </li>
            </ul>
            <p>
              A round trip is not lossless. Re-importing a LeadForge CSV
              preserves the name, category, city, country, address, phone,
              website, e-mail and coordinates; opening hours, social links,
              distance and the original source identifiers are not read back,
              and every imported row is marked <code>imported</code>. Treat
              exports as your archive, not as a save format to work from.
            </p>
          </section>

          <section>
            <h2>Cleaning a list before it goes anywhere</h2>
            <p>
              The tool removes duplicates within search results — records that
              share a source identifier, or a name and address, or a name and
              website domain, are merged, with populated fields kept over empty
              ones. That does not extend to imported files, and it cannot catch
              everything. Once your file is in a spreadsheet, a short cleaning
              pass pays for itself:
            </p>
            <ul>
              <li>
                <strong>Sort by name</strong> and scan for near-duplicates —
                &ldquo;The Corner Café&rdquo; and &ldquo;Corner Cafe&rdquo;
                merge on the eye but not on a key.
              </li>
              <li>
                <strong>De-duplicate on website domain,</strong> which catches
                chains and franchises listed under slightly different names.
              </li>
              <li>
                <strong>Check for branch versus head office</strong> where
                several rows share a domain, and decide which one you actually
                want to contact.
              </li>
              <li>
                <strong>Normalise phone numbers</strong> into one format before
                a dialer or CRM sees them.
              </li>
              <li>
                <strong>Drop columns you will not use.</strong> A calling list
                does not need coordinates or social links.
              </li>
              <li>
                <strong>Delete rows that failed verification</strong> rather
                than leaving them in with a note. Notes get ignored during a
                mail merge.
              </li>
            </ul>
          </section>

          <section>
            <h2>Verify before a CRM import, not after</h2>
            <p>
              A CRM is the worst place to discover that a record was wrong,
              because bad rows outlive the campaign that created them: they get
              assigned, reported on, re-contacted, and merged into other
              records. Do the verification described in{" "}
              <Link href="/guides/responsible-business-outreach">
                Responsible business outreach
              </Link>{" "}
              first, on the file.
            </p>
            <p>
              When you do import, map the provenance columns to real fields
              rather than dropping them — a source field and a link back to the
              original record turn an unexplainable row into a traceable one.
              Import into a staging list or with a distinguishing tag on the
              first run, check a sample by hand, and only then merge into your
              main database. And decide in advance what happens when an imported
              business already exists in the CRM; letting the system create
              duplicates is how a clean list becomes a mess.
            </p>
          </section>

          <section>
            <h2>Look after the file</h2>
            <p>
              While records are in LeadForge they stay in your own browser. Once
              you export, that protection ends and the file is an ordinary
              document containing contact information about real businesses.
              Treat it accordingly: store it somewhere access-controlled rather
              than a shared drive the whole company can read, avoid mailing it
              around as an attachment, and do not upload it to third-party
              services casually — a &ldquo;free enrichment&rdquo; tool that
              takes your list is being paid in your list.
            </p>
            <p>
              Delete exports when the work they were made for is finished. Old
              lead files accumulate quietly in download folders, decay into
              inaccuracy, and are exactly the sort of thing you do not want to
              still be holding without a reason. Inside the application, the
              same principle is one action: <strong>Clear my local data</strong>{" "}
              on the <Link href="/about">About page</Link> removes saved leads
              and search history from your browser.
            </p>
          </section>

          <section>
            <h2>Re-run rather than reuse</h2>
            <p>
              Map data changes: businesses open, close, move and rebrand. An
              export is a snapshot of a moment, not a maintained list, and its
              accuracy declines from the day it is created. For anything
              time-sensitive, re-run the search and compare against your
              previous file instead of trusting the old one — the difference
              between the two is often the most interesting part.
            </p>
          </section>
        </div>

        <div className="doc-actions">
          <Link className="doc-inline-link" href="/guides/how-leadforge-works">
            How LeadForge works →
          </Link>
          <Link
            className="doc-inline-link"
            href="/guides/responsible-business-outreach"
          >
            Responsible business outreach →
          </Link>
        </div>

        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
