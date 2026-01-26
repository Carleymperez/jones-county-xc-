# Deployment Guide

## Overview

This guide covers deploying the Jones County XC application to production.

## Prerequisites

- Server with Node.js and Go installed
- Domain name (optional)
- SSL certificate (for HTTPS)

## Frontend Deployment

### Build for Production

```bash
cd frontend
npm run build
```

This creates an optimized build in the `dist/` folder.

### Serve with Nginx

1. Copy the `dist/` folder to your server
2. Configure Nginx to serve the static files:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Alternative: Serve with Go

You can also serve the frontend from the Go backend by embedding the static files.

## Backend Deployment

### Build Binary

```bash
cd backend
go build -o bin/server main.go
```

### Run as Service

Use systemd to run the backend as a service:

```ini
[Unit]
Description=Jones County XC Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/backend/bin/server
Restart=always

[Install]
WantedBy=multi-user.target
```

### Environment Variables

Set environment variables for production:
- Database connection strings
- API keys
- Secret keys

## Docker Deployment (Optional)

### Dockerfile for Backend

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
CMD ["./server"]
```

### Dockerfile for Frontend

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## Security Considerations

- Use HTTPS (SSL/TLS)
- Set secure headers
- Implement rate limiting
- Use environment variables for secrets
- Keep dependencies updated
- Regular security audits

## Monitoring

- Set up logging
- Monitor server resources
- Set up error tracking (Sentry, etc.)
- Monitor API response times
