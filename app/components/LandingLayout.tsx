import { ReactNode } from "react";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-offwhite overflow-x-hidden">
      {children}
    </div>
  );
}
