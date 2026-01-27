# Architecture

## Overview

Jones County XC is a full-stack web application with a clear separation between frontend and backend.

## System Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/HTTPS
       │
┌──────▼──────────────────┐
│   Frontend (React)      │
│   - Port 3000           │
│   - Vite Dev Server     │
└──────┬──────────────────┘
       │ API Calls (/api/*)
       │
┌──────▼──────────────────┐
│   Backend (Go)          │
│   - Port 8080           │
│   - HTTP Server         │
└─────────────────────────┘
```

## Frontend Architecture

- **Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast HMR and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React hooks (useState, useEffect)
- **API Communication**: Fetch API with proxy configuration

## Backend Architecture

- **Language**: Go 1.21+
- **Router**: Gorilla Mux for HTTP routing
- **API Design**: RESTful endpoints
- **CORS**: Enabled for frontend communication

## Data Flow

1. User interacts with React frontend
2. Frontend makes API calls to `/api/*` endpoints
3. Vite dev server proxies requests to Go backend (port 8080)
4. Go backend processes requests and returns JSON responses
5. Frontend updates UI based on response

## Future Considerations

- Database integration (PostgreSQL, MySQL, etc.)
- Authentication/Authorization (JWT, OAuth)
- File storage (S3, local storage)
- Caching layer (Redis)
- Message queue (RabbitMQ, Kafka)
