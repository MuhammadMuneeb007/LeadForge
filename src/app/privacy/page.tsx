import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { githubUrl } from "@/lib/site";

const title = "Privacy policy";
const description =
  "How LeadForge handles search requests, locally saved leads, contact discovery, analytics and advertising cookies, and how to clear your data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: `${title} | LeadForge`, description, url: "/privacy" },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">PRIVACY POLICY</p>
          <h1>What LeadForge stores, sends, and never collects.</h1>
          <p>
            LeadForge has no user accounts and no central customer database. The
            lists you build stay in your own browser. This policy describes the
            data the application handles, the third parties involved in serving
            it, and the advertising and analytics used on parts of this site.
          </p>
          <p>Last updated: August 2026</p>
        </header>

        <div className="doc-body">
          <section>
            <h2>Summary</h2>
            <ul>
              <li>
                There is no sign-up, no login and no profile. LeadForge does not
                ask for your name, e-mail address or payment details.
              </li>
              <li>
                Saved leads and recent searches are stored in your browser, not
                on a server.
              </li>
              <li>
                LeadForge itself does not set cookies and does not use browser
                local storage for tracking.
              </li>
              <li>
                Searches are relayed to a public OpenStreetMap service; map
                tiles are fetched by your browser from a public tile host.
              </li>
              <li>
                Google AdSense is loaded on the four guide articles only, and
                Google may use cookies there. It is not loaded on this policy,
                on the terms or contact pages, on the guides index, or anywhere
                in the application workspace.
              </li>
            </ul>
          </section>

          <section>
            <h2>Part 1 — The LeadForge application</h2>

            <h3>Saved leads and search history</h3>
            <p>
              When you save businesses, they are written to IndexedDB in your
              browser under the database name <code>leadforge</code>. The store
              holds up to 200 saved records and your five most recent searches,
              including the results those searches returned. This data is never
              transmitted to LeadForge servers, is not synchronised between your
              devices, and is not readable by us.
            </p>
            <p>
              You can delete all of it at any time using{" "}
              <strong>Clear my local data</strong> on the{" "}
              <a href="/about">About page</a>, or by clearing site data for this
              domain in your browser settings. Clearing it is immediate,
              permanent and unrecoverable — export anything you want to keep
              first.
            </p>

            <h3>Business searches</h3>
            <p>
              Running a search sends the search parameters to LeadForge&rsquo;s
              own API: country code, the identifier of the selected city, the
              chosen business types, the radius, the coordinates of the search
              centre and the maximum number of results. The server uses those
              parameters to build a geographically bounded query and sends it to
              a public Overpass API endpoint operated by the OpenStreetMap
              community. That third-party service receives the query and the
              coordinates; it does not receive anything identifying you beyond
              the network request itself, which originates from the LeadForge
              server.
            </p>
            <p>
              Overpass responses are cached in memory on the server for a short
              period, keyed by a hash of the query text. The cache is shared
              across identical queries and holds no user identifier.
            </p>

            <h3>City lookup and geolocation</h3>
            <p>
              City suggestions are served from a city index bundled with the
              application; typing a city name sends only the text you typed and
              the selected country to LeadForge&rsquo;s own endpoint. If you
              press <strong>Use my current location</strong>, your browser asks
              for your permission first, and the coordinates it returns are sent
              to that same endpoint to find the nearest city in the local index.
              Those coordinates are used to answer the request and are not
              stored. Location access is optional; declining it leaves every
              other feature working.
            </p>

            <h3>Contact discovery</h3>
            <p>
              Contact discovery runs only when you ask for it on specific
              listings. The selected records are sent to LeadForge&rsquo;s API,
              and the server — not your browser — fetches the business
              website&rsquo;s public homepage and at most one same-site contact
              or about page, identifying itself as{" "}
              <code>LeadForge contact discovery</code>. It extracts publicly
              visible e-mail addresses, telephone links and social profile
              links, and returns them to your browser. The business website sees
              a request from the LeadForge server, not from your IP address. The
              fetched pages are not retained on the server after the response.
            </p>

            <h3>Imported CSV files</h3>
            <p>
              CSV import is handled entirely in your browser. The file is read
              locally and parsed into the result list; it is never uploaded to
              LeadForge or to any third party. Exports work the same way in
              reverse: CSV and GeoJSON files are generated in the browser and
              saved directly by it.
            </p>

            <h3>Server logs and rate limiting</h3>
            <p>
              The API applies per-instance rate limits so that public data
              services are not overloaded. To do that it keeps a short-lived,
              in-memory record derived from the requesting IP address, which
              expires automatically and is not written to a database. When a
              search fails, an error message is logged without request contents.
              As with any hosted website, the hosting provider processes
              standard request data such as IP address, user agent and requested
              URL in order to deliver the site.
            </p>

            <h3>Analytics</h3>
            <p>
              This site includes Vercel Analytics, which records aggregate
              page-view and performance data about visits. It is provided by the
              site&rsquo;s hosting platform and is used to understand traffic
              volume, not to build advertising profiles. If you deploy your own
              copy of LeadForge from the public source, you can remove it.
            </p>
          </section>

          <section>
            <h2>Part 2 — Advertising and Google</h2>
            <p>
              Parts of this site are supported by advertising. The Google
              AdSense loader is included only on the four articles listed on the{" "}
              <a href="/guides">guides index</a> — the index page itself carries
              no advertising. It is deliberately absent from this privacy
              policy, from the terms and contact pages, and from the entire
              application workspace — the search screen, result lists, map
              views, saved lists, import and export flows and error states.
            </p>
            <p>Where advertising is served, the following applies:</p>
            <ul>
              <li>
                Third-party vendors, including Google, use cookies to serve ads
                based on a user&rsquo;s prior visits to this website or other
                websites.
              </li>
              <li>
                Google&rsquo;s use of advertising cookies enables it and its
                partners to serve ads to users based on their visit to this site
                and/or other sites on the Internet.
              </li>
              <li>
                Personalised advertising may be used where it is permitted and
                where the visitor has given any consent required in their
                location.
              </li>
              <li>
                Users may opt out of personalised advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Ads Settings
                </a>
                . Opting out of personalisation does not remove advertising; it
                changes how ads are selected.
              </li>
              <li>
                Visitors can also opt out of a third-party vendor&rsquo;s use of
                cookies for personalised advertising at{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noreferrer"
                >
                  aboutads.info
                </a>
                , and can review Google&rsquo;s handling of data in its{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noreferrer"
                >
                  advertising partner-site policy
                </a>
                .
              </li>
              <li>
                If additional third-party ad networks are configured on this
                site in future, they may likewise set or read cookies in your
                browser when their ads are served.
              </li>
            </ul>
            <p>
              Consent requirements differ by location. In regions where consent
              is required before advertising cookies may be set — including the
              European Economic Area, the United Kingdom and Switzerland — you
              may be shown a consent message before ads are served, and your
              response to it determines whether personalised advertising is
              used. Declining personalisation does not remove advertising;
              non-personalised ads may still be shown.
            </p>
            <p>
              <strong>
                Advertising is not required to use the LeadForge workspace.
              </strong>{" "}
              Searching, mapping, saving, importing and exporting all happen on
              pages that never load an advertising script. If you never open the
              guides, no advertising code runs in your browser on this site.
            </p>
          </section>

          <section>
            <h2>Data we do not have</h2>
            <p>
              Because there is no account system, LeadForge cannot link activity
              to a person, cannot restore your saved list if you clear it, and
              has nothing to export or delete on request beyond what is already
              under your control in your own browser. Requests about advertising
              or analytics data held by Google or by the hosting platform have
              to be made to those providers, since we do not hold it.
            </p>
          </section>

          <section>
            <h2>Third parties involved in serving this site</h2>
            <ul>
              <li>
                <strong>OpenStreetMap / Overpass API</strong> — receives the
                bounded business queries sent by the LeadForge server.
              </li>
              <li>
                <strong>OpenFreeMap</strong> — serves map tiles and styles
                directly to your browser, so it receives your IP address and the
                tiles you request while you use the map.
              </li>
              <li>
                <strong>Business websites</strong> — fetched by the LeadForge
                server, only for listings you select for contact discovery.
              </li>
              <li>
                <strong>Vercel</strong> — hosts the site and provides the
                analytics described above.
              </li>
              <li>
                <strong>Google AdSense</strong> — serves advertising on the four
                guide articles only.
              </li>
            </ul>
            <p>
              Attribution and licensing for the data sources is set out on the{" "}
              <a href="/about/data">data and attribution page</a>.
            </p>
          </section>

          <section>
            <h2>Children</h2>
            <p>
              LeadForge is a business tool and is not directed at children. It
              does not knowingly collect information from anyone, since it
              collects no personal information at all through the application
              itself.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              If the way the application handles data changes — a new data
              source, a change in analytics, a change in how advertising is
              served — this page is updated and the date at the top changes with
              it. Because LeadForge is open source, the corresponding code
              change is visible in the public repository history.
            </p>
          </section>

          <section>
            <h2>Questions</h2>
            <p>
              Questions about this policy, or about how a particular feature
              handles data, can be raised as an issue in the public repository.
              See the <a href="/contact">contact page</a> for the right channel,
              including the private route for security reports. Please do not
              include personal information in a public issue.
            </p>
            <p>
              This document explains how the software behaves. It is not legal
              advice, and it does not determine your obligations when you
              contact the businesses you find — those are covered in the{" "}
              <a href="/terms">terms of use</a> and in{" "}
              <a href="/guides/responsible-business-outreach">
                Responsible business outreach
              </a>
              .
            </p>
          </section>
        </div>

        <div className="doc-actions">
          <a className="doc-inline-link" href="/about/data">
            Data and attribution →
          </a>
          <a className="doc-inline-link" href="/terms">
            Terms of use →
          </a>
          <a
            className="doc-inline-link"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            Read the source ↗
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
