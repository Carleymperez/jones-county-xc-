#!/bin/bash

# Server Setup Script for Lightsail
# Run this script ON THE SERVER (via SSH)
# Usage: Run each section manually or execute on server

set -e

echo "=== Jones County XC Server Setup ==="
echo ""

# Step 1: Update System
echo "Step 1: Updating system..."
sudo apt update
sudo apt upgrade -y

# Step 2: Install Go
echo ""
echo "Step 2: Installing Go..."
if ! command -v go &> /dev/null; then
    wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
    rm go1.21.6.linux-amd64.tar.gz
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    export PATH=$PATH:/usr/local/go/bin
    echo "Go installed successfully"
else
    echo "Go is already installed"
fi
go version

# Step 3: Install SQLite
echo ""
echo "Step 3: Installing SQLite..."
if ! command -v sqlite3 &> /dev/null; then
    sudo apt install sqlite3 -y
    echo "SQLite installed successfully"
else
    echo "SQLite is already installed"
fi
sqlite3 --version

# Step 4: Create application directories
echo ""
echo "Step 4: Creating application directories..."
sudo mkdir -p /var/www/jones-county-xc/{frontend,backend}
sudo chown -R ubuntu:ubuntu /var/www/jones-county-xc
echo "Directories created"

# Step 5: Configure Firewall
echo ""
echo "Step 5: Configuring firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Configure nginx (see deployment guide)"
echo "2. Create systemd service (see deployment guide)"
echo "3. Deploy your code (the SQLite database is created automatically on first run)"
