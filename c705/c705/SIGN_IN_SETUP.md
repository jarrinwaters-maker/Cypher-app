# Sign In Setup Guide

## Apple Sign In Setup

### Error 1000 Fix

The error `com.apple.AuthenticationServices.AuthorizationError error 1000` typically means:

1. **Sign in with Apple capability is not enabled**
2. **App is not properly configured in Apple Developer Portal**

### Steps to Fix:

1. **Enable Capability in Xcode:**
   - Open your project in Xcode
   - Select your target
   - Go to "Signing & Capabilities" tab
   - Click "+ Capability"
   - Add "Sign in with Apple"

2. **Configure in Apple Developer Portal:**
   - Go to [Apple Developer Portal](https://developer.apple.com/account)
   - Navigate to "Certificates, Identifiers & Profiles"
   - Select "Identifiers" → Your App ID
   - Enable "Sign in with Apple" capability
   - Save changes

3. **Update Provisioning Profile:**
   - In Xcode, go to "Signing & Capabilities"
   - Make sure "Automatically manage signing" is enabled
   - Or manually download and install the updated provisioning profile

4. **Test on Physical Device:**
   - Apple Sign In works best on physical devices
   - Simulator may have limited functionality
   - Make sure you're signed in with an Apple ID on the device

### Common Issues:

- **Error 1000**: Capability not enabled or provisioning profile issue
- **User Canceled**: User tapped cancel (this is normal)
- **Authorization Failed**: Check device settings and Apple ID

## Google Sign In Setup

### Current Error

"Google Sign In is not configured" means the SDK isn't installed or Client ID isn't set.

### Steps to Fix:

1. **Install Google Sign In SDK:**

   **Option A: Swift Package Manager**
   - In Xcode: File → Add Packages
   - Enter URL: `https://github.com/google/GoogleSignIn-iOS`
   - Select version (latest)
   - Add to your target

   **Option B: CocoaPods**
   ```ruby
   pod 'GoogleSignIn'
   ```
   Then run: `pod install`

2. **Get Google Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable "Google Sign-In API"
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Select "iOS" as application type
   - Copy the Client ID

3. **Add Client ID to Info.plist:**
   - Open `Info.plist` in Xcode
   - Add new key: `GOOGLE_CLIENT_ID` (String)
   - Value: Your Google Client ID

   Or add to your Xcode scheme environment variables:
   - Edit Scheme → Run → Arguments → Environment Variables
   - Add: `GOOGLE_CLIENT_ID` = `your-client-id`

4. **Configure URL Scheme:**
   - In `Info.plist`, add URL Types:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
       <dict>
           <key>CFBundleURLSchemes</key>
           <array>
               <string>YOUR_REVERSED_CLIENT_ID</string>
           </array>
       </dict>
   </array>
   ```
   - Replace `YOUR_REVERSED_CLIENT_ID` with your reversed client ID (e.g., `com.googleusercontent.apps.123456789`)

### Alternative: Use Email Sign In

If you don't want to set up OAuth right now, you can use Email/Password sign-in which works immediately without additional configuration.

## Testing

### Apple Sign In:
- ✅ Works on physical devices (iOS 13+)
- ⚠️ Limited on simulator
- ✅ Requires valid Apple Developer account

### Google Sign In:
- ✅ Works on both simulator and physical devices
- ✅ Requires Google Client ID
- ✅ Requires URL scheme configuration

## Quick Fix for Development

If you just want to test the app without OAuth:

1. Use **Email/Password sign-in** (works immediately)
2. Set up OAuth later when ready for production

The app will gracefully handle OAuth errors and show user-friendly messages.

