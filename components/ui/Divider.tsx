/**
 * Divider — a light horizontal rule using the parchment-dark token.
 * Used between sections within cards and pages.
 */
export default function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        borderTop: "1px solid var(--color-parchment-dark)",
        margin: 0,
      }}
    />
  );
}
