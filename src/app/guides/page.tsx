import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { DataAttribution } from "@/components/DataAttribution";
import { GuideCard } from "@/components/guides/GuideCard";
import { guides } from "@/lib/navigation";

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

export default function GuidesPage() {
  return (
    <>
      <SiteHeader />
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

        <section className="guide-grid" aria-label="All guides">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
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
