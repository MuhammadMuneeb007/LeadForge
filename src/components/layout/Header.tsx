"use client";

export type View = "discover" | "saved" | "about";

export function Header({
  view,
  onView,
  savedCount,
}: {
  view: View;
  onView: (view: View) => void;
  savedCount: number;
}) {
  const github =
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/MuhammadMuneeb007/LeadForge";

  return (
    <header className="top-nav">
      <div className="nav-inner">
        <button className="wordmark" onClick={() => onView("discover")}>
          <span>LF</span>
          <span className="brand-copy">
            <strong>LeadForge</strong>
            <small>OPEN BUSINESS DISCOVERY</small>
          </span>
        </button>
        <nav aria-label="Primary navigation">
          {(["discover", "saved", "about"] as const).map((item) => (
            <button
              key={item}
              className={view === item ? "active" : ""}
              onClick={() => onView(item)}
            >
              {item[0]?.toUpperCase()}
              {item.slice(1)}
              {item === "saved" && savedCount > 0 ? <b>{savedCount}</b> : null}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <a
            className="github-link"
            href={github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span>↗</span>
          </a>
          <button className="nav-cta" onClick={() => onView("discover")}>
            Find businesses
          </button>
        </div>
      </div>
    </header>
  );
}
