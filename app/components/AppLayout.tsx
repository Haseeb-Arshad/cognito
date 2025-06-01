import { ReactNode } from "react";
import { motion } from "framer-motion";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-offwhite dark:bg-charcoal">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto">
        <motion.div 
          className="p-6 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">{title}</h1>
            </div>
          )}
          {children}
        </motion.div>
      </main>
    </div>
  );
}
