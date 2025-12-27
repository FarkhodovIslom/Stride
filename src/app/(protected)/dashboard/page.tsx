"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StatsSkeleton } from "@/components/ui";
import StatsCard from "@/components/dashboard/StatsCard";
import StreakDisplay from "@/components/dashboard/StreakDisplay";
import TodayTasks from "@/components/dashboard/TodayTasks";
import ProgressChart from "@/components/dashboard/ProgressChart";
import { getGreeting } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleToggleComplete = async (id: string, courseId: string) => {
    // Optimistic update
    if (stats) {
      setStats({
        ...stats,
        todayTasks: stats.todayTasks.filter((t) => t.id !== id),
        completedLessons: stats.completedLessons + 1,
        progressPercentage:
          stats.totalLessons > 0
            ? Math.round(((stats.completedLessons + 1) / stats.totalLessons) * 100)
            : 0,
      });
    }

    try {
      await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true, status: "completed" }),
      });
    } catch (error) {
      console.error("Failed to toggle lesson:", error);
      // Revert on error - refetch stats
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {getGreeting()}, {session?.user?.name || "Learner"}!
        </h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Here&apos;s your learning progress overview
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={<span>📚</span>}
            />
            <StatsCard
              title="Total Lessons"
              value={stats.totalLessons}
              icon={<span>📝</span>}
            />
            <StatsCard
              title="Completed"
              value={stats.completedLessons}
              icon={<span>✅</span>}
              subtitle={`${stats.progressPercentage}% complete`}
            />
            <StreakDisplay streak={stats.streak} />
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
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          Failed to load dashboard data
        </div>
      )}
    </div>
  );
}
