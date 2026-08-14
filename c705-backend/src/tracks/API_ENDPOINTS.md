# Tracks API Endpoints

Complete list of all available track endpoints.

## Authentication
All endpoints require JWT authentication unless otherwise specified. Include `Authorization: Bearer <token>` header.

## Endpoints

### 1. Upload Track
**POST** `/tracks/upload`
- **Permission Required:** `canUploadMusic` (ARTIST, ADMIN)
- **Body:** `multipart/form-data`
  - `file`: Audio file (required)
  - `title`: Track title (required)
- **Response:** Track object with S3 URL

### 2. Get All Public Tracks
**GET** `/tracks?page=1&limit=20&sortBy=recent`
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
  - `sortBy`: `recent` | `popular` | `likes` (default: `recent`)
- **Response:** Paginated list of tracks

### 3. Search Tracks
**GET** `/tracks/search?query=song&artistId=xxx&page=1&limit=20&sortBy=recent`
- **Query Parameters:**
  - `query`: Search term (optional)
  - `artistId`: Filter by artist (optional)
  - `page` (default: 1)
  - `limit` (default: 20)
  - `sortBy`: `recent` | `popular` | `likes` (default: `recent`)
- **Response:** Paginated search results with `isLiked` flag if authenticated

### 4. Get Track by ID
**GET** `/tracks/:id`
- **Response:** Single track with artist info

### 5. Update Track Metadata
**PUT** `/tracks/:id`
- **Body:** `{ "title": "New Title" }`
- **Response:** Updated track
- **Note:** Only track owner can update

### 6. Delete Track
**DELETE** `/tracks/:id`
- **Response:** Success message
- **Note:** Only track owner can delete. Removes from S3 and database.

### 7. Get My Tracks
**GET** `/tracks/my-tracks`
- **Response:** All tracks uploaded by authenticated user

### 8. Get Tracks by Artist
**GET** `/tracks/artist/:artistId?page=1&limit=20`
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
- **Response:** Artist profile and their tracks

### 9. Get Popular/Trending Tracks
**GET** `/tracks/popular?limit=20&timeRange=all`
- **Query Parameters:**
  - `limit` (default: 20)
  - `timeRange`: `day` | `week` | `month` | `all` (default: `all`)
- **Response:** List of popular tracks sorted by likes

### 10. Like a Track
**POST** `/tracks/:id/like`
- **Response:** Success message
- **Note:** Increments track's like count

### 11. Unlike a Track
**DELETE** `/tracks/:id/like`
- **Response:** Success message
- **Note:** Decrements track's like count

### 12. Get Liked Tracks
**GET** `/tracks/liked?page=1&limit=20`
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
- **Response:** Paginated list of tracks liked by authenticated user

## Response Examples

### Track Object
```json
{
  "id": "track-uuid",
  "title": "My Song",
  "audioUrl": "https://c705-media.s3.us-east-2.amazonaws.com/...",
  "artistId": "artist-uuid",
  "likeCount": 42,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "artist": {
    "id": "artist-uuid",
    "bio": "Artist bio",
    "user": {
      "id": "user-uuid",
      "email": "artist@example.com",
      "role": "ARTIST"
    }
  }
}
```

### Paginated Response
```json
{
  "tracks": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Error Responses

- `400 Bad Request`: Invalid input, duplicate like, etc.
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions or not owner
- `404 Not Found`: Track/artist not found

