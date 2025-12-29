"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMinimized } = useSidebarStore();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className={`transition-all duration-300 ease-in-out ${
        isMinimized ? "ml-16" : "ml-64"
      } p-8`}>
        {children}
      </main>
    </div>
  );
}
