# Stride - Learning Progress Dashboard

A full-stack web application for tracking learning progress with courses, lessons, and learning streaks.

## Architecture

This project is organized as a monorepo with separate frontend and backend:

```
stride/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── README.md          # This file
└── LICENSE
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Charts**: Recharts
- **Drag & Drop**: @hello-pangea/dnd

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Features

- 🔐 User authentication (JWT-based)
- 📊 Dashboard with progress stats and learning streak
- 📚 Course management (CRUD)
- 📝 Lesson management with Kanban board
- 🎯 Drag & drop lesson status updates
- 🌓 Light/Dark theme toggle
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FarkhodovIslom/Stride.git
cd stride
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

**Backend** (`backend/.env`):
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend** (`frontend/.env.local`):
```bash
cd frontend
echo 'NEXT_PUBLIC_API_URL="http://localhost:4000"' > .env.local
```

4. Set up the database:
```bash
cd backend
npm run db:generate
npm run db:push
```

5. (Optional) Seed demo data:
```bash
cd backend
npm run db:seed
```

## Running the Application

You need to run both the backend and frontend servers:

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:4000`

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## Project Structure

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Authentication pages
│   │   └── (protected)/  # Protected pages (dashboard, courses)
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── courses/      # Course management components
│   │   └── lessons/      # Lesson management components
│   ├── lib/              # Utilities and API client
│   ├── store/            # Zustand state management
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── package.json
└── README.md
```

### Backend (`/backend`)
```
backend/
├── src/
│   ├── index.ts          # Express server entry point
│   ├── config/           # Database and app configuration
│   ├── middleware/       # Express middleware (auth, errors)
│   ├── routes/           # API route definitions
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions (JWT, validation)
│   └── types/            # TypeScript type definitions
├── prisma/
│   └── schema.prisma     # Database schema
├── package.json
└── README.md
```

## API Documentation

The backend exposes the following REST API endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update user profile

### Courses
- `GET /courses` - Get all user courses
- `GET /courses/:id` - Get specific course
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Lessons
- `POST /lessons` - Create new lesson
- `GET /lessons/:id` - Get specific lesson
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson

### Dashboard
- `GET /dashboard/stats` - Get user statistics

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint

## Deployment

### Backend Deployment (Render, Railway, Fly.io)

1. Create a PostgreSQL database
2. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secure random string
   - `FRONTEND_URL` - Your frontend domain
3. Deploy backend service
4. Run database migrations

### Frontend Deployment (Vercel, Netlify)

1. Set environment variable:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
2. Deploy frontend application

## Demo Credentials

After seeding the database:
- Email: `demo@stride.app`
- Password: `demo123`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
