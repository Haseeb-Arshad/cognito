import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import InternalSidebar from "~/components/InternalSidebar";

/**
 * This is the main application shell for all authenticated routes
 * It provides the sidebar navigation and layout structure
 * All authenticated routes will be nested under this layout
 */
export default function AppLayout() {
  return (
    <div className="flex h-screen bg-offwhite dark:bg-charcoal">
      {/* Sidebar - fixed position */}
      <InternalSidebar />
      
      {/* Main Content - with left margin to accommodate sidebar */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
