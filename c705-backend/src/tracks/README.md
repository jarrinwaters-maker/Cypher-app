# Tracks Upload Flow

This module handles the complete audio file upload flow from iOS app to S3 storage.

## Upload Flow

```
iOS App → Backend → S3 → Database
         (receives)  (uploads)  (saves URL)
```

**Important:** The backend NEVER stores audio files locally. Files are streamed directly from the request to S3.

## API Endpoints

### Upload Track

**POST** `/tracks/upload`

Upload an audio file. Requires `canUploadMusic` permission (ARTIST, ADMIN).

**Request:**
- Content-Type: `multipart/form-data`
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Body:
  - `file`: Audio file (required)
  - `title`: Track title (required)

**Supported Audio Formats:**
- MP3 (`audio/mpeg`, `audio/mp3`)
- WAV (`audio/wav`, `audio/wave`, `audio/x-wav`)
- M4A (`audio/mp4`, `audio/m4a`)
- AAC (`audio/aac`)
- OGG (`audio/ogg`)
- WebM (`audio/webm`)

**Response:**
```json
{
  "id": "track-uuid",
  "title": "My Song",
  "audioUrl": "https://c705-media.s3.us-east-2.amazonaws.com/music/user-id/timestamp-My Song.mp3",
  "artistId": "artist-profile-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "message": "Track uploaded successfully"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/tracks/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/song.mp3" \
  -F "title=My Awesome Song"
```

**Example (iOS - Swift):**
```swift
let url = URL(string: "http://localhost:3000/tracks/upload")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("Bearer \(jwtToken)", forHTTPHeaderField: "Authorization")

let boundary = UUID().uuidString
request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

var body = Data()
body.append("--\(boundary)\r\n".data(using: .utf8)!)
body.append("Content-Disposition: form-data; name=\"title\"\r\n\r\n".data(using: .utf8)!)
body.append("My Awesome Song\r\n".data(using: .utf8)!)

body.append("--\(boundary)\r\n".data(using: .utf8)!)
body.append("Content-Disposition: form-data; name=\"file\"; filename=\"song.mp3\"\r\n".data(using: .utf8)!)
body.append("Content-Type: audio/mpeg\r\n\r\n".data(using: .utf8)!)
body.append(audioData)
body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)

request.httpBody = body
```

### Get My Tracks

**GET** `/tracks/my-tracks`

Get all tracks uploaded by the authenticated user.

**Response:**
```json
{
  "tracks": [
    {
      "id": "track-uuid",
      "title": "My Song",
      "audioUrl": "https://c705-media.s3.us-east-2.amazonaws.com/...",
      "artistId": "artist-profile-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Track by ID

**GET** `/tracks/:id`

Get a specific track by ID.

### Delete Track

**DELETE** `/tracks/:id`

Delete a track. Only the owner can delete their tracks. This will:
1. Delete the file from S3
2. Delete the record from the database

## How It Works

1. **iOS App sends audio file** via multipart/form-data
2. **Backend receives file** in memory (Express.Multer.File)
3. **Backend uploads to S3** using S3Service (file buffer streamed directly to S3)
4. **S3 returns URL** of the uploaded file
5. **URL saved to database** in the Track model's `audioUrl` field
6. **Backend NEVER stores files locally** - files only exist in S3

## File Organization in S3

Files are organized as:
```
music/{userId}/{timestamp}-{title}.{extension}
```

Example:
```
music/abc123/1703123456789-My Awesome Song.mp3
```

## Security

- All endpoints require JWT authentication
- Upload requires `canUploadMusic` permission (ARTIST, ADMIN)
- Users can only delete their own tracks
- Audio file type validation prevents malicious uploads

## Error Handling

- `400 Bad Request`: Invalid file type, missing file, or missing title
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Track not found

