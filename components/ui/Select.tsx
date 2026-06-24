"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Select — dropdown select input. Used in admin unit editor for status,
 * calculation type, margin type, etc.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, id, options, placeholder, style, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {label && (
          <label
            htmlFor={selectId}
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
        <div style={{ position: "relative" }}>
          <select
            ref={ref}
            id={selectId}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "var(--color-ink)",
              backgroundColor: "var(--color-parchment)",
              border: `1px solid ${error ? "var(--color-status-removed)" : "var(--color-parchment-dark)"}`,
              borderRadius: "0.5rem",
              padding: "0.625rem 2.25rem 0.625rem 0.875rem",
              outline: "none",
              width: "100%",
              appearance: "none",
              cursor: "pointer",
              ...style,
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <div style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: "var(--color-taupe)" }} />
            </svg>
          </div>
        </div>
        {error && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-status-removed)" }}>{error}</p>}
        {hint && !error && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-taupe)" }}>{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
