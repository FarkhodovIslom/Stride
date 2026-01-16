import prisma from '../config/database';

export class CategoriesService {
    async createCategory(userId: string, data: { name: string; color?: string }) {
        const category = await prisma.noteCategory.create({
            data: {
                name: data.name,
                color: data.color || '#6366f1',
                userId,
            },
        });
        return category;
    }

    async getCategories(userId: string) {
        const categories = await prisma.noteCategory.findMany({
            where: { userId },
            include: {
                _count: { select: { notes: true } },
            },
            orderBy: { name: 'asc' },
        });
        return categories;
    }

    async updateCategory(
        categoryId: string,
        userId: string,
        data: { name?: string; color?: string }
    ) {
        const category = await prisma.noteCategory.findFirst({
            where: { id: categoryId, userId },
        });

        if (!category) {
            throw new Error('Category not found');
        }

        const updatedCategory = await prisma.noteCategory.update({
            where: { id: categoryId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.color !== undefined && { color: data.color }),
            },
        });

        return updatedCategory;
    }

    async deleteCategory(categoryId: string, userId: string) {
        const category = await prisma.noteCategory.findFirst({
            where: { id: categoryId, userId },
        });

        if (!category) {
            throw new Error('Category not found');
        }

        await prisma.noteCategory.delete({
            where: { id: categoryId },
        });
    }
}

export default new CategoriesService();
