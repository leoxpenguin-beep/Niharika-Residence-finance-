import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds a hover lift effect — useful for interactive cards */
  hoverable?: boolean;
  /** Removes padding — for cards with custom internal layout */
  noPadding?: boolean;
}

/**
 * Card — rounded parchment container with soft shadow.
 * The base container for FloorCard, AreaCard, UnitCard.
 */
export default function Card({
  children,
  hoverable = false,
  noPadding = false,
  style,
  ...props
}: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-parchment)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-soft)",
        padding: noPadding ? 0 : "1.25rem",
        border: "1px solid var(--color-parchment-dark)",
        transition: hoverable ? "transform 0.2s ease, box-shadow 0.2s ease" : undefined,
        cursor: hoverable ? "pointer" : undefined,
        ...style,
      }}
      onMouseEnter={hoverable ? (e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-soft)";
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
