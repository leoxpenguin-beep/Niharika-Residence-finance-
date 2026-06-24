import { redirect } from "next/navigation";

/**
 * Root route — redirects to the client cost story.
 * Admin goes to /admin directly.
 */
export default function RootPage() {
  redirect("/client");
}
