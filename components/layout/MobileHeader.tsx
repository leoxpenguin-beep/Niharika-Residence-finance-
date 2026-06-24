interface MobileHeaderProps {
  /** Show a back arrow with this href — optional */
  backHref?: string;
  /** Override the displayed title — defaults to project name */
  title?: string;
  /** Show a right-side label (e.g. status chip) — optional */
  rightSlot?: React.ReactNode;
}

/**
 * MobileHeader — sticky top bar for all client-facing pages.
 * Shows LEORA wordmark and optional back navigation.
 * Stage 3 will wire up the back navigation fully.
 */
export default function MobileHeader({
  backHref,
  title = "Niharika Residence",
  rightSlot,
}: MobileHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "var(--color-cream)",
        borderBottom: "1px solid var(--color-parchment-dark)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-3.5">
        {/* Left — back or logo */}
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <a
              href={backHref}
              aria-label="Go back"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: "var(--color-parchment)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-ink)" }} />
              </svg>
            </a>
          ) : (
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "var(--color-taupe)", fontFamily: "var(--font-body)" }}
            >
              LEORA
            </span>
          )}
          {title && (
            <span
              className="text-sm font-medium truncate"
              style={{ color: "var(--color-ink-soft)", fontFamily: "var(--font-body)" }}
            >
              {title}
            </span>
          )}
        </div>
        {/* Right slot */}
        {rightSlot && <div className="flex-shrink-0 ml-2">{rightSlot}</div>}
      </div>
    </header>
  );
}
