import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Starting database seed...');

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Using upsert for User to verify transactions support (requires Replica Set)
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
        },
    });

    console.log('✅ Created test user:', user.email);

    // Check if sample course already exists for this user
    let course = await prisma.course.findFirst({
        where: { 
            userId: user.id,
            title: 'Introduction to TypeScript'
        },
    });

    if (!course) {
        // Create a sample course
        course = await prisma.course.create({
            data: {
                title: 'Introduction to TypeScript',
                description: 'Learn the basics of TypeScript',
                userId: user.id,
            },
        });
        console.log('✅ Created sample course:', course.title);
    } else {
        console.log('✅ Sample course already exists:', course.title);
    }

    // Check if lessons already exist
    const existingLessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
    });

    if (existingLessons.length === 0) {
        // Create sample lessons
        const lessons = await Promise.all([
            prisma.lesson.create({
                data: {
                    title: 'Variables and Types',
                    status: 'completed',
                    completed: true,
                    completedAt: new Date(),
                    courseId: course.id,
                },
            }),
            prisma.lesson.create({
                data: {
                    title: 'Functions and Interfaces',
                    status: 'in-progress',
                    completed: false,
                    courseId: course.id,
                },
            }),
            prisma.lesson.create({
                data: {
                    title: 'Advanced Types',
                    status: 'planned',
                    completed: false,
                    courseId: course.id,
                },
            }),
        ]);

        console.log(`✅ Created ${lessons.length} sample lessons`);
    } else {
        console.log(`✅ ${existingLessons.length} lessons already exist`);
    }

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
}

seed()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
