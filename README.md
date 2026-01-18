# LinkUp Pods

Find your people to level up. LinkUp Pods is a social marketplace + accountability network that combines looking-for posts, pods, micro-mentors, and a skill swap marketplace.

## Features

- Auth with credentials + Google OAuth (NextAuth)
- Personalized onboarding and profiles
- Looking For feed with posts + matches
- Pods with weekly check-ins and streak tracking
- Realtime messaging via Socket.io
- Marketplace listings
- Micro-mentor profiles + booking requests
- Admin moderation tools + reporting
- Prisma ORM + PostgreSQL with seed data

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui components
- Prisma ORM + PostgreSQL
- NextAuth (credentials + Google OAuth)
- React Hook Form + Zod
- UploadThing for avatar/proof uploads
- Socket.io for realtime messaging
- Vitest for minimal smoke tests

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (optional, for local Postgres)

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### Run Postgres with Docker

```bash
docker compose up -d
```

### Install Dependencies

```bash
npm install
```

### Prisma Setup

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Run the Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Tests

```bash
npm run test
```

## Notes

- Password reset is implemented as a direct reset by email for MVP usage. In production, add signed tokens and email verification.
- Rate limiting is in-memory; deploy with a shared store (Redis) for scaling.
- UploadThing routes are configured for avatar and proof uploads.

## Folder Structure

```
/src
  /app
  /components
  /lib
  /server
/prisma
/scripts
/tests
```

## Seeded Accounts

- Admin: `alex@example.com` / `password123`

## Local URLs

- Feed: `/feed`
- Pods: `/pods`
- Marketplace: `/marketplace`
- Mentors: `/mentors`
- Admin: `/admin`

