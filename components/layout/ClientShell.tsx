import type { ReactNode } from "react";

interface ClientShellProps {
  children: ReactNode;
}

/**
 * ClientShell — wraps all client-facing pages.
 * Sets the Soft Heritage Contemporary background, max-width mobile container,
 * and safe-area padding for iOS devices.
 */
export default function ClientShell({ children }: ClientShellProps) {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div className="mx-auto w-full max-w-md relative">
        {children}
      </div>
    </div>
  );
}
