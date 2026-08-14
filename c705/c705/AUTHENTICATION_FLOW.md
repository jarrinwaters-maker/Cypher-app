# User Authentication Flow

## Overview

The authentication system uses secure Keychain storage for tokens instead of UserDefaults.

## Flow Diagram

```
User Input (Email/Password)
    ↓
LoginView (UI)
    ↓
AuthViewModel (View Model)
    ↓
AuthService (Service Layer)
    ↓
APIService (Network Layer)
    ↓
Backend API (POST /auth/login or /auth/signup)
    ↓
Response (Token + User)
    ↓
KeychainService (Secure Storage)
    ↓
AuthService (Update State)
    ↓
App Navigation (Show FeedView)
```

## Components

### 1. KeychainService
- **Location:** `Services/KeychainService.swift`
- **Purpose:** Secure storage for sensitive data
- **Features:**
  - Save/retrieve strings
  - Save/retrieve Codable objects
  - Delete items
  - Clear all data
  - Uses iOS Keychain (encrypted, secure)

### 2. AuthService
- **Location:** `Services/AuthService.swift`
- **Purpose:** Manages authentication state and token storage
- **Responsibilities:**
  - Login/signup API calls
  - Token storage in Keychain
  - User state management
  - Auto-login on app launch

### 3. AuthViewModel
- **Location:** `ViewModels/AuthViewModel.swift`
- **Purpose:** UI state management for login/signup
- **Responsibilities:**
  - Form validation
  - UI state (loading, errors)
  - Calls AuthService methods

### 4. LoginView
- **Location:** `Views/LoginView.swift`
- **Purpose:** User interface for authentication
- **Features:**
  - Email/password input
  - Signup mode toggle
  - Role selection (for signup)
  - Error display

## Authentication Steps

### Login Flow

1. **User enters credentials** in `LoginView`
2. **AuthViewModel** validates input
3. **AuthService.login()** is called
4. **APIService** sends POST request to `/auth/login`
5. **Backend** validates credentials and returns token
6. **KeychainService** securely stores token and user data
7. **AuthService** updates `isAuthenticated = true`
8. **App** navigates to `FeedView`

### Signup Flow

1. **User enters credentials** and selects role
2. **AuthViewModel** validates input (password match)
3. **AuthService.signup()** is called
4. **APIService** sends POST request to `/auth/signup`
5. **Backend** creates user and returns token
6. **KeychainService** securely stores token and user data
7. **AuthService** updates `isAuthenticated = true`
8. **App** navigates to `FeedView`

### Auto-Login (App Launch)

1. **App launches** → `c705App.swift`
2. **AuthService.init()** checks Keychain
3. If token exists:
   - Load token and user from Keychain
   - Set `isAuthenticated = true`
   - Show `FeedView`
4. If no token:
   - Show `LoginView`

### Logout Flow

1. **User taps logout**
2. **AuthService.logout()** is called
3. **KeychainService** deletes token and user data
4. **AuthService** updates `isAuthenticated = false`
5. **App** navigates to `LoginView`

## Security Features

### Keychain Storage
- ✅ Encrypted by iOS
- ✅ Protected by device passcode/biometrics
- ✅ Not accessible to other apps
- ✅ Persists across app launches
- ✅ Automatically cleared on app uninstall

### Token Management
- Token stored securely in Keychain
- Token sent in Authorization header for API requests
- Token cleared on logout
- No token stored in UserDefaults (insecure)

## API Integration

### Login Endpoint
```
POST /auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "access_token": "jwt-token", "user": { ... } }
```

### Signup Endpoint
```
POST /auth/signup
Body: { "email": "user@example.com", "password": "password123", "role": "ARTIST" }
Response: { "access_token": "jwt-token", "user": { ... } }
```

## Error Handling

- Network errors → Displayed in UI
- Invalid credentials → Error message shown
- Keychain save failures → Error logged
- Token expiration → User redirected to login

## Testing

To test the authentication flow:

1. **Run the app**
2. **Enter email/password** in LoginView
3. **Tap Login** button
4. **Verify:**
   - Loading indicator shows
   - API request sent to backend
   - Token stored in Keychain
   - FeedView appears on success
   - Error message shows on failure

## Keychain Keys

- `authToken` - JWT access token
- `currentUser` - User object (AppUser)

