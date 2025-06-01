import { Outlet } from "@remix-run/react";
import AppSidebar from "~/components/AppSidebar";

/**
 * This is the main application shell for all authenticated routes
 * It provides the sidebar navigation and layout structure
 */
export default function AppLayout() {
  return (
    <div className="flex h-screen bg-offwhite dark:bg-charcoal">
      {/* Sidebar - fixed position */}
      <AppSidebar />
      
      {/* Main Content - with left margin to accommodate sidebar */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
