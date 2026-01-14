import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Starting database seed...');

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
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

    // Create a sample course
    const course = await prisma.course.upsert({
        where: { id: 'sample-course-1' },
        update: {},
        create: {
            id: 'sample-course-1',
            title: 'Introduction to TypeScript',
            description: 'Learn the basics of TypeScript',
            userId: user.id,
        },
    });

    console.log('✅ Created sample course:', course.title);

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
