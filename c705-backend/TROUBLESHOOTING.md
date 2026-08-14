# Troubleshooting Guide

## Connection Refused Error (ECONNREFUSED)

If you see `Error: connect ECONNREFUSED 127.0.0.1:3000` in Postman:

### Step 1: Verify Server is Running

**Check your terminal:**
```bash
# Look for this message:
Nest application successfully started
Application is running on: http://localhost:3000
```

**If you don't see this:**
1. Navigate to the backend directory:
   ```bash
   cd c705-backend
   ```

2. Start the server:
   ```bash
   npm run start:dev
   ```

3. Wait for the server to start (look for "successfully started" message)

### Step 2: Check Server Port

**Check what port the server is using:**
- Look at the terminal output for: `Application is running on: http://localhost:XXXX`
- Or check your `.env` file for `PORT` variable
- Common ports: 3000, 3001, 8000, 8080

**Update Postman baseUrl:**
1. Click on "C705 API Collection" in Postman
2. Go to **Variables** tab
3. Update `baseUrl` to match your server port:
   - If server is on 3001: `http://localhost:3001`
   - If server is on 8000: `http://localhost:8000`

### Step 3: Test Server Connection

**Test in browser:**
```
http://localhost:3000
```
Should return: `Hello World!`

**Test with curl:**
```bash
curl http://localhost:3000
```

**If this fails:** The server is not running or not accessible

### Step 4: Check for Port Conflicts

**Check if port 3000 is in use:**
```bash
lsof -i :3000
```

**If port is in use by another process:**
- Kill the process: `kill -9 <PID>`
- Or change your server port in `.env` file

### Step 5: Check Server Logs

**Look for errors in terminal:**
- Compilation errors
- Database connection errors
- Module not found errors

**Common issues:**
- TypeScript compilation errors → Fix the errors shown
- Database connection failed → Check `.env` DATABASE_URL
- Module not found → Run `npm install`

## 404 Not Found Errors

If you get `404 Not Found` for `/auth/login` or `/auth/signup`:

### Check Route Registration

1. Verify the server started successfully
2. Check that AuthModule is imported in AppModule
3. Look for any errors during server startup

### Verify Endpoint URLs

- Signup: `POST {{baseUrl}}/auth/signup`
- Login: `POST {{baseUrl}}/auth/login`
- Make sure `{{baseUrl}}` variable is set correctly

## Authentication Errors

### 401 Unauthorized

- Token expired (tokens expire in 7 days)
- Invalid token format
- **Solution:** Run Login request again to get a new token

### 403 Forbidden

- Insufficient permissions
- Wrong role for the action
- **Solution:** Check user role and required permissions

## Database Connection Errors

### P1010: User was denied access

- Database doesn't exist
- Wrong credentials in `.env`
- PostgreSQL not running

**Solutions:**
1. Check `.env` file has correct DATABASE_URL
2. Verify database exists: `psql -l` or `createdb c705_db`
3. Check PostgreSQL is running: `pg_isready`

## Quick Server Restart

If nothing works, try a clean restart:

```bash
# Kill all node processes
pkill -f "nest start"
pkill -f "node.*main"

# Clean and rebuild
cd c705-backend
rm -rf dist
npm run build

# Start server
npm run start:dev
```

## Still Having Issues?

1. Check the terminal output for specific error messages
2. Verify all dependencies are installed: `npm install`
3. Check Node.js version: `node --version` (should be 18+)
4. Verify database migrations are applied: `npx prisma migrate dev`

