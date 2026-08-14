# Articles API

Articles module for managing content. Only **ADMIN** and **JOURNALIST** can create, update, or delete articles. The **iOS app can only read** articles.

## Permissions

### Create/Update/Delete
- ✅ **ADMIN** - Can create, update, and delete any article
- ✅ **JOURNALIST** - Can create articles, but can only update/delete their own articles
- ❌ **All other roles** - Read-only access

### Read Access
- ✅ **All authenticated users** (including iOS app) - Can read/search articles

## API Endpoints

### Read-Only Endpoints (iOS App Can Use)

#### Get All Articles
**GET** `/articles?page=1&limit=20`
- Returns paginated list of all articles
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

#### Search Articles
**GET** `/articles/search?query=keyword&city=NewYork&authorId=xxx&page=1&limit=20`
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
**GET** `/articles/:id`
- Get a single article by ID
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

#### Get Articles by Author
**GET** `/articles/author/:authorId?page=1&limit=20`
- Get all articles by a specific author
- **Authentication:** Required (JWT)
- **Permissions:** Any authenticated user

### Write Endpoints (ADMIN and JOURNALIST Only)

#### Create Article
**POST** `/articles`
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

#### Update Article
**PUT** `/articles/:id`
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
  - ADMIN can update any article
  - JOURNALIST can only update their own articles

#### Delete Article
**DELETE** `/articles/:id`
- **Authentication:** Required (JWT)
- **Permissions:**
  - ADMIN can delete any article
  - JOURNALIST can only delete their own articles

#### Get My Articles
**GET** `/articles/my-articles?page=1&limit=20`
- Get all articles created by the authenticated user
- **Authentication:** Required (JWT)
- **Permissions:** ADMIN, JOURNALIST only

## Response Examples

### Article Object
```json
{
  "id": "article-uuid",
  "title": "Breaking News",
  "content": "Article content here...",
  "city": "New York",
  "authorId": "user-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": "user-uuid",
    "email": "journalist@example.com",
    "role": "JOURNALIST"
  }
}
```

### Paginated Response
```json
{
  "articles": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Usage Examples

### iOS App - Read Articles
```swift
// Get all articles
GET /articles?page=1&limit=20
Headers: Authorization: Bearer <token>

// Search articles
GET /articles/search?query=music&city=NewYork
Headers: Authorization: Bearer <token>

// Get specific article
GET /articles/{articleId}
Headers: Authorization: Bearer <token>
```

### Journalist/Admin - Create Article
```bash
POST /articles
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "title": "New Article",
  "content": "Article content...",
  "city": "Los Angeles"
}
```

## Error Responses

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions (not ADMIN/JOURNALIST, or trying to modify someone else's article)
- `404 Not Found`: Article not found

## Security Notes

- All endpoints require JWT authentication
- Write operations (POST, PUT, DELETE) are restricted to ADMIN and JOURNALIST roles
- Journalists can only modify their own articles
- Admins have full control over all articles
- iOS app has read-only access to all articles

