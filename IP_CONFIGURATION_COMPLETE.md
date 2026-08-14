# IP Configuration - Complete Setup ✅

## ✅ Step 1: Mac's IP Address
**Confirmed:** `10.0.0.215`

Verified with: `ipconfig getifaddr en0`

## ✅ Step 2: API Base URL Updated

**File:** `c705/c705/Services/APIService.swift`

**Changed from:**
- Simulator: `http://localhost:3000` ❌
- Device: `http://10.0.0.215:3000` ✅

**Changed to:**
- Both Simulator & Device: `http://10.0.0.215:3000` ✅

**Why:** Your simulator needs the Mac's IP, not localhost, to connect properly.

## ✅ Step 3: Backend Listening on All Interfaces

**File:** `c705-backend/src/main.ts`

**Updated:**
```typescript
await app.listen(port, '0.0.0.0');
```

**What this does:**
- Binds to `0.0.0.0` (all network interfaces)
- Allows connections from:
  - `localhost` / `127.0.0.1`
  - `10.0.0.215` (your Mac's IP)
  - Other devices on your network

**Before:** Only listened on localhost (iOS couldn't connect)
**After:** Listens on all interfaces (iOS can connect) ✅

## ⚠️ Step 4: App Transport Security (ATS)

**Status:** Needs to be added in Xcode

Since your project uses file system synchronization, you need to add ATS settings manually:

### Option A: Add in Xcode (Recommended)
1. Open Xcode
2. Select project → Target `c705` → Build Settings
3. Search for "Info.plist"
4. Set "Generate Info.plist File" to `NO`
5. Create new `Info.plist` file:
   - Right-click `c705` folder → New File → Property List
   - Name: `Info.plist`
6. Add to Info.plist:
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsArbitraryLoads</key>
       <true/>
       <key>NSAllowsLocalNetworking</key>
       <true/>
   </dict>
   ```
7. In Build Settings, set "Info.plist File" to `c705/Info.plist`

### Option B: Quick Test (Temporary)
If you just want to test quickly, you can add this to your `c705App.swift` temporarily:
```swift
// Add this in init() - TEMPORARY FOR TESTING ONLY
if let url = URL(string: "http://10.0.0.215:3000") {
    URLSession.shared.dataTask(with: url) { _, _, _ in }.resume()
}
```

But Option A is the proper solution.

## ✅ Step 5: Test Connectivity

### Test from Terminal:
```bash
curl http://10.0.0.215:3000/health
```

Should return:
```json
{"status":"ok","timestamp":"...","service":"c705-backend"}
```

### Test from iOS Simulator Safari:
1. Open Safari in Simulator
2. Navigate to: `http://10.0.0.215:3000/health`
3. Should see JSON response

### Test from iOS App:
1. Run app in Xcode
2. Try logging in
3. Check Xcode console for:
   ```
   📤 Making request to: http://10.0.0.215:3000/auth/login
   📥 Response Status: 200
   ```

## 📋 Summary of Changes

1. ✅ **APIService.swift** - Updated to use `10.0.0.215:3000` for both simulator and device
2. ✅ **main.ts** - Updated to listen on `0.0.0.0` instead of just localhost
3. ⚠️ **Info.plist** - Needs ATS settings added manually in Xcode

## 🚀 Next Steps

1. **Restart Backend Server:**
   ```bash
   cd c705-backend
   npm run start:dev
   ```
   You should see:
   ```
   🚀 Server is running on: http://0.0.0.0:3000
      Local access: http://localhost:3000
      Network access: http://10.0.0.215:3000
   ```

2. **Add ATS Settings in Xcode** (see Step 4 above)

3. **Clean and Rebuild:**
   - Product → Clean Build Folder (Shift + Cmd + K)
   - Product → Build (Cmd + B)

4. **Test Login:**
   - Run app in Simulator
   - Try logging in with: `test@test.com` / `test123`
   - Check Xcode console for connection logs

## 🔍 Troubleshooting

### "Cannot connect to server"
- Verify backend is running: `curl http://10.0.0.215:3000/health`
- Check firewall isn't blocking port 3000
- Verify Mac and iOS device/simulator are on same network

### "Invalid response from server"
- Check Xcode console for detailed error messages
- Verify ATS settings are added (allows HTTP)
- Check backend logs for incoming requests

### Backend not accessible
- Make sure backend is listening on `0.0.0.0` (already fixed)
- Check Mac's firewall settings
- Verify IP address hasn't changed: `ipconfig getifaddr en0`

## ✅ Configuration Complete!

Your app is now configured to connect to:
- **URL:** `http://10.0.0.215:3000`
- **Backend:** Listening on all interfaces ✅
- **Next:** Add ATS settings in Xcode to allow HTTP connections

