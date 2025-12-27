import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateStreak } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: { userId: session.user.id },
      include: {
        lessons: true,
      },
    });

    const allLessons = courses.flatMap((c) => c.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) => l.completed).length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Calculate streak
    const completedDates = allLessons
      .filter((l) => l.completedAt)
      .map((l) => l.completedAt as Date);
    const streak = calculateStreak(completedDates);

    // Today's tasks (incomplete lessons)
    const todayTasks = allLessons
      .filter((l) => !l.completed)
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        title: l.title,
        status: l.status,
        completed: l.completed,
        completedAt: l.completedAt,
        courseId: l.courseId,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      }));

    return NextResponse.json({
      stats: {
        totalCourses: courses.length,
        totalLessons,
        completedLessons,
        progressPercentage,
        streak,
        todayTasks,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
