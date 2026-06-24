import { requireAdmin } from "@/lib/security/admin-auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard all /admin routes
  const user = await requireAdmin();

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
