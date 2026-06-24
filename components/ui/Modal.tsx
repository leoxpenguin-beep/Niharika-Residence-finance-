"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Footer action buttons */
  footer?: ReactNode;
}

/**
 * Modal — accessible dialog for admin confirmation actions (publish, delete)
 * and client approval name collection. Traps focus and closes on Escape.
 */
export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "rgba(28, 28, 28, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-cream)",
          borderRadius: "1.25rem 1.25rem 0 0",
          width: "100%",
          maxWidth: "28rem",
          padding: "1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          boxShadow: "0 -4px 32px rgba(28,28,28,0.12)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {title && (
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.375rem",
              fontWeight: 500,
              color: "var(--color-ink)",
              marginBottom: "1rem",
            }}
          >
            {title}
          </h3>
        )}
        <div style={{ fontFamily: "var(--font-body)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
          {children}
        </div>
        {footer && (
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
