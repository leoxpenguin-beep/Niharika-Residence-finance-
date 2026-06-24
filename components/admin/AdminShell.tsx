"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Layers, Grid, FileText, CheckSquare, Settings, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Project Details", href: "/admin/project", icon: FileText },
  { label: "Floors & Areas", href: "/admin/floors", icon: Layers },
  { label: "Units Matrix", href: "/admin/units", icon: Grid },
  { label: "Costing Engine", href: "/admin/costing", icon: Database },
  { label: "Client Approvals", href: "/admin/approvals", icon: CheckSquare },
  { label: "Rate Library", href: "/admin/rates", icon: Settings },
];

export default function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin-login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-cream border-r border-border/50 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <h1 className="font-heading text-2xl tracking-wide">LEORA</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-taupe/20 text-foreground" 
                    : "text-muted-foreground hover:bg-taupe/10 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-3 truncate px-2">
            {userEmail}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
