# Stride - Learning Progress Dashboard

A web application for tracking learning progress with courses, lessons, and learning streaks.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials)
- **State Management**: Zustand
- **Charts**: Recharts
- **Drag & Drop**: @hello-pangea/dnd

## Features

- User authentication (register/login)
- Dashboard with progress stats and learning streak
- Course management (CRUD)
- Lesson management with Kanban board
- Drag & drop lesson status updates
- Light/Dark theme toggle
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stride
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/stride"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Generate Prisma client and push schema:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed demo data:
```bash
npm run db:seed
```

Demo credentials:
- Email: demo@stride.app
- Password: demo123

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes
│   ├── (protected)/        # Protected routes
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── dashboard/          # Dashboard components
│   ├── courses/            # Course components
│   └── lessons/            # Lesson components
├── lib/                    # Utilities and configs
├── store/                  # Zustand stores
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed demo data
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Frontend (Netlify)

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables in Netlify dashboard

### Backend (Render)

1. Create PostgreSQL database on Render
2. Get connection string and update `DATABASE_URL`
3. Deploy Next.js app or use separate API

## License

MIT
