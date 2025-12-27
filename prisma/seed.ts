import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@stride.app" },
    update: {},
    create: {
      email: "demo@stride.app",
      password: hashedPassword,
      name: "Demo User",
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create courses with lessons
  const coursesData = [
    {
      title: "React Fundamentals",
      description:
        "Learn the basics of React including components, props, state, and hooks.",
      lessons: [
        { title: "Introduction to React", status: "completed", completed: true },
        { title: "JSX and Components", status: "completed", completed: true },
        { title: "Props and State", status: "completed", completed: true },
        { title: "useState Hook", status: "progress", completed: false },
        { title: "useEffect Hook", status: "planned", completed: false },
        { title: "Custom Hooks", status: "planned", completed: false },
        { title: "Context API", status: "planned", completed: false },
      ],
    },
    {
      title: "TypeScript Essentials",
      description:
        "Master TypeScript fundamentals for building type-safe applications.",
      lessons: [
        { title: "TypeScript Setup", status: "completed", completed: true },
        { title: "Basic Types", status: "completed", completed: true },
        { title: "Interfaces and Types", status: "progress", completed: false },
        { title: "Generics", status: "planned", completed: false },
        { title: "Utility Types", status: "planned", completed: false },
      ],
    },
    {
      title: "Next.js App Router",
      description:
        "Build modern web applications with Next.js 14+ App Router.",
      lessons: [
        { title: "Project Setup", status: "completed", completed: true },
        { title: "File-based Routing", status: "progress", completed: false },
        { title: "Server Components", status: "planned", completed: false },
        { title: "Data Fetching", status: "planned", completed: false },
        { title: "API Routes", status: "planned", completed: false },
        { title: "Middleware", status: "planned", completed: false },
        { title: "Authentication", status: "planned", completed: false },
        { title: "Deployment", status: "planned", completed: false },
      ],
    },
    {
      title: "Tailwind CSS",
      description: "Utility-first CSS framework for rapid UI development.",
      lessons: [
        { title: "Installation & Config", status: "completed", completed: true },
        { title: "Utility Classes", status: "completed", completed: true },
        { title: "Responsive Design", status: "completed", completed: true },
        { title: "Dark Mode", status: "completed", completed: true },
        { title: "Custom Themes", status: "completed", completed: true },
      ],
    },
  ];

  for (const courseData of coursesData) {
    // Delete existing course with same title for this user
    await prisma.course.deleteMany({
      where: {
        userId: user.id,
        title: courseData.title,
      },
    });

    // Create course with lessons
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        userId: user.id,
        lessons: {
          create: courseData.lessons.map((lesson, index) => ({
            title: lesson.title,
            status: lesson.status,
            completed: lesson.completed,
            completedAt: lesson.completed
              ? new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
              : null,
          })),
        },
      },
      include: {
        lessons: true,
      },
    });

    console.log(
      `✅ Created course: ${course.title} with ${course.lessons.length} lessons`
    );
  }

  console.log("\n🎉 Seed completed!");
  console.log("\n📧 Demo credentials:");
  console.log("   Email: demo@stride.app");
  console.log("   Password: demo123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
