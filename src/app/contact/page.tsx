import type { Metadata } from "next";
import Link from "next/link";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { githubUrl } from "@/lib/site";

const title = "Contact";
const description =
  "How to reach the LeadForge project: report a bug, request a feature, raise a data or listing concern, or disclose a security issue privately.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `${title} | LeadForge`, description, url: "/contact" },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function ContactPage() {
  return (
    <>
      <ContentNav label="Contact" />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">CONTACT</p>
          <h1>Everything goes through the public repository.</h1>
          <p>
            LeadForge is a small open-source project rather than a company with
            a support desk. All contact happens on GitHub, where the
            conversation stays attached to the code it concerns — with one
            deliberate exception for security reports, which must stay private.
          </p>
        </header>

        <div className="doc-body">
          <section>
            <h2>Before you write</h2>
            <p>
              Two categories of question are usually answered faster by reading
              than by asking. If a business is missing, has the wrong address,
              or has no phone number, that is almost always the state of the
              underlying open data rather than a fault in LeadForge —{" "}
              <Link href="/guides/open-business-data">
                Working with open business data
              </Link>{" "}
              explains why coverage varies and where a correction should
              actually be made. If a search returns nothing, a larger radius or
              a different category is usually the cause;{" "}
              <Link href="/guides/how-leadforge-works">
                How LeadForge works
              </Link>{" "}
              covers the search parameters in detail.
            </p>
            <p>
              It is also worth searching existing issues in the repository
              before opening a new one — the answer may already be there.
            </p>
          </section>

          <section>
            <h2>Bug reports</h2>
            <p>
              Open an issue at{" "}
              <a href={`${githubUrl}/issues`} target="_blank" rel="noreferrer">
                the issue tracker
              </a>{" "}
              for anything that behaves incorrectly: a search that fails, an
              export that produces malformed output, a map that does not render,
              an import that drops rows, a layout that breaks on your screen
              size.
            </p>
            <p>A report is far more useful when it includes:</p>
            <ul>
              <li>
                the exact search parameters — country, city, categories, radius,
                result limit — needed to reproduce it;
              </li>
              <li>what you expected to happen, and what happened instead;</li>
              <li>your browser and operating system;</li>
              <li>any message the application displayed, quoted exactly;</li>
              <li>
                a screenshot where the problem is visual — with any private
                information removed.
              </li>
            </ul>
            <p>
              Please do not paste exported lead files into an issue. A couple of
              anonymised example rows is enough to show a formatting problem.
            </p>
          </section>

          <section>
            <h2>Feature requests</h2>
            <p>
              Feature ideas belong in the same issue tracker. The most useful
              requests describe the problem you are trying to solve rather than
              only the control you would like added — the underlying need often
              has a better solution than the one that first comes to mind, and
              it helps to know whether an export column, a filter or a whole new
              workflow is what would genuinely help.
            </p>
            <p>
              Requests that would turn LeadForge into a bulk-extraction or
              mass-mailing tool are out of scope, and requests to add
              proprietary or purchased contact databases are too: the project is
              deliberately limited to public data sources. Because it is MIT
              licensed, you are free to fork it and take it in a different
              direction.
            </p>
          </section>

          <section>
            <h2>Data and listing concerns</h2>
            <p>
              If your business appears with details you want changed, the place
              to fix it is usually the source rather than LeadForge. Business
              names, addresses, phone numbers and opening hours shown in results
              come from OpenStreetMap, and an edit there propagates to every
              application built on that data, including this one. Every result
              card links to the underlying OpenStreetMap record so you can go
              straight to it.
            </p>
            <p>
              E-mail addresses and social links found through contact discovery
              are read from the business&rsquo;s own public website at the
              moment you request it; LeadForge stores nothing about them, so
              removing or changing them on that website is what takes effect.
              Nothing you or anyone else looks up is kept on a LeadForge server
              — saved lists exist only in the browser of the person who saved
              them, as described in the{" "}
              <Link href="/privacy">privacy policy</Link>.
            </p>
            <p>
              If you believe the application is presenting public data in a way
              that is misleading or inappropriate, open an issue describing the
              concern and we will look at it.
            </p>
          </section>

          <section>
            <h2>Security reports</h2>
            <p>
              <strong>
                Do not open a public issue for a suspected vulnerability.
              </strong>{" "}
              Use GitHub&rsquo;s <em>Report a vulnerability</em> form in the{" "}
              <a
                href={`${githubUrl}/security`}
                target="_blank"
                rel="noreferrer"
              >
                Security tab
              </a>{" "}
              of the repository, which keeps the report private between you and
              the maintainers.
            </p>
            <p>
              Include the affected route or component, reproduction steps,
              impact, and any suggested mitigation. Reports are acknowledged as
              soon as practical. Please allow time for investigation and a
              coordinated fix before disclosing publicly. The full policy is in{" "}
              <a
                href={`${githubUrl}/blob/main/SECURITY.md`}
                target="_blank"
                rel="noreferrer"
              >
                SECURITY.md
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Contributing</h2>
            <p>
              Pull requests are welcome. The repository documents how to run the
              project locally and which checks — linting, type checking, tests
              and a production build — run in continuous integration for every
              push and pull request. Opening an issue first is a good idea for
              anything larger than a fix, so the approach can be agreed before
              you spend time on it.
            </p>
          </section>

          <section>
            <h2>What we cannot help with</h2>
            <p>
              We cannot advise whether your intended outreach is lawful in your
              jurisdiction, write or review marketing copy, supply contact data
              beyond what the public sources return, or restore a saved list
              that was cleared from your browser — that data never leaves your
              device, so no copy of it exists anywhere else.
            </p>
          </section>
        </div>

        <div className="doc-actions">
          <a
            className="doc-inline-link"
            href={`${githubUrl}/issues`}
            target="_blank"
            rel="noreferrer"
          >
            Open an issue ↗
          </a>
          <a
            className="doc-inline-link"
            href={`${githubUrl}/security`}
            target="_blank"
            rel="noreferrer"
          >
            Report a vulnerability privately ↗
          </a>
          <Link className="doc-inline-link" href="/about">
            About LeadForge →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
