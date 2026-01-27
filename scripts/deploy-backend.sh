#!/bin/bash

# Deploy Backend to Lightsail
# Usage: ./scripts/deploy-backend.sh

set -e

SERVER_IP="3.217.16.76"
SSH_KEY="$HOME/.ssh/LightsailDefaultKey-us-east-1.pem"
REMOTE_PATH="/var/www/jones-county-xc/backend"

echo "Deploying backend to Lightsail..."
scp -i "$SSH_KEY" -r backend/* "ubuntu@${SERVER_IP}:${REMOTE_PATH}/"

echo "Installing Go dependencies on server..."
ssh -i "$SSH_KEY" "ubuntu@${SERVER_IP}" "cd ${REMOTE_PATH} && go mod download"

echo "Restarting backend service..."
ssh -i "$SSH_KEY" "ubuntu@${SERVER_IP}" "sudo systemctl restart jones-county-xc"

echo "Backend deployed and restarted successfully!"
