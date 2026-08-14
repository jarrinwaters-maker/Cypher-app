# 🔄 Backend Restart Instructions

## ⚠️ IMPORTANT: Restart Required

Your backend server needs to be restarted to load the new API keys from the .env file.

## Steps to Restart:

1. **Stop the current backend server:**
   - Press `Ctrl+C` in the terminal where the backend is running
   - Or kill the process: `lsof -ti :3000 | xargs kill -9`

2. **Restart the backend:**
   ```bash
   cd c705-backend
   npm run start:dev
   ```

3. **Verify API keys are loaded:**
   - You should see the server start successfully
   - No more "API key not configured" warnings
   - The server will fetch from NewsAPI and GNews

## Expected Output After Restart:

✅ Server is running on: http://0.0.0.0:3000
✅ No "API key not configured" warnings
✅ When you request /news/hip-hop, you'll see:
   - "Fetching from NewsAPI: hip hop OR rap..."
   - "Fetching from GNews: hip hop OR rap..."
   - Articles returned successfully

## If You Still See Warnings:

1. Verify .env file has the keys:
   ```bash
   cd c705-backend
   cat .env | grep NEWS_API
   cat .env | grep GNEWS
   ```

2. Make sure .env is in the c705-backend directory (not parent)

3. Restart the server again

