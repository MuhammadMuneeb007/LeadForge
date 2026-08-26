import { guides, type Guide } from "@/lib/navigation";

const numberOf = (guide: Guide) =>
  String(guides.findIndex((item) => item.slug === guide.slug) + 1).padStart(
    2,
    "0",
  );

/** Guide summary card, used on the index and in the related-guides strip. */
export function GuideCard({
  guide,
  compact = false,
}: {
  guide: Guide;
  compact?: boolean;
}) {
  return (
    <article className={`guide-card ${compact ? "guide-card-compact" : ""}`}>
      <div className="guide-card-top">
        <span className="guide-card-number">{numberOf(guide)}</span>
        <span className="guide-badge">{guide.badge}</span>
      </div>
      <h2>
        <a href={guide.href}>{guide.title}</a>
      </h2>
      <p>{compact ? guide.audience : guide.summary}</p>
      {compact ? null : <p className="guide-card-audience">{guide.audience}</p>}
      <a className="doc-inline-link" href={guide.href}>
        Read guide <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
