# Jones County XC

A full-stack web application for Jones County Cross Country, featuring a React frontend, Go backend, and SQLite database.

**Live Site:** https://carley-xc-webdesign.me

## Project Structure

```
jones-county-xc/
├── frontend/          # React application with Vite and TanStack Query
├── backend/           # Go API server with Gin and sqlc
│   ├── db/            # sqlc generated database code
│   ├── schema.sql     # Database schema
│   ├── queries.sql    # SQL queries for sqlc
│   └── sqlc.yaml      # sqlc configuration
├── nginx/             # Nginx server configuration
├── scripts/           # Deployment scripts
└── docs/              # Project documentation
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Go 1.24** - Programming language
- **Gin** - HTTP web framework
- **sqlc** - Type-safe SQL code generator
- **SQLite** - Database (using modernc.org/sqlite)

### Infrastructure
- **AWS Lightsail** - Cloud hosting
- **Nginx** - Reverse proxy with SSL
- **Let's Encrypt** - SSL certificates
- **systemd** - Service management

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Go** 1.21+
- **sqlc** (`brew install sqlc`)

### 1. Clone and Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
go mod download
```

### 2. Set Up Database

```bash
cd backend
sqlc generate  # Generate Go code from SQL
```

### 3. Run Locally

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
```
Backend runs on `http://localhost:8080`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/athletes` | List all athletes |
| GET | `/api/athletes/:id` | Get athlete by ID |
| GET | `/api/meets` | List all meets |
| GET | `/api/meets/:id` | Get meet by ID |
| GET | `/api/meets/:id/results` | Get meet results with athlete names |
| GET | `/api/results` | List all results |
| POST | `/api/results` | Create a new result |

### Example API Calls

```bash
# Health check
curl https://carley-xc-webdesign.me/api/health

# Get all athletes
curl https://carley-xc-webdesign.me/api/athletes

# Get meet results
curl https://carley-xc-webdesign.me/api/meets/1/results

# Add a result
curl -X POST https://carley-xc-webdesign.me/api/results \
  -H "Content-Type: application/json" \
  -d '{"athleteId": 1, "meetId": 4, "time": "16:05", "place": 2}'
```

## Database Schema

```sql
-- Athletes table
CREATE TABLE athletes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade INTEGER,
    personal_record TEXT,
    events TEXT
);

-- Meets table
CREATE TABLE meets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT,
    location TEXT
);

-- Results table (links athletes to meets)
CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    athlete_id INTEGER,
    meet_id INTEGER,
    time TEXT,
    place INTEGER,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (meet_id) REFERENCES meets(id)
);
```

## Deployment

### Deploy to Lightsail

```bash
# Run the deploy script
./scripts/deploy-all.sh
```

Or manually:

```bash
# Build frontend
cd frontend && npm run build

# Build backend for Linux
cd backend && GOOS=linux GOARCH=amd64 go build -o server

# Copy to server
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem \
  backend/server ubuntu@3.217.16.76:/var/www/jones-county-xc/backend/

# Restart service
ssh ubuntu@3.217.16.76 "sudo systemctl restart jones-county-xc"
```

### Server Management

```bash
# Check service status
sudo systemctl status jones-county-xc

# View logs
sudo journalctl -u jones-county-xc -f

# Restart service
sudo systemctl restart jones-county-xc

# Reload nginx
sudo systemctl reload nginx
```

## Features

- ✅ React frontend with athlete roster display
- ✅ Go backend with RESTful API
- ✅ SQLite database with sqlc type-safe queries
- ✅ TanStack Query for data fetching
- ✅ HTTPS with Let's Encrypt SSL
- ✅ Nginx reverse proxy with rate limiting
- ✅ systemd service for auto-restart
- ✅ Automated deployment scripts

## Documentation

See the `/docs` folder for additional documentation:
- `api.md` - API reference
- `architecture.md` - System architecture
- `deployment.md` - Deployment guide
- `database-setup.md` - Database setup

## License

MIT
