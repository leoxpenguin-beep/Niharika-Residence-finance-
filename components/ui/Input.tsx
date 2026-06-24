"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/**
 * Input — labeled text input with error and hint states.
 * Used in admin forms and the client approval name field.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, style, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-ink-soft)",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--color-ink)",
            backgroundColor: "var(--color-parchment)",
            border: `1px solid ${error ? "var(--color-status-removed)" : "var(--color-parchment-dark)"}`,
            borderRadius: "0.5rem",
            padding: "0.625rem 0.875rem",
            outline: "none",
            width: "100%",
            transition: "border-color 0.15s ease",
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-taupe)";
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? "var(--color-status-removed)"
              : "var(--color-parchment-dark)";
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-status-removed)" }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-taupe)" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
