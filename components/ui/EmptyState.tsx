import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/**
 * EmptyState — graceful empty content state.
 * Used when no units are added to an area, or no price is ready for a unit.
 */
export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3rem 2rem",
        gap: "0.875rem",
      }}
    >
      {icon && (
        <div style={{ color: "var(--color-taupe-light)", marginBottom: "0.25rem" }}>
          {icon}
        </div>
      )}
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.25rem",
          fontWeight: 500,
          color: "var(--color-ink-soft)",
          lineHeight: 1.3,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--color-taupe)",
            lineHeight: 1.6,
            maxWidth: "24rem",
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "0.5rem" }}>{action}</div>}
    </div>
  );
}
