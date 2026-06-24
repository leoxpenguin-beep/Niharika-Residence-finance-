import type { ReactNode } from "react";

interface AdminShellProps {
  children: ReactNode;
}

/**
 * AdminShell — wraps all admin pages.
 * Internal use only. Never shown on client routes.
 * Stage 5 will add the sidebar navigation and header.
 */
export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Sidebar placeholder — Stage 5 */}
      <aside className="hidden md:flex w-56 flex-shrink-0 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">LEORA Admin</p>
          <p className="text-sm text-gray-600 mt-0.5">Niharika Residence</p>
        </div>
        <nav className="flex-1 p-4">
          <p className="text-xs text-gray-400">Navigation — Stage 5</p>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
