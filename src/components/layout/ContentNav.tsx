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
        <a className="wordmark" href="/">
          <span>LF</span>
          <span className="brand-copy">
            <strong>LeadForge</strong>
            <small>OPEN BUSINESS DISCOVERY</small>
          </span>
        </a>
        <nav aria-label="Breadcrumb">
          <a href="/">Discover</a>
          <span>/</span>
          {parent ? (
            <>
              <a href={parent.href}>{parent.label}</a>
              <span>/</span>
            </>
          ) : null}
          <b>{label}</b>
        </nav>
        <a className="nav-cta" href="/">
          Open workspace
        </a>
      </div>
    </header>
  );
}
