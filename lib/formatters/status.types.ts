// Shared type for Badge component variant — used by status.ts formatter
// to avoid importing from the component layer into the lib layer.
export type BadgeVariant =
  | "default"
  | "approved"
  | "pending"
  | "hold"
  | "removed"
  | "discussion"
  | "draft"
  | "sage"
  | "taupe";
