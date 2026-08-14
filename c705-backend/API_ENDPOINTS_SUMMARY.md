# API Endpoints Summary

All required endpoints are now implemented and available.

## Required Endpoints ✅

### 1. POST /auth/login
- **Controller:** `AuthController`
- **Description:** User login endpoint
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** JWT token and user info

### 2. POST /auth/signup
- **Controller:** `AuthController`
- **Description:** User registration endpoint
- **Body:** `{ "email": "user@example.com", "password": "password123", "role": "ARTIST" }`
- **Response:** JWT token and user info

### 3. POST /tracks/upload
- **Controller:** `TracksController`
- **Description:** Upload audio track to S3
- **Content-Type:** `multipart/form-data`
- **Body:** 
  - `file`: Audio file (required)
  - `title`: Track title (required)
- **Response:** Track object with S3 URL

### 4. GET /feed
- **Controller:** `FeedController`
- **Description:** Get combined feed of tracks and articles
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
- **Response:** Combined feed with tracks and articles sorted by date

### 5. POST /like
- **Controller:** `LikesController`
- **Description:** Like a track (simplified endpoint)
- **Body:** `{ "trackId": "track-uuid" }`
- **Response:** Success message

### 6. POST /comment
- **Controller:** `CommentsController`
- **Description:** Add a comment to a track
- **Body:** `{ "content": "Great track!", "trackId": "track-uuid" }`
- **Response:** Comment object with user and track info

## Additional Endpoints

### Tracks
- `GET /tracks` - Get all public tracks
- `GET /tracks/:id` - Get track by ID
- `GET /tracks/my-tracks` - Get user's tracks
- `GET /tracks/liked` - Get liked tracks
- `GET /tracks/popular` - Get popular tracks
- `GET /tracks/search` - Search tracks
- `GET /tracks/artist/:artistId` - Get tracks by artist
- `PUT /tracks/:id` - Update track
- `DELETE /tracks/:id` - Delete track
- `POST /tracks/:id/like` - Like track (alternative endpoint)
- `DELETE /tracks/:id/like` - Unlike track

### Articles
- `GET /articles` - Get all articles
- `GET /articles/:id` - Get article by ID
- `GET /articles/search` - Search articles
- `GET /articles/author/:authorId` - Get articles by author
- `GET /articles/my-articles` - Get user's articles
- `POST /articles` - Create article (ADMIN/JOURNALIST only)
- `PUT /articles/:id` - Update article (ADMIN/JOURNALIST only)
- `DELETE /articles/:id` - Delete article (ADMIN/JOURNALIST only)

### S3
- `POST /s3/upload` - Upload file to S3
- `GET /s3/presigned-url/:key` - Get presigned URL
- `GET /s3/exists/:key` - Check if file exists
- `DELETE /s3/:key` - Delete file from S3

## Authentication

All endpoints (except `/auth/login` and `/auth/signup`) require JWT authentication.

Include the JWT token in the request header:
```
Authorization: Bearer <your-jwt-token>
```

## Example Usage

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Feed
```bash
curl -X GET http://localhost:3000/feed?page=1&limit=20 \
  -H "Authorization: Bearer <token>"
```

### Like Track
```bash
curl -X POST http://localhost:3000/like \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"trackId":"track-uuid"}'
```

### Comment on Track
```bash
curl -X POST http://localhost:3000/comment \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great track!","trackId":"track-uuid"}'
```

### Upload Track
```bash
curl -X POST http://localhost:3000/tracks/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@song.mp3" \
  -F "title=My Song"
```

