# API Reference

## Base URL

- **Production:** `https://carley-xc-webdesign.me`
- **Development:** `http://localhost:8080`

## Endpoints

### Health Check

**GET** `/api/health`

Check if the backend server is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Backend server is running!",
  "timestamp": "2026-02-10T15:39:19.448095875Z"
}
```

---

### Athletes

#### List All Athletes

**GET** `/api/athletes`

Returns all athletes sorted by name.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Marcus Thompson",
    "grade": 12,
    "personal_record": "16:23",
    "events": "5K,3200m"
  }
]
```

#### Get Athlete by ID

**GET** `/api/athletes/:id`

**Response:**
```json
{
  "id": 1,
  "name": "Marcus Thompson",
  "grade": 12,
  "personal_record": "16:23",
  "events": "5K,3200m"
}
```

**Status Codes:**
- `200 OK` - Athlete found
- `400 Bad Request` - Invalid ID
- `404 Not Found` - Athlete not found

---

### Meets

#### List All Meets

**GET** `/api/meets`

Returns all meets sorted by date.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Jones County Invitational",
    "date": "2026-09-12",
    "location": "Jones County High School, Gray GA"
  }
]
```

#### Get Meet by ID

**GET** `/api/meets/:id`

**Response:**
```json
{
  "id": 1,
  "name": "Jones County Invitational",
  "date": "2026-09-12",
  "location": "Jones County High School, Gray GA"
}
```

#### Get Meet Results

**GET** `/api/meets/:id/results`

Returns all results for a meet with athlete names, sorted by place.

**Response:**
```json
[
  {
    "id": 1,
    "athleteId": 1,
    "meetId": 1,
    "time": "16:31",
    "place": 1,
    "athleteName": "Marcus Thompson"
  }
]
```

---

### Results

#### List All Results

**GET** `/api/results`

**Response:**
```json
[
  {
    "id": 1,
    "athleteId": 1,
    "meetId": 1,
    "time": "16:31",
    "place": 1
  }
]
```

#### Create Result

**POST** `/api/results`

**Request Body:**
```json
{
  "athleteId": 1,
  "meetId": 4,
  "time": "16:05",
  "place": 2
}
```

**Response (201 Created):**
```json
{
  "id": 25,
  "athleteId": 1,
  "meetId": 4,
  "time": "16:05",
  "place": 2
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid athlete ID"
}
```

### 404 Not Found
```json
{
  "error": "athlete not found"
}
```

### 429 Too Many Requests
Rate limit exceeded.

### 500 Internal Server Error
```json
{
  "error": "database error message"
}
```

---

## Rate Limiting

API requests are rate limited per IP address:

| Setting | Value |
|---------|-------|
| Rate | 10 requests/second |
| Burst | 20 requests |
| Over limit | Returns 429 |

---

## CORS

CORS is enabled for all origins:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

---

## Example curl Commands

```bash
# Health check
curl https://carley-xc-webdesign.me/api/health

# Get all athletes
curl https://carley-xc-webdesign.me/api/athletes

# Get single athlete
curl https://carley-xc-webdesign.me/api/athletes/1

# Get all meets
curl https://carley-xc-webdesign.me/api/meets

# Get meet results
curl https://carley-xc-webdesign.me/api/meets/1/results

# Create a result
curl -X POST https://carley-xc-webdesign.me/api/results \
  -H "Content-Type: application/json" \
  -d '{"athleteId": 1, "meetId": 4, "time": "16:05", "place": 2}'
```
