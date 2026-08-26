import type { Metadata } from "next";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";
import { DataAttribution } from "@/components/DataAttribution";

const title = "LeadForge guides";
const description =
  "Practical guides to searching open map data, judging listing quality, exporting clean business lists, and contacting the businesses you find responsibly.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { title: `${title} | LeadForge`, description, url: "/guides" },
  twitter: { title: `${title} | LeadForge`, description },
};

const guides = [
  {
    href: "/guides/how-leadforge-works",
    title: "How LeadForge works",
    summary:
      "The complete workflow, from choosing a country and radius to exporting a verified shortlist — including what happens behind each step and why a search sometimes returns nothing.",
    reading: "Start here if you have never run a search.",
  },
  {
    href: "/guides/open-business-data",
    title: "Working with open business data",
    summary:
      "What open geographic data is, how OpenStreetMap records businesses, why phone numbers and opening hours are so often missing, and why a map listing is not a business registry.",
    reading: "Read this to judge how much a result set is worth.",
  },
  {
    href: "/guides/responsible-business-outreach",
    title: "Responsible business outreach",
    summary:
      "Verifying details before you use them, telling business contacts from personal ones, honouring opt-outs, keeping lists current, and the questions to ask before any campaign.",
    reading: "Read this before you contact anyone.",
  },
  {
    href: "/guides/exporting-business-data",
    title: "Exporting business data",
    summary:
      "Every export LeadForge produces, what each CSV column contains, how to clean and de-duplicate a list, and how to move it into a spreadsheet or CRM without losing its provenance.",
    reading: "Read this when your shortlist is ready to leave the browser.",
  },
];

export default function GuidesPage() {
  return (
    <>
      <ContentNav label="Guides" />
      <main className="data-page">
        <header className="data-hero">
          <p className="kicker">GUIDES</p>
          <h1>How to get useful results out of open business data.</h1>
          <p>
            These guides are written for people using LeadForge to build a local
            prospect list. They explain how the search actually works, how much
            confidence a public listing deserves, how to get a clean file out of
            the tool, and how to use what you find without becoming the reason
            someone stops answering their phone.
          </p>
        </header>

        <section className="source-list">
          {guides.map((guide, index) => (
            <div key={guide.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <article>
                <h2>
                  <a href={guide.href}>{guide.title}</a>
                </h2>
                <div>
                  <p>{guide.summary}</p>
                  <a className="doc-inline-link" href={guide.href}>
                    {guide.reading} →
                  </a>
                </div>
              </article>
            </div>
          ))}
        </section>

        <div className="doc-body">
          <section>
            <h2>How these guides are written</h2>
            <p>
              Everything here describes this application as it is actually
              built: the categories it can search, the limits it enforces, the
              columns it exports, and the safeguards around contact discovery.
              Where a guide states a number — a radius ceiling, a saved-list
              size, a page limit during contact discovery — that number comes
              from the source code, which is public and can be checked.
            </p>
            <p>
              None of it is legal advice. Marketing, privacy and anti-spam rules
              differ by jurisdiction, and the outreach guide is explicit about
              where you need to look at your own obligations rather than take
              our word for anything.
            </p>
          </section>

          <section>
            <h2>Related pages</h2>
            <p>
              For the data sources and their licences, see the{" "}
              <a href="/about/data">data and attribution page</a>. For what the
              project is and why it exists, see{" "}
              <a href="/about">About LeadForge</a>. For what the software
              handles and stores, see the <a href="/privacy">privacy policy</a>.
            </p>
          </section>
        </div>

        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
