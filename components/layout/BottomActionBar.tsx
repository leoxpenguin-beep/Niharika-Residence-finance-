import type { ReactNode } from "react";

interface BottomActionBarProps {
  /** Primary price display */
  price?: string;
  /** Primary CTA button content */
  primaryAction?: ReactNode;
  /** Secondary actions below the primary */
  secondaryActions?: ReactNode;
}

/**
 * BottomActionBar — sticky bottom bar on unit detail pages.
 * Shows final price on the left and approval CTA on the right.
 * Secondary actions (Need Discussion, Hold, Remove) appear below.
 * Stage 3 will wire up approval actions fully.
 */
export default function BottomActionBar({
  price,
  primaryAction,
  secondaryActions,
}: BottomActionBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor: "var(--color-cream)",
        borderTop: "1px solid var(--color-parchment-dark)",
        boxShadow: "var(--shadow-bottom)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto w-full max-w-md px-5 pt-4 pb-5">
        {/* Primary row */}
        <div className="flex items-center justify-between gap-4">
          {price ? (
            <div>
              <p className="text-xs mb-0.5" style={{ color: "var(--color-taupe)", fontFamily: "var(--font-body)" }}>
                Final client price
              </p>
              <p
                className="text-xl font-medium price"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-heading)" }}
              >
                {price}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs" style={{ color: "var(--color-taupe)", fontFamily: "var(--font-body)" }}>
                Price to be confirmed
              </p>
            </div>
          )}
          {primaryAction && <div className="flex-shrink-0">{primaryAction}</div>}
        </div>
        {/* Secondary actions */}
        {secondaryActions && (
          <div className="mt-3 flex items-center gap-2">{secondaryActions}</div>
        )}
      </div>
    </div>
  );
}
