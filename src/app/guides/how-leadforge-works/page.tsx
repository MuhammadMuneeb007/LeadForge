import type { Metadata } from "next";
import Link from "next/link";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { JsonLd } from "@/components/JsonLd";
import { DataAttribution } from "@/components/DataAttribution";
import { siteUrl } from "@/lib/site";

const title = "How LeadForge works";
const description =
  "A step-by-step walkthrough of a LeadForge search: choosing a location and radius, picking business types, reading the results, saving a shortlist, running contact discovery and exporting it.";
const path = "/guides/how-leadforge-works";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | LeadForge`, description, url: path },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function HowItWorksGuide() {
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
          about: "Local business discovery using open geographic data",
        }}
      />
      <ContentNav
        label="How LeadForge works"
        parent={{ href: "/guides", label: "Guides" }}
      />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">GUIDE</p>
          <h1>How LeadForge works, step by step.</h1>
          <p>
            A LeadForge session is one continuous path: define an area, ask the
            public map what is there, judge what comes back, keep the useful
            records, and take them with you. This guide walks through each stage
            and explains what the application is doing underneath, so you can
            tell the difference between a search that found nothing and an area
            that has nothing mapped.
          </p>
        </header>

        <div className="doc-body">
          <section>
            <h2>1. Choose the country and place</h2>
            <p>
              Start with the country selector, then type a city or region name.
              Suggestions come from a city index of roughly 70,000 places, built
              from GeoNames and shipped inside the application, so the list
              responds instantly and your keystrokes are not sent to an external
              geocoder. Choosing a suggestion sets both the place name and the
              coordinates that anchor the search — the application never guesses
              a location from free text.
            </p>
            <p>
              The search opens on Brisbane, Queensland by default so there is
              always something to run. If you would rather start from where you
              are, <strong>Use my current location</strong> asks the browser for
              permission, then matches those coordinates to the nearest city in
              the same local index.
            </p>
            <p>
              A city centroid is rarely the exact centre of the area you care
              about. The map beside the form is interactive: click anywhere or
              drag the pin to move the search centre, and the coordinates above
              the map update as you go. This matters more than it looks — a 10
              km circle drawn from a city centre and a 10 km circle drawn from a
              suburb cover very different sets of businesses.
            </p>
          </section>

          <section>
            <h2>2. Choose the business types</h2>
            <p>
              You can select up to three types per search. The built-in list
              covers 25 common categories — dentist, restaurant, café, pharmacy,
              gym, accountant, lawyer, real estate agent, car repair, hotel,
              barber, beauty salon, supermarket, bakery, veterinarian, school,
              clinic, hospital, IT company, marketing agency, bank, fuel
              station, bus station, electronics store and physiotherapist — and
              the filter box above them searches both the labels and their
              aliases, so typing <em>chemist</em> finds the pharmacy category
              and <em>law firm</em> finds lawyers.
            </p>
            <p>
              Each category maps to specific tags in the underlying map data.
              That is why the categories behave predictably: choosing{" "}
              <em>Pharmacy</em> is not a keyword search for the word pharmacy,
              it is a request for features tagged as pharmacies.
            </p>
            <p>
              When nothing in the list fits, the custom type field takes any
              term between 2 and 60 characters — a type such as{" "}
              <em>bus station</em>, or a specific business name. A custom term
              is matched two ways at once: against feature names, and against
              the common tagging keys for amenities, shops, offices, tourism,
              leisure, healthcare and public transport. That dual approach is
              what lets a single box handle both &ldquo;a kind of place&rdquo;
              and &ldquo;this particular chain&rdquo;.
            </p>
            <p>
              The counter at the bottom of the panel keeps the three selections,
              the radius and the result cap visible in one line before you
              commit to a search.
            </p>
          </section>

          <section>
            <h2>3. Set the radius and the result cap</h2>
            <p>
              The radius slider runs from 1 to 50 kilometres and the result cap
              from 10 to 200 businesses. Both change the cost of the query, not
              just its size. A small radius returns faster and gives you a
              tighter, more workable list; a 50 km radius over a dense city can
              take noticeably longer and may return more records than you will
              realistically review.
            </p>
            <p>
              A useful habit is to start at 5–10 km. If the area turns out to be
              thinly mapped, widen it; if you are drowning in results, narrow it
              or drop a category rather than raising the cap.
            </p>
          </section>

          <section>
            <h2>4. What happens when you press search</h2>
            <p>
              The application sends your parameters to its own API, which builds
              a geographically bounded query — one clause per category, each
              restricted to your radius around your coordinates — and sends it
              to a public Overpass endpoint, the standard query service for
              OpenStreetMap data. Nothing about you goes with it; the query
              describes an area and a set of tags.
            </p>
            <p>
              Three things then protect the shared service everyone depends on.
              Identical queries are answered from a short-lived server-side
              cache rather than repeated upstream. Searches are rate limited per
              visitor. And the query itself carries a timeout, so a request that
              cannot be answered fails cleanly instead of hanging. If you see a
              message asking you to wait, or suggesting a smaller radius, that
              is one of these limits doing its job — the public map service is a
              community resource, not a commercial API with capacity to burn.
            </p>
            <p>
              Typical searches complete in a handful of seconds. Large radii
              with several categories take longer, and a search that exceeds the
              client-side time limit will tell you so and suggest a 5–10 km
              radius.
            </p>
          </section>

          <section>
            <h2>5. Reading the results</h2>
            <p>
              Each raw map feature is converted into a business record before
              you see it. The name comes from the feature name, or a brand or
              operator when no name is set. The address is assembled from
              individual address components — house number, street, suburb,
              city, state, postcode — or taken whole where a full address is
              recorded. Phone numbers, websites, e-mail addresses, social links
              and opening hours are pulled from their standard tags, and the
              straight-line distance from your search centre is calculated for
              every record.
            </p>
            <p>
              Before the list reaches you it is ordered so that records with a
              phone number or website come first and, within that, the nearest
              come first — then it is cut to your result cap. That ordering is
              deliberate: if you asked for 50 businesses out of 300 candidates,
              the 50 you get are the ones you can actually act on.
            </p>
            <p>
              Duplicates are merged on the way through. Two records are treated
              as the same business if they share a source identifier, or share a
              name and address, or share a name and website domain. When records
              merge, populated fields win over empty ones, so the surviving
              record is the more complete of the two.
            </p>
            <p>
              Every card shows a <strong>completeness</strong> percentage. It is
              a plain arithmetic description of the record, not a judgement
              about the business: a listing starts at 20 and gains 15 for an
              address, 20 for a phone number, 20 for a website, 15 for an e-mail
              address, 5 for opening hours and 5 for coordinates. A 100%
              business is not a better prospect than a 40% one — it is simply a
              record you have to do less work to verify.
            </p>
            <p>
              The four counters above the list — total businesses, phone
              numbers, websites, e-mails — recount as you filter, which makes
              them a quick way to test whether an area is worth pursuing at all
              before you start reading individual cards.
            </p>
          </section>

          <section>
            <h2>6. List, map, or both</h2>
            <p>
              The same result set can be displayed three ways: as a list, as a
              full-width map, or split between the two. The views are linked —
              selecting a card focuses the corresponding point on the map, and
              clicking a point on the map highlights its card. The split view is
              the one to use when geography matters: clusters, gaps and the
              businesses that sit just outside the area you actually service
              become obvious in a way a list never shows.
            </p>
            <p>
              Above the list, filters narrow what both views display: free-text
              search across name, address, category and city; a category filter;
              a city filter; a distance filter at 5, 10, 25 or 50 km; and
              presence toggles for phone, e-mail, website, social profiles and
              opening hours. Sorting offers nearest first, business name, or
              most complete. Filtering changes what is shown, what the counters
              report, and what the export buttons write out — which is exactly
              how you produce a targeted file without editing anything by hand.
            </p>
          </section>

          <section>
            <h2>7. Saving a shortlist</h2>
            <p>
              Select the businesses worth keeping and use <strong>Save</strong>{" "}
              to store them in this browser. Saved records go to IndexedDB — up
              to 200 of them — and appear under the Saved view, where the same
              filters, sorting, contact discovery and exports are available. The
              last five searches are kept too, with their results.
            </p>
            <p>
              There is no account, so this is genuinely local: the list does not
              follow you to another browser or device, nobody else can see it,
              and clearing your browser data or using{" "}
              <strong>Clear my local data</strong> on the{" "}
              <Link href="/about">About page</Link> removes it permanently.
              Export anything you would be annoyed to lose.
            </p>
            <p>
              You can also add a business by hand — useful for a referral or a
              company that simply is not mapped. It is stored alongside the rest
              and exports the same way, tagged so you can tell manually entered
              records from map records later.
            </p>
          </section>

          <section>
            <h2>8. Optional contact discovery</h2>
            <p>
              Many listings have a website but no e-mail address. Contact
              discovery closes that gap on demand: select up to ten records and
              use <strong>Find contacts</strong>, or run it on a single card.
              The button is disabled when a listing has no website, because
              there is nowhere to look.
            </p>
            <p>
              For each selected business the server visits that business&rsquo;s
              own public homepage and, if one is linked, at most one same-site
              contact or about page. It reads what is publicly visible — e-mail
              addresses, telephone links, links to social profiles — and merges
              them into the record. It fetches only public web addresses,
              refuses private network destinations, follows only a small number
              of redirects, stops at a size limit, and does not attempt to get
              past logins or other access controls. A few requests run at a
              time, not hundreds.
            </p>
            <p>
              It will not always succeed. Sites that are down, that block
              automated requests, or that publish contact details only in an
              image or a form will come back with nothing found — which is a
              result, not an error.
            </p>
          </section>

          <section>
            <h2>9. Verify before you use anything</h2>
            <p>
              This is the step people skip. Open the listing&rsquo;s website and
              confirm the business still trades under that name at that address.
              Check that the phone number on the site matches the one in the
              record. Confirm that an address found by contact discovery is the
              right one to write to — a generic inbox is usually a better
              destination than a named person&rsquo;s address scraped from a
              team page. Every card links to the underlying map record so you
              can see the source directly.
            </p>
            <p>
              Verification is also the moment to drop records. A list of 40
              confirmed businesses is worth more than 200 unverified rows, and
              deleting the ones that do not fit is far cheaper before an export
              than after.
            </p>
          </section>

          <section>
            <h2>10. Export what you selected</h2>
            <p>
              Exports are generated in your browser and download immediately.
              You can write the whole filtered list, only the records you
              selected, only those with phone numbers, or only those with e-mail
              addresses — plus GeoJSON when you want geographic features rather
              than rows. The CSV carries the source and source identifier for
              every record, so a row can always be traced back to where it came
              from.{" "}
              <Link href="/guides/exporting-business-data">
                Exporting business data
              </Link>{" "}
              covers the columns and the clean-up worth doing first.
            </p>
          </section>

          <section>
            <h2>11. Know what the tool cannot tell you</h2>
            <p>
              LeadForge reports what is mapped. It does not know whether a
              business is trading, whether the phone number still reaches
              someone, or whether anyone there wants to hear from you. Coverage
              varies enormously between regions and categories, records can be
              years out of date, and an empty result set often means
              &ldquo;nobody has mapped this yet&rdquo; rather than
              &ldquo;nothing is here&rdquo;.
            </p>
            <p>
              Read{" "}
              <Link href="/guides/open-business-data">
                Working with open business data
              </Link>{" "}
              to understand why the gaps exist, and{" "}
              <Link href="/guides/responsible-business-outreach">
                Responsible business outreach
              </Link>{" "}
              before you contact anyone on the list.
            </p>
          </section>
        </div>

        <div className="doc-actions">
          <Link className="doc-inline-link" href="/guides">
            All guides →
          </Link>
          <Link className="doc-inline-link" href="/">
            Open the workspace →
          </Link>
        </div>

        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
