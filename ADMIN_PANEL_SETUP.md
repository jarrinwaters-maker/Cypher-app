# C705 Admin Panel Setup Guide

## ✅ What's Been Implemented

### Backend (NestJS)
- ✅ Admin authentication endpoints (`/admin/*`)
- ✅ Dashboard statistics endpoint
- ✅ Journalist management endpoints
- ✅ User management endpoints
- ✅ All endpoints protected with `@Roles(Role.ADMIN)` guard
- ✅ Admin module integrated into app

### Frontend (Next.js)
- ✅ Admin login page
- ✅ Dashboard with statistics
- ✅ Journalist management (view journalists, create invite codes)
- ✅ Articles management (view, delete)
- ✅ Cyphers management (view active cyphers)
- ✅ Users management (view all users)
- ✅ Public Terms of Use page (`/terms`)
- ✅ Public Privacy Policy page (`/privacy`)
- ✅ Secure authentication flow
- ✅ Sidebar navigation

## 🚀 Quick Start

### 1. Create Admin User in Database

First, you need to manually create an admin user in your database. You can do this via:

**Option A: Direct Database Insert**
```sql
INSERT INTO "User" (id, email, password, role, "createdAt")
VALUES (
  gen_random_uuid(),
  'admin@c705.com',
  '$2b$10$YOUR_HASHED_PASSWORD_HERE',  -- Use bcrypt to hash your password
  'ADMIN',
  NOW()
);
```

**Option B: Use Backend Signup (then update role)**
1. Sign up normally through the app
2. Update the user's role to ADMIN in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-admin-email@example.com';
```

**To hash a password for Option A:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(h => console.log(h))"
```

### 2. Start Backend

```bash
cd c705-backend
npm run start:dev
```

Backend should run on `http://localhost:3000`

### 3. Start Admin Panel

```bash
cd c705-admin
npm install
cp .env.local.example .env.local
npm run dev
```

Admin panel will run on `http://localhost:3001`

### 4. Login

1. Open `http://localhost:3001`
2. You'll be redirected to `/login`
3. Enter your admin email and password
4. You'll be redirected to `/dashboard`

## 📋 Admin Panel Features

### Dashboard (`/dashboard`)
- Overview statistics (users, artists, journalists, articles, cyphers, beats)
- Trending cyphers list

### Journalists (`/dashboard/journalists`)
- View all active journalists
- View all invite codes (used and unused)
- Create new journalist invite codes
- Set optional email and expiration date

### Articles (`/dashboard/articles`)
- View all articles
- Delete articles
- See article details (title, city, author, date)

### Cyphers (`/dashboard/cyphers`)
- View all cyphers
- See cypher status (active/inactive)
- View creation dates

### Users (`/dashboard/users`)
- View all users
- See user roles
- View user activity (articles, cyphers count)
- See join dates

### Public Pages
- `/terms` - Terms of Use (no auth required)
- `/privacy` - Privacy Policy (no auth required)

## 🔒 Security Features

✅ **Admin-only access**: All admin endpoints require `ADMIN` role
✅ **JWT authentication**: Secure token-based auth
✅ **Role verification**: Backend checks role on every request
✅ **No admin signup**: Admins must be created manually
✅ **Token expiration**: JWT tokens expire after 7 days
✅ **Protected routes**: Frontend redirects non-admins to login

## 🌐 Deployment

### Backend
Deploy your NestJS backend to your hosting service (Heroku, AWS, etc.)

### Admin Panel
Deploy to Vercel (recommended):
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
4. Deploy

Or deploy to Netlify:
1. Build: `npm run build`
2. Deploy the `out` folder (if using static export) or use Netlify's Next.js support

## 📝 Environment Variables

### Admin Panel (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```
NEXT_PUBLIC_API_URL=https://api.c705.com
```

## 🔗 API Endpoints

### Admin Endpoints (All require ADMIN role)
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/journalists` - Get all journalists
- `GET /admin/users` - Get all users
- `GET /admin/me` - Get current admin info

### Journalist Invites
- `POST /journalist-invites` - Create invite code (ADMIN only)
- `GET /journalist-invites` - Get all invites (ADMIN only)
- `GET /journalist-invites/unused` - Get unused invites (ADMIN only)
- `POST /journalist-invites/verify` - Verify code (public, for app signup)

## ✅ Testing Checklist

- [ ] Create admin user in database
- [ ] Start backend server
- [ ] Start admin panel
- [ ] Login with admin credentials
- [ ] View dashboard statistics
- [ ] Create journalist invite code
- [ ] View journalists list
- [ ] View articles
- [ ] View cyphers
- [ ] View users
- [ ] Access `/terms` page (should work without login)
- [ ] Access `/privacy` page (should work without login)
- [ ] Try accessing dashboard without login (should redirect)

## 🎨 UI Design

The admin panel matches your app's style:
- Clean white background
- Blue accent color (same as app)
- Rounded buttons (pill-style)
- Card-based layout
- Simple, minimal design

## 📱 Next Steps

1. **Customize Terms & Privacy**: Update the content in `/app/terms/page.tsx` and `/app/privacy/page.tsx` with your actual legal text
2. **Add more features**: Extend the admin panel with additional management features as needed
3. **Deploy**: Deploy both backend and admin panel to production
4. **Link in App Store**: Add links to `/terms` and `/privacy` in your App Store submission

## 🆘 Troubleshooting

**Can't login?**
- Verify admin user exists in database with `role = 'ADMIN'`
- Check password is correctly hashed
- Check backend is running on correct port
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

**403 Forbidden errors?**
- Verify user role is `ADMIN` in database
- Check JWT token is being sent in requests
- Verify backend guards are working

**CORS errors?**
- Make sure backend CORS is configured to allow admin panel origin
- Check `app.enableCors()` in `main.ts` includes your admin panel URL
