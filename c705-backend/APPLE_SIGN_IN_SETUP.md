# Apple Sign In Setup Guide

## iOS App Configuration

### 1. Enable Sign in with Apple Capability

1. Open your Xcode project
2. Select your app target
3. Go to "Signing & Capabilities" tab
4. Click "+ Capability"
5. Add "Sign in with Apple"

### 2. Configure App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Select your App ID
4. Enable "Sign in with Apple"
5. Configure the service ID if needed

### 3. Info.plist Configuration

The app should automatically handle Sign in with Apple through the `AuthenticationServices` framework. No additional Info.plist entries are required.

## Backend Configuration

### Endpoint

**POST** `/auth/oauth/apple`

### Request Body

```json
{
  "provider": "apple",
  "identityToken": "eyJraWQiOiJlWGF1bm1ZT1dZR0JZIiwiYWxnIjoiUlMyNTYifQ...",
  "email": "user@example.com",  // Optional - may not be provided on subsequent sign-ins
  "fullName": "John Doe",        // Optional
  "role": "ARTIST"               // Optional - defaults to ARTIST
}
```

### Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "ARTIST"
  }
}
```

## Testing with Postman

### Prerequisites

1. Import the `postman_apple_signin.json` collection
2. Set the `baseUrl` variable to your backend URL (default: `http://localhost:3000`)

### Test Cases

#### 1. Apple Sign In with Email

```json
{
  "provider": "apple",
  "identityToken": "YOUR_APPLE_IDENTITY_TOKEN",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "ARTIST"
}
```

#### 2. Apple Sign In without Email (Subsequent Sign-ins)

```json
{
  "provider": "apple",
  "identityToken": "YOUR_APPLE_IDENTITY_TOKEN",
  "role": "ARTIST"
}
```

**Note:** When email is not provided, the backend will generate a placeholder email based on the identity token.

### Getting a Real Identity Token

To test with a real identity token:

1. Run the iOS app
2. Tap "Log in with Apple"
3. Complete the Apple Sign In flow
4. The app will send the identity token to the backend
5. Check the backend logs to see the token format

## Common Issues

### Error: "An unknown error occurred"

**Possible causes:**
1. Identity token is invalid or expired
2. Backend validation failed
3. Network error

**Solutions:**
1. Check backend logs for detailed error messages
2. Verify the identity token is valid
3. Ensure the backend is running and accessible
4. Check network connectivity

### Error: "Email is required for OAuth sign-in"

**Solution:** The backend now handles cases where email is not provided. If you still see this error, ensure you're using the latest backend code.

### Error: "Invalid OAuth provider"

**Solution:** Ensure `provider` is exactly `"apple"` (lowercase).

## Production Considerations

### Token Verification

In production, you should verify the Apple identity token:

1. Decode the JWT token
2. Verify the signature using Apple's public keys
3. Check the token expiration
4. Validate the audience (your app's bundle ID)

### User Identification

For users who sign in without email:
- Store the Apple user identifier (`sub` claim in the JWT)
- Use this to identify users on subsequent sign-ins
- Consider storing it in a separate field in your database

## Debugging

### Enable Backend Logging

Add logging to see what's happening:

```typescript
console.log('OAuth Sign In Request:', {
  provider: oauthDto.provider,
  hasEmail: !!oauthDto.email,
  hasFullName: !!oauthDto.fullName,
  role: oauthDto.role
});
```

### Check iOS App Logs

In Xcode, check the console for:
- Apple Sign In errors
- API request/response logs
- Network errors

## Next Steps

1. Test the endpoint with Postman
2. Test the iOS app flow
3. Verify user creation in the database
4. Test subsequent sign-ins (without email)

