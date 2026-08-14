# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at: **http://localhost:3001**

## 4. Create Admin User

Before you can login, you need to create an admin user in your database.

### Option 1: Using Prisma Studio
```bash
cd ../c705_db
npx prisma studio
```
Then manually create a user with `role = 'ADMIN'`

### Option 2: Using SQL
```sql
-- First, hash your password (use Node.js or online bcrypt tool)
-- Then insert:
INSERT INTO "User" (id, email, password, role, "createdAt")
VALUES (
  gen_random_uuid(),
  'admin@c705.com',
  '$2b$10$YOUR_HASHED_PASSWORD',
  'ADMIN',
  NOW()
);
```

### Option 3: Sign up normally, then update role
1. Sign up through the app with any email
2. Update the user's role:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 5. Login

1. Open http://localhost:3001
2. Enter your admin email and password
3. You'll be redirected to the dashboard

## Features Available

- 📊 **Dashboard**: Overview statistics
- ✍️ **Journalists**: Manage journalists and create invite codes
- 📰 **Articles**: View and manage articles
- 🎤 **Cyphers**: View and manage cyphers
- 👥 **Users**: View all users
- 📄 **Terms & Privacy**: Public pages (accessible at `/terms` and `/privacy`)

## Troubleshooting

**Can't login?**
- Make sure backend is running on port 3000
- Verify admin user exists with `role = 'ADMIN'`
- Check `.env.local` has correct API URL

**CORS errors?**
- Backend CORS is already configured to allow all origins
- If issues persist, check backend is running

**404 errors?**
- Make sure backend admin endpoints are working
- Test with: `curl http://localhost:3000/admin/dashboard` (with auth token)
