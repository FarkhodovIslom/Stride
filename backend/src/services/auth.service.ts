import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { signToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validation';

export class AuthService {
    async register(email: string, password: string, name?: string) {
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (!validatePassword(password)) {
            throw new Error('Password must be at least 6 characters');
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
            },
        });

        const token = signToken({ id: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = signToken({ id: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        };
    }
}

export default new AuthService();
