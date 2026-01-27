#!/bin/bash

# Deploy Frontend to Lightsail
# Usage: ./scripts/deploy-frontend.sh

set -e

SERVER_IP="3.217.16.76"
SSH_KEY="$HOME/.ssh/LightsailDefaultKey-us-east-1.pem"
REMOTE_PATH="/var/www/jones-county-xc/frontend"

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Deploying to Lightsail..."
scp -i "$SSH_KEY" -r dist/* "ubuntu@${SERVER_IP}:${REMOTE_PATH}/"

echo "Frontend deployed successfully!"
echo "Visit: http://${SERVER_IP}"
