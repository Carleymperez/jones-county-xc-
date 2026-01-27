# API Documentation

## Base URL

Development: `http://localhost:8080`

## Endpoints

### Health Check

**GET** `/api/health`

Check if the backend server is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Backend server is running!",
  "timestamp": "2026-01-23T19:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

### List Athletes

**GET** `/api/athletes`

Returns all athletes with their name, grade, and personal record.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Jake Thompson",
    "grade": 11,
    "personal_record": "16:42"
  },
  {
    "id": 2,
    "name": "Maria Garcia",
    "grade": 10,
    "personal_record": "19:15"
  }
]
```

**Status Codes:**
- `200 OK` - Returns array of athletes

---

### General API Endpoint

**GET/POST/PUT/DELETE** `/api/*`

General API endpoint for future routes.

**Response:**
```json
{
  "message": "API endpoint is working",
  "method": "GET",
  "path": "/api/..."
}
```

## CORS

All endpoints support CORS and accept requests from `http://localhost:3000` (frontend dev server).

## Error Handling

Error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Future Endpoints

- Athlete CRUD operations (POST, PUT, DELETE)
- Authentication endpoints
- Meet/race results endpoints
