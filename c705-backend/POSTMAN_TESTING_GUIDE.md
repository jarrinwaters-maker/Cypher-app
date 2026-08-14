# Postman Testing Guide

This guide will help you test the C705 API endpoints using Postman.

## Setup

### 1. Import Collection
1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json` file
4. The collection will be imported with all endpoints

### 2. Start Your Backend Server

**IMPORTANT:** Make sure your backend server is running before testing!

```bash
cd c705-backend
npm run start:dev
```

Wait for the message: `Nest application successfully started` or `Application is running on: http://localhost:3000`

### 3. Configure Base URL

The collection uses `{{baseUrl}}` variable (default: `http://localhost:3000`)

**To update the baseUrl:**
1. Click on the collection name "C705 API Collection"
2. Go to the **Variables** tab
3. Update the `baseUrl` value if needed:
   - **Local development:** `http://localhost:3000` (default)
   - **Different port:** `http://localhost:3001` (or your port)
   - **Staging:** `https://your-staging-url.com`
   - **Production:** `https://your-production-url.com`

### 4. Troubleshooting Connection Issues

If you get **"Error: connect ECONNREFUSED 127.0.0.1:3000"**:

**Option 1: Check if server is running**
- Open your terminal/console
- Look for the NestJS server process
- Verify you see: `Nest application successfully started`
- Check that it's listening on port 3000

**Option 2: Check if server is on a different port**
- Your server might be running on port 3001, 8000, 8080, etc.
- Check your `.env` file for `PORT` variable
- Or check the terminal output for the actual port
- Update the `baseUrl` variable in Postman to match

**Option 3: Verify server is accessible**
- Test in browser: `http://localhost:3000` (should show "Hello World!")
- Or test with curl: `curl http://localhost:3000`
- If this fails, the server is not running

**Option 4: Restart the server**
```bash
# Stop any running processes
pkill -f "nest start"

# Start fresh
cd c705-backend
npm run start:dev
```

## Testing Flow

### Step 1: Signup
1. Open **Auth > Signup** request
2. Update the body if needed:
   ```json
   {
     "email": "artist@example.com",
     "password": "password123",
     "role": "ARTIST"
   }
   ```
3. Click **Send**
4. ✅ **Token is automatically saved** to collection variable `{{token}}`
5. Check the response - you should get:
   ```json
   {
     "access_token": "...",
     "user": {
       "id": "...",
       "email": "artist@example.com",
       "role": "ARTIST"
     }
   }
   ```

### Step 2: Login (Alternative to Signup)
1. Open **Auth > Login** request
2. Update the body:
   ```json
   {
     "email": "artist@example.com",
     "password": "password123"
   }
   ```
3. Click **Send**
4. ✅ **Token is automatically saved** to collection variable `{{token}}`

### Step 3: Upload Audio Track
1. Open **Tracks > Upload Track** request
2. The Authorization header is automatically set with `{{token}}`
3. In the **Body** tab, select **form-data**
4. For the `file` field:
   - Change type from "Text" to **"File"**
   - Click **Select Files** and choose an audio file (MP3, WAV, etc.)
5. For the `title` field:
   - Type: **Text**
   - Value: `My Test Song`
6. Click **Send**
7. ✅ **Track ID is automatically saved** to collection variable `{{trackId}}`
8. Check the response - you should get:
   ```json
   {
     "id": "track-uuid",
     "title": "My Test Song",
     "audioUrl": "https://c705-media.s3.us-east-2.amazonaws.com/...",
     "artistId": "...",
     "createdAt": "...",
     "message": "Track uploaded successfully"
   }
   ```

### Step 4: Fetch Feed (Get All Tracks)
1. Open **Tracks > Get Feed (All Tracks)** request
2. The Authorization header is automatically set with `{{token}}`
3. Query parameters are pre-filled:
   - `page=1`
   - `limit=20`
   - `sortBy=recent`
4. Click **Send**
5. Check the response - you should get:
   ```json
   {
     "tracks": [
       {
         "id": "...",
         "title": "...",
         "audioUrl": "...",
         "likeCount": 0,
         "createdAt": "...",
         "artist": {...}
       }
     ],
     "pagination": {
       "page": 1,
       "limit": 20,
       "total": 1,
       "totalPages": 1
     }
   }
   ```

## Additional Endpoints to Test

### Get My Tracks
- **Tracks > Get My Tracks** - Get all tracks you uploaded

### Get Track by ID
- **Tracks > Get Track by ID** - Uses saved `{{trackId}}` variable

### Search Tracks
- **Tracks > Search Tracks** - Search by query, artist, etc.

### Get Popular Tracks
- **Tracks > Get Popular Tracks** - Get trending tracks

## Troubleshooting

### Token Not Working
- Make sure you ran **Signup** or **Login** first
- Check that the token was saved in collection variables
- View variables: Click on collection name → **Variables** tab

### Upload Fails
- Make sure you selected an actual audio file (not just text)
- File must be a valid audio format (MP3, WAV, M4A, etc.)
- Check that your user has `ARTIST` or `ADMIN` role

### 401 Unauthorized
- Token might be expired (tokens expire in 7 days)
- Run **Login** again to get a new token

### 403 Forbidden
- Your user role doesn't have permission
- For upload: Need `ARTIST` or `ADMIN` role
- Check the role in signup/login response

## Quick Test Commands (cURL Alternative)

If you prefer command line, here are cURL commands:

### Signup
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artist@example.com",
    "password": "password123",
    "role": "ARTIST"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artist@example.com",
    "password": "password123"
  }'
```

### Upload Track (Replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:3000/tracks/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/audio.mp3" \
  -F "title=My Test Song"
```

### Get Feed
```bash
curl -X GET "http://localhost:3000/tracks?page=1&limit=20&sortBy=recent" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Server Setup

Make sure your backend server is running:
```bash
cd c705-backend
npm run start:dev
```

The server should be running on `http://localhost:3000` (or check your `.env` PORT setting).

