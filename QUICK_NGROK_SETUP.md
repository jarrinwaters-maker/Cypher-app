# Quick Ngrok Setup for Apple Sign In

## ⚠️ IMPORTANT: Ngrok Requires Free Account

Ngrok now requires authentication. **First, follow `NGROK_SETUP_WITH_AUTH.md`** to:
1. Sign up for a free account at https://dashboard.ngrok.com/signup
2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Run: `ngrok config add-authtoken YOUR_AUTHTOKEN`

Then come back here to continue.

## 🚀 Fast Setup (After Authentication)

### Step 1: Install Ngrok (if not already installed)
```bash
brew install ngrok
```

### Step 2: Configure Authtoken (REQUIRED - See NGROK_SETUP_WITH_AUTH.md)

### Step 3: Start Ngrok
```bash
ngrok http 3000
```

### Step 4: Copy HTTPS URL
You'll see something like:
```
Forwarding   https://abc123-def456.ngrok.app -> http://localhost:3000
```

Copy the `https://` URL (e.g., `https://abc123-def456.ngrok.app`)

### Step 5: Set in iOS App

**Option A: Xcode Debugger (Quick Test)**
1. Add a breakpoint in `APIService.swift` at line 23 (in `baseURL` getter)
2. When it breaks, run in console:
   ```swift
   UserDefaults.standard.set("https://abc123-def456.ngrok.app", forKey: "customBackendURL")
   ```
3. Continue execution

**Option B: Add to App Startup (Temporary)**
Add this to `c705App.swift`:
```swift
#if !targetEnvironment(simulator)
// Set your ngrok URL here for physical device testing
UserDefaults.standard.set("https://abc123-def456.ngrok.app", forKey: "customBackendURL")
#endif
```

**Option C: Settings View (Best for Development)**
Create a debug settings view where you can enter the URL.

### Step 6: Update Backend `.env`
```env
APPLE_REDIRECT_URI=https://abc123-def456.ngrok.app/auth/oauth/apple/callback
```

### Step 7: Update Apple Developer Portal
1. Go to https://developer.apple.com/account/
2. Certificates → Identifiers → Services ID
3. Update Redirect URI to: `https://abc123-def456.ngrok.app/auth/oauth/apple/callback`

### Step 8: Restart Everything
1. Restart backend: `npm run start:dev`
2. Kill and relaunch iOS app
3. Try Apple Sign In

## ✅ Verification

Check if it's working:
```bash
curl https://abc123-def456.ngrok.app/health
```

Should return your backend health check.

## 🔄 Ngrok URL Changes?

Free ngrok URLs change each time you restart. To keep the same URL:
1. You already have a free account (required for ngrok)
2. Use reserved domains (paid feature) or just update the URL each time
3. Alternatively, use LocalTunnel which gives you a subdomain you can keep

## 🐛 Troubleshooting

**Still getting timeouts?**
- Check ngrok is running: `ps aux | grep ngrok`
- Check backend is running: `curl http://localhost:3000/health`
- Verify URL in app: Add breakpoint and check `APIService.shared.getBaseURL()`

**Connection refused?**
- Make sure backend is on port 3000
- Check ngrok is forwarding to correct port

**Apple Sign In still fails?**
- Verify Apple Developer Portal redirect URI matches exactly
- Check backend `.env` has correct redirect URI
- Make sure you're using HTTPS (not HTTP)
