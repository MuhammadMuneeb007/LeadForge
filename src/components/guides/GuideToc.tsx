import type { NavSection } from "@/lib/navigation";

/**
 * Sticky in-page contents. Anchors point at the section ids on the page; the
 * matching `scroll-margin-top` in globals.css keeps a target clear of the
 * sticky header. No scroll spy — the anchors alone do the job.
 */
export function GuideToc({ sections }: { sections: NavSection[] }) {
  return (
    <aside className="guide-toc" aria-labelledby="guide-toc-title">
      <div>
        <p className="kicker" id="guide-toc-title">
          IN THIS GUIDE
        </p>
        <ol>
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
