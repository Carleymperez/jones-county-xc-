# Backend - Go HTTP Server

This is the Go backend server for the Jones County XC application.

## Setup

1. Install Go (if not already installed): https://go.dev/dl/

2. Install dependencies:
```bash
go mod download
```

## Running

Start the server:
```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/*` - General API endpoint

## Building

Build the binary:
```bash
go build -o bin/server main.go
```

Run the binary:
```bash
./bin/server
```
