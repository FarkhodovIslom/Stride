import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, BarChart3, Flame, ClipboardList } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <BookOpen className="w-16 h-16 text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
          Welcome to <span className="text-primary-400">Stride</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Track your learning progress, build streaks, and achieve your goals.
          Organize your courses and lessons with an intuitive dashboard.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth"
            className="px-6 py-3 bg-primary-400 text-gray-900 font-medium rounded-lg hover:bg-primary-500 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth"
            className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="w-8 h-8 mb-3 text-primary-400">
            <BarChart3 className="w-full h-full" />
          </div>
          <h3 className="font-semibold text-[var(--foreground)] mb-2">
            Track Progress
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Monitor your learning journey with visual progress indicators
          </p>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="w-8 h-8 mb-3 text-orange-500">
            <Flame className="w-full h-full" />
          </div>
          <h3 className="font-semibold text-[var(--foreground)] mb-2">
            Build Streaks
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Stay motivated with daily learning streaks
          </p>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="w-8 h-8 mb-3 text-blue-500">
            <ClipboardList className="w-full h-full" />
          </div>
          <h3 className="font-semibold text-[var(--foreground)] mb-2">
            Kanban Board
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Organize lessons with drag-and-drop Kanban boards
          </p>
        </div>
      </div>
    </main>
  );
}
