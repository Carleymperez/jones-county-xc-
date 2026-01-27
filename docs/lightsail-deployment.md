# Lightsail Deployment Guide

Complete guide for deploying the Jones County XC application to AWS Lightsail.

## Overview

This guide will help you set up:
- **Go Backend API** - Running on port 8080
- **React Frontend** - Static files served by nginx on port 80
- **SQLite Database** - File-based storage (no separate service needed)

## Prerequisites

- AWS Lightsail instance running Ubuntu 24.04
- SSH access to your server
- Your SSH key: `~/.ssh/LightsailDefaultKey-us-east-1.pem`
- Server IP: `3.217.16.76`

## Step-by-Step Setup

### Step 1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Go

```bash
# Download Go (check latest version at https://go.dev/dl/)
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz

# Remove old Go installation if exists
sudo rm -rf /usr/local/go

# Extract Go
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz

# Add Go to PATH
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Verify installation
go version
```

### Step 3: Install SQLite

```bash
sudo apt install sqlite3 -y

# Verify installation
sqlite3 --version
```

### Step 4: Configure Nginx

We'll configure nginx to:
- Serve React frontend static files
- Proxy API requests to Go backend

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/jones-county-xc
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 3.217.16.76;

    # Serve React frontend
    root /var/www/jones-county-xc/frontend;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Go backend
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/jones-county-xc /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 5: Set Up Application Directories

```bash
# Create application directory
sudo mkdir -p /var/www/jones-county-xc/{frontend,backend}

# Set ownership
sudo chown -R ubuntu:ubuntu /var/www/jones-county-xc
```

### Step 6: Create Systemd Service for Go Backend

```bash
sudo nano /etc/systemd/system/jones-county-xc.service
```

Add this configuration:

```ini
[Unit]
Description=Jones County XC Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/jones-county-xc/backend
Environment="PORT=8080"
ExecStart=/var/www/jones-county-xc/backend/jones-county-xc
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (starts on boot)
sudo systemctl enable jones-county-xc

# Start service
sudo systemctl start jones-county-xc

# Check status
sudo systemctl status jones-county-xc
```

### Step 7: Configure Firewall

```bash
# Check if UFW is active
sudo ufw status

# If not active, enable it
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for future SSL)
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

**Note:** Also configure Lightsail firewall in AWS Console:
- Go to Lightsail → Your Instance → Networking
- Add firewall rules for HTTP (80) and HTTPS (443)

### Step 8: Deploy Your Code

#### Deploy Frontend:

```bash
# On your local machine, build the frontend
cd ~/projects/jones-county-xc/frontend
npm install
npm run build

# Copy build to server
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem -r dist/* ubuntu@3.217.16.76:/var/www/jones-county-xc/frontend/
```

#### Deploy Backend:

The backend is deployed automatically via GitHub Actions CI/CD pipeline. On push to `main`, it:
1. Builds the Go binary with `CGO_ENABLED=0`
2. Copies the binary to the server
3. Restarts the systemd service

For manual deployment:

```bash
# On your local machine, build the binary
cd ~/projects/jones-county-xc/backend
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w" -o jones-county-xc .

# Copy binary to server
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem jones-county-xc ubuntu@3.217.16.76:/var/www/jones-county-xc/backend/

# Restart the service
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem ubuntu@3.217.16.76 "sudo systemctl restart jones-county-xc"
```

### Step 9: Restart Services

```bash
# Restart backend service
sudo systemctl restart jones-county-xc

# Restart nginx
sudo systemctl restart nginx

# Check both services
sudo systemctl status jones-county-xc
sudo systemctl status nginx
```

## Verification

1. **Check Backend API:**
   ```bash
   curl http://localhost:8080/api/health
   ```

2. **Check Frontend:**
   Open `http://3.217.16.76` in your browser

3. **Check SQLite Database:**
   ```bash
   sqlite3 /var/www/jones-county-xc/backend/data.db ".tables"
   ```

## Useful Commands

### View Backend Logs:
```bash
sudo journalctl -u jones-county-xc -f
```

### Restart Backend:
```bash
sudo systemctl restart jones-county-xc
```

### Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Check Service Status:
```bash
sudo systemctl status jones-county-xc
sudo systemctl status nginx
```

### Inspect Database:
```bash
sqlite3 /var/www/jones-county-xc/backend/data.db
```

## Troubleshooting

### Backend not starting:
- Check logs: `sudo journalctl -u jones-county-xc -n 50`
- Verify binary exists: `ls -la /var/www/jones-county-xc/backend/jones-county-xc`
- Check if port 8080 is in use: `sudo netstat -tulpn | grep 8080`

### Nginx errors:
- Test config: `sudo nginx -t`
- Check logs: `sudo tail -f /var/log/nginx/error.log`

### SQLite issues:
- Check database file exists: `ls -la /var/www/jones-county-xc/backend/data.db`
- Verify permissions: the `ubuntu` user must own the backend directory
- Test database: `sqlite3 /var/www/jones-county-xc/backend/data.db "SELECT 1;"`

## Security Considerations

1. **Use environment variables for secrets** (consider using a secrets manager)
2. **Set up SSL/HTTPS** (Let's Encrypt with Certbot)
3. **Regular security updates**: `sudo apt update && sudo apt upgrade`
4. **Backup database regularly**: `cp data.db data.db.backup`
5. **Restrict file permissions** on `data.db` to the service user

## Next Steps

- Set up SSL certificate with Let's Encrypt
- Configure automated backups for `data.db`
- Set up monitoring and logging
- Configure CI/CD pipeline
