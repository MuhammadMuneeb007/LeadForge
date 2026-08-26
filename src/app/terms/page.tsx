import type { Metadata } from "next";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { githubUrl } from "@/lib/site";

const title = "Terms and acceptable use";
const description =
  "The conditions for using LeadForge: public data is informational only, results must be verified, outreach law is your responsibility, and bulk extraction is not permitted.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title: `${title} | LeadForge`, description, url: "/terms" },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function TermsPage() {
  return (
    <>
      <ContentNav label="Terms" />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">TERMS AND ACCEPTABLE USE</p>
          <h1>What LeadForge provides, and what it asks of you.</h1>
          <p>
            LeadForge is free, open-source software that reads public geographic
            data. These terms describe the nature of the information it returns
            and the conduct expected of the people who use it. They are written
            in plain language by the project maintainers and are not
            professionally drafted legal advice.
          </p>
          <p>Last updated: August 2026</p>
        </header>

        <div className="doc-body">
          <section>
            <h2>1. The nature of the information</h2>
            <p>
              Every business record LeadForge displays originates in public data
              — principally OpenStreetMap, plus, when you explicitly request it,
              information published openly on a business&rsquo;s own website.
              The application relays that data; it does not author, verify,
              correct or certify it.
            </p>
            <p>
              Results are informational. They are a starting point for your own
              research, not a validated dataset, and they should never be
              treated as a register of trading businesses.
            </p>
          </section>

          <section>
            <h2>2. No guarantee of accuracy or completeness</h2>
            <p>
              Coverage in open map data varies by region and by category, and
              individual records vary in quality. A listing may be missing, out
              of date, duplicated, incorrectly categorised, or attached to a
              business that has moved or closed. Contact fields such as phone
              numbers, websites and opening hours are frequently absent
              altogether.
            </p>
            <p>
              LeadForge makes no representation that any result is accurate,
              current or complete, and the absence of a business from a result
              set is not evidence that the business does not exist.
            </p>
          </section>

          <section>
            <h2>3. You must verify before you act</h2>
            <p>
              You are responsible for confirming that a business exists, that it
              is the business you think it is, and that a contact detail is
              current and appropriate to use, before contacting it or relying on
              the record for any decision. Practical verification steps are
              described in{" "}
              <a href="/guides/responsible-business-outreach">
                Responsible business outreach
              </a>
              .
            </p>
          </section>

          <section>
            <h2>4. Your legal obligations for outreach</h2>
            <p>
              Rules governing marketing, unsolicited messages, telephone calls,
              electronic mail and the handling of contact information differ
              substantially between countries and, in some cases, between states
              or provinces. Obligations may apply to you regardless of where the
              data came from or where this site is hosted.
            </p>
            <p>
              By using LeadForge you accept that complying with the law that
              applies to you — including any registration, consent, disclosure,
              record-keeping and opt-out requirements — is entirely your
              responsibility. LeadForge cannot and does not assess whether your
              intended use is lawful in your jurisdiction, and nothing in this
              product should be read as advice that it is.
            </p>
          </section>

          <section>
            <h2>5. Acceptable use</h2>
            <p>You agree not to use LeadForge:</p>
            <ul>
              <li>
                to send indiscriminate bulk messages, unsolicited commercial
                messages at scale, or any communication to recipients who have
                asked not to be contacted;
              </li>
              <li>
                to conduct automated or high-volume extraction from this
                deployment, the public Overpass service, or the map tile service
                — these are shared community resources intended for considerate
                interactive use;
              </li>
              <li>
                to circumvent rate limits, result caps, category limits or any
                other control in the application, whether by scripting the
                interface or by calling the API directly;
              </li>
              <li>
                to attempt to bypass authentication, paywalls, access controls,
                or any technical or contractual restriction on a
                business&rsquo;s website during contact discovery;
              </li>
              <li>
                to compile or redistribute collections of personal contact
                information, or to target individuals rather than businesses;
              </li>
              <li>
                to misrepresent who you are or why you are making contact,
                including in any message that references information found here;
              </li>
              <li>
                to interfere with the operation, security or availability of
                this site or the services it depends on.
              </li>
            </ul>
            <p>
              Contact discovery in particular is limited by design — a small
              number of listings per request, a business&rsquo;s own public
              pages only, and no attempt to read anything behind a login. Using
              it as a general-purpose crawler is outside the intended use of the
              tool.
            </p>
          </section>

          <section>
            <h2>6. Public data, used responsibly</h2>
            <p>
              Open data is open so that it can be used, including commercially.
              That openness does not by itself make every use appropriate: a
              published business telephone number exists so that customers can
              reach that business, and a person&rsquo;s name appearing in a
              public record does not make it a marketing list. Use the data for
              purposes a reasonable business owner would recognise as
              legitimate, keep the volume of contact proportionate, and stop
              contacting anyone who asks you to.
            </p>
          </section>

          <section>
            <h2>7. Upstream data providers and attribution</h2>
            <p>
              Data supplied through LeadForge remains subject to the licences of
              its providers. OpenStreetMap data is © OpenStreetMap contributors
              and licensed under the Open Database License; the bundled city
              index derives from GeoNames; map tiles and styles are served by
              OpenFreeMap. If you republish or redistribute records obtained
              here, you are responsible for meeting the attribution and
              share-alike conditions those licences impose. The{" "}
              <a href="/about/data">data and attribution page</a> sets out each
              source.
            </p>
          </section>

          <section>
            <h2>8. No buying-intent signal</h2>
            <p>
              LeadForge reports that a business of a certain type is mapped at a
              certain location, and how complete its public listing is. It does
              not infer, model or imply that a business is in the market for
              anything, is dissatisfied with a current supplier, or is likely to
              respond. The completeness score describes the record, not the
              business. Treating it as a purchase-intent score would be a
              misreading of what the product measures.
            </p>
          </section>

          <section>
            <h2>9. The software</h2>
            <p>
              LeadForge is published under the MIT License. You are free to
              read, modify, self-host and redistribute the source under the
              terms of that licence, which is included in the{" "}
              <a href={githubUrl} target="_blank" rel="noreferrer">
                repository
              </a>
              . The MIT License governs the software itself; it does not grant
              rights over third-party data accessed through the software.
            </p>
            <p>
              Consistent with that licence, the software is provided &ldquo;as
              is&rdquo;, without warranty of any kind, express or implied. The
              authors and copyright holders are not liable for any claim,
              damages or other liability arising from the software or its use.
              This hosted deployment is offered on the same basis and may be
              changed, rate-limited or taken offline at any time; the public
              services it depends on are operated by others and may be
              unavailable independently of anything LeadForge does.
            </p>
          </section>

          <section>
            <h2>10. Advertising on this site</h2>
            <p>
              The educational guide pages carry advertising served by Google
              AdSense. The application workspace and the policy pages do not.
              How advertising cookies are used, and how to opt out of
              personalisation, is described in the{" "}
              <a href="/privacy">privacy policy</a>.
            </p>
          </section>

          <section>
            <h2>11. Changes</h2>
            <p>
              These terms may change as the software changes. The current
              version is always the one published at this address, and the
              underlying code changes are visible in the public repository
              history. Continuing to use the site after a change means the
              updated terms apply to your use.
            </p>
          </section>
        </div>

        <div className="doc-actions">
          <a className="doc-inline-link" href="/privacy">
            Privacy policy →
          </a>
          <a
            className="doc-inline-link"
            href="/guides/responsible-business-outreach"
          >
            Responsible outreach guide →
          </a>
          <a className="doc-inline-link" href="/contact">
            Contact →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
