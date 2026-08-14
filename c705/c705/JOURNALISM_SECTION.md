# Journalism Section - iOS App (Read-Only)

## Overview

The iOS app provides **read-only access** to journalism content. All articles are displayed in the community feed, but users cannot create, edit, or delete articles.

## Rules

✅ **Content comes from backend** - Articles are fetched from `/feed` endpoint  
✅ **iOS app is READ-ONLY** - No article creation/editing functionality  
✅ **Admin publishes via web panel** - Admins manage content through backend API

## Implementation

### Article Display

Articles appear in the community feed (`FeedView`) alongside tracks:

- **Component:** `ArticleFeedItemView` in `FeedItemView.swift`
- **Data Source:** Combined feed from `GET /feed` endpoint
- **Display:**
  - Title
  - Content preview (3 lines max)
  - Author email
  - City location
  - Timestamp (relative format)

### API Integration

The iOS app **only** uses read-only endpoints:

#### Feed Endpoint (Includes Articles)
```swift
// APIService.swift
func getFeed(page: Int, limit: Int) async throws -> FeedResponse
```
- Fetches combined feed of tracks and articles
- Used by `FeedViewModel` to load content
- Articles are automatically included in the feed

#### No Write Methods

The iOS app **does NOT** have:
- ❌ `createArticle()` method
- ❌ `updateArticle()` method
- ❌ `deleteArticle()` method
- ❌ Any UI for creating/editing articles

### Code Structure

```
c705/
├── Models/
│   └── Article.swift          # Article data model (read-only)
├── Views/
│   ├── FeedView.swift         # Main feed (displays articles)
│   └── FeedItemView.swift     # ArticleFeedItemView component
├── ViewModels/
│   └── FeedViewModel.swift    # Loads feed (includes articles)
└── Services/
    └── APIService.swift       # Only read methods for articles
```

### Article Model

```swift
struct AppArticle: Codable, Identifiable {
    let id: String
    let title: String
    let content: String
    let city: String
    let createdAt: String
    let author: AppUser?
}
```

### Feed Item Display

Articles are displayed as `FeedItem` with type `.article`:

```swift
struct FeedItem: Codable, Identifiable {
    let id: String
    let type: FeedItemType  // .track or .article
    let title: String
    let createdAt: String
    // Article-specific properties
    let content: String?
    let city: String?
    let author: AppUser?
}
```

## User Experience

### Viewing Articles

1. User opens the app → `FeedView` loads
2. Feed fetches from `/feed` endpoint
3. Articles appear mixed with tracks in chronological order
4. User can scroll to see more articles (infinite scroll)
5. User can tap to view full article (if implemented)

### No Editing Capabilities

- No "Create Article" button
- No "Edit Article" button
- No "Delete Article" button
- Articles are display-only content

## Security

✅ **No write access** - iOS app cannot modify articles  
✅ **Read-only API calls** - Only uses `GET /feed` endpoint  
✅ **Authentication required** - All API calls require JWT token  
✅ **No admin UI** - Admin features are not exposed in iOS app

## Testing

### Verify Read-Only Access

1. Open the app and navigate to feed
2. Verify articles appear in the feed
3. Verify there are no edit/delete buttons on articles
4. Verify no article creation UI exists

### Verify Feed Integration

1. Check that articles load in `FeedView`
2. Verify infinite scrolling works for articles
3. Verify article metadata displays correctly (title, content, author, city)

## Summary

| Feature | iOS App Status |
|---------|----------------|
| View Articles | ✅ Yes (in feed) |
| Search Articles | ✅ Yes (via feed) |
| Create Articles | ❌ No |
| Edit Articles | ❌ No |
| Delete Articles | ❌ No |
| Admin Panel | ❌ No (web only) |

## Next Steps (Future)

If article detail view is needed:
- Create `ArticleDetailView.swift` for full article display
- Add navigation from `ArticleFeedItemView` to detail view
- Still maintain read-only access

