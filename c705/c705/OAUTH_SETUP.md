# OAuth Sign-In Setup Guide

## Overview

The app now supports three sign-in methods:
1. **Apple Sign In** - Using AuthenticationServices framework
2. **Google Sign In** - Using Google Sign In SDK
3. **Email/Password** - Traditional authentication

## Apple Sign In Setup

### 1. Enable Sign in with Apple in Xcode

1. Open your project in Xcode
2. Select your target
3. Go to "Signing & Capabilities"
4. Click "+ Capability"
5. Add "Sign in with Apple"

### 2. Configure in Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to Certificates, Identifiers & Profiles
3. Select your App ID
4. Enable "Sign in with Apple" capability
5. Configure your app's services

### 3. Backend Configuration

The backend automatically handles Apple Sign In tokens. No additional configuration needed.

## Google Sign In Setup

### 1. Install Google Sign In SDK

Add to your `Package.swift` or use CocoaPods:

**Swift Package Manager:**
```swift
dependencies: [
    .package(url: "https://github.com/google/GoogleSignIn-iOS", from: "7.0.0")
]
```

**CocoaPods:**
```ruby
pod 'GoogleSignIn'
```

### 2. Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sign-In API
4. Create OAuth 2.0 credentials
5. Get your Client ID

### 3. Configure in Xcode

1. Add your Google Client ID to `Info.plist`:
```xml
<key>GOOGLE_CLIENT_ID</key>
<string>YOUR_CLIENT_ID_HERE</string>
```

2. Or set as environment variable in Xcode scheme

### 4. Update URL Scheme

Add to `Info.plist`:
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

### 5. Backend Configuration

The backend automatically handles Google Sign In tokens. No additional configuration needed.

## Testing

### Apple Sign In
- Works on physical devices (iOS 13+)
- Simulator may have limited functionality
- Requires valid Apple Developer account

### Google Sign In
- Works on both simulator and physical devices
- Requires valid Google Client ID
- Must configure URL scheme correctly

## Troubleshooting

### Apple Sign In Issues
- **"Sign in with Apple not available"**: Enable capability in Xcode and Apple Developer Portal
- **"Invalid credential"**: Check that your app is properly configured in Apple Developer Portal

### Google Sign In Issues
- **"Not configured"**: Add GOOGLE_CLIENT_ID to Info.plist or environment
- **"No root view controller"**: Ensure app has proper window setup
- **"Failed to get token"**: Check Google Client ID is correct

## Backend Endpoints

### Apple Sign In
```
POST /auth/oauth/apple
Body: {
  "provider": "apple",
  "identityToken": "...",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "ARTIST"
}
```

### Google Sign In
```
POST /auth/oauth/google
Body: {
  "provider": "google",
  "identityToken": "...",
  "email": "user@gmail.com",
  "fullName": "John Doe",
  "role": "ARTIST"
}
```

## Security Notes

- Identity tokens are verified by the backend
- OAuth users get a generated password (not used for login)
- Email is required for OAuth sign-in
- Role must be selected before sign-in

