# Journalism Section - Content Control

## Overview

The Journalism section provides a read-only content viewing experience for iOS users, while allowing Admins and Journalists to manage content through the backend API.

## Rules

✅ **Content comes from backend** - All articles are stored in the database and served via API  
✅ **iOS app is READ-ONLY** - iOS app can only view articles, cannot create/edit/delete  
✅ **Admin publishes via web panel** - Admins and Journalists use backend API endpoints to manage content

## Backend API Endpoints

### Read-Only Endpoints (iOS App Uses These)

All authenticated users (including iOS app) can access these endpoints:

#### Get All Articles
```
GET /articles?page=1&limit=20
```
- Returns paginated list of all articles
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

#### Search Articles
```
GET /articles/search?query=keyword&city=NewYork&authorId=xxx&page=1&limit=20
```
- Search articles by title, content, city, or author
- **Query Parameters:**
  - `query` - Search in title and content
  - `city` - Filter by city
  - `authorId` - Filter by author
  - `page` (default: 1)
  - `limit` (default: 20)
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

#### Get Article by ID
```
GET /articles/:id
```
- Get a single article by ID
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

#### Get Articles by Author
```
GET /articles/author/:authorId?page=1&limit=20
```
- Get all articles by a specific author
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

### Write Endpoints (Admin/Journalist Only - Web Panel)

These endpoints are **NOT accessible from iOS app**. They are for admin web panel use only.

#### Create Article
```
POST /articles
```
- **Body:**
  ```json
  {
    "title": "Article Title",
    "content": "Article content...",
    "city": "New York"
  }
  ```
- **Authentication:** Required (JWT)
- **Permissions:** ADMIN, JOURNALIST only
- **Note:** Journalists can create articles. Admins can create and manage any article.

#### Update Article
```
PUT /articles/:id
```
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content...",
    "city": "Los Angeles"
  }
  ```
- **Authentication:** Required (JWT)
- **Permissions:** 
  - ADMIN - Can update any article
  - JOURNALIST - Can only update their own articles

#### Delete Article
```
DELETE /articles/:id
```
- **Authentication:** Required (JWT)
- **Permissions:**
  - ADMIN - Can delete any article
  - JOURNALIST - Can only delete their own articles

#### Get My Articles (For Journalists/Admins)
```
GET /articles/my-articles?page=1&limit=20
```
- Get articles created by the current user
- **Authentication:** Required (JWT)
- **Permissions:** ADMIN, JOURNALIST only

## iOS App Implementation

### Read-Only Access

The iOS app **only** has read access to articles:

✅ **Can do:**
- View articles in the feed (`FeedView`)
- Search articles (via feed search)
- View article details
- See article metadata (author, city, date)

❌ **Cannot do:**
- Create articles
- Edit articles
- Delete articles
- No article creation/editing UI exists in iOS app

### Article Display

Articles appear in the community feed alongside tracks:
- Displayed via `ArticleFeedItemView` component
- Shows title, content preview, author, city, and timestamp
- Read-only - no edit/delete buttons

## Admin Web Panel (Future)

The admin web panel will use the write endpoints above to:
- Create new articles
- Edit existing articles
- Delete articles
- Manage article publishing workflow

**Note:** The web panel is not yet implemented. Admins can currently use Postman or direct API calls to manage articles.

## Security

- ✅ All endpoints require JWT authentication
- ✅ Write operations are protected by `RolesGuard` and `@Roles()` decorator
- ✅ iOS app has no write methods in `APIService.swift` for articles
- ✅ Backend validates permissions on every write operation
- ✅ Journalists can only modify their own articles (admins can modify any)

## Testing

### Test Read Access (iOS App)
```bash
# Get all articles
GET http://localhost:3000/articles?page=1&limit=20
Authorization: Bearer <user_token>

# Search articles
GET http://localhost:3000/articles/search?query=music&city=NewYork
Authorization: Bearer <user_token>
```

### Test Write Access (Admin/Journalist Only)
```bash
# Create article (requires ADMIN or JOURNALIST role)
POST http://localhost:3000/articles
Authorization: Bearer <admin_or_journalist_token>
Content-Type: application/json

{
  "title": "New Article",
  "content": "Article content here...",
  "city": "New York"
}
```

## Summary

| Feature | iOS App | Admin Web Panel | Journalist |
|---------|---------|-----------------|------------|
| View Articles | ✅ | ✅ | ✅ |
| Search Articles | ✅ | ✅ | ✅ |
| Create Articles | ❌ | ✅ | ✅ |
| Edit Articles | ❌ | ✅ (any) | ✅ (own only) |
| Delete Articles | ❌ | ✅ (any) | ✅ (own only) |

