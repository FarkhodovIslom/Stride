import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    env: process.env.NODE_ENV || 'development',
  },

  // CORS Configuration
  cors: {
    allowedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://tostride.netlify.app',
    ],
    credentials: true,
  },

  // API Routes Configuration
  routes: {
    auth: '/auth',
    users: '/users',
    courses: '/courses',
    lessons: '/lessons',
    dashboard: '/dashboard',
    health: '/api/health',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || '',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

export default config;
