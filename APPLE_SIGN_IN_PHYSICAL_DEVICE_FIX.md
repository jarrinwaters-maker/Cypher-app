# Apple Sign In on Physical Device - Fix Guide

## 🚨 Problem

When testing Apple Sign In on a **physical iPhone**, you're getting timeout errors:

```
NSURLErrorDomain Code=-1001 "The request timed out."
```

This happens because:
- Apple Sign In **REQUIRES HTTPS** on physical devices
- Local IP addresses (`http://10.0.0.215:3000`) don't work reliably
- iOS blocks insecure connections for OAuth flows

## ✅ Solution: Use HTTPS (Ngrok or Production)

### Option 1: Ngrok (Quick Testing)

#### Step 1: Install Ngrok

```bash
brew install ngrok
```

Or download from: https://ngrok.com/download

#### Step 2: Start Ngrok

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding   https://abc123-def456.ngrok.app -> http://localhost:3000
```

#### Step 3: Copy the HTTPS URL

Copy the `https://` URL (e.g., `https://abc123-def456.ngrok.app`)

#### Step 4: Configure Your iOS App

**Option A: Set in Xcode Debugger (Temporary)**

1. Add a breakpoint in `APIService.swift` at the `baseURL` getter
2. When it breaks, run in console:
   ```swift
   UserDefaults.standard.set("https://abc123-def456.ngrok.app", forKey: "customBackendURL")
   ```
3. Continue execution

**Option B: Add to App Startup (Recommended)**

Add this to your `c705App.swift` or `LoginView.swift`:

```swift
// In your app initialization
#if !targetEnvironment(simulator)
// Uncomment and set your ngrok URL for physical device testing
// UserDefaults.standard.set("https://your-ngrok-url.ngrok.app", forKey: "customBackendURL")
#endif
```

**Option C: Add Settings View (Best for Development)**

Create a debug settings view where you can enter the URL.

#### Step 5: Update Backend Apple OAuth Config

In your backend `.env` file:

```env
APPLE_CLIENT_ID=com.yourcompany.c705
APPLE_REDIRECT_URI=https://abc123-def456.ngrok.app/auth/oauth/apple/callback
```

**Important:** Update this in Apple Developer Portal too:
1. Go to https://developer.apple.com/account/
2. Certificates → Identifiers → Services ID
3. Update Redirect URI to match: `https://abc123-def456.ngrok.app/auth/oauth/apple/callback`

#### Step 6: Restart Everything

1. Restart your backend server
2. Kill and relaunch the iOS app
3. Try Apple Sign In again

---

### Option 2: Production Deployment (For App Store)

Deploy your backend to a service that provides HTTPS:

#### Recommended Services:
- **Render** (https://render.com) - Free tier available
- **Railway** (https://railway.app) - Easy deployment
- **Fly.io** (https://fly.io) - Good for Node.js
- **AWS/GCP** - For production scale

#### Steps:
1. Deploy your backend
2. Get your production URL (e.g., `https://c705-backend.onrender.com`)
3. Set it in the app:
   ```swift
   UserDefaults.standard.set("https://c705-backend.onrender.com", forKey: "productionBackendURL")
   ```
4. Update Apple Developer Portal with production redirect URI
5. Update backend `.env` with production URL

---

## 🔍 How the Fix Works

The updated `APIService.swift` now:

1. **Checks for custom URL first** - If you set `customBackendURL`, it uses that
2. **Checks for production URL** - If you set `productionBackendURL`, it uses that
3. **Falls back to localhost** - Only for simulator
4. **Warns about HTTP** - Logs warnings if using HTTP on physical device

---

## 🧪 Testing Checklist

- [ ] Backend is running on port 3000
- [ ] Ngrok is running and forwarding to localhost:3000
- [ ] Copied the HTTPS ngrok URL
- [ ] Set `customBackendURL` in UserDefaults
- [ ] Updated backend `.env` with ngrok URL
- [ ] Updated Apple Developer Portal redirect URI
- [ ] Restarted backend server
- [ ] Killed and relaunched iOS app
- [ ] Tried Apple Sign In on physical device

---

## 🐛 Troubleshooting

### Still Getting Timeouts?

1. **Check ngrok is running:**
   ```bash
   curl https://your-ngrok-url.ngrok.app/health
   ```

2. **Check backend is accessible:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Verify URL in app:**
   - Add breakpoint in `APIService.baseURL`
   - Check what URL is being used

4. **Check Apple Developer Portal:**
   - Redirect URI must match exactly
   - Service ID must have "Sign in with Apple" enabled

### Ngrok URL Changes Every Time?

**Free ngrok:** URL changes each time you restart

**Solution:** Use ngrok's reserved domains (paid) or deploy to production

### Still Not Working?

1. Check backend logs - is the request arriving?
2. Check iOS console - what's the exact error?
3. Verify HTTPS certificate is valid
4. Make sure you're not using HTTP anywhere

---

## 📝 Quick Reference

### Set Custom URL (Temporary - Lost on App Restart)
```swift
UserDefaults.standard.set("https://abc123.ngrok.app", forKey: "customBackendURL")
```

### Set Production URL (Persistent)
```swift
UserDefaults.standard.set("https://c705-backend.onrender.com", forKey: "productionBackendURL")
```

### Check Current URL
```swift
print(APIService.shared.getBaseURL())
```

---

## ✅ Success Indicators

When it's working, you'll see:
- ✅ Request arrives at backend (check backend logs)
- ✅ Apple Sign In completes successfully
- ✅ User is authenticated and logged in
- ✅ No timeout errors in console

---

## 🚀 Next Steps

Once Apple Sign In works with ngrok:
1. Deploy backend to production
2. Update app to use production URL
3. Update Apple Developer Portal
4. Test on physical device with production URL
5. Submit to App Store
