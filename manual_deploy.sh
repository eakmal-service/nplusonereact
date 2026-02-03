#!/bin/bash
echo "Starting Manual Deployment..."

# 1. Push to Git
echo "Step 1: Pushing to GitHub..."

# Check if deploy_key exists and use it
if [ -f "./deploy_key" ]; then
    echo "🔑 Found deploy_key, using it for authentication..."
    chmod 600 ./deploy_key
    export GIT_SSH_COMMAND="ssh -i ./deploy_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
fi

git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Git push successful."
else
    echo "❌ Git push failed. Please check your internet connection or git credentials."
    exit 1
fi

# 2. Run Deployment Script
echo "Step 2: Deploying to VPS..."
./scripts/final_fix.exp

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful! Website is live with Production keys."
else
    echo "❌ Deployment failed."
    exit 1
fi
