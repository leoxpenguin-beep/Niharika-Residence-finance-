type BadgeVariant =
  | "default"
  | "approved"
  | "pending"
  | "hold"
  | "removed"
  | "discussion"
  | "draft"
  | "sage"
  | "taupe";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    backgroundColor: "var(--color-parchment-dark)",
    color: "var(--color-ink-soft)",
  },
  approved: {
    backgroundColor: "var(--color-status-approved-bg)",
    color: "var(--color-status-approved)",
  },
  pending: {
    backgroundColor: "var(--color-status-pending-bg)",
    color: "var(--color-status-pending)",
  },
  hold: {
    backgroundColor: "var(--color-status-hold-bg)",
    color: "var(--color-status-hold)",
  },
  removed: {
    backgroundColor: "var(--color-status-removed-bg)",
    color: "var(--color-status-removed)",
  },
  discussion: {
    backgroundColor: "var(--color-status-discussion-bg)",
    color: "var(--color-status-discussion)",
  },
  draft: {
    backgroundColor: "var(--color-parchment-dark)",
    color: "var(--color-taupe)",
  },
  sage: {
    backgroundColor: "#EEF3EE",
    color: "var(--color-sage)",
  },
  taupe: {
    backgroundColor: "var(--color-parchment)",
    color: "var(--color-taupe)",
  },
};

/**
 * Badge — compact status chip used for unit status and cost confidence labels.
 * Used as StatusChip wrapper in Stage 3.
 */
export default function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        ...badgeStyles[variant],
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-body)",
        fontSize: "0.6875rem",
        fontWeight: 500,
        letterSpacing: "0.03em",
        borderRadius: "var(--radius-chip)",
        padding: "0.25rem 0.625rem",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
