# Stride Frontend

Next.js frontend application for the Stride learning platform.

## Quick Start

```bash
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Charts**: Recharts
- **Drag & Drop**: @hello-pangea/dnd

## Project Structure

```
src/
├── app/              # Next.js pages
│   ├── (auth)/       # Authentication pages
│   └── (protected)/  # Protected pages (requires login)
├── components/       # React components
├── lib/              # Utilities and API client
├── store/            # Zustand state stores
└── types/            # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Authentication

The app uses JWT-based authentication. Tokens are stored in localStorage and automatically included in API requests via the API client (`src/lib/api.ts`).

## State Management

Uses Zustand for state management:
- `useAuthStore` - Authentication state
- `useCoursesStore` - Course management
- `useLessonsStore` - Lesson management
- `useThemeStore` - Theme preferences
- `useSidebarStore` - Sidebar state

For more details, see the main [README](../README.md) in the root directory.
