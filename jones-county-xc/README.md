# Jones County XC

A full-stack web application for Jones County Cross Country, featuring a React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/          # React application with Vite and Tailwind CSS
├── backend/           # Go HTTP server
└── docs/             # Project documentation
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Go 1.21+** - Programming language
- **Gorilla Mux** - HTTP router and URL matcher

## Prerequisites

- **Node.js** 18+ and npm (for frontend)
- **Go** 1.21+ (for backend)

## Getting Started

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
go mod download
```

### 3. Run the Application

#### Option A: Run Both Separately

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
```
Backend will run on `http://localhost:8080`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

#### Option B: Use the Scripts

You can create a simple script to run both, or use a process manager like `concurrently`.

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

The frontend is configured to proxy API requests from `/api/*` to `http://localhost:8080`.

### Backend Development

```bash
cd backend
go run main.go           # Run the server
go build -o bin/server   # Build binary
go test ./...            # Run tests
```

## API Endpoints

- `GET /api/health` - Health check endpoint
  - Returns: `{ "status": "healthy", "message": "Backend server is running!", "timestamp": "..." }`

## Project Features

- ✅ React frontend with Vite for fast development
- ✅ Tailwind CSS for styling
- ✅ Go backend with HTTP server
- ✅ CORS enabled for frontend-backend communication
- ✅ Health check endpoint
- ✅ Development-ready configuration

## Next Steps

1. Set up your database (if needed)
2. Add authentication/authorization
3. Implement your application-specific features
4. Set up CI/CD pipeline
5. Configure production deployment

## Documentation

See the `/docs` folder for additional documentation.

## License

[Add your license here]
