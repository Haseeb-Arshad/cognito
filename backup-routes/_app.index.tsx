import { redirect } from "@remix-run/node";

/**
 * This route will automatically redirect users from the /app path to the dashboard
 */
export function loader() {
  return redirect("/app/dashboard");
}

export default function AppIndex() {
  return null;
}
