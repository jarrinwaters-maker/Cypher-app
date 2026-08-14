# Quick Start Guide

## Starting the Server

**IMPORTANT:** You must build the project first before starting the dev server.

### Step 1: Build the Project
```bash
cd c705-backend
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Fix the dist folder structure automatically
- Prepare the server for running

### Step 2: Start Development Server
```bash
npm run start:dev
```

Wait for: `Nest application successfully started`

### Step 3: Test in Postman
1. Open Postman
2. Import `postman_collection.json`
3. Test endpoints:
   - **Signup**: POST `/auth/signup`
   - **Login**: POST `/auth/login`
   - **Upload Track**: POST `/tracks/upload`
   - **Get Feed**: GET `/tracks`

## If You Get "Cannot find module dist/main" Error

**Solution:**
```bash
# Clean and rebuild
rm -rf dist
npm run build
npm run start:dev
```

The build script automatically fixes the dist structure.

## Alternative: Use Production Build

If watch mode continues to have issues:
```bash
npm run build
npm run start:prod
```

Then test in Postman. Note: You'll need to rebuild after code changes.

