import type { Metadata } from "next";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { LocalDataControls } from "@/components/LocalDataControls";
import { DataAttribution } from "@/components/DataAttribution";
import { githubUrl } from "@/lib/site";

const title = "About LeadForge";
const description =
  "What LeadForge is, why it exists, which open datasets it reads, what stays in your browser, and the limits to assume before contacting any business.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `${title} | LeadForge`, description, url: "/about" },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function AboutPage() {
  return (
    <>
      <ContentNav label="About" />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">ABOUT LEADFORGE</p>
          <h1>A transparent prospecting workspace built around open data.</h1>
          <p>
            LeadForge is an open-source web application for finding businesses
            that already exist on the public map, reviewing what is genuinely
            known about them, and exporting the records you decide to keep. It
            is not a private contact database, and it does not promise that
            every listing is complete or current.
          </p>
        </header>

        <div className="doc-body">
          <section>
            <h2>What LeadForge actually is</h2>
            <p>
              LeadForge asks a public geographic database — OpenStreetMap —
              which businesses of a chosen type are mapped within a chosen
              radius of a chosen place. It then presents those listings as a
              filterable list and an interactive map, lets you shortlist the
              ones that look relevant, and exports the shortlist as CSV or
              GeoJSON.
            </p>
            <p>
              Everything it shows comes from data that is already public. There
              is no proprietary enrichment layer, no purchased contact file, and
              no scoring model that claims to know whether a business wants to
              buy anything. The only score in the product is a{" "}
              <strong>completeness score</strong>, and it measures exactly one
              thing: how many fields the public listing happens to contain.
            </p>
          </section>

          <section>
            <h2>Why it exists</h2>
            <p>
              Most local-business prospecting tools sit behind an account, a
              subscription, and a database whose provenance you cannot inspect.
              The same starting information — who is where, and what they do —
              is available in open data that anyone can query directly.
              LeadForge is a thin, honest interface over that open data: it
              shows where each record came from, tells you when a field is
              missing rather than guessing at it, and hands you the raw export
              instead of locking the list inside a platform.
            </p>
            <p>
              The trade-off is deliberate. You get transparency, portability and
              no vendor lock-in. You do not get guaranteed coverage, verified
              contact details, or any assurance that a business is in the market
              for what you sell. Those limits are stated throughout the product
              because they are real.
            </p>
          </section>

          <section>
            <h2>The map-first workflow</h2>
            <p>
              A LeadForge session follows one path. You pick a country and city,
              adjust the search centre on the map if the city centroid is not
              where you want to look, set a radius between 1 and 50 kilometres,
              and choose up to three business types — from the built-in
              categories or as a free-text term such as <em>bus station</em>.
              The search then queries public map data around that point.
            </p>
            <p>
              Results arrive as individual businesses, each carrying whatever
              the public record holds: name, category, address, coordinates,
              distance from your search centre, and sometimes a phone number,
              website, e-mail address or opening hours. You can review them as a
              list, as a map, or side by side, filter and sort them, and select
              the ones worth keeping. The full walkthrough is in{" "}
              <a href="/guides/how-leadforge-works">How LeadForge works</a>.
            </p>
          </section>

          <section>
            <h2>Where the data comes from</h2>
            <h3>OpenStreetMap</h3>
            <p>
              Business listings are read from OpenStreetMap through bounded
              Overpass queries built around the coordinates you chose. Category
              selections map to real OpenStreetMap tags — a dentist search looks
              for <code>amenity=dentist</code>, a pharmacy search for{" "}
              <code>amenity=pharmacy</code> — so the results are ordinary map
              features, contributed and maintained by volunteers.
            </p>
            <h3>GeoNames</h3>
            <p>
              City and region suggestions come from a city index built from
              GeoNames data and shipped with the application. Typing a city name
              queries that local index rather than sending every keystroke to a
              live geocoding service, and the coordinates it returns are what
              anchor the map search.
            </p>
            <h3>OpenFreeMap</h3>
            <p>
              The map is rendered by MapLibre GL JS using the OpenFreeMap
              Liberty style. Map tiles are requested by your browser directly
              from the tile host as you pan and zoom. Operators who deploy their
              own copy of LeadForge can point it at a different compatible map
              style.
            </p>
            <h3>Public business websites</h3>
            <p>
              Contact discovery is separate, optional and explicit. When you ask
              for it on specific listings, the server fetches that business
              website — its public homepage, and at most one same-site contact
              or about page — and reads publicly visible e-mail addresses,
              telephone links and social profile links. It refuses private
              network destinations, follows only a small number of redirects,
              caps response size, and does not attempt to bypass logins or other
              access controls.
            </p>
          </section>

          <section>
            <h2>What stays in your browser</h2>
            <p>
              LeadForge has no accounts and no central customer database. The
              lists you build live in IndexedDB inside the browser you built
              them in:
            </p>
            <ul>
              <li>
                <strong>Saved leads</strong> — the businesses you explicitly
                save, up to 200 records.
              </li>
              <li>
                <strong>Recent searches</strong> — your last five searches,
                stored with their results so you can look back at them.
              </li>
            </ul>
            <p>
              Nothing in that store is synchronised to a server, and clearing it
              is a single action, available at the bottom of this page. Because
              the store is per-browser, a saved list does not follow you to
              another device — export it if you need it elsewhere. The full
              picture, including what each request sends where, is in the{" "}
              <a href="/privacy">privacy policy</a>.
            </p>
          </section>

          <section>
            <h2>Getting the data out</h2>
            <p>
              Anything you can see, you can export. LeadForge writes CSV files
              for the full filtered list, for just the records you selected, for
              the subset that has phone numbers, and for the subset that has
              e-mail addresses — plus GeoJSON when you want the results as
              geographic features rather than rows. It also imports CSV, so a
              list you exported earlier, or built somewhere else, can be brought
              back in and viewed on the map. See{" "}
              <a href="/guides/exporting-business-data">
                Exporting business data
              </a>{" "}
              for the column layout and the cleaning steps worth doing first.
            </p>
          </section>

          <section>
            <h2>Limitations worth knowing before you rely on it</h2>
            <ul>
              <li>
                <strong>Coverage varies.</strong> OpenStreetMap is contributed
                by volunteers. A dense city centre may be mapped thoroughly
                while an outer suburb is barely mapped at all, and an absent
                business is not evidence that it does not exist.
              </li>
              <li>
                <strong>Fields are frequently missing.</strong> Many listings
                have no phone number, website or opening hours. LeadForge shows
                the gap rather than filling it with a guess.
              </li>
              <li>
                <strong>Records can be out of date.</strong> A business may have
                moved, closed or been renamed since the listing was last edited.
              </li>
              <li>
                <strong>A map listing is not a business registry.</strong>{" "}
                Nothing in the data confirms trading status, ownership, or that
                a contact address is the right one to write to.
              </li>
              <li>
                <strong>No intent signal exists.</strong> LeadForge cannot tell
                you that a business is looking to buy. It tells you that a
                business of a given type is mapped at a given place.
              </li>
            </ul>
            <p>
              The practical consequence is simple: verify each record before you
              act on it. Every result screen in the product says so, and it is
              not a formality.
            </p>
          </section>

          <section>
            <h2>How we think about responsible use</h2>
            <p>
              Public data being accessible does not make every use of it
              appropriate. LeadForge is built for looking up businesses you have
              a genuine reason to contact — not for indiscriminate bulk
              messaging. The product reflects that: contact discovery is opt-in
              and capped rather than automatic, searches are geographically
              bounded rather than unlimited, and exports contain the records you
              selected rather than everything the map holds.
            </p>
            <p>
              Marketing, privacy and anti-spam rules differ by jurisdiction and
              they are your responsibility to follow.{" "}
              <a href="/guides/responsible-business-outreach">
                Responsible business outreach
              </a>{" "}
              sets out the practices we expect of anyone using this tool, and
              the <a href="/terms">terms of use</a> state what is not
              acceptable.
            </p>
          </section>

          <section>
            <h2>Open source</h2>
            <p>
              LeadForge is released under the MIT License and the entire source
              — search logic, category mappings, contact-discovery safeguards
              and all — is public. You can read exactly how a query is built,
              run your own copy against your own Overpass endpoint, or fork it.
              Issues and pull requests are welcome on{" "}
              <a href={githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              ; see the <a href="/contact">contact page</a> for how to report a
              bug, ask for a feature, or disclose a security problem privately.
            </p>
          </section>
        </div>

        <div className="about-grid">
          <article>
            <span>01</span>
            <h2>Search responsibly</h2>
            <p>
              Queries are geographically bounded and use public OpenStreetMap
              listings. Coverage varies, so every record should be verified.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Keep control</h2>
            <p>
              Saved leads and recent searches stay inside this browser.
              LeadForge does not operate a central customer database.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>Export cleanly</h2>
            <p>
              Choose the records you need and export CSV, phone lists, email
              lists, or GeoJSON for your own workflow.
            </p>
          </article>
        </div>

        <div className="about-details">
          <div>
            <p className="kicker">WHAT IT DOES</p>
            <h2>Useful tools, without pretending the data is perfect.</h2>
          </div>
          <ul>
            <li>Worldwide country and city selection</li>
            <li>Radius-based map search and individual business nodes</li>
            <li>Public website contact discovery on request</li>
            <li>Local saved lists, filters, sorting, and exports</li>
          </ul>
        </div>

        <div className="doc-actions">
          <a className="doc-inline-link" href="/guides">
            Read the guides →
          </a>
          <a className="doc-inline-link" href="/about/data">
            Data and attribution →
          </a>
          <a className="doc-inline-link" href="/privacy">
            Privacy policy →
          </a>
        </div>

        <LocalDataControls />
        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
