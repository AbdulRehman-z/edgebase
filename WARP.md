# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
- `bun dev` - Start development server with Turbopack (preferred)
- `bun start` - Start production server
- `bun build` - Build for production with Turbopack

### Database (Drizzle + Neon PostgreSQL)
- `bun drizzle:generate` - Generate database migrations
- `bun drizzle:migrate` - Run database migrations
- `bun drizzle:push` - Push schema changes to database

### Code Quality
- `bun lint` - Run Biome linter and checker
- `bun format` - Format code with Biome

## Architecture

This is a **Next.js 15** application using the **App Router** with the following key technologies:

### Core Stack
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **TailwindCSS** for styling with shadcn/ui components
- **Biome** for linting and formatting (not ESLint/Prettier)

### Database & ORM
- **Neon PostgreSQL** as database provider
- **Drizzle ORM** for database operations
- **Database schemas** located in `src/db/schemas/`
- **Migrations** stored in `src/db/migrations/`

### Authentication
- **Better Auth** for authentication system
- Supports email/password and social providers (Google, GitHub)
- Database adapter configured with Drizzle
- Auth configuration in `src/lib/auth.ts`

### API Layer
- **tRPC** for type-safe API routes
- **TanStack Query** for client-side data fetching
- tRPC router defined in `src/trpc/routers/_app.ts`
- API routes: `/api/trpc/[trpc]` and `/api/auth/[...all]`

### UI Components
- **shadcn/ui** component library with Radix UI primitives
- Components located in `src/components/ui/`
- **Lucide React** for icons
- **next-themes** for theme switching

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (tRPC + Auth)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/ui/         # shadcn/ui components
├── db/
│   ├── schemas/          # Drizzle database schemas
│   ├── migrations/       # Generated database migrations
│   └── index.ts         # Database connection
├── hooks/                # React hooks
├── lib/
│   ├── auth.ts          # Better Auth configuration
│   ├── auth-client.ts   # Client-side auth utilities
│   ├── env.ts           # Environment variables
│   └── utils.ts         # Utility functions
├── providers/           # React context providers
└── trpc/               # tRPC configuration
    ├── routers/        # API route definitions
    ├── client.tsx      # Client-side tRPC setup
    └── server.ts       # Server-side tRPC setup
```

## Environment Variables

Required environment variables (see `src/lib/env.ts`):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth

## Key Patterns

### Database Operations
- Use Drizzle ORM with the configured `db` export from `src/db/index.ts`
- Schema definitions use Drizzle's PostgreSQL dialect
- Migrations are auto-generated and should be committed

### Authentication
- Server-side: Import `auth` from `src/lib/auth.ts`
- Client-side: Use auth client utilities from `src/lib/auth-client.ts`
- Better Auth handles session management automatically

### API Development
- Add new procedures to tRPC routers in `src/trpc/routers/`
- Use Zod for input validation in tRPC procedures
- Client-side data fetching uses TanStack Query with tRPC integration

### UI Development
- Use existing shadcn/ui components from `src/components/ui/`
- Follow the established component patterns with Tailwind classes
- Theme support is built-in via next-themes provider

## Rules
Always use consistent response and API errors