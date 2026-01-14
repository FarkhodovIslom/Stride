"use client";

import { StatsSkeleton } from "@/components/ui";
import { ErrorBoundary, DashboardErrorFallback } from "@/components/ui/ErrorBoundary";
import StatsCard from "@/components/dashboard/StatsCard";
import StreakDisplay from "@/components/dashboard/StreakDisplay";
import TodayTasks from "@/components/dashboard/TodayTasks";
import ProgressChart from "@/components/dashboard/ProgressChart";
import { getGreeting } from "@/lib/utils";
import { BookOpen, FileText, CheckCircle, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStats, useCompleteLesson } from "@/hooks/useDashboard";

function DashboardContent() {
  const { user } = useAuthStore();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  const completeLesson = useCompleteLesson();

  const handleToggleComplete = (id: string, _courseId: string) => {
    if (completeLesson.isPending) return;
    completeLesson.mutate(id);
  };

  // Create a set of tasks being completed for the loading indicator
  const completingTasks = new Set<string>(
    completeLesson.isPending && completeLesson.variables
      ? [completeLesson.variables]
      : []
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--foreground)]"
            aria-label={`${getGreeting()}, ${user?.name || "Learner"}`}
          >
            {getGreeting()}, {user?.name || "Learner"}!
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Here&apos;s your learning progress overview
          </p>
        </div>
        {stats && (
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            aria-label="Refresh dashboard data"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          role="status"
          aria-label="Loading dashboard data"
        >
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
        </div>
      ) : error ? (
        <DashboardErrorFallback
          error={error as Error}
          resetError={() => refetch()}
        />
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            role="region"
            aria-label="Learning statistics"
          >
            <StatsCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={<BookOpen className="w-6 h-6" aria-hidden="true" />}
              aria-label={`Total courses: ${stats.totalCourses}`}
            />
            <StatsCard
              title="Total Lessons"
              value={stats.totalLessons}
              icon={<FileText className="w-6 h-6" aria-hidden="true" />}
              aria-label={`Total lessons: ${stats.totalLessons}`}
            />
            <StatsCard
              title="Completed"
              value={stats.completedLessons}
              icon={<CheckCircle className="w-6 h-6" aria-hidden="true" />}
              subtitle={`${stats.progressPercentage}% complete`}
              aria-label={`Completed lessons: ${stats.completedLessons}, ${stats.progressPercentage}% complete`}
            />
            <StreakDisplay
              streak={stats.streak}
              aria-label={`Learning streak: ${stats.streak} days`}
            />
          </div>

          {/* Charts and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart
              completed={stats.completedLessons}
              total={stats.totalLessons}
            />
            <TodayTasks
              tasks={stats.todayTasks}
              onToggleComplete={handleToggleComplete}
              completingTasks={completingTasks}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
