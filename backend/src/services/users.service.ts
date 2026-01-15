import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { validatePasswordStrength } from '../utils/validation';

export class UsersService {
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateProfile(userId: string, name: string) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Name is required and must be a non-empty string');
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name: name.trim() },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return updatedUser;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password strength
        const passwordValidation = validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(`Invalid password: ${passwordValidation.errors.join(', ')}`);
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new Error('New password must be different from current password');
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
}

export default new UsersService();
