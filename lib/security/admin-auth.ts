import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();
  // Use getUser() instead of getSession() — getUser() validates the JWT
  // against the Supabase Auth server making it secure and not spoofable.
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin-login");
  }

  return user;
}
