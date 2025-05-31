import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-offwhite dark:bg-charcoal">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-6 h-full">{children}</div>
      </main>
    </div>
  );
}
