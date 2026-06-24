"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-ink)",
    color: "var(--color-cream)",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--color-parchment)",
    color: "var(--color-ink)",
    border: "1px solid var(--color-parchment-dark)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-ink-soft)",
    border: "1px solid var(--color-parchment-dark)",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--color-ink)",
    border: "1px solid var(--color-border)",
  },
  destructive: {
    backgroundColor: "var(--color-status-removed-bg)",
    color: "var(--color-status-removed)",
    border: "1px solid var(--color-status-removed)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: "0.8125rem", padding: "0.375rem 0.875rem", minHeight: "2rem" },
  md: { fontSize: "0.875rem", padding: "0.625rem 1.25rem", minHeight: "2.75rem" },
  lg: { fontSize: "1rem", padding: "0.875rem 1.75rem", minHeight: "3.25rem" },
};

/**
 * Button — base interactive button component.
 * Variants: primary, secondary, ghost, destructive.
 * All tap targets meet 44px minimum on mobile (md and lg sizes).
 */
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        borderRadius: "var(--radius-button)",
        cursor: "pointer",
        width: fullWidth ? "100%" : undefined,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        letterSpacing: "0.01em",
        transition: "opacity 0.15s ease, transform 0.1s ease",
        textDecoration: "none",
        ...style,
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        props.onMouseUp?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
