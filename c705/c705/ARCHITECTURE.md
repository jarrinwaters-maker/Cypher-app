# C705 iOS App Architecture

This project follows the **MVVM (Model-View-ViewModel)** architecture pattern.

## Folder Structure

```
c705/
├── Views/           # SwiftUI Views
├── ViewModels/      # ViewModels (business logic)
├── Models/          # Data Models
├── Services/        # API Services & Business Logic
└── c705App.swift    # App Entry Point
```

## Architecture Overview

### Models (`Models/`)
- **User.swift** - User data model
- **Track.swift** - Track/audio data model
- **Article.swift** - Article data model
- **FeedItem.swift** - Feed item model (unified track/article)
- **Comment.swift** - Comment data model
- **AuthResponse.swift** - Authentication response models
- **Item.swift** - Legacy SwiftData model (can be removed)

### Services (`Services/`)
- **APIService.swift** - Main API service for all network requests
  - Handles authentication
  - Manages base URL and token
  - Provides methods for all endpoints
  
- **AuthService.swift** - Authentication service
  - Manages user session
  - Handles login/signup/logout
  - Stores token in UserDefaults

### ViewModels (`ViewModels/`)
- **FeedViewModel.swift** - Manages feed data and state
- **AuthViewModel.swift** - Manages authentication UI state

### Views (`Views/`)
- **FeedView.swift** - Main feed screen
- **LoginView.swift** - Login/signup screen
- **ContentView.swift** - Legacy view (can be removed)

## API Integration

All API calls go through `APIService.shared`:

```swift
// Example: Login
let response = try await APIService.shared.login(
    email: "user@example.com",
    password: "password123"
)

// Example: Get Feed
let feed = try await APIService.shared.getFeed(page: 1, limit: 20)

// Example: Like Track
let response = try await APIService.shared.likeTrack(trackId: "track-id")
```

## Authentication Flow

1. User enters credentials in `LoginView`
2. `AuthViewModel` calls `AuthService.login()`
3. `AuthService` uses `APIService` to make API call
4. Token is stored in UserDefaults
5. App state updates to show `FeedView`

## Data Flow

```
View → ViewModel → Service → API
  ↑                              ↓
  └────────── State ←────────────┘
```

## Next Steps

1. Add more views (TrackDetailView, ProfileView, etc.)
2. Implement track upload functionality
3. Add comment display and creation
4. Add like/unlike functionality
5. Implement pull-to-refresh and pagination

