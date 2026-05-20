#!/bin/bash

# Deployment script for production

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install/update dependencies
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
npm run build

# Restart services
sudo systemctl restart complete-ui-backend
sudo systemctl restart complete-ui-frontend

echo "Deployment complete!"