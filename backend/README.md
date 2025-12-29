# Stride Backend API

Backend API server for the Stride learning platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, CORS enabled

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
DATABASE_URL="file:../prisma/dev.db"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 3. Database Setup

Generate Prisma client and create database:

```bash
npm run db:generate
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:4000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users/profile` - Get current user profile (Protected)
- `PATCH /users/profile` - Update user profile (Protected)

### Courses

- `GET /courses` - Get all user courses (Protected)
- `GET /courses/:id` - Get specific course (Protected)
- `POST /courses` - Create new course (Protected)
- `PUT /courses/:id` - Update course (Protected)
- `DELETE /courses/:id` - Delete course (Protected)

### Lessons

- `POST /lessons` - Create new lesson (Protected)
- `GET /lessons/:id` - Get specific lesson (Protected)
- `PUT /lessons/:id` - Update lesson (Protected)
- `DELETE /lessons/:id` - Delete lesson (Protected)

### Dashboard

- `GET /dashboard/stats` - Get user statistics (Protected)

## Protected Routes

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware (auth, errors)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions
│   └── index.ts         # Main server file
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```
