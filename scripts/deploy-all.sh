#!/bin/bash

# Complete Deployment Script for Jones County XC
# Run this from the project root directory

set -e

SERVER_IP="3.217.16.76"
SSH_KEY="$HOME/.ssh/LightsailDefaultKey-us-east-1.pem"
REMOTE_BACKEND="/var/www/jones-county-xc/backend"
REMOTE_FRONTEND="/var/www/jones-county-xc/frontend"

echo "=== Deploying Jones County XC ==="
echo ""

# Step 1: Deploy Backend
echo "Step 1: Deploying backend..."
scp -i "$SSH_KEY" -r backend/* "ubuntu@${SERVER_IP}:${REMOTE_BACKEND}/"

# Step 2: Install Go dependencies
echo ""
echo "Step 2: Installing Go dependencies..."
ssh -i "$SSH_KEY" "ubuntu@${SERVER_IP}" "cd ${REMOTE_BACKEND} && export PATH=\$PATH:/usr/local/go/bin && go mod download"

# Step 3: Build Frontend
echo ""
echo "Step 3: Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Step 4: Deploy Frontend
echo ""
echo "Step 4: Deploying frontend..."
scp -i "$SSH_KEY" -r frontend/dist/* "ubuntu@${SERVER_IP}:${REMOTE_FRONTEND}/"

# Step 5: Restart Backend Service
echo ""
echo "Step 5: Restarting backend service..."
ssh -i "$SSH_KEY" "ubuntu@${SERVER_IP}" "sudo systemctl restart jones-county-xc && sudo systemctl status jones-county-xc --no-pager | head -10"

# Step 6: Reload Nginx
echo ""
echo "Step 6: Reloading nginx..."
ssh -i "$SSH_KEY" "ubuntu@${SERVER_IP}" "sudo systemctl reload nginx"

echo ""
echo "=== Deployment Complete! ==="
echo "Visit: http://${SERVER_IP}"
echo "API Health: http://${SERVER_IP}/api/health"
