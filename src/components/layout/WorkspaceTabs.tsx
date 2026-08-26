"use client";

export type View = "discover" | "saved";

/**
 * Local view switch for the business-discovery workspace.
 *
 * Discover and Saved are React state inside the application, not public routes,
 * so they live here rather than in the global site navigation.
 */
export function WorkspaceTabs({
  view,
  onView,
  savedCount,
}: {
  view: View;
  onView: (view: View) => void;
  savedCount: number;
}) {
  return (
    <nav className="workspace-tabs" aria-label="Workspace views">
      {(["discover", "saved"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={view === item ? "active" : ""}
          aria-current={view === item ? "true" : undefined}
          onClick={() => onView(item)}
        >
          {item[0]?.toUpperCase()}
          {item.slice(1)}
          {item === "saved" && savedCount > 0 ? <b>{savedCount}</b> : null}
        </button>
      ))}
    </nav>
  );
}
