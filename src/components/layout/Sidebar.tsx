"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Courses",
    href: "/courses",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMinimized, toggleSidebar } = useSidebarStore();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r border-[var(--border)] bg-[var(--card)] transition-all duration-300 ease-in-out",
      isMinimized ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo and Toggle */}
        <div className={cn(
          "flex items-center border-b border-[var(--border)] py-5",
          isMinimized ? "justify-center px-0" : "justify-between px-6"
        )}>
          {!isMinimized && (
            <>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold text-[var(--foreground)]">
                  Stride
                </span>
              </div>
            </>
          )}
          {isMinimized && (
            <BookOpen className="w-6 h-6 text-primary-400" />
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors",
              isMinimized && "absolute -right-4 top-5 z-50 bg-[var(--card)] border border-[var(--border)] shadow-sm"
            )}
          >
            {isMinimized ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 py-4",
          isMinimized ? "px-2" : "px-4"
        )}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg transition-colors",
                    isMinimized ? "justify-center p-3" : "justify-start gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-primary-400/10 text-primary-400"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                  title={isMinimized ? item.name : undefined}
                >
                  {item.icon}
                  {!isMinimized && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-[var(--border)]",
          isMinimized ? "p-2" : "px-4 py-4"
        )}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={cn(
              "flex items-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors",
              isMinimized ? "justify-center p-3 w-full" : "justify-start gap-3 w-full px-3 py-2.5"
            )}
            title={isMinimized ? "Sign Out" : undefined}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isMinimized && (
              <span className="font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
