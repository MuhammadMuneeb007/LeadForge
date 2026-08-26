import type { Metadata } from "next";
import Link from "next/link";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { JsonLd } from "@/components/JsonLd";
import { DataAttribution } from "@/components/DataAttribution";
import { siteUrl } from "@/lib/site";

const title = "Working with open business data";
const description =
  "How open geographic data records businesses, why coverage and contact fields vary so much, what GeoNames and OpenFreeMap contribute, and why a map listing is not a business registry.";
const path = "/guides/open-business-data";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | LeadForge`, description, url: path },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function OpenDataGuide() {
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
          about: "Open geographic data and its use for business discovery",
        }}
      />
      <ContentNav
        label="Working with open business data"
        parent={{ href: "/guides", label: "Guides" }}
      />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">GUIDE</p>
          <h1>What open business data can and cannot tell you.</h1>
          <p>
            LeadForge is only as good as the data underneath it, and that data
            has a particular character: volunteer-maintained, unevenly complete,
            generously licensed, and never authoritative about whether a
            business is trading. Understanding how it is produced is the
            difference between using it well and being surprised by it.
          </p>
        </header>

        <div className="doc-body">
          <section>
            <h2>What &ldquo;open data&rdquo; actually means here</h2>
            <p>
              Open data is data anyone may use, modify and share, subject to
              conditions such as attribution. That is a licensing statement
              rather than a quality statement — and the distinction matters. A
              dataset can be entirely open and still be patchy, out of date, or
              inconsistent between neighbourhoods. Openness tells you what you
              are allowed to do with the data. It says nothing about whether the
              café on the corner is in it.
            </p>
            <p>
              Open geographic data specifically describes things by location:
              points, lines and areas with attributes attached. A business
              appears not as a row in a company database but as a map feature —
              a point in a shopping street, or the outline of a building —
              carrying attributes that say what it is.
            </p>
          </section>

          <section>
            <h2>How OpenStreetMap records a business</h2>
            <p>
              OpenStreetMap is a global map built by volunteers, in the same
              collaborative spirit as an open encyclopaedia. Contributors map
              what they can verify on the ground, and they describe features
              using <strong>tags</strong>: simple key-value pairs agreed by
              community convention. A dental practice is typically a point
              tagged <code>amenity=dentist</code>; a chemist,{" "}
              <code>amenity=pharmacy</code>; a gym,{" "}
              <code>leisure=fitness_centre</code>; an accountancy firm,{" "}
              <code>office=accountant</code>.
            </p>
            <p>
              LeadForge queries exactly those tags. When you tick{" "}
              <em>Pharmacy</em>, the application asks the map for features
              tagged as pharmacies within your radius — not for the word
              &ldquo;pharmacy&rdquo; in a name. This is why the categories
              behave consistently across countries, and why a business whose
              tagging is unusual can be entirely absent from a category search
              while sitting perfectly visible on the map.
            </p>
            <p>
              Custom search terms work differently by necessity. A free-text
              term is matched both against feature names and against the common
              tagging keys, which is what lets you look for a specific chain by
              name or a type nobody has added to the built-in list. It is more
              flexible and less predictable — the trade-off is unavoidable.
            </p>
          </section>

          <section>
            <h2>The fields a listing may carry</h2>
            <p>
              Beyond the tag that says what a business is, a record may hold:
            </p>
            <ul>
              <li>
                <strong>Name</strong> — and, where a name is missing, sometimes
                a brand or operator instead.
              </li>
              <li>
                <strong>Address components</strong> — house number, street,
                suburb, city, state, postcode, recorded as separate attributes
                and assembled into a readable address.
              </li>
              <li>
                <strong>Phone</strong> — sometimes as a general contact number,
                sometimes as a mobile, occasionally both.
              </li>
              <li>
                <strong>Website</strong> and <strong>e-mail</strong> — recorded
                under a small family of contact keys.
              </li>
              <li>
                <strong>Social profiles</strong> — links to the business on the
                major platforms.
              </li>
              <li>
                <strong>Opening hours</strong> — in a compact, structured
                notation designed to express things like weekday hours plus
                Saturday mornings plus public-holiday closures.
              </li>
              <li>
                <strong>Coordinates</strong> — always present, since the record
                is fundamentally a map feature.
              </li>
            </ul>
            <p>
              Only the location and the type are effectively guaranteed.
              Everything else is optional, and in practice much of it is
              missing.
            </p>
          </section>

          <section>
            <h2>Why coverage varies so much</h2>
            <p>
              Because the map is made by people who choose what to map, its
              completeness follows human attention rather than commercial
              importance. Several patterns show up repeatedly once you start
              running searches in different places:
            </p>
            <ul>
              <li>
                <strong>Cities beat rural areas.</strong> More contributors live
                in cities, so city centres tend to be mapped densely and outer
                areas thinly.
              </li>
              <li>
                <strong>Some categories attract more attention.</strong>{" "}
                Restaurants, cafés and shops are mapped enthusiastically.
                Office-based businesses — consultancies, agencies, small
                professional firms — are mapped far less, because there is
                nothing on the street to prompt someone to add them.
              </li>
              <li>
                <strong>Local mapping communities differ.</strong> Some
                countries and cities have active groups, organised imports, and
                long-standing tagging conventions. Others do not. Coverage can
                change noticeably at a border.
              </li>
              <li>
                <strong>Recency varies.</strong> A record added five years ago
                and never revisited still looks exactly like one added last
                week.
              </li>
            </ul>
            <p>
              The practical consequence: an empty result is ambiguous. It may
              mean there are no such businesses in that radius, or that nobody
              has mapped them. Before concluding a market is empty, widen the
              radius, try a related category, and check a place you already know
              — if a business you can see from your window is missing, you are
              looking at a coverage gap, not a market gap.
            </p>
          </section>

          <section>
            <h2>Why the phone number is so often missing</h2>
            <p>
              Contact details are the least complete part of the data, and the
              reasons are structural rather than accidental. Mapping a shop
              front requires only what a contributor can see; recording a phone
              number requires the contributor to find and transcribe it, and
              recording opening hours requires learning a compact notation that
              takes a little effort. Contact details also change more often than
              buildings do, so they decay faster than anything else in the
              record.
            </p>
            <p>
              There is also a verifiability principle at work: contributors are
              expected to record what can be checked, and a phone number on a
              sign is easier to justify than one found on a third-party
              directory. The result is a dataset that is stronger on{" "}
              <em>where</em> and <em>what</em> than on{" "}
              <em>how to get in touch</em>.
            </p>
            <p>
              That is precisely the gap LeadForge&rsquo;s optional contact
              discovery addresses, by reading what a business publishes on its
              own website. It is worth being clear about what that does and does
              not change: it can supply an address the map never had, but it
              cannot confirm that the business is still trading or that the
              address is the right destination for your message.
            </p>
          </section>

          <section>
            <h2>Why every record still needs verification</h2>
            <p>
              Nothing in this data is validated at the point of entry. There is
              no registrar, no annual filing, no confirmation step. A record can
              be duplicated by two contributors, attached to the wrong unit in a
              multi-tenant building, describe a business that closed last year,
              or use a name in a form nobody locally would recognise.
            </p>
            <p>
              LeadForge reduces some of this — it merges records that look like
              the same business and shows how complete each listing is — but
              merging duplicates is not the same as confirming existence. Before
              you use a record, open the website, check the name and address
              agree, and confirm the contact detail against the source that the
              business itself controls.
            </p>
          </section>

          <section>
            <h2>What GeoNames contributes</h2>
            <p>
              GeoNames is a separate open geographic database of place names —
              cities, towns, administrative regions, and their coordinates.
              LeadForge uses it for one specific job: turning &ldquo;Brisbane,
              Queensland&rdquo; into a trustworthy pair of coordinates to search
              around.
            </p>
            <p>
              The index is built ahead of time and bundled with the application,
              which has two consequences worth knowing. City suggestions are
              instant and your typing is not sent to an external geocoding
              service. And the index is a snapshot: it covers populated places
              above a size threshold, so a very small village may not appear as
              a suggestion. When that happens, pick the nearest listed town and
              drag the map pin to where you actually want the search centred.
            </p>
          </section>

          <section>
            <h2>What OpenFreeMap contributes</h2>
            <p>
              The business data and the map you look at come from different
              places. OpenFreeMap serves the visual basemap — the streets, water
              and labels — as vector tiles, rendered in your browser by MapLibre
              GL JS, an open-source rendering library.
            </p>
            <p>
              The distinction matters when something looks wrong. If a business
              is missing or misplaced, that is the business data. If the map
              renders slowly, looks unstyled, or fails to load, that is the tile
              layer, and it has no bearing on the accuracy of your results.
              These are free, publicly provided services; treating them
              considerately — and, for anyone self-hosting a busy deployment,
              providing their own infrastructure — is part of using them
              responsibly.
            </p>
          </section>

          <section>
            <h2>A map listing is not a business registry</h2>
            <p>
              This is the single most important thing to internalise. An
              authoritative registry — a companies register, a licensing body, a
              tax authority — records legal entities, has a defined process for
              registration and removal, is maintained by an accountable
              organisation, and can be relied upon as evidence of existence.
            </p>
            <p>
              A map listing records that somebody observed a business at a
              location and described it. It has no legal status, no defined
              lifecycle, and no accountable maintainer for any individual
              record. It is excellent for discovery — for answering &ldquo;what
              is around here?&rdquo; — and it is not evidence of anything. Use
              open map data to find candidates; use authoritative sources when
              you need to be certain who you are dealing with.
            </p>
          </section>

          <section>
            <h2>Attribution and licensing</h2>
            <p>
              Open licences carry conditions. OpenStreetMap data is ©
              OpenStreetMap contributors and licensed under the Open Database
              License, which requires attribution and can require derivative
              databases to be shared under the same terms. The GeoNames data
              behind the city index is licensed under Creative Commons
              Attribution. Map tiles and styles are provided by OpenFreeMap.
            </p>
            <p>
              LeadForge credits all three wherever results are displayed. If you
              republish, share or build a product on records exported from here,
              the same obligations follow the data to you — keeping the source
              and source-identifier columns in your exports makes that far
              easier to honour later. The{" "}
              <Link href="/about/data">data and attribution page</Link> lists
              each source and its licence.
            </p>
          </section>

          <section>
            <h2>Using open datasets responsibly</h2>
            <p>
              Open data depends on shared infrastructure and volunteer labour,
              and both can be exhausted. Query the area you actually need rather
              than sweeping a whole region. Accept the rate limits and result
              caps instead of working around them. Do not point automated
              pipelines at public endpoints intended for interactive use.
            </p>
            <p>
              And consider contributing back. If you verify during your research
              that a business has moved, closed, or has a new phone number, that
              correction is welcome in OpenStreetMap and improves the map for
              everyone who queries it next — including you, the next time you
              run this search. Then read{" "}
              <Link href="/guides/responsible-business-outreach">
                Responsible business outreach
              </Link>{" "}
              for what to do with the list once you trust it.
            </p>
          </section>
        </div>

        <div className="doc-actions">
          <Link className="doc-inline-link" href="/guides/how-leadforge-works">
            How LeadForge works →
          </Link>
          <Link className="doc-inline-link" href="/about/data">
            Data and attribution →
          </Link>
        </div>

        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
