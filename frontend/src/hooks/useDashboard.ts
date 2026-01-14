"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { DashboardStats } from "@/types";

// Query keys for cache management
export const dashboardKeys = {
    all: ["dashboard"] as const,
    stats: () => [...dashboardKeys.all, "stats"] as const,
};

// Fetch dashboard stats
async function fetchDashboardStats(): Promise<DashboardStats> {
    const data = await apiClient.get<{ stats: DashboardStats }>(
        "/dashboard/stats",
        true
    );
    return data.stats;
}

// Complete a lesson
async function completeLesson(lessonId: string): Promise<void> {
    await apiClient.put(
        `/lessons/${lessonId}`,
        { completed: true, status: "completed" },
        true
    );
}

/**
 * Hook for fetching and caching dashboard stats
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: dashboardKeys.stats(),
        queryFn: fetchDashboardStats,
    });
}

/**
 * Hook for completing a lesson with optimistic updates and cache invalidation
 */
export function useCompleteLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeLesson,
        onMutate: async (lessonId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: dashboardKeys.stats() });

            // Snapshot previous value
            const previousStats = queryClient.getQueryData<DashboardStats>(
                dashboardKeys.stats()
            );

            // Optimistic update
            if (previousStats) {
                queryClient.setQueryData<DashboardStats>(dashboardKeys.stats(), {
                    ...previousStats,
                    todayTasks: previousStats.todayTasks.filter((t) => t.id !== lessonId),
                    completedLessons: previousStats.completedLessons + 1,
                    progressPercentage:
                        previousStats.totalLessons > 0
                            ? Math.round(
                                ((previousStats.completedLessons + 1) /
                                    previousStats.totalLessons) *
                                100
                            )
                            : 0,
                });
            }

            return { previousStats };
        },
        onError: (_error, _lessonId, context) => {
            // Rollback on error
            if (context?.previousStats) {
                queryClient.setQueryData(dashboardKeys.stats(), context.previousStats);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
        },
    });
}
