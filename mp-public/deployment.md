# Deployment Guide

This document provides instructions on how to deploy the MP Kids School website and its integrated admin panel.

## Unified Deployment

The admin panel is built directly into the Next.js application (located at `/src/app/admin`). Therefore, you **do not** need to deploy it separately. When you deploy the main website, the admin panel is automatically included.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js 18.x or later installed.
2.  **Database**: The project uses **PostgreSQL** for production (via Prisma).
    > [!IMPORTANT]
    > For platforms like **Vercel**, use a hosted database (e.g., Vercel Postgres, Neon, or Supabase). SQLite is not supported for persistent production data on Vercel.

## Environment Variables

Ensure the following environment variables are set in your deployment environment (e.g., Vercel Dashboard):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret for session encryption | Use `openssl rand -base64 32` |
| `NEXTAUTH_URL` | The base URL of your site | `https://your-school-site.com` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity Project ID | `2n34cvh7` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity Dataset | `production` |
| `SANITY_API_TOKEN` | Sanity Read/Write Token | `sk...` |

## Deployment Steps

### 1. Build the Application
Run the build command to generate a production-ready bundle.
```bash
npm run build
```

### 2. Prepare the Database (Prisma)
Before starting the app, you must sync your schema with the production database and generate the client.

#### Step A: Generate Prisma Client
```bash
npx prisma generate
```

#### Step B: Sync Schema to Production
Use `db push` to quickly sync your schema to your remote database (Postgres).
```bash
npx prisma db push
```

#### Step C: Seed Initial Data (Hero Slides, etc.)
To populate the Hero section and other initial data, run the seed script:
```bash
npx ts-node -P tsconfig.json -r tsconfig-paths/register prisma/seed.ts
```

### 3. Start the Application
If you are running on a VPS:
```bash
npm run start
```
On **Vercel**, the deployment should happen automatically after you push your changes to GitHub.

## Accessing the Admin Panel

Once deployed, the admin panel will be available at:
`https://your-site.com/admin`

Initial admin credentials (created during seed):
- **Email**: `admin@mppublicschool.org`
- **Password**: `admin123`
