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

- User management endpoints
- Data CRUD operations
- Authentication endpoints
- File upload endpoints
