# Apple Sign In Troubleshooting Guide

## Comprehensive Checklist

### 1. iOS App Configuration

#### ✅ Check Sign in with Apple Capability
1. Open Xcode
2. Select your app target
3. Go to "Signing & Capabilities" tab
4. Verify "Sign in with Apple" capability is added
5. If missing, click "+ Capability" and add it

#### ✅ Check Bundle Identifier
- Must match your Apple Developer account
- Format: `com.yourcompany.c705` or similar
- Check in Xcode: Target → General → Bundle Identifier

#### ✅ Check Provisioning Profile
- Must include Sign in with Apple entitlement
- Regenerate if needed in Apple Developer Portal

### 2. Backend Configuration

#### ✅ Verify Endpoint is Running
```bash
# Test the endpoint directly
curl -X POST http://localhost:3000/auth/oauth/apple \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "apple",
    "identityToken": "test-token",
    "email": "test@example.com",
    "role": "ARTIST"
  }'
```

#### ✅ Check Backend Logs
- Look for errors when Apple Sign In request arrives
- Check for validation errors
- Check for database connection issues

#### ✅ Verify Database Schema
- Username field exists (if using)
- User table is accessible
- No migration issues

### 3. Network Connectivity

#### ✅ Check Base URL
- Simulator: `http://localhost:3000`
- Physical Device: `http://YOUR_MAC_IP:3000`
- Update in `APIService.swift` if needed

#### ✅ Test Backend Health
```bash
curl http://localhost:3000/health
```

#### ✅ Check CORS (if applicable)
- Backend should allow requests from iOS app
- Check `main.ts` for CORS configuration

### 4. Token Handling

#### ✅ Identity Token Format
- Should be a JWT string
- Check if token is being received from Apple
- Verify token is not empty or nil

#### ✅ Email Handling
- Apple may not provide email on subsequent sign-ins
- Backend should handle missing email (already implemented)
- Check if placeholder email is being generated correctly

### 5. Error Handling

#### ✅ Check Xcode Console
- Look for logs starting with 🍎, 📡, ✅, or ❌
- Check for specific error messages
- Look for network errors

#### ✅ Check Backend Console
- Look for incoming requests
- Check for validation errors
- Check for database errors

### 6. Common Issues

#### Issue: "An unknown error occurred"
**Possible Causes:**
1. Backend not running
2. Network connectivity issue
3. Invalid token format
4. Backend validation error
5. Database connection issue

**Solutions:**
1. Start backend: `cd c705-backend && npm run start:dev`
2. Check network: Verify device can reach backend
3. Check logs: Look for specific error in console
4. Test endpoint: Use Postman to test backend directly

#### Issue: "Authorization failed"
**Possible Causes:**
1. Sign in with Apple not enabled in device settings
2. Capability not added in Xcode
3. Provisioning profile issue

**Solutions:**
1. Settings → Apple ID → Sign in with Apple → Enable
2. Add capability in Xcode
3. Regenerate provisioning profile

#### Issue: "Invalid response from server"
**Possible Causes:**
1. Backend returning wrong format
2. Response decoding error
3. Network timeout

**Solutions:**
1. Check backend response format
2. Verify JSON structure matches `AuthResponse`
3. Check network timeout settings

### 7. Testing Steps

#### Step 1: Test Backend Directly
```bash
# Use Postman or curl
POST http://localhost:3000/auth/oauth/apple
{
  "provider": "apple",
  "identityToken": "test-token-here",
  "email": "test@example.com",
  "role": "ARTIST"
}
```

#### Step 2: Check iOS Console
1. Run app in Xcode
2. Open Console (Cmd+Shift+Y)
3. Try Apple Sign In
4. Look for debug logs

#### Step 3: Check Backend Logs
1. Check terminal where backend is running
2. Look for incoming requests
3. Check for errors

### 8. Debug Checklist

- [ ] Backend is running on port 3000
- [ ] Database is connected and accessible
- [ ] Sign in with Apple capability is added in Xcode
- [ ] Bundle identifier is correct
- [ ] Provisioning profile includes Sign in with Apple
- [ ] Network connectivity is working
- [ ] Base URL is correct for device/simulator
- [ ] Backend endpoint `/auth/oauth/apple` is accessible
- [ ] Identity token is being received from Apple
- [ ] No console errors in Xcode
- [ ] No errors in backend logs

### 9. Quick Fixes

#### Fix 1: Restart Backend
```bash
cd c705-backend
npm run start:dev
```

#### Fix 2: Clean Build
1. In Xcode: Product → Clean Build Folder (Shift+Cmd+K)
2. Rebuild: Product → Build (Cmd+B)

#### Fix 3: Reset Simulator
1. Device → Erase All Content and Settings
2. Rebuild and run app

#### Fix 4: Check Network
```bash
# On Mac, find your IP
ipconfig getifaddr en0

# Update in APIService.swift if needed
```

### 10. Next Steps

If still not working:
1. Share Xcode console logs
2. Share backend logs
3. Share specific error message
4. Test backend endpoint with Postman
5. Verify all checklist items above

