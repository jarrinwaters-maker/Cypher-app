# Backend & Database Connection Setup Guide

## ✅ Current Status

- **Backend Server**: Running on port 3000 ✅
- **Database**: PostgreSQL connected ✅
- **iOS App**: Configured to connect to backend

## Connection Configuration

### For iOS Simulator
- Uses `http://localhost:3000` automatically
- Works out of the box if backend is running

### For Physical Device
- **IMPORTANT**: Physical devices cannot use `localhost`
- You need to use your **Mac's IP address**

## Finding Your Mac's IP Address

Run this command in Terminal:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for an IP like: `192.168.1.100` or `10.0.0.5`

## Updating iOS App for Physical Device

### Option 1: Update APIService.swift (Recommended)

1. Open `c705/c705/Services/APIService.swift`
2. Find the line with `return "http://192.168.1.100:3000"`
3. Replace `192.168.1.100` with your Mac's IP address
4. Rebuild the app

### Option 2: Use Connection Test View

1. Add `ConnectionTestView` to your app (for testing)
2. Use the "Set Custom URL" button
3. Enter your Mac's IP address: `http://YOUR_IP:3000`

## Testing the Connection

### Method 1: Use Connection Test View

1. Add `ConnectionTestView()` to your app temporarily
2. Tap "Test Connections"
3. Check if both Backend and Database show ✅

### Method 2: Test in Browser

Open in Safari (on your Mac):
```
http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "c705-backend"
}
```

### Method 3: Test with curl

```bash
curl http://localhost:3000/health
```

## Common Issues

### "Cannot connect to backend"

**For Simulator:**
- Make sure backend is running: `cd c705-backend && npm run start:dev`
- Check port 3000 is not blocked
- Verify backend started successfully

**For Physical Device:**
- Make sure Mac and iPhone are on the same WiFi network
- Update IP address in `APIService.swift`
- Check Mac's firewall isn't blocking port 3000

### "Connection refused"

- Backend server is not running
- Wrong IP address (for physical device)
- Port 3000 is blocked by firewall

### "Network error"

- Mac and iPhone not on same network
- Firewall blocking connection
- Backend crashed (check terminal)

## Firewall Settings

If connection fails on physical device:

1. **System Settings** → **Network** → **Firewall**
2. Allow incoming connections for Node.js
3. Or temporarily disable firewall for testing

## Quick Test Checklist

- [ ] Backend server is running (`npm run start:dev`)
- [ ] Backend shows "Application is running on: http://localhost:3000"
- [ ] Database is accessible (PostgreSQL running)
- [ ] For simulator: Using `localhost:3000` ✅
- [ ] For physical device: Updated IP address in `APIService.swift`
- [ ] Mac and iPhone on same WiFi network
- [ ] Firewall allows connections on port 3000
- [ ] Health endpoint responds: `http://localhost:3000/health`

## Verification

Once connected, you should be able to:
- ✅ Sign up with email/password
- ✅ Login with email/password
- ✅ Fetch feed
- ✅ Upload tracks
- ✅ Like/unlike tracks
- ✅ Comment on tracks

## Next Steps

1. Test connection using `ConnectionTestView`
2. Try signing up with email/password
3. Verify you can fetch the feed
4. If issues persist, check backend logs in terminal

