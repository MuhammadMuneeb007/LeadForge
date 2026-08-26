import Link from "next/link";
import type { Metadata } from "next";
import { ContentNav } from "@/components/layout/ContentNav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That LeadForge page does not exist. Open the discovery workspace or browse the LeadForge guides.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <ContentNav label="Page not found" />
      <main>
        <section className="page-panel">
          <h1>That page does not exist</h1>
          <p>
            The address you followed is not part of LeadForge. It may have been
            mistyped, or it may have pointed to a saved search that only ever
            existed inside your own browser — LeadForge does not host search
            results at public URLs.
          </p>
          <p>
            Open the workspace to run a new search, or read the guides to learn
            how the data and exports work.
          </p>
          <div className="doc-actions">
            <Link className="doc-inline-link" href="/">
              Open the workspace →
            </Link>
            <Link className="doc-inline-link" href="/guides">
              Browse the guides →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
