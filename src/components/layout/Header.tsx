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
  return (
    <header className="top-nav">
      <button className="wordmark" onClick={() => onView("discover")}>
        <span>LF</span>LeadForge <small>PUBLIC BETA</small>
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
      <a
        className="github-link"
        href={
          process.env.NEXT_PUBLIC_GITHUB_URL ??
          "https://github.com/MuhammadMuneeb007/LeadForge"
        }
        target="_blank"
        rel="noreferrer"
      >
        <span>View source</span> GitHub ↗
      </a>
    </header>
  );
}
