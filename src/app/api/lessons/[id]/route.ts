import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing lesson and verify ownership
    const existingLesson = await prisma.lesson.findFirst({
      where: { id },
      include: {
        course: {
          select: { userId: true },
        },
      },
    });

    if (!existingLesson || existingLesson.course.userId !== session.user.id) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const { title, status, completed } = await request.json();

    const updateData: {
      title?: string;
      status?: string;
      completed?: boolean;
      completedAt?: Date | null;
    } = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (completed !== undefined) {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date() : null;
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing lesson and verify ownership
    const existingLesson = await prisma.lesson.findFirst({
      where: { id },
      include: {
        course: {
          select: { userId: true },
        },
      },
    });

    if (!existingLesson || existingLesson.course.userId !== session.user.id) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
