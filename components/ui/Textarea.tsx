"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/**
 * Textarea — multiline text input. Used for client approval notes and admin notes.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, style, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
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
            resize: "vertical",
            transition: "border-color 0.15s ease",
            lineHeight: 1.6,
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

Textarea.displayName = "Textarea";
export default Textarea;
