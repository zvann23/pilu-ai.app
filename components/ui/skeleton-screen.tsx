/**
 * A shimmering placeholder shown while a page's data is still loading,
 * instead of a blank flash of the background color. `fullPage` adds its
 * own page padding for the few call sites (AuthenticatedAppGate) that
 * render outside AppShell's already-padded <main>; everywhere else the
 * default already sits inside that padding.
 */
export function SkeletonScreen({ variant = "page", fullPage = false }: { variant?: "page" | "card"; fullPage?: boolean }) {
  if (variant === "card") {
    return (
      <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar--title" />
        <div className="skeleton-bar" />
        <div className="skeleton-bar skeleton-bar--short" />
      </div>
    );
  }

  return (
    <div className={fullPage ? "skeleton-screen skeleton-screen--full-page" : "skeleton-screen"} role="status" aria-label="Loading" aria-busy="true">
      <div className="skeleton-bar skeleton-bar--heading" />
      <div className="skeleton-bar skeleton-bar--short" />
      <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar--title" />
        <div className="skeleton-bar" />
        <div className="skeleton-bar skeleton-bar--short" />
      </div>
      <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar--title" />
        <div className="skeleton-bar" />
      </div>
    </div>
  );
}
