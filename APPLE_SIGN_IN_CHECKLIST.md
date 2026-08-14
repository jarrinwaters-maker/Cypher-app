# Apple Sign In - Complete Diagnostic Checklist

## 🔴 Critical Issues to Check

### 1. iOS App Configuration

#### Sign in with Apple Capability
- [ ] Open Xcode
- [ ] Select app target → "Signing & Capabilities"
- [ ] Verify "Sign in with Apple" capability exists
- [ ] If missing: Click "+ Capability" → Add "Sign in with Apple"

#### Bundle Identifier
- [ ] Check Bundle ID matches Apple Developer account
- [ ] Format: `com.yourcompany.c705` or similar
- [ ] Location: Xcode → Target → General → Bundle Identifier

#### Provisioning Profile
- [ ] Must include Sign in with Apple entitlement
- [ ] Regenerate in Apple Developer Portal if needed
- [ ] Download and install updated profile

### 2. Backend Server Status

#### Server Running
```bash
# Check if backend is running
curl http://localhost:3000/health
# Should return: {"status":"ok",...}
```

- [ ] Backend is running on port 3000
- [ ] Health endpoint responds with 200 OK
- [ ] No errors in backend terminal

#### Database Connection
- [ ] PostgreSQL is running
- [ ] Database `c705_db` exists
- [ ] Connection string in `.env` is correct
- [ ] Prisma client is generated

### 3. Network Connectivity

#### Simulator
- [ ] Using `http://localhost:3000`
- [ ] Backend is accessible from simulator

#### Physical Device
- [ ] Using Mac's IP address (not localhost)
- [ ] Format: `http://YOUR_MAC_IP:3000`
- [ ] Find IP: `ipconfig getifaddr en0` or `ifconfig | grep "inet "`
- [ ] Device and Mac on same network
- [ ] Firewall allows connections on port 3000

#### Test Connection
```bash
# From Mac terminal
curl http://localhost:3000/health

# From device browser (if possible)
# Navigate to: http://YOUR_MAC_IP:3000/health
```

### 4. Code Issues

#### Backend Endpoint
- [ ] Endpoint exists: `POST /auth/oauth/apple`
- [ ] Controller is registered in `AppModule`
- [ ] DTO validation is correct
- [ ] Service method handles all cases

#### iOS App
- [ ] `AppleSignInService` is properly configured
- [ ] `ASAuthorizationController` delegates are set
- [ ] Error handling catches all cases
- [ ] Network request is properly formatted

### 5. Token Handling

#### Identity Token
- [ ] Token is received from Apple
- [ ] Token is not nil or empty
- [ ] Token is sent to backend correctly
- [ ] Token format is valid JWT

#### Email Handling
- [ ] Backend handles missing email (already implemented)
- [ ] Placeholder email generation works
- [ ] User lookup by email works

### 6. Error Debugging

#### Check Xcode Console
1. Run app in Xcode
2. Open Console (Cmd+Shift+Y)
3. Try Apple Sign In
4. Look for logs:
   - 🍎 = Apple Sign In result
   - 📡 = Network request
   - ✅ = Success
   - ❌ = Error

#### Check Backend Logs
1. Check terminal where backend is running
2. Look for incoming requests
3. Check for validation errors
4. Check for database errors

### 7. Common Error Solutions

#### Error: "An unknown error occurred"
**Check:**
1. Backend is running
2. Network connectivity
3. Backend logs for specific error
4. Xcode console for detailed error

**Fix:**
- Start backend: `cd c705-backend && npm run start:dev`
- Check network: Verify device can reach backend
- Check logs: Look for specific error message

#### Error: "Authorization failed"
**Check:**
1. Sign in with Apple enabled in device settings
2. Capability added in Xcode
3. Provisioning profile includes entitlement

**Fix:**
- Settings → Apple ID → Sign in with Apple → Enable
- Add capability in Xcode
- Regenerate provisioning profile

#### Error: "Invalid response from server"
**Check:**
1. Backend response format
2. JSON structure matches `AuthResponse`
3. Network timeout

**Fix:**
- Check backend response format
- Verify JSON structure
- Check network timeout settings

#### Error: HTTP 400/500
**Check:**
1. Backend validation errors
2. Database connection issues
3. Missing fields in request

**Fix:**
- Check backend logs for validation errors
- Verify database is connected
- Ensure all required fields are sent

### 8. Step-by-Step Testing

#### Step 1: Test Backend
```bash
cd c705-backend
npm run start:dev
# In another terminal:
./test-apple-signin.sh
```

#### Step 2: Test iOS App
1. Open Xcode
2. Run app on simulator or device
3. Open Console (Cmd+Shift+Y)
4. Tap "Log in with Apple"
5. Complete Apple Sign In flow
6. Watch console for logs

#### Step 3: Verify Success
- [ ] Apple Sign In dialog appears
- [ ] User can authenticate with Apple
- [ ] Token is received
- [ ] Request is sent to backend
- [ ] Backend responds successfully
- [ ] User is authenticated in app

### 9. Quick Fixes

#### Fix 1: Restart Everything
```bash
# Kill backend
pkill -f "nest start"
pkill -f "node.*main"

# Restart backend
cd c705-backend
npm run start:dev

# In Xcode: Clean Build Folder (Shift+Cmd+K)
# Then rebuild (Cmd+B)
```

#### Fix 2: Reset Simulator
1. Device → Erase All Content and Settings
2. Rebuild and run app

#### Fix 3: Check Network
```bash
# Find Mac IP
ipconfig getifaddr en0

# Update in APIService.swift if needed
# Line 29: return "http://YOUR_IP:3000"
```

#### Fix 4: Verify Capability
1. Xcode → Target → Signing & Capabilities
2. Remove "Sign in with Apple" if exists
3. Add it back
4. Clean and rebuild

### 10. Diagnostic Commands

```bash
# Test backend health
curl http://localhost:3000/health

# Test Apple Sign In endpoint
curl -X POST http://localhost:3000/auth/oauth/apple \
  -H "Content-Type: application/json" \
  -d '{"provider":"apple","identityToken":"test","role":"ARTIST"}'

# Check database connection
cd c705_db
npx prisma db push

# Regenerate Prisma client
npx prisma generate
```

### 11. What to Share for Help

If still not working, share:
1. **Xcode Console Output** - All logs from Apple Sign In attempt
2. **Backend Logs** - Terminal output from backend
3. **Error Message** - Exact error shown to user
4. **HTTP Status Code** - From backend response
5. **Network Test Results** - From test script
6. **Device Type** - Simulator or physical device
7. **iOS Version** - Device iOS version

### 12. Verification Checklist

Before reporting issues, verify:
- [ ] Backend is running and accessible
- [ ] Database is connected
- [ ] Sign in with Apple capability is added
- [ ] Bundle identifier is correct
- [ ] Network connectivity is working
- [ ] All code changes are saved
- [ ] App is rebuilt after changes
- [ ] Console logs are checked
- [ ] Backend logs are checked

