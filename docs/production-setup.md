# Production Database Setup

This guide explains how to set up and manage the production PostgreSQL database for DealSpot using Drizzle ORM.

## 1. Environment Configuration

1. Create a `.env` file in the root directory (use `.env.example` as a template).
2. Set the `DATABASE_URL` to your PostgreSQL connection string.
   - For Local: `postgresql://user:password@localhost:5432/dealspot`
   - For Neon/Supabase: Use the connection string provided in their dashboard.

## 2. Database Commands

### Generate Migrations
Run this whenever you change `src/db/schema.ts`:
```bash
npx drizzle-kit generate
```

### Push Schema (Development)
Sync the database schema directly without creating migration files (fast for local dev):
```bash
npx drizzle-kit push
```

### Run Migrations (Production)
Apply generated migrations to the database:
```bash
npx drizzle-kit migrate
```

### Drizzle Studio
Open a browser-based GUI to view and edit your database data:
```bash
npx drizzle-kit studio
```

## 3. Testing Connection

Verify that your `.env` is correctly configured and the database is reachable:
```bash
npx tsx src/db/test-connection.ts
```

## 5. Cloudinary Setup (Phase 2)

We now use Cloudinary for product image storage.
1. Add the following to your `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Images uploaded via the Admin panel are now stored in the `products` folder on Cloudinary.

## 6. Security Note

> [!WARNING]
> Administrative APIs (`/api/admin/*`) are currently functional but **unprotected** on the server side. While the UI requires a login, the endpoints can be reached directly.
> Full server-side authentication (NextAuth/JWT) is scheduled for **Phase 3**.

## 7. Phase 2 Status
- Admin Product CRUD: Migrated to PostgreSQL.
- Admin Order Management: Migrated to PostgreSQL.
- Image Storage: Migrated to Cloudinary.
- LocalStorage: No longer the source of truth for Products or Orders.
