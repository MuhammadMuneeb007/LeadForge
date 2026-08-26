import Link from "next/link";

/** Static header for informational pages, matching the application header. */
export function ContentNav({
  label,
  parent,
}: {
  label: string;
  parent?: { href: string; label: string };
}) {
  return (
    <header className="top-nav static-nav">
      <div className="nav-inner">
        <Link className="wordmark" href="/">
          <span>LF</span>
          <span className="brand-copy">
            <strong>LeadForge</strong>
            <small>OPEN BUSINESS DISCOVERY</small>
          </span>
        </Link>
        <nav aria-label="Breadcrumb">
          <Link href="/">Discover</Link>
          <span>/</span>
          {parent ? (
            <>
              <Link href={parent.href}>{parent.label}</Link>
              <span>/</span>
            </>
          ) : null}
          <b>{label}</b>
        </nav>
        <Link className="nav-cta" href="/">
          Open workspace
        </Link>
      </div>
    </header>
  );
}
