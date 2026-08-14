# C705 Admin Panel

Web-based admin dashboard for managing the C705 app.

## Features

- 🔐 Secure admin authentication
- 👥 User management
- ✍️ Journalist invite code generation
- 📰 Article management
- 🎤 Cypher moderation
- 📊 Dashboard with statistics
- 📄 Public Terms of Use and Privacy Policy pages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Admin Access

- Admins must be created manually in the database with `role = 'ADMIN'`
- Use the login page to sign in with admin credentials
- Only users with ADMIN role can access the dashboard

## Deployment

The admin panel can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any static hosting service

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable in your hosting platform.

## Public Pages

- `/terms` - Terms of Use
- `/privacy` - Privacy Policy

These pages are accessible without authentication and should be linked in your App Store submission.
