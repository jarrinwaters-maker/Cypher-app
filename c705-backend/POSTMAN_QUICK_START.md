# Postman Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Import Collection
1. Open **Postman**
2. Click **Import** button (top left)
3. Select file: `postman_collection_complete.json`
4. Collection will be imported with all endpoints organized in folders

### Step 2: Verify Server is Running
```bash
# Check if server is running
curl http://localhost:3000/health

# If not running, start it:
cd c705-backend
npm run start:dev
```

Wait for: `🚀 Server is running on: http://localhost:3000`

### Step 3: Test Authentication
1. Open **Auth > Signup** or **Auth > Login**
2. Click **Send**
3. ✅ **Token is automatically saved** - you'll see it in the console
4. All other requests will now use this token automatically

## 📋 Collection Structure

### Health Check
- ✅ **Health Check** - Verify server is running

### Auth
- **Signup** - Create new account (auto-saves token)
- **Login** - Login with email/password (auto-saves token)
- **OAuth - Apple Sign In** - Sign in with Apple
- **OAuth - Google Sign In** - Sign in with Google

### Feed
- **Get Feed** - Combined feed of tracks and articles

### Tracks
- **Upload Track** - Upload audio file (auto-saves trackId)
- **Get All Tracks** - Get all public tracks
- **Get Track by ID** - Get specific track
- **Get My Tracks** - Get your uploaded tracks
- **Get Liked Tracks** - Get tracks you've liked
- **Search Tracks** - Search by query
- **Get Popular Tracks** - Get trending tracks
- **Get Tracks by Artist** - Get artist's tracks
- **Update Track** - Update track metadata
- **Delete Track** - Delete a track

### Likes
- **Like Track** - Like a track
- **Like Track (Alternative)** - Alternative endpoint
- **Unlike Track** - Unlike a track

### Comments
- **Get Track Comments** - Get all comments for a track
- **Create Comment** - Add a comment (auto-saves commentId)

### Artists
- **Get Artist Profile** - Get artist info with followers
- **Get Artist Tracks** - Get artist's tracks
- **Follow Artist** - Follow an artist
- **Unfollow Artist** - Unfollow an artist
- **Get Artist Followers** - Get artist's followers list

### Articles
- **Get All Articles** - Get all articles
- **Get Article by ID** - Get specific article
- **Search Articles** - Search articles
- **Get Articles by Author** - Get author's articles

## 🔑 Automatic Token Management

The collection automatically:
- ✅ Saves token after **Signup** or **Login**
- ✅ Saves userId and artistId
- ✅ Saves trackId after **Upload Track**
- ✅ Saves commentId after **Create Comment**
- ✅ Uses saved token in all authenticated requests

## 📝 Testing Workflow

### Recommended Order:

1. **Health Check** → Verify server is running
2. **Auth > Signup** → Create account (or use Login if you have one)
3. **Tracks > Upload Track** → Upload an audio file
   - ⚠️ **Important**: Change "file" field type to "File" and select an audio file
4. **Feed > Get Feed** → See your track in the feed
5. **Likes > Like Track** → Like the track you uploaded
6. **Comments > Create Comment** → Add a comment
7. **Comments > Get Track Comments** → See all comments
8. **Artists > Get Artist Profile** → View your profile
9. **Artists > Follow Artist** → Follow another artist (use their userId)

## 🎯 Quick Test Examples

### Test Login Flow
```
1. Auth > Login
   - Email: test@test.com
   - Password: test123
   - Click Send
   - ✅ Token saved automatically
```

### Test Upload Track
```
1. Tracks > Upload Track
   - In Body tab, find "file" field
   - Change type from "Text" to "File"
   - Click "Select Files" and choose an MP3/WAV file
   - Title: "My Test Song"
   - Click Send
   - ✅ Track ID saved automatically
```

### Test Like & Comment
```
1. Likes > Like Track
   - Uses saved trackId automatically
   - Click Send

2. Comments > Create Comment
   - Content: "Great track!"
   - Uses saved trackId automatically
   - Click Send
```

## 🔧 Troubleshooting

### Token Not Working
- Run **Auth > Login** again to get a new token
- Check collection variables: Click collection name → **Variables** tab
- Verify token is saved (should see it in the value column)

### Upload Fails
- Make sure you changed "file" field type to **"File"** (not "Text")
- Select an actual audio file (MP3, WAV, M4A, etc.)
- Verify your user has **ARTIST** or **ADMIN** role

### 401 Unauthorized
- Token might be expired (tokens expire in 7 days)
- Run **Auth > Login** again

### 403 Forbidden
- Your user role doesn't have permission
- For upload: Need **ARTIST** or **ADMIN** role
- Check your role in the signup/login response

### Connection Refused
- Server is not running
- Start server: `cd c705-backend && npm run start:dev`
- Check baseUrl variable is `http://localhost:3000`

## 📊 Viewing Variables

To see all saved variables:
1. Click on collection name: **"C705 API - Complete Collection"**
2. Go to **Variables** tab
3. You'll see:
   - `baseUrl` - API base URL
   - `token` - JWT token (auto-saved)
   - `userId` - Your user ID (auto-saved)
   - `trackId` - Track ID (auto-saved after upload)
   - `artistId` - Artist ID (auto-saved)
   - `commentId` - Comment ID (auto-saved)

## 🎉 You're Ready!

The collection is set up and ready to test all endpoints. Start with **Health Check** to verify everything is working, then proceed with authentication and testing!

