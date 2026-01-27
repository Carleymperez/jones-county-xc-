# Lightsail Deployment Guide

Complete guide for deploying the Jones County XC application to AWS Lightsail.

## Overview

This guide will help you set up:
- **Go Backend API** - Running on port 8080
- **React Frontend** - Static files served by nginx on port 80
- **MySQL Database** - For data storage

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

### Step 3: Install MySQL

```bash
# Install MySQL Server
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Check status
sudo systemctl status mysql
```

### Step 4: Configure MySQL

```bash
# Login to MySQL as root
sudo mysql

# In MySQL prompt, run:
CREATE DATABASE jones_county_xc;
CREATE USER 'jones_xc_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON jones_county_xc.* TO 'jones_xc_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Important:** Replace `your_secure_password_here` with a strong password!

### Step 5: Configure Nginx

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

### Step 6: Set Up Application Directories

```bash
# Create application directory
sudo mkdir -p /var/www/jones-county-xc/{frontend,backend}

# Set ownership
sudo chown -R ubuntu:ubuntu /var/www/jones-county-xc
```

### Step 7: Create Systemd Service for Go Backend

```bash
sudo nano /etc/systemd/system/jones-county-xc.service
```

Add this configuration:

```ini
[Unit]
Description=Jones County XC Backend API
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/jones-county-xc/backend
Environment="PORT=8080"
Environment="DB_HOST=localhost"
Environment="DB_USER=jones_xc_user"
Environment="DB_PASSWORD=your_secure_password_here"
Environment="DB_NAME=jones_county_xc"
ExecStart=/usr/local/go/bin/go run main.go
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Important:** Update the `DB_PASSWORD` environment variable with your MySQL password!

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

### Step 8: Configure Firewall

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

### Step 9: Deploy Your Code

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

```bash
# On your local machine, copy backend code
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem -r backend/* ubuntu@3.217.16.76:/var/www/jones-county-xc/backend/

# SSH into server
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem ubuntu@3.217.16.76

# On server, install Go dependencies
cd /var/www/jones-county-xc/backend
go mod download
```

### Step 10: Restart Services

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

3. **Check MySQL:**
   ```bash
   sudo mysql -u jones_xc_user -p jones_county_xc
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
sudo systemctl status mysql
```

## Troubleshooting

### Backend not starting:
- Check logs: `sudo journalctl -u jones-county-xc -n 50`
- Verify Go is installed: `go version`
- Check if port 8080 is in use: `sudo netstat -tulpn | grep 8080`

### Nginx errors:
- Test config: `sudo nginx -t`
- Check logs: `sudo tail -f /var/log/nginx/error.log`

### MySQL connection issues:
- Verify MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u jones_xc_user -p`

## Security Considerations

1. **Change default MySQL password**
2. **Use environment variables for secrets** (consider using a secrets manager)
3. **Set up SSL/HTTPS** (Let's Encrypt with Certbot)
4. **Regular security updates**: `sudo apt update && sudo apt upgrade`
5. **Backup database regularly**

## Next Steps

- Set up SSL certificate with Let's Encrypt
- Configure automated backups
- Set up monitoring and logging
- Configure CI/CD pipeline
