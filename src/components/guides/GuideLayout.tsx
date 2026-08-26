import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { DataAttribution } from "@/components/DataAttribution";
import { GuideToc } from "./GuideToc";
import { GuideCard } from "./GuideCard";
import {
  getGuide,
  getGuideNeighbours,
  getRelatedGuides,
} from "@/lib/navigation";

/**
 * Editorial shell for a guide article: hero, article column with a sticky
 * table of contents, previous/next navigation and related guides.
 *
 * The AdSense loader is deliberately NOT rendered here. Each monetised article
 * renders it itself, so the set of pages that carry advertising stays visible
 * in a grep rather than being implied by a shared layout.
 */
export function GuideLayout({
  slug,
  heading,
  intro,
  children,
}: {
  slug: string;
  heading: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const guide = getGuide(slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);
  const { previous, next } = getGuideNeighbours(slug);
  const related = getRelatedGuides(slug);

  return (
    <>
      <SiteHeader />
      <main className="data-page guide-page">
        <header className="data-hero guide-hero">
          <div className="guide-hero-meta">
            <p className="kicker">GUIDE</p>
            <span className="guide-badge">{guide.badge}</span>
          </div>
          <h1>{heading}</h1>
          {intro}
          <p className="guide-hero-facts">
            {guide.sections.length} sections · LeadForge documentation
          </p>
        </header>

        <div className="guide-body">
          <div className="doc-body guide-article">{children}</div>
          <GuideToc sections={guide.sections} />
        </div>

        <nav className="guide-pager" aria-label="Guide navigation">
          {previous ? (
            <a className="guide-pager-link" href={previous.href}>
              <span>← Previous guide</span>
              <b>{previous.title}</b>
            </a>
          ) : (
            <span className="guide-pager-link is-empty" aria-hidden="true" />
          )}
          <a className="guide-pager-all" href="/guides">
            All guides
          </a>
          {next ? (
            <a className="guide-pager-link guide-pager-next" href={next.href}>
              <span>Next guide →</span>
              <b>{next.title}</b>
            </a>
          ) : (
            <span className="guide-pager-link is-empty" aria-hidden="true" />
          )}
        </nav>

        {related.length > 0 && (
          <section className="guide-related" aria-labelledby="related-guides">
            <p className="kicker" id="related-guides">
              RELATED GUIDES
            </p>
            <div className="guide-related-grid">
              {related.map((item) => (
                <GuideCard key={item.slug} guide={item} compact />
              ))}
            </div>
          </section>
        )}

        <DataAttribution />
      </main>
      <Footer />
    </>
  );
}
